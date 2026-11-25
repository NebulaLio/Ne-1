/* ============================================================================
   Nebula · Guitar Pro Multi-Track Lookahead Web Audio Engine (Classic IIFE)
   ============================================================================ */
(function (global) {
  "use strict";

  const NS = (global.NebulaGP = global.NebulaGP || {});

  function midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  class GPPlayer {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.noiseBuffer = null;
      this.isPlaying = false;
      this.metronomeEnabled = false;
      this.masterVolume = 0.8;
      this.loopRange = { enabled: false, a: 0, b: 3 };
      this.score = null;
      this.onPlayhead = null;
      this.onStop = null;

      this.timerId = null;
      this.uiTimers = [];
      this.activeNodes = new Set();

      this.measureOrder = [];
      this.orderPos = 0;
      this.beatIndex = 0;
      this.nextNoteTime = 0;
    }

    ensureContext() {
      if (!this.ctx) {
        const AC = global.AudioContext || global.webkitAudioContext;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.masterVolume * 0.42;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return this.ctx;
    }

    setMasterVolume(val) {
      this.masterVolume = Math.max(0, Math.min(1, Number(val)));
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(this.masterVolume * 0.42, this.ctx.currentTime, 0.02);
      }
    }

    getNoiseBuffer() {
      const ctx = this.ensureContext();
      if (!this.noiseBuffer) {
        const len = Math.ceil(ctx.sampleRate * 0.06);
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < len; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
        }
        this.noiseBuffer = buf;
      }
      return this.noiseBuffer;
    }

    previewNote(track, midi, tech) {
      if (midi == null) return;
      try {
        const ctx = this.ensureContext();
        const vol = track && track.volume != null ? track.volume : 0.85;
        this.triggerVoice(track.instrument, midi, ctx.currentTime + 0.008, 0.55, vol, tech || {});
      } catch {
        /* ignore */
      }
    }

    play(score, opts) {
      const o = opts || {};
      this.stop(true);
      const ctx = this.ensureContext();
      this.score = score;
      this.onPlayhead = o.onPlayhead || null;
      this.onStop = o.onStop || null;
      this.measureOrder = NS.Model.expandPlaybackOrder(score, this.loopRange);
      if (!this.measureOrder.length) return;

      const startIdx = this.measureOrder.indexOf(o.startMeasure || 0);
      this.orderPos = startIdx >= 0 ? startIdx : 0;
      this.beatIndex = 0;
      this.nextNoteTime = ctx.currentTime + 0.06;
      this.isPlaying = true;
      const self = this;
      this.timerId = global.setInterval(function () { self.scheduler(); }, 25);
    }

    stop(silent) {
      this.isPlaying = false;
      if (this.timerId) {
        global.clearInterval(this.timerId);
        this.timerId = null;
      }
      this.uiTimers.forEach(function (t) { global.clearTimeout(t); });
      this.uiTimers = [];
      this.activeNodes.forEach(function (node) {
        try { if (node.stop) node.stop(); } catch { /* ignore */ }
        try { if (node.disconnect) node.disconnect(); } catch { /* ignore */ }
      });
      this.activeNodes.clear();
      if (!silent) {
        if (this.onPlayhead) this.onPlayhead(null);
        if (this.onStop) this.onStop();
      }
    }

    scheduler() {
      if (!this.isPlaying || !this.ctx || !this.score) return;
      const lookahead = 0.14;
      while (this.isPlaying && this.nextNoteTime < this.ctx.currentTime + lookahead) {
        const mIdx = this.measureOrder[this.orderPos];
        const refMeasure = this.score.tracks[0] && this.score.tracks[0].measures[mIdx];
        if (!refMeasure || !refMeasure.beats.length) {
          this.advanceStep();
          continue;
        }
        const bIdx = Math.min(this.beatIndex, refMeasure.beats.length - 1);
        const stepSec = this.scheduleBeat(mIdx, bIdx, this.nextNoteTime);
        this.nextNoteTime += stepSec;
        this.advanceStep();
      }
    }

    scheduleBeat(mIdx, bIdx, when) {
      const M = NS.Model;
      const bpm = Math.max(30, Math.min(260, Number(this.score.meta.bpm) || 120));
      const secPerQuarter = 60 / bpm;

      const refBeat = this.score.tracks[0] && this.score.tracks[0].measures[mIdx] && this.score.tracks[0].measures[mIdx].beats[bIdx];
      const stepQuarter = M.beatQuarterLength(refBeat || { duration: 4 });
      const stepSec = Math.max(0.05, stepQuarter * secPerQuarter);

      const self = this;
      const delayMs = Math.max(0, Math.round((when - this.ctx.currentTime) * 1000));
      const uiTimer = global.setTimeout(function () {
        if (self.isPlaying && self.onPlayhead) {
          self.onPlayhead({ measureIndex: mIdx, beatIndex: bIdx });
        }
      }, delayMs);
      this.uiTimers.push(uiTimer);
      if (this.uiTimers.length > 200) this.uiTimers = this.uiTimers.slice(-100);

      if (this.metronomeEnabled) {
        this.triggerClick(when, bIdx === 0);
      }

      const anySolo = this.score.tracks.some(function (t) { return t.solo; });
      this.score.tracks.forEach(function (track) {
        if (track.muted || (anySolo && !track.solo)) return;
        const beat = track.measures[mIdx] && track.measures[mIdx].beats[bIdx];
        if (!beat || beat.isRest || !beat.notes.length) return;

        const beatSec = Math.max(0.06, M.beatQuarterLength(beat) * secPerQuarter);
        beat.notes.forEach(function (note, nIdx) {
          const midi = note.midi != null ? note.midi : M.fretToMidi(track, note.string, note.fret);
          if (midi == null) return;
          const strumOffset = track.tuning.length > 0 && beat.notes.length > 1 ? nIdx * 0.012 : 0;
          const duration = note.tie ? beatSec * 1.9 : beatSec * 0.95;
          const vol = track.volume != null ? track.volume : 0.85;
          self.triggerVoice(track.instrument, midi, when + strumOffset, duration, vol, note.tech || {});
        });
      });

      return stepSec;
    }

    advanceStep() {
      const mIdx = this.measureOrder[this.orderPos];
      const refMeasure = this.score.tracks[0] && this.score.tracks[0].measures[mIdx];
      const beatCount = (refMeasure && refMeasure.beats && refMeasure.beats.length) || 1;
      this.beatIndex += 1;
      if (this.beatIndex >= beatCount) {
        this.beatIndex = 0;
        this.orderPos += 1;
        if (this.orderPos >= this.measureOrder.length) {
          if (this.loopRange.enabled) {
            this.measureOrder = NS.Model.expandPlaybackOrder(this.score, this.loopRange);
            this.orderPos = 0;
          } else {
            const self = this;
            const finishMs = Math.max(80, Math.round((this.nextNoteTime - this.ctx.currentTime) * 1000) + 120);
            this.isPlaying = false;
            if (this.timerId) {
              global.clearInterval(this.timerId);
              this.timerId = null;
            }
            const t = global.setTimeout(function () {
              if (self.onPlayhead) self.onPlayhead(null);
              if (self.onStop) self.onStop();
            }, finishMs);
            this.uiTimers.push(t);
          }
        }
      }
    }

    triggerClick(when, accent) {
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(accent ? 1680 : 1080, when);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.exponentialRampToValueAtTime(accent ? 0.34 : 0.18, when + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.045);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(when);
      osc.stop(when + 0.055);
    }

    triggerDeadNote(when, volume) {
      const ctx = this.ctx;
      const src = ctx.createBufferSource();
      src.buffer = this.getNoiseBuffer();
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1250, when);
      filter.Q.value = 1.2;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(Math.max(0.05, volume * 0.45), when);
      src.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      src.start(when);
      const self = this;
      this.activeNodes.add(src);
      src.onended = function () { self.activeNodes.delete(src); };
    }

    triggerVoice(instrument, midi, when, duration, volume, tech) {
      const t = tech || {};
      if (t.deadNote) {
        this.triggerDeadNote(when, volume || 0.85);
        return;
      }
      const ctx = this.ctx;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      const baseMidi = t.harmonic ? midi + 12 : midi;
      const baseFreq = midiToFreq(baseMidi);

      let attack = 0.007;
      let peakFilter = 2600;
      let endFilter = 700;
      let gainScale = 0.34;

      if (t.harmonic) {
        osc.type = "sine";
        peakFilter = 5200;
        endFilter = 3200;
        gainScale = 0.36;
      } else if (instrument === "bass-4" || instrument === "bass-5") {
        osc.type = "triangle";
        peakFilter = 760;
        endFilter = 260;
        gainScale = 0.56;
      } else if (instrument === "piano" || instrument === "piano-bass") {
        osc.type = "triangle";
        attack = 0.01;
        peakFilter = 3200;
        endFilter = 1200;
        gainScale = 0.38;
      } else if (instrument === "guitar-overdrive") {
        osc.type = "sawtooth";
        peakFilter = 2100;
        endFilter = 900;
        gainScale = 0.25;
      } else if (instrument === "guitar-clean") {
        osc.type = "triangle";
        peakFilter = 2800;
        endFilter = 1100;
        gainScale = 0.36;
      } else {
        osc.type = "sawtooth";
        peakFilter = 2400;
        endFilter = 620;
        gainScale = 0.28;
      }

      if (t.palmMute) {
        peakFilter = Math.min(peakFilter, 520);
        endFilter = 240;
        duration = Math.min(duration, 0.16);
      }

      if (t.hammer || t.pull) {
        attack = 0.022;
        gainScale *= 0.85;
      }

      osc.frequency.setValueAtTime(baseFreq, when);
      if (t.bend) {
        osc.frequency.setValueAtTime(baseFreq, when + Math.min(0.04, duration * 0.15));
        osc.frequency.linearRampToValueAtTime(midiToFreq(baseMidi + 2), when + Math.min(0.24, duration * 0.65));
      } else if (t.slideUp) {
        osc.frequency.setValueAtTime(midiToFreq(baseMidi - 2), when);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, when + Math.min(0.14, duration * 0.45));
      } else if (t.slideDown) {
        osc.frequency.setValueAtTime(midiToFreq(baseMidi + 2), when);
        osc.frequency.exponentialRampToValueAtTime(baseFreq, when + Math.min(0.14, duration * 0.45));
      }

      let lfo = null;
      if (t.vibrato) {
        lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(5.8, when);
        lfoGain.gain.setValueAtTime(baseFreq * 0.015, when);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(when);
        lfo.stop(when + duration + 0.08);
        this.activeNodes.add(lfo);
      }

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(peakFilter, when);
      filter.frequency.exponentialRampToValueAtTime(Math.max(180, endFilter), when + Math.min(duration, 0.45));

      const peakGain = Math.max(0.01, (volume || 0.85) * gainScale);
      gain.gain.setValueAtTime(0.0001, when);
      gain.gain.linearRampToValueAtTime(peakGain, when + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, when + Math.max(0.12, duration));

      if (instrument === "guitar-overdrive" && !t.harmonic) {
        const shaper = ctx.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          curve[i] = Math.tanh(x * 3.8);
        }
        shaper.curve = curve;
        osc.connect(shaper);
        shaper.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);
      } else {
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.master);
      }

      osc.start(when);
      osc.stop(when + Math.max(0.14, duration) + 0.04);
      const self = this;
      this.activeNodes.add(osc);
      osc.onended = function () {
        self.activeNodes.delete(osc);
        if (lfo) self.activeNodes.delete(lfo);
        try {
          osc.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch { /* ignore */ }
      };
    }
  }

  NS.GPPlayer = GPPlayer;
})(window);

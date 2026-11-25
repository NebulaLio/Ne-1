/* ============================================================================
   Nebula · Guitar Pro Multi-Track Score Data Model & Export Converters
   Classic script (works on both file:// and https:// without ES module CORS)
   ============================================================================ */
(function (global) {
  "use strict";

  const NS = (global.NebulaGP = global.NebulaGP || {});

  const INSTRUMENTS = {
    "guitar-acoustic": {
      id: "guitar-acoustic",
      label: "木吉他 (6弦)",
      type: "fretted",
      clef: "treble",
      octaveShift: 1,
      defaultTuning: "guitar-standard",
      midiProgram: 25,
      color: "#818cf8"
    },
    "guitar-clean": {
      id: "guitar-clean",
      label: "電吉他 Clean (6弦)",
      type: "fretted",
      clef: "treble",
      octaveShift: 1,
      defaultTuning: "guitar-standard",
      midiProgram: 27,
      color: "#60a5fa"
    },
    "guitar-overdrive": {
      id: "guitar-overdrive",
      label: "電吉他 Overdrive (6弦)",
      type: "fretted",
      clef: "treble",
      octaveShift: 1,
      defaultTuning: "guitar-standard",
      midiProgram: 29,
      color: "#fb7185"
    },
    "bass-4": {
      id: "bass-4",
      label: "電貝斯 (4弦)",
      type: "fretted",
      clef: "bass",
      octaveShift: 1,
      defaultTuning: "bass-4-standard",
      midiProgram: 33,
      color: "#f59e0b"
    },
    "bass-5": {
      id: "bass-5",
      label: "電貝斯 (5弦)",
      type: "fretted",
      clef: "bass",
      octaveShift: 1,
      defaultTuning: "bass-5-standard",
      midiProgram: 33,
      color: "#fb923c"
    },
    "piano": {
      id: "piano",
      label: "鋼琴 (五線譜)",
      type: "keyboard",
      clef: "treble",
      octaveShift: 0,
      defaultTuning: "none",
      midiProgram: 0,
      color: "#34d399"
    },
    "piano-bass": {
      id: "piano-bass",
      label: "鋼琴左手 / 低音譜表",
      type: "keyboard",
      clef: "bass",
      octaveShift: 0,
      defaultTuning: "none",
      midiProgram: 0,
      color: "#2dd4bf"
    }
  };

  const TUNING_PRESETS = {
    "guitar-standard": { label: "標準 E (E A D G B E)", strings: [64, 59, 55, 50, 45, 40] },
    "guitar-drop-d":   { label: "Drop D (D A D G B E)", strings: [64, 59, 55, 50, 45, 38] },
    "guitar-eb":       { label: "降半音 Eb (Eb Ab Db Gb Bb Eb)", strings: [63, 58, 54, 49, 44, 39] },
    "guitar-open-d":   { label: "開放 D (D A D F# A D)", strings: [62, 57, 54, 50, 45, 38] },
    "guitar-open-g":   { label: "開放 G (D G D G B D)", strings: [62, 59, 55, 50, 43, 38] },
    "guitar-dadgad":   { label: "DADGAD (D A D G A D)", strings: [62, 57, 55, 50, 45, 38] },
    "bass-4-standard": { label: "貝斯 4 弦 (E A D G)", strings: [43, 38, 33, 28] },
    "bass-4-drop-d":   { label: "貝斯 Drop D (D A D G)", strings: [43, 38, 33, 26] },
    "bass-5-standard": { label: "貝斯 5 弦 (B E A D G)", strings: [43, 38, 33, 28, 23] }
  };

  const DURATIONS = [
    { value: 1,  label: "全音符", short: "1/1",  symbol: "𝅝", xmlType: "whole",     quarterFactor: 4 },
    { value: 2,  label: "二分",   short: "1/2",  symbol: "𝅗𝅥", xmlType: "half",      quarterFactor: 2 },
    { value: 4,  label: "四分",   short: "1/4",  symbol: "♩",  xmlType: "quarter",   quarterFactor: 1 },
    { value: 8,  label: "八分",   short: "1/8",  symbol: "♪",  xmlType: "eighth",    quarterFactor: 0.5 },
    { value: 16, label: "十六分", short: "1/16", symbol: "♬",  xmlType: "16th",      quarterFactor: 0.25 }
  ];

  const TECHNIQUES = [
    { id: "hammer",    label: "擊弦", short: "H",    key: "h", desc: "Hammer-on 擊弦" },
    { id: "pull",      label: "勾弦", short: "P",    key: "p", desc: "Pull-off 勾弦" },
    { id: "slideUp",   label: "上滑", short: "/",    key: "/", desc: "Slide Up 上滑音" },
    { id: "slideDown", label: "下滑", short: "\\",   key: "\\", desc: "Slide Down 下滑音" },
    { id: "bend",      label: "推弦", short: "Bend", key: "b", desc: "Full Bend 全音推弦" },
    { id: "harmonic",  label: "泛音", short: "◇",    key: "n", desc: "Natural Harmonic 自然泛音" },
    { id: "palmMute",  label: "護弦", short: "P.M.", key: "m", desc: "Palm Mute 右手悶音" },
    { id: "deadNote",  label: "切音", short: "X",    key: "x", desc: "Dead Note 死音" },
    { id: "vibrato",   label: "揉弦", short: "~",    key: "v", desc: "Vibrato 揉弦" },
    { id: "tap",       label: "點弦", short: "T",    key: "k", desc: "Tapping 右手點弦" }
  ];

  const KEY_SIGNATURES = {
    C: 0, G: 1, D: 2, A: 3, E: 4, B: 5, "F#": 6,
    F: -1, Bb: -2, Eb: -3, Ab: -4, Db: -5
  };

  const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const NOTE_NAMES_FLAT  = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  const DIATONIC_SHARP   = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
  const ALTER_SHARP      = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
  const DIATONIC_FLAT    = [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6];
  const ALTER_FLAT       = [0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1, 0];
  const DIATONIC_TO_PC   = [0, 2, 4, 5, 7, 9, 11];

  function uid(prefix) {
    const p = prefix || "id";
    return p + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 7);
  }

  function midiToName(midi, preferFlats) {
    if (midi == null || !Number.isFinite(midi)) return "-";
    const pc = ((midi % 12) + 12) % 12;
    const oct = Math.floor(midi / 12) - 1;
    return (preferFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP)[pc] + String(oct);
  }

  function midiToStaffPosition(midi, clef, octaveShift, preferFlats) {
    const writtenMidi = midi + (octaveShift || 0) * 12;
    const oct = Math.floor(writtenMidi / 12) - 1;
    const pc = ((writtenMidi % 12) + 12) % 12;
    const diatonicInOct = preferFlats ? DIATONIC_FLAT[pc] : DIATONIC_SHARP[pc];
    const alter = preferFlats ? ALTER_FLAT[pc] : ALTER_SHARP[pc];
    const diatonicStep = oct * 7 + diatonicInOct;
    const baseStep = clef === "bass" ? 18 : 30;
    return {
      step: diatonicStep - baseStep,
      accidental: alter === 1 ? "♯" : alter === -1 ? "♭" : "",
      alter: alter,
      writtenMidi: writtenMidi
    };
  }

  function staffStepToMidi(stepFromBottom, clef, octaveShift) {
    const baseStep = clef === "bass" ? 18 : 30;
    const totalDiatonic = baseStep + stepFromBottom;
    const oct = Math.floor(totalDiatonic / 7);
    const idx = ((totalDiatonic % 7) + 7) % 7;
    const writtenMidi = (oct + 1) * 12 + DIATONIC_TO_PC[idx];
    return writtenMidi - (octaveShift || 0) * 12;
  }

  function fretToMidi(track, stringIndex, fret) {
    if (!track || !Array.isArray(track.tuning) || stringIndex == null || stringIndex < 0 || stringIndex >= track.tuning.length) {
      return null;
    }
    return track.tuning[stringIndex] + (Number(track.capo) || 0) + Number(fret);
  }

  function findBestStringFret(track, targetMidi, preferredString) {
    if (!track || !Array.isArray(track.tuning) || !track.tuning.length) return null;
    const capo = Number(track.capo) || 0;
    if (preferredString != null && preferredString >= 0 && preferredString < track.tuning.length) {
      const f = targetMidi - (track.tuning[preferredString] + capo);
      if (f >= 0 && f <= 24) return { stringIndex: preferredString, fret: f };
    }
    let best = null;
    track.tuning.forEach(function (openMidi, sIdx) {
      const fret = targetMidi - (openMidi + capo);
      if (fret >= 0 && fret <= 24) {
        if (!best || fret < best.fret) {
          best = { stringIndex: sIdx, fret: fret };
        }
      }
    });
    return best;
  }

  function beatQuarterLength(beat) {
    const base = 4 / (Number(beat && beat.duration) || 4);
    const dotted = beat && beat.dotted ? 1.5 : 1;
    const tuplet = beat && beat.tuplet === 3 ? (2 / 3) : 1;
    return base * dotted * tuplet;
  }

  function createBeat(duration) {
    return {
      duration: duration || 4,
      dotted: false,
      tuplet: null,
      isRest: false,
      notes: []
    };
  }

  function createMeasure(beatsPerMeasure, beatUnit) {
    const count = Math.max(1, Number(beatsPerMeasure) || 4);
    const dur = Number(beatUnit) || 4;
    const beats = [];
    for (let i = 0; i < count; i++) beats.push(createBeat(dur));
    return {
      beats: beats,
      repeatStart: false,
      repeatEnd: false
    };
  }

  function createTrack(opts) {
    const o = opts || {};
    const instId = o.instrument || "guitar-acoustic";
    const spec = INSTRUMENTS[instId] || INSTRUMENTS["guitar-acoustic"];
    const preset = TUNING_PRESETS[spec.defaultTuning];
    const isFretted = spec.type === "fretted";
    const ts = o.timeSignature || [4, 4];
    const mCount = o.measureCount || 4;
    const track = {
      id: uid("trk"),
      name: o.name || spec.label,
      instrument: spec.id,
      color: spec.color,
      clef: spec.clef,
      octaveShift: spec.octaveShift,
      showStaff: true,
      showTab: isFretted,
      tuningPreset: isFretted ? spec.defaultTuning : "none",
      tuning: preset ? preset.strings.slice() : [],
      capo: 0,
      volume: 0.85,
      muted: false,
      solo: false,
      measures: []
    };
    for (let m = 0; m < mCount; m++) {
      track.measures.push(createMeasure(ts[0], ts[1]));
    }
    return track;
  }

  function createDemoScore() {
    const score = {
      id: uid("gp"),
      version: 2,
      meta: {
        title: "Nebula 多軌示範譜例 (Am - F - C - G)",
        bpm: 112,
        timeSignature: [4, 4],
        keySignature: "C",
        updatedAt: Date.now()
      },
      tracks: [
        createTrack({ name: "主奏木吉他", instrument: "guitar-acoustic", measureCount: 4, timeSignature: [4, 4] }),
        createTrack({ name: "電貝斯", instrument: "bass-4", measureCount: 4, timeSignature: [4, 4] }),
        createTrack({ name: "鋼琴和聲", instrument: "piano", measureCount: 4, timeSignature: [4, 4] })
      ]
    };

    const g = score.tracks[0];
    const setG = function (m, b, s, f, dur, tech) {
      const beat = g.measures[m].beats[b];
      beat.duration = dur || 4;
      beat.notes.push({ string: s, fret: f, midi: fretToMidi(g, s, f), tie: false, tech: tech || {} });
    };
    setG(0, 0, 4, 0, 4);
    setG(0, 1, 3, 2, 4);
    setG(0, 2, 2, 2, 4, { hammer: true });
    setG(0, 3, 1, 1, 4);
    setG(1, 0, 3, 3, 4);
    setG(1, 1, 2, 2, 4);
    setG(1, 2, 1, 1, 4, { slideUp: true });
    setG(1, 3, 0, 0, 4);
    setG(2, 0, 4, 3, 4);
    setG(2, 1, 3, 2, 4);
    setG(2, 2, 2, 0, 4);
    setG(2, 3, 1, 1, 4, { vibrato: true });
    setG(3, 0, 5, 3, 4);
    setG(3, 1, 3, 0, 4);
    setG(3, 2, 2, 0, 4);
    setG(3, 3, 0, 12, 4, { harmonic: true });
    g.measures[0].repeatStart = true;
    g.measures[3].repeatEnd = true;

    const bass = score.tracks[1];
    const bassRoots = [[2, 0], [3, 1], [2, 3], [3, 3]];
    bassRoots.forEach(function (pair, m) {
      const s = pair[0], f = pair[1];
      bass.measures[m].beats[0].notes.push({ string: s, fret: f, midi: fretToMidi(bass, s, f), tie: false, tech: {} });
      bass.measures[m].beats[2].notes.push({ string: s, fret: f, midi: fretToMidi(bass, s, f), tie: false, tech: { palmMute: true } });
    });

    const piano = score.tracks[2];
    const chords = [
      [57, 60, 64],
      [53, 57, 60],
      [60, 64, 67],
      [55, 59, 62]
    ];
    chords.forEach(function (midis, m) {
      piano.measures[m].beats[0].duration = 2;
      midis.forEach(function (midi) {
        piano.measures[m].beats[0].notes.push({ string: null, fret: null, midi: midi, tie: false, tech: {} });
      });
    });

    return score;
  }

  function cloneScore(score) {
    return JSON.parse(JSON.stringify(score));
  }

  function ensureMeasureCount(score) {
    const maxM = Math.max.apply(null, [1].concat(score.tracks.map(function (t) { return t.measures.length; })));
    const ts = score.meta.timeSignature || [4, 4];
    score.tracks.forEach(function (t) {
      while (t.measures.length < maxM) t.measures.push(createMeasure(ts[0], ts[1]));
    });
    return maxM;
  }

  function expandPlaybackOrder(score, loopRange) {
    const count = ensureMeasureCount(score);
    if (loopRange && loopRange.enabled) {
      const start = Math.max(0, Math.min(count - 1, loopRange.a));
      const end = Math.max(start, Math.min(count - 1, loopRange.b));
      const arr = [];
      for (let m = start; m <= end; m++) arr.push(m);
      return arr;
    }
    const ref = score.tracks[0];
    const order = [];
    let repeatAnchor = 0;
    const repeatedSet = new Set();
    let m = 0;
    while (m < count && order.length < count * 3) {
      const measure = ref && ref.measures[m];
      if (measure && measure.repeatStart) repeatAnchor = m;
      order.push(m);
      if (measure && measure.repeatEnd && !repeatedSet.has(m)) {
        repeatedSet.add(m);
        m = repeatAnchor;
      } else {
        m++;
      }
    }
    return order;
  }

  function encodeVarLen(value) {
    let buffer = value & 0x7f;
    const bytes = [];
    while ((value >>= 7) > 0) {
      buffer <<= 8;
      buffer |= (value & 0x7f) | 0x80;
    }
    while (true) {
      bytes.push(buffer & 0xff);
      if (buffer & 0x80) buffer >>= 8;
      else break;
    }
    return bytes;
  }

  function exportScoreToMidiBytes(score) {
    const tpq = 480;
    const bpm = Number(score.meta.bpm) || 120;
    const order = expandPlaybackOrder(score, null);

    const midiTracks = score.tracks.map(function (track, tIdx) {
      const events = [];
      let tick = 0;
      const channel = tIdx % 16 === 9 ? 10 : tIdx % 16;
      const spec = INSTRUMENTS[track.instrument] || INSTRUMENTS["guitar-acoustic"];

      order.forEach(function (mIdx) {
        const measure = track.measures[mIdx];
        if (!measure) return;
        measure.beats.forEach(function (beat) {
          const durTicks = Math.max(60, Math.round(beatQuarterLength(beat) * tpq));
          if (!beat.isRest) {
            beat.notes.forEach(function (n) {
              if (n.tech && n.tech.deadNote) return;
              const midi = n.midi != null ? n.midi : fretToMidi(track, n.string, n.fret);
              if (midi == null) return;
              const actualMidi = n.tech && n.tech.harmonic ? midi + 12 : midi;
              const vol = track.volume != null ? track.volume : 0.85;
              const vel = Math.round(Math.max(20, Math.min(127, vol * (n.tech && n.tech.palmMute ? 68 : 100))));
              const len = n.tech && n.tech.palmMute ? Math.round(durTicks * 0.45) : durTicks;
              events.push({ startTick: tick, durationTicks: len, midi: actualMidi, velocity: vel });
            });
          }
          tick += durTicks;
        });
      });

      const chunk = [];
      const safeName = String(track.name || ("Track " + (tIdx + 1))).replace(/[^\x20-\x7e]/g, "");
      if (safeName) {
        const nameBytes = Array.from(safeName).map(function (c) { return c.charCodeAt(0) & 0x7f; });
        chunk.push(0x00, 0xff, 0x03, nameBytes.length);
        nameBytes.forEach(function (b) { chunk.push(b); });
      }
      chunk.push(0x00, 0xc0 | channel, (spec.midiProgram || 0) & 0x7f);

      const rawMsgs = [];
      events.forEach(function (ev) {
        rawMsgs.push({ tick: ev.startTick, type: 0x90 | channel, midi: ev.midi, vel: ev.velocity });
        rawMsgs.push({ tick: ev.startTick + Math.max(40, ev.durationTicks), type: 0x80 | channel, midi: ev.midi, vel: 0 });
      });
      rawMsgs.sort(function (a, b) { return a.tick - b.tick || a.type - b.type; });

      let lastTick = 0;
      rawMsgs.forEach(function (msg) {
        const delta = Math.max(0, msg.tick - lastTick);
        lastTick = msg.tick;
        encodeVarLen(delta).forEach(function (b) { chunk.push(b); });
        chunk.push(msg.type, msg.midi & 0x7f, msg.vel & 0x7f);
      });
      chunk.push(0x00, 0xff, 0x2f, 0x00);
      return chunk;
    });

    const mpq = Math.round(60000000 / bpm);
    const tempoTrack = [
      0x00, 0xff, 0x51, 0x03,
      (mpq >> 16) & 0xff, (mpq >> 8) & 0xff, mpq & 0xff,
      0x00, 0xff, 0x2f, 0x00
    ];
    const allChunks = [tempoTrack].concat(midiTracks);
    const out = [
      0x4d, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06,
      0x00, 0x01,
      (allChunks.length >> 8) & 0xff, allChunks.length & 0xff,
      (tpq >> 8) & 0xff, tpq & 0xff
    ];
    allChunks.forEach(function (c) {
      const len = c.length;
      out.push(
        0x4d, 0x54, 0x72, 0x6b,
        (len >> 24) & 0xff, (len >> 16) & 0xff, (len >> 8) & 0xff, len & 0xff
      );
      c.forEach(function (b) { out.push(b); });
    });
    return new Uint8Array(out);
  }

  function xmlEscape(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function midiToXmlPitchObj(midi, preferFlats) {
    const pc = ((midi % 12) + 12) % 12;
    const oct = Math.floor(midi / 12) - 1;
    const stepsSharp = ["C", "C", "D", "D", "E", "F", "F", "G", "G", "A", "A", "B"];
    const stepsFlat  = ["C", "D", "D", "E", "E", "F", "G", "G", "A", "A", "B", "B"];
    return {
      step: preferFlats ? stepsFlat[pc] : stepsSharp[pc],
      alter: preferFlats ? ALTER_FLAT[pc] : ALTER_SHARP[pc],
      octave: oct
    };
  }

  function exportScoreToMusicXml(score) {
    const ts = score.meta.timeSignature || [4, 4];
    const beatsNum = ts[0], beatType = ts[1];
    const fifths = KEY_SIGNATURES[score.meta.keySignature || "C"] || 0;
    const preferFlats = fifths < 0;
    const divisions = 12;

    const partListXml = score.tracks.map(function (t, i) {
      return '<score-part id="P' + (i + 1) + '"><part-name>' + xmlEscape(t.name) + '</part-name></score-part>';
    }).join("\n    ");

    const partsXml = score.tracks.map(function (track, tIdx) {
      const isFretted = track.tuning && track.tuning.length > 0;
      let tuningXml = "";
      if (isFretted) {
        const linesXml = track.tuning.slice().reverse().map(function (openMidi, lineIdx) {
          const p = midiToXmlPitchObj(openMidi, preferFlats);
          return '<staff-tuning line="' + (lineIdx + 1) + '"><tuning-step>' + p.step + '</tuning-step>' +
            (p.alter ? '<tuning-alter>' + p.alter + '</tuning-alter>' : '') +
            '<tuning-octave>' + p.octave + '</tuning-octave></staff-tuning>';
        }).join("");
        tuningXml = '<staff-details><staff-lines>' + track.tuning.length + '</staff-lines>' + linesXml +
          (track.capo ? '<capo>' + track.capo + '</capo>' : '') + '</staff-details>';
      }

      const measuresXml = track.measures.map(function (measure, mIdx) {
        let attrs = "";
        if (mIdx === 0) {
          const clefXml = isFretted && track.showTab && !track.showStaff
            ? '<sign>TAB</sign><line>5</line>'
            : track.clef === "bass" ? '<sign>F</sign><line>4</line>' : '<sign>G</sign><line>2</line>';
          attrs = '<attributes><divisions>' + divisions + '</divisions><key><fifths>' + fifths + '</fifths></key>' +
            '<time><beats>' + beatsNum + '</beats><beat-type>' + beatType + '</beat-type></time>' +
            '<clef>' + clefXml + '</clef>' + tuningXml + '</attributes>' +
            '<direction placement="above"><sound tempo="' + (Number(score.meta.bpm) || 120) + '"/></direction>';
        }
        const barLeft = measure.repeatStart ? '<barline location="left"><bar-style>heavy-light</bar-style><repeat direction="forward"/></barline>' : '';
        const barRight = measure.repeatEnd ? '<barline location="right"><bar-style>light-heavy</bar-style><repeat direction="backward"/></barline>' : '';

        const notesXml = measure.beats.map(function (beat) {
          const durObj = DURATIONS.find(function (d) { return d.value === beat.duration; }) || DURATIONS[2];
          const durVal = Math.max(1, Math.round(beatQuarterLength(beat) * divisions));
          const dotXml = beat.dotted ? '<dot/>' : '';
          const timeModXml = beat.tuplet === 3 ? '<time-modification><actual-notes>3</actual-notes><normal-notes>2</normal-notes></time-modification>' : '';

          if (beat.isRest || !beat.notes.length) {
            return '<note><rest/><duration>' + durVal + '</duration><type>' + durObj.xmlType + '</type>' + dotXml + timeModXml + '</note>';
          }
          return beat.notes.map(function (n, nIdx) {
            const midi = n.midi != null ? n.midi : (fretToMidi(track, n.string, n.fret) || 60);
            const p = midiToXmlPitchObj(midi, preferFlats);
            const tech = n.tech || {};
            const techParts = [];
            if (isFretted && n.string != null && n.fret != null) {
              techParts.push('<string>' + (n.string + 1) + '</string><fret>' + n.fret + '</fret>');
            }
            if (tech.hammer) techParts.push('<hammer-on type="start">H</hammer-on>');
            if (tech.pull) techParts.push('<pull-off type="start">P</pull-off>');
            if (tech.bend) techParts.push('<bend><bend-alter>2</bend-alter></bend>');
            if (tech.harmonic) techParts.push('<harmonic><natural/></harmonic>');
            if (tech.tap) techParts.push('<tap/>');
            const notations = [];
            if (n.tie) notations.push('<tied type="start"/>');
            if (tech.slideUp || tech.slideDown) notations.push('<slide type="start"/>');
            if (techParts.length) notations.push('<technical>' + techParts.join('') + '</technical>');

            return '<note>' + (nIdx > 0 ? '<chord/>' : '') +
              '<pitch><step>' + p.step + '</step>' + (p.alter ? '<alter>' + p.alter + '</alter>' : '') +
              '<octave>' + p.octave + '</octave></pitch>' +
              '<duration>' + durVal + '</duration>' +
              (n.tie ? '<tie type="start"/>' : '') +
              '<type>' + durObj.xmlType + '</type>' + dotXml + timeModXml +
              (tech.deadNote ? '<notehead>x</notehead>' : '') +
              (notations.length ? '<notations>' + notations.join('') + '</notations>' : '') +
              '</note>';
          }).join('');
        }).join('');

        return '<measure number="' + (mIdx + 1) + '">' + barLeft + attrs + notesXml + barRight + '</measure>';
      }).join('');

      return '<part id="P' + (tIdx + 1) + '">' + measuresXml + '</part>';
    }).join('');

    return '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">\n' +
      '<score-partwise version="3.1">\n' +
      '  <work><work-title>' + xmlEscape(score.meta.title || "Nebula Score") + '</work-title></work>\n' +
      '  <part-list>\n    ' + partListXml + '\n  </part-list>\n' +
      '  ' + partsXml + '\n' +
      '</score-partwise>';
  }

  NS.Model = {
    INSTRUMENTS: INSTRUMENTS,
    TUNING_PRESETS: TUNING_PRESETS,
    DURATIONS: DURATIONS,
    TECHNIQUES: TECHNIQUES,
    KEY_SIGNATURES: KEY_SIGNATURES,
    uid: uid,
    midiToName: midiToName,
    midiToStaffPosition: midiToStaffPosition,
    staffStepToMidi: staffStepToMidi,
    fretToMidi: fretToMidi,
    findBestStringFret: findBestStringFret,
    beatQuarterLength: beatQuarterLength,
    createBeat: createBeat,
    createMeasure: createMeasure,
    createTrack: createTrack,
    createDemoScore: createDemoScore,
    cloneScore: cloneScore,
    ensureMeasureCount: ensureMeasureCount,
    expandPlaybackOrder: expandPlaybackOrder,
    exportScoreToMidiBytes: exportScoreToMidiBytes,
    exportScoreToMusicXml: exportScoreToMusicXml
  };
})(window);

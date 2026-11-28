/* ============================================================================
   Nebula · Guitar Pro Multi-Track Studio Controller (Classic IIFE)
   Mounts into #gpStudioRoot inside <section id="scores">
   ============================================================================ */
(function (global) {
  "use strict";

  const NS = (global.NebulaGP = global.NebulaGP || {});

  function toast(msg, tone) {
    if (typeof global.showToast === "function") global.showToast(msg, tone || "info");
    else console.log("[GP Studio]", msg);
  }

  function downloadBlob(filename, data, mime) {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    global.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  class GPStudioController {
    constructor(rootEl) {
      const M = NS.Model;
      const S = NS.Storage;
      this.root = rootEl;
      this.player = new NS.GPPlayer();
      this.score = S.loadDraftLocal() || M.createDemoScore();
      M.ensureMeasureCount(this.score);

      this.cursor = { trackIndex: 0, measureIndex: 0, beatIndex: 0, stringIndex: 0 };
      this.playhead = null;
      this.undoStack = [];
      this.redoStack = [];
      this.digitBuffer = "";
      this.digitTimer = null;

      this.buildShell();
      const self = this;
      this.renderer = new NS.GPScoreRenderer(this.svgEl, {
        onSelectSlot: function (slot) { self.selectSlot(slot); },
        onStaffClick: function (info) { self.handleStaffClick(info); },
        onNoteDrag: function (info) { self.handleNoteDrag(info); },
        onMeasureClick: function (mIdx) { self.handleMeasureHeaderClick(mIdx); }
      });

      this.bindEvents();
      this.pushUndo();
      this.renderAll();
    }

    buildShell() {
      const M = NS.Model;
      const keyOpts = Object.keys(M.KEY_SIGNATURES).map(function (k) {
        return '<option value="' + k + '">' + k + '</option>';
      }).join("");
      const durBtns = M.DURATIONS.map(function (d) {
        return '<button type="button" class="gp-btn" data-gp-dur="' + d.value + '" title="' + d.label + '">' +
          '<span>' + d.symbol + '</span><small>' + d.short + '</small></button>';
      }).join("");
      const techBtns = M.TECHNIQUES.map(function (t) {
        return '<button type="button" class="gp-btn" data-gp-tech="' + t.id + '" title="' + t.desc + ' (' + t.key.toUpperCase() + ')">' +
          '<span>' + t.short + '</span><small>' + t.label + '</small></button>';
      }).join("");
      const instOpts = Object.keys(M.INSTRUMENTS).map(function (k) {
        const inst = M.INSTRUMENTS[k];
        return '<option value="' + inst.id + '">' + inst.label + '</option>';
      }).join("");
      const tuneOpts = Object.keys(M.TUNING_PRESETS).map(function (k) {
        return '<option value="' + k + '">' + M.TUNING_PRESETS[k].label + '</option>';
      }).join("");

      this.root.innerHTML =
        '<div class="gp-workspace" id="gpWorkspace">' +
          '<header class="gp-transport">' +
            '<div class="gp-transport-row">' +
              '<input id="gpTitleInput" class="gp-title-input" type="text" placeholder="譜例標題..." aria-label="譜例標題" />' +
              '<button id="gpPlayBtn" class="gp-btn primary" type="button" title="播放 / 暫停 (Space)">▶ 播放</button>' +
              '<button id="gpStopBtn" class="gp-btn" type="button" title="停止">■</button>' +
              '<span class="gp-sep"></span>' +
              '<label class="gp-inline-field">BPM <input id="gpBpmInput" type="number" min="30" max="260" step="1" value="112" /></label>' +
              '<label class="gp-inline-field">拍號 <select id="gpTimeSigSelect">' +
                '<option value="4/4">4/4</option><option value="3/4">3/4</option><option value="2/4">2/4</option><option value="6/8">6/8</option><option value="5/4">5/4</option>' +
              '</select></label>' +
              '<label class="gp-inline-field">調號 <select id="gpKeySigSelect">' + keyOpts + '</select></label>' +
              '<button id="gpMetroBtn" class="gp-btn" type="button" title="節拍器開關">♩ 節拍器</button>' +
              '<label class="gp-inline-field" title="主音量">🔊 <input id="gpMasterVol" type="range" min="0" max="100" value="80" /></label>' +
            '</div>' +
            '<div class="gp-transport-row">' +
              '<label class="gp-inline-field">AB循環 <select id="gpLoopA" title="起始小節 A"></select><span>–</span><select id="gpLoopB" title="結束小節 B"></select></label>' +
              '<button id="gpLoopToggleBtn" class="gp-btn" type="button" title="啟用 / 關閉 AB 段循環">↻ 循環</button>' +
              '<span class="gp-sep"></span>' +
              '<button id="gpUndoBtn" class="gp-btn" type="button" title="撤銷 (Ctrl+Z)">↶</button>' +
              '<button id="gpRedoBtn" class="gp-btn" type="button" title="重做 (Ctrl+Y)">↷</button>' +
              '<button id="gpAddMeasureBtn" class="gp-btn" type="button">+ 小節</button>' +
              '<button id="gpDelMeasureBtn" class="gp-btn" type="button">- 小節</button>' +
              '<span class="gp-sep"></span>' +
              '<button id="gpSaveLocalBtn" class="gp-btn" type="button" title="儲存至本機譜庫">💾 本機儲存</button>' +
              '<button id="gpSaveCloudBtn" class="gp-btn" type="button" title="同步至 Firebase 雲端">☁ 雲端同步</button>' +
              '<button id="gpOpenLibBtn" class="gp-btn" type="button">📂 譜庫</button>' +
              '<button id="gpExportMidiBtn" class="gp-btn" type="button">MIDI</button>' +
              '<button id="gpExportXmlBtn" class="gp-btn" type="button">MusicXML</button>' +
              '<button id="gpExportPdfBtn" class="gp-btn" type="button">PDF</button>' +
            '</div>' +
          '</header>' +

          '<aside class="gp-palette">' +
            '<div>' +
              '<h4 class="gp-section-title">時值與節奏</h4>' +
              '<div class="gp-tool-grid cols-3" id="gpDurGrid">' + durBtns + '</div>' +
              '<div class="gp-tool-grid" style="margin-top:6px;">' +
                '<button type="button" class="gp-btn" id="gpDotBtn" title="附點 (.)"><span>♩.</span><small>附點</small></button>' +
                '<button type="button" class="gp-btn" id="gpTripletBtn" title="三連音"><span>³</span><small>三連音</small></button>' +
                '<button type="button" class="gp-btn" id="gpTieBtn" title="連音線 Tie (T)"><span>⌒</span><small>連音線</small></button>' +
                '<button type="button" class="gp-btn" id="gpRestBtn" title="休止符 (R)"><span>𝄽</span><small>休止符</small></button>' +
              '</div>' +
            '</div>' +
            '<div>' +
              '<h4 class="gp-section-title">小節與反覆</h4>' +
              '<div class="gp-tool-grid">' +
                '<button type="button" class="gp-btn" id="gpRepeatStartBtn"><span>𝄆</span><small>反覆起點</small></button>' +
                '<button type="button" class="gp-btn" id="gpRepeatEndBtn"><span>𝄇</span><small>反覆終點</small></button>' +
                '<button type="button" class="gp-btn" id="gpAddBeatBtn"><span>+ 拍</span><small>插入拍位</small></button>' +
                '<button type="button" class="gp-btn" id="gpDelBeatBtn"><span>- 拍</span><small>刪除拍位</small></button>' +
              '</div>' +
            '</div>' +
            '<div>' +
              '<h4 class="gp-section-title">吉他技法</h4>' +
              '<div class="gp-tool-grid" id="gpTechGrid">' + techBtns + '</div>' +
            '</div>' +
            '<div class="gp-shortcut-box">' +
              '<strong>快速輸入提示</strong><br/>' +
              '• 點六線譜格按 <kbd>0</kbd>–<kbd>9</kbd> 輸入品格（支援 10–24）<br/>' +
              '• 點五線譜直接落音，拖曳音符上下改音高<br/>' +
              '• <kbd>←↑↓→</kbd> 移游標 · <kbd>Del</kbd> 刪音 · <kbd>Space</kbd> 播放' +
            '</div>' +
          '</aside>' +

          '<main class="gp-viewport" id="gpViewport" tabindex="0" aria-label="多軌譜面編輯區">' +
            '<svg id="gpScoreSvg" class="gp-score-svg"></svg>' +
          '</main>' +

          '<aside class="gp-inspector">' +
            '<div>' +
              '<div class="gp-section-title">' +
                '<span>音軌列表 (<span id="gpTrackCount">0</span>)</span>' +
                '<button id="gpAddTrackBtn" class="gp-btn xs primary" type="button">+ 新增音軌</button>' +
              '</div>' +
              '<ul id="gpTrackList" class="gp-track-list"></ul>' +
            '</div>' +

            '<div class="gp-prop-group" id="gpTrackInspector">' +
              '<div class="gp-section-title" style="margin-bottom:2px;">' +
                '<span>目前音軌屬性</span>' +
                '<button id="gpDeleteTrackBtn" class="gp-btn xs danger" type="button">刪除音軌</button>' +
              '</div>' +
              '<label class="gp-prop-label">音軌名稱 <input id="gpTrackNameInput" type="text" /></label>' +
              '<label class="gp-prop-label">樂器（記譜／調弦） <select id="gpTrackInstrumentSelect">' + instOpts + '</select></label>' +
              '<p class="gp-hint-line">發聲統一使用右上角的「音色」，此處只決定記譜、音域與調弦。</p>' +
              '<div class="gp-check-row">' +
                '<label><input id="gpTrackShowStaff" type="checkbox" /> 顯示五線譜</label>' +
                '<label><input id="gpTrackShowTab" type="checkbox" /> 顯示六線譜</label>' +
              '</div>' +
              '<div id="gpFrettedSettings">' +
                '<label class="gp-prop-label">調弦預設 <select id="gpTrackTuningPreset">' + tuneOpts + '</select></label>' +
                '<label class="gp-prop-label" style="margin-top:8px;">變調夾 (Capo 0–12) <input id="gpTrackCapoInput" type="number" min="0" max="12" value="0" /></label>' +
                '<div style="margin-top:8px;">' +
                  '<span class="gp-section-title" style="margin-bottom:4px;">各弦獨立微調</span>' +
                  '<div id="gpCustomTuningGrid" class="gp-tuning-grid"></div>' +
                '</div>' +
              '</div>' +
            '</div>' +

            '<div class="gp-prop-group">' +
              '<h4 class="gp-section-title" style="margin-bottom:2px;">與既有資料互通</h4>' +
              '<button id="gpImportClassicBtn" class="gp-btn" type="button">↙ 匯入經典六線譜草稿</button>' +
              '<button id="gpResetDemoBtn" class="gp-btn" type="button">✨ 載入多軌示範譜例</button>' +
              '<button id="gpExportJsonBtn" class="gp-btn" type="button">⬇ 匯出 .nebula.json</button>' +
              '<button id="gpImportJsonBtn" class="gp-btn" type="button">⬆ 匯入 .nebula.json</button>' +
              '<input id="gpImportJsonInput" type="file" accept=".json,application/json" hidden />' +
            '</div>' +
          '</aside>' +

          '<footer class="gp-statusbar">' +
            '<span id="gpCursorStatus">音軌 1 · 小節 1 · 拍 1</span>' +
            '<span class="gp-cloud-badge"><i id="gpCloudDot" class="gp-cloud-dot"></i><span id="gpCloudStatus">本機自動草稿已啟用</span></span>' +
          '</footer>' +
        '</div>';

      this.svgEl = this.root.querySelector("#gpScoreSvg");
      this.viewportEl = this.root.querySelector("#gpViewport");
    }

    get currentTrack() {
      return this.score.tracks[this.cursor.trackIndex] || this.score.tracks[0];
    }

    get currentMeasure() {
      return this.currentTrack && this.currentTrack.measures[this.cursor.measureIndex];
    }

    get currentBeat() {
      return this.currentMeasure && this.currentMeasure.beats[this.cursor.beatIndex];
    }

    get currentNote() {
      const beat = this.currentBeat;
      const track = this.currentTrack;
      if (!beat || !beat.notes.length) return null;
      if (track.tuning.length > 0) {
        const s = this.cursor.stringIndex;
        return beat.notes.find(function (n) { return n.string === s; }) || beat.notes[0];
      }
      return beat.notes[beat.notes.length - 1];
    }

    pushUndo() {
      this.undoStack.push(NS.Model.cloneScore(this.score));
      if (this.undoStack.length > 50) this.undoStack.shift();
      this.redoStack = [];
      this.saveDraft();
    }

    undo() {
      if (this.undoStack.length <= 1) return;
      const cur = this.undoStack.pop();
      this.redoStack.push(cur);
      this.score = NS.Model.cloneScore(this.undoStack[this.undoStack.length - 1]);
      this.clampCursor();
      this.saveDraft();
      this.renderAll();
      toast("已撤銷上一步操作", "info");
    }

    redo() {
      if (!this.redoStack.length) return;
      const next = this.redoStack.pop();
      this.undoStack.push(NS.Model.cloneScore(next));
      this.score = NS.Model.cloneScore(next);
      this.clampCursor();
      this.saveDraft();
      this.renderAll();
      toast("已重做操作", "info");
    }

    saveDraft() {
      this.score.meta.updatedAt = Date.now();
      NS.Storage.saveDraftLocal(this.score);
    }

    clampCursor() {
      this.cursor.trackIndex = Math.max(0, Math.min(this.score.tracks.length - 1, this.cursor.trackIndex));
      const t = this.currentTrack;
      this.cursor.measureIndex = Math.max(0, Math.min(t.measures.length - 1, this.cursor.measureIndex));
      const m = this.currentMeasure;
      this.cursor.beatIndex = Math.max(0, Math.min(m.beats.length - 1, this.cursor.beatIndex));
      const maxS = Math.max(0, ((t.tuning && t.tuning.length) || 1) - 1);
      this.cursor.stringIndex = Math.max(0, Math.min(maxS, this.cursor.stringIndex));
    }

    selectSlot(slot) {
      this.cursor = Object.assign({}, this.cursor, slot);
      this.clampCursor();
      this.viewportEl.focus({ preventScroll: true });
      this.renderAll();
    }

    handleMeasureHeaderClick(mIdx) {
      this.cursor.measureIndex = mIdx;
      this.cursor.beatIndex = 0;
      this.clampCursor();
      this.renderAll();
    }

    handleStaffClick(info) {
      const M = NS.Model;
      this.cursor.trackIndex = info.trackIndex;
      this.cursor.measureIndex = info.measureIndex;
      this.cursor.beatIndex = info.beatIndex;
      const track = this.currentTrack;
      const beat = this.currentBeat;
      if (!beat) return;

      this.pushUndo();
      beat.isRest = false;

      const existingIdx = beat.notes.findIndex(function (n) {
        const m = n.midi != null ? n.midi : M.fretToMidi(track, n.string, n.fret);
        return m === info.midi;
      });
      if (existingIdx >= 0) {
        beat.notes.splice(existingIdx, 1);
      } else if (track.tuning && track.tuning.length > 0) {
        const mapping = M.findBestStringFret(track, info.midi, null);
        if (mapping) {
          beat.notes = beat.notes.filter(function (n) { return n.string !== mapping.stringIndex; });
          beat.notes.push({ string: mapping.stringIndex, fret: mapping.fret, midi: info.midi, tie: false, tech: {} });
          this.cursor.stringIndex = mapping.stringIndex;
        } else {
          beat.notes.push({ string: null, fret: null, midi: info.midi, tie: false, tech: {} });
        }
        this.player.previewNote(track, info.midi);
      } else {
        beat.notes.push({ string: null, fret: null, midi: info.midi, tie: false, tech: {} });
        this.player.previewNote(track, info.midi);
      }

      this.saveDraft();
      this.viewportEl.focus({ preventScroll: true });
      this.renderAll();
    }

    handleNoteDrag(info) {
      const M = NS.Model;
      const track = this.score.tracks[info.trackIndex];
      const beat = track && track.measures[info.measureIndex] && track.measures[info.measureIndex].beats[info.beatIndex];
      const note = beat && beat.notes[info.noteIndex];
      if (!note) return;

      const newMidi = Math.max(24, Math.min(96, info.startMidi + info.deltaSteps));
      if (note.midi === newMidi) return;
      note.midi = newMidi;
      if (track.tuning && track.tuning.length > 0) {
        const mapped = M.findBestStringFret(track, newMidi, note.string);
        if (mapped) {
          note.string = mapped.stringIndex;
          note.fret = mapped.fret;
        }
      }
      this.player.previewNote(track, newMidi, note.tech);
      this.saveDraft();
      this.renderScore();
    }

    setFretAtCursor(fretNum) {
      const M = NS.Model;
      const track = this.currentTrack;
      const beat = this.currentBeat;
      if (!beat || !track.tuning || !track.tuning.length) return;
      const sIdx = this.cursor.stringIndex;
      const midi = M.fretToMidi(track, sIdx, fretNum);
      if (midi == null) return;

      beat.isRest = false;
      const existing = beat.notes.find(function (n) { return n.string === sIdx; });
      if (existing) {
        existing.fret = fretNum;
        existing.midi = midi;
      } else {
        beat.notes.push({ string: sIdx, fret: fretNum, midi: midi, tie: false, tech: {} });
      }
      this.player.previewNote(track, midi, (existing && existing.tech) || {});
      this.saveDraft();
      this.renderAll();
    }

    toggleTechnique(techId) {
      const note = this.currentNote;
      if (!note) {
        toast("請先點選一個已有音符的拍位再套用技法", "info");
        return;
      }
      this.pushUndo();
      note.tech = note.tech || {};
      note.tech[techId] = !note.tech[techId];
      const midi = note.midi != null ? note.midi : NS.Model.fretToMidi(this.currentTrack, note.string, note.fret);
      this.player.previewNote(this.currentTrack, midi, note.tech);
      this.saveDraft();
      this.renderAll();
    }

    togglePlay() {
      if (this.player.isPlaying) {
        this.player.stop();
        return;
      }
      const self = this;
      const playBtn = this.root.querySelector("#gpPlayBtn");
      if (playBtn) playBtn.textContent = "❚❚ 暫停";
      this.player.play(this.score, {
        startMeasure: this.player.loopRange.enabled ? this.player.loopRange.a : this.cursor.measureIndex,
        onPlayhead: function (ph) {
          self.playhead = ph;
          self.renderScore();
        },
        onStop: function () {
          self.playhead = null;
          if (playBtn) playBtn.textContent = "▶ 播放";
          self.renderScore();
        }
      });
    }

    bindEvents() {
      const self = this;
      const M = NS.Model;
      const S = NS.Storage;
      const $ = function (sel) { return self.root.querySelector(sel); };

      $("#gpTitleInput").addEventListener("input", function (e) {
        self.score.meta.title = e.target.value;
        self.saveDraft();
      });

      $("#gpPlayBtn").addEventListener("click", function () { self.togglePlay(); });
      $("#gpStopBtn").addEventListener("click", function () { self.player.stop(); });

      $("#gpBpmInput").addEventListener("change", function (e) {
        self.score.meta.bpm = Math.max(30, Math.min(260, Number(e.target.value) || 120));
        e.target.value = String(self.score.meta.bpm);
        self.saveDraft();
      });

      $("#gpTimeSigSelect").addEventListener("change", function (e) {
        self.pushUndo();
        const parts = e.target.value.split("/").map(Number);
        const num = parts[0], den = parts[1];
        self.score.meta.timeSignature = [num, den];
        self.score.tracks.forEach(function (t) {
          t.measures.forEach(function (m) {
            while (m.beats.length < num) m.beats.push(M.createBeat(den));
            if (m.beats.length > num) m.beats.length = num;
          });
        });
        self.clampCursor();
        self.saveDraft();
        self.renderAll();
      });

      $("#gpKeySigSelect").addEventListener("change", function (e) {
        self.pushUndo();
        self.score.meta.keySignature = e.target.value;
        self.saveDraft();
        self.renderAll();
      });

      $("#gpMetroBtn").addEventListener("click", function (e) {
        self.player.metronomeEnabled = !self.player.metronomeEnabled;
        e.currentTarget.classList.toggle("active", self.player.metronomeEnabled);
      });

      $("#gpMasterVol").addEventListener("input", function (e) {
        self.player.setMasterVolume(Number(e.target.value) / 100);
      });

      $("#gpLoopA").addEventListener("change", function (e) {
        self.player.loopRange.a = Number(e.target.value);
        if (self.player.loopRange.b < self.player.loopRange.a) {
          self.player.loopRange.b = self.player.loopRange.a;
        }
        self.renderAll();
      });

      $("#gpLoopB").addEventListener("change", function (e) {
        self.player.loopRange.b = Number(e.target.value);
        if (self.player.loopRange.b < self.player.loopRange.a) {
          self.player.loopRange.a = self.player.loopRange.b;
        }
        self.renderAll();
      });

      $("#gpLoopToggleBtn").addEventListener("click", function () {
        self.player.loopRange.enabled = !self.player.loopRange.enabled;
        self.renderAll();
        toast(
          self.player.loopRange.enabled
            ? ("已開啟 AB 段循環：M" + (self.player.loopRange.a + 1) + " – M" + (self.player.loopRange.b + 1))
            : "已關閉 AB 段循環",
          "info"
        );
      });

      $("#gpUndoBtn").addEventListener("click", function () { self.undo(); });
      $("#gpRedoBtn").addEventListener("click", function () { self.redo(); });

      $("#gpAddMeasureBtn").addEventListener("click", function () {
        self.pushUndo();
        const ts = self.score.meta.timeSignature || [4, 4];
        self.score.tracks.forEach(function (t) { t.measures.push(M.createMeasure(ts[0], ts[1])); });
        self.player.loopRange.b = self.score.tracks[0].measures.length - 1;
        self.saveDraft();
        self.renderAll();
      });

      $("#gpDelMeasureBtn").addEventListener("click", function () {
        if (self.score.tracks[0].measures.length <= 1) {
          toast("至少需保留 1 個小節", "info");
          return;
        }
        self.pushUndo();
        self.score.tracks.forEach(function (t) { t.measures.pop(); });
        self.clampCursor();
        self.saveDraft();
        self.renderAll();
      });

      $("#gpDurGrid").addEventListener("click", function (e) {
        const btn = e.target.closest("[data-gp-dur]");
        if (!btn || !self.currentBeat) return;
        self.pushUndo();
        self.currentBeat.duration = Number(btn.dataset.gpDur);
        self.saveDraft();
        self.renderAll();
      });

      $("#gpDotBtn").addEventListener("click", function () {
        if (!self.currentBeat) return;
        self.pushUndo();
        self.currentBeat.dotted = !self.currentBeat.dotted;
        self.saveDraft();
        self.renderAll();
      });

      $("#gpTripletBtn").addEventListener("click", function () {
        if (!self.currentBeat) return;
        self.pushUndo();
        self.currentBeat.tuplet = self.currentBeat.tuplet === 3 ? null : 3;
        self.saveDraft();
        self.renderAll();
      });

      $("#gpTieBtn").addEventListener("click", function () {
        const note = self.currentNote;
        if (!note) return;
        self.pushUndo();
        note.tie = !note.tie;
        self.saveDraft();
        self.renderAll();
      });

      $("#gpRestBtn").addEventListener("click", function () {
        if (!self.currentBeat) return;
        self.pushUndo();
        self.currentBeat.isRest = !self.currentBeat.isRest;
        if (self.currentBeat.isRest) self.currentBeat.notes = [];
        self.saveDraft();
        self.renderAll();
      });

      $("#gpRepeatStartBtn").addEventListener("click", function () {
        self.pushUndo();
        const mIdx = self.cursor.measureIndex;
        const next = !self.score.tracks[0].measures[mIdx].repeatStart;
        self.score.tracks.forEach(function (t) { if (t.measures[mIdx]) t.measures[mIdx].repeatStart = next; });
        self.saveDraft();
        self.renderAll();
      });

      $("#gpRepeatEndBtn").addEventListener("click", function () {
        self.pushUndo();
        const mIdx = self.cursor.measureIndex;
        const next = !self.score.tracks[0].measures[mIdx].repeatEnd;
        self.score.tracks.forEach(function (t) { if (t.measures[mIdx]) t.measures[mIdx].repeatEnd = next; });
        self.saveDraft();
        self.renderAll();
      });

      $("#gpAddBeatBtn").addEventListener("click", function () {
        const mIdx = self.cursor.measureIndex;
        const bIdx = self.cursor.beatIndex;
        const dur = (self.currentBeat && self.currentBeat.duration) || 4;
        self.pushUndo();
        self.score.tracks.forEach(function (t) {
          if (t.measures[mIdx]) t.measures[mIdx].beats.splice(bIdx + 1, 0, M.createBeat(dur));
        });
        self.cursor.beatIndex = bIdx + 1;
        self.saveDraft();
        self.renderAll();
      });

      $("#gpDelBeatBtn").addEventListener("click", function () {
        const mIdx = self.cursor.measureIndex;
        const bIdx = self.cursor.beatIndex;
        if (((self.currentMeasure && self.currentMeasure.beats.length) || 0) <= 1) return;
        self.pushUndo();
        self.score.tracks.forEach(function (t) {
          if (t.measures[mIdx]) t.measures[mIdx].beats.splice(bIdx, 1);
        });
        self.clampCursor();
        self.saveDraft();
        self.renderAll();
      });

      $("#gpTechGrid").addEventListener("click", function (e) {
        const btn = e.target.closest("[data-gp-tech]");
        if (!btn) return;
        self.toggleTechnique(btn.dataset.gpTech);
      });

      $("#gpAddTrackBtn").addEventListener("click", function () {
        self.pushUndo();
        const count = self.score.tracks.length;
        const defaults = ["guitar-clean", "bass-4", "piano", "guitar-overdrive"];
        const inst = defaults[count % defaults.length];
        const newTrack = M.createTrack({
          name: M.INSTRUMENTS[inst].label.split(" ")[0] + " " + (count + 1),
          instrument: inst,
          measureCount: self.score.tracks[0].measures.length,
          timeSignature: self.score.meta.timeSignature
        });
        self.score.tracks.push(newTrack);
        self.cursor.trackIndex = self.score.tracks.length - 1;
        self.clampCursor();
        self.saveDraft();
        self.renderAll();
        toast("已新增音軌：" + newTrack.name, "success");
      });

      $("#gpDeleteTrackBtn").addEventListener("click", function () {
        if (self.score.tracks.length <= 1) {
          toast("至少需保留 1 條音軌", "info");
          return;
        }
        self.pushUndo();
        const removed = self.score.tracks.splice(self.cursor.trackIndex, 1)[0];
        self.clampCursor();
        self.saveDraft();
        self.renderAll();
        toast("已刪除音軌：" + removed.name, "info");
      });

      $("#gpTrackNameInput").addEventListener("input", function (e) {
        self.currentTrack.name = e.target.value;
        self.saveDraft();
        self.renderTrackList();
        self.renderScore();
      });

      $("#gpTrackInstrumentSelect").addEventListener("change", function (e) {
        self.pushUndo();
        const track = self.currentTrack;
        const spec = M.INSTRUMENTS[e.target.value] || M.INSTRUMENTS["guitar-acoustic"];
        track.instrument = spec.id;
        track.clef = spec.clef;
        track.octaveShift = spec.octaveShift;
        track.color = spec.color;
        if (spec.type === "fretted") {
          const preset = M.TUNING_PRESETS[spec.defaultTuning];
          track.tuningPreset = spec.defaultTuning;
          track.tuning = preset.strings.slice();
          track.showTab = true;
        } else {
          track.tuningPreset = "none";
          track.tuning = [];
          track.showTab = false;
          track.showStaff = true;
        }
        self.clampCursor();
        self.saveDraft();
        self.renderAll();
      });

      $("#gpTrackShowStaff").addEventListener("change", function (e) {
        const track = self.currentTrack;
        if (!e.target.checked && !track.showTab) {
          e.target.checked = true;
          return;
        }
        track.showStaff = e.target.checked;
        self.saveDraft();
        self.renderScore();
      });

      $("#gpTrackShowTab").addEventListener("change", function (e) {
        const track = self.currentTrack;
        if (!e.target.checked && !track.showStaff) {
          e.target.checked = true;
          return;
        }
        track.showTab = e.target.checked;
        self.saveDraft();
        self.renderScore();
      });

      $("#gpTrackTuningPreset").addEventListener("change", function (e) {
        const preset = M.TUNING_PRESETS[e.target.value];
        if (!preset) return;
        self.pushUndo();
        const track = self.currentTrack;
        track.tuningPreset = e.target.value;
        track.tuning = preset.strings.slice();
        track.measures.forEach(function (m) {
          m.beats.forEach(function (b) {
            b.notes.forEach(function (n) {
              if (n.string != null && n.fret != null && n.string < track.tuning.length) {
                n.midi = M.fretToMidi(track, n.string, n.fret);
              }
            });
          });
        });
        self.clampCursor();
        self.saveDraft();
        self.renderAll();
      });

      $("#gpTrackCapoInput").addEventListener("change", function (e) {
        self.pushUndo();
        const track = self.currentTrack;
        track.capo = Math.max(0, Math.min(12, Number(e.target.value) || 0));
        e.target.value = String(track.capo);
        track.measures.forEach(function (m) {
          m.beats.forEach(function (b) {
            b.notes.forEach(function (n) {
              if (n.string != null && n.fret != null) n.midi = M.fretToMidi(track, n.string, n.fret);
            });
          });
        });
        self.saveDraft();
        self.renderAll();
      });

      $("#gpSaveLocalBtn").addEventListener("click", function () {
        S.saveScoreLocal(self.score);
        toast("已儲存「" + (self.score.meta.title || "未命名譜例") + "」到本機譜庫", "success");
      });

      $("#gpSaveCloudBtn").addEventListener("click", async function () {
        try {
          if (!S.isCloudSignedIn()) {
            const fb = S.getFirebaseBridge();
            if (fb && fb.signIn) {
              toast("請先登入 Google 帳號以同步雲端譜庫...", "info");
              await fb.signIn();
            } else {
              toast("需透過 HTTPS / 本地伺服器開啟網站並登入 Google 帳號才可同步雲端", "info");
              return;
            }
          }
          await S.saveScoreCloud(self.score);
          S.saveScoreLocal(self.score);
          toast("已同步「" + (self.score.meta.title || "未命名譜例") + "」至 Firebase 雲端", "success");
        } catch (err) {
          console.error(err);
          toast("雲端同步失敗，已為您保留本機草稿", "error");
        }
      });

      $("#gpOpenLibBtn").addEventListener("click", function () { self.openLibraryModal(); });

      $("#gpExportMidiBtn").addEventListener("click", function () {
        const bytes = M.exportScoreToMidiBytes(self.score);
        const name = (self.score.meta.title || "Nebula_MultiTrack").replace(/[\\/:*?"<>|]/g, "_");
        downloadBlob(name + ".mid", bytes, "audio/midi");
        toast("已匯出多軌 MIDI：" + name + ".mid", "success");
      });

      $("#gpExportXmlBtn").addEventListener("click", function () {
        const xml = M.exportScoreToMusicXml(self.score);
        const name = (self.score.meta.title || "Nebula_MultiTrack").replace(/[\\/:*?"<>|]/g, "_");
        downloadBlob(name + ".musicxml", xml, "application/vnd.recordare.musicxml+xml;charset=utf-8");
        toast("已匯出多軌 MusicXML（可匯入 Guitar Pro / MuseScore）", "success");
      });

      $("#gpExportPdfBtn").addEventListener("click", function () {
        const modal = document.getElementById("printModal");
        const preview = document.getElementById("printSheetPreview");
        if (!modal || !preview) {
          global.print();
          return;
        }
        const svgClone = self.svgEl.cloneNode(true);
        preview.innerHTML =
          "<h3>" + (self.score.meta.title || "未命名多軌譜例") + "</h3>" +
          '<p class="print-meta">拍號：' + (self.score.meta.timeSignature || [4, 4]).join("/") +
          " · 調號：" + (self.score.meta.keySignature || "C") +
          " · 速度：" + (self.score.meta.bpm || 120) + " BPM · 音軌數：" + self.score.tracks.length + "</p>" +
          '<div class="print-sheet">' + svgClone.outerHTML + "</div>";
        modal.hidden = false;
        document.body.classList.add("modal-open");
      });

      $("#gpImportClassicBtn").addEventListener("click", function () { self.importFromClassicTab(); });
      $("#gpResetDemoBtn").addEventListener("click", function () {
        self.pushUndo();
        self.score = M.createDemoScore();
        self.cursor = { trackIndex: 0, measureIndex: 0, beatIndex: 0, stringIndex: 0 };
        self.saveDraft();
        self.renderAll();
        toast("已載入多軌示範譜例", "success");
      });

      $("#gpExportJsonBtn").addEventListener("click", function () {
        const name = (self.score.meta.title || "nebula_score").replace(/[\\/:*?"<>|]/g, "_");
        downloadBlob(name + ".nebula.json", JSON.stringify(self.score, null, 2), "application/json");
        toast("已匯出 .nebula.json 工程檔", "success");
      });

      $("#gpImportJsonBtn").addEventListener("click", function () { $("#gpImportJsonInput").click(); });
      $("#gpImportJsonInput").addEventListener("change", function (e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function () {
          try {
            const parsed = JSON.parse(String(reader.result || "{}"));
            if (!parsed || !Array.isArray(parsed.tracks) || !parsed.tracks.length) {
              throw new Error("格式不符");
            }
            self.pushUndo();
            self.score = parsed;
            M.ensureMeasureCount(self.score);
            self.clampCursor();
            self.saveDraft();
            self.renderAll();
            toast("已匯入「" + ((parsed.meta && parsed.meta.title) || file.name) + "」", "success");
          } catch {
            toast("匯入失敗：請確認為有效的 .nebula.json 檔案", "error");
          } finally {
            e.target.value = "";
          }
        };
        reader.readAsText(file, "utf-8");
      });

      this.viewportEl.addEventListener("keydown", function (e) { self.handleKeyDown(e); });
      global.addEventListener("nebula:themechange", function () { self.renderScore(); });
      global.addEventListener("nebula:authchange", function () { self.updateCloudBadge(); });
    }

    handleKeyDown(e) {
      const M = NS.Model;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) this.redo();
        else this.undo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        this.redo();
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        this.togglePlay();
        return;
      }

      const track = this.currentTrack;
      const measure = this.currentMeasure;
      const beat = this.currentBeat;
      if (!track || !measure || !beat) return;

      if (/^[0-9]$/.test(e.key) && track.tuning.length > 0) {
        e.preventDefault();
        const self = this;
        global.clearTimeout(this.digitTimer);
        const candidate = this.digitBuffer + e.key;
        const val = parseInt(candidate, 10) <= 24 ? parseInt(candidate, 10) : parseInt(e.key, 10);
        if (!this.digitBuffer) this.pushUndo();
        this.digitBuffer = String(val);
        this.digitTimer = global.setTimeout(function () { self.digitBuffer = ""; }, 650);
        this.setFretAtCursor(val);
        return;
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        this.pushUndo();
        if (track.tuning.length > 0) {
          const s = this.cursor.stringIndex;
          beat.notes = beat.notes.filter(function (n) { return n.string !== s; });
        } else {
          beat.notes.pop();
        }
        this.saveDraft();
        this.renderAll();
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.cursor.stringIndex > 0) this.cursor.stringIndex -= 1;
        this.renderAll();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (track.tuning.length > 0 && this.cursor.stringIndex < track.tuning.length - 1) {
          this.cursor.stringIndex += 1;
        }
        this.renderAll();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (this.cursor.beatIndex < measure.beats.length - 1) {
          this.cursor.beatIndex += 1;
        } else if (this.cursor.measureIndex < track.measures.length - 1) {
          this.cursor.measureIndex += 1;
          this.cursor.beatIndex = 0;
        }
        this.renderAll();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (this.cursor.beatIndex > 0) {
          this.cursor.beatIndex -= 1;
        } else if (this.cursor.measureIndex > 0) {
          this.cursor.measureIndex -= 1;
          this.cursor.beatIndex = track.measures[this.cursor.measureIndex].beats.length - 1;
        }
        this.renderAll();
        return;
      }

      const k = e.key.toLowerCase();
      if (k === "r") { e.preventDefault(); this.root.querySelector("#gpRestBtn").click(); return; }
      if (k === "t") { e.preventDefault(); this.root.querySelector("#gpTieBtn").click(); return; }
      if (k === ".") { e.preventDefault(); this.root.querySelector("#gpDotBtn").click(); return; }
      const techMatch = M.TECHNIQUES.find(function (t) { return t.key === k; });
      if (techMatch) {
        e.preventDefault();
        this.toggleTechnique(techMatch.id);
      }
    }

    importFromClassicTab() {
      const M = NS.Model;
      if (typeof global.state === "undefined" || !Array.isArray(global.state.tabGrid)) {
        toast("找不到經典六線譜資料", "info");
        return;
      }
      const grid = global.state.tabGrid;
      const totalBeats = global.state.tabBeats || 4;
      const bpmCount = Number((global.state.scoreTimeSig || "4/4").split("/")[0]) || 4;
      const mCount = Math.max(1, Math.ceil(totalBeats / bpmCount));

      this.pushUndo();
      const titleEl = document.getElementById("tabTitleInput");
      const track = M.createTrack({
        name: (titleEl && titleEl.value && titleEl.value.trim()) || "匯入吉他軌",
        instrument: "guitar-acoustic",
        measureCount: mCount,
        timeSignature: [bpmCount, 4]
      });
      track.capo = Number(global.state.tabCapo) || 0;

      for (let col = 0; col < totalBeats; col++) {
        const mIdx = Math.floor(col / bpmCount);
        const bIdx = col % bpmCount;
        const beat = track.measures[mIdx] && track.measures[mIdx].beats[bIdx];
        if (!beat) continue;
        for (let s = 0; s < 6; s++) {
          const raw = String((grid[s] && grid[s][col]) || "").trim();
          if (!raw) continue;
          if (raw.toLowerCase() === "x") {
            beat.notes.push({ string: s, fret: 0, midi: M.fretToMidi(track, s, 0), tie: false, tech: { deadNote: true } });
          } else {
            const m = raw.match(/^(\d{1,2})([hpb\/\\~◇m])?/i);
            if (m) {
              const fret = Number(m[1]);
              const tech = {};
              if (m[2] === "h") tech.hammer = true;
              if (m[2] === "p") tech.pull = true;
              if (m[2] === "b") tech.bend = true;
              if (m[2] === "/") tech.slideUp = true;
              if (m[2] === "\\") tech.slideDown = true;
              if (m[2] === "~") tech.vibrato = true;
              if (m[2] === "◇") tech.harmonic = true;
              if (m[2] === "m") tech.palmMute = true;
              beat.notes.push({ string: s, fret: fret, midi: M.fretToMidi(track, s, fret), tie: false, tech: tech });
            }
          }
        }
      }

      this.score.tracks.push(track);
      M.ensureMeasureCount(this.score);
      this.cursor.trackIndex = this.score.tracks.length - 1;
      this.clampCursor();
      this.saveDraft();
      this.renderAll();
      toast("已將經典六線譜匯入為新音軌", "success");
    }

    async openLibraryModal() {
      const S = NS.Storage;
      const M = NS.Model;
      const self = this;
      const existing = document.getElementById("gpLibraryModal");
      if (existing) existing.remove();

      const localList = S.listLocalScores();
      let cloudList = [];
      const signedIn = S.isCloudSignedIn();
      if (signedIn) {
        try { cloudList = await S.listCloudScores(); } catch { cloudList = []; }
      }

      const backdrop = document.createElement("div");
      backdrop.id = "gpLibraryModal";
      backdrop.className = "gp-modal-backdrop";

      const renderListHtml = function (items, source) {
        if (!items.length) {
          return '<p style="font-size:12px;color:var(--muted);margin:6px 0;">' +
            (source === "cloud" && !signedIn ? "登入右上角 Google 帳號後即可讀取雲端譜庫。" : "目前沒有儲存的譜例。") + "</p>";
        }
        return items.map(function (s) {
          return '<div class="gp-lib-item">' +
            '<div class="gp-lib-meta">' +
              '<strong>' + ((s.meta && s.meta.title) || "未命名譜例") + '</strong>' +
              '<small>' + ((s.tracks && s.tracks.length) || 1) + ' 軌 · ' + ((s.meta && s.meta.bpm) || 120) + ' BPM · ' + ((s.meta && s.meta.timeSignature) || [4, 4]).join("/") + '</small>' +
            '</div>' +
            '<div class="gp-lib-actions">' +
              '<button type="button" class="gp-btn xs primary" data-lib-load="' + source + ':' + s.id + '">載入</button>' +
              '<button type="button" class="gp-btn xs danger" data-lib-del="' + source + ':' + s.id + '">刪除</button>' +
            '</div></div>';
        }).join("");
      };

      backdrop.innerHTML =
        '<div class="gp-modal" role="dialog" aria-modal="true" aria-label="多軌譜例庫">' +
          '<div class="gp-modal-head">' +
            '<h4>📂 多軌譜例庫（本機 + Firebase 雲端）</h4>' +
            '<div style="display:flex;gap:6px;">' +
              '<button type="button" class="gp-btn xs primary" id="gpNewScoreBtn">+ 新建空白譜例</button>' +
              '<button type="button" class="gp-btn xs" id="gpCloseLibBtn">關閉</button>' +
            '</div>' +
          '</div>' +
          '<h5 class="gp-section-title">本機譜庫 (' + localList.length + ')</h5>' +
          '<div class="gp-lib-list">' + renderListHtml(localList, "local") + '</div>' +
          '<h5 class="gp-section-title" style="margin-top:16px;">Firebase 雲端譜庫 (' + cloudList.length + ')</h5>' +
          '<div class="gp-lib-list">' + renderListHtml(cloudList, "cloud") + '</div>' +
        '</div>';

      backdrop.addEventListener("click", async function (e) {
        if (e.target === backdrop || e.target.id === "gpCloseLibBtn") {
          backdrop.remove();
          return;
        }
        if (e.target.id === "gpNewScoreBtn") {
          self.pushUndo();
          self.score = {
            id: M.uid("gp"),
            version: 2,
            meta: { title: "新多軌譜例", bpm: 120, timeSignature: [4, 4], keySignature: "C", updatedAt: Date.now() },
            tracks: [M.createTrack({ name: "Guitar 1", instrument: "guitar-acoustic", measureCount: 4 })]
          };
          self.cursor = { trackIndex: 0, measureIndex: 0, beatIndex: 0, stringIndex: 0 };
          self.saveDraft();
          self.renderAll();
          backdrop.remove();
          return;
        }
        const loadKey = e.target.dataset && e.target.dataset.libLoad;
        if (loadKey) {
          const parts = loadKey.split(":");
          const src = parts[0], id = parts[1];
          const found = (src === "cloud" ? cloudList : localList).find(function (item) { return item.id === id; });
          if (found) {
            self.pushUndo();
            self.score = M.cloneScore(found);
            M.ensureMeasureCount(self.score);
            self.clampCursor();
            self.saveDraft();
            self.renderAll();
            backdrop.remove();
            toast("已載入「" + ((found.meta && found.meta.title) || "譜例") + "」", "success");
          }
          return;
        }
        const delKey = e.target.dataset && e.target.dataset.libDel;
        if (delKey) {
          const parts = delKey.split(":");
          const src = parts[0], id = parts[1];
          if (src === "cloud") await S.deleteScoreCloud(id);
          else S.deleteScoreLocal(id);
          backdrop.remove();
          self.openLibraryModal();
        }
      });

      document.body.appendChild(backdrop);
    }

    renderAll() {
      this.renderTransport();
      this.renderPaletteState();
      this.renderTrackList();
      this.renderTrackInspector();
      this.renderScore();
      this.updateStatusBar();
      this.updateCloudBadge();
    }

    renderTransport() {
      const $ = (sel) => this.root.querySelector(sel);
      $("#gpTitleInput").value = this.score.meta.title || "";
      $("#gpBpmInput").value = String(this.score.meta.bpm || 120);
      $("#gpTimeSigSelect").value = (this.score.meta.timeSignature || [4, 4]).join("/");
      $("#gpKeySigSelect").value = this.score.meta.keySignature || "C";
      $("#gpUndoBtn").disabled = this.undoStack.length <= 1;
      $("#gpRedoBtn").disabled = this.redoStack.length === 0;

      const mCount = (this.score.tracks[0] && this.score.tracks[0].measures.length) || 1;
      this.player.loopRange.a = Math.min(this.player.loopRange.a, mCount - 1);
      this.player.loopRange.b = Math.min(this.player.loopRange.b, mCount - 1);
      let opts = "";
      for (let i = 0; i < mCount; i++) opts += '<option value="' + i + '">M' + (i + 1) + '</option>';
      $("#gpLoopA").innerHTML = opts;
      $("#gpLoopB").innerHTML = opts;
      $("#gpLoopA").value = String(this.player.loopRange.a);
      $("#gpLoopB").value = String(this.player.loopRange.b);
      $("#gpLoopToggleBtn").classList.toggle("active", this.player.loopRange.enabled);
    }

    renderPaletteState() {
      const beat = this.currentBeat;
      const note = this.currentNote;
      const measure = this.currentMeasure;

      this.root.querySelectorAll("[data-gp-dur]").forEach(function (btn) {
        btn.classList.toggle("active", Boolean(beat && Number(btn.dataset.gpDur) === beat.duration));
      });
      this.root.querySelector("#gpDotBtn").classList.toggle("active", Boolean(beat && beat.dotted));
      this.root.querySelector("#gpTripletBtn").classList.toggle("active", Boolean(beat && beat.tuplet === 3));
      this.root.querySelector("#gpRestBtn").classList.toggle("active", Boolean(beat && beat.isRest));
      this.root.querySelector("#gpTieBtn").classList.toggle("active", Boolean(note && note.tie));
      this.root.querySelector("#gpRepeatStartBtn").classList.toggle("active", Boolean(measure && measure.repeatStart));
      this.root.querySelector("#gpRepeatEndBtn").classList.toggle("active", Boolean(measure && measure.repeatEnd));

      this.root.querySelectorAll("[data-gp-tech]").forEach(function (btn) {
        const id = btn.dataset.gpTech;
        btn.classList.toggle("active", Boolean(note && note.tech && note.tech[id]));
      });
    }

    renderTrackList() {
      const self = this;
      const listEl = this.root.querySelector("#gpTrackList");
      this.root.querySelector("#gpTrackCount").textContent = String(this.score.tracks.length);

      listEl.innerHTML = this.score.tracks.map(function (track, idx) {
        const active = idx === self.cursor.trackIndex;
        const volPct = Math.round((track.volume != null ? track.volume : 0.85) * 100);
        return '<li class="gp-track-card ' + (active ? "active" : "") + '" data-select-track="' + idx + '">' +
          '<div class="gp-track-card-top">' +
            '<span class="gp-track-name"><i class="gp-track-dot" style="background:' + (track.color || "var(--accent)") + '"></i>' + (track.name || ("Track " + (idx + 1))) + '</span>' +
            '<small style="font-size:10px;color:var(--muted);">' + (track.tuning.length ? (track.tuning.length + "弦") : "鍵盤") + '</small>' +
          '</div>' +
          '<div class="gp-track-controls">' +
            '<button type="button" class="gp-btn xs ' + (track.muted ? "danger active" : "") + '" data-mute-track="' + idx + '" title="靜音">M</button>' +
            '<button type="button" class="gp-btn xs ' + (track.solo ? "active" : "") + '" data-solo-track="' + idx + '" title="獨奏">S</button>' +
            '<input type="range" min="0" max="100" value="' + volPct + '" data-vol-track="' + idx + '" aria-label="音量" />' +
          '</div>' +
        '</li>';
      }).join("");

      listEl.querySelectorAll("[data-select-track]").forEach(function (li) {
        li.addEventListener("click", function (e) {
          if (e.target.closest("button, input")) return;
          self.cursor.trackIndex = Number(li.dataset.selectTrack);
          self.clampCursor();
          self.renderAll();
        });
      });
      listEl.querySelectorAll("[data-mute-track]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const t = self.score.tracks[Number(btn.dataset.muteTrack)];
          if (t) { t.muted = !t.muted; self.saveDraft(); self.renderTrackList(); self.renderScore(); }
        });
      });
      listEl.querySelectorAll("[data-solo-track]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          const t = self.score.tracks[Number(btn.dataset.soloTrack)];
          if (t) { t.solo = !t.solo; self.saveDraft(); self.renderTrackList(); self.renderScore(); }
        });
      });
      listEl.querySelectorAll("[data-vol-track]").forEach(function (inp) {
        inp.addEventListener("input", function () {
          const t = self.score.tracks[Number(inp.dataset.volTrack)];
          if (t) { t.volume = Number(inp.value) / 100; self.saveDraft(); }
        });
      });
    }

    renderTrackInspector() {
      const self = this;
      const M = NS.Model;
      const $ = function (sel) { return self.root.querySelector(sel); };
      const track = this.currentTrack;
      if (!track) return;

      $("#gpTrackNameInput").value = track.name || "";
      $("#gpTrackInstrumentSelect").value = track.instrument;
      $("#gpTrackShowStaff").checked = track.showStaff !== false;
      $("#gpTrackShowTab").checked = Boolean(track.showTab);
      $("#gpTrackShowTab").disabled = !track.tuning || !track.tuning.length;

      const frettedBox = $("#gpFrettedSettings");
      const isFretted = track.tuning && track.tuning.length > 0;
      frettedBox.hidden = !isFretted;

      if (isFretted) {
        if (M.TUNING_PRESETS[track.tuningPreset]) {
          $("#gpTrackTuningPreset").value = track.tuningPreset;
        }
        $("#gpTrackCapoInput").value = String(track.capo || 0);

        const grid = $("#gpCustomTuningGrid");
        const midiChoices = [];
        for (let m = 23; m <= 72; m++) midiChoices.push({ m: m, name: M.midiToName(m) });

        grid.innerHTML = track.tuning.map(function (openMidi, sIdx) {
          const opts = midiChoices.map(function (c) {
            return '<option value="' + c.m + '"' + (c.m === openMidi ? ' selected' : '') + '>' + c.name + '</option>';
          }).join("");
          return '<label class="gp-tuning-cell"><span>第 ' + (sIdx + 1) + ' 弦</span><select data-string-tune="' + sIdx + '">' + opts + '</select></label>';
        }).join("");

        grid.querySelectorAll("[data-string-tune]").forEach(function (sel) {
          sel.addEventListener("change", function () {
            self.pushUndo();
            const sIdx = Number(sel.dataset.stringTune);
            track.tuning[sIdx] = Number(sel.value);
            track.measures.forEach(function (m) {
              m.beats.forEach(function (b) {
                b.notes.forEach(function (n) {
                  if (n.string === sIdx && n.fret != null) n.midi = M.fretToMidi(track, sIdx, n.fret);
                });
              });
            });
            self.saveDraft();
            self.renderScore();
          });
        });
      }
    }

    renderScore() {
      this.renderer.render(this.score, this.cursor, this.playhead, this.player.loopRange);
    }

    updateStatusBar() {
      const M = NS.Model;
      const el = this.root.querySelector("#gpCursorStatus");
      const track = this.currentTrack;
      const note = this.currentNote;
      const noteInfo = note
        ? ("音高 " + M.midiToName(note.midi != null ? note.midi : M.fretToMidi(track, note.string, note.fret)) +
           (note.fret != null ? (" (弦 " + (note.string + 1) + " 品 " + note.fret + ")") : ""))
        : "空拍";
      el.textContent = "音軌：" + ((track && track.name) || "-") + " · 小節 M" + (this.cursor.measureIndex + 1) + " · 拍 " + (this.cursor.beatIndex + 1) + " · " + noteInfo;
    }

    updateCloudBadge() {
      const dot = this.root.querySelector("#gpCloudDot");
      const txt = this.root.querySelector("#gpCloudStatus");
      const signedIn = NS.Storage.isCloudSignedIn();
      if (dot) dot.classList.toggle("online", signedIn);
      if (txt) txt.textContent = signedIn ? "Firebase 已連線（可隨時雲端同步）" : "本機自動儲存（登入可啟用雲端同步）";
    }
  }

  function initGPStudio() {
    const root = document.getElementById("gpStudioRoot");
    const classicPane = document.getElementById("classicScorePane");
    if (!root) return;

    let controller = null;

    // Bind Pro / Classic switcher first so mode switching always works
    const modeBtns = document.querySelectorAll("[data-score-mode]");
    const setMode = function (mode) {
      const isPro = mode !== "classic";
      root.hidden = !isPro;
      if (classicPane) classicPane.hidden = isPro;
      modeBtns.forEach(function (b) {
        const active = b.dataset.scoreMode === (isPro ? "pro" : "classic");
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", String(active));
      });
      if (!isPro && controller) controller.player.stop();
      if (isPro && controller) controller.renderScore();
      try { localStorage.setItem("nebula-score-editor-mode", isPro ? "pro" : "classic"); } catch { /* ignore */ }
    };

    modeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { setMode(btn.dataset.scoreMode); });
    });

    try {
      controller = new GPStudioController(root);
      global.nebulaGPStudio = controller;
    } catch (err) {
      console.error("[GP Studio] Init failed:", err);
      root.innerHTML =
        '<div class="theory-panel" style="padding:20px;">' +
          '<h4>⚠️ 多軌編輯器初始化發生錯誤</h4>' +
          '<p>' + String(err && err.message ? err.message : err) + '</p>' +
          '<p>可先點擊上方「經典雙欄編輯器」繼續使用原有功能。</p>' +
        '</div>';
    }

    // Re-render SVG whenever user clicks the "譜例編輯" navigation tab
    document.querySelectorAll('[data-view="scores"]').forEach(function (navBtn) {
      navBtn.addEventListener("click", function () {
        global.setTimeout(function () {
          if (controller) controller.renderScore();
        }, 40);
      });
    });

    let savedMode = "pro";
    try { savedMode = localStorage.getItem("nebula-score-editor-mode") || "pro"; } catch { /* ignore */ }
    setMode(savedMode);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGPStudio, { once: true });
  } else {
    initGPStudio();
  }
})(window);

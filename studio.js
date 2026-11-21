/* ============================================================================
   Nebula · Studio Layer (V6)
   ----------------------------------------------------------------------------
   A. 主題管理：industrial（硬體極簡工業風）/ studio（錄音室深色護眼模式）
   B. 現代微擬物觸覺控制：BPM 旋鈕、音量推桿、打擊墊（含阻尼與按下微光）
   C. 空間化模組：懸浮毛玻璃播放控制條（BPM / 節拍器 / AB 段循環）+ 無干擾練琴
   D. 視覺化：對數頻譜、泛音列、十二半音色度圖與即時和弦偵測
   E. 獨立五度圈模組
   本檔於 app.js 之後載入，沿用 app.js 的全域狀態與音訊引擎，不重複建立。
   ============================================================================ */
(function () {
  "use strict";

  const STORE_KEYS = {
    transport: "nebula-studio-transport-v1",
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function safeParse(raw, fallback) {
    try {
      const value = JSON.parse(raw);
      return value == null ? fallback : value;
    } catch {
      return fallback;
    }
  }

  function readStore(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function noteLabel(pc, preferFlats) {
    if (typeof noteName === "function") return noteName(pc, preferFlats);
    const sharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const flat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
    return (preferFlats ? flat : sharp)[((pc % 12) + 12) % 12];
  }

  function hexToRgb(hex) {
    const value = String(hex || "").trim();
    const short = value.match(/^#([0-9a-f]{3})$/i);
    if (short) {
      const [r, g, b] = short[1].split("").map((ch) => parseInt(ch + ch, 16));
      return { r, g, b };
    }
    const long = value.match(/^#([0-9a-f]{6})$/i);
    if (long) {
      const n = parseInt(long[1], 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    }
    return { r: 120, g: 200, b: 255 };
  }

  function rgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function palette() {
    const styles = getComputedStyle(document.body);
    return {
      a: (styles.getPropertyValue("--viz-a") || "#6366f1").trim(),
      b: (styles.getPropertyValue("--viz-b") || "#f59e0b").trim(),
      c: (styles.getPropertyValue("--viz-c") || "#60a5fa").trim(),
      grid: (styles.getPropertyValue("--viz-grid") || "rgba(148,163,184,.16)").trim(),
      ink: (styles.getPropertyValue("--viz-ink") || "rgba(226,232,240,.68)").trim(),
    };
  }

  /* ==========================================================================
     A. 主題管理
     ========================================================================== */
  const THEME_SEQUENCE = ["nebula", "industrial", "studio"];
  const THEME_LABELS = { nebula: "星雲", industrial: "工業", studio: "錄音室" };

  function cycleTheme() {
    if (typeof state === "undefined") return;
    const index = THEME_SEQUENCE.indexOf(state.theme);
    state.theme = THEME_SEQUENCE[(index + 1) % THEME_SEQUENCE.length] || "nebula";
    if (typeof applyTheme === "function") applyTheme();
    if (typeof persist === "function") persist();
    if (typeof showToast === "function") {
      showToast(`已切換主題：${THEME_LABELS[state.theme] || state.theme}`, "info");
    }
  }

  /* ==========================================================================
     B/C. 播放控制條
     ========================================================================== */
  const TIME_SIG_BEATS = { "4/4": 4, "3/4": 3, "2/4": 2, "6/8": 6 };

  const transport = {
    bpm: 100,
    timeSig: "4/4",
    beatsPerBar: 4,
    volume: 55,
    collapsed: false,
    playing: false,
    metronome: false,
    loop: false,
    a: 0,
    b: 2,
    cursor: 0,
    events: [],
    timer: null,
    nextBarTime: 0,
    visualBar: 0,
    visualBeat: -1,
    beatTimers: [],
    tapTimes: [],
    lastChord: "—",
  };

  const analysis = {
    active: false,
    raf: 0,
    frame: 0,
    analyser: null,
    data: null,
    smooth: null,
    bands: { low: 0, mid: 0, high: 0 },
    bandSmooth: { low: 0, mid: 0, high: 0 },
    chroma: new Float32Array(12),
    chromaSmooth: new Float32Array(12),
    detected: "—",
    drone: false,
    droneKey: "",
    droneNodes: [],
    harmonicCells: [],
    palette: null,
    lastBuildKey: "",
  };

  const fifthsState = {
    mode: "major",
    selectedPc: 0,
    playingIndex: -1,
    timers: [],
  };

  let audioAnalyser = null;
  let audioAnalyserCtx = null;
  let persistTimer = 0;
  let volumeInitialized = false;

  function getMaster() {
    try {
      if (typeof getAudioContext === "function") getAudioContext();
    } catch {
      return null;
    }
    return typeof masterGain !== "undefined" ? masterGain : null;
  }

  function masterVolumeValue(percent) {
    const normalized = clamp(Number(percent) || 0, 0, 100) / 100;
    return Math.pow(normalized, 1.55) * 0.3;
  }

  function applyVolume() {
    const master = getMaster();
    if (!master) return;
    volumeInitialized = true;
    const target = masterVolumeValue(transport.volume);
    try {
      master.gain.setTargetAtTime(target, master.context.currentTime, 0.04);
    } catch {
      master.gain.value = target;
    }
  }

  function ensureAnalyser() {
    const master = getMaster();
    if (!master) return null;
    const ctx = master.context;
    if (audioAnalyser && audioAnalyserCtx === ctx) return audioAnalyser;
    try {
      const node = ctx.createAnalyser();
      node.fftSize = 8192;
      node.smoothingTimeConstant = 0.78;
      node.minDecibels = -96;
      node.maxDecibels = -10;
      master.connect(node);
      audioAnalyser = node;
      audioAnalyserCtx = ctx;
      analysis.data = new Uint8Array(node.frequencyBinCount);
      analysis.smooth = new Float32Array(160);
      return node;
    } catch {
      return null;
    }
  }

  function chordMidisForDegree(degree) {
    let name = "";
    try {
      name = typeof degreeToChordName === "function" ? degreeToChordName(degree) : "";
    } catch {
      name = "";
    }
    let midis = [];
    try {
      midis = name && typeof chordNameToMidiSet === "function" ? chordNameToMidiSet(name) : [];
    } catch {
      midis = [];
    }
    if (!midis.length && typeof getSelectedChord === "function" && typeof getChordMidi === "function") {
      midis = getChordMidi(getSelectedChord(), 4);
      if (!name) name = getSelectedChord().name ? `C${getSelectedChord().name}` : "和弦";
    }
    return { name: name || "和弦", midis };
  }

  function refreshTransportEvents() {
    const progression = typeof state !== "undefined" && Array.isArray(state.progression) ? state.progression : [];
    const degrees = progression.length ? progression : ["Imaj7"];
    transport.events = degrees.map((degree) => ({ degree, ...chordMidisForDegree(degree) }));
    if (transport.events.length) {
      transport.a = clamp(transport.a, 0, transport.events.length - 1);
      transport.b = clamp(transport.b, 0, transport.events.length - 1);
      if (transport.b < transport.a) transport.b = transport.a;
      transport.cursor = clamp(transport.cursor, 0, transport.events.length - 1);
      transport.lastChord = transport.events[transport.cursor].name;
    }
    renderLoopTrack();
    renderTransportReadout();
  }

  function barSeconds() {
    return (60 / transport.bpm) * transport.beatsPerBar;
  }

  function ensureClock() {
    if (transport.timer) return;
    const master = getMaster();
    if (!master) return;
    transport.nextBarTime = master.context.currentTime + 0.12;
    transport.timer = window.setInterval(scheduleTick, 25);
  }

  function stopClock() {
    if (!transport.timer) return;
    window.clearInterval(transport.timer);
    transport.timer = null;
    transport.beatTimers.forEach((timer) => window.clearTimeout(timer));
    transport.beatTimers = [];
    setBeatLights(-1);
  }

  function scheduleClick(when, accent) {
    const master = getMaster();
    if (!master) return;
    const ctx = master.context;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(accent ? 1760 : 1180, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(accent ? 0.11 : 0.055, when + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
    osc.connect(gain);
    gain.connect(master);
    osc.start(when);
    osc.stop(when + 0.07);
  }

  function scheduleBarChords(when, index, barSec) {
    const event = transport.events[index];
    if (!event || !event.midis.length) return;
    const beatSec = 60 / transport.bpm;
    const mode = typeof state !== "undefined" ? state.playbackMode : "block";
    transport.lastChord = event.name;
    event.midis.slice(0, 5).forEach((midi, i) => {
      let offset = 0;
      if (mode === "arp") offset = i * Math.min(beatSec * 0.5, 0.28);
      else if (mode === "strum") offset = i * 0.028;
      try {
        triggerMidi(midi, when + offset, Math.max(0.45, barSec * 0.92), 0.82);
      } catch {
        /* ignore audio scheduling failures */
      }
    });
  }

  function advanceCursor(index) {
    const total = transport.events.length;
    if (!total) return 0;
    if (transport.loop && transport.b > transport.a) {
      return index >= transport.b ? transport.a : index + 1;
    }
    return (index + 1) % total;
  }

  function scheduleTick() {
    const master = getMaster();
    if (!master || !transport.events.length) return;
    const ctx = master.context;
    const barSec = barSeconds();
    const beatSec = 60 / transport.bpm;
    while (transport.nextBarTime < ctx.currentTime + 0.2) {
      const when = transport.nextBarTime;
      const index = transport.cursor;
      if (transport.playing) scheduleBarChords(when, index, barSec);
      if (transport.metronome) {
        for (let beat = 0; beat < transport.beatsPerBar; beat += 1) {
          scheduleClick(when + beat * beatSec, beat === 0);
        }
      }
      if (transport.playing || transport.metronome) {
        queueBeatVisuals(when, ctx.currentTime, index, beatSec);
      }
      transport.nextBarTime += barSec;
      if (transport.playing) transport.cursor = advanceCursor(index);
    }
  }

  function queueBeatVisuals(when, now, index, beatSec) {
    const lead = Math.max(0, when - now) * 1000;
    const barTimer = window.setTimeout(() => {
      transport.visualBar = index;
      renderTransportReadout();
      renderLoopTrack();
    }, lead);
    transport.beatTimers.push(barTimer);
    for (let beat = 0; beat < transport.beatsPerBar; beat += 1) {
      const timer = window.setTimeout(
        () => setBeatLights(beat),
        lead + beat * beatSec * 1000
      );
      transport.beatTimers.push(timer);
    }
    if (transport.beatTimers.length > 240) {
      transport.beatTimers = transport.beatTimers.slice(-160);
    }
  }

  function setBeatLights(beat) {
    const leds = $$("#beatLeds .beat-led");
    leds.forEach((led, index) => {
      led.classList.toggle("on", index === beat);
      led.classList.toggle("accent", index === beat && index === 0);
    });
    transport.visualBeat = beat;
  }

  function currentBarIndex() {
    if (transport.playing) return transport.visualBar;
    return transport.cursor;
  }

  function renderTransportReadout() {
    const position = $("#transportPosition");
    const total = transport.events.length || 1;
    const index = transport.playing ? transport.visualBar : transport.cursor;
    if (position) {
      const range = transport.loop ? `A${transport.a + 1}–B${transport.b + 1} · ` : "";
      position.textContent = `${range}${index + 1} / ${total}`;
    }
    const nameEl = $("#transportChordName");
    const event = transport.events[index] || transport.events[0];
    const label = transport.playing ? transport.lastChord : event ? event.name : "—";
    if (nameEl) nameEl.textContent = transport.metronome && !transport.playing ? "節拍器" : label;
  }

  function renderBeatLeds() {
    const wrap = $("#beatLeds");
    if (!wrap) return;
    wrap.innerHTML = Array.from({ length: transport.beatsPerBar })
      .map((unused, index) => `<span class="beat-led${index === 0 ? " accent" : ""}"></span>`)
      .join("");
  }

  function renderLoopTrack() {
    const track = $("#loopTrack");
    if (!track) return;
    const total = transport.events.length;
    if (!total) {
      track.innerHTML = "";
      return;
    }
    const segments = transport.events
      .map((event, index) => {
        const inRange = transport.loop && index >= transport.a && index <= transport.b;
        const isCurrent = index === (transport.playing ? transport.visualBar : transport.cursor);
        const label = String(event.name || "").slice(0, 7);
        return `<button type="button" class="loop-seg${inRange ? " in-range" : ""}${isCurrent ? " current" : ""}" data-transport-bar="${index}" title="${event.name}（第 ${index + 1} 小節）" aria-label="跳到第 ${index + 1} 小節 ${event.name}">${label || index + 1}</button>`;
      })
      .join("");
    const markers = transport.loop
      ? `<i class="loop-marker" style="left:${(transport.a / total) * 100}%"><span>A</span></i><i class="loop-marker" style="left:${((transport.b + 1) / total) * 100}%"><span>B</span></i>`
      : "";
    track.innerHTML = `${segments}${markers}`;
  }

  function setBpm(value, opts = {}) {
    const next = Math.round(clamp(Number(value) || 100, 40, 220));
    transport.bpm = next;
    const readout = $("#bpmReadout");
    if (readout) readout.textContent = String(next);
    const knob = $("#bpmKnob");
    if (knob) {
      const ratio = (next - 40) / 180;
      knob.style.setProperty("--angle", `${-135 + ratio * 270}deg`);
      knob.setAttribute("aria-valuenow", String(next));
      knob.setAttribute("aria-valuetext", `${next} BPM`);
    }
    if (typeof state !== "undefined") state.scoreBpm = next;
    const scoreInput = $("#scoreBpm");
    if (scoreInput && String(scoreInput.value) !== String(next)) scoreInput.value = String(next);
    if (!opts.silent) schedulePersist();
  }

  function schedulePersist() {
    window.clearTimeout(persistTimer);
    persistTimer = window.setTimeout(persistTransport, 260);
  }

  function persistTransport() {
    try {
      localStorage.setItem(
        STORE_KEYS.transport,
        JSON.stringify({
          bpm: transport.bpm,
          timeSig: transport.timeSig,
          volume: transport.volume,
          collapsed: transport.collapsed,
          a: transport.a,
          b: transport.b,
        })
      );
    } catch {
      /* ignore storage restrictions */
    }
  }

  function startTransport() {
    if (!transport.events.length) refreshTransportEvents();
    if (transport.loop && transport.b > transport.a) {
      const index = transport.playing ? transport.visualBar : transport.cursor;
      if (index < transport.a || index > transport.b) transport.cursor = transport.a;
    }
    transport.playing = true;
    const button = $("#transportPlayBtn");
    if (button) {
      button.setAttribute("aria-pressed", "true");
      const icon = $(".pad-icon", button);
      if (icon) icon.textContent = "❚❚";
    }
    ensureClock();
    renderTransportReadout();
    renderLoopTrack();
  }

  function pauseTransport() {
    transport.playing = false;
    const button = $("#transportPlayBtn");
    if (button) {
      button.setAttribute("aria-pressed", "false");
      const icon = $(".pad-icon", button);
      if (icon) icon.textContent = "▶";
    }
    if (!transport.metronome) stopClock();
    setBeatLights(-1);
    renderTransportReadout();
    renderLoopTrack();
  }

  function stopTransport() {
    pauseTransport();
    transport.cursor = transport.loop && transport.b > transport.a ? transport.a : 0;
    transport.visualBar = transport.cursor;
    transport.playing = false;
    setBeatLights(-1);
    renderTransportReadout();
    renderLoopTrack();
  }

  function toggleMetronome() {
    transport.metronome = !transport.metronome;
    const button = $("#metronomeBtn");
    if (button) button.setAttribute("aria-pressed", String(transport.metronome));
    if (transport.metronome) {
      ensureClock();
      if (!transport.playing) showToast("節拍器已啟動 · 可搭配 BPM 旋鈕調整速度", "info");
    } else if (!transport.playing) {
      stopClock();
    }
    renderTransportReadout();
  }

  function setLoopMarker(which) {
    const index = currentBarIndex();
    if (which === "a") {
      transport.a = index;
      if (transport.b < transport.a) transport.b = Math.min(transport.events.length - 1, transport.a + 1);
    } else {
      transport.b = index;
      if (transport.b < transport.a) transport.a = Math.max(0, transport.b - 1);
    }
    transport.loop = transport.b > transport.a ? true : transport.loop;
    const loopBtn = $("#loopToggleBtn");
    if (loopBtn) loopBtn.setAttribute("aria-pressed", String(transport.loop));
    renderLoopTrack();
    renderTransportReadout();
    schedulePersist();
    if (typeof showToast === "function") {
      showToast(
        `AB 段：A${transport.a + 1} → B${transport.b + 1}${transport.loop ? "（循環中）" : ""}`,
        "info"
      );
    }
  }

  function toggleLoop() {
    if (transport.b <= transport.a) {
      transport.b = Math.min(transport.events.length - 1, transport.a + 1);
    }
    transport.loop = !transport.loop;
    const loopBtn = $("#loopToggleBtn");
    if (loopBtn) loopBtn.setAttribute("aria-pressed", String(transport.loop));
    renderLoopTrack();
    schedulePersist();
    if (typeof showToast === "function") {
      showToast(transport.loop ? `AB 循環開啟：第 ${transport.a + 1}–${transport.b + 1} 小節` : "AB 循環關閉", "info");
    }
  }

  let collapsedBeforePractice = null;

  function togglePractice(force) {
    const next = typeof force === "boolean" ? force : !document.body.classList.contains("practice-mode");
    document.body.classList.toggle("practice-mode", next);
    const exit = $("#practiceExitBtn");
    if (exit) exit.hidden = !next;
    const button = $("#practiceModeBtn");
    if (button) button.setAttribute("aria-pressed", String(next));
    if (next) {
      collapsedBeforePractice = transport.collapsed;
      setCollapsed(true, { silent: true });
      if (typeof showToast === "function") showToast("已進入無干擾練琴模式 · Esc 或 Alt + P 退出", "info");
    } else {
      setCollapsed(collapsedBeforePractice === null ? transport.collapsed : collapsedBeforePractice, { silent: true });
      collapsedBeforePractice = null;
      if (typeof showToast === "function") showToast("已回到完整介面", "info");
    }
  }

  function setCollapsed(collapsed, opts = {}) {
    transport.collapsed = !!collapsed;
    const bar = $("#transportBar");
    if (bar) bar.classList.toggle("collapsed", transport.collapsed);
    const toggle = $("#transportCollapseBtn");
    if (toggle) {
      toggle.setAttribute("aria-expanded", String(!transport.collapsed));
      toggle.textContent = transport.collapsed ? "⌃" : "⌄";
      toggle.title = transport.collapsed ? "展開控制條" : "收合控制條";
    }
    if (!opts.silent) schedulePersist();
  }

  function tapTempo() {
    const now = performance.now();
    if (transport.tapTimes.length && now - transport.tapTimes[transport.tapTimes.length - 1] > 2400) {
      transport.tapTimes = [];
    }
    transport.tapTimes.push(now);
    if (transport.tapTimes.length > 5) transport.tapTimes.shift();
    if (transport.tapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < transport.tapTimes.length; i += 1) {
        intervals.push(transport.tapTimes[i] - transport.tapTimes[i - 1]);
      }
      const avg = intervals.reduce((sum, value) => sum + value, 0) / intervals.length;
      if (avg > 200) setBpm(Math.round(60000 / avg));
    }
  }

  function bindKnob() {
    const knob = $("#bpmKnob");
    if (!knob) return;
    let drag = null;

    knob.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      drag = { y: event.clientY, bpm: transport.bpm };
      try {
        knob.setPointerCapture(event.pointerId);
      } catch {
        /* ignore pointer capture failures */
      }
      knob.classList.add("dragging");
    });
    knob.addEventListener("pointermove", (event) => {
      if (!drag) return;
      const delta = Math.round((drag.y - event.clientY) * 0.7);
      setBpm(drag.bpm + delta);
    });
    const endDrag = () => {
      if (!drag) return;
      drag = null;
      knob.classList.remove("dragging");
      persistTransport();
    };
    knob.addEventListener("pointerup", endDrag);
    knob.addEventListener("pointercancel", endDrag);
    knob.addEventListener("lostpointercapture", endDrag);

    knob.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        setBpm(transport.bpm + (event.deltaY > 0 ? -1 : 1));
      },
      { passive: false }
    );

    knob.addEventListener("keydown", (event) => {
      const keys = {
        ArrowUp: 1,
        ArrowRight: 1,
        ArrowDown: -1,
        ArrowLeft: -1,
        PageUp: 10,
        PageDown: -10,
      };
      if (event.key === "Home") {
        event.preventDefault();
        setBpm(40);
      } else if (event.key === "End") {
        event.preventDefault();
        setBpm(220);
      } else if (keys[event.key]) {
        event.preventDefault();
        setBpm(transport.bpm + keys[event.key]);
      }
    });

    knob.addEventListener("dblclick", () => setBpm(100));
  }

  function bindTransport() {
    $("#transportPlayBtn")?.addEventListener("click", () => {
      if (transport.playing) pauseTransport();
      else startTransport();
    });
    $("#transportStopBtn")?.addEventListener("click", stopTransport);
    $("#metronomeBtn")?.addEventListener("click", toggleMetronome);
    $("#loopABtn")?.addEventListener("click", () => setLoopMarker("a"));
    $("#loopBBtn")?.addEventListener("click", () => setLoopMarker("b"));
    $("#loopToggleBtn")?.addEventListener("click", toggleLoop);
    $("#loopClearBtn")?.addEventListener("click", () => {
      transport.a = 0;
      transport.b = Math.max(0, Math.min(transport.events.length - 1, 1));
      transport.loop = false;
      const loopBtn = $("#loopToggleBtn");
      if (loopBtn) loopBtn.setAttribute("aria-pressed", "false");
      renderLoopTrack();
      schedulePersist();
    });
    $("#loopTrack")?.addEventListener("click", (event) => {
      const segment = event.target.closest("[data-transport-bar]");
      if (!segment) return;
      const index = Number(segment.dataset.transportBar);
      if (!Number.isFinite(index)) return;
      transport.cursor = index;
      renderLoopTrack();
      renderTransportReadout();
    });
    $("#tapTempoBtn")?.addEventListener("click", tapTempo);
    $("#transportCollapseBtn")?.addEventListener("click", () => setCollapsed(!transport.collapsed));
    $("#practiceModeBtn")?.addEventListener("click", () => togglePractice());
    $("#practiceExitBtn")?.addEventListener("click", () => togglePractice(false));

    const timeSig = $("#transportTimeSig");
    if (timeSig) {
      timeSig.value = transport.timeSig;
      timeSig.addEventListener("change", () => {
        transport.timeSig = TIME_SIG_BEATS[timeSig.value] ? timeSig.value : "4/4";
        transport.beatsPerBar = TIME_SIG_BEATS[transport.timeSig];
        renderBeatLeds();
        schedulePersist();
      });
    }

    const volume = $("#masterVolume");
    if (volume) {
      volume.value = String(transport.volume);
      const output = $("#volumeReadout");
      if (output) output.textContent = String(transport.volume);
      volume.addEventListener("input", () => {
        transport.volume = clamp(Number(volume.value) || 0, 0, 100);
        if (output) output.textContent = String(transport.volume);
        applyVolume();
        schedulePersist();
      });
    }

    bindKnob();
  }

  /* ==========================================================================
     D. 視覺化：頻譜 / 泛音 / 色度圖
     ========================================================================== */
  const BAND_RANGES = [
    { key: "low", label: "低頻 Low", range: [20, 250], text: "20–250 Hz · 鼓與貝斯基礎" },
    { key: "mid", label: "中頻 Mid", range: [250, 4000], text: "250 Hz–4 kHz · 人聲與和聲主體" },
    { key: "high", label: "高頻 High", range: [4000, 20000], text: "4–20 kHz · 泛音與空氣感" },
  ];

  function renderBandMeters() {
    const wrap = $("#bandMeters");
    if (!wrap) return;
    wrap.innerHTML = BAND_RANGES.map(
      (band) => `
        <div class="band-meter ${band.key}">
          <div class="band-meter-head"><span>${band.label}</span><strong data-band-value="${band.key}">0%</strong></div>
          <div class="band-meter-track"><div class="band-meter-fill" data-band-fill="${band.key}"></div></div>
          <small>${band.text}</small>
        </div>
      `
    ).join("");
  }

  function buildChromaWheel() {
    const host = $("#chromaWheel");
    if (!host) return;
    const cx = 150;
    const cy = 150;
    const outer = 112;
    const inner = 46;
    const sectorPath = (r0, r1, a0, a1) => {
      const point = (radius, angle) => {
        const rad = (angle * Math.PI) / 180;
        return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
      };
      const [x0, y0] = point(r1, a0);
      const [x1, y1] = point(r1, a1);
      const [x2, y2] = point(r0, a1);
      const [x3, y3] = point(r0, a0);
      return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r1} ${r1} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} A${r0} ${r0} 0 0 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`;
    };
    const segments = Array.from({ length: 12 })
      .map((unused, index) => {
        const start = -90 + index * 30 - 15;
        const end = start + 30;
        const mid = start + 15;
        const rad = (mid * Math.PI) / 180;
        const labelRadius = 130;
        const lx = cx + labelRadius * Math.cos(rad);
        const ly = cy + labelRadius * Math.sin(rad);
        return `
          <g class="chroma-seg" data-chroma-pc="${index}">
            <path d="${sectorPath(inner, outer, start, end)}" fill="rgba(148,163,184,0.16)"></path>
            <text class="chroma-note-label" x="${lx.toFixed(1)}" y="${(ly + 4).toFixed(1)}" data-chroma-label="${index}">${noteLabel(index, state.useFlats)}</text>
          </g>
        `;
      })
      .join("");
    host.innerHTML = `
      <svg viewBox="0 0 300 300" role="img" aria-label="十二半音色度轮">
        ${segments}
        <circle class="chroma-center-disc" cx="150" cy="150" r="38" stroke="rgba(148,163,184,0.24)"></circle>
        <text x="150" y="146" text-anchor="middle" fill="currentColor" font-size="15" font-weight="700" data-chroma-center="">—</text>
        <text x="150" y="164" text-anchor="middle" fill="currentColor" font-size="8" opacity="0.6" letter-spacing="1">DETECTED</text>
      </svg>
    `;
    $$("[data-chroma-pc]", host).forEach((group) => {
      group.addEventListener("click", () => {
        const pc = Number(group.dataset.chromaPc);
        const chordPcs = currentChordPcs();
        if (!chordPcs.has(pc)) return;
        playPitchClass(pc);
      });
    });
  }

  function buildChromaBars() {
    const host = $("#chromaBars");
    if (!host) return;
    host.innerHTML = Array.from({ length: 12 })
      .map((unused, index) => {
        return `
          <div class="chroma-bar-col" data-chroma-bar="${index}">
            <div class="chroma-bar-track"><div class="chroma-bar-fill" style="height:0%"></div></div>
            <span class="chroma-bar-name">${noteLabel(index, state.useFlats)}</span>
          </div>
        `;
      })
      .join("");
  }

  function currentChordPcs() {
    try {
      const chord = getSelectedChord();
      return getChordPitchClasses(chord);
    } catch {
      return new Set();
    }
  }

  function playPitchClass(pc) {
    try {
      const midi = 60 + ((pc % 12) + 12) % 12;
      const ctx = getAudioContext();
      triggerMidi(midi, ctx.currentTime + 0.02, 0.7, 0.8);
    } catch {
      /* ignore */
    }
  }

  function harmonicLayout(chord) {
    const rootPc = typeof state !== "undefined" ? state.root : 0;
    const intervals = chord && Array.isArray(chord.intervals) ? chord.intervals : [0, 4, 7];
    return intervals.slice(0, 4).map((interval) => {
      const pc = ((rootPc + interval) % 12 + 12) % 12;
      const midi = 48 + pc;
      const frequency = 440 * Math.pow(2, (midi - 69) / 12);
      return {
        pc,
        midi,
        frequency,
        name: noteLabel(pc, state.useFlats),
        label: interval === 0 ? "根音" : `${interval} 半音`,
        partials: Array.from({ length: 8 }, (unused, index) => frequency * (index + 1)),
      };
    });
  }

  function renderHarmonicMatrix(force) {
    const host = $("#harmonicMatrix");
    if (!host) return;
    let chord;
    try {
      chord = getSelectedChord();
    } catch {
      return;
    }
    const key = `${chord.id}-${state.root}-${state.useFlats}`;
    if (!force && key === analysis.lastBuildKey) return;
    analysis.lastBuildKey = key;
    const rows = harmonicLayout(chord);
    host.innerHTML = rows
      .map((row, rowIndex) => {
        const bars = Array.from({ length: 8 })
          .map(
            (unused, index) =>
              `<div class="harmonic-bar" data-harmonic-bar="${rowIndex}-${index}"><i style="height:0%"></i></div>`
          )
          .join("");
        return `
          <div class="harmonic-row">
            <span class="harmonic-label"><strong>${row.name}</strong>${row.label}</span>
            <div class="harmonic-bars">${bars}</div>
            <span class="harmonic-level" data-harmonic-level="${rowIndex}">${row.frequency.toFixed(1)} Hz</span>
          </div>
        `;
      })
      .join("");
    const sub = $("#harmonicSub");
    if (sub) {
      const root = rows[0];
      sub.textContent = root
        ? `目前和弦 ${typeof getChordDisplayName === "function" ? getChordDisplayName(chord) : chord.name} · ${root.name}${Math.floor(root.midi / 12) - 1} 基頻 ${root.frequency.toFixed(1)} Hz`
        : "目前和弦 —";
    }
    analysis.harmonicCells = rows.map((row, rowIndex) => ({
      row,
      bars: Array.from({ length: 8 }, (unused, index) => $(`[data-harmonic-bar="${rowIndex}-${index}"] i`)),
      level: $(`[data-harmonic-level="${rowIndex}"]`),
    }));
  }

  function renderChromaReadout(detected) {
    const host = $("#chromaReadout");
    if (!host) return;
    let chord;
    try {
      chord = getSelectedChord();
    } catch {
      return;
    }
    const pcs = Array.from(currentChordPcs()).sort((a, b) => a - b);
    const chordName = typeof getChordDisplayName === "function" ? getChordDisplayName(chord) : chord.name;
    host.innerHTML = `
      <div>
        <h5>即時偵測 Detected</h5>
        <div class="chroma-detected" data-chroma-detected>${detected || "—"}</div>
      </div>
      <div>
        <h5>目前和弦 ${chordName}</h5>
        <div class="chroma-tones">
          ${pcs
            .map(
              (pc) =>
                `<span class="chroma-tone-chip on" data-chord-tone="${pc}">${noteLabel(pc, state.useFlats)}<small>·${pc}</small></span>`
            )
            .join("")}
        </div>
      </div>
      <p>色度圖把 FFT 能量依音高類別累加：柱越高代表該半音在當下聲音中越強。與和弦理論音對照，可以教學「聽到的」與「理論上的」差異。</p>
    `;
    const badge = $("#chromaChordBadge");
    if (badge) badge.textContent = `和弦理論音：${pcs.map((pc) => noteLabel(pc, state.useFlats)).join(" ")}`;
  }

  function initAnalysisChrome() {
    renderBandMeters();
    buildChromaWheel();
    buildChromaBars();
    renderHarmonicMatrix(true);
    renderChromaReadout("—");
  }

  function updateChordHighlight() {
    const pcs = currentChordPcs();
    $$("[data-chroma-pc]").forEach((group) => {
      group.classList.toggle("chord", pcs.has(Number(group.dataset.chromaPc)));
    });
    $$("[data-chroma-bar]").forEach((col) => {
      col.classList.toggle("chord", pcs.has(Number(col.dataset.chromaBar)));
    });
    const badge = $("#chromaBadge");
    if (badge) badge.textContent = Array.from(pcs).map((pc) => noteLabel(pc, state.useFlats)).join(" ");
  }

  function ensureAnalysisLoop() {
    if (!analysis.active) return;
    analysis.analyser = ensureAnalyser();
    analysis.palette = palette();
    if (analysis.raf) return;
    const step = () => {
      analysis.raf = window.requestAnimationFrame(step);
      if (document.hidden) return;
      drawSpectrum();
      updateLiveReadouts();
    };
    analysis.raf = window.requestAnimationFrame(step);
  }

  function stopAnalysisLoop() {
    if (analysis.raf) window.cancelAnimationFrame(analysis.raf);
    analysis.raf = 0;
  }

  function findBandPeak(data, sampleRate, fftSize, low, high) {
    const binHz = sampleRate / fftSize;
    const start = Math.max(0, Math.floor(low / binHz));
    const end = Math.min(data.length - 1, Math.ceil(high / binHz));
    let peak = 0;
    for (let i = start; i <= end; i += 1) {
      if (data[i] > peak) peak = data[i];
    }
    return peak / 255;
  }

  function drawSpectrum() {
    const canvas = $("#spectrumCanvas");
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const targetWidth = Math.max(1, Math.round(rect.width * dpr));
    const targetHeight = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    const width = rect.width;
    const height = rect.height;
    const pal = analysis.palette || (analysis.palette = palette());
    ctx2d.clearRect(0, 0, width, height);

    const pad = { left: 26, right: 10, top: 12, bottom: 22 };
    const plotW = Math.max(10, width - pad.left - pad.right);
    const plotH = Math.max(10, height - pad.top - pad.bottom);
    const minF = 20;
    const maxF = 20000;
    const logMin = Math.log10(minF);
    const logMax = Math.log10(maxF);
    const xFor = (freq) => pad.left + ((Math.log10(freq) - logMin) / (logMax - logMin)) * plotW;

    // 網格：對數座標
    ctx2d.strokeStyle = pal.grid;
    ctx2d.lineWidth = 1;
    ctx2d.font = '9px "JetBrains Mono", ui-monospace, monospace';
    ctx2d.fillStyle = pal.ink;
    ctx2d.textAlign = "center";
    [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000].forEach((freq) => {
      const x = Math.round(xFor(freq)) + 0.5;
      ctx2d.beginPath();
      ctx2d.moveTo(x, pad.top);
      ctx2d.lineTo(x, pad.top + plotH);
      ctx2d.stroke();
      const label = freq >= 1000 ? `${freq / 1000}k` : String(freq);
      ctx2d.fillText(label, x, height - 6);
    });
    for (let i = 0; i <= 4; i += 1) {
      const y = Math.round(pad.top + (plotH * i) / 4) + 0.5;
      ctx2d.beginPath();
      ctx2d.moveTo(pad.left, y);
      ctx2d.lineTo(pad.left + plotW, y);
      ctx2d.stroke();
    }

    const node = analysis.analyser;
    const total = 128;
    const points = [];
    let hasSignal = false;
    if (node && analysis.data) {
      node.getByteFrequencyData(analysis.data);
      const sampleRate = node.context.sampleRate;
      const binHz = sampleRate / node.fftSize;
      for (let i = 0; i < total; i += 1) {
        const f0 = minF * Math.pow(maxF / minF, i / total);
        const f1 = minF * Math.pow(maxF / minF, (i + 1) / total);
        const lowBin = Math.max(0, Math.floor(f0 / binHz));
        const highBin = Math.min(analysis.data.length - 1, Math.max(lowBin, Math.floor(f1 / binHz)));
        let sum = 0;
        for (let b = lowBin; b <= highBin; b += 1) sum += analysis.data[b];
        const raw = sum / Math.max(1, highBin - lowBin + 1) / 255;
        const previous = analysis.smooth ? analysis.smooth[i] || 0 : 0;
        const value = Math.max(raw, previous * 0.86);
        if (analysis.smooth) analysis.smooth[i] = value;
        if (value > 0.02) hasSignal = true;
        points.push({ x: xFor(f0), y: pad.top + plotH - value * plotH, value, freq: f0 });
      }
    } else {
      for (let i = 0; i < total; i += 1) {
        const f0 = minF * Math.pow(maxF / minF, i / total);
        points.push({ x: xFor(f0), y: pad.top + plotH, value: 0, freq: f0 });
      }
    }

    // 頻段底色
    const bandColors = [
      { range: [20, 250], color: pal.b },
      { range: [250, 4000], color: pal.a },
      { range: [4000, 20000], color: pal.c },
    ];
    bandColors.forEach((band) => {
      const x0 = xFor(band.range[0]);
      const x1 = xFor(band.range[1]);
      const gradient = ctx2d.createLinearGradient(0, pad.top, 0, pad.top + plotH);
      gradient.addColorStop(0, rgba(band.color, 0.12));
      gradient.addColorStop(1, rgba(band.color, 0.01));
      ctx2d.fillStyle = gradient;
      ctx2d.fillRect(x0, pad.top, Math.max(1, x1 - x0), plotH);
    });

    // 柱狀能量
    const barWidth = plotW / total;
    points.forEach((point, index) => {
      if (point.value <= 0.001) return;
      const color = index < total * 0.34 ? pal.b : index < total * 0.85 ? pal.a : pal.c;
      const barH = Math.max(1, point.value * plotH);
      const gradient = ctx2d.createLinearGradient(0, pad.top + plotH - barH, 0, pad.top + plotH);
      gradient.addColorStop(0, rgba(color, 0.92));
      gradient.addColorStop(1, rgba(color, 0.18));
      ctx2d.fillStyle = gradient;
      ctx2d.fillRect(point.x, pad.top + plotH - barH, Math.max(1, barWidth * 0.82), barH);
    });

    // 訊號線（示波器風格）
    ctx2d.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx2d.moveTo(point.x, point.y);
      else ctx2d.lineTo(point.x, point.y);
    });
    ctx2d.strokeStyle = rgba(pal.a, 0.9);
    ctx2d.lineWidth = 1.4;
    ctx2d.shadowColor = rgba(pal.a, 0.65);
    ctx2d.shadowBlur = 10;
    ctx2d.stroke();
    ctx2d.shadowBlur = 0;

    // 高頻閃爍點
    if (hasSignal) {
      const peak = points.reduce((best, point) => (point.value > best.value ? point : best), points[0]);
      if (peak && peak.value > 0.05) {
        ctx2d.beginPath();
        ctx2d.arc(peak.x, peak.y, 2.4, 0, Math.PI * 2);
        ctx2d.fillStyle = rgba(pal.b, 0.95);
        ctx2d.shadowColor = pal.b;
        ctx2d.shadowBlur = 12;
        ctx2d.fill();
        ctx2d.shadowBlur = 0;
      }
    }

    // 頻段能量：以峰值為主，較能反映低頻／高頻是否真的有訊號
    if (node && analysis.data) {
      const sampleRate = node.context.sampleRate;
      const bands = {
        low: findBandPeak(analysis.data, sampleRate, node.fftSize, 20, 250),
        mid: findBandPeak(analysis.data, sampleRate, node.fftSize, 250, 4000),
        high: findBandPeak(analysis.data, sampleRate, node.fftSize, 4000, 20000),
      };
      analysis.bands = bands;
      BAND_RANGES.forEach((band) => {
        const target = Math.pow(clamp(bands[band.key], 0, 1), 0.85);
        analysis.bandSmooth[band.key] = analysis.bandSmooth[band.key] * 0.6 + target * 0.4;
        const value = Math.round(clamp(analysis.bandSmooth[band.key] * 105, 0, 100));
        const fill = $(`[data-band-fill="${band.key}"]`);
        const label = $(`[data-band-value="${band.key}"]`);
        if (fill) fill.style.width = `${value}%`;
        if (label) label.textContent = `${value}%`;
      });
    }

    const empty = $("#spectrumEmpty");
    if (empty) empty.classList.toggle("hidden", hasSignal || transport.drone);
  }

  function updateLiveReadouts() {
    analysis.frame += 1;
    const node = analysis.analyser;
    if (!node || !analysis.data) {
      if (analysis.frame % 12 === 0 && !transport.drone) renderHarmonicLevels(0);
      return;
    }
    if (analysis.frame % 2 === 0) updateChromaFromSpectrum(node);
    if (analysis.frame % 6 === 0) {
      updateChordHighlight();
      updateChromaBars();
      const detectedEl = $("[data-chroma-detected]");
      if (detectedEl) detectedEl.textContent = analysis.detected;
      const detectedBadge = $("#chromaDetectedBadge");
      if (detectedBadge) detectedBadge.textContent = `即時偵測：${analysis.detected}`;
    }
    if (analysis.frame % 10 === 0) renderHarmonicLevels();
  }

  function updateChromaFromSpectrum(node) {
    node.getByteFrequencyData(analysis.data);
    const sampleRate = node.context.sampleRate;
    const binHz = sampleRate / node.fftSize;
    const next = new Float32Array(12);
    const low = 55;
    const high = 1200;
    const data = analysis.data;
    // 只取頻譜局部峰值（含拋物線內插），避免低頻強峰的旁瓣污染半音能量
    for (let i = 2; i < data.length - 1; i += 1) {
      const freq = i * binHz;
      if (freq < low || freq > high) continue;
      const value = data[i];
      if (value < 38) continue;
      if (value < data[i - 1] || value < data[i + 1]) continue;
      const prev = data[i - 1];
      const nextValue = data[i + 1];
      const denom = prev - 2 * value + nextValue;
      const delta = denom !== 0 ? (prev - nextValue) / (2 * denom) : 0;
      const peakFreq = (i + Math.max(-0.5, Math.min(0.5, delta))) * binHz;
      const midi = 69 + 12 * Math.log2(peakFreq / 440);
      const pc = ((Math.round(midi) % 12) + 12) % 12;
      const magnitude = value / 255;
      const weight = 1 / (1 + peakFreq / 320);
      next[pc] += magnitude * magnitude * weight;
    }
    let max = 0;
    for (let i = 0; i < 12; i += 1) max = Math.max(max, next[i]);
    const normalized = new Float32Array(12);
    if (max > 0) {
      for (let i = 0; i < 12; i += 1) {
        normalized[i] = next[i] / max;
        analysis.chromaSmooth[i] = analysis.chromaSmooth[i] * 0.62 + normalized[i] * 0.38;
      }
    } else {
      for (let i = 0; i < 12; i += 1) analysis.chromaSmooth[i] *= 0.9;
    }
    analysis.chroma = analysis.chromaSmooth;
    analysis.detected = detectChord(analysis.chromaSmooth);
  }

  function updateChromaBars() {
    $$("[data-chroma-bar]").forEach((col) => {
      const index = Number(col.dataset.chromaBar);
      const value = analysis.chromaSmooth[index] || 0;
      const fill = $(".chroma-bar-fill", col);
      if (fill) fill.style.height = `${Math.round(clamp(value, 0, 1) * 100)}%`;
    });
    $$("[data-chroma-pc]").forEach((group) => {
      const index = Number(group.dataset.chromaPc);
      const value = clamp(analysis.chromaSmooth[index] || 0, 0, 1);
      const path = $("path", group);
      if (!path) return;
      const pal = analysis.palette || (analysis.palette = palette());
      path.setAttribute("fill", rgba(pal.a, 0.12 + value * 0.68));
    });
    const center = $("[data-chroma-center]");
    if (center) center.textContent = analysis.detected;
  }

  function renderHarmonicLevels(idleOnly) {
    if (!analysis.harmonicCells.length) return;
    const node = analysis.analyser;
    const pal = analysis.palette || (analysis.palette = palette());
    analysis.harmonicCells.forEach((cell, rowIndex) => {
      let maxLevel = 0;
      cell.bars.forEach((bar, index) => {
        if (!bar) return;
        let level = 0;
        if (node && analysis.data && !idleOnly) {
          const freq = cell.row.partials[index];
          const binHz = node.context.sampleRate / node.fftSize;
          const bin = Math.round(freq / binHz);
          if (bin >= 0 && bin < analysis.data.length) {
            let sum = 0;
            let count = 0;
            for (let offset = -1; offset <= 1; offset += 1) {
              const b = bin + offset;
              if (b >= 0 && b < analysis.data.length) {
                sum += analysis.data[b];
                count += 1;
              }
            }
            level = count ? sum / count / 255 : 0;
          }
        }
        const theory = 1 / (index + 1);
        const height = idleOnly ? 0 : clamp(level * 2.4, 0, 1) * 100;
        bar.style.height = `${Math.max(height, theory * 8)}%`;
        bar.style.opacity = idleOnly ? "0.3" : "1";
        maxLevel = Math.max(maxLevel, level);
      });
      if (cell.level) {
        cell.level.textContent = idleOnly
          ? `${cell.row.frequency.toFixed(1)} Hz`
          : `${(maxLevel * 100).toFixed(0)}%`;
        cell.level.style.color = maxLevel > 0.4 ? pal.b : "";
      }
    });
  }

  const CHORD_TEMPLATES = [
    { suffix: "", intervals: [0, 4, 7] },
    { suffix: "m", intervals: [0, 3, 7] },
    { suffix: "dim", intervals: [0, 3, 6] },
    { suffix: "aug", intervals: [0, 4, 8] },
    { suffix: "7", intervals: [0, 4, 7, 10] },
    { suffix: "maj7", intervals: [0, 4, 7, 11] },
    { suffix: "m7", intervals: [0, 3, 7, 10] },
    { suffix: "m7b5", intervals: [0, 3, 6, 10] },
    { suffix: "dim7", intervals: [0, 3, 6, 9] },
    { suffix: "6", intervals: [0, 4, 7, 9] },
    { suffix: "sus4", intervals: [0, 5, 7] },
  ];

  function detectChord(chroma) {
    const floor = 0.16;
    const cleaned = new Float32Array(12);
    let total = 0;
    for (let i = 0; i < 12; i += 1) {
      cleaned[i] = chroma[i] > floor ? chroma[i] - floor : 0;
      total += cleaned[i];
    }
    if (total < 0.6) return "—";
    let best = { score: -Infinity, name: "" };
    for (let root = 0; root < 12; root += 1) {
      CHORD_TEMPLATES.forEach((template) => {
        const pcs = new Set(template.intervals.map((interval) => (root + interval) % 12));
        let inChord = 0;
        let outside = 0;
        for (let i = 0; i < 12; i += 1) {
          if (pcs.has(i)) inChord += cleaned[i];
          else outside += cleaned[i];
        }
        const coverage = inChord / template.intervals.length;
        const purity = inChord / (inChord + outside + 0.0001);
        const score = purity * 0.72 + Math.min(1, coverage) * 0.18 + cleaned[root] * 0.1;
        if (score > best.score) {
          best = { score, name: `${noteLabel(root, state.useFlats)}${template.suffix}` };
        }
      });
    }
    return best.score > 0.62 ? best.name : "—";
  }

  function startDrone() {
    const master = getMaster();
    if (!master) return;
    stopDrone();
    let chord;
    try {
      chord = getSelectedChord();
    } catch {
      return;
    }
    const midis = typeof getChordMidi === "function" ? getChordMidi(chord, 3) : [];
    const ctx = master.context;
    midis.slice(0, 4).forEach((midi) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "triangle";
      osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      filter.type = "lowpass";
      filter.frequency.value = 3000;
      filter.Q.value = 0.5;
      gain.gain.value = 0;
      gain.gain.setTargetAtTime(0.045, ctx.currentTime, 0.08);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      osc.start();
      analysis.droneNodes.push(osc, gain);
    });
    analysis.droneKey = `${chord.id}-${state.root}`;
    analysis.drone = true;
    const button = $("#analyserDroneBtn");
    if (button) {
      button.setAttribute("aria-pressed", "true");
      button.textContent = "⏹ 停止持續音";
    }
  }

  function stopDrone() {
    analysis.droneNodes.forEach((node) => {
      try {
        if (typeof node.stop === "function") node.stop();
        node.disconnect();
      } catch {
        /* ignore */
      }
    });
    analysis.droneNodes = [];
    analysis.drone = false;
    analysis.droneKey = "";
    const button = $("#analyserDroneBtn");
    if (button) {
      button.setAttribute("aria-pressed", "false");
      button.textContent = "⏻ 持續發聲";
    }
  }

  function bindAnalysis() {
    $("#analyserDroneBtn")?.addEventListener("click", () => {
      if (analysis.drone) stopDrone();
      else startDrone();
    });
    $("#analyserPlayChordBtn")?.addEventListener("click", () => {
      try {
        const chord = getSelectedChord();
        playChordNotes(getChordNoteNames(chord), { arpeggio: false });
      } catch {
        /* ignore */
      }
    });
    $("#analyserPlayScaleBtn")?.addEventListener("click", () => {
      try {
        playSequence(getScaleNotes().map((pc) => noteLabel(pc, state.useFlats)), { ascending: true });
      } catch {
        /* ignore */
      }
    });
  }

  function onAnalysisEnter() {
    analysis.active = true;
    analysis.palette = palette();
    initAnalysisChrome();
    renderHarmonicMatrix(true);
    renderChromaReadout(analysis.detected);
    ensureAnalysisLoop();
  }

  function onAnalysisLeave() {
    analysis.active = false;
    stopAnalysisLoop();
  }

  /* ==========================================================================
     E. 五度圈
     ========================================================================== */
  const CIRCLE_KEYS = [
    { majorPc: 0, major: "C", minor: "Am", sig: 0, sigText: "無升降記號", notes: ["C", "D", "E", "F", "G", "A", "B"] },
    { majorPc: 7, major: "G", minor: "Em", sig: 1, sigText: "1 個升號（F♯）", notes: ["G", "A", "B", "C", "D", "E", "F♯"] },
    { majorPc: 2, major: "D", minor: "Bm", sig: 2, sigText: "2 個升號（F♯ C♯）", notes: ["D", "E", "F♯", "G", "A", "B", "C♯"] },
    { majorPc: 9, major: "A", minor: "F♯m", sig: 3, sigText: "3 個升號（F♯ C♯ G♯）", notes: ["A", "B", "C♯", "D", "E", "F♯", "G♯"] },
    { majorPc: 4, major: "E", minor: "C♯m", sig: 4, sigText: "4 個升號（F♯ C♯ G♯ D♯）", notes: ["E", "F♯", "G♯", "A", "B", "C♯", "D♯"] },
    { majorPc: 11, major: "B", minor: "G♯m", sig: 5, sigText: "5 個升號（F♯ C♯ G♯ D♯ A♯）", notes: ["B", "C♯", "D♯", "E", "F♯", "G♯", "A♯"] },
    { majorPc: 6, major: "F♯/G♭", minor: "D♯m/E♭m", sig: 6, sigText: "6 個升號 / 6 個降號", notes: ["F♯", "G♯", "A♯", "B", "C♯", "D♯", "E♯"] },
    { majorPc: 1, major: "D♭", minor: "B♭m", sig: -5, sigText: "5 個降號（B♭ E♭ A♭ D♭ G♭）", notes: ["D♭", "E♭", "F", "G♭", "A♭", "B♭", "C"] },
    { majorPc: 8, major: "A♭", minor: "Fm", sig: -4, sigText: "4 個降號（B♭ E♭ A♭ D♭）", notes: ["A♭", "B♭", "C", "D♭", "E♭", "F", "G"] },
    { majorPc: 3, major: "E♭", minor: "Cm", sig: -3, sigText: "3 個降號（B♭ E♭ A♭）", notes: ["E♭", "F", "G", "A♭", "B♭", "C", "D"] },
    { majorPc: 10, major: "B♭", minor: "Gm", sig: -2, sigText: "2 個降號（B♭ E♭）", notes: ["B♭", "C", "D", "E♭", "F", "G", "A"] },
    { majorPc: 5, major: "F", minor: "Dm", sig: -1, sigText: "1 個降號（B♭）", notes: ["F", "G", "A", "B♭", "C", "D", "E"] },
  ];

  const MAJOR_DEGREES = ["I", "ii", "iii", "IV", "V", "vi", "vii°"];
  const MAJOR_QUALITIES = ["maj", "min", "min", "maj", "maj", "min", "dim"];
  const MINOR_DEGREES = ["i", "ii°", "III", "iv", "v", "VI", "VII"];
  const MINOR_QUALITIES = ["min", "dim", "maj", "min", "min", "maj", "maj"];

  function pcToMidi(pc, octave = 4) {
    let midi = 12 * (octave + 1) + (((pc % 12) + 12) % 12);
    if (midi < 48) midi += 12;
    return midi;
  }

  function playTriad(pc, quality, when = 0.02, duration = 0.72) {
    const intervals = quality === "min" ? [0, 3, 7] : quality === "dim" ? [0, 3, 6] : quality === "aug" ? [0, 4, 8] : [0, 4, 7];
    try {
      const ctx = getAudioContext();
      intervals.forEach((interval) => {
        triggerMidi(pcToMidi(pc) + interval, ctx.currentTime + when, duration, 0.8);
      });
    } catch {
      /* ignore */
    }
  }

  function selectedKey() {
    const key = CIRCLE_KEYS[fifthsState.selectedPc] || CIRCLE_KEYS[0];
    return key;
  }

  function scalePcsForKey(key) {
    return [0, 2, 4, 5, 7, 9, 11].map((step) => (key.majorPc + step) % 12);
  }

  function buildFifthsSvg() {
    const host = $("#fifthsWheel");
    if (!host) return;
    const cx = 280;
    const cy = 280;
    const outerR = 252;
    const outerInner = 170;
    const minorOuter = 160;
    const minorInner = 90;
    const centerR = 84;
    const point = (radius, angle) => {
      const rad = (angle * Math.PI) / 180;
      return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
    };
    const annulus = (r0, r1, a0, a1) => {
      const [x0, y0] = point(r1, a0);
      const [x1, y1] = point(r1, a1);
      const [x2, y2] = point(r0, a1);
      const [x3, y3] = point(r0, a0);
      return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r1} ${r1} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)} A${r0} ${r0} 0 0 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`;
    };

    const currentMajorPc = typeof state !== "undefined" ? state.root : 0;
    const isMinorMode = fifthsState.mode === "minor";
    const currentIndex = CIRCLE_KEYS.findIndex((key) =>
      isMinorMode ? (key.majorPc + 9) % 12 === currentMajorPc : key.majorPc === currentMajorPc
    );

    const wedges = CIRCLE_KEYS.map((key, index) => {
      const start = -90 - 15 + index * 30;
      const end = start + 30;
      const mid = start + 15;
      const selected = index === fifthsState.selectedPc;
      const current = index === currentIndex;
      const majorColor = `rgba(255, 255, 255, 0.045)`;
      const [tx, ty] = point((outerR + outerInner) / 2, mid);
      const [mx, my] = point((minorOuter + minorInner) / 2, mid);
      return `
        <g class="fifths-wedge${selected ? " selected" : ""}${current ? " current" : ""}"
           data-fifths-index="${index}" data-fifths-kind="major" role="button" tabindex="0"
           aria-label="${key.major} 大調，${key.sigText}">
          <path d="${annulus(outerInner, outerR, start, end)}" fill="${majorColor}" stroke="rgba(148,163,184,0.18)"></path>
          <text x="${tx.toFixed(1)}" y="${(ty - 3).toFixed(1)}" text-anchor="middle" fill="currentColor" font-size="15" font-weight="600">${key.major}</text>
          <text x="${tx.toFixed(1)}" y="${(ty + 13).toFixed(1)}" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.62">${key.sig === 0 ? "0" : key.sig > 0 ? `${key.sig}♯` : `${Math.abs(key.sig)}♭`}</text>
        </g>
        <g class="fifths-wedge${selected ? " selected" : ""}${current ? " current" : ""}"
           data-fifths-index="${index}" data-fifths-kind="minor" role="button" tabindex="0"
           aria-label="${key.minor} 小調，${key.sigText}">
          <path d="${annulus(minorInner, minorOuter, start, end)}" fill="rgba(148,163,184,0.07)" stroke="rgba(148,163,184,0.14)"></path>
          <text x="${mx.toFixed(1)}" y="${(my + 4).toFixed(1)}" text-anchor="middle" fill="currentColor" font-size="11.5" opacity="0.86">${key.minor}</text>
        </g>
      `;
    }).join("");

    const key = selectedKey();
    const centerName = isMinorMode ? key.minor : key.major;
    const centerLabel = isMinorMode ? "小調" : "大調";
    host.innerHTML = `
      <svg viewBox="0 0 560 560" role="img" aria-label="五度圈：外圈大調、內圈關係小調">
        <circle cx="${cx}" cy="${cy}" r="${outerR + 6}" fill="none" stroke="rgba(148,163,184,0.14)"></circle>
        ${wedges}
        <circle class="fifths-center-disc" cx="${cx}" cy="${cy}" r="${centerR}" stroke="rgba(148,163,184,0.24)"></circle>
        <text x="${cx}" y="${cy - 8}" text-anchor="middle" fill="currentColor" font-size="30" font-weight="700">${centerName}</text>
        <text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="currentColor" font-size="10" opacity="0.7" letter-spacing="2">${centerLabel}</text>
        <text x="${cx}" y="${cy + 34}" text-anchor="middle" fill="currentColor" font-size="9" opacity="0.5">${key.sig === 0 ? "0 ♯ / ♭" : key.sig > 0 ? `${key.sig} ♯` : `${Math.abs(key.sig)} ♭`}</text>
      </svg>
    `;
  }

  function diatonicChordsForKey(key, mode) {
    const degrees = mode === "minor" ? MINOR_DEGREES : MAJOR_DEGREES;
    const qualities = mode === "minor" ? MINOR_QUALITIES : MAJOR_QUALITIES;
    const basePc = mode === "minor" ? (key.majorPc + 9) % 12 : key.majorPc;
    const scaleSteps = mode === "minor" ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 5, 7, 9, 11];
    return degrees.map((degree, index) => {
      const pc = (basePc + scaleSteps[index]) % 12;
      const quality = qualities[index];
      const suffix = quality === "maj" ? "" : quality === "min" ? "m" : quality === "dim" ? "dim" : "aug";
      return { degree, pc, quality, name: `${noteLabel(pc, key.sig < 0)}${suffix}` };
    });
  }

  function renderFifthsDetail() {
    const detail = $("#fifthsDetail");
    const chordsHost = $("#fifthsChords");
    const modHost = $("#fifthsModulation");
    if (!detail) return;
    const key = selectedKey();
    const mode = fifthsState.mode;
    const isMinor = mode === "minor";
    const basePc = isMinor ? (key.majorPc + 9) % 12 : key.majorPc;
    const scalePcs = isMinor ? [0, 2, 3, 5, 7, 8, 10].map((step) => (basePc + step) % 12) : scalePcsForKey(key);
    const relativeName = isMinor ? key.major : key.minor;
    const parallelName = isMinor ? noteLabel(basePc, key.sig < 0) : `${noteLabel(basePc, true)}m`;
    const dominantPc = (basePc + 7) % 12;
    const subdominantPc = (basePc + 5) % 12;
    const title = isMinor ? `${key.minor} 小調` : `${key.major} 大調`;
    const playableChords = diatonicChordsForKey(key, mode);

    detail.innerHTML = `
      <div class="fifths-title-row">
        <h4>${title}</h4>
        <span class="fifths-sig">${key.sigText}</span>
      </div>
      <div class="fifths-scale">
        ${scalePcs.map((pc, index) => `<span class="${index === 0 ? "root" : ""}">${noteLabel(pc, key.sig < 0)}</span>`).join("")}
      </div>
      <dl class="fifths-facts">
        <div><dt>主音 Tonic</dt><dd>${noteLabel(basePc, key.sig < 0)}</dd></div>
        <div><dt>關係大小調 Relative</dt><dd>${relativeName}</dd></div>
        <div><dt>屬調 Dominant</dt><dd>${noteLabel(dominantPc, key.sig < 0)}</dd></div>
        <div><dt>下屬調 Subdominant</dt><dd>${noteLabel(subdominantPc, key.sig < 0)}</dd></div>
        <div><dt>平行調 Parallel</dt><dd>${parallelName}</dd></div>
        <div><dt>調號簽名</dt><dd>${key.sig === 0 ? "0" : key.sig > 0 ? `${key.sig} ♯` : `${Math.abs(key.sig)} ♭`}</dd></div>
      </dl>
    `;

    if (chordsHost) {
      chordsHost.innerHTML = playableChords
        .map(
          (chord, index) => `
            <button type="button" class="fifths-chord" data-fifths-chord="${index}"
              title="${chord.name} · 點擊試聽 ${chord.degree}"
              aria-label="試聽 ${chord.degree} ${chord.name}">
              ${chord.name}
              <small>${chord.degree}</small>
            </button>
          `
        )
        .join("");
      $$("[data-fifths-chord]", chordsHost).forEach((button) => {
        button.addEventListener("click", () => {
          const chord = playableChords[Number(button.dataset.fifthsChord)];
          if (!chord) return;
          playTriad(chord.pc, chord.quality);
          button.classList.add("playing");
          window.setTimeout(() => button.classList.remove("playing"), 620);
        });
      });
    }

    if (modHost) {
      const mods = [
        { label: `屬調 ${noteLabel(dominantPc, key.sig < 0)}`, pc: dominantPc },
        { label: `下屬調 ${noteLabel(subdominantPc, key.sig < 0)}`, pc: subdominantPc },
        { label: `上中音 ${noteLabel((basePc + 4) % 12, key.sig < 0)}`, pc: (basePc + 4) % 12 },
        { label: `下中音 ${noteLabel((basePc + 9) % 12, key.sig < 0)}`, pc: (basePc + 9) % 12 },
        { label: `降三度 ${noteLabel((basePc + 3) % 12, true)}`, pc: (basePc + 3) % 12 },
        { label: `升四度 ${noteLabel((basePc + 6) % 12, true)}`, pc: (basePc + 6) % 12 },
      ];
      modHost.innerHTML = `
        <h5>轉調路徑 Modulation</h5>
        <div class="fifths-mod-list">
          ${mods
            .map(
              (mod) =>
                `<button type="button" data-fifths-mod="${mod.pc}" title="選擇 ${noteLabel(mod.pc, true)}">${mod.label}</button>`
            )
            .join("")}
        </div>
        <p class="fifths-note">五度圈相鄰的調只差一個調號，是最自然的轉調方向；隔一個位置的調（如 C → D）適合副歌轉調製造新鮮感。</p>
      `;
      $$("[data-fifths-mod]", modHost).forEach((button) => {
        button.addEventListener("click", () => {
          const pc = Number(button.dataset.fifthsMod);
          const index = CIRCLE_KEYS.findIndex((keyItem) =>
            fifthsState.mode === "minor" ? (keyItem.majorPc + 9) % 12 === pc : keyItem.majorPc === pc
          );
          if (index >= 0) {
            fifthsState.selectedPc = index;
            renderFifths();
          }
        });
      });
    }
  }

  function renderFifths() {
    buildFifthsSvg();
    renderFifthsDetail();
    $$("#fifthsModeSwitch [data-fifths-mode]").forEach((button) => {
      const active = button.dataset.fifthsMode === fifthsState.mode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function applyFifthsKey() {
    const key = selectedKey();
    const isMinor = fifthsState.mode === "minor";
    state.root = isMinor ? (key.majorPc + 9) % 12 : key.majorPc;
    state.mode = isMinor ? "minor" : "major";
    if (typeof renderAll === "function") renderAll();
    if (typeof persist === "function") persist();
    if (typeof showToast === "function") {
      showToast(`已套用主音：${isMinor ? key.minor : key.major} ${isMinor ? "小調" : "大調"}`, "success");
    }
    renderFifths();
  }

  function playFifthsCadence() {
    const key = selectedKey();
    const mode = fifthsState.mode;
    const chords = diatonicChordsForKey(key, mode);
    const plan = [
      { chord: chords[0], chordIndex: 0 },
      { chord: chords[3], chordIndex: 3 },
      { chord: chords[4], chordIndex: 4 },
      { chord: chords[0], chordIndex: 0 },
    ];
    fifthsState.timers.forEach((timer) => window.clearTimeout(timer));
    fifthsState.timers = [];
    plan.forEach((step, index) => {
      const timer = window.setTimeout(() => {
        playTriad(step.chord.pc, step.chord.quality, 0.01, 0.86);
        fifthsState.playingIndex = index;
        $$("[data-fifths-chord]").forEach((button, buttonIndex) => {
          button.classList.toggle("playing", buttonIndex === step.chordIndex);
        });
      }, index * 780);
      fifthsState.timers.push(timer);
    });
    const endTimer = window.setTimeout(() => {
      $$("[data-fifths-chord]").forEach((button) => button.classList.remove("playing"));
    }, plan.length * 780 + 400);
    fifthsState.timers.push(endTimer);
  }

  function bindFifths() {
    const wheel = $("#fifthsWheel");
    wheel?.addEventListener("click", (event) => {
      const wedge = event.target.closest("[data-fifths-index]");
      if (!wedge) return;
      const index = Number(wedge.dataset.fifthsIndex);
      if (!Number.isFinite(index)) return;
      fifthsState.selectedPc = index;
      fifthsState.mode = wedge.dataset.fifthsKind === "minor" ? "minor" : "major";
      renderFifths();
    });
    wheel?.addEventListener("dblclick", (event) => {
      const wedge = event.target.closest("[data-fifths-index]");
      if (!wedge) return;
      fifthsState.selectedPc = Number(wedge.dataset.fifthsIndex);
      fifthsState.mode = wedge.dataset.fifthsKind === "minor" ? "minor" : "major";
      applyFifthsKey();
    });
    wheel?.addEventListener("keydown", (event) => {
      const wedge = event.target.closest("[data-fifths-index]");
      if (!wedge || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      wedge.click();
    });

    $("#fifthsApplyBtn")?.addEventListener("click", applyFifthsKey);
    $("#fifthsCadenceBtn")?.addEventListener("click", playFifthsCadence);
    $("#fifthsRelativeBtn")?.addEventListener("click", () => {
      fifthsState.mode = fifthsState.mode === "major" ? "minor" : "major";
      renderFifths();
    });
    $$("#fifthsModeSwitch [data-fifths-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        fifthsState.mode = button.dataset.fifthsMode === "minor" ? "minor" : "major";
        renderFifths();
      });
    });
  }

  /* ==========================================================================
     視圖切換整合
     ========================================================================== */
  function handleViewChange(name) {
    if (name === "analysis") onAnalysisEnter();
    else if (analysis.active) onAnalysisLeave();
    if (name === "fifths") renderFifths();
  }

  function installHooks() {
    if (typeof window.getAudioContext === "function") {
      const baseGetAudioContext = window.getAudioContext;
      window.getAudioContext = function patchedGetAudioContext(...args) {
        const ctx = baseGetAudioContext.apply(this, args);
        if (!volumeInitialized && typeof masterGain !== "undefined" && masterGain) {
          volumeInitialized = true;
          try {
            masterGain.gain.value = masterVolumeValue(transport.volume);
          } catch {
            /* ignore gain assignment failures */
          }
        }
        return ctx;
      };
    }
    if (typeof window.setView === "function") {
      const baseSetView = window.setView;
      window.setView = function patchedSetView(...args) {
        const result = baseSetView.apply(this, args);
        const viewName = typeof args[0] === "string" ? args[0] : currentViewId;
        handleViewChange(viewName);
        return result;
      };
    }
    if (typeof window.renderAll === "function") {
      const baseRenderAll = window.renderAll;
      window.renderAll = function patchedRenderAll(...args) {
        const result = baseRenderAll.apply(this, args);
        if (analysis.drone && typeof getSelectedChord === "function") {
          const nextKey = `${getSelectedChord().id}-${state.root}`;
          if (nextKey !== analysis.droneKey) {
            stopDrone();
            startDrone();
          }
        }
        refreshTransportEvents();
        renderHarmonicMatrix(true);
        renderChromaReadout(analysis.detected);
        if (currentViewId === "fifths") renderFifths();
        return result;
      };
    }
  }

  /* ==========================================================================
     鍵盤快捷鍵
     ========================================================================== */
  function bindShortcuts() {
    document.addEventListener("keydown", (event) => {
      const active = document.activeElement;
      const typing =
        active && (["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName) || active.isContentEditable);
      if (event.altKey && !event.ctrlKey && !event.metaKey && String(event.key).toLowerCase() === "p") {
        event.preventDefault();
        togglePractice();
        return;
      }
      if (event.altKey && !event.ctrlKey && !event.metaKey && String(event.key).toLowerCase() === "t") {
        event.preventDefault();
        cycleTheme();
        return;
      }
      if (event.shiftKey && event.code === "Space" && !typing) {
        event.preventDefault();
        if (transport.playing) pauseTransport();
        else startTransport();
        return;
      }
      if (event.key === "Escape" && document.body.classList.contains("practice-mode")) {
        togglePractice(false);
      }
    });
  }

  /* ==========================================================================
     初始化
     ========================================================================== */
  function init() {
    const saved = safeParse(readStore(STORE_KEYS.transport), {});
    const fallbackBpm = typeof state !== "undefined" ? Number(state.scoreBpm) || 100 : 100;
    transport.bpm = clamp(Number(saved.bpm) || fallbackBpm, 40, 220);
    transport.timeSig = TIME_SIG_BEATS[saved.timeSig] ? saved.timeSig : "4/4";
    transport.beatsPerBar = TIME_SIG_BEATS[transport.timeSig];
    transport.volume = Number.isFinite(saved.volume) ? clamp(saved.volume, 0, 100) : 55;
    transport.collapsed = !!saved.collapsed;
    transport.a = Number.isFinite(saved.a) ? saved.a : 0;
    transport.b = Number.isFinite(saved.b) ? saved.b : 2;

    renderBeatLeds();
    refreshTransportEvents();
    bindTransport();
    bindAnalysis();
    bindFifths();
    bindShortcuts();
    installHooks();

    setBpm(transport.bpm, { silent: true });
    setCollapsed(transport.collapsed, { silent: true });
    analysis.palette = palette();

    window.addEventListener("nebula:themechange", () => {
      analysis.palette = palette();
      if (analysis.active) {
        initAnalysisChrome();
        renderHarmonicMatrix(true);
      }
    });

    window.addEventListener("resize", () => {
      analysis.palette = palette();
    });

    if (typeof currentViewId !== "undefined") handleViewChange(currentViewId);
    if (typeof renderLevelChrome === "function") renderLevelChrome();

    // 主題晶片若尚未同步（例如舊存檔），再套用一次目前主題
    if (typeof applyTheme === "function") applyTheme();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();

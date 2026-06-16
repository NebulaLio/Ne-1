const NOTE_NAMES = {
  sharp: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
  flat: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
};

const CHORD_QUALITY_LIBRARY = [
  {
    id: "maj",
    name: "Maj",
    symbols: ["", "maj", "M", "major"],
    intervals: [0, 4, 7],
    category: "triad",
    color: "base",
    theory:
      "大三和弦，稳定明亮。适合主功能、终止和声与旋律落点。",
    function: "主功能",
    guitar: "常见于开放和弦、分解和弦与扫弦伴奏。",
  },
  {
    id: "min",
    name: "m",
    symbols: ["m", "min", "-"],
    intervals: [0, 3, 7],
    category: "triad",
    color: "base",
    theory:
      "小三和弦，较内省、柔和，常作为主调内的下属或主功能色彩。",
    function: "主/下属功能",
    guitar: "爵士里常见于 ii 级和弦和小调音色。",
  },
  {
    id: "dim",
    name: "dim",
    symbols: ["dim", "°"],
    intervals: [0, 3, 6],
    category: "triad",
    color: "altered",
    theory:
      "减三和弦，张力强，常用于经过和弦、导音和弦与属和弦前导。",
    function: "导向",
    guitar: "可用作经过连接，和弦走向很清楚。",
  },
  {
    id: "aug",
    name: "aug",
    symbols: ["aug", "+"],
    intervals: [0, 4, 8],
    category: "triad",
    color: "altered",
    theory:
      "增三和弦，带有开放和悬浮感，常用于色彩性连接或旋律强调。",
    function: "色彩/变化",
    guitar: "在爵士和声中常作为经过和弦或替代色彩。",
  },
  {
    id: "sus2",
    name: "sus2",
    symbols: ["sus2"],
    intervals: [0, 2, 7],
    category: "triad",
    color: "base",
    theory:
      "二度悬挂和弦，保留开放感，常用于现代流行、键盘与吉他伴奏。",
    function: "悬挂",
    guitar: "适合铺垫和过门，左手/低音不要过满。",
  },
  {
    id: "sus4",
    name: "sus4",
    symbols: ["sus4", "sus"],
    intervals: [0, 5, 7],
    category: "triad",
    color: "base",
    theory:
      "四度悬挂和弦，最经典的悬念型结构，常回解到三和弦。",
    function: "悬挂-解决",
    guitar: "吉他写作和即兴伴奏里非常实用。",
  },
  {
    id: "6",
    name: "6",
    symbols: ["6"],
    intervals: [0, 4, 7, 9],
    category: "extended",
    color: "base",
    theory:
      "加入六度的和弦，音色温暖，古典和流行键盘中都常见。",
    function: "延伸主功能",
    guitar: "爵士标准里常被视作稳定的延伸色彩。",
  },
  {
    id: "7",
    name: "7",
    symbols: ["7"],
    intervals: [0, 4, 7, 10],
    category: "seventh",
    color: "base",
    theory:
      "属七和弦，张力与方向性很强，是爵士和声和调性写作核心。",
    function: "属功能",
    guitar: "ii-V-I 的 V 级核心，最常用的爵士语汇之一。",
  },
  {
    id: "maj7",
    name: "maj7",
    symbols: ["maj7", "M7", "Δ7"],
    intervals: [0, 4, 7, 11],
    category: "seventh",
    color: "base",
    theory:
      "大七和弦，透明而稳定，适合主和弦、抒情旋律与现代编配。",
    function: "主功能",
    guitar: "爵士吉他里是最常见的主和弦之一。",
  },
  {
    id: "m7",
    name: "m7",
    symbols: ["m7", "min7", "-7"],
    intervals: [0, 3, 7, 10],
    category: "seventh",
    color: "base",
    theory:
      "小七和弦，常见于 ii 级和弦、小调主和弦和调性过渡。",
    function: "下属/主功能",
    guitar: "配合 ii-V-I 的 ii 级和弦使用频率极高。",
  },
  {
    id: "mMaj7",
    name: "mMaj7",
    symbols: ["mMaj7", "mM7"],
    intervals: [0, 3, 7, 11],
    category: "seventh",
    color: "altered",
    theory:
      "小大七和弦，带有戏剧感和电影感，常出现在和声小调和借用和声中。",
    function: "色彩/借用",
    guitar: "适合细腻的和声色彩，不宜过密。",
  },
  {
    id: "halfDim",
    name: "m7b5",
    symbols: ["m7b5", "ø7", "half-dim"],
    intervals: [0, 3, 6, 10],
    category: "seventh",
    color: "altered",
    theory:
      "半减七和弦，导向性强，常作为小调 iiø-V-i 的起点。",
    function: "导向/下属",
    guitar: "小调功能和声和现代爵士里非常重要。",
  },
  {
    id: "dim7",
    name: "dim7",
    symbols: ["dim7", "°7"],
    intervals: [0, 3, 6, 9],
    category: "seventh",
    color: "altered",
    theory:
      "减七和弦对称性强，可做经过和弦、离调和声或紧张推进。",
    function: "经过/导向",
    guitar: "吉他上便于移动，适合半音连接。",
  },
  {
    id: "9",
    name: "9",
    symbols: ["9"],
    intervals: [0, 4, 7, 10, 14],
    category: "extended",
    color: "base",
    theory:
      "九和弦，爵士和流行编配常用，保留属功能同时增加歌唱性。",
    function: "属/扩展",
    guitar: "常通过省略五音来简化。",
  },
  {
    id: "11",
    name: "11",
    symbols: ["11"],
    intervals: [0, 4, 7, 10, 14, 17],
    category: "extended",
    color: "base",
    theory:
      "十一和弦，空间感强，实际编配中经常省略三音或五音以避免冲突。",
    function: "扩展",
    guitar: "适合上方结构和色彩性配器。",
  },
  {
    id: "13",
    name: "13",
    symbols: ["13"],
    intervals: [0, 4, 7, 10, 14, 17, 21],
    category: "extended",
    color: "base",
    theory:
      "十三和弦是完整属扩展，爵士功能感强，音色丰富。",
    function: "属/扩展",
    guitar: "常省略十一或五音，保留三音、七音与十三音。",
  },
  {
    id: "alt",
    name: "alt",
    symbols: ["alt", "7alt"],
    intervals: [0, 4, 10, 13, 15],
    category: "altered",
    color: "altered",
    theory:
      "变化属和弦，适合强烈解决到目标主和弦，常包含 b9/#9/b5/#5。",
    function: "属功能强化",
    guitar: "爵士吉他最常见的张力集合之一。",
  },
  {
    id: "add9",
    name: "add9",
    symbols: ["add9"],
    intervals: [0, 4, 7, 14],
    category: "extended",
    color: "base",
    theory:
      "加九和弦，清晰而明亮，不像九和弦那样必须强调属功能。",
    function: "色彩/主功能",
    guitar: "很适合流行伴奏与分解和弦。",
  },
];

const SCALE_LIBRARY = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
};

const MODE_LABELS = {
  major: "大调",
  minor: "自然小调",
  harmonicMinor: "和声小调",
  melodicMinor: "旋律小调",
  dorian: "Dorian",
  mixolydian: "Mixolydian",
};

const DEGREE_LABELS = {
  major: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
  minor: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
  harmonicMinor: ["i", "ii°", "III+", "iv", "V", "VI", "vii°"],
  melodicMinor: ["i", "ii", "III+", "IV", "V", "vi°", "vii°"],
  dorian: ["i", "ii", "III", "IV", "v", "vi°", "VII"],
  mixolydian: ["I", "ii", "iii°", "IV", "v", "vi", "VII"],
};

const DEGREE_FUNCTION_HINTS = {
  I: "主功能",
  i: "主功能",
  ii: "下属/前属",
  "ii°": "前属",
  iii: "连接/延展",
  III: "色彩/借用",
  "III+": "色彩/增色",
  IV: "下属功能",
  iv: "下属功能",
  V: "属功能",
  v: "属的弱化色彩",
  vi: "替代主功能",
  VI: "色彩/借用",
  "vi°": "经过/导向",
  "vii°": "导向功能",
  VII: "借用/摇摆",
};

const PHRASE_LIBRARY = [
  {
    id: "piano-01",
    title: "经典终止型",
    style: "古典钢琴",
    progression: "I - IV - V - I",
    notes: "C E G | F A C | G B D | C E G",
    description:
      "最基本的调性闭合。适合训练分解和弦、终止感与右手旋律落点。",
  },
  {
    id: "piano-02",
    title: "卡农式下行",
    style: "古典钢琴",
    progression: "vi - IV - I - V",
    notes: "A C E | F A C | C E G | G B D",
    description:
      "非常常见的流行与古典兼容进行，适合做重复动机和低音线条。",
  },
  {
    id: "piano-03",
    title: "装饰经过句",
    style: "古典钢琴",
    progression: "I - V6/4 - V - I",
    notes: "C E G | D G B | G B D | C E G",
    description:
      "古典语法里常用的六四和弦处理，重点在经过功能和解决关系。",
  },
  {
    id: "guitar-01",
    title: "ii-V-I 声部连接",
    style: "爵士吉他",
    progression: "Dm7 - G7 - Cmaj7",
    notes: "D F A C | G B D F | C E G B",
    description:
      "爵士基础核心。练习三音和七音的最短连接，特别适合 comping。",
  },
  {
    id: "guitar-02",
    title: "次属和弦推进",
    style: "爵士吉他",
    progression: "A7 - Dm7 - G7 - Cmaj7",
    notes: "A C# E G | D F A C | G B D F | C E G B",
    description:
      "用 V/ii 推动 ii-V-I，适合训练功能链条和张力解决。",
  },
  {
    id: "guitar-03",
    title: "小调 iiø-V-i",
    style: "爵士吉他",
    progression: "Dm7b5 - G7alt - CmMaj7",
    notes: "D F Ab C | G B Db F | C Eb G B",
    description:
      "小调标准路径。适合练习半减、变化属和小大七解决。",
  },
];

const STORAGE_KEYS = {
  prefs: "music-dictionary-prefs-v1",
  customPhrases: "music-dictionary-custom-phrases-v1",
  scores: "music-dictionary-scores-v1",
  favorites: "music-dictionary-favorites-v1",
};

const DEGREE_NAMES = ["1", "2", "3", "4", "5", "6", "7"];
const STRING_TUNING = [
  { string: "E", open: 4 },
  { string: "B", open: 11 },
  { string: "G", open: 7 },
  { string: "D", open: 2 },
  { string: "A", open: 9 },
  { string: "E", open: 4 },
];

const state = {
  useFlats: false,
  mode: "major",
  root: 0,
  selectedChordId: "maj7",
  category: "all",
  chordSearch: "",
  phraseStyle: "all",
  customPhrases: [],
  scores: [],
  favorites: new Set(),
  tabBeats: 4,
  tabGrid: [],
};

const els = {
  viewTitle: document.getElementById("viewTitle"),
  currentRootLabel: document.getElementById("currentRootLabel"),
  currentRootHint: document.getElementById("currentRootHint"),
  notationToggle: document.getElementById("notationToggle"),
  modeSelect: document.getElementById("modeSelect"),
  rootStrip: document.getElementById("rootStrip"),
  selectedChordName: document.getElementById("selectedChordName"),
  selectedChordTones: document.getElementById("selectedChordTones"),
  selectedChordAnalysis: document.getElementById("selectedChordAnalysis"),
  selectedChordDetails: document.getElementById("selectedChordDetails"),
  chordGrid: document.getElementById("chordGrid"),
  chordSearch: document.getElementById("chordSearch"),
  pianoVisual: document.getElementById("pianoVisual"),
  fretboardVisual: document.getElementById("fretboardVisual"),
  scaleTitle: document.getElementById("scaleTitle"),
  scaleTones: document.getElementById("scaleTones"),
  degreeTable: document.getElementById("degreeTable"),
  knowledgeGrid: document.getElementById("knowledgeGrid"),
  phraseFilters: document.getElementById("phraseFilters"),
  phraseList: document.getElementById("phraseList"),
  customPhraseList: document.getElementById("customPhraseList"),
  phraseForm: document.getElementById("phraseForm"),
  phraseTitle: document.getElementById("phraseTitle"),
  phraseStyle: document.getElementById("phraseStyle"),
  phraseProgression: document.getElementById("phraseProgression"),
  phraseNotes: document.getElementById("phraseNotes"),
  tabEditor: document.getElementById("tabEditor"),
  tabPreview: document.getElementById("tabPreview"),
  addTabBeatBtn: document.getElementById("addTabBeatBtn"),
  clearTabBtn: document.getElementById("clearTabBtn"),
  saveTabBtn: document.getElementById("saveTabBtn"),
  rightHandInput: document.getElementById("rightHandInput"),
  leftHandInput: document.getElementById("leftHandInput"),
  scoreMemoInput: document.getElementById("scoreMemoInput"),
  clearPianoBtn: document.getElementById("clearPianoBtn"),
  savePianoBtn: document.getElementById("savePianoBtn"),
  savedScores: document.getElementById("savedScores"),
  favoriteChordBtn: document.getElementById("favoriteChordBtn"),
};

function noteName(index, useFlats = state.useFlats) {
  return (useFlats ? NOTE_NAMES.flat : NOTE_NAMES.sharp)[mod(index, 12)];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function intervalToLabel(interval) {
  const normalized = mod(interval, 12);
  if (normalized === 0) return "1";
  if (normalized === 1) return "b9";
  if (normalized === 2) return "9";
  if (normalized === 3) return "m3";
  if (normalized === 4) return "3";
  if (normalized === 5) return "11";
  if (normalized === 6) return "b5";
  if (normalized === 7) return "5";
  if (normalized === 8) return "#5";
  if (normalized === 9) return "13";
  if (normalized === 10) return "b7";
  if (normalized === 11) return "maj7";
  return `${normalized}`;
}

function intervalToDegree(interval, mode = state.mode) {
  const scale = SCALE_LIBRARY[mode] || SCALE_LIBRARY.major;
  const target = mod(interval, 12);
  const idx = scale.indexOf(target);
  if (idx >= 0) return DEGREE_NAMES[idx];
  const lower = scale.reduce((best, value, i) => {
    const diff = mod(target - value, 12);
    if (best === null || diff < best.diff) return { diff, index: i };
    return best;
  }, null);
  if (!lower) return `${target}`;
  const sign = mod(target - scale[lower.index], 12);
  const accidental = sign <= 1 ? "b" : "#";
  return `${accidental}${DEGREE_NAMES[lower.index]}`;
}

function getModeLabel() {
  return MODE_LABELS[state.mode] || state.mode;
}

function getScaleNotes() {
  const steps = SCALE_LIBRARY[state.mode] || SCALE_LIBRARY.major;
  return steps.map((step) => mod(state.root + step, 12));
}

function getDegreeLabels() {
  return DEGREE_LABELS[state.mode] || DEGREE_LABELS.major;
}

function chordMatchesQuery(chord, query) {
  if (!query) return true;
  const haystack = [
    chord.id,
    chord.name,
    chord.symbols.join(" "),
    chord.theory,
    chord.function,
    chord.guitar,
    chord.category,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function getChordNoteNames(chord) {
  return chord.intervals.map((interval) => noteName(state.root + interval));
}

function getChordPitchClasses(chord) {
  return new Set(chord.intervals.map((interval) => mod(state.root + interval, 12)));
}

function createEmptyTabGrid(beats = 4) {
  return Array.from({ length: 6 }, () => Array.from({ length: beats }, () => ""));
}

function normalizeTabGrid(grid, beats) {
  const source = Array.isArray(grid) && grid.length === 6 ? grid : createEmptyTabGrid(beats);
  return source.map((row) => {
    const next = Array.isArray(row) ? row.slice(0, beats) : [];
    while (next.length < beats) next.push("");
    return next;
  });
}

function getChordDisplayName(chord) {
  const rootName = noteName(state.root);
  return `${rootName}${chord.name}`;
}

function getSelectedChord() {
  return CHORD_QUALITY_LIBRARY.find((item) => item.id === state.selectedChordId) ||
    CHORD_QUALITY_LIBRARY[0];
}

function chordCategoryLabel(category) {
  return {
    triad: "三和弦",
    seventh: "七和弦",
    extended: "扩展",
    altered: "变化",
    guitar: "吉他常用",
  }[category] || category;
}

function rootLabel(note) {
  return noteName(note);
}

function renderRootStrip() {
  const roots = Array.from({ length: 12 }, (_, i) => i);
  els.rootStrip.innerHTML = roots
    .map(
      (note) => `
        <button class="root-button ${note === state.root ? "active" : ""}" data-root="${note}" type="button">
          ${rootLabel(note)}
        </button>
      `
    )
    .join("");
}

function renderChordDetails(chord) {
  const notes = getChordNoteNames(chord);
  const roman = intervalToDegree(0);
  const rootNote = noteName(state.root);
  const scaleNotes = getScaleNotes();
  const selectedDegree = getDegreeLabels()[0];
  const pitchInfo = notes
    .map((note, index) => {
      const interval = chord.intervals[index];
      const label = intervalToLabel(interval);
      return `${label}:${note}`;
    })
    .join(" · ");

  els.currentRootLabel.textContent = rootNote;
  els.currentRootHint.textContent = `${rootNote} ${getModeLabel()} / ${scaleNotes.map((n) => noteName(n)).join(" ")}`;
  els.selectedChordName.textContent = getChordDisplayName(chord);
  els.selectedChordAnalysis.textContent = `${chord.theory} 作用：${chord.function}。${chord.guitar}`;
  els.selectedChordTones.innerHTML = notes
    .map((note, index) => {
      const interval = chord.intervals[index];
      const label = intervalToLabel(interval);
      const degree = intervalToDegree(interval);
      const cls = interval === 1 || interval === 6 || interval === 8 ? "altered" : interval === 3 || interval === 10 ? "degree" : "";
      return `<span class="tone-pill ${cls}">${label} ${note}<small>${degree}</small></span>`;
    })
    .join("");
  els.selectedChordDetails.innerHTML = `
    <div><dt>类别</dt><dd>${chordCategoryLabel(chord.category)}</dd></div>
    <div><dt>构成</dt><dd>${pitchInfo}</dd></div>
    <div><dt>调内作用</dt><dd>${analyzeChordFunction(chord)}</dd></div>
    <div><dt>提示</dt><dd>${roman} / ${selectedDegree}</dd></div>
  `;
  els.favoriteChordBtn.textContent = state.favorites.has(chord.id) ? "已收藏" : "收藏";
}

function analyzeChordFunction(chord) {
  const rootDegree = getDegreeLabels()[0];
  const third = chord.intervals.find((value) => mod(value, 12) === 3 || mod(value, 12) === 4);
  const seventh = chord.intervals.find((value) => mod(value, 12) === 10 || mod(value, 12) === 11);
  const tension = chord.intervals
    .filter((interval) => [1, 5, 6, 8, 9, 13, 14, 15, 17, 21].includes(interval))
    .map((interval) => intervalToLabel(interval))
    .join("、");
  const signature = `${rootDegree}${chord.name}`;
  const base = DEGREE_FUNCTION_HINTS[rootDegree] || "功能待判断";
  const color = chord.color === "altered" ? "张力强，适合解决。" : "音色较稳，适合铺陈。";
  const extras = [];
  if (third !== undefined) extras.push(`三音决定性质：${intervalToLabel(third)}`);
  if (seventh !== undefined) extras.push(`七音提供走向：${intervalToLabel(seventh)}`);
  if (tension) extras.push(`高张力音：${tension}`);
  return `${signature} 归属 ${base}，${color}${extras.length ? ` ${extras.join("；")}` : ""}`;
}

function renderPianoVisual(chord) {
  const activePitches = getChordPitchClasses(chord);
  const octave = [
    { pitch: 0, black: false },
    { pitch: 1, black: true },
    { pitch: 2, black: false },
    { pitch: 3, black: true },
    { pitch: 4, black: false },
    { pitch: 5, black: false },
    { pitch: 6, black: true },
    { pitch: 7, black: false },
    { pitch: 8, black: true },
    { pitch: 9, black: false },
    { pitch: 10, black: true },
    { pitch: 11, black: false },
    { pitch: 0, black: false },
    { pitch: 1, black: true },
  ];
  els.pianoVisual.innerHTML = octave
    .map((key) => {
      const base = noteName(key.pitch);
      const active = activePitches.has(key.pitch);
      return `<div class="piano-key ${key.black ? "black" : ""} ${active ? "active" : ""}">${base}</div>`;
    })
    .join("");
}

function renderFretboardVisual(chord) {
  const activePitches = getChordPitchClasses(chord);
  const frets = Array.from({ length: 12 }, (_, i) => i);
  const rows = STRING_TUNING.map((stringInfo, stringIdx) => {
    const cells = frets
      .map((fret) => {
        const pitch = mod(stringInfo.open + fret, 12);
        const note = noteName(pitch);
        const active = activePitches.has(pitch);
        const marker = active ? `<span class="fret-dot">${note}</span>` : "";
        return `<div class="fret-cell">${marker}</div>`;
      })
      .join("");
    return `<div class="fretboard"><div class="string-label">${stringInfo.string}</div>${cells}</div>`;
  });
  const header = `<div class="fretboard"><div class="fret-number"></div>${frets
    .map((fret) => `<div class="fret-number">${fret}</div>`)
    .join("")}</div>`;
  els.fretboardVisual.innerHTML = `${header}${rows.join("")}`;
}

function renderChordGrid() {
  const filtered = CHORD_QUALITY_LIBRARY.filter((chord) => {
    const guitarFriendly = ["seventh", "extended", "altered", "sus2", "sus4", "dim7", "halfDim", "maj7", "m7", "7", "add9", "9", "13"].includes(chord.id) || ["seventh", "extended", "altered"].includes(chord.category);
    const byCategory =
      state.category === "all" ||
      chord.category === state.category ||
      (state.category === "guitar" && guitarFriendly);
    return byCategory && chordMatchesQuery(chord, state.chordSearch);
  });
  els.chordGrid.innerHTML = filtered
    .map((chord) => {
      const active = chord.id === state.selectedChordId;
      const tones = getChordNoteNames(chord)
        .map((note, index) => `<span class="tone-pill">${intervalToLabel(chord.intervals[index])} ${note}</span>`)
        .join("");
      return `
        <button class="chord-card ${active ? "active" : ""}" data-chord="${chord.id}" type="button">
          <h4>${getChordDisplayName(chord)}</h4>
          <div class="tone-row">${tones}</div>
          <p>${chord.theory}</p>
        </button>
      `;
    })
    .join("");
  if (!filtered.length) {
    els.chordGrid.innerHTML = '<div class="empty-state">没有匹配的和弦，换个关键词试试。</div>';
  }
}

function renderScaleView() {
  const scaleNotes = getScaleNotes();
  const degreeLabels = getDegreeLabels();
  els.scaleTitle.textContent = `${noteName(state.root)} ${getModeLabel()}`;
  els.scaleTones.innerHTML = scaleNotes
    .map((note, index) => `<span class="tone-pill degree">${degreeLabels[index]} ${noteName(note)}</span>`)
    .join("");
  els.degreeTable.innerHTML = scaleNotes
    .map((note, index) => {
      const degree = degreeLabels[index];
      const label = DEGREE_FUNCTION_HINTS[degree] || "色彩/经过";
      const chord = deriveDiatonicChord(index);
      return `
        <div class="degree-row">
          <strong>${degree}</strong>
          <span>${noteName(note)}</span>
          <span>${chord} · ${label}</span>
        </div>
      `;
    })
    .join("");
}

function deriveDiatonicChord(index) {
  const degreeLabels = getDegreeLabels();
  const mode = state.mode;
  const scale = SCALE_LIBRARY[mode] || SCALE_LIBRARY.major;
  const rootNote = noteName(mod(state.root + scale[index], 12));
  const patterns = {
    major: ["maj", "min", "min", "maj", "maj", "min", "dim"],
    minor: ["min", "dim", "maj", "min", "min", "maj", "maj"],
    harmonicMinor: ["min", "dim", "aug", "min", "maj", "maj", "dim"],
    melodicMinor: ["min", "min", "aug", "maj", "maj", "dim", "dim"],
    dorian: ["min", "min", "maj", "maj", "min", "dim", "maj"],
    mixolydian: ["maj", "min", "dim", "maj", "min", "min", "maj"],
  };
  const pattern = patterns[mode] || patterns.major;
  const quality = pattern[index];
  return `${rootNote}${quality === "maj" ? "" : quality === "min" ? "m" : quality === "dim" ? "dim" : quality === "aug" ? "aug" : quality}`;
}

function renderKnowledge() {
  const cards = [
    {
      title: "古典钢琴和声",
      body: "围绕调性、终止、经过和声、辅助和弦与声部进行。适合用主音、属音、下属音建立清晰结构。",
      points: ["I-IV-V-I 的基础逻辑", "邻音、经过音与挂留", "分解和弦与低音线"],
    },
    {
      title: "爵士吉他和声",
      body: "围绕功能和声、替代属、导向音和声部最小移动。优先看三音和七音，再补张力音。",
      points: ["ii-V-I 是核心语法", "省略五音更清楚", "alt、sus、upper structure"],
    },
    {
      title: "调式训练",
      body: "切换大调、小调、和声小调和旋律小调时，先锁定主音，再识别三音与七音。",
      points: ["先听主音中心", "比较大小三度", "练习同主音多调式"],
    },
    {
      title: "编配习惯",
      body: "键盘尽量分层：左手低音/和弦骨架，右手旋律与上方结构；吉他优先考虑可演奏把位。",
      points: ["低音不要过厚", "右手保留旋律", "把位比“全音都弹”更重要"],
    },
  ];
  els.knowledgeGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="knowledge-card">
          <h4>${card.title}</h4>
          <p>${card.body}</p>
          <ul>${card.points.map((item) => `<li>${item}</li>`).join("")}</ul>
        </article>
      `
    )
    .join("");
}

function renderPhraseFilters() {
  const styles = ["all", ...new Set(PHRASE_LIBRARY.map((item) => item.style))];
  els.phraseFilters.innerHTML = styles
    .map((style) => {
      const active = state.phraseStyle === style;
      return `<button class="segment ${active ? "active" : ""}" data-phrase-style="${style}" type="button">${style === "all" ? "全部乐句" : style}</button>`;
    })
    .join("");
}

function renderPhraseLibrary() {
  const styleFilter = state.phraseStyle;
  const items = PHRASE_LIBRARY.filter((item) => styleFilter === "all" || item.style === styleFilter);
  els.phraseList.innerHTML = items
    .map(
      (item) => `
        <article class="phrase-card">
          <div class="phrase-meta">
            <span class="tag">${item.style}</span>
            <span class="tag">${escapeHtml(item.progression)}</span>
          </div>
          <h4>${escapeHtml(item.title)}</h4>
          <code>${escapeHtml(item.notes)}</code>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `
    )
    .join("");
}

function renderCustomPhrases() {
  if (!state.customPhrases.length) {
    els.customPhraseList.innerHTML = '<div class="empty-state">你创建的乐句会出现在这里。</div>';
    return;
  }
  els.customPhraseList.innerHTML = state.customPhrases
    .map(
      (item) => `
        <article class="custom-item">
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.style)} · ${escapeHtml(item.progression || "未写进行")}</p>
          <p>${escapeHtml(item.notes)}</p>
        </article>
      `
    )
    .join("");
}

function renderTabEditor() {
  state.tabGrid = normalizeTabGrid(state.tabGrid, state.tabBeats);
  els.tabEditor.style.setProperty("--beat-count", state.tabBeats);
  const strings = ["e", "B", "G", "D", "A", "E"];
  els.tabEditor.innerHTML = strings
    .map((string, rowIndex) => {
      const cells = state.tabGrid[rowIndex] || [];
      return `
        <div class="tab-row">
          <span>${string}</span>
          ${Array.from({ length: state.tabBeats }, (_, colIndex) => {
            const value = cells[colIndex] || "";
            return `<input data-row="${rowIndex}" data-col="${colIndex}" maxlength="2" placeholder="-" value="${escapeHtml(value)}" />`;
          }).join("")}
        </div>
      `;
    })
    .join("");
}

function serializeTabGrid(grid = state.tabGrid) {
  const strings = ["e", "B", "G", "D", "A", "E"];
  return strings
    .map((label, rowIndex) => {
      const row = grid[rowIndex] || [];
      const inputs = Array.from({ length: state.tabBeats }, (_, colIndex) => row[colIndex] || "-");
      return `${label}| ${inputs.join(" - ")}`;
    })
    .join("\n");
}

function updateTabPreview() {
  els.tabPreview.textContent = serializeTabGrid();
}

function renderSavedScores() {
  if (!state.scores.length) {
    els.savedScores.innerHTML = '<div class="empty-state">还没有保存任何谱例。</div>';
    return;
  }
  els.savedScores.innerHTML = state.scores
    .slice()
    .reverse()
    .map(
      (score) => `
        <article class="saved-score">
          <h4>${score.type === "tab" ? "吉他谱" : "钢琴谱"} · ${escapeHtml(score.title)}</h4>
          <p>${escapeHtml(score.memo || "无说明")}</p>
          <p>${escapeHtml(score.body)}</p>
        </article>
      `
    )
    .join("");
}

function persist() {
  localStorage.setItem(
    STORAGE_KEYS.prefs,
    JSON.stringify({
      useFlats: state.useFlats,
      mode: state.mode,
      root: state.root,
      selectedChordId: state.selectedChordId,
      category: state.category,
      chordSearch: state.chordSearch,
      phraseStyle: state.phraseStyle,
      tabBeats: state.tabBeats,
      tabGrid: state.tabGrid,
    })
  );
  localStorage.setItem(STORAGE_KEYS.customPhrases, JSON.stringify(state.customPhrases));
  localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(state.scores));
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...state.favorites]));
}

function loadState() {
  try {
    const prefs = JSON.parse(localStorage.getItem(STORAGE_KEYS.prefs) || "{}");
    state.useFlats = !!prefs.useFlats;
    state.mode = prefs.mode || "major";
    state.root = Number.isFinite(prefs.root) ? prefs.root : 0;
    state.selectedChordId = prefs.selectedChordId || "maj7";
    state.category = prefs.category || "all";
    state.chordSearch = prefs.chordSearch || "";
    state.phraseStyle = prefs.phraseStyle || "all";
    state.tabBeats = Number.isFinite(prefs.tabBeats) ? prefs.tabBeats : 4;
    state.tabGrid = normalizeTabGrid(prefs.tabGrid, state.tabBeats);
    state.customPhrases = JSON.parse(localStorage.getItem(STORAGE_KEYS.customPhrases) || "[]");
    state.scores = JSON.parse(localStorage.getItem(STORAGE_KEYS.scores) || "[]");
    const favs = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites) || "[]");
    state.favorites = new Set(Array.isArray(favs) ? favs : []);
  } catch {
    // ignore corrupt local state
  }
}

function setView(name) {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("active", view.id === name);
  });
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === name);
  });
  const titles = {
    dictionary: "和弦词典",
    theory: "乐理知识",
    phrases: "乐句工坊",
    scores: "谱例编辑",
  };
  els.viewTitle.textContent = titles[name] || "乐理词典";
}

function bindEvents() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  document.addEventListener("click", (event) => {
    const rootButton = event.target.closest("[data-root]");
    if (rootButton) {
      state.root = Number(rootButton.dataset.root);
      renderAll();
      persist();
      return;
    }

    const chordButton = event.target.closest("[data-chord]");
    if (chordButton) {
      state.selectedChordId = chordButton.dataset.chord;
      renderAll();
      persist();
      return;
    }

    const categoryButton = event.target.closest("[data-category]");
    if (categoryButton) {
      state.category = categoryButton.dataset.category;
      document.querySelectorAll("[data-category]").forEach((button) => {
        button.classList.toggle("active", button.dataset.category === state.category);
      });
      renderChordGrid();
      persist();
      return;
    }

    const phraseStyleButton = event.target.closest("[data-phrase-style]");
    if (phraseStyleButton) {
      state.phraseStyle = phraseStyleButton.dataset.phraseStyle;
      renderPhraseFilters();
      renderPhraseLibrary();
      persist();
    }
  });

  els.notationToggle.addEventListener("change", () => {
    state.useFlats = els.notationToggle.checked;
    renderAll();
    persist();
  });

  els.modeSelect.addEventListener("change", () => {
    state.mode = els.modeSelect.value;
    renderAll();
    persist();
  });

  els.chordSearch.addEventListener("input", () => {
    state.chordSearch = els.chordSearch.value.trim();
    renderChordGrid();
    persist();
  });

  els.favoriteChordBtn.addEventListener("click", () => {
    const chord = getSelectedChord();
    if (state.favorites.has(chord.id)) state.favorites.delete(chord.id);
    else state.favorites.add(chord.id);
    renderChordDetails(chord);
    persist();
  });

  els.phraseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const item = {
      id: `custom-${Date.now()}`,
      title: els.phraseTitle.value.trim(),
      style: els.phraseStyle.value,
      progression: els.phraseProgression.value.trim(),
      notes: els.phraseNotes.value.trim(),
    };
    state.customPhrases.push(item);
    els.phraseForm.reset();
    els.phraseStyle.value = item.style;
    renderCustomPhrases();
    persist();
  });

  els.addTabBeatBtn.addEventListener("click", () => {
    state.tabBeats += 1;
    state.tabGrid = normalizeTabGrid(state.tabGrid, state.tabBeats - 1).map((row) => [...row, ""]);
    renderTabEditor();
    updateTabPreview();
    persist();
  });

  els.clearTabBtn.addEventListener("click", () => {
    state.tabBeats = 4;
    state.tabGrid = createEmptyTabGrid(state.tabBeats);
    renderTabEditor();
    updateTabPreview();
    persist();
  });

  els.saveTabBtn.addEventListener("click", () => {
    const body = serializeTabGrid();
    const score = {
      id: `tab-${Date.now()}`,
      type: "tab",
      title: `未命名吉他谱 ${state.scores.filter((s) => s.type === "tab").length + 1}`,
      memo: "",
      body,
    };
    state.scores.push(score);
    renderSavedScores();
    persist();
  });

  els.clearPianoBtn.addEventListener("click", () => {
    els.rightHandInput.value = "";
    els.leftHandInput.value = "";
    els.scoreMemoInput.value = "";
  });

  els.savePianoBtn.addEventListener("click", () => {
    const score = {
      id: `piano-${Date.now()}`,
      type: "piano",
      title: `未命名钢琴谱 ${state.scores.filter((s) => s.type === "piano").length + 1}`,
      memo: els.scoreMemoInput.value.trim(),
      body: `右手: ${els.rightHandInput.value.trim() || "-"}\n左手: ${els.leftHandInput.value.trim() || "-"}`,
    };
    state.scores.push(score);
    renderSavedScores();
    persist();
  });

  els.tabEditor.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-row][data-col]");
    if (!input) return;
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    if (!state.tabGrid[row]) state.tabGrid[row] = [];
    state.tabGrid[row][col] = input.value.trim();
    updateTabPreview();
    persist();
  });
}

function renderAll() {
  els.notationToggle.checked = state.useFlats;
  els.modeSelect.value = state.mode;
  els.chordSearch.value = state.chordSearch;
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === state.category);
  });
  renderRootStrip();
  const chord = getSelectedChord();
  renderChordDetails(chord);
  renderPianoVisual(chord);
  renderFretboardVisual(chord);
  renderChordGrid();
  renderScaleView();
  renderKnowledge();
  renderPhraseFilters();
  renderPhraseLibrary();
  renderCustomPhrases();
  renderTabEditor();
  updateTabPreview();
  renderSavedScores();
  state.phraseStyle = state.phraseStyle || "all";
  document.querySelectorAll("[data-phrase-style]").forEach((button) => {
    button.classList.toggle("active", button.dataset.phraseStyle === state.phraseStyle);
  });
}

function initialize() {
  loadState();
  bindEvents();
  renderAll();
  setView("dictionary");
}

initialize();

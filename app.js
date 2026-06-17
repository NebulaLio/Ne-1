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

CHORD_QUALITY_LIBRARY.push(
  {
    id: "5",
    name: "5",
    symbols: ["5", "power"],
    intervals: [0, 7],
    category: "triad",
    color: "base",
    theory: "强力和弦，只保留根音与五音，调性感弱但力度直接。",
    function: "骨架/中性",
    guitar: "摇滚与流行吉他最常见，适合失真或强节奏。",
  },
  {
    id: "m6",
    name: "m6",
    symbols: ["m6", "-6"],
    intervals: [0, 3, 7, 9],
    category: "extended",
    color: "base",
    theory: "小六和弦常作为小调稳定终止，也可连接爵士中的 Dorian 色彩。",
    function: "小调主功能",
    guitar: "适合小调结尾，六度比小七更稳定。",
  },
  {
    id: "69",
    name: "6/9",
    symbols: ["6/9", "69"],
    intervals: [0, 4, 7, 9, 14],
    category: "extended",
    color: "base",
    theory: "六九和弦温暖、开放，常替代大七作为柔和主和弦。",
    function: "主功能色彩",
    guitar: "常用在 bossa、soul 与流行爵士。",
  },
  {
    id: "maj9",
    name: "maj9",
    symbols: ["maj9", "M9", "Δ9"],
    intervals: [0, 4, 7, 11, 14],
    category: "extended",
    color: "base",
    theory: "大九和弦延伸大七的透明感，旋律性更强。",
    function: "主功能延伸",
    guitar: "常省略五音，保留三音、大七与九音。",
  },
  {
    id: "maj13",
    name: "maj13",
    symbols: ["maj13", "M13", "Δ13"],
    intervals: [0, 4, 7, 11, 14, 21],
    category: "extended",
    color: "base",
    theory: "大十三和弦带 Lydian/major 色彩，适合现代和声铺陈。",
    function: "主功能延伸",
    guitar: "适合上方结构或分散声部。",
  },
  {
    id: "m9",
    name: "m9",
    symbols: ["m9", "-9"],
    intervals: [0, 3, 7, 10, 14],
    category: "extended",
    color: "base",
    theory: "小九和弦是 ii 级与小调主和弦的常用扩展。",
    function: "下属/小调主功能",
    guitar: "Dorian 色彩清楚，适合 comping。",
  },
  {
    id: "m11",
    name: "m11",
    symbols: ["m11", "-11"],
    intervals: [0, 3, 7, 10, 14, 17],
    category: "extended",
    color: "base",
    theory: "小十一和弦有开放的 Dorian 气质，适合静态 modal vamp。",
    function: "下属/调式色彩",
    guitar: "可用四度堆叠或省略五音。",
  },
  {
    id: "7sus4",
    name: "7sus4",
    symbols: ["7sus4", "sus7"],
    intervals: [0, 5, 7, 10],
    category: "seventh",
    color: "base",
    theory: "属七挂四保留属功能但推迟三音解决，常用于 gospel、fusion 与现代流行。",
    function: "属功能悬挂",
    guitar: "可在 sus 与 7 之间摆动形成律动。",
  },
  {
    id: "9sus4",
    name: "9sus4",
    symbols: ["9sus4", "sus9"],
    intervals: [0, 5, 7, 10, 14],
    category: "extended",
    color: "base",
    theory: "九挂四和弦色彩宽阔，常以 Mixolydian sus 或 Dorian 思路处理。",
    function: "属/悬挂色彩",
    guitar: "适合 funk、fusion 与 open voicing。",
  },
  {
    id: "7b9",
    name: "7b9",
    symbols: ["7b9"],
    intervals: [0, 4, 7, 10, 13],
    category: "altered",
    color: "altered",
    theory: "降九属和弦张力集中，常解决到小调或大调目标和弦。",
    function: "属功能强化",
    guitar: "可用半全减音阶或 Phrygian dominant。",
  },
  {
    id: "7sharp9",
    name: "7#9",
    symbols: ["7#9"],
    intervals: [0, 4, 7, 10, 15],
    category: "altered",
    color: "altered",
    theory: "升九属和弦有蓝调式摩擦，三音与 #9 形成强烈色彩。",
    function: "属功能强化",
    guitar: "blues、fusion、funk 中非常常见。",
  },
  {
    id: "7b13",
    name: "7b13",
    symbols: ["7b13"],
    intervals: [0, 4, 7, 10, 20],
    category: "altered",
    color: "altered",
    theory: "降十三属和弦有和声小调色彩，常解决到小调主和弦。",
    function: "属功能强化",
    guitar: "保留三音七音，加 b13 就有清楚方向。",
  }
);

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

const MODE_DETAILS = [
  {
    id: "ionian",
    label: "Ionian / 自然大调",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    feature: "明亮、稳定，主功能最清楚。",
    progression: "I - IV - V - I",
    improv: "强调 3、6、7，旋律落在 1/3/5 最稳定。",
  },
  {
    id: "dorianFull",
    label: "Dorian / 多利亚",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    feature: "小三度加自然六度，有爵士、funk 与 modal 色彩。",
    progression: "i7 - IV7 或 i7 - ii7",
    improv: "把 6 当作标志音，避免只听成自然小调。",
  },
  {
    id: "phrygian",
    label: "Phrygian / 弗里几亚",
    intervals: [0, 1, 3, 5, 7, 8, 10],
    feature: "b2 最有辨识度，紧张、暗色。",
    progression: "i - bII - bVII",
    improv: "b2 要谨慎强调，适合西班牙/金属色彩。",
  },
  {
    id: "lydian",
    label: "Lydian / 利底亚",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    feature: "#4 让大和弦漂浮、现代。",
    progression: "Imaj7 - II 或 Imaj7 - Vmaj7",
    improv: "对 maj7/#11 和弦特别自然，#4 是核心色彩。",
  },
  {
    id: "mixolydianFull",
    label: "Mixolydian / 混合利底亚",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    feature: "大三度加 b7，属功能与 blues 气质明显。",
    progression: "I7 - bVII - IV",
    improv: "围绕 3 与 b7 建立导向，9 与 13 很好用。",
  },
  {
    id: "aeolian",
    label: "Aeolian / 自然小调",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    feature: "自然小调，暗色但不一定强属解决。",
    progression: "i - bVI - bVII - i",
    improv: "b6 是关键色彩，旋律可围绕 1-b7-b6。",
  },
  {
    id: "locrian",
    label: "Locrian / 洛克里亚",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    feature: "b5 让主和弦不稳定，常对应 m7b5。",
    progression: "iø - V7alt - i",
    improv: "突出 b5 与 b9，常作为小调 iiø 功能。",
  },
];

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

PHRASE_LIBRARY.push(
  {
    id: "piano-04",
    title: "四部和声终止",
    style: "古典钢琴",
    progression: "ii6 - V7 - I",
    notes: "F A D | G B D F | C E G C",
    description:
      "强调低音级进与三音、七音解决：V7 的七音向下解决，导音向上解决到主音。",
  },
  {
    id: "piano-05",
    title: "挂留 4-3",
    style: "古典钢琴",
    progression: "I - Vsus4 - V - I",
    notes: "C E G | G C D | G B D | C E G",
    description:
      "古典 voice leading 里的典型挂留，先制造不协和，再让四度解决到三度。",
  },
  {
    id: "guitar-04",
    title: "三全音替代",
    style: "爵士吉他",
    progression: "Dm7 - Db7 - Cmaj7",
    notes: "D F A C | Db F Ab Cb | C E G B",
    description:
      "Db7 替代 G7，保留导向三音与七音，低音半音下行非常顺。",
  },
  {
    id: "guitar-05",
    title: "Modal Interchange",
    style: "爵士吉他",
    progression: "Cmaj7 - Abmaj7 - Bb7 - Cmaj7",
    notes: "C E G B | Ab C Eb G | Bb D F Ab | C E G B",
    description:
      "从同主小调借用 bVI 与 bVII，让大调获得电影感与 soul 色彩。",
  },
  {
    id: "guitar-06",
    title: "Dorian Vamp",
    style: "爵士吉他",
    progression: "Dm9 - G13",
    notes: "D F A C E | G B D F E",
    description:
      "适合 modal 即兴，重点听 Dorian 的自然六度 B 与属和弦的 13 音 E。",
  }
);

const INTERVAL_REFERENCE = [
  ["P1", "纯一度", 0, "完全稳定，同音或八度内重复。"],
  ["m2", "小二度", 1, "最紧张的邻接音，常需要解决。"],
  ["M2", "大二度", 2, "旋律级进，适合经过音。"],
  ["m3", "小三度", 3, "小调性质核心。"],
  ["M3", "大三度", 4, "大调性质核心。"],
  ["P4", "纯四度", 5, "可作挂留，也可作开放结构。"],
  ["TT", "三全音", 6, "属七核心张力，强烈需要解决。"],
  ["P5", "纯五度", 7, "稳定骨架，和声支柱。"],
  ["m6", "小六度", 8, "暗色张力，可视为增五。"],
  ["M6", "大六度", 9, "温暖、流动，常用于六和弦。"],
  ["m7", "小七度", 10, "属七与小七色彩。"],
  ["M7", "大七度", 11, "精致张力，适合大七和弦。"],
  ["P8", "纯八度", 12, "稳定重复，常作为低音加厚。"],
];

const PROGRESSION_PRESETS = [
  { title: "古典正格终止", degrees: ["I", "IV", "V", "I"], note: "T-S-D-T，最清楚的调性闭合。" },
  { title: "爵士 ii-V-I", degrees: ["ii7", "V7", "Imaj7"], note: "导向音最短连接，爵士核心语法。" },
  { title: "小调 iiø-V-i", degrees: ["iiø7", "V7alt", "imMaj7"], note: "小调强解决，变化属推动很强。" },
  { title: "流行循环", degrees: ["I", "V", "vi", "IV"], note: "稳定、歌唱性强，适合副歌。" },
  { title: "三全音替代", degrees: ["ii7", "bII7", "Imaj7"], note: "低音半音下行，爵士再和声常用。" },
  { title: "借用和弦", degrees: ["Imaj7", "bVImaj7", "bVII7", "Imaj7"], note: "Modal interchange，色彩鲜明。" },
];

const PROGRESSION_PALETTE = [
  { degree: "I", quality: "maj7", function: "T", label: "主功能" },
  { degree: "i", quality: "m7", function: "T", label: "小调主功能" },
  { degree: "ii7", quality: "m7", function: "S", label: "前属/下属" },
  { degree: "IV", quality: "maj7", function: "S", label: "下属功能" },
  { degree: "V7", quality: "7", function: "D", label: "属功能" },
  { degree: "V7alt", quality: "alt", function: "D", label: "变化属" },
  { degree: "vi", quality: "m7", function: "T", label: "替代主功能" },
  { degree: "iiø7", quality: "halfDim", function: "S", label: "小调前属" },
  { degree: "bII7", quality: "7", function: "D", label: "三全音替代" },
  { degree: "bVImaj7", quality: "maj7", function: "color", label: "借用色彩" },
  { degree: "bVII7", quality: "7", function: "color", label: "借用/摇摆" },
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

const AUDIO_REFERENCE = {
  C2: 36, "C#2": 37, Db2: 37, D2: 38, "D#2": 39, Eb2: 39, E2: 40, F2: 41, "F#2": 42, Gb2: 42,
  G2: 43, "G#2": 44, Ab2: 44, A2: 45, "A#2": 46, Bb2: 46, B2: 47,
  C3: 48, "C#3": 49, Db3: 49, D3: 50, "D#3": 51, Eb3: 51, E3: 52, F3: 53, "F#3": 54, Gb3: 54,
  G3: 55, "G#3": 56, Ab3: 56, A3: 57, "A#3": 58, Bb3: 58, B3: 59,
  C4: 60, "C#4": 61, Db4: 61, D4: 62, "D#4": 63, Eb4: 63, E4: 64, F4: 65, "F#4": 66, Gb4: 66,
  G4: 67, "G#4": 68, Ab4: 68, A4: 69, "A#4": 70, Bb4: 70, B4: 71,
  C5: 72, "C#5": 73, Db5: 73, D5: 74, "D#5": 75, Eb5: 75, E5: 76, F5: 77, "F#5": 78, Gb5: 78,
  G5: 79, "G#5": 80, Ab5: 80, A5: 81, "A#5": 82, Bb5: 82, B5: 83,
};

let audioContext = null;
let masterGain = null;

const state = {
  useFlats: false,
  mode: "major",
  root: 0,
  selectedChordId: "maj7",
  category: "all",
  chordSearch: "",
  phraseStyle: "all",
  styleMode: "jazz",
  theoryFocus: "chord",
  selectedModeId: "ionian",
  progression: ["ii7", "V7", "Imaj7"],
  quiz: { total: 0, correct: 0, answer: "", type: "chord" },
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
  constructionStrip: document.getElementById("constructionStrip"),
  selectedChordAnalysis: document.getElementById("selectedChordAnalysis"),
  selectedChordDetails: document.getElementById("selectedChordDetails"),
  chordGrid: document.getElementById("chordGrid"),
  chordSearch: document.getElementById("chordSearch"),
  pianoVisual: document.getElementById("pianoVisual"),
  fretboardVisual: document.getElementById("fretboardVisual"),
  voicingStrip: document.getElementById("voicingStrip"),
  theoryPanel: document.getElementById("theoryPanel"),
  theoryTabs: document.getElementById("theoryTabs"),
  playChordBtn: document.getElementById("playChordBtn"),
  playArpBtn: document.getElementById("playArpBtn"),
  playScaleUpBtn: document.getElementById("playScaleUpBtn"),
  playScaleDownBtn: document.getElementById("playScaleDownBtn"),
  scaleTitle: document.getElementById("scaleTitle"),
  scaleTones: document.getElementById("scaleTones"),
  degreeTable: document.getElementById("degreeTable"),
  knowledgeGrid: document.getElementById("knowledgeGrid"),
  intervalNoteA: document.getElementById("intervalNoteA"),
  intervalNoteB: document.getElementById("intervalNoteB"),
  intervalResult: document.getElementById("intervalResult"),
  intervalReference: document.getElementById("intervalReference"),
  playIntervalBtn: document.getElementById("playIntervalBtn"),
  progressionLibrary: document.getElementById("progressionLibrary"),
  progressionPalette: document.getElementById("progressionPalette"),
  progressionLane: document.getElementById("progressionLane"),
  progressionAnalysis: document.getElementById("progressionAnalysis"),
  clearProgressionBtn: document.getElementById("clearProgressionBtn"),
  loadProgressionBtn: document.getElementById("loadProgressionBtn"),
  addCurrentChordBtn: document.getElementById("addCurrentChordBtn"),
  modeGallery: document.getElementById("modeGallery"),
  modeDetail: document.getElementById("modeDetail"),
  voiceChordA: document.getElementById("voiceChordA"),
  voiceChordB: document.getElementById("voiceChordB"),
  voiceWarnings: document.getElementById("voiceWarnings"),
  voiceVisual: document.getElementById("voiceVisual"),
  visualizeVoiceBtn: document.getElementById("visualizeVoiceBtn"),
  playVoiceBtn: document.getElementById("playVoiceBtn"),
  phraseFilters: document.getElementById("phraseFilters"),
  phraseList: document.getElementById("phraseList"),
  phraseGuide: document.getElementById("phraseGuide"),
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
  voiceCheck: document.getElementById("voiceCheck"),
  savedScores: document.getElementById("savedScores"),
  quizPrompt: document.getElementById("quizPrompt"),
  quizOptions: document.getElementById("quizOptions"),
  quizScore: document.getElementById("quizScore"),
  nextQuizBtn: document.getElementById("nextQuizBtn"),
  quizNotes: document.getElementById("quizNotes"),
  favoriteChordBtn: document.getElementById("favoriteChordBtn"),
};

function noteName(index, useFlats = state.useFlats) {
  return (useFlats ? NOTE_NAMES.flat : NOTE_NAMES.sharp)[mod(index, 12)];
}

function noteToPitch(note, octave = 4) {
  const cleaned = String(note).trim().replace(/[^A-Ga-g#b0-9]/g, "");
  if (!cleaned) return null;
  const match = cleaned.match(/^([A-Ga-g])([#b]?)(-?\d+)?$/);
  if (!match) return null;
  const letter = match[1].toUpperCase();
  const accidental = match[2] || "";
  const parsedOctave = match[3] !== undefined ? Number(match[3]) : octave;
  const name = `${letter}${accidental}${parsedOctave}`;
  if (AUDIO_REFERENCE[name] !== undefined) return AUDIO_REFERENCE[name];
  const pitchClassMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  const pc = pitchClassMap[letter] + (accidental === "#" ? 1 : accidental === "b" ? -1 : 0);
  return 12 * (parsedOctave + 1) + mod(pc, 12);
}

function pitchToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
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

function getAudioContext() {
  if (!audioContext) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioContext = new AC();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.16;
    masterGain.connect(audioContext.destination);
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function midiToNoteName(midi) {
  const pitchClassNames = state.useFlats ? NOTE_NAMES.flat : NOTE_NAMES.sharp;
  const octave = Math.floor(midi / 12) - 1;
  return `${pitchClassNames[mod(midi, 12)]}${octave}`;
}

function parseNoteToken(token, fallbackOctave = 4) {
  const match = String(token).trim().match(/^([A-Ga-g])([#b]?)(-?\d+)?$/);
  if (!match) return null;
  const octave = match[3] !== undefined ? Number(match[3]) : fallbackOctave;
  const midi = noteToPitch(`${match[1].toUpperCase()}${match[2]}${octave}`, octave);
  return midi;
}

function playNotes(sequence, { duration = 0.34, gap = 0.05, mode = "block", velocity = 0.7, startAt = 0 } = {}) {
  const ctx = getAudioContext();
  const now = ctx.currentTime + 0.04 + startAt;
  sequence.forEach((item, index) => {
    const midi = typeof item === "number" ? item : noteToPitch(item);
    if (midi === null || Number.isNaN(midi)) return;
    const at = now + index * (mode === "arp" ? duration + gap : 0);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = pitchToFrequency(midi);
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(velocity, at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(at);
    osc.stop(at + duration + 0.05);
  });
}

function playChordNotes(notes, { arpeggio = false, octave = 4, octaveLift = 0 } = {}) {
  const ctx = getAudioContext();
  const baseMidi = notes.map((note) => {
    const midi = noteToPitch(note, octave);
    return midi === null ? null : midi + octaveLift * 12;
  }).filter((value) => value !== null);
  if (!baseMidi.length) return;
  if (arpeggio) {
    baseMidi.forEach((midi, index) => playNotes([midi], { mode: "arp", duration: 0.32, startAt: index * 0.08 }));
  } else {
    const now = ctx.currentTime + 0.05;
    baseMidi.forEach((midi) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = pitchToFrequency(midi);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.38, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + 1.2);
    });
  }
}

function playSequence(noteNames, { ascending = true, tempo = 0.26 } = {}) {
  const seq = ascending ? noteNames : [...noteNames].reverse();
  const ctx = getAudioContext();
  const now = ctx.currentTime + 0.04;
  seq.forEach((note, index) => {
    const midi = noteToPitch(`${note}4`);
    if (midi === null) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = pitchToFrequency(midi);
    gain.gain.setValueAtTime(0.0001, now + index * tempo);
    gain.gain.exponentialRampToValueAtTime(0.34, now + index * tempo + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + index * tempo + tempo * 0.9);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now + index * tempo);
    osc.stop(now + index * tempo + tempo);
  });
}

function playPhraseNotes(text) {
  const sequence = String(text)
    .split(/[|\n,]/)
    .flatMap((part) => part.trim().split(/\s+/))
    .map((token) => parseNoteToken(token))
    .filter((value) => value !== null);
  if (sequence.length) playNotes(sequence, { mode: "arp", duration: 0.22, gap: 0.03 });
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

function getChordMidi(chord, baseOctave = 4) {
  return chord.intervals.map((interval) => {
    const midi = 12 * (baseOctave + 1) + state.root + interval;
    return midi < 60 ? midi + 12 : midi;
  });
}

function getChordScaleRecommendation(chord) {
  const id = chord.id;
  if (["maj", "6", "69", "maj7", "maj9"].includes(id)) {
    return { scale: "Ionian / Major", notes: [0, 2, 4, 5, 7, 9, 11], why: "包含大三、大七与自然九音，主功能稳定。" };
  }
  if (["maj13"].includes(id)) {
    return { scale: "Lydian 或 Ionian", notes: [0, 2, 4, 6, 7, 9, 11], why: "#11 避开自然 11 与大三度的冲突，现代感更强。" };
  }
  if (["min", "m7", "m9", "m11", "m6"].includes(id)) {
    return { scale: "Dorian / Aeolian", notes: [0, 2, 3, 5, 7, 9, 10], why: "小三、小七稳定，自然六度让小和弦更有爵士感。" };
  }
  if (["7", "9", "13", "7sus4", "9sus4"].includes(id)) {
    return { scale: "Mixolydian", notes: [0, 2, 4, 5, 7, 9, 10], why: "大三加小七构成属功能，9 与 13 是常用自然张力。" };
  }
  if (["7b9", "7b13"].includes(id)) {
    return { scale: "Phrygian Dominant / Harmonic Minor V", notes: [0, 1, 4, 5, 7, 8, 10], why: "b9 与 b13 指向小调解决，色彩集中。" };
  }
  if (["7sharp9", "alt"].includes(id)) {
    return { scale: "Altered Scale / Super Locrian", notes: [0, 1, 3, 4, 6, 8, 10], why: "包含 b9、#9、b5、#5，适合强解决到目标和弦。" };
  }
  if (["halfDim"].includes(id)) {
    return { scale: "Locrian ♮2", notes: [0, 2, 3, 5, 6, 8, 10], why: "适合小调 iiø，保留 b5 且二度更柔和。" };
  }
  if (["dim", "dim7"].includes(id)) {
    return { scale: "Whole-Half Diminished", notes: [0, 2, 3, 5, 6, 8, 9, 11], why: "对称减音阶能覆盖减七和弦与经过功能。" };
  }
  if (["aug"].includes(id)) {
    return { scale: "Whole Tone", notes: [0, 2, 4, 6, 8, 10], why: "全音阶与增三和弦同样对称，悬浮感强。" };
  }
  return { scale: "Major Pentatonic / Chord Tones", notes: [0, 2, 4, 7, 9], why: "先锁定和弦音，再用五声音阶补旋律。" };
}

function getFunctionClass(chord) {
  if (["7", "9", "11", "13", "7b9", "7sharp9", "7b13", "alt", "dim", "dim7"].includes(chord.id)) return "Dominant";
  if (["m7", "m9", "m11", "halfDim", "sus2", "sus4", "7sus4", "9sus4"].includes(chord.id)) return "Subdominant";
  if (["maj", "maj7", "maj9", "maj13", "6", "69", "min", "m6", "mMaj7", "add9"].includes(chord.id)) return "Tonic";
  return "Color";
}

function getResolutionAdvice(chord) {
  const root = noteName(state.root);
  const upFourth = noteName(state.root + 5);
  const downHalf = noteName(state.root - 1);
  const downFifth = noteName(state.root - 5);
  if (getFunctionClass(chord) === "Dominant") {
    return `${root}${chord.name} 常解决到 ${upFourth} 或同目标小调；三音向上、七音向下，变化张力半音解决最自然。`;
  }
  if (chord.id === "halfDim") return `${root}m7b5 常作为小调 iiø，倾向进入 ${downFifth}7alt 再解决到小调主和弦。`;
  if (["sus2", "sus4", "7sus4", "9sus4"].includes(chord.id)) return "悬挂音倾向回到三音；也可以保持不解决，形成现代流行或 fusion 的开放感。";
  if (["dim", "dim7"].includes(chord.id)) return `可半音上行或下行解决，例如经过到 ${downHalf} 或 ${upFourth}，适合连接两个稳定和弦。`;
  return "稳定和弦可作为起点或终点；如果要推进，可去 IV/ii 类下属功能，再到 V 回归。";
}

function getTensionSummary(chord) {
  const tensions = chord.intervals
    .filter((interval) => Math.abs(interval) > 7 || [1, 2, 5, 6, 8, 9, 10, 11].includes(mod(interval, 12)))
    .map((interval) => `${intervalToLabel(interval)} ${noteName(state.root + interval)}`);
  return tensions.length ? tensions.join("、") : "以根音、三音、五音为主，没有明显高位张力。";
}

function getVoiceLeadingAdvice(chord) {
  const notes = getChordMidi(chord);
  const compact = notes.map((midi) => midiToNoteName(midi)).join(" - ");
  const functionClass = getFunctionClass(chord);
  if (functionClass === "Dominant") {
    return `保留三音与七音作为 guide tones；解决时让三音和七音反向半音/全音移动。紧凑声部：${compact}。`;
  }
  if (functionClass === "Subdominant") {
    return `优先连接到属功能，低音可级进，内声避免大跳。紧凑声部：${compact}。`;
  }
  return `适合做落点。钢琴可左手根音/五音，右手三音、七音与九音；吉他可省略五音。紧凑声部：${compact}。`;
}

function getTheoryHtml(chord = getSelectedChord()) {
  const chordScale = getChordScaleRecommendation(chord);
  const scaleNames = chordScale.notes.map((step) => noteName(state.root + step)).join(" ");
  const functionClass = getFunctionClass(chord);
  const styleAdvice = {
    jazz: "爵士模式：优先看三音、七音、张力音与可替代属，允许省略五音。",
    classical: "古典模式：优先看功能、终止、挂留解决与避免平行五八度。",
    pop: "流行模式：优先看可唱旋律、低音走向、开放和弦与稳定循环。",
  }[state.styleMode] || "";
  return `
    <h4>${getChordDisplayName(chord)} · ${functionClass}</h4>
    <ul>
      <li><strong>功能：</strong>${functionClass} / ${chord.function}</li>
      <li><strong>常见解决：</strong>${getResolutionAdvice(chord)}</li>
      <li><strong>张力音与色彩：</strong>${getTensionSummary(chord)}</li>
      <li><strong>Chord-Scale：</strong>${chordScale.scale}（${scaleNames}）。${chordScale.why}</li>
      <li><strong>声部进行：</strong>${getVoiceLeadingAdvice(chord)}</li>
      <li><strong>风格提示：</strong>${styleAdvice}</li>
    </ul>
  `;
}

function getScaleTheoryHtml() {
  const modeNotes = getScaleNotes().map((n) => noteName(n)).join(" ");
  return `
    <h4>${noteName(state.root)} ${getModeLabel()}</h4>
    <ul>
      <li><strong>音阶：</strong>${modeNotes}</li>
      <li><strong>功能：</strong>${getDegreeLabels().join(" - ")}</li>
      <li><strong>练习：</strong>先唱 1-3-5-7，再补 2/4/6，避免只背音名。</li>
      <li><strong>即兴：</strong>围绕当前和弦音落点，用邻音和经过音连接。</li>
    </ul>
  `;
}

function getProgressionTheoryHtml() {
  const analysis = analyzeProgression(state.progression);
  return `
    <h4>功能进行分析</h4>
    <ul>
      <li><strong>罗马数字：</strong>${analysis.roman}</li>
      <li><strong>功能链：</strong>${analysis.functions}</li>
      <li><strong>好听度评分：</strong>${analysis.score}/100</li>
      <li><strong>替代建议：</strong>${analysis.suggestion}</li>
    </ul>
  `;
}

function getVoiceTheoryHtml() {
  const a = chordById(els.voiceChordA?.value || "maj7");
  const b = chordById(els.voiceChordB?.value || "7");
  return `
    <h4>${a.name} → ${b.name}</h4>
    <p>${compareVoiceLeading(a, b).summary}</p>
  `;
}

function chordById(id) {
  return CHORD_QUALITY_LIBRARY.find((chord) => chord.id === id) || CHORD_QUALITY_LIBRARY[0];
}

function degreeFunction(degree) {
  const token = String(degree);
  const lower = token.toLowerCase();
  if (/^i(?!v|ii|vi|vii)/.test(token)) {
    const suffix = lower.slice(1);
    if (suffix.includes("7") || suffix.includes("alt") || suffix.includes("b9") || suffix.includes("#9") || suffix.includes("b13")) return "D";
    if (suffix.includes("m7b5") || suffix.includes("dim")) return "S";
    if (suffix.includes("sus")) return "S";
    return "T";
  }
  if (lower.startsWith("bii") || lower.startsWith("v7") || lower.startsWith("vii") || lower.startsWith("alt") || lower === "v") return "D";
  if (lower.startsWith("ii") || lower.startsWith("iv") || lower.startsWith("sus")) return "S";
  if (lower.startsWith("vi") || lower.startsWith("bvi") || lower.startsWith("biii")) return "T";
  return "color";
}

function analyzeProgression(degrees = []) {
  const functions = degrees.map((degree) => degreeFunction(degree));
  let score = 52;
  const chain = functions.join("-");
  if (chain.includes("S-D-T")) score += 28;
  if (chain.includes("T-S-D-T")) score += 24;
  if (chain.includes("D-T")) score += 18;
  if (degrees.some((degree) => degree.includes("alt") || degree.includes("bII"))) score += 8;
  if (degrees.length >= 4) score += 6;
  if (functions.filter((fn) => fn === "T").length >= 2) score += 4;
  score = Math.max(20, Math.min(100, score));
  const suggestion = (() => {
    if (!functions.includes("D")) return "加入 V7 或 tritone sub bII7，進行會更有解決感。";
    if (!functions.includes("S")) return "在屬和弦前加入 ii7 或 IV，可讓推進更自然。";
    if (!degrees.some((degree) => degree.includes("alt"))) return "爵士化可把 V7 換成 V7alt、7b9 或 bII7。";
    return "進行已有清楚功能鏈，可嘗試 modal interchange：bVImaj7 或 bVII7。";
  })();
  return {
    roman: degrees.join(" - ") || "尚未建立",
    functions: functions.map((fn) => ({ T: "Tonic", S: "Subdominant", D: "Dominant", color: "Color" })[fn]).join(" → ") || "尚未建立",
    score,
    suggestion,
  };
}

function degreeToChordName(degree) {
  const root = state.root;
  const majorMap = {
    I: [0, ""],
    i: [0, "m"],
    Imaj7: [0, "maj7"],
    imMaj7: [0, "mMaj7"],
    ii7: [2, "m7"],
    "iiø7": [2, "m7b5"],
    IV: [5, ""],
    V: [7, ""],
    V7: [7, "7"],
    V7alt: [7, "alt"],
    vi: [9, "m"],
    bII7: [1, "7"],
    bVImaj7: [8, "maj7"],
    bVII7: [10, "7"],
    "iø7": [0, "m7b5"],
    "ii7": [2, "m7"],
    "bVI7": [8, "7"],
  };
  if (majorMap[degree]) {
    const [offset, suffix] = majorMap[degree];
    return `${noteName(root + offset)}${suffix}`;
  }
  if (/^I(?!V)/.test(String(degree))) {
    const suffix = String(degree).slice(1);
    const suffixMap = {
      "": "",
      m: "m",
      min: "m",
      maj7: "maj7",
      maj9: "maj9",
      maj13: "maj13",
      m7: "m7",
      m9: "m9",
      m11: "m11",
      m6: "m6",
      m69: "m6",
      mMaj7: "mMaj7",
      m7b5: "m7b5",
      dim: "dim",
      dim7: "dim7",
      aug: "aug",
      sus2: "sus2",
      sus4: "sus4",
      "7": "7",
      "6": "6",
      "69": "6/9",
      "9": "9",
      "11": "11",
      "13": "13",
      add9: "add9",
      alt: "alt",
      "7alt": "alt",
      "7b9": "7b9",
      "7#9": "7#9",
      "7b13": "7b13",
      "7sus4": "7sus4",
      "9sus4": "9sus4",
    };
    return `${noteName(root)}${suffixMap[suffix] || suffix}`;
  }
  const [offset, suffix] = majorMap[degree] || [0, ""];
  return `${noteName(root + offset)}${suffix}`;
}

function compareVoiceLeading(chordA, chordB) {
  const source = getChordMidi(chordA).slice(0, 4).sort((a, b) => a - b);
  const targetRaw = getChordMidi(chordB).slice(0, 4).sort((a, b) => a - b);
  const moves = source.map((from, index) => {
    const raw = targetRaw[index % targetRaw.length] || targetRaw[0];
    let to = raw;
    while (to - from > 6) to -= 12;
    while (from - to > 6) to += 12;
    return { from, to, distance: to - from };
  });
  const maxMove = Math.max(...moves.map((move) => Math.abs(move.distance)));
  const parallelRisk = moves.filter((move) => Math.abs(move.distance) === 7 || Math.abs(move.distance) === 12).length >= 2;
  const summary = `最大移動 ${maxMove} 半音；${maxMove <= 3 ? "聲部非常平滑" : maxMove <= 6 ? "可接受，但可再找共同音" : "跳進偏大"}。${parallelRisk ? "注意可能有平行五度/八度。" : "未見明顯平行五八度風險。"}`;
  return { source, target: moves.map((m) => m.to), moves, summary, parallelRisk };
}

function getIntervalInfo(a, b) {
  const semitones = mod(b - a, 12);
  const simple = INTERVAL_REFERENCE.find((item) => item[2] === semitones) || INTERVAL_REFERENCE[0];
  return {
    code: simple[0],
    name: simple[1],
    semitones,
    text: simple[3],
  };
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
  const construction = chord.intervals.map((interval, index) => {
    const label = ["根音", "三音", "五音", "七音", "九音", "十一音", "十三音"][index] || `${index + 1}`;
    return `${label} +${intervalToLabel(interval)} = ${noteName(state.root + interval)}`;
  });
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
  els.constructionStrip.innerHTML = construction
    .map((step, index) => `<div class="construction-step"><strong>Step ${index + 1}</strong><span>${escapeHtml(step)}</span></div>`)
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
  const scalePitches = new Set(getScaleNotes().map((note) => mod(note, 12)));
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
      const pitch = mod(key.pitch, 12);
      const active = activePitches.has(pitch);
      const scaleActive = !active && scalePitches.has(pitch);
      return `<div class="piano-key ${key.black ? "black" : ""} ${active ? "active" : ""} ${scaleActive ? "scale-active" : ""}">${base}</div>`;
    })
    .join("");
}

function renderFretboardVisual(chord) {
  const activePitches = getChordPitchClasses(chord);
  const scalePitches = new Set(getScaleNotes().map((note) => mod(note, 12)));
  const frets = Array.from({ length: 12 }, (_, i) => i);
  const rows = STRING_TUNING.map((stringInfo, stringIdx) => {
    const cells = frets
      .map((fret) => {
        const pitch = mod(stringInfo.open + fret, 12);
        const note = noteName(pitch);
        const active = activePitches.has(pitch);
        const scaleActive = !active && scalePitches.has(pitch);
        const marker = active
          ? `<span class="fret-dot chord-dot">${note}</span>`
          : scaleActive
            ? `<span class="fret-dot scale-dot">${note}</span>`
            : "";
        return `<div class="fret-cell ${scaleActive ? "scale-active" : ""}">${marker}</div>`;
      })
      .join("");
    return `<div class="fretboard"><div class="string-label">${stringInfo.string}</div>${cells}</div>`;
  });
  const header = `<div class="fretboard"><div class="fret-number"></div>${frets
    .map((fret) => `<div class="fret-number">${fret}</div>`)
    .join("")}</div>`;
  els.fretboardVisual.innerHTML = `${header}${rows.join("")}`;
}

function renderVoicings(chord) {
  const tones = getChordNoteNames(chord);
  const compact = getChordMidi(chord).slice(0, 4).map((midi) => midiToNoteName(midi)).join(" ");
  const drop2 = getChordMidi(chord).slice(0, 4);
  if (drop2.length >= 4) drop2[1] -= 12;
  const guitarSet = tones.slice(0, 4).join(" ");
  els.voicingStrip.innerHTML = [
    ["钢琴紧凑", compact],
    ["Drop 2", drop2.map((midi) => midiToNoteName(midi)).join(" ")],
    ["吉他省略", guitarSet],
  ].map(([title, body]) => `<article class="voicing-card"><strong>${title}</strong><span>${body}</span></article>`).join("");
}

function renderTheoryPanel() {
  if (!els.theoryPanel) return;
  const chord = getSelectedChord();
  const html = {
    chord: getTheoryHtml(chord),
    scale: getScaleTheoryHtml(),
    progression: getProgressionTheoryHtml(),
    voice: getVoiceTheoryHtml(),
  }[state.theoryFocus] || getTheoryHtml(chord);
  els.theoryPanel.innerHTML = html;
  document.querySelectorAll("[data-theory-focus]").forEach((button) => {
    button.classList.toggle("active", button.dataset.theoryFocus === state.theoryFocus);
  });
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

function renderIntervalTool() {
  if (!els.intervalNoteA) return;
  const options = NOTE_NAMES.sharp.map((name, index) => `<option value="${index}">${name}</option>`).join("");
  if (!els.intervalNoteA.innerHTML) {
    els.intervalNoteA.innerHTML = options;
    els.intervalNoteB.innerHTML = options;
    els.intervalNoteB.value = "7";
  }
  const a = Number(els.intervalNoteA.value || 0);
  const b = Number(els.intervalNoteB.value || 7);
  const info = getIntervalInfo(a, b);
  els.intervalResult.innerHTML = `
    <h4>${noteName(a)} → ${noteName(b)}</h4>
    <ul>
      <li><strong>音程：</strong>${info.name}（${info.code}）</li>
      <li><strong>半音数：</strong>${info.semitones}</li>
      <li><strong>听感/用法：</strong>${info.text}</li>
    </ul>
  `;
  els.intervalReference.innerHTML = INTERVAL_REFERENCE.map(
    ([code, name, semitones, text]) => `
      <article class="interval-item">
        <strong>${code}</strong>
        <span>${name} · ${semitones} 半音 · ${text}</span>
      </article>
    `
  ).join("");
}

function renderProgressionLibrary() {
  if (!els.progressionLibrary) return;
  els.progressionLibrary.innerHTML = PROGRESSION_PRESETS.map(
    (preset, index) => `
      <article class="progression-card drag-source" draggable="true" data-preset="${index}" data-drag-degree="${preset.degrees[0]}">
        <strong>${preset.title}</strong>
        <span>${preset.degrees.join(" - ")}</span>
        <p>${preset.note}</p>
      </article>
    `
  ).join("");
}

function renderProgressionBuilder() {
  if (!els.progressionPalette) return;
  els.progressionPalette.innerHTML = PROGRESSION_PALETTE.map(
    (item) => `
      <button class="palette-chord" data-add-degree="${item.degree}" type="button">
        <strong>${item.degree}</strong>
        <span>${degreeToChordName(item.degree)} · ${item.label}</span>
      </button>
    `
  ).join("");
  els.progressionLane.innerHTML = state.progression.length
    ? state.progression.map((degree, index) => `
        <button class="lane-chord" data-remove-degree="${index}" type="button">
          <strong>${degree}</strong>
          <span>${degreeToChordName(degree)} · 点击移除</span>
        </button>
      `).join("")
    : '<div class="empty-state">点击左侧和弦加入进行。</div>';
  const analysis = analyzeProgression(state.progression);
  els.progressionAnalysis.innerHTML = `
    <h4>${analysis.roman}</h4>
    <ul>
      <li><strong>功能链：</strong>${analysis.functions}</li>
      <li><strong>好听度评分：</strong>${analysis.score}/100</li>
      <li><strong>替代建议：</strong>${analysis.suggestion}</li>
      <li><strong>实际和弦：</strong>${state.progression.map(degreeToChordName).join(" - ") || "尚未建立"}</li>
    </ul>
  `;
}

function renderModes() {
  if (!els.modeGallery) return;
  els.modeGallery.innerHTML = MODE_DETAILS.map((mode) => {
    const notes = mode.intervals.map((step) => noteName(state.root + step)).join(" ");
    return `
      <article class="mode-card ${mode.id === state.selectedModeId ? "active" : ""}" data-mode-detail="${mode.id}">
        <h4>${mode.label}</h4>
        <p>${notes}</p>
        <p>${mode.feature}</p>
      </article>
    `;
  }).join("");
  const selected = MODE_DETAILS.find((mode) => mode.id === state.selectedModeId) || MODE_DETAILS[0];
  els.modeDetail.innerHTML = `
    <h4>${selected.label}</h4>
    <ul>
      <li><strong>音阶：</strong>${selected.intervals.map((step) => noteName(state.root + step)).join(" ")}</li>
      <li><strong>特点：</strong>${selected.feature}</li>
      <li><strong>范例进行：</strong>${selected.progression}</li>
      <li><strong>即兴提示：</strong>${selected.improv}</li>
    </ul>
  `;
}

function renderVoiceControls() {
  if (!els.voiceChordA) return;
  const options = CHORD_QUALITY_LIBRARY.map((chord) => `<option value="${chord.id}">${noteName(state.root)}${chord.name}</option>`).join("");
  const previousA = els.voiceChordA.value || "maj7";
  const previousB = els.voiceChordB.value || "7";
  els.voiceChordA.innerHTML = options;
  els.voiceChordB.innerHTML = options;
  els.voiceChordA.value = previousA;
  els.voiceChordB.value = previousB;
  renderVoiceVisual();
}

function renderVoiceVisual() {
  if (!els.voiceVisual) return;
  const chordA = chordById(els.voiceChordA.value || "maj7");
  const chordB = chordById(els.voiceChordB.value || "7");
  const comparison = compareVoiceLeading(chordA, chordB);
  const all = [...comparison.source, ...comparison.target];
  const min = Math.min(...all) - 2;
  const max = Math.max(...all) + 2;
  const yFor = (midi) => 320 - ((midi - min) / (max - min || 1)) * 280;
  const rows = comparison.moves.map((move, index) => {
    const x1 = 120;
    const x2 = 720;
    const y1 = yFor(move.from);
    const y2 = yFor(move.to);
    return `
      <line class="voice-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"></line>
      <circle class="voice-note" cx="${x1}" cy="${y1}" r="22"></circle>
      <circle class="voice-note" cx="${x2}" cy="${y2}" r="22"></circle>
      <text class="voice-label" x="${x1 - 24}" y="${y1 + 5}">${midiToNoteName(move.from)}</text>
      <text class="voice-label" x="${x2 - 24}" y="${y2 + 5}">${midiToNoteName(move.to)}</text>
      <text class="voice-label" x="405" y="${(y1 + y2) / 2 - 6}">${move.distance > 0 ? "+" : ""}${move.distance}</text>
    `;
  }).join("");
  els.voiceVisual.innerHTML = `
    <defs>
      <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#1f7a68"></path>
      </marker>
    </defs>
    <text class="voice-label" x="80" y="28">${noteName(state.root)}${chordA.name}</text>
    <text class="voice-label" x="680" y="28">${noteName(state.root)}${chordB.name}</text>
    ${rows}
  `;
  els.voiceWarnings.innerHTML = `
    <h4>检查结果</h4>
    <p>${comparison.summary}</p>
  `;
}

function renderPhraseGuide() {
  if (!els.phraseGuide) return;
  const chord = getSelectedChord();
  const suggestions = {
    jazz: `先抓 ${chord.name} 的三音与七音，再用 ${getChordScaleRecommendation(chord).scale} 连接到目标和弦。`,
    classical: "以动机发展和声部进行为主，优先考虑邻接、经过与挂留。",
    pop: "先保持旋律可唱，再用 I-V-vi-IV 或同类循环撑住整体。",
  };
  els.phraseGuide.innerHTML = `
    <h4>创作引导</h4>
    <ul>
      <li><strong>当前和弦：</strong>${getChordDisplayName(chord)}</li>
      <li><strong>发展建议：</strong>${suggestions[state.styleMode] || suggestions.jazz}</li>
      <li><strong>非和弦音：</strong>可用经过音、辅助音、挂留音与邻音增加线性流动。</li>
    </ul>
  `;
}

function renderVoiceCheck() {
  if (!els.voiceCheck) return;
  const lines = [
    els.rightHandInput.value.trim(),
    els.leftHandInput.value.trim(),
  ].filter(Boolean);
  const pairs = lines.flatMap((line) => line.split("|").map((part) => part.trim()).filter(Boolean));
  const bad = [];
  for (let i = 0; i < pairs.length - 1; i++) {
    const current = pairs[i].split(/\s+/).map((note) => parseNoteToken(note)).filter((n) => n !== null);
    const next = pairs[i + 1].split(/\s+/).map((note) => parseNoteToken(note)).filter((n) => n !== null);
    if (!current.length || !next.length) continue;
    if (current.length >= 2 && next.length >= 2) {
      const currentInterval = mod(current[1] - current[0], 12);
      const nextInterval = mod(next[1] - next[0], 12);
      if ((currentInterval === 7 && nextInterval === 7) || (currentInterval === 0 && nextInterval === 0)) {
        bad.push(`第 ${i + 1} 组可能有平行五度/八度。`);
      }
    }
  }
  els.voiceCheck.innerHTML = `
    <h4>声部检查</h4>
    <p>${bad.length ? bad.join(" ") : "暂未发现明显平行五度/八度；可继续用分解和弦检查。"}</p>
  `;
}

function renderQuiz() {
  const kinds = ["chord", "interval"];
  if (!state.quiz.answer) nextQuiz();
  els.quizScore.textContent = `${state.quiz.correct} / ${state.quiz.total}`;
  els.quizPrompt.innerHTML =
    state.quiz.type === "chord"
      ? `<h4>这是哪个和弦？</h4><p>${state.quiz.prompt}</p>`
      : `<h4>这是哪个音程？</h4><p>${state.quiz.prompt}</p>`;
  els.quizOptions.innerHTML = state.quiz.options
    .map(
      (option, index) => `
        <button class="quiz-option" data-quiz-option="${index}" type="button">${option}</button>
      `
    )
    .join("");
  els.quizNotes.innerHTML = `
    <h4>学习提示</h4>
    <p>${state.quiz.hint}</p>
  `;
}

function nextQuiz() {
  const chordMode = Math.random() > 0.45;
  if (chordMode) {
    const chord = CHORD_QUALITY_LIBRARY[Math.floor(Math.random() * CHORD_QUALITY_LIBRARY.length)];
    const correct = `${noteName(state.root)}${chord.name}`;
    const wrongs = CHORD_QUALITY_LIBRARY.filter((item) => item.id !== chord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((item) => `${noteName(state.root)}${item.name}`);
    state.quiz = {
      type: "chord",
      prompt: `${getChordNoteNames(chord).join("、")}，功能 ${getFunctionClass(chord)}。`,
      options: [correct, ...wrongs].sort(() => Math.random() - 0.5),
      answer: correct,
      hint: getTheoryHtml(chord).replace(/<[^>]+>/g, " "),
    };
  } else {
    const interval = INTERVAL_REFERENCE[Math.floor(Math.random() * (INTERVAL_REFERENCE.length - 1))];
    const a = NOTE_NAMES.sharp[Math.floor(Math.random() * 12)];
    const b = NOTE_NAMES.sharp[(NOTE_NAMES.sharp.indexOf(a) + interval[2]) % 12];
    const answer = interval[1];
    const wrongs = INTERVAL_REFERENCE.filter((item) => item[1] !== interval[1]).sort(() => Math.random() - 0.5).slice(0, 3).map((item) => item[1]);
    state.quiz = {
      type: "interval",
      prompt: `${a} → ${b}`,
      options: [answer, ...wrongs].sort(() => Math.random() - 0.5),
      answer,
      hint: `答案是 ${interval[0]}，${interval[3]}`,
    };
  }
  state.quiz.total += 1;
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
          <button class="ghost-button" data-play-phrase="${escapeHtml(item.notes)}" type="button">播放</button>
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
          <button class="ghost-button" data-play-custom-phrase="${escapeHtml(item.notes)}" type="button">播放</button>
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
      styleMode: state.styleMode,
      theoryFocus: state.theoryFocus,
      selectedModeId: state.selectedModeId,
      progression: state.progression,
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
    state.styleMode = prefs.styleMode || "jazz";
    state.theoryFocus = prefs.theoryFocus || "chord";
    state.selectedModeId = prefs.selectedModeId || "ionian";
    state.progression = Array.isArray(prefs.progression) ? prefs.progression : ["ii7", "V7", "Imaj7"];
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
    theory: "乐理解说",
    intervals: "音程词典",
    progressions: "功能和声",
    modes: "调式大全",
    voice: "声部进行",
    phrases: "乐句工坊",
    quiz: "测验模式",
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
      return;
    }

    const styleModeButton = event.target.closest("[data-style-mode]");
    if (styleModeButton) {
      state.styleMode = styleModeButton.dataset.styleMode;
      renderAll();
      persist();
      return;
    }

    const theoryButton = event.target.closest("[data-theory-focus]");
    if (theoryButton) {
      state.theoryFocus = theoryButton.dataset.theoryFocus;
      renderTheoryPanel();
      persist();
      return;
    }

    const presetButton = event.target.closest("[data-preset]");
    if (presetButton) {
      const preset = PROGRESSION_PRESETS[Number(presetButton.dataset.preset)];
      if (preset) {
        state.progression = [...preset.degrees];
        renderProgressionBuilder();
        renderTheoryPanel();
        persist();
      }
      return;
    }

    const addDegreeButton = event.target.closest("[data-add-degree]");
    if (addDegreeButton) {
      state.progression.push(addDegreeButton.dataset.addDegree);
      renderProgressionBuilder();
      renderTheoryPanel();
      persist();
      return;
    }

    const removeDegreeButton = event.target.closest("[data-remove-degree]");
    if (removeDegreeButton) {
      state.progression.splice(Number(removeDegreeButton.dataset.removeDegree), 1);
      renderProgressionBuilder();
      renderTheoryPanel();
      persist();
      return;
    }

    const modeCard = event.target.closest("[data-mode-detail]");
    if (modeCard) {
      state.selectedModeId = modeCard.dataset.modeDetail;
      renderModes();
      persist();
      return;
    }

    const quizOption = event.target.closest("[data-quiz-option]");
    if (quizOption) {
      const chosen = state.quiz.options[Number(quizOption.dataset.quizOption)];
      const correct = chosen === state.quiz.answer;
      if (correct) state.quiz.correct += 1;
      quizOption.classList.add(correct ? "correct" : "wrong");
      els.quizNotes.innerHTML = `<h4>${correct ? "答对了" : "再想一下"}</h4><p>正确答案：${state.quiz.answer}。${state.quiz.hint}</p>`;
      els.quizScore.textContent = `${state.quiz.correct} / ${state.quiz.total}`;
      return;
    }

    const phrasePlay = event.target.closest("[data-play-phrase], [data-play-custom-phrase]");
    if (phrasePlay) {
      playPhraseNotes(phrasePlay.dataset.playPhrase || phrasePlay.dataset.playCustomPhrase || "");
      return;
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

  els.playChordBtn.addEventListener("click", () => playChordNotes(getChordNoteNames(getSelectedChord()), { arpeggio: false }));
  els.playArpBtn.addEventListener("click", () => playChordNotes(getChordNoteNames(getSelectedChord()), { arpeggio: true }));
  els.playScaleUpBtn.addEventListener("click", () => playSequence(getScaleNotes().map((note) => noteName(note)), { ascending: true }));
  els.playScaleDownBtn.addEventListener("click", () => playSequence(getScaleNotes().map((note) => noteName(note)), { ascending: false }));
  els.addCurrentChordBtn.addEventListener("click", () => {
    const chord = getSelectedChord();
    state.progression.push(`I${chord.name}`);
    renderProgressionBuilder();
    renderTheoryPanel();
    persist();
  });

  els.intervalNoteA.addEventListener("change", renderIntervalTool);
  els.intervalNoteB.addEventListener("change", renderIntervalTool);
  els.playIntervalBtn.addEventListener("click", () => {
    const a = Number(els.intervalNoteA.value || 0);
    const b = Number(els.intervalNoteB.value || 7);
    playNotes([60 + a, 60 + b], { mode: "arp", duration: 0.42, gap: 0.1 });
  });

  els.clearProgressionBtn.addEventListener("click", () => {
    state.progression = [];
    renderProgressionBuilder();
    renderTheoryPanel();
    persist();
  });

  els.loadProgressionBtn.addEventListener("click", () => {
    state.progression = ["ii7", "V7", "Imaj7"];
    renderProgressionBuilder();
    renderTheoryPanel();
    persist();
  });

  els.progressionPalette.addEventListener("dragstart", (event) => {
    const source = event.target.closest("[data-drag-degree]");
    if (source && event.dataTransfer) event.dataTransfer.setData("text/plain", source.dataset.dragDegree);
  });

  els.progressionLane.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  els.progressionLane.addEventListener("drop", (event) => {
    event.preventDefault();
    const degree = event.dataTransfer?.getData("text/plain");
    if (!degree) return;
    state.progression.push(degree);
    renderProgressionBuilder();
    renderTheoryPanel();
    persist();
  });

  els.voiceChordA.addEventListener("change", renderVoiceVisual);
  els.voiceChordB.addEventListener("change", renderVoiceVisual);
  els.visualizeVoiceBtn.addEventListener("click", renderVoiceVisual);
  els.playVoiceBtn.addEventListener("click", () => {
    const a = chordById(els.voiceChordA.value || "maj7");
    const b = chordById(els.voiceChordB.value || "7");
    playNotes(getChordMidi(a), { mode: "block", duration: 0.8, startAt: 0 });
    playNotes(getChordMidi(b), { mode: "block", duration: 0.8, startAt: 0.9 });
  });

  els.nextQuizBtn.addEventListener("click", () => {
    nextQuiz();
    renderQuiz();
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
    renderVoiceCheck();
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

  els.rightHandInput.addEventListener("input", renderVoiceCheck);
  els.leftHandInput.addEventListener("input", renderVoiceCheck);
}

function renderAll() {
  els.notationToggle.checked = state.useFlats;
  els.modeSelect.value = state.mode;
  els.chordSearch.value = state.chordSearch;
  document.querySelectorAll("[data-style-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.styleMode === state.styleMode);
  });
  document.querySelectorAll("[data-category]").forEach((button) => {
    button.classList.toggle("active", button.dataset.category === state.category);
  });
  renderRootStrip();
  const chord = getSelectedChord();
  renderChordDetails(chord);
  renderPianoVisual(chord);
  renderFretboardVisual(chord);
  renderVoicings(chord);
  renderTheoryPanel();
  renderChordGrid();
  renderScaleView();
  renderKnowledge();
  renderIntervalTool();
  renderProgressionLibrary();
  renderProgressionBuilder();
  renderModes();
  renderVoiceControls();
  renderPhraseFilters();
  renderPhraseLibrary();
  renderPhraseGuide();
  renderCustomPhrases();
  renderTabEditor();
  updateTabPreview();
  renderVoiceCheck();
  renderSavedScores();
  renderQuiz();
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

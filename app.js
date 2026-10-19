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
  // ── 教會調式（中古調式） ─────────────────────────────
  {
    id: "ionian",
    category: "教會調式",
    label: "Ionian / 自然大调",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    feature: "明亮、稳定，主功能最清楚。",
    progression: "I - IV - V - I",
    improv: "强调 3、6、7，旋律落在 1/3/5 最稳定。",
  },
  {
    id: "dorianFull",
    category: "教會調式",
    label: "Dorian / 多利亚",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    feature: "小三度加自然六度，有爵士、funk 与 modal 色彩。",
    progression: "i7 - IV7 或 i7 - ii7",
    improv: "把 6 当作标志音，避免只听成自然小调。",
  },
  {
    id: "phrygian",
    category: "教會調式",
    label: "Phrygian / 弗里几亚",
    intervals: [0, 1, 3, 5, 7, 8, 10],
    feature: "b2 最有辨识度，紧张、暗色。",
    progression: "i - bII - bVII",
    improv: "b2 要谨慎强调，适合西班牙/金属色彩。",
  },
  {
    id: "lydian",
    category: "教會調式",
    label: "Lydian / 利底亚",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    feature: "#4 让大和弦漂浮、现代。",
    progression: "Imaj7 - II 或 Imaj7 - Vmaj7",
    improv: "对 maj7/#11 和弦特别自然，#4 是核心色彩。",
  },
  {
    id: "mixolydianFull",
    category: "教會調式",
    label: "Mixolydian / 混合利底亚",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    feature: "大三度加 b7，属功能与 blues 气质明显。",
    progression: "I7 - bVII - IV",
    improv: "围绕 3 与 b7 建立导向，9 与 13 很好用。",
  },
  {
    id: "aeolian",
    category: "教會調式",
    label: "Aeolian / 自然小调",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    feature: "自然小调，暗色但不一定强属解决。",
    progression: "i - bVI - bVII - i",
    improv: "b6 是关键色彩，旋律可围绕 1-b7-b6。",
  },
  {
    id: "locrian",
    category: "教會調式",
    label: "Locrian / 洛克里亚",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    feature: "b5 让主和弦不稳定，常对应 m7b5。",
    progression: "iø - V7alt - i",
    improv: "突出 b5 与 b9，常作为小调 iiø 功能。",
  },
  // ── 旋律小調調式（爵士小調音階） ──────────────────────
  {
    id: "melodicMinorMode",
    category: "旋律小調調式",
    label: "Melodic Minor / 旋律小调",
    intervals: [0, 2, 3, 5, 7, 9, 11],
    feature: "小三度配大六、大七，爵士小调的明亮骨架。",
    progression: "i(maj7) - ii7 - V7 - i",
    improv: "用 3、6、7 区分自然小调，适合小调 ii-V。",
  },
  {
    id: "dorianB2",
    category: "旋律小調調式",
    label: "Dorian b2 / Phrygian #6",
    intervals: [0, 1, 3, 5, 7, 9, 10],
    feature: "b2 与自然六度并存，暗色中带流动。",
    progression: "i7 - bIImaj7 - i7",
    improv: "同时保留 Phrygian 的 b2 与 Dorian 的 6 音。",
  },
  {
    id: "lydianAug",
    category: "旋律小調調式",
    label: "Lydian Augmented / 增利底亚",
    intervals: [0, 2, 4, 6, 8, 9, 11],
    feature: "#4 加 #5，漂浮感最强的大色彩。",
    progression: "Imaj7#5 静态 vamp",
    improv: "适合 maj7#5 和弦与电影配乐式悬停。",
  },
  {
    id: "lydianDominant",
    category: "旋律小調調式",
    label: "Lydian Dominant / 利底亚属",
    intervals: [0, 2, 4, 6, 7, 9, 10],
    feature: "属七结构加 #11，三全音替代首选。",
    progression: "bII7 - Imaj7（三全音替代）",
    improv: "3、b7 是导向，#11 是它的招牌音。",
  },
  {
    id: "mixoB6",
    category: "旋律小調調式",
    label: "Mixolydian b6 / 混合利底亚降六",
    intervals: [0, 2, 4, 5, 7, 8, 10],
    feature: "大三度加 b6、b7，兼具属与小调色彩。",
    progression: "I7 - bVI - I7",
    improv: "比 Mixolydian 更暗，常用于爵士小调乐句。",
  },
  {
    id: "locrianSharp2",
    category: "旋律小調調式",
    label: "Locrian #2 / 半减音阶",
    intervals: [0, 2, 3, 5, 6, 8, 10],
    feature: "半减七和弦（iiø）的标准对应音阶。",
    progression: "iø7 - V7 - i",
    improv: "9 音让 Locrian 不那么紧张，最实用的半减选择。",
  },
  {
    id: "superLocrian",
    category: "旋律小調調式",
    label: "Super Locrian / Altered 变化音阶",
    intervals: [0, 1, 3, 4, 6, 8, 10],
    feature: "b9/#9/b5/#5 全在，变化属和弦专用。",
    progression: "V7alt - i",
    improv: "解决到主和弦前，3 与 b7 是必须保留的导向音。",
  },
  // ── 和聲小調調式 ─────────────────────────────────────
  {
    id: "harmonicMinorMode",
    category: "和聲小調調式",
    label: "Harmonic Minor / 和声小调",
    intervals: [0, 2, 3, 5, 7, 8, 11],
    feature: "1.5 全音的增二度是它最强的戏剧色彩。",
    progression: "i - V7 - i（和声小调属）",
    improv: "导音（7）上行到主音，古典小调终止核心。",
  },
  {
    id: "locrianSharp6",
    category: "和聲小調調式",
    label: "Locrian #6 / 洛克里亚升六",
    intervals: [0, 1, 3, 5, 6, 9, 10],
    feature: "和声小调 ii°7 的对应音阶，比 Locrian 更紧。",
    progression: "ii°7 - V7 - i",
    improv: "6 音（=大三度）与减三主音并存。",
  },
  {
    id: "ionianSharp5",
    category: "和聲小調調式",
    label: "Ionian #5 / 增五伊奥尼亚",
    intervals: [0, 2, 4, 5, 8, 9, 11],
    feature: "大调配增五度，III+ 增三和弦的音阶。",
    progression: "III+ - iv - V",
    improv: "和声小调中 III+ 的临时明亮色彩。",
  },
  {
    id: "dorianSharp4",
    category: "和聲小調調式",
    label: "Dorian #4 / 罗马尼亚调式",
    intervals: [0, 2, 3, 6, 7, 9, 10],
    feature: "增四度与小三度，吉普赛、东欧色彩。",
    progression: "i7 - #iv° - i7",
    improv: "#4 是核心张力，旋律可半音环绕。",
  },
  {
    id: "phrygianDominant",
    category: "和聲小調調式",
    label: "Phrygian Dominant / 属弗里几亚",
    intervals: [0, 1, 4, 5, 7, 8, 10],
    feature: "V7 与 b2 同时出现，西班牙/弗拉门戈标志。",
    progression: "V7(b9) - i",
    improv: "3 与 b2 形成增二度，是辨识度来源。",
  },
  {
    id: "lydianSharp2",
    category: "和聲小調調式",
    label: "Lydian #2 / 利底亚升二",
    intervals: [0, 3, 4, 6, 7, 9, 11],
    feature: "增二度开头，悬疑、神秘。",
    progression: "VI maj7 - V7 - i",
    improv: "和声小调 VI 级的对应音阶，慎用但有特色。",
  },
  {
    id: "ultralocrian",
    category: "和聲小調調式",
    label: "Ultra Locrian / 超洛克里亚",
    intervals: [0, 1, 3, 4, 6, 7, 9],
    feature: "变化音最密集的音阶之一，几乎全是张力。",
    progression: "VII°7 替代属",
    improv: "适合 dim7 到属和弦的半音连接。",
  },
  // ── 五聲 / 藍調 / 對稱音階 ────────────────────────────
  {
    id: "majorPentatonic",
    category: "五聲 / 藍調 / 對稱",
    label: "Major Pentatonic / 大调五声音阶",
    intervals: [0, 2, 4, 7, 9],
    feature: "五音骨架，几乎不会「错」，流行与民谣基础。",
    progression: "I - IV - V（五声版）",
    improv: "旋律天然好听，初学即兴首选。",
  },
  {
    id: "minorPentatonic",
    category: "五聲 / 藍調 / 對稱",
    label: "Minor Pentatonic / 小调五声音阶",
    intervals: [0, 3, 5, 7, 10],
    feature: "摇滚、blues、吉他独奏的万能骨架。",
    progression: "i7 - bVII - bVI - bVII",
    improv: "推弦、滑音最常落在 b3 与 b7。",
  },
  {
    id: "bluesScale",
    category: "五聲 / 藍調 / 對稱",
    label: "Blues / 蓝调音阶",
    intervals: [0, 3, 5, 6, 7, 10],
    feature: "小调五声加 b5（蓝调音），张力更足。",
    progression: "I7 - IV7 - V7（12 小节 blues）",
    improv: "蓝调音在属和弦前后半音连接最有味道。",
  },
  {
    id: "majorBlues",
    category: "五聲 / 藍調 / 對稱",
    label: "Major Blues / 大调蓝调音阶",
    intervals: [0, 2, 3, 4, 7, 9],
    feature: "大调五声加入小三度，轻快但带蓝调。",
    progression: "I7 - IV7 - I7",
    improv: "大小三度交替是 major blues 的经典语法。",
  },
  {
    id: "wholeTone",
    category: "五聲 / 藍調 / 對稱",
    label: "Whole Tone / 全音音阶",
    intervals: [0, 2, 4, 6, 8, 10],
    feature: "只有全音，没有明确调性，印象派色彩。",
    progression: "V7#5 静态和声",
    improv: "适合 #5 属和弦与德布西式漂浮质感。",
  },
  {
    id: "halfWholeDiminished",
    category: "五聲 / 藍調 / 對稱",
    label: "Half-Whole Diminished / 半全减音阶",
    intervals: [0, 1, 3, 4, 6, 7, 9, 10],
    feature: "半音全音交替，属七 b9 的常用音阶。",
    progression: "V7b9 - i",
    improv: "可在 V7b9 上整段使用，张力与解决都清楚。",
  },
  {
    id: "wholeHalfDiminished",
    category: "五聲 / 藍調 / 對稱",
    label: "Whole-Half Diminished / 全半减音阶",
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    feature: "减和弦的对称音阶，每 3 品重复。",
    progression: "dim7 过渡连接",
    improv: "dim7 上直接使用，可对称平移到任意减和弦。",
  },
  {
    id: "chromatic",
    category: "五聲 / 藍調 / 對稱",
    label: "Chromatic / 半音音阶",
    intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    feature: "12 个半音全用，无调性中心。",
    progression: "半音经过句 / 无调性段落",
    improv: "半音音型多作经过，需配合目标音解决。",
  },
  // ── Bebop / 變化音階 ─────────────────────────────────
  {
    id: "bebopMajor",
    category: "Bebop / 變化音階",
    label: "Bebop Major / 比巴普大调音阶",
    intervals: [0, 2, 4, 5, 7, 8, 9, 11],
    feature: "大调音阶加 #5 经过音，旋律落在和弦音上。",
    progression: "Imaj7 - vi7 - ii7 - V7",
    improv: "八分音符长句时，加的音放在弱拍。",
  },
  {
    id: "bebopDominant",
    category: "Bebop / 變化音階",
    label: "Bebop Dominant / 比巴普属音阶",
    intervals: [0, 2, 4, 5, 7, 9, 10, 11],
    feature: "Mixolydian 加大七度经过音，爵士句子基础。",
    progression: "V7 - Imaj7",
    improv: "大七音（7 与 b7 之间）作为下行经过音。",
  },
  {
    id: "bebopDorian",
    category: "Bebop / 變化音階",
    label: "Bebop Dorian / 比巴普多利亚",
    intervals: [0, 2, 3, 5, 7, 9, 10, 11],
    feature: "Dorian 加大七经过音，小调长句更顺。",
    progression: "i7 - IV7 - i7",
    improv: "在 ii7 上做八分音符长句时尤其好用。",
  },
  {
    id: "harmonicMajor",
    category: "Bebop / 變化音階",
    label: "Harmonic Major / 和声大调",
    intervals: [0, 2, 4, 5, 7, 8, 11],
    feature: "大调和声配 b6，明亮中带伤感。",
    progression: "I - bVI - V7",
    improv: "可借用和声小调的属功能色彩。",
  },
  // ── 特殊與民族音階 ───────────────────────────────────
  {
    id: "doubleHarmonic",
    category: "特殊與民族音階",
    label: "Double Harmonic / 双和聲大調（阿拉伯）",
    intervals: [0, 1, 4, 5, 7, 8, 11],
    feature: "两个增二度，中东、弗拉门戈色彩。",
    progression: "Imaj7 - bIImaj7 - Imaj7",
    improv: "b2 与大三度并置是最有辨识度的音程。",
  },
  {
    id: "hungarianMinor",
    category: "特殊與民族音階",
    label: "Hungarian Minor / 匈牙利小调",
    intervals: [0, 2, 3, 6, 7, 8, 11],
    feature: "和声小调加 #4，吉普赛音乐的招牌。",
    progression: "i - iv - V7 - i",
    improv: "#4 与 7 形成增三色彩，张力很强。",
  },
  {
    id: "neapolitanMinor",
    category: "特殊與民族音階",
    label: "Neapolitan Minor / 拿坡里小调",
    intervals: [0, 1, 3, 5, 7, 8, 11],
    feature: "b2 加和声小调属，古典戏剧性语法。",
    progression: "bII - i6/4 - V7 - i",
    improv: "拿坡里和弦（bII）后接终止式是经典用法。",
  },
  {
    id: "neapolitanMajor",
    category: "特殊與民族音階",
    label: "Neapolitan Major / 拿坡里大调",
    intervals: [0, 1, 3, 5, 7, 9, 11],
    feature: "b2 与大六、大七并存，柔和又意外。",
    progression: "bIImaj7 - Imaj7",
    improv: "从 Phrygian 借 b2，但保留大调的安定。",
  },
  {
    id: "romanianMajor",
    category: "特殊與民族音階",
    label: "Romanian Major / 罗马尼亚大调",
    intervals: [0, 2, 3, 6, 7, 9, 11],
    feature: "增四度配大七，民间舞蹈色彩。",
    progression: "Imaj7 - #iv° - Imaj7",
    improv: "与 Dorian #4 是同族音阶，注意大三度。",
  },
  {
    id: "hirajoshi",
    category: "特殊與民族音階",
    label: "Hirajoshi / 平調子（日本）",
    intervals: [0, 2, 3, 7, 8],
    feature: "五声不对称结构，日本传统音阶。",
    progression: "五声 vamp",
    improv: "空四、五度与小二度并置，东方色彩。",
  },
  {
    id: "enigmatic",
    category: "特殊與民族音階",
    label: "Enigmatic / 謎樣音階",
    intervals: [0, 1, 4, 6, 8, 10, 11],
    feature: "羅西尼/威爾第式，不對稱的懸疑色彩。",
    progression: "半音終止句",
    improv: "圍繞半音與增三結構，適合懸疑樂句。",
  },
  {
    id: "prometheus",
    category: "特殊與民族音階",
    label: "Prometheus / 普羅米修斯音階",
    intervals: [0, 2, 4, 6, 9, 10],
    feature: "Lydian 屬去掉五音，印象派、爵士常用。",
    progression: "V7#11sus 靜態和聲",
    improv: "適合 7#11 和弦，音少而色彩強。",
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

// ── ABRSM 1-8 級樂理知識重點 ─────────────────────────────
const ABRSM_KNOWLEDGE = [
  {
    grade: 1,
    title: "第 1 級：識譜與節奏基礎",
    topics: [
      { title: "譜號與音符位置", points: ["高音譜號（G clef）：第二線是 G；低音譜號（F clef）：第四線是 F。", "中央 C 位於高音譜號下加一線、低音譜號上加一線。", "熟記各線、間及上下加線的音名。"] },
      { title: "音符時值", points: ["全音符、二分音符、四分音符、八分音符、十六分音符及其休止符。", "附點二分音符 = 3 拍（以四分音符為一拍）。", "時值換算：1 個全音符 = 2 個二分 = 4 個四分 = 8 個八分。"] },
      { title: "拍號與小節", points: ["本級拍號：2/4、3/4、4/4（單拍子）。", "上方數字＝每小節拍數，下方數字＝以哪種音符為一拍。", "小節線、終止線、反覆記號。"] },
      { title: "半音、全音與升降號", points: ["半音是西方音樂最小的常用音程；全音 = 2 個半音。", "升號（♯）升半音、降號（♭）降半音、還原號（♮）取消升降。", "一組八度共 12 個半音。"] },
      { title: "調與音階", points: ["本級大調：C、G、D、F、B♭ 大調；關係小調：A、D 和聲小調。", "大調音階音程結構：全 全 半 全 全 全 半。", "主音、屬音（第 5 級）等基本音級名稱。"] },
      { title: "音程與三和弦", points: ["能計算音程的度數（1–8 度）。", "主音上的三和弦（主三和弦）與其八度位置。", "認識 I、IV、V 三和弦的根音。"] },
      { title: "術語與記號", points: ["力度：p、f、mf、mp、cresc.、dim.。", "速度：allegro、andante、adagio 等。", "奏法：legato、staccato、圓滑線、連結線（tie）。"] },
    ],
  },
  {
    grade: 2,
    title: "第 2 級：三連音、音程性質與調內和弦",
    topics: [
      { title: "節奏", points: ["三連音：三個音佔兩個同等音的時值（如 3 個八分音符 = 1 個四分音符）。", "附點四分音符 = 3 個八分音符；更多十六分音符組合。", "3/8 拍子。"] },
      { title: "調號", points: ["新增 A 大調（3 個升號）、E♭ 大調（3 個降號）。", "關係小調：F♯ 小調、C 小調。", "背熟五度圈順序：升號 F♯ C♯ G♯ D♯ A♯；降號反向。"] },
      { title: "音程", points: ["能分辨大、小音程性質（大 2/3/6/7 度與小 2/3/6/7 度）。", "完全 1/4/5/8 度。", "音程需同時看度數與半音數。"] },
      { title: "音級與三和弦", points: ["音級名稱：主音、上主音、中音、下屬音、屬音、下中音、導音。", "大調與小調中 I、IV、V 三和弦的組成。", "大調中 I IV V 是大三和弦，ii、iii、vi 是小三和弦，vii° 是減三和弦。"] },
      { title: "術語與記號", points: ["常見連線、斷奏、重音（>）。", "更多速度與表情術語，如 ritardando、a tempo、legato。"] },
    ],
  },
  {
    grade: 3,
    title: "第 3 級：複拍子、轉位與終止式",
    topics: [
      { title: "複拍子（Compound Time）", points: ["6/8：每小節 6 個八分音符，打成 2 大拍（每拍 3 個八分）。", "單拍子與複拍子的分別：複拍子每拍可分三份。", "學會按強弱位置組合節奏。"] },
      { title: "調號", points: ["新增 E 大調（4 個升號）、A♭ 大調（4 個降號）。", "關係小調：C♯ 小調、F 小調。"] },
      { title: "音程", points: ["八度內全部音程，含大、小、完全、增、減性質。", "三全音（增四度＝減五度）＝ 6 個半音。"] },
      { title: "三和弦與轉位", points: ["原位：根音在低音；第一轉位：三音在低音；第二轉位：五音在低音。", "各音級三和弦的組成與性質，含 II、VI 級。", "終止四六和弦（I₆₄）出現在終止前。"] },
      { title: "終止式", points: ["完全終止（V–I）、變格終止（IV–I）、不完全終止（結束在 V）。", "能在樂譜中辨認終止位置。"] },
      { title: "移調與譜號", points: ["把旋律按八度移高或移低。", "鞏固高音、低音譜號的快速識讀。"] },
    ],
  },
  {
    grade: 4,
    title: "第 4 級：C 譜號、雙附點與更多和弦",
    topics: [
      { title: "調號", points: ["新增 B 大調（5 個升號）、D♭ 大調（5 個降號）。", "關係小調：G♯ 小調、B♭ 小調。"] },
      { title: "半音變化記號", points: ["重升號（×）升高兩個半音（一個全音）；重降號（𝄫）降兩個半音。", "等音（enharmonic）概念，如 C♯ = D♭。"] },
      { title: "節奏", points: ["雙附點音符：總時值 = 原音符的 1¾ 倍（第二個附點加原時值的 1/4）。", "9/8、12/8 複拍子，分別為 3 拍與 4 拍。"] },
      { title: "中音譜號（Alto Clef）", points: ["C 譜號的中央對準第三線，第三線即中央 C。", "中提琴常用中音譜號。"] },
      { title: "三和弦與終止", points: ["大調、和聲小調中 II、VI 級三和弦及其轉位。", "完全、變格、不完全三種終止，並能在四部譜中辨認。"] },
      { title: "裝飾音與移調", points: ["倚音（acciaccatura、appoggiatura）、回音、震音等常見裝飾。", "按指定音程移調旋律。"] },
    ],
  },
  {
    grade: 5,
    title: "第 5 級：七和弦、全部終止與不規則拍",
    topics: [
      { title: "調號", points: ["新增 F♯ 大調（6 個升號）、C♯ 大調（7 個升號）。", "六個升降號以內的全部大小調及其關係調。", "等音調：B 大調 = C♭ 大調、F♯ 大調 = G♭ 大調、C♯ 大調 = D♭ 大調。"] },
      { title: "拍子與節奏", points: ["不規則拍號：5/4、7/8 等。", "鞏固原 2/4 至 12/8 全部拍號。"] },
      { title: "譜號", points: ["次中音譜號（Tenor Clef）：第四線為中央 C（大提琴、長號等使用）。", "在高音、低音、中音、次中音四譜號間互讀。"] },
      { title: "音程與音階", points: ["全部音程含複音程（超過八度）。", "半音音階、全音音階的認識。", "各類大小調音階（自然、和聲、旋律）的寫作。"] },
      { title: "三和弦轉位與七和弦", points: ["三和弦全部轉位與數字低音標記（5/3、6、6/4）。", "屬七和弦（V7）、減七和弦（vii°7）的組成與轉位。"] },
      { title: "四種終止", points: ["完全終止 V–I、變格終止 IV–I、不完全終止（止於 V）、阻礙終止 V–VI（小調 V–VI）。", "能為旋律配寫終止和弦。"] },
      { title: "移調與樂器", points: ["按指定音程移調到任何調。", "認識交響樂團常用樂器及常用移調樂器（B♭、F 調）。"] },
    ],
  },
  {
    grade: 6,
    title: "第 6 級：四部和聲與數字低音",
    topics: [
      { title: "四部和聲（SATB）", points: ["女高（Soprano）、女低（Alto）、男高（Tenor）、男低（Bass）。", "聲部音域、排列法（密集／開放）與重複音規則。", "避免平行五度、平行八度、隱藏五八度與聲部交錯。"] },
      { title: "數字低音（Figured Bass）", points: ["5/3：原位三和弦；6（6/3）：第一轉位；6/4：第二轉位。", "臨時記號、數字與升降的標註規則。", "為數字低音填寫上方三聲部。"] },
      { title: "和聲進行", points: ["原位與轉位三和弦的連接、經過六和弦、終止四六。", "調內七和弦：V7、ii7、vii°7 及其解決。", "七音一律下行級進解決，導音上行到主音。"] },
      { title: "旋律和聲配置", points: ["為指定旋律配寫四部和聲，選擇合適和弦與轉位。", "終止式設計與旋律最低音寫作。"] },
      { title: "移調樂器", points: ["B♭、A、F、E♭ 調樂器的移調計算。", "樂器實際音高與記譜音高的差異。"] },
      { title: "半音音階與創作", points: ["半音音階寫作規則（上行多用升、下行多用降）。", "為指定旋律續寫或創作樂句。"] },
    ],
  },
  {
    grade: 7,
    title: "第 7 級：變化和弦與轉調",
    topics: [
      { title: "數字低音", points: ["完整實現含七和弦、轉位及臨時記號的數字低音。", "數字低音中的變化音標記（♯、♭、/）。"] },
      { title: "次屬和弦（Secondary Dominants）", points: ["除 V 外各音級的屬七，如 V7/IV（C 大調中為 C7）、V7/V（D7）。", "次屬七和弦的識別、寫作與解決。"] },
      { title: "減七和弦", points: ["減七和弦由小三度堆疊，對稱結構只有 3 種不同組合。", "利用等音關係作轉調樞紐。"] },
      { title: "拿坡里與增六和弦", points: ["拿坡里六和弦（N6）：bII 大三和弦的第一轉位，常接終止四六。", "義大利、法國、德國六和弦（It+6、Fr+6、Ger+6）都含增六度，解決到屬。"] },
      { title: "轉調", points: ["近關係轉調（相差一個升降號以內）與樞紐和弦轉調。", "持續音（pedal）、懸留音（suspension，下行解決）、先現音。"] },
      { title: "總譜閱讀", points: ["中音、次中音譜號的熟練閱讀；聲樂與器樂總譜改寫。"] },
    ],
  },
  {
    grade: 8,
    title: "第 8 級：變化和聲、等音轉調與總譜",
    topics: [
      { title: "完整數字低音", points: ["在鋼琴譜或四部譜上實現複雜數字低音，含全部變化和弦。", "兼顧和聲正確與聲部流暢。"] },
      { title: "增六和弦系統", points: ["義大利六和弦（It+6，3 個音，低音重複）。", "法國六和弦（Fr+6，含 2 級音）與德國六和弦（Ger+6，含降 3 級音）。", "三種增六和弦都解決到 V 或終止四六。"] },
      { title: "等音轉調", points: ["利用減七和弦與屬七和弦的等音關係遠距離轉調。", "德國六和弦與屬七和弦的等音互換。"] },
      { title: "旋律和聲配置", points: ["為完整旋律設計和聲，含轉調、變化和弦與終止布局。", "和聲節奏、低音線條與結構設計。"] },
      { title: "二十世紀技法", points: ["荀白克十二音技法（tone row）、序列主義。", "印象派平行和弦、調式互換、複調性等概念。"] },
      { title: "總譜閱讀", points: ["交響樂總譜、聲樂總譜、移調樂器讀譜。", "鍵盤樂譜、室樂與管弦樂片段的改編與分析。"] },
    ],
  },
];

// ── ABRSM 分級測驗題庫（每題：grade, prompt, options, answer, hint） ──
const ABRSM_QUESTION_BANK = [
  // 第 1 級
  { grade: 1, prompt: "一個四分音符等於多少個八分音符？", options: ["2 個", "4 個", "1 個", "3 個"], answer: "2 個", hint: "四分音符時值為 1 拍，八分音符為半拍。" },
  { grade: 1, prompt: "4/4 拍子每小節有多少拍？", options: ["2 拍", "3 拍", "4 拍", "6 拍"], answer: "4 拍", hint: "上方數字是每小節拍數。" },
  { grade: 1, prompt: "C 大調調號有多少個升降號？", options: ["1 個升號", "1 個降號", "2 個升號", "沒有升降號"], answer: "沒有升降號", hint: "C 大調音階全部使用白鍵。" },
  { grade: 1, prompt: "G 大調調號有幾個升號？", options: ["1 個", "2 個", "3 個", "沒有"], answer: "1 個", hint: "升的是 F，即 F♯。" },
  { grade: 1, prompt: "高音譜號第二線上的音是？", options: ["C", "E", "G", "F"], answer: "G", hint: "高音譜號又稱 G 譜號，螺旋中心對準第二線。" },
  { grade: 1, prompt: "低音譜號第四線上的音是？", options: ["F", "C", "G", "B"], answer: "F", hint: "低音譜號又稱 F 譜號，兩點夾住第四線。" },
  { grade: 1, prompt: "一個全音符等於多少個四分音符？", options: ["2 個", "4 個", "6 個", "8 個"], answer: "4 個", hint: "全音符 = 2 個二分 = 4 個四分。" },
  { grade: 1, prompt: "一個八度內有多少個半音？", options: ["7 個", "8 個", "10 個", "12 個"], answer: "12 個", hint: "鋼琴上 12 個鍵為一組（含黑鍵）。" },
  { grade: 1, prompt: "「漸強」的義大利文縮寫是？", options: ["dim.", "cresc.", "rit.", "legato"], answer: "cresc.", hint: "crescendo = 逐漸增強。" },
  { grade: 1, prompt: "A 小調的關係大調是？", options: ["C 大調", "G 大調", "F 大調", "D 大調"], answer: "C 大調", hint: "關係大小調共用同一調號，主音相差小三度。" },
  // 第 2 級
  { grade: 2, prompt: "三連音中三個八分音符的總時值等於？", options: ["1 個四分音符", "1 個附點四分音符", "1 個二分音符", "1 個全音符"], answer: "1 個四分音符", hint: "三連音把本來的 2 份時值分給 3 個音。" },
  { grade: 2, prompt: "A 大調調號有幾個升號？", options: ["1 個", "2 個", "3 個", "4 個"], answer: "3 個", hint: "F♯、C♯、G♯。" },
  { grade: 2, prompt: "E♭ 大調調號有幾個降號？", options: ["1 個", "2 個", "3 個", "4 個"], answer: "3 個", hint: "B♭、E♭、A♭。" },
  { grade: 2, prompt: "大調音階中第 I 級到第 III 級是什麼音程？", options: ["小三度", "大三度", "純四度", "純五度"], answer: "大三度", hint: "大調的 1-3 級含 4 個半音。" },
  { grade: 2, prompt: "自然小調第 I 級到第 III 級是什麼音程？", options: ["小三度", "大三度", "增三度", "純三度"], answer: "小三度", hint: "小三度含 3 個半音，是小調色彩來源。" },
  { grade: 2, prompt: "一個附點四分音符等於多少個八分音符？", options: ["2 個", "3 個", "4 個", "6 個"], answer: "3 個", hint: "附點延長原音符的一半：1.5 + 1.5 = 3 個八分。" },
  { grade: 2, prompt: "音階的第 5 級名稱是？", options: ["主音", "下屬音", "屬音", "中音"], answer: "屬音", hint: "屬音是繼主音後第二重要的音。" },
  { grade: 2, prompt: "大調中屬和弦是哪一級？", options: ["I", "IV", "V", "VI"], answer: "V", hint: "V 級三和弦具有強烈回到 I 的傾向。" },
  { grade: 2, prompt: "一個十六分音符等於四分音符的多少？", options: ["1/2", "1/4", "1/8", "1/16"], answer: "1/4", hint: "四分音符 = 4 個十六分音符。" },
  { grade: 2, prompt: "F♯ 小調的關係大調是？", options: ["D 大調", "A 大調", "E 大調", "G 大調"], answer: "A 大調", hint: "A 大調與 F♯ 小調都有 3 個升號。" },
  // 第 3 級
  { grade: 3, prompt: "6/8 拍子屬於哪一類拍子？", options: ["單拍子", "複拍子", "不規則拍", "自由拍"], answer: "複拍子", hint: "每大拍可分為三份，6/8 打成 2 大拍。" },
  { grade: 3, prompt: "6/8 拍子每小節有多少個八分音符？", options: ["2 個", "3 個", "6 個", "8 個"], answer: "6 個", hint: "上方數字就是八分音符的數量。" },
  { grade: 3, prompt: "自然大調中哪一級是減三和弦？", options: ["II 級", "III 級", "VI 級", "VII 級"], answer: "VII 級", hint: "vii° 是導音上的減三和弦，解決到 I。" },
  { grade: 3, prompt: "三和弦第一轉位時，低音是哪個音？", options: ["根音", "三音", "五音", "七音"], answer: "三音", hint: "第一轉位以三音為最低音。" },
  { grade: 3, prompt: "三全音包含多少個半音？", options: ["4 個", "5 個", "6 個", "7 個"], answer: "6 個", hint: "增四度與減五度都是三全音。" },
  { grade: 3, prompt: "屬和弦（V）最自然解決到哪個和弦？", options: ["主和弦（I）", "下屬和弦（IV）", "上主和弦（ii）", "下中和弦（vi）"], answer: "主和弦（I）", hint: "屬到主（V–I）是最基本的終止。" },
  { grade: 3, prompt: "把旋律移高一個八度後，下列哪項保持不變？", options: ["實際音高", "音名與音級", "譜上的位置", "音的頻率"], answer: "音名與音級", hint: "只改變八度，音名相同。" },
  { grade: 3, prompt: "E 大調調號有幾個升號？", options: ["2 個", "3 個", "4 個", "5 個"], answer: "4 個", hint: "F♯、C♯、G♯、D♯。" },
  { grade: 3, prompt: "6/8 拍子通常打成幾個大拍？", options: ["2 拍", "3 拍", "6 拍", "12 拍"], answer: "2 拍", hint: "每大拍 3 個八分音符：6 ÷ 3 = 2。" },
  { grade: 3, prompt: "大三和弦的結構是？", options: ["根音＋小三度＋小三度", "根音＋大三度＋小三度", "根音＋小三度＋大三度", "根音＋大三度＋大三度"], answer: "根音＋大三度＋小三度", hint: "如 C 大調：C-E-G（大三度＋小三度）。" },
  // 第 4 級
  { grade: 4, prompt: "中音譜號（Alto Clef）的第三線是哪個音？", options: ["中央 C", "G", "F", "A"], answer: "中央 C", hint: "C 譜號的箭頭對準中央 C。" },
  { grade: 4, prompt: "雙附點音符中，第二個附點增加原音符時值的多少？", options: ["1/2", "1/4", "1/8", "3/4"], answer: "1/4", hint: "第一個附點加 1/2，第二個附點再加 1/4。" },
  { grade: 4, prompt: "9/8 拍子屬於哪一類拍子？", options: ["單拍子", "複拍子", "不規則拍", "變拍子"], answer: "複拍子", hint: "9/8 打成 3 大拍，每拍 3 個八分。" },
  { grade: 4, prompt: "自然大調中第 II 級三和弦的性質是？", options: ["大三和弦", "小三和弦", "減三和弦", "增三和弦"], answer: "小三和弦", hint: "如 C 大調的 D-F-A。" },
  { grade: 4, prompt: "V 和弦接 I 和弦的終止式稱為？", options: ["變格終止", "完全終止", "不完全終止", "阻礙終止"], answer: "完全終止", hint: "Perfect cadence，屬到主最完整。" },
  { grade: 4, prompt: "IV 和弦接 I 和弦的終止式稱為？", options: ["完全終止", "變格終止", "不完全終止", "阻礙終止"], answer: "變格終止", hint: "Plagal cadence，常見於聖詩「阿們」終止。" },
  { grade: 4, prompt: "重升號（×）會把音升高多少？", options: ["1 個半音", "2 個半音", "3 個半音", "1 個八度"], answer: "2 個半音", hint: "即一個全音。" },
  { grade: 4, prompt: "「6/4」和弦（第二轉位）的低音是？", options: ["根音", "三音", "五音", "七音"], answer: "五音", hint: "第二轉位以五音為最低音。" },
  { grade: 4, prompt: "D♭ 大調調號有幾個降號？", options: ["3 個", "4 個", "5 個", "6 個"], answer: "5 個", hint: "B♭、E♭、A♭、D♭、G♭。" },
  { grade: 4, prompt: "「6」和弦（第一轉位）的低音是？", options: ["根音", "三音", "五音", "七音"], answer: "三音", hint: "6 是 6/3 的簡寫。" },
  // 第 5 級
  { grade: 5, prompt: "下列哪個是不規則拍號？", options: ["4/4", "3/4", "5/4", "6/8"], answer: "5/4", hint: "5 拍無法平分為 2 或 3 的組合。" },
  { grade: 5, prompt: "次中音譜號（Tenor Clef）哪一條線是中央 C？", options: ["第二線", "第三線", "第四線", "第五線"], answer: "第四線", hint: "次中音譜號的 C 譜號中心對準第四線。" },
  { grade: 5, prompt: "屬七和弦（V7）由哪些音組成？", options: ["根音、三音、五音、大七音", "根音、三音、五音、小七音", "根音、小三音、五音、小七音", "根音、三音、減五音、小七音"], answer: "根音、三音、五音、小七音", hint: "如 G7 = G-B-D-F（大三和弦＋小七度）。" },
  { grade: 5, prompt: "減七和弦的每個音程距離是？", options: ["大二度", "大三度", "小三度", "純四度"], answer: "小三度", hint: "小三度堆疊使減七和弦結構對稱。" },
  { grade: 5, prompt: "大調中 V 接 VI 的終止式稱為？", options: ["完全終止", "變格終止", "不完全終止", "阻礙終止"], answer: "阻礙終止", hint: "Interrupted cadence，屬和弦「意外」接到 VI。" },
  { grade: 5, prompt: "一個八度的半音音階有多少個音？", options: ["7 個", "8 個", "10 個", "12 個"], answer: "12 個", hint: "每個半音都算一個音。" },
  { grade: 5, prompt: "F♯ 大調調號有幾個升號？", options: ["4 個", "5 個", "6 個", "7 個"], answer: "6 個", hint: "F♯、C♯、G♯、D♯、A♯、E♯。" },
  { grade: 5, prompt: "C♯ 大調的等音調是？", options: ["D 大調", "D♭ 大調", "B 大調", "F♯ 大調"], answer: "D♭ 大調", hint: "C♯ 與 D♭ 在鍵盤上是同一個音。" },
  { grade: 5, prompt: "不完全終止（imperfect cadence）的特徵是？", options: ["V 接 I", "IV 接 I", "樂句結束在 V 和弦上", "V 接 VI"], answer: "樂句結束在 V 和弦上", hint: "停在屬和弦，有未完成、要繼續的感覺。" },
  { grade: 5, prompt: "和聲小調中為什麼要升高第 VII 級？", options: ["增加節奏感", "形成導音以強化 V–i 終止", "方便移調", "避免增二度"], answer: "形成導音以強化 V–i 終止", hint: "導音只比主音低半音，解決傾向最強。" },
  // 第 6 級
  { grade: 6, prompt: "四部和聲中「SATB」依次指？", options: ["女高、女低、男高、男低", "女高、男高、女低、男低", "男高、女高、女低、男低", "獨唱、合唱、器樂、低音"], answer: "女高、女低、男高、男低", hint: "Soprano、Alto、Tenor、Bass。" },
  { grade: 6, prompt: "數字低音「6」（6/3）表示？", options: ["原位三和弦", "三和弦第一轉位", "三和弦第二轉位", "七和弦原位"], answer: "三和弦第一轉位", hint: "低音上方有六度與三度音程。" },
  { grade: 6, prompt: "數字低音「6/4」表示？", options: ["原位三和弦", "第一轉位", "第二轉位", "第三轉位"], answer: "第二轉位", hint: "低音上方有六度與四度音程。" },
  { grade: 6, prompt: "大調中的超級屬七和弦（ii7）是什麼性質？", options: ["大七和弦", "小七和弦", "屬七和弦", "半減七和弦"], answer: "小七和弦", hint: "如 C 大調 Dm7 = D-F-A-C。" },
  { grade: 6, prompt: "四部和聲為什麼要避免平行五度？", options: ["聲音太小", "兩聲部失去獨立性，音響空洞", "節奏不整齊", "會造成轉調"], answer: "兩聲部失去獨立性，音響空洞", hint: "平行五度與八度會使聲部「黏在一起」。" },
  { grade: 6, prompt: "原位三和弦通常重複哪個音？", options: ["根音", "三音", "五音", "七音"], answer: "根音", hint: "重複根音最穩定。" },
  { grade: 6, prompt: "屬七和弦的七音通常如何解決？", options: ["上行級進", "下行級進", "保持不動", "跳進八度"], answer: "下行級進", hint: "如 G7 的 F 下行解決到 E。" },
  { grade: 6, prompt: "和聲小調中升高第 VII 級後，V 級三和弦變成？", options: ["小三和弦", "大三和弦", "減三和弦", "增三和弦"], answer: "大三和弦", hint: "導音使 V 成為大三和弦，屬功能更強。" },
  { grade: 6, prompt: "經過六和弦（passing 6/3）通常接在？", options: ["兩個原位和弦之間", "樂曲開頭", "終止之後", "獨立出現"], answer: "兩個原位和弦之間", hint: "低音作級進經過時使用。" },
  { grade: 6, prompt: "半音音階上行時通常傾向使用？", options: ["降號", "升號", "還原號", "重升號"], answer: "升號", hint: "下行則傾向用降號，方便閱讀。" },
  // 第 7 級
  { grade: 7, prompt: "拿坡里六和弦（N6）是什麼和弦的第一轉位？", options: ["bII 上的大三和弦", "II 上的小三和弦", "IV 上的大七和弦", "VI 上的小三和弦"], answer: "bII 上的大三和弦", hint: "C 大調中即 D♭ 大三和弦的第一轉位。" },
  { grade: 7, prompt: "C 大調中的次屬和弦 V7/IV 是？", options: ["G7", "D7", "C7", "A7"], answer: "C7", hint: "IV 是 F，F 的屬七是 C7。" },
  { grade: 7, prompt: "減七和弦按等音關係共有多少種不同組合？", options: ["2 種", "3 種", "4 種", "7 種"], answer: "3 種", hint: "結構每小三度重複，12 個音分 3 組。" },
  { grade: 7, prompt: "持續音（pedal）通常固定在哪兩個音？", options: ["中音與下中音", "主音與屬音", "三音與七音", "導音與上主音"], answer: "主音與屬音", hint: "tonic pedal 與 dominant pedal。" },
  { grade: 7, prompt: "懸留音（suspension）的典型解決方式是？", options: ["上行級進", "下行級進", "上行跳進", "保持不動"], answer: "下行級進", hint: "如 4-3、9-8、7-6 懸留。" },
  { grade: 7, prompt: "德國六和弦（Ger+6）包含哪個標誌性音程？", options: ["增六度", "減七度", "純四度", "大三度（不存在）"], answer: "增六度", hint: "三種增六和弦都含增六度，向外擴張解決到八度。" },
  { grade: 7, prompt: "C 大調中轉到屬調（G 大調）的調號變化是？", options: ["少一個升號", "多一個升號", "多一個降號", "調號不變"], answer: "多一個升號", hint: "屬調比主調多一個升號（F♯）。" },
  { grade: 7, prompt: "屬七和弦解決到主和弦時，三音（導音）通常？", options: ["下行到五音", "保持不動", "上行半音到主音", "跳進四度"], answer: "上行半音到主音", hint: "如 G7 的 B 上行到 C。" },
  { grade: 7, prompt: "C 大調中 V7/V 是哪個和弦？", options: ["C7", "D7", "A7", "G7"], answer: "D7", hint: "V 是 G，G 的屬七是 D7。" },
  { grade: 7, prompt: "近關係轉調通常指轉到相差多少升降號以內的調？", options: ["0 個", "1 個", "3 個", "5 個"], answer: "1 個", hint: "如 C 大調轉到 G 大調或 F 大調。" },
  // 第 8 級
  { grade: 8, prompt: "義大利六和弦（It+6）由幾個不同音高組成？", options: ["2 個", "3 個", "4 個", "5 個"], answer: "3 個", hint: "通常重複低音，共 4 個聲部但只有 3 個音。" },
  { grade: 8, prompt: "法國六和弦與德國六和弦的分別是？", options: ["法國六含 2 級音，德國六含降 3 級音", "法國六是小三和弦", "德國六沒有增六度", "兩者完全相同"], answer: "法國六含 2 級音，德國六含降 3 級音", hint: "A 小調中 Fr+6 含 B（2 級），Ger+6 含 C（b3 級）。" },
  { grade: 8, prompt: "等音轉調（enharmonic modulation）最常利用哪個和弦？", options: ["主三和弦", "減七和弦", "掛留四和弦", "空五和弦"], answer: "減七和弦", hint: "減七和弦的對稱結構可被重新解釋為多個調的和弦。" },
  { grade: 8, prompt: "十二音技法（twelve-tone technique）的創立者是？", options: ["德布西", "荀白克", "巴赫", "華格納"], answer: "荀白克", hint: "Arnold Schoenberg，20 世紀初提出。" },
  { grade: 8, prompt: "管弦樂團中的法國號是什麼調的移調樂器？", options: ["B♭ 調", "E♭ 調", "F 調", "C 調（非移調）"], answer: "F 調", hint: "法國號（horn）記譜比實際音高高五度。" },
  { grade: 8, prompt: "B♭ 調單簧管演奏譜上的 C，實際發音是？", options: ["C", "B♭", "D", "A"], answer: "B♭", hint: "記譜音比實際音高大二度。" },
  { grade: 8, prompt: "德國六和弦可作為哪個和弦的等音形式？", options: ["屬七和弦", "減三和弦", "大六和弦", "掛留和弦"], answer: "屬七和弦", hint: "Ger+6 與異名同音的屬七和弦聲部排列相同。" },
  { grade: 8, prompt: "華格納（Wagner）和聲的典型特徵是？", options: ["只用三和弦", "大量半音化與懸延不決的終止", "完全無調性", "只使用教會調式"], answer: "大量半音化與懸延不決的終止", hint: "《特里斯坦與伊索爾德》開頭是著名例子。" },
  { grade: 8, prompt: "B♭ 調小號演奏實際音高 C，譜上應記為？", options: ["B♭", "C", "D", "A"], answer: "D", hint: "實際音高比記譜低大二度，記譜要寫高大二度。" },
  { grade: 8, prompt: "序列主義（serialism）中「音列」通常包含多少個音？", options: ["7 個", "8 個", "10 個", "12 個"], answer: "12 個", hint: "12 個半音各出現一次，再進行變形。" },
];

// ── 樂理歷史科普時間軸 ───────────────────────────────────
const THEORY_HISTORY = [
  { era: "古希臘 約公元前 6 世紀", title: "數字裡的音程：畢達哥拉斯", body: "畢達哥拉斯發現弦長比例決定音程：2:1 是八度、3:2 是純五度、4:3 是純四度。古希臘人由四音音列（tetrachord）拼出各種調式（harmoniai），奠定了「音樂是數學」的觀念。" },
  { era: "中世紀 約 500–1400", title: "教會調式與記譜的誕生", body: "葛麗果聖歌（Gregorian chant）是單聲部宗教歌曲，最早用紐姆符號（neumes）提示旋律走向，沒有明確音高。11 世紀義大利修士圭多·達雷佐（Guido d'Arezzo）發明譜線、六聲音階與唱名（ut re mi fa sol la，即後來的 Do Re Mi），中古教會調式（多利亞、弗里幾亞等）在此時定型。" },
  { era: "文藝復興 約 1400–1600", title: "五線譜成熟與複調黃金時代", body: "有量記譜法（mensural notation）發展出明確的時值，逐步演進成現代五線譜與拍號。帕勒斯替那（Palestrina）等人把對位法（複調）推向高峰，教會調式開始向大小調體系過渡。" },
  { era: "巴洛克 約 1600–1750", title: "大小調、數字低音與功能和聲", body: "大小調體系確立，低音上方用數字標示和弦（數字低音 / figured bass），和聲開始有「主–屬」的功能邏輯。巴赫《平均律鍵盤曲集》（1722、1742）以全部 24 個大小調寫作，實踐並推廣了十二平均律；拉摩（Rameau）1722 年《和聲論》首次系統論述和弦與轉位。" },
  { era: "古典時期 約 1750–1820", title: "奏鳴曲式與終止式規範", body: "海頓、莫札特、貝多芬把功能和聲（I–IV–V–I）、奏鳴曲式與各種終止式運用得最為規範均衡，和聲節奏清晰、轉調多在近關係調之間。" },
  { era: "浪漫時期 約 1820–1900", title: "半音化與色彩和聲", body: "蕭邦、李斯特、華格納大量使用遠關係轉調、拿坡里六和弦、增六和弦與高疊和弦，和聲的色彩與戲劇性壓過功能規則，調性逐漸被推到邊緣——華格納《特里斯坦》的開頭和弦甚至製造了「永不終止」的懸念。" },
  { era: "20 世紀", title: "調性瓦解、調式復興與爵士", body: "德布西、拉威爾受教會調式、全音音階與東方音樂啟發，寫出平行和弦與調式和聲；荀白克提出無調性與十二音技法。另一方面，爵士樂把延伸和弦（9/11/13）、變化屬、ii–V–I 與替代屬發展成新的和聲語法。" },
  { era: "爵士與流行 1900 至今", title: "從藍調到現代流行和聲", body: "藍調音階與 12 小節藍調結構經紐奧爾良、搖擺樂、Bebop（1940 年代）一路演進，薩克斯風手與鋼琴手建立了爵士即興的調式系統；搖滾、靈魂樂、R&B、City Pop 再把藍調、教會調式與高疊和弦帶進大眾音樂。" },
  { era: "記譜法演變", title: "從紐姆到五線譜，再到六線譜", body: "音符形狀從方形紐姆、菱形有量音符，演變成今天的橢圓符頭；小節線、拍號、力度與速度記號陸續定型。吉他六線譜（tablature）源自魯特琴譜，直接標註按弦位置，入門更直觀，但不取代五線譜記錄節奏與音高的能力。" },
  { era: "律制演變", title: "為什麼需要十二平均律", body: "畢氏律以純五度連生，轉調後會累積誤差；純律的和弦最和諧但各調之間不能互通；中庸全音律是折中。十二平均律把八度均分為 12 個半音，每個調都略有偏差但都可接受，任意轉調與自由換調才成為可能，巴赫的《平均律》是其里程碑。" },
];

// ── 吉他和弦一鍵輸入：開放把位指法（由低到高 E A D G B e；x＝悶音） ──
const GUITAR_OPEN_SHAPES = {
  "0:maj": "x32010", "2:maj": "xx0232", "4:maj": "022100", "5:maj": "133211",
  "7:maj": "320003", "9:maj": "x02220", "10:maj": "x13331", "11:maj": "x24442",
  "9:min": "x02210", "4:min": "022000", "2:min": "xx0231", "11:min": "x24432",
  "5:min": "133111", "7:min": "355333", "0:min": "x35543", "1:min": "x46654",
  "6:min": "244222",
  "4:7": "020100", "7:7": "320001", "2:7": "xx0212", "9:7": "x02020",
  "0:7": "x32310", "11:7": "x21202", "5:7": "131211", "10:7": "x13131",
  "4:m7": "022030", "9:m7": "x02010", "2:m7": "xx0211", "11:m7": "x24232",
  "6:m7": "242252",
  "0:maj7": "x32000", "5:maj7": "1x3210", "9:maj7": "x02120", "7:maj7": "320002",
  "9:sus4": "x02230", "2:sus4": "xx0233", "4:sus4": "022200",
  "0:sus4": "x33011", "7:sus4": "3x0013",
  "9:sus2": "x02200", "2:sus2": "xx0230", "0:sus2": "x30033", "7:sus2": "3x023x",
  "4:6": "022120", "9:6": "x02222", "2:6": "xx0202",
  "0:add9": "x32030", "0:9": "x32333", "9:9": "x02423",
  "11:dim7": "x23434",
};

// 封閉把位模板（形狀為空弦把位，由低到高 E A D G B e；x＝悶音）
const GUITAR_E_FORM = { rootOpen: 4, shapes: {
  maj: "022100", min: "022000", dim: "0120xx", aug: "032110",
  sus4: "022200", "6": "022120", m6: "022020", "7": "020100",
  maj7: "021100", m7: "022030", mMaj7: "021000", halfDim: "012030",
  dim7: "012020", add9: "022102", "9": "020102",
} };
const GUITAR_A_FORM = { rootOpen: 9, shapes: {
  maj: "x02220", min: "x02210", dim: "x0121x", sus2: "x02200", sus4: "x02230",
  "6": "x02222", "7": "x02020", m7: "x02010", maj7: "x02120",
  halfDim: "x0101x", "9": "x02423",
} };

// 吉他一鍵輸入支援的和弦性質（順序即下拉選單順序）
const GUITAR_CHORD_INSERT_QUALITIES = [
  { id: "maj", label: "大三和弦（maj）" },
  { id: "min", label: "小三和弦（m）" },
  { id: "dim", label: "減三和弦（dim）" },
  { id: "aug", label: "增三和弦（aug）" },
  { id: "sus2", label: "掛二（sus2）" },
  { id: "sus4", label: "掛四（sus4）" },
  { id: "6", label: "六和弦（6）" },
  { id: "m6", label: "小六（m6）" },
  { id: "7", label: "屬七（7）" },
  { id: "maj7", label: "大七（maj7）" },
  { id: "m7", label: "小七（m7）" },
  { id: "mMaj7", label: "小大七（mMaj7）" },
  { id: "halfDim", label: "半減七（m7b5）" },
  { id: "dim7", label: "減七（dim7）" },
  { id: "add9", label: "加九（add9）" },
  { id: "9", label: "九和弦（9）" },
];

// 常用和弦快捷標籤
const GUITAR_QUICK_CHORDS = [
  { root: 0, quality: "maj", label: "C" }, { root: 2, quality: "maj", label: "D" },
  { root: 4, quality: "maj", label: "E" }, { root: 5, quality: "maj", label: "F" },
  { root: 7, quality: "maj", label: "G" }, { root: 9, quality: "maj", label: "A" },
  { root: 10, quality: "maj", label: "B♭" }, { root: 11, quality: "maj", label: "B" },
  { root: 9, quality: "min", label: "Am" }, { root: 4, quality: "min", label: "Em" },
  { root: 2, quality: "min", label: "Dm" }, { root: 11, quality: "min", label: "Bm" },
  { root: 4, quality: "7", label: "E7" }, { root: 7, quality: "7", label: "G7" },
  { root: 2, quality: "7", label: "D7" }, { root: 9, quality: "7", label: "A7" },
  { root: 0, quality: "7", label: "C7" }, { root: 11, quality: "7", label: "B7" },
  { root: 9, quality: "m7", label: "Am7" }, { root: 2, quality: "m7", label: "Dm7" },
  { root: 4, quality: "m7", label: "Em7" }, { root: 0, quality: "maj7", label: "Cmaj7" },
  { root: 5, quality: "maj7", label: "Fmaj7" }, { root: 11, quality: "dim7", label: "Bdim7" },
];

function parseShapeString(shape) {
  return shape.split("").map((char) => (char === "x" ? "x" : Number(char)));
}

// 回傳吉他和弦指法（由低到高 E A D G B e，數字＝品位、"x"＝悶音），無則 null
function getGuitarChordShape(rootPc, qualityId) {
  const openKey = `${rootPc}:${qualityId}`;
  if (GUITAR_OPEN_SHAPES[openKey]) return parseShapeString(GUITAR_OPEN_SHAPES[openKey]);
  const candidates = [];
  if (GUITAR_E_FORM.shapes[qualityId]) {
    const fret = mod(rootPc - GUITAR_E_FORM.rootOpen, 12);
    candidates.push({ fret, shape: parseShapeString(GUITAR_E_FORM.shapes[qualityId]) });
  }
  if (GUITAR_A_FORM.shapes[qualityId]) {
    const fret = mod(rootPc - GUITAR_A_FORM.rootOpen, 12);
    candidates.push({ fret, shape: parseShapeString(GUITAR_A_FORM.shapes[qualityId]) });
  }
  if (!candidates.length) return null;
  candidates.sort((a, b) => a.fret - b.fret);
  const pick = candidates[0];
  if (pick.fret === 0) return pick.shape;
  return pick.shape.map((value) => (value === "x" ? "x" : value + pick.fret));
}

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
  { degree: "iv", quality: "m7", function: "S", label: "小下属借用" },
  { degree: "IV", quality: "maj7", function: "S", label: "下属功能" },
  { degree: "V7", quality: "7", function: "D", label: "属功能" },
  { degree: "V7alt", quality: "alt", function: "D", label: "变化属" },
  { degree: "V7/ii", quality: "7", function: "D", label: "次属到 ii" },
  { degree: "V7/V", quality: "7", function: "D", label: "次属到 V" },
  { degree: "vi", quality: "m7", function: "T", label: "替代主功能" },
  { degree: "iiø7", quality: "halfDim", function: "S", label: "小调前属" },
  { degree: "bII7", quality: "7", function: "D", label: "三全音替代" },
  { degree: "bIIImaj7", quality: "maj7", function: "color", label: "同主小调借用" },
  { degree: "bVImaj7", quality: "maj7", function: "color", label: "借用色彩" },
  { degree: "bVII7", quality: "7", function: "color", label: "借用/摇摆" },
];

const TOOLBOX_ITEMS = [
  {
    id: "cheat",
    priority: "高",
    title: "互动式音阶理论速查表",
    source: "muted.io",
    action: "theory",
    description: "综合 Cheat Sheet，显示当前主音的音阶、和弦、音程与五线谱练习入口。",
    recommendation: "适合做学习首页：先选主音，再进入调式、和弦或音程。"
  },
  {
    id: "circle",
    priority: "高",
    title: "互动五度圈 + 三度圈",
    source: "muted.io",
    action: "progressions",
    description: "用于看调性关系、常用进行、借用和弦与转调方向。",
    recommendation: "与功能和声库联动：选一个调，立即看到最自然的下一和弦。"
  },
  {
    id: "multi-board",
    priority: "高",
    title: "多乐器指板视觉化",
    source: "muted.io",
    action: "dictionary",
    description: "钢琴键盘、吉他指板、贝斯指板与乌克丽丽指板的可切换工作台。",
    recommendation: "当前已具备钢琴 + 吉他，可继续扩展到弦乐与管乐 voicing。"
  },
  {
    id: "transpose",
    priority: "中",
    title: "音阶寻找器 / 和弦移调器",
    source: "muted.io",
    action: "intervals",
    description: "输入音符找音阶；输入和弦一键移调，显示转调前后构成音。",
    recommendation: "未来可服务管乐移调乐器：Bb、Eb、F 乐器一键换谱。"
  },
  {
    id: "formula",
    priority: "中",
    title: "和弦公式与音程分解器",
    source: "muted.io",
    action: "dictionary",
    description: "点击和弦显示公式、张力音、解决倾向和构建步骤。",
    recommendation: "已经和当前和弦词典深度联动，可继续补五线谱显示。"
  },
  {
    id: "mini-seq",
    priority: "中",
    title: "简单节拍器 + 迷你音序器",
    source: "muted.io",
    action: "phrases",
    description: "轻量创作入口，用来快速测试进行、乐句和听感。",
    recommendation: "下一阶段可升级为 Hookpad 式时间轴。"
  },
  {
    id: "orchestration",
    priority: "新",
    title: "弦乐 / 管乐配器草图",
    source: "Nebula",
    action: "scores",
    description: "输入和弦后，提示弦乐、木管、铜管的实用音区和 voicing 倾向。",
    recommendation: "Phase 4 的核心入口：先做简单建议，再扩展到多轨 MIDI。"
  },
];

const STORAGE_KEYS = {
  prefs: "music-dictionary-prefs-v1",
  customPhrases: "music-dictionary-custom-phrases-v1",
  scores: "music-dictionary-scores-v1",
  logo: "music-dictionary-logo-v1",
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
  darkMode: true,
  playbackMode: "block",
  audioTone: "piano",
  swing: false,
  humanize: true,
  theoryFocus: "chord",
  selectedModeId: "ionian",
  progression: ["ii7", "V7", "Imaj7"],
  voiceAdjustments: [0, 0, 0, 0],
  voiceExample: "good",
  quiz: { total: 0, correct: 0, answer: "", type: "chord", answered: false, grade: 0 },
  quizGrade: 0,
  abrsmGrade: 1,
  quizTimer: null,
  customPhrases: [],
  scores: [],
  logo: "",
  tabBeats: 4,
  tabGrid: [],
  tabCursor: 0,
  tabChordRoot: 0,
  tabChordQuality: "maj",
  pianoChordRoot: 0,
  pianoChordQuality: "maj",
};

const els = {
  viewTitle: document.getElementById("viewTitle"),
  currentRootLabel: document.getElementById("currentRootLabel"),
  currentRootHint: document.getElementById("currentRootHint"),
  notationToggle: document.getElementById("notationToggle"),
  darkModeToggle: document.getElementById("darkModeToggle"),
  playbackModeSelect: document.getElementById("playbackModeSelect"),
  audioToneSelect: document.getElementById("audioToneSelect"),
  swingToggle: document.getElementById("swingToggle"),
  humanizeToggle: document.getElementById("humanizeToggle"),
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
  voiceAdjusters: document.getElementById("voiceAdjusters"),
  visualizeVoiceBtn: document.getElementById("visualizeVoiceBtn"),
  playVoiceBtn: document.getElementById("playVoiceBtn"),
  optimizeVoiceBtn: document.getElementById("optimizeVoiceBtn"),
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
  removeTabBeatBtn: document.getElementById("removeTabBeatBtn"),
  exportTabBtn: document.getElementById("exportTabBtn"),
  clearTabBtn: document.getElementById("clearTabBtn"),
  saveTabBtn: document.getElementById("saveTabBtn"),
  tabTitleInput: document.getElementById("tabTitleInput"),
  rightHandInput: document.getElementById("rightHandInput"),
  leftHandInput: document.getElementById("leftHandInput"),
  pianoTitleInput: document.getElementById("pianoTitleInput"),
  scoreMemoInput: document.getElementById("scoreMemoInput"),
  clearPianoBtn: document.getElementById("clearPianoBtn"),
  exportPianoBtn: document.getElementById("exportPianoBtn"),
  savePianoBtn: document.getElementById("savePianoBtn"),
  voiceCheck: document.getElementById("voiceCheck"),
  savedScores: document.getElementById("savedScores"),
  quizPrompt: document.getElementById("quizPrompt"),
  quizOptions: document.getElementById("quizOptions"),
  quizScore: document.getElementById("quizScore"),
  nextQuizBtn: document.getElementById("nextQuizBtn"),
  quizNotes: document.getElementById("quizNotes"),
  quizGradeTabs: document.getElementById("quizGradeTabs"),
  abrsmGradeTabs: document.getElementById("abrsmGradeTabs"),
  abrsmKnowledgePanel: document.getElementById("abrsmKnowledgePanel"),
  theoryHistoryTimeline: document.getElementById("theoryHistoryTimeline"),
  tabChordRoot: document.getElementById("tabChordRoot"),
  tabChordQuality: document.getElementById("tabChordQuality"),
  tabChordPreview: document.getElementById("tabChordPreview"),
  insertTabChordBtn: document.getElementById("insertTabChordBtn"),
  tabChordQuick: document.getElementById("tabChordQuick"),
  pianoChordRoot: document.getElementById("pianoChordRoot"),
  pianoChordQuality: document.getElementById("pianoChordQuality"),
  insertPianoRightBtn: document.getElementById("insertPianoRightBtn"),
  insertPianoLeftBtn: document.getElementById("insertPianoLeftBtn"),
  logoUpload: document.getElementById("logoUpload"),
  brandLogo: document.querySelector(".brand-logo"),
  brandLogoImg: document.getElementById("brandLogoImg"),
  brandLogoPlaceholder: document.getElementById("brandLogoPlaceholder"),
  removeLogoBtn: document.getElementById("removeLogoBtn"),
  toolboxGrid: document.getElementById("toolboxGrid"),
  toolboxDetail: document.getElementById("toolboxDetail"),
  toastRegion: document.getElementById("toastRegion"),
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

function showToast(message, tone = "success") {
  if (!els.toastRegion) return;
  const toast = document.createElement("div");
  toast.className = `toast ${tone}`;
  toast.textContent = message;
  els.toastRegion.appendChild(toast);
  window.setTimeout(() => toast.classList.add("visible"), 20);
  window.setTimeout(() => {
    toast.classList.remove("visible");
    window.setTimeout(() => toast.remove(), 240);
  }, 2300);
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    showToast("本機儲存空間不足，Logo 或設定可能無法保留", "info");
    return false;
  }
}

function renderLogo() {
  const hasLogo = !!state.logo;
  els.brandLogoImg.hidden = !hasLogo;
  els.brandLogoPlaceholder.hidden = hasLogo;
  els.removeLogoBtn.hidden = !hasLogo;
  els.brandLogo.classList.toggle("has-logo", hasLogo);
  if (hasLogo) {
    els.brandLogoImg.src = state.logo;
  } else {
    els.brandLogoImg.removeAttribute("src");
  }
}

function readLogoFile(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("請選擇圖片檔案"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("圖片讀取失敗"));
    reader.onload = () => {
      if (file.type === "image/svg+xml") {
        resolve(reader.result);
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error("圖片格式無法辨識"));
      img.onload = () => {
        const MAX_SIZE = 256;
        const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function safeFileName(name) {
  return String(name || "樂譜").replace(/[\\/:*?"<>|]/g, "_").trim().slice(0, 80) || "樂譜";
}

function downloadTextFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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

function getAudioProfile() {
  const profiles = {
    piano: { osc: "triangle", attack: 0.015, decay: 1.05, filter: 2400, velocity: 0.36 },
    rhodes: { osc: "sine", attack: 0.025, decay: 1.3, filter: 1700, velocity: 0.34 },
    guitar: { osc: "sawtooth", attack: 0.006, decay: 0.62, filter: 1150, velocity: 0.24 },
    synth: { osc: "square", attack: 0.018, decay: 0.85, filter: 1800, velocity: 0.22 },
  };
  return profiles[state.audioTone] || profiles.piano;
}

function noteStartOffset(index, mode, duration, gap) {
  const base = mode === "arp" ? index * (duration + gap) : mode === "strum" ? index * 0.028 : 0;
  const swing = state.swing && mode === "arp" && index % 2 === 1 ? duration * 0.32 : 0;
  const humanize = state.humanize ? (Math.random() - 0.5) * 0.018 : 0;
  return Math.max(0, base + swing + humanize);
}

function triggerMidi(midi, at, duration, velocity = 0.7) {
  const ctx = getAudioContext();
  const profile = getAudioProfile();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  osc.type = profile.osc;
  osc.frequency.value = pitchToFrequency(midi);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(profile.filter, at);
  filter.frequency.exponentialRampToValueAtTime(Math.max(420, profile.filter * 0.45), at + duration);
  const peak = Math.max(0.03, Math.min(0.9, velocity * profile.velocity));
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + profile.attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + Math.max(profile.attack + 0.05, duration * profile.decay));
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  osc.start(at);
  osc.stop(at + duration * profile.decay + 0.08);
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
    const at = now + noteStartOffset(index, mode, duration, gap);
    triggerMidi(midi, at, duration, velocity);
  });
}

function playChordNotes(notes, { arpeggio = false, octave = 4, octaveLift = 0 } = {}) {
  const baseMidi = notes.map((note) => {
    const midi = noteToPitch(note, octave);
    return midi === null ? null : midi + octaveLift * 12;
  }).filter((value) => value !== null);
  if (!baseMidi.length) return;
  playNotes(baseMidi, { mode: arpeggio ? "arp" : state.playbackMode, duration: arpeggio ? 0.32 : 0.9, gap: 0.06, velocity: 0.85 });
}

function playSequence(noteNames, { ascending = true, tempo = 0.26 } = {}) {
  const seq = ascending ? noteNames : [...noteNames].reverse();
  const ctx = getAudioContext();
  const now = ctx.currentTime + 0.04;
  seq.forEach((note, index) => {
    const midi = noteToPitch(`${note}4`);
    if (midi === null) return;
    const at = now + index * tempo + (state.swing && index % 2 === 1 ? tempo * 0.22 : 0);
    triggerMidi(midi, at, tempo * 0.9, 0.78);
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
  return getChordScaleRecommendations(chord)[0];
}

function buildScaleChoice(scale, notes, why, characteristic = [], avoid = [], use = "") {
  return { scale, notes, why, characteristic, avoid, use };
}

function noteListFromSteps(steps) {
  return steps.map((step) => noteName(state.root + step)).join(" ");
}

function getChordScaleRecommendations(chord) {
  const id = chord.id;
  if (["maj", "6", "69", "maj7", "maj9"].includes(id)) {
    return [
      buildScaleChoice("Ionian / Major", [0, 2, 4, 5, 7, 9, 11], "最稳的大调主功能选择。", ["3", "6", "maj7"], ["11"], "标准主和弦、古典/流行落点"),
      buildScaleChoice("Lydian", [0, 2, 4, 6, 7, 9, 11], "#11 避开自然 11 与大三度的冲突，现代感更强。", ["#11", "maj7"], [], "现代爵士、电影配乐、静态大和弦"),
      buildScaleChoice("Major Pentatonic", [0, 2, 4, 7, 9], "少掉 4 与 7，旋律更干净。", ["6/13", "9"], [], "流行旋律、初学即兴"),
    ];
  }
  if (["maj13"].includes(id)) {
    return [
      buildScaleChoice("Lydian", [0, 2, 4, 6, 7, 9, 11], "13 与 #11 同时出现时，Lydian 最不拥挤。", ["#11", "13", "maj7"], [], "大十三、上方结构、现代开放 voicing"),
      buildScaleChoice("Ionian", [0, 2, 4, 5, 7, 9, 11], "保留传统大调语法。", ["6/13", "maj7"], ["11"], "古典或流行语境"),
    ];
  }
  if (["min", "m7", "m9", "m11", "m6"].includes(id)) {
    return [
      buildScaleChoice("Dorian", [0, 2, 3, 5, 7, 9, 10], "自然六度让小和弦更有爵士和 funk 感。", ["m3", "6", "b7"], ["b6"], "ii7、m9、modal vamp"),
      buildScaleChoice("Aeolian / Natural Minor", [0, 2, 3, 5, 7, 8, 10], "b6 更暗，适合自然小调或流行小调。", ["b6", "b7"], [], "小调主和弦、抒情段落"),
      buildScaleChoice("Minor Pentatonic", [0, 3, 5, 7, 10], "只保留最稳的骨架音，句子容易唱。", ["m3", "b7"], [], "blues、rock、入门即兴"),
    ];
  }
  if (["7", "9", "13", "7sus4", "9sus4"].includes(id)) {
    return [
      buildScaleChoice("Mixolydian", [0, 2, 4, 5, 7, 9, 10], "大三加小七构成属功能，9 与 13 是常用自然张力。", ["3", "b7", "13"], ["11"], "基础属七、blues、流行 dominant"),
      buildScaleChoice("Bebop Dominant", [0, 2, 4, 5, 7, 9, 10, 11], "加入经过大七，让八分音符线条落点更顺。", ["3", "b7", "M7 passing"], ["11"], "swing、bebop 线条"),
      buildScaleChoice("Lydian Dominant", [0, 2, 4, 6, 7, 9, 10], "#11 让属和弦更现代，也常用于三全音替代。", ["#11", "b7", "13"], [], "subV7、fusion、非解决属"),
    ];
  }
  if (["7b9", "7b13"].includes(id)) {
    return [
      buildScaleChoice("Phrygian Dominant / Harmonic Minor V", [0, 1, 4, 5, 7, 8, 10], "b9 与 b13 指向小调解决，色彩集中。", ["b9", "3", "b13", "b7"], [], "小调 V7b9、古典和声小调属"),
      buildScaleChoice("Half-Whole Diminished", [0, 1, 3, 4, 6, 7, 9, 10], "对称张力覆盖 b9、#9、#11、13。", ["b9", "#9", "#11", "13"], [], "强属解决、big band 句法"),
    ];
  }
  if (["7sharp9", "alt"].includes(id)) {
    return [
      buildScaleChoice("Altered Scale / Super Locrian", [0, 1, 3, 4, 6, 8, 10], "包含 b9、#9、b5、#5，适合强解决到目标和弦。", ["b9", "#9", "b5", "#5", "b7"], [], "V7alt → I / i"),
      buildScaleChoice("Half-Whole Diminished", [0, 1, 3, 4, 6, 7, 9, 10], "保留自然 5 与 13，张力更对称。", ["b9", "#9", "#11", "13"], [], "dominant diminished lick"),
      buildScaleChoice("Blues Dominant", [0, 3, 4, 6, 7, 10], "#9 可听成蓝调小三度。", ["#9/m3", "3", "b7"], [], "funk、blues、fusion"),
    ];
  }
  if (["halfDim"].includes(id)) {
    return [
      buildScaleChoice("Locrian natural 2", [0, 2, 3, 5, 6, 8, 10], "适合小调 iiø，保留 b5 且二度更柔和。", ["m3", "b5", "b7", "natural 2"], [], "iiø-V-i"),
      buildScaleChoice("Locrian", [0, 1, 3, 5, 6, 8, 10], "b2 更紧张，适合短暂经过。", ["b2", "b5"], [], "强烈暗色、经过功能"),
    ];
  }
  if (["dim", "dim7"].includes(id)) {
    return [
      buildScaleChoice("Whole-Half Diminished", [0, 2, 3, 5, 6, 8, 9, 11], "对称减音阶能覆盖减七和弦与经过功能。", ["m3", "b5", "bb7", "M7 color"], [], "vii°7、经过减七"),
      buildScaleChoice("Diminished Arpeggio Cell", [0, 3, 6, 9], "先练四个对称和弦音，最容易听清功能。", ["m3 cycle"], [], "技术练习、转位连接"),
    ];
  }
  if (["aug"].includes(id)) {
    return [
      buildScaleChoice("Whole Tone", [0, 2, 4, 6, 8, 10], "全音阶与增三和弦同样对称，悬浮感强。", ["3", "#5", "b7 color"], [], "增和弦、非功能色彩"),
      buildScaleChoice("Lydian Augmented", [0, 2, 4, 6, 8, 9, 11], "旋律小调第三调式，适合 maj7#5。", ["#5", "#11", "maj7"], [], "电影感、现代大和弦"),
    ];
  }
  return [
    buildScaleChoice("Major Pentatonic / Chord Tones", [0, 2, 4, 7, 9], "先锁定和弦音，再用五声音阶补旋律。", ["1", "3", "5"], [], "入门即兴与旋律写作"),
    buildScaleChoice("Current Key Scale", SCALE_LIBRARY[state.mode] || SCALE_LIBRARY.major, "与当前调式保持一致，适合调内旋律。", ["scale degrees"], [], "功能和声语境"),
  ];
}

function getFunctionClass(chord) {
  if (["7", "9", "11", "13", "7b9", "7sharp9", "7b13", "alt", "dim", "dim7"].includes(chord.id)) return "Dominant";
  if (["m7", "m9", "m11", "halfDim", "sus2", "sus4", "7sus4", "9sus4"].includes(chord.id)) return "Subdominant";
  if (["maj", "maj7", "maj9", "maj13", "6", "69", "min", "m6", "mMaj7", "add9"].includes(chord.id)) return "Tonic";
  return "Color";
}

function functionToneClass(chord) {
  const cls = getFunctionClass(chord);
  return {
    Tonic: "tonic",
    Dominant: "dominant",
    Subdominant: "subdominant",
    Color: "color",
  }[cls] || "color";
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
  const chordScales = getChordScaleRecommendations(chord);
  const scaleRows = chordScales
    .map((choice) => `
      <article class="scale-choice">
        <strong>${choice.scale}</strong>
        <span>${noteListFromSteps(choice.notes)}</span>
        <p>${choice.why}</p>
        <small>特徵音：${choice.characteristic.join("、") || "和弦音"} · Avoid notes：${choice.avoid.join("、") || "无明显禁忌"} · 用途：${choice.use}</small>
      </article>
    `)
    .join("");
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
      <li><strong>声部进行：</strong>${getVoiceLeadingAdvice(chord)}</li>
      <li><strong>风格提示：</strong>${styleAdvice}</li>
    </ul>
    <div class="scale-choice-list">
      <h4>Chord-Scale 推荐</h4>
      ${scaleRows}
    </div>
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
      <li><strong>专业评分：</strong>${renderScoreLine(analysis.scores)}</li>
      <li><strong>替代建议：</strong>${analysis.suggestion}</li>
      <li><strong>下一和弦：</strong>${analysis.nextSuggestions.join("、")}</li>
    </ul>
    ${analysis.events.length ? `<div class="analysis-tags">${analysis.events.map((event) => `<span>${event}</span>`).join("")}</div>` : ""}
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
  if (/^v7\//i.test(token)) return "D";
  if (/^bii/.test(lower) || /^v(?!i|ii)/.test(lower) || /^vii/.test(lower) || lower.startsWith("alt")) return "D";
  if (/^ii/.test(lower) || /^iv/.test(lower) || lower.startsWith("sus")) return "S";
  if (lower.startsWith("bii") || lower.startsWith("v7") || lower.startsWith("vii") || lower.startsWith("alt") || lower === "v") return "D";
  if (lower.startsWith("vi") || lower.startsWith("bvi") || lower.startsWith("biii")) return "T";
  if (/^i(?!i|v)/.test(lower) || /^im/.test(lower) || /^imaj/.test(lower)) return "T";
  return "color";
}

function detectProgressionEvents(degrees, functions) {
  const events = [];
  degrees.forEach((degree, index) => {
    const token = String(degree);
    if (/V7\//.test(token)) events.push(`${token}: secondary dominant，临时强化目标级。`);
    if (token === "bII7") events.push("bII7: tritone substitution，替代 V7，常半音下行到 I。");
    if (["bVImaj7", "bVII7", "bIIImaj7", "iv"].includes(token)) events.push(`${token}: modal interchange，常从同主小调借用。`);
    if (/alt|b9|#9|b13/.test(token)) events.push(`${token}: altered dominant，张力音应半音解决。`);
    const next = degrees[index + 1];
    if (token === "V7/V" && next && String(next).startsWith("V")) events.push("V7/V → V: extended dominant chain。");
    if (functions[index] === "D" && functions[index + 1] === "D") events.push("连续属功能：可形成 extended dominant 或转调推进。");
  });
  if (degrees.includes("I") && degrees.includes("bVImaj7") && degrees.includes("bVII7")) {
    events.push("I-bVI-bVII-I: 大调中借用小调色彩，电影感/neo-soul 常见。");
  }
  return [...new Set(events)];
}

function progressionVoiceSmoothness(degrees) {
  if (degrees.length < 2) return 50;
  let total = 0;
  let pairs = 0;
  for (let i = 0; i < degrees.length - 1; i++) {
    const a = chordNameToMidiSet(degreeToChordName(degrees[i]));
    const b = chordNameToMidiSet(degreeToChordName(degrees[i + 1]));
    if (!a.length || !b.length) continue;
    const avg = a.slice(0, 4).reduce((sum, from, index) => {
      let to = b[index % b.length];
      while (to - from > 6) to -= 12;
      while (from - to > 6) to += 12;
      return sum + Math.abs(to - from);
    }, 0) / Math.min(4, a.length);
    total += avg;
    pairs += 1;
  }
  if (!pairs) return 50;
  return Math.max(15, Math.min(100, Math.round(100 - (total / pairs) * 10)));
}

function renderScoreLine(scores) {
  return [
    `VL ${scores.voiceLeading}`,
    `功能 ${scores.functionalStrength}`,
    `张放 ${scores.tensionRelease}`,
    `风格 ${scores.styleUsage}`,
  ].join(" / ");
}

function getNextChordSuggestions(degrees, functions) {
  const lastFn = functions.at(-1);
  const lastDegree = degrees.at(-1) || "";
  if (!degrees.length) return ["I", "ii7", "V7"];
  if (lastFn === "T") return state.styleMode === "classical" ? ["IV", "ii7", "V7"] : ["ii7", "IV", "bVImaj7"];
  if (lastFn === "S") return ["V7", "V7alt", "bII7"];
  if (lastFn === "D") return /V7\/ii/.test(lastDegree) ? ["ii7"] : /V7\/V/.test(lastDegree) ? ["V7"] : ["Imaj7", "i", "vi"];
  return ["ii7", "V7", "Imaj7"];
}

function analyzeProgression(degrees = []) {
  const functions = degrees.map((degree) => degreeFunction(degree));
  const chain = functions.join("-");
  const events = detectProgressionEvents(degrees, functions);
  const scores = {
    voiceLeading: progressionVoiceSmoothness(degrees),
    functionalStrength: 45,
    tensionRelease: 42,
    styleUsage: 48,
  };
  if (chain.includes("S-D-T")) scores.functionalStrength += 34;
  if (chain.includes("T-S-D-T")) scores.functionalStrength += 26;
  if (chain.includes("D-T")) scores.tensionRelease += 30;
  if (degrees.some((degree) => /alt|b9|#9|b13|bII/.test(degree))) scores.tensionRelease += 14;
  if (degrees.length >= 4) scores.styleUsage += 10;
  if (events.some((event) => event.includes("secondary"))) scores.functionalStrength += 10;
  if (events.some((event) => event.includes("modal interchange"))) scores.styleUsage += 10;
  if (state.styleMode === "jazz" && degrees.some((degree) => /ii|V7|bII|alt/.test(degree))) scores.styleUsage += 18;
  if (state.styleMode === "classical" && !degrees.some((degree) => /alt|#9|b13|bII/.test(degree))) scores.styleUsage += 14;
  Object.keys(scores).forEach((key) => {
    scores[key] = Math.max(20, Math.min(100, Math.round(scores[key])));
  });
  const score = Math.round((scores.voiceLeading + scores.functionalStrength + scores.tensionRelease + scores.styleUsage) / 4);
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
    scores,
    events,
    nextSuggestions: getNextChordSuggestions(degrees, functions),
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
    "V7/ii": [9, "7"],
    "V7/V": [2, "7"],
    vi: [9, "m"],
    bII7: [1, "7"],
    bIIImaj7: [3, "maj7"],
    bVImaj7: [8, "maj7"],
    bVII7: [10, "7"],
    iv: [5, "m"],
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

function chordNameToMidiSet(name) {
  const match = String(name).match(/^([A-G](?:#|b)?)(.*)$/);
  if (!match) return [];
  const rootMidi = noteToPitch(`${match[1]}4`);
  if (rootMidi === null) return [];
  const suffix = match[2] || "";
  const quality = CHORD_QUALITY_LIBRARY.find((chord) => {
    const suffixes = [chord.name, ...chord.symbols].filter(Boolean);
    return suffixes.includes(suffix) || (suffix === "" && chord.id === "maj");
  }) || CHORD_QUALITY_LIBRARY.find((chord) => chord.id === "maj");
  return quality.intervals.map((interval) => {
    const midi = rootMidi + interval;
    return midi < 60 ? midi + 12 : midi;
  }).sort((a, b) => a - b);
}

function getCompactVoicing(chord, root = state.root, baseOctave = 4) {
  return chord.intervals.map((interval) => {
    const midi = 12 * (baseOctave + 1) + root + interval;
    return midi < 60 ? midi + 12 : midi;
  }).slice(0, 4).sort((a, b) => a - b);
}

function normalizeVoiceAdjustments(length = 4) {
  while (state.voiceAdjustments.length < length) state.voiceAdjustments.push(0);
  state.voiceAdjustments = state.voiceAdjustments.slice(0, length).map((value) => Number(value) || 0);
}

function buildVoiceMoves(source, targetRaw, adjustments = []) {
  const moves = source.map((from, index) => {
    const raw = targetRaw[index % targetRaw.length] || targetRaw[0];
    let to = raw;
    while (to - from > 6) to -= 12;
    while (from - to > 6) to += 12;
    to += adjustments[index] || 0;
    return { from, to, distance: to - from };
  });
  return moves;
}

function detectParallelPerfects(moves, hidden = false) {
  const issues = [];
  for (let i = 0; i < moves.length; i++) {
    for (let j = i + 1; j < moves.length; j++) {
      const startInterval = mod(moves[j].from - moves[i].from, 12);
      const endInterval = mod(moves[j].to - moves[i].to, 12);
      const sameDirection = Math.sign(moves[i].distance) === Math.sign(moves[j].distance) && Math.sign(moves[i].distance) !== 0;
      const perfectEnd = endInterval === 0 || endInterval === 7;
      if (!sameDirection || !perfectEnd) continue;
      if (!hidden && startInterval === endInterval) issues.push(`声部 ${i + 1}-${j + 1} 可能形成平行${endInterval === 7 ? "五度" : "八度"}。`);
      if (hidden && startInterval !== endInterval && (Math.abs(moves[i].distance) > 2 || Math.abs(moves[j].distance) > 2)) {
        issues.push(`声部 ${i + 1}-${j + 1} 有隐藏${endInterval === 7 ? "五度" : "八度"}倾向。`);
      }
    }
  }
  return issues;
}

function evaluateVoiceLeading(chordA, chordB, moves) {
  const maxMove = Math.max(...moves.map((move) => Math.abs(move.distance)));
  const commonTones = moves.filter((move) => mod(move.from, 12) === mod(move.to, 12)).length;
  const stepwise = moves.filter((move) => Math.abs(move.distance) <= 2).length;
  const issues = [];
  const advice = [];
  const severe = [];
  const leadingTone = mod(state.root + 11, 12);
  const tonic = mod(state.root, 12);
  moves.forEach((move, index) => {
    if (mod(move.from, 12) === leadingTone && mod(move.to, 12) !== tonic) {
      const text = `第 ${index + 1} 声部：导音 ${midiToNoteName(move.from)} 建议上行解决到 ${noteName(tonic)}。`;
      (state.styleMode === "classical" ? severe : issues).push(text);
    }
    if (getFunctionClass(chordA) === "Dominant" && mod(move.from, 12) === mod(state.root + 10, 12) && move.distance >= 0) {
      const text = `第 ${index + 1} 声部：属七的七音 ${midiToNoteName(move.from)} 通常下行解决。`;
      (state.styleMode === "jazz" ? issues : severe).push(text);
    }
    if (Math.abs(move.distance) > 7) issues.push(`第 ${index + 1} 声部跳进 ${Math.abs(move.distance)} 半音，建议改用转位或共同音。`);
  });
  severe.push(...detectParallelPerfects(moves));
  if (state.styleMode === "classical") issues.push(...detectParallelPerfects(moves, true));
  if (commonTones) advice.push(`保留 ${commonTones} 个共同音，稳定度好。`);
  if (stepwise < Math.max(2, moves.length - 1)) advice.push("可尝试让更多内声级进，级进优于跳进。");
  if (state.styleMode === "jazz") advice.push("爵士 comping 可接受较开放声部，但 3-7/7-3 guide tones 要保持清楚。");
  if (state.styleMode === "classical") advice.push("古典模式按 chorale style 更严格：导音、七音、平行与隐藏五八度都要检查。");
  const rating = Math.max(20, Math.min(100, 100 - maxMove * 8 + commonTones * 9 + stepwise * 5 - severe.length * 18 - issues.length * 8));
  const summary = `最大移动 ${maxMove} 半音；共同音 ${commonTones} 个；级进/保留 ${stepwise}/${moves.length}。${rating >= 82 ? "声部非常平滑。" : rating >= 62 ? "可用，但还能优化。" : "教育性地暴露了需要修正的声部问题。"}`;
  return { maxMove, commonTones, stepwise, severe, issues, advice, rating: Math.round(rating), summary };
}

function compareVoiceLeading(chordA, chordB, options = {}) {
  const source = getCompactVoicing(chordA);
  const targetRaw = getCompactVoicing(chordB);
  normalizeVoiceAdjustments(source.length);
  const adjustments = options.adjustments || state.voiceAdjustments;
  const moves = buildVoiceMoves(source, targetRaw, adjustments);
  const check = evaluateVoiceLeading(chordA, chordB, moves);
  return {
    source,
    target: moves.map((m) => m.to),
    moves,
    summary: check.summary,
    parallelRisk: check.severe.some((item) => item.includes("平行")),
    check,
  };
}

function resetVoiceAdjustments() {
  state.voiceAdjustments = [0, 0, 0, 0];
}

function optimizeVoiceLeadingAdjustments(chordA, chordB) {
  const source = getCompactVoicing(chordA);
  const target = getCompactVoicing(chordB);
  state.voiceAdjustments = source.map((from, index) => {
    const raw = target[index % target.length] || target[0];
    const candidates = [-12, -7, -5, -2, -1, 0, 1, 2, 5, 7, 12].map((offset) => {
      let to = raw;
      while (to - from > 6) to -= 12;
      while (from - to > 6) to += 12;
      return offset + to - (raw + (to - raw));
    });
    return candidates.sort((a, b) => {
      const moveA = buildVoiceMoves([from], [raw], [a])[0];
      const moveB = buildVoiceMoves([from], [raw], [b])[0];
      return Math.abs(moveA.distance) - Math.abs(moveB.distance);
    })[0] || 0;
  });
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
  const midi = getChordMidi(chord);
  const compact = midi.slice(0, 4).map((note) => midiToNoteName(note)).join(" ");
  const drop2 = midi.slice(0, 4);
  if (drop2.length >= 4) drop2[1] -= 12;
  const drop3 = midi.slice(0, 4);
  if (drop3.length >= 4) drop3[0] -= 12;
  const rootless37 = chord.intervals
    .filter((interval) => [3, 4, 9, 10, 11, 13, 14, 15, 17, 20, 21].includes(interval))
    .slice(0, 4)
    .map((interval) => noteName(state.root + interval));
  const quartal = [0, 5, 10, 15].map((interval) => noteName(state.root + interval));
  const upperStructure = getFunctionClass(chord) === "Dominant"
    ? [14, 18, 21].map((interval) => noteName(state.root + interval))
    : [14, 18, 23].map((interval) => noteName(state.root + interval));
  const chorale = getCompactVoicing(chord, state.root, 3).map((note) => midiToNoteName(note));
  const cards = [
    ["钢琴紧凑", compact, "适合识别和弦性质、键盘基础伴奏。"],
    ["Drop 2", drop2.map((note) => midiToNoteName(note)).join(" "), "适合中速 ballad comping 与吉他四声部。"],
    ["Drop 3", drop3.map((note) => midiToNoteName(note)).join(" "), "低音更开，适合吉他低把位或钢琴左手支撑。"],
    ["Rootless 3-7", rootless37.join(" ") || tones.slice(1).join(" "), "快 tempo、bebop、钢琴左手常用，根音交给贝斯。"],
    ["Upper Structure", upperStructure.join(" "), "属和弦上方三和弦色彩，适合 altered / Lydian dominant。"],
    ["Quartal", quartal.join(" "), "四度堆叠，适合 modal、fusion 与现代吉他。"],
    ["Chorale 四声部", chorale.join(" "), "古典模式参考：声部紧密、便于检查平行与解决。"],
    ["吉他省略", tones.slice(0, 4).join(" "), "保留根音、三音、七音；五音可省略。"],
  ];
  els.voicingStrip.innerHTML = cards
    .map(([title, body, context]) => `<article class="voicing-card"><strong>${title}</strong><span>${body}</span><small>${context}</small></article>`)
    .join("");
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
      const functionClass = getFunctionClass(chord);
      return `
        <button class="chord-card ${active ? "active" : ""} ${functionToneClass(chord)}" data-chord="${chord.id}" type="button">
          <span class="function-badge">${functionClass}</span>
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

function renderToolbox(selectedId = TOOLBOX_ITEMS[0]?.id) {
  if (!els.toolboxGrid) return;
  const selected = TOOLBOX_ITEMS.find((item) => item.id === selectedId) || TOOLBOX_ITEMS[0];
  const priorityClass = (priority) => {
    if (priority === "高") return "high";
    if (priority === "中") return "medium";
    return "new";
  };
  els.toolboxGrid.innerHTML = TOOLBOX_ITEMS.map((item) => `
    <button class="tool-card ${item.id === selected.id ? "active" : ""}" data-toolbox-id="${item.id}" type="button">
      <span class="priority-chip ${priorityClass(item.priority)}">${item.priority}</span>
      <strong>${item.title}</strong>
      <p>${item.description}</p>
      <small>${item.source}</small>
    </button>
  `).join("");
  els.toolboxDetail.innerHTML = `
    <h4>${selected.title}</h4>
    <ul>
      <li><strong>优先级：</strong>${selected.priority}</li>
      <li><strong>借鉴来源：</strong>${selected.source}</li>
      <li><strong>实际建议：</strong>${selected.recommendation}</li>
      <li><strong>当前可联动：</strong>点击下方按钮进入对应模块。</li>
    </ul>
    <button class="primary-button" data-toolbox-open="${selected.action}" type="button">打开相关工具</button>
  `;
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
      <button class="palette-chord drag-source" draggable="true" data-drag-degree="${item.degree}" data-add-degree="${item.degree}" type="button">
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
      <li><strong>综合评分：</strong>${analysis.score}/100</li>
      <li><strong>专业维度：</strong>${renderScoreLine(analysis.scores)}</li>
      <li><strong>替代建议：</strong>${analysis.suggestion}</li>
      <li><strong>下一和弦建议：</strong>${analysis.nextSuggestions.join("、")}</li>
      <li><strong>实际和弦：</strong>${state.progression.map(degreeToChordName).join(" - ") || "尚未建立"}</li>
    </ul>
    ${analysis.events.length ? `<div class="analysis-tags">${analysis.events.map((event) => `<span>${event}</span>`).join("")}</div>` : ""}
  `;
}

function getModeStepFormula(mode) {
  const steps = [];
  for (let i = 1; i < mode.intervals.length; i += 1) {
    steps.push(mode.intervals[i] - mode.intervals[i - 1]);
  }
  steps.push(12 + mode.intervals[0] - mode.intervals[mode.intervals.length - 1]);
  return steps
    .map((step) => {
      if (step === 1) return "半";
      if (step === 2) return "全";
      return `${step} 半音`;
    })
    .join(" ");
}

function renderModes() {
  if (!els.modeGallery) return;
  const categories = [];
  MODE_DETAILS.forEach((mode) => {
    let group = categories.find((item) => item.category === mode.category);
    if (!group) {
      group = { category: mode.category, modes: [] };
      categories.push(group);
    }
    group.modes.push(mode);
  });
  els.modeGallery.innerHTML = categories
    .map((group) => `
      <div class="mode-group">
        <h4 class="mode-group-title">${group.category} <span>${group.modes.length}</span></h4>
        <div class="mode-group-cards">
          ${group.modes
            .map((mode) => {
              const notes = mode.intervals.map((step) => noteName(state.root + step)).join(" ");
              return `
                <article class="mode-card ${mode.id === state.selectedModeId ? "active" : ""}" data-mode-detail="${mode.id}">
                  <h4>${mode.label}</h4>
                  <p class="mode-card-notes">${notes}</p>
                  <p>${mode.feature}</p>
                </article>
              `;
            })
            .join("")}
        </div>
      </div>
    `)
    .join("");
  const selected = MODE_DETAILS.find((mode) => mode.id === state.selectedModeId) || MODE_DETAILS[0];
  els.modeDetail.innerHTML = `
    <h4>${selected.label}</h4>
    <p class="mode-detail-category">${selected.category}</p>
    <ul>
      <li><strong>音阶：</strong>${selected.intervals.map((step) => noteName(state.root + step)).join(" ")}</li>
      <li><strong>音程結構（半音數）：</strong>${selected.intervals.slice(1).map((step, i) => step - selected.intervals[i]).join("、")}（回到八度：${12 + selected.intervals[0] - selected.intervals[selected.intervals.length - 1]}）</li>
      <li><strong>全半音排列：</strong>${getModeStepFormula(selected)}</li>
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
  if (state.voiceExample === "good") {
    els.voiceChordA.value = els.voiceChordA.value || "7";
    els.voiceChordB.value = els.voiceChordB.value || "maj7";
  }
  document.querySelectorAll("[data-voice-example]").forEach((button) => {
    button.classList.toggle("active", button.dataset.voiceExample === state.voiceExample);
  });
  renderVoiceVisual();
}

function renderVoiceAdjusters(comparison) {
  if (!els.voiceAdjusters) return;
  normalizeVoiceAdjustments(comparison.moves.length);
  els.voiceAdjusters.innerHTML = comparison.moves
    .map((move, index) => `
      <label>
        <span>声部 ${index + 1}: ${midiToNoteName(move.from)} → ${midiToNoteName(move.to)}</span>
        <select data-voice-adjust="${index}">
          ${[-12, -7, -5, -2, -1, 0, 1, 2, 5, 7, 12].map((value) => `
            <option value="${value}" ${state.voiceAdjustments[index] === value ? "selected" : ""}>${value > 0 ? "+" : ""}${value} 半音</option>
          `).join("")}
        </select>
      </label>
    `)
    .join("");
}

function renderVoiceVisual() {
  if (!els.voiceVisual) return;
  const chordA = chordById(els.voiceChordA.value || "maj7");
  const chordB = chordById(els.voiceChordB.value || "7");
  const comparison = compareVoiceLeading(chordA, chordB);
  renderVoiceAdjusters(comparison);
  const laneYs = [94, 174, 254, 334];
  const x1 = 170;
  const x2 = 760;
  const labelX1 = 96;
  const labelX2 = 806;
  const centerX = 465;
  const rows = comparison.moves.map((move, index) => {
    const y = laneYs[index] || laneYs.at(-1);
    const direction = move.distance > 0 ? "up" : move.distance < 0 ? "down" : "same";
    const bend = direction === "up" ? -18 : direction === "down" ? 18 : 0;
    const path = `M ${x1} ${y} C ${x1 + 165} ${y + bend}, ${x2 - 165} ${y + bend}, ${x2} ${y}`;
    const distanceLabel = move.distance > 0 ? `+${move.distance}` : `${move.distance}`;
    return `
      <line class="voice-guide" x1="76" y1="${y}" x2="844" y2="${y}"></line>
      <text class="voice-index" x="44" y="${y + 6}">V${index + 1}</text>
      <path class="voice-line ${direction}" d="${path}"></path>
      <circle class="voice-note source" cx="${x1}" cy="${y}" r="20"></circle>
      <circle class="voice-note target" cx="${x2}" cy="${y}" r="20"></circle>
      <text class="voice-label note-left" x="${labelX1}" y="${y + 6}">${midiToNoteName(move.from)}</text>
      <text class="voice-label note-right" x="${labelX2}" y="${y + 6}">${midiToNoteName(move.to)}</text>
      <rect class="voice-distance-pill" x="${centerX - 26}" y="${y - 16}" width="52" height="32" rx="16"></rect>
      <text class="voice-distance" x="${centerX}" y="${y + 6}">${distanceLabel}</text>
    `;
  }).join("");
  els.voiceVisual.innerHTML = `
    <defs>
      <linearGradient id="voiceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#6366f1"></stop>
        <stop offset="100%" stop-color="#7c3aed"></stop>
      </linearGradient>
      <linearGradient id="voiceGoldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f59e0b"></stop>
        <stop offset="100%" stop-color="#fb923c"></stop>
      </linearGradient>
      <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
        <path d="M0,0 L0,6 L9,3 z" fill="#7c3aed"></path>
      </marker>
    </defs>
    <rect class="voice-stage" x="24" y="24" width="872" height="372" rx="26"></rect>
    <text class="voice-title-left" x="${x1}" y="54">${noteName(state.root)}${chordA.name}</text>
    <text class="voice-title-right" x="${x2}" y="54">${noteName(state.root)}${chordB.name}</text>
    ${rows}
  `;
  const severe = comparison.check.severe.length
    ? comparison.check.severe.map((item) => `<li class="issue-severe">${item}</li>`).join("")
    : '<li class="issue-good">未发现严重规则问题。</li>';
  const issues = comparison.check.issues.length
    ? comparison.check.issues.map((item) => `<li>${item}</li>`).join("")
    : '<li class="issue-good">没有明显可疑移动。</li>';
  const advice = comparison.check.advice.map((item) => `<li>${item}</li>`).join("");
  els.voiceWarnings.innerHTML = `
    <h4>检查结果</h4>
    <p>${comparison.summary} 评分 ${comparison.check.rating}/100。</p>
    <ul>
      ${severe}
      ${issues}
      ${advice}
    </ul>
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

function updateVoiceExampleState(example) {
  state.voiceExample = example;
  if (example === "bad") {
    state.voiceAdjustments = [7, -5, 7, -5];
    els.voiceChordA.value = "maj7";
    els.voiceChordB.value = "maj7";
  } else {
    state.voiceAdjustments = [0, -1, 0, 0];
    els.voiceChordA.value = "m7";
    els.voiceChordB.value = "maj7";
  }
  renderVoiceVisual();
  persist();
}

function renderQuiz() {
  if (!state.quiz.answer) nextQuiz();
  els.quizScore.textContent = `${state.quiz.correct} / ${state.quiz.total}`;
  document.querySelectorAll("[data-quiz-grade]").forEach((tab) => {
    tab.classList.toggle("active", Number(tab.dataset.quizGrade) === state.quizGrade);
  });
  const gradeBadge =
    state.quiz.type === "abrsm"
      ? `<span class="quiz-badge">ABRSM ${state.quiz.grade} 級</span>`
      : `<span class="quiz-badge">綜合聽辨</span>`;
  const questionTitle =
    state.quiz.type === "chord"
      ? "這是哪個和弦？"
      : state.quiz.type === "interval"
        ? "這是哪個音程？"
        : "樂理選擇題";
  els.quizPrompt.innerHTML = `<h4>${gradeBadge}${questionTitle}</h4><p>${state.quiz.prompt}</p>`;
  els.quizOptions.innerHTML = state.quiz.options
    .map((option, index) => {
      const classes = ["quiz-option"];
      if (state.quiz.answered) {
        classes.push("locked");
        if (option === state.quiz.answer) classes.push("correct");
        if (index === state.quiz.selectedIndex && option !== state.quiz.answer) classes.push("wrong");
      }
      return `
        <button class="${classes.join(" ")}" data-quiz-option="${index}" type="button" ${state.quiz.answered ? "disabled" : ""}>${option}</button>
      `;
    })
    .join("");
  if (!state.quiz.answered) {
    els.quizNotes.innerHTML = `
      <h4>學習提示</h4>
      <p>${state.quiz.hint}</p>
      <p class="quiz-hint-note">每題只能選擇一次，作答後會自動跳往下一題。</p>
    `;
  }
}

function makeChordQuestion() {
  const chord = CHORD_QUALITY_LIBRARY[Math.floor(Math.random() * CHORD_QUALITY_LIBRARY.length)];
  const correct = `${noteName(state.root)}${chord.name}`;
  const wrongs = CHORD_QUALITY_LIBRARY.filter((item) => item.id !== chord.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((item) => `${noteName(state.root)}${item.name}`);
  return {
    type: "chord",
    prompt: `${getChordNoteNames(chord).join("、")}，功能 ${getFunctionClass(chord)}。`,
    options: [correct, ...wrongs].sort(() => Math.random() - 0.5),
    answer: correct,
    hint: getTheoryHtml(chord).replace(/<[^>]+>/g, " "),
  };
}

function makeIntervalQuestion() {
  const interval = INTERVAL_REFERENCE[Math.floor(Math.random() * (INTERVAL_REFERENCE.length - 1))];
  const a = NOTE_NAMES.sharp[Math.floor(Math.random() * 12)];
  const b = NOTE_NAMES.sharp[(NOTE_NAMES.sharp.indexOf(a) + interval[2]) % 12];
  const answer = interval[1];
  const wrongs = INTERVAL_REFERENCE.filter((item) => item[1] !== interval[1])
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((item) => item[1]);
  return {
    type: "interval",
    prompt: `${a} → ${b}`,
    options: [answer, ...wrongs].sort(() => Math.random() - 0.5),
    answer,
    hint: `答案是 ${interval[0]}，${interval[3]}`,
  };
}

function makeAbrsmQuestion(grade) {
  const pool = ABRSM_QUESTION_BANK.filter((item) => item.grade === grade);
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return {
    type: "abrsm",
    prompt: picked.prompt,
    options: [...picked.options].sort(() => Math.random() - 0.5),
    answer: picked.answer,
    hint: picked.hint,
  };
}

function nextQuiz() {
  const total = state.quiz.total || 0;
  const correct = state.quiz.correct || 0;
  let question;
  if (state.quizGrade > 0) {
    question = makeAbrsmQuestion(state.quizGrade);
  } else if (Math.random() > 0.45) {
    question = makeChordQuestion();
  } else {
    question = makeIntervalQuestion();
  }
  state.quiz = {
    ...question,
    total: total + 1,
    correct,
    selectedIndex: null,
    answered: false,
    grade: state.quizGrade,
  };
}

function answerQuiz(index) {
  if (state.quiz.answered) return;
  const chosen = state.quiz.options[index];
  const isCorrect = chosen === state.quiz.answer;
  state.quiz.answered = true;
  state.quiz.selectedIndex = index;
  if (isCorrect) state.quiz.correct += 1;
  renderQuiz();
  els.quizNotes.innerHTML = `
    <h4>${isCorrect ? "答對了！" : "再想一下"}</h4>
    <p><strong>正確答案：</strong>${state.quiz.answer}。</p>
    <p>${state.quiz.hint}</p>
    <p class="quiz-hint-note">${isCorrect ? "稍候自動跳往下一題……" : "請記住答案，稍候自動跳往下一題……"}</p>
  `;
  els.quizScore.textContent = `${state.quiz.correct} / ${state.quiz.total}`;
  clearTimeout(state.quizTimer);
  state.quizTimer = setTimeout(() => {
    advanceQuiz();
  }, isCorrect ? 1300 : 2800);
}

function advanceQuiz() {
  clearTimeout(state.quizTimer);
  nextQuiz();
  renderQuiz();
}

function switchQuizGrade(grade) {
  state.quizGrade = grade;
  state.quiz.answer = "";
  clearTimeout(state.quizTimer);
  nextQuiz();
  renderQuiz();
  persist();
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
  renderAbrsmKnowledge();
  renderTheoryHistory();
}

function renderAbrsmKnowledge() {
  if (!els.abrsmKnowledgePanel) return;
  document.querySelectorAll("[data-abrsm-grade]").forEach((tab) => {
    tab.classList.toggle("active", Number(tab.dataset.abrsmGrade) === state.abrsmGrade);
  });
  const gradeData = ABRSM_KNOWLEDGE.find((item) => item.grade === state.abrsmGrade) || ABRSM_KNOWLEDGE[0];
  els.abrsmKnowledgePanel.innerHTML = `
    <div class="abrsm-grade-head">
      <h4>${gradeData.title}</h4>
      <p class="abrsm-grade-tip">想驗證學習成果？可到「測驗模式」選擇 ABRSM ${gradeData.grade} 級題庫。</p>
    </div>
    <div class="abrsm-topic-grid">
      ${gradeData.topics
        .map(
          (topic) => `
            <article class="abrsm-topic">
              <h4>${topic.title}</h4>
              <ul>${topic.points.map((point) => `<li>${point}</li>`).join("")}</ul>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderTheoryHistory() {
  if (!els.theoryHistoryTimeline) return;
  els.theoryHistoryTimeline.innerHTML = THEORY_HISTORY.map(
    (item) => `
      <div class="history-item">
        <div class="history-dot"></div>
        <div class="history-body">
          <p class="history-era">${item.era}</p>
          <h4>${item.title}</h4>
          <p>${item.body}</p>
        </div>
      </div>
    `
  ).join("");
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
            return `<input data-row="${rowIndex}" data-col="${colIndex}" maxlength="2" inputmode="numeric" placeholder="-" aria-label="${string} 弦第 ${colIndex + 1} 格" value="${escapeHtml(value)}" />`;
          }).join("")}
        </div>
      `;
    })
    .join("");
}

function serializeTabGrid(grid = state.tabGrid, beats = state.tabBeats) {
  const strings = ["e", "B", "G", "D", "A", "E"];
  return strings
    .map((label, rowIndex) => {
      const row = grid[rowIndex] || [];
      const cells = Array.from({ length: beats }, (_, colIndex) => {
        const raw = String(row[colIndex] ?? "").trim();
        return (raw === "" ? "-" : raw).padStart(2, "-");
      });
      return `${label}|${cells.join("-")}|`;
    })
    .join("\n");
}

function buildTabScore(title, memo = "") {
  return {
    type: "tab",
    title,
    memo,
    body: serializeTabGrid(),
  };
}

function buildPianoScore(title, memo = "") {
  const rightHand = els.rightHandInput.value.trim() || "-";
  const leftHand = els.leftHandInput.value.trim() || "-";
  return {
    type: "piano",
    title,
    memo,
    body: `右手（RH）：${rightHand}\n左手（LH）：${leftHand}`,
  };
}

function buildScoreTxt(score) {
  const typeLabel = score.type === "tab" ? "吉他譜（六線譜）" : "鋼琴譜";
  const exportedAt = new Date().toLocaleString("zh-HK");
  return `\uFEFF${typeLabel}：${score.title}
説明：${score.memo || "無"}
匯出時間：${exportedAt}

${score.body}
`;
}

function updateTabPreview() {
  els.tabPreview.textContent = serializeTabGrid();
}

// ── 譜例編輯：和弦一鍵輸入 ────────────────────────────────
function buildChordRootOptions() {
  return NOTE_NAMES.sharp
    .map((note, index) => `<option value="${index}">${note}</option>`)
    .join("");
}

function renderChordInsertSelectors() {
  const rootOptions = buildChordRootOptions();
  if (els.tabChordRoot) {
    els.tabChordRoot.innerHTML = rootOptions;
    els.tabChordRoot.value = String(state.tabChordRoot);
  }
  if (els.pianoChordRoot) {
    els.pianoChordRoot.innerHTML = rootOptions;
    els.pianoChordRoot.value = String(state.pianoChordRoot);
  }
  if (els.tabChordQuality) {
    els.tabChordQuality.innerHTML = GUITAR_CHORD_INSERT_QUALITIES.map(
      (item) => `<option value="${item.id}">${item.label}</option>`
    ).join("");
    els.tabChordQuality.value = state.tabChordQuality;
  }
  if (els.pianoChordQuality) {
    els.pianoChordQuality.innerHTML = CHORD_QUALITY_LIBRARY.map(
      (item) => `<option value="${item.id}">${item.name}（${item.id}）</option>`
    ).join("");
    els.pianoChordQuality.value = state.pianoChordQuality;
  }
}

function renderTabChordQuick() {
  if (!els.tabChordQuick) return;
  els.tabChordQuick.innerHTML = GUITAR_QUICK_CHORDS.map(
    (item) =>
      `<button type="button" class="mini-button chord-quick-chip" data-quick-root="${item.root}" data-quick-quality="${item.quality}">${item.label}</button>`
  ).join("");
}

function renderTabChordPreview() {
  if (!els.tabChordPreview) return;
  const root = Number(els.tabChordRoot?.value ?? state.tabChordRoot);
  const quality = els.tabChordQuality?.value || state.tabChordQuality;
  const chord = chordById(quality);
  const shape = getGuitarChordShape(root, quality);
  const chordName = `${NOTE_NAMES.sharp[root]}${chord ? chord.name : ""}`;
  if (!shape) {
    els.tabChordPreview.innerHTML = `<span class="chord-preview-empty">${chordName} 暫無內建指法，請手動輸入</span>`;
    return;
  }
  // 指法由低到高 E A D G B e
  const stringsLowToHigh = ["E", "A", "D", "G", "B", "e"];
  const rows = stringsLowToHigh
    .map((label, index) => {
      const value = shape[index] === "x" ? "✕" : String(shape[index]);
      return `<div class="shape-row"><span class="shape-string">${label}</span><span class="shape-fret">${value}</span></div>`;
    })
    .join("");
  els.tabChordPreview.innerHTML = `
    <div class="shape-head">
      <strong>${chordName}</strong>
      <span class="shape-hint">由低到高 E A D G B e</span>
    </div>
    <div class="shape-box">${rows}</div>
  `;
}

function focusTabCell(row, col) {
  const target = els.tabEditor.querySelector(`input[data-row="${row}"][data-col="${col}"]`);
  if (target) {
    target.focus();
    target.select();
  }
}

function insertGuitarChord(root, quality) {
  const chord = chordById(quality);
  const shape = getGuitarChordShape(root, quality);
  const chordName = `${NOTE_NAMES.sharp[root]}${chord ? chord.name : ""}`;
  if (!shape) {
    showToast(`${chordName} 暫無內建指法，可手動輸入`, "info");
    return;
  }
  let col = Number.isFinite(state.tabCursor) ? state.tabCursor : 0;
  if (col < 0 || col >= state.tabBeats) col = state.tabBeats - 1;
  state.tabGrid = normalizeTabGrid(state.tabGrid, state.tabBeats);
  // shape 由低到高，grid 列序由高到低（e B G D A E），需反轉
  const rowsHighToLow = [...shape].reverse();
  rowsHighToLow.forEach((value, row) => {
    state.tabGrid[row][col] = value === "x" ? "" : String(value);
  });
  const nextCol = col + 1;
  if (nextCol >= state.tabBeats) {
    state.tabBeats += 1;
    state.tabGrid = normalizeTabGrid(state.tabGrid, state.tabBeats - 1).map((row) => [...row, ""]);
  }
  state.tabCursor = nextCol;
  renderTabEditor();
  updateTabPreview();
  focusTabCell(0, nextCol);
  persist();
  showToast(`已插入 ${chordName} 到第 ${col + 1} 欄`, "success");
}

function buildChordMidiAt(root, chord, baseOctave) {
  return chord.intervals.map((interval) => {
    let midi = 12 * (baseOctave + 1) + root + interval;
    if (baseOctave >= 4 && midi < 60) midi += 12;
    return midi;
  });
}

function appendNotesToScoreTextarea(textarea, notes) {
  const current = textarea.value.trim();
  textarea.value = current ? `${current} | ${notes}` : notes;
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
}

function insertPianoChord(hand) {
  const root = Number(els.pianoChordRoot.value);
  const chord = chordById(els.pianoChordQuality.value);
  if (!chord) return;
  const chordName = `${NOTE_NAMES.sharp[root]}${chord.name}`;
  const target = hand === "right" ? els.rightHandInput : els.leftHandInput;
  let notes;
  if (hand === "right") {
    const midi = buildChordMidiAt(root, chord, 4);
    notes = midi.map((value) => midiToNoteName(value)).join(" ");
  } else {
    const rootMidi = 12 * 4 + root; // 低音聲部，約 C3 區
    const fifthInterval = ["dim", "dim7", "halfDim"].includes(chord.id) ? 6 : chord.id === "aug" ? 8 : 7;
    const fifthMidi = rootMidi + fifthInterval;
    notes = `${midiToNoteName(rootMidi)} ${midiToNoteName(fifthMidi)}`;
  }
  appendNotesToScoreTextarea(target, notes);
  renderVoiceCheck();
  persist();
  showToast(`已把 ${chordName} 插入${hand === "right" ? "右手" : "左手"}聲部`, "success");
}

function renderSavedScores() {
  if (!state.scores.length) {
    els.savedScores.innerHTML = '<div class="empty-state">還沒有保存任何譜例。</div>';
    return;
  }
  els.savedScores.innerHTML = state.scores
    .slice()
    .reverse()
    .map(
      (score) => `
        <article class="saved-score">
          <div class="saved-score-head">
            <h4>${score.type === "tab" ? "吉他譜" : "鋼琴譜"} · ${escapeHtml(score.title)}</h4>
            <div class="saved-score-actions">
              <button class="ghost-button mini-button" data-export-score="${score.id}" type="button">匯出 TXT</button>
              <button class="ghost-button mini-button danger-button" data-delete-score="${score.id}" type="button">刪除</button>
            </div>
          </div>
          <p class="saved-score-memo">${escapeHtml(score.memo || "無說明")}</p>
          <pre class="saved-score-body">${escapeHtml(score.body)}</pre>
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
      darkMode: state.darkMode,
      playbackMode: state.playbackMode,
      audioTone: state.audioTone,
      swing: state.swing,
      humanize: state.humanize,
      theoryFocus: state.theoryFocus,
      selectedModeId: state.selectedModeId,
      progression: state.progression,
      voiceAdjustments: state.voiceAdjustments,
      voiceExample: state.voiceExample,
      tabBeats: state.tabBeats,
      tabGrid: state.tabGrid,
      quizGrade: state.quizGrade,
      abrsmGrade: state.abrsmGrade,
      tabChordRoot: state.tabChordRoot,
      tabChordQuality: state.tabChordQuality,
      pianoChordRoot: state.pianoChordRoot,
      pianoChordQuality: state.pianoChordQuality,
    })
  );
  localStorage.setItem(STORAGE_KEYS.customPhrases, JSON.stringify(state.customPhrases));
  localStorage.setItem(STORAGE_KEYS.scores, JSON.stringify(state.scores));
  if (state.logo) {
    safeSetStorage(STORAGE_KEYS.logo, state.logo);
  } else {
    localStorage.removeItem(STORAGE_KEYS.logo);
  }
}

function loadState() {
  try {
    const prefs = JSON.parse(localStorage.getItem(STORAGE_KEYS.prefs) || "{}");
    state.useFlats = !!prefs.useFlats;
    state.mode = prefs.mode || "major";
    state.root = Number.isFinite(prefs.root) ? prefs.root : 0;
    state.selectedChordId = prefs.selectedChordId || "maj7";
    state.category = prefs.category || "all";
    if (state.category === "favorites") state.category = "all";
    state.chordSearch = prefs.chordSearch || "";
    state.phraseStyle = prefs.phraseStyle || "all";
    state.styleMode = prefs.styleMode || "jazz";
    state.darkMode = prefs.darkMode !== false;
    state.playbackMode = prefs.playbackMode || "block";
    state.audioTone = prefs.audioTone || "piano";
    state.swing = !!prefs.swing;
    state.humanize = prefs.humanize !== false;
    state.theoryFocus = prefs.theoryFocus || "chord";
    state.selectedModeId = prefs.selectedModeId || "ionian";
    state.progression = Array.isArray(prefs.progression) ? prefs.progression : ["ii7", "V7", "Imaj7"];
    state.voiceAdjustments = Array.isArray(prefs.voiceAdjustments) ? prefs.voiceAdjustments : [0, 0, 0, 0];
    state.voiceExample = prefs.voiceExample || "good";
    state.tabBeats = Number.isFinite(prefs.tabBeats) ? prefs.tabBeats : 4;
    state.tabGrid = normalizeTabGrid(prefs.tabGrid, state.tabBeats);
    state.quizGrade = Number.isFinite(prefs.quizGrade) ? Math.min(8, Math.max(0, prefs.quizGrade)) : 0;
    state.abrsmGrade = Number.isFinite(prefs.abrsmGrade) ? Math.min(8, Math.max(1, prefs.abrsmGrade)) : 1;
    state.tabChordRoot = Number.isFinite(prefs.tabChordRoot) ? prefs.tabChordRoot : 0;
    state.tabChordQuality = prefs.tabChordQuality || "maj";
    state.pianoChordRoot = Number.isFinite(prefs.pianoChordRoot) ? prefs.pianoChordRoot : 0;
    state.pianoChordQuality = prefs.pianoChordQuality || "maj";
    state.customPhrases = JSON.parse(localStorage.getItem(STORAGE_KEYS.customPhrases) || "[]");
    state.scores = JSON.parse(localStorage.getItem(STORAGE_KEYS.scores) || "[]");
    state.logo = localStorage.getItem(STORAGE_KEYS.logo) || "";
    // 清理舊版收藏模塊殘留的本機資料
    localStorage.removeItem("music-dictionary-favorites-v2");
    localStorage.removeItem("music-dictionary-favorites-v1");
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
    toolbox: "魔法工具",
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

    const chordButton = event.target.closest("[data-chord]");
    if (chordButton) {
      state.selectedChordId = chordButton.dataset.chord;
      renderAll();
      persist();
      return;
    }

    const toolboxButton = event.target.closest("[data-toolbox-id]");
    if (toolboxButton) {
      renderToolbox(toolboxButton.dataset.toolboxId);
      return;
    }

    const toolboxOpen = event.target.closest("[data-toolbox-open]");
    if (toolboxOpen) {
      setView(toolboxOpen.dataset.toolboxOpen);
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

    const voiceExampleButton = event.target.closest("[data-voice-example]");
    if (voiceExampleButton) {
      updateVoiceExampleState(voiceExampleButton.dataset.voiceExample);
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
      answerQuiz(Number(quizOption.dataset.quizOption));
      return;
    }

    const quizGradeTab = event.target.closest("[data-quiz-grade]");
    if (quizGradeTab) {
      switchQuizGrade(Number(quizGradeTab.dataset.quizGrade));
      return;
    }

    const abrsmGradeTab = event.target.closest("[data-abrsm-grade]");
    if (abrsmGradeTab) {
      state.abrsmGrade = Number(abrsmGradeTab.dataset.abrsmGrade);
      renderAbrsmKnowledge();
      persist();
      return;
    }

    const quickChord = event.target.closest("[data-quick-root]");
    if (quickChord) {
      const root = Number(quickChord.dataset.quickRoot);
      const quality = quickChord.dataset.quickQuality;
      state.tabChordRoot = root;
      state.tabChordQuality = quality;
      if (els.tabChordRoot) els.tabChordRoot.value = String(root);
      if (els.tabChordQuality) els.tabChordQuality.value = quality;
      renderTabChordPreview();
      insertGuitarChord(root, quality);
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

  els.darkModeToggle.addEventListener("change", () => {
    state.darkMode = els.darkModeToggle.checked;
    document.body.classList.toggle("dark-mode", state.darkMode);
    persist();
  });

  els.playbackModeSelect.addEventListener("change", () => {
    state.playbackMode = els.playbackModeSelect.value;
    persist();
  });

  els.audioToneSelect.addEventListener("change", () => {
    state.audioTone = els.audioToneSelect.value;
    persist();
  });

  els.swingToggle.addEventListener("change", () => {
    state.swing = els.swingToggle.checked;
    persist();
  });

  els.humanizeToggle.addEventListener("change", () => {
    state.humanize = els.humanizeToggle.checked;
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

  els.logoUpload.addEventListener("change", async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const dataUrl = await readLogoFile(file);
      state.logo = dataUrl;
      renderLogo();
      persist();
      showToast("Logo 已更新", "success");
    } catch (error) {
      showToast(error.message || "Logo 上傳失敗", "info");
    } finally {
      els.logoUpload.value = "";
    }
  });

  els.removeLogoBtn.addEventListener("click", () => {
    state.logo = "";
    renderLogo();
    persist();
    showToast("Logo 已移除", "info");
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
  els.optimizeVoiceBtn.addEventListener("click", () => {
    const a = chordById(els.voiceChordA.value || "maj7");
    const b = chordById(els.voiceChordB.value || "7");
    optimizeVoiceLeadingAdjustments(a, b);
    renderVoiceVisual();
    showToast("声部轨迹已自动优化", "success");
    persist();
  });
  els.voiceAdjusters.addEventListener("change", (event) => {
    const select = event.target.closest("[data-voice-adjust]");
    if (!select) return;
    state.voiceAdjustments[Number(select.dataset.voiceAdjust)] = Number(select.value);
    renderVoiceVisual();
    persist();
  });
  els.playVoiceBtn.addEventListener("click", () => {
    const a = chordById(els.voiceChordA.value || "maj7");
    const b = chordById(els.voiceChordB.value || "7");
    const comparison = compareVoiceLeading(a, b);
    playNotes(comparison.source, { mode: "block", duration: 0.8, startAt: 0 });
    playNotes(comparison.target, { mode: "block", duration: 0.8, startAt: 0.9 });
  });

  els.nextQuizBtn.addEventListener("click", () => {
    advanceQuiz();
  });

  // 譜例編輯：和弦一鍵輸入
  els.tabChordRoot?.addEventListener("change", () => {
    state.tabChordRoot = Number(els.tabChordRoot.value);
    renderTabChordPreview();
    persist();
  });
  els.tabChordQuality?.addEventListener("change", () => {
    state.tabChordQuality = els.tabChordQuality.value;
    renderTabChordPreview();
    persist();
  });
  els.insertTabChordBtn?.addEventListener("click", () => {
    insertGuitarChord(Number(els.tabChordRoot.value), els.tabChordQuality.value);
  });
  els.pianoChordRoot?.addEventListener("change", () => {
    state.pianoChordRoot = Number(els.pianoChordRoot.value);
    persist();
  });
  els.pianoChordQuality?.addEventListener("change", () => {
    state.pianoChordQuality = els.pianoChordQuality.value;
    persist();
  });
  els.insertPianoRightBtn?.addEventListener("click", () => insertPianoChord("right"));
  els.insertPianoLeftBtn?.addEventListener("click", () => insertPianoChord("left"));

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

  els.removeTabBeatBtn.addEventListener("click", () => {
    if (state.tabBeats <= 1) {
      showToast("至少要保留 1 個小節格", "info");
      return;
    }
    state.tabBeats -= 1;
    state.tabGrid = normalizeTabGrid(state.tabGrid, state.tabBeats);
    renderTabEditor();
    updateTabPreview();
    persist();
  });

  els.clearTabBtn.addEventListener("click", () => {
    state.tabBeats = 4;
    state.tabGrid = createEmptyTabGrid(state.tabBeats);
    els.tabTitleInput.value = "";
    renderTabEditor();
    updateTabPreview();
    persist();
  });

  els.exportTabBtn.addEventListener("click", () => {
    const title = els.tabTitleInput.value.trim() || "未命名吉他譜";
    const score = buildTabScore(title, "");
    downloadTextFile(`${safeFileName(title)}.txt`, buildScoreTxt(score));
    showToast("吉他譜 TXT 已匯出", "success");
  });

  els.saveTabBtn.addEventListener("click", () => {
    const count = state.scores.filter((s) => s.type === "tab").length + 1;
    const title = els.tabTitleInput.value.trim() || `未命名吉他譜 ${count}`;
    const score = {
      id: `tab-${Date.now()}`,
      ...buildTabScore(title, ""),
    };
    state.scores.push(score);
    els.tabTitleInput.value = "";
    renderSavedScores();
    persist();
    showToast("吉他譜已保存到本機", "success");
  });

  els.clearPianoBtn.addEventListener("click", () => {
    els.pianoTitleInput.value = "";
    els.rightHandInput.value = "";
    els.leftHandInput.value = "";
    els.scoreMemoInput.value = "";
    renderVoiceCheck();
  });

  els.exportPianoBtn.addEventListener("click", () => {
    const title = els.pianoTitleInput.value.trim() || "未命名鋼琴譜";
    const memo = els.scoreMemoInput.value.trim();
    const score = buildPianoScore(title, memo);
    downloadTextFile(`${safeFileName(title)}.txt`, buildScoreTxt(score));
    showToast("鋼琴譜 TXT 已匯出", "success");
  });

  els.savePianoBtn.addEventListener("click", () => {
    const count = state.scores.filter((s) => s.type === "piano").length + 1;
    const title = els.pianoTitleInput.value.trim() || `未命名鋼琴譜 ${count}`;
    const memo = els.scoreMemoInput.value.trim();
    const score = {
      id: `piano-${Date.now()}`,
      ...buildPianoScore(title, memo),
    };
    state.scores.push(score);
    els.pianoTitleInput.value = "";
    renderSavedScores();
    persist();
    showToast("鋼琴譜已保存到本機", "success");
  });

  els.savedScores.addEventListener("click", (event) => {
    const exportButton = event.target.closest("[data-export-score]");
    if (exportButton) {
      const score = state.scores.find((item) => item.id === exportButton.dataset.exportScore);
      if (score) {
        downloadTextFile(`${safeFileName(score.title)}.txt`, buildScoreTxt(score));
        showToast("譜例 TXT 已匯出", "success");
      }
      return;
    }
    const deleteButton = event.target.closest("[data-delete-score]");
    if (deleteButton) {
      const score = state.scores.find((item) => item.id === deleteButton.dataset.deleteScore);
      state.scores = state.scores.filter((item) => item.id !== deleteButton.dataset.deleteScore);
      renderSavedScores();
      persist();
      if (score) showToast(`已刪除「${score.title}」`, "info");
    }
  });

  els.tabEditor.addEventListener("input", (event) => {
    const input = event.target.closest("input[data-row][data-col]");
    if (!input) return;
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    // 只保留品位數字（0-9），其餘輸入忽略
    input.value = input.value.replace(/[^0-9]/g, "").slice(0, 2);
    if (!state.tabGrid[row]) state.tabGrid[row] = [];
    state.tabGrid[row][col] = input.value.trim();
    updateTabPreview();
    persist();
    // 填滿兩位數後自動跳到下一格
    if (input.value.length === 2 && col < state.tabBeats - 1) {
      const next = els.tabEditor.querySelector(`input[data-row="${row}"][data-col="${col + 1}"]`);
      if (next) {
        next.focus();
        next.select();
      }
    }
  });

  els.tabEditor.addEventListener("keydown", (event) => {
    const input = event.target.closest("input[data-row][data-col]");
    if (!input) return;
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    let nextRow = row;
    let nextCol = col;
    if (event.key === "ArrowRight" || event.key === "Enter" || event.key === "Tab") {
      nextCol = Math.min(state.tabBeats - 1, col + 1);
    } else if (event.key === "ArrowLeft") {
      nextCol = Math.max(0, col - 1);
    } else if (event.key === "ArrowDown") {
      nextRow = Math.min(5, row + 1);
    } else if (event.key === "ArrowUp") {
      nextRow = Math.max(0, row - 1);
    } else {
      return;
    }
    if (event.key !== "Tab") event.preventDefault();
    const next = els.tabEditor.querySelector(`input[data-row="${nextRow}"][data-col="${nextCol}"]`);
    if (next) {
      next.focus();
      next.select();
    }
  });

  els.tabEditor.addEventListener("focusin", (event) => {
    const input = event.target.closest("input[data-row][data-col]");
    if (input) state.tabCursor = Number(input.dataset.col);
  });

  els.rightHandInput.addEventListener("input", renderVoiceCheck);
  els.leftHandInput.addEventListener("input", renderVoiceCheck);
}

function renderAll() {
  els.notationToggle.checked = state.useFlats;
  els.darkModeToggle.checked = state.darkMode;
  document.body.classList.toggle("dark-mode", state.darkMode);
  els.playbackModeSelect.value = state.playbackMode;
  els.audioToneSelect.value = state.audioTone;
  els.swingToggle.checked = state.swing;
  els.humanizeToggle.checked = state.humanize;
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
  renderChordInsertSelectors();
  renderTabChordQuick();
  renderTabChordPreview();
  renderVoiceCheck();
  renderSavedScores();
  renderToolbox();
  renderQuiz();
  state.phraseStyle = state.phraseStyle || "all";
  document.querySelectorAll("[data-phrase-style]").forEach((button) => {
    button.classList.toggle("active", button.dataset.phraseStyle === state.phraseStyle);
  });
}

function initialize() {
  loadState();
  bindEvents();
  renderLogo();
  renderAll();
  setView("dictionary");
}

initialize();

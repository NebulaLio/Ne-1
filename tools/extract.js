const fs = require("fs");
const src = fs.readFileSync(process.argv[2] || "app.js", "utf8");

function sliceBlock(startMarker, endMarker) {
  const s = src.indexOf(startMarker);
  if (s < 0) return "";
  const e = src.indexOf(endMarker, s + startMarker.length);
  return src.slice(s, e < 0 ? src.length : e);
}

const chordBlock = sliceBlock("const CHORD_QUALITY_LIBRARY = [", "const SCALE_LIBRARY");
const chordRe = /\{\s*id: "([^"]+)",\s*name: "([^"]*)",\s*symbols: \[([^\]]*)\],\s*intervals: \[([^\]]*)\],\s*category: "([^"]+)",\s*color: "([^"]+)",\s*theory:\s*"([^"]*)",\s*function: "([^"]*)",\s*guitar: "([^"]*)"/g;
const chords = [];
let m;
while ((m = chordRe.exec(chordBlock))) {
  chords.push({ id: m[1], name: m[2], intervals: m[4].split(",").map(Number), category: m[5], color: m[6], theory: m[7], function: m[8], guitar: m[9] });
}

const modeBlock = sliceBlock("const MODE_DETAILS = [", "const DEGREE_LABELS");
const modeRe = /\{\s*id: "([^"]+)",\s*category: "([^"]+)",\s*label: "([^"]+)",\s*intervals: \[([^\]]*)\],\s*feature: "([^"]*)",\s*progression: "([^"]*)",\s*improv: "([^"]*)"/g;
const modes = [];
while ((m = modeRe.exec(modeBlock))) {
  modes.push({ id: m[1], category: m[2], label: m[3], intervals: m[4].split(",").map(Number), feature: m[5], progression: m[6], improv: m[7] });
}

const ivBlock = sliceBlock("const INTERVAL_REFERENCE = [", "const ABRSM_KNOWLEDGE");
const ivRe = /\{\s*semitones: (\d+),\s*name: "([^"]*)",\s*quality: "([^"]*)",\s*character: "([^"]*)",\s*example: "([^"]*)",?\s*\}/g;
const ivs = [];
while ((m = ivRe.exec(ivBlock))) ivs.push({ semitones: Number(m[1]), name: m[2], quality: m[3], character: m[4], example: m[5] });

const toolBlock = sliceBlock("const TOOLBOX_ITEMS = [", "const STORAGE_KEYS");
const toolRe = /\{\s*id: "([^"]+)",\s*title: "([^"]+)",\s*priority: "([^"]*)",\s*description: "([^"]*)",\s*source: "([^"]*)"/g;
const tools = [];
while ((m = toolRe.exec(toolBlock))) tools.push({ id: m[1], title: m[2], priority: m[3], description: m[4], source: m[5] });

fs.writeFileSync("tools/data.json", JSON.stringify({ chords, modes, ivs, tools }, null, 1), "utf8");
console.log("chords", chords.length, "modes", modes.length, "ivs", ivs.length, "tools", tools.length);
for (const c of chords) console.log(`${c.id} | ${c.name} | ${c.intervals.join(",")} | ${c.category} | ${c.function}`);
console.log("---MODES---");
for (const x of modes) console.log(`${x.id} | ${x.label} | ${x.category}`);
console.log("---IVS---");
for (const x of ivs) console.log(`${x.semitones} | ${x.name} | ${x.quality}`);
console.log("---TOOLS---");
for (const x of tools) console.log(`${x.id} | ${x.title} | ${x.priority}`);

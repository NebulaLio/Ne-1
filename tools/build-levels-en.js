const fs = require("fs");
const path = require("path");

const tools = __dirname;
const source = fs.readFileSync(path.join(tools, "build-levels.js"), "utf8");
let code = source
  .replaceAll("content/core.json", "content/core-en.json")
  .replaceAll("content/chords.json", "content/chords-en.json")
  .replaceAll("content/modes.json", "content/modes-en.json")
  .replaceAll("window.NBL =", "window.NBL_EN =")
  .replaceAll('"levels.js"', '"levels-en.js"')
  .replaceAll("wrote levels.js", "wrote levels-en.js")
  .replaceAll("Nebula · 三档解说文本系统", "Nebula · English lesson content");

const tmp = path.join(tools, ".build-levels-en.generated.js");
fs.writeFileSync(tmp, code, "utf8");
try {
  require(tmp);
} finally {
  fs.unlinkSync(tmp);
}

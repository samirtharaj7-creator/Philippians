import { readFileSync, writeFileSync } from "node:fs";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Usage: node scripts/import-background-markdown.mjs /path/to/background.md");

const lines = readFileSync(sourcePath, "utf8").replace(/\r\n?/g, "\n").split("\n");
const title = lines.find((line) => line.startsWith("# "))?.slice(2).trim() ?? "Historical Background to Philippians";
const sections = [];
let currentSection;
let paragraph = [];

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ensureSection() {
  if (!currentSection) {
    currentSection = { id: "overview", title: "Overview", blocks: [] };
    sections.push(currentSection);
  }
  return currentSection;
}

function flushParagraph() {
  if (!paragraph.length) return;
  ensureSection().blocks.push({ type: "paragraph", text: paragraph.join(" ").replace(/\s+/g, " ").trim() });
  paragraph = [];
}

for (let index = 0; index < lines.length; index += 1) {
  const line = lines[index].trim();
  if (!line || line === "---") {
    flushParagraph();
    continue;
  }
  if (line.startsWith("# ")) continue;
  if (line.startsWith("## ")) {
    flushParagraph();
    const sectionTitle = line.slice(3).trim();
    currentSection = { id: slugify(sectionTitle), title: sectionTitle, blocks: [] };
    sections.push(currentSection);
    continue;
  }
  if (line.startsWith("### ")) {
    flushParagraph();
    ensureSection().blocks.push({ type: "heading", title: line.slice(4).trim() });
    continue;
  }
  if (line.startsWith(">")) {
    flushParagraph();
    const quoteLines = [];
    while (index < lines.length && lines[index].trim().startsWith(">")) {
      quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
      index += 1;
    }
    index -= 1;
    const citationLine = quoteLines.at(-1)?.startsWith("—") ? quoteLines.pop() : "";
    ensureSection().blocks.push({
      type: "quote",
      text: quoteLines.join(" ").replace(/\s+/g, " ").trim(),
      citation: citationLine.replace(/^—\s*/, "")
    });
    continue;
  }
  paragraph.push(line);
}
flushParagraph();

const nonemptySections = sections.filter((section) => section.blocks.length > 0);
const content = {
  title,
  subtitle: "Historical setting, authorship, purpose, structure, and major theological themes.",
  sections: nonemptySections
};
writeFileSync("content/background.json", `${JSON.stringify(content, null, 2)}\n`);
console.log(`Imported ${nonemptySections.length} introduction sections from ${sourcePath}.`);

import { readFileSync, writeFileSync } from "node:fs";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Usage: node scripts/import-chapter-notes.mjs /path/to/notes.json");

const incoming = JSON.parse(readFileSync(sourcePath, "utf8"));
if (!Array.isArray(incoming) || incoming.length === 0) throw new Error("Expected a nonempty array of verse notes.");

const firstMatch = incoming[0]?.verse?.match(/^Philippians (\d+):\d+$/);
if (!firstMatch) throw new Error("The first record must identify a Philippians verse.");
const chapterNumber = Number(firstMatch[1]);
const chapterPath = `content/philippians/chapter-${String(chapterNumber).padStart(2, "0")}.json`;
const chapter = JSON.parse(readFileSync(chapterPath, "utf8"));

function expandReference(reference) {
  const match = reference.match(/^((?:[1-3] )?[A-Za-z]+(?: [A-Za-z]+)*) (\d+):(\d+(?:[-–—]\d+)?),\s*(\d+(?:[-–—]\d+)?)$/u);
  if (!match) return [reference];
  const [, book, chapter, first, second] = match;
  return [`${book} ${chapter}:${first}`, `${book} ${chapter}:${second}`];
}

const byReference = new Map(chapter.verses.map((verse) => [verse.verse, verse]));
for (const note of incoming) {
  const verse = byReference.get(note.verse);
  if (!verse) throw new Error(`No intake slot exists for ${note.verse}.`);
  verse.crossReferences = (note.crossReferences ?? []).flatMap(expandReference);
  verse.wordNotes = (note.wordNotes ?? []).map((wordNote) => ({
    term: `${wordNote.original} (${wordNote.transliteration}) — ${wordNote.label}`,
    explanation: wordNote.explanation,
    scriptureReferences: (wordNote.references ?? []).flatMap(expandReference)
  }));
  verse.commentary.detailedExplanation = note.commentary?.detailedExplanation ?? "";
  verse.reviewStatus = verse.commentary.detailedExplanation ? "verified-seed" : "placeholder";
}

writeFileSync(chapterPath, `${JSON.stringify(chapter, null, 2)}\n`);
console.log(`Imported notes for ${incoming.length} verses into Philippians ${chapterNumber}.`);

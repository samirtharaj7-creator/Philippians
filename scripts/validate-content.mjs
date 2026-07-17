import { loadPhilippians } from "./philippians-content-utils.mjs";

const chapters = loadPhilippians();
const errors = [];
let verseTotal = 0;

for (const { chapterNumber, expectedVerses, path, content } of chapters) {
  if (content.chapterNumber !== chapterNumber) errors.push(`${path}: chapterNumber must be ${chapterNumber}`);
  if (!Array.isArray(content.verses) || content.verses.length !== expectedVerses) {
    errors.push(`${path}: expected ${expectedVerses} verses`);
    continue;
  }
  verseTotal += content.verses.length;
  content.verses.forEach((verse, index) => {
    const reference = `Philippians ${chapterNumber}:${index + 1}`;
    if (verse.verse !== reference) errors.push(`${path}: expected ${reference}, found ${verse.verse}`);
    if (typeof verse.bibleText !== "string" || !verse.bibleText.trim()) errors.push(`${reference}: missing KJV text`);
    if (!verse.commentary || typeof verse.commentary.detailedExplanation !== "string") {
      errors.push(`${reference}: commentary record is malformed`);
    }
  });
}

if (verseTotal !== 104) errors.push(`Expected 104 total verses, found ${verseTotal}`);
if (errors.length) {
  console.error(`Content validation failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log("Content validation passed: 4 chapters and 104 KJV verse records.");

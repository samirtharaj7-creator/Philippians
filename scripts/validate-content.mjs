import { loadPhilippians } from "./philippians-content-utils.mjs";

const chapters = loadPhilippians();
const errors = [];
const allowedReviewStatuses = new Set(["verified-seed", "needs-source-review", "placeholder"]);
const userOwnedCommentaryChapter = 4;
const excludedCommentaryReferences = [];
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
    if (!allowedReviewStatuses.has(verse.reviewStatus)) {
      errors.push(`${reference}: invalid reviewStatus ${verse.reviewStatus}`);
    }
    if (!verse.commentary || typeof verse.commentary.detailedExplanation !== "string") {
      errors.push(`${reference}: commentary record is malformed`);
      return;
    }

    if (chapterNumber === userOwnedCommentaryChapter) {
      excludedCommentaryReferences.push(reference);
      return;
    }

    if (!verse.commentary.detailedExplanation.trim()) {
      errors.push(`${reference}: missing detailed commentary; Philippians 4 is the sole user-owned exclusion`);
    } else if (verse.reviewStatus === "placeholder") {
      errors.push(`${reference}: populated commentary must not retain reviewStatus "placeholder"`);
    }
  });
}

if (verseTotal !== 104) errors.push(`Expected 104 total verses, found ${verseTotal}`);
if (errors.length) {
  console.error(`Content validation failed:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(
  `Content validation passed: 4 chapters and 104 KJV verse records; `
  + `${excludedCommentaryReferences.length} user-owned Philippians 4 commentary record(s) `
  + "excluded from editorial and theological certification.",
);

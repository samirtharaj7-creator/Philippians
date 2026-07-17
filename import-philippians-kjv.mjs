import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Usage: node import-philippians-kjv.mjs /path/to/kjv.json");

const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const verseCounts = [30, 30, 21, 23];
const emptyCommentary = {
  detailedExplanation: "", exegesis: "", historicalBackground: "", technicalNotes: "",
  theologicalInsight: "", structuralNotes: "", otherCommentaryInsights: "", application: "", reviewFlags: []
};
const emptyAudit = {
  exegesis: [], historicalBackground: [], technicalNotes: [], theologicalInsight: [],
  structuralNotes: [], otherCommentaryInsights: [], application: []
};

mkdirSync("content/philippians", { recursive: true });
verseCounts.forEach((verseCount, chapterIndex) => {
  const chapter = chapterIndex + 1;
  const verses = Array.from({ length: verseCount }, (_, verseIndex) => {
    const verse = verseIndex + 1;
    const reference = `Philippians ${chapter}:${verse}`;
    const bibleText = source[reference];
    if (typeof bibleText !== "string") throw new Error(`Missing KJV text for ${reference}`);
    return {
      verse: reference,
      bibleText: bibleText.replace(/^#\s*/, "").replace(/\[(.*?)\]/g, "$1").replace(/\s+/g, " ").trim(),
      explanation: "", historicalBackground: "", literaryContext: "", theologicalInsight: "",
      structuralNotes: "", relatedConnection: "", crossReferences: [], application: "", sources: [],
      commentary: { ...emptyCommentary }, wordNotes: [], sourceAudit: { ...emptyAudit }, reviewStatus: "placeholder"
    };
  });
  const content = {
    chapterNumber: chapter, title: `Philippians ${chapter}`, summary: "", historicalContext: "", literaryContext: "",
    themes: [], outline: [], verses, symbols: [], charts: [], images: [], crossReferences: [], relatedConnections: [],
    teachingNotes: { openingQuestion: "", mainPoint: "", keyVerses: [], importantTerms: [], discussionQuestions: [], commonMisunderstandings: [], emphasis: "", closingAppeal: "" },
    evangelisticNotes: { mainDoctrinalTheme: "", keyBibleTexts: [], flow: [], simpleIllustrations: [], appealQuestion: "", cautions: [], sources: [] },
    reflectionQuestions: [], sources: []
  };
  writeFileSync(`content/philippians/chapter-${String(chapter).padStart(2, "0")}.json`, `${JSON.stringify(content, null, 2)}\n`);
});

console.log("Created Philippians 1–4 with 104 KJV verses and blank study-note fields.");

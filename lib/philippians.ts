import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ChapterContentSchema, type ChapterContent } from "@/lib/schemas";
import { padChapter } from "@/lib/utils";

export const PHILIPPIANS = {
  slug: "philippians",
  name: "Philippians",
  chapterCount: 4,
  verseCounts: [30, 30, 21, 23]
} as const;

export type ChapterAdjacency = { previous: number | null; next: number | null };

export function getPhilippiansStaticParams() {
  return Array.from({ length: PHILIPPIANS.chapterCount }, (_, index) => ({ chapter: String(index + 1) }));
}

export function parsePhilippiansChapterNumber(chapter: number | string): number | null {
  const rawChapter = String(chapter);
  if (!/^[1-9]\d*$/.test(rawChapter)) return null;
  const chapterNumber = Number(rawChapter);
  if (!Number.isSafeInteger(chapterNumber) || chapterNumber > PHILIPPIANS.chapterCount) return null;
  return chapterNumber;
}

export function getPhilippiansChapter(chapter: number | string): ChapterContent | null {
  const chapterNumber = parsePhilippiansChapterNumber(chapter);
  if (chapterNumber === null) return null;
  const path = join(process.cwd(), "content", PHILIPPIANS.slug, `chapter-${padChapter(chapterNumber)}.json`);
  if (!existsSync(path)) return null;
  const parsed = ChapterContentSchema.parse(JSON.parse(readFileSync(path, "utf8")));
  const expectedVerseCount = PHILIPPIANS.verseCounts[chapterNumber - 1];
  if (parsed.chapterNumber !== chapterNumber || parsed.verses.length !== expectedVerseCount) {
    throw new Error(`Philippians ${chapterNumber} content structure is invalid.`);
  }
  parsed.verses.forEach((verse, index) => {
    if (verse.verse !== `Philippians ${chapterNumber}:${index + 1}`) {
      throw new Error(`Philippians ${chapterNumber} contains an invalid verse slot.`);
    }
  });
  return parsed;
}

export function getPhilippiansChapterAdjacency(chapter: number | string): ChapterAdjacency | null {
  const chapterNumber = parsePhilippiansChapterNumber(chapter);
  if (chapterNumber === null) return null;
  return {
    previous: chapterNumber > 1 ? chapterNumber - 1 : null,
    next: chapterNumber < PHILIPPIANS.chapterCount ? chapterNumber + 1 : null
  };
}

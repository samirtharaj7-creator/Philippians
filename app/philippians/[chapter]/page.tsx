import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookChapterStrip } from "@/components/book-chapter-strip";
import { ChapterStudy, type PublicChapterContent } from "@/components/verse-accordion";
import { PHILIPPIANS, getPhilippiansChapter, getPhilippiansChapterAdjacency, getPhilippiansStaticParams } from "@/lib/philippians";
import { getReferencePreviewsForChapter } from "@/lib/reference-previews";
import type { ChapterContent } from "@/lib/schemas";

export function generateStaticParams() {
  return getPhilippiansStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ chapter: string }> }): Promise<Metadata> {
  const { chapter } = await params;
  const content = getPhilippiansChapter(chapter);
  if (!content) notFound();
  return { title: `Philippians ${content.chapterNumber}`, description: `Philippians ${content.chapterNumber} in the King James Version, with space for verse-by-verse commentary.` };
}

export default async function PhilippiansChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter } = await params;
  const content = getPhilippiansChapter(chapter);
  const adjacency = getPhilippiansChapterAdjacency(chapter);
  if (!content || !adjacency) notFound();
  const publicContent = withoutAuditSources(content);
  const referencePreviews = getReferencePreviewsForChapter(content);
  return (
    <main className="reader-page">
      <BookChapterStrip
        activeChapter={content.chapterNumber}
        bookSlug={PHILIPPIANS.slug}
        bookName={PHILIPPIANS.name}
        chapterCount={PHILIPPIANS.chapterCount}
        verseCounts={PHILIPPIANS.verseCounts}
      />
      <ChapterStudy
        chapter={publicContent}
        bookName={PHILIPPIANS.name}
        referencePreviews={referencePreviews}
      />
      <nav className="reader-chapter-nav no-print" aria-label="Philippians adjacent chapters">
        {adjacency.previous ? <Link href={`/philippians/${adjacency.previous}`}><ChevronLeft className="h-4 w-4" />Philippians {adjacency.previous}</Link> : <span />}
        {adjacency.next ? <Link href={`/philippians/${adjacency.next}`}>Philippians {adjacency.next}<ChevronRight className="h-4 w-4" /></Link> : null}
      </nav>
    </main>
  );
}

function withoutAuditSources(chapter: ChapterContent): PublicChapterContent {
  return JSON.parse(JSON.stringify(chapter, (key, value) => key === "sources" || key === "sourceAudit" ? undefined : value)) as PublicChapterContent;
}

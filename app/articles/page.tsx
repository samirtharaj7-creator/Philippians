import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";

export const metadata: Metadata = {
  title: "Philippians Articles",
  description: "A guided study path through the book of Philippians."
};

export default function ArticlesPage() {
  return (
    <main className="articles-page">
      <section className="articles-hero" aria-labelledby="articles-title">
        <div className="articles-hero-copy">
          <p className="articles-kicker">Philippians Study Library</p>
          <h1 id="articles-title">Articles</h1>
          <p>
            Trace gospel partnership, Christ’s humility, righteousness by faith,
            resurrection hope, Christian joy, and steadfast peace through the letter.
          </p>
        </div>
      </section>

      <section className="articles-shell" aria-label="Philippians study path">
        <div className="articles-grid">
          <Link href="/philippians/1" className="article-list-card">
            <span className="article-list-icon" aria-hidden="true">
              <BookOpenText className="h-5 w-5" />
            </span>
            <span className="article-list-eyebrow">Chapter Commentary</span>
            <strong>Begin with Philippians 1</strong>
            <span>
              Read the KJV text alongside verse-by-verse exposition, cross references,
              and word notes, then continue through the letter chapter by chapter.
            </span>
            <em>
              Open Philippians 1
              <ArrowRight className="h-4 w-4" />
            </em>
          </Link>
        </div>
      </section>
    </main>
  );
}

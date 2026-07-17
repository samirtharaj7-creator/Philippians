import Link from "next/link";
import { ArrowRight, BookOpen, BookOpenCheck } from "lucide-react";

const studyActions = [
  {
    title: "Introduction",
    href: "/background/",
    description: "Read Philippians’ author, date, audience, structure, and central message.",
    icon: BookOpenCheck
  },
  {
    title: "Philippians",
    href: "/philippians/1/",
    description: "Move through all four chapters with the complete King James text.",
    icon: BookOpen
  },
  {
    title: "Verse Commentary",
    href: "/philippians/1/#v1",
    description: "Read the text verse by verse; commentary notes are ready for you to add.",
    icon: BookOpen
  }
] as const;

export function HeroSection() {
  return (
    <section className="home-showcase">
      <div className="home-showcase-shell">
        <section className="home-showcase-hero" aria-labelledby="home-title">
          <div className="home-showcase-copy">
            <p className="home-title-prefix">The Letter to the</p>
            <h1 id="home-title">Philippians</h1>
            <p className="home-showcase-description">
              Enter Philippians, a letter of joy, Christlike humility, faithful perseverance, and contentment in Christ.
            </p>
            <div className="home-showcase-actions">
              <Link href="/philippians/1" className="home-showcase-primary">
                Read chapter 1 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/background" className="home-showcase-secondary">Explore the introduction</Link>
            </div>
          </div>
        </section>
        <section className="home-action-grid" aria-label="Primary study paths">
          {studyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href} className="home-action-card">
                <span className="home-action-icon">
                  <Icon className="h-5 w-5" />
                </span>
                <strong>{action.title}</strong>
                <span>{action.description}</span>
                <em>
                  Open
                  <ArrowRight className="h-4 w-4" />
                </em>
              </Link>
            );
          })}
        </section>
        <section className="home-chapter-study" aria-labelledby="home-chapter-title">
          <div className="home-section-split">
            <div><p className="home-section-kicker">4 chapters</p><h2 id="home-chapter-title">Choose a chapter to begin.</h2></div>
            <p id="content-status">The complete KJV text is in place. Study notes can be added when supplied.</p>
          </div>
          <div className="home-chapter-group-grid">
            <article className="home-chapter-group">
              <BookOpen className="home-chapter-group-icon h-6 w-6" />
              <p>New Testament · 4 Chapters</p><h3>Philippians</h3>
              <div className="home-chapter-mini-grid">
                {Array.from({ length: 4 }, (_, index) => index + 1).map((chapter) => (
                  <Link key={chapter} href={`/philippians/${chapter}`} aria-label={`Philippians chapter ${chapter}`}>
                    <span>Philippians</span><strong>Chapter {chapter}</strong>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  );
}

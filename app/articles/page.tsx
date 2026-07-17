import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Philippians Articles",
  description: "A future library for Philippians study articles."
};

export default function ArticlesPage() {
  return (
    <main className="articles-page">
      <section className="articles-hero" aria-labelledby="articles-title">
        <div className="articles-hero-copy">
          <h1 id="articles-title">Articles</h1>
          <p>Philippians study articles will appear here when they are provided.</p>
        </div>
      </section>
    </main>
  );
}

import { useState } from "react";
import { Link } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { articles, formatDate, readingTime } from "../content/articles";
export const meta: MetaFunction = () => [
  { title: "Engineering Journal | Northstar" },
  {
    name: "description",
    content:
      "Notes on software, operations, design, and working well together from Northstar Equipment.",
  },
];
export default function Index() {
  const [category, setCategory] = useState("All topics");
  const featured = articles[0]!;
  const visible = articles.filter(
    (a) => category === "All topics" || a.category === category,
  );
  return (
    <main className="site-main" id="main">
      <header className="journal-hero">
        <span className="eyebrow">The Northstar engineering journal</span>
        <h1>
          Notes from
          <br />
          the workshop.
        </h1>
        <p className="muted">
          Thoughtful software. Clearer operations. Better ways to work together.
        </p>
      </header>
      <section className="featured" aria-labelledby="featured-title">
        <div>
          <span className="badge">Featured story · {featured.category}</span>
          <h2 id="featured-title">
            <Link to={`/articles/${featured.slug}`}>{featured.title}</Link>
          </h2>
          <p className="muted">{featured.excerpt}</p>
          <p className="article-meta">
            {formatDate(featured.publishedAt)} · {readingTime(featured)} min
            read
          </p>
          <Link to={`/articles/${featured.slug}`}>
            Read the story <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <aside className="featured-note">
          <span className="eyebrow">From our desks to yours</span>
          <strong>
            Small ideas.
            <br />
            Lasting value.
          </strong>
          <p className="muted">
            Practical notes for people who care about the details.
          </p>
        </aside>
      </section>
      <section id="articles" aria-labelledby="articles-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Keep exploring</span>
            <h2 id="articles-title" style={{ marginTop: 8 }}>
              The latest from the journal
            </h2>
          </div>
          <label>
            Browse by topic
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["All topics", ...new Set(articles.map((a) => a.category))].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </label>
        </div>
        <p className="article-meta" role="status">
          {visible.length} {visible.length === 1 ? "article" : "articles"}
          {category !== "All topics" ? ` in ${category}` : " to explore"}
        </p>
        <div className="article-grid">
          {visible.map((a) => (
            <article key={a.slug} className="card article-card">
              <span className="eyebrow">{a.category}</span>
              <h2>
                <Link to={`/articles/${a.slug}`}>{a.title}</Link>
              </h2>
              <p>{a.excerpt}</p>
              <div className="article-meta">
                {formatDate(a.publishedAt)} · {readingTime(a)} min read
              </div>
              <Link to={`/articles/${a.slug}`}>
                Read article <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

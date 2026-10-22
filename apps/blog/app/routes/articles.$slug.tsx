import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { articles, formatDate, readingTime } from "../content/articles";
export function loader({ params }: LoaderFunctionArgs) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) throw new Response("Article not found", { status: 404 });
  const others = articles.filter((a) => a.slug !== article.slug);
  const related = [
    ...others.filter((a) => a.category === article.category),
    ...others.filter((a) => a.category !== article.category),
  ].slice(0, 2);
  return json({ article, related });
}
export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data
      ? `${data.article.title} | Northstar Journal`
      : "Article not found | Northstar Journal",
  },
  {
    name: "description",
    content:
      data?.article.excerpt ??
      "Find your next read in the Northstar engineering journal.",
  },
];
export default function ArticlePage() {
  const { article, related } = useLoaderData<typeof loader>();
  return (
    <main className="site-main" id="main">
      <article className="reading">
        <Link to="/#articles">← Back to the journal</Link>
        <header style={{ marginTop: 32 }}>
          <span className="eyebrow">{article.category}</span>
          <h1>{article.title}</h1>
          <p className="intro">{article.excerpt}</p>
          <p className="article-meta">
            Editorial team ·{" "}
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>{" "}
            · {readingTime(article)} min read
          </p>
        </header>
        <div className="reading-body">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
        <aside className="related">
          <span className="eyebrow">A little more to explore</span>
          <h2 style={{ marginTop: 10 }}>Read next</h2>
          {related.map((a) => (
            <Link key={a.slug} to={`/articles/${a.slug}`}>
              {a.title} →
            </Link>
          ))}
        </aside>
      </article>
    </main>
  );
}
export function ErrorBoundary() {
  const error = useRouteError();
  const missing = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main id="main" className="site-main">
      <div className="reading">
        <span className="eyebrow">
          {missing ? "404 · Missing page" : "Something went wrong"}
        </span>
        <h1>
          {missing ? "That story isn’t here." : "We couldn’t open this story."}
        </h1>
        <p className="muted">
          {missing
            ? "Explore the journal to find another article."
            : "Try again, or return to the journal."}
        </p>
        <Link className="button" to="/">
          Return to the journal
        </Link>
      </div>
    </main>
  );
}

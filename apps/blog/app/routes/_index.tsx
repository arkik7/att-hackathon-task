import { Link } from "@repo/ui/link";
export default function Index() {
  return (
    <main>
      <header>
        <span className="eyebrow">Northstar / Engineering Journal</span>
        <h1>Notes from the workshop.</h1>
        <p className="muted">
          Ideas about software, teamwork, and making things last.
        </p>
      </header>
      <article className="card">
        <span className="eyebrow">18 September 2026 · Editorial</span>
        <h2>Small tools, clear boundaries</h2>
        <p>
          The journal publishing team uses the same frontend components as
          several internal products. Our publishing workflow remains
          independent: articles are reviewed as files and shipped with the site.
        </p>
        <p>
          A familiar component name is a useful search term. Understanding who
          uses it still takes a little reading.
        </p>
      </article>
      <article className="card">
        <h2>The quiet release</h2>
        <p>
          We refreshed the typography, made links easier to read, and kept the
          editorial archive simple. Our next experiment is better article
          navigation.
        </p>
        <Link href="/edge">Editorial lab</Link>
      </article>
      <footer>Engineering Journal · Northstar Equipment</footer>
    </main>
  );
}

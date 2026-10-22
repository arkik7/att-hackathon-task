import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./styles.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="site-nav">
            <Link className="brand" to="/">
              <span className="brand-mark">N</span>
              <span>
                Northstar<small>Engineering journal</small>
              </span>
            </Link>
            <nav aria-label="Journal">
              <Link to="/">Journal</Link>
              <Link to="/#articles">All articles</Link>
              <Link to="/edge">Editorial lab</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-main footer">
          <span>Northstar Equipment / Engineering Journal</span>
          <span>Independent ideas. Shared curiosity.</span>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

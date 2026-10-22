import { Link } from "@remix-run/react";
export default function EditorialLab() {
  return (
    <main className="site-main" id="main">
      <div className="reading">
        <span className="eyebrow">Behind the journal</span>
        <h1>Editorial lab</h1>
        <p className="intro">
          A small space for the publishing team’s typography and layout
          experiments.
        </p>
        <div className="reading-body">
          <h2>A little room to read</h2>
          <p>
            Clear headings, comfortable line lengths, and purposeful spacing
            help a story find its rhythm. This journal keeps those details
            simple so the ideas can do the work.
          </p>
          <h2>Familiar, with a purpose</h2>
          <p>
            Our blue and white palette connects the journal to the Northstar
            family. Publishing remains independent: articles live with this
            application and can be read without the commerce or People services.
          </p>
          <Link to="/">Explore the journal →</Link>
        </div>
      </div>
    </main>
  );
}

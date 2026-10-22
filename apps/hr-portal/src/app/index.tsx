import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";
const hr = import.meta.env.VITE_HR_URL ?? "http://127.0.0.1:5006";
type Employee = {
  employee_id: string;
  display_name: string;
  work_email: string;
  department: string;
  employment_status?: string;
};
type Leave = { annual_days_remaining: number; snapshot_date: string };
type Account = {
  linked: boolean;
  customer: {
    id: string;
    display_name: string;
    customer_tier: string;
    account_status: string;
    email: string;
  } | null;
};
const date = (value: string) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [directoryError, setDirectoryError] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [details, setDetails] = useState<{
    leave: Leave;
    account: Account;
  } | null>(null);
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const profileRequest = useRef(0);
  const load = useCallback(async () => {
    setLoading(true);
    setDirectoryError("");
    try {
      const response = await fetch(`${hr}/v1/employees`);
      if (!response.ok)
        throw new Error("Directory unavailable. Please try again.");
      setEmployees(await response.json());
      setLoaded(true);
    } catch (e) {
      setDirectoryError(
        e instanceof Error ? e.message : "Directory unavailable",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
    return () => {
      profileRequest.current++;
    };
  }, [load]);
  async function select(employee: Employee) {
    const request = ++profileRequest.current;
    setSelected(employee);
    setDetails(null);
    setProfileError("");
    setProfileLoading(true);
    try {
      const [leave, account] = await Promise.all(
        ["leave", "customer-account"].map(async (suffix) => {
          const response = await fetch(
            `${hr}/v1/employees/${encodeURIComponent(employee.employee_id)}/${suffix}`,
          );
          const body = await response.json();
          if (!response.ok)
            throw new Error(body.error ?? "Profile unavailable");
          return body;
        }),
      );
      if (request === profileRequest.current) setDetails({ leave, account });
    } catch (e) {
      if (request === profileRequest.current)
        setProfileError(e instanceof Error ? e.message : "Profile unavailable");
    } finally {
      if (request === profileRequest.current) setProfileLoading(false);
    }
  }
  const departments = [...new Set(employees.map((e) => e.department))].sort();
  const visible = employees.filter(
    (e) =>
      `${e.display_name} ${e.work_email}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()) &&
      (department === "all" || e.department === department),
  );
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <a href="#overview" className="brand">
          <span className="brand-mark">N</span>
          <span>
            Northstar<small>People</small>
          </span>
        </a>
        <nav aria-label="People workspace">
          <a
            href="#overview"
            onClick={() => setActiveSection("overview")}
            aria-current={activeSection === "overview" ? "location" : undefined}
          >
            <span aria-hidden="true">▦</span> Overview
          </a>
          <a
            href="#directory"
            onClick={() => setActiveSection("directory")}
            aria-current={
              activeSection === "directory" ? "location" : undefined
            }
          >
            <span aria-hidden="true">≡</span> Directory
          </a>
          <a
            href="#profile"
            onClick={() => setActiveSection("profile")}
            aria-current={activeSection === "profile" ? "location" : undefined}
          >
            <span aria-hidden="true">◎</span> Selected profile
          </a>
        </nav>
        <div className="sidebar-note">
          <strong>People, connected.</strong>
          <br />
          Find the right colleague and the details that matter.
          <br />
          Synthetic demonstration data
        </div>
      </aside>
      <div className="workspace">
        <div className="topbar">
          <span>Workspace / People</span>
          <span className="badge">Demo workspace</span>
        </div>
        <main id="main" className="dashboard">
          <header className="page-heading" id="overview">
            <span className="eyebrow">Good work starts with people</span>
            <h1>People directory</h1>
            <p className="muted">
              Your colleagues, their teams, and a little more clarity.
            </p>
          </header>
          <div
            className="stats"
            aria-label="Directory overview"
            aria-busy={loading}
          >
            <div className="stat">
              <span>Colleagues</span>
              <strong>{loading || !loaded ? "—" : employees.length}</strong>
              <small>In the current directory</small>
            </div>
            <div className="stat">
              <span>Departments</span>
              <strong>{loading || !loaded ? "—" : departments.length}</strong>
              <small>Working together</small>
            </div>
            <div className="stat">
              <span>Showing</span>
              <strong>{loading || !loaded ? "—" : visible.length}</strong>
              <small>Matching your filters</small>
            </div>
          </div>
          <section
            id="directory"
            className="panel"
            aria-labelledby="directory-title"
          >
            <div className="section-heading">
              <div>
                <h2 id="directory-title">Meet the team</h2>
                <p className="muted">
                  Select a colleague to explore their profile.
                </p>
              </div>
              <button className="secondary" disabled={loading} onClick={load}>
                {loading ? "Refreshing…" : "Refresh directory"}
              </button>
            </div>
            {directoryError ? (
              <div className="error" role="alert">
                <p>{directoryError}</p>
                <button className="secondary" onClick={load} disabled={loading}>
                  Try again
                </button>
                {employees.length ? (
                  <p>Showing the last loaded directory.</p>
                ) : null}
              </div>
            ) : null}
            <div className="toolbar">
              <label>
                Search colleagues
                <input
                  type="search"
                  placeholder="Name or work email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <label>
                Department
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="all">All departments</option>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
            </div>
            {loading && !employees.length ? (
              <p className="empty" role="status">
                Loading directory…
              </p>
            ) : visible.length ? (
              <div className="directory">
                {visible.map((e) => (
                  <article
                    className={`card person ${selected?.employee_id === e.employee_id ? "selected" : ""}`}
                    key={e.employee_id}
                  >
                    <span className="avatar" aria-hidden="true">
                      {e.display_name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <h3>{e.display_name}</h3>
                    <span className="badge neutral">{e.department}</span>
                    <p className="muted">{e.work_email}</p>
                    <button
                      className="secondary"
                      onClick={() => {
                        void select(e);
                        document.getElementById("profile")?.scrollIntoView();
                      }}
                      aria-label={`View profile for ${e.display_name}`}
                    >
                      View profile <span aria-hidden="true">↗</span>
                    </button>
                  </article>
                ))}
              </div>
            ) : !directoryError ? (
              <p className="empty">
                {employees.length
                  ? "No colleagues match your filters."
                  : "No colleagues are in the directory yet."}
              </p>
            ) : null}
          </section>
          <section
            id="profile"
            className="panel"
            aria-labelledby="profile-title"
          >
            <div className="section-heading">
              <div>
                <h2 id="profile-title">Selected profile</h2>
                <p className="muted">
                  Directory details and the latest available snapshots.
                </p>
              </div>
              <span className="badge neutral">People overview</span>
            </div>
            {selected ? (
              <>
                <div className="profile-header">
                  <span className="avatar" aria-hidden="true">
                    {selected.display_name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <h2>{selected.display_name}</h2>
                    <span className="muted">{selected.department}</span>
                  </div>
                </div>
                <dl className="details">
                  <div>
                    <dt>Work email</dt>
                    <dd>
                      <a href={`mailto:${selected.work_email}`}>
                        {selected.work_email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt>Employee ID</dt>
                    <dd>{selected.employee_id}</dd>
                  </div>
                </dl>
                {profileLoading ? (
                  <p className="empty" role="status">
                    Loading profile snapshots…
                  </p>
                ) : null}
                {profileError ? (
                  <div className="error" role="alert">
                    <p>{profileError}</p>
                    <button
                      className="secondary"
                      onClick={() => select(selected)}
                    >
                      Retry profile
                    </button>
                  </div>
                ) : null}
                {details ? (
                  <div className="profile-grid" style={{ marginTop: 24 }}>
                    <div>
                      <span className="eyebrow">Annual leave</span>
                      <p className="balance">
                        <strong>{details.leave.annual_days_remaining}</strong>{" "}
                        days
                      </p>
                      <p className="muted">
                        Remaining as of {date(details.leave.snapshot_date)}
                      </p>
                      <span className="badge">Directory snapshot</span>
                    </div>
                    <div>
                      <h3>Customer account</h3>
                      {details.account.linked && details.account.customer ? (
                        <dl className="details">
                          <div>
                            <dt>Account</dt>
                            <dd>{details.account.customer.id}</dd>
                          </div>
                          <div>
                            <dt>Status</dt>
                            <dd>{details.account.customer.account_status}</dd>
                          </div>
                          <div>
                            <dt>Customer name</dt>
                            <dd>{details.account.customer.display_name}</dd>
                          </div>
                          <div>
                            <dt>Tier</dt>
                            <dd>{details.account.customer.customer_tier}</dd>
                          </div>
                        </dl>
                      ) : (
                        <p className="muted">
                          This colleague has no linked customer account.
                        </p>
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <p className="empty">
                Choose a colleague in the directory to see their profile.
              </p>
            )}
          </section>
          <footer className="footer">
            <span>Northstar Equipment / People</span>
            <span>Synthetic demonstration data</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "@repo/ui/link";
import "./styles.css";
const hr = import.meta.env.VITE_HR_URL ?? "http://127.0.0.1:5006";
type Employee = {
  employee_id: string;
  display_name: string;
  work_email: string;
  department: string;
};
export default function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [details, setDetails] = useState<{
    leave: unknown;
    account: unknown;
  } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch(`${hr}/v1/employees`)
      .then((response) => {
        if (!response.ok) throw new Error("Directory unavailable");
        return response.json();
      })
      .then((rows) => {
        if (active) setEmployees(rows);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  async function select(employee: Employee) {
    setSelected(employee);
    setDetails(null);
    setError("");
    try {
      const results = await Promise.all(
        ["leave", "customer-account"].map(async (suffix) => {
          const response = await fetch(
            `${hr}/v1/employees/${employee.employee_id}/${suffix}`,
          );
          const body = await response.json();
          if (!response.ok) throw new Error(body.error);
          return body;
        }),
      );
      setDetails({ leave: results[0], account: results[1] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profile unavailable");
    }
  }
  return (
    <main>
      <header>
        <span className="eyebrow">Northstar / People</span>
        <h1>People directory</h1>
        <p className="muted">
          Find a colleague. View their team and leave snapshot.
        </p>
        <Link href="#profile">Selected profile</Link>
      </header>
      {error ? (
        <p role="alert" className="error">
          {error}
        </p>
      ) : null}
      <div className="grid">
        {employees.map((employee) => (
          <article className="card" key={employee.employee_id}>
            <span className="badge">{employee.department}</span>
            <h2>{employee.display_name}</h2>
            <p>{employee.work_email}</p>
            <button onClick={() => select(employee)}>View profile</button>
          </article>
        ))}
      </div>
      <section id="profile">
        <h2>{selected?.display_name ?? "Choose a colleague"}</h2>
        {details ? (
          <>
            <h3>Leave snapshot</h3>
            <pre>{JSON.stringify(details.leave, null, 2)}</pre>
            <h3>Customer account</h3>
            <pre>{JSON.stringify(details.account, null, 2)}</pre>
          </>
        ) : selected ? (
          <p>Loading profile…</p>
        ) : (
          <p className="muted">
            Profiles include the latest available directory snapshot.
          </p>
        )}
      </section>
    </main>
  );
}

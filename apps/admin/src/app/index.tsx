import { useCallback, useEffect, useRef, useState } from "react";
import "./styles.css";

const gateway = import.meta.env.VITE_GATEWAY_URL ?? "http://127.0.0.1:5001";
const inventory = import.meta.env.VITE_INVENTORY_URL ?? "http://127.0.0.1:5005";
type Product = { sku: string; name: string; stock_on_hand: number };
type Order = {
  id: string;
  status: string;
  total_minor: number;
  customer: { display_name: string; customer_tier: string } | null;
  charge: { id: string; status: string } | null;
};
const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value / 100,
  );

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [stockError, setStockError] = useState("");
  const [pendingSku, setPendingSku] = useState("");
  const adjustmentLock = useRef(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [id, setId] = useState("ord-001");
  const [order, setOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState("");
  const [looking, setLooking] = useState(false);
  const lookupLock = useRef(false);
  const load = useCallback(async () => {
    setLoading(true);
    setStockError("");
    try {
      const response = await fetch(`${inventory}/v1/products`);
      if (!response.ok)
        throw new Error("Catalog unavailable. Please try again.");
      setProducts(await response.json());
      setLoaded(true);
    } catch (e) {
      setStockError(e instanceof Error ? e.message : "Catalog unavailable");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  async function adjust(product: Product, delta: number) {
    if (adjustmentLock.current) return;
    adjustmentLock.current = true;
    setPendingSku(product.sku);
    setStockError("");
    setNotice("");
    try {
      const response = await fetch(
        `${inventory}/v1/products/${encodeURIComponent(product.sku)}/adjustments`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ delta }),
        },
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail ?? "Adjustment failed");
      setNotice(
        `${product.name}: ${delta > 0 ? "added" : "removed"} one unit.`,
      );
      await load();
    } catch (e) {
      setStockError(e instanceof Error ? e.message : "Adjustment failed");
    } finally {
      adjustmentLock.current = false;
      setPendingSku("");
    }
  }
  async function lookup(event: React.FormEvent) {
    event.preventDefault();
    if (lookupLock.current || !id.trim()) return;
    lookupLock.current = true;
    setLooking(true);
    setOrderError("");
    setOrder(null);
    try {
      const response = await fetch(`${gateway}/graphql`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          query:
            "query FindOrder($id: ID!) { order(id: $id) { id status total_minor customer { display_name customer_tier } charge { id status } } }",
          variables: { id: id.trim() },
        }),
      });
      const body = await response.json();
      if (!response.ok || body.errors)
        throw new Error(
          body.errors?.[0]?.message ?? "Order lookup unavailable",
        );
      if (!body.data?.order) throw new Error("No order found with that ID.");
      setOrder(body.data.order);
    } catch (e) {
      setOrderError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      lookupLock.current = false;
      setLooking(false);
    }
  }
  const visible = products.filter(
    (p) =>
      `${p.name} ${p.sku}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()) &&
      (filter === "all" ||
        (filter === "available" ? p.stock_on_hand > 0 : p.stock_on_hand <= 0)),
  );
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <a className="brand" href="#overview">
          <span className="brand-mark">N</span>
          <span>
            Northstar<small>Operations</small>
          </span>
        </a>
        <nav aria-label="Operations">
          <a
            href="#overview"
            onClick={() => setActiveSection("overview")}
            aria-current={activeSection === "overview" ? "location" : undefined}
          >
            <span aria-hidden="true">▦</span> Overview
          </a>
          <a
            href="#stock"
            onClick={() => setActiveSection("stock")}
            aria-current={activeSection === "stock" ? "location" : undefined}
          >
            <span aria-hidden="true">≡</span> Inventory
          </a>
          <a
            href="#orders"
            onClick={() => setActiveSection("orders")}
            aria-current={activeSection === "orders" ? "location" : undefined}
          >
            <span aria-hidden="true">⌕</span> Order lookup
          </a>
        </nav>
        <div className="sidebar-note">
          <strong>Equipment desk</strong>
          <br />A clearer view of your daily operations.
          <br />
          Synthetic demonstration data
        </div>
      </aside>
      <div className="workspace">
        <div className="topbar">
          <span>Workspace / Operations</span>
          <span className="badge">Demo workspace</span>
        </div>
        <main className="dashboard" id="main">
          <header className="page-heading" id="overview">
            <span className="eyebrow">Your operations, at a glance</span>
            <h1>Equipment desk</h1>
            <p className="muted">
              Keep stock moving and help customers find their next step.
            </p>
          </header>
          <div
            className="stats"
            aria-label="Inventory overview"
            aria-busy={loading}
          >
            <div className="stat">
              <span>Products</span>
              <strong>{loading || !loaded ? "—" : products.length}</strong>
              <small>In the equipment catalog</small>
            </div>
            <div className="stat">
              <span>Units on hand</span>
              <strong>
                {loading || !loaded
                  ? "—"
                  : products.reduce((sum, p) => sum + p.stock_on_hand, 0)}
              </strong>
              <small>Across all products</small>
            </div>
            <div className="stat">
              <span>Out of stock</span>
              <strong>
                {loading || !loaded
                  ? "—"
                  : products.filter((p) => p.stock_on_hand <= 0).length}
              </strong>
              <small>Products needing attention</small>
            </div>
          </div>
          <section className="panel" id="stock" aria-labelledby="stock-title">
            <div className="section-heading">
              <div>
                <h2 id="stock-title">Inventory</h2>
                <p className="muted">
                  Search equipment and update warehouse stock.
                </p>
              </div>
              <button
                className="secondary"
                onClick={load}
                disabled={loading || !!pendingSku}
              >
                {loading ? "Refreshing…" : "Refresh stock"}
              </button>
            </div>
            {stockError ? (
              <div className="error" role="alert">
                <p>{stockError}</p>
                <button
                  className="secondary"
                  onClick={load}
                  disabled={loading || !!pendingSku}
                >
                  Retry loading stock
                </button>
              </div>
            ) : null}
            {notice ? (
              <p className="notice" role="status">
                {notice}
              </p>
            ) : null}
            <div className="toolbar">
              <label>
                Search inventory
                <input
                  type="search"
                  placeholder="Product name or SKU"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <label>
                Availability
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All stock</option>
                  <option value="available">In stock</option>
                  <option value="empty">Out of stock</option>
                </select>
              </label>
            </div>
            {loading && !products.length ? (
              <p className="empty" role="status">
                Loading inventory…
              </p>
            ) : products.length ? (
              <>
                <div className="table-wrap">
                  <table>
                    <caption
                      className="muted"
                      style={{ textAlign: "left", paddingBottom: 12 }}
                    >
                      {visible.length} of {products.length} products
                      {stockError ? " · Last loaded data" : ""}
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Availability</th>
                        <th scope="col">On hand</th>
                        <th scope="col">Adjust units</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((p) => (
                        <tr key={p.sku}>
                          <td>
                            <strong>{p.name}</strong>
                            <small>{p.sku}</small>
                          </td>
                          <td>
                            <span
                              className={`badge ${p.stock_on_hand <= 0 ? "neutral" : ""}`}
                            >
                              {p.stock_on_hand > 0
                                ? "In stock"
                                : "Out of stock"}
                            </span>
                          </td>
                          <td>{p.stock_on_hand}</td>
                          <td>
                            <div className="row">
                              <button
                                className="secondary"
                                disabled={!!pendingSku || loading}
                                aria-label={`Remove one ${p.name}`}
                                onClick={() => adjust(p, -1)}
                              >
                                −1
                              </button>
                              <button
                                disabled={!!pendingSku || loading}
                                aria-label={`Add one ${p.name}`}
                                onClick={() => adjust(p, 1)}
                              >
                                +1
                              </button>
                              {pendingSku === p.sku ? (
                                <small role="status">Saving…</small>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {!visible.length ? (
                  <p className="empty">
                    No products match your search and availability filter.
                  </p>
                ) : null}
              </>
            ) : !stockError ? (
              <p className="empty">No equipment is in the catalog yet.</p>
            ) : null}
          </section>
          <section className="panel" id="orders" aria-labelledby="order-title">
            <div className="section-heading">
              <div>
                <h2 id="order-title">Order lookup</h2>
                <p className="muted">
                  Find an order, customer, and payment in one place.
                </p>
              </div>
              <span className="badge neutral">Customer support</span>
            </div>
            <form className="toolbar" onSubmit={lookup}>
              <label>
                Order ID
                <input
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="ord-001"
                  required
                />
              </label>
              <button disabled={looking || !id.trim()}>
                {looking ? "Looking up…" : "Find order"}
              </button>
            </form>
            {orderError ? (
              <p role="alert" className="error">
                {orderError}
              </p>
            ) : null}
            {order ? (
              <div className="order-result" role="status">
                <div className="section-heading">
                  <h3>{order.id}</h3>
                  <span className="badge">{order.status}</span>
                </div>
                <dl className="details">
                  <div>
                    <dt>Order total</dt>
                    <dd>{money(order.total_minor)}</dd>
                  </div>
                  <div>
                    <dt>Customer</dt>
                    <dd>{order.customer?.display_name ?? "Not available"}</dd>
                  </div>
                  <div>
                    <dt>Customer tier</dt>
                    <dd>{order.customer?.customer_tier ?? "Not available"}</dd>
                  </div>
                  <div>
                    <dt>Payment status</dt>
                    <dd>{order.charge?.status ?? "No payment recorded"}</dd>
                  </div>
                  <div>
                    <dt>Charge reference</dt>
                    <dd>{order.charge?.id ?? "Not available"}</dd>
                  </div>
                </dl>
              </div>
            ) : !looking && !orderError ? (
              <p className="empty">Enter an order ID to see its details.</p>
            ) : null}
          </section>
          <footer className="footer">
            <span>Northstar Equipment / Operations</span>
            <span>Synthetic demonstration data</span>
          </footer>
        </main>
      </div>
    </div>
  );
}

"use client";
import { useCallback, useEffect, useRef, useState } from "react";
type Product = {
  sku: string;
  name: string;
  price_minor: number;
  stock_on_hand: number;
};
type Order = {
  id: string;
  status: string;
  total_minor: number;
  charge_id: string | null;
};
const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://127.0.0.1:5001";
const money = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    value / 100,
  );
export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [customer, setCustomer] = useState("cus-001");
  const [token, setToken] = useState("tok_demo_ok");
  const [order, setOrder] = useState<Order | null>(null);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [errorContext, setErrorContext] = useState<"checkout" | "lookup">(
    "lookup",
  );
  const [busy, setBusy] = useState("");
  const [looking, setLooking] = useState(false);
  const operationLock = useRef(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const fetchCatalog = useCallback(() => {
    return fetch(`${gateway}/graphql`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: "{ products { sku name price_minor stock_on_hand } }",
      }),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || result.errors)
          throw new Error(
            result.errors?.[0]?.message ?? "Equipment unavailable",
          );
        setProducts(result.data.products);
        setCatalogError("");
      })
      .catch((e) =>
        setCatalogError(
          e instanceof Error ? e.message : "Equipment unavailable",
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  const load = useCallback(() => {
    setLoading(true);
    setCatalogError("");
    return fetchCatalog();
  }, [fetchCatalog]);
  useEffect(() => {
    void fetchCatalog();
  }, [fetchCatalog]);
  async function checkout(sku: string) {
    if (operationLock.current || !customer.trim()) return;
    operationLock.current = true;
    setBusy(sku);
    setErrorContext("checkout");
    setError("");
    setOrder(null);
    try {
      const response = await fetch(`${gateway}/v1/orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-demo-user-id": customer.trim(),
        },
        body: JSON.stringify({
          customerId: customer.trim(),
          items: [{ sku, quantity: 1 }],
          paymentToken: token,
        }),
      });
      const result = await response.json();
      if (!response.ok && response.status !== 402)
        throw new Error(result.error ?? "Checkout failed");
      setOrder(result);
      setOrderId(result.id);
      document.getElementById("orders")?.scrollIntoView();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      operationLock.current = false;
      setBusy("");
    }
  }
  async function lookup(event: React.FormEvent) {
    event.preventDefault();
    if (operationLock.current || !orderId.trim() || !customer.trim()) return;
    operationLock.current = true;
    setLooking(true);
    setErrorContext("lookup");
    setError("");
    setOrder(null);
    try {
      const response = await fetch(
        `${gateway}/v1/orders/${encodeURIComponent(orderId.trim())}`,
        { headers: { "x-demo-user-id": customer.trim() } },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Order not found");
      setOrder(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      operationLock.current = false;
      setLooking(false);
    }
  }
  const visible = products
    .filter((p) =>
      `${p.name} ${p.sku}`.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price_minor - b.price_minor
        : sort === "high"
          ? b.price_minor - a.price_minor
          : a.name.localeCompare(b.name),
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="site-nav">
          <a className="brand" href="#main">
            <span className="brand-mark">N</span>
            <span>
              Northstar<small>Equipment</small>
            </span>
          </a>
          <nav aria-label="Storefront">
            <a href="#catalog">Catalog</a>
            <a href="#orders">Track order</a>
            <a href="#workspace">Workspace</a>
          </nav>
        </div>
      </header>
      <main id="main" className="site-main">
        <section className="hero" aria-labelledby="hero-title">
          <div>
            <span className="eyebrow">Made for the everyday</span>
            <h1 id="hero-title">
              A better workday
              <br />
              starts here.
            </h1>
            <p>
              Practical equipment for focused desks, connected teams, and work
              in the field.
            </p>
            <div className="row">
              <a className="button" href="#catalog">
                Explore equipment <span aria-hidden="true">↓</span>
              </a>
              <a href="#orders">Already ordered?</a>
            </div>
          </div>
          <aside className="hero-aside">
            <span className="eyebrow">The workday collection</span>
            <strong>
              Good tools.
              <br />
              Clear purpose.
            </strong>
            <p>
              Find what your team needs, check availability, and keep your day
              moving.
            </p>
            <span className="badge neutral">Prices in USD</span>
          </aside>
        </section>
        <details className="panel workspace-settings" id="workspace">
          <summary>Your workspace · Customer &amp; demo payment</summary>
          <p className="muted">
            Choose the customer account and payment outcome for this
            demonstration.
          </p>
          <div className="row">
            <label>
              Customer ID
              <input
                value={customer}
                onChange={(e) => {
                  setCustomer(e.target.value);
                  setOrder(null);
                  setError("");
                }}
                disabled={!!busy || looking}
                required
              />
            </label>
            <label>
              Demo payment
              <select
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={!!busy || looking}
              >
                <option value="tok_demo_ok">Approve payment</option>
                <option value="tok_demo_decline">Decline payment</option>
              </select>
            </label>
            <span className="badge">USD</span>
          </div>
          {!customer.trim() ? (
            <p className="error">
              Enter a customer ID before ordering or tracking.
            </p>
          ) : null}
        </details>
        <section id="catalog" aria-labelledby="catalog-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Find your next essential</span>
              <h2 id="catalog-title" style={{ marginTop: 8 }}>
                Equipment for the way you work
              </h2>
              <p className="muted">
                Straightforward choices. Availability at a glance.
              </p>
            </div>
            <span className="badge neutral">
              {loading ? "Loading catalog…" : `${products.length} products`}
            </span>
          </div>
          <div className="toolbar">
            <label>
              Search equipment
              <input
                type="search"
                placeholder="Product name or SKU"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <label>
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="name">Product name</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </select>
            </label>
          </div>
          {error && errorContext === "checkout" ? (
            <p className="error" role="alert">
              {error}
            </p>
          ) : null}
          {catalogError ? (
            <div role="alert" className="error">
              <p>
                {catalogError}
                {products.length ? " Showing the last loaded catalog." : ""}
              </p>
              <button className="secondary" onClick={load} disabled={loading}>
                Retry catalog
              </button>
            </div>
          ) : null}
          {loading && !products.length ? (
            <p className="empty" role="status">
              Finding your next workday essential…
            </p>
          ) : visible.length ? (
            <div className="product-grid">
              {visible.map((p) => (
                <article className="card product" key={p.sku}>
                  <div
                    className="section-heading"
                    style={{ width: "100%", margin: 0 }}
                  >
                    <span className="eyebrow">{p.sku}</span>
                    <span
                      className={`badge ${p.stock_on_hand <= 0 ? "neutral" : ""}`}
                    >
                      {p.stock_on_hand > 0 ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                  <h3>{p.name}</h3>
                  <p className="muted">{p.stock_on_hand} available</p>
                  <p className="price">{money(p.price_minor)}</p>
                  <button
                    disabled={
                      !!busy ||
                      looking ||
                      !customer.trim() ||
                      p.stock_on_hand <= 0
                    }
                    onClick={() => checkout(p.sku)}
                    aria-label={`Order one ${p.name}`}
                  >
                    {busy === p.sku
                      ? "Placing order…"
                      : p.stock_on_hand <= 0
                        ? "Currently unavailable"
                        : "Order one"}
                  </button>
                </article>
              ))}
            </div>
          ) : !catalogError ? (
            <p className="empty">
              {products.length
                ? "No equipment matches your search."
                : "The catalog is empty. Check back soon."}
            </p>
          ) : null}
        </section>
        <section id="orders" className="panel" aria-labelledby="orders-title">
          <div className="track-layout">
            <div>
              <span className="eyebrow">Stay in the loop</span>
              <h2 id="orders-title" style={{ marginTop: 10 }}>
                A little clarity on your order.
              </h2>
              <p>
                Enter your order reference to check its latest status. We’ll
                also show your most recent checkout here.
              </p>
              <span className="badge neutral">
                Customer: {customer || "Not selected"}
              </span>
            </div>
            <div>
              <form className="toolbar" onSubmit={lookup}>
                <label>
                  Order ID
                  <input
                    placeholder="ord-001"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </label>
                <button
                  disabled={
                    !!busy || looking || !orderId.trim() || !customer.trim()
                  }
                >
                  {looking ? "Looking up…" : "Track order"}
                </button>
              </form>
              {error && errorContext === "lookup" ? (
                <p role="alert" className="error">
                  {error}
                </p>
              ) : null}
              {busy ? (
                <p className="notice" role="status">
                  Placing your order…
                </p>
              ) : null}
              {order ? (
                <div className="order-result" role="status">
                  <span
                    className={`badge ${order.status === "declined" ? "danger" : ""}`}
                  >
                    {order.status}
                  </span>
                  <p>
                    {order.status === "declined"
                      ? "The demo payment was declined. Choose an approved payment in Workspace to place a new order."
                      : "Here is the latest status of your order."}
                  </p>
                  <dl className="details">
                    <div>
                      <dt>Order reference</dt>
                      <dd>{order.id}</dd>
                    </div>
                    <div>
                      <dt>Total</dt>
                      <dd>{money(order.total_minor)}</dd>
                    </div>
                    <div>
                      <dt>Charge reference</dt>
                      <dd>{order.charge_id ?? "No charge recorded"}</dd>
                    </div>
                  </dl>
                </div>
              ) : !error && !busy && !looking ? (
                <p className="empty">Your order details will appear here.</p>
              ) : null}
            </div>
          </div>
        </section>
        <footer className="footer">
          <span>Northstar Equipment · Thoughtful tools for everyday work</span>
          <span>Synthetic demonstration data</span>
        </footer>
      </main>
    </>
  );
}

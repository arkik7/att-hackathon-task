"use client";
import { useEffect, useState } from "react";
import { Link } from "@repo/ui/link";
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
  charge_id: string;
};
const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://127.0.0.1:5001";
export default function Store() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState("cus-001");
  const [token, setToken] = useState("tok_demo_ok");
  const [order, setOrder] = useState<Order | null>(null);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    fetch(`${gateway}/graphql`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query: "{ products { sku name price_minor stock_on_hand } }",
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (active) {
          if (result.errors) setError(result.errors[0].message);
          else setProducts(result.data.products);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  async function checkout(sku: string) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${gateway}/v1/orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-demo-user-id": customer,
        },
        body: JSON.stringify({
          customerId: customer,
          items: [{ sku, quantity: 1 }],
          paymentToken: token,
        }),
      });
      const result = await response.json();
      if (!response.ok && response.status !== 402)
        throw new Error(result.error ?? "Checkout failed");
      setOrder(result);
      setOrderId(result.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }
  async function lookup() {
    setError("");
    try {
      const response = await fetch(
        `${gateway}/v1/orders/${encodeURIComponent(orderId)}`,
        { headers: { "x-demo-user-id": customer } },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setOrder(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    }
  }
  return (
    <main>
      <header>
        <span className="eyebrow">Northstar / Equipment</span>
        <h1>Tools for a better workday.</h1>
        <p className="muted">
          Practical equipment for teams, desks, and the field.
        </p>
        <Link href="#orders">Track an order</Link>
      </header>
      <section>
        <h2>Your workspace</h2>
        <label>
          Customer
          <input
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </label>
        <label>
          Demo payment
          <select value={token} onChange={(e) => setToken(e.target.value)}>
            <option value="tok_demo_ok">Approve payment</option>
            <option value="tok_demo_decline">Decline payment</option>
          </select>
        </label>
        <span className="badge">USD</span>
      </section>
      {error ? (
        <p role="alert" className="error">
          {error}
        </p>
      ) : null}
      {!products.length && !error ? <p>Loading equipment…</p> : null}
      <div className="grid">
        {products.map((product) => (
          <article className="card" key={product.sku}>
            <span className="eyebrow">{product.sku}</span>
            <h2>{product.name}</h2>
            <p className="muted">{product.stock_on_hand} available</p>
            <p className="price">${(product.price_minor / 100).toFixed(2)}</p>
            <button disabled={busy} onClick={() => checkout(product.sku)}>
              Order one
            </button>
          </article>
        ))}
      </div>
      <section id="orders">
        <h2>Order status</h2>
        <div className="row">
          <input
            aria-label="Order ID"
            placeholder="ord-001"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button onClick={lookup} disabled={!orderId}>
            Look up
          </button>
        </div>
        {order ? (
          <div className="notice">
            <p>
              <strong>{order.status}</strong> · $
              {(order.total_minor / 100).toFixed(2)}
            </p>
            <p>{order.id}</p>
            <small>Charge {order.charge_id}</small>
          </div>
        ) : null}
      </section>
      <footer>Northstar Equipment · Synthetic demonstration data</footer>
    </main>
  );
}

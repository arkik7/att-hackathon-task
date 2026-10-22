import { useEffect, useState } from "react";
import { Link } from "@repo/ui/link";
import "./styles.css";
const gateway = import.meta.env.VITE_GATEWAY_URL ?? "http://127.0.0.1:5001";
const inventory = import.meta.env.VITE_INVENTORY_URL ?? "http://127.0.0.1:5005";
type Product = { sku: string; name: string; stock_on_hand: number };
export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [id, setId] = useState("ord-001");
  const [order, setOrder] = useState<unknown>(null);
  const [error, setError] = useState("");
  async function load() {
    const response = await fetch(`${inventory}/v1/products`);
    if (!response.ok) throw new Error("Catalog unavailable");
    setProducts(await response.json());
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);
  async function adjust(sku: string, delta: number) {
    setError("");
    try {
      const response = await fetch(
        `${inventory}/v1/products/${sku}/adjustments`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ delta }),
        },
      );
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Adjustment failed");
    }
  }
  async function lookup() {
    setError("");
    try {
      const response = await fetch(`${gateway}/graphql`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          query:
            "query FindOrder($id: ID!) { order(id: $id) { id status total_minor customer { display_name customer_tier } charge { id status } } }",
          variables: { id },
        }),
      });
      const body = await response.json();
      if (body.errors) throw new Error(body.errors[0].message);
      setOrder(body.data.order);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    }
  }
  return (
    <main>
      <header>
        <span className="eyebrow">Northstar / Operations</span>
        <h1>Equipment desk</h1>
        <p className="muted">Order support and warehouse stock.</p>
        <Link href="#stock">Stock ledger</Link>
      </header>
      {error ? (
        <p role="alert" className="error">
          {error}
        </p>
      ) : null}
      <section>
        <h2>Find an order</h2>
        <div className="row">
          <input
            aria-label="Order ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button onClick={lookup}>Look up</button>
        </div>
        {order ? <pre>{JSON.stringify(order, null, 2)}</pre> : null}
      </section>
      <section id="stock">
        <h2>Warehouse stock</h2>
        {!products.length ? <p>Loading stock…</p> : null}
        {products.map((product) => (
          <div className="card row" key={product.sku}>
            <strong>{product.sku}</strong>
            <span>{product.name}</span>
            <span className="badge">{product.stock_on_hand} on hand</span>
            <button
              className="secondary"
              aria-label={`Remove one ${product.name}`}
              onClick={() => adjust(product.sku, -1)}
            >
              −1
            </button>
            <button
              aria-label={`Add one ${product.name}`}
              onClick={() => adjust(product.sku, 1)}
            >
              +1
            </button>
          </div>
        ))}
      </section>
    </main>
  );
}

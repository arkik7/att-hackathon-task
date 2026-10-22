CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY, customer_id TEXT NOT NULL, total REAL NOT NULL,
 status TEXT NOT NULL, charge_id TEXT, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS order_items (
 order_id TEXT NOT NULL REFERENCES orders(id), sku TEXT NOT NULL,
 quantity INTEGER NOT NULL CHECK(quantity > 0), PRIMARY KEY(order_id, sku)
);

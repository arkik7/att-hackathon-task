import { randomUUID } from "node:crypto";
import { requestJson, HttpError } from "@repo/http-client";
import { demoIdentityHeader, readDemoIdentity } from "@repo/demo-identity";
import { app, fixture, finish } from "./platform.js";
import { db } from "./database.js";

const users = process.env.USER_SERVICE_URL ?? "http://127.0.0.1:5002";
const inventory = process.env.INVENTORY_SERVICE_URL ?? "http://127.0.0.1:5005";
const payments = process.env.PAYMENT_SERVICE_URL ?? "http://127.0.0.1:5004";
const insert = db.prepare(
  "INSERT INTO orders (id, customer_id, total_minor, status, charge_id, created_at) VALUES (?, ?, ?, ?, ?, ?)",
);
const insertItem = db.prepare("INSERT INTO order_items VALUES (?, ?, ?)");
if (!db.prepare("SELECT id FROM orders LIMIT 1").get()) {
  for (const order of fixture("orders.json")) {
    insert.run(
      order.id,
      order.customer_id,
      order.total_minor,
      order.status,
      order.charge_id,
      order.created_at,
    );
    for (const item of order.items)
      insertItem.run(order.id, item.sku, item.quantity);
  }
}
app.get("/v1/orders", (req, res) => {
  const identity = readDemoIdentity(req.get(demoIdentityHeader));
  if (req.query.customerId && req.query.customerId !== identity.customerId)
    return res.status(403).json({ error: "Customer scope mismatch" });
  return res.json(
    db
      .prepare(
        "SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC",
      )
      .all(identity.customerId),
  );
});
app.get("/v1/orders/:id", (req, res) => {
  const identity = readDemoIdentity(req.get(demoIdentityHeader));
  res.set("x-customer-context", identity.customerId);
  const order = db
    .prepare("SELECT * FROM orders WHERE id = ?")
    .get(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  return res.json({
    ...order,
    items: db
      .prepare("SELECT sku, quantity FROM order_items WHERE order_id = ?")
      .all(req.params.id),
  });
});
app.post("/v1/orders", async (req, res) => {
  const { customerId, items, paymentToken = "tok_demo_ok" } = req.body;
  const identity = readDemoIdentity(req.get(demoIdentityHeader));
  if (customerId !== identity.customerId)
    throw new HttpError(403, "Customer scope mismatch");
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 20 ||
    !items.every(
      (item) =>
        typeof item.sku === "string" &&
        Number.isSafeInteger(item.quantity) &&
        item.quantity > 0,
    ) ||
    new Set(items.map((item) => item.sku)).size !== items.length
  )
    throw new HttpError(
      400,
      "Provide unique SKUs and positive integer quantities",
    );
  if (typeof paymentToken !== "string" || !paymentToken.startsWith("tok_demo_"))
    throw new HttpError(400, "Use a demo payment token");
  const requestId = res.locals.requestId;
  const user = await requestJson<{ account_status: string }>(
    `${users}/v2/users/${encodeURIComponent(customerId)}`,
    {},
    requestId,
  );
  if (user.account_status !== "active")
    throw new HttpError(409, "Customer account is not active");
  const availability = await requestJson<{ total_minor: number }>(
    `${inventory}/v1/availability`,
    { method: "POST", body: JSON.stringify({ items }) },
    requestId,
  );
  const id = `ord-${randomUUID()}`;
  const charge = await requestJson<{ id: string; status: string }>(
    `${payments}/v1/charges`,
    {
      method: "POST",
      headers: { "idempotency-key": req.get("idempotency-key") ?? id },
      body: JSON.stringify({
        order_id: id,
        amount_minor: availability.total_minor,
        currency: "USD",
        payment_token: paymentToken,
      }),
    },
    requestId,
  );
  const status = charge.status === "succeeded" ? "confirmed" : "declined";
  const createdAt = new Date().toISOString();
  db.exec("BEGIN");
  try {
    insert.run(
      id,
      customerId,
      availability.total_minor,
      status,
      charge.id,
      createdAt,
    );
    for (const item of items) insertItem.run(id, item.sku, item.quantity);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
  return res
    .status(status === "confirmed" ? 201 : 402)
    .json({
      id,
      customer_id: customerId,
      total_minor: availability.total_minor,
      status,
      charge_id: charge.id,
      created_at: createdAt,
      items,
    });
});
finish(5003);

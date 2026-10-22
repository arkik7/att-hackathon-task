import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { JSONFilePreset } from "lowdb/node";
import { HttpError } from "@repo/http-client";
import { app, dataFile, fixture, finish } from "./platform.js";

type Charge = {
  id: string;
  order_id: string;
  amount_minor: number;
  currency: string;
  status: string;
  idempotency_key: string | null;
  provider: { name: string; reference: string };
  created_at: string;
};
const documentFile = dataFile("charges.json");
const database = await JSONFilePreset<{ charges: Charge[] }>(
  documentFile,
  fixture("charges.json"),
);
if (!existsSync(documentFile)) await database.write();
let writes: Promise<unknown> = Promise.resolve();
app.get("/v1/charges/:id", (req, res) => {
  const charge = database.data.charges.find((row) => row.id === req.params.id);
  return charge
    ? res.json(charge)
    : res.status(404).json({ error: "Charge not found" });
});
app.post("/v1/charges", async (req, res) => {
  const { order_id, amount_minor, currency, payment_token } = req.body;
  if (
    typeof order_id !== "string" ||
    !Number.isSafeInteger(amount_minor) ||
    amount_minor <= 0 ||
    currency !== "USD" ||
    typeof payment_token !== "string" ||
    !payment_token.startsWith("tok_demo_")
  )
    throw new HttpError(400, "Invalid simulated charge");
  const charge: Charge = {
    id: `ch-${randomUUID()}`,
    order_id,
    amount_minor,
    currency,
    status: payment_token === "tok_demo_decline" ? "declined" : "succeeded",
    idempotency_key: req.get("idempotency-key") ?? null,
    provider: { name: "ledger-sim", reference: `sim-${randomUUID()}` },
    created_at: new Date().toISOString(),
  };
  const operation = writes.then(async () => {
    database.data.charges.push(charge);
    await database.write();
  });
  writes = operation.catch(() => undefined);
  await operation;
  return res.status(201).json(charge);
});
finish(5004);

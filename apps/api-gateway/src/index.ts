import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createSchema, createYoga } from "graphql-yoga";
import { requestJson, HttpError } from "@repo/http-client";
import { demoIdentityHeader, readDemoIdentity } from "@repo/demo-identity";
import { app, root, finish } from "./platform.js";
const users = process.env.USER_SERVICE_URL ?? "http://127.0.0.1:5002";
const orders = process.env.ORDER_SERVICE_URL ?? "http://127.0.0.1:5003";
const payments = process.env.PAYMENT_SERVICE_URL ?? "http://127.0.0.1:5004";
const inventory = process.env.INVENTORY_SERVICE_URL ?? "http://127.0.0.1:5005";
type Context = { requestId: string; customerId: string };
const schema = createSchema<Context>({
  typeDefs: readFileSync(
    resolve(root, "apps/api-gateway/src/schema.graphql"),
    "utf8",
  ),
  resolvers: {
    Query: {
      products: (_parent, _args, ctx) =>
        requestJson(`${inventory}/v1/products`, {}, ctx.requestId),
      customer: (_parent, { id }, ctx) =>
        requestJson(
          `${users}/v2/users/${encodeURIComponent(id)}`,
          {},
          ctx.requestId,
        ),
      order: (_parent, { id }, ctx) =>
        requestJson(
          `${orders}/v1/orders/${encodeURIComponent(id)}`,
          { headers: { [demoIdentityHeader]: ctx.customerId } },
          ctx.requestId,
        ),
    },
    Order: {
      customer: (parent, _args, ctx) =>
        requestJson(
          `${users}/v2/users/${encodeURIComponent(parent.customer_id)}`,
          {},
          ctx.requestId,
        ),
      charge: (parent, _args, ctx) =>
        parent.charge_id
          ? requestJson(
              `${payments}/v1/charges/${encodeURIComponent(parent.charge_id)}`,
              {},
              ctx.requestId,
            )
          : null,
    },
  },
});
app.use(
  "/graphql",
  createYoga({
    schema,
    graphqlEndpoint: "/graphql",
    context: ({ request }) => ({
      requestId: request.headers.get("x-request-id") ?? crypto.randomUUID(),
      customerId: readDemoIdentity(
        request.headers.get(demoIdentityHeader) ?? undefined,
      ).customerId,
    }),
  }),
);
app.get("/v1/products", async (_req, res) =>
  res.json(
    await requestJson(`${inventory}/v1/products`, {}, res.locals.requestId),
  ),
);
app.get("/v2/users/:id", async (req, res) =>
  res.json(
    await requestJson(
      `${users}/v2/users/${encodeURIComponent(req.params.id)}`,
      {},
      res.locals.requestId,
    ),
  ),
);
app.get("/v1/orders", async (req, res) => {
  const headers = {
    [demoIdentityHeader]: readDemoIdentity(req.get(demoIdentityHeader))
      .customerId,
  };
  return res.json(
    await requestJson(`${orders}/v1/orders`, { headers }, res.locals.requestId),
  );
});
app.get("/v1/orders/:id", async (req, res) =>
  res.json(
    await requestJson(
      `${orders}/v1/orders/${encodeURIComponent(req.params.id)}`,
      {
        headers: {
          [demoIdentityHeader]: readDemoIdentity(req.get(demoIdentityHeader))
            .customerId,
        },
      },
      res.locals.requestId,
    ),
  ),
);
app.post("/v1/orders", async (req, res) => {
  const downstream = await fetch(`${orders}/v1/orders`, {
    method: "POST",
    signal: AbortSignal.timeout(8000),
    headers: {
      "content-type": "application/json",
      "x-request-id": res.locals.requestId,
      [demoIdentityHeader]: readDemoIdentity(req.get(demoIdentityHeader))
        .customerId,
      "idempotency-key": req.get("idempotency-key") ?? crypto.randomUUID(),
    },
    body: JSON.stringify(req.body),
  });
  if (!downstream.headers.get("content-type")?.includes("application/json"))
    throw new HttpError(502, "Unexpected order response");
  return res.status(downstream.status).json(await downstream.json());
});
finish(5001);

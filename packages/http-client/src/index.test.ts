import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { requestJson, HttpError } from "./index.js";

test("downstream requests preserve the correlation ID and JSON payload", async () => {
  const server = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    res.setHeader("content-type", "application/json");
    res.end(
      JSON.stringify({
        requestId: req.headers["x-request-id"],
        body: JSON.parse(body),
      }),
    );
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const result = await requestJson(
      `http://127.0.0.1:${address.port}`,
      { method: "POST", body: JSON.stringify({ sku: "NS-001" }) },
      "request-123",
    );
    assert.deepEqual(result, {
      requestId: "request-123",
      body: { sku: "NS-001" },
    });
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("downstream failures retain their status and diagnostic message", async () => {
  const server = createServer((_req, res) => {
    res.writeHead(409, { "content-type": "application/json" });
    res.end(JSON.stringify({ detail: "Insufficient stock" }));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    await assert.rejects(
      requestJson(`http://127.0.0.1:${address.port}`),
      (error) =>
        error instanceof HttpError &&
        error.status === 409 &&
        error.message === "Insufficient stock",
    );
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

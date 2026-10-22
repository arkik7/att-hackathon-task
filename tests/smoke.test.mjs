import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { root } from "../scripts/process.mjs";

test(
  "seeded commerce, gateway and People Directory",
  { timeout: 120000 },
  async (t) => {
    const data = mkdtempSync(resolve(tmpdir(), "northstar-smoke-"));
    const services = [
      "api-gateway",
      "user-service",
      "order-service",
      "payment-service",
      "inventory-service",
      "hr-service",
    ];
    const start = Number(process.env.SMOKE_PORT_BASE ?? 15101);
    const urls = Object.fromEntries(
      services.map((name, index) => [
        name,
        `http://127.0.0.1:${start + index}`,
      ]),
    );
    const children = [];
    const logs = [];
    t.after(async () => {
      await Promise.all(
        children.map(
          (child) =>
            new Promise((resolvePromise) => {
              if (child.exitCode !== null) return resolvePromise();
              child.once("exit", resolvePromise);
              child.kill("SIGTERM");
              const timer = setTimeout(() => {
                child.kill("SIGKILL");
                resolvePromise();
              }, 3000);
              timer.unref();
            }),
        ),
      );
      rmSync(data, { recursive: true, force: true });
    });
    for (const [index, name] of services.entries()) {
      const cwd = resolve(root, "apps", name);
      const env = {
        ...process.env,
        HOST: "127.0.0.1",
        PORT: String(start + index),
        DATA_DIR: resolve(data, name),
        USER_SERVICE_URL: urls["user-service"],
        ORDER_SERVICE_URL: urls["order-service"],
        PAYMENT_SERVICE_URL: urls["payment-service"],
        INVENTORY_SERVICE_URL: urls["inventory-service"],
      };
      let command = process.execPath;
      let args;
      if (name === "inventory-service") {
        command = resolve(
          cwd,
          ".venv",
          process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
        );
        args = [
          "-m",
          "uvicorn",
          "app:app",
          "--host",
          "127.0.0.1",
          "--port",
          env.PORT,
        ];
      } else if (name === "hr-service") {
        command = process.env.JAVA_HOME
          ? resolve(
              process.env.JAVA_HOME,
              "bin",
              process.platform === "win32" ? "java.exe" : "java",
            )
          : "java";
        args = [
          "--add-modules",
          "jdk.httpserver",
          "--source",
          "21",
          "src/Main.java",
        ];
      } else {
        const require = createRequire(resolve(cwd, "package.json"));
        args = ["--import", require.resolve("tsx"), "src/index.ts"];
      }
      const child = spawn(command, args, {
        cwd,
        env,
        stdio: ["ignore", "pipe", "pipe"],
      });
      children.push(child);
      child.on("error", (error) => logs.push(`${name}: ${error.message}`));
      child.stdout.on("data", (chunk) => logs.push(`${name}: ${chunk}`));
      child.stderr.on("data", (chunk) => logs.push(`${name}: ${chunk}`));
    }
    for (const name of services) {
      let ready = false;
      for (let attempt = 0; attempt < 240; attempt++) {
        try {
          const response = await fetch(`${urls[name]}/health`, {
            signal: AbortSignal.timeout(500),
          });
          if (response.ok && (await response.json()).service === name) {
            ready = true;
            break;
          }
        } catch {
          /* wait for process */
        }
        await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
      }
      assert.ok(ready, `${name} did not start:\n${logs.join("")}`);
    }
    async function json(name, path, options = {}) {
      const response = await fetch(urls[name] + path, {
        ...options,
        headers: { "content-type": "application/json", ...options.headers },
      });
      return { status: response.status, body: await response.json(), response };
    }
    const seededCharges = JSON.parse(readFileSync(resolve(data, "payment-service", "charges.json"), "utf8"));
    assert.equal(seededCharges.charges.length, 20, "Payment seeds persist before the first charge");
    const catalog = await json("api-gateway", "/v1/products");
    assert.equal(catalog.status, 200);
    assert.equal(catalog.body.length, 15);
    const graph = await json("api-gateway", "/graphql", {
      method: "POST",
      body: JSON.stringify({
        query:
          '{ products { sku price_minor } order(id: "ord-001") { total_minor customer { id } charge { id status } } customer(id: "cus-001") { account_status } }',
      }),
    });
    assert.equal(graph.status, 200);
    assert.equal(graph.body.errors, undefined, JSON.stringify(graph.body));
    assert.equal(
      graph.body.data.products[0].price_minor,
      catalog.body[0].price_minor,
    );
    assert.equal(graph.body.data.order.charge.id, "ch-seed-001");
    assert.equal(graph.body.data.customer.account_status, "active");
    const create = (token) =>
      json("api-gateway", "/v1/orders", {
        method: "POST",
        headers: {
          "x-demo-user-id": "cus-001",
          "x-request-id": "smoke-checkout",
        },
        body: JSON.stringify({
          customerId: "cus-001",
          items: [{ sku: "NS-001", quantity: 1 }],
          paymentToken: token,
        }),
      });
    const order = await create("tok_demo_ok");
    assert.equal(order.status, 201, JSON.stringify(order.body));
    assert.equal(order.body.total_minor, 2500);
    assert.equal(order.body.status, "confirmed");
    assert.equal(order.response.headers.get("x-request-id"), "smoke-checkout");
    const lookup = await json("api-gateway", `/v1/orders/${order.body.id}`);
    assert.equal(lookup.body.charge_id, order.body.charge_id);
    const declined = await create("tok_demo_decline");
    assert.equal(declined.status, 402);
    assert.equal(declined.body.status, "declined");
    const invalid = await json("order-service", "/v1/orders", {
      method: "POST",
      body: JSON.stringify({
        customerId: "cus-001",
        items: [{ sku: "NS-001", quantity: 0 }],
      }),
    });
    assert.equal(invalid.status, 400);
    const scope = await json("order-service", "/v1/orders?customerId=cus-002");
    assert.equal(scope.status, 403);
    const history = await json("api-gateway", "/v1/orders");
    assert.ok(history.body.some((row) => row.id === order.body.id));
    const adjusted = await json(
      "inventory-service",
      "/v1/products/NS-001/adjustments",
      { method: "POST", body: JSON.stringify({ delta: 1 }) },
    );
    assert.equal(
      adjusted.body.stock_on_hand,
      catalog.body[0].stock_on_hand + 1,
    );
    const people = await json("hr-service", "/v1/employees");
    assert.equal(people.body.length, 10);
    const leave = await json("hr-service", "/v1/employees/emp-001/leave");
    assert.equal(leave.body.annual_days_remaining, 12);
    const linked = await json(
      "hr-service",
      "/v1/employees/emp-001/customer-account",
    );
    assert.equal(linked.body.customer.id, "cus-001");
    const unlinked = await json(
      "hr-service",
      "/v1/employees/emp-002/customer-account",
    );
    assert.deepEqual(unlinked.body, { linked: false, customer: null });
    const missing = await json("user-service", "/v2/users/unknown");
    assert.equal(missing.status, 404);
  },
);

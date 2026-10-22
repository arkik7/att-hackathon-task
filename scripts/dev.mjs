import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { root, pnpm, buildShared, appEnv } from "./process.mjs";
const ports = JSON.parse(
  readFileSync(resolve(root, "config/ports.json"), "utf8"),
);
const profiles = {
  commerce: [
    "api-gateway",
    "user-service",
    "order-service",
    "payment-service",
    "inventory-service",
    "storefront",
    "admin",
  ],
  hr: ["user-service", "hr-service", "hr-portal"],
  all: Object.keys(ports),
};
const selected = profiles[process.argv[2] ?? "commerce"];
if (!selected) throw new Error("Unknown development profile");
await buildShared();
const child = spawn(
  pnpm,
  [
    "exec",
    "turbo",
    "run",
    "dev",
    "--concurrency=16",
    ...selected.map((name) => `--filter=${name}`),
  ],
  { cwd: root, stdio: "inherit", shell: process.platform === "win32" },
);
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 0;
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
const backends = selected.filter(
  (name) => name.endsWith("service") || name === "api-gateway",
);
const deadline = Date.now() + 60000;
const pending = new Set(backends);
while (pending.size && Date.now() < deadline && child.exitCode === null) {
  for (const name of pending) {
    const env = appEnv(name);
    try {
      const response = await fetch(
        `http://127.0.0.1:${env.PORT ?? ports[name]}/health`,
        { signal: AbortSignal.timeout(500) },
      );
      if (response.ok && (await response.json()).service === name)
        pending.delete(name);
    } catch {
      /* service may still be compiling or starting */
    }
  }
  if (pending.size)
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 500));
}
if (pending.size)
  console.error(
    `Still waiting for: ${[...pending].join(", ")}. Check service logs and required runtimes.`,
  );
else console.log(`Ready: ${backends.join(", ")}`);

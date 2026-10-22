import { createRequire } from "node:module";
import { rmSync } from "node:fs";
import { resolve } from "node:path";
import { root, run, appEnv, buildShared } from "./process.mjs";
const mode = process.argv[2];
if (!["init", "reset"].includes(mode)) throw new Error("Use init or reset");
const services = [
  "user-service",
  "order-service",
  "payment-service",
  "inventory-service",
];
for (const service of services) {
  const configured = appEnv(service).DATA_DIR;
  const expected = resolve(root, ".runtime", service);
  if (configured && resolve(configured) !== expected)
    throw new Error(
      `Refusing to initialize/reset custom DATA_DIR for ${service}; remove the override first`,
    );
}
if (mode === "reset") {
  for (const service of services)
    rmSync(resolve(root, ".runtime", service), {
      recursive: true,
      force: true,
    });
}
await buildShared();
for (const service of services.slice(0, 3)) {
  const cwd = resolve(root, "apps", service);
  const require = createRequire(resolve(cwd, "package.json"));
  await run(
    process.execPath,
    ["--import", require.resolve("tsx"), "src/index.ts"],
    { cwd, env: { ...appEnv(service), INIT_ONLY: "1" } },
  );
}
await run(process.execPath, ["scripts/python.mjs", "init"]);
console.log(
  "Seed data ready. Stop running services before resetting their data.",
);

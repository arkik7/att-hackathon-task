import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { parseEnv } from "node:util";
export const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
export function appEnv(name) {
  const path = resolve(root, "apps", name, ".env");
  return {
    ...process.env,
    ...(existsSync(path) ? parseEnv(readFileSync(path, "utf8")) : {}),
  };
}
export function run(command, args, options = {}) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      cwd: root,
      shell: process.platform === "win32" && command.endsWith(".cmd"),
      ...options,
    });
    child.on("error", reject);
    child.on("exit", (code, signal) =>
      code === 0
        ? resolvePromise()
        : reject(new Error(`${command} exited ${code ?? signal}`)),
    );
  });
}
export async function buildShared() {
  await run(pnpm, [
    "exec",
    "turbo",
    "run",
    "build",
    "--filter=@repo/http-client",
    "--filter=@repo/demo-identity",
    "--filter=@repo/logger",
    "--filter=@repo/ui",
  ]);
}

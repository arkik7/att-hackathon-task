const SERVICE = "user-service";

import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { HttpError } from "@repo/http-client";
import { log } from "@repo/logger";

if (existsSync(".env")) process.loadEnvFile(".env");
export const app: express.Express = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "64kb" }));
app.use((req, res, next) => {
  const incoming = req.get("x-request-id");
  res.locals.requestId =
    incoming && /^[a-zA-Z0-9-]{1,80}$/.test(incoming) ? incoming : randomUUID();
  res.set("x-request-id", res.locals.requestId);
  next();
});
app.get("/health", (_req, res) => res.json({ status: "ok", service: SERVICE }));
export const root = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
export const dataDir = resolve(
  process.env.DATA_DIR ?? resolve(root, ".runtime", SERVICE),
);
export function dataFile(name: string) {
  mkdirSync(dataDir, { recursive: true });
  return resolve(dataDir, name);
}
export function fixture(name: string) {
  return JSON.parse(
    readFileSync(resolve(root, "apps", SERVICE, "fixtures", name), "utf8"),
  );
}
export function finish(port: number): import("node:http").Server | undefined {
  app.use(
    (
      error: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      const syntax = error instanceof SyntaxError;
      const status =
        error instanceof HttpError ? error.status : syntax ? 400 : 502;
      res
        .status(status)
        .json({
          error: syntax ? "Invalid JSON" : error.message,
          requestId: res.locals.requestId,
        });
    },
  );
  if (process.env.INIT_ONLY === "1") return;
  return app.listen(
    Number(process.env.PORT ?? port),
    process.env.HOST ?? "127.0.0.1",
    () => log(`${SERVICE} listening on ${process.env.PORT ?? port}`),
  );
}

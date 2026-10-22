import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { root, dataFile } from "./platform.js";
export const db = new DatabaseSync(dataFile("service.sqlite"));
db.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
db.exec("CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY)");
const directory = resolve(root, "apps", "user-service", "migrations");
for (const name of readdirSync(directory)
  .filter((name) => name.endsWith(".sql"))
  .sort()) {
  if (!db.prepare("SELECT name FROM migrations WHERE name = ?").get(name)) {
    db.exec("BEGIN");
    try {
      db.exec(readFileSync(resolve(directory, name), "utf8"));
      db.prepare("INSERT INTO migrations VALUES (?)").run(name);
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }
}

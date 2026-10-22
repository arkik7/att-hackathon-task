import { cpSync, mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { root } from "./process.mjs";
// An allowlist makes the participant snapshot independent of Git staging state.
const entries = [
  "apps",
  "packages",
  "scripts",
  "tests",
  "config",
  "docs",
  "wiki",
  "meeting-notes",
  "issues",
  "incidents",
  "releases",
  "diagrams",
  "api-specs",
  "archive",
  ".github",
  "docker",
  "README.md",
  "package.json",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "turbo.json",
  "compose.yaml",
  ".gitignore",
  ".dockerignore",
  ".npmrc",
];
const destination = resolve(
  root,
  ".runtime",
  "exports",
  `participants-${Date.now()}`,
);
mkdirSync(destination, { recursive: true });
const excluded = new Set([
  "node_modules",
  ".organizer",
  ".runtime",
  ".venv",
  "__pycache__",
  ".next",
  ".expo",
  "dist",
  "build",
  ".turbo",
  ".env",
  ".env.local",
]);
for (const entry of entries)
  if (existsSync(resolve(root, entry))) {
    cpSync(resolve(root, entry), resolve(destination, entry), {
      recursive: true,
      filter: (source) =>
        !source
          .slice(root.length)
          .split(/[\\/]/)
          .some(
            (part) =>
              (part.startsWith(".env") && part !== ".env.example") ||
              excluded.has(part) ||
              part.endsWith(".tsbuildinfo") ||
              part.endsWith(".pyc"),
          ),
    });
  }
console.log(`Participant snapshot: ${destination}`);

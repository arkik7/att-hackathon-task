import assert from "node:assert/strict";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { root } from "./process.mjs";
const directories = [
  "docs",
  "wiki",
  "meeting-notes",
  "issues",
  "incidents",
  "releases",
  "api-specs",
  "archive",
];
function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walk(resolve(directory, entry.name))
      : [resolve(directory, entry.name)],
  );
}
const documents = directories
  .flatMap((name) => walk(resolve(root, name)))
  .filter((path) => path.endsWith(".md"));
assert.ok(
  documents.length >= 60 && documents.length <= 90,
  `Expected 60–90 Markdown knowledge artifacts, got ${documents.length}`,
);
assert.equal(
  readdirSync(resolve(root, "meeting-notes")).filter((name) =>
    name.endsWith(".md"),
  ).length,
  16,
);
const images = readdirSync(resolve(root, "diagrams")).filter((name) =>
  name.endsWith(".png"),
);
assert.equal(images.length, 6);
for (const image of images)
  assert.equal(
    readFileSync(resolve(root, "diagrams", image))
      .subarray(0, 8)
      .toString("hex"),
    "89504e470d0a1a0a",
  );
for (const path of documents) {
  const text = readFileSync(path, "utf8");
  assert.ok(text.trim().length > 150, `Thin document: ${path}`);
  assert.ok(
    !text.includes(".organizer/"),
    `Private reference leaked into ${path}`,
  );
}
const apps = readdirSync(resolve(root, "apps")).filter((name) =>
  existsSync(resolve(root, "apps", name, "package.json")),
);
assert.equal(apps.length, 12);
if (existsSync(resolve(root, ".git"))) {
  const tracked = execFileSync("git", ["ls-files", "-z"], {
    cwd: root,
    encoding: "utf8",
  }).split("\0");
  assert.ok(
    !tracked.some(
      (path) => path.startsWith(".organizer/") || path.startsWith(".runtime/"),
    ),
  );
} else {
  assert.ok(
    !existsSync(resolve(root, ".organizer")),
    "File snapshot includes organizer materials",
  );
}
console.log(
  `Corpus checked: ${documents.length} Markdown artifacts, ${images.length} PNG diagrams, ${apps.length} apps/services.`,
);

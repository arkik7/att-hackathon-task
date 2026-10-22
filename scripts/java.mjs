import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { root, run, appEnv } from "./process.mjs";
const cwd = resolve(root, "apps/hr-service");
const mode = process.argv[2];
const java = process.env.JAVA_HOME
  ? resolve(
      process.env.JAVA_HOME,
      "bin",
      process.platform === "win32" ? "java.exe" : "java",
    )
  : "java";
const javac = process.env.JAVA_HOME
  ? resolve(
      process.env.JAVA_HOME,
      "bin",
      process.platform === "win32" ? "javac.exe" : "javac",
    )
  : "javac";
if (mode === "build") {
  mkdirSync(resolve(cwd, "build/classes"), { recursive: true });
  await run(
    javac,
    [
      "-Xlint:all",
      "--release",
      "21",
      "--add-modules",
      "jdk.httpserver",
      "-d",
      "build/classes",
      "src/Main.java",
    ],
    { cwd },
  );
} else if (mode === "run" || mode === "test") {
  await run(
    java,
    [
      "--add-modules",
      "jdk.httpserver",
      "--source",
      "21",
      "src/Main.java",
      ...(mode === "test" ? ["--check"] : []),
    ],
    { cwd, env: appEnv("hr-service") },
  );
} else throw new Error(`Unknown Java mode ${mode}`);

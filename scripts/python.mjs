import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { root, run, appEnv } from "./process.mjs";
const cwd = resolve(root, "apps/inventory-service");
const executable = resolve(
  cwd,
  ".venv",
  process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
);
const mode = process.argv[2];
if (mode === "setup") {
  await run(
    process.env.PYTHON ?? (process.platform === "win32" ? "python" : "python3"),
    ["-m", "venv", ".venv"],
    { cwd },
  );
  await run(executable, ["-m", "pip", "install", "-r", "requirements.txt"], {
    cwd,
  });
} else {
  if (!existsSync(executable))
    throw new Error(
      "Inventory environment missing. Run pnpm setup:python first.",
    );
  const env = appEnv("inventory-service");
  if (mode === "run")
    await run(
      executable,
      [
        "-m",
        "uvicorn",
        "app:app",
        "--host",
        env.HOST ?? "127.0.0.1",
        "--port",
        env.PORT ?? "5005",
      ],
      { cwd, env },
    );
  else if (mode === "init")
    await run(
      executable,
      ["-c", "import app; print('Inventory initialized')"],
      { cwd, env },
    );
  else if (mode === "test")
    await run(executable, ["-m", "unittest", "test_inventory.py"], { cwd });
  else if (mode === "check") {
    mkdirSync(resolve(root, ".runtime", "python-check"), { recursive: true });
    await run(
      executable,
      [
        "-c",
        "import ast,pathlib; [ast.parse(p.read_text()) for p in pathlib.Path('.').glob('*.py')]; print('Python syntax checked')",
      ],
      { cwd },
    );
  } else throw new Error(`Unknown Python mode ${mode}`);
}

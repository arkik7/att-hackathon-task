# Local development


The port registry is `config/ports.json`. Commerce starts five backends and two browser applications. HR starts user-service, People Directory, and hr-portal. Use one profile per port set; `pnpm dev:all` includes the journal and both Expo servers as well.

1. Install the pinned pnpm version and a supported Node runtime.
2. Run `pnpm install --frozen-lockfile` and `pnpm setup:python`.
3. Run `pnpm db:init`, then choose a development profile.

`PYTHON` can select the interpreter used to create the inventory virtual environment. `JAVA_HOME` can select the HR JDK. The Node launchers use argument arrays and run from known project directories, so they do not depend on a POSIX shell for service commands.

Copy app-local `.env.example` files only when overriding a default. Restart after configuration changes. Keep backend URLs distinct from browser-visible URLs. A container hostname such as `inventory-service` is not resolvable in your host browser.

If a dependency is unavailable, clients display an error. Inspect the request ID and backend logs before changing addresses. No service requires an external database.

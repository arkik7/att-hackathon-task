# Northstar Equipment

A fictional engineering repository for the AT&T Context Service hackathon. All people, incidents, records, and organizational history are synthetic.

The repository contains commerce and People applications, an independent engineering journal, local data stores, and engineering knowledge from several teams. The task is to build an evidence-backed Context Service over these materials. Source inspection is enough to begin; running the applications is optional.

## Start with the files

- `apps/`: twelve applications and services, including TypeScript, Python, and Java.
- `packages/`: shared frontend components, logging, HTTP utilities, identity helpers, and tooling.
- `docs/`, `wiki/`, `meeting-notes/`: technical references and team knowledge.
- `api-specs/`: API contracts and historical snapshots.
- `issues/`, `incidents/`, `releases/`: exported engineering records.
- `diagrams/`: architecture, data, and process images.
- `archive/`: project fragments retained for reference.

Sources reflect different dates, teams, and levels of certainty. Evaluate claims against their evidence and context. Do not treat every shared word as a relationship. The business applications contain synthetic defects and security examples for investigation; keep them on a local development machine.

## Choose how to start

**Running these applications is optional for the hackathon.** You can investigate the source code, schemas, documents, and images immediately. These business applications are the material your Context Service analyzes; you build the Context Service separately.

If you want to explore working applications, choose one of these routes:

| What you want                                                                        | Route                                                                   | Requirements on your computer                                                              |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Open the commerce and HR web apps with the fewest language setup steps               | [Docker](#option-a-docker)                                              | Running Docker Engine and Docker Compose v2; Docker Desktop provides both on Windows/macOS |
| Run all twelve apps/services, including the blog and both mobile development servers | [pnpm](#option-b-pnpm)                                                  | Node, pnpm, Python, and a Java JDK                                                         |
| Use Docker for the core and try the blog/mobile apps too                             | [Docker plus optional apps](#add-the-blog-or-mobile-previews-to-docker) | Docker, plus host Node and pnpm                                                            |

Run every command below from the **repository root**: the folder containing this README, `package.json`, and `compose.yaml`. In VS Code, open that folder and use **Terminal → New Terminal**. Commands in a block run one line at a time, in order.

The default addresses work without creating any `.env` files. No external database, payment account, API key, or cloud service is required. Initial image/package installation needs internet access; business requests afterward use local services and data.

Use one route for the core backends at a time. Docker and pnpm use the same host ports, so starting both core stacks together causes port conflicts.

## Option A: Docker

This route starts **nine containers**: six backends, storefront, admin, and HR portal. The blog and two Expo apps are optional additions described below. You do not need Node, pnpm, Python, or Java installed on your host for this core Docker route.

### 1. Check that Docker is ready

Start Docker Desktop, or your Docker Engine on Linux. On Windows, use Linux containers. If using WSL, enable Docker Desktop integration for the distribution where your terminal runs.

```sh
docker --version
docker compose version
docker info
```

The first two commands should print versions. `docker info` should connect to the engine and include server information. If it cannot connect, start Docker before continuing. This repository uses the two-word **`docker compose`** command.

### 2. Build and start commerce and HR together

```sh
docker compose --profile commerce --profile hr up --build
```

Keep this terminal open. The first build downloads dependencies and compiles several applications, so it takes longer than later starts. Wait for the build to finish and the services to start before opening the apps.

The two `--profile` options enable both domains. Their shared user service runs once. Databases and synthetic records initialize automatically; you do not need to run `pnpm db:init` for Docker.

Open:

| Application | Address                       | What to do                                |
| ----------- | ----------------------------- | ----------------------------------------- |
| Storefront  | http://localhost:3002         | Browse equipment and place a demo order   |
| Admin       | http://localhost:3001         | Look up an order and adjust stock         |
| HR portal   | http://localhost:3004         | Browse employees and view leave snapshots |
| GraphQL IDE | http://localhost:5001/graphql | Explore and run gateway queries           |

To check the core services directly, open these health URLs in your browser:

- Gateway: http://localhost:5001/health
- User service: http://localhost:5002/health
- Order service: http://localhost:5003/health
- Payment service: http://localhost:5004/health
- Inventory service: http://localhost:5005/health
- HR service: http://localhost:5006/health

A successful health response contains `"status": "ok"` and the service name. Health endpoints confirm that each process is listening; the [demo walkthrough](#try-the-applications) checks that the applications can talk to each other too.

### 3. Background mode, status, and logs

If you want your terminal back, start with `-d` instead of the foreground command above:

```sh
docker compose --profile commerce --profile hr up --build -d
```

Check status from another terminal in the same repository:

```sh
docker compose --profile commerce --profile hr ps -a
```

Once startup settles, all nine containers should be running; the user service also has a health check. If a container exits, inspect its logs:

```sh
docker compose --profile commerce --profile hr logs --tail=100
docker compose --profile commerce --profile hr logs --tail=100 order-service
```

To follow logs continuously:

```sh
docker compose --profile commerce --profile hr logs -f
```

Pressing **Ctrl+C while following logs** stops the log viewer; background containers keep running.

### 4. Stop and start again

For foreground mode, **Ctrl+C in the `up` terminal** stops the running containers. To remove the containers and their network, or to stop background mode, use:

```sh
docker compose --profile commerce --profile hr down
```

This preserves the database volumes and your demo records. To start again using the existing images:

```sh
docker compose --profile commerce --profile hr up -d
```

After changing application code or dependencies, rebuild the images:

```sh
docker compose --profile commerce --profile hr up --build -d
```

The containers run built applications; editing a host source file does not automatically update those applications. `restart` alone does not rebuild an image.

### Run only one Docker domain

Use one of these commands **instead of** the combined startup when you need fewer applications:

```sh
docker compose --profile commerce up --build
```

Commerce runs five backends plus storefront and admin: seven containers.

```sh
docker compose --profile hr up --build
```

HR runs user service, HR service, and HR portal: three containers. The combined startup shares the user service, giving nine containers total.

### Reset Docker data to the starting records

Ordinary shutdown keeps data. To deliberately remove all demo orders, charges, and stock changes stored in this Compose project's volumes, run:

```sh
docker compose --profile commerce --profile hr down --volumes
docker compose --profile commerce --profile hr up -d
```

**`--volumes` deletes the Docker database data.** Save any investigation evidence you want to keep first. The next startup recreates the synthetic seed records. This reset affects Docker volumes, not the host `.runtime/` data used by pnpm.

## Option B: pnpm

Use this route for source watching and all twelve applications. pnpm invokes Turborepo for you; no global Turbo installation is necessary.

### 1. Check the required tools

| Tool     | Version to use                                   | Needed for                                                        |
| -------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| Node.js  | 24.20.0 or newer; 24.20.0 is the tested baseline | JavaScript/TypeScript apps and launch scripts                     |
| pnpm     | 11.25.0                                          | Workspace dependencies and commands                               |
| Python   | 3.13                                             | Inventory service                                                 |
| Java JDK | 21                                               | HR service and Java checks; install a JDK, which includes `javac` |

Check the tools in the same terminal you will use to start the repository:

```sh
node --version
pnpm --version
java -version
javac -version
```

On Windows, check Python with:

```powershell
python --version
```

On macOS, Linux, or WSL, use:

```sh
python3 --version
```

If pnpm is missing or has the wrong version, install the pinned version after Node is available:

```sh
npm install --global pnpm@11.25.0
pnpm --version
```

If you just installed a tool, reopen your terminal so its updated PATH takes effect. In WSL, use Linux Node, pnpm, Python, and Java together; avoid mixing Windows executables with Linux dependencies in the same checkout.

### 2. First-time setup

Run these commands in order and let each finish successfully:

```sh
pnpm install --frozen-lockfile
pnpm setup:python
pnpm db:init
```

- `install` uses the committed dependency versions. Keep `pnpm-lock.yaml` intact.
- `setup:python` creates `apps/inventory-service/.venv` and installs its Python dependencies. You do not need to activate that environment manually.
- `db:init` builds the required shared packages and creates the writable SQLite and JSON stores from migrations and fixtures. Existing records are preserved. It initializes data and then exits; it does not leave servers running.

Normally you only repeat this setup after a fresh checkout or a dependency/environment change. If you have several Python installations, the `PYTHON` environment variable can select the interpreter used by `setup:python`. `JAVA_HOME` can select the JDK. See [troubleshooting](#troubleshooting) if the wrong executable is selected.

### 3. Start everything

```sh
pnpm dev:all
```

This builds shared packages and launches **all twelve app/service development processes**, including the independent blog and both Expo servers. Keep the terminal open. Look for a `Ready:` message listing the backends, and allow the web/mobile development servers to finish starting too.

The commerce and HR web URLs are the same as in the Docker instructions. pnpm also starts:

| Application                 | Address / port        |
| --------------------------- | --------------------- |
| Blog                        | http://localhost:3003 |
| Customer mobile Expo server | 8081                  |
| Employee mobile Expo server | 8082                  |

Starting an Expo server does not automatically open a native app or browser preview. See [mobile browser previews](#mobile-browser-previews) below.

Stop the development stack with **Ctrl+C** in its terminal. Local database files remain available for the next run. You do not need `pnpm db:init` before every restart.

### Smaller pnpm launch profiles

Choose **one** main profile:

| Command        | Starts                                     | Host language requirements   |
| -------------- | ------------------------------------------ | ---------------------------- |
| `pnpm dev`     | Commerce: five backends, storefront, admin | Node, pnpm, Python           |
| `pnpm dev:hr`  | User service, HR service, HR portal        | Node, pnpm, Java JDK         |
| `pnpm dev:all` | All twelve applications and services       | Node, pnpm, Python, Java JDK |

For an HR-only run, dependency installation is sufficient before `pnpm dev:hr`; you can skip Python setup and the all-store `db:init` command. The user service initializes its own database at startup.

Do not run `pnpm dev` and `pnpm dev:hr` simultaneously: both try to start user service on port 5002. Use `pnpm dev:all` for the combined system. Also stop the Docker core before starting a pnpm core profile.

### Mobile browser previews

Browser previews are sufficient to explore the React Native applications during the hackathon. They require no Android Studio, Xcode, device emulator, native build, or Expo account.

For an explicit browser launch, first start the matching backend profile, then use a separate terminal:

```sh
pnpm --filter customer-mobile exec expo start --web --port 8081
```

Open http://localhost:8081. Customer mobile needs the commerce backends.

For the employee app, use another terminal:

```sh
pnpm --filter employee-mobile exec expo start --web --port 8082
```

Open http://localhost:8082. Employee mobile needs the HR backends.

These explicit commands are alternatives to the Expo servers started by `pnpm dev:all`. If `dev:all` is already running, use its Expo terminal interaction to open web, or stop that stack and use a smaller backend profile plus the explicit commands. Do not start a second Expo process on the same port.

The existing `pnpm dev:customer-mobile` and `pnpm dev:employee-mobile` shortcuts start Expo without forcing web mode. Physical-device testing is optional and requires additional networking: the phone must reach the host's LAN address, the public mobile URL variables must use that address, and the relevant backend must accept LAN connections. Docker currently publishes backends on host loopback only. Use browser previews for the default setup.

### Reset local pnpm data

Stop all local profiles first, then run:

```sh
pnpm db:reset
pnpm dev:all
```

`db:reset` removes the generated user, order, payment, and inventory data directories under `.runtime/` and restores their seed records. It refuses custom `DATA_DIR` overrides. HR fixture files are read-only inputs and are unchanged. Like the Docker volume reset, this discards your demo transactions and stock adjustments.

Local pnpm data and Docker volumes are **separate datasets**. Resetting one does not reset the other.

## Add the blog or mobile previews to Docker

The Compose setup intentionally contains the nine core containers. To explore the remaining three apps while those containers run, install **host Node and pnpm** as described above. Host Python and Java are unnecessary for this mixed setup because the backend containers supply them.

In a separate terminal, prepare the host frontend dependencies:

```sh
pnpm install --frozen-lockfile
pnpm exec turbo run build --filter=@repo/ui
```

The UI build prepares the shared web component package used by the blog. Then start whichever extras you need, each in its own terminal:

```sh
pnpm dev:blog
```

```sh
pnpm --filter customer-mobile exec expo start --web --port 8081
```

```sh
pnpm --filter employee-mobile exec expo start --web --port 8082
```

The blog opens at http://localhost:3003; the mobile browser previews use http://localhost:8081 and http://localhost:8082. Both mobile apps use the backends exposed by Docker on localhost. Stop each extra app with Ctrl+C in its terminal.

Do **not** run `pnpm dev:all` alongside the Docker core: it would also start duplicate backends on the same ports.

## Try the applications

Once the relevant services are ready, this short walkthrough confirms that your setup works:

1. Open the storefront at http://localhost:3002. Leave the customer set to `cus-001` and demo payment set to **Approve payment**.
2. Find **USB-C Hub** (`NS-001`) and click **Order one**. You should see a confirmed order and its generated ID.
3. Copy that ID into the admin's order lookup at http://localhost:3001 and click **Look up**. The response includes order, customer, and charge information.
4. Use a stock adjustment button in admin, then refresh the storefront to see the updated count.
5. Open the HR portal at http://localhost:3004 and choose a colleague. Leave information should load. A colleague without a linked customer account is a valid result.

Useful synthetic examples:

| Value              | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `cus-001`          | Default demo customer                        |
| `NS-001`           | USB-C Hub for an ordinary checkout           |
| `ord-001`          | Existing seeded order for a read-only lookup |
| `tok_demo_ok`      | Successful simulated payment token           |
| `tok_demo_decline` | Declined simulated payment token             |

The storefront's **Decline payment** option exercises the declined-payment path. That result is expected, not a setup failure. No card information or real credentials are needed. The `x-demo-user-id` header is a local customer-context simulation, not a production login system.

To try GraphQL, open http://localhost:5001/graphql, paste this query into the editor, and press its run button:

```graphql
{
  products {
    sku
    name
    price_minor
    stock_on_hand
  }
}
```

Expect product data under `data.products`. For example, a price of `2500` minor units means USD 25.00.

## Configuration and data locations

Default local addresses are already configured. Copy an app's `.env.example` to `.env` only when you need an override. Configuration is per application; there is no required root `.env` file.

| Setting                                  | Used by                                   |
| ---------------------------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_GATEWAY_URL`                | Storefront browser code                   |
| `VITE_GATEWAY_URL`, `VITE_INVENTORY_URL` | Admin browser code                        |
| `VITE_HR_URL`                            | HR portal browser code                    |
| `EXPO_PUBLIC_GATEWAY_URL`                | Customer mobile                           |
| `EXPO_PUBLIC_HR_URL`                     | Employee mobile                           |
| `PORT`, `HOST`, service URL variables    | Backend processes; see each app's example |

Restart the affected development process after changing its environment. Browser-facing URLs must be reachable from your browser: use the localhost addresses above for the default setup. Names such as `inventory-service` are Docker network names used between containers, not host browser addresses.

Docker frontend URLs are embedded during image builds through arguments in `docker/Dockerfile.web`. A host app's `.env` file does not automatically reconfigure an already built container. Use the default Docker configuration for the quickest setup.

With pnpm, generated storage is under `.runtime/`: user, order, and inventory services each own a SQLite file, and payment service owns a JSON document file. With Docker, that writable data is in the named volumes declared in `compose.yaml`. HR reads committed JSON snapshots in `apps/hr-service/fixtures` in either mode.

More implementation detail is in [local development](docs/how-to/local-development.md) and the port registry at [config/ports.json](config/ports.json).

## Troubleshooting

| Symptom                                                                        | What to check or do                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `no configuration file provided`, or pnpm cannot find this workspace           | Open a terminal in the repository root, where `compose.yaml` and `package.json` live.                                                                                                                                                                                             |
| Docker cannot connect to the daemon or named pipe                              | Start Docker Desktop/Engine and check `docker info`. In WSL, check Docker Desktop integration for that distribution.                                                                                                                                                              |
| `docker compose` is unavailable                                                | Use a Docker installation with Compose v2. Check `docker compose version` before attempting the build.                                                                                                                                                                            |
| First Docker build is slow or appears busy downloading                         | Let the initial image and package downloads finish. Inspect the visible build output for an actual error before retrying. Later starts can reuse images.                                                                                                                          |
| Build is killed or runs out of memory                                          | Close other heavy applications. Reduce concurrent Docker work with `docker compose --parallel 1 --profile commerce --profile hr up --build -d`.                                                                                                                                   |
| `port is already allocated`, `address already in use`, or `EADDRINUSE`         | Stop the other stack/process using that port. Avoid overlapping pnpm core profiles or running Docker and pnpm backends together. Stop any duplicate Expo server too.                                                                                                              |
| A page loads but data does not                                                 | Check the backend health URLs, then logs. Backends can take longer to become ready than the web page. Refresh after they are ready. Open the app at its localhost URL rather than a container hostname.                                                                           |
| A Docker container exits                                                       | Run the status and log commands above. Use the exact service name, such as `inventory-service`, to narrow the logs.                                                                                                                                                               |
| Docker still runs old application code                                         | Use `up --build -d`; `restart` only restarts the existing image.                                                                                                                                                                                                                  |
| `pnpm` is missing or its version differs                                       | Install pnpm 11.25.0 with the command above, reopen the terminal if necessary, and check `pnpm --version`.                                                                                                                                                                        |
| PowerShell blocks `pnpm.ps1`                                                   | Use `pnpm.cmd` instead of `pnpm` in the same commands, for example `pnpm.cmd dev:all`.                                                                                                                                                                                            |
| Node engine warning or missing `node:sqlite` functionality                     | Check `node --version`; use the documented Node version. Reopen the terminal after changing it.                                                                                                                                                                                   |
| Frozen lockfile installation fails                                             | Confirm pnpm is 11.25.0 and use an unmodified, matching checkout of `package.json` files and `pnpm-lock.yaml`. Do not delete the lockfile or upgrade all dependencies as a setup workaround.                                                                                      |
| `Inventory environment missing`, or Python dependencies cannot be imported     | Run `pnpm setup:python` from the root using the chosen host environment, then retry. That command must finish successfully.                                                                                                                                                       |
| Python executable is missing or the wrong version is used                      | Check `python --version` on Windows or `python3 --version` elsewhere. Set `PYTHON` to the full path of the intended Python 3.13 executable before running `pnpm setup:python`. If Python cannot create a venv, install venv/ensurepip support for that interpreter or use Docker. |
| `spawn java ENOENT`, `javac` is missing, or Java source version is unsupported | Install a Java 21 **JDK**, check both Java version commands, and ensure `JAVA_HOME`, if set, points to the JDK directory rather than its `bin` directory or an older JRE.                                                                                                         |
| Windows and WSL commands behave differently                                    | Use one environment consistently for installation and startup. In WSL, `which node` and `which pnpm` should identify Linux tools, not Windows `.exe`/`.cmd` wrappers. Recreate the inventory virtual environment when changing operating environments.                            |
| A physical phone cannot load data                                              | Its localhost address is the phone itself. Use the browser-preview route first; physical devices need the additional LAN configuration described above.                                                                                                                           |
| Data seems different between Docker and pnpm                                   | They use separate storage. Apply the reset instructions for the mode you are actually running.                                                                                                                                                                                    |

Some business behavior and historical information are intentionally imperfect because this is the investigation dataset. Use the ordinary demo above to distinguish a general startup problem from a business scenario. You do not need to repair every discrepancy before starting your Context Service work.

## Optional validation commands

These checks are useful when changing the business applications. You do not need to complete a full build or test run just to inspect the repository. For the complete local check sequence, install the pnpm-route prerequisites and complete its first-time setup, then run:

```sh
pnpm build
pnpm check-types
pnpm lint
pnpm test
pnpm smoke
pnpm corpus:check
```

- `build` compiles the web/backend packages and exports both Expo apps for web. It does not perform signed Android/iOS builds.
- `check-types`, `lint`, and `test` run the configured workspace checks, including the Python and Java checks.
- `smoke` starts six temporary backends with isolated data, checks representative requests, and shuts them down. It uses ports **15101–15106**, rather than the ordinary development ports. Choose another range with `SMOKE_PORT_BASE` if needed.
- `corpus:check` verifies the knowledge-file counts, PNG files, and application workspace count. It requires Node and pnpm, but no running backends.

## Participant snapshot

```sh
pnpm export:participants
```

This creates a clean file snapshot under `.runtime/exports/` and prints its path. It excludes local environments, generated data, build output, and organizer materials. The export uses an explicit file allowlist and does not depend on which files have been staged in Git.

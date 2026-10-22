# Restore the demo dataset


Stop all profiles before running `pnpm db:reset`. The reset command removes only the four named generated service directories under `.runtime/`, rebuilds shared utilities, and initializes each store from committed migrations and fixtures. It refuses custom DATA_DIR overrides.

Use reset after manual inventory adjustments or experiments that create additional orders and charges. Initialization without reset preserves existing records. There are twelve customers, fifteen products, twenty seeded orders and charges, and ten employees.

User, order, and inventory each own a separate SQLite file. Payment owns its JSON document file. Do not open another service's file for writes. HR snapshots are committed JSON and are unaffected by reset. A reset does not clear participant exports or other unrelated files under `.runtime/`.

Docker volumes are separate from host runtime directories. `docker compose down` preserves them; remove the relevant project volumes explicitly when a container dataset needs to be restored. Do not run host reset expecting it to change a Compose volume.

# Runtime configuration reference


Maintained by Developer Experience, 2026-09-18.

Backends accept PORT and HOST. Node defaults bind to loopback. Compose binds within the container and publishes ports on host loopback. DATA_DIR applies only to writable stores; the HR directory reads committed fixtures.

Gateway and order-service use USER_SERVICE_URL, PAYMENT_SERVICE_URL, and INVENTORY_SERVICE_URL as appropriate. Gateway additionally uses ORDER_SERVICE_URL. HR uses USER_SERVICE_URL for explicit account lookups. HTTP requests have bounded timeouts and propagate request IDs.

Browser applications use NEXT_PUBLIC_GATEWAY_URL, VITE_GATEWAY_URL, VITE_INVENTORY_URL, or VITE_HR_URL. Expo uses EXPO_PUBLIC_GATEWAY_URL and EXPO_PUBLIC_HR_URL. Public variables are included in client bundles and must never contain credentials.

The local applications have no database-server connection strings. They need filesystem access for SQLite and JSON persistence. Port overrides must be reflected in downstream URL overrides; changing one port does not rewrite other processes' configurations.

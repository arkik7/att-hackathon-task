# Stock / inventory-service

Core Platform handbook · 2026-02-17

Core Platform owns Stock and its Redis read cache. Escalate availability incidents to the Core Platform rotation. Clients read products from the cache-backed catalog API; writes invalidate the cache.

Stock runs on port 5005 in the development environment. Keep SKU identifiers intact when moving between the catalog and the checkout quote. A display name is not a stock key.

The warehouse console migration is scheduled after gateway adoption. Until the migration plan is approved, support should capture the SKU, requested quantity, and observed count when reporting failed checkouts. The diagram in the winter architecture pack shows the cache placement.

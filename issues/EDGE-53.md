# EDGE-53: Console stock writes through Edge

Deferred · 2026-07-17

Admin stock adjustments currently use inventory-service directly. Product and order read aggregation already exists in Edge. The write interface still needs review.

ADR-005 permits the temporary exception. Keep VITE_INVENTORY_URL in the console environment example until migration is complete. There is no accepted removal date. A diagram showing the target topology should not be used as proof that this ticket is done.

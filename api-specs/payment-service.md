# Create simulated charge contract

Interface review: 2026-09-12.

Charge Ledger accepts an Idempotency-Key header. Repeating the same key and request body MUST return the original charge identifier and MUST NOT create another charge. Conflicting reuse should return 409. The simulator records provider.name=ledger-sim and performs no network settlement.

The machine-readable contract is `payment-service.openapi.json`. Important payload names: order_id amount_minor currency payment_token. Review routes, data models, and callers together when assessing change impact. Contract expectations and runtime behavior should be checked independently.

# Product catalog contract

Interface review: 2026-09-12.

Stock reads and quotes use its SQLite store. Availability is a quote, not a reservation. Requests exactly equal to available stock should be accepted. Adjustments cannot make the resulting stock negative. Supply Operations owns this interface.

The machine-readable contract is `inventory-service.openapi.json`. Important payload names: sku name price_minor stock_on_hand location. Review routes, data models, and callers together when assessing change impact. Contract expectations and runtime behavior should be checked independently.

# Create order contract

Interface review: 2026-09-12.

Orders accepts unique SKU rows with positive integer quantities. Reads return total_minor and a charge_id. The customer context is carried using x-demo-user-id in the local environment. Individual order reads must enforce the same ownership rule as lists.

The machine-readable contract is `order-service.openapi.json`. Important payload names: customerId items paymentToken. Review routes, data models, and callers together when assessing change impact. Contract expectations and runtime behavior should be checked independently.

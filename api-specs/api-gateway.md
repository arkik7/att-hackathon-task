# GraphQL query contract

Interface review: 2026-09-12.

Edge exposes REST forwarding and a small GraphQL query surface. products reads inventory, customer reads Accounts, and order enriches an Orders response with customer and charge fields. This schema does not provide subscriptions or HR mutations.

The machine-readable contract is `api-gateway.openapi.json`. Important payload names: query variables. Review routes, data models, and callers together when assessing change impact. Contract expectations and runtime behavior should be checked independently.

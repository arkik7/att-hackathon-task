# Customer profile contract

Interface review: 2026-09-12.

Accounts v2 returns account_status and customer_tier. Employee records are not stored here. Earlier Accounts examples used a different route and response names.

The machine-readable contract is `user-service.openapi.json`. Important payload names: id display_name email account_status customer_tier. Review routes, data models, and callers together when assessing change impact. Contract expectations and runtime behavior should be checked independently.

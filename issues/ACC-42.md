# ACC-42: Accounts v2 rollout

Closed · 2026-03-18

Expose GET /v2/users/:id with display_name, account_status, and customer_tier. Migration 002 renames the old status column and adds the tier. Gateway and Orders callers must use the new route.

Completion: implementation and schema changes merged into the local release. Support documentation refresh was assigned separately. A missing v1 route is expected after this rollout; do not restore it solely to satisfy a copied example.

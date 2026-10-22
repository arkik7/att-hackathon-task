# SEC-22: Compare order list and detail scope

Open · 2026-09-11

The local header selects a synthetic customer context. Order-list filtering appears to honor it. Review individual order lookup using a record owned by a different customer and compare the branches.

Keep authentication simulation separate from authorization. Even when the caller selects a demo identity, handlers can still enforce ownership consistently. Capture request and response IDs when documenting the behavior. No real customer data is present.

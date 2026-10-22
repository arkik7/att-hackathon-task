# Support access model

Support enablement · 2026-07-02

Customer context is carried from the gateway to Orders. Order-list endpoints are scoped to that context. Individual order lookup must apply the same customer ownership check before returning a record.

The local demo identity header is a testing convenience and can be selected by the person running the stack. It is not a substitute for production authentication. Support examples still assume the service enforces object ownership consistently across its read endpoints.

When investigating authorization, compare a list request and a detail request using two distinct customer IDs. A successful list restriction does not prove the corresponding detail handler applies the same rule.

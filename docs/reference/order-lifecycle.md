# Order lifecycle


Commerce Core reference, refreshed 2026-09-12.

An order request contains customerId, a list of unique SKUs and positive integer quantities, and a demo payment token. The caller supplies a customer context. Accounts must report an active account before a quote can be accepted.

Orders requests availability and current prices from Stock, computes no independent pricing rules, then requests a charge from Charge Ledger. It persists a confirmed or declined order with the charge reference. A declined request returns HTTP 402 with the saved order body.

Availability is a quote, not a reservation. Checkout does not decrement inventory in this demonstration. Operations changes stock through adjustments. There is no shipment workflow, tax engine, refund state machine, or distributed transaction coordinator.

Prices and totals are integer USD minor units. An order stores a customer identifier rather than copying a customer record. The GraphQL order view enriches that record by looking up the customer and charge separately.

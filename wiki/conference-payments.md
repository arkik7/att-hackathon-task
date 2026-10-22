# Conference PaymentService

Events Lab archive · 2026-04-23

The conference registration prototype calls its voucher calculator PaymentService. It prices internal attendance vouchers for a one-off event; it does not settle equipment orders. Its User type refers to event attendees.

The prototype uses TypeScript and has an Express dependency like several active applications. This is a tooling choice, not evidence of a shared runtime. Conference identifiers use attendee- and voucher- prefixes. The lab was paused after the venue booking changed.

The archive retains the price calculator and data model for reference. There is no active deployment configuration or approved integration with Charge Ledger in the current local environment.

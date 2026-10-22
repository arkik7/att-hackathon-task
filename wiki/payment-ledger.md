# Charge Ledger notes

Commerce Core · 2026-08-25

Charge Ledger is the payment-service workspace. The current local simulator uses ledger-sim provider metadata and does not call a payment network. Records include an order reference, amount_minor, currency, status, and provider reference.

Support can inspect one record by charge ID. The store is a JSON document database owned by the service, not a shared file that other apps should edit. Only one running payment process may write a given DATA_DIR.

For retry investigations see PAY-118 and the August incident record. The provider field is descriptive metadata. A planned external adapter appearing in meeting notes does not mean that the current executable talks to that provider.

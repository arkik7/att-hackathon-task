# Charge retry runbook


On-call quick reference, 2026-08-22. Related: PAY-118 and INC-2026-08-19.

Before retrying, capture the request ID, order reference, idempotency key, and any charge ID already returned. Check Charge Ledger rather than assuming that a client timeout means no charge was created. The simulator does not contact a payment provider.

If a confirmed charge exists, preserve both references for investigation. Do not delete documents from the running JSON store. Only the owning service may write it. The normal support flow can inspect one charge by ID; broader file inspection is a local engineering action.

Payment contracts describe the client retry expectation. Confirm actual behavior before enabling automatic retries in a new client. A gateway timeout and an upstream validation failure have different recovery implications.

After a reproduction, stop the stack and reset the local seed data. Incident examples use synthetic amounts and tokens; no financial remediation is required for this dataset.

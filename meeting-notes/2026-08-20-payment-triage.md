# Payment retry triage

2026-08-20 · Attendees: Erin / Support

Support has two charge references associated with the same request key. The browser may have retried after a slow response, but the request timeline is incomplete. Preserve both documents before resetting the local store.

The payment contract says the same key should return the original charge. We need to inspect the handler, not just the contract. PAY-118 tracks the investigation.

A future provider adapter was mentioned again. No external payment traffic was observed in this reproduction; the provider metadata says ledger-sim.

## Timeline from support (times approximate)

| Time | Observation | Confidence |
|---|---|---|
| 10:14 | First request submitted | request captured |
| 10:14–10:15 | Browser waited, then retried | client trace incomplete |
| after retry | Two charge IDs reported | document references captured |

A provider issue was floated during the call. Nobody had a provider network trace. Also discussed: expense lunch receipts, moved to Finance office hours.

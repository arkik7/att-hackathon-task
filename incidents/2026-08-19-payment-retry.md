# Two successful charge references

Investigation in progress.

At 10:14 a client submitted a simulated charge. A slow response was followed by a retry using the same idempotency key. The stored documents had distinct charge IDs and the same key.

The provider metadata was ledger-sim. There was no outbound payment network traffic. Support initially suspected provider retry behavior, but the local handler and file contents need review first.

PAY-118 tracks the discrepancy with the published contract. File-write serialization was already present, so overlapping filesystem writes are not a sufficient explanation. Preserve the request sequence before resetting data.

# People application logging

People Systems operations guide · 2026-08-14

Directory lookup logs contain only the request ID, employee identifier, and outcome. Email addresses and full employee snapshots are masked before a line is emitted. This allows support engineers to correlate requests without copying personal attributes into logs.

For troubleshooting, request the identifier and approximate time, then locate the request ID. Do not paste entire employee records into a ticket. Leave data is a snapshot and should be described as such when answering support questions.

If a downstream Accounts lookup fails, record the dependency error type and preserve the original request ID. A failed customer lookup does not mean the employee has left the organization.

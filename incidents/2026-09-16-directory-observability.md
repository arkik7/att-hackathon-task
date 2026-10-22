# Directory attributes in lookup output

Review requested.

A developer looked up emp-001 and observed work-email text in a directory.lookup line. The browser response was correct. The concern is the log content, not a broken directory lookup.

The operations guide describes masking. Inspect the Java path used by profile and leave requests before assuming the same behavior as the Accounts logger. The samples are synthetic, but the pattern would matter with production records.

SEC-29 owns the review. No payroll or SSO traffic was observed. The team asked for a short evidence excerpt rather than a complete employee dump in the ticket.

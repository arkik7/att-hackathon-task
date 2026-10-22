# Data options / working notes

2026-02-05 · Attendees: Tomas, Erin

Decision for the teaching build: embedded files, no hosted database prerequisite. Accounts and Orders need SQL migrations people can inspect. Charge Ledger needs to retain nested provider metadata, so Erin will try a document-shaped store.

We discussed MongoDB and PostgreSQL as production analogues. Neither is a required local service. Do not copy candidate infrastructure into Compose as if it were approved.

Unresolved: the next UI review date. The design team also asked for fewer accent colors in admin.

# API review: Accounts and money

2026-03-10 · Attendees: Identity Platform + Commerce Core

Accounts will rename status to account_status and add customer_tier. The v2 route returns display_name, matching the database field. Old examples using name need a client mapping or a refresh.

Orders will convert total to total_minor through migration 002. Charge Ledger accepts amount_minor; GraphQL should expose the same units rather than converting for display.

Action: update support snippets after release. Nobody volunteered to edit the winter wiki pages during the call. The rollout ticket is ACC-42.

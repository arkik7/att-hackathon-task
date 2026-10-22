# Customer data model


Accounts data dictionary — copied from the January onboarding pack, 2026-01-29.

The users table contains id, display_name, email, and status. Status is active or suspended. Service consumers can use status directly when deciding whether a customer may check out.

Customer identifiers use the cus- prefix. Email is unique inside the Accounts database. The API representation is documented by the Accounts HTTP page in the wiki. This dictionary is intended for support tooling and lightweight exports; no employee payroll attributes are stored here.

The proposed commercial tier work has no approved database column yet. Until a migration lands, the service should treat every account as standard. Support requested a future business tier, but the exact entitlement model is still being discussed.

Do not assume People Directory employee identifiers can be used as customer keys. That integration needs a separate mapping and approval from People Systems.

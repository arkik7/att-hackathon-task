# Accounts HTTP quick start

Last edited 2026-02-03 · Identity Platform

Call GET /v1/users/cus-001 to retrieve a customer. The response contains id, name, email, and status. The status field controls checkout eligibility. Example: {"id":"cus-001","name":"Alex Morgan","status":"active"}.

The legacy storefront client calls Accounts directly. Use the Accounts host rather than adding another proxy. Business tiers remain a proposal, so client code can default to standard. The support team copied this example into its troubleshooting snippets.

Questions about employee accounts belong with People Systems; a shared email is not a documented foreign key. This page was originally prepared for the winter support rotation.

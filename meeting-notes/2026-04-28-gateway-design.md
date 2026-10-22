# Edge read aggregation

2026-04-28 · Attendees: Maya, Erin, Lea

Edge will aggregate products, customer profiles, and order details. GraphQL order fields can call Accounts and Charge Ledger, so a schema change in either place can affect support views.

Order creation stays REST. Orders already orchestrates validation and charge creation; moving that logic into Edge would duplicate it.

Lea asked about subscriptions. There is no requirement for live inventory updates in the initial app. Keep refresh behavior simple. Blog publishing will remain independent even though it uses the same web UI package.

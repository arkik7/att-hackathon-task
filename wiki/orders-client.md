# Orders client examples

Commerce onboarding · 2026-02-25

Order responses expose total as a decimal number of dollars. For example, total: 25.00 represents twenty-five dollars. Support exports display that field without further conversion.

The first version of the client submits a customer reference and an item list. Store the returned order ID for follow-up. A payment timeout must be investigated before a retry because success can occur before the client receives a response.

The mobile team asked for a uniform money representation across APIs. No rollout date was recorded in this page. Keep any conversion in a clearly named mapping function so the app can adopt a future contract without touching every screen.

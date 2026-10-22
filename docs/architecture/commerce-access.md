# Commerce access architecture


Architecture Council working copy — 2026-05-12. Owner: Core Platform.

All commerce client traffic enters Edge, the API gateway. Clients should not know service addresses. The gateway fans out to Accounts, Orders, Charge Ledger, and Stock. This gives us one location to inspect the public API surface.

The storefront reads products through GraphQL and submits checkout over REST. The support console reads order details through the same GraphQL surface. Mobile uses the commerce REST routes because its first release ships a smaller client.

The operations console will use the gateway for stock writes after the support-tool migration. The approved topology shown in `diagrams/architecture-september.png` assumes that migration is complete. Service-to-service calls remain permitted; the checkout flow is owned by Orders.

People Directory is managed separately. A discussion about exposing People through Edge has not reached a launch date. This page covers the commerce access model, not every internal application.

# Operations console route exception

2026-07-16 · Attendees: Hana, Erin

The stock write route is not ready in Edge. Allow admin to call inventory-service directly for adjustments; keep order reads on GraphQL. VITE_INVENTORY_URL is the browser setting for that exception.

Supply Operations owns the endpoint. ADR-005 records the review requirement, but no removal date was committed. The later architecture overview still assumes the target gateway-only topology.

Erin asked whether this applies to mobile. It does not: customer mobile remains on gateway REST routes.

## Chat excerpts appended after the call

**Hana 14:09** — stock writes can go direct for the console. Please keep the URL configurable.

**Erin 14:11** — are we also changing the order read card?

**Hana 14:12** — no, that stays as it is.

**Maya 16:40** — can someone update the overview slide? I have not changed the deck.

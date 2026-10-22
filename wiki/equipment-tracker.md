# Workplace equipment inventory

Workplace Tools notes · 2026-05-28

The facilities tracker records chairs and office equipment assigned to rooms. Inventory is the name of its local data model. Items use asset identifiers and room locations rather than sellable SKUs.

The prototype has a GraphQL schema and a SQLite schema, which resemble technologies in commerce. It has its own table definitions and was maintained by Workplace Tools. Do not reconcile its asset counts with Supply Operations product quantities.

An old discussion suggested a future import from purchasing. No endpoint, schedule, or data contract was signed. The retained source is a project fragment, not a running service in the Northstar development profiles.

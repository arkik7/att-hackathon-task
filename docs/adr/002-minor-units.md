# Represent money in minor units

Date: 2026-03-11
Status: Accepted

Migrate Orders from decimal total to integer total_minor. Inventory already quotes price_minor, and Charge Ledger accepts amount_minor. Consumers must update field mappings, not multiply twice. The SQL migration retains historical evidence of the earlier shape. No multi-currency conversion is part of this release.

Review changes against the relevant service implementation and release records. The decision applies to the named component and environment; it does not establish ownership of similarly named modules elsewhere in the repository.

# ORD-76: Order total mapping

Closed · 2026-03-21

Update display formatting to use total_minor. Do not continue reading total from the saved order. A value of 2500 represents USD 25.00.

The migration converts existing decimal values once. Consumers must not convert an already minor-unit value again. GraphQL exposes the stored unit. This ticket covers the executable storefront and support lookup, not every historical spreadsheet or wiki example.

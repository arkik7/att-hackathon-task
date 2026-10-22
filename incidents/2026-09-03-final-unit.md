# Field Toolkit availability rejection

Open / Supply Operations.

A fresh catalog showed one unit of NS-015. A quote for one unit returned insufficient stock. The same user could quote one NS-001 with a larger stock count.

The failure happened before charge creation. Gateway forwarding preserved the inventory error. A direct inventory request reproduced it, reducing the likelihood of a GraphQL or mobile formatting problem.

Next step is to compare requested quantity with the Python availability condition and SQL value. Ownership transferred to Supply Operations in July; the older Core Platform wiki escalation delayed initial triage.

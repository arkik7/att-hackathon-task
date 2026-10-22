# Local persistence for the teaching environment

Date: 2026-02-05
Status: Accepted

Use embedded SQLite for relational state and a small local document store for charge records. Each service owns its files. This keeps setup independent of hosted databases and makes schemas inspectable. The choice describes the executable teaching environment; references to hosted infrastructure in broader proposals do not themselves establish a deployed dependency.

Review changes against the relevant service implementation and release records. The decision applies to the named component and environment; it does not establish ownership of similarly named modules elsewhere in the repository.

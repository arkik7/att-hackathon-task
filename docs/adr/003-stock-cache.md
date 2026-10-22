# Remove the stock read cache

Date: 2026-06-04
Status: Accepted

Remove Redis from the local inventory path. Stock reads and availability now use SQLite directly. The cache added an unnecessary invalidation path after manual adjustments. Remove its environment variable and Compose service along with the client adapter. This decision does not authorize unrelated projects to change their own cache configuration.

Review changes against the relevant service implementation and release records. The decision applies to the named component and environment; it does not establish ownership of similarly named modules elsewhere in the repository.

# Stale stock count after adjustment

Closed after local cache removal.

The warehouse console displayed a count different from a fresh SQL read. The January architecture included a cache, and the old deployment carried a Redis setting.

Supply Operations tested a direct SQLite read after manual adjustment. The team chose to remove the local cache rather than add invalidation machinery to the teaching build. ADR-003 and INV-190 record the follow-up.

This incident describes the June transition. It does not establish that a cache still sits on the September availability path. Keep runtime configuration and historical diagrams separate when reconstructing the sequence.

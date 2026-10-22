# Stock cache removal

2026-06-04 · Attendees: Supply Operations / Core Platform

Repeated stale reads after manual adjustments made the Redis path more trouble than it was worth for the local build. Decision: read products and availability from SQLite directly.

Remove REDIS_URL and the local cache container. ADR-003 records the reason. The winter architecture slide still has the cache box; we will keep it with the old planning material.

The ownership transfer is a separate topic. Supply Operations is preparing a handover checklist, with an effective date next month.

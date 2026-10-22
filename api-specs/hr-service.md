# Employee directory contract

Interface review: 2026-09-12.

People Directory is read-only. Leave endpoints return dated snapshots. Customer lookups use an explicit mapping and return linked=false when no mapping exists. A failed mapped lookup returns a dependency error rather than silently pretending the link is absent.

The machine-readable contract is `hr-service.openapi.json`. Important payload names: employee_id display_name work_email department. Review routes, data models, and callers together when assessing change impact. Contract expectations and runtime behavior should be checked independently.

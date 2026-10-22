# People identity workshop / rough notes

2026-08-06 · Attendees: Sam, Noor, Identity Platform

We might use subjectId for employee/customer relationships, but which issuer owns it? Offboarding and account deletion behavior are unresolved. Payroll could be a consumer if a separate interface is approved.

Sam can ship a read-only mapping of a few explicit employee IDs to customer IDs. This does not require SSO. The broader design remains a proposal under ADR-004.

Noor drew a dashed arrow on the workshop image. Dashed means open discussion here; it is not a delivery commitment. Follow-up date: TBD.

---

Whiteboard scraps transcribed by Sam:

```text
subjectId = ??? issuer
customer survives employment?
leave -> identity? probably not a field sync
payroll owner absent
```

No sign-off captured. Noor will invite the issuer owner next time; invitation date is blank in the action list.

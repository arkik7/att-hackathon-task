# People and customer account linking


People Systems design note, 2026-09-08. Status: limited read integration.

Some employees also have customer accounts. An explicit properties file maps selected emp- identifiers to cus- identifiers. The People Directory uses that mapping to request a profile from Accounts v2. It does not infer identity from display name or email.

An employee with no entry is a valid case: the endpoint returns linked=false and customer=null. A mapped account lookup that cannot reach Accounts is a dependency failure, not evidence that the person has no account.

The initial integration is read-only. It does not create users, synchronize leave balances, share database tables, or establish SSO. Employee records stay in the directory snapshot. Customer account status remains owned by Accounts.

A future identity proposal uses the term subjectId but has unresolved issuer and lifecycle questions. Do not extend the mapping file into a universal identity graph without a separate decision.

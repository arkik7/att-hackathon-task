# Repository validation workflow


Developer Experience / 2026-09-20.

The GitHub Actions workflow runs on pushes, pull requests, and manual dispatch. It installs Node, pnpm, Python, and a Java JDK. Permissions are read-only for repository contents; it does not deploy or send notifications.

Validation installs the frozen lockfile, creates the inventory virtual environment, checks the corpus shape, initializes local data, builds applications, checks types and lint, runs service tests, and exercises the isolated smoke flow. A final reset verifies restoration, and participant export checks packaging.

Expo validation produces web output. Native application signing and store publication are outside the workflow. Smoke data is temporary and does not overwrite developer stores. Docker image building is optional and separate from this workflow.

Failures should name the affected command. Investigate missing runtime versions and initialization failures before changing business logic. Historical documents are source material, so CI does not automatically rewrite them to match current implementation.

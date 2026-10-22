# SEC-29: Directory logs need review

Open · 2026-09-16

The People logging guide promises masked employee attributes. A support engineer noticed directory.lookup lines that appear to contain more than an identifier.

Inspect the Java handler for profile, leave, and linked-account requests. A successful response does not prove that the logging policy is applied. Use only the synthetic fixture records when reproducing, and avoid copying complete log bodies into shared incident summaries.

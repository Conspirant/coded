# KCETCoded Documentation

This directory is the maintained, code-grounded documentation set for KCETCoded. It describes the repository as it exists, not an aspirational product plan.

| Document | Purpose | Audience |
| --- | --- | --- |
| [Platform documentation](PLATFORM_DOCUMENTATION.md) | Product, architecture, routes, data, APIs, operations and development workflow | Engineering, product, leadership and audit reviewers |
| [Technical reference](TECHNICAL_REFERENCE.md) | Detailed module, API, database, build, test and repository implementation reference | Engineering and technical audit reviewers |
| [Security and data governance](SECURITY_AND_DATA_GOVERNANCE.md) | Data inventory, trust boundaries, security posture, risks and required controls | Engineering, operations and compliance reviewers |
| [Operations runbook](OPERATIONS_RUNBOOK.md) | Local setup, releases, data refreshes, incident response and checks | Developers and operators |

## Document control

| Field | Value |
| --- | --- |
| System | KCETCoded |
| Repository package | `kcet-compass` |
| Documentation status | Internal / official operational documentation |
| Baseline | Repository inspected on 6 August 2026 |
| Owner | Project maintainers |
| Review cadence | Before every production release and after any database, API, payment or data-pipeline change |

## Documentation standard

Statements in this directory are based on source files in this repository. A capability is described as active only when it is wired into the current application or deployment configuration. Known security and quality limitations are deliberately included. Nothing here represents KCETCoded as affiliated with KEA, COMEDK, Razorpay, Supabase, Vercel, NVIDIA, or any government body.

The top-level `README.md` remains the quick-start and public overview. Older root-level documents are retained as historical working material; this directory should be used for operational reference.

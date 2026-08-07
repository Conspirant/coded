# KCETCoded Security and Data Governance

## 1. Status

This is an engineering security assessment of the repository baseline, not a claim of certification or legal compliance. It identifies controls present in code and gaps that require remediation before a high-assurance or large-scale deployment.

## 2. Data inventory

| Data class | Examples | Storage / transit |
| --- | --- | --- |
| Public admissions data | Cutoffs, college names, course data, source PDFs | Static repository artifacts and browser downloads |
| User-provided academic information | Marks, PUC aggregate, rank, category, preferences | Browser state; rank submissions; selected Supabase records |
| Result lookup information | Application number and parsed result details | `/api/check-result`, transient processing and `ugcet_results_cache` |
| Community content | Reviews, comments, reports, suggestions | Supabase |
| Payment/support information | Donation amount, donor name, anonymous preference, access code | Razorpay flow and Supabase `donors` / `access_codes` |
| Technical data | Browser storage, request metadata, Vercel analytics | Browser, Vercel and third parties |

Personal data must be minimised. Do not collect an application number, result content, contact details or donor identity unless the feature has a documented purpose, retention period and deletion path.

## 3. Trust boundaries

1. The browser is untrusted. Local storage, client-side access flags and client-side passphrases can be modified by the user.
2. Supabase anon access is public by design. Row Level Security (RLS) is the boundary that must protect records.
3. Vercel functions are the server-side boundary for secrets and privileged actions.
4. Razorpay, NVIDIA, KEA, Supabase, Vercel, Google ad services, Reddit and other configured third parties are external dependencies with their own policies and availability.
5. Static data is only as trustworthy as its source, extraction and validation process.

## 4. Controls currently visible

- Payment signatures are verified server-side using Razorpay’s HMAC scheme before the API reports success.
- Vercel configuration sets a Content Security Policy, frame denial, `nosniff`, a referrer policy and a permissions policy.
- Database schema enables RLS on several tables.
- Some review workflows use validation/sanitisation helpers.
- API routes reject unsupported HTTP methods and validate a portion of required request fields.
- Data and prediction pages contain a non-official/verify-source product posture.

These controls are partial. They do not by themselves establish secure authorization, abuse protection or regulatory compliance.

## 5. Material risks and required action

| Priority | Finding | Impact | Required action |
| --- | --- | --- | --- |
| Critical | `VITE_ADMIN_PASSPHRASE` is used by a browser admin gate. Build-time `VITE_*` values are public. | Any determined visitor can extract/bypass the gate. | Replace with Supabase Auth or a server-side identity provider and enforce RBAC in RLS and server endpoints. |
| Critical | Client-side access unlock and browser-stored codes are used for premium presentation. | Gated UI can be bypassed; revenue/content controls are not reliable. | Enforce entitlement on the server for every protected API/data action; treat UI flags only as convenience. |
| Critical | Broad public INSERT/UPDATE/DELETE policies appear in `supabase/schema.sql` for sensitive/community/admin-facing tables. | Anonymous tampering, deletion or spam may be possible if deployed. | Audit the live database policies table by table; remove public mutation policies and implement owner/admin checks. |
| High | Fallback Supabase URL/anon key are embedded in client and API source. The anon key is intended to be public, but API fallback and RLS assumptions are opaque. | Misconfiguration can silently connect to the wrong project; public endpoints depend on RLS correctness. | Remove fallbacks from server code, fail closed when configuration is absent, audit live RLS and rotate keys only when appropriate. |
| High | `VITE_OPENROUTER_API_KEY` is referenced from client code. | If configured, a paid private API key is shipped to users. | Move the request behind a server endpoint and revoke/rotate any exposed key. |
| High | AI, result-check and payment APIs have no evident comprehensive rate limiting, request-size control or abuse monitoring. | Cost abuse, scraping, denial of service and provider quota exhaustion. | Add edge/server rate limits, schema validation, payload caps, observability and per-route abuse controls. |
| High | `share` interpolates query values in HTML. | Reflected HTML/script injection risk if parameters are malicious. | Escape values and restrict redirect path to safe same-origin relative paths. |
| High | Result lookup proxies KEA and caches result data. | Sensitive student data may be retained or exposed under weak policy. | Document legal basis, minimise cache fields/TTL, require consent, protect access, provide deletion, and assess official-site terms. |
| Medium | Broad `unsafe-inline` and `unsafe-eval` CSP directives reduce XSS protection. | Larger blast radius if HTML/script injection occurs. | Remove unsafe directives incrementally using nonces/hashes and production testing. |
| Medium | Payments trust client-supplied amount/donor metadata after checkout initiation. | Ledger/data integrity issue if request data is manipulated. | Retrieve and verify order/payment attributes from Razorpay server-side; persist authoritative amounts only. |
| Medium | Raw source data, debug output and backup files are stored in repository. | Accidental distribution of confidential or poor-quality artifacts. | Classify assets, remove secrets/PII, establish retention rules and use release-only data packages. |
| Medium | Tests do not demonstrate policy, auth, payment, API or end-to-end coverage. | Regressions in high-risk flows may reach production. | Add automated tests and release gates for these flows. |

## 6. Required operating rules

### Credentials

- Store server secrets only in Vercel/Supabase secret management or an approved secret manager.
- Never use a `VITE_*` variable for a secret.
- Rotate a credential immediately if committed, copied into an issue, exposed in a build, or sent to an unapproved party.
- Separate development, staging and production credentials.

### Database

- Apply migrations in a non-production environment first.
- Enable and test RLS for every exposed table.
- Use least privilege: anonymous users should only read/write exactly what the feature requires.
- Do not give browser clients direct write access to donor records, access codes, admin activity or moderation outcomes.

### Personal data

- Collect only the inputs necessary for the current request.
- Do not log application numbers, results, payment signatures or API keys.
- Define retention and deletion procedures for cached results, reviews/reports and support records.
- Keep privacy and payment-policy pages aligned with actual collection and sharing practices.

### Data quality

- Retain official raw sources with provenance.
- Keep source, transform, validator version and release identifier together.
- Require a human spot-check for high-impact cutoff releases.
- Clearly label estimates, community reports and imported data differently from official documents.

## 7. Incident response baseline

1. Contain: disable the affected API/feature, revoke compromised credentials, or remove the affected deployment.
2. Preserve evidence: deployment ID, relevant logs, request identifiers, source artifact version and timeline. Do not preserve unnecessary personal data.
3. Assess scope: data type, affected users, ability to modify records and third-party exposure.
4. Eradicate: patch code/policy/configuration, rotate credentials and deploy a verified fix.
5. Notify: follow the applicable legal and contractual notification requirements; do not make unsupported public statements.
6. Learn: document root cause, corrective action and a test/control that prevents recurrence.

## 8. Acceptance criteria for a production security milestone

Before calling the system production-ready for accounts, payments or sensitive result data, complete all critical items in section 5, test live RLS policies, remove client-held private keys, add server-side authorization/rate limiting, audit payment verification with test transactions, and approve a privacy/retention policy against the actual data flows.

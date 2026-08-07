# KCETCoded Operations Runbook

## 1. Local setup

```powershell
npm install
Copy-Item env.example .env
npm run dev
```

Fill `.env` with non-production development values. For payment/API testing, use separate sandbox credentials where the provider supports them. Do not commit `.env` or share it in chat, tickets or screenshots.

Before submitting a change:

```powershell
npm run lint
npm test
npm run build
```

If the change touches a Vercel function, Supabase policy, payment flow or external integration, run a representative manual test in the intended deployment environment as well.

## 2. Release checklist

1. Review `git diff` and ensure no `.env`, secret, raw personal-data or unintended generated artifact is included.
2. Run lint, unit tests and a production build.
3. Smoke-test route navigation, mobile navigation and static-data loading.
4. For data changes, complete the data-release procedure below.
5. For database changes, apply the reviewed migration in staging, validate RLS, then apply through the approved production procedure.
6. Verify Vercel environment variables are present and are classified correctly (`VITE_*` values are public).
7. Test relevant server routes: reject wrong method, reject invalid body, perform valid authorised request, and check error response does not leak a secret.
8. For payment changes, test order creation, cancellation, invalid signature and successful test payment; reconcile authoritative provider amount/order state.
9. Publish the deployment and execute the production smoke check.
10. Record deployment URL/ID, commit SHA, data version and rollback target.

## 3. Production smoke check

- Home page and key static assets return correctly.
- `/dashboard`, `/rank-predictor`, `/cutoff-explorer`, `/college-predictor` and `/cet-news` render without console failures.
- One KCET and one COMEDK data query return expected-looking results.
- Policy routes load.
- `/api/og` generates an image; `/api/share` redirects only to a safe internal path.
- Error states for AI/payment/result lookup appear usable when credentials or external providers are unavailable.
- Supabase-backed review/PYQ paths reflect expected permissions using an anonymous browser session.

## 4. Cutoff data release procedure

1. Create a branch and save the raw official source with its URL, publication date, download time and checksum in the release notes.
2. Run the relevant extraction/consolidation script. Script names are implementation aids, not an automatic guarantee of correctness.
3. Validate parse output: schema, year/round/category labels, rank value ranges, duplicate keys and row counts.
4. Compare against the preceding published dataset and investigate substantial differences.
5. Spot-check a representative sample against source PDFs/XLSX files, including common and edge categories.
6. Run applicable scripts under `scripts/validate-*`, `scripts/verify-*`, `scripts/test-*` or `scripts/audit-*`.
7. Update only the intended artifact under `public/data/` and preserve a recoverable prior version.
8. Check the explorer and predictor against the new artifact locally.
9. Obtain a second reviewer sign-off for a high-impact release, deploy, and record release provenance.

## 5. News refresh procedure

Use only the configured news scripts and approved data sources. Review the resulting `public/data/news.*` content before release for relevance, date, duplication, broken links, source attribution and misleading claims. If the automation relies on a key or webhook, configure it as a server-side secret and rotate it after suspected exposure.

## 6. Supabase changes

- Add a timestamped migration in `supabase/migrations/`; do not silently edit a deployed migration as a replacement for a new migration.
- Include table changes, indexes, RLS and policies in the same review.
- Test with the anonymous role, authenticated non-admin role and admin/service role as applicable.
- Regenerate/update `src/integrations/supabase/types.ts` after schema changes when type coverage is required.
- Verify no client query relies on a policy that grants broader access than necessary.

## 7. Handling common incidents

| Symptom | Immediate response |
| --- | --- |
| Cutoff data looks incorrect | Disable/rollback the affected artifact or feature, preserve the source/transform evidence, compare against original official material. |
| AI API cost/error spike | Disable public AI entry points or add restrictive rate limits, inspect request volume without logging private content, rotate key if exposed. |
| Payment verification failure | Stop claiming payment success, inspect Razorpay order/payment/signature server logs, reconcile before granting access. |
| Suspected database policy bypass | Restrict or disable affected policies/endpoints, capture logs, review RLS with direct role tests, rotate service credentials if implicated. |
| KEA result lookup failing | Disable or clearly mark feature unavailable; do not retry aggressively against the external site. |
| Secret committed or displayed | Revoke/rotate it immediately, replace deployment configuration, search history/build artifacts and document scope. |

## 8. Rollback

The preferred rollback is redeploying the previous known-good Vercel deployment or Git commit. For data-only regressions, restore the preceding versioned public artifact and deploy it. For a database migration, use a separately reviewed corrective migration; do not run destructive rollback commands on production without an approved backup and change record.

## 9. Documentation maintenance

Update the files in `docs/` whenever routes, API endpoints, environment variables, data sources, database tables/RLS, payment handling, privacy practices or deployment controls change. Documentation changes must state facts that the code/configuration supports and must retain known limitations until they are actually resolved.

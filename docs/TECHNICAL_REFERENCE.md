# KCETCoded Technical Reference

## 1. Scope and baseline

This reference records the current codebase baseline inspected on 6 August 2026. It is intended to be read with the [Platform Documentation](PLATFORM_DOCUMENTATION.md), [Security and Data Governance](SECURITY_AND_DATA_GOVERNANCE.md), and [Operations Runbook](OPERATIONS_RUNBOOK.md). It does not imply that every source file is publicly routed, production-ready, or currently used.

## 2. Application composition

### 2.1 Client modules

| Area | Main modules | Role |
| --- | --- | --- |
| Bootstrap and navigation | `main.tsx`, `App.tsx`, `Layout.tsx`, `AppSidebar.tsx`, `MobileNav.tsx`, `Navbar.tsx`, `CommandPalette.tsx` | Mounting, route rendering and navigation |
| Global context | `ExamModeContext.tsx`, `PresenceAndBlockProvider.tsx` | Exam selection and availability/presence state |
| Admission calculation | `rank-predictor.ts`, `comedk-rank-predictor.ts`, `cutoff-predictor.ts`, `round-drift-predictor.ts`, `mock-simulator.ts` | Model and simulation logic |
| Cutoff and college data | `cutoff-service.ts`, `college-service.ts`, `course-normalizer.ts`, `pdf-*`, `xlsx-loader.ts` | Data fetch, normalisation, source mapping and parsing |
| Community / feedback | `college-service.ts`, `feature-request-service.ts`, `poll-service.ts`, `popup-service.ts`, `actual-rank-service.ts` | Shared-data workflows |
| Payments / access | `unlock.ts`, `settings.ts`, `DonationButton.tsx`, `PremiumUpgradeModal.tsx` | Checkout, access-code and browser unlock state |
| AI | `AICounselor.tsx`, `ai-tools.ts`, `gemini.ts` | UI and AI request support |
| Practice | `pyqQuestionBank.ts`, `pyqPdfManifest.ts`, `PYQTest.tsx`, `DailyChallenge.tsx` | Question bank and practice flows |

### 2.2 Key page responsibilities

| Page | Responsibility |
| --- | --- |
| `Homepage` / `Dashboard` | Entry, summary and navigation surfaces |
| `RankPredictor` / `ComedkRankPredictor` | Marks-to-rank estimates |
| `CutoffExplorer` / `ComedkExplorer` / `CollegeCutoffs` | Historical cutoff search/filtering |
| `CollegePredictor` / `CollegeDetail` / `CollegeCompare` / `CollegeInfoHub` | College matching and research |
| `CutoffTrends` / `RoundPredictor` / `MockSimulator` | Trend, round and preference analysis |
| `Documents` / `MockVerification` / `RoundTracker` | Counselling guidance and preparation |
| `Reviews` / `CollegeReviewPage` | Community review display and submissions |
| `CETNews` / `InfoCentre` / `Materials` | Curated information and published resources |
| `AdminHub` / `AdminPYQ` and admin components | Operational tooling, management and moderation |

## 3. API implementation notes

### 3.1 AI functions

`api/nvidia-chat.ts` calls NVIDIA’s chat-completions endpoint using the configured `NVIDIA_API_KEY`, accepts a `messages` array, and streams the provider response. `api/ai-lister.ts` accepts candidate colleges plus rank/context, asks the same provider for a structured recommendation, then extracts JSON from the response. Neither route should be exposed broadly without hard input limits, response handling, rate limits, content safety controls and spend monitoring.

### 3.2 Payment functions

`api/create-order.ts` accepts a paise amount, validates it as an integer with a minimum of 100 paise, then creates a Razorpay order. `api/verify-payment.ts` validates the Razorpay HMAC signature. It can persist donor/access-code records through Supabase and returns an access code. The function is a payment verification boundary; client-side `unlock.ts` must not be relied on as an authorization boundary.

### 3.3 Result-check function

`api/check-result.ts` accepts a POST request, obtains the configured KEA result page, parses expected HTML patterns, and reads/writes `ugcet_results_cache`. It includes timeout handling and development/test paths. External markup can change without notice; parsing must be monitored during every result period. This workflow handles potentially sensitive academic information and needs documented consent, retention and access controls.

### 3.4 Social endpoints

`api/og.tsx` is an edge function that returns a generated Open Graph image with truncated title/subtitle values. `api/share.ts` returns share metadata and redirects a browser to a query-supplied path. These parameters must be encoded/validated to avoid unsafe HTML injection and open/internal redirect issues.

## 4. Supabase model and access model

### 4.1 Schema groups

The schema provides core tables for users, colleges, branches, cutoffs, seat matrices, reviews/comments, rank predictions, mock simulations, notifications and admin activities. Later migrations add anonymous review support, review reports, suggestions, actual-rank submissions, result cache, coping/return-vote features, donors, access codes and college suggestions.

The application also references table names that must be validated against the deployed schema and migration history, including `pyq_questions`, `ugcet_results_cache`, `donors`, `access_codes`, `college_suggestions`, `review_reports`, `college_comments`, `polls` and `popups`.

### 4.2 Access policy reality

`supabase/schema.sql` includes RLS enablement but also several permissive public policies. It must be treated as an implementation artifact, not proof that the live environment is safe. Verify the live project’s policies directly. Browser clients should have read-only access by default; writes should be limited to narrowly scoped user-owned records or mediated through a server function. Sensitive operations must use server-side authorization.

### 4.3 Client configuration

`src/integrations/supabase/client.ts` initialises a browser Supabase client with local-storage session persistence and includes a fallback project URL/anon key. An anon key is public configuration, but it is only safe when RLS is correct. Hard-coded fallback configuration makes environment separation and rotation harder and should be removed from server-sensitive paths.

## 5. Static data contract

The app consumes files in `public/data/` including KCET cutoff artifacts, COMEDK cutoff data, course mappings, source PDF page indexes, raw extraction text/tables and news artifacts. Multiple formats coexist (`.json`, `.dat`, `.csv`, `.xlsx`, PDFs). A release must identify exactly which artifact is live and which source/version generated it; otherwise screens may use inconsistent historical data.

The database is not the sole source of truth for cutoff browsing. Static artifacts are generally the high-volume operational source, while Supabase supplies selected shared data. Any migration to database-only data needs an explicit compatibility and performance plan.

## 6. Build, hosting and browser posture

Vite builds the client into `dist/`; Vercel serves the SPA and API/edge functions. `vercel.json` rewrites non-API routes to `index.html`, provides security headers, and disables caching broadly. Global no-store headers favour immediacy but can materially increase bandwidth, latency and hosting cost for large static data. Cache policy should be measured and revised with asset versioning rather than changed casually.

The public folder contains a PWA manifest and service worker. Presence of these files does not prove a complete offline guarantee; offline paths must be verified independently. Vercel Analytics is installed. The CSP permits multiple payment, ad, AI and social endpoints and retains `unsafe-inline`/`unsafe-eval`, which requires a hardening plan.

## 7. Test posture

The repository includes Vitest configuration and unit tests for rank prediction, round drift and mock simulation. There is no single demonstrated suite for: every route, UI accessibility, static-data schema validation at build time, payment verification, API request validation, RLS policy enforcement, result lookup, or production deployment smoke tests. These gaps should be considered release risks rather than assumed coverage.

Recommended minimum additions:

- Unit tests for every predictor/data-normalisation boundary.
- Contract tests for every public static artifact.
- API tests for method, malformed body, unauthorized action, rate-limit and provider-failure paths.
- Supabase policy tests using anonymous/authenticated/admin identities.
- End-to-end smoke tests for essential admissions journeys and payment callbacks.
- Accessibility checks for keyboard navigation, colour contrast and form errors.

## 8. Repository hygiene observations

The repository contains large raw datasets, PDFs, XLSX files, backup material, debug output, extraction work products, generated files and duplicate/alternate source modules. This supports research provenance but also enlarges clone/deploy contexts and obscures which artifacts are authoritative.

Adopt the following repository rules:

1. Keep a manifest of production-served artifacts with source/version/checksum.
2. Move large raw inputs and archive/debug material to a versioned data store where practical.
3. Mark generated files and provide reproducible generation commands.
4. Remove or archive duplicate components and unwired pages only through reviewed changes; do not delete unknown assets during feature work.
5. Keep code, migration and documentation changes aligned in the same pull request.

## 9. Non-negotiable production limitations

- A client-held admin passphrase is not secure administration.
- Local browser unlock state is not reliable access control.
- Predictions are estimates, not official counselling outcomes.
- Parsed external result pages can fail or be wrong when source markup changes.
- Static-data correctness depends on source provenance and human validation.
- Public Supabase access is only safe when live RLS policies are verified.
- A successful build does not establish payment, privacy, security or data correctness.

The project should be described externally in language consistent with these limitations until the underlying controls are implemented and independently verified.

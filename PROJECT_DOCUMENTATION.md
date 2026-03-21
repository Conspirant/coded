# KCETCoded
## Complete Project Documentation and Codebase Audit

Last audited against this repository on March 20, 2026.

> Important: This project is an independent student-built platform. It is not an official KEA product. All critical admission decisions should still be verified against official KEA documents.

## 1. What This Document Is

This file is a code-grounded description of the project that currently exists in this repository. It is not a marketing brochure, and it is not an aspirational roadmap pretending unfinished features already work. It is meant to answer a simple question honestly:

**What exactly is KCETCoded today, what pages and systems does it include, how does it work, what is impressive about it, what is weak about it, and where can it realistically go next?**

This document also deliberately standardizes the project name as **KCETCoded**, because the repository still contains multiple historical names:

- The user-facing product copy usually says `KCET Coded`
- The package name is still `kcet-compass`
- Older documents such as `README.md` still use `KCET Compass`

All of those names refer to the same project lineage. In this document, the canonical product name is **KCETCoded**.

## 2. Executive Summary

KCETCoded is a frontend-heavy, data-centric counseling and discovery platform for Karnataka engineering aspirants. Its central purpose is to take the messy, intimidating, hard-to-search public admission ecosystem around KCET and turn it into something navigable, searchable, transparent, and student-friendly.

At its core, KCETCoded does five things extremely clearly:

1. It converts official KEA cutoff data into a structured, queryable product surface.
2. It helps students estimate rank, shortlist colleges, inspect exact cutoffs, and rehearse option-entry decisions.
3. It adds student-support layers that official sources do not provide well: reviews, explanatory guides, planning tools, news digestion, and lightweight AI guidance.
4. It experiments beyond the usual counseling tools with commute-oriented filters, group-college discovery, hidden-value analysis, and gamified learning.
5. It keeps a strong transparency ethic: source links to official PDFs, visible disclaimers, no required sign-up, and a strong preference for local-first storage where possible.

This is not a thin website with one calculator. It is closer to a small counseling operating system built around three ingredients:

- a large static cutoff dataset
- a React application with many route-level tools
- a small backend layer for reviews, AI proxying, OG generation, and optional shared content

## 3. Motivation, Aim, and Philosophy

### 3.1 Why this project exists

The emotional starting point of KCETCoded is obvious from the product copy and route design: KCET counseling is stressful, high stakes, and still dominated by documents that are public but not student-friendly. A student often knows their rank but does not know:

- which colleges are realistically reachable
- how category and round change the answer
- how a branch has moved across years
- whether a college is actually worth considering
- what documents to keep ready
- how to order preferences without regretting it

Official documents exist, but they are difficult to browse at the speed students need. Community advice exists, but it is scattered across Reddit, WhatsApp, YouTube, and coaching circles. Premium counseling exists, but not every student can or should have to pay for interpretation of public data.

KCETCoded is the answer to that gap.

### 3.2 Core aim

The project aims to make counseling more understandable, less exploitative, and less dependent on guesswork. It tries to reduce the number of moments where a student says:

- "I know the data is somewhere, but I cannot find it fast enough."
- "I have the rank, but I do not know what it means."
- "I can read the PDF, but I cannot compare anything."
- "I heard something in a group, but I do not know whether it is true."

### 3.3 Product philosophy

The codebase and the About page make the philosophy very clear:

- **Free first**: the platform is positioned as 100% free.
- **No sign-up by default**: most features work without accounts.
- **No ads identity**: the product tone is anti-gatekeeping and anti-coaching-package posturing.
- **Transparency over black-box polish**: official-source links and disclaimers are surfaced prominently.
- **Community-shaped development**: subreddit references and feature-request flows are embedded into the product identity.
- **Student-first practicality**: the project does not stop at cutoffs; it goes into commute, peer grouping, document preparation, and decision rehearsal.

## 4. Current Product Snapshot

The following facts are derived from the repository state currently present in this workspace.

| Area | Current state |
| --- | --- |
| Route declarations in `src/App.tsx` | 36 declared routes |
| Unique route paths | 34 unique paths |
| Duplicate route quirk | `/college-cutoffs` is declared three times |
| Core cutoff dataset | 216,893 cutoff rows in `public/data/kcet_cutoffs_high_volume.json` |
| Years covered | 2023, 2024, 2025 |
| Rounds covered | MOCK, R1, R2, R3 |
| Reservation categories represented | 24 |
| Distinct raw institute codes in cutoff rows | 255 |
| Distinct raw course labels in cutoff rows | 345 |
| Colleges in `public/colleges-list.json` | 232 |
| Hardcoded PYQ question bank size | 114 questions |
| PYQ chapter metadata | 28 chapters |
| Public serverless endpoints | 3 (`/api/share`, `/api/og`, `/api/nvidia-chat`) |
| Hidden admin surfaces | `AdminCutoffs`, `AdminPYQ`, plus moderation/admin tabs |
| PWA state | install prompt exists, offline caching is effectively disabled |
| Countdown target in UI | April 23, 2026 at 10:30 AM IST |

### 4.1 Important route quirks

- `/college-cutoffs` appears multiple times in `src/App.tsx`. React Router will still resolve the first matching declaration, but the duplication is real and should be cleaned.
- `/college-list` currently renders `CollegeCutoffs`, not `CollegeList.tsx`.
- A separate `src/pages/CollegeList.tsx` file exists but is not the page users actually reach through `/college-list`.
- Several page files exist in the repository but are not wired into routing at all.

### 4.2 What the project feels like in practice

KCETCoded is best understood as a student journey platform rather than a single-purpose calculator:

1. Land on the homepage and understand what the platform is.
2. Estimate your likely rank.
3. Find viable colleges and branches for that rank.
4. Verify exact historical cutoffs and inspect specific colleges in detail.
5. Parse or build option-entry preferences and simulate likely allotment outcomes.
6. Track rounds, documents, and official changes.
7. Read reviews, consult AI, or explore commute/value-oriented tools.
8. Practice with daily questions, PYQs, or the cutoff game when you want engagement rather than pure data browsing.

## 5. Technology Stack

### 5.1 Frontend stack

| Layer | Technology |
| --- | --- |
| App framework | React 18 |
| Build tool | Vite 5 |
| Language | TypeScript 5 |
| Routing | React Router DOM 6 |
| Styling | Tailwind CSS 3 |
| UI primitives | Radix UI + shadcn-style component structure |
| Async/query layer | TanStack React Query |
| Motion | Framer Motion |
| Charts and visual summaries | Recharts |
| Icons | Lucide React |
| Theming | `next-themes` |
| Forms and validation | React Hook Form + Zod |
| PDF export | jsPDF + AutoTable |
| PDF rendering/parsing in browser | `pdfjs-dist` |
| Spreadsheet parsing | `xlsx` |

### 5.2 Data, backend, and infrastructure

| Layer | Technology |
| --- | --- |
| Shared database and backend services | Supabase |
| Social share image generation | Vercel OG |
| Analytics | Vercel Analytics |
| Hosting/deployment posture | Vercel-style SPA deployment |
| Serverless AI proxy | custom `/api/nvidia-chat` endpoint |
| Data extraction scripts | Node `.mjs` scripts + Python scripts |
| OCR tooling in repo | Tesseract.js and Python/PDF parsing helpers |

### 5.3 State management reality

KCETCoded does **not** currently use Zustand, despite older docs implying that. The store in `src/store/finderStore.ts` is a small custom pub/sub store with:

- an internal state object
- a `setState` merger
- a `subscribe` mechanism
- manual listener emission

That matters because it shows the project is relatively lightweight in global state philosophy. It uses custom logic where a large state library would have been overkill.

## 6. Repository Topology

KCETCoded is not a minimal app repo. It contains product code, data-generation code, raw source documents, automation scripts, extracted artifacts, and a meaningful amount of debugging residue from data-work and PDF parsing.

### 6.1 Major directories and files

| Path | Purpose |
| --- | --- |
| `src/` | Main application source |
| `src/pages/` | Route-level page components |
| `src/components/` | Shared UI, admin views, layout, UX helpers |
| `src/lib/` | Core business logic, services, parsers, data mappers |
| `src/store/` | Lightweight shared state for finder flows |
| `src/data/` | Hardcoded PYQ bank and PDF manifests |
| `public/` | Static assets, manifest, service worker, dataset JSON, news data, PDF page index |
| `api/` | Vercel-style serverless endpoints |
| `supabase/` | Schema and migration files |
| `scripts/` | Extraction, merge, validation, news automation, PYQ seeding, data maintenance |
| `HTMLCUTO/` | Alternate or supporting extraction workspace for HTML-based cutoff handling |
| `backup/`, `reports/`, `pics/` | Supporting artifacts, generated outputs, or reference assets |
| Root PDF/XLSX files | Raw KEA source documents stored unusually close to app root |
| `README.md`, `NEWS_AUTOMATION_GUIDE.md`, `RANK_PREDICTOR_UPDATE.md` | Human-facing repo docs, some of which are stale or legacy |

### 6.2 What makes this repo unusual

Most web-app repositories separate application code from raw source documents and debugging outputs much more strictly. KCETCoded keeps many of those materials directly in the repository, including:

- raw KEA PDFs and XLSX files
- extracted CSVs and JSONs
- debug logs and analysis text files
- one-off repair scripts for specific colleges or rounds

This makes the repo noisier, but it also makes the data provenance and extraction history more visible. In other words, the repo is not just the product; it is also part archive, part lab, and part ETL workshop.

## 7. Global Product Experience

Before getting into page-by-page documentation, it is important to understand the shared product shell and cross-cutting features that shape the entire app.

### 7.1 Layout and navigation

Most major pages render inside `Layout.tsx`, which provides the main application shell and sidebar-driven navigation. The sidebar is divided into three conceptual groups:

- **Main**: Home, Dashboard, Daily Challenge, Cutoff Clash, Rank Predictor, Cutoff Explorer, College Finder, College Cutoffs, PYQ Practice
- **Resources**: Round Tracker, CET News, Documents, Reviews, Info Centre, Materials, Mock Simulator, College Compare, Planner, Feature Request
- **Special**: AI Counselor plus external community links to `r/KCETCoded` and `r/KCETards`

Some nav items carry product-state badges such as `New`, `Beta`, or `AI`, which helps users understand maturity and intent.

### 7.2 Standalone pages outside the main shell

Several routes intentionally bypass the sidebar layout and feel more like microsites or full-canvas experiences:

- homepage
- daily challenge
- cutoff clash
- squad finder
- metro mapper
- BMTC mapper
- hidden gems
- admin routes
- 404 page

### 7.3 Settings and personalization

The layout includes a settings layer stored in local storage under `kcet.settings.v1`. Current settings include:

- theme selection
- compact mode
- reduced motion
- fast dashboard mode
- show/hide course codes
- show/hide institute codes
- default year
- default round
- default category

This is an important design choice: KCETCoded treats repeat visitors like returning operators, not like disposable traffic. The app remembers how the user wants to browse dense counseling data.

### 7.4 Keyboard and discovery features

The app includes several user-experience flourishes that go beyond standard academic dashboards:

- a global command palette opened by `Ctrl/Cmd + K`
- a keyboard shortcuts HUD opened by `?`
- a Konami code easter egg that triggers party mode
- a floating disclaimer banner reminding users to verify with official KEA documents
- a PWA install banner

These details matter because they show the product is not only functional; it is also intentionally playful and highly navigable.

### 7.5 Countdown and urgency framing

A countdown timer points to **April 23, 2026 at 10:30 AM IST**. That gives the app an always-on sense of exam/counseling season urgency and reinforces its time-sensitive use case.

### 7.6 SEO, analytics, and social sharing

KCETCoded uses:

- a reusable `SEO` component with `react-helmet-async`
- Vercel Analytics
- custom social-share handling through `/api/share`
- OG-image generation through `/api/og.tsx`
- `public/sitemap.xml`
- `public/robots.txt`

`robots.txt` disallows `/admin` and `/api/`, which is appropriate for hidden operational surfaces.

### 7.7 PWA posture

The project has a `manifest.json` and an install banner, including shortcuts to:

- Cutoff Explorer
- Rank Predictor
- College Finder

However, the actual offline story is intentionally restrained:

- service-worker code exists in `public/sw.js`
- the codebase explicitly unregisters service workers in order to avoid caching issues
- deployment headers in `vercel.json` favor freshness with strict no-cache behavior

The practical conclusion is simple: **KCETCoded behaves like a freshness-first web app, not a true offline-first PWA.**

## 8. Complete Route and Page Inventory

This section covers every route currently declared in `src/App.tsx`, plus notable page files present in the repository but not truly wired into the live app flow.

### 8.1 Standalone public routes

| Route | File | Status | Purpose |
| --- | --- | --- | --- |
| `/` | `src/pages/Homepage.tsx` | Active | Landing page and product showcase |
| `/daily-challenge` | `src/pages/DailyChallenge.tsx` | Active | Daily KCET-style question routine |
| `/cutoff-clash` | `src/pages/CutoffClash.tsx` | Active | Higher/lower cutoff game |
| `/squad-finder` | `src/pages/SquadFinder.tsx` | Active | Group college eligibility tool |
| `/metro-mapper` | `src/pages/MetroMapper.tsx` | Active | Metro-accessibility college explorer |
| `/bmtc-mapper` | `src/pages/BmtcMapper.tsx` | Active | BMTC commute-oriented college explorer |
| `/hidden-gems` | `src/pages/HiddenGems.tsx` | Active | Underrated-college scoring tool |
| `*` | `src/pages/NotFound.tsx` | Active | Styled 404 page |

### 8.2 Layout-wrapped public routes

| Route | File actually rendered | Status | Purpose |
| --- | --- | --- | --- |
| `/dashboard` | `src/pages/Dashboard.tsx` | Active | Main operational dashboard |
| `/rank-predictor` | `src/pages/RankPredictor.tsx` | Active | Rank estimation tool |
| `/cutoff-explorer` | `src/pages/CutoffExplorer.tsx` | Active | Exact cutoff browser |
| `/college-finder` | `src/pages/CollegeFinder.tsx` | Active | Rank-to-college discovery engine |
| `/mock-simulator` | `src/pages/MockSimulator.tsx` | Active, Beta-toned | Preference/allotment simulator |
| `/round-tracker` | `src/pages/RoundTracker.tsx` | Active | Counseling round timeline |
| `/college-compare` | `src/pages/CollegeCompare.tsx` | Routed but under development | Placeholder compare page |
| `/planner` | `src/pages/Planner.tsx` | Active, Beta-toned | Option-entry PDF parser and analyzer |
| `/documents` | `src/pages/Documents.tsx` | Active | Document checklist guide |
| `/reviews` | `src/pages/Reviews.tsx` | Active | Review discovery hub |
| `/reviews/:collegeCode` | `src/pages/CollegeReviewPage.tsx` | Active | Per-college review page |
| `/college-list` | `src/pages/CollegeCutoffs.tsx` | Active alias, miswired | Alias route pointing to cutoffs matrix |
| `/college-cutoffs` | `src/pages/CollegeCutoffs.tsx` | Active, duplicated in router | Matrix view of college-wise cutoffs |
| `/info-centre` | `src/pages/InfoCentre.tsx` | Active | Long-form counseling and academic guidance |
| `/materials` | `src/pages/Materials.tsx` | Active | Resources and official PDF links |
| `/cet-news` | `src/pages/CETNews.tsx` | Active | Curated KCET news feed |
| `/ai-counselor` | `src/pages/AICounselor.tsx` | Active, Beta-toned | AI chat assistant |
| `/college/:collegeCode` | `src/pages/CollegeDetail.tsx` | Active | Per-college detail view |
| `/privacy` | `src/pages/PrivacyPolicy.tsx` | Active | Privacy policy |
| `/terms` | `src/pages/Terms.tsx` | Active | Terms of service |
| `/about` | `src/pages/About.tsx` | Active | Project story and philosophy |
| `/request-feature` | `src/pages/FeatureRequest.tsx` | Active | Feature/bug request form |
| `/pyq-test` | `src/pages/PYQTest.tsx` | Active | PYQ practice system |

### 8.3 Hidden admin routes

| Route | File | Status | Purpose |
| --- | --- | --- | --- |
| `/admin` | `src/pages/AdminCutoffs.tsx` | Active, hidden from nav | Main admin console |
| `/admin-cutoffs` | `src/pages/AdminCutoffs.tsx` | Active, hidden from nav | Explicit admin cutoff console route |
| `/admin-pyq` | `src/pages/AdminPYQ.tsx` | Active, hidden from nav | PYQ content management panel |

### 8.4 Page-by-page documentation

#### Homepage (`/`)

- The homepage is a high-energy introduction to the platform rather than a plain static splash page.
- It presents the product value proposition, live-ish stats drawn from the cutoff dataset, animated hero messaging, and feature cards.
- It acts as the emotional entry point: not just "here is a website," but "here is a toolset for surviving counseling with more confidence."
- It also reinforces the dataset-backed nature of the product and pairs marketing language with actual feature pathways.

#### Dashboard (`/dashboard`)

- The dashboard is the practical command center once the user moves past the landing page.
- It includes greeting/stateful widgets, disclaimer messaging, the exam countdown, quick actions, schedule-oriented information, and statistics derived from the active dataset.
- It is clearly designed for repeat use during counseling season rather than one-time browsing.
- The dashboard is also where personalization settings have outsized value because the user is likely to revisit it often.

#### Rank Predictor (`/rank-predictor`)

- This page predicts KCET rank from two user inputs: KCET marks out of 180 and PUC percentage.
- The core logic lives in `src/lib/rank-predictor.ts`, which uses an aggregate based on `((KCET/180)*100 + PUC%) / 2`, meaning a 50/50 combination between normalized KCET score and PUC percentage.
- The predictor exposes both 2025 and 2026-oriented outputs, percentile hints, competition framing, and rank bands rather than reducing everything to a single magic number.
- The page is unusually rich for a student predictor tool: it saves local history, can share output through the share API, supports clipboard/Web Share flows, and can generate a downloadable PNG rank card.
- It also includes methodology explanation and a feedback loop where users can submit real marks/rank outcomes for calibration. That feedback, however, is currently local-admin oriented rather than a robust centralized telemetry pipeline.

#### Cutoff Explorer (`/cutoff-explorer`)

- Cutoff Explorer is the direct database browser for historical allotment outcomes.
- It supports free-text search plus layered filters for year, round, category, institute, and course.
- Pagination and mobile filter controls are built in, which matters because the raw dataset is large.
- One of its strongest trust features is source verification: rows can open the exact or mapped official PDF source page through the PDF URL/page-index system.
- The page uses trust metadata such as `pdf_exact`, `mapped`, and `merged`, which is one of the clearest signals in the whole product that transparency matters as much as utility.
- The implementation also contains fallbacks that can load data from bundled XLSX sources if needed, which shows defensive engineering around data-source variability.

#### College Finder (`/college-finder`)

- College Finder is arguably the flagship page of the entire project.
- The user enters a rank and contextual filters, and the page returns viable college-branch combinations from historical data.
- Results can be filtered further by year, round, institute, course, and location-oriented criteria.
- The page supports bookmarks, compare-list building, PDF export, trend visualization, and one-click source verification against official KEA documents.
- It uses a lightweight shared store in `src/store/finderStore.ts`, which lets the finder experience feel cohesive without pulling in a larger global-state framework.
- This page embodies the strongest practical promise of KCETCoded: taking raw historical data and turning it into fast, scenario-specific decision support.

#### College Cutoffs (`/college-cutoffs` and current `/college-list` alias)

- College Cutoffs is a matrix-style view organized around colleges rather than rank-based discovery.
- It supports expand/collapse behavior, year/round/category-type filtering, and college search.
- The category filters are especially noteworthy because they group the 24 official category variants into usable viewing modes such as All, General, Kannada, and Rural.
- This page is also the accidental destination for `/college-list`, which means the route naming and rendered component currently do not align cleanly.

#### College Detail (`/college/:collegeCode`)

- College Detail is the page where the platform tries to go from "raw cutoff lookup" to "understand this college as an entity."
- It pulls together college-specific history, category-sensitive cutoffs, cross-year branch mapping, and supporting contextual signals such as reviews and placement-related helpers.
- The complexity here is mostly in normalization and reconciliation, because colleges and branches do not remain text-identical across documents and years.
- This is an important architectural page because it shows the project moving from data table behavior toward institution-level storytelling.

#### College Compare (`/college-compare`)

- This route exists and is exposed in navigation, but the page is still under development.
- In practical terms, it is a promise more than a finished analysis surface.
- Its presence matters because compare is a natural next step after discovery, but users should not assume the feature is production-complete yet.

#### Mock Simulator (`/mock-simulator`)

- Mock Simulator lets users build an ordered preference list and run a simplified allotment-style simulation.
- It uses historical cutoff data to determine which preference would likely convert for a given rank and category.
- Preferences can be reordered, removed, and evaluated with safety labels such as Safe, Likely, Risky, or N/A.
- The page can import parsed preferences from the Planner using session storage, which is one of the cleaner cross-page workflows in the app.
- This is a strong example of KCETCoded moving beyond passive lookup and into rehearsal of actual decision-making.

#### Planner (`/planner`)

- Planner is the option-entry analyzer.
- Users can upload an option-entry PDF, which is then parsed through `PDFParser.parseWithFallback`.
- Extracted preferences are shown in tabular form and can be handed off to the Mock Simulator through `sessionStorage` using the `mockSimulatorPreferences` key.
- The route is wrapped in an `ErrorBoundary`, which is a sensible implementation detail because PDF parsing and OCR-like extraction are inherently messy.
- This page serves a very practical counseling need: users often already have a preference list, but they need to inspect, clean, or test it rather than start from scratch.

#### Round Tracker (`/round-tracker`)

- Round Tracker is a counseling-timeline page for round-based process awareness.
- It currently appears to be more manual/static than dynamically backend-driven.
- That means it is useful as a structured reminder page, but it should not be mistaken for a guaranteed live sync with official scheduling changes.
- It reinforces the platform's "do not miss the process details" mission even if it is not yet a live operations dashboard.

#### Documents (`/documents`)

- Documents is a checklist-style counseling support page organized by document category.
- It covers academic records, KCET/NEET-adjacent materials, identity documents, reservation-related documents, and copy requirements.
- This page exists because counseling failure is not always about rank; it is often about procedural readiness.
- The page is simple in concept but highly important in real student workflow.

#### Reviews (`/reviews`)

- Reviews is the discovery hub for crowd-sourced college feedback.
- Users can search, filter, sort, and narrow to colleges that actually have review content.
- It acts as the bridge between hard admissions data and qualitative lived experience.
- In the broader KCETCoded product story, this page says: cutoffs tell you whether you can get in; reviews help you decide whether you should.

#### College Review Page (`/reviews/:collegeCode`)

- This is the page where review functionality becomes full-featured.
- It shows average ratings and detailed community feedback for a single college.
- Users can submit reviews anonymously, with session tracking rather than full account onboarding.
- The page supports deleting one's own review, reporting problematic content, and sharing the page.
- The review pipeline includes sanitization, profanity and spam checks, simple rate limiting, and moderation/report handling.
- Among all community features in the app, this is one of the most mature shared-data surfaces.

#### Info Centre (`/info-centre`)

- Info Centre is one of the broadest content pages in the project.
- It contains general KCET guidance, explanatory material, FAQs, fee/process context, and a substantial VTU vs Autonomous comparison.
- The VTU vs Autonomous section is especially notable because it is structured into tabs such as overview, academics, exams, placements, and verdict.
- This page represents the "explain the ecosystem" side of KCETCoded, not just the "search the data" side.

#### Materials (`/materials`)

- Materials is a resource shelf rather than a computational tool.
- It includes cards for official cutoff PDFs and placeholder or starter study-material references.
- It helps centralize relevant documents, though parts of it are still more scaffold than full knowledge base.

#### CET News (`/cet-news`)

- CET News loads a generated `news.json` feed from `public/data`.
- It also includes a prominent featured official notice object, meaning the page mixes a hand-prioritized headline with feed-driven content.
- The presence of news automation scripts in the repo shows this page is backed by a broader ingestion workflow, even though the runtime page itself is reading a prepared JSON artifact rather than live-polling news services.

#### AI Counselor (`/ai-counselor`)

- AI Counselor provides a chat interface for counseling-related questions.
- The UX includes disclaimers, quick prompts, markdown rendering, and visible assistant status handling.
- Under the hood, the system uses `src/lib/gemini.ts` and `src/lib/ai-tools.ts`, despite the name `gemini.ts` now representing a broader orchestration path than a single provider.
- The primary route appears to be the `/api/nvidia-chat` proxy, with fallback behavior routed through other model-access paths.
- Importantly, the page is honest about uncertainty and explicitly pushes users back toward deterministic tools such as College Finder and Cutoff Explorer for cutoff-sensitive facts.
- This page is useful for explanation, brainstorming, and orientation, but it is not framed as a source-of-truth replacement for the data tools.

#### Daily Challenge (`/daily-challenge`)

- Daily Challenge creates a lightweight daily-practice loop using a deterministic selection of five questions based on the current date.
- State, progress, and streak behavior are stored locally in the browser.
- This gives the project a habit-building surface and stops it from being only a "panic-season counseling site."

#### Cutoff Clash (`/cutoff-clash`)

- Cutoff Clash is a higher/lower style game built on real cutoff data.
- It draws from a selected year/round/category snapshot and focuses on major colleges and popular CS-family branches.
- High score persistence is local.
- This page is both playful and educational: it teaches relative competitiveness by making cutoff intuition part of the game loop.

#### PYQ Test (`/pyq-test`)

- PYQ Test combines a structured multiple-choice bank with scanned-PDF support.
- It includes chapter tests, quick quiz behavior, local performance statistics, and PDF upload/render support via PDF.js.
- The route sits at an interesting intersection between structured practice and archival reference material.
- It also contains explicit language acknowledging scan-quality and extraction limitations, which is honest and appropriate.

#### Feature Request (`/request-feature`)

- Feature Request lets users submit ideas, improvements, and bug reports.
- Requests can be upvoted and administratively reviewed later.
- However, the important implementation detail is that this system is local-storage based, not a robust cross-user SaaS feedback board.
- That means it is useful for same-device tracking and local admin review, but not yet a full community-wide shared request database.

#### About (`/about`)

- About is one of the most important pages for understanding the spirit of the project.
- It explains the creator motivation, the anti-gatekeeping stance, the data-source policy, the free/no-signup/no-ads identity, and the purpose of major features in plain human language.
- If someone wants the emotional thesis of KCETCoded rather than its technical architecture, this page is the clearest in-product articulation.

#### Privacy Policy (`/privacy`)

- The privacy page emphasizes local storage, no mandatory accounts, limited personal-data collection, cookies/preferences, and third-party analytics posture.
- It frames most user data as browser-local rather than centrally retained.
- That aligns with the product philosophy and is also structurally true for many app features.

#### Terms of Service (`/terms`)

- The terms page strongly foregrounds the "not an official government site" disclaimer.
- It covers accuracy limits, liability limits, and as-is usage.
- The tone is appropriate for a project handling advice-adjacent educational decision support without pretending to be an official authority.

#### Squad Finder (`/squad-finder`)

- Squad Finder is an unusual and distinctly student-centric tool.
- Users enter their own rank plus up to three friends' ranks and a category to find colleges where the group could plausibly stay together.
- This is not a generic admissions feature; it shows deep empathy for how students actually think about relocation and social comfort.

#### Metro Mapper (`/metro-mapper`)

- Metro Mapper overlays college choice with Bangalore metro accessibility.
- It uses curated metro/college mapping data and sorts colleges by station and walkability context.
- This turns commute into a first-class decision variable rather than an afterthought.

#### BMTC Mapper (`/bmtc-mapper`)

- BMTC Mapper does for buses what Metro Mapper does for metro lines.
- It uses curated stop, route, and hub relationships to help users identify colleges with practical bus connectivity.
- This is a highly local, highly pragmatic feature and one of the clearest examples of KCETCoded solving "real life" rather than only "exam data" problems.

#### Hidden Gems (`/hidden-gems`)

- Hidden Gems combines placement-oriented data with cutoff trends to identify undervalued colleges.
- It calculates a "Gem Score" style ranking, effectively acting like a return-on-opportunity surface.
- This is a smart counterweight to rank obsession because it encourages students to look for value, not only prestige.

#### Not Found (`*`)

- The 404 page is not a dead-end placeholder.
- It is styled with a themed "Lost in Space" experience and includes hints that help users recover navigation quickly.
- Small detail, but it contributes to the sense that the product is intentionally designed rather than merely assembled.

### 8.5 Hidden admin functionality

#### Admin Cutoffs (`/admin` and `/admin-cutoffs`)

- Admin Cutoffs is a substantial maintenance console hidden from navigation.
- It uses a client-side passphrase gate with `kcetadmin2026`, stored in session storage under `kcet_admin_auth`.
- This page is not just a single editor; it is a multi-tab admin workspace.
- It supports local overlay editing on top of the base cutoff dataset, including add, update, delete, bulk delete, duplicate detection, overwrite confirmation, undo, CSV import, and multiple export modes.
- It also houses operational views for review moderation, predictor feedback inspection, and feature-request admin handling.
- The power is real, but so is the limitation: the auth model is lightweight obfuscation, not strong security.

#### Admin Review Moderation

- Implemented through `src/components/AdminReviewModeration.tsx`, this view manages review reports and overall review moderation.
- It includes tabs such as overview, reported, and all.
- Admin actions include hide, flag, delete, and dismiss-report style behavior.
- This is one of the few genuinely multi-user-sensitive operational systems in the app because reviews are shared through Supabase.

#### Admin Feature Requests View

- Implemented through `src/components/AdminFeatureRequestsView.tsx`.
- It can view, status-change, delete, and clear feature requests.
- The major caveat is architectural: feature requests are local-storage based, so this admin view reflects that local browser data, not a true global product backlog.

#### Admin Feedback View

- Implemented through `src/components/AdminFeedbackView.tsx`.
- It reads and clears predictor feedback stored by the rank predictor flow.
- Like feature requests, this is not a server-backed analytics system. It is local-browser admin visibility.

#### Admin PYQ (`/admin-pyq`)

- Admin PYQ uses the same passphrase gate pattern as the cutoff admin.
- It provides CRUD functionality for `pyq_questions` in Supabase.
- It also supports OCR text paste/import and parsing preview workflows.
- Compared to feature requests or predictor feedback, this is a more genuinely centralized admin surface because it edits shared database-backed content.

### 8.6 Dormant, experimental, or unwired page files

These page files exist in `src/pages`, but are not wired into the current route map in a meaningful live-user way:

- `Analytics.tsx`
- `FeeCalculator.tsx`
- `Index.tsx`
- `XLSXDemo.tsx`
- `CollegeList.tsx` as a truly distinct page implementation

Important nuance:

- `CollegeList.tsx` exists, but `/college-list` does not render it.
- There is also a `src/components/CollegeList.tsx`, which means "college list" exists both as a component concept and as an unused page concept.

This matters for maintainers because the repo contains more UI surface area than the router currently exposes.

## 9. Data Architecture and Core Logic

KCETCoded is driven primarily by data preparation and client-side analysis, not by heavy live querying against a remote API for every action.

### 9.1 Main source-of-truth flow

The project's core data journey looks like this:

1. Raw KEA PDFs and XLSX files are stored in the repository.
2. Scripts in `scripts/` extract, clean, merge, audit, and validate the data.
3. Finalized JSON artifacts are placed into `public/data/`.
4. Frontend services load those artifacts into browser-accessible tools.
5. Specialized utilities then enrich or cross-reference those rows with page indexes, course normalization, trust badges, placement data, commute metadata, or review data.

### 9.2 The cutoff dataset

The largest public artifact is `public/data/kcet_cutoffs_high_volume.json`, which currently contains:

- 216,893 cutoff rows
- 2023, 2024, and 2025 data
- MOCK, R1, R2, and R3 round coverage
- 24 reservation-category labels

This dataset is the backbone for:

- Cutoff Explorer
- College Finder
- College Cutoffs
- College Detail
- Mock Simulator
- Cutoff Clash
- Hidden Gems, at least partially through derived insights
- AI Counselor's retrieval/context behavior

### 9.3 Data provenance and trust mechanics

One of KCETCoded's strongest architectural decisions is that it does not merely display extracted data; it tries to preserve a path back to official source material.

Relevant files and modules include:

- `src/lib/pdf-url-mapper.ts`
- `src/lib/pdf-config.ts`
- `src/lib/pdf-parser.ts`
- `public/data/pdf-page-index.json`
- `src/lib/data-trust.ts`

This system lets tools attach source states such as:

- exact PDF origin
- mapped PDF page
- merged row provenance

That matters enormously in an admissions product, because trust is not just about correctness; it is about inspectability.

### 9.4 Business-logic modules that define the product

| Module | Role |
| --- | --- |
| `src/lib/cutoff-service.ts` | Loads, normalizes, and serves cutoff data with fallbacks |
| `src/lib/college-service.ts` | Handles college metadata and review integration |
| `src/lib/rank-predictor.ts` | Rank prediction math and helper outputs |
| `src/lib/mock-simulator.ts` | Preference/allotment simulation logic |
| `src/lib/course-normalizer.ts` | Cross-year branch-name normalization |
| `src/lib/pdf-parser.ts` | Option-entry PDF extraction logic |
| `src/lib/xlsx-loader.ts` | Client-side XLSX parsing fallback support |
| `src/lib/feature-request-service.ts` | Local feature-request persistence |
| `src/lib/admin-cutoff-service.ts` | Local overlay edits and admin exports for cutoffs |
| `src/lib/admin-feedback-service.ts` | Local predictor-feedback storage/admin handling |
| `src/lib/security.ts` | Review validation, sanitization, spam/profanity/contact detection |
| `src/lib/settings.ts` | App settings persistence and defaults |
| `src/lib/ai-tools.ts` | AI-side utility behavior and tool support |
| `src/lib/gemini.ts` | AI orchestration layer despite the legacy name |
| `src/lib/metro-colleges.ts` | Curated metro connectivity data |
| `src/lib/bmtc-colleges.ts` | Curated BMTC connectivity data |
| `src/lib/college-placements.ts` | Placement-oriented enrichment data |

### 9.5 Shared data versus browser-local data

This distinction is extremely important for understanding the real architecture of the product.

| Feature/data | Stored where | Shared across users? | Notes |
| --- | --- | --- | --- |
| Historical cutoff data | Static JSON in `public/data` | Yes, via deployment artifact | Core public dataset |
| College metadata list | `public/colleges-list.json` | Yes | Static artifact |
| News feed | `public/data/news.json` | Yes | Generated ahead of time |
| Reviews | Supabase | Yes | Most mature shared community feature |
| Review reports | Supabase | Yes | Moderated through admin view |
| PYQ admin-managed questions | Supabase | Yes | Edited via Admin PYQ |
| Hardcoded PYQ bank | `src/data/pyqQuestionBank.ts` | Yes, via bundle | Built-in fallback/base content |
| Bookmarks and finder preferences | Local storage | No | User-device local |
| Settings | Local storage | No | `kcet.settings.v1` |
| Daily challenge state/streak | Local storage | No | Habit tracking is local |
| Cutoff Clash high score | Local storage | No | Game score is local |
| Rank predictor history | Local storage | No | Local convenience feature |
| Predictor feedback | Local storage | No, unless manually exported/inspected | Not a centralized telemetry system |
| Feature requests | Local storage | No, as implemented | Local-only request queue |
| Admin cutoff edits | Local overlay/local export | No, by default | Not a secure shared CMS |
| Planner handoff to simulator | Session storage | No | `mockSimulatorPreferences` |
| Admin auth session | Session storage | No | `kcet_admin_auth` |

This table exposes one of the most important truths about KCETCoded:

**It is partly a shared platform and partly a sophisticated single-browser personal workspace.**

That hybrid model is not a bug by itself. In many places it is a privacy-positive design choice. But it does create some limitations for admin and feedback workflows.

## 10. Backend, APIs, and Database

### 10.1 Serverless API endpoints

KCETCoded currently includes three major serverless endpoints:

#### `/api/share`

- Generates or serves a share-friendly result page for things like rank predictor outputs.
- Helps convert internal tool results into linkable social/share artifacts.

#### `/api/og.tsx`

- Generates OG preview images for social sharing.
- Important for making shared rank cards and result links feel like polished products rather than raw URLs.

#### `/api/nvidia-chat`

- Acts as the server-side AI proxy for the counselor flow.
- Streams and accumulates responses from an NVIDIA Nemotron model path.
- Keeps the AI integration cleaner and potentially safer than exposing everything directly from the client.

### 10.2 Supabase role in the architecture

Supabase is present, but KCETCoded is not a Supabase-first app. The product is still primarily powered by static data files and browser logic.

Supabase is most relevant for:

- college reviews
- review reporting/moderation
- PYQ question management
- shared relational tables for future or broader data features

### 10.3 Schema breadth

The Supabase schema and migrations define a wider platform surface than the current frontend fully exploits. Notable tables include:

- `users`
- `colleges`
- `branches`
- `cutoffs`
- `college_reviews`
- `review_reports`
- `rank_predictions`
- `mock_simulations`
- `seat_matrix`
- `notification_subscriptions`
- `admin_activities`
- `pyq_questions`

This tells us two things:

1. The backend schema has room for a broader future platform.
2. The frontend currently uses only part of that potential.

### 10.4 Supabase client caveat

The Supabase client contains fallback public values when environment variables are absent. That is convenient for ease of setup, but it is also something maintainers should treat carefully, especially if production credentials or environments ever change.

### 10.5 Environment configuration exposed by the repo

`env.example` currently advertises the following environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `NEWS_API_KEY`
- `WEBHOOK_SECRET`
- `NVIDIA_API_KEY`

This reflects the current operational split of the project:

- Supabase for shared data features
- optional news automation/webhook flows
- NVIDIA-backed AI inference for the counselor path

## 11. Data Pipeline, Scripts, and Automation

The `scripts/` folder is one of the most important parts of the repo because it explains how KCETCoded became possible in the first place.

### 11.1 What the script layer does

The script layer is responsible for:

- extracting cutoff data from KEA PDFs and XLSX files
- merging multiple years and rounds into a common structure
- cleaning formatting inconsistencies
- validating and auditing output quality
- generating summary files and PDF page indexes
- automating news ingestion
- extracting and seeding PYQ content
- helping populate database tables

### 11.2 Script categories visible in the repo

The script inventory includes all of the following categories:

- extraction scripts for 2023, 2024, and 2025
- aggressive, precise, and alternate extraction variants
- HTML-based extraction support
- merge and consolidation scripts
- cleanup and normalization scripts
- validation and verification scripts
- news-fetching and webhook scripts
- PDF page-index generation
- PYQ OCR and parsing scripts
- database population scripts
- debugging and one-off correction scripts

Examples visible in the repo include:

- `extract-2023-2024-final.mjs`
- `extract-2025-pdf.mjs`
- `extract_htmlcuto_cutoffs.mjs`
- `merge-all-data.mjs`
- `clean-cutoffs-data.mjs`
- `generate-pdf-page-index.mjs`
- `fetch-kcet-news.mjs`
- `refresh-news.mjs`
- `seed-pyq.mjs`
- `populate-database.mjs`

### 11.3 News automation

The repository includes `NEWS_AUTOMATION_GUIDE.md`, plus multiple news scripts. This shows that KCET news is not just hand-written page content; it has an intended ingestion pipeline around it.

Even so, the runtime experience today is still based on reading a generated `news.json` file. That means automation exists behind the scenes, but the frontend itself remains static-artifact driven at runtime.

### 11.4 Data extraction as a project-defining strength

For many student tools, the frontend is the hard part and data is easy. For KCETCoded, the opposite is closer to the truth. The real moat is not a button style or route layout. It is the ability to:

- extract ugly source documents reliably
- normalize year-to-year naming drift
- preserve traceability back to official PDFs
- keep the data usable in the browser without requiring a heavy live backend query layer

That data-engineering backbone is a major reason the project feels more serious than a typical exam helper site.

## 12. Security, Privacy, and Trust Model

### 12.1 Trust-positive choices

KCETCoded gets several important trust decisions right:

- repeated "verify with official KEA documents" messaging
- visible source-linking to official PDFs
- no forced sign-up for core tool access
- local-first storage for many personal workflows
- review sanitization and content checks
- legal pages that do not hide the unofficial nature of the platform

### 12.2 Review protection logic

`src/lib/security.ts` performs several checks around user-submitted review content, including:

- text validation
- rating validation
- marks/rank/category/college-code validation
- DOMPurify-based sanitization
- spam and profanity checks
- link/contact-pattern detection
- simple in-memory rate limiting

For a student community feature, this is a respectable baseline.

### 12.3 Weak or limited security areas

There are also clear weaknesses:

- admin auth is a client-side passphrase in source code
- some "admin" actions are local-overlay actions, not server-governed secure operations
- Supabase fallback public config in the client deserves careful handling
- some moderation or feedback surfaces are local rather than centrally audited

None of these automatically make the project unsafe for its intended use, but they do matter if the platform is expected to scale into a serious shared service.

## 13. Deployment, Performance, and Operational Posture

### 13.1 Build and run model

The project is a Vite-built React SPA with Vercel-friendly deployment assumptions.

### 13.2 `vercel.json` posture

The deployment config includes:

- SPA rewrites
- security headers
- CSP-style protections
- strict cache behavior
- `/api/*` handling

The overall posture clearly prioritizes serving fresh counseling data rather than taking aggressive offline-cache risks.

### 13.3 Manifest and service worker reality

There is enough PWA infrastructure to support installation, branding, and shortcuts, but not enough active service-worker behavior to call the app genuinely offline-capable. This is a deliberate tradeoff and, for admissions data, arguably the correct one.

### 13.4 Testing posture

The repo includes:

- `vitest.config.ts`
- `npm test`
- `npm run test:ui`
- linting through ESLint
- many script-level validation utilities

However, the project should not be described as comprehensively covered by automated tests from the evidence currently present. A more accurate statement is:

**The repo has testing and validation scaffolding, especially around data scripts, but the strongest quality assurance still appears to come from data auditing, manual validation, and defensive fallbacks.**

## 14. Pros: What KCETCoded Does Very Well

- **Exceptional problem fit**: the platform addresses real student pain points rather than generic education-app abstractions.
- **Strong data utility**: turning 200k+ cutoff rows into usable browser tools is the heart of the product and it is genuinely valuable.
- **Transparency-oriented design**: source PDF linking and disclaimer visibility build trust better than many student tools do.
- **Breadth across the full journey**: prediction, discovery, simulation, documents, reviews, news, AI, and commute logic all live in one ecosystem.
- **Student empathy**: features like Squad Finder, Metro Mapper, BMTC Mapper, and Hidden Gems show unusually grounded thinking.
- **Local-first convenience**: no-login flows plus local storage for bookmarks, settings, and progress keep friction low.
- **Community layer with moderation**: the review system adds human texture to what would otherwise be a purely numeric platform.
- **Strong extraction/tooling backbone**: the data pipeline is a real engineering asset, not an afterthought.
- **Good UX personality**: command palette, keyboard HUD, easter eggs, polished 404 page, badge-based maturity labeling, and a clear visual identity give the platform character.
- **Pragmatic architecture**: static data for what should be static, Supabase only where shared state is actually needed, and browser logic for fast interaction.

## 15. Cons, Limitations, and Weak Spots

- **Brand inconsistency**: the product is currently split between `KCETCoded`, `KCET Coded`, and `KCET Compass`.
- **Documentation inconsistency**: older docs such as `README.md` and `RANK_PREDICTOR_UPDATE.md` do not fully match present implementation.
- **Routing clutter**: duplicate `/college-cutoffs` declarations and the `/college-list` miswire are real maintenance issues.
- **Dormant code surface**: several page files exist but are not actually routed, which can confuse contributors.
- **Beta and incomplete areas**: College Compare is not complete; other features like Mock Simulator, Planner, and AI Counselor still read as iterative.
- **Static/manual operational pages**: Round Tracker and parts of Materials or CET News are less dynamic than their names may imply.
- **Local-only admin/feedback flows**: feature requests, predictor feedback, and cutoff-overlay admin edits are not robust multi-user systems.
- **Weak admin authentication**: the passphrase gate is obfuscation, not durable security.
- **PWA expectation mismatch**: installability exists, but offline use is effectively disabled.
- **Repo sprawl**: raw files, debug logs, and extraction artifacts in the root make the repository harder to navigate.
- **Data-count complexity**: the project clearly works through raw-label normalization issues, and some metadata counts differ from raw distinct counts, which is a normal but real maintenance burden.
- **AI reliability ceiling**: the AI counselor is useful for explanation but cannot safely replace deterministic data pages.

## 16. Future Prospects

The following are forward-looking opportunities inferred from the current architecture and existing unfinished surfaces. They are not promises already delivered in code.

- **Finish College Compare**: this is the most obvious missing product step after College Finder and College Detail.
- **Convert local admin overlays into secure shared operations**: especially for cutoffs, feature requests, and predictor feedback.
- **Strengthen admin auth**: moving from client-side passphrase hiding to real authenticated authorization would materially improve operational credibility.
- **Make Round Tracker and news more truly live**: the script foundation exists, but the operational surfaces could become more real-time.
- **Expand College Detail into a richer institution dossier**: placements, fee context, seat matrix, branch roster, trends, reviews, commute, and maybe alumni/community signals in one place.
- **Broaden PYQ depth**: the hybrid system could grow into a much larger subject/chapter/year practice engine.
- **Unify naming and docs**: standardizing the product name and cleaning stale docs would reduce contributor confusion immediately.
- **Refactor route hygiene**: duplicate paths, dormant pages, and miswired aliases should be cleaned before the project gets larger.
- **Improve analytics and contributor observability**: the existence of dormant analytics surfaces suggests room for a maintainer-facing insight layer.
- **Explore versioned offline snapshots rather than generic caching**: if the app ever wants offline capability, it should likely ship data-version-aware snapshots instead of naive service-worker caching.

## 17. Final Assessment

KCETCoded is an ambitious and unusually thoughtful student utility project. Its strongest quality is not that it looks modern or has many pages, though both are true. Its strongest quality is that it understands the actual shape of the KCET decision problem.

It knows students do not only need:

- a rank estimate
- a cutoff table
- a list of colleges

They also need:

- context
- reassurance
- verification
- rehearsal
- practical logistics
- qualitative reviews
- and sometimes simply a more humane interface to information that is technically public but functionally difficult

That is why the project feels bigger than a normal exam-helper website. It combines data engineering, counseling workflow design, community feedback, and student empathy in one place.

At the same time, it is still visibly in motion. Some parts are polished and trustworthy. Some parts are beta. Some parts are local-only. Some parts are present in code but not fully activated. That does not reduce the value of the project; it simply means the correct way to document KCETCoded is with honesty, not hype.

The most accurate single-sentence summary is this:

**KCETCoded is a student-built counseling intelligence platform that transforms official KCET admission data into a practical, transparent, and increasingly full-spectrum decision-support system.**

## 18. Maintenance Notes for Contributors

If this document is updated in the future, the following items should be re-checked first because they are the most likely to drift:

- route inventory in `src/App.tsx`
- dataset counts in `public/data/kcet_cutoffs_high_volume.json`
- feature maturity states on Compare, Planner, Mock Simulator, and AI Counselor
- whether feature requests and predictor feedback become centralized
- whether admin auth remains client-side
- whether PWA/offline behavior changes
- whether naming is finally unified across package metadata, UI, and docs

This document should remain a living audit, not another stale overview.

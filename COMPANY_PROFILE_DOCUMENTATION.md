# KCETCoded
## Company Profile and Product Documentation

**Document purpose:** Company listing, partner due diligence, service profile, and internal reference  
**Document status:** Draft for legal/company completion  
**Prepared against repository baseline:** 6 August 2026

---

## 1. Company identity

| Field | Company record |
| --- | --- |
| Trading / product name | KCETCoded |
| Legal entity name | **[Insert registered legal entity name]** |
| Legal structure | **[Insert: Private Limited / LLP / Sole Proprietorship / other]** |
| Registration / CIN / LLPIN | **[Insert after registration]** |
| Registered office | **[Insert registered office address]** |
| Operating address | **[Insert if different]** |
| Jurisdiction | India |
| Website | **[Insert production domain]** |
| Official email | **[Insert company email]** |
| Privacy contact / grievance contact | **[Insert designated contact]** |
| Directors / designated partners / proprietor | **[Insert legal names and roles]** |
| Document owner | **[Insert responsible person/team]** |

No placeholder in this document is a legal fact. Complete and review this table before submitting it to a registrar, bank, payment provider, app store, investor, customer, or government authority.

---

## 2. Company overview

KCETCoded is an education-technology product focused on counselling research and decision support for KCET and COMEDK applicants. The product provides historical cutoff exploration, rank-estimation tools, college research and comparison, counselling-support resources, preparation tools, selected community features, and data-driven utilities.

The company’s operating model is software and data-service delivery through a web application. The product uses public/historical counselling source material, internally maintained data artifacts, external software providers, and user-provided inputs to generate informational outputs.

KCETCoded is not an official counselling authority, admission authority, educational institution, examination authority, or government portal. It does not issue ranks, allot seats, verify official documents, or guarantee college admission outcomes.

## 3. Problem addressed

Counselling information is often distributed across large official PDFs, notices, spreadsheets, and time-sensitive updates. Applicants need to compare historical patterns, search eligible courses and colleges, understand round movement, organise preferences, and verify the original source without relying on unstructured social-media advice.

KCETCoded addresses this by converting available historical and reference data into searchable, guided product surfaces. The company’s value proposition is information organisation and decision support, not replacement of official notices or professional/legal advice.

## 4. Product and service portfolio

| Product area | Description | Delivery |
| --- | --- | --- |
| Rank and cutoff intelligence | KCET/COMEDK rank estimates, cutoff lookup, trend and round tools | Web application |
| College research | College predictor, college details, cutoffs, comparison and selected review/community signals | Web application |
| Counselling support | Documents, round tracker, mock verification, resources, information pages and news | Web application |
| Student practice | PYQ test, daily challenge and cutoff-learning activities | Web application |
| Practical discovery | Transport/mapping and group/college discovery utilities | Web application |
| AI-assisted guidance | AI counsellor and AI-supported listing/recommendation workflows | Web application, external AI provider |
| Community and feedback | Reviews, comments, reports, suggestions, polls and feedback | Web application with shared backend |
| Donations / supported access | Razorpay-backed donation/payment and access-code workflows | Web application and payment provider |

Feature availability may change by release, data availability, provider status, security controls, legal review, and commercial policy.

## 5. Customers and users

Primary intended users are students preparing for or participating in KCET/COMEDK-related admissions counselling. Secondary users may include parents/guardians, mentors, educators, and counsellors using the platform as a research aid.

The product is not designed to make final decisions on behalf of users. Users are responsible for verifying official eligibility, schedules, seat matrices, notices, results, payment requirements, documents, and admission choices with relevant authorities.

## 6. Operating model

The application is delivered as a React single-page web application. Static admission-related artifacts are served from the application’s public data assets. Supabase is used for selected shared records. Vercel functions provide payment, AI, result lookup, sharing, and Open Graph capabilities. Razorpay is used for payment order/verification flows. NVIDIA is used by current AI server functions.

| Operational function | Current implementation |
| --- | --- |
| Application delivery | Vite-built React application hosted through Vercel configuration |
| Shared data | Supabase PostgreSQL |
| Static data publication | Versioned repository artifacts under `public/data/` |
| Payments | Razorpay server-side order creation and signature verification |
| AI | NVIDIA chat-completions endpoint; additional OpenRouter-referencing client module exists |
| Data maintenance | Node/Python scripts for extraction, consolidation and validation |
| User support | **[Insert support channels and service-level policy]** |
| Moderation | **[Insert named process, responsible role and response target]** |

## 7. Data and intellectual-property position

### 7.1 Data sources

The repository includes historical counselling PDFs/XLSX files, extracted records, source indexes, college/course material, news artifacts and user/community submissions. The company must maintain a source register for every production data release, recording source authority, source URL, publication date, acquisition date, transformation command, output artifact, reviewer and release date.

Historical cutoffs, source notices, college data, externally sourced content and user submissions may carry third-party rights or terms. Before commercial use, the company must assess rights to obtain, store, transform, display and redistribute each material class, and must retain source attribution where appropriate.

### 7.2 Company-owned materials

Potential company-owned material includes original source code (subject to third-party licences), interface design, original copy, original data transformations, documentation, branding, internally authored analysis and operational processes. The repository contains an MIT licence; the company must decide whether that licence reflects its intended commercial/IP strategy before company listing or external distribution.

### 7.3 User-generated content

Reviews, comments, suggestions, rank submissions and other community entries require terms granting the company the necessary right to host, moderate, remove and use the content. The company must prohibit unlawful, misleading, personal, defamatory, abusive or confidential submissions and provide a reporting/removal process.

## 8. Privacy and personal data

The application may process academic inputs (marks, ranks, category and preferences), result-lookup inputs/results, reviews/comments, payment/support data, browser storage and analytics/technical data.

Before external company listing or production scale-up, the company must publish and operate against a privacy notice that specifies:

1. Data controller/entity identity and privacy contact.
2. Categories of personal data collected and purpose for each category.
3. Legal basis/consent model as applicable.
4. Service providers and cross-border processing where applicable.
5. Retention periods, deletion process and user request channel.
6. Security measures at an appropriate factual level.
7. Children/minors policy, given the student audience.
8. Grievance/contact process applicable to the company and jurisdiction.

The current result-cache capability is a high-sensitivity area. Application numbers and parsed result information must be minimised, protected, time-limited, accessible only as necessary, and supported by user notice/consent and legal review.

## 9. Security and governance position

The codebase contains useful initial controls, including Razorpay signature verification, Vercel security headers, selected input validation/sanitisation, and Supabase RLS enablement. These controls are incomplete. The following must not be represented as resolved before remediation and verification:

| Finding | Company requirement |
| --- | --- |
| Browser-visible admin passphrase | Replace with server-verified authentication and role-based authorization |
| Browser unlock/access code | Enforce entitlement server-side for protected actions/data |
| Broad Supabase mutation policies in bootstrap schema | Audit live RLS and remove unrestricted public mutation access |
| Client-referenced private AI key | Move private provider calls server-side and rotate exposed keys |
| No demonstrated comprehensive API abuse controls | Add rate limits, payload limits, schema validation, monitoring and alerts |
| Result lookup/cache | Establish data minimisation, access, consent, retention and deletion controls |
| CSP permits unsafe directives | Harden after compatibility testing |
| Incomplete automated security/E2E tests | Add release gates for policy, payment, API and critical user flows |

The company should maintain an information-security owner, a confidential credential register, a change-approval record, incident-response process, vendor inventory, and regular access/policy reviews.

## 10. Regulatory and commercial statements

The company must obtain advice from qualified legal, tax, accounting, payment, and privacy professionals before representing itself as compliant with any statute, regulation, certification, educational authority policy, payment requirement, or data-protection regime.

The following statements are appropriate only when true and documented:

- “Independent counselling information and decision-support platform.”
- “Historical data and estimates are provided for informational purposes.”
- “Users should verify all admissions decisions against official authority notices.”

The following statements must not be used unless independently established:

- “Official KCET/COMEDK partner” or any implied authority affiliation.
- “Guaranteed admission,” “accurate rank,” or “guaranteed counselling result.”
- “Secure” or “privacy compliant” without a defined scope and evidence.
- “AI advice” as a substitute for official or professional counselling.

## 11. Commercial model

The repository supports donations/payments and premium-feature access concepts. The final commercial model, pricing, taxes, refunds, customer support and terms must be defined by the registered entity before revenue collection at scale.

| Area | Required company decision |
| --- | --- |
| Legal merchant/payee | Registered entity and bank account |
| Pricing | **[Insert plans, price, currency and tax treatment]** |
| Refunds | **[Insert refund/cancellation policy and contact]** |
| Payment receipts/invoices | **[Insert accounting/tax process]** |
| Premium entitlement | Server-enforced rule and support restoration process |
| Donations | Clarify whether payment is donation, subscription, product fee or another lawful commercial category |
| Customer support | **[Insert channel, hours and response target]** |

## 12. Governance and responsibility matrix

| Function | Accountable role | Current / required evidence |
| --- | --- | --- |
| Company and legal records | Founder/director/designated partner | Registration, tax, bank and statutory records |
| Product roadmap | Product owner | Release plans and change records |
| Engineering | Technical owner | Code review, build/test records, deployment record |
| Data releases | Data owner | Source register, validation report and approval |
| Security | Security owner | Risk register, policy reviews, credential register and incidents |
| Privacy | Privacy/grievance owner | Published notice, data map, request log and retention schedule |
| Payments | Finance/operations owner | Provider reconciliation, refund record and merchant policy |
| Community moderation | Moderator/operations owner | Moderation rules, reports and decisions |
| Customer support | Support owner | Support channels, issue records and escalation procedure |

Fill named people/teams and escalation contacts before formal external use.

## 13. Company operational procedures

### Product release

Every release requires a reviewed change set, lint/test/build results, applicable manual checks, deployment record, rollback target and updated documentation where behaviour changes.

### Data release

Every counselling-data release requires original-source retention, source provenance, extraction record, schema/range/duplicate validation, comparison against prior data, human source spot checks, approved served artifact, reviewer sign-off and rollback version.

### Incident response

For a data, security, payment, availability or privacy incident: contain the feature/credential, preserve minimal evidence, assess affected data/users/providers, remediate, validate, follow applicable notification requirements, and record root cause plus preventive controls.

### Vendor management

Maintain a vendor register for Vercel, Supabase, Razorpay, NVIDIA, analytics/advertising services and every new processor. Record service purpose, data shared, contractual terms, account owner, renewal/termination process and outage/dependency plan.

## 14. Listing-ready company description

Use the following only after replacing legal placeholders and ensuring public policies match practice:

> KCETCoded is an independent education-technology platform for KCET and COMEDK counselling research. The platform helps applicants explore historical cutoffs, evaluate college and course options, use rank-estimation and planning tools, and access counselling-support resources. KCETCoded provides informational decision support and does not represent KEA, COMEDK, colleges, or any government authority. Users are encouraged to verify all consequential admissions decisions through official sources.

## 15. Pre-listing checklist

- [ ] Register and insert legal entity details, address, directors/partners and official contact.
- [ ] Register/confirm domain ownership, business email and brand ownership/permission.
- [ ] Confirm whether the MIT repository licence fits the company’s intended IP strategy.
- [ ] Finalise Terms, Privacy Policy, Payment/Refund Policy and grievance contact.
- [ ] Create data source register and release approval process.
- [ ] Complete live Supabase RLS audit and remove insecure policies.
- [ ] Replace client-side admin/access controls with server-side authentication/authorization.
- [ ] Remove/rotate any client-exposed private API key and secret fallback.
- [ ] Implement API rate limits, request validation, logging/monitoring and incident contact.
- [ ] Establish result-data consent, retention, deletion and access controls.
- [ ] Test payment reconciliation, refund handling and server-side entitlements.
- [ ] Create support, moderation, vendor and incident-response operating procedures.
- [ ] Obtain legal/tax/privacy review appropriate to intended scale and jurisdiction.

## 16. Reference documents

- [Official technical and operational documentation](OFFICIAL_PROJECT_DOCUMENTATION.md)
- [Detailed documentation package](docs/README.md)
- [README and developer quick start](README.md)

This company profile is a factual product/company template, not incorporation paperwork or a compliance certificate. It must be completed and reviewed by the company’s authorised legal and operational representatives before official submission or publication.

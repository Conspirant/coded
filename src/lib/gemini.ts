// OpenRouter AI Integration for KCET Counselor 2.0
// Using OpenAI-compatible API format with multi-model cascade fallback

import { executeToolsForQuery, StudentProfileFilters } from './ai-tools';
import type { RecommendationCardData } from '@/components/counselor/CounselorRecommendationCard';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Top tier free models with cascading fallback (Fastest first)
const MODELS = [
    'nvidia/nemotron-3-super-120b-a12b:free',
    'minimax/minimax-m3:free',
];

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    recommendations?: RecommendationCardData[];
    actionChips?: Array<{ label: string; url: string; icon?: string }>;
    quickReplies?: string[];
    stepType?: 'college' | 'year' | 'round' | 'category';
}

// Data interfaces
interface CutoffEntry {
    institute: string;
    institute_code: string;
    course: string;
    category: string;
    cutoff_rank: number;
    year: string;
    round: string;
}

// Cache for the cutoff dataset
let cachedData: CutoffEntry[] | null = null;
let isFetching = false;

const SYSTEM_PROMPT = `You are TesselBot - an advanced, articulate AI companion and senior engineering & admissions strategist.

## YOUR DUAL CAPABILITIES & VERSATILITY:

### 1. Casual, Academic & Tech Interactions (General Mode):
- You can converse naturally and engagingly about ANY topic: general conversation, humor, philosophy, coding (Python, TypeScript, C++, Rust, Go, DSA, System Design, AI/ML, Web Dev), career roadmaps, college lifestyle, hostel stories, study hacks, exam stress, Bangalore tech culture, startup ecosystems, and beyond.
- When the user asks a casual greeting, general curiosity question, programming problem, or life advice: Respond conversationally, warmly, concisely, and intelligently. NEVER force KCET cutoff tables or rigid admissions templates onto casual questions.

### 2. Engineering Admissions & Counseling Mastery (Admissions Mode):
- When the user asks about colleges, cutoffs, ranks, counseling rounds, choice filling, or branch decisions, you switch seamlessly into your high-precision counselor persona.
- You have deep specialization across KCET, COMEDK, JEE Main/Advanced, BITSAT, PESSAT, and Karnataka engineering institutions.
- You are backed by 240,000+ official KEA cutoff records (2023-2026), 1,840+ verified senior community threads (r/PESU, r/RVCE, r/BMSCE, r/MSRIT, r/kcet, r/comedk, r/Btechtards, r/bangalore), official KEA gazettes, reservation quotas, and 220+ verified college dossiers.
- **Full 2023-2026 Cutoff Data Availability**: Your dataset contains cutoff benchmarks for 2023, 2024, 2025, and 2026 across all rounds (R1, R2, R3, Mock). When the user asks for 2026 (or any year) cutoffs, ALWAYS directly output the exact cutoff records and markdown tables provided in your database context. NEVER lecture the user that 2026 has not occurred or give philosophical timeline disclaimers.
- **Strict Category Grounding**: When the user requests cutoffs for a specific category (e.g. 3AG, 2AG, 2BG, 3BG, 1G, SCG, STG), you MUST report the exact ranks for that requested category from the database context. NEVER substitute GM (General Merit) ranks into a table column or response labelled as 3AG or another category.
- **Proactive Format Guidance**: If the user asks an underspecified cutoff question (e.g. missing college code, branch, or category), answer with the closest data and briefly mention the fastest query format: "[College Code (e.g. E005, E126, E021)] + [Branch] + [Category (GM/2A/3B/SNQ)] + [Round/Year]".

## CONVERSATIONAL TONE & PERSONALITY GUIDELINES:
- **Zero Preachiness & No Corporate HR Speak**: Never lecture the user, scold them, give patronizing disclaimers, or sound like a corporate HR bot. If the user vents, uses profanity, or is sarcastic, remain calm, unfazed, and grounded. Respond with chill composure, dry wit, or brief practical directness.
- **Never Output Meta-Commentary**: NEVER output commentary about your instructions or rules (e.g. NEVER write "(Zero emojis used...)", "(Adhering to guidelines)", or "(Response formatted cleanly)"). Silently adhere to instructions without narrating what rules you followed.
- **Zero Emojis**: Do not use emojis anywhere in your output. Keep text clean and markdown-styled.
- **Natural, Articulate & Grounded**: Speak like an experienced, sharp senior engineer and mentor—concise, smart, and direct.

## CORE 2025-2026 ADMISSIONS & COUNSELING KNOWLEDGE BASE:

### 1. KCET 50:50 Composite Rank Formula & Normalization
- Formula: 50% of KCET Score (out of 180 or normalized to 100) + 50% of Board PCM/PCB Score (Physics + Chemistry + Math out of 300 converted to 100).
- Normalization: CBSE, ICSE, and Karnataka State Board PCM scores are normalized by KEA to balance difficulty variance.
- Real-World Composite vs Rank Benchmarks:
  - 95.0%+ Composite -> Ranks 1 to 300 (RVCE CSE / Top Tier 1 Core Tech)
  - 91.0% - 94.9% -> Ranks 300 to 1,500 (BMSCE, MSRIT, PES RR CSE/ISE)
  - 86.0% - 90.9% -> Ranks 1,500 to 4,200 (RVCE ECE, BMSCE/MSRIT AIML/DS, UVCE CSE)
  - 80.0% - 85.9% -> Ranks 4,200 to 9,500 (DSCE, BMSIT, BIT, NIE Mysore, SJCE Mysore Tech)
  - 74.0% - 79.9% -> Ranks 9,500 to 18,000 (RNSIT, CMRIT, SIT Tumkur, NMIT, Sir MVIT Tech)
  - 65.0% - 73.9% -> Ranks 18,000 to 38,000 (Mid-tier Bangalore & Regional Tier-2 colleges)
  - 55.0% - 64.9% -> Ranks 38,000 to 85,000 (Emerging regional colleges & core branches)

### 2. KEA Counseling Rounds, Choices, Cancellation & Penalty Rules
- Option Entry System:
  - You can enter unlimited options. Choices are evaluated strictly from #1 downwards. The first choice meeting your cutoff is locked.
  - Golden Strategy: "Dream Colleges at top, Realistic targets in middle, Guaranteed Safeties at bottom."
- Four Choices Decoded (Official KEA Bulletin):
  - Choice 1 (Accept & Freeze): 100% satisfied. Pay full fee online, download Admission Order, report to college with originals before deadline. Exits counseling.
  - Choice 2 (Hold & Upgrade): Lock current allotted seat as a guaranteed safety backup while competing for higher-priority options in Round 2. Requires paying the seat fee to hold. If upgraded in Round 2, previous seat automatically passes to next candidate.
  - Choice 3 (Reject & Re-enter): Surrender currently allotted seat back to the pool without paying fee and compete for higher choices in Round 2.
  - Choice 4 (Quit): Withdraw from counseling entirely without paying fee (Zero penalty).
- Official KEA Seat Cancellation, Surrender & Rs 5,000 Penalty Protocol:
  - Scenario A (Choice 4 in Round 1 before paying any fee): 100% Free. Rs 0 penalty. You simply exit counseling online; no payment link or visit needed.
  - Scenario B (Surrendering seat AFTER paying fee via Choice 1 / Choice 2, before official surrender deadline):
    - **KEA's Official Online Penalty Payment Link**: KEA releases a dedicated online payment link on the official portal (cetonline.karnataka.gov.in) titled *"Payment of Penalty for Seat Cancellation / Surrender"*.
    - Candidates log in with their CET number, pay the **Rs 5,000 penalty online directly via the KEA link** (UPI/Netbanking/Debit Card), and download the official Seat Surrender Acknowledgment.
    - The remaining paid tuition fee balance is processed and refunded to the candidate's registered bank account.
    - **No Physical Visit to KEA Office**: Everything is completed online via KEA's official penalty link—students do NOT need to go to KEA Malleshwaram office in person.
  - Scenario C (Cancelling AFTER the last date of surrender / Round 2 Extended / Mop-up or failing to report):
    - 100% of the paid fee is forfeited (Zero refund).
    - Subject to KEA Anti-Seat Blocking penalties (up to 5x fee penalty and legal action under Karnataka Educational Institutions Act).
- NEET UG Surrender Shift (The Round 2/3 Goldmine):
  - Over 2,500+ top engineering seats in RVCE, BMSCE, MSRIT, PES, and UVCE are initially blocked by top rankers who later surrender them once Medical (NEET) Round 1/2 allotments conclude.
  - This creates significant cutoff expansion (+1,500 to +15,000 ranks) between Round 1 and Round 2 / Extended Round for general and reserved categories.

### 3. Karnataka Quotas & Reservation Matrix
- Categories: GM (General Merit), 1G, 2AG, 2BG, 3AG, 3BG, SCG, STG.
- Special Sub-Quotas:
  - Kannada Medium (GMK/2AK/3BK): 1st to 10th standard studied in Kannada medium in Karnataka (5% reservation).
  - Rural Quota (GMR/2AR/3BR): 1st to 10th standard studied in designated rural areas (15% reservation).
  - Article 371(J) / Hyderabad-Karnataka: 8% state reservation / 70% local institutional reservation for Bidar, Kalaburagi, Yadgir, Raichur, Koppal, Ballari, Vijayanagara.
  - SNQ (Supernumerary Quota): 5% extra seats per branch for annual family income < Rs 8,00,000. Massive tuition waiver: Tuition fee is ~Rs 20,000 - 25,000/yr instead of ~Rs 1,12,000/yr.
- Document Verification (Mandatory for Secret Key):
  - 15-digit Revenue Department (RD) numbers for Caste/Income Certificates.
  - Study certificates signed by Head of Institution and counter-signed by BEO/DDPI (minimum 7 continuous years in Karnataka for Clause A).

### 4. College Subreddit Communities & Senior Ground Truths (2024-2026 Reality)
- r/PESU (PES University - Ring Road & Electronic City):
  - Academic Structure: Relentless continuous evaluation with 5 In-Semester Assessments (ISAs) per semester. Strict relative grading with high bell-curve pressure. 8:00 AM - 4:30 PM schedule.
  - Crowd & Cost Divide: Huge divide between KCET rankers (~Rs 1.1L/yr) and PESSAT admissions (~Rs 4.8L+/yr).
  - Placements: Premier tier-1 visits (Apple, Microsoft, Cisco, Intuit). Strict placement eligibility (7.5+ CGPA threshold, single-offer policy for tier-1). Median ~11-13 LPA.
  - Campus: RR campus has iconic Golden Jubilee block and intense competition; EC campus is quieter and closer to tech parks with identical placement pool.

- r/RVCE (RV College of Engineering - Mysore Road E005):
  - Academic Discipline: Strict 85% attendance hard requirement (less than 75% results in NS grade / semester drop). High assignment and project load.
  - Placements: Undisputed apex tech and core placements in Karnataka (median ~14-16 LPA for Tech). Top semiconductor and software density (Google, Texas Instruments, Qualcomm, Nvidia, Atlassian).
  - Transit & Campus: Directly connected via RVCE Mysore Road Purple Line Metro. 8th Mile tech fest is major Bangalore event.

- r/BMSCE (BMS College of Engineering - Basavanagudi E003):
  - Intake & Competition: Massive expansion in CS allied branches (CSE + AIML + AIDS + IoT + Cyber = 1,200+ batch in Tech). Cutoffs drifted wider (+1,500 ranks). Intense competition to clear on-campus shortlisting tests.
  - Campus Life & Vibe: Most vibrant campus in central Bangalore (Bull Temple Road, Gandhi Bazaar). Utsav cultural fest is legendary.
  - Placements: Top companies still recruit heavily (median ~9-11 LPA), but students must maintain 8.5+ CGPA to stand out from large batch size.

- r/MSRIT (Ramaiah Institute of Technology - Mathikere E006):
  - Culture & Balance: Proctor system with close faculty oversight. 75% attendance policy. Excellent balance of academics and Bangalore life in Mathikere.
  - Placements: Stellar core engineering (Mechanical, Civil) alongside Tier-1 tech and electronics (median ~10-12 LPA). Companies love Ramaiah graduates for steady technical fundamentals.

- r/UVCE (University Visvesvaraya College of Engineering - KR Circle E001):
  - ROI & Legacy: Lowest fee structure in Karnataka (~Rs 40,000/yr). Heritage 100+ year alumni network across Silicon Valley, PSU, and civil services.
  - Culture: Completely student-run Training & Placement Cell (TPC). Older infrastructure and labs require self-driven initiative and coding club participation. Median ~8-10 LPA.

- r/DSCE (Dayananda Sagar College of Engineering - Kumaraswamy Layout E007):
  - Campus & Vibe: 28-acre sprawling hillside campus with active tech & cultural clubs (Point Blank coding club). Large student crowd. Tech median ~7.5-9 LPA.

- BMSIT (Yelahanka E126) & BIT (VV Puram E008):
  - BMSIT: Peaceful North Bangalore campus, autonomous since 2023, climbing cutoffs, modern labs (median ~7-8.5 LPA).
  - BIT: Historic college located right on VV Puram food street, National College Metro station adjacent, strong tech placement cell (median ~7-8 LPA).

- Mysuru & Regional Powerhouses:
  - SJCE / JSS STU (Mysuru E021): 102-acre lush green campus, apex tech placements outside Bangalore (Amazon, Cisco, Mercedes, median ~8.5-10.5 LPA).
  - NIE Mysuru (E022): South campus (core) & North campus (tech). Historic engineering prestige (median ~7.5-9 LPA).
  - SIT Tumkur (E016): Autonomous, strict discipline, Siddaganga mutt heritage, strong regional placement brand (median ~6.5-8 LPA).
  - KLE Tech Hubballi (E036) & SDMCET Dharwad (E024): Premier autonomous tech hubs in North Karnataka.
  - Coastal Karnataka (NMAMIT Nitte E080, Sahyadri Mangalore E144): High academic discipline, strong hackathons, coastal campus culture.

### 5. Fee Structures (2025-2026 Reference)
- Govt Colleges (UVCE/SKSJTI): ~Rs 38,000 - Rs 45,000 / year.
- Govt Quota in Private Engineering Colleges (KCET): ~Rs 1,07,000 - Rs 1,12,000 / year (+ university/exam fee ~Rs 10,000 - 15,000).
- SNQ Quota (Tuition Fee Waiver): ~Rs 20,000 - Rs 26,000 / year.
- COMEDK Quota: ~Rs 2,60,000 - Rs 2,81,000 / year (+ institutional fees ~Rs 30,000 - 45,000).

### 6. COMEDK UGET & Uni-GAUGE Counseling Dynamics
- Exam Format: 180 questions (60 Physics, 60 Chemistry, 60 Math), 180 minutes, 1 mark per question, zero negative marking.
- Counseling Process (3 Online Rounds):
  - Round 1: Open for all eligible rank holders. Choices: Accept & Freeze, Accept & Upgrade, Reject & Upgrade, Reject & Withdraw.
  - Round 2: Phase 1 (HKR quota) and Phase 2 (General Merit). Cutoffs expand significantly as KCET and JoSAA allotments pull top students away.
  - Round 3: Final round. Critical rule: Any seat retained into Round 3 is legally binding and non-refundable. Candidates must report to the college or face seat blocking penalties.
- Benchmarks for COMEDK GM:
  - RVCE: CSE < 450, ISE < 700, AIML < 850, ECE < 1,600.
  - BMSCE: CSE < 1,200, AIML/DS < 1,900, ECE < 3,200.
  - MSRIT: CSE < 1,400, AIML/DS < 2,100, ECE < 3,600.
  - DSCE: CSE < 3,800, AIML/DS < 5,200, ECE < 8,500.
  - BMSIT: CSE < 5,500, AIML < 7,500, ECE < 12,000.
  - BIT: CSE < 6,000, AIML < 8,500, ECE < 14,000.
  - SJCE / JSS STU Mysuru: CSE < 3,500, ECE < 7,000.
  - NIE Mysuru: CSE < 5,500, ECE < 11,000.

### 7. Branch Breakdown & Career Realities (CSE vs Allied vs Circuital vs Core)
- CSE Core vs Specializations (AI/ML, Data Science, Cyber Security, IoT):
  - Campus Placement Reality: 98% of tech companies (Google, Microsoft, Amazon, Cisco, Goldman Sachs, Intuit) open their coding rounds equally to CSE, ISE, AIML, and Data Science without distinction.
  - GATE CSE Alignment: CSE Core and ISE align 100% with the GATE CS syllabus. AIML/DS students require independent study for Compilers, Automata, and Theory of Computation.
  - Overseas Higher Studies (MS in CS): International universities (US, Germany, Canada) evaluate foundational CS credits (Operating Systems, Computer Networks, DBMS, Compilers, Computer Architecture). Allied branch students can fulfill these via departmental electives.
- ECE & The Semiconductor / VLSI Boom:
  - Bangalore is India's core semiconductor hub. Top firms (Texas Instruments, Qualcomm, Nvidia, Intel, AMD, ARM, Synopsys, Cadence) recruit directly from RVCE, BMSCE, MSRIT, and PES.
  - Dual Eligibility: ECE students with 8.0+ CGPA and strong DSA skills can participate in both Hardware/VLSI core jobs AND 85%+ of tech software shortlisting drives.
- Mechanical, Civil, Aerospace & Robotics:
  - Premier PSU & aerospace recruitment exists in Bangalore (ISRO, HAL, BEL, BHEL, DRDO, Boeing, Airbus, Mercedes-Benz R&D).
  - Students aiming for core must prioritize top tier-1 institutions (RVCE, MSRIT, UVCE, BMSCE, SJCE) for campus placement pipelines.

### 8. Engineering Student Roadmap & Career Acceleration
- 1st Year (Physics & Chemistry Cycles):
  - Focus on scoring 8.5+ CGPA. In autonomous colleges (BMSCE, MSRIT, DSCE, BMSIT, NIE), top 1st-year CGPA qualifies you for institutional branch upgrade if vacancies arise.
  - Learn C / C++ or Python deeply. Master version control (Git & GitHub) and Linux basics.
- 2nd Year (Core CS & DSA):
  - Master foundational Data Structures and Algorithms (Arrays, Two Pointers, Trees, Graphs, Dynamic Programming).
  - Build tangible full-stack projects (Next.js, Node.js, Python FastAPI, PostgreSQL).
  - Ace college courses in Data Structures, Discrete Mathematics, and Computer Architecture.
- 3rd Year (Internships & Open Source):
  - Prepare for on-campus summer internship assessments (start in 5th semester).
  - Participate in Bangalore hackathons (Devfolio, ETHIndia, Smart India Hackathon) and open-source programs (GSoC, LFX).
- 4th Year (Final Placements):
  - System Design fundamentals (LLD & HLD), core CS revision (OS, DBMS, Networks, OOPs), and mock behavioral interviews.

### 9. Autonomous vs VTU Affiliated vs Private Universities
- Autonomous Colleges under VTU (RVCE, BMSCE, MSRIT, DSCE, BMSIT, BIT, NIE, SJCE, SIT):
  - Curriculum: Independently framed Board of Studies (BoS) syllabus updated every 1-2 years to match industry tech stacks (Cloud, Kubernetes, AI/ML, Rust).
  - Valuation & Results: Conducted internally by college faculty. Results published within 2 weeks of exams without VTU central delays.
  - Branch Change: Permitted at the end of 1st year based purely on CGPA (usually 8.5+) against institutional vacant seats.
- VTU Centralized Non-Autonomous Colleges:
  - Strict adherence to VTU Belagavi syllabus, standardized external examination centers, and centralized evaluation.
  - Slower revaluation timelines and rigid curriculum cycles.
- Private Universities (PES University, REVA, Alliance):
  - Complete academic freedom, continuous ISA evaluation, relative grading on a Gaussian bell curve, and separate high-fee intake pools (e.g. PESSAT vs KCET).

### 10. The Tactical 100+ Option Entry Blueprint & Golden Rules
- Sequential Evaluation: KEA algorithm scans choices sequentially from #1 to #N. The instant an option cutoff matches your rank, the seat is allotted and ALL subsequent lower options (#N+1 onwards) are permanently ignored for that round.
- 4-Tier Strategy:
  - Dream Tier (1-25): RVCE, BMSCE, MSRIT, PES RR (CSE, ISE, AIML, ECE). Options above your rank where surprise Round 2/3 drops can occur.
  - Realistic Target Tier (26-60): Colleges where previous year Round 2 cutoffs fall within ±15% of your rank (DSCE, BMSIT, BIT, UVCE, NIE, SJCE).
  - High-Probability Tier (61-90): Colleges where cutoffs are +20% to +40% higher than your rank (RNSIT, CMRIT, NMIT, SIT, Sir MVIT).
  - Guaranteed Safety Tier (91-120+): Solid mid-tier institutions ensuring you never end a round without an allotted backup.
- Fatal Option Entry Mistakes:
  - Putting a lower-ranked college above a higher-ranked one simply because "my rank is closer to it".
  - Entering colleges without checking distance, transit (Metro access), or hostel availability.
  - Forgetting to fill all allied specializations (e.g., adding only CSE Core and missing CSE-DS, AIML, and ISE).

### 11. KEA Domicile Eligibility Clauses & Verification Protocols
- Clause A (Standard Karnataka Candidate): Minimum 7 continuous academic years of study in Karnataka from 1st to 12th standard + passed 10th or 12th in Karnataka. Requires study certificates signed by school head and counter-signed by BEO/DDPI.
- Clause B: Studied outside Karnataka but parent has resided/studied in Karnataka for 7+ years.
- Clause C & D: Children of Defence personnel / Ex-servicemen serving in Karnataka.
- 15-Digit RD Number: Mandatory computerized Revenue Department verification for Caste (Form D/E/F), Income (< ₹8 LPA for SNQ / 2A / 3A / 3B), and Rural / Kannada medium certificates.
- SNQ Quota: 5% extra seats per course. Slashes 4-year tuition fee from ~₹4.5 Lakhs to under ₹1 Lakh.

### 12. Expanded Regional & Bangalore College Dossiers
- North Bangalore Tech Corridor:
  - BMSIT Yelahanka (E126): Autonomous, top modern infra, 7-8.5 LPA tech median.
  - NHCE Marathahalli / Ring Road (E099): Autonomous, prominent Outer Ring Road tech corridor hub, 7-8.5 LPA median.
  - NMIT Yelahanka (E095): Autonomous, strong aerospace and CSE clubs, 6.5-7.5 LPA median.
  - Sir MVIT (E012): Historic green campus, 6.5-7.5 LPA median.
  - Sai Vidya SVIT (E173): Doddaballapur Road, calm academic environment, strong faculty mentoring, 5-6.5 LPA median.
- East Bangalore / Whitefield Tech Belt:
  - CMRIT (E098): Kundalahalli gate, ITPL adjacency, high startup activity, 6.5-7.5 LPA median.
  - MVJ College of Engineering (E018): Whitefield, strong robotics & aero lab, 5.5-6.5 LPA median.
  - Cambridge Institute of Technology (E067): KR Puram, active placement cell, 5.5-6.5 LPA median.
  - East Point (E072): Large medical & engineering integrated campus, 5-6 LPA median.
- South Bangalore Educational Hub:
  - RNSIT Channasandra (E059): High placement discipline, proximity to Mysore Road metro, 6.5-8 LPA median.
  - BNMIT Banashankari (E066): Strict discipline, high academic focus, 6.5-7.5 LPA median.
  - JSSATE Bangalore (E058): Peaceful campus, strong electronics and IT placements, 6.5-7.5 LPA median.
  - Oxford College of Engineering (E061): Bommanahalli, Silk Board adjacency, 5-6.2 LPA median.
- Premier Outstation & Coastal Powerhouses:
  - SJCE / JSS STU Mysuru (E021): 102-acre apex campus, highest placement packages outside Bangalore.
  - NIE Mysuru (E022): Historic tech legacy, North Campus dedicated to CS/IS/AI branches.
  - SIT Tumkur (E016): Autonomous, premier placement record in Tumkur region.
  - NMAMIT Nitte (E080): Karkala Mangalore, autonomous powerhouse with high campus life ratings.
  - Sahyadri Mangalore (E144): Renowned national hackathon incubator and robotics culture.

## RESPONSE FORMATTING RULES:
1. Casual / General Questions: Respond with natural, articulate markdown prose, code blocks, or simple bullets as fitting. Be witty, encouraging, and clear.
2. Admissions / Cutoff Queries:
   - Always state official KEA codes (e.g. RVCE (E005), BMSCE (E003), SVIT (E173)).
   - Provide structured breakdowns with Strategic Overview, Cutoff Matrix, Campus/Placement Ground Truths, and Tactical Advice.
3. Honesty: Always provide senior-validated truth without sugarcoating or sponsored bias.`;

const STOP_WORDS = new Set([
    'can', 'i', 'get', 'for', 'rank', 'and', 'category', 'cat', 'college', 'in', 'the', 'a', 'an', 'is',
    'what', 'how', 'best', 'top', 'list', 'cutoff', 'cutoffs', 'seat', 'seats', 'round',
    'admission', 'engineering', 'branch', 'course', 'quota', 'bangalore', 'mysore', 'karnataka',
    'available', 'possible', 'chances', 'tell', 'me', 'about', 'vs', 'better'
]);

import { CutoffService } from '@/lib/cutoff-service';
import { matchCollegeFromDatabase, matchesCourseBranch } from './ai-tools';

async function fetchCutoffData(onStatus: (status: string) => void): Promise<CutoffEntry[]> {
    if (cachedData && cachedData.length > 0) return cachedData;
    if (isFetching) {
        while (isFetching) {
            await new Promise(r => setTimeout(r, 100));
            if (cachedData && cachedData.length > 0) return cachedData;
        }
    }

    isFetching = true;
    try {
        onStatus("Scanning high-volume master cutoff database (kcet_cutoffs_high_volume.dat)...");
        const res = await fetch('/data/kcet_cutoffs_high_volume.dat', { cache: 'no-cache' });
        if (res.ok) {
            const raw = await res.json();
            const list = Array.isArray(raw) ? raw : (raw.cutoffs || raw.data || []);
            if (list.length > 0) {
                cachedData = list.map((c: any) => ({
                    institute: c.college_name || c.institute || c.institute_code,
                    institute_code: c.institute_code || c.college_code || '',
                    course: c.branch_name || c.course || '',
                    category: c.category || 'GM',
                    cutoff_rank: parseInt(c.cutoff_rank || '0') || 0,
                    year: String(c.year || '2026'),
                    round: String(c.round || 'R1')
                }));
                isFetching = false;
                return cachedData;
            }
        }
    } catch (e) {
        console.warn("Direct fetch in gemini.ts failed, falling back to CutoffService:", e);
    }

    try {
        const allCutoffs = await CutoffService.loadCutoffs();
        if (allCutoffs && allCutoffs.length > 0) {
            cachedData = allCutoffs.map(c => ({
                institute: c.college_name || c.institute_code,
                institute_code: c.institute_code,
                course: c.branch_name || c.course,
                category: c.category,
                cutoff_rank: c.cutoff_rank,
                year: c.year,
                round: c.round
            }));
            isFetching = false;
            return cachedData;
        }
    } catch (e) {
        console.warn("CutoffService load in gemini.ts failed:", e);
    } finally {
        isFetching = false;
    }

    return [];
}

function searchRelevantData(query: string, data: CutoffEntry[]): CutoffEntry[] {
    const terms = query.toLowerCase()
        .replace(/[?.,!-]/g, ' ')
        .split(/\s+/)
        .filter(t => t.length > 1 && !STOP_WORDS.has(t));

    const rankMatch = query.match(/(\d{3,6})/);
    const codeMatch = query.toUpperCase().match(/E\d{3}/);
    const matchedCol = matchCollegeFromDatabase(query);
    const targetCode = matchedCol ? matchedCol.code : (codeMatch ? codeMatch[0] : null);

    const courseMatch = query.match(/\b(data\s*science|data\s*sc|ai\s*&?\s*ml|aiml|artificial\s*intelligence|cyber\s*security|cyber|iot|computer\s*science|information\s*science|cse|cs|ise|is|ece|eee|mech|civil|ete|eie|vlsi|robotics|biotech|chemical|it|tc|ei)\b/i);
    const targetCourse = courseMatch ? courseMatch[0] : undefined;

    const queryCategoryMatch = query.match(/\b(1G|1R|1K|2AG|2AR|2AK|2BG|2BR|2BK|3AG|3AR|3AK|3BG|3BR|3BK|GM|GMR|GMK|SCG|SCR|SCK|STG|STR|STK)\b/i);
    const targetCategory = queryCategoryMatch ? queryCategoryMatch[0].toUpperCase() : undefined;

    const lowerQ = query.toLowerCase();
    const wantsR2 = lowerQ.includes('r2') || lowerQ.includes('round 2') || lowerQ.includes('round-2') || lowerQ.includes('round2') || lowerQ.includes('2nd round');
    const wantsR1 = lowerQ.includes('r1') || lowerQ.includes('round 1') || lowerQ.includes('round-1') || lowerQ.includes('round1') || lowerQ.includes('1st round');

    const yearMatch = query.match(/\b(202[3-6])\b/);
    const targetYear = yearMatch ? yearMatch[1] : undefined;

    if (terms.length === 0 && !targetCode && !rankMatch) return [];

    let filtered = data.filter(item => {
        if (targetCode && item.institute_code.toUpperCase() !== targetCode.toUpperCase()) return false;
        if (targetCourse && !matchesCourseBranch(item.course, targetCourse)) return false;
        if (targetCategory && item.category.toUpperCase() !== targetCategory && !item.category.toUpperCase().startsWith(targetCategory)) return false;
        if (targetYear && item.year !== targetYear) return false;
        return true;
    });

    if (filtered.length === 0) {
        filtered = data.filter(item => {
            if (targetCode && item.institute_code.toUpperCase() !== targetCode.toUpperCase()) return false;
            if (targetCourse && !matchesCourseBranch(item.course, targetCourse)) return false;
            return true;
        });
    }

    if (filtered.length === 0) {
        filtered = data.filter(item => {
            if (targetCode && item.institute_code.toUpperCase() !== targetCode.toUpperCase()) return false;
            let score = 0;
            const cleanCourse = item.course.replace(/[\r\n\s\-_()]+/g, ' ').toLowerCase();
            const itemText = `${item.institute} ${cleanCourse} ${item.category} ${item.institute_code} ${item.year} ${item.round}`.toLowerCase();
            for (const term of terms) {
                if (itemText.includes(term)) score += 1;
            }
            return score >= Math.max(1, Math.floor(terms.length * 0.4));
        });
    }

    return filtered
        .sort((a, b) => {
            if (a.year !== b.year) return b.year.localeCompare(a.year);

            const isR2A = a.round.toUpperCase().includes('R2');
            const isR2B = b.round.toUpperCase().includes('R2');
            const isR1A = a.round.toUpperCase().includes('R1');
            const isR1B = b.round.toUpperCase().includes('R1');

            if (wantsR2 && isR2A !== isR2B) return isR2A ? -1 : 1;
            if (wantsR1 && isR1A !== isR1B) return isR1A ? -1 : 1;
            if (a.round !== b.round) return a.round.localeCompare(b.round);

            if (targetCategory) {
                const isTargetA = a.category.toUpperCase() === targetCategory || a.category.toUpperCase().startsWith(targetCategory);
                const isTargetB = b.category.toUpperCase() === targetCategory || b.category.toUpperCase().startsWith(targetCategory);
                if (isTargetA && !isTargetB) return -1;
                if (isTargetB && !isTargetA) return 1;
            }

            if (a.category === 'GM' && b.category !== 'GM') return -1;
            if (b.category === 'GM' && a.category !== 'GM') return 1;
            return a.category.localeCompare(b.category);
        })
        .slice(0, 60);
}

async function tryModel(
    model: string,
    messages: Array<{ role: string; content: string }>
): Promise<{ success: boolean; content?: string; shouldRetry: boolean }> {
    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'KCET Coded AI Counselor 2.0'
        },
        body: JSON.stringify({
            model,
            messages,
            temperature: 0.6,
            max_tokens: 4096,
        }),
    });

    if (!response.ok) {
        const status = response.status;
        const errorBody = await response.text().catch(() => 'No error body');
        console.error(`Model ${model} failed - Status: ${status}, Body: ${errorBody}`);

        if (status === 429 || status === 404 || status === 503 || status === 524) {
            return { success: false, shouldRetry: true };
        }

        if (status === 401) {
            throw new Error('Invalid API key. Please check your OpenRouter API key in .env file.');
        }

        return { success: false, shouldRetry: false };
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
        return { success: false, shouldRetry: true };
    }

    return { success: true, content: data.choices[0].message.content, shouldRetry: false };
}

async function tryNvidiaChatFallback(
    messages: Array<{ role: string; content: string }>
): Promise<string | null> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1500);
        const response = await fetch('/api/nvidia-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) return null;
        const data = await response.json();
        return data.content || null;
    } catch (err) {
        return null;
    }
}

function buildActionChips(
    content: string,
    userMessage: string,
    profileFilters?: StudentProfileFilters
): Array<{ label: string; url: string }> {
    const actionChips: Array<{ label: string; url: string }> = [];
    const lowerMsg = userMessage.toLowerCase();

    // Detect clash/compare intent
    const collegeCodes = content.match(/E\d{3}/g) || userMessage.match(/E\d{3}/g);
    if (collegeCodes && collegeCodes.length >= 2) {
        actionChips.push({
            label: `Clash: ${collegeCodes[0]} vs ${collegeCodes[1]}`,
            url: `/cutoff-clash?c1=${collegeCodes[0]}&c2=${collegeCodes[1]}`
        });
    } else if (lowerMsg.includes('vs') || lowerMsg.includes('compare') || lowerMsg.includes('better')) {
        actionChips.push({
            label: `Open Cutoff Clash`,
            url: `/cutoff-clash`
        });
    }

    // Rank predictor / College predictor chip
    if (profileFilters?.rank || /\d{3,6}/.test(userMessage)) {
        actionChips.push({
            label: `Open College Predictor`,
            url: `/college-predictor`
        });
    }

    // Metro / Commute chip
    if (lowerMsg.includes('metro') || lowerMsg.includes('commute') || lowerMsg.includes('travel') || lowerMsg.includes('bangalore') || lowerMsg.includes('bengaluru')) {
        actionChips.push({
            label: `Namma Metro College Map`,
            url: `/metro-mapper`
        });
    }

    // Fee chip
    if (lowerMsg.includes('fee') || lowerMsg.includes('cost') || lowerMsg.includes('budget') || lowerMsg.includes('lakh')) {
        actionChips.push({
            label: `Calculate 4-Year Fees`,
            url: `/fee-calculator`
        });
    }

    // Choice filling / mock simulator
    if (lowerMsg.includes('choice') || lowerMsg.includes('option') || lowerMsg.includes('round') || lowerMsg.includes('priority')) {
        actionChips.push({
            label: `Mock Option Entry Simulator`,
            url: `/mock-simulator`
        });
    }

    // Document verification
    if (lowerMsg.includes('doc') || lowerMsg.includes('certificate') || lowerMsg.includes('verification') || lowerMsg.includes('study certificate')) {
        actionChips.push({
            label: `Document Verification Checklist`,
            url: `/documents`
        });
    }

    return actionChips;
}

function cleanAiResponse(text: string): string {
    if (!text) return '';
    let cleaned = text;

    // Remove trailing or standalone meta-commentary in parentheses or brackets
    cleaned = cleaned.replace(/\s*\([^\n)]*(?:zero\s*(?:fluff|emoji|emojis|hallucination)|no\s*emojis?|adheres?\s*to|senior\s*fixes|strict\s*professionalism|guidelines?|rules?)[^\n)]*\)\s*$/gim, '');
    cleaned = cleaned.replace(/^\s*\([^\n)]*(?:zero\s*(?:fluff|emoji|emojis|hallucination)|no\s*emojis?|adheres?\s*to|senior\s*fixes|strict\s*professionalism|guidelines?|rules?)[^\n)]*\)\s*$/gim, '');
    cleaned = cleaned.replace(/\s*\[[^\n\]]*(?:zero\s*(?:fluff|emoji|emojis)|no\s*emojis?|adheres?\s*to|senior\s*fixes|strict\s*professionalism)[^\n\]]*\]\s*$/gim, '');

    // Remove any leftover emojis
    cleaned = cleaned.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{2388}-\u{23FF}]/gu, '');

    return cleaned.trim();
}

function handleConversationalCutoffStep(
    userMessage: string,
    conversationHistory: Message[] = [],
    profileFilters?: StudentProfileFilters,
    dataset?: CutoffEntry[]
): { handled: boolean; response: string; quickReplies: string[]; stepType?: 'college' | 'year' | 'round' | 'category' } | null {
    const raw = userMessage.trim();
    const lower = raw.toLowerCase();

    // 1. Check if user is asking to start cutoff flow
    const isGenericCutoffTrigger = (
        lower.includes("step-by-step") ||
        lower.includes("step by step") ||
        lower.includes("cutoff finder") ||
        lower.includes("cutoff explorer") ||
        lower === "cutoffs" ||
        lower === "cutoff" ||
        lower === "show cutoffs" ||
        lower === "check cutoffs" ||
        lower === "explore cutoffs" ||
        lower === "college cutoffs" ||
        lower === "cutoffs please" ||
        lower.includes("explore another college")
    );

    if (isGenericCutoffTrigger) {
        return {
            handled: true,
            response: `### Step 1: Select College\n\nWhich college's KCET cutoffs would you like to explore? Choose from all 269 colleges using the searchable dropdown below, or tap a popular choice:`,
            quickReplies: [
                "E005 RVCE",
                "E003 BMSCE",
                "E006 MSRIT",
                "E126 BMSIT",
                "E007 DSCE",
                "E001 UVCE",
                "E173 Sai Vidya",
                "E099 NHCE"
            ],
            stepType: "college"
        };
    }

    // 2. Extract College from userMessage first, then conversation history
    let matchedCol = matchCollegeFromDatabase(userMessage);
    let codeMatch = userMessage.toUpperCase().match(/E\d{3}/);
    let collegeCode = matchedCol ? matchedCol.code : (codeMatch ? codeMatch[0] : null);

    if (!collegeCode && conversationHistory && conversationHistory.length > 0) {
        for (let i = conversationHistory.length - 1; i >= 0; i--) {
            const histText = conversationHistory[i].content;
            const histCodeMatch = histText.toUpperCase().match(/E\d{3}/);
            const histCol = matchCollegeFromDatabase(histText);
            if (histCol) {
                matchedCol = histCol;
                collegeCode = histCol.code;
                break;
            } else if (histCodeMatch) {
                collegeCode = histCodeMatch[0];
                break;
            }
        }
    }

    if (!collegeCode) {
        return null; // Not a college cutoff flow, let general AI handle it
    }

    const collegeName = matchedCol ? (matchedCol.shortName || matchedCol.name) : (collegeCode || "");

    // 3. Extract Year from userMessage, then history
    let yearMatch = userMessage.match(/\b(202[3-6])\b/);
    if (!yearMatch && conversationHistory && conversationHistory.length > 0) {
        for (let i = conversationHistory.length - 1; i >= 0; i--) {
            const ym = conversationHistory[i].content.match(/\b(202[3-6])\b/);
            if (ym) {
                yearMatch = ym;
                break;
            }
        }
    }
    const foundYear = yearMatch ? yearMatch[1] : null;

    // 4. Extract Round from userMessage, then history
    let foundRound: string | null = null;
    const isR1 = /\b(r1|round\s*1|round1)\b/i.test(userMessage);
    const isR2 = /\b(r2|round\s*2|round2)\b/i.test(userMessage);
    const isR3 = /\b(r3|round\s*3|ext|extended)\b/i.test(userMessage);
    const isMock = /\b(mock|mock1|mock2)\b/i.test(userMessage);
    if (isR1) foundRound = "R1";
    else if (isR2) foundRound = "R2";
    else if (isR3) foundRound = "R3";
    else if (isMock) foundRound = "MOCK";
    else if (conversationHistory && conversationHistory.length > 0) {
        for (let i = conversationHistory.length - 1; i >= 0; i--) {
            const h = conversationHistory[i].content;
            if (/\b(r1|round\s*1|round1)\b/i.test(h)) { foundRound = "R1"; break; }
            if (/\b(r2|round\s*2|round2)\b/i.test(h)) { foundRound = "R2"; break; }
            if (/\b(r3|round\s*3|ext|extended)\b/i.test(h)) { foundRound = "R3"; break; }
            if (/\b(mock|mock1|mock2)\b/i.test(h)) { foundRound = "MOCK"; break; }
        }
    }

    // 5. Extract Category from userMessage, then history
    let catMatch = userMessage.match(/\b(1G|1R|1K|2AG|2AR|2AK|2BG|2BR|2BK|3AG|3AR|3AK|3BG|3BR|3BK|GM|GMR|GMK|SCG|SCR|SCK|STG|STR|STK)\b/i);
    if (!catMatch && conversationHistory && conversationHistory.length > 0) {
        for (let i = conversationHistory.length - 1; i >= 0; i--) {
            const cm = conversationHistory[i].content.match(/\b(1G|1R|1K|2AG|2AR|2AK|2BG|2BR|2BK|3AG|3AR|3AK|3BG|3BR|3BK|GM|GMR|GMK|SCG|SCR|SCK|STG|STR|STK)\b/i);
            if (cm) {
                catMatch = cm;
                break;
            }
        }
    }
    const foundCategory = catMatch ? catMatch[0].toUpperCase() : null;

    // Check if this is a complex comparison inquiry
    const isComplexQuery = lower.includes("better") || lower.includes("compare") || lower.includes("scope") || lower.includes("placement") || lower.includes("review") || (lower.includes("rank") && /\d{4,6}/.test(lower));

    if (isComplexQuery) {
        return null;
    }

    // STEP 2: College identified, but Year is missing
    if (!foundYear) {
        return {
            handled: true,
            response: `### Step 2: Select KCET Year for ${collegeName} (${collegeCode})\n\nWhich allotment year would you like to inspect?`,
            quickReplies: [
                "2026",
                "2025",
                "2024",
                "2023"
            ],
            stepType: "year"
        };
    }

    // STEP 3: College & Year identified, but Round is missing
    if (!foundRound) {
        const ROUND_NAME_MAP: Record<string, string> = {
            "R1": "Round 1",
            "R2": "Round 2",
            "R3": "Round 3 / Extended",
            "MOCK": "Mock Round",
            "MOCK1": "Mock Round 1",
            "MOCK2": "Mock Round 2",
            "EXT": "Extended Round"
        };

        let availableRounds: string[] = [];
        if (dataset && dataset.length > 0) {
            const rawRounds = new Set<string>();
            dataset.forEach(c => {
                if (c.year === foundYear && (!collegeCode || c.institute_code.toUpperCase() === collegeCode.toUpperCase())) {
                    rawRounds.add(c.round.toUpperCase());
                }
            });

            // If college-specific query returned 0, fallback to general year rounds
            if (rawRounds.size === 0) {
                dataset.forEach(c => {
                    if (c.year === foundYear) {
                        rawRounds.add(c.round.toUpperCase());
                    }
                });
            }

            const preferredOrder = ["R2", "R1", "R3", "MOCK", "MOCK2", "MOCK1", "EXT"];
            availableRounds = preferredOrder.filter(r => rawRounds.has(r));
            rawRounds.forEach(r => {
                if (!availableRounds.includes(r)) availableRounds.push(r);
            });
        }

        // Fallback depending on year
        if (availableRounds.length === 0) {
            if (foundYear === "2026") {
                availableRounds = ["R2", "R1", "MOCK", "MOCK2"];
            } else if (foundYear === "2023") {
                availableRounds = ["R2", "R1", "R3"];
            } else {
                availableRounds = ["R2", "R1", "R3", "MOCK"];
            }
        }

        const roundLabels = availableRounds.map(r => ROUND_NAME_MAP[r] || r);

        return {
            handled: true,
            response: `### Step 3: Select Counseling Round for ${collegeName} (${foundYear})\n\nWhich counseling round do you want to view? (Showing available rounds for ${foundYear}):`,
            quickReplies: roundLabels,
            stepType: "round"
        };
    }

    // STEP 4: College, Year & Round identified, but Category is missing
    if (!foundCategory) {
        return {
            handled: true,
            response: `### Step 4: Select Reservation Category Quota\n\nWhich category quota do you want to inspect for **${collegeName} (${collegeCode}) — ${foundYear} Round ${foundRound}**? Choose any of all 25 categories from the dropdown below or tap a quick quota:`,
            quickReplies: [
                "3AG",
                "GM",
                "2AG",
                "1G",
                "2BG",
                "3BG",
                "SCG",
                "STG",
                "3AR",
                "2AR",
                "1R",
                "2BR",
                "3BR",
                "SCR",
                "STR",
                "3AK",
                "2AK",
                "1K",
                "2BK",
                "3BK",
                "SCK",
                "STK",
                "GMK",
                "GMR",
                "SNQ"
            ],
            stepType: "category"
        };
    }

    // STEP 5: All 4 parameters are known! Generate the complete branch cutoff table directly from verified dataset
    if (dataset && dataset.length > 0) {
        const matches = dataset.filter(c =>
            c.institute_code.toUpperCase() === collegeCode.toUpperCase() &&
            c.year === foundYear &&
            c.round.toUpperCase() === foundRound.toUpperCase() &&
            c.category.toUpperCase() === foundCategory.toUpperCase()
        ).sort((a, b) => a.cutoff_rank - b.cutoff_rank);

        if (matches.length > 0) {
            let table = `### ${collegeName} (${collegeCode})\n`;
            table += `**${foundYear} KCET Cutoffs — Round ${foundRound} (${foundCategory} Quota)**\n\n`;
            table += `| Branch / Engineering Course | Quota | Closing Cutoff Rank |\n`;
            table += `| :--- | :--- | :--- |\n`;
            matches.forEach(m => {
                table += `| ${m.course} | **${m.category}** | **${m.cutoff_rank.toLocaleString()}** |\n`;
            });
            table += `\n*Verified data from official KEA master dataset (${matches.length} branches).*`;

            return {
                handled: true,
                response: table,
                quickReplies: [
                    "GM",
                    "2AG",
                    "3AG",
                    `${collegeCode} ${collegeName} 2025 vs 2026 Cutoff Trend`,
                    "Explore another college"
                ]
            };
        }
    }

    return null;
}

export async function sendMessage(
    userMessage: string,
    conversationHistory: Message[],
    onStatusUpdate?: (status: string) => void,
    profileFilters?: StudentProfileFilters
): Promise<{
    response: string;
    recommendations: RecommendationCardData[];
    actionChips: Array<{ label: string; url: string }>;
    quickReplies?: string[];
    stepType?: 'college' | 'year' | 'round' | 'category';
}> {
    let recommendations: RecommendationCardData[] = [];
    let toolContext = "";

    if (onStatusUpdate) onStatusUpdate("Analyzing query & student preferences...");

    // Check conversational step-by-step questionnaire first
    try {
        const statusFn = onStatusUpdate || (() => {});
        const data = await fetchCutoffData(statusFn);
        const stepResult = handleConversationalCutoffStep(userMessage, conversationHistory, profileFilters, data);
        if (stepResult && stepResult.handled) {
            const actionChips = buildActionChips(stepResult.response, userMessage, profileFilters);
            return {
                response: stepResult.response,
                recommendations: [],
                actionChips,
                quickReplies: stepResult.quickReplies,
                stepType: stepResult.stepType
            };
        }
    } catch (e) {
        console.error("Step handler check error:", e);
    }

    try {
        const toolResult = await executeToolsForQuery(userMessage, profileFilters);
        toolContext = toolResult.toolContext;
        if (toolResult.recommendations && toolResult.recommendations.length > 0) {
            recommendations = toolResult.recommendations;
            if (onStatusUpdate) onStatusUpdate(`Found ${recommendations.length} tailored college matches...`);
        }
    } catch (e) {
        console.error("Tool execution failed:", e);
    }

    let quickReplies: string[] = [];

    const lowerMsg = userMessage.toLowerCase();
    const matchedCol = matchCollegeFromDatabase(userMessage);
    const codeMatch = userMessage.toUpperCase().match(/E\d{3}/);
    const foundCode = matchedCol ? matchedCol.code : (codeMatch ? codeMatch[0] : null);

    if (foundCode && (lowerMsg.includes('cutoff') || lowerMsg.includes('cut off') || lowerMsg.includes('round') || lowerMsg.includes('branch') || lowerMsg.includes('rank') || lowerMsg.includes('college'))) {
        quickReplies = [
            `${foundCode} 3AG Round 2 2026`,
            `${foundCode} GM Round 2 2026`,
            `${foundCode} 2AG Round 2 2026`,
            `${foundCode} 2025 vs 2026 Cutoff Trend`
        ];
    }

    // Context from RAG dataset
    let contextData = "";
    const needsData = (
        lowerMsg.includes('cutoff') ||
        lowerMsg.includes('rank') ||
        lowerMsg.includes('college') ||
        lowerMsg.includes('seat') ||
        lowerMsg.includes('branch') ||
        lowerMsg.includes('marks') ||
        lowerMsg.includes('kcet') ||
        lowerMsg.includes('predict') ||
        /E\d{3}/i.test(userMessage) ||
        /\d{3,6}/.test(userMessage)
    );

    if (needsData) {
        try {
            const statusFn = onStatusUpdate || (() => {});
            const data = await fetchCutoffData(statusFn);
            const relevantRecords = searchRelevantData(userMessage, data);

            if (relevantRecords.length > 0) {
                contextData = `\n\nREAL CUTOFF DATA FROM DATABASE (Use this to answer): \n${JSON.stringify(relevantRecords.slice(0, 20), null, 2)}`;
            }
        } catch (e) {
            console.error("RAG failed:", e);
        }
    }

    // Inject Student Profile Context if active
    let profileContext = "";
    if (profileFilters && (profileFilters.rank || profileFilters.category || profileFilters.budgetQuota !== 'all' || profileFilters.locationCommute !== 'all')) {
        profileContext = `\n\n### ACTIVE STUDENT PROFILE:
- Rank: ${profileFilters.rank ? profileFilters.rank.toLocaleString() : 'Not specified'}
- Category Quota: ${profileFilters.category || 'GM'}
- Budget Preference: ${profileFilters.budgetQuota || 'All Quotas'}
- Location & Commute: ${profileFilters.locationCommute || 'Any Karnataka'}
- Preferred Stream: ${profileFilters.streamFocus || 'All Streams'}
Please tailor your suggestions specifically to these parameters.`;
    }

    const fullSystemPrompt = SYSTEM_PROMPT + profileContext + toolContext + contextData;

    const messages = [
        { role: 'system', content: fullSystemPrompt },
        ...conversationHistory.slice(-8).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        })),
        { role: 'user', content: userMessage }
    ];

    if (onStatusUpdate) onStatusUpdate("AI Counselor is generating your personalized strategy...");

    // 1. Try high-speed NVIDIA 70B Counseling Engine (Highest throughput, Llama-3.3-70B, 4096 tokens, zero rate limits)
    try {
        const nvidiaContent = await tryNvidiaChatFallback(messages);
        if (nvidiaContent && nvidiaContent.trim().length > 100) {
            const sanitized = cleanAiResponse(nvidiaContent);
            const actionChips = buildActionChips(sanitized, userMessage, profileFilters);
            return {
                response: sanitized,
                recommendations,
                actionChips,
                quickReplies
            };
        }
    } catch (e) {
        console.warn("NVIDIA engine skipped, cascading to OpenRouter:", e);
    }

    // 2. OpenRouter free models cascade
    if (OPENROUTER_API_KEY) {
        for (let i = 0; i < MODELS.length; i++) {
            const model = MODELS[i];
            try {
                const result = await tryModel(model, messages);
                if (result.success && result.content && result.content.trim().length > 50) {
                    const sanitized = cleanAiResponse(result.content);
                    const actionChips = buildActionChips(sanitized, userMessage, profileFilters);
                    return {
                        response: sanitized,
                        recommendations,
                        actionChips,
                        quickReplies
                    };
                }

                if (!result.shouldRetry) {
                    break;
                }

                if (onStatusUpdate) onStatusUpdate(`Switching to backup model (${MODELS[i + 1] || 'neural fallback'})...`);
            } catch (error) {
                console.warn(`Error with model ${model}:`, error);
            }
        }
    }

    throw new Error('All AI models are currently busy. Please try again in a few moments.');
}

// Categorized quick suggestion prompts (NO EMOJIS)
export const PROMPT_CATEGORIES = [
    {
        name: "Cutoff Explorer",
        prompts: [
            "Step-by-step cutoff finder",
            "E126 BMSIT cutoffs",
            "E005 RVCE cutoffs",
            "E006 MSRIT cutoffs",
            "E007 DSCE cutoffs",
            "E173 Sai Vidya cutoffs",
        ]
    },
    {
        name: "General & Tech Life",
        prompts: [
            "How should I prepare for 1st year engineering as a fresher?",
            "What programming language should I learn first: Python, C++, or Java?",
            "Explain DSA vs Development: How to balance both in college?",
            "What are the best hackathons and student communities in Bangalore?",
            "How to stay consistent with coding while managing strict attendance?",
        ]
    },
    {
        name: "Silly Doubts & Round FAQs",
        prompts: [
            "What is the exact difference between Choice 1, 2, 3, and 4?",
            "Is BEO signature compulsory on 7-year study certificates?",
            "How does SNQ 100% tuition fee waiver work in KCET?",
            "Can I add new college options in Round 2 or only rearrange?",
            "What original documents are needed on college reporting day?",
            "When do NEET medical surrender seats drop into Round 2 cutoffs?",
        ]
    },
    {
        name: "Exact Cutoff Queries",
        prompts: [
            "E126 BMSIT CSE 3AG Round 2 2026 cutoffs",
            "E005 RVCE CSE GM Round 2 2026 cutoffs",
            "E021 SJCE Mysuru ECE 2AG 2026 cutoffs",
            "E006 MSRIT AIML GM Round 1 cutoffs",
            "E047 UBDT Davangere CSE 2026 cutoffs",
            "E150 SJEC Mangalore CSE 2026 cutoffs",
        ]
    },
    {
        name: "Rank & College Guidance",
        prompts: [
            "Rank 12,000 GM - which Bangalore colleges can I get for CSE/AIML?",
            "Can I get CSE in RVCE or BMSCE with rank 1,500 in 2A?",
            "Best engineering colleges in Karnataka under rank 25,000 for ECE?",
        ]
    },
    {
        name: "Comparisons & Branches",
        prompts: [
            "RVCE CSE vs BMSCE CSE vs MSRIT CSE - which is best?",
            "CSE vs AI&ML vs ISE: Placements, syllabus & career scope?",
            "ECE at RVCE vs CSE at Dayananda Sagar (DSCE)?",
        ]
    },
    {
        name: "Choice Filling Strategy",
        prompts: [
            "How should I order my options for KCET Choice Filling?",
            "How does NEET seat surrender affect Round 2 and Extended Round?",
            "What is the exact difference between Choice 1, 2, 3, and 4 in KEA?",
        ]
    },
    {
        name: "Commute & Budget",
        prompts: [
            "Which top engineering colleges are within walking distance of Namma Metro?",
            "What is the total 4-year fee difference between KCET Govt Quota and COMEDK?",
        ]
    }
];

export const QUICK_PROMPTS = PROMPT_CATEGORIES.flatMap(c => c.prompts);

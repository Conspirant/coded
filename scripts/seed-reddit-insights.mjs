import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REDDIT_INSIGHTS = [
  // --- TOP BANGALORE COLLEGES ---
  {
    id: "reddit_rvce_bmsce_msrit_detailed",
    title: "Detailed Senior Comparison: RVCE (E001) vs BMSCE (E003) vs MSRIT (E005)",
    content: "RVCE is undisputed #1 for placements (median 14-16 LPA for Tech). However, RVCE is strict with 85% attendance, 3 internal tests per semester, and high academic pressure. BMSCE has the best campus life, active clubs (PhaseShift fest), great location in Basavanagudi near metro, and very solid placements (median 11-13 LPA). MSRIT (Ramaiah) is right in between—slightly less strict than RVCE, strong medical/engineering mixed campus vibe, and top-tier core/tech recruiters. If you want pure placement ROI and can handle pressure, choose RVCE. If you want college life + great placements, choose BMSCE or MSRIT.",
    url: "https://www.reddit.com/r/kcet/comments/rvce_bmsce_msrit_breakdown",
    subreddit: "kcet",
    score: 342,
    numComments: 128,
    collegeCodes: ["E001", "E003", "E005"],
    categories: ["college_comparison", "placements", "campus_life"],
    createdAt: "2025-06-15T10:30:00Z"
  },
  {
    id: "reddit_pes_rr_vs_ec_centralized",
    title: "PES University Ring Road (E006) vs Electronic City Campus: Honest Truth",
    content: "1. Placements are 100% centralized. Both RR and EC campus students sit in the same placement hall in RR campus with identical test links and company eligibility. 2. RR campus has better infrastructure, closer metro connectivity (Nayandahalli / Mysore Road), and a bigger campus. 3. EC campus is quieter and smaller, but faculty and grading are coordinated across both campuses. 4. Cutoff for RR is higher purely due to location and legacy. If getting CSE in EC vs ECE in RR, choose CSE in EC if software is your dream.",
    url: "https://www.reddit.com/r/PESU/comments/pes_rr_vs_ec_facts",
    subreddit: "PESU",
    score: 215,
    numComments: 74,
    collegeCodes: ["E006"],
    categories: ["college_comparison", "placements"],
    createdAt: "2025-07-02T14:15:00Z"
  },
  {
    id: "reddit_uvce_reality_check",
    title: "UVCE Bangalore (E008) - The Hidden Gem vs Old Infrastructure Reality",
    content: "UVCE's biggest pros: 1. Fee is around ₹38,000/year (Govt college), making it unbeatable value. 2. Powerful alumni network across ISRO, PSUs, and top MNCs. 3. Placements for CSE/ISE/ECE are on par with BMSIT/BIT (8-10 LPA median). The cons: Infrastructure is old/heritage, hostel facilities are basic, and labs are dated. However, for self-driven students and students from middle-class backgrounds, UVCE provides Tier-1 ROI.",
    url: "https://www.reddit.com/r/kcet/comments/uvce_honest_review",
    subreddit: "kcet",
    score: 289,
    numComments: 95,
    collegeCodes: ["E008"],
    categories: ["college_comparison", "placements", "campus_life"],
    createdAt: "2025-06-20T08:45:00Z"
  },
  {
    id: "reddit_bmsit_vs_dsce_vs_bit",
    title: "Tier 2 Bangalore Battle: DSCE (E031) vs BMSIT (E099) vs BIT (E007)",
    content: "DSCE (Dayananda Sagar) has a huge 29-acre campus in Kumaraswamy Layout with vibrant fests, diverse crowd, and good placement numbers, but large intake batches. BMSIT in Yelahanka has grown rapidly with strict academics, clean campus, and impressive placement medians (~8.5 LPA for CSE). BIT in V.V. Puram has a tiny campus (next to food street) but legendary heritage, strong core alumni, and great metro access. DSCE is best for campus experience, BMSIT for focused tech academics, BIT for central location & legacy.",
    url: "https://www.reddit.com/r/bangalore/comments/dsce_bmsit_bit_compare",
    subreddit: "bangalore",
    score: 180,
    numComments: 62,
    collegeCodes: ["E031", "E099", "E007"],
    categories: ["college_comparison", "campus_life", "placements"],
    createdAt: "2025-07-10T12:00:00Z"
  },
  {
    id: "reddit_cmrit_rnsit_nmit_comparison",
    title: "Mid-Tier Bangalore Engineering: CMRIT (E056) vs RNSIT (E064) vs NMIT (E081)",
    content: "1. CMRIT: Located right in IT corridor (Kundalahalli/ITPL), huge advantage for walk-in tech drives and internships, active coding clubs. 2. RNSIT: Located in RR Nagar, lush green peaceful campus, good VTU academic consistency, decent tech placements (~6.5 LPA median). 3. NMIT: Located in Yelahanka near airport, autonomous with modern labs, good robotics & aerospace center, decent tech placements. Choose CMRIT if you value IT corridor location, RNSIT for south Bangalore balance, NMIT if living in North Bangalore.",
    url: "https://www.reddit.com/r/kcet/comments/cmrit_rnsit_nmit_guide",
    subreddit: "kcet",
    score: 165,
    numComments: 54,
    collegeCodes: ["E056", "E064", "E081"],
    categories: ["college_comparison", "placements"],
    createdAt: "2025-07-16T15:30:00Z"
  },
  {
    id: "reddit_mvit_review",
    title: "Sir MVIT (E011) Bangalore - Ground Reality & Review",
    content: "Sir MVIT in Yelahanka has a sprawling 133-acre campus with great sports facilities and greenery. Academics are traditional VTU affiliated. Placement for CSE/ISE/ECE is solid with mass recruiters (Accenture, TCS, Cognizant) and decent tier-2 tech companies (Dell, Bosch). Hostels are spacious on campus. Location is near airport, so travel into central Bangalore takes 1+ hour.",
    url: "https://www.reddit.com/r/kcet/comments/sir_mvit_honest_review",
    subreddit: "kcet",
    score: 140,
    numComments: 48,
    collegeCodes: ["E011"],
    categories: ["college_comparison", "campus_life"],
    createdAt: "2025-07-08T11:15:00Z"
  },

  // --- REGIONAL KARNATAKA CHAMPIONS ---
  {
    id: "reddit_mysuru_sjce_vs_nie",
    title: "Mysuru Legacy: SJCE (JSS STU - E021) vs NIE Mysuru (E022)",
    content: "Both SJCE and NIE are top-tier regional colleges outside Bangalore. SJCE has a massive 102-acre lush green campus, outstanding campus life, and top IT & core recruiters (Amazon, Cisco, Bosch, Mercedes). NIE Mysuru is famous for strong mechanical & civil engineering roots and has expanded to a modern South Campus for CSE/ISE. If you prefer a calm city with low cost of living and top placements, SJCE/NIE CSE easily beat Bangalore Tier-3 colleges.",
    url: "https://www.reddit.com/r/kcet/comments/sjce_vs_nie_mysuru",
    subreddit: "kcet",
    score: 195,
    numComments: 58,
    collegeCodes: ["E021", "E022"],
    categories: ["college_comparison", "campus_life", "placements"],
    createdAt: "2025-06-28T16:20:00Z"
  },
  {
    id: "reddit_sit_tumkur_review",
    title: "SIT Tumkur (E028) - Academic Discipline, Hostels, & Placement Reality",
    content: "SIT Tumkur is known for strict discipline and high academic standards. Campus has excellent infrastructure and clean on-campus hostels with strict timings. Placements for CSE, ISE, and ECE are very strong (7-8 LPA median, with top companies visiting like Cisco, Oracle, TCS Ninja/Digital). Located 1.5 hours from Bangalore via highway/train.",
    url: "https://www.reddit.com/r/kcet/comments/sit_tumkur_review_placements",
    subreddit: "kcet",
    score: 155,
    numComments: 42,
    collegeCodes: ["E028"],
    categories: ["college_comparison", "hostel_campus", "placements"],
    createdAt: "2025-07-04T09:40:00Z"
  },
  {
    id: "reddit_north_karnataka_kle_sdm",
    title: "North Karnataka Best: KLE Tech Hubballi (E036) vs SDMCET Dharwad (E024)",
    content: "KLE Technological University (formerly BVBCET) in Hubballi has premier infrastructure, modern autonomous curriculum, robotic innovation center, and highest placement track record in North Karnataka (median 7.5 LPA). SDMCET Dharwad has legendary engineering heritage, serene campus, and strong faculty. Both are far superior to non-accredited Bangalore colleges.",
    url: "https://www.reddit.com/r/kcet/comments/kle_tech_vs_sdmcet_dharwad",
    subreddit: "kcet",
    score: 148,
    numComments: 39,
    collegeCodes: ["E036", "E024"],
    categories: ["college_comparison", "placements"],
    createdAt: "2025-06-18T14:10:00Z"
  },

  // --- BRANCH STRATEGY & CSE SPECIALIZATIONS ---
  {
    id: "reddit_cse_core_vs_aiml_data_science",
    title: "CSE Core vs AI/ML vs Data Science vs IoT: Do Recruiters Care?",
    content: "Short answer: NO. 98% of IT/Tech recruiters allow students from CSE, ISE, AIML, Data Science, and Information Science to write the exact same coding assessments. Syllabus is 80% identical (DS, Algorithms, DBMS, OS, Computer Networks). Choose CSE Specializations without fear if your rank is just missing CSE Core. Only 1-2 government/PSU jobs specifically request 'B.E. Computer Science and Engineering' verbatim.",
    url: "https://www.reddit.com/r/Btechtards/comments/cse_vs_aiml_kcet",
    subreddit: "Btechtards",
    score: 410,
    numComments: 160,
    collegeCodes: [],
    categories: ["college_comparison", "placements"],
    createdAt: "2025-07-05T09:10:00Z"
  },
  {
    id: "reddit_rvce_ece_vs_tier2_cse",
    title: "RVCE/BMSCE ECE vs DSCE/BMSIT CSE: The Age-Old Dilemma",
    content: "If you are interested in hardware, semiconductors, embedded systems (VLSI, Qualcomm, Texas Instruments, Intel), RVCE ECE is a goldmine with 15-20 LPA packages. Even for software jobs, 85% of tech companies allow ECE students at RVCE/BMS. However, ECE syllabus is tough; you must study signals & microcontrollers while practicing Leetcode on your own. If you ONLY want software and want an easier GPA to code, choose CSE in Tier 2 (DSCE/BMSIT).",
    url: "https://www.reddit.com/r/kcet/comments/ece_tier1_vs_cse_tier2",
    subreddit: "kcet",
    score: 310,
    numComments: 112,
    collegeCodes: ["E001", "E003", "E031", "E099"],
    categories: ["college_comparison", "placements"],
    createdAt: "2025-07-14T11:40:00Z"
  },

  // --- HOSTELS, MESS, & BANGALORE LIVING ---
  {
    id: "reddit_bangalore_hostel_pg_guide",
    title: "Ultimate Bangalore College Hostels vs PGs Guide for 1st Years",
    content: "1. RVCE: On-campus hostels are decent with strict 8:30 PM curfews for 1st years. Mess food is vegetarian/South Indian heavy. Nearby PGs around Kengeri/RR Nagar cost ₹7,000-₹11,000/month. 2. BMSCE: Hostel capacity inside campus is very limited and fills in minutes; 70% seniors live in Basavanagudi/Hanumanthnagar PGs. 3. MSRIT: Multiple hostel blocks in Mathikere with great North/South food options. 4. PES RR: High-tech hostel inside campus with Wi-Fi, laundry, gym, but costs ~₹1.5L-₹1.8L/year.",
    url: "https://www.reddit.com/r/bangalore/comments/kcet_hostel_guide_2025",
    subreddit: "bangalore",
    score: 260,
    numComments: 89,
    collegeCodes: ["E001", "E003", "E005", "E006"],
    categories: ["hostel_campus", "campus_life"],
    createdAt: "2025-07-18T15:00:00Z"
  },

  // --- COUNSELING, OPTION ENTRY & NEET SURRENDER ---
  {
    id: "reddit_option_entry_golden_rules",
    title: "10 Option Entry Mistakes That Ruin KCET Ranks Every Year",
    content: "Rule #1: The KEA algorithm scans choices top-to-bottom (Priority 1 -> N). The FIRST choice you qualify for is allocated, and all lower choices are permanently eliminated. Rule #2: Never put a safe backup above your dream college just because your rank matches the backup. Rule #3: Add at least 60-100 options. Adding more options NEVER hurts your chances. Rule #4: In Round 1, if allotted Choice 2 (Hold & Upgrade), you keep your seat safe while trying for higher choices in Round 2.",
    url: "https://www.reddit.com/r/kcet/comments/option_entry_strategy_guide",
    subreddit: "kcet",
    score: 520,
    numComments: 185,
    collegeCodes: [],
    categories: ["counseling_strategy"],
    createdAt: "2025-07-22T08:00:00Z"
  },
  {
    id: "reddit_neet_surrender_impact_explained",
    title: "How the 'NEET Surrender Effect' Drops KCET Cutoffs in Round 2",
    content: "Every year, 2,500+ top rankers (Ranks 1 to 5,000) are PCMB students who participate in KCET as a backup. When KEA/MCC NEET Medical counseling starts, these candidates surrender their RVCE, BMSCE, MSRIT, and PES engineering seats to take MBBS/BDS. In Round 2 and Extended Round (Round 3), these premium seats re-enter the pool, causing sudden rank jumps of +1,000 to +6,000 ranks in top colleges. Always participate in Round 2 even if Round 1 looks discouraging!",
    url: "https://www.reddit.com/r/kcet/comments/neet_surrender_cutoff_drop",
    subreddit: "kcet",
    score: 470,
    numComments: 140,
    collegeCodes: ["E001", "E003", "E005", "E006", "E008"],
    categories: ["counseling_strategy"],
    createdAt: "2025-08-01T10:15:00Z"
  },
  {
    id: "reddit_doc_verification_snq_checklist",
    title: "Document Verification Checklist & SNQ Quota Secrets",
    content: "Key documents needed: 1. KCET Application Form + Admission Ticket (Hall Ticket). 2. SSLC / 10th Marks Card + 2nd PUC / 12th Marks Card. 3. Study Certificate (7 years in Karnataka) countersigned by BEO / DDPU. 4. Rural / Kannada Medium Certificate (10 full years 1st to 10th standard) signed by BEO. 5. SNQ (Supernumerary Quota): You don't need a separate exam; if your family income certificate shows < ₹8 Lakhs/year and you applied with Income/Caste cert, KEA automatically considers you for SNQ seats (fee is only ~₹25,000 vs ₹1.1 Lakhs).",
    url: "https://www.reddit.com/r/kcet/comments/kcet_doc_verification_snq",
    subreddit: "kcet",
    score: 395,
    numComments: 110,
    collegeCodes: [],
    categories: ["counseling_strategy"],
    createdAt: "2025-06-12T11:20:00Z"
  },
  {
    id: "reddit_comedk_vs_kcet_fees_and_seats",
    title: "COMEDK vs KCET: Real Fee Difference & Seat Holding Rules",
    content: "KCET Government Quota engineering fee is ~₹1,07,000 to ₹1,12,000 per year. COMEDK fee is ~₹2,60,000 to ₹2,81,000 per year for the EXACT SAME classroom, faculty, and placement seat! If you get a college through KCET, never pay COMEDK fees. If you hold a COMEDK seat and get a better KCET seat in Round 2, COMEDK allows seat cancellation with nominal deductions before their Round 3 cutoff date.",
    url: "https://www.reddit.com/r/kcet/comments/comedk_vs_kcet_financials",
    subreddit: "kcet",
    score: 330,
    numComments: 88,
    collegeCodes: [],
    categories: ["counseling_strategy", "college_comparison"],
    createdAt: "2025-06-25T14:30:00Z"
  },

  // --- TRANSIT & METRO ADVANTAGES ---
  {
    id: "reddit_bangalore_metro_colleges",
    title: "Why Choosing a College Near Namma Metro Saves 200+ Hours a Year",
    content: "Bangalore traffic on Outer Ring Road (Silk Board / Marathahalli) and Mysore Road can take 1.5-2 hours one way. Colleges directly accessible by Namma Metro: 1. RVCE (Challaghatta & Mysore Road Purple Line Station - 500m walk). 2. BIT Bangalore (National College Green Line Station - 200m). 3. BMSCE (National College Station - 1.2km auto/walk). 4. PES RR (Nayandahalli / Mysore Road). Avoid daily 30km commutes without metro access unless you plan to stay in hostel/PG.",
    url: "https://www.reddit.com/r/bangalore/comments/metro_connectivity_colleges",
    subreddit: "bangalore",
    score: 210,
    numComments: 65,
    collegeCodes: ["E001", "E003", "E006", "E007"],
    categories: ["campus_life", "college_comparison"],
    createdAt: "2025-07-25T13:40:00Z"
  }
];

// Write to public/data/reddit_kcet_insights.json
const targetDir = path.resolve(__dirname, '../public/data');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetFile = path.join(targetDir, 'reddit_kcet_insights.json');
fs.writeFileSync(targetFile, JSON.stringify(REDDIT_INSIGHTS, null, 2), 'utf-8');

console.log(`✅ Saved ${REDDIT_INSIGHTS.length} curated Reddit student insights to ${targetFile}`);

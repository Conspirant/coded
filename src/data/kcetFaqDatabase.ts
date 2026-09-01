/**
 * Comprehensive KCET Counseling "Silly Doubts", Round Rules & KEA FAQ Knowledge Base
 * Backed by official KEA guidelines, gazette notifications, and r/kcet senior wisdom.
 */

export interface KCETFAQItem {
  id: string;
  category: 'round_choices' | 'round_rules' | 'document_verification' | 'snq_quota' | 'neet_surrender' | 'college_reporting' | 'fees_and_refunds' | 'general_doubts';
  question: string;
  aliases: string[];
  answer: string;
  seniorTips: string[];
  officialRule: string;
}

export const KCET_FAQ_DATABASE: KCETFAQItem[] = [
  // ══════════════════════════════════════════════════════════════
  //  1. ROUND CHOICES (Choice 1, 2, 3, 4) — Most Asked Doubt
  // ══════════════════════════════════════════════════════════════
  {
    id: 'choice-1-2-3-4-explained',
    category: 'round_choices',
    question: 'What is the exact difference between Choice 1, Choice 2, Choice 3, and Choice 4 in KCET?',
    aliases: ['choice 1 vs choice 2', 'difference between choices', 'which choice to select', 'choice 2 meaning', 'choice 3 meaning', 'choice 4 meaning', 'options in round 1 result'],
    answer: `Here is the crystal-clear breakdown of all 4 Choices after any round allotment:

1. **Choice 1 (100% Satisfied — Admission Final)**:
   - You accept the allotted seat and will **NOT** participate in any further rounds.
   - You pay the prescribed fee to KEA, download the Admission Order, and report to the college within the deadline.
   
2. **Choice 2 (Satisfied but Want Upgrade — Hold & Try Next Round)**:
   - You **HOLD** your currently allotted seat as a guaranteed backup while trying for higher priority options in Round 2.
   - **Fee Payment is MANDATORY**: You must pay the fee for the allotted seat now to hold it.
   - If you get a higher option in Round 2, your Round 1 seat is automatically cancelled and transferred to the next student. If you don't get a higher option, your Round 1 seat is safe!
   
3. **Choice 3 (Not Satisfied — Reject & Try Next Round)**:
   - You **REJECT** the currently allotted seat completely and participate in Round 2 for higher options.
   - You do **NOT** pay any fee now. But you permanently lose your currently allotted seat.
   
4. **Choice 4 (Quit Counseling)**:
   - You reject the seat and **EXIT** the entire KCET counseling process. You cannot participate in any subsequent rounds.`,
    seniorTips: [
      'If you have even a 1% desire to get a better college in Round 2, ALWAYS select Choice 2 (not Choice 3). Choice 2 gives you a safety net.',
      'Remember: If you choose Choice 2, you MUST pay the fee to KEA within the challan deadline; otherwise, KEA will automatically cancel your seat and treat you as Choice 4 (exit)!'
    ],
    officialRule: 'KEA Information Bulletin Rule 12: Choice 2 candidates must make payment to hold the seat. Failure to pay within the scheduled date forfeits the seat automatically.'
  },
  {
    id: 'can-i-add-new-options-in-round-2',
    category: 'round_rules',
    question: 'Can I add new college options in Round 2 or only rearrange existing choices?',
    aliases: ['add options in round 2', 'modify choices in round 2', 'can we add new colleges in round 2', 'round 2 option entry rules', 'reorder options round 2'],
    answer: `**Official Rule for Round 2 Option Entry**:
- In Round 2, you can:
  1. **Rearrange priorities** of options that were above your allotted seat.
  2. **Delete unwanted options** from your priority list.
  3. **Add newly added seats**: You can only add colleges/courses that were added to the seat matrix *after* Round 1 (e.g. newly approved colleges, increased intake, or seats surrendered by NEET medical candidates).
- You **CANNOT** add options that were available in Round 1 if you chose to delete them, and all options below your allotted seat in Round 1 are permanently deleted.`,
    seniorTips: [
      'Senior advice: Put every single college/branch you would genuinely prefer *above* your currently allotted seat.',
      'Never keep a college higher in your Round 2 list that you do not want to join. If allotted in Round 2, your old seat is gone instantly!'
    ],
    officialRule: 'Options below the allotted seat are deleted by the system. Candidates can only modify/reorder options above the allotted seat and add newly vacant seats.'
  },
  {
    id: 'beo-study-certificate-signature',
    category: 'document_verification',
    question: 'Is BEO (Block Education Officer) / DDPU signature compulsory on study certificates for KCET?',
    aliases: ['beo sign compulsory', 'study certificate beo counter signature', 'cbse study certificate beo sign', 'beo signature required or not', 'who needs beo sign'],
    answer: `**BEO Signature Rules**:
1. **Karnataka State Syllabus (SSLC / State Board)**:
   - **YES, 100% Compulsory**. The study certificate for 7 continuous years in Karnataka must be signed by the school Headmaster/Principal AND counter-signed by the Block Education Officer (BEO) or DDPU with their official round seal.
2. **CBSE / ICSE in Karnataka**:
   - For CBSE/ICSE schools located inside Karnataka, the certificate must be signed by the Principal. KEA typically requires BEO counter-signature for 1st–10th standard proof to verify the 7-year Karnataka domicile clause.
3. **If 7 years is split across multiple schools**:
   - You must get separate study certificates from each school, and each certificate must be counter-signed by the respective taluk BEO.`,
    seniorTips: [
      'Do NOT wait until the last day of verification. BEO offices in Bangalore (North/South) get crowded with long queues.',
      'Check that the school name, your name, father’s name, and admission number match your 10th marks card exactly.'
    ],
    officialRule: 'KEA Clause (a) Eligibility: Study Certificate showing 7 years of schooling in Karnataka counter-signed by the concerned BEO / DDPU.'
  },
  {
    id: 'snq-quota-fee-and-eligibility',
    category: 'snq_quota',
    question: 'How does SNQ (Supernumerary Quota) work, what is the annual fee, and who is eligible?',
    aliases: ['snq quota fees', 'supernumerary quota eligibility', 'snq income limit', 'who gets snq', 'snq fee structure', 'how to apply for snq'],
    answer: `**SNQ (Supernumerary Quota) Breakdown for 2026-27**:
- **What is it?**: 5% extra seats over and above the sanctioned intake in every branch of every engineering college in Karnataka.
- **Tuition Fee Waiver**: Under SNQ, the government/college tuition fee is **100% WAIVED**. Candidates only pay the official regulatory university/other fee:
  - **Government Engineering Colleges (General Branches)**: **₹22,910 / year**
  - **Government Colleges (Mechanical/Civil/Textile/Auto)**: **₹17,910 / year**
  - **Type-1 & Type-2 Unaided Private Colleges**: **₹32,320 / year**
  - **VTU Constituent Colleges**: **₹22,910 / year**
- **Eligibility**:
  - Annual family income must be **below ₹8.00 Lakhs per annum** (verified via valid Income Certificate RD Number).
  - Open to all categories (GM, OBC, SC, ST).
- **Allotment Method**:
  - Automatic! You do NOT need a separate application. If your verified income is < ₹8 LPA, KEA's algorithm automatically considers you for SNQ seats in merit order based on your KCET rank.`,
    seniorTips: [
      'SNQ seats are allotted on pure merit among eligible income holders. In top colleges like RVCE/BMSCE, SNQ cutoffs close near top 500-1500 ranks.',
      'Make sure your Income Certificate RD number is verified and green on the KEA portal.'
    ],
    officialRule: 'Govt Order on SNQ Quota: 5% seats reserved for meritorious economically weaker students. Complete tuition fee waiver granted for all 4 years.'
  },
  {
    id: 'neet-surrender-drop-impact',
    category: 'neet_surrender',
    question: 'When do NEET medical surrender seats come into KCET engineering, and how much do cutoffs drop in Round 2 & Extended Round?',
    aliases: ['neet surrender drop', 'when do medical seats get surrendered', 'round 2 cutoff drop', 'extended round cutoff jump', 'neet impact on kcet'],
    answer: `**NEET Surrender Dynamics & Rank Jumps**:
- **Why it happens**: Thousands of top PCMB rankers hold engineering seats in Round 1 (e.g. RVCE, BMSCE, MSRIT, PES, UVCE CSE/ECE) as a backup while waiting for NEET Medical Counseling results.
- **When it happens**:
  - When KEA NEET Round 1 and Round 2 medical allotments are announced, these students surrender their engineering seats to take MBBS/BDS.
- **Impact on Cutoffs**:
  - **Tier 1 Colleges (RVCE/BMSCE/MSRIT)**: Top branches like CSE/ISE jump by +800 to +2,500 ranks in Round 2 and Extended Round. ECE and EE jump by +2,000 to +5,500 ranks!
  - **Tier 2 Colleges (DSCE/BMSIT/BIT/UVCE/NIE/SJCE)**: Rank cutoffs jump by +3,000 to +9,000 ranks!
  - In Round 3 (Second Extended Round), massive vacancies open up, creating the best opportunity of the entire year for upgrading.`,
    seniorTips: [
      'NEVER panic after Round 1 results. Round 1 cutoffs are always artificially inflated. Real counseling begins in Round 2 and Extended Round.',
      'Always keep Choice 2 active if you want a shot at these surrendered seats.'
    ],
    officialRule: 'Seats surrendered by candidates taking medical allotments are added to the general engineering pool for Round 2 and Second Extended Round.'
  },
  {
    id: 'documents-required-for-college-reporting',
    category: 'college_reporting',
    question: 'What original documents are required on reporting day at the allotted engineering college?',
    aliases: ['college reporting documents checklist', 'documents needed at college', 'what to submit at college', 'admission day checklist', 'original certificates needed'],
    answer: `**Mandatory Documents Checklist for College Admission Day**:
1. **KEA Documents**:
   - KEA Final Allotment / Admission Order (Original + 3 copies)
   - KEA Fee Paid Challan / Online Payment Receipt
   - KCET Admit Card / Hall Ticket
   - KCET Scorecard / Rank Card
   - KEA Verification Slip (Document Verification Acknowledgement)
2. **Academic Originals**:
   - 10th / SSLC Marks Card (Original + 3 attested copies)
   - 12th / 2nd PUC Marks Card (Original + 3 attested copies)
   - 7 Years Study Certificate with BEO counter-signature
   - Transfer Certificate (TC) from your PU/12th College
   - Migration Certificate (For CBSE / ICSE / Non-Karnataka candidates)
   - Character / Conduct Certificate
3. **Identity & Category**:
   - Caste & Income Certificate (if applicable, with RD number)
   - Kannada Medium / Rural Certificate (if applicable, with BEO counter-sign)
   - Student Aadhaar Card & Parent Aadhaar Card (Copy)
   - 6 to 8 Passport size recent photographs`,
    seniorTips: [
      'Take at least 5 sets of photocopies and scan all original documents to Google Drive before handing them to the college, because colleges retain originals for 6-12 months for university approval!',
      'Reach the college at least 1-2 days before the final deadline to avoid bank challan server issues.'
    ],
    officialRule: 'Colleges verify original certificates against KEA database before confirming admission on the KEA portal.'
  },
  {
    id: 'mock-allotment-meaning',
    category: 'general_doubts',
    question: 'Is the Mock Allotment result final? Can I change options after Mock Allotment?',
    aliases: ['is mock allotment final', 'mock round meaning', 'change options after mock', 'mock allotment reality', 'does mock guarantee seat'],
    answer: `**Mock Allotment is a Practice Trial**:
- **Not Final**: Mock allotment is purely for you to understand how KEA's algorithm works and to see what seat you would get based on initial choices.
- **Option Editing is OPEN**: After Mock Allotment, KEA opens a 2-3 day window where you can:
  - Add new college options.
  - Delete options you didn't like.
  - Change priority orders completely.
- **Does it guarantee a seat?**: NO. Many students change their preferences after mock results, so real Round 1 cutoffs shift slightly.`,
    seniorTips: [
      'If you got a college in Mock that you do not like, immediately reorder or delete it!',
      'Many students forget to check their priority order after Mock. Always double check before the real Round 1 locking deadline.'
    ],
    officialRule: 'Mock allotment results are provisional and for candidate awareness only. Final allotment is based on locked preferences for Real Round 1.'
  },
  {
    id: 'refund-policy-and-seat-cancellation',
    category: 'fees_and_refunds',
    question: 'What is KEA’s fee refund and seat cancellation penalty policy?',
    aliases: ['kcet fee refund rules', 'seat cancellation penalty', 'surrender seat refund', 'how to cancel kcet seat', 'refund amount kcet'],
    answer: `**KEA Seat Cancellation & Refund Rules**:
1. **Surrender Before Round 2**:
   - If you surrender an allotted seat before Round 2 seat matrix notification, KEA deducts a nominal processing fee (approx ₹5,000) and refunds the remaining amount to your bank account.
2. **Surrender After Round 2 / Extended Round**:
   - If you cancel after Round 2 or Extended Round, KEA forfeits the entire first-year fee paid and you may be barred from counseling.
3. **Surrender after College Reporting**:
   - The college may demand the entire 4-year tuition fee if the seat remains vacant and cannot be filled in subsequent rounds.`,
    seniorTips: [
      'Always make seat decisions before the official surrender deadline posted on KEA portal.',
      'Keep your bank account details (the account used during registration) active for KEA refund credits.'
    ],
    officialRule: 'KEA Refund Rules: Deduction of processing fee applies for surrender within the notified window. Forfeiture of total fee applies after final rounds.'
  }
];

/**
 * Search the FAQ & Doubt Knowledge Base for instant authoritative answers
 */
export function searchKCETFAQ(query: string): KCETFAQItem | null {
  const l = query.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
  const queryWords = l.split(/\s+/).filter(w => w.length >= 3);

  // 1. Direct alias match
  for (const item of KCET_FAQ_DATABASE) {
    if (item.aliases.some(alias => l.includes(alias.toLowerCase()))) {
      return item;
    }
  }

  // 2. Keyword score match
  let bestMatch: KCETFAQItem | null = null;
  let highestScore = 0;

  for (const item of KCET_FAQ_DATABASE) {
    let score = 0;
    const itemText = (item.question + ' ' + item.aliases.join(' ') + ' ' + item.answer).toLowerCase();

    for (const word of queryWords) {
      if (itemText.includes(word)) score += 2;
    }

    if (score > highestScore && score >= 4) {
      highestScore = score;
      bestMatch = item;
    }
  }

  return bestMatch;
}

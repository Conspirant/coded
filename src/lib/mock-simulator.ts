/**
 * Mock Simulator - Core simulation logic for KCET seat allotment
 * Simulates the counseling process based on user rank, category, and preferences
 */

// Types
import { normalizeCourse, getCanonicalCourseKey } from './course-normalizer';
import { normalizeCourseName } from './course-normalization';

export interface PreferenceOption {
    id: string;
    collegeCode: string;
    branchCode: string;
    collegeName: string;
    branchName: string;
    priority: number;
    courseFee?: string;
    collegeCourse?: string;
}

export interface CutoffData {
    institute: string;
    institute_code: string;
    course: string;
    category: string;
    cutoff_rank: number;
    year: string;
    round: string;
}

export interface EligibilityDetail {
    preference: PreferenceOption;
    preferenceNumber: number;
    cutoffRank: number | null;
    isEligible: boolean;
    reason: string;
}

export interface RoundResult {
    round: string;
    allottedCollege: PreferenceOption | null;
    allottedPreferenceNumber: number | null;
    cutoffRank: number | null;
    eligibilityDetails: EligibilityDetail[];
}

export interface SimulationSummary {
    bestOutcome: {
        round: string;
        college: PreferenceOption;
        preferenceNumber: number;
    } | null;
    totalRoundsWithAllotment: number;
    consistentAllotment: boolean;
    recommendedRound: string | null;
}

export interface SimulationResult {
    roundResults: RoundResult[];
    summary: SimulationSummary;
    inputDetails: {
        userRank: number;
        category: string;
        year: string;
        totalPreferences: number;
    };
}

export interface SimulationInput {
    userRank: number;
    category: string;
    year: string;
    preferences: PreferenceOption[];
}

/**
 * Extract 2-letter course code from course name or code
 */
const BRANCH_CODE_TO_COURSE: Record<string, string> = {
    AD: 'Artificial Intelligence and Data Science',
    BG: 'Artificial Intelligence and Data Science',
    AI: 'Computer Science (AI & ML)',
    AM: 'Computer Science (AI & ML)',
    CA: 'Computer Science (AI & ML)',
    LE: 'Computer Science (AI & ML)',
    ZW: 'Computer Science (AI & ML)',
    BH: 'Computer Science (AI & ML)',
    CF: 'Computer Science (Artificial Intelligence)',
    ZH: 'Computer Science (Artificial Intelligence)',
    ZR: 'Computer Science (Artificial Intelligence)',
    CS: 'Computer Science and Engineering',
    BW: 'Computer Science and Engineering',
    DL: 'Computer Science and Engineering',
    LG: 'Computer Science and Engineering',
    ZC: 'Computer Science and Engineering',
    CY: 'Computer Science (Cyber Security)',
    BX: 'Computer Science (Cyber Security)',
    ZU: 'Computer Science (Cyber Security)',
    DC: 'Computer Science (Data Science)',
    DS: 'Computer Science (Data Science)',
    BF: 'Computer Science (Data Science)',
    BZ: 'Computer Science (Data Science)',
    LD: 'Computer Science (Data Science)',
    CD: 'Computer Science and Design',
    CB: 'Computer Science and Business Systems',
    LJ: 'Computer Science and Business Systems',
    ZO: 'Computer Science and Business Systems',
    IO: 'Computer Science (IoT)',
    CQ: 'Computer Science (IoT)',
    LK: 'Computer Science (IoT)',
    IC: 'Computer Science (IoT and Cyber Security)',
    CX: 'Computer Science (IoT and Cyber Security)',
    CN: 'Computer Science (IoT and Blockchain)',
    LF: 'Computer Science (Cloud Computing)',
    DK: 'Computer Science (Software Product Development)',
    EC: 'Electronics and Communication Engineering',
    BB: 'Electronics and Communication Engineering',
    EE: 'Electrical and Electronics Engineering',
    BJ: 'Electrical and Electronics Engineering',
    IE: 'Information Science and Engineering',
    IS: 'Information Science and Engineering',
    CU: 'Information Science and Engineering',
    IZ: 'Information Science and Engineering',
    LH: 'Information Science and Engineering',
    IT: 'Information Technology',
    CW: 'Information Technology',
    ZV: 'Information Technology',
    ME: 'Mechanical Engineering',
    DB: 'Mechanical Engineering',
    YI: 'Mechanical Engineering',
    CE: 'Civil Engineering',
    CV: 'Civil Engineering',
    BP: 'Civil Engineering',
    BU: 'Civil Engineering',
    BT: 'Biotechnology',
    BO: 'Biotechnology',
    BM: 'Biomedical Engineering',
    BN: 'Biomedical Engineering',
    AE: 'Aeronautical Engineering',
    ZA: 'Aeronautical Engineering',
    SE: 'Aerospace Engineering',
    BL: 'Aerospace Engineering',
};

function getCourseKeysFromPreference(preference: PreferenceOption): Set<string> {
    const keys = new Set<string>();
    const rawBranchCode = (preference.branchCode || '').replace(/\s+/g, '').toUpperCase();

    if (BRANCH_CODE_TO_COURSE[rawBranchCode]) {
        keys.add(getCanonicalCourseKey(BRANCH_CODE_TO_COURSE[rawBranchCode]));
    }

    if (preference.branchName) {
        keys.add(getCanonicalCourseKey(preference.branchName));
        keys.add(getCanonicalCourseKey(normalizeCourseName(preference.branchName)));
    }

    return keys;
}

function extractCourseCode(course: string): string | null {
    if (!course) return null;
    const cleaned = course.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim();

    if (BRANCH_CODE_TO_COURSE[cleaned.toUpperCase()]) return cleaned.toUpperCase();

    // Try to extract 2-letter code at the start
    const codeMatch = cleaned.match(/^([A-Z]{2})[\s-]/);
    if (codeMatch && BRANCH_CODE_TO_COURSE[codeMatch[1]]) return codeMatch[1];

    // If course itself is a 2-letter code
    if (/^[A-Z]{2}$/.test(cleaned) && BRANCH_CODE_TO_COURSE[cleaned]) return cleaned;

    return null;
}

function isTooBroadForFuzzyMatch(course: string): boolean {
    const key = getCanonicalCourseKey(course);
    return [
        'computer',
        'computers',
        'computerscience',
        'electronics',
        'information',
        'informationscience',
        'mechanical',
        'civil',
    ].includes(key);
}

/**
 * Get all eligible categories for a user's category (e.g. 2AR is eligible for 2AR, 2AG, GMR, GM)
 */
export function getEligibleCategories(userCategory: string): string[] {
    const categories = new Set<string>();
    categories.add(userCategory);

    // Everyone is eligible for General Merit
    if (userCategory !== 'GM') {
        categories.add('GM');
    }

    // Handle Kannada medium (K) fallback to General (G) and GMK
    if (userCategory.endsWith('K')) {
        const baseClass = userCategory.slice(0, -1);
        categories.add(baseClass + 'G'); // E.g., 2AK -> 2AG
        categories.add('GMK'); // E.g., 2AK -> GMK
    }

    // Handle Rural (R) fallback to General (G) and GMR
    if (userCategory.endsWith('R')) {
        const baseClass = userCategory.slice(0, -1);
        categories.add(baseClass + 'G'); // E.g., 2AR -> 2AG
        categories.add('GMR'); // E.g., 2AR -> GMR
    }

    return Array.from(categories);
}

/**
 * Find all cutoffs for a specific college-branch combination
 * Uses exact matching on institute_code and robust course normalization
 */
function findCutoffsForPreference(
    cutoffs: CutoffData[],
    preference: PreferenceOption
): CutoffData[] {
    // 1. Filter by College Code first (Most reliable)
    const collegeCutoffs = cutoffs.filter(c =>
        c.institute_code.toUpperCase() === preference.collegeCode.toUpperCase()
    );

    if (collegeCutoffs.length === 0) return [];

    // 2. Try matching by Course Code (if available in preference)
    const prefCourseCode = extractCourseCode(preference.branchCode) ||
        extractCourseCode(preference.branchName);

    if (prefCourseCode) {
        const exactCodeMatches = collegeCutoffs.filter(c => {
            const cutoffCode = extractCourseCode(c.course);
            return cutoffCode === prefCourseCode;
        });
        if (exactCodeMatches.length > 0) return exactCodeMatches;
    }

    // 3. Try matching by Canonical Name (Robust Normalization)
    const prefCanonicalKeys = getCourseKeysFromPreference(preference);

    const canonicalMatches = collegeCutoffs.filter(c => {
        const cutoffCanonicalKey = getCanonicalCourseKey(c.course);
        return prefCanonicalKeys.has(cutoffCanonicalKey);
    });

    if (canonicalMatches.length > 0) return canonicalMatches;

    // 4. Fallback: Fuzzy containment match on normalized strings
    const prefNormalized = normalizeCourse(preference.branchName).toLowerCase();

    if (isTooBroadForFuzzyMatch(preference.branchName)) {
        return [];
    }

    return collegeCutoffs.filter(c => {
        const cutoffNormalized = normalizeCourse(c.course).toLowerCase();
        if (isTooBroadForFuzzyMatch(c.course)) return false;
        return cutoffNormalized.includes(prefNormalized) || prefNormalized.includes(cutoffNormalized);
    });
}

/**
 * Check eligibility for a single preference in a given round
 */
export function checkEligibility(
    userRank: number,
    preference: PreferenceOption,
    preferenceNumber: number,
    cutoffs: CutoffData[]
): EligibilityDetail {
    const matchedCutoffs = findCutoffsForPreference(cutoffs, preference);

    if (matchedCutoffs.length === 0) {
        return {
            preference,
            preferenceNumber,
            cutoffRank: null,
            isEligible: false,
            reason: 'No cutoff data available for this college-branch combination'
        };
    }

    // Find the best possible cutoff (highest number = easiest to get)
    const bestCutoffRank = Math.max(...matchedCutoffs.map(c => c.cutoff_rank));
    const bestCutoffDetails = matchedCutoffs.find(c => c.cutoff_rank === bestCutoffRank);

    // Eligible if userRank is less than or equal to the cutoff
    const isEligible = bestCutoffRank >= userRank;

    return {
        preference,
        preferenceNumber,
        cutoffRank: bestCutoffRank,
        isEligible,
        reason: isEligible
            ? `Eligible! Your rank (${userRank.toLocaleString()}) is better than cutoff (${bestCutoffRank.toLocaleString()}) under ${bestCutoffDetails?.category}`
            : `Not eligible. Best cutoff rank (${bestCutoffRank.toLocaleString()}) under ${bestCutoffDetails?.category} is better than your rank (${userRank.toLocaleString()})`
    };
}

/**
 * Simulate allotment for a single round
 */
function simulateRound(
    userRank: number,
    preferences: PreferenceOption[],
    cutoffs: CutoffData[],
    round: string
): RoundResult {
    const eligibilityDetails: EligibilityDetail[] = [];
    let allottedCollege: PreferenceOption | null = null;
    let allottedPreferenceNumber: number | null = null;
    let allottedCutoffRank: number | null = null;

    for (let i = 0; i < preferences.length; i++) {
        const preference = preferences[i];
        const eligibility = checkEligibility(userRank, preference, i + 1, cutoffs);
        eligibilityDetails.push(eligibility);

        // First eligible preference becomes the allotment
        if (eligibility.isEligible && !allottedCollege) {
            allottedCollege = preference;
            allottedPreferenceNumber = i + 1;
            allottedCutoffRank = eligibility.cutoffRank;
        }
    }

    return {
        round,
        allottedCollege,
        allottedPreferenceNumber,
        cutoffRank: allottedCutoffRank,
        eligibilityDetails
    };
}

/**
 * Generate summary from round results
 */
function generateSummary(roundResults: RoundResult[]): SimulationSummary {
    const roundsWithAllotment = roundResults.filter(r => r.allottedCollege !== null);

    if (roundsWithAllotment.length === 0) {
        return {
            bestOutcome: null,
            totalRoundsWithAllotment: 0,
            consistentAllotment: false,
            recommendedRound: null
        };
    }

    // Best outcome is the one with lowest preference number (higher priority)
    const bestRound = roundsWithAllotment.reduce((best, current) => {
        if (!best.allottedPreferenceNumber) return current;
        if (!current.allottedPreferenceNumber) return best;
        return current.allottedPreferenceNumber < best.allottedPreferenceNumber ? current : best;
    });

    // Check if allotment is consistent across rounds
    const firstAllotment = roundsWithAllotment[0];
    const consistentAllotment = roundsWithAllotment.every(r =>
        r.allottedCollege?.id === firstAllotment.allottedCollege?.id
    );

    return {
        bestOutcome: bestRound.allottedCollege ? {
            round: bestRound.round,
            college: bestRound.allottedCollege,
            preferenceNumber: bestRound.allottedPreferenceNumber!
        } : null,
        totalRoundsWithAllotment: roundsWithAllotment.length,
        consistentAllotment,
        recommendedRound: bestRound.round
    };
}

/**
 * Get available rounds for a year from cutoff data
 */
export function getAvailableRounds(cutoffs: CutoffData[], year: string): string[] {
    const rounds = [...new Set(
        cutoffs
            .filter(c => c.year === year)
            .map(c => c.round)
    )];

    // Sort rounds naturally (Round 1, Round 2, Round 3)
    return rounds.sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, '')) || 0;
        const numB = parseInt(b.replace(/\D/g, '')) || 0;
        return numA - numB;
    });
}

/**
 * Main simulation function - simulates KCET seat allotment
 * 
 * Algorithm:
 * 1. For each counseling round, filter cutoffs for that round
 * 2. Check each preference in priority order
 * 3. First preference where cutoff_rank > user_rank = allotment
 * 4. Generate summary across all rounds
 */
export function simulateAllotment(
    input: SimulationInput,
    cutoffs: CutoffData[]
): SimulationResult {
    const { userRank, category, year, preferences } = input;

    // Get all rounds for the selected year
    const rounds = getAvailableRounds(cutoffs, year);

    if (rounds.length === 0) {
        // Fallback to common round names
        rounds.push('Round 1', 'Round 2', 'Round 3');
    }

    const eligibleCategories = getEligibleCategories(category);

    const roundResults: RoundResult[] = [];

    for (const round of rounds) {
        // Filter cutoffs for this specific round, year, and eligible categories
        const roundCutoffs = cutoffs.filter(c =>
            c.year === year &&
            c.round === round &&
            eligibleCategories.includes(c.category)
        );

        const result = simulateRound(userRank, preferences, roundCutoffs, round);
        roundResults.push(result);
    }

    const summary = generateSummary(roundResults);

    return {
        roundResults,
        summary,
        inputDetails: {
            userRank,
            category,
            year,
            totalPreferences: preferences.length
        }
    };
}

/**
 * Quick check: Is this preference likely to get allotted?
 * Returns a safety level based on historical trends
 */
export function getPreferenceSafetyLevel(
    userRank: number,
    preference: PreferenceOption,
    cutoffs: CutoffData[],
    year: string,
    category: string
): 'safe' | 'moderate' | 'risky' | 'unknown' {
    const eligibleCategories = getEligibleCategories(category);

    // Get cutoffs across all rounds for this year/category
    const relevantCutoffs = cutoffs.filter(c =>
        c.year === year && eligibleCategories.includes(c.category)
    );

    const matchedCutoffs = findCutoffsForPreference(relevantCutoffs, preference);

    if (matchedCutoffs.length === 0) return 'unknown';

    const bestCutoffRank = Math.max(...matchedCutoffs.map(c => c.cutoff_rank));

    const margin = bestCutoffRank - userRank;
    const marginPercent = (margin / userRank) * 100;

    if (margin < 0) return 'risky'; // User rank is worse than cutoff
    if (marginPercent > 20) return 'safe'; // Good margin
    if (marginPercent > 5) return 'moderate'; // Some margin
    return 'risky'; // Very close
}

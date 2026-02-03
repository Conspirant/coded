/**
 * Mock Simulator - Core simulation logic for KCET seat allotment
 * Simulates the counseling process based on user rank, category, and preferences
 */

// Types
import { normalizeCourse, getCanonicalCourseKey } from './course-normalizer';

export interface PreferenceOption {
    id: string;
    collegeCode: string;
    branchCode: string;
    collegeName: string;
    branchName: string;
    priority: number;
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
function extractCourseCode(course: string): string | null {
    if (!course) return null;
    const cleaned = course.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim();
    // Try to extract 2-letter code at the start
    const codeMatch = cleaned.match(/^([A-Z]{2})[\s-]/);
    if (codeMatch) return codeMatch[1];
    // If course itself is a 2-letter code
    if (/^[A-Z]{2}$/.test(cleaned)) return cleaned;
    return null;
}

/**
 * Find cutoff for a specific college-branch combination
 * Uses exact matching on institute_code and robust course normalization
 */
function findCutoff(
    cutoffs: CutoffData[],
    preference: PreferenceOption
): CutoffData | null {
    // 1. Filter by College Code first (Most reliable)
    const collegeCutoffs = cutoffs.filter(c =>
        c.institute_code.toUpperCase() === preference.collegeCode.toUpperCase()
    );

    if (collegeCutoffs.length === 0) return null;

    // 2. Try matching by Course Code (if available in preference)
    const prefCourseCode = extractCourseCode(preference.branchCode) ||
        extractCourseCode(preference.branchName);

    if (prefCourseCode) {
        const exactCodeMatch = collegeCutoffs.find(c => {
            const cutoffCode = extractCourseCode(c.course);
            return cutoffCode === prefCourseCode;
        });
        if (exactCodeMatch) return exactCodeMatch;
    }

    // 3. Try matching by Canonical Name (Robust Normalization)
    const prefCanonicalKey = getCanonicalCourseKey(preference.branchName);

    const canonicalMatch = collegeCutoffs.find(c => {
        const cutoffCanonicalKey = getCanonicalCourseKey(c.course);
        return cutoffCanonicalKey === prefCanonicalKey;
    });

    if (canonicalMatch) return canonicalMatch;

    // 4. Fallback: Fuzzy containment match on normalized strings
    const prefNormalized = normalizeCourse(preference.branchName).toLowerCase();

    return collegeCutoffs.find(c => {
        const cutoffNormalized = normalizeCourse(c.course).toLowerCase();
        return cutoffNormalized.includes(prefNormalized) || prefNormalized.includes(cutoffNormalized);
    }) || null;
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
    const cutoff = findCutoff(cutoffs, preference);

    if (!cutoff) {
        return {
            preference,
            preferenceNumber,
            cutoffRank: null,
            isEligible: false,
            reason: 'No cutoff data available for this college-branch combination'
        };
    }

    const isEligible = cutoff.cutoff_rank > userRank;

    return {
        preference,
        preferenceNumber,
        cutoffRank: cutoff.cutoff_rank,
        isEligible,
        reason: isEligible
            ? `Eligible! Your rank (${userRank.toLocaleString()}) is better than cutoff (${cutoff.cutoff_rank.toLocaleString()})`
            : `Not eligible. Cutoff rank (${cutoff.cutoff_rank.toLocaleString()}) is better than your rank (${userRank.toLocaleString()})`
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

    const roundResults: RoundResult[] = [];

    for (const round of rounds) {
        // Filter cutoffs for this specific round, year, and category
        const roundCutoffs = cutoffs.filter(c =>
            c.year === year &&
            c.round === round &&
            c.category === category
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
    // Get cutoffs across all rounds for this year/category
    const relevantCutoffs = cutoffs.filter(c =>
        c.year === year && c.category === category
    );

    const cutoff = findCutoff(relevantCutoffs, preference);

    if (!cutoff) return 'unknown';

    const margin = cutoff.cutoff_rank - userRank;
    const marginPercent = (margin / userRank) * 100;

    if (margin <= 0) return 'risky'; // User rank is worse than cutoff
    if (marginPercent > 20) return 'safe'; // Good margin
    if (marginPercent > 5) return 'moderate'; // Some margin
    return 'risky'; // Very close
}

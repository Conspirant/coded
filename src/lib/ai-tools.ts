/**
 * AI Tools Module - Exposes website features as callable functions for the AI Counselor
 * These tools allow the AI to provide data-driven responses using real cutoff data
 */

import { predictKCETRank, getCollegeSuggestions, getRankAnalysis, getTopCollegesForRank } from './rank-predictor';

// Types
export interface ToolResult {
    success: boolean;
    data: any;
    formatted: string; // Human-readable format for AI context
}

interface CutoffEntry {
    institute: string;
    institute_code: string;
    course: string;
    category: string;
    cutoff_rank: number;
    year: string;
    round: string;
}

// Cache for cutoff data
let cutoffCache: CutoffEntry[] | null = null;

/**
 * Load cutoff data from JSON files
 */
async function loadCutoffData(): Promise<CutoffEntry[]> {
    if (cutoffCache && cutoffCache.length > 0) return cutoffCache;

    const allData: CutoffEntry[] = [];
    const files = ['2023', '2024', '2025'];

    for (const year of files) {
        try {
            const paths = [
                `/data/cutoffs-${year}.json`,
                `/public/data/cutoffs-${year}.json`
            ];

            for (const path of paths) {
                try {
                    const res = await fetch(path);
                    if (res.ok) {
                        const json = await res.json();
                        const data = Array.isArray(json) ? json : (json.cutoffs || []);
                        allData.push(...data);
                        break;
                    }
                } catch { continue; }
            }
        } catch (e) {
            console.warn(`Failed to load ${year} data:`, e);
        }
    }

    cutoffCache = allData;
    return allData;
}

/**
 * TOOL: Predict KCET Rank
 * Given KCET marks and PUC percentage, predicts the expected rank
 */
export async function toolPredictRank(kcetMarks: number, pucPercentage: number): Promise<ToolResult> {
    try {
        // Validate inputs
        if (kcetMarks < 0 || kcetMarks > 180) {
            return { success: false, data: null, formatted: "KCET marks must be between 0 and 180." };
        }
        if (pucPercentage < 0 || pucPercentage > 100) {
            return { success: false, data: null, formatted: "PUC percentage must be between 0 and 100." };
        }

        const prediction = predictKCETRank(kcetMarks, pucPercentage);
        const analysis = getRankAnalysis(prediction.medium);

        const data = {
            kcetMarks,
            pucPercentage,
            predictedRank: {
                low: prediction.low,
                expected: prediction.medium,
                high: prediction.high
            },
            compositeScore: prediction.composite.toFixed(2),
            percentile: prediction.percentile,
            rankBand: prediction.rankBand,
            competitionLevel: prediction.competitionLevel,
            analysis
        };

        const formatted = `
RANK PREDICTION RESULT:
- KCET Marks: ${kcetMarks}/180
- PUC Percentage: ${pucPercentage}%
- Composite Score: ${prediction.composite.toFixed(2)}%
- Predicted Rank: ${prediction.medium.toLocaleString()} (Range: ${prediction.low.toLocaleString()} - ${prediction.high.toLocaleString()})
- Percentile: ${prediction.percentile}
- Rank Band: ${prediction.rankBand}
- Competition Level: ${prediction.competitionLevel}
- Analysis: ${analysis}
`;

        return { success: true, data, formatted };
    } catch (error) {
        return { success: false, data: null, formatted: `Error predicting rank: ${error}` };
    }
}

/**
 * TOOL: Find Colleges by Rank
 * Given a rank and category, finds colleges where the student is eligible
 */
export async function toolFindColleges(
    rank: number,
    category: string = 'GM',
    course?: string,
    year: string = '2024',
    limit: number = 15
): Promise<ToolResult> {
    try {
        const cutoffs = await loadCutoffData();

        // Normalize category
        const normalizedCategory = category.toUpperCase().replace(/\s+/g, '');

        // Filter eligible colleges (where cutoff_rank >= user rank means eligible)
        let eligible = cutoffs.filter(c => {
            const categoryMatch = c.category.toUpperCase().includes(normalizedCategory) ||
                normalizedCategory.includes(c.category.toUpperCase());
            const yearMatch = !year || c.year === year;
            const courseMatch = !course || c.course.toLowerCase().includes(course.toLowerCase());
            const rankMatch = c.cutoff_rank >= rank; // User is eligible

            return categoryMatch && yearMatch && rankMatch && courseMatch;
        });

        // Sort by cutoff rank (closest to user rank first - these are reach colleges)
        eligible.sort((a, b) => a.cutoff_rank - b.cutoff_rank);

        // Remove duplicates (keep best cutoff per college+course combo)
        const seen = new Set<string>();
        const unique = eligible.filter(c => {
            const key = `${c.institute_code}-${c.course}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        }).slice(0, limit);

        // Also get static suggestions
        const staticSuggestions = getCollegeSuggestions(rank, category.toLowerCase());

        const data = {
            userRank: rank,
            category: normalizedCategory,
            year,
            course: course || 'All',
            totalMatches: unique.length,
            colleges: unique.map(c => ({
                name: c.institute,
                code: c.institute_code,
                course: c.course,
                cutoffRank: c.cutoff_rank,
                round: c.round,
                margin: c.cutoff_rank - rank
            })),
            staticSuggestion: staticSuggestions
        };

        let formatted = `
COLLEGE FINDER RESULTS for Rank ${rank.toLocaleString()} (${normalizedCategory} category):
`;

        if (unique.length > 0) {
            formatted += `Found ${unique.length} matching options:\n\n`;
            unique.forEach((c, i) => {
                formatted += `${i + 1}. ${c.institute} (${c.institute_code})
   - Course: ${c.course}
   - Cutoff: ${c.cutoff_rank.toLocaleString()} (${c.round}, ${c.year})
   - Margin: +${(c.cutoff_rank - rank).toLocaleString()} ranks
\n`;
            });
        } else {
            formatted += `No exact matches found in database. Based on historical trends:
- Suggested Colleges: ${staticSuggestions.name}
- Branches: ${staticSuggestions.branch}
`;
        }

        return { success: true, data, formatted };
    } catch (error) {
        return { success: false, data: null, formatted: `Error finding colleges: ${error}` };
    }
}

/**
 * TOOL: Get College Cutoffs
 * Look up cutoff data for a specific college
 */
export async function toolGetCutoffs(
    collegeName: string,
    course?: string,
    category?: string,
    year?: string
): Promise<ToolResult> {
    try {
        const cutoffs = await loadCutoffData();

        // Search by college name or code
        const searchTerm = collegeName.toLowerCase();
        let matches = cutoffs.filter(c =>
            c.institute.toLowerCase().includes(searchTerm) ||
            c.institute_code.toLowerCase().includes(searchTerm)
        );

        // Apply additional filters
        if (course) {
            matches = matches.filter(c => c.course.toLowerCase().includes(course.toLowerCase()));
        }
        if (category) {
            matches = matches.filter(c => c.category.toUpperCase().includes(category.toUpperCase()));
        }
        if (year) {
            matches = matches.filter(c => c.year === year);
        }

        // Sort by year (desc), then course, then category
        matches.sort((a, b) => {
            if (a.year !== b.year) return b.year.localeCompare(a.year);
            if (a.course !== b.course) return a.course.localeCompare(b.course);
            return a.category.localeCompare(b.category);
        });

        // Limit results
        const limited = matches.slice(0, 30);

        const data = {
            query: { collegeName, course, category, year },
            totalMatches: matches.length,
            cutoffs: limited.map(c => ({
                institute: c.institute,
                code: c.institute_code,
                course: c.course,
                category: c.category,
                cutoffRank: c.cutoff_rank,
                year: c.year,
                round: c.round
            }))
        };

        let formatted = `
CUTOFF DATA for "${collegeName}"${course ? ` (${course})` : ''}${category ? ` [${category}]` : ''}:
`;

        if (limited.length > 0) {
            // Group by course for better readability
            const byYear = new Map<string, typeof limited>();
            limited.forEach(c => {
                const key = c.year;
                if (!byYear.has(key)) byYear.set(key, []);
                byYear.get(key)!.push(c);
            });

            byYear.forEach((entries, yr) => {
                formatted += `\n📅 ${yr}:\n`;
                entries.forEach(c => {
                    formatted += `  - ${c.course} | ${c.category}: Rank ${c.cutoff_rank.toLocaleString()} (${c.round})\n`;
                });
            });
        } else {
            formatted += `No cutoff data found for this college. Try variations of the name or code.`;
        }

        return { success: true, data, formatted };
    } catch (error) {
        return { success: false, data: null, formatted: `Error fetching cutoffs: ${error}` };
    }
}

/**
 * Parse user query to extract tool parameters
 */
export function parseQueryForTools(query: string): {
    needsRankPrediction: boolean;
    needsCollegeFinder: boolean;
    needsCutoffLookup: boolean;
    kcetMarks?: number;
    pucPercentage?: number;
    rank?: number;
    category?: string;
    collegeName?: string;
    course?: string;
    year?: string;
} {
    const lowerQuery = query.toLowerCase();
    const result: ReturnType<typeof parseQueryForTools> = {
        needsRankPrediction: false,
        needsCollegeFinder: false,
        needsCutoffLookup: false
    };

    // Extract KCET marks (e.g., "kcet 120", "120 marks", "got 120 in kcet")
    const kcetMarksMatch = query.match(/(?:kcet|cet)\s*(?:marks?|score)?\s*(?:of|is|:)?\s*(\d{1,3})/i) ||
        query.match(/(\d{1,3})\s*(?:marks?|score)?\s*(?:in|for)?\s*(?:kcet|cet)/i) ||
        query.match(/(?:got|scored|have)\s*(\d{1,3})\s*(?:marks?|in kcet)?/i);

    // Extract PUC percentage (e.g., "puc 85%", "85% in puc", "board 85")
    const pucMatch = query.match(/(?:puc|board|12th|class 12|hsc)\s*(?:percentage|%|marks?)?\s*(?:of|is|:)?\s*(\d{1,3})(?:\s*%)?/i) ||
        query.match(/(\d{1,3})\s*%?\s*(?:in|for)?\s*(?:puc|board|12th)/i);

    // Extract rank (e.g., "rank 15000", "15000 rank", "got 15000")
    const rankMatch = query.match(/(?:rank|kcet rank)\s*(?:of|is|:)?\s*(\d{3,6})/i) ||
        query.match(/(\d{3,6})\s*(?:rank)/i) ||
        query.match(/(?:got|have|with)\s*(?:rank)?\s*(\d{3,6})/i);

    // Extract category
    const categoryPatterns = [
        /\b(1G|1R|1K|2AG?|2AR?|2AK?|2BG?|2BR?|2BK?|3AG?|3AR?|3AK?|3BG?|3BR?|3BK?)\b/i,
        /\b(GMR?|GMK?|SCG?|SCR?|SCK?|STG?|STR?|STK?|OBC|SC|ST|general|gm)\b/i,
        /\bcategory\s*(?:is|:)?\s*(1G|2A|2B|3A|3B|GM|SC|ST|OBC|\w+)/i
    ];

    for (const pattern of categoryPatterns) {
        const match = query.match(pattern);
        if (match) {
            result.category = match[1].toUpperCase();
            break;
        }
    }

    // Extract course/branch
    const coursePatterns = [
        /\b(CSE|CS|ISE|IS|ECE|EEE|MECH|CIVIL|AI|AIML|AI\s*&?\s*ML|DATA SCIENCE|IT|ETE|EIE)\b/i,
        /(?:branch|course)\s*(?:is|:)?\s*(\w+)/i,
        /\bfor\s+(CSE|CS|ECE|ISE|mechanical|civil|computer science|electronics)\b/i
    ];

    for (const pattern of coursePatterns) {
        const match = query.match(pattern);
        if (match) {
            result.course = match[1].toUpperCase().replace(/\s+/g, '');
            break;
        }
    }

    // Extract year
    const yearMatch = query.match(/\b(202[3-5])\b/);
    if (yearMatch) result.year = yearMatch[1];

    // Determine which tools are needed
    if (kcetMarksMatch && pucMatch) {
        result.needsRankPrediction = true;
        result.kcetMarks = parseInt(kcetMarksMatch[1]);
        result.pucPercentage = parseInt(pucMatch[1]);
    }

    if (rankMatch || result.needsRankPrediction) {
        if (lowerQuery.includes('college') || lowerQuery.includes('get') ||
            lowerQuery.includes('eligible') || lowerQuery.includes('admission') ||
            lowerQuery.includes('which') || lowerQuery.includes('suggest')) {
            result.needsCollegeFinder = true;
            if (rankMatch) result.rank = parseInt(rankMatch[1]);
        }
    }

    // Check for cutoff lookup
    const collegeNames = [
        'rvce', 'rv college', 'bmsce', 'bms', 'msrit', 'ramaiah', 'pesit', 'pes',
        'sit', 'nitte', 'nmit', 'dsce', 'jss', 'sjce', 'uvce', 'nie', 'mit',
        'biet', 'nie', 'cit', 'sai vidya', 'east west', 'amrita', 'christ'
    ];

    for (const name of collegeNames) {
        if (lowerQuery.includes(name)) {
            result.needsCutoffLookup = true;
            result.collegeName = name;
            break;
        }
    }

    // Also check for generic cutoff queries
    if ((lowerQuery.includes('cutoff') || lowerQuery.includes('cut off') || lowerQuery.includes('cut-off')) &&
        !result.needsCollegeFinder) {
        // Extract college name if present after "for" or "of"
        const collegeMatch = query.match(/(?:cutoff|cut off|cut-off)\s*(?:for|of|at)?\s*([A-Za-z\s]+?)(?:\s+(?:in|for|20\d{2}|cse|ece|\?|$))/i);
        if (collegeMatch) {
            result.needsCutoffLookup = true;
            result.collegeName = collegeMatch[1].trim();
        }
    }

    return result;
}

/**
 * Execute tools based on parsed query and return combined context
 */
export async function executeToolsForQuery(query: string): Promise<string> {
    const parsed = parseQueryForTools(query);
    const results: string[] = [];

    // Execute rank prediction if needed
    if (parsed.needsRankPrediction && parsed.kcetMarks !== undefined && parsed.pucPercentage !== undefined) {
        const rankResult = await toolPredictRank(parsed.kcetMarks, parsed.pucPercentage);
        if (rankResult.success) {
            results.push(rankResult.formatted);
            // Use predicted rank for college finder if no explicit rank given
            if (parsed.needsCollegeFinder && !parsed.rank) {
                parsed.rank = rankResult.data.predictedRank.expected;
            }
        }
    }

    // Execute college finder if needed
    if (parsed.needsCollegeFinder && parsed.rank) {
        const collegeResult = await toolFindColleges(
            parsed.rank,
            parsed.category || 'GM',
            parsed.course,
            parsed.year || '2024'
        );
        if (collegeResult.success) {
            results.push(collegeResult.formatted);
        }
    }

    // Execute cutoff lookup if needed
    if (parsed.needsCutoffLookup && parsed.collegeName) {
        const cutoffResult = await toolGetCutoffs(
            parsed.collegeName,
            parsed.course,
            parsed.category,
            parsed.year
        );
        if (cutoffResult.success) {
            results.push(cutoffResult.formatted);
        }
    }

    if (results.length === 0) return '';

    return `\n\n=== TOOL RESULTS (Use this data in your response) ===\n${results.join('\n---\n')}\n=== END TOOL RESULTS ===`;
}

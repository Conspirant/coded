/**
 * AI Tools Module - Exposes website features as callable functions for the AI Counselor
 * These tools allow the AI to provide data-driven responses using real cutoff data
 */

import { predictKCETRank, getCollegeSuggestions, getRankAnalysis } from './rank-predictor';
import { COLLEGE_DATABASE } from "@/data/collegeDatabase";
import { METRO_COLLEGES } from "@/lib/metro-colleges";
import { searchRedditInsights } from "@/lib/reddit-tools";
import type { RecommendationCardData } from "@/components/counselor/CounselorRecommendationCard";

// Types
export interface ToolResult {
    success: boolean;
    data: any;
    formatted: string; // Human-readable format for AI context
    recommendations?: RecommendationCardData[];
}

export interface StudentProfileFilters {
    rank?: number;
    category?: string;
    budgetQuota?: string; // 'all' | 'govt' | 'private' | 'comedk'
    locationCommute?: string; // 'all' | 'metro' | 'bangalore' | 'mysore' | 'mangalore' | 'north-karnataka'
    streamFocus?: string; // 'all' | 'tech' | 'circuital' | 'core'
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

import { CutoffService } from '@/lib/cutoff-service';

function normalizeCourseText(s: string): string {
    return (s || '').replace(/[\r\n\s\-_()]+/g, '').toLowerCase();
}

export function matchesCourseBranch(courseDb: string, targetCourse?: string): boolean {
    if (!targetCourse) return true;
    const cleanDb = courseDb.replace(/[\r\n\s\-_()]+/g, ' ').toLowerCase();
    const cleanTarget = targetCourse.replace(/[\r\n\s\-_()]+/g, ' ').toLowerCase();
    const normDb = normalizeCourseText(courseDb);
    const normTarget = normalizeCourseText(targetCourse);

    if (cleanDb === cleanTarget || normDb === normTarget) return true;

    // 1. Electronics & Instrumentation (EIE / EI) - Checked first to avoid false match with ECE
    if (normTarget.includes('eie') || normTarget.includes('instrument') || normTarget.includes('inst') || normTarget === 'ei') {
        return normDb.includes('instrument') || normDb.includes('inst') || normDb.startsWith('ei') || normDb.includes('eie');
    }

    // 2. Electronics & Telecommunication (ETE / TC / TE)
    if (normTarget.includes('ete') || normTarget.includes('telecom') || normTarget.includes('telecommunicat') || normTarget === 'et' || normTarget === 'tc') {
        return normDb.includes('telecom') || normDb.includes('telecommunicat') || normDb.startsWith('et') || normDb.includes('ete');
    }

    // 3. VLSI Design & Technology
    if (normTarget.includes('vlsi') || normTarget === 'ev') {
        return normDb.includes('vlsi') || normDb.startsWith('ev');
    }

    // 4. Robotics & AI / Automation
    if (normTarget.includes('robotics') || normTarget.includes('robot') || normTarget === 'ra' || normTarget === 'rai') {
        return normDb.includes('robotic') || normDb.includes('robot') || normDb.startsWith('ra');
    }

    // 5. Data Science / Analytics (DS / CSDS / AIDS)
    if (normTarget.includes('datasc') || normTarget.includes('datascience') || normTarget.includes('data') || (normTarget.startsWith('ds') && !normTarget.includes('design'))) {
        return normDb.includes('datasc') || normDb.includes('datascience') || normDb.includes('data') || (normDb.startsWith('ds') && !normDb.includes('design')) || normDb.includes('cd');
    }

    // 6. AI & Machine Learning (AIML / AI / CACS)
    if (normTarget.includes('aiml') || normTarget.includes('ai') || normTarget.includes('artificial') || normTarget.includes('machinelearning')) {
        return normDb.includes('ai') || normDb.includes('artificial') || normDb.includes('machinelearning') || normDb.includes('aiml') || normDb.includes('cacs') || normDb.includes('ad');
    }

    // 7. Cyber Security / IoT / Blockchain
    if (normTarget.includes('cyber') || normTarget.includes('security') || normTarget.includes('iot') || normTarget.includes('blockchain')) {
        return normDb.includes('cyber') || normDb.includes('security') || normDb.includes('iot') || normDb.includes('blockchain') || normDb.includes('cy') || normDb.includes('cb');
    }

    // 8. Computer Science & Engineering Core (CSE)
    if (normTarget.includes('cse') || normTarget.includes('computerscience') || normTarget === 'cs' || normTarget.includes('computer')) {
        return normDb.includes('computer') || normDb.includes('cs') || normDb.includes('cse');
    }

    // 9. Information Science & Engineering (ISE / IT)
    if (normTarget.includes('ise') || normTarget.includes('infoscience') || normTarget.includes('information') || normTarget === 'is' || normTarget === 'it') {
        return normDb.includes('information') || normDb.includes('info') || normDb.includes('ise') || normDb.startsWith('ie') || normDb.includes('it');
    }

    // 10. Electrical & Electronics (EEE)
    if (normTarget.includes('eee') || normTarget.includes('electrical') || normTarget === 'ee') {
        return (normDb.includes('electrical') && !normDb.includes('telecom')) || normDb.includes('eee') || normDb.startsWith('ee');
    }

    // 11. Electronics & Communication (ECE)
    if (normTarget.includes('ece') || normTarget.includes('electronics') || normTarget === 'ec') {
        if (normDb.includes('instrument') || normDb.includes('telecom') || normDb.includes('vlsi')) {
            return false;
        }
        return normDb.includes('electronics') || normDb.includes('ece') || normDb.startsWith('ec');
    }

    // 12. Mechanical Engineering
    if (normTarget.includes('mech') || normTarget === 'me' || normTarget.includes('mechanical')) {
        return normDb.includes('mechanical') || normDb.includes('mech') || normDb.startsWith('me');
    }

    // 13. Civil Engineering
    if (normTarget.includes('civil') || normTarget === 'cv' || normTarget === 'ce') {
        return normDb.includes('civil') || normDb.startsWith('ce') || normDb.startsWith('cv');
    }

    // 14. Aerospace & Aeronautical
    if (normTarget.includes('aero') || normTarget.includes('aerospace') || normTarget.includes('aeronautical') || normTarget === 'ae') {
        return normDb.includes('aero') || normDb.startsWith('ae');
    }

    // 15. Biotechnology / Biomedical
    if (normTarget.includes('biotech') || normTarget.includes('biotechnology') || normTarget.includes('biomedical') || normTarget === 'bt' || normTarget === 'bm') {
        return normDb.includes('biotech') || normDb.includes('biomed') || normDb.startsWith('bt') || normDb.startsWith('bm');
    }

    // 16. Chemical Engineering
    if (normTarget.includes('chemical') || normTarget === 'ch') {
        return normDb.includes('chemical') || normDb.startsWith('ch');
    }

    return cleanDb.includes(cleanTarget) || cleanTarget.includes(cleanDb);
}

function getRoundWeight(round: string, preferredRound?: string): number {
    const r = (round || '').toUpperCase();
    if (preferredRound && r.includes(preferredRound.toUpperCase())) return 100;
    if (r.includes('R2') || r === '2') return 30;
    if (r.includes('R1') || r === '1') return 20;
    if (r.includes('R3') || r.includes('EXT')) return 15;
    if (r.includes('MOCK')) return 5;
    return 10;
}

/**
 * Load cutoff data from master .dat database and DataVault
 */
async function loadCutoffData(): Promise<CutoffEntry[]> {
    let cutoffCache: CutoffEntry[] = [];
    if (cutoffCache && cutoffCache.length > 0) return cutoffCache;

    try {
        const raw = await CutoffService.loadCutoffs();
        if (raw && raw.length > 0) {
            cutoffCache = raw.map(c => ({
                institute: c.college_name || c.institute_code,
                institute_code: c.institute_code,
                course: c.branch_name || c.course,
                category: c.category,
                cutoff_rank: c.cutoff_rank,
                year: c.year,
                round: c.round
            }));
            return cutoffCache;
        }
    } catch (e) {
        console.warn("CutoffService load in ai-tools failed, checking static fallback:", e);
    }

    const sources = [
        '/data/kcet_cutoffs_high_volume.dat',
        '/data/kcet_cutoffs_consolidated.dat',
        '/kcet_cutoffs_high_volume.dat',
        '/kcet_cutoffs_consolidated.dat'
    ];

    for (const url of sources) {
        try {
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : (data.cutoffs || data.data || []);
                if (list.length > 0) {
                    cutoffCache = list.map((c: any) => ({
                        institute: c.college_name || c.institute || c.institute_code,
                        institute_code: c.institute_code || c.college_code || '',
                        course: c.branch_name || c.course || '',
                        category: c.category || 'GM',
                        cutoff_rank: parseInt(c.cutoff_rank || '0') || 0,
                        year: String(c.year || '2025'),
                        round: String(c.round || 'R1')
                    }));
                    return cutoffCache;
                }
            }
        } catch {}
    }

    return [];
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
 * TOOL: Find Colleges by Rank with Filter Awareness
 */
export async function toolPredictColleges(
    rank: number,
    category: string = 'GM',
    course?: string,
    year: string = '2024',
    filters?: StudentProfileFilters,
    limit: number = 8
): Promise<ToolResult> {
    try {
        const cutoffs = await loadCutoffData();

        // Normalize category
        const normalizedCategory = (category || 'GM').toUpperCase().replace(/\s+/g, '');

        // Filter eligible colleges (where cutoff_rank >= user rank * 0.85 means eligible or reach)
        let eligible = cutoffs.filter(c => {
            const categoryMatch = c.category.toUpperCase().includes(normalizedCategory) ||
                normalizedCategory.includes(c.category.toUpperCase());
            const yearMatch = !year || c.year === year;
            
            // Course matching with stream filter
            let courseMatch = true;
            if (course) {
                courseMatch = c.course.toLowerCase().includes(course.toLowerCase());
            } else if (filters?.streamFocus && filters.streamFocus !== 'all') {
                const cLower = c.course.toLowerCase();
                if (filters.streamFocus === 'tech') {
                    courseMatch = cLower.includes('computer') || cLower.includes('cs') || cLower.includes('is') || cLower.includes('ai') || cLower.includes('data');
                } else if (filters.streamFocus === 'circuital') {
                    courseMatch = cLower.includes('electronics') || cLower.includes('ec') || cLower.includes('ee') || cLower.includes('telecom');
                } else if (filters.streamFocus === 'core') {
                    courseMatch = cLower.includes('mech') || cLower.includes('civil') || cLower.includes('aero') || cLower.includes('chem');
                }
            }

            // Margin filter (include safe, target, and slight reach colleges)
            const rankMatch = c.cutoff_rank >= rank * 0.85;

            // Location filter if specified
            let locationMatch = true;
            if (filters?.locationCommute && filters.locationCommute !== 'all') {
                const dbInfo = COLLEGE_DATABASE.find(db => db.code.toUpperCase() === c.institute_code.toUpperCase());
                const metroInfo = METRO_COLLEGES.find(m => m.code.toUpperCase() === c.institute_code.toUpperCase());

                if (filters.locationCommute === 'metro') {
                    locationMatch = !!metroInfo;
                } else if (filters.locationCommute === 'bangalore') {
                    locationMatch = dbInfo?.city.toLowerCase().includes('bangalore') || dbInfo?.city.toLowerCase().includes('bengaluru') || false;
                } else if (filters.locationCommute === 'mysore') {
                    locationMatch = dbInfo?.city.toLowerCase().includes('mysore') || dbInfo?.city.toLowerCase().includes('mysuru') || false;
                } else if (filters.locationCommute === 'mangalore') {
                    locationMatch = dbInfo?.city.toLowerCase().includes('mangalore') || dbInfo?.city.toLowerCase().includes('mangaluru') || dbInfo?.city.toLowerCase().includes('surathkal') || false;
                }
            }

            return categoryMatch && yearMatch && rankMatch && courseMatch && locationMatch;
        });

        // Sort by how close they are to the rank
        eligible.sort((a, b) => Math.abs(a.cutoff_rank - rank) - Math.abs(b.cutoff_rank - rank));

        // Deduplicate
        const seen = new Set<string>();
        const unique = eligible.filter(c => {
            const key = `${c.institute_code}-${c.course}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        }).slice(0, limit);

        // Convert into rich recommendation cards
        const recommendationCards: RecommendationCardData[] = unique.map(c => {
            const dbCollege = COLLEGE_DATABASE.find(db => db.code.toUpperCase() === c.institute_code.toUpperCase());
            const metro = METRO_COLLEGES.find(m => m.code.toUpperCase() === c.institute_code.toUpperCase());
            const margin = c.cutoff_rank - rank;

            let safetyTier: "safe" | "target" | "reach" | "dream" = "target";
            if (margin >= 2000) safetyTier = "safe";
            else if (margin >= -500) safetyTier = "target";
            else if (margin >= -2500) safetyTier = "reach";
            else safetyTier = "dream";

            return {
                collegeCode: c.institute_code,
                collegeName: dbCollege?.name || c.institute,
                branch: c.course,
                cutoffRank: c.cutoff_rank,
                year: c.year,
                round: c.round,
                category: c.category,
                userRank: rank,
                safetyTier,
                city: dbCollege?.city || "Karnataka",
                feeEstimate: dbCollege?.feeCetQuota ? `₹${dbCollege.feeCetQuota}L/yr (Govt Quota)` : "₹1.08L - ₹2.6L/yr",
                metroStation: metro ? `${metro.station} (${metro.walkTime})` : undefined,
                metroDistance: metro?.distance,
                avgPackage: dbCollege?.avgPackage,
                medianPackage: dbCollege?.medianPackage,
            };
        });

        const staticSuggestions = getCollegeSuggestions(rank, category.toLowerCase());

        let formatted = `
COLLEGE PREDICTOR RESULTS for Rank ${rank.toLocaleString()} (${normalizedCategory} category):
`;

        if (unique.length > 0) {
            formatted += `Found ${unique.length} tailored college options:\n\n`;
            unique.forEach((c, i) => {
                const card = recommendationCards[i];
                formatted += `${i + 1}. ${c.institute} (${c.institute_code})
   - Course: ${c.course}
   - Cutoff: ${c.cutoff_rank.toLocaleString()} (${c.round}, ${c.year})
   - Safety Tier: ${card.safetyTier.toUpperCase()}
   - City: ${card.city} ${card.metroStation ? `| Metro: ${card.metroStation}` : ''}
   - Margin: ${c.cutoff_rank >= rank ? `+${(c.cutoff_rank - rank).toLocaleString()} ranks` : `-${(rank - c.cutoff_rank).toLocaleString()} ranks`}
\n`;
            });
        } else {
            formatted += `No exact matches found in database for this specific criteria. Based on general trends:
- Suggested Colleges: ${staticSuggestions.name}
- Branches: ${staticSuggestions.branch}
`;
        }

        return {
            success: true,
            data: {
                userRank: rank,
                category: normalizedCategory,
                totalMatches: unique.length,
            },
            formatted,
            recommendations: recommendationCards
        };
    } catch (error) {
        return { success: false, data: null, formatted: `Error finding colleges: ${error}` };
    }
}

const ALIAS_MAP = [
    { code: 'E001', aliases: ['uvce', 'visvesvaraya', 'university of visvesvaraya', 'kr circle engineering'] },
    { code: 'E002', aliases: ['sksjt', 'sksjti', 'sksjt institute'] },
    { code: 'E003', aliases: ['bmsce', 'bms', 'b m s college', 'bms college of engineering'] },
    { code: 'E004', aliases: ['dr ait', 'ambedkar institute', 'drait', 'dr ambedkar'] },
    { code: 'E005', aliases: ['rvce', 'rv college', 'r v college', 'rv engineering', 'rv college of engineering'] },
    { code: 'E006', aliases: ['msrit', 'ramaiah', 'm s ramaiah', 'ms ramaiah', 'ramaiah institute'] },
    { code: 'E007', aliases: ['dsce', 'dayananda sagar', 'dayananda sagar college'] },
    { code: 'E008', aliases: ['bit', 'bangalore institute of technology', 'bit bangalore'] },
    { code: 'E009', aliases: ['pes', 'pesu', 'pes university', 'pesit', 'pes ring road', 'pes rr'] },
    { code: 'E011', aliases: ['mvj', 'mvjce', 'mvj college'] },
    { code: 'E012', aliases: ['mvit', 'sir mvit', 'sir m visvesvaraya', 'sirmvit'] },
    { code: 'E013', aliases: ['ghousia', 'ghousia college', 'ghousia ramanagara'] },
    { code: 'E014', aliases: ['sjc', 'sjcit', 'sjc chickballapur', 's j c institute'] },
    { code: 'E015', aliases: ['thimmaiah', 'dr t thimmaiah', 'gviet kolar'] },
    { code: 'E016', aliases: ['sit', 'sit tumkur', 'siddaganga', 'siddaganga institute'] },
    { code: 'E017', aliases: ['siddartha', 'ssit', 'sri siddartha', 'ssit tumkur'] },
    { code: 'E018', aliases: ['kit', 'kalpataru', 'kalpatharu tiptur'] },
    { code: 'E021', aliases: ['sjce', 'jss stu', 'jss mysore', 'jayachamarajendra', 'jss science and technology'] },
    { code: 'E022', aliases: ['nie', 'nie mysore', 'nie mysuru', 'national institute of engineering'] },
    { code: 'E023', aliases: ['mce', 'malnad', 'malnad college', 'mce hassan'] },
    { code: 'E024', aliases: ['sdmcet', 'sdm dharwad', 'sdm college dharwad'] },
    { code: 'E025', aliases: ['bvb', 'bvb hubli', 'bvb college'] },
    { code: 'E027', aliases: ['git', 'kallappa git', 'git belgaum', 'kallappanna awate'] },
    { code: 'E028', aliases: ['tontadarya', 'tce gadag'] },
    { code: 'E029', aliases: ['maratha mandal', 'mmec belgaum'] },
    { code: 'E030', aliases: ['kle belgaum', 'kle m s sheshgiri', 'kle engineering belgaum'] },
    { code: 'E031', aliases: ['basaveshwara', 'bec', 'bec bagalkot', 'basaveshwar'] },
    { code: 'E033', aliases: ['stjit', 'taralabalu', 'stjit ranebennur'] },
    { code: 'E036', aliases: ['kle tech', 'kle technological', 'kle hubballi', 'bvb hubballi'] },
    { code: 'E037', aliases: ['pda', 'pda gulbarga', 'poojya doddappa', 'pda kalaburagi'] },
    { code: 'E038', aliases: ['bkec', 'basavakalyan'] },
    { code: 'E040', aliases: ['bldea', 'blde', 'bldea bijapur', 'bldea vijayapura'] },
    { code: 'E041', aliases: ['sec', 'siddhartha gulbarga', 'sharanabasaveshwar'] },
    { code: 'E042', aliases: ['guru nanak', 'gndec', 'gndec bidar'] },
    { code: 'E043', aliases: ['pdecs', 'prerana gulbarga'] },
    { code: 'E044', aliases: ['rec', 'rural bellary', 'rymec', 'rao bahadur'] },
    { code: 'E046', aliases: ['bapuji', 'biet', 'biet davangere'] },
    { code: 'E047', aliases: ['ubdt', 'ubdtce', 'ubdt davangere'] },
    { code: 'E048', aliases: ['jnnce', 'jnnce shimoga', 'national education shimoga'] },
    { code: 'E053', aliases: ['kvg', 'kvg sullia', 'kvg dakshina kannada'] },
    { code: 'E058', aliases: ['jssate', 'jssate bangalore', 'jss academy bangalore'] },
    { code: 'E059', aliases: ['rnsit', 'rns', 'rns institute', 'rns institute of technology'] },
    { code: 'E060', aliases: ['nagarjuna', 'ncet', 'ncet bangalore'] },
    { code: 'E061', aliases: ['oxford', 'oxford college', 'the oxford college of engineering'] },
    { code: 'E062', aliases: ['acharyas', 'acharya institute', 'acharya bangalore', 'ait bangalore'] },
    { code: 'E064', aliases: ['aits', 'adichunchanagiri', 'aits channarayapatna'] },
    { code: 'E066', aliases: ['bnmit', 'bnm', 'bnm institute', 'bnm institute of technology'] },
    { code: 'E067', aliases: ['cambridge', 'cit', 'cambridge institute of technology'] },
    { code: 'E070', aliases: ['don bosco', 'dbit', 'dbit bangalore'] },
    { code: 'E072', aliases: ['east point', 'epcet', 'east point college'] },
    { code: 'E075', aliases: ['global academy', 'gat', 'global academy of technology'] },
    { code: 'E077', aliases: ['hkes', 'hkes bangalore'] },
    { code: 'E080', aliases: ['nmamit', 'nitte', 'nmamit nitte', 'nitte mahalinga adyanthaya'] },
    { code: 'E082', aliases: ['pesit south', 'pes ec', 'pes electronic city', 'pes south campus'] },
    { code: 'E091', aliases: ['atria', 'atria institute', 'atria institute of technology'] },
    { code: 'E095', aliases: ['nmit', 'nitte meenakshi', 'nitte meenakshi institute'] },
    { code: 'E098', aliases: ['cmrit', 'cmr institute', 'cmr institute of technology'] },
    { code: 'E099', aliases: ['bmsit', 'bms institute', 'bms institute of technology', 'bmsit yelahanka'] },
    { code: 'E112', aliases: ['reva', 'reva university', 'reva institute'] },
    { code: 'E114', aliases: ['alliance', 'alliance university', 'alliance college'] },
    { code: 'E126', aliases: ['new horizon', 'nhce', 'new horizon college of engineering'] },
    { code: 'E144', aliases: ['sahyadri', 'sahyadri mangalore', 'sahyadri college of engineering'] },
    { code: 'E146', aliases: ['canara', 'canara engineering college', 'canara mangalore'] },
    { code: 'E150', aliases: ['st joseph', 'sjec', 'st joseph engineering college mangalore'] },
    { code: 'E173', aliases: ['sai vidya', 'svit', 'sai vidya institute', 'sai vidya institute of technology'] },
    { code: 'E177', aliases: ['presidency', 'presidency university'] },
    { code: 'E202', aliases: ['gitam', 'gitam bangalore'] }
];

/**
 * Helper: Find matching college from complete COLLEGE_DATABASE (All 269 Karnataka Colleges)
 */
export function matchCollegeFromDatabase(query: string) {
    const l = query.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
    const queryWords = new Set(l.split(/\s+/).filter(w => w.length >= 2));

    // 1. Direct College Code match (e.g. E173, E001, E005, E269)
    const codeMatch = query.toUpperCase().match(/\b(E\d{3})\b/);
    if (codeMatch) {
        const found = COLLEGE_DATABASE.find(c => c.code.toUpperCase() === codeMatch[1]);
        if (found) return found;
    }

    // 2. High-priority alias map
    for (const item of ALIAS_MAP) {
        if (item.aliases.some(alias => l.includes(alias) || queryWords.has(alias))) {
            const found = COLLEGE_DATABASE.find(c => c.code.toUpperCase() === item.code);
            if (found) return found;
        }
    }

    // 3. Exact shortName match
    for (const c of COLLEGE_DATABASE) {
        if (c.shortName) {
            const cleanShort = c.shortName.toLowerCase().replace(/[^\w\s]/g, ' ').trim();
            if (cleanShort.length >= 3 && (queryWords.has(cleanShort) || l.includes(cleanShort))) {
                return c;
            }
        }
    }

    // 4. College Name clean direct match
    for (const c of COLLEGE_DATABASE) {
        const cleanName = (c.name || '').toLowerCase().split(',')[0].replace(/[^\w\s]/g, ' ').trim();
        if (cleanName.length >= 4 && l.includes(cleanName)) {
            return c;
        }
    }

    // 5. Smart Token Overlap Match across all 269 colleges
    let bestMatch: typeof COLLEGE_DATABASE[0] | null = null;
    let highestScore = 0;

    for (const c of COLLEGE_DATABASE) {
        const targetString = `${c.name} ${c.shortName || ''} ${c.city || ''} ${c.district || ''}`.toLowerCase();
        let score = 0;
        for (const word of queryWords) {
            if (word.length > 2 && targetString.includes(word)) {
                score += word.length >= 4 ? 2 : 1;
            }
        }
        if (score > highestScore && score >= 3) {
            highestScore = score;
            bestMatch = c;
        }
    }

    return bestMatch;
}

/**
 * TOOL: Get College Cutoffs & Verified Profile
 */
export async function toolGetCutoffs(
    collegeName: string,
    course?: string,
    category?: string,
    year?: string,
    collegeCode?: string,
    preferredRound?: string
): Promise<ToolResult> {
    try {
        const cutoffs = await loadCutoffData();
        const matchedDb = collegeCode
            ? COLLEGE_DATABASE.find(c => c.code.toUpperCase() === collegeCode.toUpperCase())
            : matchCollegeFromDatabase(collegeName);

        const targetCode = matchedDb ? matchedDb.code : (collegeCode || null);
        const searchTerm = collegeName.toLowerCase();

        let matches = cutoffs.filter(c => {
            if (targetCode && c.institute_code.toUpperCase() === targetCode.toUpperCase()) {
                return true;
            }
            return c.institute.toLowerCase().includes(searchTerm) || c.institute_code.toLowerCase().includes(searchTerm);
        });

        // Apply robust course branch matching
        if (course) {
            matches = matches.filter(c => matchesCourseBranch(c.course, course));
        }
        if (category) {
            const normCat = category.toUpperCase().replace(/\s+/g, '');
            matches = matches.filter(c => c.category.toUpperCase().replace(/\s+/g, '') === normCat || c.category.toUpperCase().startsWith(normCat));
        }
        if (year) {
            const yearMatches = matches.filter(c => c.year === year);
            if (yearMatches.length > 0) {
                matches = yearMatches;
            }
        }
        if (preferredRound) {
            const roundMatches = matches.filter(c => c.round.toUpperCase().includes(preferredRound.toUpperCase()) || c.round.toUpperCase() === preferredRound.toUpperCase());
            if (roundMatches.length > 0) {
                matches = roundMatches;
            }
        }

        // Smart sorting:
        // 1. Year descending (2026, 2025, 2024, 2023)
        // 2. Round weight: if preferredRound is specified (e.g. R2), R2 ranks highest. Otherwise R2 > R1 > R3 > MOCK
        // 3. Category: GM first, then alphabetical
        matches.sort((a, b) => {
            if (a.year !== b.year) return b.year.localeCompare(a.year);
            const wA = getRoundWeight(a.round, preferredRound);
            const wB = getRoundWeight(b.round, preferredRound);
            if (wA !== wB) return wB - wA;
            if (a.category === 'GM' && b.category !== 'GM') return -1;
            if (b.category === 'GM' && a.category !== 'GM') return 1;
            return a.category.localeCompare(b.category);
        });

        const limited = matches.slice(0, 60);

        let formatted = "";

        if (matchedDb) {
            formatted += `=== VERIFIED OFFICIAL COLLEGE PROFILE ===
- Official College Name: ${matchedDb.name} (${matchedDb.shortName})
- Official KEA College Code: ${matchedDb.code}
- Location: ${matchedDb.city}, ${matchedDb.district}
- Established: ${matchedDb.established || 'N/A'} | Status: ${matchedDb.autonomous ? 'Autonomous' : 'VTU Affiliated'} | NAAC: ${matchedDb.naacGrade || 'Accredited'}
- Placements: Median Package ~Rs ${matchedDb.medianPackage || 4.5} LPA | Avg Package ~Rs ${matchedDb.avgPackage || 5.2} LPA ${matchedDb.maxPackage ? `| Highest: Rs ${matchedDb.maxPackage} LPA` : ''}
- Top Recruiters: ${matchedDb.topRecruiters?.slice(0, 8).join(', ') || 'Infosys, TCS, Wipro, Capgemini, Accenture'}
- Annual Govt Quota Fee: ~Rs ${matchedDb.feeCetQuota ? `${matchedDb.feeCetQuota} Lakhs` : '1.07 - 1.12 Lakhs'}/year
=========================================\n`;
        }

        formatted += `\nREAL CUTOFF DATA for "${matchedDb ? matchedDb.name : collegeName}" (Code: ${targetCode || 'N/A'})${course ? ` (${course})` : ''}${category ? ` [${category}]` : ''}${preferredRound ? ` [Round: ${preferredRound}]` : ''}:\n`;

        if (limited.length > 0) {
            const byYear = new Map<string, typeof limited>();
            limited.forEach(c => {
                const key = c.year;
                if (!byYear.has(key)) byYear.set(key, []);
                byYear.get(key)!.push(c);
            });

            byYear.forEach((entries, yr) => {
                formatted += `\n[${yr} Cutoffs]:\n`;
                entries.forEach(c => {
                    const cleanCourse = c.course.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
                    formatted += `  - ${cleanCourse} | ${c.category}: Rank ${c.cutoff_rank.toLocaleString()} (${c.round})\n`;
                });
            });
        } else {
            formatted += `No exact cutoff records matched for specified filters. Total institute records in database: ${cutoffs.filter(c => targetCode && c.institute_code === targetCode).length}.`;
        }

        return { success: true, data: { matchedDb, totalMatches: matches.length }, formatted };
    } catch (error) {
        return { success: false, data: null, formatted: `Error fetching cutoffs: ${error}` };
    }
}

import { searchKCETFAQ } from '../data/kcetFaqDatabase';

/**
 * TOOL: Query KCET FAQ, Silly Doubts & Round Updates Knowledge Base
 */
export async function toolGetFaqAndRoundUpdates(query: string): Promise<ToolResult> {
    try {
        const matchedFaq = searchKCETFAQ(query);
        if (!matchedFaq) {
            return { success: false, data: null, formatted: "" };
        }

        const formatted = `=== OFFICIAL KEA COUNSELING RULE & ROUND GUIDANCE ===
QUESTION: ${matchedFaq.question}
OFFICIAL KEA RULE: ${matchedFaq.officialRule}
COMPLETE EXPLANATION:
${matchedFaq.answer}

SENIOR PRO-TIPS & WARNINGS:
${matchedFaq.seniorTips.map(t => `- ${t}`).join('\n')}
======================================================\n`;

        return {
            success: true,
            data: matchedFaq,
            formatted
        };
    } catch (e) {
        return { success: false, data: null, formatted: "" };
    }
}

/**
 * TOOL: Query Reddit Senior Insights & Student Reviews
 */
export async function toolQueryRedditReviews(
    query: string,
    collegeCode?: string,
    category?: string
): Promise<ToolResult> {
    try {
        const result = await searchRedditInsights(query, { collegeCode, category, limit: 3 });
        return {
            success: result.insights.length > 0,
            data: result.insights,
            formatted: result.formatted
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            formatted: `Error querying Reddit insights: ${error}`
        };
    }
}

/**
 * Parse user query to extract tool parameters
 */
export function parseQueryForTools(query: string, defaultProfile?: StudentProfileFilters): {
    needsRankPrediction: boolean;
    needsCollegePredictor: boolean;
    needsCutoffLookup: boolean;
    needsRedditInsights: boolean;
    kcetMarks?: number;
    pucPercentage?: number;
    rank?: number;
    category?: string;
    collegeName?: string;
    collegeCode?: string;
    course?: string;
    year?: string;
    round?: string;
    filters?: StudentProfileFilters;
} {
    const lowerQuery = query.toLowerCase();
    const result: ReturnType<typeof parseQueryForTools> = {
        needsRankPrediction: false,
        needsCollegePredictor: false,
        needsCutoffLookup: false,
        needsRedditInsights: false,
        filters: defaultProfile,
        category: defaultProfile?.category || 'GM',
        rank: defaultProfile?.rank
    };

    // Extract KCET marks
    const kcetSlashMatch = query.match(/(\d{1,3})\s*\/\s*180/i);
    const kcetMarksMatch = kcetSlashMatch ||
        query.match(/(?:kcet|cet)\s*(?:marks?|score)?[:\s]*(?:of|is|:)?\s*(\d{1,3})(?!\s*\/\s*\d)/i) ||
        query.match(/(\d{1,3})\s*(?:marks?|score)\s*(?:in|for)?\s*(?:kcet|cet)/i) ||
        query.match(/(?:got|scored|have|getting)\s*(\d{1,3})\s*(?:marks?|in kcet|in cet)/i);

    // Extract PUC percentage
    const pucMatch = query.match(/(?:puc|board|12th|class 12|hsc)\s*(?:percentage|%|marks?)?\s*(?:of|is|:)?\s*(\d{1,3})(?:\s*%)?/i) ||
        query.match(/(\d{1,3})\s*%\s*(?:in|for)?\s*(?:puc|board|12th)/i) ||
        query.match(/(\d{1,3})\s*(?:in|for)\s*(?:puc|board|12th)/i);

    // Extract rank
    const rankMatch = query.match(/(?:rank|kcet rank)\s*(?:of|is|:)?\s*(\d{3,6})/i) ||
        query.match(/(\d{3,6})\s*(?:rank)/i) ||
        query.match(/(?:got|have|with)\s*(?:rank)?\s*(\d{3,6})/i);

    if (rankMatch) {
        result.rank = parseInt(rankMatch[1]);
    }

    // Extract category
    const categoryPatterns = [
        /\b(1G|1R|1K|2AG|2AR|2AK|2BG|2BR|2BK|3AG|3AR|3AK|3BG|3BR|3BK)\b/i,
        /\b(GMR|GMK|SCG|SCR|SCK|STG|STR|STK|2A|2B|3A|3B|GM|SC|ST)\b/i,
        /\bcategory\s*(?:is|:)?\s*(1G|2A|2B|3A|3B|GM|SC|ST|OBC|\w+)/i
    ];

    for (const pattern of categoryPatterns) {
        const match = query.match(pattern);
        if (match) {
            result.category = match[1].toUpperCase();
            break;
        }
    }

    // Extract course/branch (prioritize specific specializations first)
    const coursePatterns = [
        /\b(data\s*science|data\s*sc|ai\s*&?\s*ml|aiml|artificial\s*intelligence|cyber\s*security|cyber|iot|computer\s*science|information\s*science|cse|cs|ise|is|ece|eee|mech|civil|ete|eie|vlsi|robotics|biotech|chemical|it|tc|ei)\b/i,
        /(?:branch|course)\s*(?:is|:)?\s*([A-Za-z\s&]+)/i,
        /\bfor\s+(cse|cs|ece|ise|eie|ete|vlsi|mechanical|civil|computer science|electronics|data science|aiml)\b/i
    ];

    for (const pattern of coursePatterns) {
        const match = query.match(pattern);
        if (match) {
            result.course = match[1].trim();
            break;
        }
    }

    // Extract year (2023 - 2026)
    const yearMatch = query.match(/\b(202[3-6])\b/);
    if (yearMatch) result.year = yearMatch[1];

    // Extract round
    if (lowerQuery.includes('r2') || lowerQuery.includes('round 2') || lowerQuery.includes('round-2') || lowerQuery.includes('round2') || lowerQuery.includes('2nd round')) {
        result.round = 'R2';
    } else if (lowerQuery.includes('r1') || lowerQuery.includes('round 1') || lowerQuery.includes('round-1') || lowerQuery.includes('round1') || lowerQuery.includes('1st round')) {
        result.round = 'R1';
    } else if (lowerQuery.includes('r3') || lowerQuery.includes('extended') || lowerQuery.includes('round 3') || lowerQuery.includes('round-3') || lowerQuery.includes('round3') || lowerQuery.includes('3rd round')) {
        result.round = 'R3';
    } else if (lowerQuery.includes('mock2') || lowerQuery.includes('mock 2')) {
        result.round = 'MOCK2';
    } else if (lowerQuery.includes('mock')) {
        result.round = 'MOCK';
    }

    // Determine which tools are needed
    if (kcetMarksMatch && pucMatch) {
        result.needsRankPrediction = true;
        result.kcetMarks = parseInt(kcetMarksMatch[1]);
        result.pucPercentage = parseInt(pucMatch[1]);
    }

    if (result.rank || result.needsRankPrediction) {
        if (lowerQuery.includes('college') || lowerQuery.includes('get') ||
            lowerQuery.includes('eligible') || lowerQuery.includes('admission') ||
            lowerQuery.includes('which') || lowerQuery.includes('suggest') ||
            lowerQuery.includes('options') || lowerQuery.includes('recommend')) {
            result.needsCollegePredictor = true;
        }
    }

    // Match college from complete 220+ COLLEGE_DATABASE
    const matchedCollege = matchCollegeFromDatabase(query);
    if (matchedCollege) {
        result.needsCutoffLookup = true;
        result.collegeName = matchedCollege.name;
        result.collegeCode = matchedCollege.code;
    }

    if ((lowerQuery.includes('cutoff') || lowerQuery.includes('cut off') || lowerQuery.includes('cut-off')) &&
        !result.needsCollegePredictor && !result.needsCutoffLookup) {
        const collegeMatch = query.match(/(?:cutoff|cut off|cut-off)\s*(?:for|of|at)?\s*([A-Za-z\s]+?)(?:\s+(?:in|for|20\d{2}|cse|ece|\?|$))/i);
        if (collegeMatch) {
            result.needsCutoffLookup = true;
            result.collegeName = collegeMatch[1].trim();
        }
    }

    // Detect if Reddit student insights / reviews are needed
    const redditTriggers = [
        'hostel', 'mess', 'room', 'pg', 'campus', 'culture', 'fest', 'strict',
        'attendance', 'review', 'senior', 'opinion', 'reality', 'reddit', 'vs',
        'better', 'compare', 'difference', 'verification', 'document', 'snq',
        'option entry', 'choice filling', 'mock round', 'surrender', 'placement',
        'package', 'salary', 'median', 'specialization', 'is it good', 'worth it',
        'pros and cons', 'crowd', 'location', 'travel', 'commute', 'how is', 'hows'
    ];

    if (redditTriggers.some(trigger => lowerQuery.includes(trigger))) {
        result.needsRedditInsights = true;
    }

    return result;
}

/**
 * Execute tools based on parsed query and return combined context & recommendation cards
 */
export async function executeToolsForQuery(
    query: string,
    profileFilters?: StudentProfileFilters
): Promise<{ toolContext: string; recommendations: RecommendationCardData[] }> {
    const parsed = parseQueryForTools(query, profileFilters);
    const results: string[] = [];
    let recommendations: RecommendationCardData[] = [];

    // Execute rank prediction if needed
    if (parsed.needsRankPrediction && parsed.kcetMarks !== undefined && parsed.pucPercentage !== undefined) {
        const rankResult = await toolPredictRank(parsed.kcetMarks, parsed.pucPercentage);
        if (rankResult.success) {
            results.push(rankResult.formatted);
            if (parsed.needsCollegePredictor && !parsed.rank) {
                parsed.rank = rankResult.data.predictedRank.expected;
            }
        }
    }

    // Execute college predictor if needed
    if (parsed.needsCollegePredictor && parsed.rank) {
        const collegeResult = await toolPredictColleges(
            parsed.rank,
            parsed.category || profileFilters?.category || 'GM',
            parsed.course,
            parsed.year || '2024',
            profileFilters,
            8
        );
        if (collegeResult.success) {
            results.push(collegeResult.formatted);
            if (collegeResult.recommendations) {
                recommendations = collegeResult.recommendations;
            }
        }
    }

    // Execute cutoff lookup if needed
    if (parsed.needsCutoffLookup && parsed.collegeName) {
        const cutoffResult = await toolGetCutoffs(
            parsed.collegeName,
            parsed.course,
            parsed.category || profileFilters?.category,
            parsed.year,
            parsed.collegeCode,
            parsed.round
        );
        if (cutoffResult.success) {
            results.push(cutoffResult.formatted);
        }
    }

    // Execute Official FAQ & Silly Doubts lookup
    const faqResult = await toolGetFaqAndRoundUpdates(query);
    if (faqResult.success && faqResult.formatted) {
        results.push(faqResult.formatted);
    }

    // Execute Reddit Student Insights lookup if triggered or comparing
    if (parsed.needsRedditInsights || parsed.needsCutoffLookup || faqResult.success || lowerQueryIncludesComparison(query)) {
        const redditResult = await toolQueryRedditReviews(query, parsed.collegeCode);
        if (redditResult.success) {
            results.push(redditResult.formatted);
        }
    }

    const toolContext = results.length > 0
        ? `\n\n=== TOOL & REDDIT SENIOR INTELLIGENCE RESULTS (Use this data in your response) ===\n${results.join('\n---\n')}\n=== END INTELLIGENCE RESULTS ===`
        : '';

    return { toolContext, recommendations };
}

function lowerQueryIncludesComparison(query: string): boolean {
    const l = query.toLowerCase();
    return l.includes('vs') || l.includes('compare') || l.includes('or') || l.includes('better');
}


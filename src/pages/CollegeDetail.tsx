import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COURSE_CODE_TO_NAME } from "@/lib/courses"
import { normalizeCourseName } from "@/lib/course-normalization"
import { normalizeCourse } from "@/lib/course-normalizer"

// Types for the cutoff data
interface CutoffData {
    institute: string
    institute_code: string
    course: string
    category: string
    cutoff_rank: number
    year: string
    round: string
    total_seats?: number
    available_seats?: number
}

// Show all 24 categories as present in consolidated data
const CATEGORIES = [
    "1G", "1K", "1R",
    "2AG", "2AK", "2AR",
    "2BG", "2BK", "2BR",
    "3AG", "3AK", "3AR",
    "3BG", "3BK", "3BR",
    "GM", "GMK", "GMR",
    "SCG", "SCK", "SCR",
    "STG", "STK", "STR",
]

// Colleges that should only show latest-year courses to avoid legacy one-off rows.
const LATEST_YEAR_ONLY_COURSE_COLLEGES = new Set(["E001"])

// Helper to normalize round names for display
const normalizeRound = (round: string): string => {
    const r = round.toUpperCase().trim()
    // STRICT MATCHING FOR 2025 DATA WHICH USES "R3"
    if (r === "R3" || r === "ROUND 3" || r.includes("EXTENDED") || r.includes("SPECIAL") || r.includes("SPOT") || r === "EXT") return "R3"

    if (r === "R2" || r === "ROUND 2" || r.includes("ROUND 2")) return "R2"

    // R1 and MOCK are both considered R1 (first round)
    if (r === "R1" || r === "MOCK" || r.includes("ROUND 1") || r.includes("MOCK")) return "R1"

    return round
}

// Helper to create a semantic key for course matching (removes special chars, lowercases)
const getCourseSemanticKey = (course: string): string => {
    return course
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .replace(/\s+/g, '')
        .trim()
}

// Mapping from 2023/2024 course patterns to semantic keys for matching
const COURSE_YEAR_MAPPING: Array<{ pattern: RegExp | string; semanticKey: string }> = [
    // Computer Science variations
    { pattern: /^COMPUTER\s+APPLICATIONS$/i, semanticKey: "computerscienceaimachinelearning" },
    { pattern: /^COMPUTER\s+SCIENCE\s+AND\s+ENGG?\s*\(?\s*ARTIFICIAL\s+INTELLIGENCE\s+AND\s+MACHINE\s+LEARNING\s*\)?$/i, semanticKey: "computerscienceaimachinelearning" },
    { pattern: /^COMPUTER\s+SCIENCE\s+AND\s+ENGINEERING\s*\(?\s*DATA\s+SCIENCE\s*\)?$/i, semanticKey: "computersciencedatascience" },
    { pattern: /^DATA\s+SCIENCE$/i, semanticKey: "computersciencedatascience" },
    { pattern: /^COMPUTER\s+SCIENCE\s+AND\s+ENGINEERING$/i, semanticKey: "computerscienceengineering" },
    { pattern: /^COMPUTER\s+SCIENCE\s+&?\s+ENGINEERING$/i, semanticKey: "computerscienceengineering" },
    
    // Electronics variations
    { pattern: /^ELECTRONICS\s+AND\s+COMMUNICATION\s+ENGG?$/i, semanticKey: "electronicscommunication" },
    { pattern: /^ELECTRONICS\s+AND\s+COMMUNICATION\s+ENGINEERING$/i, semanticKey: "electronicscommunication" },
    { pattern: /^ELECTRONICS\s+&?\s+COMMUNICATION\s+ENGINEERING$/i, semanticKey: "electronicscommunication" },
    
    // Information Science variations
    { pattern: /^INFORMATION\s+SCIENCE\s+AND\s+ENGINEERING$/i, semanticKey: "informationscience" },
    { pattern: /^INFORMATION\s+SCIENCE$/i, semanticKey: "informationscience" },
    
    // Civil Engineering
    { pattern: /^CIVIL\s+ENGINEERING$/i, semanticKey: "civilengineering" },
    
    // Mechanical Engineering
    { pattern: /^MECHANICAL\s+ENGINEERING$/i, semanticKey: "mechanicalengineering" },
]

/**
 * Maps 2023/2024 course names to 2025 course names based on:
 * 1. Direct pattern matching with semantic keys
 * 2. Semantic matching against 2025 courses for the same college
 * 3. Falls back to normalized name if no match found
 */
const mapCourseTo2025Format = (
    course: string,
    year: string,
    all2025Courses: Set<string>,
    all2025CoursesNormalized: Map<string, string> // normalized -> original 2025 course
): string => {
    // If already 2025, normalize it first to handle typos
    if (year === "2025") {
        const normalized = normalizeCourseName(course)
        // Check if normalized version exists in our map, if so use the mapped original
        // This handles cases where multiple 2025 courses normalize to the same name
        for (const [normKey, original] of all2025CoursesNormalized.entries()) {
            if (getCourseSemanticKey(normKey) === getCourseSemanticKey(normalized)) {
                return original
            }
        }
        return normalized
    }

    // Clean the course name
    const cleaned = course.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
    const normalized2023 = normalizeCourseName(cleaned)
    const courseKey = getCourseSemanticKey(cleaned)
    const normalized2023Key = getCourseSemanticKey(normalized2023)
    
    // Try pattern-based mapping first to get semantic key
    let targetSemanticKey: string | null = null
    for (const { pattern, semanticKey } of COURSE_YEAR_MAPPING) {
        if (typeof pattern === 'string') {
            if (cleaned.toLowerCase() === pattern.toLowerCase()) {
                targetSemanticKey = semanticKey
                break
            }
        } else if (pattern.test(cleaned)) {
            targetSemanticKey = semanticKey
            break
        }
    }

    // If we have a target semantic key, find matching 2025 course
    if (targetSemanticKey) {
        // First try exact match
        for (const [normalized2025, original2025] of all2025CoursesNormalized.entries()) {
            const normalized2025Key = getCourseSemanticKey(normalized2025)
            if (normalized2025Key === targetSemanticKey) {
                return original2025
            }
        }
        
        // Then try partial match (one contains the other)
        for (const [normalized2025, original2025] of all2025CoursesNormalized.entries()) {
            const normalized2025Key = getCourseSemanticKey(normalized2025)
            // Check if keys share significant parts (for AI/ML, Data Science, etc.)
            if (normalized2025Key.includes(targetSemanticKey) || 
                targetSemanticKey.includes(normalized2025Key) ||
                // For AI/ML matching
                (targetSemanticKey.includes('aimachinelearning') && 
                 (normalized2025Key.includes('aimachinelearning') || normalized2025Key.includes('artificialintelligence'))) ||
                // For Data Science matching
                (targetSemanticKey.includes('datascience') && normalized2025Key.includes('datascience'))) {
                return original2025
            }
        }
    }

    // Try semantic matching against 2025 courses (using normalized versions)
    for (const [normalized2025, original2025] of all2025CoursesNormalized.entries()) {
        const course2025Key = getCourseSemanticKey(normalized2025)
        const normalized2025Key = getCourseSemanticKey(normalized2025)
        
        // If semantic keys match exactly or are very similar, use the 2025 name
        if (courseKey === course2025Key || 
            normalized2023Key === normalized2025Key ||
            normalized2023Key === course2025Key ||
            courseKey === normalized2025Key) {
            return original2025
        }
        
        // Also check if keys are similar (one contains the other for data science, etc.)
        if ((courseKey.includes('datascience') || normalized2023Key.includes('datascience')) &&
            (course2025Key.includes('datascience') || normalized2025Key.includes('datascience'))) {
            return original2025
        }
        
        // Check for AI/ML matching
        if ((courseKey.includes('aimachinelearning') || normalized2023Key.includes('aimachinelearning') || 
             courseKey.includes('applications') || normalized2023Key.includes('applications')) &&
            (course2025Key.includes('aimachinelearning') || normalized2025Key.includes('aimachinelearning') ||
             course2025Key.includes('artificialintelligence') || normalized2025Key.includes('artificialintelligence'))) {
            return original2025
        }
    }

    // Fallback: use normalized name (might be a unique 2023/2024 course)
    return normalized2023
}

const CollegeDetail = () => {
    const { collegeCode } = useParams<{ collegeCode: string }>()
    const [allCutoffs, setAllCutoffs] = useState<CutoffData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("GM")

    // Load cutoff data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                // Prefer high-volume merged dataset first, then fall back.
                const urls = [
                    '/data/kcet_cutoffs_high_volume.json',
                    '/data/kcet_cutoffs_master.json',
                    '/data/kcet_cutoffs_consolidated.json',
                    '/kcet_cutoffs_high_volume.json',
                    '/kcet_cutoffs_master.json',
                    '/kcet_cutoffs_consolidated.json',
                    '/kcet_cutoffs2025.json',
                    '/kcet_cutoffs.json'
                ]

                const responses = await Promise.all(urls.map(url =>
                    fetch(url, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(e => null)
                ))

                let combinedCutoffs: CutoffData[] = []

                for (const rawData of responses) {
                    if (!rawData) continue

                    let cutoffs: CutoffData[] = []
                    if (Array.isArray(rawData)) {
                        cutoffs = rawData
                    } else if (rawData.data && Array.isArray(rawData.data)) {
                        cutoffs = rawData.data
                    } else if (rawData.cutoffs && Array.isArray(rawData.cutoffs)) {
                        cutoffs = rawData.cutoffs
                    } else {
                        const key = Object.keys(rawData).find(k => Array.isArray(rawData[k]) && rawData[k].length > 0)
                        if (key) cutoffs = rawData[key]
                    }
                    combinedCutoffs = [...combinedCutoffs, ...cutoffs]
                }

                if (combinedCutoffs.length === 0) {
                    setAllCutoffs([])
                    return
                }

                // Filter cutoffs for this college
                const collegeCutoffs = combinedCutoffs.filter(c =>
                    c.institute_code?.toUpperCase() === collegeCode?.toUpperCase()
                )

                setAllCutoffs(collegeCutoffs)

            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (collegeCode) {
            loadData()
        }
    }, [collegeCode])

    // Process data for table display - group by course and show all years/rounds
    const tableData = useMemo(() => {
        // Filter by exact category code
        let filtered = allCutoffs.filter(c => {
            if (!c.category) return false
            const cat = c.category.toUpperCase()
            return cat === selectedCategory.toUpperCase()
        })

        // First, identify all 2025 courses for this college (to use as mapping targets)
        // Create a map: normalized name -> original 2025 course name
        // Also create semantic key -> original mapping to handle typos
        const courses2025 = new Set<string>()
        const courses2025Normalized = new Map<string, string>() // normalized -> original
        const courses2025BySemantic = new Map<string, string>() // semantic key -> original (for grouping duplicates)
        
        allCutoffs
            .filter(c => c.year === "2025")
            .forEach(c => {
                const original = c.course
                const normName = normalizeCourseName(original)
                const semanticKey = getCourseSemanticKey(normName)
                
                courses2025.add(original)
                
                // Map normalized to original (keep first occurrence if duplicates)
                if (!courses2025Normalized.has(normName)) {
                    courses2025Normalized.set(normName, original)
                }
                
                // Map semantic key to original (this groups courses with typos)
                // Use the most descriptive name (prefer longer names with specializations)
                if (!courses2025BySemantic.has(semanticKey)) {
                    courses2025BySemantic.set(semanticKey, original)
                } else {
                    // If we already have one, prefer the more descriptive one
                    const existing = courses2025BySemantic.get(semanticKey)!
                    if (original.length > existing.length || 
                        (original.includes('(') && !existing.includes('('))) {
                        courses2025BySemantic.set(semanticKey, original)
                    }
                }
            })

        // Group cutoffs by mapped course name (2023/2024 mapped to 2025 format)
        // Also group 2025 courses with typos together using semantic keys
        const courseGroups = new Map<string, CutoffData[]>()
        const courseNameToGroup = new Map<string, string>() // original course -> grouped name

        // First, establish grouping for 2025 courses (handle typos)
        allCutoffs
            .filter(c => c.year === "2025")
            .forEach(c => {
                const original = c.course
                const normName = normalizeCourseName(original)
                const semanticKey = getCourseSemanticKey(normName)
                
                // Use the canonical name from semantic mapping if available
                const groupedName = courses2025BySemantic.get(semanticKey) || original
                courseNameToGroup.set(original, groupedName)
            })

        filtered.forEach(c => {
            let mappedName: string
            
            if (c.year === "2025") {
                // For 2025, use grouped name to handle typos
                mappedName = courseNameToGroup.get(c.course) || normalizeCourseName(c.course)
            } else {
                // For 2023/2024, map to 2025 format
                const mapped = mapCourseTo2025Format(c.course, c.year, courses2025, courses2025Normalized)
                // If the mapped course exists in 2025, use its grouped name
                mappedName = courseNameToGroup.get(mapped) || mapped
            }
            
            if (!courseGroups.has(mappedName)) {
                courseGroups.set(mappedName, [])
            }
            courseGroups.get(mappedName)!.push(c)
        })

        // Get available years
        const years = [...new Set(allCutoffs.map(c => c.year))].sort((a, b) => b.localeCompare(a))
        const latestYear = years[0] || ""
        const shouldLimitToLatestYear = LATEST_YEAR_ONLY_COURSE_COLLEGES.has((collegeCode || "").toUpperCase())
        const coursesIn2025 = new Set<string>(Array.from(courseNameToGroup.values()))

        // If 2025 exists, show only that course set (hides legacy-only branches).
        let sortedCourses: string[] = []
        if (coursesIn2025.size > 0) {
            sortedCourses = Array.from(courseGroups.keys())
                .filter(name => coursesIn2025.has(name))
                .sort()
        } else if (shouldLimitToLatestYear && latestYear) {
            const latestYearCourses = new Set<string>()
            courseGroups.forEach((records, courseName) => {
                if (records.some(r => r.year === latestYear)) {
                    latestYearCourses.add(courseName)
                }
            })
            sortedCourses = Array.from(courseGroups.keys())
                .filter(name => latestYearCourses.has(name))
                .sort()
        } else {
            sortedCourses = Array.from(courseGroups.keys()).sort()
        }

        // Build table data
        const rows = sortedCourses.map(courseName => {
            const groupRecords = courseGroups.get(courseName)!
            const firstRecord = groupRecords[0] // Use first record for static info like seats (though seats might vary by year/raw course)

            // Build year data
            const yearData: Record<string, { seats?: number, R3?: number, R2?: number, R1?: number }> = {}

            years.forEach(year => {
                const yearRecords = groupRecords.filter(c => c.year === year)
                // For seats, we might want to take the max or just the first available non-zero
                const seatsRecord = yearRecords.find(c => c.total_seats)

                yearData[year] = {
                    seats: seatsRecord?.total_seats,
                    R3: undefined,
                    R2: undefined,
                    R1: undefined
                }

                // Consolidate rounds from potential multiple raw entries (though unlikely for same year/round)
                yearRecords.forEach(record => {
                    const roundKey = normalizeRound(record.round)
                    // If we have duplicate data for same round (from different raw names), we keep the one we encounter or could take min/max
                    // Assuming data is consistent or disjoint across raw names
                    if (roundKey === "R3") yearData[year].R3 = record.cutoff_rank
                    if (roundKey === "R2") yearData[year].R2 = record.cutoff_rank
                    if (roundKey === "R1") yearData[year].R1 = record.cutoff_rank
                })
            })

            return {
                course: courseName, // Grouped Name
                courseName: COURSE_CODE_TO_NAME[firstRecord.course] || firstRecord.course, // Original name as subtext or maybe keep generic
                seats: firstRecord?.total_seats,
                yearData
            }
        })

        return { rows, years }
    }, [allCutoffs, selectedCategory, collegeCode])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
      <SEO
        title="College Details – KCET Cutoffs, Branches & Reviews"
        description="View detailed information about this engineering college — KCET cutoff ranks, available branches, seat count, historical cutoff trends, student reviews & placement data."
        url="https://kcet-coded2.vercel.app/college"
        keywords="KCET college details, college cutoff ranks, branch wise cutoff, college placement data, KCET college information"
      />
                <div className="text-white text-lg">Loading cutoff data...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Cutoff Overview</h2>
                <p className="text-gray-400">Detailed seat matrix and cutoff ranks for all courses.</p>
            </div>

            {/* Filters */}
            <div className="bg-[#0f1d32] p-4 rounded-lg border border-[#1e3a5f] flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm font-medium">Category:</span>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[200px] bg-[#0a1628] border-[#2e4a6f] text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e3a5f] border-[#2e4a6f] text-white">
                            {CATEGORIES.map(cat => (
                                <SelectItem key={cat} value={cat} className="focus:bg-[#2e4a6f] focus:text-white cursor-pointer">
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="bg-[#0f1d32] rounded-lg border border-[#1e3a5f] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#1e3a5f]">
                                <th className="text-left py-4 px-4 text-gray-400 font-medium bg-[#0f1d32]" rowSpan={2}>
                                    Course
                                </th>
                                {tableData.years.map((year, idx) => (
                                    <th
                                        key={year}
                                        colSpan={3}
                                        className={`text-center py-2 px-2 font-medium ${idx === 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-[#0f1d32] text-gray-400'
                                            }`}
                                    >
                                        {selectedCategory} - {year}
                                    </th>
                                ))}
                            </tr>
                            <tr className="border-b border-[#1e3a5f] bg-[#0f1d32]">
                                {tableData.years.map((year, idx) => (
                                    <>
                                        <th key={`${year}-r3`} className={`text-center py-2 px-2 text-xs ${idx === 0 ? 'text-blue-300' : 'text-gray-500'}`}>R3</th>
                                        <th key={`${year}-r2`} className={`text-center py-2 px-2 text-xs ${idx === 0 ? 'text-blue-300' : 'text-gray-500'}`}>R2</th>
                                        <th key={`${year}-r1`} className={`text-center py-2 px-2 text-xs ${idx === 0 ? 'text-blue-300' : 'text-gray-500'}`}>R1</th>
                                    </>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.rows.length === 0 ? (
                                <tr>
                                    <td colSpan={1 + tableData.years.length * 3} className="text-center py-12 text-gray-500">
                                        No cutoff data found for the selected category
                                    </td>
                                </tr>
                            ) : (
                                tableData.rows.map((row, rowIdx) => (
                                    <tr
                                        key={row.course}
                                        className={`border-b border-[#1e3a5f]/50 hover:bg-[#1e3a5f]/50 transition-colors ${rowIdx % 2 === 0 ? 'bg-[#0a1628]' : 'bg-[#0f1d32]'
                                            }`}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                                                {row.course}
                                            </div>
                                            <div className="text-gray-500 text-xs mt-1">
                                                {/* Optional: Show raw codes if useful, or remove subtext if normalized name is clear enough */}
                                                Code: {row.courseName !== row.course ? row.courseName.substring(0, 10) + '...' : ''}
                                            </div>
                                        </td>
                                        {tableData.years.map((year, idx) => {
                                            const data = row.yearData[year] || {}
                                            const isLatest = idx === 0
                                            return (
                                                <>
                                                    <td key={`${row.course}-${year}-r3`} className={`text-center py-3 px-2 font-mono ${isLatest ? 'text-yellow-400 font-semibold' : 'text-gray-500'}`}>
                                                        {data.R3?.toLocaleString() || '-'}
                                                    </td>
                                                    <td key={`${row.course}-${year}-r2`} className={`text-center py-3 px-2 font-mono ${isLatest ? 'text-white' : 'text-gray-600'}`}>
                                                        {data.R2?.toLocaleString() || '-'}
                                                    </td>
                                                    <td key={`${row.course}-${year}-r1`} className={`text-center py-3 px-2 font-mono ${isLatest ? 'text-white' : 'text-gray-600'}`}>
                                                        {data.R1?.toLocaleString() || '-'}
                                                    </td>
                                                </>
                                            )
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-2 px-1">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span>R3 - Round 3 / Extended</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span>R2 - Round 2</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                    <span>R1 - Round 1</span>
                </div>
            </div>
        </div>
    )
}

export default CollegeDetail

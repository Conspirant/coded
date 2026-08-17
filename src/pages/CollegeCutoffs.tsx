import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo } from "react"
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Building2, Search, Grid3X3, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"

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

// Ordered categories matching the official KEA format
const ORDERED_CATS = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMR', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']

const TYPE_FILTERS: Record<string, string[]> = {
    "All": ORDERED_CATS,
    "General": ['1G', '2AG', '2BG', '3AG', '3BG', 'GM', 'SCG', 'STG'],
    "Kannada": ['1K', '2AK', '2BK', '3AK', '3BK', 'GMK', 'SCK', 'STK'],
    "Rural": ['1R', '2AR', '2BR', '3AR', '3BR', 'GMR', 'SCR', 'STR'],
}

// Category colors
const getCategoryColor = (cat: string) => {
    switch (cat?.toUpperCase()) {
        case 'GM': return 'bg-blue-500/15 text-blue-400 border-blue-500/20'
        case 'GMK': return 'bg-blue-500/15 text-blue-300 border-blue-500/20'
        case 'GMR': return 'bg-sky-500/15 text-sky-400 border-sky-500/20'
        case 'SCG': return 'bg-green-500/15 text-green-400 border-green-500/20'
        case 'SCK': return 'bg-green-500/15 text-green-300 border-green-500/20'
        case 'SCR': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
        case 'STG': return 'bg-purple-500/15 text-purple-400 border-purple-500/20'
        case 'STK': return 'bg-purple-500/15 text-purple-300 border-purple-500/20'
        case 'STR': return 'bg-violet-500/15 text-violet-400 border-violet-500/20'
        case '1G': return 'bg-red-500/15 text-red-400 border-red-500/20'
        case '1K': return 'bg-red-500/15 text-red-300 border-red-500/20'
        case '1R': return 'bg-rose-500/15 text-rose-400 border-rose-500/20'
        case '2AG': return 'bg-orange-500/15 text-orange-400 border-orange-500/20'
        case '2AK': case '2AR': return 'bg-orange-500/15 text-orange-300 border-orange-500/20'
        case '2BG': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
        case '2BK': case '2BR': return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20'
        case '3AG': return 'bg-pink-500/15 text-pink-400 border-pink-500/20'
        case '3AK': case '3AR': return 'bg-pink-500/15 text-pink-300 border-pink-500/20'
        case '3BG': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20'
        case '3BK': case '3BR': return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20'
        default: return 'bg-gray-500/15 text-gray-400 border-gray-500/20'
    }
}

// --- Clean course name ---
const cleanCourseName = (course: string): string => {
    if (!course) return course
    let cleaned = course.trim().replace(/\s+/g, ' ')
    cleaned = cleaned
        .replace(/Communicatio\s*n/gi, 'Communication')
        .replace(/D\s*ata/gi, 'Data')
        .replace(/Dat\s*a/gi, 'Data')
        .replace(/Scien\s*ce/gi, 'Science')
        .replace(/Engineerin\s*g/gi, 'Engineering')
        .replace(/Electro\s*nics/gi, 'Electronics')
        .replace(/Informatio\s*n/gi, 'Information')
        .replace(/Artificia\s*l/gi, 'Artificial')
        .replace(/Intelligenc\s*e/gi, 'Intelligence')
        .replace(/Machin\s*e/gi, 'Machine')
        .replace(/Learnin\s*g/gi, 'Learning')
    return cleaned
}

const getCourseKey = (course: string): string => cleanCourseName(course).toLowerCase().trim()

const normalizeRound = (round: string): string => {
    const r = round.toUpperCase().trim()
    if (r === "EXT" || r.includes("R3") || r.includes("EXTENDED") || r.includes("ROUND 3")) return "R3"
    if (r === "MOCK2" || r === "MOCK 2" || r === "MOCK ROUND 2" || r === "MOCK R2" || r === "MOCK_R2") return "MOCK2"
    if (r === "MOCK" || r === "MOCK 1" || r === "MOCK1" || r === "MOCK ROUND 1" || r.includes("MOCK")) return "MOCK"
    if (r === "R2" || r.includes("ROUND 2")) return "R2"
    if (r === "R1" || r.includes("ROUND 1")) return "R1"
    return round
}

const roundOrder = (round: string) => {
    const r = normalizeRound(round)
    if (r === 'MOCK' || r === 'MOCK1') return 0
    if (r === 'MOCK2') return 0.5
    if (r === 'R1') return 1
    if (r === 'R2') return 2
    if (r === 'R3') return 3
    return 99
}

const getRoundDisplayName = (round: string) => {
    const r = normalizeRound(round)
    switch (r) {
        case 'MOCK': return 'MOCK 1'
        case 'MOCK1': return 'MOCK 1'
        case 'MOCK2': return 'MOCK 2'
        case 'R1': return 'R1'
        case 'R2': return 'R2'
        case 'R3': return 'R3'
        default: return round
    }
}

// ─── College Matrix Card ────────────────────────────────────
interface CollegeMatrixProps {
    collegeCode: string
    collegeName: string
    cutoffs: CutoffData[]
    selectedYear: string
    selectedRound: string
    selectedType: string
    selectedCategory: string
    sortBy: string
    isExpanded: boolean
    onToggle: () => void
}

const CollegeMatrix = ({
    collegeCode,
    collegeName,
    cutoffs,
    selectedYear,
    selectedRound,
    selectedType,
    selectedCategory,
    sortBy,
    isExpanded,
    onToggle,
}: CollegeMatrixProps) => {
    const matrixData = useMemo(() => {
        // Filter cutoffs for the selected year & round
        const filtered = cutoffs.filter(c =>
            c.year === selectedYear &&
            normalizeRound(c.round) === selectedRound
        )

        // Build lookup: courseKey -> { displayName, catMap: { category -> rank } }
        const courseMap = new Map<string, { display: string; cats: Map<string, number> }>()
        for (const entry of filtered) {
            const key = getCourseKey(entry.course)
            if (!courseMap.has(key)) {
                courseMap.set(key, { display: cleanCourseName(entry.course), cats: new Map() })
            }
            const existing = courseMap.get(key)!.cats.get(entry.category)
            // Keep the best (lowest) rank if duplicates
            if (!existing || entry.cutoff_rank < existing) {
                courseMap.get(key)!.cats.set(entry.category, entry.cutoff_rank)
            }
        }

        // Determine sorting value for each course
        let sortedCourses = [...courseMap.entries()]
        
        if (sortBy !== "none") {
            const courseRankMap = new Map<string, number>()
            
            for (const [key, course] of sortedCourses) {
                // Find cutoff rank for the target categories
                let targetCats = TYPE_FILTERS[selectedType] || ORDERED_CATS
                if (selectedCategory !== 'ALL') {
                    targetCats = [selectedCategory]
                } else if (targetCats.includes('GM')) {
                    targetCats = ['GM']
                }

                // Get matching cutoff rank values for this course
                const ranks: number[] = []
                targetCats.forEach(cat => {
                    const r = course.cats.get(cat)
                    if (r) ranks.push(r)
                })

                if (ranks.length === 0) {
                    // Fall back to any active type category rank
                    const typeCats = TYPE_FILTERS[selectedType] || ORDERED_CATS
                    typeCats.forEach(cat => {
                        const r = course.cats.get(cat)
                        if (r) ranks.push(r)
                    })
                }

                if (ranks.length === 0) {
                    courseRankMap.set(key, sortBy === "asc" ? Infinity : -Infinity)
                } else {
                    const minRank = Math.min(...ranks)
                    courseRankMap.set(key, minRank)
                }
            }

            sortedCourses.sort((a, b) => {
                const rankA = courseRankMap.get(a[0]) ?? (sortBy === "asc" ? Infinity : -Infinity)
                const rankB = courseRankMap.get(b[0]) ?? (sortBy === "asc" ? Infinity : -Infinity)

                if (rankA === rankB) {
                    return a[1].display.localeCompare(b[1].display)
                }

                return sortBy === "asc" ? rankA - rankB : rankB - rankA
            })
        } else {
            // Default alphabetical sort by course display name
            sortedCourses.sort(([, a], [, b]) => a.display.localeCompare(b.display))
        }

        // Determine which categories to show
        let typeCats = TYPE_FILTERS[selectedType] || ORDERED_CATS
        // If a specific category is chosen, narrow to just that
        if (selectedCategory !== 'ALL') {
            typeCats = typeCats.filter(c => c === selectedCategory)
        }
        const activeCats = typeCats.filter(cat => {
            for (const [, course] of courseMap) {
                if (course.cats.has(cat)) return true
            }
            return false
        })

        return { sortedCourses, activeCats, totalEntries: filtered.length }
    }, [cutoffs, selectedYear, selectedRound, selectedType, selectedCategory, sortBy])

    const { sortedCourses, activeCats, totalEntries } = matrixData

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden mb-4 transition-all hover:border-white/10">
      <SEO
        title="KCET College Cutoffs 2023-2025 – Branch & Category Wise"
        description="View complete KCET college cutoffs for 2023, 2024 & 2025 — branch-wise and category-wise. Compare GM, OBC, SC, ST cutoff ranks for all engineering colleges in Karnataka."
        url="https://kcetcoded.dev/college-cutoffs"
        keywords="KCET college cutoffs, KCET branch wise cutoff, KCET category wise cutoff, KCET 2025 cutoff, KCET 2024 cutoff, KCET GM cutoff, KCET OBC cutoff"
      />
            {/* College Header */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-4.5 w-4.5 text-indigo-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-white font-semibold text-sm sm:text-base">
                            <span className="font-mono text-indigo-400 mr-2">{collegeCode}</span>
                            {collegeName}
                        </h3>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {totalEntries > 0 && (
                        <span className="text-xs text-muted-foreground hidden sm:block">
                            {sortedCourses.length} courses · {totalEntries} entries
                        </span>
                    )}
                    {isExpanded
                        ? <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        : <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    }
                </div>
            </button>

            {/* Expanded Matrix */}
            {isExpanded && (
                <div className="border-t border-white/5">
                    {sortedCourses.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Grid3X3 className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No data for {selectedYear} {selectedRound}</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop/Tablet Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-xs font-mono border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.03]">
                                            <th className="text-left px-3 py-2.5 font-semibold text-muted-foreground border-b border-r border-white/5 sticky left-0 bg-background/95 backdrop-blur z-10 min-w-[200px] text-sm">
                                                Course
                                            </th>
                                            {activeCats.map(cat => (
                                                <th key={cat} className="px-1 py-2 text-center border-b border-white/5 min-w-[62px]">
                                                    <Badge className={`${getCategoryColor(cat)} text-[9px] px-1.5 font-bold`}>{cat}</Badge>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedCourses.map(([, course], rowIdx) => (
                                            <tr
                                                key={course.display}
                                                className={`${rowIdx % 2 === 0 ? 'bg-white/[0.01]' : ''} hover:bg-white/[0.04] transition-colors`}
                                            >
                                                <td className="px-3 py-2 font-semibold text-sm border-r border-white/5 sticky left-0 bg-background/95 backdrop-blur z-10 whitespace-nowrap text-foreground">
                                                    {course.display}
                                                </td>
                                                {activeCats.map(cat => {
                                                    const rank = course.cats.get(cat)
                                                    return (
                                                        <td
                                                            key={cat}
                                                            className={`px-1 py-2 text-center border-white/5 ${rank
                                                                ? 'text-foreground'
                                                                : 'text-muted-foreground/20'
                                                                }`}
                                                            title={rank
                                                                ? `${course.display} / ${cat} = ${rank.toLocaleString()}`
                                                                : `No data for ${course.display} / ${cat}`
                                                            }
                                                        >
                                                            {rank ? rank.toLocaleString() : '--'}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile list view */}
                            <div className="lg:hidden divide-y divide-white/5">
                                {sortedCourses.map(([, course], rowIdx) => (
                                    <div
                                        key={course.display}
                                        className={`p-3 space-y-2 ${rowIdx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}
                                    >
                                        <div className="font-semibold text-xs sm:text-sm text-slate-200 leading-relaxed">
                                            {course.display}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {activeCats.filter(cat => course.cats.get(cat)).length === 0 ? (
                                                <span className="text-[10px] text-muted-foreground/50 italic">No ranks for selected filters</span>
                                            ) : (
                                                activeCats.map(cat => {
                                                    const rank = course.cats.get(cat)
                                                    if (!rank) return null
                                                    return (
                                                        <div
                                                            key={cat}
                                                            className="flex items-center gap-1.5 bg-white/5 border border-white/5 rounded px-2 py-0.5"
                                                        >
                                                            <span className={`px-1 rounded text-[8px] font-bold border ${getCategoryColor(cat)}`}>
                                                                {cat}
                                                            </span>
                                                            <span className="font-mono text-xs font-semibold text-indigo-400">
                                                                {rank.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

// ─── Main Page ──────────────────────────────────────────────
const CollegeCutoffs = () => {
    const [allCutoffs, setAllCutoffs] = useState<CutoffData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedYear, setSelectedYear] = useState("2026")
    const [selectedRound, setSelectedRound] = useState("R1")
    const [selectedType, setSelectedType] = useState("All")
    const [selectedCategory, setSelectedCategory] = useState("ALL")
    const [sortBy, setSortBy] = useState<"none" | "asc" | "desc">("none")
    const [expandedColleges, setExpandedColleges] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")
    const [years, setYears] = useState<string[]>([])
    const [showFilters, setShowFilters] = useState(false)

    // Load cutoff data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const urls = [
                    '/data/kcet_cutoffs_high_volume.dat',
                    '/data/kcet_cutoffs_master.dat',
                    '/data/kcet_cutoffs_consolidated.dat',
                    '/kcet_cutoffs.dat',
                ]
                let response: Response | null = null

                for (const url of urls) {
                    const r = await fetch(url, { cache: 'no-store' })
                    if (r.ok) { response = r; break }
                }

                if (!response) throw new Error('Failed to load data')

                const rawData = await response.json()
                let cutoffs: CutoffData[] = Array.isArray(rawData)
                    ? rawData
                    : (rawData.cutoffs || rawData.data || [])

                // Sanitize and clean up course names/records
                cutoffs = cutoffs.filter(c => {
                    if (!c.course) return false
                    const courseClean = c.course.trim().toUpperCase()
                    // Filter out garbage rows like 'SC sub' or 'SCIENCE AND ENGINEERING(DA TA SCIENCE)' with rank 5
                    if (courseClean === 'SC SUB' || courseClean === 'SCIENCE AND ENGINEERING(DA TA SCIENCE)') {
                        return false
                    }
                    // Filter out records with invalid cutoff ranks that are seat counts (like 1, 2, 5)
                    if (c.cutoff_rank <= 100) {
                        return false
                    }
                    return true
                }).map(c => {
                    const code = c.institute_code?.trim().toUpperCase()
                    const courseClean = c.course.trim().toUpperCase()
                    if (code === 'E159' && courseClean === 'COMPUTER') {
                        return { ...c, course: 'COMPUTER SCIENCE AND ENGINEERING(DATA SCIENCE)' }
                    }
                    return c
                })

                setAllCutoffs(cutoffs)

                // Extract unique years
                const uniqueYears = [...new Set(cutoffs.map(c => c.year))].sort((a, b) => b.localeCompare(a))
                setYears(uniqueYears)

                // Default to latest year
                if (uniqueYears.length > 0) setSelectedYear(uniqueYears[0])
            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Dynamic available rounds for the selected year only
    const availableRounds = useMemo(() => {
        if (!selectedYear || allCutoffs.length === 0) return []
        const yearCutoffs = allCutoffs.filter(c => String(c.year) === String(selectedYear))
        const unique = [...new Set(yearCutoffs.map(c => normalizeRound(c.round)))]
        return unique.sort((a, b) => roundOrder(a) - roundOrder(b))
    }, [allCutoffs, selectedYear])

    // Ensure selectedRound is valid for the chosen year
    useEffect(() => {
        if (availableRounds.length > 0 && !availableRounds.includes(selectedRound)) {
            setSelectedRound(availableRounds[0])
        }
    }, [availableRounds, selectedRound])

    // Build college list
    const colleges = useMemo(() => {
        // Pick the most frequent name per institute_code
        const collegeNames = new Map<string, Map<string, number>>()
        allCutoffs.forEach(c => {
            if (!c.institute_code) return
            const code = c.institute_code.trim().toUpperCase()
            const name = (c.institute || '').trim()
            if (!name) return
            if (!collegeNames.has(code)) collegeNames.set(code, new Map())
            const counts = collegeNames.get(code)!
            counts.set(name, (counts.get(name) || 0) + 1)
        })

        const collegeMap = new Map<string, { code: string; name: string; cutoffs: CutoffData[] }>()

        allCutoffs.forEach(cutoff => {
            const code = cutoff.institute_code?.trim().toUpperCase()
            if (!code) return
            // Only E001-E999
            const match = code.match(/E(\d+)/)
            if (!match) return

            if (!collegeMap.has(code)) {
                // Get best name
                let bestName = code
                const names = collegeNames.get(code)
                if (names) {
                    let bestCount = -1
                    for (const [n, count] of names) {
                        if (count > bestCount) { bestName = n; bestCount = count }
                    }
                }
                collegeMap.set(code, { code, name: bestName, cutoffs: [] })
            }
            collegeMap.get(code)!.cutoffs.push(cutoff)
        })

        let list = Array.from(collegeMap.values())

        // Filter by search
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            list = list.filter(c =>
                c.code.toLowerCase().includes(q) ||
                c.name.toLowerCase().includes(q)
            )
        }

        // Apply sorting
        if (sortBy !== "none") {
            const collegeRankMap = new Map<string, number>()
            list.forEach(c => {
                const filteredCutoffs = c.cutoffs.filter(cutoff =>
                    cutoff.year === selectedYear &&
                    normalizeRound(cutoff.round) === selectedRound
                )
                if (filteredCutoffs.length === 0) {
                    collegeRankMap.set(c.code, sortBy === "asc" ? Infinity : -Infinity)
                    return
                }

                let targetCats = TYPE_FILTERS[selectedType] || ORDERED_CATS
                if (selectedCategory !== 'ALL') {
                    targetCats = [selectedCategory]
                } else if (targetCats.includes('GM')) {
                    targetCats = ['GM']
                }

                const matchingCutoffs = filteredCutoffs.filter(cutoff => targetCats.includes(cutoff.category))
                if (matchingCutoffs.length === 0) {
                    const typeCats = TYPE_FILTERS[selectedType] || ORDERED_CATS
                    const typeMatching = filteredCutoffs.filter(cutoff => typeCats.includes(cutoff.category))
                    if (typeMatching.length > 0) {
                        const minRank = Math.min(...typeMatching.map(cutoff => cutoff.cutoff_rank))
                        collegeRankMap.set(c.code, minRank)
                    } else {
                        collegeRankMap.set(c.code, sortBy === "asc" ? Infinity : -Infinity)
                    }
                } else {
                    const minRank = Math.min(...matchingCutoffs.map(cutoff => cutoff.cutoff_rank))
                    collegeRankMap.set(c.code, minRank)
                }
            })

            list.sort((a, b) => {
                const rankA = collegeRankMap.get(a.code) ?? (sortBy === "asc" ? Infinity : -Infinity)
                const rankB = collegeRankMap.get(b.code) ?? (sortBy === "asc" ? Infinity : -Infinity)
                if (rankA === rankB) {
                    return a.code.localeCompare(b.code, undefined, { numeric: true })
                }
                return sortBy === "asc" ? rankA - rankB : rankB - rankA
            })
        } else {
            // Default sort: code order
            list.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }))
        }

        return list
    }, [allCutoffs, searchQuery, sortBy, selectedYear, selectedRound, selectedType, selectedCategory])

    const toggleCollege = (code: string) => {
        setExpandedColleges(prev => {
            const next = new Set(prev)
            if (next.has(code)) next.delete(code)
            else next.add(code)
            return next
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto" />
                    <p className="text-muted-foreground">Loading cutoff data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <div className="bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 py-4 lg:sticky lg:top-16 z-20">
                <div className="max-w-[1600px] mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Grid3X3 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold">College Cutoff Matrix</h1>
                            <p className="text-xs text-muted-foreground">
                                Courses × Categories — official KEA format
                            </p>
                        </div>
                        {colleges.length > 0 && (
                            <Badge className="ml-auto bg-white/5 text-muted-foreground border-white/10 text-xs">
                                {colleges.length} colleges
                            </Badge>
                        )}
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden lg:flex flex-wrap items-end gap-3">
                        {/* Search */}
                        <div className="flex-1 min-w-[200px] max-w-sm">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search colleges..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-white/5 border-white/10 h-10"
                                />
                            </div>
                        </div>

                        {/* Year */}
                        <div className="w-28">
                            <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Year</label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Round */}
                        <div className="w-32">
                            <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Round</label>
                            <Select value={selectedRound} onValueChange={setSelectedRound}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {availableRounds.map(r => <SelectItem key={r} value={r}>{getRoundDisplayName(r)}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Category Type */}
                        <div className="w-32">
                            <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Cat. Type</label>
                            <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setSelectedCategory('ALL') }}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.keys(TYPE_FILTERS).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Specific Category */}
                        <div className="w-28">
                            <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Category</label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent className="max-h-64">
                                    <SelectItem value="ALL">All</SelectItem>
                                    {(TYPE_FILTERS[selectedType] || ORDERED_CATS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort By */}
                        <div className="w-36">
                            <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Sort By</label>
                            <Select value={sortBy} onValueChange={(v: "none" | "asc" | "desc") => setSortBy(v)}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Default (Code)</SelectItem>
                                    <SelectItem value="asc">Lowest to Highest</SelectItem>
                                    <SelectItem value="desc">Highest to Lowest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Mobile/Tablet Filters */}
                    <div className="lg:hidden space-y-3">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search colleges..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-white/5 border-white/10 h-10 w-full"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg h-10 px-3 flex items-center gap-2 text-white font-medium shrink-0"
                            >
                                <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                                <span className="text-xs">Filters</span>
                            </button>
                        </div>

                        {showFilters && (
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                                {/* Year */}
                                <div className="col-span-1">
                                    <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Year</label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10 w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Round */}
                                <div className="col-span-1">
                                    <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Round</label>
                                    <Select value={selectedRound} onValueChange={setSelectedRound}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10 w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {availableRounds.map(r => <SelectItem key={r} value={r}>{getRoundDisplayName(r)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Category Type */}
                                <div className="col-span-1">
                                    <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Cat. Type</label>
                                    <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); setSelectedCategory('ALL') }}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10 w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {Object.keys(TYPE_FILTERS).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Specific Category */}
                                <div className="col-span-1">
                                    <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Category</label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10 w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent className="max-h-64">
                                            <SelectItem value="ALL">All</SelectItem>
                                            {(TYPE_FILTERS[selectedType] || ORDERED_CATS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sort By */}
                                <div className="col-span-2">
                                    <label className="text-[10px] text-muted-foreground mb-1 block uppercase tracking-wider font-semibold">Sort By</label>
                                    <Select value={sortBy} onValueChange={(v: "none" | "asc" | "desc") => setSortBy(v)}>
                                        <SelectTrigger className="bg-white/5 border-white/10 h-10 w-full"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Default (Code)</SelectItem>
                                            <SelectItem value="asc">Lowest to Highest</SelectItem>
                                            <SelectItem value="desc">Highest to Lowest</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Apply & Close Button */}
                                <div className="col-span-2 pt-2">
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg h-10 text-xs font-semibold flex items-center justify-center transition-colors"
                                    >
                                        Apply & Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* College List */}
            <div className="max-w-[1600px] mx-auto p-4">
                {colleges.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <Building2 className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No colleges found</p>
                        <p className="text-xs mt-1">Try a different search</p>
                    </div>
                ) : (
                    colleges.map(college => (
                        <CollegeMatrix
                            key={college.code}
                            collegeCode={college.code}
                            collegeName={college.name}
                            cutoffs={college.cutoffs}
                            selectedYear={selectedYear}
                            selectedRound={selectedRound}
                            selectedType={selectedType}
                            selectedCategory={selectedCategory}
                            sortBy={sortBy}
                            isExpanded={expandedColleges.has(college.code)}
                            onToggle={() => toggleCollege(college.code)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default CollegeCutoffs

import { useState, useEffect, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ChevronDown, ChevronUp, Building2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { COURSE_CODE_TO_NAME } from "@/lib/courses"

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

// Category options with display names
const CATEGORIES = [
    { value: "GM", label: "GM - General Merit" },
    { value: "1G", label: "1G - Category 1" },
    { value: "2AG", label: "2AG - Category 2A" },
    { value: "2BG", label: "2BG - Category 2B" },
    { value: "3AG", label: "3AG - Category 3A" },
    { value: "3BG", label: "3BG - Category 3B" },
    { value: "SCG", label: "SCG - Scheduled Caste" },
    { value: "STG", label: "STG - Scheduled Tribe" },
]

const TYPE_OPTIONS = [
    { value: "General", label: "General" },
    { value: "Rural", label: "Rural" },
    { value: "Kannada", label: "Kannada Medium" },
    { value: "Hyderabad-K", label: "Hyderabad-Karnataka" },
]

// Helper to clean course names - preserves exact course name from JSON, just fixes spacing issues
const cleanCourseName = (course: string): string => {
    if (!course) return course

    // Just clean up extra spaces, preserve original casing and format
    let cleaned = course.trim().replace(/\s+/g, ' ')

    // Fix known broken words from PDF extraction (spacing issues)
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

// Helper to create a normalized key for grouping (case-insensitive)
const getCourseKey = (course: string): string => {
    return cleanCourseName(course).toLowerCase().trim()
}

// Helper to normalize round names for display
const normalizeRound = (round: string): string => {
    const r = round.toUpperCase()
    // EXT = Extended Round (Round 3)
    if (r === "EXT" || r.includes("R3") || r.includes("EXTENDED") || r.includes("ROUND 3")) return "R3"
    if (r === "R2" || r.includes("ROUND 2")) return "R2"
    // R1 and MOCK are both considered R1 (first round)
    if (r === "R1" || r === "MOCK" || r.includes("ROUND 1")) return "R1"
    return round
}

interface CollegeCardProps {
    collegeCode: string
    collegeName: string
    cutoffs: CutoffData[]
    selectedCategory: string
    selectedType: string
    isExpanded: boolean
    onToggle: () => void
    years: string[]
}

const CollegeCard = ({
    collegeCode,
    collegeName,
    cutoffs,
    selectedCategory,
    selectedType,
    isExpanded,
    onToggle,
    years
}: CollegeCardProps) => {
    // Process data for table display
    const tableData = useMemo(() => {
        // Filter by category
        let filtered = cutoffs.filter(c => {
            const cat = c.category?.toUpperCase() || ""
            return cat.startsWith(selectedCategory.toUpperCase().replace('G', '')) || cat === selectedCategory.toUpperCase()
        })

        // Group by course key (case-insensitive) to consolidate duplicates with different casing
        const courseMap = new Map<string, {
            courseKey: string,
            displayName: string,
            records: CutoffData[]
        }>()

        filtered.forEach(record => {
            const key = getCourseKey(record.course)
            const cleanedName = cleanCourseName(record.course)
            if (!courseMap.has(key)) {
                courseMap.set(key, {
                    courseKey: key,
                    displayName: cleanedName, // Use cleaned original name for display
                    records: []
                })
            }
            courseMap.get(key)!.records.push(record)
        })

        // Build table data from grouped courses
        const rows = Array.from(courseMap.values())
            .sort((a, b) => a.displayName.localeCompare(b.displayName))
            .map(({ displayName, records }) => {
                const firstRecord = records[0]

                // Build year data
                const yearData: Record<string, { seats?: number, R3?: number, R2?: number, R1?: number }> = {}

                years.forEach(year => {
                    const yearRecords = records.filter(c => c.year === year)
                    yearData[year] = {
                        seats: yearRecords[0]?.total_seats,
                        R3: undefined,
                        R2: undefined,
                        R1: undefined
                    }

                    yearRecords.forEach(record => {
                        const roundKey = normalizeRound(record.round)
                        if (roundKey === "R3") yearData[year].R3 = record.cutoff_rank
                        if (roundKey === "R2") yearData[year].R2 = record.cutoff_rank
                        if (roundKey === "R1") yearData[year].R1 = record.cutoff_rank
                    })
                })

                return {
                    course: displayName,
                    seats: firstRecord?.total_seats,
                    yearData
                }
            })

        return rows
    }, [cutoffs, selectedCategory, years])

    return (
        <div className="bg-[#0f1d32] border border-[#1e3a5f] rounded-lg overflow-hidden mb-4">
            {/* College Header - Clickable */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-[#1e3a5f]/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-4 w-4 text-blue-400" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-white font-semibold">
                            {collegeCode} - {collegeName}
                        </h3>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-[#1e3a5f]">
                    {/* College Link & Info */}
                    <div className="px-4 py-3 border-b border-[#1e3a5f]/50">
                        <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(collegeName + " official website")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center gap-1"
                        >
                            Search for official website
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>

                    {/* Cutoff Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#1e3a5f]">
                                    <th className="text-left py-3 px-4 text-gray-400 font-medium bg-[#0a1628]" rowSpan={2}>
                                        Course
                                    </th>
                                    <th className="text-center py-2 px-2 text-gray-400 font-medium bg-[#0a1628]" rowSpan={2}>
                                        Seats
                                    </th>
                                    {years.map((year, idx) => (
                                        <th
                                            key={year}
                                            colSpan={4}
                                            className={`text-center py-2 px-2 font-medium ${idx === 1 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[#0a1628] text-gray-400'
                                                }`}
                                        >
                                            {selectedCategory} - {year} Cutoffs
                                        </th>
                                    ))}
                                </tr>
                                <tr className="border-b border-[#1e3a5f] bg-[#0a1628]">
                                    {years.map((year, idx) => (
                                        <React.Fragment key={`header-${year}`}>
                                            <th className={`text-center py-2 px-2 text-xs ${idx === 1 ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500'
                                                }`}>
                                                Seats
                                            </th>
                                            <th className={`text-center py-2 px-2 text-xs ${idx === 1 ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500'
                                                }`}>
                                                R3
                                            </th>
                                            <th className={`text-center py-2 px-2 text-xs ${idx === 1 ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500'
                                                }`}>
                                                R2
                                            </th>
                                            <th className={`text-center py-2 px-2 text-xs ${idx === 1 ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500'
                                                }`}>
                                                R1
                                            </th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.length === 0 ? (
                                    <tr>
                                        <td colSpan={2 + years.length * 4} className="text-center py-8 text-gray-500">
                                            No cutoff data found for the selected category
                                        </td>
                                    </tr>
                                ) : (
                                    tableData.map((row, rowIdx) => (
                                        <tr
                                            key={row.course}
                                            className={`border-b border-[#1e3a5f]/50 hover:bg-[#1e3a5f]/30 transition-colors ${rowIdx % 2 === 0 ? 'bg-[#0a1628]/50' : ''
                                                }`}
                                        >
                                            <td className="py-3 px-4">
                                                <div className="text-yellow-500 font-medium">
                                                    {row.course}
                                                </div>
                                            </td>
                                            <td className="text-center py-3 px-2 text-white font-medium">
                                                {row.seats || '-'}
                                            </td>
                                            {years.map((year, idx) => {
                                                const data = row.yearData[year] || {}
                                                const isHighlighted = idx === 1
                                                return (
                                                    <React.Fragment key={`${row.course}-${year}`}>
                                                        <td className={`text-center py-3 px-2 font-mono text-sm ${isHighlighted ? 'bg-yellow-500/5' : ''
                                                            } ${data.seats ? 'text-white' : 'text-gray-600'}`}>
                                                            {data.seats || '-'}
                                                        </td>
                                                        <td className={`text-center py-3 px-2 font-mono text-sm ${isHighlighted ? 'bg-yellow-500/5' : ''
                                                            } ${data.R3 ? 'text-yellow-400' : 'text-gray-600'}`}>
                                                            {data.R3?.toLocaleString() || '-'}
                                                        </td>
                                                        <td className={`text-center py-3 px-2 font-mono text-sm ${isHighlighted ? 'bg-yellow-500/5' : ''
                                                            } ${data.R2 ? 'text-white' : 'text-gray-600'}`}>
                                                            {data.R2?.toLocaleString() || '-'}
                                                        </td>
                                                        <td className={`text-center py-3 px-2 font-mono text-sm ${isHighlighted ? 'bg-yellow-500/5' : ''
                                                            } ${data.R1 ? 'text-white' : 'text-gray-600'}`}>
                                                            {data.R1?.toLocaleString() || '-'}
                                                        </td>
                                                    </React.Fragment>
                                                )
                                            })}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

import React from "react"

const CollegeCutoffs = () => {
    const [allCutoffs, setAllCutoffs] = useState<CutoffData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("GM")
    const [selectedType, setSelectedType] = useState("General")
    const [expandedColleges, setExpandedColleges] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")
    const [years, setYears] = useState<string[]>([])

    // Load cutoff data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const urls = ['/data/kcet_cutoffs_master.json', '/data/kcet_cutoffs_consolidated.json', '/kcet_cutoffs.json']
                let response: Response | null = null

                for (const url of urls) {
                    const r = await fetch(url, { cache: 'no-store' })
                    if (r.ok) { response = r; break }
                }

                if (!response) throw new Error('Failed to load data')

                const rawData = await response.json()
                const cutoffs: CutoffData[] = Array.isArray(rawData)
                    ? rawData
                    : (rawData.cutoffs || rawData.data || [])

                setAllCutoffs(cutoffs)

                // Extract unique years
                const uniqueYears = [...new Set(cutoffs.map(c => c.year))].sort((a, b) => b.localeCompare(a))
                setYears(uniqueYears.slice(0, 3)) // Show last 3 years
            } catch (error) {
                console.error('Error loading data:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [])

    // Get unique colleges
    const colleges = useMemo(() => {
        const collegeMap = new Map<string, { code: string, name: string, cutoffs: CutoffData[] }>()

        allCutoffs.forEach(cutoff => {
            const code = cutoff.institute_code
            if (!code) return

            // Filter to E001-E314
            const match = code.match(/E(\d+)/)
            if (!match) return
            const num = parseInt(match[1])
            if (num < 1 || num > 314) return

            if (!collegeMap.has(code)) {
                collegeMap.set(code, {
                    code,
                    name: cutoff.institute,
                    cutoffs: []
                })
            }
            collegeMap.get(code)!.cutoffs.push(cutoff)
        })

        // Convert to array and sort by code
        let colleges = Array.from(collegeMap.values()).sort((a, b) => a.code.localeCompare(b.code))

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            colleges = colleges.filter(c =>
                c.code.toLowerCase().includes(query) ||
                c.name.toLowerCase().includes(query)
            )
        }

        return colleges
    }, [allCutoffs, searchQuery])

    const toggleCollege = (code: string) => {
        setExpandedColleges(prev => {
            const next = new Set(prev)
            if (next.has(code)) {
                next.delete(code)
            } else {
                next.add(code)
            }
            return next
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="text-white text-lg">Loading college cutoffs...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* Header */}
            <div className="bg-[#0f1d32] border-b border-[#1e3a5f] px-4 py-4 sticky top-0 z-10">
                <div className="max-w-[1400px] mx-auto">
                    <h1 className="text-2xl font-bold text-white mb-4">College Cutoffs</h1>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px] max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search colleges..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-[#1e3a5f] border-[#2e4a6f] text-white placeholder:text-gray-500"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Category:</span>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[180px] bg-[#1e3a5f] border-[#2e4a6f] text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e3a5f] border-[#2e4a6f]">
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-[#2e4a6f]">
                                            {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Type:</span>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="w-[140px] bg-[#1e3a5f] border-[#2e4a6f] text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-[#1e3a5f] border-[#2e4a6f]">
                                    {TYPE_OPTIONS.map(type => (
                                        <SelectItem key={type.value} value={type.value} className="text-white hover:bg-[#2e4a6f]">
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* College List */}
            <div className="max-w-[1400px] mx-auto p-4">
                <div className="text-sm text-gray-500 mb-4">
                    Showing {colleges.length} colleges
                </div>

                {colleges.map(college => (
                    <CollegeCard
                        key={college.code}
                        collegeCode={college.code}
                        collegeName={college.name}
                        cutoffs={college.cutoffs}
                        selectedCategory={selectedCategory}
                        selectedType={selectedType}
                        isExpanded={expandedColleges.has(college.code)}
                        onToggle={() => toggleCollege(college.code)}
                        years={years}
                    />
                ))}

                {colleges.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No colleges found matching your search
                    </div>
                )}
            </div>
        </div>
    )
}

export default CollegeCutoffs

import { useState, useEffect, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ChevronDown, ChevronUp, Building2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
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
    { value: "GMH", label: "GMH - GM Hyderabad-K" },
    { value: "GMR", label: "GMR - GM Rural" },
    { value: "GMK", label: "GMK - GM Kannada Medium" },
]

const TYPE_OPTIONS = [
    { value: "General", label: "General" },
    { value: "Rural", label: "Rural" },
    { value: "Kannada", label: "Kannada Medium" },
    { value: "Hyderabad-K", label: "Hyderabad-Karnataka" },
]

// Helper to normalize round names for display
const normalizeRound = (round: string): string => {
    if (round.includes("Round 3") || round.includes("R3")) return "R3"
    if (round.includes("Round 2") || round.includes("R2")) return "R2"
    if (round.includes("Round 1") || round.includes("R1") || round.includes("Mock")) return "R1"
    return round
}

const CollegeDetail = () => {
    const { collegeCode } = useParams<{ collegeCode: string }>()
    const [allCutoffs, setAllCutoffs] = useState<CutoffData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState("GM")
    const [selectedType, setSelectedType] = useState("General")
    const [expandedCollege, setExpandedCollege] = useState<string | null>(null)

    // College info
    const [collegeInfo, setCollegeInfo] = useState<{
        name: string
        code: string
        website?: string
    } | null>(null)

    // Load cutoff data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const urls = ['/data/kcet_cutoffs_consolidated.json', '/kcet_cutoffs.json']
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

                // Filter cutoffs for this college
                const collegeCutoffs = cutoffs.filter(c =>
                    c.institute_code?.toUpperCase() === collegeCode?.toUpperCase()
                )

                setAllCutoffs(collegeCutoffs)

                // Set college info from first record
                if (collegeCutoffs.length > 0) {
                    const first = collegeCutoffs[0]
                    setCollegeInfo({
                        name: first.institute,
                        code: first.institute_code,
                        website: undefined // Could be fetched from a colleges database
                    })
                }
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
        // Filter by category
        let filtered = allCutoffs.filter(c => {
            const cat = c.category?.toUpperCase() || ""
            return cat.startsWith(selectedCategory.toUpperCase().replace('G', '')) || cat === selectedCategory.toUpperCase()
        })

        // Get unique courses
        const courses = [...new Set(filtered.map(c => c.course))].sort()

        // Get available years
        const years = [...new Set(filtered.map(c => c.year))].sort((a, b) => b.localeCompare(a))

        // Build table data: for each course, get cutoffs for each year and round
        const rows = courses.map(course => {
            const courseData = filtered.filter(c => c.course === course)
            const firstRecord = courseData[0]

            // Build year data
            const yearData: Record<string, { seats?: number, R3?: number, R2?: number, R1?: number }> = {}

            years.forEach(year => {
                const yearRecords = courseData.filter(c => c.year === year)
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
                course,
                courseName: COURSE_CODE_TO_NAME[course] || course,
                seats: firstRecord?.total_seats,
                yearData
            }
        })

        return { rows, years }
    }, [allCutoffs, selectedCategory, selectedType])

    // Get color for cutoff value (yellow for highlighted, white otherwise)
    const getCellStyle = (value: number | undefined) => {
        if (!value) return "text-gray-500"
        return "text-white font-medium"
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="text-white text-lg">Loading college data...</div>
            </div>
        )
    }

    if (!collegeInfo) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center gap-4">
                <div className="text-white text-lg">College not found</div>
                <Link to="/cutoff-explorer">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cutoff Explorer
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#0a1628]">
            {/* College Header */}
            <div className="bg-[#0f1d32] border-b border-[#1e3a5f] px-4 py-4">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Link to="/cutoff-explorer" className="hover:text-white transition-colors">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <span>Cutoff Explorer</span>
                        <span>/</span>
                        <span className="text-white">{collegeInfo.code}</span>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-[#1e3a5f] flex items-center justify-center flex-shrink-0">
                            <Building2 className="h-6 w-6 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-bold text-white mb-1">
                                {collegeInfo.code} - {collegeInfo.name}
                            </h1>
                            {collegeInfo.website && (
                                <a
                                    href={collegeInfo.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center gap-1"
                                >
                                    {collegeInfo.website}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mt-4">
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

            {/* Cutoff Table */}
            <div className="max-w-[1400px] mx-auto p-4">
                <div className="bg-[#0f1d32] rounded-lg border border-[#1e3a5f] overflow-hidden">
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
                                    {tableData.years.map((year, idx) => (
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
                                    {tableData.years.map((year, idx) => (
                                        <>
                                            <th key={`${year}-seats`} className={`text-center py-2 px-2 text-xs ${idx === 1 ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500'
                                                }`}>
                                                Seats
                                            </th>
                                            <th key={`${year}-r3`} className={`text-center py-2 px-2 text-xs ${idx === 1 ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500'
                                                }`}>
                                                R3
                                            </th>
                                            <th key={`${year}-r2`} className={`text-center py-2 px-2 text-xs ${idx === 1 ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500'
                                                }`}>
                                                R2
                                            </th>
                                            <th key={`${year}-r1`} className={`text-center py-2 px-2 text-xs ${idx === 1 ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500'
                                                }`}>
                                                R1
                                            </th>
                                        </>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={2 + tableData.years.length * 4} className="text-center py-8 text-gray-500">
                                            No cutoff data found for the selected category
                                        </td>
                                    </tr>
                                ) : (
                                    tableData.rows.map((row, rowIdx) => (
                                        <tr
                                            key={row.course}
                                            className={`border-b border-[#1e3a5f]/50 hover:bg-[#1e3a5f]/30 transition-colors ${rowIdx % 2 === 0 ? 'bg-[#0a1628]/50' : ''
                                                }`}
                                        >
                                            <td className="py-3 px-4">
                                                <div className="text-yellow-500 hover:text-yellow-400 cursor-pointer font-medium">
                                                    {row.course}
                                                </div>
                                                <div className="text-gray-500 text-xs mt-0.5">
                                                    {row.courseName}
                                                </div>
                                            </td>
                                            <td className="text-center py-3 px-2 text-white font-medium">
                                                {row.seats || '-'}
                                            </td>
                                            {tableData.years.map((year, idx) => {
                                                const data = row.yearData[year] || {}
                                                const isHighlighted = idx === 1
                                                return (
                                                    <>
                                                        <td
                                                            key={`${row.course}-${year}-seats`}
                                                            className={`text-center py-3 px-2 font-mono text-sm ${isHighlighted ? 'bg-yellow-500/5' : ''
                                                                } ${data.seats ? 'text-white' : 'text-gray-600'}`}
                                                        >
                                                            {data.seats || '-'}
                                                        </td>
                                                        <td
                                                            key={`${row.course}-${year}-r3`}
                                                            className={`text-center py-3 px-2 font-mono text-sm ${isHighlighted ? 'bg-yellow-500/5' : ''
                                                                } ${data.R3 ? 'text-yellow-400' : 'text-gray-600'}`}
                                                        >
                                                            {data.R3?.toLocaleString() || '-'}
                                                        </td>
                                                        <td
                                                            key={`${row.course}-${year}-r2`}
                                                            className={`text-center py-3 px-2 font-mono text-sm ${isHighlighted ? 'bg-yellow-500/5' : ''
                                                                } ${data.R2 ? 'text-white' : 'text-gray-600'}`}
                                                        >
                                                            {data.R2?.toLocaleString() || '-'}
                                                        </td>
                                                        <td
                                                            key={`${row.course}-${year}-r1`}
                                                            className={`text-center py-3 px-2 font-mono text-sm ${isHighlighted ? 'bg-yellow-500/5' : ''
                                                                } ${data.R1 ? 'text-white' : 'text-gray-600'}`}
                                                        >
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
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-400">●</span>
                        <span>R3 - Round 3 (Extended)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white">●</span>
                        <span>R2 - Round 2</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white">●</span>
                        <span>R1 - Round 1</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CollegeDetail

import { useState, useEffect, useMemo } from "react"
import { SEO } from "@/components/SEO"
import AdUnit from "@/components/AdUnit"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Scale, Plus, X, Award, Shield, Check, AlertCircle,
  MapPin, Landmark, Calendar, LandmarkIcon, Percent,
  IndianRupee, Briefcase, GraduationCap, Loader2
} from "lucide-react"
import { COLLEGE_DATABASE, CollegeInfo } from "@/data/collegeDatabase"
import { CutoffService, CutoffData } from "@/lib/cutoff-service"

import { toast } from "sonner"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from "recharts"
import { supabase } from "@/integrations/supabase/client"
import { mergeSingleCollege } from "@/lib/college-service"

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

const CollegeCompare = () => {
  const [selectedColleges, setSelectedColleges] = useState<CollegeInfo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [overrides, setOverrides] = useState<Record<string, any>>({})

  // Cutoffs data state
  const [cutoffData, setCutoffData] = useState<CutoffData[]>([])
  const [cutoffsLoading, setCutoffsLoading] = useState(false)
  const [cutoffYear, setCutoffYear] = useState("2026")
  const [cutoffRound, setCutoffRound] = useState("R1")
  const [cutoffCategory, setCutoffCategory] = useState("GM")

  // Load cutoffs on mount
  useEffect(() => {
    const loadData = async () => {
      setCutoffsLoading(true)
      try {
        const data = await CutoffService.loadCutoffs()
        setCutoffData(data)
      } catch (err) {
        console.error("Error loading cutoffs in CollegeCompare:", err)
      } finally {
        setCutoffsLoading(false)
      }
    }
    loadData()
  }, [])

  // Fetch overrides on mount
  useEffect(() => {
    const fetchOverrides = async () => {
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
        if (data) {
          const map: Record<string, any> = {}
          data.forEach((row: any) => {
            map[row.code.toUpperCase()] = row
          })
          setOverrides(map)
        }
      } catch (err) {
        console.error('Error fetching college overrides in CollegeCompare:', err)
      }
    }
    fetchOverrides()
  }, [])

  // Merge static database with Supabase database overrides
  const mergedColleges = useMemo(() => {
    return COLLEGE_DATABASE.map(c => {
      const override = overrides[c.code.toUpperCase()]
      return override ? mergeSingleCollege(c, override) : c
    })
  }, [overrides])

  // Get the most up-to-date merged college info for selected colleges
  const activeColleges = useMemo(() => {
    return selectedColleges.map(sc => {
      const latest = mergedColleges.find(c => c.code.toUpperCase() === sc.code.toUpperCase())
      return latest || sc
    })
  }, [selectedColleges, mergedColleges])

  // Filter colleges based on search query, excluding already selected ones
  const filteredColleges = mergedColleges.filter(college => {
    const isAlreadySelected = selectedColleges.some(s => s.code === college.code)
    const matchesSearch =
      college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      college.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (college.shortName && college.shortName.toLowerCase().includes(searchQuery.toLowerCase()))

    return !isAlreadySelected && matchesSearch
  }).slice(0, 8) // Limit to top 8 search results for speed

  const handleAddCollege = (college: CollegeInfo) => {
    if (selectedColleges.length >= 3) {
      toast.error("Comparison Limit Reached", {
        description: "You can compare up to 3 colleges side-by-side."
      })
      return
    }
    setSelectedColleges([...selectedColleges, college])
    setSearchQuery("")
    setShowDropdown(false)
    toast.success(`Added ${college.shortName || college.name} to comparison`)
  }

  const handleRemoveCollege = (code: string) => {
    setSelectedColleges(selectedColleges.filter(c => c.code !== code))
  }

  // Helper to get placement rating color
  const getRateColor = (rate: number | null) => {
    if (!rate) return "bg-slate-700"
    if (rate >= 85) return "bg-emerald-500"
    if (rate >= 75) return "bg-teal-500"
    return "bg-indigo-500"
  }

  // Highlight the best value in a comparison row
  const getBestValueIndex = (field: keyof CollegeInfo, isLowerBetter = false) => {
    if (activeColleges.length < 2) return -1

    let targetIndex = -1
    let optimalValue = isLowerBetter ? Infinity : -Infinity

    activeColleges.forEach((c, idx) => {
      const val = c[field]
      if (val === null || val === undefined || typeof val !== "number") return

      if (isLowerBetter) {
        if (val < optimalValue) {
          optimalValue = val
          targetIndex = idx
        }
      } else {
        if (val > optimalValue) {
          optimalValue = val
          targetIndex = idx
        }
      }
    })

    return targetIndex
  }

  const bestAvgPkgIndex = getBestValueIndex("avgPackage")
  const bestPlacementRateIndex = getBestValueIndex("placementRate")
  const lowestCetFeeIndex = getBestValueIndex("feeCetQuota", true)

  // Map data for Recharts comparison
  const chartData = useMemo(() => {
    return activeColleges.map(c => {
      const displayName = c.shortName || c.code || c.name;
      const truncatedName = displayName.length > 15
        ? displayName.substring(0, 12) + "..."
        : displayName;
      return {
        name: truncatedName,
        avgPackage: c.avgPackage || 0,
        medianPackage: c.medianPackage || 0,
        placementRate: c.placementRate || 0,
        feeCet: c.feeCetQuota || 0,
        feeMgmt: c.feeManagement || 0
      };
    })
  }, [activeColleges])

  // Filter cutoffs for the selected colleges
  const comparedCutoffs = useMemo(() => {
    if (activeColleges.length === 0 || cutoffData.length === 0) return []
    const codes = activeColleges.map(c => c.code.toUpperCase())
    return cutoffData.filter(c =>
      codes.includes(c.institute_code.toUpperCase()) &&
      c.year === cutoffYear &&
      c.round === cutoffRound &&
      c.category.toUpperCase() === cutoffCategory.toUpperCase()
    )
  }, [activeColleges, cutoffData, cutoffYear, cutoffRound, cutoffCategory])

  // Helper to load cutoffs for a single college based EXACTLY on selected filters
  const getCollegeCutoffs = (collegeCode: string) => {
    const filtered = cutoffData.filter(c =>
      c.institute_code.toUpperCase() === collegeCode.toUpperCase() &&
      c.year === cutoffYear &&
      c.round === cutoffRound &&
      c.category.toUpperCase() === cutoffCategory.toUpperCase()
    )

    // Group cutoffs by course key and keep the best (lowest) rank in case of duplicates
    const courseMap = new Map<string, { courseName: string; rank: number }>()
    for (const entry of filtered) {
      const key = getCourseKey(entry.course)
      const existing = courseMap.get(key)
      if (!existing || entry.cutoff_rank < existing.rank) {
        courseMap.set(key, {
          courseName: cleanCourseName(entry.course),
          rank: entry.cutoff_rank
        })
      }
    }

    return Array.from(courseMap.values())
      .sort((a, b) => a.courseName.localeCompare(b.courseName))
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <SEO
        title="Side-by-Side College Compare"
        description="Compare KCET engineering colleges side-by-side. Analyze placements, packages, cutoffs, fees, and infrastructure metrics to make the best choice."
        url="https://kcetcoded.dev/college-compare"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Scale className="h-7 w-7 text-indigo-400" />
            Side-by-Side College Comparison
          </h1>
          <p className="text-muted-foreground">
            Contrast placements, fees, rankings, and credentials of up to 3 colleges to find the best match.
          </p>
        </div>

        {/* Clear All Button */}
        {activeColleges.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setSelectedColleges([])}
            className="border-white/10 hover:bg-white/5 text-xs h-9"
          >
            Clear Comparison
          </Button>
        )}
      </div>

      {/* Selector Area */}
      <div className="relative max-w-xl">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by college name, code, or abbreviation..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowDropdown(true)
              }}
              onFocus={() => setShowDropdown(true)}
              className="bg-slate-950/40 border-white/10 text-sm h-11 pr-10 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && searchQuery && (
          <div className="absolute z-50 w-full mt-2 rounded-xl border border-white/10 bg-slate-900 shadow-xl max-h-80 overflow-y-auto divide-y divide-white/5">
            {filteredColleges.length > 0 ? (
              filteredColleges.map((college) => (
                <div
                  key={college.code}
                  onClick={() => handleAddCollege(college)}
                  className="flex items-center justify-between p-3.5 hover:bg-white/[0.03] cursor-pointer transition-colors text-sm"
                >
                  <div>
                    <div className="font-semibold text-white">{college.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Code: <span className="font-mono text-indigo-400 font-bold">{college.code}</span> • {college.city}, {college.district}
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs">
                    {college.tier}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No matching colleges found or limit reached.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Comparisons */}
      {activeColleges.length === 0 ? (
        <Card className="border-dashed border-white/10 bg-slate-950/20 py-16 text-center">
          <CardContent className="space-y-4 max-w-sm mx-auto">
            <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <Plus className="h-6 w-6 text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">Compare Colleges</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Add up to 3 colleges using the search bar above to compare cutoffs, placement rates, packages, and fees side-by-side.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeColleges.map((college, idx) => (
              <Card key={college.code} className="border-white/10 bg-slate-900/10 backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
                {/* Header highlight if best value */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

                <button
                  onClick={() => handleRemoveCollege(college.code)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-muted-foreground hover:text-white transition-all duration-200"
                  aria-label="Remove college"
                >
                  <X className="h-3.5 w-3.5" />
                </button>

                <CardHeader className="pt-8 pb-4">
                  <div className="space-y-2">
                    <Badge variant="outline" className="border-white/10 text-[10px] uppercase font-mono tracking-wider bg-white/5 text-slate-400">
                      Code: {college.code}
                    </Badge>
                    <CardTitle className="text-lg font-bold line-clamp-2 text-white leading-snug">
                      {college.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      <span>{college.city}, {college.district}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 flex-1 text-sm border-t border-white/5 pt-6">
                  {/* General Stats Group */}
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                    <div>
                      <div className="text-[11px] text-muted-foreground uppercase font-semibold">Tier Rating</div>
                      <div className="font-bold text-white mt-0.5">{college.tier}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground uppercase font-semibold">Autonomous</div>
                      <div className="font-bold text-white mt-0.5">{college.autonomous ? "Yes" : "No"}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground uppercase font-semibold">Established</div>
                      <div className="font-bold text-white mt-0.5">{college.established || "N/A"}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground uppercase font-semibold">NIRF Rank</div>
                      <div className="font-bold text-white mt-0.5">{college.nirfRank || "N/A"}</div>
                    </div>
                  </div>

                  {/* Placement Stats Group */}
                  <div className="space-y-3 pb-4 border-b border-white/5">
                    <div className="font-semibold text-white text-xs tracking-wider flex items-center gap-1.5 uppercase text-slate-400">
                      <Briefcase className="h-4 w-4 text-emerald-400" /> Placement stats
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Average Package:</span>
                        <span className={`font-bold font-mono ${bestAvgPkgIndex === idx ? "text-emerald-400" : "text-white"}`}>
                          {college.avgPackage ? `₹${college.avgPackage} LPA` : "Data Pending"}
                          {bestAvgPkgIndex === idx && " (Best)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Median Package:</span>
                        <span className="font-bold font-mono text-white">
                          {college.medianPackage ? `₹${college.medianPackage} LPA` : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Placement Rate:</span>
                        <span className={`font-bold font-mono ${bestPlacementRateIndex === idx ? "text-emerald-400" : "text-white"}`}>
                          {college.placementRate ? `${college.placementRate}%` : "N/A"}
                        </span>
                      </div>
                      {college.placementRate && (
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-full ${getRateColor(college.placementRate)}`} style={{ width: `${college.placementRate}%` }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fees Group */}
                  <div className="space-y-3 pb-4 border-b border-white/5">
                    <div className="font-semibold text-white text-xs tracking-wider flex items-center gap-1.5 uppercase text-slate-400">
                      <GraduationCap className="h-4 w-4 text-indigo-400" /> Fees Structure
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">CET Quota (Annual):</span>
                        <span className={`font-bold font-mono ${lowestCetFeeIndex === idx ? "text-emerald-400" : "text-white"}`}>
                          {college.feeCetQuota ? `₹${college.feeCetQuota} Lakh` : "N/A"}
                          {lowestCetFeeIndex === idx && " (Lowest)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Management Quota:</span>
                        <span className="font-bold font-mono text-white">
                          {college.feeManagement ? `₹${college.feeManagement} Lakh` : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recruiters & Facilities */}
                  <div className="space-y-3.5">
                    <div>
                      <div className="text-[11px] text-muted-foreground uppercase font-semibold mb-1">Top Recruiters</div>
                      <div className="flex flex-wrap gap-1">
                        {college.topRecruiters && college.topRecruiters.length > 0 ? (
                          college.topRecruiters.map(r => (
                            <Badge key={r} variant="outline" className="border-white/5 bg-white/[0.01] text-[10px] text-slate-300 py-0 px-1.5 font-medium">
                              {r}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Data pending</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground uppercase font-semibold mb-1">Facilities</div>
                      <div className="flex flex-wrap gap-1">
                        {college.facilities && college.facilities.length > 0 ? (
                          college.facilities.slice(0, 5).map(f => (
                            <Badge key={f} variant="outline" className="border-white/5 bg-indigo-500/5 text-indigo-300 text-[10px] py-0 px-1.5 font-medium">
                              {f}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Standard infrastructure</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Empty Slots */}
            {activeColleges.length < 3 && Array.from({ length: 3 - activeColleges.length }).map((_, i) => (
              <Card key={`empty-${i}`} className="border-dashed border-white/10 bg-slate-950/5 flex flex-col items-center justify-center py-20 text-center min-h-[300px]">
                <CardContent className="space-y-2">
                  <div className="mx-auto w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Plus className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-xs text-muted-foreground">Add college to compare slot</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Visual Comparison Charts */}
          {activeColleges.length >= 2 && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Percent className="h-5 w-5 text-indigo-400" />
                  Visual Analytics Comparison
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Visual head-to-head comparison of salaries, placements, and fees.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Salary packages chart */}
                <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-indigo-400" />
                      Salary Packages (LPA)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64 pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: "#020617", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
                        />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="avgPackage" name="Average" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="medianPackage" name="Median" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Placement Rate chart */}
                <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Percent className="h-4 w-4 text-emerald-400" />
                      Placement Rate (%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64 pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: "#020617", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
                        />
                        <Bar dataKey="placementRate" name="Placement %" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Fees chart */}
                <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-indigo-400" />
                      Annual Tuition Fees (Lakhs)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-64 pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: "#020617", borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}
                        />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Bar dataKey="feeCet" name="CET Quota" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="feeMgmt" name="Management" fill="#ec4899" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Detailed Cutoff Comparison Table */}
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-400" />
                  Branch Cutoff Comparison Matrix
                </h2>
                <p className="text-xs text-muted-foreground">
                  Compare exact historical cutoffs for all matching branches.
                </p>
              </div>

              {/* Filters for cutoff matrix */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Year Select */}
                <div className="w-24">
                  <Select value={cutoffYear} onValueChange={setCutoffYear}>
                    <SelectTrigger className="bg-slate-950/40 border-white/10 h-8.5 text-xs">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2026" className="text-xs">2026</SelectItem>
                      <SelectItem value="2025" className="text-xs">2025</SelectItem>
                      <SelectItem value="2024" className="text-xs">2024</SelectItem>
                      <SelectItem value="2023" className="text-xs">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Round Select */}
                <div className="w-28">
                  <Select value={cutoffRound} onValueChange={setCutoffRound}>
                    <SelectTrigger className="bg-slate-950/40 border-white/10 h-8.5 text-xs">
                      <SelectValue placeholder="Round" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="R1" className="text-xs">Round 1</SelectItem>
                      <SelectItem value="R2" className="text-xs">Round 2</SelectItem>
                      <SelectItem value="R3" className="text-xs">Round 3</SelectItem>
                      <SelectItem value="MOCK" className="text-xs">Mock Round</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Select */}
                <div className="w-32 sm:w-44">
                  <Select value={cutoffCategory} onValueChange={setCutoffCategory}>
                    <SelectTrigger className="bg-slate-950/40 border-white/10 h-8.5 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto bg-slate-950 border-white/10">
                      {[
                        { code: "GM", label: "GM - General Merit" },
                        { code: "GMK", label: "GMK - General (Kannada)" },
                        { code: "GMR", label: "GMR - General (Rural)" },
                        { code: "1G", label: "1G - Category 1 (General)" },
                        { code: "1K", label: "1K - Category 1 (Kannada)" },
                        { code: "1R", label: "1R - Category 1 (Rural)" },
                        { code: "2AG", label: "2AG - Category 2A (General)" },
                        { code: "2AK", label: "2AK - Category 2A (Kannada)" },
                        { code: "2AR", label: "2AR - Category 2A (Rural)" },
                        { code: "2BG", label: "2BG - Category 2B (General)" },
                        { code: "2BK", label: "2BK - Category 2B (Kannada)" },
                        { code: "2BR", label: "2BR - Category 2B (Rural)" },
                        { code: "3AG", label: "3AG - Category 3A (General)" },
                        { code: "3AK", label: "3AK - Category 3A (Kannada)" },
                        { code: "3AR", label: "3AR - Category 3A (Rural)" },
                        { code: "3BG", label: "3BG - Category 3B (General)" },
                        { code: "3BK", label: "3BK - Category 3B (Kannada)" },
                        { code: "3BR", label: "3BR - Category 3B (Rural)" },
                        { code: "SCG", label: "SCG - Scheduled Caste (General)" },
                        { code: "SCK", label: "SCK - Scheduled Caste (Kannada)" },
                        { code: "SCR", label: "SCR - Scheduled Caste (Rural)" },
                        { code: "STG", label: "STG - Scheduled Tribe (General)" },
                        { code: "STK", label: "STK - Scheduled Tribe (Kannada)" },
                        { code: "STR", label: "STR - Scheduled Tribe (Rural)" },
                      ].map((cat) => (
                        <SelectItem key={cat.code} value={cat.code} className="text-xs">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {cutoffsLoading ? (
              <Card className="border-white/5 bg-slate-950/20 py-16 text-center">
                <CardContent className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                  <p className="text-sm text-muted-foreground">Loading cutoff data...</p>
                </CardContent>
              </Card>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-${activeColleges.length} gap-6`}>
                {activeColleges.map(col => {
                  const collegeCutoffs = getCollegeCutoffs(col.code)
                  return (
                    <Card key={col.code} className="border-white/10 bg-slate-950/40 backdrop-blur-md overflow-hidden flex flex-col">
                      <CardHeader className="bg-white/[0.02] border-b border-white/5 py-3 px-4">
                        <CardTitle className="text-sm font-bold flex items-center justify-between text-white">
                          <span className="truncate">{col.shortName || col.name}</span>
                          <span className="font-mono text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                            {col.code}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 flex-1 flex flex-col justify-start">
                        {collegeCutoffs.length === 0 ? (
                          <div className="p-8 text-center text-xs text-muted-foreground my-auto space-y-1">
                            <AlertCircle className="h-5 w-5 mx-auto opacity-30 text-indigo-400 animate-pulse" />
                            <p className="font-semibold text-slate-300">No matching data</p>
                            <p className="text-[10px]">No entries matching chosen filters.</p>
                          </div>
                        ) : (
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-wider text-slate-400">
                                <th className="p-3 font-semibold">Course Name</th>
                                <th className="p-3 font-semibold text-right w-24">Cutoff</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                              {collegeCutoffs.map((item, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                                  <td className="p-3 font-medium text-slate-300">{item.courseName}</td>
                                  <td className="p-3 text-right font-mono font-bold text-emerald-400">
                                    {item.rank.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CollegeCompare
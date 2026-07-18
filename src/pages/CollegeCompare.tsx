import { useState } from "react"
import { SEO } from "@/components/SEO"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Scale, Plus, X, Award, Shield, Check, AlertCircle, 
  MapPin, Landmark, Calendar, LandmarkIcon, Percent, 
  IndianRupee, Briefcase, GraduationCap 
} from "lucide-react"
import { COLLEGE_DATABASE, CollegeInfo } from "@/data/collegeDatabase"
import { toast } from "sonner"

const CollegeCompare = () => {
  const [selectedColleges, setSelectedColleges] = useState<CollegeInfo[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  // Filter colleges based on search query, excluding already selected ones
  const filteredColleges = COLLEGE_DATABASE.filter(college => {
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
    if (selectedColleges.length < 2) return -1
    
    let targetIndex = -1
    let optimalValue = isLowerBetter ? Infinity : -Infinity

    selectedColleges.forEach((c, idx) => {
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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <SEO
        title="Side-by-Side College Compare"
        description="Compare KCET engineering colleges side-by-side. Analyze placements, packages, cutoffs, fees, and infrastructure metrics to make the best choice."
        url="https://kcet-coded2.vercel.app/college-compare"
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
        {selectedColleges.length > 0 && (
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
      {selectedColleges.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Comparison Cards */}
          <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {selectedColleges.map((college, idx) => (
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
            {selectedColleges.length < 3 && Array.from({ length: 3 - selectedColleges.length }).map((_, i) => (
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
        </div>
      )}
    </div>
  )
}

export default CollegeCompare
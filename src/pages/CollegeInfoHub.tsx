import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search, Building2, MapPin, Star, TrendingUp, GraduationCap,
  Filter, ChevronDown, ChevronUp, ExternalLink, Award, Shield,
  IndianRupee, Briefcase, ArrowUpRight, Sparkles, X, Users, BookOpen
} from "lucide-react"
import {
  COLLEGE_DATABASE, CollegeInfo,
  TIER_COLORS, TYPE_COLORS
} from "@/data/collegeDatabase"
import { computeROI, getArcPath, getROIGradientColor, ROIResult } from "@/lib/collegeRoi"
import { CollegeLogo } from "@/components/college/CollegeLogo"
import { supabase } from "@/integrations/supabase/client"
import { mergeSingleCollege } from "@/lib/college-service"

// ─── ROI Meter Component ────────────────────────────
const ROIMeter = ({ roi, size = 72 }: { roi: ROIResult | null; size?: number }) => {
  if (!roi) return (
    <div
      className="flex items-center justify-center rounded-full bg-white/5 border border-white/10"
      style={{ width: size, height: size }}
    >
      <span className="text-[10px] text-muted-foreground">N/A</span>
    </div>
  )

  const radius = (size - 12) / 2
  const cx = size / 2
  const cy = size / 2
  const { start, end } = getROIGradientColor(roi.score)
  const gradientId = `roi-grad-${roi.score}-${Math.random().toString(36).slice(2, 6)}`

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={start} />
            <stop offset="100%" stopColor={end} />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d={getArcPath(100, radius, cx, cy)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={getArcPath(roi.score, radius, cx, cy)}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
          strokeLinecap="round"
          style={{ transition: 'all 1s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-black tabular-nums ${roi.color}`}>{roi.score}</span>
        <span className="text-[7px] text-muted-foreground uppercase tracking-wider font-semibold">ROI</span>
      </div>
    </div>
  )
}

// ─── College Card ────────────────────────────────────
const CollegeCard = ({ college, roi }: {
  college: CollegeInfo; roi: ROIResult | null
}) => {
  return (
    <Link to={`/college/${college.code}`} className="block group">
      <div className="relative overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 h-full hover:-translate-y-0.5">
        {/* Subtle glow on hover */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/[0.02] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="p-5 space-y-4">
          {/* ─ Header Row: Avatar + Name + ROI */}
          <div className="flex items-start gap-3">
            {/* Avatar / Logo */}
            <CollegeLogo
              code={college.code}
              name={college.name}
              website={college.website}
              tier={college.tier}
              logoUrl={college.logoUrl}
              sizeClassName="w-12 h-12"
              textClassName="text-[10px]"
            />

            {/* Name + Location */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm leading-tight text-foreground group-hover:text-white transition-colors line-clamp-2">
                {college.shortName}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="text-[11px] text-muted-foreground truncate">{college.city}, {college.district}</span>
              </div>
            </div>

            {/* ROI Meter */}
            <ROIMeter roi={roi} size={64} />
          </div>

          {/* ─ Tags Row */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${TIER_COLORS[college.tier]}`}>
              {college.tier}
            </Badge>
            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 ${TYPE_COLORS[college.type]}`}>
              {college.type}
            </Badge>
            {college.naacGrade && (
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-amber-500/10 text-amber-400 border-amber-500/20">
                NAAC {college.naacGrade}
              </Badge>
            )}
            {college.autonomous && (
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                Autonomous
              </Badge>
            )}
            <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-white/5 text-muted-foreground border-white/10 font-mono">
              {college.code}
            </Badge>
          </div>

          {/* ─ Stats Grid */}
          <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-white/5">
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Avg Pkg</p>
              <p className="text-base font-black text-emerald-400 tabular-nums">
                {college.avgPackage != null ? `${college.avgPackage}` : '—'}
                {college.avgPackage != null && <span className="text-[10px] font-normal text-muted-foreground"> LPA</span>}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Max Pkg</p>
              <p className="text-base font-black text-white tabular-nums">
                {college.maxPackage != null ? `${college.maxPackage}` : '—'}
                {college.maxPackage != null && <span className="text-[10px] font-normal text-muted-foreground"> LPA</span>}
              </p>
            </div>
            <div>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Fees</p>
              <p className="text-base font-black text-blue-400 tabular-nums">
                {college.feeCetQuota != null ? `₹${college.feeCetQuota}L` : '—'}
              </p>
            </div>
          </div>

          {/* ─ Bottom: Placement % + CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              {college.placementRate != null && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-emerald-400" />
                  {college.placementRate}% placed
                </span>
              )}
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-white/50 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Unique Districts for filter ─────────────────────
const ALL_DISTRICTS = [...new Set(COLLEGE_DATABASE.map(c => c.district))].sort()

// ─── Sort options ────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'roi', label: 'ROI Score' },
  { value: 'avgPackage', label: 'Avg Package' },
  { value: 'maxPackage', label: 'Max Package' },
  { value: 'feeLow', label: 'Fees (Low → High)' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'code', label: 'Code' },
  { value: 'placementRate', label: 'Placement %' },
]

// ─── Main Page ───────────────────────────────────────
const CollegeInfoHub = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("ALL")
  const [selectedType, setSelectedType] = useState("ALL")
  const [selectedTier, setSelectedTier] = useState("ALL")
  const [selectedNaac, setSelectedNaac] = useState("ALL")
  const [sortBy, setSortBy] = useState("roi")
  const [showFilters, setShowFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(24)
  const [overrides, setOverrides] = useState<Record<string, any>>({})

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
        console.error('Error fetching college overrides:', err)
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

  // Precompute ROI for all colleges in the database
  const roiMap = useMemo(() => {
    const map = new Map<string, ROIResult | null>()
    mergedColleges.forEach(c => {
      map.set(c.code, computeROI(c))
    })
    return map
  }, [mergedColleges])

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...mergedColleges]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(c =>
        c.shortName.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.district.toLowerCase().includes(q)
      )
    }

    if (selectedDistrict !== "ALL") list = list.filter(c => c.district === selectedDistrict)
    if (selectedType !== "ALL") list = list.filter(c => c.type === selectedType)
    if (selectedTier !== "ALL") list = list.filter(c => c.tier === selectedTier)
    if (selectedNaac !== "ALL") {
      if (selectedNaac === "NONE") list = list.filter(c => !c.naacGrade)
      else list = list.filter(c => c.naacGrade === selectedNaac)
    }

    list.sort((a, b) => {
      switch (sortBy) {
        case 'roi': {
          const ra = roiMap.get(a.code)?.score ?? -1
          const rb = roiMap.get(b.code)?.score ?? -1
          return rb - ra
        }
        case 'avgPackage':
          return (b.avgPackage ?? -1) - (a.avgPackage ?? -1)
        case 'maxPackage':
          return (b.maxPackage ?? -1) - (a.maxPackage ?? -1)
        case 'feeLow':
          return (a.feeCetQuota ?? 999) - (b.feeCetQuota ?? 999)
        case 'placementRate':
          return (b.placementRate ?? -1) - (a.placementRate ?? -1)
        case 'name':
          return a.shortName.localeCompare(b.shortName)
        case 'code':
          return a.code.localeCompare(b.code, undefined, { numeric: true })
        default:
          return 0
      }
    })

    return list
  }, [mergedColleges, searchQuery, selectedDistrict, selectedType, selectedTier, selectedNaac, sortBy, roiMap])

  const visibleColleges = filtered.slice(0, visibleCount)

  const resetFilters = useCallback(() => {
    setSelectedDistrict("ALL")
    setSelectedType("ALL")
    setSelectedTier("ALL")
    setSelectedNaac("ALL")
    setSortBy("roi")
    setSearchQuery("")
  }, [])

  const hasActiveFilters = selectedDistrict !== "ALL" || selectedType !== "ALL" || selectedTier !== "ALL" || selectedNaac !== "ALL"

  const stats = useMemo(() => ({
    total: mergedColleges.length,
    withData: mergedColleges.length,
    govt: mergedColleges.filter(c => c.type === 'Government').length,
    tier1: mergedColleges.filter(c => c.tier === 'Tier 1').length,
  }), [mergedColleges])

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="All KCET Engineering Colleges – Info, Placements, ROI & Reviews"
        description="Complete directory of all 232+ KCET engineering colleges in Karnataka. Compare placements, fees, NAAC grades, ROI scores, cutoff ranks, and student reviews for every college."
        url="https://kcet-coded2.vercel.app/colleges"
        keywords="KCET colleges, Karnataka engineering colleges, KCET college list, college placements, ROI, NAAC grade, KCET fees, college reviews"
      />

      {/* ═══ Hero Header ═══ */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -ml-48 -mb-48" />

        <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="px-3 py-1 rounded-full border-indigo-500/30 text-indigo-400 bg-indigo-500/10 text-xs uppercase tracking-widest font-semibold">
                <Sparkles className="h-3 w-3 mr-1" />
                2025-26 Data
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-white to-indigo-200 bg-clip-text text-transparent">
              College Info Hub
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Every KCET engineering college in Karnataka — placements, fees, ROI scores, NAAC grades, reviews & more.
            </p>

            {/* Stats Pills */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 text-xs">
                <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                <span className="font-semibold">{stats.total}</span>
                <span className="text-muted-foreground">Colleges</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 text-xs">
                <Award className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold">{stats.tier1}</span>
                <span className="text-muted-foreground">Tier 1</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 text-xs">
                <Shield className="h-3.5 w-3.5 text-green-400" />
                <span className="font-semibold">{stats.govt}</span>
                <span className="text-muted-foreground">Government</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 rounded-full px-3 py-1.5 text-xs">
                <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-semibold">{stats.withData}</span>
                <span className="text-muted-foreground">With Data</span>
              </div>
            </div>

            {/* Data source badges */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground/50">
              <span>Sources:</span>
              {['KEA', 'NAAC', 'NIRF', 'Shiksha', 'Careers360'].map(s => (
                <span key={s} className="bg-white/5 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Sticky Search + Filter Bar ═══ */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, code, city, district..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setVisibleCount(24) }}
                className="pl-10 bg-white/5 border-white/10 h-10"
                id="college-search"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-white/10 rounded"
                >
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="w-full sm:w-44">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/5 border-white/10 h-10 text-xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-10 px-3 border-white/10 text-xs ${hasActiveFilters ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : ''}`}
            >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1.5 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] flex items-center justify-center font-bold">
                  {[selectedDistrict, selectedType, selectedTier, selectedNaac].filter(v => v !== "ALL").length}
                </span>
              )}
              {showFilters ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />}
            </Button>
          </div>

          {/* ─ Expanded Filters ─ */}
          {showFilters && (
            <div className="flex flex-wrap items-end gap-3 pt-3 border-t border-white/5 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="w-40">
                <label className="text-[9px] text-muted-foreground mb-1 block uppercase tracking-wider font-bold">District</label>
                <Select value={selectedDistrict} onValueChange={v => { setSelectedDistrict(v); setVisibleCount(24) }}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent className="max-h-64">
                    <SelectItem value="ALL" className="text-xs">All Districts</SelectItem>
                    {ALL_DISTRICTS.map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-36">
                <label className="text-[9px] text-muted-foreground mb-1 block uppercase tracking-wider font-bold">Type</label>
                <Select value={selectedType} onValueChange={v => { setSelectedType(v); setVisibleCount(24) }}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Types</SelectItem>
                    <SelectItem value="Government" className="text-xs">Government</SelectItem>
                    <SelectItem value="Private Aided" className="text-xs">Private Aided</SelectItem>
                    <SelectItem value="Private" className="text-xs">Private</SelectItem>
                    <SelectItem value="University" className="text-xs">University</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-28">
                <label className="text-[9px] text-muted-foreground mb-1 block uppercase tracking-wider font-bold">Tier</label>
                <Select value={selectedTier} onValueChange={v => { setSelectedTier(v); setVisibleCount(24) }}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Tiers</SelectItem>
                    <SelectItem value="Tier 1" className="text-xs">Tier 1</SelectItem>
                    <SelectItem value="Tier 2" className="text-xs">Tier 2</SelectItem>
                    <SelectItem value="Tier 3" className="text-xs">Tier 3</SelectItem>
                    <SelectItem value="Tier 4" className="text-xs">Tier 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-28">
                <label className="text-[9px] text-muted-foreground mb-1 block uppercase tracking-wider font-bold">NAAC</label>
                <Select value={selectedNaac} onValueChange={v => { setSelectedNaac(v); setVisibleCount(24) }}>
                  <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All</SelectItem>
                    <SelectItem value="A++" className="text-xs">A++</SelectItem>
                    <SelectItem value="A+" className="text-xs">A+</SelectItem>
                    <SelectItem value="A" className="text-xs">A</SelectItem>
                    <SelectItem value="B+" className="text-xs">B+</SelectItem>
                    <SelectItem value="B" className="text-xs">B</SelectItem>
                    <SelectItem value="NONE" className="text-xs">Not Accredited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={resetFilters} className="h-9 text-xs text-muted-foreground hover:text-white">
                  <X className="h-3 w-3 mr-1" />Clear All
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══ Results Count ═══ */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{Math.min(visibleCount, filtered.length)}</span> of{' '}
            <span className="font-semibold text-foreground">{filtered.length}</span> colleges
            {searchQuery && <span> matching "<span className="text-indigo-400">{searchQuery}</span>"</span>}
          </p>
        </div>
      </div>

      {/* ═══ College Grid ═══ */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground/20" />
            <h3 className="font-semibold text-lg">No colleges found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={resetFilters} className="mt-2">
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {visibleColleges.map((college) => (
                <CollegeCard
                  key={college.code}
                  college={college}
                  roi={roiMap.get(college.code) ?? null}
                />
              ))}
            </div>

            {/* Load More */}
            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="h-11 px-8 rounded-xl border-white/10 hover:bg-white/5 text-sm font-semibold"
                >
                  Load More ({filtered.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CollegeInfoHub

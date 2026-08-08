import { SEO } from "@/components/SEO"
import AdUnit from "@/components/AdUnit"
import { useState, useEffect, useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft, Building2, MapPin, GraduationCap, ExternalLink,
  Award, Shield, Briefcase, TrendingUp, IndianRupee, Users, BookOpen,
  Wifi, Coffee, Dumbbell, Home, BookMarked, PenLine, Star,
  Calendar, CheckCircle, Edit3, X, Loader2
} from "lucide-react"
import { normalizeCourseName, isValidCourseName } from "@/lib/course-normalization"
import { getCollegeInfo, TIER_COLORS, TYPE_COLORS } from "@/data/collegeDatabase"
import { computeROI, getArcPath, getROIGradientColor, ROIResult } from "@/lib/collegeRoi"
import { CollegeLogo } from "@/components/college/CollegeLogo"
import { supabase } from "@/integrations/supabase/client"
import { mergeSingleCollege } from "@/lib/college-service"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// ─── Types ──────────────────────────────────────────
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

// ─── Tab definitions ────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'placements', label: 'Placements', icon: Briefcase },
  { id: 'cutoffs', label: 'Cutoffs', icon: TrendingUp },
  { id: 'fees', label: 'Fees & ROI', icon: IndianRupee },
]

const CATEGORIES = [
  "1G", "1K", "1R", "2AG", "2AK", "2AR", "2BG", "2BK", "2BR",
  "3AG", "3AK", "3AR", "3BG", "3BK", "3BR",
  "GM", "GMK", "GMR", "SCG", "SCK", "SCR", "STG", "STK", "STR",
]

const normalizeRound = (round: string): string => {
  const r = round.toUpperCase().trim()
  if (r === "R3" || r === "ROUND 3" || r.includes("EXTENDED") || r.includes("SPECIAL") || r.includes("SPOT") || r === "EXT") return "R3"
  if (r === "R2" || r === "ROUND 2" || r.includes("ROUND 2")) return "R2"
  if (r === "MOCK" || r.includes("MOCK")) return "MOCK"
  if (r === "R1" || r.includes("ROUND 1")) return "R1"
  return round
}

const FACILITY_ICONS: Record<string, any> = {
  'Wi-Fi': Wifi, 'Cafeteria': Coffee, 'Gym': Dumbbell,
  'Hostel': Home, 'Library': BookMarked, 'Labs': BookOpen,
  'Sports Complex': GraduationCap, 'Sports Ground': GraduationCap,
  'Auditorium': Building2, 'Innovation Centre': Star,
  'Innovation Lab': Star, 'Incubation Centre': Star,
  'Research Centre': BookOpen,
}

// ─── ROI Gauge (larger version) ─────────────────────
const ROIGauge = ({ roi }: { roi: ROIResult | null }) => {
  if (!roi) return null
  const size = 140
  const radius = (size - 16) / 2
  const cx = size / 2
  const cy = size / 2
  const { start, end } = getROIGradientColor(roi.score)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="roi-detail-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={start} />
            <stop offset="100%" stopColor={end} />
          </linearGradient>
        </defs>
        <path d={getArcPath(100, radius, cx, cy)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" strokeLinecap="round" />
        <path d={getArcPath(roi.score, radius, cx, cy)} fill="none" stroke="url(#roi-detail-grad)" strokeWidth="8" strokeLinecap="round" style={{ transition: 'all 1s ease-out' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-black tabular-nums ${roi.color}`}>{roi.score}</span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">{roi.grade}</span>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────
const CollegeDetail = () => {
  const { collegeCode } = useParams<{ collegeCode: string }>()
  const [activeTab, setActiveTab] = useState('overview')
  const [allCutoffs, setAllCutoffs] = useState<CutoffData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("GM")
  const [collegeName, setCollegeName] = useState("")
  const [override, setOverride] = useState<any>(null)

  // Suggest Edits modal state
  const [showSuggestModal, setShowSuggestModal] = useState(false)
  const [isSubmittingSuggest, setIsSubmittingSuggest] = useState(false)
  const [suggestedAvgPackage, setSuggestedAvgPackage] = useState("")
  const [suggestedMedianPackage, setSuggestedMedianPackage] = useState("")
  const [suggestedPlacementRate, setSuggestedPlacementRate] = useState("")
  const [suggestedFeeCet, setSuggestedFeeCet] = useState("")
  const [suggestedFeeMgmt, setSuggestedFeeMgmt] = useState("")
  const [suggestedComments, setSuggestedComments] = useState("")

  // Pre-fill fields when modal opens
  const openSuggestModal = () => {
    if (info) {
      setSuggestedAvgPackage(info.avgPackage ? info.avgPackage.toString() : "")
      setSuggestedMedianPackage(info.medianPackage ? info.medianPackage.toString() : "")
      setSuggestedPlacementRate(info.placementRate ? info.placementRate.toString() : "")
      setSuggestedFeeCet(info.feeCetQuota ? info.feeCetQuota.toString() : "")
      setSuggestedFeeMgmt(info.feeManagement ? info.feeManagement.toString() : "")
    }
    setSuggestedComments("")
    setShowSuggestModal(true)
  }

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!collegeCode) return

    setIsSubmittingSuggest(true)
    try {
      const currentData = {
        avgPackage: info?.avgPackage || null,
        medianPackage: info?.medianPackage || null,
        placementRate: info?.placementRate || null,
        feeCetQuota: info?.feeCetQuota || null,
        feeManagement: info?.feeManagement || null,
      }

      const suggestedData = {
        avgPackage: suggestedAvgPackage.trim() ? parseFloat(suggestedAvgPackage) : null,
        medianPackage: suggestedMedianPackage.trim() ? parseFloat(suggestedMedianPackage) : null,
        placementRate: suggestedPlacementRate.trim() ? parseFloat(suggestedPlacementRate) : null,
        feeCetQuota: suggestedFeeCet.trim() ? parseFloat(suggestedFeeCet) : null,
        feeManagement: suggestedFeeMgmt.trim() ? parseFloat(suggestedFeeMgmt) : null,
        comments: suggestedComments.trim() || null,
      }

      const { error } = await supabase
        .from('college_suggestions')
        .insert({
          college_code: collegeCode.toUpperCase(),
          suggested_data: suggestedData,
          current_data: currentData,
          status: 'pending'
        })

      if (error) throw error

      toast.success("Suggestion Submitted! 👍", {
        description: "Thank you! Our moderators will review and update the information shortly."
      })
      setShowSuggestModal(false)
    } catch (err: any) {
      console.error("Error submitting suggestion:", err)
      toast.error("Submission Failed", {
        description: err.message || "An error occurred while submitting."
      })
    } finally {
      setIsSubmittingSuggest(false)
    }
  }

  // Fetch overrides on mount/code change
  useEffect(() => {
    const fetchOverride = async () => {
      if (!collegeCode) return
      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .eq('code', collegeCode.toUpperCase())
          .maybeSingle()
        if (data) {
          setOverride(data)
        }
      } catch (err) {
        console.error('Error fetching college override:', err)
      }
    }
    fetchOverride()
  }, [collegeCode])

  const info = useMemo(() => {
    const staticInfo = getCollegeInfo(collegeCode || "")
    if (!staticInfo) return null
    return override ? mergeSingleCollege(staticInfo, override) : staticInfo
  }, [collegeCode, override])

  const roi = useMemo(() => info ? computeROI(info) : null, [info])

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
        const cutoffs: CutoffData[] = Array.isArray(rawData)
          ? rawData
          : (rawData.cutoffs || rawData.data || [])

        const collegeCutoffs = cutoffs.filter(c =>
          c.institute_code?.toUpperCase() === collegeCode?.toUpperCase()
        )

        if (collegeCutoffs.length > 0 && !info) {
          setCollegeName(collegeCutoffs[0].institute || collegeCode || "")
        }

        setAllCutoffs(collegeCutoffs)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (collegeCode) loadData()
  }, [collegeCode, info])

  const branches = useMemo(() => {
    const branchSet = new Set<string>()
    allCutoffs.forEach(c => {
      if (c.course) {
        const normalized = normalizeCourseName(c.course)
        if (normalized && isValidCourseName(normalized)) branchSet.add(normalized)
      }
    })
    return [...branchSet].sort()
  }, [allCutoffs])

  const tableData = useMemo(() => {
    const filtered = allCutoffs.filter(c => c.category?.toUpperCase() === selectedCategory.toUpperCase())
    const courseGroups = new Map<string, CutoffData[]>()

    filtered.forEach(c => {
      const key = normalizeCourseName(c.course)
      if (!isValidCourseName(key)) return
      if (!courseGroups.has(key)) courseGroups.set(key, [])
      courseGroups.get(key)!.push(c)
    })

    const years = [...new Set(allCutoffs.map(c => c.year))].sort((a, b) => b.localeCompare(a))
    const sortedCourses = Array.from(courseGroups.keys()).sort()

    const rows = sortedCourses.map(courseName => {
      const groupRecords = courseGroups.get(courseName)!
      const yearData: Record<string, { R3?: number, R2?: number, R1?: number }> = {}

      years.forEach(year => {
        const yearRecords = groupRecords.filter(c => c.year === year)
        yearData[year] = { R3: undefined, R2: undefined, R1: undefined }
        yearRecords.forEach(record => {
          const roundKey = normalizeRound(record.round)
          if (roundKey === "R3") yearData[year].R3 = record.cutoff_rank
          if (roundKey === "R2") yearData[year].R2 = record.cutoff_rank
          if (roundKey === "R1") yearData[year].R1 = record.cutoff_rank
        })
      })

      return { course: courseName, yearData }
    })

    return { rows, years }
  }, [allCutoffs, selectedCategory])

  const displayName = info?.shortName || collegeName || collegeCode || ""
  const fullName = info?.name || collegeName || ""

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SEO title={`${displayName} – College Details`} description={`View detailed information about ${displayName}`} />
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto" />
          <p className="text-muted-foreground">Loading college data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background space-y-0">
      <SEO
        title={`${displayName} – Placements, Cutoffs, Fees & Reviews`}
        description={`Complete info for ${fullName} — KCET cutoff ranks, placement packages (avg/max LPA), fees, NAAC grade, ROI score, student reviews & more.`}
        url={`https://kcetcoded.dev/college/${collegeCode}`}
        keywords={`${displayName}, KCET college, cutoff ranks, placements, fees, NAAC, reviews`}
      />

      {/* ═══ College Header ═══ */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative max-w-6xl mx-auto px-4 py-6">
          <Link to="/colleges" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            All Colleges
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar / Logo with premium design & larger dimensions */}
            <div className="relative flex-shrink-0 group hover:scale-[1.03] transition-all duration-300">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500/30 to-purple-600/30 rounded-[22px] blur-md opacity-0 group-hover:opacity-100 transition duration-500" />
              {info ? (
                <CollegeLogo
                  code={info.code}
                  name={info.name}
                  website={info.website}
                  tier={info.tier}
                  logoUrl={info.logoUrl}
                  sizeClassName="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border border-white/10 shadow-xl bg-card/40 backdrop-blur-md"
                  textClassName="text-xl sm:text-3xl font-black"
                />
              ) : (
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-gray-500 to-slate-600 flex items-center justify-center shadow-xl border border-white/10">
                  <span className="text-white font-black text-xl sm:text-3xl tracking-wider">
                    {(collegeCode || "").slice(0, 4).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight text-white">{displayName}</h1>
              {fullName !== displayName && (
                <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{fullName}</p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-white/5 border-white/10 font-mono text-muted-foreground">{collegeCode}</Badge>
                {info && (
                  <>
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${TIER_COLORS[info.tier]}`}>{info.tier}</Badge>
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${TYPE_COLORS[info.type]}`}>{info.type}</Badge>
                    {info.naacGrade && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-400 border-amber-500/20">
                        NAAC {info.naacGrade}
                      </Badge>
                    )}
                    {info.autonomous && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                        Autonomous
                      </Badge>
                    )}
                    {!!info.nbaAccredited && info.nbaAccredited > 0 && (
                      <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 border-purple-500/20">
                        {info.nbaAccredited} NBA Accredited
                      </Badge>
                    )}
                  </>
                )}
              </div>

              {info && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-indigo-400/80" />{info.city}, {info.district}</span>
                  {info.established && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-emerald-400/80" />Est. {info.established}</span>}
                  {info.website && (
                    <a href={info.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                      <ExternalLink className="h-3.5 w-3.5" />Website
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 flex-shrink-0 self-center sm:self-start mt-4 sm:mt-0">
              <Link to={`/reviews/${collegeCode}`}>
                <Button variant="outline" size="sm" className="h-9 text-xs rounded-xl border-white/10 hover:bg-white/5 transition-all">
                  <PenLine className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />Reviews
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openSuggestModal}
                className="h-9 text-xs rounded-xl border-white/10 hover:bg-white/5 transition-all text-slate-300 hover:text-white"
              >
                <Edit3 className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />Suggest Edits
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Tab Navigation ═══ */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-2">
            {TABS.map(tab => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                    ${isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══ Tab Content ═══ */}
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {info && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Avg Package', value: info.avgPackage ? `${info.avgPackage} LPA` : 'N/A', color: 'text-emerald-400', icon: Briefcase },
                  { label: 'Max Package', value: info.maxPackage ? `${info.maxPackage} LPA` : 'N/A', color: 'text-white', icon: TrendingUp },
                  { label: 'CET Fees', value: info.feeCetQuota != null ? `₹${info.feeCetQuota}L/yr` : 'N/A', color: 'text-blue-400', icon: IndianRupee },
                  { label: 'Total Seats', value: info.totalIntake ? `${info.totalIntake}` : 'N/A', color: 'text-purple-400', icon: Users },
                ].map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</span>
                      </div>
                      <p className={`text-xl font-black tabular-nums ${stat.color}`}>{stat.value}</p>
                    </div>
                  )
                })}
              </div>
            )}

            {branches.length > 0 && (
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-400" />
                  Branches Offered ({branches.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {branches.map(b => (
                    <Badge key={b} variant="outline" className="text-[11px] px-2.5 py-1 bg-white/5 border-white/10">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {info && info.facilities.length > 0 && (
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Facilities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {info.facilities.map(f => {
                    const Icon = FACILITY_ICONS[f] || CheckCircle
                    return (
                      <div key={f} className="flex items-center gap-2 text-sm text-foreground/80 bg-white/[0.02] rounded-lg px-3 py-2">
                        <Icon className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                        <span className="text-xs">{f}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {info && info.topRecruiters.length > 0 && (
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-400" />
                  Top Recruiters
                </h3>
                <div className="flex flex-wrap gap-2">
                  {info.topRecruiters.map(r => (
                    <Badge key={r} variant="outline" className="text-[11px] px-2.5 py-1 bg-blue-500/5 border-blue-500/15 text-blue-300">
                      {r}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {!info && (
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-8 text-center space-y-2">
                <Building2 className="h-8 w-8 mx-auto text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Detailed info for this college is being collected.</p>
                <p className="text-xs text-muted-foreground/60">Cutoff data is still available in the Cutoffs tab.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── PLACEMENTS TAB ─── */}
        {activeTab === 'placements' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {info && (info.avgPackage || info.maxPackage) ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Lowest', value: info.minPackage, color: 'text-red-400' },
                    { label: 'Average', value: info.avgPackage, color: 'text-amber-400' },
                    { label: 'Median', value: info.medianPackage, color: 'text-blue-400' },
                    { label: 'Highest', value: info.maxPackage, color: 'text-emerald-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-center space-y-1">
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">{stat.label}</p>
                      <p className={`text-2xl font-black tabular-nums ${stat.color}`}>
                        {stat.value != null ? stat.value : '—'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">LPA</p>
                    </div>
                  ))}
                </div>

                {info.placementRate != null && (
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Placement Rate</h3>
                      <span className="text-lg font-black text-emerald-400">{info.placementRate}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                        style={{ width: `${info.placementRate}%` }}
                      />
                    </div>
                  </div>
                )}

                {info.topRecruiters.length > 0 && (
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Top Recruiters (2024-25)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {info.topRecruiters.map(r => (
                        <div key={r} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                          </div>
                          <span className="text-xs font-medium truncate">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                  <span>ℹ️</span>
                  <span>Placement data sourced from Shiksha, Careers360, and official college websites. Figures are for 2024-25 placement season.</span>
                </div>
              </>
            ) : (
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-12 text-center space-y-3">
                <Briefcase className="h-10 w-10 mx-auto text-muted-foreground/20" />
                <h3 className="font-semibold">Placement Data Pending</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  We're collecting verified placement data for this college. Check back soon or contribute data via reviews.
                </p>
                <Link to={`/reviews/${collegeCode}`}>
                  <Button variant="outline" className="mt-2 rounded-xl border-white/10 text-xs">
                    <PenLine className="h-3.5 w-3.5 mr-1.5" />Share Placement Info
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ─── CUTOFFS TAB ─── */}
        {activeTab === 'cutoffs' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">Category:</span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px] bg-white/5 border-white/10 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <AdUnit className="my-6" />

            <div className="bg-white/[0.03] rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-4 text-muted-foreground font-medium text-xs" rowSpan={2}>Course</th>
                      {tableData.years.map((year, idx) => (
                        <th key={year} colSpan={3} className={`text-center py-2 px-2 font-medium text-xs ${idx === 0 ? 'bg-indigo-500/10 text-indigo-400' : 'text-muted-foreground'}`}>
                          {selectedCategory} – {year}
                        </th>
                      ))}
                    </tr>
                    <tr className="border-b border-white/5">
                      {tableData.years.map((year, idx) => (
                        ['R3', 'R2', 'R1'].map(r => (
                          <th key={`${year}-${r}`} className={`text-center py-2 px-2 text-[10px] ${idx === 0 ? 'text-indigo-300' : 'text-muted-foreground/50'}`}>{r}</th>
                        ))
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.rows.length === 0 ? (
                      <tr>
                        <td colSpan={1 + tableData.years.length * 3} className="text-center py-12 text-muted-foreground text-sm">
                          No cutoff data found for {selectedCategory}
                        </td>
                      </tr>
                    ) : (
                      tableData.rows.map((row, rowIdx) => (
                        <tr key={row.course} className={`border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors ${rowIdx % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                          <td className="py-3 px-4">
                            <span className="text-xs font-medium text-indigo-300">{row.course}</span>
                          </td>
                          {tableData.years.map((year, idx) => {
                            const data = row.yearData[year] || {}
                            const isLatest = idx === 0
                            return (
                              ['R3', 'R2', 'R1'].map(roundKey => (
                                <td key={`${row.course}-${year}-${roundKey}`} className={`text-center py-3 px-2 font-mono text-xs ${isLatest && roundKey === 'R3' ? 'text-amber-400 font-semibold' :
                                    isLatest ? 'text-white' : 'text-muted-foreground/50'
                                  }`}>
                                  {(data as any)[roundKey]?.toLocaleString() || '–'}
                                </td>
                              ))
                            )
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground/60 px-1">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" />R3 – Round 3 / Extended</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-white" />R2 – Round 2</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-muted-foreground/50" />R1 – Round 1</span>
            </div>
          </div>
        )}

        {/* ─── FEES & ROI TAB ─── */}
        {activeTab === 'fees' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {info ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fee Structure</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-sm text-muted-foreground">CET Quota (Annual)</span>
                        <span className="text-lg font-black text-blue-400">
                          {info.feeCetQuota != null ? `₹${info.feeCetQuota}L` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-sm text-muted-foreground">Management Quota (Annual)</span>
                        <span className="text-lg font-black text-purple-400">
                          {info.feeManagement != null ? `₹${info.feeManagement}L` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground">4-Year Total (CET)</span>
                        <span className="text-lg font-black text-white">
                          {info.feeCetQuota != null ? `₹${(info.feeCetQuota * 4).toFixed(1)}L` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 flex flex-col items-center justify-center space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ROI Score</h3>
                    <ROIGauge roi={roi} />
                    {roi && (
                      <p className="text-[11px] text-muted-foreground text-center max-w-xs">
                        Based on avg package, placement rate, fees, NAAC grade & autonomy status
                      </p>
                    )}
                  </div>
                </div>

                {roi && (
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ROI Breakdown</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Package Quality', value: roi.breakdown.packageScore, weight: '35%', color: 'bg-emerald-400' },
                        { label: 'Placement Rate', value: roi.breakdown.placementScore, weight: '20%', color: 'bg-blue-400' },
                        { label: 'Fee Efficiency', value: roi.breakdown.feeScore, weight: '20%', color: 'bg-amber-400' },
                        { label: 'NAAC Grade', value: roi.breakdown.naacScore, weight: '15%', color: 'bg-purple-400' },
                        { label: 'Autonomy Bonus', value: roi.breakdown.autonomyScore, weight: '10%', color: 'bg-cyan-400' },
                      ].map(item => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{item.label} <span className="text-muted-foreground/40">({item.weight})</span></span>
                            <span className="font-semibold tabular-nums">{item.value}/100</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div className={`h-full rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {info.avgPackage && info.feeCetQuota && info.feeCetQuota > 0 && (
                  <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Fee-to-Package Ratio</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        For every ₹1 invested in fees, graduates earn ₹{((info.avgPackage * 100000) / (info.feeCetQuota * 400000)).toFixed(1)} in first year salary
                      </p>
                    </div>
                    <span className="text-3xl font-black text-emerald-400 tabular-nums">
                      {((info.avgPackage * 100000) / (info.feeCetQuota * 400000)).toFixed(1)}x
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/[0.03] border border-white/5 rounded-xl p-12 text-center space-y-3">
                <IndianRupee className="h-10 w-10 mx-auto text-muted-foreground/20" />
                <h3 className="font-semibold">Fee & ROI Data Pending</h3>
                <p className="text-sm text-muted-foreground">Detailed fee structure for this college is being collected.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {showSuggestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b0f19]/90 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative my-8"
            >
              {/* Header */}
              <div className="border-b border-white/5 bg-white/[0.02] px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Edit3 className="h-4.5 w-4.5 text-indigo-400" />
                    Suggest Info Update
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    For {displayName} ({collegeCode})
                  </p>
                </div>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowSuggestModal(false)}
                  className="h-8 w-8 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSuggestSubmit} className="p-6 space-y-4 font-sans text-xs">
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl text-slate-400 leading-normal text-[10px]">
                  💡 <strong>Public Suggestions:</strong> Anyone can suggest updates. To protect data integrity, updates are queued for admin review and won't replace live values immediately.
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Avg Package */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg Package (LPA)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 8.5"
                      value={suggestedAvgPackage} 
                      onChange={e => setSuggestedAvgPackage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Median Package */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Median Package (LPA)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="e.g. 7.2"
                      value={suggestedMedianPackage} 
                      onChange={e => setSuggestedMedianPackage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Placement Rate */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Placement (%)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      placeholder="e.g. 88.5"
                      value={suggestedPlacementRate} 
                      onChange={e => setSuggestedPlacementRate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* CET Fee */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CET Fee (₹)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 98000"
                      value={suggestedFeeCet} 
                      onChange={e => setSuggestedFeeCet(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Mgmt Fee */}
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mgmt Fee (₹)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 350000"
                      value={suggestedFeeMgmt} 
                      onChange={e => setSuggestedFeeMgmt(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Sources / Comments */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sources & Verification Link</label>
                  <textarea 
                    rows={3}
                    placeholder="Provide placement reports, brochures, or drive links to verify this edit..."
                    value={suggestedComments}
                    onChange={e => setSuggestedComments(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                  <Button 
                    type="button"
                    variant="ghost" 
                    onClick={() => setShowSuggestModal(false)}
                    className="h-10 text-xs border border-white/5 hover:bg-white/5 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmittingSuggest}
                    className="h-10 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 font-bold text-white shadow-lg shadow-emerald-500/10"
                  >
                    {isSubmittingSuggest ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                        Submitting...
                      </>
                    ) : "Submit Suggestion"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CollegeDetail

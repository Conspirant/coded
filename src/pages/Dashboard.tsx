import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  GraduationCap,
  BarChart3,
  Search,
  Target,
  Calculator,
  BookOpen,
  ExternalLink,
  Calendar,
  Bell,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Database,
  Flame,
  ShieldCheck,
  FileText,
  Sword,
  CheckCircle2,
  Bookmark,
  MapPin,
  Bot,
  Bus,
  Train,
  RefreshCw,
  Zap,
  Building2,
  Star,
  Trash2,
  Layers,
  ArrowUpRight
} from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { useExamMode } from "@/contexts/ExamModeContext"
import AdUnit from "@/components/AdUnit"
import { CommunityPollWidget } from "@/components/CommunityPollWidget"
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, Area, AreaChart, BarChart, Bar, Cell
} from "recharts"
import { predictKCETRankBothYears, getRankBand } from "@/lib/rank-predictor"
import { predictComedkRankFromMarks, type ComedkShift } from "@/lib/comedk-rank-predictor"
import { toast } from "sonner"

interface DataStats {
  totalRecords: number
  totalColleges: number
  totalBranches: number
  years: { [key: string]: number }
  categories: { [key: string]: number }
}

interface UserProfile {
  rank: number
  category: string
  preferredStream: string
}

// Key Karnataka engineering institutes for live college odds preview
const TOP_KCET_COLLEGES = [
  { code: "E001", name: "RV College of Engineering (RVCE)", location: "Bengaluru", cutoffs: { GM: 450, "2AG": 1100, SCG: 4800, STG: 6200 }, tier: 1, cseCutoff: 450, eceCutoff: 1250 },
  { code: "E003", name: "BMS College of Engineering (BMSCE)", location: "Bengaluru", cutoffs: { GM: 1200, "2AG": 2400, SCG: 8900, STG: 11000 }, tier: 1, cseCutoff: 1200, eceCutoff: 3100 },
  { code: "E005", name: "MS Ramaiah Institute of Technology (MSRIT)", location: "Bengaluru", cutoffs: { GM: 1600, "2AG": 3200, SCG: 10500, STG: 13500 }, tier: 1, cseCutoff: 1600, eceCutoff: 3800 },
  { code: "E006", name: "PES University (Ring Road Campus)", location: "Bengaluru", cutoffs: { GM: 1800, "2AG": 3600, SCG: 11500, STG: 14200 }, tier: 1, cseCutoff: 1800, eceCutoff: 4200 },
  { code: "E008", name: "University Visvesvaraya College of Engg (UVCE)", location: "Bengaluru", cutoffs: { GM: 2900, "2AG": 4800, SCG: 14000, STG: 16500 }, tier: 1, cseCutoff: 2900, eceCutoff: 6500 },
  { code: "E012", name: "Sri Jayachamarajendra College of Engg (SJCE)", location: "Mysuru", cutoffs: { GM: 3200, "2AG": 5500, SCG: 16000, STG: 18500 }, tier: 2, cseCutoff: 3200, eceCutoff: 7800 },
  { code: "E033", name: "Siddaganga Institute of Technology (SIT)", location: "Tumakuru", cutoffs: { GM: 6500, "2AG": 11000, SCG: 28000, STG: 34000 }, tier: 2, cseCutoff: 6500, eceCutoff: 14500 },
  { code: "E056", name: "Nitte Meenakshi Institute of Tech (NMIT)", location: "Bengaluru", cutoffs: { GM: 8200, "2AG": 13500, SCG: 35000, STG: 41000 }, tier: 2, cseCutoff: 8200, eceCutoff: 17800 },
  { code: "E036", name: "Dayananda Sagar College of Engg (DSCE)", location: "Bengaluru", cutoffs: { GM: 4800, "2AG": 8900, SCG: 24000, STG: 29000 }, tier: 2, cseCutoff: 4800, eceCutoff: 11200 },
  { code: "E041", name: "BMS Institute of Tech & Mgmt (BMSIT)", location: "Bengaluru", cutoffs: { GM: 7100, "2AG": 12400, SCG: 32000, STG: 38000 }, tier: 2, cseCutoff: 7100, eceCutoff: 15600 },
  { code: "E072", name: "CMR Institute of Technology (CMRIT)", location: "Bengaluru", cutoffs: { GM: 12500, "2AG": 19500, SCG: 48000, STG: 55000 }, tier: 3, cseCutoff: 12500, eceCutoff: 24500 },
  { code: "E083", name: "Sir M Visvesvaraya Institute of Tech (SIR MVIT)", location: "Bengaluru", cutoffs: { GM: 11000, "2AG": 18000, SCG: 44000, STG: 52000 }, tier: 3, cseCutoff: 11000, eceCutoff: 22000 },
  { code: "E103", name: "Global Academy of Technology (GAT)", location: "Bengaluru", cutoffs: { GM: 18500, "2AG": 28000, SCG: 62000, STG: 71000 }, tier: 3, cseCutoff: 18500, eceCutoff: 34000 },
  { code: "E115", name: "KLE Technological University", location: "Hubballi", cutoffs: { GM: 9500, "2AG": 15000, SCG: 39000, STG: 46000 }, tier: 2, cseCutoff: 9500, eceCutoff: 21000 }
]

const TREND_BRANCH_DATA = [
  { year: "2022", CSE: 1200, AIML: 1800, ECE: 4200, MECH: 18500 },
  { year: "2023", CSE: 1150, AIML: 1550, ECE: 4500, MECH: 21000 },
  { year: "2024", CSE: 1080, AIML: 1350, ECE: 4800, MECH: 24500 },
  { year: "2025", CSE: 1020, AIML: 1200, ECE: 5100, MECH: 28000 },
]

const BRANCH_POPULARITY = [
  { name: "CSE & Allied", count: 48200, color: "#6366f1" },
  { name: "AI & ML", count: 32400, color: "#a855f7" },
  { name: "Information Tech", count: 26800, color: "#ec4899" },
  { name: "Electronics & Comm", count: 41200, color: "#06b6d4" },
  { name: "Electrical Engg", count: 19500, color: "#10b981" },
  { name: "Mechanical Engg", count: 21400, color: "#f59e0b" },
]

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

const Dashboard = () => {
  const [stats, setStats] = useState<DataStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { examMode, setExamMode } = useExamMode()

  // User profile with memory optimization
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("kcet_user_profile")
      if (saved) return JSON.parse(saved)
      const savedResults = localStorage.getItem("kcetResults")
      if (savedResults) {
        const parsed = JSON.parse(savedResults)
        const last = parsed[parsed.length - 1]
        if (last && last.medium) {
          return { rank: last.medium, category: "GM", preferredStream: "CSE" }
        }
      }
    } catch {
      // fallback
    }
    return { rank: 12500, category: "GM", preferredStream: "CSE" }
  })

  // Quick Calculator State
  const [kcetMarksInput, setKcetMarksInput] = useState<string>("110")
  const [pucPctInput, setPucPctInput] = useState<string>("92")
  const [comedkMarksInput, setComedkMarksInput] = useState<string>("95")
  const [comedkShiftInput, setComedkShiftInput] = useState<ComedkShift>("10s1")
  const [calcResult, setCalcResult] = useState<any>(null)

  // Quick Cutoff Search State
  const [quickSearchQuery, setQuickSearchQuery] = useState("")

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("kcet_bookmarks")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    let isMounted = true
    const loadStats = async () => {
      try {
        const r = await fetch('/data/cutoffs-summary.json')
        if (r.ok && isMounted) {
          const raw = await r.json()
          setStats({
            totalRecords: raw.totals.records,
            totalColleges: raw.totals.colleges,
            totalBranches: raw.totals.branches,
            years: raw.years,
            categories: raw.categories
          })
        }
      } catch (e) {
        console.error("Error loading stats", e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadStats()
    return () => { isMounted = false }
  }, [])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem("kcet_user_profile", JSON.stringify(next))
      return next
    })
    toast.success("Profile updated", { duration: 1500 })
  }, [])

  const matchedColleges = useMemo(() => {
    const rank = profile.rank || 12500
    const cat = profile.category || "GM"

    return TOP_KCET_COLLEGES.map(c => {
      const isCSE = profile.preferredStream.toUpperCase().includes("CS")
      const effectiveCutoff = isCSE ? c.cseCutoff : c.eceCutoff

      let status: "Safe" | "Target" | "Dream" = "Safe"
      let safetyScore = 100

      if (rank <= effectiveCutoff * 0.85) {
        status = "Safe"
        safetyScore = Math.min(99, Math.round((1 - rank / (effectiveCutoff * 1.3)) * 100))
      } else if (rank <= effectiveCutoff * 1.15) {
        status = "Target"
        safetyScore = Math.round((1 - (rank - effectiveCutoff * 0.85) / (effectiveCutoff * 0.3)) * 40 + 50)
      } else {
        status = "Dream"
        safetyScore = Math.max(5, Math.round(45 - (rank - effectiveCutoff * 1.15) / effectiveCutoff * 30))
      }

      return { ...c, cutoffRank: effectiveCutoff, status, safetyScore }
    }).sort((a, b) => {
      const priority = { Target: 1, Safe: 2, Dream: 3 }
      return (priority[a.status] || 4) - (priority[b.status] || 4)
    })
  }, [profile])

  const safeCount = useMemo(() => matchedColleges.filter(m => m.status === "Safe").length, [matchedColleges])
  const targetCount = useMemo(() => matchedColleges.filter(m => m.status === "Target").length, [matchedColleges])
  const dreamCount = useMemo(() => matchedColleges.filter(m => m.status === "Dream").length, [matchedColleges])

  const handleQuickRankCalc = useCallback(() => {
    if (examMode === "KCET") {
      const cet = parseFloat(kcetMarksInput)
      const puc = parseFloat(pucPctInput)
      if (isNaN(cet) || isNaN(puc) || cet < 0 || cet > 180 || puc < 0 || puc > 100) {
        toast.error("Enter valid KCET (0-180) and Board % (0-100)")
        return
      }
      const res = predictKCETRankBothYears(cet, puc)
      setCalcResult(res)
    } else {
      const marks = parseFloat(comedkMarksInput)
      if (isNaN(marks) || marks < 0 || marks > 180) {
        toast.error("Enter valid COMEDK marks (0-180)")
        return
      }
      const res = predictComedkRankFromMarks(marks, comedkShiftInput)
      setCalcResult(res)
    }
  }, [examMode, kcetMarksInput, pucPctInput, comedkMarksInput, comedkShiftInput])

  const filteredQuickColleges = useMemo(() => {
    if (!quickSearchQuery.trim()) return TOP_KCET_COLLEGES.slice(0, 4)
    const q = quickSearchQuery.toLowerCase()
    return TOP_KCET_COLLEGES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    )
  }, [quickSearchQuery])

  const removeBookmark = useCallback((code: string) => {
    setBookmarks(prev => {
      const updated = prev.filter(b => b !== code)
      localStorage.setItem("kcet_bookmarks", JSON.stringify(updated))
      return updated
    })
  }, [])

  const actionCategories = useMemo(() => [
    {
      id: "predictors",
      title: "Predictors & Simulators",
      items: [
        { title: "Cutoff Predictor", desc: "Predict Round 1, Round 2 & Round 3 cutoff shifts", icon: Sparkles, href: "/cutoff-predictor", metric: "2026 Model" },
        { title: "College Predictor", desc: "Find colleges eligible for your rank", icon: Search, href: "/college-predictor", metric: "Popular" },
        { title: "Mock Seat Simulator", desc: "Simulate option entry allotment", icon: Target, href: "/mock-simulator", metric: "KEA Engine" },
        { title: "Rank Predictor", desc: "Predict KCET rank from marks", icon: Calculator, href: "/rank-predictor", metric: "Rank Model" },
        { title: "Round Tracker", desc: "Track R1, R2 & R3 cutoff shifts", icon: Bell, href: "/round-tracker", metric: "Live Rounds" },
        { title: "College Compare", desc: "Side-by-side college comparison", icon: Layers, href: "/college-compare", metric: "3-Way Stats" },
      ]
    },
    {
      id: "cutoffs",
      title: "Cutoffs & Analytics",
      items: [
        { title: "Cutoff Explorer", desc: "Filter GM, 2A, SC/ST cutoff ranks", icon: BarChart3, href: "/cutoff-explorer", metric: "Official KEA" },
        { title: "COMEDK Explorer", desc: "Browse GM, HKR, KKR cutoffs", icon: ShieldCheck, href: "/comedk-explorer", metric: "COMEDK UGET" },
        { title: "Cutoff Trends", desc: "Year-over-year rank line charts", icon: TrendingUp, href: "/cutoff-trends", metric: "2022-2025" },
        { title: "Fee Calculator", desc: "Government vs Management fee stats", icon: FileText, href: "/fee-calculator", metric: "Updated 2026" },
        { title: "Hidden Gems", desc: "High ROI colleges with low cutoffs", icon: Star, href: "/hidden-gems", metric: "Top Value" },
      ]
    },
    {
      id: "practice",
      title: "AI & Practice",
      items: [
        { title: "AI Counselor", desc: "Gemini-powered admission assistant", icon: Bot, href: "/ai-counselor", metric: "24/7 Smart AI" },
        { title: "Daily Challenge", desc: "5-question daily CET physics/chem/math quiz", icon: Flame, href: "/daily-challenge", metric: "Streak Active" },
        { title: "Cutoff Clash", desc: "Higher or Lower college cutoff game", icon: Sword, href: "/cutoff-clash", metric: "Fun Quiz" },
        { title: "PYQ Mock Tests", desc: "Previous year question timed tests", icon: BookOpen, href: "/pyq-test", metric: "Real Papers" },
        { title: "Document Assistant", desc: "Mock document verification checklist", icon: CheckCircle2, href: "/document-verification", metric: "KEA Ready" },
      ]
    },
    {
      id: "transit",
      title: "Transit & Guidance",
      items: [
        { title: "Metro Mapper", desc: "Namma Metro stations near campuses", icon: Train, href: "/metro-mapper", metric: "Purple/Green" },
        { title: "BMTC Route Finder", desc: "Bus routes to engineering colleges", icon: Bus, href: "/bmtc-mapper", metric: "Direct Routes" },
        { title: "Info Centre", desc: "KEA rules, document codes & guidelines", icon: Building2, href: "/info-centre", metric: "Policy" },
        { title: "CET News & Updates", desc: "Latest counseling notifications", icon: Bell, href: "/cet-news", metric: "Real-time" },
      ]
    }
  ], [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-6 w-6 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-foreground font-sans animate-scale-in">
      <SEO
        title={examMode === "COMEDK" ? "COMEDK Dashboard – KCET Coded" : "KCET 2026 Dashboard – KCET Coded"}
        description="Minimalist, high-performance counseling dashboard for KCET & COMEDK."
        url="https://kcetcoded.dev/dashboard"
      />

      {/* ═══════════════════════════════════════════════════
          1. HEADER & MODE SWITCHER (MINIMALIST)
         ═══════════════════════════════════════════════════ */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {examMode} Counseling Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {getGreeting()}, <span className="text-primary font-black">Student</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Everything you need for {examMode} 2026 option entry & college decisions.
          </p>
        </div>

        {/* Minimalist Pill Switcher */}
        <div className="flex items-center gap-2 shrink-0 bg-secondary/50 p-1 rounded-full border border-border/40">
          <button
            type="button"
            onClick={() => setExamMode("KCET")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              examMode === "KCET"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            KCET 2026
          </button>
          <button
            type="button"
            onClick={() => setExamMode("COMEDK")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              examMode === "COMEDK"
                ? "bg-amber-500 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            COMEDK
          </button>
        </div>
      </header>

      {/* MINIMAL STATS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border/40 bg-card/40 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Cutoff Records</p>
            <p className="text-lg font-extrabold font-mono text-foreground font-tabular">{(stats?.totalRecords || 197831).toLocaleString()}</p>
          </div>
          <Database className="h-4 w-4 text-muted-foreground/60" />
        </div>
        <div className="p-3.5 rounded-xl border border-border/40 bg-card/40 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Colleges</p>
            <p className="text-lg font-extrabold font-mono text-foreground font-tabular">{(stats?.totalColleges || 269).toLocaleString()}</p>
          </div>
          <GraduationCap className="h-4 w-4 text-muted-foreground/60" />
        </div>
        <div className="p-3.5 rounded-xl border border-border/40 bg-card/40 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Branches</p>
            <p className="text-lg font-extrabold font-mono text-foreground font-tabular">{(stats?.totalBranches || 496).toLocaleString()}</p>
          </div>
          <BookOpen className="h-4 w-4 text-muted-foreground/60" />
        </div>
        <div className="p-3.5 rounded-xl border border-border/40 bg-card/40 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Years Covered</p>
            <p className="text-lg font-extrabold font-mono text-foreground">2023 - 2026</p>
          </div>
          <Calendar className="h-4 w-4 text-muted-foreground/60" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          2. PERSONALIZATION HUB & ODDS PREVIEW
         ═══════════════════════════════════════════════════ */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="border-border/40 bg-card/60 lg:col-span-1 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Target Profile
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono border-border/40">
                Auto-Saved
              </Badge>
            </div>
            <CardDescription className="text-xs">Set your rank & category for custom college odds.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <Label className="font-semibold text-muted-foreground">Target Rank ({examMode})</Label>
                <span className="font-mono font-bold text-primary">#{profile.rank.toLocaleString()}</span>
              </div>
              <Input
                type="number"
                value={profile.rank}
                onChange={e => updateProfile({ rank: parseInt(e.target.value) || 1 })}
                className="font-mono bg-background/50 border-border/50 h-9 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Category</Label>
                <select
                  value={profile.category}
                  onChange={e => updateProfile({ category: e.target.value })}
                  className="w-full h-9 rounded-md border border-border/50 bg-background/50 px-2.5 text-xs font-semibold text-foreground focus:outline-none"
                >
                  {["GM", "2AG", "2BG", "3AG", "3BG", "SCG", "STG", "1G", "GMK", "GMR"].map(c => (
                    <option key={c} value={c} className="bg-background text-foreground">{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">Target Branch</Label>
                <select
                  value={profile.preferredStream}
                  onChange={e => updateProfile({ preferredStream: e.target.value })}
                  className="w-full h-9 rounded-md border border-border/50 bg-background/50 px-2.5 text-xs font-semibold text-foreground focus:outline-none"
                >
                  <option value="CSE" className="bg-background text-foreground">CSE & Allied</option>
                  <option value="ECE" className="bg-background text-foreground">ECE / EEE</option>
                  <option value="MECH" className="bg-background text-foreground">Mechanical</option>
                  <option value="ALL" className="bg-background text-foreground">All Branches</option>
                </select>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="p-3.5 rounded-xl border border-border/40 bg-secondary/30 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Rank Band:</span>
                <span className="font-semibold text-foreground">{getRankBand(profile.rank)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Top Colleges Eligible:</span>
                <span className="font-mono font-bold text-emerald-400">{safeCount + targetCount} Institutes</span>
              </div>
              <div className="space-y-1 pt-1 border-t border-border/40">
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Dream: {dreamCount}</span>
                  <span>Target: {targetCount}</span>
                  <span>Safe: {safeCount}</span>
                </div>
                <div className="h-1.5 rounded-full bg-border/40 flex overflow-hidden">
                  <div className="h-full bg-rose-500/80" style={{ width: `${(dreamCount / TOP_KCET_COLLEGES.length) * 100}%` }} />
                  <div className="h-full bg-amber-500/80" style={{ width: `${(targetCount / TOP_KCET_COLLEGES.length) * 100}%` }} />
                  <div className="h-full bg-emerald-500/80" style={{ width: `${(safeCount / TOP_KCET_COLLEGES.length) * 100}%` }} />
                </div>
              </div>
            </div>

            <Link to="/college-predictor" className="block pt-1">
              <Button size="sm" className="w-full text-xs font-semibold gap-1.5 cursor-pointer">
                <Search className="h-3.5 w-3.5" /> Full College Predictor <ArrowRight className="h-3.5 w-3.5 ml-auto" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Dynamic Matched Colleges Preview */}
        <Card className="border-border/40 bg-card/60 lg:col-span-2 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  College Admission Odds
                </CardTitle>
                <CardDescription className="text-xs">
                  Matching Karnataka institutes for Rank #{profile.rank.toLocaleString()} ({profile.category})
                </CardDescription>
              </div>
              <Link to="/college-predictor">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:bg-primary/10 gap-1 cursor-pointer">
                  View All <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-2.5">
            {matchedColleges.slice(0, 4).map((c) => (
              <div
                key={c.code}
                className="p-3.5 rounded-xl border border-border/40 bg-background/40 hover:border-primary/40 hover:bg-secondary/30 transition-all flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-primary font-bold">{c.code}</span>
                    <span className="text-[11px] text-muted-foreground">• {c.location}</span>
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">{c.name}</h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Cutoff: Rank #{c.cutoffRank.toLocaleString()}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      c.status === "Safe"
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        : c.status === "Target"
                        ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                        : "border-rose-500/30 text-rose-400 bg-rose-500/10"
                    }`}
                  >
                    {c.status} ({c.safetyScore}%)
                  </Badge>
                  <Link to={`/college/${c.code}`}>
                    <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs gap-1 border-border/40 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Details <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="px-4 py-2.5 border-t border-border/40 bg-secondary/20 flex items-center justify-between text-xs text-muted-foreground">
            <span>Showing top 4 matches</span>
            <Link to="/mock-simulator" className="text-primary hover:underline font-semibold flex items-center gap-1">
              Simulate in Option Entry Sheet <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════
          3. MINI-TOOLS TAB BAR (ULTRA SMOOTH)
         ═══════════════════════════════════════════════════ */}
      <Card className="border-border/40 bg-card/60 shadow-sm">
        <CardHeader className="pb-2 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              Quick Interactive Tools
            </CardTitle>
            <Badge variant="outline" className="text-[10px] font-mono border-border/40">
              Instant
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="rank-calc" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary/50 border border-border/40 p-1 mb-4">
              <TabsTrigger value="rank-calc" className="text-xs font-semibold cursor-pointer">Quick Rank Calc</TabsTrigger>
              <TabsTrigger value="cutoff-finder" className="text-xs font-semibold cursor-pointer">Cutoff Lookup</TabsTrigger>
              <TabsTrigger value="daily-streak" className="text-xs font-semibold cursor-pointer">Daily Quiz</TabsTrigger>
            </TabsList>

            {/* TAB 1: RANK CALCULATOR */}
            <TabsContent value="rank-calc" className="space-y-4 mt-0">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end">
                {examMode === "KCET" ? (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">KCET Marks (0-180)</Label>
                      <Input
                        type="number"
                        value={kcetMarksInput}
                        onChange={e => setKcetMarksInput(e.target.value)}
                        className="bg-background/50 border-border/50 h-9 font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">PUC Board %</Label>
                      <Input
                        type="number"
                        value={pucPctInput}
                        onChange={e => setPucPctInput(e.target.value)}
                        className="bg-background/50 border-border/50 h-9 font-mono text-xs"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">COMEDK Marks (0-180)</Label>
                      <Input
                        type="number"
                        value={comedkMarksInput}
                        onChange={e => setComedkMarksInput(e.target.value)}
                        className="bg-background/50 border-border/50 h-9 font-mono text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Exam Shift</Label>
                      <select
                        value={comedkShiftInput}
                        onChange={e => setComedkShiftInput(e.target.value as ComedkShift)}
                        className="w-full h-9 rounded-md border border-border/50 bg-background/50 px-2.5 text-xs text-foreground"
                      >
                        <option value="10s1">May 10 Shift 1</option>
                        <option value="10s2">May 10 Shift 2</option>
                        <option value="10s3">May 10 Shift 3</option>
                        <option value="25may">May 25 Shift</option>
                        <option value="unknown">Shift Average</option>
                      </select>
                    </div>
                  </>
                )}

                <Button size="sm" onClick={handleQuickRankCalc} className="h-9 text-xs font-semibold gap-1.5 cursor-pointer">
                  <Calculator className="h-3.5 w-3.5" /> Calculate Rank
                </Button>

                {calcResult && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateProfile({ rank: calcResult.rank2026 || calcResult.expectedRank })}
                    className="h-9 text-xs border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Use as Target Rank
                  </Button>
                )}
              </div>

              {calcResult && (
                <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 grid gap-3 sm:grid-cols-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">2025 Rank:</span>
                    <p className="font-mono font-bold text-foreground text-sm">#{(calcResult.rank2025 || calcResult.expectedRank).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-primary font-medium">2026 Predicted:</span>
                    <p className="font-mono font-extrabold text-primary text-sm">#{(calcResult.rank2026 || calcResult.expectedRank).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Band:</span>
                    <p className="font-semibold text-foreground">{calcResult.rankBand || getRankBand(calcResult.expectedRank)}</p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: CUTOFF FINDER */}
            <TabsContent value="cutoff-finder" className="space-y-3 mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={quickSearchQuery}
                  onChange={e => setQuickSearchQuery(e.target.value)}
                  placeholder="Type college code (e.g. E001) or name..."
                  className="pl-8 bg-background/50 border-border/50 h-9 text-xs"
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {filteredQuickColleges.map(c => (
                  <div key={c.code} className="p-2.5 rounded-lg border border-border/40 bg-background/40 hover:border-primary/40 hover:bg-secondary/30 transition-all flex items-center justify-between text-xs cursor-pointer">
                    <div className="truncate">
                      <span className="font-mono font-bold text-primary">{c.code}</span>
                      <span className="text-muted-foreground ml-2 truncate">{c.name}</span>
                    </div>
                    <span className="font-mono font-semibold text-foreground shrink-0 ml-2">GM #{c.cseCutoff.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* TAB 3: DAILY QUIZ */}
            <TabsContent value="daily-streak" className="space-y-3 mt-0">
              <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Flame className="h-6 w-6 text-orange-400 shrink-0" />
                  <div>
                    <h3 className="font-bold text-sm">Daily CET Challenge</h3>
                    <p className="text-xs text-muted-foreground">5 quick practice questions for Physics, Chemistry & Math.</p>
                  </div>
                </div>
                <Link to="/daily-challenge">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold gap-1 cursor-pointer">
                    <Flame className="h-3.5 w-3.5" /> Start Quiz
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════
          4. COMMUNITY POLL & ROADMAP
         ═══════════════════════════════════════════════════ */}
      <CommunityPollWidget />

      {/* Counseling Stage Pipeline */}
      {examMode === "KCET" ? (
        <Card className="border-border/40 bg-card/60 shadow-sm">
          <CardHeader className="pb-3 border-b border-border/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-400" />
                <CardTitle className="text-base font-bold">KCET 2026 Counseling Status</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                Option Entry Active
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Phase 1</span>
                <p className="font-semibold text-xs text-foreground mt-0.5">CET Exam ✓</p>
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Phase 2</span>
                <p className="font-semibold text-xs text-foreground mt-0.5">Rank Cards ✓</p>
              </div>
              <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Phase 3</span>
                <p className="font-semibold text-xs text-foreground mt-0.5">Docs Verified ✓</p>
              </div>
              <div className="p-3 rounded-lg border border-primary/30 bg-primary/10">
                <span className="text-[10px] text-primary font-bold uppercase">Phase 4 (Current)</span>
                <p className="font-semibold text-xs text-foreground mt-0.5">Option Entry ⏳</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/mock-simulator" className="flex-1">
                <Button size="sm" className="w-full text-xs font-semibold gap-1.5 cursor-pointer">
                  <Target className="h-3.5 w-3.5" /> Simulate Option Entry Sheet
                </Button>
              </Link>
              <Link to="/ai-counselor" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold gap-1.5 border-border/40 cursor-pointer">
                  <Bot className="h-3.5 w-3.5 text-primary" /> Ask AI Admission Assistant
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-500/30 bg-amber-500/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              COMEDK Mode Active
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            COMEDK private engineering colleges cutoff lookup and rank predictor are enabled.
          </CardContent>
        </Card>
      )}

      {/* ═══════════════════════════════════════════════════
          5. BOOKMARKED COLLEGES TRACKER
         ═══════════════════════════════════════════════════ */}
      <Card className="border-border/40 bg-card/60 shadow-sm">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold">Saved Bookmarks</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-border/40">
              {bookmarks.length} Saved
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {bookmarks.length === 0 ? (
            <div className="py-6 text-center space-y-2">
              <p className="text-xs text-muted-foreground">No bookmarked colleges yet.</p>
              <Link to="/college-predictor">
                <Button variant="outline" size="sm" className="text-xs h-8 border-border/40 gap-1 cursor-pointer">
                  <Search className="h-3 w-3" /> Find Colleges
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((code) => {
                const college = TOP_KCET_COLLEGES.find(c => c.code === code) || {
                  code,
                  name: `College ${code}`,
                  location: "Karnataka",
                  cseCutoff: 10000
                }
                return (
                  <div key={code} className="p-3 rounded-lg border border-border/40 bg-background/40 flex items-center justify-between text-xs hover:border-primary/40 transition-all cursor-pointer">
                    <div className="truncate">
                      <span className="font-mono font-bold text-primary">{college.code}</span>
                      <span className="text-foreground ml-2 font-medium truncate">{college.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBookmark(code)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-rose-400 shrink-0 ml-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══════════════════════════════════════════════════
          6. POWER TOOLS SUITE (CLICKABLE TACTILE CARD GRID)
         ═══════════════════════════════════════════════════ */}
      <div className="space-y-6">
        <div className="border-b border-border/40 pb-2">
          <h2 className="text-lg font-bold tracking-tight">Feature Suite</h2>
          <p className="text-xs text-muted-foreground">All counseling tools & resources — click any card to launch</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {actionCategories.map((cat) => (
            <Card key={cat.id} className="border-border/40 bg-card/60 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/40 bg-secondary/30">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {cat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 grid gap-2.5">
                {cat.items.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="group block p-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-primary/10 hover:border-primary/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-200 shrink-0">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors truncate">
                              {item.title}
                            </h3>
                            <Badge variant="outline" className="text-[9px] font-mono border-white/10 text-muted-foreground group-hover:border-primary/30 shrink-0 px-1.5 py-0">
                              {item.metric}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      {/* Explicit Action Chevron Button */}
                      <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-200 shrink-0">
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary-foreground group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AdUnit />

      {/* ═══════════════════════════════════════════════════
          7. VISUAL ANALYTICS (CLEAN RECHARTS)
         ═══════════════════════════════════════════════════ */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border/40 bg-card/60 shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Multi-Year Cutoff Rank Trends
            </CardTitle>
            <CardDescription className="text-[11px]">
              Higher rank = easier seat allotment
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_BRANCH_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="CSE" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="ECE" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/60 shadow-sm">
          <CardHeader className="pb-2 border-b border-border/40">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              Engineering Stream Distribution
            </CardTitle>
            <CardDescription className="text-[11px]">
              Historical seat allocation entries by branch
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BRANCH_POPULARITY} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }} width={110} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {BRANCH_POPULARITY.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══════════════════════════════════════════════════
          8. COMMUNITY REDDIT THREADS
         ═══════════════════════════════════════════════════ */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="p-3.5 rounded-xl border border-border/40 bg-card/40 flex items-center justify-between text-xs">
          <div>
            <h4 className="font-bold text-foreground">r/kcet Community</h4>
            <p className="text-[11px] text-muted-foreground">Student discussions</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary gap-1 cursor-pointer">
            <a href="https://www.reddit.com/r/kcet/" target="_blank" rel="noopener noreferrer">
              Visit <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>

        <div className="p-3.5 rounded-xl border border-border/40 bg-card/40 flex items-center justify-between text-xs">
          <div>
            <h4 className="font-bold text-foreground">r/comedk Community</h4>
            <p className="text-[11px] text-muted-foreground">Marks vs Rank</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary gap-1 cursor-pointer">
            <a href="https://www.reddit.com/r/comedk/" target="_blank" rel="noopener noreferrer">
              Visit <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>

        <div className="p-3.5 rounded-xl border border-border/40 bg-card/40 flex items-center justify-between text-xs">
          <div>
            <h4 className="font-bold text-foreground">r/KCETCoded Subreddit</h4>
            <p className="text-[11px] text-muted-foreground">Feedback & Updates</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs text-primary gap-1 cursor-pointer">
            <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer">
              Join <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

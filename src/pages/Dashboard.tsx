import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  GraduationCap,
  BarChart3,
  Search,
  Target,
  Calculator,
  BookOpen,
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
  Layers,
  Bot,
  Bus,
  Train,
  Building2,
  Star,
  Zap,
  Compass,
  Megaphone,
  X
} from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { useExamMode } from "@/contexts/ExamModeContext"
import AdUnit from "@/components/AdUnit"
import { CommunityPollWidget } from "@/components/CommunityPollWidget"
import { AdminSuggestionsService } from "@/lib/admin-suggestions-service"
import { supabase } from "@/integrations/supabase/client"
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, Area, AreaChart, BarChart, Bar, Cell
} from "recharts"
import { getRankBand } from "@/lib/rank-predictor"
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

  // Admin Configured Greeting Suffix
  const [adminGreeting, setAdminGreeting] = useState<string>(() => {
    return localStorage.getItem("kcet_admin_greeting_text") || "User"
  })

  // Developer Announcement Message
  const [devMessage, setDevMessage] = useState<string>(() => localStorage.getItem("kcet_dev_message_text") || "")
  const [devMessageEnabled, setDevMessageEnabled] = useState<boolean>(() => localStorage.getItem("kcet_dev_message_enabled") === "true")
  const [devMessageType, setDevMessageType] = useState<string>(() => localStorage.getItem("kcet_dev_message_type") || "info")
  const [devMessageDismissed, setDevMessageDismissed] = useState<boolean>(false)

  useEffect(() => {
    // 1. Initial fetch from global Supabase DB
    AdminSuggestionsService.getAdminGreetingName().then(name => {
      if (name) setAdminGreeting(name)
    })

    AdminSuggestionsService.getDevAnnouncementConfig().then(cfg => {
      setDevMessage(cfg.message)
      setDevMessageEnabled(cfg.enabled)
      setDevMessageType(cfg.type)
    })

    // 2. Realtime listener across all devices/visitors
    const channel = supabase.channel("global-alerts")
      .on("broadcast", { event: "admin_greeting_updated" }, (payload: any) => {
        if (payload.payload?.name) {
          setAdminGreeting(payload.payload.name)
        }
      })
      .on("broadcast", { event: "dev_message_updated" }, (payload: any) => {
        if (payload.payload?.config) {
          const cfg = payload.payload.config
          setDevMessage(cfg.message || "")
          setDevMessageEnabled(cfg.enabled === true)
          setDevMessageType(cfg.type || "info")
          setDevMessageDismissed(false)
        }
      })
      .subscribe()

    const handleGreetingUpdate = () => {
      setAdminGreeting(localStorage.getItem("kcet_admin_greeting_text") || "User")
    }
    const handleDevMessageUpdate = () => {
      setDevMessage(localStorage.getItem("kcet_dev_message_text") || "")
      setDevMessageEnabled(localStorage.getItem("kcet_dev_message_enabled") === "true")
      setDevMessageType(localStorage.getItem("kcet_dev_message_type") || "info")
      setDevMessageDismissed(false)
    }

    window.addEventListener("admin_greeting_updated", handleGreetingUpdate)
    window.addEventListener("dev_message_updated", handleDevMessageUpdate)

    return () => {
      channel.unsubscribe()
      window.removeEventListener("admin_greeting_updated", handleGreetingUpdate)
      window.removeEventListener("dev_message_updated", handleDevMessageUpdate)
    }
  }, [])

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
      const catBase = (c.cutoffs as Record<string, number>)[cat] || (c.cutoffs as Record<string, number>)["GM"] || c.cseCutoff
      const effectiveCutoff = isCSE ? catBase : Math.round(catBase * 2.4)

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

  const actionCategories = useMemo(() => [
    {
      id: "predictors",
      title: "Predictors & Simulators",
      items: [
        { title: "Cutoff Predictor", desc: "Predict Round 1, Round 2 & Round 3 cutoff shifts", icon: Sparkles, href: "/cutoff-predictor", metric: "2026 Model" },
        { title: "Mock Seat Simulator", desc: "Simulate option entry allotment", icon: Target, href: "/mock-simulator", metric: "KEA Engine" },
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
        { title: "Hidden Gems", desc: "High ROI colleges with low cutoffs", icon: Star, href: "/hidden-gems", metric: "Top Value" },
      ]
    },
    {
      id: "practice",
      title: "Practice & Preparation",
      items: [
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
        description="Structured, high-performance counseling dashboard for KCET & COMEDK."
        url="https://kcetcoded.dev/dashboard"
      />

      {/* ===================================================================
          SECTION 1: HERO HEADER & EXAM MODE WORKSPACE
         =================================================================== */}
      <div className="p-6 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {examMode} 2026 Counseling Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, <span className="text-primary font-black">{adminGreeting}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">
              {devMessageEnabled && devMessage
                ? devMessage
                : "Real-time rank predictions, seat odds, cutoff analytics & option entry tools."}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0 bg-secondary/50 p-1.5 rounded-full border border-border/40">
            <button
              type="button"
              onClick={() => setExamMode("KCET")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
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
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                examMode === "COMEDK"
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              COMEDK
            </button>
          </div>
        </header>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/40">
          <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cutoff Records</p>
              <p className="text-base font-extrabold font-mono text-foreground">{(stats?.totalRecords || 197831).toLocaleString()}</p>
            </div>
            <Database className="h-4 w-4 text-primary/70" />
          </div>
          <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Karnataka Institutes</p>
              <p className="text-base font-extrabold font-mono text-foreground">{(stats?.totalColleges || 269).toLocaleString()}</p>
            </div>
            <GraduationCap className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Branches & Streams</p>
              <p className="text-base font-extrabold font-mono text-foreground">{(stats?.totalBranches || 496).toLocaleString()}</p>
            </div>
            <BookOpen className="h-4 w-4 text-amber-400" />
          </div>
          <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cutoff Dataset</p>
              <p className="text-base font-extrabold font-mono text-foreground">2023 - 2026</p>
            </div>
            <Calendar className="h-4 w-4 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* COMMUNITY LIVE POLL */}
      <CommunityPollWidget />

      {/* ===================================================================
          SECTION 2: CORE COUNSELING TOOLS
         =================================================================== */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Core Counseling Tools
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Rank Predictor",
              desc: "Estimate KCET & COMEDK rank based on your marks.",
              icon: Calculator,
              href: "/rank-predictor"
            },
            {
              title: "College Predictor",
              desc: "Find eligible colleges matching your rank & category.",
              icon: Target,
              href: "/college-predictor"
            },
            {
              title: "Fee Calculator",
              desc: "Tuition fees, scholarships, and 4-year cost breakdown.",
              icon: FileText,
              href: "/fee-calculator"
            },
            {
              title: "AI Counselor",
              desc: "Ask questions about KEA rules, options & choices.",
              icon: Bot,
              href: "/ai-counselor"
            }
          ].map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="p-4 rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-primary/40 transition-all group flex flex-col justify-between cursor-pointer space-y-3 shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-[11px] font-semibold text-primary flex items-center gap-1 pt-1">
                Open Tool <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================================================================
          SECTION 3: ADMISSION ODDS ENGINE & PROFILE
         =================================================================== */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" />
            Personalized Admission Engine
          </h2>
          <Badge variant="outline" className="text-[10px] font-mono border-border/40">
            Live Category Match
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-12">
          {/* Profile Inputs (5 cols) */}
          <Card className="border-border/40 bg-card/60 sm:col-span-5 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-primary" />
                  Target Profile
                </CardTitle>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Saved</span>
              </div>
              <CardDescription className="text-[11px]">Set rank & category for real odds.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <Label className="text-muted-foreground font-medium">Rank ({examMode})</Label>
                  <span className="font-mono font-bold text-primary">#{profile.rank.toLocaleString()}</span>
                </div>
                <Input
                  type="number"
                  value={profile.rank}
                  onChange={e => updateProfile({ rank: parseInt(e.target.value) || 1 })}
                  className="font-mono bg-background/50 border-border/50 h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Category</Label>
                  <select
                    value={profile.category}
                    onChange={e => updateProfile({ category: e.target.value })}
                    className="w-full h-8 rounded-md border border-border/50 bg-background/50 px-2 text-xs font-semibold text-foreground"
                  >
                    {["GM", "2AG", "2BG", "3AG", "3BG", "SCG", "STG", "1G", "GMK", "GMR"].map(c => (
                      <option key={c} value={c} className="bg-background text-foreground">{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Stream</Label>
                  <select
                    value={profile.preferredStream}
                    onChange={e => updateProfile({ preferredStream: e.target.value })}
                    className="w-full h-8 rounded-md border border-border/50 bg-background/50 px-2 text-xs font-semibold text-foreground"
                  >
                    <option value="CSE" className="bg-background text-foreground">CSE & Allied</option>
                    <option value="ECE" className="bg-background text-foreground">ECE / EEE</option>
                    <option value="MECH" className="bg-background text-foreground">Mechanical</option>
                    <option value="ALL" className="bg-background text-foreground">All Streams</option>
                  </select>
                </div>
              </div>

              {/* Summary Bar */}
              <div className="p-3 rounded-lg border border-border/40 bg-secondary/30 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">Band:</span>
                  <span className="font-semibold text-foreground">{getRankBand(profile.rank)}</span>
                </div>
                <div className="space-y-1 pt-1 border-t border-border/40 text-[10px]">
                  <div className="flex justify-between text-muted-foreground font-mono">
                    <span>Safe: {safeCount}</span>
                    <span>Target: {targetCount}</span>
                    <span>Dream: {dreamCount}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40 flex overflow-hidden">
                    <div className="h-full bg-emerald-500/80" style={{ width: `${(safeCount / TOP_KCET_COLLEGES.length) * 100}%` }} />
                    <div className="h-full bg-amber-500/80" style={{ width: `${(targetCount / TOP_KCET_COLLEGES.length) * 100}%` }} />
                    <div className="h-full bg-rose-500/80" style={{ width: `${(dreamCount / TOP_KCET_COLLEGES.length) * 100}%` }} />
                  </div>
                </div>
              </div>

              <Link to="/college-predictor" className="block pt-0.5">
                <Button size="sm" className="w-full text-xs h-8 font-semibold gap-1.5 cursor-pointer">
                  <Search className="h-3 w-3" /> Full College Predictor
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Admission Odds Cards (7 cols) */}
          <Card className="border-border/40 bg-card/60 sm:col-span-7 shadow-sm flex flex-col justify-between">
            <CardHeader className="pb-2 border-b border-border/40">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Matched Institutes
                  </CardTitle>
                  <CardDescription className="text-[11px]">
                    Odds for Rank #{profile.rank.toLocaleString()} ({profile.category})
                  </CardDescription>
                </div>
                <Link to="/college-predictor">
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-primary hover:bg-primary/10 gap-1 cursor-pointer">
                    View All <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="p-3 space-y-2">
              {matchedColleges.slice(0, 4).map((c) => (
                <div
                  key={c.code}
                  className="p-2.5 rounded-lg border border-border/40 bg-background/40 hover:border-primary/40 hover:bg-secondary/30 transition-all flex items-center justify-between gap-2 group cursor-pointer"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-primary font-bold">{c.code}</span>
                      <span className="text-[10px] text-muted-foreground">• {c.location}</span>
                    </div>
                    <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">{c.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      Cutoff: #{c.cutoffRank.toLocaleString()}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[9px] font-bold ${
                        c.status === "Safe"
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                          : c.status === "Target"
                            ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                            : "border-rose-500/30 text-rose-400 bg-rose-500/10"
                      }`}
                    >
                      {c.status}
                    </Badge>
                    <Link to={`/college/${c.code}`}>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-[11px] gap-1 border-border/40 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>

            <div className="px-3 py-2 border-t border-border/40 bg-secondary/20 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Top 4 matches</span>
              <Link to="/mock-simulator" className="text-primary hover:underline font-semibold flex items-center gap-1">
                Simulate Option Entry <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* ===================================================================
          SECTION 4: CATEGORIZED FEATURE SUITE
         =================================================================== */}
      <section className="space-y-4">
        <div className="border-b border-border/40 pb-2">
          <h2 className="text-base font-bold tracking-tight">Feature Exploration</h2>
          <p className="text-xs text-muted-foreground">Explore all tools categorized for counseling & preparation</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {actionCategories.map((cat) => (
            <Card key={cat.id} className="border-border/40 bg-card/60 shadow-sm overflow-hidden">
              <CardHeader className="pb-2.5 border-b border-border/40 bg-secondary/30">
                <CardTitle className="text-xs font-bold text-foreground flex items-center gap-2 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {cat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2.5 grid gap-2">
                {cat.items.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="group block p-2.5 rounded-lg border border-white/5 bg-background/40 hover:bg-primary/10 hover:border-primary/40 transition-all duration-150 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-1.5 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                          <item.icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                              {item.title}
                            </h3>
                            <Badge variant="outline" className="text-[8px] font-mono border-white/10 text-muted-foreground px-1 py-0">
                              {item.metric}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate">{item.desc}</p>
                        </div>
                      </div>

                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ===================================================================
          SECTION 5: VISUAL ANALYTICS (RECHARTS) & POLL
         =================================================================== */}
      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="text-xs font-bold flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                Multi-Year Cutoff Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TREND_BRANCH_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.1)", borderRadius: "6px", fontSize: "10px" }} />
                    <Legend wrapperStyle={{ fontSize: "10px" }} />
                    <Area type="monotone" dataKey="CSE" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                    <Area type="monotone" dataKey="ECE" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/60 shadow-sm">
            <CardHeader className="pb-2 border-b border-border/40">
              <CardTitle className="text-xs font-bold flex items-center gap-2">
                <BarChart3 className="h-3.5 w-3.5 text-purple-400" />
                Engineering Stream Intake
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BRANCH_POPULARITY} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} />
                    <YAxis type="category" dataKey="name" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 9 }} width={100} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "#090d16", borderColor: "rgba(255,255,255,0.1)", borderRadius: "6px", fontSize: "10px" }} />
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

        
      </section>
    </div>
  )
}

export default Dashboard


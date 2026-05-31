import { SEO } from "@/components/SEO"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  Users,
  Bell,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Database,
  Flame,
  ShieldCheck,
  FileText,
  Sword
} from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { useExamMode } from "@/contexts/ExamModeContext"
import AdUnit from "@/components/AdUnit"
import { ThankYouBanner } from "@/components/ThankYouBanner"

interface DataStats {
  totalRecords: number
  totalColleges: number
  totalBranches: number
  years: { [key: string]: number }
  categories: { [key: string]: number }
  topBranches: Array<{ code: string; name: string; count: number }>
  seatTypes: { [key: string]: number }
}

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

  useEffect(() => {
    const loadStats = async () => {
      try {
        const urls = examMode === "COMEDK"
          ? [
            '/data/comedk_cutoffs.json',
            '/comedk_cutoffs.json'
          ]
          : [
            '/data/kcet_cutoffs_high_volume.json',
            '/data/kcet_cutoffs_master.json',
            '/data/kcet_cutoffs_consolidated.json',
            '/kcet_cutoffs_high_volume.json',
            '/kcet_cutoffs_master.json',
            '/kcet_cutoffs_consolidated.json',
            '/kcet_cutoffs.json'
          ]
        let response: Response | null = null
        for (const url of urls) {
          const r = await fetch(url, { cache: 'no-store' })
          if (r.ok) { response = r; break }
        }
        if (!response) throw new Error('Failed to load data')

        const raw = await response.json()

        if (examMode !== "COMEDK" && !Array.isArray(raw) && raw.totals && raw.years && raw.categories) {
          const sortedYears: { [key: string]: number } = {}
          Object.keys(raw.years).sort((a, b) => b.localeCompare(a)).forEach(y => { sortedYears[y] = raw.years[y] })
          setStats({
            totalRecords: raw.totals.records,
            totalColleges: raw.totals.colleges,
            totalBranches: raw.totals.branches,
            years: sortedYears,
            categories: raw.categories,
            topBranches: [],
            seatTypes: {}
          })
          setLoading(false)
          return
        }

        const metadata = Array.isArray(raw) ? null : (raw.metadata || null)
        const cutoffs = Array.isArray(raw) ? raw : (raw.cutoffs || raw.data || raw.cutoffs_data || [])

        const colleges = new Map()
        const branches = new Map()
        const years: { [key: string]: number } = {}
        const categories: { [key: string]: number } = {}
        const rounds: { [key: string]: number } = {}

        cutoffs.forEach((record: any) => {
          years[record.year] = (years[record.year] || 0) + 1
          categories[record.category] = (categories[record.category] || 0) + 1
          rounds[record.round] = (rounds[record.round] || 0) + 1

          if (record.institute_code) {
            const collegeKey = record.institute_code
            colleges.set(collegeKey, {
              code: record.institute_code,
              name: record.institute,
              count: (colleges.get(collegeKey)?.count || 0) + 1
            })
          }

          if (record.course) {
            const branchKey = record.course
            branches.set(branchKey, {
              code: record.course,
              name: record.course,
              count: (branches.get(branchKey)?.count || 0) + 1
            })
          }
        })

        const topBranches = Array.from(branches.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        const sortedYears: { [key: string]: number } = {}
        Object.keys(years).sort((a, b) => b.localeCompare(a)).forEach(y => { sortedYears[y] = years[y] })

        setStats({
          totalRecords: metadata?.total_entries ?? cutoffs.length,
          totalColleges: metadata?.total_colleges ?? metadata?.total_institutes ?? colleges.size,
          totalBranches: metadata?.total_courses ?? branches.size,
          years: sortedYears,
          categories,
          topBranches,
          seatTypes: rounds
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [examMode])

  const explorerAction = examMode === "KCET"
    ? { title: "KCET Explorer", description: "Analyze KCET cutoff trends", icon: BarChart3, href: "/cutoff-explorer", gradient: "from-emerald-500 to-teal-400", glow: "shadow-emerald-500/15" }
    : { title: "COMEDK Explorer", description: "Browse GM, HKR, KKR cutoffs", icon: ShieldCheck, href: "/cutoff-explorer", gradient: "from-amber-500 to-orange-500", glow: "shadow-amber-500/15" }

  const quickActions = examMode === "COMEDK"
    ? [
      { title: "Daily Challenge", description: "5-question daily quiz", icon: Flame, href: "/daily-challenge", gradient: "from-orange-500 to-red-500", glow: "shadow-orange-500/15" },
      { title: "Cutoff Clash", description: "Higher or Lower game", icon: Sword, href: "/cutoff-clash", gradient: "from-pink-500 to-rose-500", glow: "shadow-pink-500/15" },
      explorerAction,
      { title: "COMEDK Predictor", description: "Predict COMEDK rank from marks", icon: Calculator, href: "/rank-predictor", gradient: "from-purple-500 to-pink-400", glow: "shadow-purple-500/15" },
      { title: "Round Tracker", description: "Track counseling rounds", icon: Bell, href: "/round-tracker", gradient: "from-sky-500 to-cyan-400", glow: "shadow-sky-500/15" },
      { title: "Documents", description: "Counseling checklist", icon: FileText, href: "/documents", gradient: "from-slate-500 to-zinc-400", glow: "shadow-slate-500/15" },
    ]
    : [
      { title: "Find Colleges", description: "Search based on your rank", icon: Search, href: "/college-finder", gradient: "from-blue-500 to-cyan-400", glow: "shadow-blue-500/15" },
      explorerAction,
      { title: "Rank Predictor", description: "Predict rank from marks", icon: Calculator, href: "/rank-predictor", gradient: "from-purple-500 to-pink-400", glow: "shadow-purple-500/15" },
      { title: "Cutoff Trends", description: "YOY cutoff rank trends", icon: TrendingUp, href: "/cutoff-trends", gradient: "from-indigo-500 to-violet-400", glow: "shadow-indigo-500/15" },
      { title: "Mock Simulator", description: "Simulate seat allotment", icon: Target, href: "/mock-simulator", gradient: "from-orange-500 to-amber-400", glow: "shadow-orange-500/15" },
      { title: "Daily Challenge", description: "5-question daily quiz", icon: Flame, href: "/daily-challenge", gradient: "from-orange-500 to-red-500", glow: "shadow-orange-500/15" },
    ]

  const statCards = [
    { label: "Total Records", value: stats?.totalRecords, icon: Database, gradient: "from-indigo-500 to-blue-500" },
    { label: "Colleges", value: stats?.totalColleges, icon: GraduationCap, gradient: "from-purple-500 to-fuchsia-500" },
    { label: "Branches", value: stats?.totalBranches, icon: BookOpen, gradient: "from-emerald-500 to-teal-500" },
    { label: "Years of Data", value: stats ? Object.keys(stats.years).length : 0, icon: BarChart3, gradient: "from-orange-500 to-amber-500" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-scale-in">
      <SEO
        title={examMode === "COMEDK" ? "COMEDK Dashboard â€“ Predictor & Cutoff Tools" : "KCET 2026 Dashboard â€“ Counseling Tools & Cutoff Data"}
        description={examMode === "COMEDK"
          ? "Your COMEDK dashboard with rank predictor and cutoff explorer powered by community + PDF data."
          : "Your KCET 2026 dashboard with rank predictor, college finder, cutoff explorer, mock simulator, daily challenges & counseling round tracker. All tools in one place â€” 100% free."}
        url="https://kcet-coded2.vercel.app/dashboard"
        keywords={examMode === "COMEDK"
          ? "COMEDK dashboard, COMEDK rank predictor, COMEDK marks vs rank, COMEDK cutoff explorer"
          : "KCET dashboard, KCET tools, KCET 2026 counseling, KCET exam schedule, CET 2026 dates, KCET preparation tools"}
      />
      <ThankYouBanner />
      {/* ═══ Welcome Banner ═══ */}
      <div className="relative rounded-2xl overflow-hidden glass border border-white/5 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/6 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 -z-10" />

        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 text-xs font-semibold">
            Dashboard
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
          {getGreeting()}
        </h1>
        <p className="text-muted-foreground">{examMode === "COMEDK" ? "Your COMEDK planning environment" : "CET 2026 is done! Get ready for counseling."}</p>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl glass border border-white/5 p-4">
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Note:</span> This is an independent project and is not affiliated with Reddit, r/kcet, or r/KCETards moderation teams.
        </p>
      </div>

      {/* ═══ Post-Exam Counseling Status ═══ */}
      {examMode === "KCET" ? (
      <div className="rounded-2xl glass border border-white/5 overflow-hidden">
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">CET 2026 — What's Next</h2>
              <p className="text-xs text-muted-foreground">Exam completed ✓ • Counseling pipeline</p>
            </div>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-bold">COMPLETED</Badge>
        </div>

        <div className="p-6">
          <div className="relative pl-8 space-y-6">
            {/* Timeline line */}
            <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/50 via-indigo-500/30 to-transparent" />

            {/* CET Exam Done */}
            <div className="relative">
              <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-[10px] font-bold text-white">✓</span>
              </div>
              <div className="glass rounded-xl border border-emerald-500/20 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-emerald-400">CET 2026 Exam</span>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">Apr 23-24</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Physics, Chemistry, Math & Biology — Completed ✓</p>
              </div>
            </div>

            {/* Results */}
            <div className="relative">
              <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 animate-pulse">
                <span className="text-[10px] font-bold text-white">⏳</span>
              </div>
              <div className="glass rounded-xl border border-amber-500/20 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-amber-400">Results & Rank Announcement</span>
                  <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">May (Expected)</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Answer keys, results, and rank cards — Use our Rank Predictor to estimate!</p>
              </div>
            </div>

            {/* Counseling */}
            <div className="relative">
              <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border border-white/10">
                <span className="text-[10px] font-bold text-white/40">3</span>
              </div>
              <div className="glass rounded-xl border border-white/5 px-4 py-3 opacity-60">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Counseling Rounds</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Jun-Jul</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Document verification, option entry, and seat allotment</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link to="/rank-predictor" className="flex-1">
              <Button className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg shadow-indigo-500/20">
                <Calculator className="h-4 w-4" />
                Predict Your Rank
              </Button>
            </Link>
            <Link to="/college-finder" className="flex-1">
              <Button variant="outline" className="w-full gap-2 border-white/10 hover:bg-white/5">
                <Search className="h-4 w-4" />
                Find Colleges
              </Button>
            </Link>
          </div>
        </div>
      </div>
      ) : (
        <Card className="border-amber-300/40 bg-amber-50/70 dark:bg-amber-950/15">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-500" />
              COMEDK Mode Active
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Dashboard shortcuts, cutoff explorer, and rank predictor are now switched to COMEDK.</p>
            <p>Switch back to KCET anytime from the exam toggle in the header.</p>
          </CardContent>
        </Card>
      )}

      {/* ═══ Quick Actions ═══ */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl glass border border-white/5 p-4">
        <div>
          <p className="text-sm font-semibold">Cutoff Explorer Mode</p>
          <p className="text-xs text-muted-foreground">Choose which exam explorer opens from dashboard shortcuts.</p>
        </div>
        <div className="relative inline-flex h-9 w-[10.5rem] items-center rounded-full border border-white/10 bg-white/5 p-0.5">
          <span
            className={`absolute left-0.5 h-8 w-[5rem] rounded-full transition-all duration-300 ease-in-out ${
              examMode === "COMEDK"
                ? "translate-x-[5rem] bg-amber-500 shadow-lg shadow-amber-500/25"
                : "translate-x-0 bg-indigo-500 shadow-lg shadow-indigo-500/25"
            }`}
          />
          <button
            type="button"
            onClick={() => setExamMode("KCET")}
            className={`relative z-10 flex h-8 w-[5rem] items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
              examMode === "KCET" ? "text-white" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            KCET
          </button>
          <button
            type="button"
            onClick={() => setExamMode("COMEDK")}
            className={`relative z-10 flex h-8 w-[5rem] items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
              examMode === "COMEDK" ? "text-black" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            COMEDK
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.href} className="group">
            <div className={`rainbow-border h-full rounded-2xl glass border border-white/5 hover:border-white/10 transition-all duration-300 tilt-card ${action.glow}`}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-semibold group-hover:text-indigo-400 transition-colors">{action.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all tilt-card">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="text-white font-bold text-sm">r/</span>
              </div>
              <div>
                <h3 className="font-semibold">{examMode === "COMEDK" ? "COMEDK Community" : "KCET Community"}</h3>
                <p className="text-sm text-muted-foreground">{examMode === "COMEDK" ? "Marks-vs-rank discussions" : "Discussions & answers"}</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1.5 border-white/10 hover:bg-white/5">
              <a href={examMode === "COMEDK" ? "https://www.reddit.com/r/comedk/" : "https://www.reddit.com/r/kcet/"} target="_blank" rel="noopener noreferrer">
                Visit <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/5 hover:border-cyan-500/20 transition-all tilt-card">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="text-white font-bold text-sm">r/</span>
              </div>
              <div>
                <h3 className="font-semibold">{examMode === "COMEDK" ? "COMEDK Trends" : "KCETards"}</h3>
                <p className="text-sm text-muted-foreground">{examMode === "COMEDK" ? "Community updates & comments" : "Student discussions"}</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1.5 border-white/10 hover:bg-white/5">
              <a href={examMode === "COMEDK" ? "https://www.reddit.com/r/comedk/comments/1l66im4/marks_vs_rank_2025/" : "https://www.reddit.com/r/KCETards/"} target="_blank" rel="noopener noreferrer">
                Visit <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all tilt-card">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-sm">r/</span>
              </div>
              <div>
                <h3 className="font-semibold">{examMode === "COMEDK" ? "KCET Coded" : "KCET Coded"}</h3>
                <p className="text-sm text-muted-foreground">{examMode === "COMEDK" ? "Project feedback" : "Website feedback"}</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1.5 border-white/10 hover:bg-white/5">
              <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer">
                Join <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {examMode === "COMEDK"
          ? "Note: KCET Coded is independent and not affiliated with Reddit or r/comedk moderation teams."
          : "Note: KCET Coded is independent and not affiliated with Reddit, r/kcet, or r/KCETards moderation teams."}
      </p>

      {/* In-feed Ad */}
      <AdUnit />

      {/* â•â•â• Data Stats â•â•â• */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="glass rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{card.label}</p>
                    <p className="text-2xl font-bold tabular-nums">{(card.value ?? 0).toLocaleString()}</p>
                  </div>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${card.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* â•â•â• Year-wise & Category Data â•â•â• */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl border border-white/5">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-400" />
                Data by Year
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {Object.entries(stats.years)
                .sort(([a], [b]) => parseInt(b) - parseInt(a))
                .map(([year, count]) => (
                  <div key={year} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{year}</span>
                      <span className="text-muted-foreground tabular-nums">{count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                        style={{ width: `${(count / stats.totalRecords) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="glass rounded-2xl border border-white/5">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-400" />
                Data by Category
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {Object.entries(stats.categories)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 8)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-white/5 border-white/10 text-xs font-mono">{category}</Badge>
                      <span className="text-sm tabular-nums">{count.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {((count / stats.totalRecords) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

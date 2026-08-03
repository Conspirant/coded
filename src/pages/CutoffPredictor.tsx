import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Legend, BarChart, Bar, Cell
} from "recharts"
import {
  Brain, Target, TrendingUp, TrendingDown, Minus, Search,
  BarChart3, Info, Loader2, Sparkles, ChevronRight,
  Shield, AlertTriangle, Check, ChevronsUpDown, Layers,
  ArrowUpRight, ArrowDownRight, Zap, CheckCircle2, XCircle
} from "lucide-react"
import {
  predictCutoff,
  predictMultiple,
  predictAcrossCategories,
  predictAcrossRounds,
  checkEligibility,
  getAvailableColleges,
  getAvailableBranches,
  getAvailableCategories,
  getAvailableRounds,
  backtestAccuracy,
  type CutoffPrediction,
  type CollegeOption,
  type BranchOption,
} from "@/lib/cutoff-predictor"

// ────────────────────────────────────────────────────────────────
//  KCET Category List
// ────────────────────────────────────────────────────────────────
const KCET_CATEGORIES = [
  { code: "GM", label: "General Merit (GM)" },
  { code: "GMK", label: "General Merit Kannada (GMK)" },
  { code: "GMR", label: "General Merit Rural (GMR)" },
  { code: "1G", label: "Category 1G" },
  { code: "1K", label: "Category 1K" },
  { code: "1R", label: "Category 1R" },
  { code: "2AG", label: "Category 2AG" },
  { code: "2AK", label: "Category 2AK" },
  { code: "2AR", label: "Category 2AR" },
  { code: "2BG", label: "Category 2BG" },
  { code: "2BK", label: "Category 2BK" },
  { code: "2BR", label: "Category 2BR" },
  { code: "3AG", label: "Category 3AG" },
  { code: "3AK", label: "Category 3AK" },
  { code: "3AR", label: "Category 3AR" },
  { code: "3BG", label: "Category 3BG" },
  { code: "3BK", label: "Category 3BK" },
  { code: "3BR", label: "Category 3BR" },
  { code: "SCG", label: "Scheduled Caste General (SCG)" },
  { code: "SCK", label: "Scheduled Caste Kannada (SCK)" },
  { code: "SCR", label: "Scheduled Caste Rural (SCR)" },
  { code: "STG", label: "Scheduled Tribe General (STG)" },
  { code: "STK", label: "Scheduled Tribe Kannada (STK)" },
  { code: "STR", label: "Scheduled Tribe Rural (STR)" },
]

// ────────────────────────────────────────────────────────────────
//  Sub-Components
// ────────────────────────────────────────────────────────────────

/** Visual confidence range bar */
const ConfidenceRangeBar = ({ low, predicted, high }: { low: number; predicted: number; high: number }) => {
  const maxRank = Math.max(high * 1.3, 300000)
  const lowPct = Math.max(0, (1 - low / maxRank) * 100)
  const predPct = Math.max(0, (1 - predicted / maxRank) * 100)
  const highPct = Math.max(0, (1 - high / maxRank) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Better Rank (Lower)</span>
        <span>Worse Rank (Higher)</span>
      </div>
      <div className="relative h-5 bg-gradient-to-r from-emerald-500/20 via-amber-500/20 to-red-500/20 rounded-full overflow-hidden border border-white/10">
        {/* Confidence band */}
        <div
          className="absolute h-full bg-gradient-to-r from-emerald-500/40 to-violet-500/40 backdrop-blur-sm rounded-sm transition-all duration-700"
          style={{
            left: `${100 - lowPct}%`,
            width: `${Math.max(1, lowPct - highPct)}%`,
          }}
        />
        {/* Predicted marker */}
        <div
          className="absolute w-1.5 h-7 -top-1 bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.6)] rounded-full transform -translate-x-1/2 transition-all duration-700"
          style={{ left: `${100 - predPct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-medium">
        <span className="text-emerald-400">{low.toLocaleString()}</span>
        <span className="text-violet-400 font-bold text-sm">{predicted.toLocaleString()}</span>
        <span className="text-red-400">{high.toLocaleString()}</span>
      </div>
    </div>
  )
}

/** Confidence level indicator */
const ConfidenceBadge = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const config = {
    high: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: Shield, label: "High Confidence" },
    medium: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: AlertTriangle, label: "Medium Confidence" },
    low: { color: "bg-red-500/15 text-red-400 border-red-500/30", icon: Info, label: "Low Confidence" },
  }[level]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`${config.color} gap-1.5 px-3 py-1`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </Badge>
  )
}

/** Trend direction badge */
const TrendBadge = ({ trend, pct }: { trend: 'rising' | 'falling' | 'stable'; pct: number }) => {
  const config = {
    rising: { color: "text-emerald-400", icon: ArrowUpRight, label: "Easier" },
    falling: { color: "text-red-400", icon: ArrowDownRight, label: "Harder" },
    stable: { color: "text-amber-400", icon: Minus, label: "Stable" },
  }[trend]
  const Icon = config.icon

  return (
    <div className={`flex items-center gap-1 text-sm font-medium ${config.color}`}>
      <Icon className="h-4 w-4" />
      <span>{config.label} ({Math.abs(pct)}%)</span>
    </div>
  )
}

/** Eligibility result badge */
const EligibilityBadge = ({ eligibility }: { eligibility: 'high' | 'moderate' | 'borderline' | 'unlikely' }) => {
  const config = {
    high: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: CheckCircle2, label: "High Chance" },
    moderate: { color: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: Target, label: "Moderate Chance" },
    borderline: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: AlertTriangle, label: "Borderline" },
    unlikely: { color: "bg-red-500/15 text-red-400 border-red-500/30", icon: XCircle, label: "Unlikely" },
  }[eligibility]
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`${config.color} gap-1 text-xs`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

/** Signals breakdown mini-chips */
const SignalsBreakdown = ({ signals }: { signals: string[] }) => (
  <div className="flex flex-wrap gap-1.5">
    {signals.map((s, i) => (
      <span
        key={i}
        className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground"
      >
        {s}
      </span>
    ))}
  </div>
)

// ────────────────────────────────────────────────────────────────
//  Main Page Component
// ────────────────────────────────────────────────────────────────

const CutoffPredictor = () => {
  // Data loading state
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)

  // Available options
  const [colleges, setColleges] = useState<CollegeOption[]>([])
  const [branches, setBranches] = useState<BranchOption[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [rounds, setRounds] = useState<string[]>([])

  // Selected inputs
  const [selectedCollege, setSelectedCollege] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("GM")
  const [selectedRound, setSelectedRound] = useState("R1")
  const [targetYear, setTargetYear] = useState(2026)
  const [collegeSearchOpen, setCollegeSearchOpen] = useState(false)
  const [collegeSearch, setCollegeSearch] = useState("")

  // Results
  const [prediction, setPrediction] = useState<CutoffPrediction | null>(null)
  const [allBranchPredictions, setAllBranchPredictions] = useState<CutoffPrediction[]>([])
  const [catPredictions, setCatPredictions] = useState<CutoffPrediction[]>([])
  const [roundPredictions, setRoundPredictions] = useState<CutoffPrediction[]>([])

  // Eligibility checker
  const [userRank, setUserRank] = useState("")

  // Active tab
  const [activeTab, setActiveTab] = useState("predict")

  // Backtest results
  const [backtestResults, setBacktestResults] = useState<Awaited<ReturnType<typeof backtestAccuracy>> | null>(null)
  const [backtesting, setBacktesting] = useState(false)

  // ── Load initial data ──
  useEffect(() => {
    async function init() {
      try {
        const [c, cat, r] = await Promise.all([
          getAvailableColleges(),
          getAvailableCategories(),
          getAvailableRounds(),
        ])
        setColleges(c)
        setCategories(cat)
        setRounds(r)
      } catch (e) {
        console.error("Failed to load predictor data", e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // ── Load branches when college changes ──
  useEffect(() => {
    if (!selectedCollege) {
      setBranches([])
      setSelectedBranch("")
      return
    }
    async function loadBranches() {
      const b = await getAvailableBranches(selectedCollege)
      setBranches(b)
      if (b.length > 0 && !b.find(x => x.normalized === selectedBranch)) {
        setSelectedBranch(b[0].normalized)
      }
    }
    loadBranches()
  }, [selectedCollege])

  // ── Run prediction ──
  const runPrediction = useCallback(async () => {
    if (!selectedCollege || !selectedBranch || !selectedCategory || !selectedRound) return

    setPredicting(true)
    setPrediction(null)
    setCatPredictions([])
    setRoundPredictions([])
    setAllBranchPredictions([])

    try {
      const [p, allBranch, catP, roundP] = await Promise.all([
        predictCutoff(selectedCollege, selectedBranch, selectedCategory, selectedRound, targetYear),
        predictMultiple(selectedCollege, selectedCategory, selectedRound, targetYear),
        predictAcrossCategories(selectedCollege, selectedBranch, selectedRound, targetYear),
        predictAcrossRounds(selectedCollege, selectedBranch, selectedCategory, targetYear),
      ])

      setPrediction(p)
      setAllBranchPredictions(allBranch)
      setCatPredictions(catP)
      setRoundPredictions(roundP)
    } catch (e) {
      console.error("Prediction failed", e)
    } finally {
      setPredicting(false)
    }
  }, [selectedCollege, selectedBranch, selectedCategory, selectedRound, targetYear])

  // ── Eligibility check ──
  const eligibilityResults = useMemo(() => {
    if (!prediction || !userRank) return null
    const rank = parseInt(userRank)
    if (isNaN(rank) || rank <= 0) return null
    return checkEligibility([prediction], rank)[0]
  }, [prediction, userRank])

  const allBranchEligibility = useMemo(() => {
    if (!userRank || allBranchPredictions.length === 0) return []
    const rank = parseInt(userRank)
    if (isNaN(rank) || rank <= 0) return []
    return checkEligibility(allBranchPredictions, rank)
  }, [userRank, allBranchPredictions])

  // ── Chart data for historical trend ──
  const chartData = useMemo(() => {
    if (!prediction) return []

    const points = prediction.historical.map(h => ({
      year: h.year,
      rank: h.rank,
    }))

    // Add predicted year
    points.push({
      year: String(targetYear),
      rank: prediction.predicted_cutoff,
    })

    return points
  }, [prediction, targetYear])

  // ── Filtered colleges for search ──
  const filteredColleges = useMemo(() => {
    if (!collegeSearch.trim()) return colleges.slice(0, 30)
    const q = collegeSearch.toLowerCase()
    return colleges
      .filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .slice(0, 30)
  }, [collegeSearch, colleges])

  // ── Run backtest ──
  const runBacktest = useCallback(async () => {
    setBacktesting(true)
    try {
      const result = await backtestAccuracy()
      setBacktestResults(result)
    } catch (e) {
      console.error("Backtest failed", e)
    } finally {
      setBacktesting(false)
    }
  }, [])

  // ── Category bar chart data ──
  const categoryChartData = useMemo(() => {
    return catPredictions.map(p => ({
      category: p.category,
      predicted: p.predicted_cutoff,
      low: p.confidence_low,
      high: p.confidence_high,
    }))
  }, [catPredictions])

  // ── Round comparison chart data ──
  const roundChartData = useMemo(() => {
    return roundPredictions.map(p => ({
      round: p.round,
      predicted: p.predicted_cutoff,
      low: p.confidence_low,
      high: p.confidence_high,
    }))
  }, [roundPredictions])

  // Category colors for the bar chart
  const getCategoryColor = (cat: string) => {
    if (cat === 'GM' || cat === 'GMK' || cat === 'GMR') return '#818cf8'
    if (cat.startsWith('1')) return '#34d399'
    if (cat.startsWith('2')) return '#f472b6'
    if (cat.startsWith('3')) return '#fbbf24'
    if (cat.startsWith('SC')) return '#60a5fa'
    if (cat.startsWith('ST')) return '#fb923c'
    return '#a78bfa'
  }

  // ────────────────────────────────────────────────────────────────
  //  Render
  // ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-400" />
          <p className="text-muted-foreground">Loading prediction engine...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Cutoff Predictor | KCET Coded"
        description="Predict KCET cutoff ranks for any college, branch, and category using advanced multi-signal analysis with 200K+ historical data points."
      />

      <div className="max-w-7xl mx-auto space-y-6 px-4 py-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20">
              <Brain className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Cutoff Predictor
              </h1>
              <p className="text-sm text-muted-foreground">
                7-layer AI prediction engine • 200K+ data points • 3 years of analysis
              </p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white/5 border border-white/10 p-1">
            <TabsTrigger value="predict" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
              <Brain className="h-4 w-4 mr-1.5" /> Predict
            </TabsTrigger>
            <TabsTrigger value="compare-cat" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
              <BarChart3 className="h-4 w-4 mr-1.5" /> Categories
            </TabsTrigger>
            <TabsTrigger value="compare-round" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
              <Layers className="h-4 w-4 mr-1.5" /> Rounds
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">
              <Shield className="h-4 w-4 mr-1.5" /> Accuracy
            </TabsTrigger>
          </TabsList>

          {/* ═══ Input Controls (shared across tabs) ═══ */}
          <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* College Selector */}
                <div className="lg:col-span-2 space-y-2">
                  <Label className="text-sm text-muted-foreground">College</Label>
                  <Popover open={collegeSearchOpen} onOpenChange={setCollegeSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={collegeSearchOpen}
                        className="w-full justify-between bg-white/5 border-white/10 hover:bg-white/10 text-left h-10 font-normal"
                      >
                        {selectedCollege
                          ? `${selectedCollege} - ${colleges.find(c => c.code === selectedCollege)?.name || ''}`.substring(0, 50)
                          : "Search college..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0 bg-[#1a1a2e] border-white/10" align="start">
                      <Command className="bg-transparent">
                        <CommandInput
                          placeholder="Search by code or name..."
                          value={collegeSearch}
                          onValueChange={setCollegeSearch}
                          className="border-0"
                        />
                        <CommandList>
                          <CommandEmpty>No college found.</CommandEmpty>
                          <CommandGroup className="max-h-[250px] overflow-auto">
                            {filteredColleges.map(c => (
                              <CommandItem
                                key={c.code}
                                value={`${c.code} ${c.name}`}
                                onSelect={() => {
                                  setSelectedCollege(c.code)
                                  setCollegeSearchOpen(false)
                                  setCollegeSearch("")
                                }}
                                className="cursor-pointer hover:bg-white/10"
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${selectedCollege === c.code ? "opacity-100 text-violet-400" : "opacity-0"}`}
                                />
                                <span className="text-xs font-mono text-violet-400 mr-2">{c.code}</span>
                                <span className="text-sm truncate">{c.name}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Branch Selector */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Branch</Label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-10">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10 max-h-[250px]">
                      {branches.map(b => (
                        <SelectItem key={b.normalized} value={b.normalized}>
                          {b.normalized}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Selector */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-white/5 border-white/10 h-10">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-white/10 max-h-[250px]">
                      {KCET_CATEGORIES.filter(c => categories.includes(c.code)).map(c => (
                        <SelectItem key={c.code} value={c.code}>{c.code} — {c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Round + Year + Predict Button */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Round</Label>
                  <div className="flex gap-2">
                    <Select value={selectedRound} onValueChange={setSelectedRound}>
                      <SelectTrigger className="bg-white/5 border-white/10 h-10 flex-1">
                        <SelectValue placeholder="Round" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a2e] border-white/10">
                        {rounds.map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={runPrediction}
                      disabled={!selectedCollege || !selectedBranch || predicting}
                      className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white h-10 px-5 shadow-lg shadow-violet-500/20"
                    >
                      {predicting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ═══ TAB: Predict ═══ */}
          <TabsContent value="predict" className="space-y-4 mt-0">
            {predicting && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-400" />
                  <p className="text-sm text-muted-foreground">Running 7-layer prediction pipeline...</p>
                </div>
              </div>
            )}

            {prediction && !predicting && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Main Prediction Card */}
                <Card className="lg:col-span-2 bg-gradient-to-br from-violet-500/[0.07] to-fuchsia-500/[0.04] border-violet-500/20 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-violet-400" />
                        Predicted Cutoff for {targetYear}
                      </CardTitle>
                      <ConfidenceBadge level={prediction.confidence_level} />
                    </div>
                    <CardDescription className="text-xs">
                      {prediction.college_name} • {prediction.normalized_course} • {prediction.category} • {prediction.round}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Big Number */}
                    <div className="text-center py-3">
                      <div className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent tabular-nums">
                        {prediction.predicted_cutoff.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-3">
                        <span>Predicted Rank</span>
                        <TrendBadge trend={prediction.trend} pct={prediction.trend_pct} />
                      </div>
                    </div>

                    {/* Confidence Range Bar */}
                    <ConfidenceRangeBar
                      low={prediction.confidence_low}
                      predicted={prediction.predicted_cutoff}
                      high={prediction.confidence_high}
                    />

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">Data Years</div>
                        <div className="text-lg font-semibold text-foreground">{prediction.data_years}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">Signals</div>
                        <div className="text-lg font-semibold text-foreground">{prediction.signals_used.length}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">Backtest Error</div>
                        <div className="text-lg font-semibold text-foreground">
                          {prediction.backtest_error_pct !== undefined ? `${prediction.backtest_error_pct}%` : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Signals Used */}
                    <div className="space-y-1.5">
                      <div className="text-xs text-muted-foreground font-medium">Prediction Signals</div>
                      <SignalsBreakdown signals={prediction.signals_used} />
                    </div>

                    {prediction.participation_adjusted && (
                      <Alert className="bg-violet-500/5 border-violet-500/20">
                        <Info className="h-4 w-4 text-violet-400" />
                        <AlertDescription className="text-xs text-muted-foreground">
                          Ranks are normalized for yearly candidate volume changes (participation-adjusted).
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Right Side: Chart + Eligibility */}
                <div className="space-y-4">
                  {/* Historical Trend Chart */}
                  <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-violet-400" />
                        Historical Trend
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="cutoffGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="year" tick={{ fill: '#888', fontSize: 11 }} />
                            <YAxis tick={{ fill: '#888', fontSize: 11 }} />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#1a1a2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                fontSize: '12px'
                              }}
                              formatter={(value: number) => [value.toLocaleString(), 'Rank']}
                            />
                            <Area
                              type="monotone"
                              dataKey="rank"
                              stroke="#8b5cf6"
                              strokeWidth={2}
                              fill="url(#cutoffGrad)"
                              dot={{ fill: '#8b5cf6', r: 4 }}
                              activeDot={{ r: 6, fill: '#a78bfa' }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Check Your Rank */}
                  <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Target className="h-4 w-4 text-violet-400" />
                        Check Your Rank
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Enter your rank"
                          value={userRank}
                          onChange={e => setUserRank(e.target.value)}
                          className="bg-white/5 border-white/10 h-9"
                        />
                      </div>
                      {eligibilityResults && (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-sm">Admission Chance</span>
                          <EligibilityBadge eligibility={eligibilityResults.eligibility} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* All Branches Table */}
                {allBranchPredictions.length > 0 && (
                  <Card className="lg:col-span-3 bg-white/[0.03] border-white/10 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-violet-400" />
                        All Branches at {prediction.college_code} ({selectedCategory} • {selectedRound})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Branch</th>
                              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">Predicted</th>
                              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">Range</th>
                              <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Trend</th>
                              <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Confidence</th>
                              {userRank && <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Eligibility</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {(userRank ? allBranchEligibility : allBranchPredictions).map((p, i) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                <td className="py-2.5 px-3 text-xs font-medium">{p.normalized_course}</td>
                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums text-violet-300">
                                  {p.predicted_cutoff.toLocaleString()}
                                </td>
                                <td className="py-2.5 px-3 text-right text-xs text-muted-foreground tabular-nums">
                                  {p.confidence_low.toLocaleString()} – {p.confidence_high.toLocaleString()}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <TrendBadge trend={p.trend} pct={p.trend_pct} />
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <ConfidenceBadge level={p.confidence_level} />
                                </td>
                                {userRank && 'eligibility' in p && (
                                  <td className="py-2.5 px-3 text-center">
                                    <EligibilityBadge eligibility={(p as any).eligibility} />
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {!prediction && !predicting && (
              <Card className="bg-white/[0.03] border-white/10 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-3">
                  <Brain className="h-12 w-12 text-violet-400/30" />
                  <p className="text-muted-foreground text-sm">
                    Select a college and branch, then click the ⚡ button to predict
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ TAB: Compare Categories ═══ */}
          <TabsContent value="compare-cat" className="space-y-4 mt-0">
            {catPredictions.length > 0 ? (
              <div className="space-y-4">
                <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {prediction?.normalized_course} at {prediction?.college_code} — All Categories ({selectedRound}, {targetYear})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryChartData} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis type="number" tick={{ fill: '#888', fontSize: 10 }} />
                          <YAxis dataKey="category" type="category" tick={{ fill: '#888', fontSize: 11 }} width={40} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: '#1a1a2e',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                            formatter={(value: number) => [value.toLocaleString(), 'Rank']}
                          />
                          <Bar dataKey="predicted" radius={[0, 4, 4, 0]}>
                            {categoryChartData.map((entry, i) => (
                              <Cell key={i} fill={getCategoryColor(entry.category)} fillOpacity={0.7} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Table */}
                <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
                  <CardContent className="pt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Category</th>
                            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">Predicted Cutoff</th>
                            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">Range</th>
                            <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Confidence</th>
                            <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Data Years</th>
                          </tr>
                        </thead>
                        <tbody>
                          {catPredictions.map((p, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                              <td className="py-2 px-3 font-medium">
                                <Badge variant="outline" className="text-xs" style={{ borderColor: getCategoryColor(p.category) + '40', color: getCategoryColor(p.category) }}>
                                  {p.category}
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-right font-semibold tabular-nums text-violet-300">
                                {p.predicted_cutoff.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right text-xs text-muted-foreground tabular-nums">
                                {p.confidence_low.toLocaleString()} – {p.confidence_high.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-center"><ConfidenceBadge level={p.confidence_level} /></td>
                              <td className="py-2 px-3 text-center text-xs">{p.data_years}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/[0.03] border-white/10 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-3">
                  <BarChart3 className="h-12 w-12 text-violet-400/30" />
                  <p className="text-muted-foreground text-sm">Run a prediction first to compare across categories</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ TAB: Compare Rounds ═══ */}
          <TabsContent value="compare-round" className="space-y-4 mt-0">
            {roundPredictions.length > 0 ? (
              <div className="space-y-4">
                <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      {prediction?.normalized_course} at {prediction?.college_code} — Round Comparison ({selectedCategory}, {targetYear})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={roundChartData}>
                          <defs>
                            <linearGradient id="roundGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#f472b6" stopOpacity={0.3} />
                              <stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="round" tick={{ fill: '#888', fontSize: 12 }} />
                          <YAxis tick={{ fill: '#888', fontSize: 11 }} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: '#1a1a2e',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                            formatter={(value: number) => [value.toLocaleString(), 'Rank']}
                          />
                          <Area
                            type="monotone"
                            dataKey="predicted"
                            stroke="#f472b6"
                            strokeWidth={2}
                            fill="url(#roundGrad)"
                            dot={{ fill: '#f472b6', r: 5 }}
                            activeDot={{ r: 7, fill: '#fb7185' }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Round Table */}
                <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
                  <CardContent className="pt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Round</th>
                            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">Predicted Cutoff</th>
                            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">Range</th>
                            <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Trend</th>
                            <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roundPredictions.map((p, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                              <td className="py-2 px-3 font-medium">
                                <Badge variant="outline" className="text-xs border-pink-500/30 text-pink-400">{p.round}</Badge>
                              </td>
                              <td className="py-2 px-3 text-right font-semibold tabular-nums text-pink-300">
                                {p.predicted_cutoff.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-right text-xs text-muted-foreground tabular-nums">
                                {p.confidence_low.toLocaleString()} – {p.confidence_high.toLocaleString()}
                              </td>
                              <td className="py-2 px-3 text-center"><TrendBadge trend={p.trend} pct={p.trend_pct} /></td>
                              <td className="py-2 px-3 text-center"><ConfidenceBadge level={p.confidence_level} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="bg-amber-500/5 border-amber-500/20">
                  <Info className="h-4 w-4 text-amber-400" />
                  <AlertDescription className="text-xs text-muted-foreground">
                    Cutoff ranks typically increase (relax) from Round 1 to Round 3. R1 is the most competitive. The round-drift model
                    predicts this relaxation pattern based on historical multi-year data.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <Card className="bg-white/[0.03] border-white/10 border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-3">
                  <Layers className="h-12 w-12 text-violet-400/30" />
                  <p className="text-muted-foreground text-sm">Run a prediction first to compare across rounds</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ TAB: Accuracy / Backtest ═══ */}
          <TabsContent value="accuracy" className="space-y-4 mt-0">
            <Card className="bg-gradient-to-br from-emerald-500/[0.05] to-blue-500/[0.03] border-emerald-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  Prediction Accuracy Backtest
                </CardTitle>
                <CardDescription>
                  Measures how accurately the engine would have predicted the most recent year's cutoffs
                  using only older data. This is real validation — not theoretical.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={runBacktest}
                  disabled={backtesting}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white shadow-lg shadow-emerald-500/20"
                >
                  {backtesting ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Running backtest...</>
                  ) : (
                    <><Shield className="h-4 w-4 mr-2" /> Run Backtest</>
                  )}
                </Button>

                {backtestResults && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">Combos Tested</div>
                        <div className="text-2xl font-bold text-foreground">{backtestResults.testedCombos.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">of {backtestResults.totalCombos.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">Median Error</div>
                        <div className="text-2xl font-bold text-emerald-400">{backtestResults.medianErrorPct}%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">90th Percentile Error</div>
                        <div className="text-2xl font-bold text-amber-400">{backtestResults.p90ErrorPct}%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">Coverage Rate</div>
                        <div className="text-2xl font-bold text-blue-400">{backtestResults.coverageRate}%</div>
                        <div className="text-xs text-muted-foreground">actuals in band</div>
                      </div>
                    </div>

                    {/* Sample predictions */}
                    {backtestResults.sampleErrors.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Sample Predictions vs Actuals</div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Combo</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Actual</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Predicted</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">Error</th>
                              </tr>
                            </thead>
                            <tbody>
                              {backtestResults.sampleErrors.map((s, i) => (
                                <tr key={i} className="border-b border-white/5">
                                  <td className="py-2 px-3 font-mono text-xs">{s.combo}</td>
                                  <td className="py-2 px-3 text-right tabular-nums">{s.actual.toLocaleString()}</td>
                                  <td className="py-2 px-3 text-right tabular-nums text-violet-300">{s.predicted.toLocaleString()}</td>
                                  <td className={`py-2 px-3 text-right tabular-nums ${s.errorPct <= 10 ? 'text-emerald-400' : s.errorPct <= 25 ? 'text-amber-400' : 'text-red-400'}`}>
                                    {s.errorPct}%
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* How it works */}
            <Card className="bg-white/[0.03] border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-violet-400" />
                  How the Prediction Engine Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { layer: "1", name: "Participation Normalization", desc: "Adjusts ranks for yearly candidate count growth (240K→288K)" },
                    { layer: "2", name: "Log-Scale Regression", desc: "Weighted regression on log-transformed ranks — handles exponential distributions" },
                    { layer: "3", name: "Peer-College Transfer", desc: "Borrows trends from similar colleges offering the same branch" },
                    { layer: "4", name: "Cross-Branch Signal", desc: "Detects college-level effects from other branches at the same college" },
                    { layer: "5", name: "Round-Drift Model", desc: "Predicts R1→R2→R3 cutoff relaxation patterns" },
                    { layer: "6", name: "Category Ratio Model", desc: "Anchors rare categories (STK, 3BK) to stable GM ratios" },
                    { layer: "7", name: "Ensemble + Confidence", desc: "Combines all signals with Bayesian confidence bands" },
                  ].map(l => (
                    <div key={l.layer} className="flex gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-xs font-bold text-violet-400">
                        {l.layer}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{l.name}</div>
                        <div className="text-xs text-muted-foreground">{l.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default CutoffPredictor

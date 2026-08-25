import { SEO } from "@/components/SEO"
import AdUnit from "@/components/AdUnit"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Slider } from "@/components/ui/slider"
import { getCourseCategoryGroup, isValidCourseName } from "@/lib/course-normalization"
import {
  ResponsiveContainer, BarChart, Bar, LineChart as RechartsLineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip as RechartsTooltip, Cell, Legend
} from "recharts"
import {
  Target, Info, Loader2, Shield, AlertTriangle, Check, ChevronsUpDown,
  Layers, CheckCircle2, XCircle, BarChart3, Clock, ArrowUpRight,
  Calculator, Database, LineChart, TrendingUp
} from "lucide-react"
import {
  predictR2R3,
  predictAllBranches,
  predictAllCategories,
  getCollegesWithR1Data,
  getBranchesWithR1Data,
  getCategoriesWithR1Data,
  get2026ForecastSamples,
  checkRoundEligibility,
  backtestRoundDrift,
  type RoundDriftPrediction,
  type CollegeOption,
  type BranchOption,
  type DriftEvidence,
} from "@/lib/round-drift-predictor"

// ────────────────────────────────────────────────────────────────
//  KCET Category List
// ────────────────────────────────────────────────────────────────
const KCET_CATEGORIES = [
  { code: "GM", label: "General Merit" },
  { code: "GMK", label: "GM Kannada" },
  { code: "GMR", label: "GM Rural" },
  { code: "1G", label: "Cat 1G" },
  { code: "1K", label: "Cat 1K" },
  { code: "1R", label: "Cat 1R" },
  { code: "2AG", label: "Cat 2AG" },
  { code: "2AK", label: "Cat 2AK" },
  { code: "2AR", label: "Cat 2AR" },
  { code: "2BG", label: "Cat 2BG" },
  { code: "2BK", label: "Cat 2BK" },
  { code: "2BR", label: "Cat 2BR" },
  { code: "3AG", label: "Cat 3AG" },
  { code: "3AK", label: "Cat 3AK" },
  { code: "3AR", label: "Cat 3AR" },
  { code: "3BG", label: "Cat 3BG" },
  { code: "3BK", label: "Cat 3BK" },
  { code: "3BR", label: "Cat 3BR" },
  { code: "SCG", label: "SC General" },
  { code: "SCK", label: "SC Kannada" },
  { code: "SCR", label: "SC Rural" },
  { code: "STG", label: "ST General" },
  { code: "STK", label: "ST Kannada" },
  { code: "STR", label: "ST Rural" },
]

// ────────────────────────────────────────────────────────────────
//  Sub-Components
// ────────────────────────────────────────────────────────────────

/** Confidence badge */
const ConfidenceBadge = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const config = {
    high: { color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: Shield, label: "High Confidence" },
    medium: { color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: AlertTriangle, label: "Medium" },
    low: { color: "bg-red-500/15 text-red-400 border-red-500/30", icon: Info, label: "Low" },
  }[level]
  const Icon = config.icon
  return (
    <Badge variant="outline" className={`${config.color} gap-1 px-2.5 py-0.5 text-[11px]`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

/** Eligibility status badge */
const EligBadge = ({ status }: { status: 'safe' | 'borderline' | 'unlikely' }) => {
  const config = {
    safe: { bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400", icon: CheckCircle2, label: "Safe" },
    borderline: { bg: "bg-amber-500/15 border-amber-500/30 text-amber-400", icon: AlertTriangle, label: "Borderline" },
    unlikely: { bg: "bg-red-500/15 border-red-500/30 text-red-400", icon: XCircle, label: "Unlikely" },
  }[status]
  const Icon = config.icon
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${config.bg}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </div>
  )
}

/** Round progression card */
const RoundCard = ({
  round,
  rank,
  low,
  high,
  changePct,
  driftRatio,
  isActual,
  changeLabel = "from R1",
}: {
  round: string
  rank: number
  low?: number
  high?: number
  changePct?: number
  driftRatio?: number
  isActual?: boolean
  changeLabel?: string
}) => (
  <div className={`relative rounded-lg border p-5 flex flex-col items-center space-y-3 ${isActual
      ? 'bg-primary/5 border-primary/30'
      : 'bg-card border-border'
    }`}>
    {isActual && (
      <Badge variant="outline" className="absolute -top-2.5 bg-background text-primary text-[10px] px-2 py-0 border-primary/30 font-semibold">
        ACTUAL
      </Badge>
    )}
    {!isActual && (
      <Badge variant="outline" className="absolute -top-2.5 bg-background text-fuchsia-400 text-[10px] px-2 py-0 border-fuchsia-500/30 font-semibold">
        PREDICTED
      </Badge>
    )}
    <div className="text-sm font-medium text-muted-foreground">{round}</div>
    <div className={`text-3xl md:text-4xl font-bold tabular-nums ${isActual ? 'text-primary' : 'text-foreground'
      }`}>
      {rank.toLocaleString('en-IN')}
    </div>
    {low !== undefined && high !== undefined && (
      <div className="text-[11px] text-muted-foreground tabular-nums font-mono">
        Range: {low.toLocaleString('en-IN')} – {high.toLocaleString('en-IN')}
      </div>
    )}
    {changePct !== undefined && changePct !== 0 && (
      <div className={`flex items-center gap-1 text-xs font-medium ${changePct > 0 ? 'text-emerald-400' : 'text-red-400'
        }`}>
        <ArrowUpRight className="h-3 w-3" />
        {changePct > 0 ? '+' : ''}{changePct}% {changeLabel}
      </div>
    )}
    {driftRatio !== undefined && (
      <div className="text-[10px] text-muted-foreground/60 font-mono">
        ×{driftRatio.toFixed(3)}
      </div>
    )}
  </div>
)

type BacktestSample = {
  combo: string
  r1_actual: number
  r2_actual: number
  r2_predicted: number
  r2_error_pct: number
  r3_actual: number | null
  r3_predicted: number
  r3_error_pct: number | null
}

const HistoricalSampleTable = ({ year, samples }: { year: number; samples: BacktestSample[] }) => (
  <section>
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <h3 className="text-sm font-semibold text-foreground">Sample: predicted vs actual ({year})</h3>
      <span className="text-xs text-muted-foreground">Uses only data available before {year}</span>
    </div>
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Combination</th>
            <th className="px-3 py-2 text-right font-medium">R1</th>
            <th className="px-3 py-2 text-right font-medium">R2 actual</th>
            <th className="px-3 py-2 text-right font-medium">R2 predicted</th>
            <th className="px-3 py-2 text-right font-medium">R2 error</th>
            <th className="px-3 py-2 text-right font-medium">R3 actual</th>
            <th className="px-3 py-2 text-right font-medium">R3 predicted</th>
            <th className="px-3 py-2 text-right font-medium">R3 error</th>
          </tr>
        </thead>
        <tbody>
          {samples.map((sample, index) => (
            <tr key={`${sample.combo}-${index}`} className="border-t border-border">
              <td className="max-w-[240px] truncate px-3 py-2 font-mono">{sample.combo}</td>
              <td className="px-3 py-2 text-right tabular-nums">{sample.r1_actual.toLocaleString('en-IN')}</td>
              <td className="px-3 py-2 text-right tabular-nums">{sample.r2_actual.toLocaleString('en-IN')}</td>
              <td className="px-3 py-2 text-right tabular-nums text-primary">{sample.r2_predicted.toLocaleString('en-IN')}</td>
              <td className={`px-3 py-2 text-right tabular-nums ${sample.r2_error_pct <= 10 ? 'text-emerald-500' : sample.r2_error_pct <= 25 ? 'text-amber-500' : 'text-destructive'}`}>{sample.r2_error_pct}%</td>
              <td className="px-3 py-2 text-right tabular-nums">{sample.r3_actual?.toLocaleString('en-IN') ?? '—'}</td>
              <td className="px-3 py-2 text-right tabular-nums text-primary">{sample.r3_predicted.toLocaleString('en-IN')}</td>
              <td className={`px-3 py-2 text-right tabular-nums ${sample.r3_error_pct === null ? 'text-muted-foreground' : sample.r3_error_pct <= 10 ? 'text-emerald-500' : sample.r3_error_pct <= 25 ? 'text-amber-500' : 'text-destructive'}`}>{sample.r3_error_pct === null ? '—' : `${sample.r3_error_pct}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)

const ForecastSampleTable = ({ forecasts }: { forecasts: RoundDriftPrediction[] }) => (
  <section>
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <h3 className="text-sm font-semibold text-foreground">Current 2026 Round 3 Forecast Sample</h3>
      <span className="text-xs text-muted-foreground">R1 & R2 are live actuals; R3 is high-precision forecast</span>
    </div>
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-xs">
        <thead className="bg-muted/40 text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left font-medium">Combination</th>
            <th className="px-3 py-2 text-right font-medium text-blue-400">R1 Actual</th>
            <th className="px-3 py-2 text-right font-medium text-violet-400">R2 Actual / Est</th>
            <th className="px-3 py-2 text-right font-medium text-fuchsia-400">R3 Forecast</th>
            <th className="px-3 py-2 text-center font-medium">Confidence</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(forecast => (
            <tr key={`${forecast.college_code}-${forecast.normalized_course}-${forecast.category}`} className="border-t border-border">
              <td className="max-w-[240px] truncate px-3 py-2 font-mono">{forecast.college_code} | {forecast.normalized_course} | {forecast.category}</td>
              <td className="px-3 py-2 text-right tabular-nums">{forecast.r1_actual.toLocaleString('en-IN')}</td>
              <td className="px-3 py-2 text-right tabular-nums font-semibold text-violet-400">
                {forecast.r2_predicted.toLocaleString('en-IN')} {forecast.is_r2_actual ? '(Actual)' : ''}
              </td>
              <td className="px-3 py-2 text-right tabular-nums font-semibold text-fuchsia-400">{forecast.r3_predicted.toLocaleString('en-IN')}</td>
              <td className="px-3 py-2 text-center"><ConfidenceBadge level={forecast.confidence_level} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
)

// ────────────────────────────────────────────────────────────────
//  Main Page Component
// ────────────────────────────────────────────────────────────────

const RoundPredictor = () => {
  // Loading state
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)

  // Available options
  const [colleges, setColleges] = useState<CollegeOption[]>([])
  const [branches, setBranches] = useState<BranchOption[]>([])
  const [categories, setCategories] = useState<string[]>([])

  // Selected inputs
  const [selectedCollege, setSelectedCollege] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("GM")
  const [neetMultiplier, setNeetMultiplier] = useState<number>(1.0)
  const [collegeSearchOpen, setCollegeSearchOpen] = useState(false)
  const [collegeSearch, setCollegeSearch] = useState("")

  // Results
  const [prediction, setPrediction] = useState<RoundDriftPrediction | null>(null)
  const [allBranchPredictions, setAllBranchPredictions] = useState<RoundDriftPrediction[]>([])

  // Eligibility checker
  const [userRank, setUserRank] = useState("")

  // Active tab
  const [activeTab, setActiveTab] = useState("predict")

  // Backtest
  const [backtestResults, setBacktestResults] = useState<Awaited<ReturnType<typeof backtestRoundDrift>> | null>(null)
  const [backtest2024, setBacktest2024] = useState<Awaited<ReturnType<typeof backtestRoundDrift>> | null>(null)
  const [forecast2026, setForecast2026] = useState<RoundDriftPrediction[]>([])
  const [backtesting, setBacktesting] = useState(false)

  // ── Load initial data ──
  useEffect(() => {
    async function init() {
      try {
        const c = await getCollegesWithR1Data()
        setColleges(c)
      } catch (e) {
        console.error("Failed to load round predictor data", e)
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
      setCategories([])
      return
    }
    async function loadBranches() {
      const b = await getBranchesWithR1Data(selectedCollege)
      const validBranches = b.filter(x => isValidCourseName(x.normalized))
      setBranches(validBranches)
      if (validBranches.length > 0 && !validBranches.find(x => x.normalized === selectedBranch)) {
        setSelectedBranch(validBranches[0].normalized)
      }
    }
    loadBranches()
  }, [selectedCollege])

  // ── Grouped branch options for structured UI dropdown ──
  const groupedBranches = useMemo(() => {
    const groups: Record<string, BranchOption[]> = {}
    branches.forEach(b => {
      const category = getCourseCategoryGroup(b.normalized)
      if (!groups[category]) groups[category] = []
      groups[category].push(b)
    })
    return Object.entries(groups)
  }, [branches])

  // ── Load categories when branch changes ──
  useEffect(() => {
    if (!selectedCollege || !selectedBranch) {
      setCategories([])
      return
    }
    async function loadCats() {
      const cats = await getCategoriesWithR1Data(selectedCollege, selectedBranch)
      setCategories(cats)
      if (cats.length > 0 && !cats.includes(selectedCategory)) {
        setSelectedCategory(cats.includes('GM') ? 'GM' : cats[0])
      }
    }
    loadCats()
  }, [selectedCollege, selectedBranch])

  // ── Run prediction ──
  const runPrediction = useCallback(async () => {
    if (!selectedCollege || !selectedBranch || !selectedCategory) return
    setPredicting(true)
    setPrediction(null)
    setAllBranchPredictions([])

    try {
      const [p, allB] = await Promise.all([
        predictR2R3(selectedCollege, selectedBranch, selectedCategory, neetMultiplier),
        predictAllBranches(selectedCollege, selectedCategory, neetMultiplier),
      ])
      setPrediction(p)
      setAllBranchPredictions(allB)
    } catch (e) {
      console.error("Round prediction failed", e)
    } finally {
      setPredicting(false)
    }
  }, [selectedCollege, selectedBranch, selectedCategory, neetMultiplier])

  // ── Auto-run prediction when selections or slider changes ──
  useEffect(() => {
    if (selectedCollege && selectedBranch && selectedCategory) {
      async function run() {
        try {
          const [p, allB] = await Promise.all([
            predictR2R3(selectedCollege, selectedBranch, selectedCategory, neetMultiplier),
            predictAllBranches(selectedCollege, selectedCategory, neetMultiplier),
          ])
          setPrediction(p)
          setAllBranchPredictions(allB)
        } catch (e) {
          console.error("Round prediction failed", e)
        }
      }
      run()
    }
  }, [selectedCollege, selectedBranch, selectedCategory, neetMultiplier])

  // ── Eligibility results ──
  const eligibility = useMemo(() => {
    if (!prediction || !userRank) return null
    const rank = parseInt(userRank)
    if (isNaN(rank) || rank <= 0) return null
    return checkRoundEligibility(prediction, rank)
  }, [prediction, userRank])

  // ── Chart data for all branches ──
  const branchChartData = useMemo(() => {
    return allBranchPredictions.slice(0, 15).map(p => ({
      name: p.normalized_course.length > 20 ? p.normalized_course.substring(0, 18) + '…' : p.normalized_course,
      fullName: p.normalized_course,
      R1: p.r1_actual,
      R2: p.r2_predicted,
      R3: p.r3_predicted,
    }))
  }, [allBranchPredictions])

  // ── Multi-year trend chart data ──
  const trendChartData = useMemo(() => {
    if (!prediction) return []
    const data = prediction.historical_evidence
      .filter(ev => ev.r1 !== null || ev.r2 !== null || ev.r3 !== null)
      .map(ev => ({
        year: ev.year,
        "Round 1": ev.r1,
        "Round 2": ev.r2,
        "Round 3": ev.r3,
      }))
    data.push({
      year: "2026 (Est)",
      "Round 1": prediction.r1_actual,
      "Round 2": prediction.r2_predicted,
      "Round 3": prediction.r3_predicted,
    })
    return data
  }, [prediction])

  // ── Filtered colleges for search ──
  const filteredColleges = useMemo(() => {
    if (!collegeSearch.trim()) return colleges.slice(0, 30)
    const q = collegeSearch.toLowerCase()
    return colleges
      .filter(c => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .slice(0, 30)
  }, [collegeSearch, colleges])

  // ── Backtest ──
  const runBacktest = useCallback(async () => {
    setBacktesting(true)
    try {
      const [result2024, result2025, currentForecasts] = await Promise.all([
        backtestRoundDrift(2024),
        backtestRoundDrift(2025),
        get2026ForecastSamples(),
      ])
      setBacktest2024(result2024)
      setBacktestResults(result2025)
      setForecast2026(currentForecasts)
    } catch (e) {
      console.error("Backtest failed", e)
    } finally {
      setBacktesting(false)
    }
  }, [])

  // ────────────────────────────────────────────────────────────────
  //  Render
  // ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-400" />
          <p className="text-muted-foreground">Loading 200K+ cutoff records...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <SEO
        title="Round 2 & 3 Cutoff Predictor | KCET Coded"
        description="Predict KCET 2026 Round 2 and Round 3 cutoffs using actual R1 data + 3 years of historical round-drift patterns. R1-anchored predictions for utmost accuracy."
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                KCET 2026 Round 2 & 3 estimates
              </h1>
              <p className="text-sm text-muted-foreground">
                R1-anchored • 200K+ data points • 3 years of historical drift analysis
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <Alert className="bg-muted/40 border-border rounded-lg">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs text-muted-foreground">
            <strong className="text-amber-400">Disclaimer:</strong> These are <strong>statistical estimates</strong> based on 2026 R1 actual data + 2023–2025 historical round-drift patterns.
            Not official KEA data. Actual R2/R3 cutoffs may vary due to seat changes, option entry patterns, and policy decisions.
            <span className="block mt-1 text-[10px] text-muted-foreground/60">
              <Clock className="inline h-3 w-3 mr-1" />
              Data source: kcet_cutoffs_consolidated.dat (199,951 records) • Generated {new Date().toLocaleDateString('en-IN')}
            </span>
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="h-auto rounded-lg bg-muted p-1">
            <TabsTrigger value="predict" className="rounded-md px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <Calculator className="h-4 w-4 mr-1.5" /> Estimate
            </TabsTrigger>
            <TabsTrigger value="all-branches" className="rounded-md px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <BarChart3 className="h-4 w-4 mr-1.5" /> All Branches
            </TabsTrigger>
            <TabsTrigger value="trends" className="rounded-md px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <TrendingUp className="h-4 w-4 mr-1.5" /> Cutoff Trends
            </TabsTrigger>
            <TabsTrigger value="accuracy" className="rounded-md px-3 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
              <LineChart className="h-4 w-4 mr-1.5" /> Validation
            </TabsTrigger>
          </TabsList>

          {/* ═══ Input Controls ═══ */}
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="pt-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* College Selector */}
                <div className="lg:col-span-2 space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">College</Label>
                  <Popover open={collegeSearchOpen} onOpenChange={setCollegeSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={collegeSearchOpen}
                        className="w-full justify-between bg-background border-input hover:bg-muted text-left h-10 font-normal"
                      >
                        {selectedCollege
                          ? `${selectedCollege} - ${colleges.find(c => c.code === selectedCollege)?.name || ''}`.substring(0, 50)
                          : "Search college..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
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
                                className="cursor-pointer"
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${selectedCollege === c.code ? "opacity-100 text-primary" : "opacity-0"}`}
                                />
                                <span className="text-xs font-mono text-primary mr-2">{c.code}</span>
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
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Branch</Label>
                    {branches.length > 0 && (
                      <span className="text-[10px] text-violet-400 font-mono font-medium">{branches.length} branches</span>
                    )}
                  </div>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="bg-background border-input h-10">
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[320px]">
                      {groupedBranches.map(([groupName, items], index) => (
                        <SelectGroup key={groupName}>
                          {index > 0 && <SelectSeparator className="my-1 border-border/40" />}
                          <SelectLabel className="text-[10px] font-bold uppercase tracking-wider text-violet-400 px-2 py-1 bg-violet-500/10 rounded-sm my-0.5">
                            {groupName}
                          </SelectLabel>
                          {items.map(b => (
                            <SelectItem key={b.normalized} value={b.normalized} className="text-xs py-2 cursor-pointer">
                              {b.normalized}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-background border-input h-10">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px]">
                      {KCET_CATEGORIES.filter(c => categories.includes(c.code)).map(c => (
                        <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>
                      ))}
                      {/* Also show categories from data not in KCET_CATEGORIES */}
                      {categories.filter(c => !KCET_CATEGORIES.find(k => k.code === c)).map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* NEET Surrender Wave / Seat Release Factor Section */}
              <div className="border-t border-white/5 pt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                <div className="lg:col-span-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      NEET / PCMB Seat Surrender Multiplier
                    </Label>
                    <Badge variant="secondary" className="bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs px-1.5 font-mono">
                      {neetMultiplier.toFixed(2)}x
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Adjusts predictions upwards (more relaxed cutoffs) to account for students surrendering engineering seats for medical (NEET) seats.
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Slider
                      value={[neetMultiplier]}
                      onValueChange={(val) => setNeetMultiplier(val[0])}
                      min={1.0}
                      max={1.3}
                      step={0.01}
                      className="flex-1"
                    />
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="sm"
                        variant={neetMultiplier === 1.0 ? "default" : "outline"}
                        onClick={() => setNeetMultiplier(1.0)}
                        className="text-[10px] h-7 px-2"
                      >
                        Neutral (1.0x)
                      </Button>
                      <Button
                        size="sm"
                        variant={neetMultiplier === 1.05 ? "default" : "outline"}
                        onClick={() => setNeetMultiplier(1.05)}
                        className="text-[10px] h-7 px-2"
                      >
                        Moderate (1.05x)
                      </Button>
                      <Button
                        size="sm"
                        variant={neetMultiplier === 1.15 ? "default" : "outline"}
                        onClick={() => setNeetMultiplier(1.15)}
                        className="text-[10px] h-7 px-2"
                      >
                        High Wave (1.15x)
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground/70 leading-tight pt-0.5">
                    Seat surrender multiplier was developed from the suggestions taken from u/tbh_smarty and u/SamVerse11.
                  </p>
                </div>
                <div className="flex justify-end lg:col-span-1 pt-2 lg:pt-0">
                  <Button
                    onClick={runPrediction}
                    disabled={!selectedCollege || !selectedBranch || predicting}
                    className="w-full h-10 px-6 font-semibold shadow-sm"
                  >
                    {predicting ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Estimating...</>
                    ) : (
                      "⚡ Estimate Cutoffs"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unconditional Ad Placement */}
          <AdUnit className="my-4" />

          {/* ═══ TAB: Predict ═══ */}
          <TabsContent value="predict" className="space-y-4 mt-0">
            {predicting && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-3">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-400" />
                  <p className="text-sm text-muted-foreground">Computing drift ratios from 200K+ records...</p>
                </div>
              </div>
            )}

            {prediction && !predicting && (
              <div className="space-y-6">
                {/* R1 → R2 → R3 Progression (3 Equal Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <RoundCard
                    round="Round 1 (Actual)"
                    rank={prediction.r1_actual}
                    isActual
                  />
                  <RoundCard
                    round={prediction.is_r2_actual ? "Round 2 (Provisional)" : "Round 2"}
                    rank={prediction.r2_predicted}
                    low={prediction.is_r2_actual ? undefined : prediction.r2_low}
                    high={prediction.is_r2_actual ? undefined : prediction.r2_high}
                    changePct={prediction.r2_change_pct}
                    driftRatio={prediction.r2_drift_ratio}
                    isActual={prediction.is_r2_actual}
                    changeLabel="from R1"
                  />
                  <RoundCard
                    round="Round 3 (Forecast)"
                    rank={prediction.r3_predicted}
                    low={prediction.r3_low}
                    high={prediction.r3_high}
                    changePct={prediction.is_r2_actual ? prediction.r3_change_pct_from_r2 : prediction.r3_change_pct}
                    driftRatio={prediction.is_r2_actual ? prediction.r3_r2_drift_ratio : prediction.r3_drift_ratio}
                    changeLabel={prediction.is_r2_actual ? "from R2" : "from R1"}
                  />
                </div>

                {/* Details & Rank Check (2 Equal Cards Below) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Meta Info */}
                  <Card className="bg-card border-border shadow-sm">
                    <CardContent className="pt-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <Database className="h-4 w-4 text-primary" />
                          Estimate Basis & Anchoring
                        </div>
                        <ConfidenceBadge level={prediction.confidence_level} />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                          <div className="text-[11px] text-muted-foreground font-medium">Data Points</div>
                          <div className="text-xl font-bold text-foreground mt-0.5">{prediction.data_points}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                          <div className="text-[11px] text-muted-foreground font-medium">R2/R1 Ratio</div>
                          <div className="text-xl font-bold text-violet-300 mt-0.5 font-mono">×{prediction.r2_drift_ratio.toFixed(3)}</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                          <div className="text-[11px] text-muted-foreground font-medium">R3/R2 Shift</div>
                          <div className="text-xl font-bold text-fuchsia-300 mt-0.5 font-mono">×{(prediction.r3_r2_drift_ratio || (prediction.r3_predicted / prediction.r2_predicted)).toFixed(3)}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground/80 flex items-center gap-1.5 pt-1">
                        <Info className="h-3.5 w-3.5 flex-shrink-0 text-violet-400" />
                        <span>Drift Source: <strong className="text-foreground">{prediction.drift_source}</strong></span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Eligibility Checker */}
                <Card className="bg-card border-border shadow-sm">
                    <CardContent className="pt-5 space-y-4">
                      <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Target className="h-4 w-4 text-primary" />
                        Check Your Rank Chances
                      </div>
                      <Input
                        type="number"
                        placeholder="Enter your KCET rank..."
                        value={userRank}
                        onChange={e => setUserRank(e.target.value)}
                        className="bg-background border-input h-10 text-sm"
                      />
                      {eligibility ? (
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          <div className="text-center space-y-1">
                            <div className="text-[11px] text-muted-foreground font-medium">Round 1</div>
                            <EligBadge status={eligibility.r1} />
                          </div>
                          <div className="text-center space-y-1">
                            <div className="text-[11px] text-muted-foreground font-medium">Round 2</div>
                            <EligBadge status={eligibility.r2} />
                          </div>
                          <div className="text-center space-y-1">
                            <div className="text-[11px] text-muted-foreground font-medium">Round 3</div>
                            <EligBadge status={eligibility.r3} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground text-center py-2">
                          Type your rank above to instantly see your admission chance in R1, R2, & R3
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Cutoff Trend Graph inside Predict tab */}
                {trendChartData.length > 0 && (
                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-violet-400" />
                        Cutoff Trend Graph (2023–2026) — {prediction.college_code} • {prediction.normalized_course} ({selectedCategory})
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {trendChartData.length > 1
                          ? "Multi-year rank progression across Round 1, Round 2, and Round 3. Higher numbers reflect cutoff rank relaxation."
                          : "New branch or college introduced in 2026 (no prior historical cutoffs recorded for 2023–2025)."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart data={trendChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                            <XAxis dataKey="year" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                            <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} domain={['auto', 'auto']} />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#18181b',
                                border: '1px solid rgba(255,255,255,0.15)',
                                borderRadius: '8px',
                                fontSize: '12px'
                              }}
                              formatter={(value: number) => [value ? value.toLocaleString() : 'N/A', 'Rank']}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="Round 1"
                              stroke="#3b82f6"
                              strokeWidth={2.5}
                              dot={{ fill: '#3b82f6', r: 5 }}
                              activeDot={{ r: 7 }}
                              connectNulls={true}
                            />
                            <Line
                              type="monotone"
                              dataKey="Round 2"
                              stroke="#8b5cf6"
                              strokeWidth={2.5}
                              dot={{ fill: '#8b5cf6', r: 5 }}
                              activeDot={{ r: 7 }}
                              connectNulls={true}
                            />
                            <Line
                              type="monotone"
                              dataKey="Round 3"
                              stroke="#d946ef"
                              strokeWidth={2.5}
                              dot={{ fill: '#d946ef', r: 5 }}
                              activeDot={{ r: 7 }}
                              connectNulls={true}
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Historical Drift Evidence */}
                {prediction.historical_evidence.length > 0 && (
                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="h-4 w-4 text-violet-400" />
                        Historical Evidence — {prediction.college_code} • {prediction.normalized_course} • {prediction.category}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Actual R1/R2/R3 cutoffs from previous years used to compute drift ratios
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Year</th>
                              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R1</th>
                              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R2</th>
                              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R3</th>
                              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R2/R1</th>
                              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R3/R2</th>
                              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R3/R1</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prediction.historical_evidence.map((ev, i) => (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                                <td className="py-2 px-3 font-medium">{ev.year}</td>
                                <td className="py-2 px-3 text-right tabular-nums text-blue-300">{ev.r1?.toLocaleString('en-IN') || '—'}</td>
                                <td className="py-2 px-3 text-right tabular-nums text-violet-300">{ev.r2?.toLocaleString('en-IN') || '—'}</td>
                                <td className="py-2 px-3 text-right tabular-nums text-fuchsia-300">{ev.r3?.toLocaleString('en-IN') || '—'}</td>
                                <td className="py-2 px-3 text-right tabular-nums text-emerald-400 text-xs">
                                  {ev.r2_r1_ratio ? `×${ev.r2_r1_ratio.toFixed(3)}` : '—'}
                                </td>
                                <td className="py-2 px-3 text-right tabular-nums text-emerald-400 text-xs">
                                  {ev.r3_r2_ratio ? `×${ev.r3_r2_ratio.toFixed(3)}` : '—'}
                                </td>
                                <td className="py-2 px-3 text-right tabular-nums text-emerald-400 text-xs">
                                  {ev.r3_r1_ratio ? `×${ev.r3_r1_ratio.toFixed(3)}` : '—'}
                                </td>
                              </tr>
                            ))}
                            {/* Add 2026 predicted row */}
                            <tr className="border-t border-violet-500/20 bg-violet-500/[0.05]">
                              <td className="py-2 px-3 font-bold text-violet-400">2026</td>
                              <td className="py-2 px-3 text-right tabular-nums text-blue-400 font-semibold">{prediction.r1_actual.toLocaleString('en-IN')}</td>
                              <td className="py-2 px-3 text-right tabular-nums text-violet-400 font-semibold">{prediction.r2_predicted.toLocaleString('en-IN')} *</td>
                              <td className="py-2 px-3 text-right tabular-nums text-fuchsia-400 font-semibold">{prediction.r3_predicted.toLocaleString('en-IN')} *</td>
                              <td className="py-2 px-3 text-right tabular-nums text-emerald-300 text-xs font-semibold">×{prediction.r2_drift_ratio.toFixed(3)}</td>
                              <td className="py-2 px-3 text-right tabular-nums text-muted-foreground text-xs">—</td>
                              <td className="py-2 px-3 text-right tabular-nums text-emerald-300 text-xs font-semibold">×{prediction.r3_drift_ratio.toFixed(3)}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="text-[10px] text-muted-foreground/50 mt-2">* Predicted values</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {!prediction && !predicting && (
              <Card className="bg-muted/20 border-border border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-3">
                  <Layers className="h-12 w-12 text-violet-400/30" />
                  <p className="text-muted-foreground text-sm text-center max-w-md">
                    Select a college, branch, and category, then click ⚡ to predict Round 2 & 3 cutoffs based on actual 2026 R1 data + historical drift patterns.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ TAB: All Branches ═══ */}
          <TabsContent value="all-branches" className="space-y-4 mt-0">
            {allBranchPredictions.length > 0 ? (
              <div className="space-y-4">
                {/* Chart */}
                {branchChartData.length > 0 && (
                  <Card className="bg-card border-border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        All Branches at {prediction?.college_code} ({selectedCategory}) — R1 vs R2 vs R3
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={branchChartData} layout="vertical" margin={{ left: 100, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis type="number" tick={{ fill: '#888', fontSize: 10 }} />
                            <YAxis
                              dataKey="name"
                              type="category"
                              tick={{ fill: '#888', fontSize: 10 }}
                              width={100}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: '#1a1a2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                fontSize: '12px'
                              }}
                              formatter={(value: number, name: string) => [value.toLocaleString(), name]}
                            />
                            <Legend />
                            <Bar dataKey="R1" fill="#60a5fa" radius={[0, 2, 2, 0]} fillOpacity={0.8} />
                            <Bar dataKey="R2" fill="#8b5cf6" radius={[0, 2, 2, 0]} fillOpacity={0.8} />
                            <Bar dataKey="R3" fill="#d946ef" radius={[0, 2, 2, 0]} fillOpacity={0.8} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Table */}
                  <Card className="bg-card border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-violet-400" />
                      All Branches — Detailed R1 → R2 → R3
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Branch</th>
                            <th className="text-right py-2 px-3 text-xs text-blue-400 font-medium">R1 (Actual)</th>
                            <th className="text-right py-2 px-3 text-xs text-violet-400 font-medium">R2 (Predicted)</th>
                            <th className="text-right py-2 px-3 text-xs text-fuchsia-400 font-medium">R3 (Predicted)</th>
                            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R2 Change</th>
                            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R3 Change</th>
                            <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">Confidence</th>
                            {userRank && <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">R2 Chance</th>}
                            {userRank && <th className="text-center py-2 px-3 text-xs text-muted-foreground font-medium">R3 Chance</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {allBranchPredictions.map((p, i) => {
                            const elig = userRank ? checkRoundEligibility(p, parseInt(userRank)) : null
                            return (
                              <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                <td className="py-2.5 px-3 text-xs font-medium">{p.normalized_course}</td>
                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums text-blue-300">
                                  {p.r1_actual.toLocaleString('en-IN')}
                                </td>
                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums text-violet-300">
                                  {p.r2_predicted.toLocaleString('en-IN')}
                                </td>
                                <td className="py-2.5 px-3 text-right font-semibold tabular-nums text-fuchsia-300">
                                  {p.r3_predicted.toLocaleString('en-IN')}
                                </td>
                                <td className={`py-2.5 px-3 text-right text-xs tabular-nums ${p.r2_change_pct > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {p.r2_change_pct > 0 ? '+' : ''}{p.r2_change_pct}%
                                </td>
                                <td className={`py-2.5 px-3 text-right text-xs tabular-nums ${p.r3_change_pct > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {p.r3_change_pct > 0 ? '+' : ''}{p.r3_change_pct}%
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <ConfidenceBadge level={p.confidence_level} />
                                </td>
                                {userRank && elig && (
                                  <td className="py-2.5 px-3 text-center"><EligBadge status={elig.r2} /></td>
                                )}
                                {userRank && elig && (
                                  <td className="py-2.5 px-3 text-center"><EligBadge status={elig.r3} /></td>
                                )}
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
                <Card className="bg-muted/20 border-border border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-3">
                  <BarChart3 className="h-12 w-12 text-violet-400/30" />
                  <p className="text-muted-foreground text-sm">Run a prediction first to see all branches</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ TAB: Cutoff Trends ═══ */}
          <TabsContent value="trends" className="space-y-4 mt-0">
            {prediction ? (
              <div className="space-y-4">
                <Card className="bg-card border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-violet-400" />
                        Multi-Year Cutoff Rank Trend Graph (2023–2026)
                      </span>
                      <Badge variant="outline" className="text-xs font-mono">
                        {prediction.college_code} • {prediction.normalized_course} ({selectedCategory})
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Historical rank progression across Round 1, Round 2, and Round 3. Higher numbers indicate rank relaxation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="h-[380px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart data={trendChartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                          <XAxis dataKey="year" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                          <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} domain={['auto', 'auto']} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: '#18181b',
                              border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '8px',
                              fontSize: '12px'
                            }}
                            formatter={(value: number) => [value ? value.toLocaleString() : 'N/A', 'Rank']}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="Round 1"
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            dot={{ fill: '#3b82f6', r: 5 }}
                            activeDot={{ r: 7 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Round 2"
                            stroke="#8b5cf6"
                            strokeWidth={2.5}
                            dot={{ fill: '#8b5cf6', r: 5 }}
                            activeDot={{ r: 7 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Round 3"
                            stroke="#d946ef"
                            strokeWidth={2.5}
                            dot={{ fill: '#d946ef', r: 5 }}
                            activeDot={{ r: 7 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Evidence table */}
                <Card className="bg-card border-border shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4 text-violet-400" />
                      Historical Cutoff Ranks & Round Multipliers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-2 px-3 text-xs text-muted-foreground font-medium">Year</th>
                            <th className="text-right py-2 px-3 text-xs text-blue-400 font-medium">Round 1</th>
                            <th className="text-right py-2 px-3 text-xs text-violet-400 font-medium">Round 2</th>
                            <th className="text-right py-2 px-3 text-xs text-fuchsia-400 font-medium">Round 3</th>
                            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R2/R1 Multiplier</th>
                            <th className="text-right py-2 px-3 text-xs text-muted-foreground font-medium">R3/R1 Multiplier</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prediction.historical_evidence.map((ev, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.03]">
                              <td className="py-2.5 px-3 font-semibold text-foreground">{ev.year}</td>
                              <td className="py-2.5 px-3 text-right tabular-nums text-blue-300">{ev.r1?.toLocaleString('en-IN') || '—'}</td>
                              <td className="py-2.5 px-3 text-right tabular-nums text-violet-300">{ev.r2?.toLocaleString('en-IN') || '—'}</td>
                              <td className="py-2.5 px-3 text-right tabular-nums text-fuchsia-300">{ev.r3?.toLocaleString('en-IN') || '—'}</td>
                              <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 text-xs">
                                {ev.r2_r1_ratio ? `×${ev.r2_r1_ratio.toFixed(3)}` : '—'}
                              </td>
                              <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 text-xs">
                                {ev.r3_r1_ratio ? `×${ev.r3_r1_ratio.toFixed(3)}` : '—'}
                              </td>
                            </tr>
                          ))}
                          <tr className="border-t border-violet-500/30 bg-violet-500/[0.08]">
                            <td className="py-2.5 px-3 font-bold text-violet-300">2026</td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-blue-400 font-semibold">{prediction.r1_actual.toLocaleString('en-IN')} (Actual)</td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-violet-400 font-semibold">
                              {prediction.r2_predicted.toLocaleString('en-IN')} {prediction.is_r2_actual ? '(Actual)' : ''}
                            </td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-fuchsia-400 font-semibold">{prediction.r3_predicted.toLocaleString('en-IN')} (Forecast)</td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 text-xs font-semibold">×{prediction.r2_drift_ratio.toFixed(3)}</td>
                            <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 text-xs font-semibold">×{prediction.r3_drift_ratio.toFixed(3)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-card border-border border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 space-y-3">
                  <TrendingUp className="h-12 w-12 text-violet-400/30" />
                  <p className="text-muted-foreground text-sm">Select a college, branch, and category to view its cutoff trend graphs</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* ═══ TAB: Accuracy ═══ */}
          <TabsContent value="accuracy" className="space-y-4 mt-0">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  Backtest Accuracy
                </CardTitle>
                <CardDescription>
                  Uses 2025 R1 actual data to "predict" 2025 R2 & R3 using drift ratios from 2023–2024, then compares against actual 2025 R2/R3 cutoffs.
                  This gives you transparent evidence of how accurate these predictions really are.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {prediction && (
                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-foreground">Current 2026 forecast</div>
                        <div className="text-xs text-muted-foreground">
                          {prediction.college_code} · {prediction.normalized_course} · {prediction.category}
                        </div>
                      </div>
                      <Badge variant="outline" className="border-primary/30 text-primary">2026</Badge>
                    </div>
                    <div className="grid grid-cols-3 divide-x divide-border rounded-md border border-border bg-background">
                      <div className="px-3 py-2.5 text-center">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">R1 actual</div>
                        <div className="mt-1 text-lg font-semibold tabular-nums text-foreground">{prediction.r1_actual.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="px-3 py-2.5 text-center">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{prediction.is_r2_actual ? "R2 actual" : "R2 estimate"}</div>
                        <div className="mt-1 text-lg font-semibold tabular-nums text-primary">{prediction.r2_predicted.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="px-3 py-2.5 text-center">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">R3 forecast</div>
                        <div className="mt-1 text-lg font-semibold tabular-nums text-foreground">{prediction.r3_predicted.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  onClick={runBacktest}
                  disabled={backtesting}
                  className="shadow-sm"
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
                        <div className="text-2xl font-bold text-foreground">{backtestResults.tested.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">R2 Median Error</div>
                        <div className="text-2xl font-bold text-emerald-400">{backtestResults.r2_median_error_pct}%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">R3 Median Error</div>
                        <div className="text-2xl font-bold text-emerald-400">{backtestResults.r3_median_error_pct}%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">R2 Coverage</div>
                        <div className="text-2xl font-bold text-blue-400">{backtestResults.r2_coverage_rate}%</div>
                        <div className="text-xs text-muted-foreground">actuals in range</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">R2 P90 Error</div>
                        <div className="text-xl font-bold text-amber-400">{backtestResults.r2_p90_error_pct}%</div>
                        <div className="text-xs text-muted-foreground">worst 10%</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 text-center border border-white/5">
                        <div className="text-xs text-muted-foreground">R3 P90 Error</div>
                        <div className="text-xl font-bold text-amber-400">{backtestResults.r3_p90_error_pct}%</div>
                        <div className="text-xs text-muted-foreground">worst 10%</div>
                      </div>
                    </div>

                    {/* Sample predictions */}
                    {backtestResults.samples.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-2">Sample: Predicted vs Actual (2025)</div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b border-white/10">
                                <th className="text-left py-2 px-3 text-muted-foreground font-medium">Combo</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">R1</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">R2 Actual</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">R2 Predicted</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">R2 Error</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">R3 Actual</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">R3 Predicted</th>
                                <th className="text-right py-2 px-3 text-muted-foreground font-medium">R3 Error</th>
                              </tr>
                            </thead>
                            <tbody>
                              {backtestResults.samples.map((s, i) => (
                                <tr key={i} className="border-b border-white/5">
                                  <td className="py-2 px-3 font-mono text-xs max-w-[200px] truncate">{s.combo}</td>
                                  <td className="py-2 px-3 text-right tabular-nums">{s.r1_actual.toLocaleString('en-IN')}</td>
                                  <td className="py-2 px-3 text-right tabular-nums">{s.r2_actual.toLocaleString('en-IN')}</td>
                                  <td className="py-2 px-3 text-right tabular-nums text-violet-300">{s.r2_predicted.toLocaleString('en-IN')}</td>
                                  <td className={`py-2 px-3 text-right tabular-nums ${s.r2_error_pct <= 10 ? 'text-emerald-400' : s.r2_error_pct <= 25 ? 'text-amber-400' : 'text-red-400'}`}>
                                    {s.r2_error_pct}%
                                  </td>
                                  <td className="py-2 px-3 text-right tabular-nums">{s.r3_actual?.toLocaleString('en-IN') || '—'}</td>
                                  <td className="py-2 px-3 text-right tabular-nums text-fuchsia-300">{s.r3_predicted.toLocaleString('en-IN')}</td>
                                  <td className={`py-2 px-3 text-right tabular-nums ${s.r3_error_pct === null ? '' : s.r3_error_pct <= 10 ? 'text-emerald-400' : s.r3_error_pct <= 25 ? 'text-amber-400' : 'text-red-400'
                                    }`}>
                                    {s.r3_error_pct !== null ? `${s.r3_error_pct}%` : '—'}
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

            {(backtest2024 || forecast2026.length > 0) && (
              <Card className="bg-card border-border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Historical and current sample checks</CardTitle>
                  <CardDescription>
                    Historical rows compare predictions with published cutoffs. The 2026 rows show the live forecast, where only Round 1 is currently actual.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {backtest2024 && <HistoricalSampleTable year={2024} samples={backtest2024.samples} />}
                  {forecast2026.length > 0 && <ForecastSampleTable forecasts={forecast2026} />}
                </CardContent>
              </Card>
            )}

            {/* How it works */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  Method and data hierarchy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      step: "1",
                      name: "Take Actual 2026 R1 Cutoff",
                      desc: "Start from the real R1 rank — no regression or estimation. This eliminates the largest source of error.",
                      color: "border-border bg-muted/30"
                    },
                    {
                      step: "2",
                      name: "Compute Historical Drift Ratios",
                      desc: "For each year (2023, 2024, 2025), compute R2/R1 and R3/R2 ratios for the same college+branch+category combo.",
                      color: "border-border bg-muted/30"
                    },
                    {
                      step: "3",
                      name: "Weighted Average (Recent > Older)",
                      desc: "2025 data gets 3× weight, 2024 gets 2×, 2023 gets 1×. Recent patterns matter more.",
                      color: "border-border bg-muted/30"
                    },
                    {
                      step: "4",
                      name: "5-Layer Fallback Hierarchy",
                      desc: "Exact combo → GM fallback → Branch+Category global → Branch global → All-data global. Ensures predictions even for rare combos.",
                      color: "border-border bg-muted/30"
                    },
                    {
                      step: "5",
                      name: "Confidence Bands",
                      desc: "Width based on data availability, ratio stability, and whether fallbacks were used. Wider = less certain.",
                      color: "border-border bg-muted/30"
                    },
                  ].map(s => (
                    <div key={s.step} className={`flex gap-3 p-3 rounded-md border ${s.color}`}>
                      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {s.step}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Professional Analytical Disclaimer */}
        <div className="mt-8 rounded-xl border border-border/60 bg-muted/20 p-5 md:p-6 text-xs text-muted-foreground space-y-3 leading-relaxed">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Shield className="h-4 w-4 text-primary" />
            <span>Analytical Methodology &amp; Counseling Limitations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div>
              <span className="font-semibold text-foreground block mb-1">Empirical Projections</span>
              Round 2 and Round 3 projections are statistical estimates derived from multi-year historical relaxation trends (2023–2025) applied to published 2026 Round 1 actuals. They represent mathematical expectations and do not constitute official allotment guarantees by the Karnataka Examinations Authority (KEA).
            </div>
            <div>
              <span className="font-semibold text-foreground block mb-1">Low-Volume Quota Volatility</span>
              In specialized reserved categories (such as Rural, Kannada Medium, or specific sub-category quotas), colleges frequently allocate only 1 or 2 seats per academic year. In such low-volume permutations, individual candidate decisions create random variance that trend modeling cannot fully anticipate.
            </div>
            <div>
              <span className="font-semibold text-foreground block mb-1">Strategic Counseling Guidance</span>
              These projections are structured as diagnostic reference points to assist in logical option entry sequencing, rather than definitive boundaries. Candidates are strictly advised to retain conservative safety choices regardless of favorable probability bands and to verify all seat matrices directly through official KEA releases.
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RoundPredictor

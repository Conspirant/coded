import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Search, TrendingUp, TrendingDown, Minus, Sparkles, Target,
  BarChart3, Info, Loader2, CheckCircle2, AlertTriangle, XCircle,
  ArrowUpRight, ArrowDownRight, ChevronDown, ChevronUp, Calculator,
  Zap, ShieldCheck, ShieldAlert, Shield
} from "lucide-react"
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Area, AreaChart
} from "recharts"
import {
  predictMultiple,
  checkEligibility,
  getAvailableColleges,
  getAvailableCategories,
  getAvailableRounds,
  type CutoffPrediction,
  type CollegeOption,
} from "@/lib/cutoff-predictor"

// ── Chart Colors ──
const CHART_COLORS = [
  "#818cf8", "#f472b6", "#34d399", "#fbbf24",
  "#60a5fa", "#a78bfa", "#fb923c", "#2dd4bf",
]

// ── Mini Sparkline for branch cards ──
const Sparkline = ({ data, color = "#818cf8" }: { data: number[]; color?: string }) => {
  if (data.length < 2) return null
  const h = 32, w = 72
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w
    const y = ((d - min) / range) * h
    return `${x},${y}`
  }).join(" ")

  return (
    <div className="relative" style={{ width: w, height: h }}>
      <svg width={w} height={h} className="overflow-visible">
        <defs>
          <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * w
          const y = ((d - min) / range) * h
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3.5}
              fill={color}
              stroke="#0f0f23"
              strokeWidth={2}
            />
          )
        })}
      </svg>
    </div>
  )
}

// ── Confidence Badge ──
const ConfidenceBadge = ({ level }: { level: 'high' | 'medium' | 'low' }) => {
  const config = {
    high: { icon: ShieldCheck, label: "High Confidence", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    medium: { icon: Shield, label: "Medium", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    low: { icon: ShieldAlert, label: "Low", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  }
  const { icon: Icon, label, cls } = config[level]
  return (
    <Badge variant="outline" className={`text-[10px] gap-1 px-2 py-0.5 ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

// ── Trend Badge ──
const TrendBadge = ({ trend, pct }: { trend: 'rising' | 'falling' | 'stable'; pct: number }) => {
  if (trend === 'rising') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
        <ArrowUpRight className="h-3.5 w-3.5" /> +{Math.abs(pct)}%
      </span>
    )
  }
  if (trend === 'falling') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
        <ArrowDownRight className="h-3.5 w-3.5" /> -{Math.abs(pct)}%
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-white/5 px-2 py-0.5 rounded-full">
      <Minus className="h-3.5 w-3.5" /> Stable
    </span>
  )
}

// ── Eligibility Indicator ──
const EligibilityBadge = ({ level }: { level: 'high' | 'moderate' | 'borderline' | 'unlikely' }) => {
  const config = {
    high: { icon: CheckCircle2, label: "High Chance", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    moderate: { icon: Target, label: "Moderate", cls: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
    borderline: { icon: AlertTriangle, label: "Borderline", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    unlikely: { icon: XCircle, label: "Unlikely", cls: "text-red-400 bg-red-500/10 border-red-500/20" },
  }
  const { icon: Icon, label, cls } = config[level]
  return (
    <Badge variant="outline" className={`text-[10px] gap-1 px-2 py-0.5 ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

// ── Custom Tooltip ──
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-strong rounded-xl border border-white/10 p-4 shadow-2xl min-w-[200px]">
      <p className="font-bold text-sm mb-2">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 text-sm py-1">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground truncate max-w-[140px]">{entry.name}</span>
          </span>
          <span className="font-bold tabular-nums">{Number(entry.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════
// Main Component
// ════════════════════════════════════════════════════════════════════

const CutoffPredictor = () => {
  // Data loading
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [colleges, setColleges] = useState<CollegeOption[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [rounds, setRounds] = useState<string[]>([])

  // User inputs
  const [collegeSearch, setCollegeSearch] = useState("")
  const [selectedCollege, setSelectedCollege] = useState<CollegeOption | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("GM")
  const [selectedRound, setSelectedRound] = useState("R2")
  const [userRank, setUserRank] = useState<number | "">("")

  // Results
  const [predictions, setPredictions] = useState<CutoffPrediction[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)

  // ── Load reference data ──
  useEffect(() => {
    async function load() {
      try {
        const [cols, cats, rnds] = await Promise.all([
          getAvailableColleges(),
          getAvailableCategories(),
          getAvailableRounds(),
        ])
        setColleges(cols)
        setCategories(cats)
        setRounds(rnds)
        if (cats.includes("GM")) setSelectedCategory("GM")
        if (rnds.includes("R2")) setSelectedRound("R2")
      } catch (e) {
        console.error("Failed to load predictor data", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Debounced college search ──
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(collegeSearch), 180)
    return () => clearTimeout(t)
  }, [collegeSearch])

  const filteredColleges = useMemo(() => {
    if (!debouncedSearch.trim()) return []
    const q = debouncedSearch.toLowerCase()
    return colleges
      .filter(c =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
      )
      .slice(0, 12)
  }, [debouncedSearch, colleges])

  // ── Predict ──
  const handlePredict = useCallback(async () => {
    if (!selectedCollege) return
    setPredicting(true)
    setHasSearched(true)
    try {
      const results = await predictMultiple(
        selectedCollege.code,
        selectedCategory,
        selectedRound,
        2026
      )
      setPredictions(results)
    } catch (e) {
      console.error("Prediction failed", e)
      setPredictions([])
    } finally {
      setPredicting(false)
    }
  }, [selectedCollege, selectedCategory, selectedRound])

  // ── Eligibility-enhanced predictions ──
  const enrichedPredictions = useMemo(() => {
    if (!userRank || typeof userRank !== 'number') return predictions.map(p => ({ ...p, eligibility: undefined as 'high' | 'moderate' | 'borderline' | 'unlikely' | undefined }))
    return checkEligibility(predictions, userRank)
  }, [predictions, userRank])

  // ── Chart data ──
  const chartData = useMemo(() => {
    if (predictions.length === 0) return []
    // Collect all years
    const yearSet = new Set<string>()
    predictions.forEach(p => p.historical.forEach(h => yearSet.add(h.year)))
    yearSet.add("2026")
    const years = [...yearSet].sort()

    return years.map(year => {
      const point: Record<string, string | number> = { year }
      predictions.slice(0, 8).forEach((p, idx) => {
        const hist = p.historical.find(h => h.year === year)
        if (hist) {
          point[`line_${idx}`] = hist.rank
        } else if (year === "2026") {
          point[`line_${idx}`] = p.predicted_cutoff
        }
      })
      return point
    })
  }, [predictions])

  // ════════════════════════════════════════════════════════════════════
  // Render
  // ════════════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-indigo-400" />
          <p className="text-sm text-muted-foreground">Loading cutoff data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-scale-in max-w-7xl mx-auto">
      <SEO
        title="KCET Cutoff Predictor – Predict 2026 Cutoffs for Any College & Branch"
        description="Predict the expected KCET 2026 cutoff rank for any college-branch-category combination using 3 years of historical data. See trends, confidence bands, and check your eligibility instantly."
        url="https://kcet-coded2.vercel.app/cutoff-predictor"
        keywords="KCET cutoff prediction, KCET 2026 cutoff, predict KCET cutoff rank, KCET college cutoff forecast, KCET branch cutoff predictor, KCET cutoff analysis"
      />

      {/* ── Hero Header ── */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cutoff Predictor</h1>
            <p className="text-sm text-muted-foreground">Predict 2026 cutoffs for any college + branch</p>
          </div>
          <Badge className="ml-auto bg-violet-500/10 text-violet-400 border-violet-500/20 text-[10px]">Beta</Badge>
        </div>
      </div>

      {/* ── Input Controls ── */}
      <Card className="glass border-white/5 overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="h-5 w-5 text-violet-400" />
            Select College & Filters
          </CardTitle>
          <CardDescription>
            Search for a college, pick your category and round, then hit predict.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          {/* College search */}
          <div className="relative space-y-2">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">College</Label>
            {selectedCollege ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-violet-300">{selectedCollege.code}</div>
                  <div className="text-sm text-white/80 truncate">{selectedCollege.name}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSelectedCollege(null); setCollegeSearch(""); setPredictions([]); setHasSearched(false) }}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9 bg-white/5 border-white/10 text-base sm:text-sm"
                    placeholder="Type college name or code (e.g., RVCE, E045)..."
                    value={collegeSearch}
                    onChange={e => setCollegeSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                {filteredColleges.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 glass-strong rounded-xl border border-white/10 shadow-2xl max-h-[50vh] sm:max-h-64 overflow-y-auto overscroll-contain" style={{ top: '100%' }}>
                    {filteredColleges.map(c => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setSelectedCollege(c)
                          setCollegeSearch("")
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-violet-500/10 transition-colors border-b border-white/5 last:border-0"
                      >
                        <div className="font-semibold text-sm text-violet-400">{c.code}</div>
                        <div className="text-sm text-white/80 truncate">{c.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Filters row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Round</Label>
              <Select value={selectedRound} onValueChange={setSelectedRound}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rounds.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground/60">R2 is the most representative round.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Rank <span className="text-muted-foreground/40">(optional)</span></Label>
              <Input
                type="number"
                placeholder="e.g. 15000"
                className="bg-white/5 border-white/10 font-mono"
                value={userRank}
                onChange={e => {
                  const v = e.target.value
                  setUserRank(v === "" ? "" : Math.max(1, parseInt(v) || 0))
                }}
              />
              <p className="text-[10px] text-muted-foreground/60">Enter rank to check eligibility.</p>
            </div>
          </div>

          <Button
            onClick={handlePredict}
            disabled={!selectedCollege || predicting}
            className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold shadow-lg shadow-violet-600/20 h-11 px-8 text-sm gap-2"
          >
            {predicting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Predict 2026 Cutoffs
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ── Results ── */}
      {predicting && (
        <Card className="glass border-white/5">
          <CardContent className="py-12 text-center space-y-4">
            <Loader2 className="h-8 w-8 mx-auto animate-spin text-violet-400" />
            <p className="text-sm text-muted-foreground">Crunching 3 years of data...</p>
            <Progress value={65} className="max-w-xs mx-auto" />
          </CardContent>
        </Card>
      )}

      {!predicting && hasSearched && predictions.length === 0 && (
        <Card className="glass border-white/5">
          <CardContent className="py-12 text-center space-y-3">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold">No Data Found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              No historical cutoff data found for <strong>{selectedCollege?.code}</strong> with
              category <strong>{selectedCategory}</strong> in round <strong>{selectedRound}</strong>.
              Try changing the category or round.
            </p>
          </CardContent>
        </Card>
      )}

      {!predicting && predictions.length > 0 && (
        <div className="space-y-6">
          {/* Summary bar */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="bg-violet-500/10 text-violet-300 border-violet-500/20 text-sm px-3 py-1">
              {selectedCollege?.code}
            </Badge>
            <Badge variant="outline" className="text-xs">{selectedCategory}</Badge>
            <Badge variant="outline" className="text-xs">{selectedRound}</Badge>
            <span className="text-sm text-muted-foreground ml-auto">
              {predictions.length} branch{predictions.length !== 1 ? 'es' : ''} predicted
            </span>
          </div>

          {/* ── Branch Prediction Cards ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrichedPredictions.map((p, idx) => {
              const color = CHART_COLORS[idx % CHART_COLORS.length]
              const historicalRanks = p.historical.map(h => h.rank)

              return (
                <Card
                  key={`${p.course}-${idx}`}
                  className="glass border-white/5 hover:border-white/10 transition-all group relative overflow-hidden"
                >
                  {/* Accent stripe */}
                  <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ backgroundColor: color }} />

                  <CardContent className="p-5 pl-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm truncate" title={p.normalized_course}>
                          {p.normalized_course}
                        </h3>
                        <p className="text-[10px] text-muted-foreground/60 truncate mt-0.5" title={p.course}>
                          {p.course}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                        <ConfidenceBadge level={p.confidence_level} />
                        {p.eligibility && <EligibilityBadge level={p.eligibility} />}
                      </div>
                    </div>

                    {/* Predicted cutoff */}
                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Predicted 2026 Cutoff</p>
                        <p className="text-3xl font-bold tabular-nums" style={{ color }}>
                          {p.predicted_cutoff.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Range: {p.confidence_low.toLocaleString()} – {p.confidence_high.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <TrendBadge trend={p.trend} pct={p.trend_pct} />
                        <Sparkline data={historicalRanks} color={color} />
                      </div>
                    </div>

                    {/* Historical data row */}
                    <div className="grid grid-cols-3 gap-2">
                      {p.historical.map(h => (
                        <div key={h.year} className="p-2 rounded-lg bg-white/5 text-center">
                          <p className="text-[9px] text-muted-foreground uppercase">{h.year}</p>
                          <p className="text-sm font-bold tabular-nums">{h.rank.toLocaleString()}</p>
                        </div>
                      ))}
                      <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20 text-center">
                        <p className="text-[9px] text-violet-400 uppercase font-semibold">2026</p>
                        <p className="text-sm font-bold tabular-nums text-violet-300">
                          {p.predicted_cutoff.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* ── Trend Chart ── */}
          {chartData.length > 0 && predictions.length > 0 && (
            <Card className="glass border-white/5 overflow-hidden">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-violet-400" />
                  Cutoff Trend Visualization
                </CardTitle>
                <CardDescription>
                  Historical cutoffs + 2026 predictions • {selectedCategory} • {selectedRound}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] sm:h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -5, bottom: 5 }}>
                      <defs>
                        {predictions.slice(0, 8).map((_, idx) => {
                          const color = CHART_COLORS[idx % CHART_COLORS.length]
                          return (
                            <linearGradient key={`g${idx}`} id={`cp_gradient_${idx}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={color} stopOpacity={predictions.length <= 2 ? 0.3 : 0.1} />
                              <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                          )
                        })}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis
                        dataKey="year"
                        tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 500 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                        tickLine={false}
                        dy={8}
                      />
                      <YAxis
                        tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toString()}
                        width={52}
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      {predictions.slice(0, 8).map((p, idx) => (
                        <Area
                          key={`${p.course}-${idx}`}
                          type="monotone"
                          dataKey={`line_${idx}`}
                          name={p.normalized_course}
                          stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                          fill={`url(#cp_gradient_${idx})`}
                          strokeWidth={predictions.length <= 2 ? 3 : 2}
                          dot={{
                            r: 5,
                            fill: CHART_COLORS[idx % CHART_COLORS.length],
                            strokeWidth: 3,
                            stroke: "#0f0f23",
                          }}
                          activeDot={{ r: 7, strokeWidth: 3, stroke: "#0f0f23" }}
                          connectNulls
                          animationDuration={800}
                          animationEasing="ease-out"
                        />
                      ))}
                      {/* User rank reference line */}
                      {userRank && typeof userRank === 'number' && (
                        <Area
                          type="monotone"
                          dataKey={() => userRank}
                          name="Your Rank"
                          stroke="#ef4444"
                          strokeWidth={1.5}
                          strokeDasharray="6 4"
                          fill="none"
                          dot={false}
                          activeDot={false}
                        />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend for predictions */}
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/5">
                  {predictions.slice(0, 8).map((p, idx) => (
                    <div key={`${p.course}-legend-${idx}`} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                      />
                      <span className="truncate max-w-[120px]" title={p.normalized_course}>{p.normalized_course}</span>
                    </div>
                  ))}
                  {userRank && typeof userRank === 'number' && (
                    <div className="flex items-center gap-2 text-xs text-red-400">
                      <span className="w-2.5 h-0.5 bg-red-400 rounded flex-shrink-0" style={{ borderTop: '1.5px dashed' }} />
                      Your Rank ({userRank.toLocaleString()})
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Eligibility Summary ── */}
          {userRank && typeof userRank === 'number' && enrichedPredictions.length > 0 && (
            <Card className="glass border-white/5">
              <CardHeader className="border-b border-white/5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Eligibility Summary for Rank {userRank.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {(['high', 'moderate', 'borderline', 'unlikely'] as const).map(level => {
                    const count = enrichedPredictions.filter(p => p.eligibility === level).length
                    const config = {
                      high: { label: "High Chance", icon: CheckCircle2, cls: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20", textCls: "text-emerald-400" },
                      moderate: { label: "Moderate", icon: Target, cls: "from-blue-500/10 to-blue-500/5 border-blue-500/20", textCls: "text-blue-400" },
                      borderline: { label: "Borderline", icon: AlertTriangle, cls: "from-amber-500/10 to-amber-500/5 border-amber-500/20", textCls: "text-amber-400" },
                      unlikely: { label: "Unlikely", icon: XCircle, cls: "from-red-500/10 to-red-500/5 border-red-500/20", textCls: "text-red-400" },
                    }
                    const c = config[level]
                    return (
                      <div key={level} className={`p-4 rounded-xl bg-gradient-to-br ${c.cls} border text-center`}>
                        <c.icon className={`h-5 w-5 mx-auto mb-2 ${c.textCls}`} />
                        <p className={`text-2xl font-bold ${c.textCls}`}>{count}</p>
                        <p className="text-xs text-muted-foreground">{c.label}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* ── Methodology ── */}
      <Card className="glass border-white/5">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors rounded-xl"
        >
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-violet-400" />
            <span className="font-semibold text-sm">Methodology & Disclaimer</span>
          </div>
          {showMethodology ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </button>
        {showMethodology && (
          <CardContent className="pt-0 pb-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl bg-white/5 space-y-2">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-violet-400" /> Algorithm
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>• <strong>3+ years data:</strong> Weighted linear regression (recent years weighted 2×–4× more)</li>
                  <li>• <strong>2 years data:</strong> Weighted average (60% recent, 40% older) with trend projection</li>
                  <li>• <strong>1 year data:</strong> Single data point with 15% uncertainty band</li>
                </ul>
              </div>
              <div className="p-4 rounded-xl bg-white/5 space-y-2">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> Confidence Levels
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li>• <strong className="text-emerald-400">High:</strong> 3+ years of data — narrow confidence band</li>
                  <li>• <strong className="text-amber-400">Medium:</strong> 2 years of data — wider confidence band</li>
                  <li>• <strong className="text-red-400">Low:</strong> 1 year only — large uncertainty</li>
                </ul>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-muted-foreground">
              <strong className="text-amber-400">⚠ Disclaimer:</strong> Predictions are statistical estimates based on historical
              KCET cutoff data (2023–2025). Actual 2026 cutoffs will depend on exam difficulty, candidate volume,
              seat changes, and other factors not captured in this model. Always verify with official KEA documents.
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Empty State ── */}
      {!hasSearched && !predicting && (
        <Card className="glass border-white/5">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-violet-400/60" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Predict Cutoffs for Any College</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Search for a college above, select your category and round, then hit <strong>Predict</strong> to
              see projected 2026 cutoff ranks for all branches with trend analysis and confidence bands.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default CutoffPredictor

import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend, Area, AreaChart
} from "recharts"
import {
  TrendingUp, TrendingDown, Search, Info, BarChart3,
  Loader2, ArrowUpRight, ArrowDownRight, Minus, Plus, X, Sparkles
} from "lucide-react"
import { CutoffService, type CutoffData } from "@/lib/cutoff-service"
import { normalizeCourseName } from "@/lib/course-normalization"

interface TrendPoint {
  year: string
  [key: string]: string | number | undefined
}

interface CollegeBranchCombo {
  collegeCode: string
  collegeName: string
  branch: string
  rawCourses: string[]  // all raw course names that map to this normalized branch
  key: string
}

// Color palette for multi-line charts
const CHART_COLORS = [
  "#818cf8", // indigo-400
  "#f472b6", // pink-400
  "#34d399", // emerald-400
  "#fbbf24", // amber-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#fb923c", // orange-400
  "#2dd4bf", // teal-400
]

const CutoffTrends = () => {
  const [cutoffs, setCutoffs] = useState<CutoffData[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [collegeSearch, setCollegeSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("GM")
  const [selectedRound, setSelectedRound] = useState("R2")

  // Selected combos to chart
  const [selectedCombos, setSelectedCombos] = useState<CollegeBranchCombo[]>([])

  // Available options
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableRounds, setAvailableRounds] = useState<string[]>([])
  const [availableYears, setAvailableYears] = useState<string[]>([])

  // Load data
  useEffect(() => {
    async function load() {
      try {
        const data = await CutoffService.loadCutoffs()
        setCutoffs(data)

        const cats = [...new Set(data.map(c => c.category))].sort()
        const rounds = [...new Set(data.map(c => c.round))].sort((a, b) => {
          const na = parseInt(a.replace(/\D/g, '')) || 0
          const nb = parseInt(b.replace(/\D/g, '')) || 0
          return na - nb
        })
        const years = [...new Set(data.map(c => c.year))].sort()

        setAvailableCategories(cats)
        setAvailableRounds(rounds)
        setAvailableYears(years)

        if (cats.includes("GM")) setSelectedCategory("GM")
        else if (cats.length > 0) setSelectedCategory(cats[0])

        if (rounds.includes("R2")) setSelectedRound("R2")
        else if (rounds.length > 0) setSelectedRound(rounds[rounds.length - 1])
      } catch (e) {
        console.error("Failed to load cutoffs", e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Build searchable college-branch list (normalized across years)
  const allCombos = useMemo<CollegeBranchCombo[]>(() => {
    const map = new Map<string, CollegeBranchCombo>()
    cutoffs.forEach(c => {
      const normalized = normalizeCourseName(c.course)
      const key = `${c.institute_code}|${normalized}`
      if (!map.has(key)) {
        map.set(key, {
          collegeCode: c.institute_code,
          collegeName: c.college_name || c.institute_code,
          branch: normalized,
          rawCourses: [c.course],
          key,
        })
      } else {
        const existing = map.get(key)!
        if (c.college_name && existing.collegeName === c.institute_code) {
          existing.collegeName = c.college_name
        }
        // Track all raw course name variants that map to this normalized name
        if (!existing.rawCourses.includes(c.course)) {
          existing.rawCourses.push(c.course)
        }
      }
    })
    return Array.from(map.values()).sort((a, b) => a.collegeCode.localeCompare(b.collegeCode))
  }, [cutoffs])

  // Debounced search for performance on low-end devices
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(collegeSearch), 200)
    return () => clearTimeout(t)
  }, [collegeSearch])

  // Filter combos by search
  const filteredCombos = useMemo(() => {
    if (!debouncedSearch.trim()) return []
    const q = debouncedSearch.toLowerCase()
    return allCombos
      .filter(c =>
        c.collegeName.toLowerCase().includes(q) ||
        c.collegeCode.toLowerCase().includes(q) ||
        c.branch.toLowerCase().includes(q)
      )
      .slice(0, 10)
  }, [debouncedSearch, allCombos])

  // Build chart data
  const chartData = useMemo<TrendPoint[]>(() => {
    if (selectedCombos.length === 0) return []

    const dataMap = new Map<string, TrendPoint>()
    availableYears.forEach(y => {
      dataMap.set(y, { year: y })
    })

    selectedCombos.forEach((combo, idx) => {
      // Match against all raw course name variants that map to this normalized branch
      const relevant = cutoffs.filter(c =>
        c.institute_code === combo.collegeCode &&
        combo.rawCourses.includes(c.course) &&
        c.category === selectedCategory &&
        c.round === selectedRound
      )

      relevant.forEach(c => {
        const point = dataMap.get(c.year)
        if (point) {
          const lineKey = `line_${idx}`
          const existing = point[lineKey] as number | undefined
          // If multiple rounds, use highest cutoff (most relaxed)
          if (!existing || c.cutoff_rank > existing) {
            point[lineKey] = c.cutoff_rank
          }
        }
      })
    })

    return Array.from(dataMap.values()).sort((a, b) => a.year.localeCompare(b.year))
  }, [selectedCombos, cutoffs, selectedCategory, selectedRound, availableYears])

  // Trend analysis per combo
  const trendAnalysis = useMemo(() => {
    return selectedCombos.map((combo, idx) => {
      const lineKey = `line_${idx}`
      const points = chartData
        .filter(d => d[lineKey] != null)
        .map(d => ({ year: d.year, rank: d[lineKey] as number }))

      if (points.length < 2) return { combo, direction: "neutral" as const, change: 0, points }

      const first = points[0].rank
      const last = points[points.length - 1].rank
      const change = last - first
      const pct = first > 0 ? ((change / first) * 100).toFixed(1) : "0"
      const direction = change > 0 ? "up" as const : change < 0 ? "down" as const : "neutral" as const

      return { combo, direction, change, pct, points, first, last }
    })
  }, [selectedCombos, chartData])

  const addCombo = useCallback((combo: CollegeBranchCombo) => {
    if (selectedCombos.length >= 8) return
    if (selectedCombos.find(c => c.key === combo.key)) return
    setSelectedCombos(prev => [...prev, combo])
    setCollegeSearch("")
  }, [selectedCombos])

  const removeCombo = useCallback((key: string) => {
    setSelectedCombos(prev => prev.filter(c => c.key !== key))
  }, [])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="glass-strong rounded-xl border border-white/10 p-4 shadow-2xl min-w-[240px]">
        <p className="font-bold text-sm mb-2">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center justify-between gap-4 text-sm py-1">
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground truncate max-w-[180px]" title={entry.name}>{entry.name}</span>
            </span>
            <span className="font-bold tabular-nums flex-shrink-0">{Number(entry.value).toLocaleString()}</span>
          </div>
        ))}
      </div>
    )
  }

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
    <div className="space-y-6 animate-scale-in">
      <SEO
        title="KCET Cutoff Trends – Year-over-Year College Branch Analysis"
        description="Visualize how KCET cutoff ranks change across years for any college-branch combination. Compare trends, spot rising/falling cutoffs, and make smarter counseling decisions."
        url="https://kcetcoded.dev/cutoff-trends"
        keywords="KCET cutoff trends, cutoff rank history, year over year cutoffs, KCET college branch trends, cutoff analysis Karnataka"
      />

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cutoff Trends</h1>
            <p className="text-sm text-muted-foreground">Track how cutoff ranks move across years</p>
          </div>
          <Badge className="ml-auto bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">New</Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* College-Branch Search */}
        <div className="sm:col-span-2 space-y-2 relative">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Search College + Branch</Label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-white/5 border-white/10 text-base sm:text-sm"
              placeholder="College name, code, or branch..."
              value={collegeSearch}
              onChange={e => setCollegeSearch(e.target.value)}
            />
          </div>
          {filteredCombos.length > 0 && (
            <div className="absolute z-50 w-full mt-1 glass-strong rounded-xl border border-white/10 shadow-2xl max-h-[50vh] sm:max-h-64 overflow-y-auto overscroll-contain">
              {filteredCombos.map(combo => (
                <button
                  key={combo.key}
                  onClick={() => addCombo(combo)}
                  disabled={!!selectedCombos.find(c => c.key === combo.key)}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-500/10 transition-colors border-b border-white/5 last:border-0 disabled:opacity-40"
                >
                  <div className="font-semibold text-sm text-indigo-400">{combo.collegeCode}</div>
                  <div className="text-sm text-white/80 truncate">{combo.collegeName}</div>
                  <div className="text-xs text-muted-foreground">{combo.branch}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Round */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Round</Label>
          <Select value={selectedRound} onValueChange={setSelectedRound}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableRounds.map(r => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground/60">R2 by default. Change to compare other rounds.</p>
        </div>
      </div>

      {/* Selected combos chips */}
      {selectedCombos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCombos.map((combo, idx) => (
            <Badge
              key={combo.key}
              variant="secondary"
              className="pl-3 pr-1.5 py-1.5 gap-2 text-xs sm:text-sm border"
              style={{ borderColor: CHART_COLORS[idx % CHART_COLORS.length] + "50", backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] + "15" }}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
              <span className="truncate max-w-[140px] sm:max-w-[200px]">{combo.collegeCode} — {combo.branch}</span>
              <button onClick={() => removeCombo(combo.key)} className="ml-1 p-0.5 rounded-full hover:bg-white/10 transition-colors">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedCombos.length > 1 && (
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setSelectedCombos([])}>
              Clear All
            </Button>
          )}
        </div>
      )}

      {/* Chart */}
      {selectedCombos.length === 0 ? (
        <Card className="glass border-white/5">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-4">
              <BarChart3 className="h-8 w-8 text-indigo-400/60" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Search & Add College-Branch Combos</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Use the search above to find colleges and branches. Add up to 8 combos to see their cutoff trends charted side by side.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Main Chart Card */}
          <Card className="glass border-white/5 overflow-hidden">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                Cutoff Rank Trends
              </CardTitle>
              <CardDescription>
                {selectedCategory} category • {selectedRound} • Higher rank = easier to get in
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] sm:h-[420px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -5, bottom: 5 }}>
                    <defs>
                      {selectedCombos.map((_, idx) => {
                        const color = CHART_COLORS[idx % CHART_COLORS.length]
                        return (
                          <linearGradient key={`g${idx}`} id={`gradient_${idx}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={selectedCombos.length <= 1 ? 0.35 : 0.12} />
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
                    <Legend
                      wrapperStyle={{ paddingTop: "20px" }}
                      formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
                    />
                    {selectedCombos.map((combo, idx) => (
                      <Area
                        key={combo.key}
                        type="monotone"
                        dataKey={`line_${idx}`}
                        name={`${combo.collegeCode} \u2014 ${combo.branch}`}
                        stroke={CHART_COLORS[idx % CHART_COLORS.length]}
                        fill={`url(#gradient_${idx})`}
                        strokeWidth={selectedCombos.length <= 1 ? 3 : 2.5}
                        dot={{ r: 6, fill: CHART_COLORS[idx % CHART_COLORS.length], strokeWidth: 3, stroke: "#0f0f23" }}
                        activeDot={{ r: 8, strokeWidth: 3, stroke: "#0f0f23" }}
                        connectNulls
                        animationDuration={800}
                        animationEasing="ease-out"
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis Cards */}
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {trendAnalysis.map((analysis, idx) => {
              const color = CHART_COLORS[idx % CHART_COLORS.length]
              const hasData = analysis.points.length >= 2

              return (
                <Card key={analysis.combo.key} className="glass border-white/5 hover:border-white/10 transition-all group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                          <span className="font-bold text-sm truncate">{analysis.combo.collegeCode}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate" title={analysis.combo.branch}>{analysis.combo.branch}</p>
                        <p className="text-[10px] text-muted-foreground/60 truncate mt-0.5">{analysis.combo.collegeName}</p>
                      </div>
                      {hasData && (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                          analysis.direction === "up"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : analysis.direction === "down"
                            ? "bg-red-500/10 text-red-400"
                            : "bg-white/5 text-muted-foreground"
                        }`}>
                          {analysis.direction === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> :
                           analysis.direction === "down" ? <ArrowDownRight className="h-3.5 w-3.5" /> :
                           <Minus className="h-3.5 w-3.5" />}
                          {analysis.pct}%
                        </div>
                      )}
                    </div>

                    {hasData ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2.5 rounded-lg bg-white/5">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">First Year</p>
                            <p className="font-bold text-lg tabular-nums">{analysis.first?.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">{analysis.points[0].year}</p>
                          </div>
                          <div className="p-2.5 rounded-lg bg-white/5">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Latest</p>
                            <p className="font-bold text-lg tabular-nums">{analysis.last?.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">{analysis.points[analysis.points.length - 1].year}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {analysis.direction === "up"
                            ? "⬆ Cutoff rank increased — getting easier to get in"
                            : analysis.direction === "down"
                            ? "⬇ Cutoff rank dropped — getting more competitive"
                            : "→ Cutoff rank stayed stable"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center">
                        {analysis.points.length === 1
                          ? `Only 1 year of data (${analysis.points[0].year}: rank ${analysis.points[0].rank.toLocaleString()})`
                          : `No data for ${selectedCategory} / ${selectedRound}`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Info */}
      <Alert className="border-indigo-500/20 bg-indigo-500/5">
        <Info className="h-4 w-4 text-indigo-400" />
        <AlertDescription className="text-sm text-muted-foreground">
          <strong className="text-foreground">How to read:</strong> A rising cutoff rank means more students got seats (easier to get in).
          A falling rank means increased competition. Data spans {availableYears.join(", ")} from official KEA PDFs.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default CutoffTrends

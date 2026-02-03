import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calculator, TrendingUp, Target, AlertCircle, Download, FileText, BarChart3, PieChart, LineChart, Crown, Shield, Info, Sparkles, Search, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import {
  predictKCETRankBothYears,
  predictKCETRank,
  getPercentile,
  calculatePercentile,
  getRankAnalysis,
  getCollegeSuggestions,
  getRankGapAnalysis,
  getCutoffEstimates,
  type RankPrediction,
  type Rank2026Prediction
} from "@/lib/rank-predictor"
import { validateKCETMarks, validatePUCPercentage } from "@/lib/security"

// Animated counter hook for smooth number transitions
const useAnimatedCounter = (value: number, duration: number = 500) => {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)
  const animationRef = useRef<number>()

  useEffect(() => {
    const start = previousValue.current
    const end = value
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.round(start + (end - start) * easeOutQuart)

      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        previousValue.current = end
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration])

  return displayValue
}

// Confidence gauge component
const ConfidenceGauge = ({ low, medium, high }: { low: number; medium: number; high: number }) => {
  const maxRank = 260000
  const lowPercent = Math.min((1 - low / maxRank) * 100, 100)
  const medPercent = Math.min((1 - medium / maxRank) * 100, 100)
  const highPercent = Math.min((1 - high / maxRank) * 100, 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Better Rank</span>
        <span>Lower Rank</span>
      </div>
      <div className="relative h-4 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full overflow-hidden">
        {/* Range indicator */}
        <div
          className="absolute h-full bg-primary/30 border-2 border-primary rounded-sm"
          style={{
            left: `${100 - lowPercent}%`,
            width: `${lowPercent - highPercent}%`,
          }}
        />
        {/* Middle marker */}
        <div
          className="absolute w-1 h-6 -top-1 bg-primary shadow-lg rounded-full transform -translate-x-1/2"
          style={{ left: `${100 - medPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs font-medium">
        <span className="text-green-600">{low.toLocaleString()}</span>
        <span className="text-primary font-bold">{medium.toLocaleString()}</span>
        <span className="text-red-600">{high.toLocaleString()}</span>
      </div>
    </div>
  )
}

const RankPredictor = () => {
  const [kcetMarks, setKcetMarks] = useState(90)
  const [pucPercentage, setPucPercentage] = useState(60)
  const [prediction, setPrediction] = useState<Rank2026Prediction | null>(null)
  const [activeTab, setActiveTab] = useState("predictor")
  const [savedResults, setSavedResults] = useState<any[]>([])
  const { toast } = useToast()
  const navigate = useNavigate()

  // Animated rank display
  const animatedRank2025 = useAnimatedCounter(prediction?.rank2025 || 0, 400)
  const animatedRank2026 = useAnimatedCounter(prediction?.rank2026 || 0, 400)

  // Load saved results from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kcetResults')
      if (saved) {
        setSavedResults(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Error loading saved results:', error)
    }
  }, [])

  // Real-time prediction - auto-calculate on input change
  useEffect(() => {
    // Validate inputs silently
    const kcetValidation = validateKCETMarks(kcetMarks)
    const pucValidation = validatePUCPercentage(pucPercentage)

    if (!kcetValidation.isValid || !pucValidation.isValid) {
      setPrediction(null)
      return
    }

    try {
      const rankData = predictKCETRankBothYears(kcetMarks, pucPercentage)
      setPrediction(rankData)
    } catch (error) {
      setPrediction(null)
    }
  }, [kcetMarks, pucPercentage])

  // Save current result
  const saveResult = () => {
    if (!prediction) return

    const result = {
      cet: kcetMarks,
      puc: pucPercentage,
      rank: prediction.medium,
      range: `${prediction.low}–${prediction.high}`,
      percentile: calculatePercentile(prediction.medium),
      timestamp: new Date().toISOString()
    }

    const updatedResults = [...savedResults, result].slice(-10)
    setSavedResults(updatedResults)
    localStorage.setItem('kcetResults', JSON.stringify(updatedResults))

    toast({
      title: "Result Saved!",
      description: `Rank ${prediction.medium.toLocaleString()} saved to history`,
    })
  }

  // Navigate to College Finder with predicted rank
  const findColleges = () => {
    if (!prediction) return
    navigate(`/college-finder?rank=${prediction.rank2026}`)
  }

  const downloadPNG = () => {
    if (!prediction) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 600
    canvas.height = 400

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 400)
    gradient.addColorStop(0, '#6d28d9')
    gradient.addColorStop(1, '#4f46e5')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)'
    ctx.beginPath()
    ctx.roundRect(30, 30, 540, 340, 16)
    ctx.fill()

    // Title
    ctx.fillStyle = '#6d28d9'
    ctx.font = 'bold 28px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('KCET 2025 Rank Card', 300, 75)

    // Rank
    ctx.font = 'bold 56px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#6366f1' // indigo-500
    ctx.fillText(`${prediction.medium.toLocaleString()}`, 300, 145)

    // Subtitle
    ctx.font = '16px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText('Predicted Rank', 300, 170)

    // Details box
    ctx.fillStyle = '#f8fafc'
    ctx.beginPath()
    ctx.roundRect(50, 195, 500, 150, 12)
    ctx.fill()

    // Details
    ctx.font = '15px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#1e1b4b'
    ctx.textAlign = 'left'
    ctx.fillText(`📊 Rank Range: ${prediction.low.toLocaleString()} – ${prediction.high.toLocaleString()}`, 70, 230)
    ctx.fillText(`📝 KCET Score: ${kcetMarks}/180 (${((kcetMarks / 180) * 100).toFixed(1)}%)`, 70, 260)
    ctx.fillText(`📚 PUC PCM: ${pucPercentage}%`, 70, 290)
    ctx.fillText(`📈 Percentile: ${calculatePercentile(prediction.medium)}`, 70, 320)

    // Download
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `KCET_2025_Rank_${prediction.medium}.png`
    link.click()

    toast({
      title: "Downloaded!",
      description: "Rank card saved as PNG",
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="text-center space-y-4 py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-indigo-500/20 rounded-2xl">
          <Crown className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
            KCET 2026 Rank Predictor
          </h1>
          <p className="text-muted-foreground">
            Real-time rank prediction based on official KEA formula
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 p-1 bg-muted/50 dark:bg-muted/30 rounded-xl">
          <TabsTrigger value="predictor" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Predictor</span>
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Breakdown</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <LineChart className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="disclaimer" className="flex items-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Info</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="predictor" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Input Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Live Calculator Card */}
              <Card className="border-2 border-primary/20">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Live Calculator
                    <Badge variant="secondary" className="ml-2 text-xs">Auto-updates</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* KCET Input */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">KCET PCM Score</Label>
                      <div className="border-2 rounded-xl p-4 text-center bg-gradient-to-br from-background to-muted/30 transition-all hover:border-primary/50">
                        <div className="text-4xl font-bold text-primary">{kcetMarks}</div>
                        <div className="text-sm text-muted-foreground">out of 180 ({((kcetMarks / 180) * 100).toFixed(1)}%)</div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="180"
                        value={kcetMarks}
                        onChange={(e) => setKcetMarks(Number(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full appearance-none cursor-pointer accent-primary"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="180"
                        value={kcetMarks}
                        onChange={(e) => setKcetMarks(Math.min(180, Math.max(0, Number(e.target.value))))}
                        className="text-center font-mono"
                        placeholder="Enter exact marks"
                      />
                    </div>

                    {/* PUC Input */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">PUC PCM Percentage</Label>
                      <div className="border-2 rounded-xl p-4 text-center bg-gradient-to-br from-background to-muted/30 transition-all hover:border-primary/50">
                        <div className="text-4xl font-bold text-primary">{pucPercentage}%</div>
                        <div className="text-sm text-muted-foreground">Board Marks (PCM)</div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={pucPercentage}
                        onChange={(e) => setPucPercentage(Number(e.target.value))}
                        className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full appearance-none cursor-pointer accent-primary"
                      />
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={pucPercentage}
                        onChange={(e) => setPucPercentage(Math.min(100, Math.max(0, Number(e.target.value))))}
                        className="text-center font-mono"
                        placeholder="Enter exact percentage"
                      />
                    </div>
                  </div>

                  {/* Formula Display */}
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <div className="text-sm text-muted-foreground mb-2">Official KEA Formula:</div>
                    <div className="font-mono text-sm">
                      Composite = (KCET/180 × 50) + (PUC% × 0.5) = <span className="font-bold text-primary">{prediction?.composite.toFixed(2) || '--'}%</span>
                    </div>
                  </div>

                  {/* Confidence Gauge */}
                  {prediction && (
                    <div className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-indigo-500/5 border border-primary/20">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Target className="h-4 w-4 text-primary" />
                        Rank Confidence Range
                      </div>
                      <ConfidenceGauge low={prediction.low} medium={prediction.medium} high={prediction.high} />
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Results Card */}
            <div className="lg:sticky lg:top-4 space-y-4">
              {/* 2025 Historical Rank Card */}
              <Card className="border-2 border-amber-500/20 bg-card">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                      2025 Data
                    </Badge>
                    <h3 className="text-sm font-medium text-muted-foreground">Your 2025 Rank</h3>
                  </div>
                  <div className="py-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                    <div className="text-3xl font-bold tabular-nums tracking-tight text-amber-600">
                      {prediction ? animatedRank2025.toLocaleString() : '---'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Based on 2025 calibrated data</div>
                  </div>
                </CardContent>
              </Card>

              {/* 2026 Predicted Rank Card */}
              <Card className="border-2 border-primary/20 bg-card">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Badge className="bg-primary/10 text-primary border-primary/30">
                      2026 Predicted
                    </Badge>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Your 2026 Predicted Rank</h3>

                  {/* Main rank display */}
                  <div className="py-6 mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-indigo-500/10 border border-primary/20">
                    <div className="text-5xl font-bold mb-1 tabular-nums tracking-tight text-primary">
                      {prediction ? animatedRank2026.toLocaleString() : '---'}
                    </div>
                    <div className="text-sm text-muted-foreground">Predicted Rank for KCET 2026</div>
                    {prediction && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-500/10 text-red-600 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        +{prediction.yearOverYearChange}% vs 2025
                      </div>
                    )}
                  </div>

                  {prediction && (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">2025 Range</span>
                        <span className="font-semibold text-foreground">{prediction.low.toLocaleString()} – {prediction.high.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Percentile</span>
                        <span className="font-semibold text-foreground">{prediction.percentile || calculatePercentile(prediction.medium)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-muted-foreground">Composite</span>
                        <span className="font-semibold text-foreground">{prediction.composite.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="outline" className="font-semibold">
                          {prediction.rankBand}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        2026 prediction based on ~2,70,000 expected candidates (+3-5% competition increase)
                      </p>
                    </div>
                  )}

                  {!prediction && (
                    <p className="text-sm text-muted-foreground mt-4">Adjust the sliders to see your predicted rank</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions - Full Width at Bottom */}
          {prediction && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button
                onClick={findColleges}
                className="flex-1 h-12 text-base bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90"
              >
                <Search className="h-5 w-5 mr-2" />
                Find Colleges for Rank {prediction.rank2026.toLocaleString()}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button onClick={saveResult} variant="outline" className="h-12">
                Save Result
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          {prediction ? (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>KCET PCM</span>
                        <span className="font-medium">{kcetMarks}/180 ({((kcetMarks / 180) * 100).toFixed(1)}%)</span>
                      </div>
                      <Progress value={(kcetMarks / 180) * 100} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>PUC PCM</span>
                        <span className="font-medium">{pucPercentage}%</span>
                      </div>
                      <Progress value={pucPercentage} className="h-3" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Composite Score</span>
                        <span className="font-medium text-primary">{prediction.composite.toFixed(1)}%</span>
                      </div>
                      <Progress value={prediction.composite} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Rank Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-3xl font-bold text-primary">{prediction.medium.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Predicted Rank</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">Range: {prediction.low.toLocaleString()}–{prediction.high.toLocaleString()}</p>
                      <p className="text-sm">Percentile: {calculatePercentile(prediction.medium)}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20 rounded-lg">
                      <p className="text-sm">{getRankAnalysis(prediction.medium)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    College Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {['general', 'obc', 'sc', 'st'].map((cat) => {
                      const college = getCollegeSuggestions(prediction.medium, cat)
                      return (
                        <div key={cat} className="p-4 rounded-lg border bg-gradient-to-br from-background to-muted/30 hover:shadow-md transition-shadow">
                          <Badge variant="secondary" className="mb-2">
                            {cat.toUpperCase()}
                          </Badge>
                          <h4 className="font-semibold">{college.name}</h4>
                          <p className="text-sm text-muted-foreground">{college.branch}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button onClick={downloadPNG} variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Rank Card
                </Button>
                <Button onClick={findColleges} className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Colleges
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calculator className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Adjust inputs to see breakdown</h3>
                <p className="text-muted-foreground">Move the sliders on the Predictor tab</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          {prediction ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Rank Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const analysis = getRankGapAnalysis(prediction.composite)
                    return (
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Rank Band:</span>
                            <Badge variant="outline">{prediction.rankBand}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Competition Level:</span>
                            <Badge variant={prediction.competitionLevel?.includes('High') ? 'destructive' : 'secondary'}>
                              {prediction.competitionLevel}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Rank Range:</span>
                            <span className="font-medium">{analysis.rankGap}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Candidates per 1%:</span>
                            <span className="font-medium">{analysis.candidatesPerPercent}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Improvement Potential:</span>
                            <Badge variant={analysis.improvementPotential === 'High' ? 'default' : 'outline'}>
                              {analysis.improvementPotential}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Percentile:</span>
                            <span className="font-medium">{prediction.percentile}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    KCET 2025 Cutoff Estimates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCutoffEstimates().map((cutoff, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <span className="font-medium">{cutoff.targetRank}</span>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {cutoff.expectedAggregate}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Detailed Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-indigo-500/10 border border-primary/20">
                      <h4 className="font-semibold mb-2">Rank Analysis</h4>
                      <p className="text-sm">{getRankAnalysis(prediction.medium)}</p>
                    </div>

                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">College Suggestions</h4>
                      <p className="text-sm">
                        Based on your rank of {prediction.medium.toLocaleString()},
                        consider colleges like {getCollegeSuggestions(prediction.medium, 'general').name}
                        for branches in {getCollegeSuggestions(prediction.medium, 'general').branch}.
                      </p>
                    </div>

                    <Button onClick={findColleges} className="w-full" variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Explore All Matching Colleges
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                <p className="text-muted-foreground text-center">
                  Adjust inputs on the Predictor tab to see analysis.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {savedResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Predictions</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem('kcetResults')
                    setSavedResults([])
                    toast({ title: "History Cleared" })
                  }}
                >
                  Clear History
                </Button>
              </div>
              {savedResults.slice().reverse().map((result, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">Rank: {result.rank.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          KCET: {result.cet}/180 | PUC: {result.puc}%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Range: {result.range} | Percentile: {result.percentile}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {new Date(result.timestamp).toLocaleDateString()}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Predictions Saved</h3>
                <p className="text-muted-foreground">Click "Save Result" to track your predictions!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="disclaimer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Estimate Only:</strong> This tool provides rank predictions based on historical KCET data (2023–2025, ~3.12 lakh candidates). It is not an official KEA result.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Accuracy Limitations:</strong> Predictions may vary due to score normalization, exam difficulty, or KEA policy changes.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Eligibility Restrictions:</strong> Per KEA 2024 rules, IIT/NIT students via JEE are barred from CET counseling.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Data Privacy:</strong> All inputs are processed locally. No data is stored or shared.
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-950/30">
                  <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Official Source:</strong> Always verify results at the official KEA website.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RankPredictor
import { SEO } from "@/components/SEO"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Crown, Calculator, Database, Target, TrendingUp, AlertTriangle, ChevronRight, BarChart3, PieChart, LineChart as LineChartIcon, CheckCircle2, Search, SlidersHorizontal, ArrowRight, RotateCcw, Info, Shield, Sparkles, Table, Share2, Download, FileText, AlertCircle } from 'lucide-react'
import { AdminFeedbackService } from "@/lib/admin-feedback-service"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import {
  predictKCETRankBothYears,
  predictKCETRank,
  getPercentile,
  calculatePercentile,
  getRankAnalysis,
  getCollegeSuggestions,
  getRankGapAnalysis,
  getCutoffEstimates,
  kcet2025RankTable,
  rankGapAnalysis,
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
  const [boardMarksMode, setBoardMarksMode] = useState(false)
  const [boardMarksTotal, setBoardMarksTotal] = useState(180)
  const { toast } = useToast()
  const navigate = useNavigate()

  // Animated rank display
  const animatedRank2025 = useAnimatedCounter(prediction?.rank2025 || 0, 400)
  const animatedRank2026 = useAnimatedCounter(prediction?.rank2026 || 0, 400)

  const [feedbackRank, setFeedbackRank] = useState("")
  const [feedbackKcet, setFeedbackKcet] = useState("")
  const [feedbackPuc, setFeedbackPuc] = useState("")
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)

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

  const shareResult = async () => {
    if (!prediction) return
    const title = 'My KCET 2026 Rank Prediction'
    const text = `I just predicted my KCET 2026 rank: ${prediction.medium.toLocaleString()}! Check out where you stand on KCET Coded.`
    const shareUrl = `${window.location.origin}/api/share?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(`Predicted Rank: ${prediction.medium.toLocaleString()}`)}&path=/rank-predictor`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
      } catch (e) {
        console.error("Error sharing:", e)
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`)
      toast({ title: "Link Copied!", description: "Prediction copied to clipboard. Share it with your friends!" })
    }
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
      <SEO
        title="KCET 2026 Rank Predictor – Predict Your Rank from Marks (Free)"
        description="Predict your KCET 2026 rank from marks instantly using 3 years of historical data. Enter your Physics, Chemistry & Maths marks to get your estimated rank and college suggestions. 100% free, no sign-up."
        url="https://kcet-coded2.vercel.app/rank-predictor"
        keywords="KCET rank predictor, KCET marks vs rank, KCET 2026 rank calculator, KCET rank prediction, predict KCET rank from marks, KCET expected rank, 76 marks in KCET rank, 100 marks in KCET rank"
        jsonLd={{
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How to predict KCET rank from marks?", "acceptedAnswer": { "@type": "Answer", "text": "Enter your Physics, Chemistry, and Maths KCET marks in the Rank Predictor tool. It uses 3 years of historical data (2023-2025) to estimate your rank based on the official KEA formula." }},
            { "@type": "Question", "name": "What is the rank for 76 marks in KCET?", "acceptedAnswer": { "@type": "Answer", "text": "76 marks in KCET typically corresponds to a rank around 50,000-70,000 depending on exam difficulty. Use the Rank Predictor for a more accurate year-specific prediction." }},
            { "@type": "Question", "name": "What rank is needed for CSE in RVCE KCET?", "acceptedAnswer": { "@type": "Answer", "text": "For CSE at RVCE, you typically need a KCET rank under 700 (GM category). The cutoff varies by year — check the Cutoff Explorer for exact historical data." }},
            { "@type": "Question", "name": "Is KCET rank based only on CET marks?", "acceptedAnswer": { "@type": "Answer", "text": "No, KCET rank is based on CET marks (50%) + qualifying exam marks (50% of 12th/PUC PCM). Our predictor factors in both components." }}
          ]
        }}
      />
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
          <div className="flex justify-center mt-2 mb-2">
            <p className="text-[11px] text-muted-foreground/60 tracking-wide">
              Created by & if any queries contact{' '}
              <a 
                href="https://www.reddit.com/user/Elegant_Compote9073/" 
                target="_blank" 
                rel="noreferrer"
                className="font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline"
              >
                u/Elegant_Compote9073
              </a>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("methodology")}
              className="group text-xs border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all font-medium"
            >
              <Database className="h-3.5 w-3.5 mr-1.5 text-primary group-hover:scale-110 transition-transform" />
              View Prediction Data & Methodology
            </Button>

            <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="group text-xs border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10 transition-all font-medium text-amber-700 dark:text-amber-400">
                  <Target className="h-3.5 w-3.5 mr-1.5 text-amber-500 group-hover:scale-110 transition-transform" />
                  2025 Aspirant? Share Your Rank
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Help Improve the Predictor!</DialogTitle>
                  <DialogDescription>
                    Were you a KCET 2025 aspirant? Share your actual rank and scores to help us refine our prediction model for the 2026 batch.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="actualRank">Actual 2025 Rank</Label>
                    <Input id="actualRank" placeholder="e.g. 4500" type="number" value={feedbackRank} onChange={e => setFeedbackRank(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kcetMarks">KCET Marks (out of 180)</Label>
                      <Input id="kcetMarks" placeholder="e.g. 110" type="number" value={feedbackKcet} onChange={e => setFeedbackKcet(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pucMarks">PUC PCM (%)</Label>
                      <Input id="pucMarks" placeholder="e.g. 95" type="number" value={feedbackPuc} onChange={e => setFeedbackPuc(e.target.value)} />
                    </div>
                  </div>
                  <Button className="w-full mt-4" onClick={(e) => {
                    if (!feedbackRank || !feedbackKcet || !feedbackPuc) {
                      toast({ title: "Incomplete", description: "Please fill all fields to share your rank.", variant: "destructive" });
                      return;
                    }
                    const payload = {
                      actual_rank: parseInt(feedbackRank) || 0,
                      kcet_marks: parseInt(feedbackKcet) || 0,
                      puc_marks: parseFloat(feedbackPuc) || 0
                    };
                    if (payload.kcet_marks > 180 || payload.puc_marks > 100) {
                      toast({ title: "Invalid Values", description: "Marks must be valid (KCET < 180, PUC < 100).", variant: "destructive" });
                      return;
                    }
                    AdminFeedbackService.addFeedback(payload);
                    toast({
                      title: "Thanks for your feedback! 🚀",
                      description: "Your data helps future aspirants. Best of luck for your college journey!",
                    });
                    
                    // Reset and Close
                    setFeedbackRank(""); setFeedbackKcet(""); setFeedbackPuc("");
                    setShowFeedbackDialog(false);
                  }}>
                    Submit Data
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap justify-center gap-1 w-full bg-muted/50 dark:bg-muted/30 rounded-xl p-1 h-auto">
          <TabsTrigger value="predictor" className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-1.5">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Predictor</span>
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-1.5">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-1.5">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-1.5">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Breakdown</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-1.5">
            <LineChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="disclaimer" className="flex-1 min-w-[100px] flex items-center justify-center gap-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-1.5">
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
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">PUC PCM Board Marks</Label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!boardMarksMode) {
                              // Switching to total marks mode — initialize from current percentage
                              setBoardMarksTotal(Math.round(pucPercentage * 3))
                            } else {
                              // Switching back to percentage — sync from total
                              setPucPercentage(Math.round((boardMarksTotal / 300) * 100))
                            }
                            setBoardMarksMode(!boardMarksMode)
                          }}
                          className="relative inline-flex h-6 w-[7.5rem] items-center rounded-full border border-white/10 bg-muted/50 p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <span
                            className={`absolute left-0.5 flex h-5 w-[3.5rem] items-center justify-center rounded-full text-[10px] font-semibold transition-all duration-300 ease-in-out ${
                              boardMarksMode
                                ? "translate-x-[3.75rem] bg-primary text-primary-foreground shadow-lg"
                                : "translate-x-0 bg-primary text-primary-foreground shadow-lg"
                            }`}
                          >
                            {boardMarksMode ? "Total" : "%"}
                          </span>
                          <span className={`absolute left-2 text-[10px] font-medium transition-opacity duration-200 ${boardMarksMode ? "opacity-50" : "opacity-0"}`}>%</span>
                          <span className={`absolute right-2 text-[10px] font-medium transition-opacity duration-200 ${boardMarksMode ? "opacity-0" : "opacity-50"}`}>Total</span>
                        </button>
                      </div>

                      {boardMarksMode ? (
                        /* ─── Total Marks Mode ─── */
                        <>
                          <div className="border-2 rounded-xl p-4 text-center bg-gradient-to-br from-background to-muted/30 transition-all hover:border-primary/50">
                            <div className="text-4xl font-bold text-primary">{boardMarksTotal}</div>
                            <div className="text-sm text-muted-foreground">out of 300 ({((boardMarksTotal / 300) * 100).toFixed(1)}%)</div>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="300"
                            value={boardMarksTotal}
                            onChange={(e) => {
                              const total = Number(e.target.value)
                              setBoardMarksTotal(total)
                              setPucPercentage(Math.round((total / 300) * 100))
                            }}
                            className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-full appearance-none cursor-pointer accent-primary"
                          />
                          <Input
                            type="number"
                            min="0"
                            max="300"
                            value={boardMarksTotal}
                            onChange={(e) => {
                              const total = Math.min(300, Math.max(0, Number(e.target.value)))
                              setBoardMarksTotal(total)
                              setPucPercentage(Math.round((total / 300) * 100))
                            }}
                            className="text-center font-mono"
                            placeholder="Enter PCM total marks"
                          />
                        </>
                      ) : (
                        /* ─── Percentage Mode ─── */
                        <>
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
                        </>
                      )}
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
                    <Sparkles className="h-4 w-[6px] text-primary" />
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
                        Delta {prediction.yearOverYearChange > 0 ? "+" : ""}{prediction.yearOverYearChange}% vs 2025
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
                        2026 estimate uses a difficulty normalization coefficient with participation drift calibration.
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
              <div className="flex gap-3 sm:w-auto w-full">
                <Button onClick={shareResult} className="flex-1 sm:flex-none h-12 bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-500/20">
                  <Share2 className="h-5 w-5 mr-2" />
                  Share Result
                </Button>
                <Button onClick={saveResult} variant="outline" className="flex-1 sm:flex-none h-12">
                  Save Result
                </Button>
              </div>
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

              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={shareResult} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg shadow-green-500/20">
                  <Share2 className="h-4 w-4" />
                  Share Result
                </Button>
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

        <TabsContent value="methodology" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2 mb-8 mt-4">
            <h2 className="text-2xl font-bold tracking-tight">Prediction Methodology & Data</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our predictor strictly models actual KCET 2025 outcome distribution to provide highly accurate 2026 estimates based on historical competition drop-off rates and category shifts.
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
              <div className="flex items-start gap-3 sm:gap-4 flex-col sm:flex-row">
                <div className="p-2 sm:p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg shrink-0 mt-1 sm:mt-0">
                  <Database className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 text-sm sm:text-base leading-tight">Data Sources & Credits</h3>
                  <div className="text-xs sm:text-sm text-indigo-800/80 dark:text-indigo-300 space-y-2">
                    <p className="leading-relaxed">
                      All datasets, trend points, and aggregate curves used across this predictor are carefully curated from community-driven analysis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                      <a
                        href="https://www.reddit.com/r/kcet/comments/1kug2p6/kcet_2025_complete_analysis/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-indigo-700 dark:text-indigo-400 font-medium hover:underline hover:text-indigo-600 transition-colors w-full sm:w-auto"
                      >
                        <FileText className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                        Original Reddit Analysis Post
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-indigo-200 dark:border-indigo-800/50 flex flex-wrap gap-x-6 gap-y-2 text-xs sm:text-sm">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 shrink-0">
                  Special thanks to
                  <a
                    href="https://reddit.com/u/Ok_Tackle1731"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 hover:underline"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center mr-1 pb-[1px] text-[10px] shrink-0">u/</span>
                    Ok_Tackle1731
                  </a>
                </span>
                <span className="hidden sm:inline-block text-slate-300 dark:text-slate-600 shrink-0">•</span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 shrink-0">
                  Raw data provided by
                  <a
                    href="https://reddit.com/u/Upbeat-Sign-7525"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center font-medium text-orange-600 dark:text-orange-400 hover:text-orange-500 hover:underline"
                  >
                    <span className="w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-1 pb-[1px] text-[10px] shrink-0">u/</span>
                    Upbeat-Sign-7525
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Graphs Section */}
          <Card className="border-2 border-primary/10 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-primary">
                <LineChartIcon className="h-5 w-5" />
                Aggregate Percentage vs Rank Curve
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="250k" className="space-y-6">
                <div className="flex justify-center">
                  <TabsList className="grid grid-cols-3 w-full max-w-md bg-muted/50">
                    <TabsTrigger value="250k" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">All Candidates</TabsTrigger>
                    <TabsTrigger value="100k" className="data-[state=active]:bg-indigo-500 data-[state=active]:text-white">Top 1 Lakh</TabsTrigger>
                    <TabsTrigger value="50k" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">Top 50,000</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="250k">
                  <div className="h-[400px] w-full bg-card rounded-xl border p-4 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kcet2025RankTable} margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis
                          dataKey="score"
                          type="number"
                          domain={['dataMin - 2', 'dataMax + 2']}
                          label={{ value: 'Aggregate Percentage', position: 'bottom', offset: 0, fill: 'currentColor', opacity: 0.7 }}
                          tickFormatter={(v) => `${v}%`}
                          tick={{ fill: 'currentColor', opacity: 0.7 }}
                        />
                        <YAxis
                          dataKey="rank"
                          domain={[0, 280000]}
                          label={{ value: 'Rank', angle: -90, position: 'insideLeft', offset: -5, fill: 'currentColor', opacity: 0.7 }}
                          reversed={true}
                          tickFormatter={(v) => v.toLocaleString()}
                          tick={{ fill: 'currentColor', opacity: 0.7 }}
                        />
                        <RechartsTooltip
                          formatter={(value: any) => [value.toLocaleString(), "Rank"]}
                          labelFormatter={(label) => `Aggregate: ${label}%`}
                          contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        />
                        <Line type="monotone" dataKey="rank" stroke="var(--theme-primary, #f59e0b)" strokeWidth={3} dot={{ r: 2, fill: "var(--theme-primary, #f59e0b)", strokeWidth: 0 }} activeDot={{ r: 6, stroke: "var(--background)", strokeWidth: 2 }} animationDuration={1500} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="100k">
                  <div className="h-[400px] w-full bg-card rounded-xl border p-4 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kcet2025RankTable.filter(d => d.rank <= 100000)} margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis
                          dataKey="score"
                          type="number"
                          domain={['dataMin - 1', 'dataMax + 1']}
                          label={{ value: 'Aggregate Percentage', position: 'bottom', offset: 0, fill: 'currentColor', opacity: 0.7 }}
                          tickFormatter={(v) => `${v}%`}
                          tick={{ fill: 'currentColor', opacity: 0.7 }}
                        />
                        <YAxis
                          dataKey="rank"
                          domain={[0, 100000]}
                          label={{ value: 'Rank', angle: -90, position: 'insideLeft', offset: -5, fill: 'currentColor', opacity: 0.7 }}
                          reversed={true}
                          tickFormatter={(v) => v.toLocaleString()}
                          tick={{ fill: 'currentColor', opacity: 0.7 }}
                        />
                        <RechartsTooltip
                          formatter={(value: any) => [value.toLocaleString(), "Rank"]}
                          labelFormatter={(label) => `Aggregate: ${label}%`}
                          contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        />
                        <Line type="monotone" dataKey="rank" stroke="#6366f1" strokeWidth={3} dot={{ r: 2.5, fill: "#6366f1", strokeWidth: 0 }} activeDot={{ r: 6, stroke: "var(--background)", strokeWidth: 2 }} animationDuration={1000} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="50k">
                  <div className="h-[400px] w-full bg-card rounded-xl border p-4 shadow-inner">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={kcet2025RankTable.filter(d => d.rank <= 50000)} margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                        <XAxis
                          dataKey="score"
                          type="number"
                          domain={['dataMin - 1', 'dataMax + 1']}
                          label={{ value: 'Aggregate Percentage', position: 'bottom', offset: 0, fill: 'currentColor', opacity: 0.7 }}
                          tickFormatter={(v) => `${v}%`}
                          tick={{ fill: 'currentColor', opacity: 0.7 }}
                        />
                        <YAxis
                          dataKey="rank"
                          domain={[0, 50000]}
                          label={{ value: 'Rank', angle: -90, position: 'insideLeft', offset: -5, fill: 'currentColor', opacity: 0.7 }}
                          reversed={true}
                          tickFormatter={(v) => v.toLocaleString()}
                          tick={{ fill: 'currentColor', opacity: 0.7 }}
                        />
                        <RechartsTooltip
                          formatter={(value: any) => [value.toLocaleString(), "Rank"]}
                          labelFormatter={(label) => `Aggregate: ${label}%`}
                          contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--background)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                        />
                        <Line type="monotone" dataKey="rank" stroke="#14b8a6" strokeWidth={3} dot={{ r: 3, fill: "#14b8a6", strokeWidth: 0 }} activeDot={{ r: 6, stroke: "var(--background)", strokeWidth: 2 }} animationDuration={1000} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Tables Section */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <Target className="h-4 w-4 text-indigo-500" />
                  </div>
                  Target Rank Estimates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left font-medium p-3.5 text-muted-foreground border-b border-border/50">Target Rank</th>
                        <th className="text-left font-medium p-3.5 text-muted-foreground border-b border-border/50">Expected Aggregate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {getCutoffEstimates().map((row, i) => (
                        <tr key={i} className="transition-colors hover:bg-muted/30">
                          <td className="p-3.5 font-medium">{row.targetRank}</td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                              {row.expectedAggregate}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Table className="h-4 w-4 text-emerald-500" />
                  </div>
                  Rank Gap by Aggregate
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left font-medium p-3.5 text-muted-foreground border-b border-border/50">Band</th>
                        <th className="text-left font-medium p-3.5 text-muted-foreground border-b border-border/50">Rank Range</th>
                        <th className="text-right font-medium p-3.5 text-muted-foreground border-b border-border/50">Drop / 1%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {rankGapAnalysis.map((row, i) => (
                        <tr key={i} className="transition-colors hover:bg-muted/30">
                          <td className="p-3.5 font-medium whitespace-nowrap">{row.range}</td>
                          <td className="p-3.5 text-muted-foreground whitespace-nowrap">{row.rankRange}</td>
                          <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                            {row.candidatesPer1Percent}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center pb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <Info className="h-4 w-4" />
              Data calibrated exclusively for KCET predictions tracking ~2.59L aspirants
            </div>
          </div>
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
                <LineChartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
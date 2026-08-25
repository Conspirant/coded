import { SEO } from "@/components/SEO"
import AdUnit from "@/components/AdUnit"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Calculator, Database, Target, TrendingUp, BarChart3, PieChart, LineChart as LineChartIcon, CheckCircle2, Search, ArrowRight, Info, Shield, Table, Share2, Download, FileText, AlertCircle, Sparkles } from 'lucide-react'
import { AdminFeedbackService } from "@/lib/admin-feedback-service"
import { ActualRankService } from "@/lib/actual-rank-service"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import {
  predictKCETRankBothYears,
  calculatePercentile,
  getRankAnalysis,
  getCollegeSuggestions,
  getRankGapAnalysis,
  getCutoffEstimates,
  kcet2025RankTable,
  rankGapAnalysis,
  type Rank2026Prediction
} from "@/lib/rank-predictor"
import { validateKCETMarks, validatePUCPercentage } from "@/lib/security"

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
  { code: "SCK", label: "Scheduled Caste Karnataka (SCK)" },
  { code: "SCR", label: "Scheduled Caste Rural (SCR)" },
  { code: "STG", label: "Scheduled Tribe General (STG)" },
  { code: "STK", label: "Scheduled Tribe Karnataka (STK)" },
  { code: "STR", label: "Scheduled Tribe Rural (STR)" }
]

// Animated counter hook for smooth number transitions
const useAnimatedCounter = (value: number, duration: number = 300) => {
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

const RankPredictor = () => {
  const [kcetMarks, setKcetMarks] = useState(110)
  const [pucPercentage, setPucPercentage] = useState(85)
  const [prediction, setPrediction] = useState<Rank2026Prediction | null>(null)
  const [activeTab, setActiveTab] = useState("predictor")
  const [savedResults, setSavedResults] = useState<any[]>([])
  const [boardMarksMode, setBoardMarksMode] = useState(false)
  const [boardMarksTotal, setBoardMarksTotal] = useState(255)
  const { toast } = useToast()
  const navigate = useNavigate()

  const animatedRank2025 = useAnimatedCounter(prediction?.rank2025 || 0, 300)
  const animatedRank2026 = useAnimatedCounter(prediction?.rank2026 || 0, 300)

  const [feedbackRank, setFeedbackRank] = useState("")
  const [feedbackKcet, setFeedbackKcet] = useState("")
  const [feedbackPuc, setFeedbackPuc] = useState("")
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)

  // KCET 2026 Declared Modal States
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [submittedShare, setSubmittedShare] = useState(false)
  const [shareRank, setShareRank] = useState("")
  const [shareMarks, setShareMarks] = useState("")
  const [sharePucAggregate, setSharePucAggregate] = useState("")
  const [shareBoard, setShareBoard] = useState("State Board")
  const [shareCategory, setShareCategory] = useState("GM")
  const [isSubmittingShare, setIsSubmittingShare] = useState(false)

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

  // Real-time prediction
  useEffect(() => {
    const kcetValidation = validateKCETMarks(kcetMarks)
    const pucValidation = validatePUCPercentage(pucPercentage)

    if (!kcetValidation.isValid || !pucValidation.isValid) {
      setPrediction(null)
      return
    }

    try {
      const rankData = predictKCETRankBothYears(kcetMarks, pucPercentage)
      setPrediction(rankData)
    } catch (err) {
      console.error("Prediction error:", err)
      setPrediction(null)
    }
  }, [kcetMarks, pucPercentage])

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shareRank || !shareMarks || !sharePucAggregate) {
      toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" })
      return
    }

    setIsSubmittingShare(true)
    try {
      const res = await ActualRankService.submitActualRank({
        actual_rank: Number(shareRank),
        kcet_marks: Number(shareMarks),
        puc_marks: Number(sharePucAggregate),
        board: shareBoard,
        category: shareCategory,
        stream: "Engineering"
      })

      if (res.success) {
        setSubmittedShare(true)
        toast({ title: "Thank you!", description: "Your official score data will calibrate the 2027 engine." })
      } else {
        toast({ title: "Submission Failed", description: res.error || "Please try again later.", variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Error", description: "An unexpected error occurred. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmittingShare(false)
    }
  }

  const handleFeedbackSubmit = async () => {
    if (!feedbackRank || !feedbackKcet || !feedbackPuc) {
      toast({ title: "Missing Fields", description: "Please enter your scores.", variant: "destructive" })
      return
    }

    try {
      const res = await AdminFeedbackService.submitFeedback({
        actualRank: Number(feedbackRank),
        kcetMarks: Number(feedbackKcet),
        pucPercentage: Number(feedbackPuc),
        predictedRank: prediction?.medium || 0,
        notes: "Anonymous User Calibrate Data"
      })

      if (res.success) {
        toast({ title: "Data Submitted", description: "Your contribution helps refine normalization models." })
        setShowFeedbackDialog(false)
        setFeedbackRank("")
        setFeedbackKcet("")
        setFeedbackPuc("")
      } else {
        toast({ title: "Submission Failed", description: res.error || "Failed to submit.", variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not submit calibration data.", variant: "destructive" })
    }
  }

  const saveResult = () => {
    if (!prediction) return

    const result = {
      cet: kcetMarks,
      puc: pucPercentage,
      rank: prediction.medium,
      range: `${prediction.low.toLocaleString('en-IN')} – ${prediction.high.toLocaleString('en-IN')}`,
      percentile: calculatePercentile(prediction.medium),
      timestamp: new Date().toISOString()
    }

    const updatedResults = [...savedResults, result].slice(-10)
    setSavedResults(updatedResults)
    localStorage.setItem('kcetResults', JSON.stringify(updatedResults))

    toast({
      title: "Result Saved",
      description: `Rank ${prediction.medium.toLocaleString('en-IN')} saved to local history.`,
    })
  }

  const shareResult = async () => {
    if (!prediction) return
    const title = 'My KCET 2026 Rank Prediction'
    const text = `Predicted KCET 2026 Rank: ~${prediction.medium.toLocaleString('en-IN')} (Range: ${prediction.low.toLocaleString('en-IN')} - ${prediction.high.toLocaleString('en-IN')}). Explore KCET Coded:`
    const shareUrl = `${window.location.origin}/rank-predictor`

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl })
      } catch (e) {
        console.error("Error sharing:", e)
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`)
      toast({ title: "Link Copied", description: "Prediction summary copied to clipboard." })
    }
  }

  const findColleges = () => {
    if (!prediction) return
    navigate(`/college-predictor?rank=${prediction.rank2026}`)
  }

  const downloadPNG = () => {
    if (!prediction) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 600
    canvas.height = 380

    // Background
    ctx.fillStyle = '#0F172A'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = '#1E293B'
    ctx.lineWidth = 2
    ctx.strokeRect(16, 16, 568, 348)

    // Title
    ctx.fillStyle = '#94A3B8'
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('KCET 2026 RANK PREDICTION CARD', 300, 50)

    // Rank
    ctx.fillStyle = '#3B82F6'
    ctx.font = '700 48px "JetBrains Mono", monospace'
    ctx.fillText(`~${prediction.medium.toLocaleString('en-IN')}`, 300, 115)

    ctx.fillStyle = '#64748B'
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif'
    ctx.fillText(`Estimated Median Range: ${prediction.low.toLocaleString('en-IN')} – ${prediction.high.toLocaleString('en-IN')}`, 300, 145)

    // Details box
    ctx.fillStyle = '#1E293B'
    ctx.beginPath()
    ctx.roundRect(40, 175, 520, 140, 8)
    ctx.fill()

    ctx.fillStyle = '#F8FAFC'
    ctx.font = '500 13px "JetBrains Mono", monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`• KCET Score: ${kcetMarks} / 180 (${((kcetMarks / 180) * 100).toFixed(1)}%)`, 60, 210)
    ctx.fillText(`• Board PCM: ${pucPercentage}% (Weightage: 50%)`, 60, 240)
    ctx.fillText(`• Composite Score: ${prediction.composite.toFixed(2)}%`, 60, 270)
    ctx.fillText(`• Expected Percentile: ${calculatePercentile(prediction.medium)}`, 60, 300)

    ctx.fillStyle = '#64748B'
    ctx.font = '400 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Generated via KCET Coded (kcetcoded.dev) • Verified KEA Normalization Modeling', 300, 345)

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `KCET_2026_Rank_${prediction.medium}.png`
    link.click()

    toast({
      title: "Downloaded",
      description: "Rank card exported as PNG image.",
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <SEO
        title="KCET 2026 Rank Predictor – Marks vs Rank Calculator (Free)"
        description="Calculate your predicted Karnataka CET 2026 rank from marks using multi-year KEA normalized data (2023–2025). 50% KCET + 50% Board formula."
        url="https://kcetcoded.dev/rank-predictor"
        keywords="KCET rank predictor, KCET marks vs rank, KCET 2026 rank calculator, KCET rank prediction"
      />

      {/* Header Banner */}
      <div className="rounded-lg border border-border bg-card p-5 md:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                KEA 50:50 NORMALIZATION MODEL
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              KCET 2026 Rank & Aggregate Predictor
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Estimate your rank based on 50% CET marks + 50% 12th/PUC PCM board percentage, benchmarked against 3.12 lakh verified candidate records.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button
              onClick={() => navigate("/college-predictor")}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 px-3.5 shadow-xs"
            >
              <Search className="h-3.5 w-3.5 mr-1.5" /> Check Colleges
            </Button>
            <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-muted text-xs h-9 px-3">
                  <Database className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" /> Calibrate Data
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card border-border shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    Submit Calibration Data
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Contribute anonymous score points to improve multi-year normalization algorithms.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-1">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase">Actual Rank</Label>
                    <Input type="number" placeholder="e.g. 15430" value={feedbackRank} onChange={e => setFeedbackRank(e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase">KCET Marks (/ 180)</Label>
                    <Input type="number" placeholder="e.g. 110" value={feedbackKcet} onChange={e => setFeedbackKcet(e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase">PUC PCM (%)</Label>
                    <Input type="number" placeholder="e.g. 92.5" value={feedbackPuc} onChange={e => setFeedbackPuc(e.target.value)} className="font-mono text-xs h-8" />
                  </div>
                  <Button onClick={handleFeedbackSubmit} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8 mt-2">
                    Submit Calibration Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap justify-start gap-1 w-full bg-muted/60 rounded-md p-1 border border-border h-auto">
          <TabsTrigger value="predictor" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5">
            <Calculator className="h-3.5 w-3.5" /> Predictor
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5">
            <PieChart className="h-3.5 w-3.5" /> Score Breakdown
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5">
            <BarChart3 className="h-3.5 w-3.5" /> Competition & Gap
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5">
            <Database className="h-3.5 w-3.5" /> Historical Benchmarks
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5">
            <LineChartIcon className="h-3.5 w-3.5" /> Saved History
          </TabsTrigger>
          <TabsTrigger value="disclaimer" className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5">
            <Shield className="h-3.5 w-3.5" /> Policy Notes
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Predictor Main */}
        <TabsContent value="predictor" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Input Form Column */}
            <div className="lg:col-span-2 space-y-5">
              <Card className="border border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-primary" />
                      Candidate Score Inputs
                    </CardTitle>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      50:50 WEIGHTAGE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* KCET Marks Input */}
                    <div className="space-y-2.5 p-4 rounded-md border border-border bg-muted/20">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">KCET Exam Score</Label>
                        <span className="text-xs font-mono font-bold text-primary">
                          {((kcetMarks / 180) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="180"
                          value={kcetMarks}
                          onChange={(e) => setKcetMarks(Math.min(180, Math.max(0, Number(e.target.value))))}
                          className="font-mono text-base font-bold pr-14 h-10"
                          placeholder="Marks"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none">
                          / 180
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="180"
                        value={kcetMarks}
                        onChange={(e) => setKcetMarks(Number(e.target.value))}
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <p className="text-[11px] text-muted-foreground">Physics (60) + Chemistry (60) + Math (60)</p>
                    </div>

                    {/* Board PCM Input */}
                    <div className="space-y-2.5 p-4 rounded-md border border-border bg-muted/20">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-foreground">12th / PUC PCM Board</Label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!boardMarksMode) {
                              setBoardMarksTotal(Math.round(pucPercentage * 3))
                            } else {
                              setPucPercentage(Math.round((boardMarksTotal / 300) * 100))
                            }
                            setBoardMarksMode(!boardMarksMode)
                          }}
                          className="text-[10px] font-mono font-semibold text-primary hover:underline"
                        >
                          {boardMarksMode ? "Switch to %" : "Enter Marks (/ 300)"}
                        </button>
                      </div>

                      {boardMarksMode ? (
                        <>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max="300"
                              value={boardMarksTotal}
                              onChange={(e) => {
                                const total = Math.min(300, Math.max(0, Number(e.target.value)))
                                setBoardMarksTotal(total)
                                setPucPercentage(Number(((total / 300) * 100).toFixed(2)))
                              }}
                              className="font-mono text-base font-bold pr-14 h-10"
                              placeholder="Total Marks"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none">
                              / 300
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="300"
                            value={boardMarksTotal}
                            onChange={(e) => {
                              const total = Number(e.target.value)
                              setBoardMarksTotal(total)
                              setPucPercentage(Number(((total / 300) * 100).toFixed(2)))
                            }}
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </>
                      ) : (
                        <>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={pucPercentage}
                              onChange={(e) => setPucPercentage(Math.min(100, Math.max(0, Number(e.target.value))))}
                              className="font-mono text-base font-bold pr-10 h-10"
                              placeholder="Percentage"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground pointer-events-none">
                              %
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={pucPercentage}
                            onChange={(e) => setPucPercentage(Number(e.target.value))}
                            className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                          />
                        </>
                      )}
                      <p className="text-[11px] text-muted-foreground">Physics, Chemistry, and Mathematics aggregate</p>
                    </div>
                  </div>

                  {/* Normalization Math Formula Bar */}
                  <div className="p-3 rounded-md bg-muted/40 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                    <span className="text-muted-foreground">
                      Formula: <code className="font-mono text-foreground">({kcetMarks}/180 × 50) + ({pucPercentage}% × 0.5)</code>
                    </span>
                    <span className="font-semibold text-foreground">
                      Composite Aggregate: <strong className="font-mono text-primary text-sm">{prediction ? `${prediction.composite.toFixed(2)}%` : '--'}</strong>
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              {prediction && (
                <div className="flex flex-wrap gap-2.5">
                  <Button onClick={findColleges} className="flex-1 min-w-[200px] h-9 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs">
                    <Search className="h-3.5 w-3.5 mr-1.5" /> Find Matching Colleges for Rank {prediction.rank2026.toLocaleString('en-IN')}
                  </Button>
                  <Button onClick={downloadPNG} variant="outline" className="h-9 text-xs border-border">
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Export PNG Card
                  </Button>
                  <Button onClick={saveResult} variant="outline" className="h-9 text-xs border-border">
                    Save to History
                  </Button>
                  <Button onClick={shareResult} variant="outline" className="h-9 text-xs border-border">
                    <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
                  </Button>
                </div>
              )}
            </div>

            {/* Prediction Output Column */}
            <div className="space-y-4">
              <Card className="border border-border bg-card shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      ESTIMATED OUTPUT
                    </span>
                    <Badge variant="secondary" className="font-mono text-[10px] bg-primary/10 text-primary border-primary/20">
                      2026 PROJECTION
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  {prediction ? (
                    <>
                      <div>
                        <span className="text-xs text-muted-foreground block mb-1">Estimated Rank Band</span>
                        <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
                          {prediction.low.toLocaleString('en-IN')} <span className="text-muted-foreground font-normal text-xl">–</span> {prediction.high.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="p-3 rounded-md bg-muted/40 border border-border grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground block text-[11px]">Median Estimate</span>
                          <span className="font-mono font-bold text-foreground text-sm">~{animatedRank2026.toLocaleString('en-IN')}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[11px]">2025 Baseline</span>
                          <span className="font-mono font-semibold text-muted-foreground text-sm">~{animatedRank2025.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">Expected Percentile</span>
                          <span className="font-mono font-bold text-emerald-500">{calculatePercentile(prediction.medium)}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span>Competition Density</span>
                          <span className="font-semibold text-foreground">{prediction.competitionLevel || 'Standard'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span>Target Range Band</span>
                          <span className="font-semibold text-foreground">{prediction.rankBand}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      Enter valid KCET and Board scores to compute projection.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick College Suggestion Preview */}
              {prediction && (
                <Card className="border border-border bg-card shadow-xs">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-primary" /> Top Qualifying Matches (GM)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {['general', 'obc'].map((cat) => {
                      const college = getCollegeSuggestions(prediction.medium, cat)
                      return (
                        <div key={cat} className="p-2.5 rounded border border-border/80 bg-muted/20 text-xs">
                          <div className="font-semibold text-foreground truncate">{college.name}</div>
                          <div className="text-muted-foreground text-[11px] truncate">{college.branch}</div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Score Breakdown */}
        <TabsContent value="breakdown" className="space-y-6">
          {prediction ? (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Component Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">KCET Exam (50% Weightage)</span>
                      <span className="font-mono font-bold">{kcetMarks}/180 ({((kcetMarks / 180) * 100).toFixed(1)}%)</span>
                    </div>
                    <Progress value={(kcetMarks / 180) * 100} className="h-2" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Board PCM (50% Weightage)</span>
                      <span className="font-mono font-bold">{pucPercentage}%</span>
                    </div>
                    <Progress value={pucPercentage} className="h-2" />
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-border/60">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold">Normalized Composite Score</span>
                      <span className="font-mono font-bold text-primary">{prediction.composite.toFixed(2)}%</span>
                    </div>
                    <Progress value={prediction.composite} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold">Percentile & Position Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs">
                  <p className="text-muted-foreground leading-relaxed">
                    {getRankAnalysis(prediction.medium)}
                  </p>
                  <div className="p-3 rounded bg-muted/40 border border-border space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Candidate Percentile:</span>
                      <span className="font-mono font-bold text-foreground">{calculatePercentile(prediction.medium)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confidence Range:</span>
                      <span className="font-mono font-semibold text-foreground">{prediction.low.toLocaleString('en-IN')} – {prediction.high.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="p-8 text-center text-xs text-muted-foreground">
              Adjust score inputs to view breakdown metrics.
            </Card>
          )}
        </TabsContent>

        {/* Tab 3: Competition & Gap */}
        <TabsContent value="analysis" className="space-y-6">
          {prediction && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" /> Candidate Density by Score Band
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const analysis = getRankGapAnalysis(prediction.composite)
                    return (
                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between py-1 border-b border-border/40">
                           <span className="text-muted-foreground">Score Band</span>
                          <span className="font-mono font-semibold">{prediction.rankBand}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Competitors per 1% Score</span>
                          <span className="font-mono font-bold text-foreground">{analysis.candidatesPerPercent} candidates</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/40">
                          <span className="text-muted-foreground">Rank Movement Sensitivity</span>
                          <Badge variant="secondary" className="font-mono text-[10px]">{analysis.improvementPotential}</Badge>
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>

              <Card className="border border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Benchmark Aggregate Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border/50 text-xs">
                    {getCutoffEstimates().slice(0, 5).map((cutoff, idx) => (
                      <div key={idx} className="flex items-center justify-between px-4 py-2.5">
                        <span className="font-medium text-foreground">{cutoff.targetRank}</span>
                        <span className="font-mono font-semibold text-primary">{cutoff.expectedAggregate}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Tab 4: Historical Benchmarks */}
        <TabsContent value="methodology" className="space-y-6">
          <Card className="border border-border bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <LineChartIcon className="h-4 w-4 text-primary" /> Aggregate Score vs Rank Curve (Historical KEA)
              </CardTitle>
              <CardDescription className="text-xs">
                Derived from verified candidate records across Karnataka CET 2023–2025.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[320px] w-full bg-background rounded border border-border p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={kcet2025RankTable.filter(d => d.rank <= 100000)} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                    <XAxis
                      dataKey="score"
                      type="number"
                      domain={['dataMin - 1', 'dataMax + 1']}
                      label={{ value: 'Aggregate %', position: 'bottom', offset: 0, fill: 'currentColor', opacity: 0.6, fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                      tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 10 }}
                    />
                    <YAxis
                      dataKey="rank"
                      domain={[0, 100000]}
                      label={{ value: 'Rank', angle: -90, position: 'insideLeft', offset: -5, fill: 'currentColor', opacity: 0.6, fontSize: 11 }}
                      reversed={true}
                      tickFormatter={(v) => v.toLocaleString('en-IN')}
                      tick={{ fill: 'currentColor', opacity: 0.6, fontSize: 10 }}
                    />
                    <RechartsTooltip
                      formatter={(value: any) => [value.toLocaleString('en-IN'), "Expected Rank"]}
                      labelFormatter={(label) => `Aggregate: ${label}%`}
                      contentStyle={{ borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--foreground)', fontSize: '12px' }}
                    />
                    <Line type="monotone" dataKey="rank" stroke="#2563eb" strokeWidth={2} dot={{ r: 1.5, fill: "#2563eb" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Saved History */}
        <TabsContent value="progress" className="space-y-4">
          {savedResults.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stored Calculations (This Browser)</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    localStorage.removeItem('kcetResults')
                    setSavedResults([])
                    toast({ title: "History Cleared" })
                  }}
                >
                  Clear History
                </Button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {savedResults.slice().reverse().map((result, index) => (
                  <div key={index} className="p-3 rounded-md border border-border bg-card text-xs flex justify-between items-center shadow-xs">
                    <div>
                      <div className="font-mono font-bold text-sm text-foreground">Rank ~{result.rank.toLocaleString('en-IN')}</div>
                      <div className="text-muted-foreground text-[11px]">KCET: {result.cet}/180 • Board: {result.puc}%</div>
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Card className="p-8 text-center text-xs text-muted-foreground">
              No saved calculations on this device yet. Click "Save to History" on any prediction.
            </Card>
          )}
        </TabsContent>

        {/* Tab 6: Policy & Disclaimer Notes */}
        <TabsContent value="disclaimer" className="space-y-4">
          <Card className="border border-border bg-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Official Disclaimer & Policy Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground pt-4">
              <div className="p-3 rounded bg-muted/30 border border-border space-y-1">
                <strong className="text-foreground block">Independent Statistical Model</strong>
                <p className="leading-relaxed">
                  KCET Coded rank projections are mathematical estimates derived from historical KEA cutoff patterns (2023–2025). Actual ranks published by Karnataka Examination Authority (cetonline.karnataka.gov.in) depend on overall candidate volume, question paper difficulty variance, and official Board normalization rules.
                </p>
              </div>
              <div className="p-3 rounded bg-muted/30 border border-border space-y-1">
                <strong className="text-foreground block">Local Processing & Privacy</strong>
                <p className="leading-relaxed">
                  All mark calculations occur locally in your browser. No personal identifiable information is collected or shared during calculations.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RankPredictor


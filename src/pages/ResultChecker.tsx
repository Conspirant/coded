import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { SEO } from "@/components/SEO"
import { 
  Award, 
  BookOpen, 
  Sparkles, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ArrowRight, 
  Clock, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react'
import { ActualRankService } from "@/lib/actual-rank-service"


interface ParsedResult {
  name: string
  regNo: string
  ranks: {
    engineering: number | null
    agriculture: number | null
    veterinary: number | null
    ayush: number | null
    bpharma: number | null
    pharmd: number | null
  }
  marks: {
    physics: number
    chemistry: number
    maths: number
    biology: number
  }
  isMock?: boolean
  _offlineFallback?: boolean
}

export default function ResultChecker() {
  const [applNo, setApplNo] = useState("")
  const [dob, setDob] = useState("")
  const [result, setResult] = useState<ParsedResult | null>(null)
  const [error, setError] = useState<{ title: string; message: string } | null>(null)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("Connecting to KEA server...")
  const [retryCount, setRetryCount] = useState(0)
  const [hasContributed, setHasContributed] = useState(false)
  const [isContributing, setIsContributing] = useState(false)

  const { toast } = useToast()
  const navigate = useNavigate()

  // Cycle through messages while loading to give feedback under server strain
  useEffect(() => {
    if (!isLoading) return

    const timer = setInterval(() => {
      setRetryCount(prev => {
        const next = prev + 1
        if (next === 1) {
          setLoadingMessage("Sending credentials and checking security tokens...")
        } else if (next === 2) {
          setLoadingMessage("KEA server is responding slowly. Retrying fetch...")
        } else if (next === 3) {
          setLoadingMessage("Attempting secondary mirror server check...")
        } else if (next >= 4) {
          setLoadingMessage(`KEA server is extremely busy. Still retrying in background (Attempt ${next})...`)
        }
        return next
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [isLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!applNo.trim()) {
      toast({ title: "Validation Error", description: "Application Number is required.", variant: "destructive" })
      return
    }
    if (!dob) {
      toast({ title: "Validation Error", description: "Date of Birth is required.", variant: "destructive" })
      return
    }

    // Convert yyyy-mm-dd from browser date input to dd-mm-yyyy for KEA
    const [year, month, day] = dob.split("-")
    const formattedDob = `${day}-${month}-${year}`

    setIsLoading(true)
    setRetryCount(0)
    setLoadingMessage("Connecting to KEA server...")
    setResult(null)
    setError(null)
    setIsErrorModalOpen(false)
    setHasContributed(false)

    try {
      const response = await fetch("/api/check-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applNo: applNo.trim(), dob: formattedDob })
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        toast({
          title: data.isMock ? "Demo Results Loaded" : "Results Fetched Successfully! 🎉",
          description: `Loaded scorecard for ${data.name}.`
        })
      } else {
        const errObj = {
          title: data.error || "Failed to Fetch",
          message: data.message || "An error occurred while fetching your results."
        }
        setError(errObj)
        setIsErrorModalOpen(true)
      }
    } catch (err) {
      console.error(err)
      const errObj = {
        title: "Connection Error",
        message: "Could not reach the server. Please check your internet connection."
      }
      setError(errObj)
      setIsErrorModalOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  // Anonymously submit ranks to calibrate the next year predictor
  const handleContribute = async () => {
    if (!result) return
    setIsContributing(true)
    try {
      const res = await ActualRankService.submitRank({
        kcet_marks: result.marks.physics + result.marks.chemistry + result.marks.maths,
        puc_aggregate: 90.0, // default placeholder since KEA HTML doesn't explicitly display the PUC PCM % in a standard label
        puc_board: "State Board",
        actual_rank: result.ranks.engineering || result.ranks.bpharma || 0,
        category: "GM",
        year: 2026
      })

      if (res.success) {
        setHasContributed(true)
        toast({
          title: "Thank You! ❤️",
          description: "Your rank data has been contributed anonymously to train next year's predictor."
        })
      } else {
        toast({
          title: "Contribution Failed",
          description: res.error || "Failed to submit data.",
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "Failed to submit rank data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsContributing(false)
    }
  }

  const handleShare = async () => {
    if (!result) return
    const shareText = `I got my UGCET 2026 results! Engineering Rank: ${result.ranks.engineering?.toLocaleString() || "N/A"}. Check yours on KCET Coded!`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My UGCET 2026 Results",
          text: shareText,
          url: window.location.href
        })
      } catch (e) {
        console.error(e)
      }
    } else {
      await navigator.clipboard.writeText(`${shareText} ${window.location.origin}/results`)
      toast({
        title: "Link Copied!",
        description: "Results summary and link copied to clipboard. Share it with your friends!"
      })
    }
  }

  const getRankBadgeClass = (rank: number) => {
    if (rank <= 1000) return "bg-amber-500/10 text-amber-400 border-amber-500/20"
    if (rank <= 10000) return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
    return "bg-slate-500/10 text-slate-400 border-slate-500/20"
  }

  const totalCETMarks = result 
    ? (result.marks.physics + result.marks.chemistry + result.marks.maths).toFixed(2)
    : "0"

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <SEO 
        title="UGCET 2026 Live Result Checker – Check KCET Results Instantly"
        description="Check your Karnataka UGCET 2026 results without site crashes. Instantly query your scorecard, view subject-wise marks, check ranks, and see college eligibility."
        url="https://kcet-coded2.vercel.app/results"
        keywords="UGCET 2026 results, KCET result check, checkresult.php bypass, KEA result site crash, Karnataka CET results live, KCET 2026 scorecard"
      />

      {/* Header */}
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl border border-indigo-500/10 mb-2">
          <Award className="h-6 w-6 text-indigo-400 animate-pulse" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-slate-100 to-foreground bg-clip-text">
          UGCET 2026 Results Portal
        </h1>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Retrieve your official KEA scorecard and explore eligible engineering and medical colleges instantly.
        </p>
      </div>

      {/* Main Checker Section */}
      <div className="grid gap-6 md:grid-cols-12 items-start">
        {/* Form Input Card */}
        <Card className="md:col-span-5 border border-white/5 bg-slate-950/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              Credentials Lookup
            </CardTitle>
            <CardDescription className="text-xs">
              Enter your candidate details exactly as printed on your Hall Ticket.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="applNo" className="text-xs text-slate-300">Candidate Application Number</Label>
                <Input 
                  id="applNo"
                  placeholder="e.g. 26UG012345"
                  value={applNo}
                  onChange={e => setApplNo(e.target.value)}
                  disabled={isLoading}
                  className="bg-black/30 border-white/10 text-sm h-10 focus:border-indigo-500/50"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dob" className="text-xs text-slate-300">Date of Birth</Label>
                <div className="relative">
                  <Input 
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    disabled={isLoading}
                    className="bg-black/30 border-white/10 text-sm h-10 focus:border-indigo-500/50 pr-8"
                    required
                  />
                  <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/25 transition-all text-sm"
              >
                {isLoading ? "Fetching Scorecard..." : "Get Results"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
              <div className="flex items-start gap-2 text-[10px] text-muted-foreground leading-relaxed">
                <Clock className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Crash Protection:</strong> Once successfully fetched, results are cached in our database so you can re-check instantly even if KEA servers go offline.
                </span>
              </div>
              <div className="flex items-start gap-2 text-[10px] text-muted-foreground leading-relaxed">
                <Calendar className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  To simulate a test results scorecard locally, search with application number starting with <code>TEST</code> (e.g. <code>TEST2026</code>).
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Panel */}
        <div className="md:col-span-7 space-y-4">
          {isLoading && (
            <Card className="border-indigo-500/20 bg-indigo-500/[0.02] py-12 flex flex-col items-center justify-center text-center p-6 space-y-4 shadow-xl">
              <div className="relative flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <Award className="absolute h-5 w-5 text-indigo-400 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-200">Querying KEA Results Server</h3>
                <p className="text-xs text-muted-foreground max-w-sm leading-normal">
                  {loadingMessage}
                </p>
              </div>
              {retryCount > 1 && (
                <Badge variant="outline" className="border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] animate-pulse">
                  Attempt {retryCount} of 3
                </Badge>
              )}
            </Card>
          )}

          {!isLoading && error && (
            <Card className="border border-rose-500/20 bg-rose-500/[0.02] py-16 flex flex-col items-center justify-center text-center p-6 space-y-3 shadow-xl animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-rose-400">{error.title}</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                  {error.message}
                </p>
              </div>
              <Button
                onClick={() => setIsErrorModalOpen(true)}
                variant="outline"
                size="sm"
                className="border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs mt-2"
              >
                View Troubleshooting Steps
              </Button>
            </Card>
          )}

          {!isLoading && !result && !error && (
            <Card className="border border-white/5 bg-slate-950/20 py-16 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-300">No Scorecard Loaded</h3>
                <p className="text-xs text-muted-foreground max-w-xs leading-normal">
                  Enter your credentials on the left to securely retrieve and view your UGCET 2026 scorecard.
                </p>
              </div>
            </Card>
          )}

          {!isLoading && result && (
            <div className="space-y-4 animate-scale-in">
              {/* Scorecard Header */}
              <Card className="border border-white/5 bg-slate-950/40 shadow-xl overflow-hidden relative">
                {result.isMock && (
                  <div className="absolute top-0 right-0">
                    <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-none rounded-bl-lg text-[9px] font-mono tracking-widest uppercase">
                      Test Simulation
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-100">{result.name}</CardTitle>
                      <CardDescription className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-0.5">
                        REG NO: {result.regNo}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground block">CET Marks</span>
                      <span className="text-2xl font-black text-indigo-400 font-mono">{totalCETMarks}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Ranks Grid */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Exam Ranks</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(result.ranks).map(([key, rank]) => {
                        if (rank === null) return null
                        return (
                          <div 
                            key={key} 
                            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between"
                          >
                            <span className="text-[10px] text-muted-foreground capitalize">{key.replace("bpharma", "B-Pharma").replace("pharmd", "Pharm-D")}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-base font-extrabold font-mono text-slate-100">{rank.toLocaleString()}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Marks breakdown */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">Subject Marks</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: "Physics", val: result.marks.physics, color: "text-blue-400" },
                        { label: "Chemistry", val: result.marks.chemistry, color: "text-amber-400" },
                        { label: "Maths", val: result.marks.maths, color: "text-indigo-400" },
                        { label: "Biology", val: result.marks.biology, color: "text-emerald-400" }
                      ].map(sub => (
                        <div key={sub.label} className="p-2.5 rounded-lg bg-black/20 border border-white/5 text-center">
                          <span className="text-[9px] text-muted-foreground block">{sub.label}</span>
                          <span className={`text-sm font-bold font-mono ${sub.color} block mt-0.5`}>{sub.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2.5 items-center justify-between">
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleShare}
                        variant="outline" 
                        size="sm" 
                        className="h-9 text-xs border-white/10 hover:bg-white/5 flex items-center gap-1.5"
                      >
                        <Share2 className="h-3.5 w-3.5 text-slate-400" />
                        Share
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      {result.ranks.engineering && (
                        <Button 
                          onClick={() => navigate(`/college-finder?rank=${result.ranks.engineering}`)}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 px-4 rounded-lg flex items-center gap-1.5 shadow-lg shadow-indigo-600/25"
                        >
                          Find Colleges
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crowd Source Calibration Banner */}
              {!hasContributed && (
                <Card className="border border-indigo-500/20 bg-gradient-to-br from-indigo-950/30 to-slate-950 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Database className="h-4 w-4 text-indigo-400" />
                      Help Train the 2027 Predictor
                    </h4>
                    <p className="text-[10px] text-muted-foreground leading-normal max-w-md">
                      Contribute your rank card anonymously to the public database. This helps us calibrate the predictor algorithm for the next batch of students!
                    </p>
                  </div>
                  <Button 
                    onClick={handleContribute}
                    disabled={isContributing}
                    size="sm"
                    className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 h-8 text-xs font-semibold shrink-0"
                  >
                    {isContributing ? "Contributing..." : "Contribute Anonymously"}
                  </Button>
                </Card>
              )}

              {hasContributed && (
                <Card className="border border-emerald-500/20 bg-emerald-500/[0.02] p-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-medium text-emerald-400">
                    Thank you! Your marks and rank calibration data has been saved anonymously.
                  </span>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Official Disclaimer */}
      <Card className="border border-rose-500/10 bg-rose-500/[0.01] p-4 text-xs leading-relaxed text-muted-foreground flex gap-3">
        <ShieldAlert className="h-5 w-5 text-rose-500/40 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-300 block">Official Disclaimer</span>
          <p className="text-[10px] text-muted-foreground/80">
            KCET Coded is an independent community project. We are not officially affiliated with the Karnataka Examinations Authority (KEA) or the Government of Karnataka. Ranks and results displayed here are pulled directly from KEA's backend, but always verify your scorecard on the official KEA website: 
            <a 
              href="https://keaonline.karnataka.gov.in/ugcet_2026_result/checkresult.php" 
              target="_blank" 
              rel="noreferrer"
              className="font-medium text-slate-300 hover:text-indigo-400 underline inline-flex items-center gap-0.5 ml-1"
            >
              keaonline.karnataka.gov.in <ExternalLink className="h-3 w-3 inline" />
            </a>.
          </p>
        </div>
      </Card>

      {/* Invalid Credentials / Error Modal — custom fixed overlay for guaranteed centering */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Modal content */}
          <div className="relative w-full max-w-md bg-slate-950 border border-rose-500/20 text-foreground overflow-hidden rounded-2xl p-6 shadow-2xl animate-scale-in">
            {/* Background glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="relative space-y-3 pb-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-500 to-red-600 flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-rose-400">
                    {error?.title || "Invalid Credentials"}
                  </h3>
                  <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded font-bold uppercase tracking-wider block mt-1 w-fit">
                    Lookup Failed
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed pt-1">
                {error?.message || "The Application Number or Date of Birth you entered does not match any record on KEA's server."}
              </p>
            </div>

            {/* Body */}
            <div className="relative space-y-4 py-2">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                <span className="text-xs font-bold text-slate-200 block">Troubleshooting Steps</span>
                <div className="space-y-2 text-[11px] text-muted-foreground leading-normal">
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">1.</span>
                    <p>Double-check your <strong className="text-slate-300">Application Number</strong> — it must match exactly as printed on your KEA Hall Ticket (e.g. <code className="text-indigo-400">26UG012345</code>).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">2.</span>
                    <p>Verify your <strong className="text-slate-300">Date of Birth</strong> — the day, month, and year must match your admission ticket exactly.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">3.</span>
                    <p>If you are sure your credentials are correct, KEA servers may be experiencing issues. Try again in a few minutes or check directly:
                      <a href="https://keaonline.karnataka.gov.in/ugcet_2026_result/checkresult.php" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline inline-flex items-center gap-0.5 font-semibold ml-1">
                        KEA Portal <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setIsErrorModalOpen(false)}
                  className="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-extrabold shadow-lg shadow-rose-500/10 h-11 transition-all flex items-center justify-center gap-1.5 text-sm"
                >
                  Try Again
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => {
                    setIsErrorModalOpen(false)
                    window.open('https://keaonline.karnataka.gov.in/ugcet_2026_result/checkresult.php', '_blank')
                  }}
                  variant="ghost"
                  className="text-muted-foreground hover:text-slate-200 text-xs h-9 flex items-center gap-1"
                >
                  Check on KEA directly
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

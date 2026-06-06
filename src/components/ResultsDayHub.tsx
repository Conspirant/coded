import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { 
  Sparkles, 
  Search, 
  Database, 
  Calculator, 
  GraduationCap, 
  ChevronRight,
  TrendingUp,
  CheckCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react"
import { ActualRankService } from "@/lib/actual-rank-service"

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

const STREAMS = [
  { id: "cs", label: "Computer Science & IT", codes: ["CS", "IE", "AD", "AI", "CB", "CD", "CY", "DS", "MC"] },
  { id: "ec", label: "Electronics & Electrical", codes: ["EC", "EE", "EI", "EV"] },
  { id: "me", label: "Mechanical & Aerospace", codes: ["ME", "AE", "SE", "MT"] },
  { id: "cv", label: "Civil & Architecture", codes: ["CE", "AR", "CK"] },
  { id: "bt", label: "Biotech & Allied", codes: ["BT", "BM", "CH"] }
]

export const ResultsDayHub = () => {
  const [activeTab, setActiveTab] = useState<"check" | "share">("check")
  const navigate = useNavigate()
  const { toast } = useToast()

  // Tab 1: Check state
  const [rank, setRank] = useState<string>("")
  const [category, setCategory] = useState<string>("GM")
  const [selectedStreams, setSelectedStreams] = useState<string[]>(["cs"])

  // Tab 2: Share state
  const [shareRank, setShareRank] = useState<string>("")
  const [shareMarks, setShareMarks] = useState<string>("")
  const [sharePucAggregate, setSharePucAggregate] = useState<string>("")
  const [shareBoard, setShareBoard] = useState<string>("State Board")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)

  const handleStreamToggle = (streamId: string) => {
    setSelectedStreams(prev => 
      prev.includes(streamId) 
        ? prev.filter(id => id !== streamId) 
        : [...prev, streamId]
    )
  }

  const handleCheckColleges = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rank || parseInt(rank) <= 0) {
      toast({
        title: "Invalid Rank",
        description: "Please enter a valid rank to check eligible colleges.",
        variant: "destructive"
      })
      return
    }

    // Map selected stream groupings to their list of codes
    const courseCodes = selectedStreams.flatMap(streamId => {
      const streamObj = STREAMS.find(s => s.id === streamId)
      return streamObj ? streamObj.codes : []
    }).join(",")

    navigate(`/college-finder?rank=${rank}&category=${category}&courses=${courseCodes}`)
  }

  const handleShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shareRank || parseInt(shareRank) <= 0) {
      toast({ title: "Validation Error", description: "Please enter your actual KCET rank.", variant: "destructive" })
      return
    }
    if (!shareMarks || parseFloat(shareMarks) <= 0 || parseFloat(shareMarks) > 180) {
      toast({ title: "Validation Error", description: "KCET marks must be between 1 and 180.", variant: "destructive" })
      return
    }
    if (!sharePucAggregate || parseFloat(sharePucAggregate) <= 0 || parseFloat(sharePucAggregate) > 100) {
      toast({ title: "Validation Error", description: "PUC/12th PCM aggregate percentage must be between 1 and 100.", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await ActualRankService.submitRank({
        kcet_marks: parseFloat(shareMarks),
        puc_aggregate: parseFloat(sharePucAggregate),
        puc_board: shareBoard,
        actual_rank: parseInt(shareRank),
        category: category,
        year: 2026
      })

      if (res.success) {
        setSubmitted(true)
        toast({
          title: "Thank You! 🎉",
          description: "Your data has been anonymously added to the database. Good luck with counseling!",
        })
      } else {
        toast({
          title: "Submission Failed",
          description: res.error || "Failed to submit data.",
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-background backdrop-blur-2xl shadow-2xl rounded-2xl">
      {/* Decorative neon gradient effects */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="pb-4 border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                KCET 2026 Results Portal
                <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold tracking-wider animate-pulse text-[10px]">
                  LIVE CHECKER
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Official ranks declared today. Run instant options analysis.
              </CardDescription>
            </div>
          </div>

          {/* Custom Tabs controller */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => navigate("/results")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-3 rounded-lg flex items-center gap-1 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-emerald-600/10"
            >
              Check Live Scorecard
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            
            <div className="flex h-9 rounded-lg border border-white/10 bg-white/5 p-1 text-muted-foreground w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("check")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeTab === "check" 
                    ? "bg-indigo-600 text-white shadow" 
                    : "hover:text-foreground"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                Check Eligibility
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("share")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeTab === "share" 
                    ? "bg-indigo-600 text-white shadow" 
                    : "hover:text-foreground"
                }`}
              >
                <Database className="h-3.5 w-3.5" />
                Calibrate 2027
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {activeTab === "check" ? (
          <form onSubmit={handleCheckColleges} className="space-y-6">
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rank" className="text-sm font-semibold text-foreground/90">
                  Your Actual KCET Rank
                </Label>
                <div className="relative">
                  <Input
                    id="rank"
                    type="number"
                    required
                    placeholder="e.g. 15430"
                    value={rank}
                    onChange={(e) => setRank(e.target.value)}
                    className="bg-black/20 border-white/10 h-11 text-base font-mono focus:ring-indigo-500/20 focus:border-indigo-500 pl-4"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground uppercase font-semibold select-none">
                    Rank Card
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-semibold text-foreground/90">
                  Counseling Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="bg-black/20 border-white/10 h-11 text-sm">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10">
                    {KCET_CATEGORIES.map(cat => (
                      <SelectItem key={cat.code} value={cat.code} className="hover:bg-slate-800 text-sm">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-foreground/90 block">
                Preferred Engineering Streams
              </Label>
              <div className="flex flex-wrap gap-2">
                {STREAMS.map(stream => {
                  const isSelected = selectedStreams.includes(stream.id)
                  return (
                    <button
                      key={stream.id}
                      type="button"
                      onClick={() => handleStreamToggle(stream.id)}
                      className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                        isSelected 
                          ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-sm" 
                          : "border-white/5 bg-white/[0.02] text-muted-foreground hover:border-white/10 hover:text-foreground"
                      }`}
                    >
                      {stream.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:scale-[1.01] shadow-lg shadow-indigo-600/20 border-0 transition-all gap-2"
            >
              Find Eligible Colleges
              <ChevronRight className="h-4.5 w-4.5" />
            </Button>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>216k+ historical cutoff rows verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono">
                  No Sign-up
                </span>
                <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded font-mono">
                  100% Free
                </span>
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            {submitted ? (
              <div className="py-8 text-center space-y-4 animate-scale-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Submission Received!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Your details have been saved anonymously. This will be used to calibrate the rank predictor algorithm for 2027 aspirants.
                  </p>
                </div>
                <Button 
                  onClick={() => setSubmitted(false)} 
                  variant="outline" 
                  size="sm"
                  className="border-white/10 hover:bg-white/5"
                >
                  Submit Another Record
                </Button>
              </div>
            ) : (
              <form onSubmit={handleShareSubmit} className="space-y-5">
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    <strong>Crowdsourcing Drive:</strong> Ranks fluctuate yearly. Sharing your official KCET marks, PUC Aggregate %, and official rank helps build a highly accurate dataset for next year's students. Your entries are 100% anonymous.
                  </p>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shareRank" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Official Rank
                    </Label>
                    <Input
                      id="shareRank"
                      type="number"
                      required
                      placeholder="e.g. 15430"
                      value={shareRank}
                      onChange={(e) => setShareRank(e.target.value)}
                      className="bg-black/20 border-white/10 h-10 font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shareMarks" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      KCET Marks (out of 180)
                    </Label>
                    <Input
                      id="shareMarks"
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 115.5"
                      value={shareMarks}
                      onChange={(e) => setShareMarks(e.target.value)}
                      className="bg-black/20 border-white/10 h-10 font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sharePuc" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      PUC/12th PCM %
                    </Label>
                    <Input
                      id="sharePuc"
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 96.67"
                      value={sharePucAggregate}
                      onChange={(e) => setSharePucAggregate(e.target.value)}
                      className="bg-black/20 border-white/10 h-10 font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shareBoard" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      12th Board Type
                    </Label>
                    <Select value={shareBoard} onValueChange={setShareBoard}>
                      <SelectTrigger id="shareBoard" className="bg-black/20 border-white/10 h-10 text-xs">
                        <SelectValue placeholder="Select Board" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10 text-xs">
                        <SelectItem value="State Board" className="hover:bg-slate-800">Karnataka State Board (PUC)</SelectItem>
                        <SelectItem value="CBSE" className="hover:bg-slate-800">CBSE Class 12</SelectItem>
                        <SelectItem value="ISC" className="hover:bg-slate-800">ISC Class 12</SelectItem>
                        <SelectItem value="Other" className="hover:bg-slate-800">Other / Equivalent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/10 border-0 transition-all gap-1.5"
                >
                  {isSubmitting ? "Submitting..." : "Submit Anonymously to Database"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

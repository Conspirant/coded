import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/integrations/supabase/client"
import { Layout } from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { 
  Heart, 
  Sparkles, 
  Smile, 
  TrendingUp, 
  MessageSquare, 
  RefreshCw, 
  ArrowRight,
  TrendingDown,
  Info,
  ShieldCheck,
  Send,
  HelpCircle
} from "lucide-react"

// Types for floating heart animations
interface FloatingHeart {
  id: number
  x: number
  y: number
  size: number
  delay: number
}

// Relatable pre-populated vents for student community
const INITIAL_VENTS: Array<{ id: string; text: string; time: string; tag: string; color: string }> = []

// Inspirational perspectives from seniors
const PERSPECTIVES = [
  {
    quote: "Your college brand is 10% of your career. The other 90% is what you build, learn, and who you connect with. In 4 years, no tech recruiter will care about your KCET rank.",
    author: "Senior Software Engineer, Ex-Amazon (Tier-3 College Alumnus)"
  },
  {
    quote: "I got a 31,000 rank in KCET 2021. Felt like my life was over. Ended up in a local college, started contributing to open source, and cracked a 15 LPA remote job last month. Skills beat college every day.",
    author: "Nikhil S., KCET 2021 Aspirant"
  },
  {
    quote: "Don't hyper-focus on CSE in a top college. Specialized branches (AI/ML, Data Science, ISE) or even ECE/EEE are excellent. You can study coding alongside any branch. Don't compromise your mental health.",
    author: "Ananya R., Senior Guide for KCET Counselings"
  },
  {
    quote: "A bad rank is not a reflection of your intelligence, it is just a reflection of an flawed system with board marks addition. Let it go, make a smart option list, and conquer the next 4 years.",
    author: "College Counselor & Career Mentor"
  }
]

export default function CopingZone() {
  const [hugsCount, setHugsCount] = useState<number>(693)
  const [localHugsSent, setLocalHugsSent] = useState<number>(0)
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])
  const [activePerspective, setActivePerspective] = useState<number>(0)
  
  // Cutoff Shift Calculator state
  const [lastYearCutoff, setLastYearCutoff] = useState<string>("")
  const [simulatedMin, setSimulatedMin] = useState<number | null>(null)
  const [simulatedMax, setSimulatedMax] = useState<number | null>(null)

  // Vent Wall state
  const [vents, setVents] = useState(INITIAL_VENTS)
  const [newVent, setNewVent] = useState("")
  const [ventTag, setVentTag] = useState("Student Vent")

  // Fetch initial hugs count & subscribe to realtime updates
  useEffect(() => {
    const fetchHugs = async () => {
      try {
        const { count, error } = await supabase
          .from("coping_hugs")
          .select("*", { count: "exact", head: true })
        
        if (!error && count !== null) {
          // Pre-seed with 693
          setHugsCount(693 + count)
        }
      } catch (err) {
        console.error("Failed to load realtime hugs:", err)
      }
    }

    fetchHugs()

    // Subscribe to realtime insert events
    const channel = supabase
      .channel("public:coping_hugs")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "coping_hugs" },
        () => {
          setHugsCount(prev => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Load custom vents from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("coping_vents")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setVents(prev => [...parsed, ...prev])
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  // Handle sending a hug
  const handleSendHug = async () => {
    // Optimistic local state update
    setHugsCount(prev => prev + 1)
    setLocalHugsSent(prev => prev + 1)

    // Trigger floating heart particle
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 - 40, // offset left/right
      y: 0,
      size: Math.random() * 15 + 15,
      delay: 0
    }
    setFloatingHearts(prev => [...prev, newHeart])

    // Cleanup heart after animation
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id))
    }, 1500)

    // Send to database
    try {
      await supabase.from("coping_hugs").insert([{}])
    } catch (err) {
      // Fail silently, keep count updated locally
    }
  }

  // Calculate simulated cutoff expansion
  const calculateShift = (e: React.FormEvent) => {
    e.preventDefault()
    const cutoff = parseInt(lastYearCutoff)
    if (!cutoff || cutoff <= 0) {
      toast.error("Please enter a valid cutoff rank")
      return
    }

    // Mathematical model for cutoff shift due to rank inflation:
    // Higher ranks inflate slightly less in percentage, middle/lower ranks expand significantly.
    // e.g. 1k -> 1.05x to 1.1x. 10k -> 1.15x to 1.25x. 30k -> 1.2x to 1.35x.
    let multiplierMin = 1.05
    let multiplierMax = 1.15

    if (cutoff > 30000) {
      multiplierMin = 1.20
      multiplierMax = 1.40
    } else if (cutoff > 15000) {
      multiplierMin = 1.15
      multiplierMax = 1.30
    } else if (cutoff > 5000) {
      multiplierMin = 1.10
      multiplierMax = 1.20
    }

    setSimulatedMin(Math.round(cutoff * multiplierMin))
    setSimulatedMax(Math.round(cutoff * multiplierMax))
  }

  // Handle posting a vent
  const handlePostVent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVent.trim()) return

    const newVentObj = {
      id: `local-${Date.now()}`,
      text: newVent.trim(),
      time: "Just now",
      tag: ventTag,
      color: "from-indigo-500/10 to-purple-500/10 border-indigo-500/20"
    }

    // Save to local state and localStorage
    const updatedLocalVents = [newVentObj]
    const currentSaved = localStorage.getItem("coping_vents")
    let newSaved = [newVentObj]
    if (currentSaved) {
      try {
        newSaved = [...newSaved, ...JSON.parse(currentSaved)]
      } catch (err) {
        console.error(err)
      }
    }
    localStorage.setItem("coping_vents", JSON.stringify(newSaved))

    setVents(prev => [newVentObj, ...prev])
    setNewVent("")
    toast.success("Vent posted to your wall anonymously! 🤍")
  }

  return (
    <Layout>
      <div className="relative space-y-8 max-w-6xl mx-auto pb-12 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-0 -ml-24 -mb-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ═══ Header Section ═══ */}
        <div className="text-center space-y-4 relative z-10 pt-4">
          <Badge className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-1.5 text-xs font-semibold tracking-wider">
            ASPIRANT COPE & CARE ZONE 🫂
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Take a Breath. <br />
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Ranks Inflate, Your Potential Doesn't.
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            KEA's rank shifts are overwhelming, but remember: the cutoffs will also expand.
            De-stress, estimate realistic shifts, read perspectives, and send some virtual hugs.
          </p>
        </div>

        {/* ═══ Grid Layout ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
          
          {/* LEFT COLUMN: Hugs Counter & Perspective Carousel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Real-time Hugs Card */}
            <Card className="border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-950/80 backdrop-blur-2xl shadow-xl overflow-hidden relative">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-6 relative">
                {/* Neon blur accent */}
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent pointer-events-none" />

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block">
                    Real-time Group Hugs Sent
                  </span>
                  <div className="text-4xl sm:text-5xl font-black tabular-nums bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent flex items-center justify-center gap-1.5 animate-pulse-glow">
                    {hugsCount.toLocaleString()}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Every click submits a heart to Supabase, updating live for everyone.
                  </p>
                </div>

                {/* Pulsing Hug Trigger */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Floating hearts container */}
                  <AnimatePresence>
                    {floatingHearts.map(heart => (
                      <motion.div
                        key={heart.id}
                        initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                        animate={{ 
                          opacity: 0, 
                          scale: 1.5, 
                          x: heart.x, 
                          y: -120,
                          rotate: heart.x * 2 
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute text-rose-500 select-none pointer-events-none"
                        style={{ fontSize: `${heart.size}px` }}
                      >
                        ❤️
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Pulsing circles */}
                  <div className="absolute inset-0 bg-rose-500/5 rounded-full animate-ping pointer-events-none" />
                  <div className="absolute inset-4 bg-rose-500/10 rounded-full animate-pulse pointer-events-none" />
                  
                  <Button
                    onClick={handleSendHug}
                    size="icon"
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-lg shadow-rose-500/30 border-0 flex flex-col items-center justify-center gap-0.5 group active:scale-95 transition-all"
                  >
                    <Heart className="h-9 w-9 fill-white group-hover:scale-110 transition-transform animate-float-gentle" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">
                      Send Hug
                    </span>
                  </Button>
                </div>

                {localHugsSent > 0 && (
                  <Badge variant="secondary" className="bg-rose-500/10 text-rose-400 border-rose-500/20 font-semibold text-xs">
                    You sent {localHugsSent} virtual hug{localHugsSent > 1 ? "s" : ""}!
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Perspective Carousel Card */}
            <Card className="border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl relative">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400" />
                  Perspective Shift
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Read advice from seniors who faced similar disappointments.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-4">
                <div className="min-h-[140px] flex flex-col justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 relative">
                  <div className="text-slate-200 text-sm leading-relaxed italic">
                    "{PERSPECTIVES[activePerspective].quote}"
                  </div>
                  <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider text-right mt-4">
                    — {PERSPECTIVES[activePerspective].author}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-1">
                    {PERSPECTIVES.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActivePerspective(i)}
                        className={`h-1.5 rounded-full transition-all ${
                          activePerspective === i ? "w-6 bg-indigo-500" : "w-1.5 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    onClick={() => setActivePerspective(prev => (prev + 1) % PERSPECTIVES.length)}
                    variant="outline"
                    size="sm"
                    className="border-white/10 hover:bg-white/5 text-xs h-8"
                  >
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Next Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: Calculator & Vent Wall (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Cutoff Expansion Predictor */}
            <Card className="border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Cutoff Shift Estimator
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  See how much last year's cutoff ranks might relax due to this year's inflation.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-4 space-y-4">
                
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl text-xs space-y-3">
                  <div className="flex gap-2 text-emerald-300 font-bold text-sm items-center">
                    <Info className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Why Cutoffs Will Shift Outwards</span>
                  </div>
                  
                  <div className="text-slate-300 space-y-2.5 leading-relaxed">
                    <p>
                      <strong>1. Constant Seats Rule:</strong> Colleges do not add more classroom seats because of rank inflation. If a college course has exactly 120 seats, it will admit exactly 120 students (the top 120 applicants who selected it).
                    </p>
                    <p>
                      <strong>2. Ranks are Relative, Scores are Absolute:</strong> Rank inflation happens when scores are exceptionally high across the state, making a specific rank require higher scores than last year.
                    </p>
                    
                    <div className="p-3 bg-black/30 rounded-lg border border-white/5 space-y-2 font-medium">
                      <span className="text-emerald-400 font-bold block text-[11px] uppercase tracking-wider">Example Scenario:</span>
                      <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                        <li>
                          <strong>Last Year:</strong> The 120th (last) student to get into RVCE CSE scored <strong>158 marks</strong>, which was <strong>Rank 250</strong>. (Cutoff = 250).
                        </li>
                        <li>
                          <strong>This Year (Inflated):</strong> Scoring is higher. The student scoring <strong>158 marks</strong> now gets a rank of <strong>580</strong>.
                        </li>
                        <li>
                          <strong>Result:</strong> Since the student caliber and cutoff scores remain similar, the last seat will still be taken by a student with around 158 marks. Because that student's rank is now 580, the cutoff rank naturally expands from <strong>250 to 580</strong>!
                        </li>
                      </ul>
                    </div>
                    
                    <p className="text-[11px] text-slate-400 italic">
                      💡 <strong>Golden Rule:</strong> Ranks are stretched out, so cutoff boundaries will also stretch outwards. Do not filter out your dream college choice just because your rank seems higher than last year's cutoff!
                    </p>
                  </div>
                </div>

                <form onSubmit={calculateShift} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="cutoffInput" className="text-xs text-slate-300 font-semibold">
                      Last Year's Cutoff (e.g. 2025 Round 1 or 2)
                    </Label>
                    <Input
                      id="cutoffInput"
                      type="number"
                      required
                      placeholder="e.g. 12450"
                      value={lastYearCutoff}
                      onChange={(e) => setLastYearCutoff(e.target.value)}
                      className="bg-black/20 border-white/10 h-10 text-sm font-mono"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-10 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs"
                  >
                    Estimate Expansion
                  </Button>
                </form>

                {simulatedMin !== null && simulatedMax !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Historical Cutoff: <strong className="font-mono text-slate-200">{parseInt(lastYearCutoff).toLocaleString()}</strong></span>
                      <span className="text-emerald-400 font-semibold">Shift: +{Math.round(((simulatedMin / parseInt(lastYearCutoff)) - 1) * 100)}% to +{Math.round(((simulatedMax / parseInt(lastYearCutoff)) - 1) * 100)}%</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                          Conservative Estimate
                        </span>
                        <div className="text-2xl font-black font-mono text-emerald-300 pt-0.5">
                          {simulatedMin.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg text-center">
                        <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">
                          Realistic / High Shift
                        </span>
                        <div className="text-2xl font-black font-mono text-teal-300 pt-0.5">
                          {simulatedMax.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-muted-foreground text-center leading-normal pt-1.5">
                      ⚠️ Note: This is an empirical estimation model based on PCM aggregates. Ranks above 20,000 have the highest cutoff expansion potential. Put this choice in your options!
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Student Vent Wall */}
            <Card className="border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-400" />
                  Anonymous Vent Board
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Read local messages from fellow students or pin your own thoughts.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2 space-y-4">
                
                {/* Submit vent form */}
                <form onSubmit={handlePostVent} className="space-y-3">
                  <div className="space-y-1.5">
                    <Textarea
                      placeholder="Feeling anxious? Frustrated by KEA? Or want to leave a tip? Write anonymously here..."
                      required
                      value={newVent}
                      onChange={(e) => setNewVent(e.target.value)}
                      maxLength={200}
                      className="bg-black/25 border-white/10 h-20 text-xs leading-normal resize-none focus:border-indigo-500/50"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
                    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">Tag:</span>
                      {["Student Vent", "Counseling Tip", "Encouragement"].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setVentTag(tag)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                            ventTag === tag 
                              ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                              : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/10"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>

                    <Button
                      type="submit"
                      size="sm"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs gap-1.5 w-full sm:w-auto justify-center"
                    >
                      Post Anonymously
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </form>

                {/* Vents Feed list */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {vents.map(vent => (
                      <motion.div
                        key={vent.id}
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`p-3.5 rounded-xl border bg-gradient-to-r ${vent.color} space-y-2`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <Badge variant="secondary" className="bg-white/5 border-white/5 text-slate-300 py-0.5">
                            {vent.tag}
                          </Badge>
                          <span className="text-muted-foreground">{vent.time}</span>
                        </div>
                        <p className="text-slate-200 text-xs leading-relaxed font-medium">
                          {vent.text}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

import { SEO } from "@/components/SEO"
import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Flame, Clock, Trophy, Share2, CheckCircle2, XCircle,
    ChevronRight, ArrowLeft, Sparkles, Zap, RotateCcw, Copy,
    Calendar, Target, BookOpen
} from "lucide-react"
import { logActivity } from "@/lib/engagement"

/* ═══════════════════════════════════════════════════
   QUESTION BANK
   Physics, Chemistry, Math questions relevant to KCET
   ═══════════════════════════════════════════════════ */

interface Question {
    id: number
    subject: "Physics" | "Chemistry" | "Math"
    question: string
    options: string[]
    correct: number // 0-indexed
    explanation: string
}

const QUESTION_BANK: Question[] = [
    // Physics
    {
        id: 1, subject: "Physics",
        question: "A body is projected vertically upward with velocity 40 m/s. What is the maximum height? (g = 10 m/s²)",
        options: ["60 m", "80 m", "100 m", "120 m"],
        correct: 1,
        explanation: "H = v²/2g = (40)²/(2×10) = 1600/20 = 80 m"
    },
    {
        id: 2, subject: "Physics",
        question: "The SI unit of moment of inertia is:",
        options: ["kg·m", "kg·m²", "kg/m²", "kg·m/s"],
        correct: 1,
        explanation: "Moment of inertia = mass × (distance)² → kg·m²"
    },
    {
        id: 3, subject: "Physics",
        question: "Which color of light has the longest wavelength?",
        options: ["Violet", "Blue", "Green", "Red"],
        correct: 3,
        explanation: "Red light has ≈700 nm, the longest in the visible spectrum (VIBGYOR)."
    },
    {
        id: 4, subject: "Physics",
        question: "If the kinetic energy of a body is doubled, its momentum becomes:",
        options: ["Double", "√2 times", "4 times", "Half"],
        correct: 1,
        explanation: "KE = p²/2m. If KE doubles, p² doubles, so p = √2 times original."
    },
    {
        id: 5, subject: "Physics",
        question: "The dimension of Planck's constant is the same as:",
        options: ["Energy", "Power", "Angular momentum", "Linear momentum"],
        correct: 2,
        explanation: "h has dimensions ML²T⁻¹, same as angular momentum (L = mvr → ML²T⁻¹)."
    },
    {
        id: 6, subject: "Physics",
        question: "A transformer works on the principle of:",
        options: ["Self induction", "Mutual induction", "Ampere's law", "Lenz's law"],
        correct: 1,
        explanation: "A transformer transfers energy between coils via mutual electromagnetic induction."
    },
    {
        id: 7, subject: "Physics",
        question: "The escape velocity from the Earth's surface is approximately:",
        options: ["7.9 km/s", "9.8 km/s", "11.2 km/s", "15.0 km/s"],
        correct: 2,
        explanation: "Escape velocity = √(2gR) ≈ √(2 × 9.8 × 6.4×10⁶) ≈ 11.2 km/s"
    },
    // Chemistry
    {
        id: 8, subject: "Chemistry",
        question: "The IUPAC name of CH₃COCH₃ is:",
        options: ["Acetone", "Propan-2-one", "Propanal", "Propanoic acid"],
        correct: 1,
        explanation: "CH₃COCH₃ is a ketone with 3 carbons. IUPAC: propan-2-one."
    },
    {
        id: 9, subject: "Chemistry",
        question: "Which of the following is NOT a greenhouse gas?",
        options: ["CO₂", "CH₄", "N₂", "N₂O"],
        correct: 2,
        explanation: "N₂ (nitrogen) is NOT a greenhouse gas; it's the most abundant gas in the atmosphere."
    },
    {
        id: 10, subject: "Chemistry",
        question: "The number of σ bonds in ethylene (C₂H₄) is:",
        options: ["3", "4", "5", "6"],
        correct: 2,
        explanation: "C₂H₄: 4 C–H σ bonds + 1 C–C σ bond (+ 1 π bond) = 5 σ bonds total."
    },
    {
        id: 11, subject: "Chemistry",
        question: "pH of 0.001 M HCl solution is:",
        options: ["1", "2", "3", "4"],
        correct: 2,
        explanation: "pH = -log[H⁺] = -log(10⁻³) = 3"
    },
    {
        id: 12, subject: "Chemistry",
        question: "Which element has the highest electronegativity?",
        options: ["Oxygen", "Nitrogen", "Chlorine", "Fluorine"],
        correct: 3,
        explanation: "Fluorine has the highest electronegativity (3.98 on Pauling scale)."
    },
    {
        id: 13, subject: "Chemistry",
        question: "The hybridization of carbon in diamond is:",
        options: ["sp", "sp²", "sp³", "sp³d"],
        correct: 2,
        explanation: "Each carbon in diamond forms 4 σ bonds in a tetrahedral arrangement → sp³ hybridization."
    },
    // Math
    {
        id: 14, subject: "Math",
        question: "The value of sin(30°) + cos(60°) is:",
        options: ["0", "1/2", "1", "√3/2"],
        correct: 2,
        explanation: "sin 30° = 1/2, cos 60° = 1/2 → sum = 1"
    },
    {
        id: 15, subject: "Math",
        question: "If f(x) = x² + 3x + 2, then f'(1) is:",
        options: ["3", "4", "5", "6"],
        correct: 2,
        explanation: "f'(x) = 2x + 3 → f'(1) = 2(1) + 3 = 5"
    },
    {
        id: 16, subject: "Math",
        question: "The number of ways to arrange the letters of 'KCET' is:",
        options: ["12", "24", "48", "120"],
        correct: 1,
        explanation: "4 distinct letters → 4! = 4×3×2×1 = 24 arrangements."
    },
    {
        id: 17, subject: "Math",
        question: "∫ 2x dx from 0 to 3 equals:",
        options: ["6", "9", "12", "3"],
        correct: 1,
        explanation: "∫₀³ 2x dx = [x²]₀³ = 9 - 0 = 9"
    },
    {
        id: 18, subject: "Math",
        question: "The determinant of a matrix [[2, 3], [1, 4]] is:",
        options: ["5", "8", "11", "7"],
        correct: 0,
        explanation: "det = (2×4) - (3×1) = 8 - 3 = 5"
    },
    {
        id: 19, subject: "Math",
        question: "limₓ→₀ (sin x)/x equals:",
        options: ["0", "1", "∞", "Does not exist"],
        correct: 1,
        explanation: "This is a standard limit: limₓ→₀ (sin x)/x = 1."
    },
    {
        id: 20, subject: "Math",
        question: "If log₁₀(x) = 2, then x equals:",
        options: ["20", "100", "1000", "10"],
        correct: 1,
        explanation: "log₁₀(x) = 2 → x = 10² = 100"
    },
    {
        id: 21, subject: "Physics",
        question: "The power of a lens with focal length 25 cm is:",
        options: ["2 D", "4 D", "0.25 D", "25 D"],
        correct: 1,
        explanation: "P = 1/f (in metres) = 1/0.25 = 4 D (dioptre)."
    },
    {
        id: 22, subject: "Chemistry",
        question: "The shape of SF₆ molecule is:",
        options: ["Tetrahedral", "Trigonal bipyramidal", "Octahedral", "Square planar"],
        correct: 2,
        explanation: "SF₆ has 6 bonding pairs, 0 lone pairs → sp³d² hybridization → octahedral shape."
    },
    {
        id: 23, subject: "Math",
        question: "The sum of first 10 natural numbers is:",
        options: ["45", "55", "50", "100"],
        correct: 1,
        explanation: "Sum = n(n+1)/2 = 10 × 11/2 = 55"
    },
    {
        id: 24, subject: "Physics",
        question: "Which of the following is a vector quantity?",
        options: ["Speed", "Mass", "Temperature", "Velocity"],
        correct: 3,
        explanation: "Velocity has both magnitude and direction, making it a vector quantity."
    },
    {
        id: 25, subject: "Chemistry",
        question: "Avogadro's number is approximately:",
        options: ["6.022 × 10²³", "6.022 × 10²²", "3.0 × 10⁸", "1.6 × 10⁻¹⁹"],
        correct: 0,
        explanation: "Avogadro's number N_A ≈ 6.022 × 10²³ particles per mole."
    },
]

/* ═══════════════════════════════════════════════════
   DAILY SELECTION — deterministic based on date
   ═══════════════════════════════════════════════════ */

function getDayString(): string {
    const now = new Date()
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
}

function getDailyQuestions(): Question[] {
    const dayStr = getDayString()
    // Simple hash from date string
    let hash = 0
    for (let i = 0; i < dayStr.length; i++) {
        hash = ((hash << 5) - hash + dayStr.charCodeAt(i)) | 0
    }
    hash = Math.abs(hash)

    // Pick 5 questions using the hash as seed
    const shuffled = [...QUESTION_BANK]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (hash + i * 17) % (i + 1)
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled.slice(0, 5)
}

/* ═══════════════════════════════════════════════════
   PERSISTENCE — localStorage
   ═══════════════════════════════════════════════════ */

interface DailyState {
    day: string
    answers: (number | null)[]   // user answers per question
    completed: boolean
    timeSpent: number            // seconds
}

interface StreakData {
    currentStreak: number
    bestStreak: number
    totalPlayed: number
    totalCorrect: number
    lastPlayedDay: string
}

function loadDailyState(): DailyState | null {
    try {
        const raw = localStorage.getItem("kcet-daily-state")
        if (!raw) return null
        const state = JSON.parse(raw) as DailyState
        if (state.day !== getDayString()) return null // expired
        return state
    } catch { return null }
}

function saveDailyState(state: DailyState) {
    localStorage.setItem("kcet-daily-state", JSON.stringify(state))
}

function loadStreak(): StreakData {
    try {
        const raw = localStorage.getItem("kcet-daily-streak")
        if (!raw) return { currentStreak: 0, bestStreak: 0, totalPlayed: 0, totalCorrect: 0, lastPlayedDay: "" }
        return JSON.parse(raw)
    } catch { return { currentStreak: 0, bestStreak: 0, totalPlayed: 0, totalCorrect: 0, lastPlayedDay: "" } }
}

function saveStreak(data: StreakData) {
    localStorage.setItem("kcet-daily-streak", JSON.stringify(data))
}

function isYesterday(dayStr: string): boolean {
    const [y, m, d] = dayStr.split("-").map(Number)
    const then = new Date(y, m, d)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const diff = today.getTime() - then.getTime()
    return diff === 86400000
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */

const SUBJECT_COLORS: Record<string, string> = {
    Physics: "from-blue-500 to-cyan-400",
    Chemistry: "from-emerald-500 to-teal-400",
    Math: "from-purple-500 to-pink-400",
}

const SUBJECT_BG: Record<string, string> = {
    Physics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    Chemistry: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Math: "bg-purple-500/10 text-purple-400 border-purple-500/20",
}

const DailyChallenge = () => {
    const questions = useMemo(() => getDailyQuestions(), [])
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState<(number | null)[]>([null, null, null, null, null])
    const [completed, setCompleted] = useState(false)
    const [showExplanation, setShowExplanation] = useState(false)
    const [timer, setTimer] = useState(0)
    const [timerActive, setTimerActive] = useState(true)
    const [streak, setStreak] = useState<StreakData>(loadStreak())
    const [copied, setCopied] = useState(false)
    const [showResults, setShowResults] = useState(false)

    // Load saved state
    useEffect(() => {
        const saved = loadDailyState()
        if (saved) {
            setAnswers(saved.answers)
            setTimer(saved.timeSpent)
            if (saved.completed) {
                setCompleted(true)
                setTimerActive(false)
                setShowResults(true)
            }
        }
    }, [])

    // Timer
    useEffect(() => {
        if (!timerActive || completed) return
        const interval = setInterval(() => setTimer(t => t + 1), 1000)
        return () => clearInterval(interval)
    }, [timerActive, completed])

    const score = useMemo(() =>
        answers.reduce((acc, a, i) => acc + (a === questions[i]?.correct ? 1 : 0), 0)
        , [answers, questions])

    const handleAnswer = useCallback((optionIndex: number) => {
        if (answers[currentQ] !== null) return // already answered

        const newAnswers = [...answers]
        newAnswers[currentQ] = optionIndex
        setAnswers(newAnswers)
        setShowExplanation(true)

        // Check if all answered
        const allAnswered = newAnswers.every(a => a !== null)

        // Save progress
        saveDailyState({
            day: getDayString(),
            answers: newAnswers,
            completed: allAnswered,
            timeSpent: timer,
        })

        if (allAnswered) {
            setTimeout(() => {
                logActivity("challenge")
                setCompleted(true)
                setTimerActive(false)
                setShowResults(true)

                // Update streak
                const s = loadStreak()
                const today = getDayString()

                if (s.lastPlayedDay !== today) {
                    const isConsecutive = isYesterday(s.lastPlayedDay) || s.lastPlayedDay === ""
                    const newStreak = isConsecutive ? s.currentStreak + 1 : 1
                    const correctCount = newAnswers.reduce((acc, a, i) => acc + (a === questions[i]?.correct ? 1 : 0), 0)

                    const updated: StreakData = {
                        currentStreak: newStreak,
                        bestStreak: Math.max(newStreak, s.bestStreak),
                        totalPlayed: s.totalPlayed + 1,
                        totalCorrect: s.totalCorrect + correctCount,
                        lastPlayedDay: today,
                    }
                    saveStreak(updated)
                    setStreak(updated)
                }
            }, 1500)
        }
    }, [answers, currentQ, timer, questions])

    const nextQuestion = useCallback(() => {
        setShowExplanation(false)
        if (currentQ < 4) setCurrentQ(currentQ + 1)
    }, [currentQ])

    const prevQuestion = useCallback(() => {
        setShowExplanation(false)
        if (currentQ > 0) setCurrentQ(currentQ - 1)
    }, [currentQ])

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${m}:${sec.toString().padStart(2, "0")}`
    }

    const generateShareText = useCallback(() => {
        const grid = answers.map((a, i) =>
            a === questions[i]?.correct ? "🟩" : "🟥"
        ).join("")
        return `KCET Daily Challenge ${new Date().toLocaleDateString('en-IN')}\n${grid} ${score}/5\n⏱️ ${formatTime(timer)} | 🔥 ${streak.currentStreak} day streak\n\nPlay at: kcetcoded.vercel.app/daily-challenge`
    }, [answers, questions, score, timer, streak])

    const copyResults = useCallback(async () => {
        const text = generateShareText()
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback
            const ta = document.createElement("textarea")
            ta.value = text
            document.body.appendChild(ta)
            ta.select()
            document.execCommand("copy")
            document.body.removeChild(ta)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }, [generateShareText])

    const shareResults = useCallback(async () => {
        const text = generateShareText()
        if (navigator.share) {
            try { await navigator.share({ text }) } catch { copyResults() }
        } else {
            copyResults()
        }
    }, [generateShareText, copyResults])

    const q = questions[currentQ]
    if (!q) return null

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
      <SEO
        title="KCET Daily Challenge – Free Daily Quiz for KCET 2026"
        description="Test your KCET preparation with 5 new questions every day! Build your streak, track your score & compete with other KCET 2026 aspirants — free daily practice quiz."
        url="https://kcetcoded.dev/daily-challenge"
        keywords="KCET daily quiz, KCET practice questions, KCET 2026 mock test, KCET daily challenge, KCET preparation quiz"
      />
            {/* Aurora background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 animate-aurora opacity-40" />
                <div className="absolute inset-0 bg-background/60" />
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 pb-28 md:pb-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-sm">Home</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        {/* Streak badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-white/10">
                            <Flame className={`h-4 w-4 ${streak.currentStreak > 0 ? "text-orange-400" : "text-muted-foreground"}`} />
                            <span className="text-sm font-bold">{streak.currentStreak}</span>
                        </div>
                        {/* Timer */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-white/10">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-mono">{formatTime(timer)}</span>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 mb-4">
                        <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="text-xs font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                        Daily <span className="gradient-text">KCET</span> Challenge
                    </h1>
                    <p className="text-sm text-muted-foreground">5 questions · 3 subjects · 1 shot per day</p>
                </motion.div>

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {questions.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => { if (answers[i] !== null || i <= currentQ) { setCurrentQ(i); setShowExplanation(answers[i] !== null); } }}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${answers[i] !== null
                                    ? answers[i] === questions[i].correct
                                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : i === currentQ
                                        ? "glass border border-indigo-500/30 text-indigo-400 scale-110"
                                        : "glass border border-white/5 text-muted-foreground"
                                }`}
                        >
                            {answers[i] !== null ? (
                                answers[i] === questions[i].correct ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
                            ) : (
                                i + 1
                            )}
                        </button>
                    ))}
                </div>

                {/* Results Overlay */}
                <AnimatePresence>
                    {showResults && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-strong rounded-2xl border border-white/10 p-6 sm:p-8 mb-8 text-center"
                        >
                            {/* Score */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                className="mb-6"
                            >
                                <div className={`text-6xl font-black mb-2 ${score >= 4 ? "text-emerald-400" : score >= 3 ? "text-amber-400" : "text-red-400"
                                    }`}>
                                    {score}/5
                                </div>
                                <p className="text-muted-foreground">
                                    {score === 5 ? "🎯 Perfect! You're KCET ready!" :
                                        score >= 4 ? "🔥 Excellent! Almost perfect!" :
                                            score >= 3 ? "👍 Good job! Keep practicing!" :
                                                score >= 2 ? "📚 Room for improvement!" : "💪 Don't give up! Try again tomorrow!"}
                                </p>
                            </motion.div>

                            {/* Stats grid */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                <div className="glass rounded-xl p-3 border border-white/5">
                                    <Flame className="h-5 w-5 text-orange-400 mx-auto mb-1" />
                                    <div className="text-lg font-bold">{streak.currentStreak}</div>
                                    <div className="text-[10px] text-muted-foreground">Streak</div>
                                </div>
                                <div className="glass rounded-xl p-3 border border-white/5">
                                    <Clock className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                                    <div className="text-lg font-bold">{formatTime(timer)}</div>
                                    <div className="text-[10px] text-muted-foreground">Time</div>
                                </div>
                                <div className="glass rounded-xl p-3 border border-white/5">
                                    <Trophy className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                                    <div className="text-lg font-bold">{streak.bestStreak}</div>
                                    <div className="text-[10px] text-muted-foreground">Best</div>
                                </div>
                            </div>

                            {/* Result grid visualization */}
                            <div className="flex items-center justify-center gap-1.5 mb-6">
                                {answers.map((a, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${a === questions[i]?.correct
                                                ? "bg-emerald-500/20 border border-emerald-500/30"
                                                : "bg-red-500/20 border border-red-500/30"
                                            }`}
                                    >
                                        {a === questions[i]?.correct ? "🟩" : "🟥"}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Share buttons */}
                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    onClick={shareResults}
                                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0"
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share Result
                                </Button>
                                <Button
                                    onClick={copyResults}
                                    variant="outline"
                                    className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10"
                                >
                                    {copied ? <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-400" /> : <Copy className="mr-2 h-4 w-4" />}
                                    {copied ? "Copied!" : "Copy"}
                                </Button>
                            </div>

                            <p className="text-xs text-muted-foreground mt-4">
                                New challenge at midnight IST ✨
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQ}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                        className="glass-strong rounded-2xl border border-white/10 overflow-hidden mb-6"
                    >
                        {/* Subject badge */}
                        <div className="px-5 pt-5 pb-0">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${SUBJECT_BG[q.subject]}`}>
                                    {q.subject}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Q{currentQ + 1} of 5
                                </span>
                            </div>

                            {/* Question text */}
                            <h2 className="text-lg sm:text-xl font-semibold leading-relaxed mb-5">
                                {q.question}
                            </h2>
                        </div>

                        {/* Options */}
                        <div className="px-5 pb-5 space-y-2.5">
                            {q.options.map((option, i) => {
                                const isSelected = answers[currentQ] === i
                                const isCorrect = i === q.correct
                                const isAnswered = answers[currentQ] !== null
                                const isWrong = isSelected && !isCorrect

                                return (
                                    <motion.button
                                        key={i}
                                        whileTap={!isAnswered ? { scale: 0.98 } : {}}
                                        onClick={() => handleAnswer(i)}
                                        disabled={isAnswered}
                                        className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-300 flex items-center gap-3 ${isAnswered
                                                ? isCorrect
                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                                    : isWrong
                                                        ? "bg-red-500/10 border-red-500/30 text-red-300"
                                                        : "glass border-white/5 text-muted-foreground opacity-50"
                                                : "glass border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 active:scale-[0.98]"
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${isAnswered && isCorrect
                                                ? "bg-emerald-500/20"
                                                : isWrong
                                                    ? "bg-red-500/20"
                                                    : "bg-white/5"
                                            }`}>
                                            {isAnswered && isCorrect ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : isWrong ? (
                                                <XCircle className="h-4 w-4" />
                                            ) : (
                                                String.fromCharCode(65 + i)
                                            )}
                                        </div>
                                        <span className="text-sm sm:text-base">{option}</span>
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Explanation */}
                        <AnimatePresence>
                            {showExplanation && answers[currentQ] !== null && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-5 pb-5 pt-1">
                                        <div className="glass rounded-xl p-4 border border-white/5">
                                            <div className="flex items-start gap-2.5">
                                                <BookOpen className="h-4 w-4 text-indigo-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-indigo-400 mb-1">Explanation</p>
                                                    <p className="text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={prevQuestion}
                        disabled={currentQ === 0}
                        className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" /> Previous
                    </Button>

                    {answers[currentQ] !== null && currentQ < 4 && (
                        <Button
                            onClick={nextQuestion}
                            className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0"
                        >
                            Next <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DailyChallenge

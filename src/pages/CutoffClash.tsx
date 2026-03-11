import { SEO } from "@/components/SEO"
import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  CheckCircle2,
  RefreshCcw,
  Search,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react"

interface CollegeCard {
  id: string
  instituteCode: string
  name: string
  shortName: string
  branch: string
  cutoff: number
  color: string
}

interface RawCutoffData {
  institute: string
  institute_code: string
  course: string
  category: string
  cutoff_rank: number
  year: string
  round: string
}

const DATA_URLS = [
  "/data/kcet_cutoffs_master.json",
  "/data/kcet_cutoffs_high_volume.json",
  "/data/kcet_cutoffs_consolidated.json",
  "/kcet_cutoffs_master.json",
  "/kcet_cutoffs_high_volume.json",
  "/kcet_cutoffs_consolidated.json",
  "/kcet_cutoffs.json",
]

const ROUND_PRIORITY = ["R2", "R1", "R3", "MOCK"]
const CATEGORY_PRIORITY = ["GM", "1G", "2AG", "3AG", "GMR"]

const TOP_COLLEGE_CODES = new Set([
  "E001", "E003", "E005", "E006", "E007", "E008", "E009", "E011", "E021", "E022",
  "E024", "E028", "E031", "E036", "E037", "E039", "E046", "E056", "E057", "E064",
  "E081", "E099", "E106", "E161", "E165", "E171", "E173", "E176", "E184", "E208",
  "E221", "E229", "E235", "E237",
])

const COLOR_POOL = [
  "from-indigo-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-red-500",
  "from-pink-500 to-rose-500",
  "from-violet-500 to-fuchsia-500",
  "from-yellow-500 to-amber-500",
  "from-lime-500 to-green-500",
  "from-cyan-500 to-sky-500",
  "from-red-500 to-orange-500",
  "from-teal-500 to-emerald-500",
  "from-blue-600 to-indigo-600",
]

const normalizeRound = (round: string) => {
  const value = String(round || "").trim().toUpperCase()
  if (value === "R1" || value === "ROUND 1") return "R1"
  if (value === "R2" || value === "ROUND 2") return "R2"
  if (
    value === "R3" ||
    value === "ROUND 3" ||
    value === "EXT" ||
    value === "ROUND 3 EXTENDED" ||
    value === "ROUND 3 (EXTENDED)"
  ) {
    return "R3"
  }
  if (value === "MOCK" || value === "MOCK ROUND 1") return "MOCK"
  return value
}

const normalizeText = (text: string) => String(text || "").toUpperCase().replace(/[^A-Z0-9]/g, "")

const cleanCourseDisplay = (course: string) => String(course || "").replace(/\s+/g, " ").trim()

const isPreferredCourse = (course: string) => {
  const c = normalizeText(course)
  return (
    c.includes("COMPUTERSCIENCE") ||
    c.includes("INFORMATIONSCIENCE") ||
    c.includes("ARTIFICIALINTELLIGENCE") ||
    c.includes("DATASCIENCE") ||
    c.includes("CYBERSECURITY") ||
    c.includes("AIML")
  )
}

const hashString = (value: string) => {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

const pickSnapshot = (rows: RawCutoffData[]) => {
  const years = [...new Set(rows.map((r) => String(r.year)))]
    .filter(Boolean)
    .sort((a, b) => Number(b) - Number(a))

  for (const year of years) {
    const yearRows = rows.filter((r) => String(r.year) === year)
    if (!yearRows.length) continue

    const courseFocused = yearRows.filter((r) => isPreferredCourse(r.course))
    const sourceRows = courseFocused.length > 80 ? courseFocused : yearRows

    const chosenRound = ROUND_PRIORITY.find((round) =>
      sourceRows.some((r) => normalizeRound(r.round) === round),
    )
    if (!chosenRound) continue

    const roundRows = sourceRows.filter((r) => normalizeRound(r.round) === chosenRound)
    if (!roundRows.length) continue

    const categoryCounts = roundRows.reduce<Record<string, number>>((acc, row) => {
      const cat = String(row.category || "").toUpperCase()
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {})

    let chosenCategory = CATEGORY_PRIORITY.find((cat) => categoryCounts[cat])
    if (!chosenCategory) {
      chosenCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    }
    if (!chosenCategory) continue

    const snapshotRows = roundRows.filter(
      (r) => String(r.category || "").toUpperCase() === chosenCategory,
    )

    if (snapshotRows.length >= 20) {
      return { year, round: chosenRound, category: chosenCategory, rows: snapshotRows }
    }
  }

  return null
}

const buildGamePool = (rows: RawCutoffData[]) => {
  const snapshot = pickSnapshot(rows)
  if (!snapshot) return null

  const preferredRows = snapshot.rows.filter((row) => isPreferredCourse(row.course))
  const sourceRows = preferredRows.length >= 30 ? preferredRows : snapshot.rows

  const byInstituteCourse = new Map<string, RawCutoffData>()
  for (const row of sourceRows) {
    const code = String(row.institute_code || "").toUpperCase().trim()
    const rank = Number(row.cutoff_rank)
    if (!/^E\d{3}$/.test(code) || !Number.isFinite(rank) || rank <= 0) continue

    const courseDisplay = cleanCourseDisplay(row.course)
    const dedupeKey = `${code}::${normalizeText(courseDisplay)}`
    if (!byInstituteCourse.has(dedupeKey)) {
      byInstituteCourse.set(dedupeKey, row)
    }
  }

  const cards: CollegeCard[] = [...byInstituteCourse.values()]
    .map((row) => {
      const code = row.institute_code.toUpperCase()
      const branch = cleanCourseDisplay(row.course)
      return {
        id: `${code}-${normalizeText(branch)}`,
        instituteCode: code,
        name: row.institute,
        shortName: code,
        branch,
        cutoff: Number(row.cutoff_rank),
        color: COLOR_POOL[hashString(`${code}-${branch}`) % COLOR_POOL.length],
      }
    })
    .sort((a, b) => a.cutoff - b.cutoff)

  const topCards = cards.filter((c) => TOP_COLLEGE_CODES.has(c.instituteCode))
  const otherCards = cards.filter((c) => !TOP_COLLEGE_CODES.has(c.instituteCode))
  const selectedOthers = otherCards.slice(0, Math.max(80, topCards.length))
  const selectedCards = [...topCards, ...selectedOthers]

  if (selectedCards.length < 2) return null

  return {
    cards: selectedCards,
    year: snapshot.year,
    round: snapshot.round,
    category: snapshot.category,
    totalRows: snapshot.rows.length,
  }
}

const getRandomPair = (cards: CollegeCard[], fixedLeft?: CollegeCard) => {
  if (cards.length < 2) return null
  const leftCard = fixedLeft ?? cards[Math.floor(Math.random() * cards.length)]

  let rightCard = cards[Math.floor(Math.random() * cards.length)]
  let guard = 0
  while ((rightCard.id === leftCard.id || rightCard.cutoff === leftCard.cutoff) && guard < 100) {
    rightCard = cards[Math.floor(Math.random() * cards.length)]
    guard += 1
  }

  if (rightCard.id === leftCard.id) return null
  return { leftCard, rightCard }
}

export default function CutoffClash() {
  const [left, setLeft] = useState<CollegeCard | null>(null)
  const [right, setRight] = useState<CollegeCard | null>(null)
  const [gameCards, setGameCards] = useState<CollegeCard[]>([])
  const [datasetMeta, setDatasetMeta] = useState<{
    year: string
    round: string
    category: string
    totalRows: number
  } | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameState, setGameState] = useState<"playing" | "gameover">("playing")
  const [revealInfo, setRevealInfo] = useState(false)
  const [comparison, setComparison] = useState<"higher" | "lower" | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("cutoff-clash-highscore")
    if (saved) setHighScore(parseInt(saved, 10))

    const loadGameData = async () => {
      setLoadingData(true)
      setLoadError(null)
      try {
        let response: Response | null = null
        for (const url of DATA_URLS) {
          const candidate = await fetch(url, { cache: "no-store" })
          if (candidate.ok) {
            response = candidate
            break
          }
        }

        if (!response) throw new Error("No cutoff dataset found")

        const payload = await response.json()
        const rows: RawCutoffData[] = (Array.isArray(payload) ? payload : payload.cutoffs || [])
          .map((row: any) => ({
            institute: String(row.institute || "").trim(),
            institute_code: String(row.institute_code || "").trim().toUpperCase(),
            course: String(row.course || ""),
            category: String(row.category || "").toUpperCase(),
            cutoff_rank: Number(row.cutoff_rank),
            year: String(row.year || ""),
            round: normalizeRound(String(row.round || "")),
          }))
          .filter(
            (row: RawCutoffData) =>
              row.institute &&
              /^E\d{3}$/.test(row.institute_code) &&
              Number.isFinite(row.cutoff_rank) &&
              row.cutoff_rank > 0 &&
              row.year &&
              row.round &&
              row.category,
          )

        const prepared = buildGamePool(rows)
        if (!prepared) throw new Error("Insufficient playable cutoff data")

        setGameCards(prepared.cards)
        setDatasetMeta({
          year: prepared.year,
          round: prepared.round,
          category: prepared.category,
          totalRows: prepared.totalRows,
        })

        const pair = getRandomPair(prepared.cards)
        if (!pair) throw new Error("Unable to generate game pair")
        setLeft(pair.leftCard)
        setRight(pair.rightCard)
        setGameState("playing")
        setRevealInfo(false)
        setComparison(null)
        setScore(0)
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Failed to load game data")
      } finally {
        setLoadingData(false)
      }
    }

    loadGameData()
  }, [])

  const startNewGame = () => {
    const pair = getRandomPair(gameCards)
    if (!pair) {
      setLoadError("Not enough cards to start a new game")
      return
    }
    setLeft(pair.leftCard)
    setRight(pair.rightCard)
    setScore(0)
    setGameState("playing")
    setRevealInfo(false)
    setComparison(null)
  }

  const nextRound = () => {
    if (!right) return
    const currentLeft = right
    const candidates = gameCards.filter(
      (card) =>
        card.id !== currentLeft.id &&
        card.id !== left?.id &&
        card.cutoff !== currentLeft.cutoff,
    )
    const fallbackCandidates = candidates.length > 0
      ? candidates
      : gameCards.filter((card) => card.id !== currentLeft.id)

    if (fallbackCandidates.length === 0) return
    const newRight = fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)]

    setLeft(currentLeft)
    setRight(newRight)
    setGameState("playing")
    setRevealInfo(false)
    setComparison(null)
  }

  const handleGuess = (guess: "higher" | "lower") => {
    if (!left || !right || gameState !== "playing") return

    const isHigher = right.cutoff > left.cutoff
    const isCorrect = (guess === "higher" && isHigher) || (guess === "lower" && !isHigher)

    setRevealInfo(true)
    setComparison(guess)

    if (isCorrect) {
      const newScore = score + 1
      setScore(newScore)
      if (newScore > highScore) {
        setHighScore(newScore)
        localStorage.setItem("cutoff-clash-highscore", String(newScore))
      }
      setTimeout(nextRound, 1300)
    } else {
      setGameState("gameover")
    }
  }

  const actualAnswer = useMemo(() => {
    if (!left || !right) return null
    return right.cutoff > left.cutoff ? "higher" : "lower"
  }, [left, right])

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col" ref={containerRef}>
      <SEO
        title="Cutoff Clash – KCET Higher or Lower Cutoff Game"
        description="Play the Cutoff Clash game! Guess which KCET college has a higher or lower cutoff rank. Test your knowledge of Karnataka engineering college cutoffs in this fun game."
        url="https://kcet-coded2.vercel.app/cutoff-clash"
        keywords="KCET cutoff game, KCET higher lower game, KCET cutoff quiz, KCET college cutoff comparison"
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-black to-black" />

      <header className="sticky top-0 left-0 right-0 z-50 p-3 sm:p-4 flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold hidden sm:inline">Back</span>
        </Link>
        <div className="flex items-center gap-4">
          {datasetMeta && (
            <div className="hidden md:flex flex-col items-end text-[11px] leading-tight text-white/60">
              <span>Data: {datasetMeta.year} {datasetMeta.round} {datasetMeta.category}</span>
              <span>{datasetMeta.totalRows.toLocaleString()} matchup rows</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-white/50">Score</span>
            <span className="text-xl font-bold font-mono">{score}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-white/50">High</span>
            <span className="text-xl font-bold font-mono text-amber-400">{highScore}</span>
          </div>
        </div>
      </header>

      <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-white text-black items-center justify-center font-black text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)]">
        VS
      </div>

      {loadingData ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/30 border-t-white mx-auto" />
            <p className="text-white/70">Loading real KCET data...</p>
          </div>
        </div>
      ) : loadError ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md text-center bg-red-950/40 border border-red-500/40 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-300 mb-2">Unable to start Cutoff Clash</h3>
            <p className="text-red-100/80 mb-5">{loadError}</p>
            <Button onClick={() => window.location.reload()} className="rounded-full bg-white text-black hover:bg-white/90">
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row relative">
          {!left ? null : (
            <motion.div
              key={`left-${left.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex-1 relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center bg-gradient-to-br ${left.color}`}
            >
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 max-w-sm">
                <span className="inline-block px-3 py-1 rounded-full bg-black/30 border border-white/10 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4 backdrop-blur-md">
                  {left.shortName}
                </span>
                <h2 className="text-lg sm:text-2xl md:text-4xl font-black mb-2 leading-tight">{left.branch}</h2>
                <p className="text-sm sm:text-base md:text-lg text-white/90 mb-4 sm:mb-6 font-medium">{left.name}</p>

                <div className="inline-flex flex-col items-center p-3 sm:p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
                  <span className="text-xs sm:text-sm uppercase tracking-widest text-white/60 mb-1">KCET Cutoff</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-400 tabular-nums">
                    {left.cutoff.toLocaleString()}
                  </span>
                  <span className="text-xs text-white/50 mt-1">Rank</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="md:hidden flex items-center justify-center py-2">
            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-sm shadow-[0_0_24px_rgba(255,255,255,0.3)]">
              VS
            </div>
          </div>

          {!right ? null : (
            <motion.div
              key={`right-${right.id}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center bg-black"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${right.color} opacity-25`} />
              <div className="relative z-10 max-w-sm w-full">
                <span className="inline-block px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
                  {right.shortName}
                </span>
                <h2 className="text-lg sm:text-2xl md:text-4xl font-black mb-2 leading-tight">{right.branch}</h2>
                <p className="text-sm sm:text-base md:text-lg text-white/90 mb-5 sm:mb-8 font-medium">{right.name}</p>

                <div className="min-h-[140px] sm:min-h-[160px] flex flex-col items-center justify-center">
                  {gameState === "playing" && !revealInfo ? (
                    <div className="space-y-3 sm:space-y-4 w-full max-w-xs">
                      <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-white/60 mb-1 sm:mb-2">Guess Right Card</p>
                      <Button
                        onClick={() => handleGuess("higher")}
                        className="w-full min-h-[52px] sm:min-h-[62px] text-base sm:text-lg font-bold bg-transparent border-2 border-white hover:bg-white hover:text-black transition-all rounded-xl sm:rounded-full group"
                      >
                        <TrendingUp className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Higher Rank
                        <span className="block text-[10px] font-normal opacity-60 ml-2">(larger number, easier)</span>
                      </Button>
                      <Button
                        onClick={() => handleGuess("lower")}
                        className="w-full min-h-[52px] sm:min-h-[62px] text-base sm:text-lg font-bold bg-transparent border-2 border-white hover:bg-white hover:text-black transition-all rounded-xl sm:rounded-full group"
                      >
                        <TrendingDown className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Lower Rank
                        <span className="block text-[10px] font-normal opacity-60 ml-2">(smaller number, harder)</span>
                      </Button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="inline-flex flex-col items-center p-3 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 mb-5 sm:mb-6">
                        <span className="text-xs sm:text-sm uppercase tracking-widest text-white/60 mb-1">KCET Cutoff</span>
                        <span className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-400 tabular-nums">
                          {right.cutoff.toLocaleString()}
                        </span>
                        <span className="text-xs text-white/50 mt-1">Rank</span>
                      </div>

                      {gameState === "gameover" ? (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-rose-400 font-black text-xl sm:text-2xl mb-3 sm:mb-4">
                            <X className="h-6 w-6 sm:h-8 sm:w-8" />
                            GAME OVER
                          </div>
                          <p className="mb-2 text-white/80">You scored {score}.</p>
                          <p className="mb-6 text-white/60">
                            Correct answer: <span className="font-semibold uppercase">{actualAnswer}</span> rank
                          </p>
                          <Button onClick={startNewGame} size="lg" className="rounded-xl sm:rounded-full font-bold px-6 sm:px-8 bg-white text-black hover:bg-white/90">
                            <RefreshCcw className="mr-2 h-4 w-4" /> Play Again
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-emerald-300 font-black text-xl sm:text-2xl mb-2">
                            <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
                            CORRECT!
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

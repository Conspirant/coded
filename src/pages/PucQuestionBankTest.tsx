import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Eye,
  Flag,
  Keyboard,
  Layers,
  Loader2,
  Play,
  RefreshCcw,
  Search,
  Sparkles,
  Target,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MathRenderer } from "@/components/MathRenderer";
import { ReportPucQuestionModal } from "@/components/ReportPucQuestionModal";
import {
  isFibCorrect,
  loadPucSubjectBank,
  type Difficulty,
  type PucChapterBank,
  type PucQuestion,
  type PucSubjectBank,
  type PucSubjectKey,
} from "@/data/puc-qb";

type ViewState = "setup" | "quiz" | "results";
type QuestionTypeFilter = "all" | "mcq" | "fib";
type DifficultyFilter = "All" | Difficulty;
type TestBehavior = "practice" | "exam";

interface ChapterStats {
  attempted: number;
  correct: number;
}

interface PucQbStats {
  totalAttempted: number;
  totalCorrect: number;
  chapters: Record<string, ChapterStats>;
}

const STATS_KEY = "puc_qb_stats";

function loadStats(): PucQbStats {
  try {
    const raw = JSON.parse(localStorage.getItem(STATS_KEY) || "null");
    if (raw && typeof raw === "object" && raw.chapters) return raw;
  } catch {
    // ignore corrupted storage
  }
  return { totalAttempted: 0, totalCorrect: 0, chapters: {} };
}

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const SUBJECT_META: { key: PucSubjectKey; label: string; code: string }[] = [
  { key: "physics", label: "Physics", code: "33" },
  { key: "chemistry", label: "Chemistry", code: "34" },
  { key: "mathematics", label: "Mathematics", code: "35" },
];

function buildGoogleSearchUrl(q: PucQuestion, subjectKey: PucSubjectKey): string {
  const subjectLabel = subjectKey.charAt(0).toUpperCase() + subjectKey.slice(1);
  const cleanedStem = q.question
    .replace(/\\begin\{[^}]+\}|\\end\{[^}]+\}/g, " ")
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "$1/$2")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\([a-zA-Z]+)/g, "$1")
    .replace(/[$&{}]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320);
  const query = `${cleanedStem} 2nd PUC ${subjectLabel} answer explanation`;
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export default function PucQuestionBankTest() {
  const [searchParams] = useSearchParams();
  const initialSubject = (searchParams.get("subject") as PucSubjectKey) || "physics";
  const initialChapterParam = searchParams.get("chapter");

  const [view, setView] = useState<ViewState>("setup");
  const [subject, setSubject] = useState<PucSubjectKey>(
    ["physics", "chemistry", "mathematics"].includes(initialSubject) ? initialSubject : "physics"
  );
  const [bank, setBank] = useState<PucSubjectBank | null>(null);
  const [loadingBank, setLoadingBank] = useState(true);

  // Setup filters
  const [selectedChapters, setSelectedChapters] = useState<number[]>(
    initialChapterParam ? [Number(initialChapterParam)] : []
  );
  const [typeFilter, setTypeFilter] = useState<QuestionTypeFilter>("mcq");
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>("All");
  const [behavior, setBehavior] = useState<TestBehavior>("practice");

  // Active quiz state
  const [testTitle, setTestTitle] = useState("");
  const [questions, setQuestions] = useState<PucQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | string | null)[]>([]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [flagged, setFlagged] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fibInputMode, setFibInputMode] = useState<"bank" | "type">("bank");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [reportingQuestion, setReportingQuestion] = useState<PucQuestion | null>(null);

  // Results & Stats
  const [stats, setStats] = useState<PucQbStats>(loadStats);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "flagged">("all");

  useEffect(() => {
    let active = true;
    setLoadingBank(true);
    loadPucSubjectBank(subject)
      .then((data) => {
        if (!active) return;
        setBank(data);
        if (!initialChapterParam) {
          setSelectedChapters([]);
        }
      })
      .finally(() => {
        if (active) setLoadingBank(false);
      });
    return () => {
      active = false;
    };
  }, [subject, initialChapterParam]);

  useEffect(() => {
    if (!timerActive) return;
    const id = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [timerActive]);

  const filteredPool = useMemo(() => {
    if (!bank) return [];
    const targetChapters =
      selectedChapters.length > 0
        ? bank.chapters.filter((c) => selectedChapters.includes(c.chapterNumber))
        : bank.chapters;

    const out: PucQuestion[] = [];
    for (const ch of targetChapters) {
      const chItems: PucQuestion[] = [];
      if (typeFilter === "all" || typeFilter === "mcq") {
        chItems.push(...ch.mcqs);
      }
      if (typeFilter === "all" || typeFilter === "fib") {
        chItems.push(...ch.fibs);
      }
      if (typeFilter === "all" && subject === "mathematics") {
        chItems.sort((a, b) => a.questionNumber - b.questionNumber);
      }
      out.push(...chItems);
    }

    if (diffFilter === "All") return out;
    return out.filter((q) => q.difficulty === diffFilter);
  }, [bank, selectedChapters, typeFilter, diffFilter]);

  const startQuiz = (title: string, picked: PucQuestion[], modeBehavior: TestBehavior) => {
    if (!picked.length) return;
    setTestTitle(title);
    setBehavior(modeBehavior);
    setQuestions(picked);
    setAnswers(Array(picked.length).fill(null));
    setChecked(Array(picked.length).fill(false));
    setFlagged([]);
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setTimerActive(true);
    setShowPalette(false);
    setReviewFilter("all");
    setView("quiz");
  };

  const handleStartChapter = (ch: PucChapterBank) => {
    let pool: PucQuestion[] = [];
    if (typeFilter === "all" || typeFilter === "mcq") pool.push(...ch.mcqs);
    if (typeFilter === "all" || typeFilter === "fib") pool.push(...ch.fibs);
    if (typeFilter === "all" && subject === "mathematics") {
      pool.sort((a, b) => a.questionNumber - b.questionNumber);
    }
    if (diffFilter !== "All") pool = pool.filter((q) => q.difficulty === diffFilter);
    if (!pool.length) return;
    startQuiz(`${bank?.subjectName} · Ch.${ch.chapterNumber}: ${ch.chapterName}`, pool, behavior);
  };

  const handleStartPartAMock = () => {
    if (!bank) return;
    const targetChapters =
      selectedChapters.length > 0
        ? bank.chapters.filter((c) => selectedChapters.includes(c.chapterNumber))
        : bank.chapters;
    const mcqs = shuffle(targetChapters.flatMap((c) => c.mcqs)).slice(0, 15);
    const fibs = shuffle(targetChapters.flatMap((c) => c.fibs)).slice(0, 5);
    const combined = [...mcqs, ...fibs];
    if (!combined.length) return;
    startQuiz(`${bank.subjectName} · KSEAB Part-A Mock (${mcqs.length} MCQs + ${fibs.length} Blanks)`, combined, "exam");
  };

  const handleStartQuick10 = () => {
    if (!filteredPool.length) return;
    const picked = shuffle(filteredPool).slice(0, 10);
    startQuiz(`${bank?.subjectName} · Quick 10-Q Sprint`, picked, behavior);
  };

  const handleStartAllFiltered = () => {
    if (!filteredPool.length) return;
    startQuiz(
      `${bank?.subjectName} · Custom Set (${filteredPool.length} Qs)`,
      shuffle(filteredPool).slice(0, 50),
      behavior
    );
  };

  const isQuestionCorrect = (q: PucQuestion, ans: number | string | null): boolean => {
    if (ans === null || ans === undefined || ans === "") return false;
    if (q.type === "mcq") return ans === q.correctIndex;
    return isFibCorrect(String(ans), q.answer);
  };

  const finishQuiz = () => {
    setTimerActive(false);
    let score = 0;
    const nextStats: PucQbStats = {
      totalAttempted: stats.totalAttempted,
      totalCorrect: stats.totalCorrect,
      chapters: { ...stats.chapters },
    };

    questions.forEach((q, idx) => {
      const correct = isQuestionCorrect(q, answers[idx]);
      if (correct) score += 1;
      nextStats.totalAttempted += 1;
      if (correct) nextStats.totalCorrect += 1;
      const chKey = `${q.subject}-ch${q.chapterNumber}`;
      const prev = nextStats.chapters[chKey] || { attempted: 0, correct: 0 };
      nextStats.chapters[chKey] = {
        attempted: prev.attempted + 1,
        correct: prev.correct + (correct ? 1 : 0),
      };
    });

    localStorage.setItem(STATS_KEY, JSON.stringify(nextStats));
    setStats(nextStats);
    setView("results");
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isCurrentChecked = checked[currentIndex] || false;

  // Keyboard navigation in quiz view
  useEffect(() => {
    if (view !== "quiz" || !currentQuestion) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") {
        setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (currentQuestion.type === "mcq" && !isCurrentChecked) {
        const keyMap: Record<string, number> = {
          "1": 0, a: 0, A: 0,
          "2": 1, b: 1, B: 1,
          "3": 2, c: 2, C: 2,
          "4": 3, d: 3, D: 3,
        };
        if (e.key in keyMap) {
          const idx = keyMap[e.key];
          setAnswers((prev) => {
            const next = [...prev];
            next[currentIndex] = idx;
            return next;
          });
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [view, currentQuestion, currentIndex, questions.length, isCurrentChecked]);

  // Switch FIB input mode automatically if no word bank exists
  useEffect(() => {
    if (currentQuestion?.type === "fib") {
      setFibInputMode(currentQuestion.wordBank.length > 0 ? "bank" : "type");
    }
  }, [currentIndex, currentQuestion]);

  const toggleChapter = (chNum: number) => {
    setSelectedChapters((prev) =>
      prev.includes(chNum) ? prev.filter((n) => n !== chNum) : [...prev, chNum]
    );
  };

  const toggleFlag = (idx: number) => {
    setFlagged((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  const answeredCount = answers.filter((a) => a !== null && a !== "").length;
  const overallAccuracy = stats.totalAttempted
    ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100)
    : 0;

  // ==================== VIEW 1: SETUP ====================
  if (view === "setup") {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto px-3 sm:px-4 md:px-0 pb-24 sm:pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <Link
              to="/puc/question-banks"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Question Banks
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <BookOpenCheck className="h-5 w-5 text-primary" />
              2nd PUC Interactive Question Bank Tests
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Practice official KSEAB 1-mark MCQs and Fill-in-the-Blanks with LaTeX rendering, diagrams, and instant grading.
            </p>
          </div>
          {stats.totalAttempted > 0 && (
            <Card className="bg-primary/5 border-primary/20 shrink-0">
              <CardContent className="p-3 flex items-center gap-3">
                <Target className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-[11px] text-muted-foreground">Overall Accuracy</p>
                  <p className="text-sm font-bold">
                    {overallAccuracy}% <span className="text-xs font-normal text-muted-foreground">({stats.totalCorrect}/{stats.totalAttempted})</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Subject Tabs */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-2 border-b border-border/60 pb-3">
          {SUBJECT_META.map((s) => (
            <Button
              key={s.key}
              variant={subject === s.key ? "default" : "outline"}
              size="sm"
              className="h-9 sm:h-8 text-xs font-semibold px-2 sm:px-3 truncate"
              onClick={() => {
                setSubject(s.key);
                setSelectedChapters([]);
              }}
            >
              <span className="truncate">{s.label}</span>
              <span className="hidden sm:inline opacity-70 ml-1 text-[10px]">({s.code})</span>
            </Button>
          ))}
        </div>

        {loadingBank || !bank ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs">Loading {subject} question bank...</span>
          </div>
        ) : (
          <>
            {/* Quick Launch Modes & Filters */}
            <Card className="border-primary/20 bg-primary/[0.03]">
              <CardHeader className="p-4 pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm sm:text-base">Quick Test & Filters</CardTitle>
                    <CardDescription className="text-xs">
                      {selectedChapters.length > 0
                        ? `${selectedChapters.length} chapter(s) selected · ${filteredPool.length} questions available`
                        : `All ${bank.chapters.length} chapters · ${filteredPool.length} questions available`}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-md self-start">
                    <Button
                      size="sm"
                      variant={behavior === "practice" ? "default" : "ghost"}
                      className="h-7 text-[11px] px-2.5"
                      onClick={() => setBehavior("practice")}
                    >
                      Practice (Instant Check)
                    </Button>
                    <Button
                      size="sm"
                      variant={behavior === "exam" ? "default" : "ghost"}
                      className="h-7 text-[11px] px-2.5"
                      onClick={() => setBehavior("exam")}
                    >
                      Exam Mode
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                {/* Filter Pills */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-3 items-start sm:items-center text-xs">
                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                    <span className="text-muted-foreground font-medium mr-0.5">Type:</span>
                    {(["mcq", "fib", "all"] as QuestionTypeFilter[]).map((t) => (
                      <Button
                        key={t}
                        size="sm"
                        variant={typeFilter === t ? "secondary" : "outline"}
                        className="h-8 sm:h-7 text-[11px] px-2.5"
                        onClick={() => setTypeFilter(t)}
                      >
                        {t === "all" ? "All (MCQ + Blanks)" : t === "mcq" ? "MCQs Only" : "Fill in the Blanks"}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                    <span className="text-muted-foreground font-medium mr-0.5">Difficulty:</span>
                    {(["All", "Easy", "Average", "Difficult"] as DifficultyFilter[]).map((d) => (
                      <Button
                        key={d}
                        size="sm"
                        variant={diffFilter === d ? "secondary" : "outline"}
                        className="h-8 sm:h-7 text-[11px] px-2.5"
                        onClick={() => setDiffFilter(d)}
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Launch Buttons */}
                <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
                  <Button size="sm" className="h-9 sm:h-8 gap-1.5 text-xs w-full sm:w-auto justify-center" onClick={handleStartPartAMock}>
                    <Sparkles className="h-3.5 w-3.5" /> KSEAB Part-A Mock (15 MCQ + 5 Blanks)
                  </Button>
                  <div className="grid grid-cols-2 sm:flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 sm:h-8 gap-1.5 text-xs w-full sm:w-auto justify-center"
                      disabled={filteredPool.length === 0}
                      onClick={handleStartQuick10}
                    >
                      <Play className="h-3.5 w-3.5" /> Quick 10-Q
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 sm:h-8 gap-1.5 text-xs w-full sm:w-auto justify-center"
                      disabled={filteredPool.length === 0}
                      onClick={handleStartAllFiltered}
                    >
                      <Layers className="h-3.5 w-3.5" /> Filtered ({Math.min(50, filteredPool.length)})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chapter Grid */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Chapter-wise Practice ({bank.subjectName})</h2>
                {selectedChapters.length > 0 && (
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setSelectedChapters([])}>
                    Clear Selection ({selectedChapters.length})
                  </Button>
                )}
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2">
                {bank.chapters.map((ch) => {
                  const totalQ = ch.mcqs.length + ch.fibs.length;
                  const isSelected = selectedChapters.includes(ch.chapterNumber);
                  const chStat = stats.chapters[`${subject}-ch${ch.chapterNumber}`];
                  const chAcc = chStat?.attempted ? Math.round((chStat.correct / chStat.attempted) * 100) : null;

                  return (
                    <Card
                      key={ch.chapterNumber}
                      className={`transition-colors ${
                        isSelected ? "border-primary bg-primary/[0.03]" : "hover:border-primary/40"
                      }`}
                    >
                      <CardContent className="p-3.5 flex items-center justify-between gap-3">
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() => toggleChapter(ch.chapterNumber)}
                        >
                          <div className="flex items-center gap-1.5 mb-1">
                            <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0">
                              Ch.{ch.chapterNumber}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                              {ch.mcqs.length} MCQ · {ch.fibs.length} FIB
                            </Badge>
                            {chAcc !== null && (
                              <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                                {chAcc}% acc
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm font-medium truncate">{ch.chapterName}</p>
                        </div>
                        <Button
                          size="sm"
                          variant={totalQ > 0 ? "default" : "outline"}
                          disabled={totalQ === 0}
                          className="h-8 text-xs shrink-0 gap-1"
                          onClick={() => handleStartChapter(ch)}
                        >
                          <Play className="h-3 w-3" /> {totalQ > 0 ? "Start" : "0 Qs"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // ==================== VIEW 2: QUIZ ====================
  if (view === "quiz" && currentQuestion) {
    const isMcq = currentQuestion.type === "mcq";
    const currentCorrect = isQuestionCorrect(currentQuestion, currentAnswer);

    return (
      <div className="space-y-4 max-w-4xl mx-auto px-3 sm:px-4 md:px-0 pb-28 sm:pb-12">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/60 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs shrink-0" onClick={() => setView("setup")}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Exit
            </Button>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold truncate">{testTitle}</p>
              <p className="text-[11px] text-muted-foreground">
                Question {currentIndex + 1} of {questions.length} · {answeredCount} answered
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2">
            <Badge variant="outline" className="font-mono text-xs gap-1 py-1 h-8 px-2.5">
              <Clock3 className="h-3.5 w-3.5 text-primary" /> {formatTime(elapsedSeconds)}
            </Badge>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs px-3"
                onClick={() => setShowPalette((v) => !v)}
              >
                Palette
              </Button>
              <Button size="sm" className="h-8 text-xs px-3" onClick={finishQuiz}>
                Submit Test
              </Button>
            </div>
          </div>
        </div>

        {/* Collapsible Question Palette */}
        {showPalette && (
          <Card className="bg-muted/30">
            <CardContent className="p-3">
              <div className="flex flex-wrap gap-1.5">
                {questions.map((q, idx) => {
                  const ans = answers[idx] !== null && answers[idx] !== "";
                  const flg = flagged.includes(idx);
                  const active = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowPalette(false);
                      }}
                      className={`h-8 w-8 rounded text-xs font-mono font-semibold border transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : flg
                          ? "border-amber-500/60 bg-amber-500/15 text-amber-500"
                          : ans
                          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-500"
                          : "border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question Card */}
        <Card className="border-border/80 shadow-sm overflow-hidden">
          <CardHeader className="p-3.5 sm:p-4 pb-3 border-b border-border/40 bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <Badge variant="secondary" className="text-[11px] font-mono">
                  PDF Q.{currentQuestion.questionNumber} · {isMcq ? "MCQ" : "FIB"}
                </Badge>
                <Badge variant="outline" className="text-[11px] max-w-full truncate">
                  Ch.{currentQuestion.chapterNumber}: {currentQuestion.chapterName}
                </Badge>
                {currentQuestion.difficulty && (
                  <Badge variant="outline" className="text-[10px] opacity-80">
                    {currentQuestion.difficulty}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 sm:h-7 px-2.5 sm:px-2 text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 flex items-center gap-1.5"
                  title="Search this question on Google for explanation and answer"
                >
                  <a
                    href={buildGoogleSearchUrl(currentQuestion, subject)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Search className="h-3.5 w-3.5" />
                    <span className="sm:hidden">Google</span>
                    <span className="hidden sm:inline">Search Google</span>
                    <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReportingQuestion(currentQuestion)}
                  className="h-8 sm:h-7 px-2.5 sm:px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-1.5"
                  title="Report an issue with this question to the developer"
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span className="sm:hidden">Report</span>
                  <span className="hidden sm:inline">Report Discrepancy</span>
                </Button>
                <Button
                  variant={flagged.includes(currentIndex) ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 sm:h-7 px-2.5 sm:px-2 text-xs gap-1"
                  onClick={() => toggleFlag(currentIndex)}
                >
                  <Flag className={`h-3.5 w-3.5 ${flagged.includes(currentIndex) ? "text-amber-500 fill-amber-500" : ""}`} />
                  {flagged.includes(currentIndex) ? "Flagged" : "Flag"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3.5 sm:p-5 space-y-4 sm:space-y-5">
            {/* Stem */}
            <div className="text-[15px] sm:text-base leading-relaxed font-medium text-foreground overflow-x-auto max-w-full">
              <MathRenderer content={currentQuestion.question} />
            </div>

            {/* Optional Question Diagram */}
            {currentQuestion.imageUrl && (
              <div className="rounded-lg border border-border bg-white p-2.5 sm:p-3 w-full sm:w-fit inline-flex flex-col items-center gap-2 max-w-full">
                <img
                  src={currentQuestion.imageUrl}
                  alt={`Question ${currentQuestion.questionNumber} diagram`}
                  className="max-h-56 sm:max-h-64 max-w-full object-contain cursor-zoom-in"
                  onClick={() => setZoomedImage(currentQuestion.imageUrl!)}
                />
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <ZoomIn className="h-3 w-3" /> Tap diagram to zoom
                </span>
              </div>
            )}

            {/* MCQ Options */}
            {isMcq && (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {currentQuestion.options.map((optText, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isSelected = currentAnswer === optIdx;
                  const optImg = currentQuestion.optionImages?.[optIdx];
                  let cardStyle = "border-border hover:border-primary/50 hover:bg-muted/30";
                  if (isCurrentChecked) {
                    if (optIdx === currentQuestion.correctIndex) {
                      cardStyle = "border-emerald-500 bg-emerald-500/10 text-foreground";
                    } else if (isSelected) {
                      cardStyle = "border-red-500 bg-red-500/10 text-foreground";
                    }
                  } else if (isSelected) {
                    cardStyle = "border-primary bg-primary/10 ring-1 ring-primary/40";
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isCurrentChecked}
                      onClick={() => {
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[currentIndex] = optIdx;
                          return next;
                        });
                      }}
                      className={`text-left p-3 sm:p-3.5 min-h-[52px] rounded-lg border transition-all active:scale-[0.99] touch-manipulation flex items-start gap-3 ${cardStyle}`}
                    >
                      <span
                        className={`h-6 w-6 rounded-full text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {letter}
                      </span>
                      <div className="min-w-0 flex-1 text-xs sm:text-sm leading-snug overflow-x-auto">
                        <MathRenderer content={optText} />
                        {optImg && (
                          <img
                            src={optImg}
                            alt={`Option ${letter}`}
                            className="mt-2 max-h-32 max-w-full rounded bg-white p-1 object-contain"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Fill in the Blanks Input */}
            {!isMcq && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground">
                    Your Answer:{" "}
                    <span className="font-semibold text-foreground px-2 py-0.5 rounded bg-muted border border-border">
                      {currentAnswer ? String(currentAnswer) : "—"}
                    </span>
                  </div>
                  {currentQuestion.wordBank.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => setFibInputMode((m) => (m === "bank" ? "type" : "bank"))}
                    >
                      <Keyboard className="h-3.5 w-3.5" />
                      {fibInputMode === "bank" ? "Type Manually" : "Use Word Bank"}
                    </Button>
                  )}
                </div>

                {fibInputMode === "bank" && currentQuestion.wordBank.length > 0 ? (
                  <div className="p-3.5 rounded-lg border border-border/70 bg-muted/20 space-y-2">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                      Official KSEAB Word Bank (Set {currentQuestion.setNumber})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {currentQuestion.wordBank.map((word) => {
                        const selected = String(currentAnswer || "").toLowerCase() === word.toLowerCase();
                        return (
                          <Button
                            key={word}
                            type="button"
                            size="sm"
                            disabled={isCurrentChecked}
                            variant={selected ? "default" : "outline"}
                            className="h-8 text-xs"
                            onClick={() => {
                              setAnswers((prev) => {
                                const next = [...prev];
                                next[currentIndex] = word;
                                return next;
                              });
                            }}
                          >
                            {word}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md">
                    <Input
                      disabled={isCurrentChecked}
                      placeholder="Type your answer here..."
                      value={currentAnswer ? String(currentAnswer) : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[currentIndex] = val;
                          return next;
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Practice Mode Instant Feedback */}
            {behavior === "practice" && (
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border/40">
                {!isCurrentChecked ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={currentAnswer === null || currentAnswer === ""}
                    onClick={() => {
                      setChecked((prev) => {
                        const next = [...prev];
                        next[currentIndex] = true;
                        return next;
                      });
                    }}
                    className="gap-1.5 text-xs"
                  >
                    <Eye className="h-3.5 w-3.5" /> Check Answer
                  </Button>
                ) : (
                  <div
                    className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-md border ${
                      currentCorrect
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                        : "bg-red-500/10 border-red-500/30 text-red-500"
                    }`}
                  >
                    {currentCorrect ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" /> Correct!
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        Correct Answer:{" "}
                        <span className="font-bold inline-flex items-center gap-1">
                          {isMcq ? (
                            currentQuestion.options[currentQuestion.correctIndex] ? (
                              <>
                                <span>{String.fromCharCode(65 + currentQuestion.correctIndex)})</span>
                                <MathRenderer content={currentQuestion.options[currentQuestion.correctIndex]} inline />
                              </>
                            ) : (
                              `Option (${String.fromCharCode(65 + currentQuestion.correctIndex)})`
                            )
                          ) : (
                            currentQuestion.answer
                          )}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prev / Next Footer */}
        <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-2.5">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="h-10 sm:h-9 gap-1 text-xs w-full sm:w-auto justify-center"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
          {currentIndex < questions.length - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="h-10 sm:h-9 gap-1 text-xs w-full sm:w-auto justify-center"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" onClick={finishQuiz} className="h-10 sm:h-9 gap-1 text-xs w-full sm:w-auto justify-center">
              Finish & View Results
            </Button>
          )}
        </div>

        {/* Diagram Zoom Dialog */}
        <Dialog open={!!zoomedImage} onOpenChange={() => setZoomedImage(null)}>
          <DialogContent className="w-[95vw] max-w-2xl p-3 sm:p-6 bg-white rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-slate-900 text-sm">Question Diagram</DialogTitle>
            </DialogHeader>
            {zoomedImage && (
              <img src={zoomedImage} alt="Zoomed diagram" className="w-full max-h-[75vh] object-contain" />
            )}
          </DialogContent>
        </Dialog>

        <ReportPucQuestionModal
          question={reportingQuestion}
          subject={subject}
          open={!!reportingQuestion}
          onOpenChange={(open) => {
            if (!open) setReportingQuestion(null);
          }}
        />
      </div>
    );
  }

  // ==================== VIEW 3: RESULTS ====================
  const totalScore = questions.reduce(
    (acc, q, idx) => acc + (isQuestionCorrect(q, answers[idx]) ? 1 : 0),
    0
  );
  const mcqTotal = questions.filter((q) => q.type === "mcq").length;
  const mcqCorrect = questions.reduce(
    (acc, q, idx) => acc + (q.type === "mcq" && isQuestionCorrect(q, answers[idx]) ? 1 : 0),
    0
  );
  const fibTotal = questions.filter((q) => q.type === "fib").length;
  const fibCorrect = questions.reduce(
    (acc, q, idx) => acc + (q.type === "fib" && isQuestionCorrect(q, answers[idx]) ? 1 : 0),
    0
  );
  const pct = questions.length ? Math.round((totalScore / questions.length) * 100) : 0;

  const reviewItems = questions
    .map((q, idx) => ({ q, idx, ans: answers[idx], correct: isQuestionCorrect(q, answers[idx]) }))
    .filter((item) => {
      if (reviewFilter === "incorrect") return !item.correct;
      if (reviewFilter === "flagged") return flagged.includes(item.idx);
      return true;
    });

  return (
    <div className="space-y-5 max-w-4xl mx-auto px-3 sm:px-4 md:px-0 pb-24 sm:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Test Results</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{testTitle}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => setView("setup")}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Setup
          </Button>
          <Button
            size="sm"
            className="text-xs gap-1.5"
            onClick={() => startQuiz(testTitle, shuffle(questions), behavior)}
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Card className="bg-muted/30">
          <CardContent className="p-3.5">
            <p className="text-[11px] text-muted-foreground">Score</p>
            <p className="text-xl font-bold text-primary">
              {totalScore} / {questions.length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-3.5">
            <p className="text-[11px] text-muted-foreground">Accuracy</p>
            <p className="text-xl font-bold text-emerald-500">{pct}%</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-3.5">
            <p className="text-[11px] text-muted-foreground">MCQs / Blanks</p>
            <p className="text-sm font-bold mt-1">
              {mcqCorrect}/{mcqTotal} MCQ · {fibCorrect}/{fibTotal} FIB
            </p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-3.5">
            <p className="text-[11px] text-muted-foreground">Time Spent</p>
            <p className="text-xl font-bold">{formatTime(elapsedSeconds)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Review Filter */}
      <div className="flex items-center gap-2">
        {(["all", "incorrect", "flagged"] as const).map((f) => (
          <Button
            key={f}
            size="sm"
            variant={reviewFilter === f ? "default" : "outline"}
            className="h-7 text-xs capitalize"
            onClick={() => setReviewFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {reviewItems.map(({ q, idx, ans, correct }) => (
          <Card key={q.id} className={`border-l-4 ${correct ? "border-l-emerald-500" : "border-l-red-500"}`}>
            <CardContent className="p-4 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    PDF Q.{q.questionNumber} · {q.type === "mcq" ? "MCQ" : "FIB"}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    Ch.{q.chapterNumber}: {q.chapterName}
                  </span>
                </div>
                {correct ? (
                  <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px]">
                    Correct
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/15 text-red-500 border-red-500/30 text-[10px]">
                    Incorrect
                  </Badge>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium overflow-x-auto max-w-full">
                <MathRenderer content={q.question} />
              </div>

              {q.imageUrl && (
                <img
                  src={q.imageUrl}
                  alt={`PDF Q.${q.questionNumber} diagram`}
                  className="max-h-44 rounded border border-border bg-white p-1 object-contain"
                />
              )}

              {q.type === "mcq" ? (
                <div className="text-xs space-y-1">
                  <div className="text-muted-foreground flex flex-wrap items-center gap-1">
                    <span>Your answer:</span>
                    <span className={correct ? "text-emerald-500 font-semibold inline-flex items-center gap-1" : "text-red-500 font-semibold inline-flex items-center gap-1"}>
                      {ans !== null && typeof ans === "number" ? (
                        q.options[ans] ? (
                          <>
                            <span>{String.fromCharCode(65 + ans)})</span>
                            <MathRenderer content={q.options[ans]} inline />
                          </>
                        ) : (
                          `Option (${String.fromCharCode(65 + ans)})`
                        )
                      ) : (
                        "Not answered"
                      )}
                    </span>
                  </div>
                  {!correct && (
                    <div className="text-emerald-500 font-medium flex flex-wrap items-center gap-1">
                      <span>Correct answer:</span>
                      {q.options[q.correctIndex] ? (
                        <>
                          <span>{String.fromCharCode(65 + q.correctIndex)})</span>
                          <MathRenderer content={q.options[q.correctIndex]} inline />
                        </>
                      ) : (
                        <span>Option ({String.fromCharCode(65 + q.correctIndex)})</span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs space-y-1">
                  <p className="text-muted-foreground">
                    Your answer:{" "}
                    <span className={correct ? "text-emerald-500 font-semibold" : "text-red-500 font-semibold"}>
                      {ans ? String(ans) : "Not answered"}
                    </span>
                  </p>
                  {!correct && (
                    <div className="text-emerald-500 font-medium flex flex-wrap items-center gap-1">
                      <span>Correct answer:</span>
                      <MathRenderer content={q.answer} inline />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2 pt-2 border-t border-border/40">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 sm:h-7 px-2.5 sm:px-2 text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 flex items-center gap-1.5"
                >
                  <a
                    href={buildGoogleSearchUrl(q, subject)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Search className="h-3.5 w-3.5" /> Search Google <ExternalLink className="h-3 w-3 opacity-70" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReportingQuestion(q)}
                  className="h-8 sm:h-7 px-2.5 sm:px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-1.5"
                >
                  <Flag className="h-3.5 w-3.5" /> Report Discrepancy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ReportPucQuestionModal
        question={reportingQuestion}
        subject={subject}
        open={!!reportingQuestion}
        onOpenChange={(open) => {
          if (!open) setReportingQuestion(null);
        }}
      />
    </div>
  );
}

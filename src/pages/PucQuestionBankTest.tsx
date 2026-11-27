import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Eye,
  Filter,
  Flag,
  Keyboard,
  Loader2,
  RefreshCcw,
  Search,
  Sparkles,
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
  const [customCount, setCustomCount] = useState(30);

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
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [reportingQuestion, setReportingQuestion] = useState<PucQuestion | null>(null);

  // Results & Stats
  const [stats, setStats] = useState<PucQbStats>(loadStats);
  const [reviewFilter, setReviewFilter] = useState<"all" | "incorrect" | "flagged">("all");

  // On-spot AI Explanation (NVIDIA Nemotron)
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [aiError, setAiError] = useState<Record<string, string>>({});

  // Load selected subject bank dynamically
  useEffect(() => {
    let active = true;
    setLoadingBank(true);
    loadPucSubjectBank(subject)
      .then((data) => {
        if (active) setBank(data);
      })
      .finally(() => {
        if (active) setLoadingBank(false);
      });
    return () => {
      active = false;
    };
  }, [subject]);

  // Quiz timer
  useEffect(() => {
    if (!timerActive) return;
    const id = window.setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [timerActive]);

  const subjectTotalQuestions = useMemo(() => {
    if (!bank) return 0;
    return bank.chapters.reduce((sum, ch) => sum + ch.mcqs.length + ch.fibs.length, 0);
  }, [bank]);

  // Flatten filtered questions for Setup preview
  const filteredPool = useMemo(() => {
    if (!bank) return [];
    const chapters = selectedChapters.length
      ? bank.chapters.filter((c) => selectedChapters.includes(c.chapterNumber))
      : bank.chapters;

    const pool: PucQuestion[] = [];
    for (const ch of chapters) {
      if (typeFilter === "all" || typeFilter === "mcq") pool.push(...ch.mcqs);
      if (typeFilter === "all" || typeFilter === "fib") pool.push(...ch.fibs);
    }
    if (diffFilter !== "All") {
      return pool.filter((q) => q.difficulty === diffFilter);
    }
    return pool;
  }, [bank, selectedChapters, typeFilter, diffFilter]);

  const startQuiz = (title: string, qs: PucQuestion[], mode: TestBehavior = behavior) => {
    if (qs.length === 0) return;
    setTestTitle(title);
    setQuestions(qs);
    setAnswers(Array(qs.length).fill(null));
    setChecked(Array(qs.length).fill(false));
    setFlagged([]);
    setCurrentIndex(0);
    setElapsedSeconds(0);
    setBehavior(mode);
    setTimerActive(true);
    setReviewFilter("all");
    setView("quiz");
  };

  const handleStartChapter = (ch: PucChapterBank) => {
    const qs: PucQuestion[] = [];
    if (typeFilter === "all" || typeFilter === "mcq") qs.push(...ch.mcqs);
    if (typeFilter === "all" || typeFilter === "fib") qs.push(...ch.fibs);
    const filtered = diffFilter === "All" ? qs : qs.filter((q) => q.difficulty === diffFilter);
    const finalQs = filtered.length ? filtered : [...ch.mcqs, ...ch.fibs];
    startQuiz(`${bank?.subjectName || subject} · Ch.${ch.chapterNumber}: ${ch.chapterName}`, finalQs);
  };

  const handleStartPartAMock = () => {
    if (!bank) return;
    const allMcqs = shuffle(bank.chapters.flatMap((c) => c.mcqs));
    const allFibs = shuffle(bank.chapters.flatMap((c) => c.fibs));
    const picked = [...allMcqs.slice(0, 15), ...allFibs.slice(0, 5)];
    startQuiz(`${bank.subjectName} · KSEAB Part-A Mock (15 MCQ + 5 FIB)`, picked, "exam");
  };

  const handleStartQuick10 = () => {
    const qs = shuffle(filteredPool).slice(0, 10);
    startQuiz(`${bank?.subjectName || subject} · 10-question drill`, qs);
  };

  const handleStartCustom = () => {
    const count = Math.max(1, Math.min(customCount || 30, filteredPool.length));
    const qs = shuffle(filteredPool).slice(0, count);
    startQuiz(`${bank?.subjectName || subject} · Custom practice (${qs.length} Qs)`, qs);
  };

  const isQuestionCorrect = (q: PucQuestion, ans: number | string | null): boolean => {
    if (ans === null || ans === "") return false;
    if (q.type === "mcq") {
      return typeof ans === "number" && ans === q.correctIndex;
    }
    return typeof ans === "string" && isFibCorrect(ans, q.answer);
  };

  const finishQuiz = () => {
    setTimerActive(false);
    const nextStats: PucQbStats = {
      totalAttempted: stats.totalAttempted,
      totalCorrect: stats.totalCorrect,
      chapters: { ...stats.chapters },
    };

    questions.forEach((q, idx) => {
      const ans = answers[idx];
      if (ans === null || ans === "") return;
      const correct = isQuestionCorrect(q, ans);
      nextStats.totalAttempted += 1;
      if (correct) nextStats.totalCorrect += 1;
      const chKey = `${subject}-ch${q.chapterNumber}`;
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
  const isCurrentChecked = checked[currentIndex];

  // Keyboard shortcuts during quiz
  useEffect(() => {
    if (view !== "quiz" || !currentQuestion) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") {
        setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((i) => Math.max(0, i - 1));
      } else if (currentQuestion.type === "mcq" && !isCurrentChecked) {
        const idx = ["1", "2", "3", "4"].indexOf(e.key);
        const letterIdx = ["a", "b", "c", "d"].indexOf(e.key.toLowerCase());
        const pick = idx !== -1 ? idx : letterIdx;
        if (pick !== -1 && pick < currentQuestion.options.length) {
          setAnswers((prev) => {
            const next = [...prev];
            next[currentIndex] = pick;
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
  const subjectLabel = SUBJECT_META.find((s) => s.key === subject)?.label || "Physics";

  const handleExplainWithAI = async (q: PucQuestion) => {
    if (aiExplanations[q.id] || aiLoadingId === q.id) return;
    setAiLoadingId(q.id);
    setAiError((prev) => {
      const next = { ...prev };
      delete next[q.id];
      return next;
    });

    const officialAns =
      q.type === "mcq"
        ? `${String.fromCharCode(65 + q.correctIndex)}) ${q.options[q.correctIndex] || ""}`
        : q.answer;
    const optionsBlock =
      q.type === "mcq"
        ? `\nOptions:\n${q.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join("\n")}`
        : "";

    const messages = [
      {
        role: "system",
        content: `You are an expert Karnataka 2nd PUC (KSEAB) ${subjectLabel} teacher. Give a clear, concise, step-by-step explanation for why the official answer is correct. Use proper LaTeX ($...$ for inline math/formulas/chemical equations and $$...$$ for display equations). Keep it well-structured and easy for a Class 12 student to follow.`,
      },
      {
        role: "user",
        content: `Chapter ${q.chapterNumber}: ${q.chapterName}\nQuestion: ${q.question}${optionsBlock}\nOfficial Answer: ${officialAns}`,
      },
    ];

    try {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 25000);
      const res = await fetch("/api/nvidia-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
        signal: controller.signal,
      });
      window.clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const content = (data?.content || "").trim();
      if (!content) throw new Error("Empty response");

      setAiExplanations((prev) => ({ ...prev, [q.id]: content }));
    } catch {
      setAiError((prev) => ({
        ...prev,
        [q.id]: "Could not reach Nemotron AI right now. Try again or use Search Google.",
      }));
    } finally {
      setAiLoadingId(null);
    }
  };

  // ==================== VIEW 1: SETUP (HOME) ====================
  const renderSetup = () => (
    <div className="space-y-7 sm:space-y-8">
      <section className="border-b border-border pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-muted-foreground">KSEAB 2nd PUC preparation</p>
          <Link
            to="/puc/question-banks"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Question Banks Library
          </Link>
        </div>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              2nd PUC Question Bank Practice
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Choose a chapter for every official KSEAB 1-mark MCQ and Fill-in-the-Blank, or build a filtered practice test.
            </p>
          </div>
          <Button onClick={handleStartQuick10} disabled={loadingBank || !filteredPool.length} className="w-full sm:w-auto">
            <Clock3 className="mr-2 h-4 w-4" />
            10-question drill
          </Button>
        </div>
      </section>

      {/* Stats Summary */}
      <section className="grid gap-3 grid-cols-3">
        {[
          { label: `${subjectLabel} bank`, value: loadingBank ? "…" : subjectTotalQuestions },
          { label: "Attempted", value: stats.totalAttempted },
          { label: "Accuracy", value: `${overallAccuracy}%` },
        ].map((item) => (
          <Card key={item.label} className="rounded-xl">
            <CardContent className="p-3.5 sm:p-5">
              <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-muted-foreground truncate">
                {item.label}
              </p>
              <p className="mt-1 text-xl sm:text-2xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Build a Test */}
      <section className="rounded-xl border bg-card p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <Filter className="mt-0.5 h-5 w-5 text-muted-foreground shrink-0" />
            <div>
              <h2 className="text-lg font-semibold">Build a test</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Filter by subject, chapter, question type, and difficulty.
              </p>
            </div>
          </div>
          <div className="flex rounded-md border p-1 self-start">
            {(
              [
                { id: "practice", label: "Practice" },
                { id: "exam", label: "Exam mode" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setBehavior(m.id)}
                className={`rounded px-3 py-1.5 text-xs sm:text-sm transition-colors ${
                  behavior === m.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div>
            <p className="text-sm font-medium">Subject</p>
            <div className="mt-2 grid grid-cols-3 sm:flex sm:flex-wrap gap-2">
              {SUBJECT_META.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => {
                    setSubject(s.key);
                    setSelectedChapters([]);
                  }}
                  className={`rounded-md border px-2.5 sm:px-3 py-2 text-xs sm:text-sm truncate ${
                    subject === s.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Question type</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(
                  [
                    { id: "mcq", label: "MCQs" },
                    { id: "fib", label: "Fill in Blanks" },
                    { id: "all", label: "All" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTypeFilter(t.id)}
                    className={`rounded-md border px-3 py-1.5 text-xs sm:text-sm ${
                      typeFilter === t.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Difficulty</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(["All", "Easy", "Average", "Difficult"] as DifficultyFilter[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDiffFilter(d)}
                    className={`rounded-md border px-2.5 py-1 text-xs ${
                      diffFilter === d
                        ? "border-primary bg-primary/15 text-foreground font-medium"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 flex flex-col justify-center">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Available with current filters
            </p>
            <p className="mt-1 text-3xl font-semibold">
              {loadingBank ? "…" : filteredPool.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedChapters.length > 0
                ? `${selectedChapters.length} chapter(s) selected`
                : `Across all ${bank?.chapters.length || 0} chapters`}
            </p>
          </div>
        </div>

        {bank && (
          <details className="mt-5 border-t pt-4">
            <summary className="cursor-pointer text-sm font-medium flex items-center justify-between">
              <span>
                Choose specific chapters {selectedChapters.length ? `(${selectedChapters.length} selected)` : ""}
              </span>
              {selectedChapters.length > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedChapters([]);
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Clear
                </span>
              )}
            </summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {bank.chapters.map((ch) => {
                const isSel = selectedChapters.includes(ch.chapterNumber);
                const count = ch.mcqs.length + ch.fibs.length;
                return (
                  <button
                    key={ch.chapterNumber}
                    type="button"
                    onClick={() => toggleChapter(ch.chapterNumber)}
                    className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${
                      isSel ? "border-primary bg-primary/10" : "bg-background hover:border-primary/40"
                    }`}
                  >
                    <span className="truncate pr-2">
                      <span className="mr-2 text-muted-foreground">{ch.chapterNumber}.</span>
                      {ch.chapterName}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">{count}</span>
                  </button>
                );
              })}
            </div>
          </details>
        )}

        <div className="mt-5 flex flex-wrap items-end gap-3 border-t pt-5">
          <label className="text-sm font-medium">
            Custom size
            <input
              type="number"
              min="1"
              max={Math.max(1, filteredPool.length)}
              value={customCount}
              onChange={(e) => setCustomCount(Number(e.target.value))}
              className="mt-2 block w-24 rounded-md border bg-background px-3 py-2 text-sm"
            />
          </label>
          <Button
            onClick={handleStartCustom}
            disabled={loadingBank || !filteredPool.length}
            className="w-full sm:w-auto"
          >
            Start custom test
          </Button>
          <Button
            variant="outline"
            onClick={handleStartPartAMock}
            disabled={loadingBank || !bank}
            className="w-full sm:w-auto"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            KSEAB Part-A Mock (15 MCQ + 5 FIB)
          </Button>
        </div>
      </section>

      {/* Chapter Practice */}
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Chapter practice</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Opening a chapter launches all matching questions for that unit.
            </p>
          </div>
          <div className="grid grid-cols-3 sm:flex rounded-md border p-1 w-full sm:w-auto">
            {SUBJECT_META.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  setSubject(s.key);
                  setSelectedChapters([]);
                }}
                className={`rounded px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm truncate ${
                  subject === s.key ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {loadingBank || !bank ? (
          <div className="mt-6 py-10 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading {subjectLabel} chapters…
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bank.chapters.map((ch) => {
              const totalQ = ch.mcqs.length + ch.fibs.length;
              const chStat = stats.chapters[`${subject}-ch${ch.chapterNumber}`];
              return (
                <button
                  key={ch.chapterNumber}
                  type="button"
                  onClick={() => handleStartChapter(ch)}
                  disabled={!totalQ}
                  className="rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/60 disabled:opacity-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">
                        Chapter {ch.chapterNumber} · {ch.mcqs.length} MCQ · {ch.fibs.length} FIB
                      </p>
                      <h3 className="mt-1 font-medium leading-snug">{ch.chapterName}</h3>
                    </div>
                    <p className="text-right text-2xl font-semibold shrink-0">
                      {totalQ}
                      <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        questions
                      </span>
                    </p>
                  </div>
                  {chStat && (
                    <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                      {chStat.correct}/{chStat.attempted} correct
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );

  // ==================== VIEW 2: QUIZ ====================
  const renderQuiz = () => {
    if (!currentQuestion) return null;
    const isMcq = currentQuestion.type === "mcq";
    const revealed = behavior === "practice" ? isCurrentChecked : false;
    const currentCorrect = isQuestionCorrect(currentQuestion, currentAnswer);

    return (
      <div className="space-y-5">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{testTitle}</p>
            <h1 className="mt-0.5 sm:mt-1 text-lg sm:text-xl font-semibold">
              Question {currentIndex + 1} of {questions.length}
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                <Clock3 className="mr-1 h-3.5 w-3.5" />
                {formatTime(elapsedSeconds)}
              </Badge>
              <Badge variant="outline">
                {answeredCount}/{questions.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setTimerActive(false); setView("setup"); }}>
                Exit
              </Button>
              <Button size="sm" onClick={finishQuiz}>
                Submit test
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <Card className="rounded-xl overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant="secondary">PDF Q.{currentQuestion.questionNumber}</Badge>
                  <Badge variant="outline">{subjectLabel}</Badge>
                  <Badge variant="outline">Ch.{currentQuestion.chapterNumber}</Badge>
                  {currentQuestion.difficulty && (
                    <Badge variant="outline" className="opacity-80">{currentQuestion.difficulty}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={aiLoadingId === currentQuestion.id}
                    onClick={() => handleExplainWithAI(currentQuestion)}
                    className="h-8 sm:h-7 px-2 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 flex items-center gap-1"
                    title="Generate step-by-step explanation using NVIDIA Nemotron AI"
                  >
                    {aiLoadingId === currentQuestion.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    <span>{aiExplanations[currentQuestion.id] ? "Explained" : "AI Explain"}</span>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="h-8 sm:h-7 px-2 text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 flex items-center gap-1"
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
                    className="h-8 sm:h-7 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-1"
                    title="Report an issue with this question to the developer"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    <span className="sm:hidden">Report</span>
                    <span className="hidden sm:inline">Report Discrepancy</span>
                  </Button>
                </div>
              </div>

              <div className="pt-3 text-base sm:text-lg font-medium leading-7 sm:leading-8 overflow-x-auto max-w-full">
                <MathRenderer content={currentQuestion.question} />
              </div>

              {currentQuestion.imageUrl && (
                <button
                  type="button"
                  onClick={() => setZoomedImage(currentQuestion.imageUrl || null)}
                  className="mt-3 w-fit max-w-full rounded border bg-white p-2 flex flex-col items-center gap-1"
                >
                  <img
                    src={currentQuestion.imageUrl}
                    alt={`Question ${currentQuestion.questionNumber} diagram`}
                    className="max-h-64 sm:max-h-72 max-w-full rounded object-contain"
                  />
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <ZoomIn className="h-3 w-3" /> Tap diagram to zoom
                  </span>
                </button>
              )}
            </CardHeader>

            <CardContent className="p-4 sm:p-6 pt-0 space-y-2.5">
              {/* MCQ Options */}
              {isMcq &&
                currentQuestion.options.map((optText, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const selected = currentAnswer === optIdx;
                  const correct = optIdx === currentQuestion.correctIndex;
                  const optImg = currentQuestion.optionImages?.[optIdx];

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={revealed}
                      onClick={() => {
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[currentIndex] = optIdx;
                          return next;
                        });
                      }}
                      className={`flex w-full items-start gap-3 rounded-lg border p-3.5 sm:p-4 min-h-[52px] text-left transition-colors active:scale-[0.99] touch-manipulation ${
                        !revealed
                          ? selected
                            ? "border-primary bg-primary/10"
                            : "hover:border-primary"
                          : correct
                          ? "border-emerald-500 bg-emerald-500/10"
                          : selected
                          ? "border-red-500 bg-red-500/10"
                          : "opacity-60"
                      }`}
                    >
                      <span
                        className={`rounded border px-2 py-0.5 text-xs font-semibold shrink-0 ${
                          selected && !revealed ? "border-primary bg-primary text-primary-foreground" : ""
                        }`}
                      >
                        {letter}
                      </span>
                      <div className="flex-1 min-w-0 space-y-2 overflow-x-auto">
                        <div className="text-sm leading-6">
                          <MathRenderer content={optText} inline />
                        </div>
                        {optImg && (
                          <img
                            src={optImg}
                            alt={`Option ${letter} diagram`}
                            className="max-h-40 rounded border bg-white p-1 object-contain"
                          />
                        )}
                      </div>
                      {revealed && correct && <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />}
                      {revealed && selected && !correct && <XCircle className="h-5 w-5 text-red-500 shrink-0" />}
                    </button>
                  );
                })}

              {/* FIB Input / Word Bank */}
              {!isMcq && (
                <div className="space-y-4 py-1">
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
                        className="h-8 text-xs gap-1"
                        onClick={() => setFibInputMode((m) => (m === "bank" ? "type" : "bank"))}
                      >
                        <Keyboard className="h-3.5 w-3.5" />
                        {fibInputMode === "bank" ? "Type Manually" : "Use Word Bank"}
                      </Button>
                    )}
                  </div>

                  {fibInputMode === "bank" && currentQuestion.wordBank.length > 0 ? (
                    <div className="p-3.5 rounded-lg border bg-muted/20 space-y-2">
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
                              disabled={revealed}
                              variant={selected ? "default" : "outline"}
                              className="h-9 sm:h-8 text-xs"
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
                        disabled={revealed}
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

              {/* Practice Mode Instant Check */}
              {behavior === "practice" && (
                <div className="pt-2">
                  {!revealed ? (
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
                      className="gap-1.5"
                    >
                      <Eye className="h-4 w-4" /> Check Answer
                    </Button>
                  ) : (
                    <div
                      className={`rounded-lg border p-3.5 text-sm ${
                        currentCorrect
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-500"
                          : "border-red-500/40 bg-red-500/10 text-red-500"
                      }`}
                    >
                      {currentCorrect ? (
                        <span className="inline-flex items-center gap-2 font-medium">
                          <CheckCircle2 className="h-4 w-4" /> Correct!
                        </span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5 font-medium">
                          <XCircle className="h-4 w-4 shrink-0" />
                          <span>Correct Answer:</span>
                          {isMcq ? (
                            currentQuestion.options[currentQuestion.correctIndex] ? (
                              <>
                                <span>{String.fromCharCode(65 + currentQuestion.correctIndex)})</span>
                                <MathRenderer content={currentQuestion.options[currentQuestion.correctIndex]} inline />
                              </>
                            ) : (
                              <span>Option ({String.fromCharCode(65 + currentQuestion.correctIndex)})</span>
                            )
                          ) : (
                            <MathRenderer content={currentQuestion.answer} inline />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* On-spot AI Explanation */}
              {(aiExplanations[currentQuestion.id] || aiError[currentQuestion.id]) && (
                <div className="mt-3 rounded-lg border border-violet-500/30 bg-violet-500/5 p-3.5 sm:p-4 space-y-1.5">
                  <p className="text-xs font-semibold text-violet-400 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> AI Explanation (Nemotron)
                  </p>
                  {aiExplanations[currentQuestion.id] ? (
                    <div className="text-sm leading-6 overflow-x-auto max-w-full">
                      <MathRenderer content={aiExplanations[currentQuestion.id]} />
                    </div>
                  ) : (
                    <p className="text-xs text-rose-400">{aiError[currentQuestion.id]}</p>
                  )}
                </div>
              )}

              {/* Prev / Flag / Next Row */}
              <div className="flex justify-between gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                  disabled={!currentIndex}
                  className="h-10 sm:h-9 px-3 sm:px-4"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant={flagged.includes(currentIndex) ? "secondary" : "outline"}
                  onClick={() => toggleFlag(currentIndex)}
                  className="h-10 sm:h-9 px-3 sm:px-4"
                >
                  <Flag className={`mr-1 h-4 w-4 ${flagged.includes(currentIndex) ? "text-amber-500 fill-amber-500" : ""}`} />
                  {flagged.includes(currentIndex) ? "Flagged" : "Flag"}
                </Button>
                {currentIndex < questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                    className="h-10 sm:h-9 px-3 sm:px-4"
                  >
                    Next
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={finishQuiz} className="h-10 sm:h-9 px-3 sm:px-4">
                    Finish
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sticky Question Palette */}
          <Card className="h-fit rounded-xl xl:sticky xl:top-4">
            <CardHeader>
              <CardTitle className="text-base">Question palette</CardTitle>
              <CardDescription>Flag questions to revisit before submitting.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-5 sm:grid-cols-8 xl:grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isAnswered = answers[index] !== null && answers[index] !== "";
                return (
                  <button
                    key={`${question.id}-${index}`}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    className={`rounded-md border py-2 text-sm font-medium transition-colors ${
                      currentIndex === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : flagged.includes(index)
                        ? "border-amber-500 bg-amber-500/10"
                        : isAnswered
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  // ==================== VIEW 3: RESULTS ====================
  const renderResults = () => {
    const totalScore = questions.reduce(
      (acc, q, idx) => acc + (isQuestionCorrect(q, answers[idx]) ? 1 : 0),
      0
    );
    const unanswered = answers.filter((a) => a === null || a === "").length;
    const pct = questions.length ? Math.round((totalScore / questions.length) * 100) : 0;

    const reviewItems = questions
      .map((q, idx) => ({ q, idx, ans: answers[idx], correct: isQuestionCorrect(q, answers[idx]) }))
      .filter((item) => {
        if (reviewFilter === "incorrect") return !item.correct;
        if (reviewFilter === "flagged") return flagged.includes(item.idx);
        return true;
      });

    return (
      <div className="space-y-5">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Test result</CardTitle>
            <CardDescription>{testTitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Score</p>
                <p className="text-2xl sm:text-3xl font-semibold">
                  {totalScore}/{questions.length}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Accuracy</p>
                <p className="text-2xl sm:text-3xl font-semibold">{pct}%</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Time</p>
                <p className="text-2xl sm:text-3xl font-semibold">{formatTime(elapsedSeconds)}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Unanswered</p>
                <p className="text-2xl sm:text-3xl font-semibold">{unanswered}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => setView("setup")}>Back to practice</Button>
              <Button
                variant="outline"
                disabled={totalScore === questions.length}
                onClick={() => {
                  const retry = questions.filter((q, idx) => !isQuestionCorrect(q, answers[idx]));
                  startQuiz("Review incorrect and skipped questions", retry, "practice");
                }}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry incorrect
              </Button>
            </div>
          </CardContent>
        </Card>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Question review</h2>
            <div className="flex items-center gap-1.5">
              {(["all", "incorrect", "flagged"] as const).map((f) => (
                <Button
                  key={f}
                  size="sm"
                  variant={reviewFilter === f ? "default" : "outline"}
                  className="h-8 text-xs capitalize"
                  onClick={() => setReviewFilter(f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {reviewItems.map(({ q, idx, ans, correct }) => (
              <Card key={`${q.id}-${idx}`} className="rounded-lg">
                <CardContent className="p-4 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      Question {idx + 1} · {subjectLabel} · Ch.{q.chapterNumber} · PDF Q.{q.questionNumber}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {correct ? (
                        <Badge className="bg-emerald-600">Correct</Badge>
                      ) : (
                        <Badge variant="destructive">Review</Badge>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={aiLoadingId === q.id}
                        onClick={() => handleExplainWithAI(q)}
                        className="h-7 px-2 text-xs text-violet-400 hover:text-violet-300 hover:bg-violet-500/10 flex items-center gap-1"
                      >
                        {aiLoadingId === q.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Sparkles className="h-3 w-3" />
                        )}
                        AI Explain
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 flex items-center gap-1"
                      >
                        <a href={buildGoogleSearchUrl(q, subject)} target="_blank" rel="noopener noreferrer">
                          <Search className="h-3 w-3" /> Google
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReportingQuestion(q)}
                        className="h-7 px-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-1"
                        title="Report discrepancy to developer"
                      >
                        <Flag className="h-3 w-3" /> Report Discrepancy
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm overflow-x-auto max-w-full">
                    <MathRenderer content={q.question} />
                  </div>

                  {q.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setZoomedImage(q.imageUrl || null)}
                      className="rounded border bg-white p-1.5 w-fit"
                    >
                      <img
                        src={q.imageUrl}
                        alt={`PDF Q.${q.questionNumber} diagram`}
                        className="max-h-44 rounded object-contain"
                      />
                    </button>
                  )}

                  {q.type === "mcq" ? (
                    <div className="text-xs space-y-1 pt-1">
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
                    <div className="text-xs space-y-1 pt-1">
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
                  {(aiExplanations[q.id] || aiError[q.id]) && (
                    <div className="mt-2 rounded-lg border border-violet-500/30 bg-violet-500/5 p-3 space-y-1">
                      <p className="text-[11px] font-semibold text-violet-400 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> AI Explanation (Nemotron)
                      </p>
                      {aiExplanations[q.id] ? (
                        <div className="text-xs sm:text-sm leading-6 overflow-x-auto max-w-full">
                          <MathRenderer content={aiExplanations[q.id]} />
                        </div>
                      ) : (
                        <p className="text-xs text-rose-400">{aiError[q.id]}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-5 sm:py-7 pb-24">
        {view === "setup" && renderSetup()}
        {view === "quiz" && renderQuiz()}
        {view === "results" && renderResults()}
      </main>

      <Dialog open={Boolean(zoomedImage)} onOpenChange={(open) => !open && setZoomedImage(null)}>
        <DialogContent className="w-[95vw] max-w-4xl p-3 sm:p-6 bg-white rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Question image</DialogTitle>
          </DialogHeader>
          {zoomedImage && (
            <img src={zoomedImage} alt="Expanded question graphic" className="max-h-[75vh] w-full object-contain" />
          )}
        </DialogContent>
      </Dialog>

      <ReportPucQuestionModal
        question={reportingQuestion}
        subject={subject}
        open={Boolean(reportingQuestion)}
        onOpenChange={(open) => !open && setReportingQuestion(null)}
      />
    </div>
  );
}

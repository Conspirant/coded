import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BookOpenCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCcw,
  Target,
  TimerReset,
  Trophy,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  SUBJECTS,
  getCachedChapters,
  getQuestionsByChapter,
  getRandomQuestions,
  loadChapterCounts,
  type ChapterInfo,
  type PYQQuestion,
} from "@/data/pyqQuestionBank";

type ViewState = "home" | "quiz" | "results";

interface TestConfig {
  mode: "chapter" | "quick" | "custom";
  chapterNumber?: number;
  chapterName: string;
  questionCount: number;
}

interface TestResult {
  score: number;
  total: number;
  timeSpent: number;
  answers: (number | null)[];
  questions: PYQQuestion[];
}

interface PYQStats {
  totalAttempted: number;
  totalCorrect: number;
  chapterStats: Record<number, { attempted: number; correct: number }>;
}

const chapterIcon = (chapterNumber: number) => {
  const icons: Record<number, string> = {
    1: "📏", 2: "🚗", 3: "🎯", 4: "⚖️", 5: "⚡", 6: "🔄",
    7: "🌍", 8: "🔩", 9: "💧", 10: "🌡️", 11: "🔥", 12: "💨",
    13: "🔔", 14: "🌊", 15: "⚡", 16: "🔋", 17: "💡", 18: "🧲",
    19: "🧭", 20: "🔌", 21: "〰️", 22: "📡", 23: "🔍", 24: "🌈",
    25: "☢️", 26: "⚛️", 27: "☢️", 28: "💻",
  };
  return icons[chapterNumber] || "📚";
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

function loadStats(): PYQStats {
  try {
    const raw = localStorage.getItem("pyq_stats");
    return raw ? JSON.parse(raw) : { totalAttempted: 0, totalCorrect: 0, chapterStats: {} };
  } catch {
    return { totalAttempted: 0, totalCorrect: 0, chapterStats: {} };
  }
}

function saveStats(stats: PYQStats) {
  localStorage.setItem("pyq_stats", JSON.stringify(stats));
}

function updateStats(prev: PYQStats, questions: PYQQuestion[], answers: (number | null)[]): PYQStats {
  const next = { ...prev, chapterStats: { ...prev.chapterStats } };
  questions.forEach((q, i) => {
    const isCorrect = answers[i] === q.correct;
    next.totalAttempted++;
    if (isCorrect) next.totalCorrect++;
    const ch = q.chapterNumber;
    if (!next.chapterStats[ch]) next.chapterStats[ch] = { attempted: 0, correct: 0 };
    next.chapterStats[ch].attempted++;
    if (isCorrect) next.chapterStats[ch].correct++;
  });
  return next;
}

const PYQTest = () => {
  const [view, setView] = useState<ViewState>("home");
  const [selectedSubject, setSelectedSubject] = useState<typeof SUBJECTS[number]>("Physics");
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [questions, setQuestions] = useState<PYQQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [stats, setStats] = useState<PYQStats>(loadStats());
  const [chaptersLoaded, setChaptersLoaded] = useState(false);

  // Load chapter counts from DB on mount
  useEffect(() => {
    loadChapterCounts().then(() => setChaptersLoaded(true));
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    const interval = window.setInterval(() => setTimer((v) => v + 1), 1000);
    return () => window.clearInterval(interval);
  }, [timerActive]);

  const currentQuestion = questions[currentIndex];
  const accuracy = stats.totalAttempted > 0 ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) : 0;

  const startQuiz = (nextConfig: TestConfig, nextQuestions: PYQQuestion[]) => {
    if (!nextQuestions.length) return;
    setConfig(nextConfig);
    setQuestions(nextQuestions);
    setAnswers(new Array(nextQuestions.length).fill(null));
    setCurrentIndex(0);
    setShowExplanation(false);
    setTimer(0);
    setTimerActive(true);
    setResult(null);
    setView("quiz");
  };

  const startChapterQuiz = async (chapter: ChapterInfo) => {
    setIsFetchingQuestions(true);
    try {
      const chapterQuestions = await getQuestionsByChapter(chapter.subject, chapter.number);
      if (!chapterQuestions.length) return;
      startQuiz({ mode: "chapter", chapterNumber: chapter.number, chapterName: chapter.name, questionCount: chapterQuestions.length }, chapterQuestions);
    } finally {
      setIsFetchingQuestions(false);
    }
  };

  const startQuickQuiz = async () => {
    setIsFetchingQuestions(true);
    try {
      const qs = await getRandomQuestions(10);
      if (!qs.length) return;
      startQuiz({ mode: "quick", chapterName: "Quick Physics Drill", questionCount: qs.length }, qs);
    } finally {
      setIsFetchingQuestions(false);
    }
  };

  const answerQuestion = (optionIndex: number) => {
    if (answers[currentIndex] !== null) return;
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = optionIndex;
    setAnswers(nextAnswers);
    setShowExplanation(true);
  };

  const finishQuiz = () => {
    setTimerActive(false);
    const score = answers.reduce((t, a, i) => t + (a === questions[i]?.correct ? 1 : 0), 0);
    const nextResult: TestResult = { score, total: questions.length, timeSpent: timer, answers, questions };
    const nextStats = updateStats(stats, questions, answers);
    saveStats(nextStats);
    setStats(nextStats);
    setResult(nextResult);
    setView("results");
  };

  const retryWrongAnswers = () => {
    if (!result) return;
    const wrongQs = result.questions.filter((_, i) => result.answers[i] !== _.correct);
    if (!wrongQs.length) return;
    startQuiz({ mode: "custom", chapterName: "Retry Wrong Questions", questionCount: wrongQs.length }, wrongQs);
  };

  const resetToHome = () => {
    setTimerActive(false);
    setView("home");
    setShowExplanation(false);
  };

  // ─── HOME ────────────────────────────────────────────────────
  const renderHome = () => (
    <div className="space-y-6">
      <SEO
        title="KCET PYQ Practice"
        description="Practice KCET previous year questions chapter-wise with instant grading and explanations."
        url="https://kcet-coded2.vercel.app/pyq-test"
        keywords="KCET PYQ, chapter wise physics PYQ, KCET practice"
      />

      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 shadow-2xl shadow-indigo-950/20">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-0 bg-emerald-500/15 text-emerald-300">KCET PYQ</Badge>
          <Badge className="border-0 bg-amber-500/15 text-amber-300">2006-2024</Badge>
        </div>
        <div className="mt-4">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">KCET PYQ Practice</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Practice previous year questions from the database. Questions are managed through the admin panel and updates go live instantly.
          </p>
          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 max-w-2xl">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1 text-left">
                <p className="text-sm font-medium text-amber-500">Sorry, work in progress!</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  The questions are still being added and the correct answers haven't been marked yet. Please do cooperate and understand. I am trying to add the questions as quickly as possible.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={startQuickQuiz} className="rounded-xl" disabled={isFetchingQuestions}>
              {isFetchingQuestions ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TimerReset className="mr-2 h-4 w-4" />}
              {isFetchingQuestions ? "Loading..." : "Start quick drill"}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.totalAttempted > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Questions Attempted", value: stats.totalAttempted, icon: Target },
            { label: "Overall Accuracy", value: `${accuracy}%`, icon: Trophy },
            { label: "Correct Answers", value: stats.totalCorrect, icon: CheckCircle2 },
          ].map((item) => (
            <Card key={item.label} className="border-white/10 bg-white/[0.03]">
              <CardContent className="flex items-center gap-4 py-5 px-6">
                <item.icon className="h-8 w-8 text-indigo-400 opacity-60" />
                <div>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Chapter Grid */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 mt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-indigo-400" />
            {selectedSubject} Chapters
            </h2>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {SUBJECTS.map(subj => (
                    <button
                        key={subj}
                        onClick={() => setSelectedSubject(subj as unknown as any)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${selectedSubject === subj ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-white/[0.03] text-muted-foreground border-white/10 hover:bg-white/10'}`}
                    >
                        {subj}
                    </button>
                ))}
            </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {getCachedChapters(selectedSubject).map((chapter) => (
            <button
              key={`${chapter.subject}-${chapter.number}`}
              onClick={() => startChapterQuiz(chapter)}
              disabled={isFetchingQuestions}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-indigo-400/30 hover:bg-indigo-500/5 disabled:opacity-50"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
                    <span>Ch {chapter.number} · {chapterIcon(chapter.number)}</span>
                    {isFetchingQuestions && <Loader2 className="h-3 w-3 animate-spin" />}
                  </div>
                  <h3 className="mt-2 font-semibold leading-snug">{chapter.name}</h3>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-indigo-400">{chapter.questionCount}</div>
                  <div className="text-[10px] text-muted-foreground">Qs</div>
                </div>
              </div>
              {stats.chapterStats[chapter.number] && (
                <div className="mt-3 pt-2 border-t border-white/5">
                  <Progress
                    value={Math.round((stats.chapterStats[chapter.number].correct / stats.chapterStats[chapter.number].attempted) * 100)}
                    className="h-1"
                  />
                  <div className="mt-1 text-[10px] text-muted-foreground">
                    {stats.chapterStats[chapter.number].correct}/{stats.chapterStats[chapter.number].attempted} correct
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  // ─── QUIZ ────────────────────────────────────────────────────
  const renderQuiz = () => {
    if (!currentQuestion || !config) return null;

    const answeredCount = answers.filter((a) => a !== null).length;
    const allAnswered = answeredCount === questions.length;
    const selectedAnswer = answers[currentIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium text-muted-foreground">{config.chapterName}</div>
            <h1 className="text-2xl font-bold">
              Question {currentIndex + 1} of {questions.length}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{formatTime(timer)}</Badge>
            <Badge variant="outline">{answeredCount}/{questions.length} answered</Badge>
            <Button variant="outline" onClick={resetToHome}>Exit</Button>
            <Button onClick={finishQuiz} disabled={!allAnswered}>Finish test</Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-white/10">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-0 bg-indigo-500/15 text-indigo-300">Year {currentQuestion.year}</Badge>
                <Badge variant="outline">Chapter {currentQuestion.chapterNumber}</Badge>
                {currentQuestion.subject && <Badge variant="outline">{currentQuestion.subject}</Badge>}
              </div>
              <CardTitle className="text-xl leading-8 whitespace-pre-wrap">{currentQuestion.question}</CardTitle>
              {currentQuestion.image_url && (
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-2 inline-block">
                  <img src={currentQuestion.image_url} alt="Question Graphic" className="max-w-full rounded-lg" />
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((option, optionIndex) => {
                const isSelected = selectedAnswer === optionIndex;
                const isRight = currentQuestion.correct === optionIndex;

                return (
                  <button
                    key={`${currentQuestion.id}-${optionIndex}`}
                    onClick={() => answerQuestion(optionIndex)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      selectedAnswer === null
                        ? "border-white/10 bg-white/5 hover:border-indigo-400/30 hover:bg-indigo-500/5"
                        : isRight
                          ? "border-emerald-500/30 bg-emerald-500/10"
                          : isSelected
                            ? "border-red-500/30 bg-red-500/10"
                            : "border-white/5 bg-white/5 opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full border border-white/20 px-2 py-0.5 text-xs font-semibold">
                        {String.fromCharCode(65 + optionIndex)}
                      </div>
                      <div className="flex-1 flex flex-col items-start gap-2">
                        {option && <div className="text-sm leading-6">{option}</div>}
                        {currentQuestion.option_images?.[optionIndex] && (
                            <img src={currentQuestion.option_images[optionIndex]} alt={`Option ${String.fromCharCode(65 + optionIndex)} Graphic`} className="max-h-24 max-w-full rounded bg-white/5 object-contain" />
                        )}
                      </div>
                      {selectedAnswer !== null && isRight && <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300 shrink-0" />}
                      {selectedAnswer !== null && isSelected && !isRight && <XCircle className="mt-0.5 h-4 w-4 text-red-300 shrink-0" />}
                    </div>
                  </button>
                );
              })}

              {showExplanation && currentQuestion.explanation && (
                <div className={`rounded-2xl border p-4 ${isCorrect ? "border-emerald-500/20 bg-emerald-500/10" : "border-red-500/20 bg-red-500/10"}`}>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    {isCorrect ? (
                      <><CheckCircle2 className="h-4 w-4 text-emerald-300" /> Correct</>
                    ) : (
                      <><XCircle className="h-4 w-4 text-red-300" /> Incorrect</>
                    )}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">{currentQuestion.explanation}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowExplanation(answers[currentIndex - 1] !== null);
                    setCurrentIndex((v) => Math.max(0, v - 1));
                  }}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={() => {
                    setShowExplanation(answers[currentIndex + 1] !== null);
                    setCurrentIndex((v) => Math.min(questions.length - 1, v + 1));
                  }}
                  disabled={currentIndex === questions.length - 1 || selectedAnswer === null}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="text-base">Question navigator</CardTitle>
              <CardDescription>Jump between questions without losing your answer.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-5 gap-2">
              {questions.map((q, index) => {
                const answered = answers[index] !== null;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(index);
                      setShowExplanation(answers[index] !== null);
                    }}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      index === currentIndex
                        ? "bg-indigo-500 text-white"
                        : answered
                          ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : "border border-white/10 bg-white/5 text-muted-foreground"
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

  // ─── RESULTS ─────────────────────────────────────────────────
  const renderResults = () => {
    if (!result || !config) return null;
    const percentage = Math.round((result.score / result.total) * 100);

    return (
      <div className="space-y-6">
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="text-3xl font-black">Test Result</CardTitle>
            <CardDescription>{config.chapterName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Score", value: `${result.score}/${result.total}` },
                { label: "Accuracy", value: `${percentage}%` },
                { label: "Time", value: formatTime(result.timeSpent) },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="mt-2 text-2xl font-bold">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={resetToHome}>Back to chapters</Button>
              <Button variant="outline" onClick={retryWrongAnswers} disabled={result.score === result.total}>
                <RefreshCcw className="mr-2 h-4 w-4" /> Retry wrong
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 md:pb-8">
        {view === "home" && renderHome()}
        {view === "quiz" && renderQuiz()}
        {view === "results" && renderResults()}
      </div>
    </div>
  );
};

export default PYQTest;

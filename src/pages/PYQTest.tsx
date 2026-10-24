import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { MathRenderer } from "@/components/MathRenderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpenCheck, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Filter, Flag, Image as ImageIcon, Loader2, RefreshCcw, Target, XCircle, ZoomIn } from "lucide-react";
import { SUBJECTS, getCachedChapters, getFilteredQuestions, getQuestionsByChapter, loadChapterCounts, type ChapterInfo, type PYQQuestion, type Subject } from "@/data/pyqQuestionBank";

type ViewState = "home" | "quiz" | "results";
type TestMode = "chapter" | "quick" | "mock" | "custom";

interface TestConfig { mode: TestMode; title: string; questionCount: number; }
interface TestResult { score: number; total: number; timeSpent: number; answers: (number | null)[]; questions: PYQQuestion[]; }
interface PYQStats { totalAttempted: number; totalCorrect: number; chapterStats: Record<string, { attempted: number; correct: number }>; }

const YEAR_MIN = 2006;
const YEAR_MAX = 2024;
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
const subjectKey = (q: Pick<PYQQuestion, "subject" | "chapterNumber">) => `${q.subject || "Physics"}-${q.chapterNumber}`;

function loadStats(): PYQStats {
  try {
    const saved = JSON.parse(localStorage.getItem("pyq_stats") || "null");
    return saved && saved.chapterStats ? saved : { totalAttempted: 0, totalCorrect: 0, chapterStats: {} };
  } catch { return { totalAttempted: 0, totalCorrect: 0, chapterStats: {} }; }
}

export default function PYQTest() {
  const [view, setView] = useState<ViewState>("home");
  const [subject, setSubject] = useState<Subject>("Physics");
  const [chaptersReady, setChaptersReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [questions, setQuestions] = useState<PYQQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [stats, setStats] = useState<PYQStats>(loadStats);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [yearStart, setYearStart] = useState(YEAR_MIN);
  const [yearEnd, setYearEnd] = useState(YEAR_MAX);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(["Physics", "Chemistry", "Mathematics"]);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [physicsCount, setPhysicsCount] = useState(60);
  const [chemistryCount, setChemistryCount] = useState(60);
  const [mathsCount, setMathsCount] = useState(60);
  const [customCount, setCustomCount] = useState(30);
  const [filteredAvailableCount, setFilteredAvailableCount] = useState(0);

  useEffect(() => { loadChapterCounts().finally(() => setChaptersReady(true)); }, []);
  useEffect(() => {
    if (!timerActive) return;
    const interval = window.setInterval(() => setTimer((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    let current = true;
    getFilteredQuestions({ subjects: selectedSubjects, chapterKeys: selectedChapters, startYear: yearStart, endYear: yearEnd })
      .then((items) => { if (current) setFilteredAvailableCount(items.length); });
    return () => { current = false; };
  }, [selectedSubjects, selectedChapters, yearStart, yearEnd]);

  const chapters = getCachedChapters(subject);
  const allChapters = getCachedChapters();
  const currentQuestion = questions[currentIndex];
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const accuracy = stats.totalAttempted ? Math.round((stats.totalCorrect / stats.totalAttempted) * 100) : 0;

  const startQuiz = (nextConfig: TestConfig, nextQuestions: PYQQuestion[]) => {
    if (!nextQuestions.length) return;
    setConfig(nextConfig); setQuestions(nextQuestions); setAnswers(Array(nextQuestions.length).fill(null));
    setFlagged([]); setCurrentIndex(0); setTimer(0); setTimerActive(true); setResult(null); setView("quiz");
  };

  const startChapter = async (chapter: ChapterInfo) => {
    setLoading(true);
    try {
      const chapterQuestions = await getQuestionsByChapter(chapter.subject, chapter.number);
      startQuiz({ mode: "chapter", title: `${chapter.subject} · ${chapter.name}`, questionCount: chapterQuestions.length }, chapterQuestions);
    } finally { setLoading(false); }
  };

  const startConfiguredTest = async (mode: "quick" | "mock" | "custom") => {
    setLoading(true);
    try {
      const pool = shuffle(await getFilteredQuestions({ subjects: selectedSubjects, chapterKeys: selectedChapters, startYear: yearStart, endYear: yearEnd }));
      let picked: PYQQuestion[];
      if (mode === "mock") {
        const takeSubject = (name: Subject, count: number) => pool.filter((question) => question.subject === name).slice(0, Math.max(0, count));
        picked = shuffle([...takeSubject("Physics", physicsCount), ...takeSubject("Chemistry", chemistryCount), ...takeSubject("Mathematics", mathsCount)]);
      } else {
        picked = pool.slice(0, mode === "quick" ? 10 : Math.max(1, customCount));
      }
      const label = mode === "mock" ? "PCM full mock" : mode === "quick" ? "10-question quick drill" : "Custom practice set";
      startQuiz({ mode, title: label, questionCount: picked.length }, picked);
    } finally { setLoading(false); }
  };

  const finishQuiz = () => {
    setTimerActive(false);
    const score = answers.reduce((total, answer, index) => total + Number(answer === questions[index]?.correct), 0);
    const nextResult = { score, total: questions.length, timeSpent: timer, answers, questions };
    const nextStats: PYQStats = { ...stats, totalAttempted: stats.totalAttempted + questions.length, totalCorrect: stats.totalCorrect + score, chapterStats: { ...stats.chapterStats } };
    questions.forEach((question, index) => {
      const key = subjectKey(question); const chapter = nextStats.chapterStats[key] || { attempted: 0, correct: 0 };
      nextStats.chapterStats[key] = { attempted: chapter.attempted + 1, correct: chapter.correct + Number(answers[index] === question.correct) };
    });
    localStorage.setItem("pyq_stats", JSON.stringify(nextStats)); setStats(nextStats); setResult(nextResult); setView("results");
  };

  const toggleSubject = (nextSubject: Subject) => setSelectedSubjects((current) => current.includes(nextSubject) ? current.filter((item) => item !== nextSubject) : [...current, nextSubject]);
  const toggleChapter = (chapter: ChapterInfo) => {
    const key = `${chapter.subject}-${chapter.number}`;
    setSelectedChapters((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  };
  const exit = () => { setTimerActive(false); setView("home"); };

  const renderHome = () => (
    <div className="space-y-8">
      <SEO title="KCET PYQ Practice" description="Build chapter-wise, year-wise and PCM previous-year question tests for KCET." url="https://kcetcoded.dev/pyq-test" keywords="KCET PYQ, chapter wise questions, KCET mock test" />
      <section className="border-b border-border pb-7">
        <p className="text-sm font-medium text-muted-foreground">KCET preparation</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Previous-year question practice</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Choose a chapter for every available question, or build a filtered test from the question bank.</p></div>
          <Button onClick={() => startConfiguredTest("quick")} disabled={loading}><Clock3 className="mr-2 h-4 w-4" />10-question drill</Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[{ label: "Question bank", value: allChapters.reduce((total, chapter) => total + chapter.questionCount, 0) }, { label: "Attempted", value: stats.totalAttempted }, { label: "Accuracy", value: `${accuracy}%` }].map((item) => <Card key={item.label} className="rounded-xl"><CardContent className="p-5"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</p><p className="mt-1 text-2xl font-semibold">{item.value}</p></CardContent></Card>)}
      </section>

      <section className="rounded-xl border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3"><Filter className="mt-0.5 h-5 w-5 text-muted-foreground" /><div><h2 className="text-lg font-semibold">Build a test</h2><p className="mt-1 text-sm text-muted-foreground">Filter by subject, chapter and exam year. The available-question total updates from the same source used to run the test.</p></div></div>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <div><p className="text-sm font-medium">Subjects</p><div className="mt-2 flex flex-wrap gap-2">{SUBJECTS.map((item) => <button key={item} onClick={() => toggleSubject(item)} className={`rounded-md border px-3 py-2 text-sm ${selectedSubjects.includes(item) ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground"}`}>{item}</button>)}</div></div>
          <div><p className="text-sm font-medium">Exam years</p><div className="mt-2 flex gap-2"><input aria-label="Start year" type="number" min={YEAR_MIN} max={YEAR_MAX} value={yearStart} onChange={(e) => setYearStart(Number(e.target.value))} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /><span className="self-center text-muted-foreground">to</span><input aria-label="End year" type="number" min={YEAR_MIN} max={YEAR_MAX} value={yearEnd} onChange={(e) => setYearEnd(Number(e.target.value))} className="w-full rounded-md border bg-background px-3 py-2 text-sm" /></div></div>
          <div className="rounded-lg bg-muted/50 p-4"><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Available with current filters</p><p className="mt-1 text-3xl font-semibold">{filteredAvailableCount}</p><p className="mt-1 text-xs text-muted-foreground">Questions before test size is applied</p></div>
        </div>
        <details className="mt-5 border-t pt-4"><summary className="cursor-pointer text-sm font-medium">Choose specific chapters {selectedChapters.length ? `(${selectedChapters.length} selected)` : ""}</summary><div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{allChapters.filter((chapter) => selectedSubjects.includes(chapter.subject as Subject)).map((chapter) => { const key = `${chapter.subject}-${chapter.number}`; return <button key={key} onClick={() => toggleChapter(chapter)} className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm ${selectedChapters.includes(key) ? "border-primary bg-primary/10" : "bg-background"}`}><span><span className="mr-2 text-muted-foreground">{chapter.number}.</span>{chapter.name}</span><span className="ml-2 text-xs text-muted-foreground">{chapter.questionCount}</span></button>; })}</div></details>
        <div className="mt-5 flex flex-wrap items-end gap-3 border-t pt-5"><label className="text-sm font-medium">Custom size<input type="number" min="1" value={customCount} onChange={(e) => setCustomCount(Number(e.target.value))} className="mt-2 block w-24 rounded-md border bg-background px-3 py-2" /></label><Button onClick={() => startConfiguredTest("custom")} disabled={loading || !filteredAvailableCount}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Start custom test</Button></div>
      </section>

      <section className="rounded-xl border bg-card p-5 sm:p-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-lg font-semibold">PCM full mock</h2><p className="mt-1 text-sm text-muted-foreground">Create an exam-style mixed test. If a filter has fewer questions than requested, every matching question is included.</p></div><Button variant="outline" onClick={() => { setSelectedSubjects(["Physics", "Chemistry", "Mathematics"]); setSelectedChapters([]); setYearStart(YEAR_MIN); setYearEnd(YEAR_MAX); setPhysicsCount(60); setChemistryCount(60); setMathsCount(60); }}>Reset mock settings</Button></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{[["Physics", physicsCount, setPhysicsCount], ["Chemistry", chemistryCount, setChemistryCount], ["Mathematics", mathsCount, setMathsCount]].map(([label, value, setter]) => <label key={label as string} className="rounded-lg border p-4 text-sm font-medium">{label as string}<input type="number" min="0" value={value as number} onChange={(e) => (setter as (value: number) => void)(Number(e.target.value))} className="mt-2 block w-full rounded-md border bg-background px-3 py-2" /></label>)}</div><div className="mt-5 flex items-center justify-between gap-3"><span className="text-sm text-muted-foreground">Requested: {physicsCount + chemistryCount + mathsCount} questions</span><Button onClick={() => startConfiguredTest("mock")} disabled={loading}>Start PCM mock</Button></div></section>

      <section><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Chapter practice</h2><p className="mt-1 text-sm text-muted-foreground">Opening a chapter includes all its available questions.</p></div><div className="flex rounded-md border p-1">{SUBJECTS.map((item) => <button key={item} onClick={() => setSubject(item)} className={`rounded px-3 py-1.5 text-sm ${subject === item ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{item}</button>)}</div></div><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{chaptersReady ? chapters.map((chapter) => { const chapterStat = stats.chapterStats[`${chapter.subject}-${chapter.number}`]; return <button key={`${chapter.subject}-${chapter.number}`} onClick={() => startChapter(chapter)} disabled={loading || !chapter.questionCount} className="rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/60 disabled:opacity-50"><div className="flex items-start justify-between gap-3"><div><p className="text-xs text-muted-foreground">Chapter {chapter.number}</p><h3 className="mt-1 font-medium">{chapter.name}</h3></div><p className="text-right text-2xl font-semibold">{chapter.questionCount}<span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">questions</span></p></div>{chapterStat && <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">{chapterStat.correct}/{chapterStat.attempted} correct</p>}</button>; }) : <div className="text-sm text-muted-foreground">Loading question counts…</div>}</div></section>
    </div>
  );

  const renderQuiz = () => {
    if (!currentQuestion || !config) return null;
    const selectedAnswer = answers[currentIndex]; const revealed = selectedAnswer !== null;
    const setAnswer = (option: number) => { if (revealed) return; setAnswers((current) => current.map((answer, index) => index === currentIndex ? option : answer)); };
    return <div className="space-y-5"><header className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"><div><p className="text-sm text-muted-foreground">{config.title}</p><h1 className="mt-1 text-xl font-semibold">Question {currentIndex + 1} of {questions.length}</h1></div><div className="flex items-center gap-2"><Badge variant="outline"><Clock3 className="mr-1 h-3.5 w-3.5" />{formatTime(timer)}</Badge><Badge variant="outline">{answeredCount}/{questions.length}</Badge><Button variant="ghost" size="sm" onClick={exit}>Exit</Button><Button size="sm" onClick={finishQuiz}>Submit test</Button></div></header><div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]"><Card className="rounded-xl"><CardHeader><div className="flex flex-wrap gap-2"><Badge variant="secondary">KCET {currentQuestion.year}</Badge><Badge variant="outline">{currentQuestion.subject}</Badge><Badge variant="outline">Chapter {currentQuestion.chapterNumber}</Badge></div><div className="pt-3 text-lg font-medium leading-8"><MathRenderer content={currentQuestion.question} /></div>{currentQuestion.image_url && !currentQuestion.question.includes(currentQuestion.image_url) && <button onClick={() => setZoomedImage(currentQuestion.image_url || null)} className="mt-3 w-fit rounded border p-2"><img src={currentQuestion.image_url} alt="Question diagram" className="max-h-72 max-w-full rounded object-contain" /></button>}</CardHeader><CardContent className="space-y-2">{currentQuestion.options.map((option, index) => { const correct = index === currentQuestion.correct; const selected = index === selectedAnswer; const optImg = currentQuestion.option_images?.[index]; return <button key={index} onClick={() => setAnswer(index)} className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left ${!revealed ? "hover:border-primary" : correct ? "border-emerald-500 bg-emerald-500/10" : selected ? "border-red-500 bg-red-500/10" : "opacity-60"}`}><span className="rounded border px-2 py-0.5 text-xs font-semibold">{String.fromCharCode(65 + index)}</span><div className="flex-1 space-y-2"><div className="text-sm leading-6"><MathRenderer content={option} inline /></div>{optImg && <img src={optImg} alt={`Option ${String.fromCharCode(65 + index)} diagram`} className="max-h-40 rounded border bg-background/50 p-1 object-contain" />}</div>{revealed && correct && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}{revealed && selected && !correct && <XCircle className="h-5 w-5 text-red-500" />}</button>; })}{revealed && (currentQuestion.explanation || currentQuestion.explanation_image_url) && <div className="mt-4 rounded-lg border bg-muted/40 p-4"><p className="mb-2 text-sm font-semibold">Solution</p>{currentQuestion.explanation && <div className="text-sm leading-6"><MathRenderer content={currentQuestion.explanation} /></div>}{currentQuestion.explanation_image_url && <button onClick={() => setZoomedImage(currentQuestion.explanation_image_url || null)} className="mt-3"><img src={currentQuestion.explanation_image_url} alt="Solution diagram" className="max-h-72 rounded border" /></button>}</div>}<div className="flex justify-between pt-4"><Button variant="outline" onClick={() => setCurrentIndex((index) => Math.max(0, index - 1))} disabled={!currentIndex}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button><Button variant={flagged.includes(currentIndex) ? "secondary" : "outline"} onClick={() => setFlagged((items) => items.includes(currentIndex) ? items.filter((item) => item !== currentIndex) : [...items, currentIndex])}><Flag className="mr-1 h-4 w-4" />{flagged.includes(currentIndex) ? "Flagged" : "Flag"}</Button><Button onClick={() => setCurrentIndex((index) => Math.min(questions.length - 1, index + 1))} disabled={currentIndex === questions.length - 1}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button></div></CardContent></Card><Card className="h-fit rounded-xl xl:sticky xl:top-4"><CardHeader><CardTitle className="text-base">Question palette</CardTitle><CardDescription>Flag questions to revisit before submitting.</CardDescription></CardHeader><CardContent className="grid grid-cols-5 gap-2">{questions.map((question, index) => <button key={`${question.id}-${index}`} onClick={() => setCurrentIndex(index)} className={`rounded-md border py-2 text-sm ${currentIndex === index ? "border-primary bg-primary text-primary-foreground" : flagged.includes(index) ? "border-amber-500 bg-amber-500/10" : answers[index] !== null ? "border-emerald-500/50 bg-emerald-500/10" : ""}`}>{index + 1}</button>)}</CardContent></Card></div></div>;
  };

  const renderResults = () => {
    if (!result || !config) return null;
    const percentage = Math.round((result.score / result.total) * 100); const unanswered = result.answers.filter((answer) => answer === null).length;
    return <div className="space-y-5"><Card className="rounded-xl"><CardHeader><CardTitle className="text-2xl">Test result</CardTitle><CardDescription>{config.title}</CardDescription></CardHeader><CardContent><div className="grid gap-4 sm:grid-cols-4"><div><p className="text-xs uppercase text-muted-foreground">Score</p><p className="text-3xl font-semibold">{result.score}/{result.total}</p></div><div><p className="text-xs uppercase text-muted-foreground">Accuracy</p><p className="text-3xl font-semibold">{percentage}%</p></div><div><p className="text-xs uppercase text-muted-foreground">Time</p><p className="text-3xl font-semibold">{formatTime(result.timeSpent)}</p></div><div><p className="text-xs uppercase text-muted-foreground">Unanswered</p><p className="text-3xl font-semibold">{unanswered}</p></div></div><div className="mt-6 flex flex-wrap gap-3"><Button onClick={exit}>Back to practice</Button><Button variant="outline" onClick={() => { const retry = result.questions.filter((question, index) => result.answers[index] !== question.correct); startQuiz({ mode: "custom", title: "Review incorrect and skipped questions", questionCount: retry.length }, retry); }} disabled={result.score === result.total}><RefreshCcw className="mr-2 h-4 w-4" />Retry incorrect</Button></div></CardContent></Card><section><h2 className="text-lg font-semibold">Question review</h2><div className="mt-3 space-y-3">{result.questions.map((question, index) => { const correct = result.answers[index] === question.correct; return <Card key={`${question.id}-${index}`} className="rounded-lg"><CardContent className="p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-medium">Question {index + 1} · {question.subject} · {question.year}</p>{correct ? <Badge className="bg-emerald-600">Correct</Badge> : <Badge variant="destructive">Review</Badge>}</div><div className="mt-2 text-sm"><MathRenderer content={question.question} /></div><p className="mt-3 text-xs text-muted-foreground">Correct answer: {String.fromCharCode(65 + question.correct)}</p></CardContent></Card>; })}</div></section></div>;
  };

  return <div className="min-h-screen bg-background"><main className="mx-auto max-w-7xl px-4 py-7 pb-24">{view === "home" && renderHome()}{view === "quiz" && renderQuiz()}{view === "results" && renderResults()}</main><Dialog open={Boolean(zoomedImage)} onOpenChange={(open) => !open && setZoomedImage(null)}><DialogContent className="max-w-4xl"><DialogHeader><DialogTitle>Question image</DialogTitle></DialogHeader>{zoomedImage && <img src={zoomedImage} alt="Expanded question graphic" className="max-h-[75vh] w-full object-contain" />}</DialogContent></Dialog></div>;
}

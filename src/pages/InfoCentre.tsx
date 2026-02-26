import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  GraduationCap,
  Building2,
  Users,
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  MapPin,
  Award,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  Info,
  History,
  Globe,
  FileText,
  Shield,
  Scale,
  Clock,
  Briefcase,
  HelpCircle,
  Zap,
  XCircle,
  Star,
  Layers,
  ArrowLeftRight
} from "lucide-react"

/* ───────────── VTU vs Autonomous Deep-Dive ───────────── */

type CompareTab = "overview" | "academics" | "exams" | "placements" | "verdict";

const VTUvsAutonomousSection = () => {
  const [activeTab, setActiveTab] = useState<CompareTab>("overview");

  const tabs: { id: CompareTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <Layers className="h-4 w-4" /> },
    { id: "academics", label: "Academics", icon: <BookOpen className="h-4 w-4" /> },
    { id: "exams", label: "Exams & Grading", icon: <Scale className="h-4 w-4" /> },
    { id: "placements", label: "Placements", icon: <Briefcase className="h-4 w-4" /> },
    { id: "verdict", label: "The Verdict", icon: <Star className="h-4 w-4" /> },
  ];

  return (
    <Card className="border-2 border-violet-400/30 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border-b">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/20 rounded-lg">
            <ArrowLeftRight className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <CardTitle className="text-2xl text-violet-700 dark:text-violet-300">
              VTU Affiliated vs. Autonomous Colleges — The Real Difference
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              The one comparison no senior or brochure explains properly. Here's everything you actually need to know.
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b bg-muted/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? "border-violet-500 text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/30"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8 space-y-8">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Quick TL;DR */}
              <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-violet-600" />
                  <h3 className="font-bold text-lg text-violet-800 dark:text-violet-200">TL;DR — The 30-Second Summary</h3>
                </div>
                <p className="text-base leading-relaxed">
                  A <strong>VTU Affiliated</strong> college follows VTU's syllabus word-for-word, writes VTU's exam papers, and gets evaluated by VTU examiners. An <strong>Autonomous</strong> college is still technically under VTU (your degree says "VTU" on it), but it designs its <em>own syllabus</em>, sets its <em>own exams</em>, and evaluates papers <em>internally</em>. Think of affiliation as a franchise — the Autonomous college got permission to run its own kitchen, but the brand name on the sign is still VTU.
                </p>
              </div>

              {/* Side-by-side definition cards */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-full">
                        <Building2 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                      </div>
                      <CardTitle className="text-lg text-blue-800 dark:text-blue-200">VTU Affiliated College</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-blue-800 dark:text-blue-200 leading-relaxed">A college that is <strong>bound by VTU in every academic aspect</strong>. VTU decides what you study, when you write exams, and how your papers are evaluated.</p>
                    <div className="space-y-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                      <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /><span className="text-blue-700 dark:text-blue-300">Syllabus set by VTU, Belagavi</span></div>
                      <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /><span className="text-blue-700 dark:text-blue-300">Exams conducted by VTU centrally</span></div>
                      <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /><span className="text-blue-700 dark:text-blue-300">Answer sheets evaluated by external VTU evaluators</span></div>
                      <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /><span className="text-blue-700 dark:text-blue-300">Results declared by VTU (often delayed)</span></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-700">
                      <p className="text-xs text-blue-600 dark:text-blue-400 italic">Examples: BIT Bangalore, SJBIT, DSATM, DSCE, RNSIT, BMSCE (before autonomy)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-200 dark:bg-emerald-800 rounded-full">
                        <Shield className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                      </div>
                      <CardTitle className="text-lg text-emerald-800 dark:text-emerald-200">Autonomous College</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">A college <strong>granted academic independence by UGC</strong>. It designs its own curriculum and exams, but still awards the VTU degree. Think of it as VTU with custom firmware.</p>
                    <div className="space-y-2 pt-2 border-t border-emerald-200 dark:border-emerald-700">
                      <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" /><span className="text-emerald-700 dark:text-emerald-300">College designs its own syllabus & updates it frequently</span></div>
                      <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" /><span className="text-emerald-700 dark:text-emerald-300">College conducts its own exams on its own schedule</span></div>
                      <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" /><span className="text-emerald-700 dark:text-emerald-300">Internal evaluation by college faculty</span></div>
                      <div className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" /><span className="text-emerald-700 dark:text-emerald-300">Results typically declared much faster</span></div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-700">
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 italic">Examples: RVCE, BMSCE, MSRIT, PESIT, NHCE, SJCE Mysore, NIE Mysore</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Key stat callout */}
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Important: Your degree is the same</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">Whether you study at an Autonomous or Affiliated college, your final degree certificate says <strong>"Visvesvaraya Technological University."</strong> Recruiters see the same university name. The difference is entirely in <em>how</em> you are taught and evaluated during those 4 years.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── ACADEMICS TAB ── */}
          {activeTab === "academics" && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-violet-500" />
                Syllabus, Teaching & Curriculum
              </h3>

              {/* Comparison Table */}
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-4 font-semibold border-b w-1/4">Aspect</th>
                      <th className="text-left p-4 font-semibold border-b border-l w-[37.5%] text-blue-700 dark:text-blue-300">
                        <div className="flex items-center gap-2"><Building2 className="h-4 w-4" /> VTU Affiliated</div>
                      </th>
                      <th className="text-left p-4 font-semibold border-b border-l w-[37.5%] text-emerald-700 dark:text-emerald-300">
                        <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Autonomous</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Syllabus Design", "Designed by VTU Board of Studies. Uniform across all affiliated colleges statewide.", "Designed by the college's own faculty and Board of Studies. Can be customized per industry trends."],
                      ["Syllabus Update Frequency", "Revised once every 4–5 years (scheme changes like 2018, 2022). Often lags behind industry.", "Can be updated every year or even semester. Top colleges add AI/ML, Cloud, DevOps modules years before VTU does."],
                      ["Elective Choices", "Limited to the list VTU provides. Same electives for every college, regardless of their faculty strengths.", "College chooses electives based on faculty expertise and industry demand. More diverse and niche options."],
                      ["Lab & Project Work", "Experiments from VTU lab manuals. Same experiments across all colleges. Limited flexibility.", "College designs its own lab experiments. Many add real-world mini-projects and open-ended labs."],
                      ["Industry Collaboration", "Difficult to embed into the rigid VTU syllabus. Guest lectures are extracurricular.", "Can directly integrate industry certifications (AWS, Cisco, NPTEL) into the curriculum as credit courses."],
                      ["Internship Integration", "VTU mandates an internship in 7th/8th sem, but the weight in transcripts is low.", "Some autonomous colleges make internships a full-semester credit component, counted in CGPA."],
                    ].map(([aspect, vtu, auto], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="p-4 font-medium border-b align-top">{aspect}</td>
                        <td className="p-4 border-b border-l align-top text-blue-800 dark:text-blue-200">{vtu}</td>
                        <td className="p-4 border-b border-l align-top text-emerald-800 dark:text-emerald-200">{auto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Real-world example callout */}
              <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-1">Real-World Example</h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">When ChatGPT launched in late 2022, autonomous colleges like RVCE and PES had already added "Generative AI" electives by mid-2023. VTU affiliated colleges had to wait until the 2024 scheme revision — almost 2 years later — to see anything related in their official syllabus.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── EXAMS & GRADING TAB ── */}
          {activeTab === "exams" && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Scale className="h-5 w-5 text-violet-500" />
                Examinations, Evaluation & Backlogs
              </h3>

              <p className="text-muted-foreground">This is where the difference between VTU and Autonomous hits hardest. The exam system directly affects your GPA, stress levels, and graduation timeline.</p>

              {/* Comparison Table */}
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-4 font-semibold border-b w-1/4">Aspect</th>
                      <th className="text-left p-4 font-semibold border-b border-l w-[37.5%] text-blue-700 dark:text-blue-300">VTU Affiliated</th>
                      <th className="text-left p-4 font-semibold border-b border-l w-[37.5%] text-emerald-700 dark:text-emerald-300">Autonomous</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Who sets the paper?", "VTU question paper bank. The same paper is written by students across 200+ colleges on the same day.", "The college's own faculty. Questions can be tailored to what was actually taught in class."],
                      ["Evaluation", "External evaluation at VTU valuation camps. Your paper is checked by a random lecturer from another college who may have never taught your syllabus.", "Internal evaluation by your own college faculty, or a mix of internal + external. Much more aligned with what was actually taught."],
                      ["CIE (Internal Marks)", "Typically 40–50 marks out of 100 for internals (CIE). The rest is the VTU end-semester exam.", "Colleges can design their own CIE structure — quizzes, assignments, presentations, mini-projects. Often more diverse and less stressful."],
                      ["Result Declaration", "Notoriously delayed. 2–4 months is common. Sometimes 6+ months. This delays placements and higher studies applications.", "Usually within 2–4 weeks of the exam. Some colleges post results in under 10 days."],
                      ["Revaluation", "Costs ₹300–600 per subject. Takes 2–3 months. Mark changes are possible but it's a gamble.", "Faster and often cheaper. Some autonomous colleges allow re-checking within a week. Policies vary."],
                      ["Backlog Handling", "Failed? You rewrite the exact VTU paper in the next supplementary exam cycle. Limited chances per year.", "Policies vary but many autonomous colleges offer more frequent supplementary exams, and some allow make-up tests. CGPA recovery is easier."],
                      ["Grading System", "VTU uses a standardized CGPA system (10-point scale). Same calculation for all affiliated colleges.", "Autonomous colleges follow CBCS (Choice Based Credit System) under UGC guidelines. The grading may differ slightly, but the degree is still VTU."],
                    ].map(([aspect, vtu, auto], i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="p-4 font-medium border-b align-top">{aspect}</td>
                        <td className="p-4 border-b border-l align-top text-blue-800 dark:text-blue-200">{vtu}</td>
                        <td className="p-4 border-b border-l align-top text-emerald-800 dark:text-emerald-200">{auto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* The notorious VTU result delay callout */}
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">The VTU Result Delay Problem — Why It Actually Matters</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-2">Delayed VTU results have real consequences beyond just waiting. Companies visiting for campus placements may require a minimum CGPA — if your 5th-sem results aren't out when placements start in 7th semester, you may be <strong>ineligible to sit</strong> even if you scored well. Students applying for MS abroad need final transcripts on time, and VTU delays have cost students admission offers.</p>
                    <p className="text-sm text-red-700 dark:text-red-300">Autonomous colleges almost never face this issue, since they control their own result timelines.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── PLACEMENTS TAB ── */}
          {activeTab === "placements" && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-violet-500" />
                Placements, Higher Studies & Career Impact
              </h3>

              <div className="bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 rounded-lg p-5 mb-4">
                <p className="text-sm text-violet-800 dark:text-violet-200">
                  <strong>Honest truth:</strong> Recruiters don't care whether your college was Autonomous or VTU-affiliated. They care about the <strong>college brand</strong>, <strong>your CGPA</strong>, and <strong>your skills</strong>. But the Autonomy status indirectly affects all three.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Placement advantages */}
                <Card className="border-emerald-200 dark:border-emerald-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      How Autonomy Helps Placements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-300"><strong>Updated skills:</strong> Students learn current tools (Docker, React, TensorFlow) as part of the curriculum, not just on their own.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-300"><strong>Higher CGPAs:</strong> Internal evaluation tends to reward consistent effort. Average CGPAs at autonomous colleges are often 0.5–1.0 points higher than VTU averages.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-300"><strong>On-time results:</strong> Placement eligibility is never blocked by delayed results.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-emerald-700 dark:text-emerald-300"><strong>Industry-embedded coursework:</strong> Capstone projects designed with company mentors carry more weight on a resume.</span>
                    </div>
                  </CardContent>
                </Card>

                {/* VTU advantages */}
                <Card className="border-blue-200 dark:border-blue-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base text-blue-800 dark:text-blue-200 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      In Defense of VTU Affiliation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300"><strong>Standardized rigor:</strong> If your VTU CGPA is 8.5, it means something universal. Recruiters trust the consistency.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300"><strong>No grade inflation:</strong> VTU's tough evaluation means your grades were actually earned. Some companies value this.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300"><strong>Level playing field:</strong> A student from a tier-3 VTU college writes the same paper as a tier-1 VTU college, proving their capability objectively.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300"><strong>GATE & competitive exams:</strong> VTU's standardized syllabus aligns well with GATE syllabi, making exam prep slightly more straightforward.</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* MS/Higher Studies callout */}
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Planning for MS Abroad?</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Universities abroad evaluate your <strong>GPA, college reputation, and transcript</strong>. Both VTU affiliated and Autonomous degrees are accepted globally. However, Autonomous colleges typically issue <strong>Grade Sheets faster</strong> and sometimes include richer course descriptions, which helps in application narratives. VTU's delayed result cycle has genuinely caused students to miss application deadlines.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── VERDICT TAB ── */}
          {activeTab === "verdict" && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-violet-500" />
                The Honest Verdict
              </h3>

              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 border border-violet-200 dark:border-violet-800 rounded-lg p-6">
                <p className="text-lg leading-relaxed font-medium text-violet-900 dark:text-violet-100 mb-4">
                  "Should I prefer an Autonomous college over a VTU one?"
                </p>
                <p className="text-base leading-relaxed text-violet-800 dark:text-violet-200">
                  <strong>It depends on the specific college, not just the tag.</strong> An excellent VTU-affiliated college with great faculty (like BIT) will always beat a mediocre autonomous college. The autonomy status is just a tool — it's what the college <em>does</em> with that freedom that matters.
                </p>
              </div>

              {/* When Autonomous is clearly better */}
              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardHeader className="pb-2 bg-emerald-50 dark:bg-emerald-950/30">
                  <CardTitle className="text-base text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Choose Autonomous When...
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-2 text-sm">
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" /><span>You want a modern, frequently-updated syllabus with industry tools</span></div>
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" /><span>You plan to do campus placements and need timely results for eligibility</span></div>
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" /><span>You're targeting an MS abroad and need fast, clean transcripts</span></div>
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" /><span>You prefer flexible evaluation (assignments, projects, quizzes) over 1 high-stakes 3-hour exam</span></div>
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" /><span>The specific autonomous college has a strong placement record and good reputation (e.g., RVCE, PES, MSRIT)</span></div>
                </CardContent>
              </Card>

              {/* When VTU is fine or better */}
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2 bg-blue-50 dark:bg-blue-950/30">
                  <CardTitle className="text-base text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    VTU Affiliated is Perfectly Fine When...
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-2 text-sm">
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>The VTU college itself has a strong brand (e.g., BIT, SJBIT, RNSIT) — the college reputation matters more than the tag</span></div>
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>You are preparing for GATE/competitive exams — VTU's standardized syllabus aligns well with GATE topics</span></div>
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>You are a self-learner who doesn't depend heavily on the college syllabus for industry skills</span></div>
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>The VTU college offers significantly lower fees or better proximity to your home</span></div>
                  <div className="flex items-start gap-2"><ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" /><span>You want your grades to reflect raw exam performance without any "internal cushioning"</span></div>
                </CardContent>
              </Card>

              {/* Myth Busters */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-amber-500" />
                  Myth Busters
                </h3>
                {[
                  { myth: "Autonomous colleges give easy marks and inflate grades.", reality: "Some do, some don't. Top autonomous colleges like RVCE and PES are known to be equally or even more rigorous in their internal assessments. Autonomy means the college sets its own standard — it doesn't inherently mean 'easy'." },
                  { myth: "VTU degree from an affiliated college is worth more than from an autonomous one.", reality: "Both say 'VTU' on the degree. Recruiters differentiate by college name (RVCE, BMSCE, BIT), not by affiliation type. No HR filters resumes by 'Autonomous vs Affiliated'." },
                  { myth: "You can't write GATE if you're from an autonomous college.", reality: "Completely false. GATE eligibility requires a B.E./B.Tech degree from a recognized university. Both VTU affiliated and autonomous colleges award VTU degrees, which is fully recognized by IITs and IISc for GATE." },
                  { myth: "Autonomous colleges can teach whatever they want with no oversight.", reality: "UGC conducts periodic reviews. AICTE norms still apply. The college must follow CBCS guidelines. Autonomy is not lawlessness — it's structured freedom within regulatory boundaries." },
                ].map((item, i) => (
                  <Card key={i} className="border-amber-200 dark:border-amber-800">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3 mb-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 text-xs shrink-0 mt-0.5">MYTH</Badge>
                        <p className="font-medium text-sm">{item.myth}</p>
                      </div>
                      <div className="flex items-start gap-3 ml-0 mt-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs shrink-0 mt-0.5">FACT</Badge>
                        <p className="text-sm text-muted-foreground">{item.reality}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Final takeaway */}
              <div className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-950/50 dark:to-indigo-950/50 border-2 border-violet-300 dark:border-violet-700 rounded-xl p-6 text-center">
                <Award className="h-8 w-8 text-violet-600 dark:text-violet-400 mx-auto mb-3" />
                <p className="text-lg font-bold text-violet-900 dark:text-violet-100 mb-2">The Bottom Line</p>
                <p className="text-base text-violet-800 dark:text-violet-200 max-w-2xl mx-auto">
                  Don't choose a college <em>because</em> it's autonomous. Choose a college because it's <strong>good</strong> — and then be aware that its autonomous status might give you specific advantages in curriculum freshness, evaluation flexibility, and result timelines. The tag is a bonus, not the reason.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const InfoCentre = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Info Centre
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your comprehensive guide to understanding Karnataka's engineering education landscape
          </p>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-4 py-2">
            <Info className="h-4 w-4 mr-2" />
            Educational Resource Hub
          </Badge>
        </div>

        {/* Main Article Card */}
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl text-primary">
                  Why VTU Became the Source of Affiliation for Karnataka's Engineering Colleges
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Understanding the evolution of technical education in Karnataka
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Introduction</h2>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="text-lg leading-relaxed">
                  Karnataka is one of the largest hubs for technical education in India, with more than <strong className="text-primary">200 engineering colleges</strong> spread across the state. But if you look closely, you'll notice a common thread connecting almost all of them—the phrase <strong className="text-primary">"Affiliated to Visvesvaraya Technological University (VTU)."</strong>
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  This wasn't always the case. Until the late 1990s, engineering colleges in Karnataka were affiliated to multiple universities, which created confusion, inconsistency, and administrative challenges. To bring uniformity and strengthen the quality of engineering education, the Government of Karnataka established Visvesvaraya Technological University (VTU) in <strong className="text-primary">1998</strong>.
                </p>
              </div>
            </div>

            {/* The Situation Before VTU */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold">The Situation Before VTU</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">Multiple Universities</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Bangalore University</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Mysore University</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Mangalore University</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3">Problems Created</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Different curricula across universities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Inconsistent exam schedules</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Varying evaluation systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Difficulty in comparing graduates</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Why the Government Chose a Single Technological University */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold">Why the Government Chose a Single Technological University</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-green-200 bg-green-50 dark:bg-green-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg text-green-800 dark:text-green-200">Uniform Curriculum</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      VTU introduced a standardized syllabus across all affiliated colleges. This ensured that a B.E. or B.Tech degree from any part of Karnataka carried the same academic weight and covered the same knowledge areas.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg text-blue-800 dark:text-blue-200">Quality Assurance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      With the rapid growth of private engineering colleges, a single affiliating body was necessary to regulate standards, infrastructure requirements, and faculty qualifications.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-lg text-purple-800 dark:text-purple-200">Industry Relevance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Karnataka was emerging as India's IT hub in the 1990s. VTU made it easier to align curricula with industry demands by implementing syllabus revisions that applied uniformly across the state.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                      <CardTitle className="text-lg text-indigo-800 dark:text-indigo-200">Efficient Administration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Instead of multiple universities managing engineering courses differently, one specialized university could streamline examinations, results, and degree issuance.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-amber-600" />
                      <CardTitle className="text-lg text-amber-800 dark:text-amber-200">Brand Identity</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Establishing VTU created a recognizable identity for Karnataka's engineering graduates. Recruiters across India could trust the consistency of a "VTU degree."
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-200 bg-cyan-50 dark:bg-cyan-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-600" />
                      <CardTitle className="text-lg text-cyan-800 dark:text-cyan-200">Student Clarity</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-cyan-700 dark:text-cyan-300">
                      This also gave students and parents more clarity during admissions, as they could understand the unified system better.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Challenges of Centralization */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold">Challenges of Centralization</h2>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <p className="text-lg leading-relaxed mb-4">
                  While VTU solved the problem of inconsistency, it also introduced new challenges:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Examination Rigidities</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      VTU became infamous for its exam patterns, revaluation delays, and backlog culture.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Slow Reforms</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Updating the syllabus to match rapidly evolving technology sectors sometimes lagged behind industry needs.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Administrative Bottlenecks</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Centralization meant that if VTU delayed results, all colleges across the state were affected.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Over the Years */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold">Impact Over the Years</h2>
              </div>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <p className="text-lg leading-relaxed mb-4">
                  Despite its drawbacks, VTU has been instrumental in shaping technical education in Karnataka:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Scale of Operations</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          It oversees more than <strong>200 affiliated colleges</strong> with lakhs of engineering students.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Academic Growth</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          It has introduced postgraduate courses, research centers, and autonomous institutions under its supervision.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
                        <Lightbulb className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Autonomous Colleges</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Autonomous colleges affiliated to VTU now enjoy some academic freedom while still being under the overall framework, balancing flexibility with uniformity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Conclusion</h2>
              </div>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
                <p className="text-lg leading-relaxed">
                  VTU's establishment was not just an administrative decision but a <strong className="text-primary">structural reform</strong> in Karnataka's education system. By becoming the sole affiliating authority for engineering colleges, it brought order, consistency, and credibility to technical education. While criticisms of its functioning remain, the role of VTU as the <strong className="text-primary">backbone of engineering education in Karnataka</strong> is undeniable.
                </p>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">200+</div>
                  <div className="text-sm text-muted-foreground">Affiliated Colleges</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">1998</div>
                  <div className="text-sm text-muted-foreground">Year Established</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">Years of Operation</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">Lakhs</div>
                  <div className="text-sm text-muted-foreground">Students Enrolled</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* VTU vs Autonomous Comparison */}
        <VTUvsAutonomousSection />

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Additional Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">VTU Official Website</div>
                    <div className="text-sm text-muted-foreground">Visit vtu.ac.in for official information</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">KCET Official Portal</div>
                    <div className="text-sm text-muted-foreground">Check kea.kar.nic.in for latest updates</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InfoCentre

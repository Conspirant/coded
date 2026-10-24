import { Link } from "react-router-dom"
import { ArrowRight, BookOpen, BookOpenCheck, Calculator, FileText, FlaskConical, GraduationCap, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import rawPapers from "@/data/puc-papers.json"

const tools = [
  { 
    title: "Official Question Banks", 
    description: "State-prescribed 565+ page chapter-wise question banks for Physics, Chemistry, and Mathematics.", 
    href: "/puc/question-banks", 
    icon: BookOpenCheck,
    badge: "565+ Pages Live"
  },
  { 
    title: "PYQs with Schemes of Evaluation", 
    description: "Official KSEAB 2nd PUC 2026 & 2025 Physics, Chemistry & Mathematics Exam 1 & 2 Question Papers with official model answer keys.", 
    href: "/puc/pyq", 
    icon: FileText,
    badge: "2025-26 Solved"
  },
  { 
    title: "Question Papers Library", 
    description: `Browse & download ${rawPapers.length} official KSEAB Model Question Papers (MQPs) with in-browser preview.`, 
    href: "/puc/question-papers", 
    icon: FileText,
    badge: `${rawPapers.length} Papers Live`
  },
  { 
    title: "Official Blueprints & Weightage", 
    description: "Detailed unit & chapter-wise blueprint distributions, teaching hours, and official PDF downloads.", 
    href: "/puc/subjects", 
    icon: BookOpen,
    badge: "2026-27 Mapped"
  },
  { 
    title: "Practical Scheme of Evaluation", 
    description: "Complete 30-mark lab rubrics, experiment breakdown, recommended salts, and evaluation rules.", 
    href: "/puc/practicals", 
    icon: FlaskConical,
    badge: "30 Marks Rubric"
  },
  { 
    title: "PUC & KCET Marks Calculator", 
    description: "Calculate your board aggregate and project your 50% KCET PCM weightage in real-time.", 
    href: "/puc/marks-calculator", 
    icon: Calculator,
    badge: "50% Normalizer"
  },
]

export default function PucHub() {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto px-2 sm:px-4 md:px-0">
      <div className="max-w-2xl space-y-1.5 sm:space-y-2">
        <Badge variant="outline" className="text-primary border-primary/30 text-[11px] px-2 py-0.5">KSEAB · 2nd PUC</Badge>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Your 2nd PUC Study Space</h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          A dedicated home for official KSEAB model papers, blueprints, marks calculation, and seamless KCET rank linkage.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/[0.04]">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex gap-2.5 sm:gap-3 items-start">
            <GraduationCap className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-xs sm:text-sm">Official Model Papers Archive Available</p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 leading-relaxed">
                {rawPapers.length} official KSEAB papers indexed across 6 cycles (including 2026–27, 2025–26, and 2024).
              </p>
            </div>
          </div>
          <Link to="/puc/question-papers" className="text-xs font-semibold text-primary inline-flex items-center gap-1 shrink-0 self-start sm:self-auto min-h-[36px] items-center px-2 py-1 rounded-md hover:bg-primary/10">
            Browse Papers <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
        {tools.map(({ title, description, href, icon: Icon, badge }) => (
          <Link key={href} to={href} className="block active:scale-[0.99] transition-transform">
            <Card className="h-full hover:border-primary/40 transition-colors flex flex-col justify-between">
              <CardHeader className="p-3.5 sm:p-4 pb-1.5 sm:pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <CardTitle className="text-xs sm:text-sm font-semibold truncate">{title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-mono shrink-0 px-1.5 py-0.5">{badge}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3.5 sm:p-4 pt-0">
                <p className="text-[11px] sm:text-xs leading-relaxed text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <p className="text-[10px] sm:text-[11px] text-muted-foreground border-t border-border pt-3 sm:pt-4 leading-relaxed">
        Official KSEAB Karnataka School Examination and Assessment Board papers and resources. All exam schedules and notices should be cross-verified on the official portal.
      </p>
    </div>
  )
}

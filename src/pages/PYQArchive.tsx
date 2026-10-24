import { useState, useMemo } from "react"
import { SEO } from "@/components/SEO"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Download,
  BookOpen,
  CheckCircle2,
  Search,
  ExternalLink,
  Sparkles,
  Atom,
  FlaskConical,
  Calculator,
  Eye,
  Calendar,
  Layers,
  HelpCircle,
  FileCheck
} from "lucide-react"
import { PdfViewerModal } from "@/components/PdfViewerModal"
import { downloadFile } from "@/lib/download-helper"

interface PYQDocument {
  id: string
  subject: "Physics" | "Chemistry" | "Mathematics"
  subjectCode: string
  examNumber: 1 | 2
  examLabel: string
  type: "qp" | "scheme"
  title: string
  description: string
  fileName: string
  filePath: string
  fileSize: string
  pageCount: number
  year: number
  dateConducted: string
  color: string
}

const PYQ_DOCUMENTS: PYQDocument[] = [
  // ==========================================
  // 2026 PAPERS & SCHEMES (12 Files)
  // ==========================================
  // Physics 2026
  {
    id: "phy-2026-ex1-qp",
    subject: "Physics",
    subjectCode: "33",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "qp",
    title: "Physics Exam 1 (2026) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2026 Examination-1 question paper with Kannada & English translations.",
    fileName: "Physics_2026_Exam1_QuestionPaper.pdf",
    filePath: "/pyq/2026/Physics_2026_Exam1_QuestionPaper.pdf",
    fileSize: "182 KB",
    pageCount: 20,
    year: 2026,
    dateConducted: "March 2026",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500"
  },
  {
    id: "phy-2026-ex1-scheme",
    subject: "Physics",
    subjectCode: "33",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "scheme",
    title: "Physics Exam 1 (2026) - Scheme of Evaluation & Answers",
    description: "Official KSEAB step-by-step marking scheme, key answers, formulas and derivations for Exam 1.",
    fileName: "Physics_2026_Exam1_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2026/Physics_2026_Exam1_SchemeOfEvaluation_Answers.pdf",
    fileSize: "596 KB",
    pageCount: 12,
    year: 2026,
    dateConducted: "March 2026",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },
  {
    id: "phy-2026-ex2-qp",
    subject: "Physics",
    subjectCode: "33",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "qp",
    title: "Physics Exam 2 (2026) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2026 Examination-2 question paper with all parts and numericals.",
    fileName: "Physics_2026_Exam2_QuestionPaper.pdf",
    filePath: "/pyq/2026/Physics_2026_Exam2_QuestionPaper.pdf",
    fileSize: "705 KB",
    pageCount: 16,
    year: 2026,
    dateConducted: "April/May 2026",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500"
  },
  {
    id: "phy-2026-ex2-scheme",
    subject: "Physics",
    subjectCode: "33",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "scheme",
    title: "Physics Exam 2 (2026) - Scheme of Evaluation & Answers",
    description: "Official KSEAB step-by-step marking scheme and final solutions for Examination-2.",
    fileName: "Physics_2026_Exam2_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2026/Physics_2026_Exam2_SchemeOfEvaluation_Answers.pdf",
    fileSize: "949 KB",
    pageCount: 10,
    year: 2026,
    dateConducted: "April/May 2026",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },

  // Chemistry 2026
  {
    id: "chem-2026-ex1-qp",
    subject: "Chemistry",
    subjectCode: "34",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "qp",
    title: "Chemistry Exam 1 (2026) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2026 Examination-1 question paper covering Physical, Inorganic & Organic modules.",
    fileName: "Chemistry_2026_Exam1_QuestionPaper.pdf",
    filePath: "/pyq/2026/Chemistry_2026_Exam1_QuestionPaper.pdf",
    fileSize: "226 KB",
    pageCount: 20,
    year: 2026,
    dateConducted: "March 2026",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-500"
  },
  {
    id: "chem-2026-ex1-scheme",
    subject: "Chemistry",
    subjectCode: "34",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "scheme",
    title: "Chemistry Exam 1 (2026) - Scheme of Evaluation & Answers",
    description: "Official board answers, mechanism steps, reactions, balanced equations and step-wise mark splits.",
    fileName: "Chemistry_2026_Exam1_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2026/Chemistry_2026_Exam1_SchemeOfEvaluation_Answers.pdf",
    fileSize: "847 KB",
    pageCount: 12,
    year: 2026,
    dateConducted: "March 2026",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },
  {
    id: "chem-2026-ex2-qp",
    subject: "Chemistry",
    subjectCode: "34",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "qp",
    title: "Chemistry Exam 2 (2026) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2026 Examination-2 question paper with all sections and choices.",
    fileName: "Chemistry_2026_Exam2_QuestionPaper.pdf",
    filePath: "/pyq/2026/Chemistry_2026_Exam2_QuestionPaper.pdf",
    fileSize: "634 KB",
    pageCount: 16,
    year: 2026,
    dateConducted: "April/May 2026",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-500"
  },
  {
    id: "chem-2026-ex2-scheme",
    subject: "Chemistry",
    subjectCode: "34",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "scheme",
    title: "Chemistry Exam 2 (2026) - Scheme of Evaluation & Answers",
    description: "Official board evaluation scheme, reactions, reasoning and complete solutions for Exam 2.",
    fileName: "Chemistry_2026_Exam2_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2026/Chemistry_2026_Exam2_SchemeOfEvaluation_Answers.pdf",
    fileSize: "827 KB",
    pageCount: 11,
    year: 2026,
    dateConducted: "April/May 2026",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },

  // Mathematics 2026
  {
    id: "math-2026-ex1-qp",
    subject: "Mathematics",
    subjectCode: "35",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "qp",
    title: "Mathematics Exam 1 (2026) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2026 Examination-1 question paper (Parts A, B, C, D & E).",
    fileName: "Mathematics_2026_Exam1_QuestionPaper.pdf",
    filePath: "/pyq/2026/Mathematics_2026_Exam1_QuestionPaper.pdf",
    fileSize: "420 KB",
    pageCount: 21,
    year: 2026,
    dateConducted: "March 2026",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500"
  },
  {
    id: "math-2026-ex1-scheme",
    subject: "Mathematics",
    subjectCode: "35",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "scheme",
    title: "Mathematics Exam 1 (2026) - Scheme of Evaluation & Answers",
    description: "Official model answers and detailed step-by-step calculus, vectors, matrices & probability solutions.",
    fileName: "Mathematics_2026_Exam1_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2026/Mathematics_2026_Exam1_SchemeOfEvaluation_Answers.pdf",
    fileSize: "937 KB",
    pageCount: 9,
    year: 2026,
    dateConducted: "March 2026",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },
  {
    id: "math-2026-ex2-qp",
    subject: "Mathematics",
    subjectCode: "35",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "qp",
    title: "Mathematics Exam 2 (2026) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2026 Examination-2 question paper with all parts and alternative problems.",
    fileName: "Mathematics_2026_Exam2_QuestionPaper.pdf",
    filePath: "/pyq/2026/Mathematics_2026_Exam2_QuestionPaper.pdf",
    fileSize: "841 KB",
    pageCount: 16,
    year: 2026,
    dateConducted: "April/May 2026",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500"
  },
  {
    id: "math-2026-ex2-scheme",
    subject: "Mathematics",
    subjectCode: "35",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "scheme",
    title: "Mathematics Exam 2 (2026) - Scheme of Evaluation & Answers",
    description: "Official KSEAB model answers, marking guidelines and step marks for Examination-2.",
    fileName: "Mathematics_2026_Exam2_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2026/Mathematics_2026_Exam2_SchemeOfEvaluation_Answers.pdf",
    fileSize: "1.13 MB",
    pageCount: 8,
    year: 2026,
    dateConducted: "April/May 2026",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },

  // ==========================================
  // 2025 PAPERS & SCHEMES (12 Files)
  // ==========================================
  // Physics 2025
  {
    id: "phy-2025-ex1-qp",
    subject: "Physics",
    subjectCode: "33",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "qp",
    title: "Physics Exam 1 (2025) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2025 Examination-1 question paper (Subject Code 33 NS) in Kannada & English.",
    fileName: "Physics_2025_Exam1_QuestionPaper.pdf",
    filePath: "/pyq/2025/Physics_2025_Exam1_QuestionPaper.pdf",
    fileSize: "234 KB",
    pageCount: 20,
    year: 2025,
    dateConducted: "March 2025",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500"
  },
  {
    id: "phy-2025-ex1-scheme",
    subject: "Physics",
    subjectCode: "33",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "scheme",
    title: "Physics Exam 1 (2025) - Scheme of Evaluation & Answers",
    description: "Official KSEAB step-by-step model answers and scheme of evaluation for Exam-1 March 2025.",
    fileName: "Physics_2025_Exam1_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2025/Physics_2025_Exam1_SchemeOfEvaluation_Answers.pdf",
    fileSize: "719 KB",
    pageCount: 11,
    year: 2025,
    dateConducted: "March 2025",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },
  {
    id: "phy-2025-ex2-qp",
    subject: "Physics",
    subjectCode: "33",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "qp",
    title: "Physics Exam 2 (2025) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2025 Examination-2 question paper (April/May 2025 cycle).",
    fileName: "Physics_2025_Exam2_QuestionPaper.pdf",
    filePath: "/pyq/2025/Physics_2025_Exam2_QuestionPaper.pdf",
    fileSize: "773 KB",
    pageCount: 16,
    year: 2025,
    dateConducted: "April/May 2025",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500"
  },
  {
    id: "phy-2025-ex2-scheme",
    subject: "Physics",
    subjectCode: "33",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "scheme",
    title: "Physics Exam 2 (2025) - Scheme of Evaluation & Answers",
    description: "Official board key answers, numerical values, and mark allotments for 2025 Exam-2.",
    fileName: "Physics_2025_Exam2_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2025/Physics_2025_Exam2_SchemeOfEvaluation_Answers.pdf",
    fileSize: "579 KB",
    pageCount: 9,
    year: 2025,
    dateConducted: "April/May 2025",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },

  // Chemistry 2025
  {
    id: "chem-2025-ex1-qp",
    subject: "Chemistry",
    subjectCode: "34",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "qp",
    title: "Chemistry Exam 1 (2025) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2025 Examination-1 question paper (Subject Code 34 NS).",
    fileName: "Chemistry_2025_Exam1_QuestionPaper.pdf",
    filePath: "/pyq/2025/Chemistry_2025_Exam1_QuestionPaper.pdf",
    fileSize: "211 KB",
    pageCount: 20,
    year: 2025,
    dateConducted: "March 2025",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-500"
  },
  {
    id: "chem-2025-ex1-scheme",
    subject: "Chemistry",
    subjectCode: "34",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "scheme",
    title: "Chemistry Exam 1 (2025) - Scheme of Evaluation & Answers",
    description: "Official KSEAB 2025 Exam-1 key answers, chemical equations, IUPAC names and mark schemes.",
    fileName: "Chemistry_2025_Exam1_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2025/Chemistry_2025_Exam1_SchemeOfEvaluation_Answers.pdf",
    fileSize: "733 KB",
    pageCount: 11,
    year: 2025,
    dateConducted: "March 2025",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },
  {
    id: "chem-2025-ex2-qp",
    subject: "Chemistry",
    subjectCode: "34",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "qp",
    title: "Chemistry Exam 2 (2025) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2025 Examination-2 question paper (April/May 2025 cycle).",
    fileName: "Chemistry_2025_Exam2_QuestionPaper.pdf",
    filePath: "/pyq/2025/Chemistry_2025_Exam2_QuestionPaper.pdf",
    fileSize: "723 KB",
    pageCount: 16,
    year: 2025,
    dateConducted: "April/May 2025",
    color: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-500"
  },
  {
    id: "chem-2025-ex2-scheme",
    subject: "Chemistry",
    subjectCode: "34",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "scheme",
    title: "Chemistry Exam 2 (2025) - Scheme of Evaluation & Answers",
    description: "Official KSEAB model answers and evaluation rubrics for 2025 Exam-2 Chemistry.",
    fileName: "Chemistry_2025_Exam2_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2025/Chemistry_2025_Exam2_SchemeOfEvaluation_Answers.pdf",
    fileSize: "244 KB",
    pageCount: 12,
    year: 2025,
    dateConducted: "April/May 2025",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },

  // Mathematics 2025
  {
    id: "math-2025-ex1-qp",
    subject: "Mathematics",
    subjectCode: "35",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "qp",
    title: "Mathematics Exam 1 (2025) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2025 Examination-1 question paper (Subject Code 35 NS).",
    fileName: "Mathematics_2025_Exam1_QuestionPaper.pdf",
    filePath: "/pyq/2025/Mathematics_2025_Exam1_QuestionPaper.pdf",
    fileSize: "229 KB",
    pageCount: 20,
    year: 2025,
    dateConducted: "March 2025",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500"
  },
  {
    id: "math-2025-ex1-scheme",
    subject: "Mathematics",
    subjectCode: "35",
    examNumber: 1,
    examLabel: "Exam 1 (Annual)",
    type: "scheme",
    title: "Mathematics Exam 1 (2025) - Scheme of Evaluation & Answers",
    description: "Official KSEAB model answers and step-wise proofs and solutions for Exam-1 March 2025.",
    fileName: "Mathematics_2025_Exam1_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2025/Mathematics_2025_Exam1_SchemeOfEvaluation_Answers.pdf",
    fileSize: "517 KB",
    pageCount: 8,
    year: 2025,
    dateConducted: "March 2025",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  },
  {
    id: "math-2025-ex2-qp",
    subject: "Mathematics",
    subjectCode: "35",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "qp",
    title: "Mathematics Exam 2 (2025) - Official Question Paper",
    description: "Official KSEAB 2nd PUC 2025 Examination-2 question paper (April/May 2025 cycle).",
    fileName: "Mathematics_2025_Exam2_QuestionPaper.pdf",
    filePath: "/pyq/2025/Mathematics_2025_Exam2_QuestionPaper.pdf",
    fileSize: "848 KB",
    pageCount: 16,
    year: 2025,
    dateConducted: "April/May 2025",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500"
  },
  {
    id: "math-2025-ex2-scheme",
    subject: "Mathematics",
    subjectCode: "35",
    examNumber: 2,
    examLabel: "Exam 2 (Improvement/Supply)",
    type: "scheme",
    title: "Mathematics Exam 2 (2025) - Scheme of Evaluation & Answers",
    description: "Official KSEAB model answers, step markings and solutions for 2025 Examination-2.",
    fileName: "Mathematics_2025_Exam2_SchemeOfEvaluation_Answers.pdf",
    filePath: "/pyq/2025/Mathematics_2025_Exam2_SchemeOfEvaluation_Answers.pdf",
    fileSize: "399 KB",
    pageCount: 6,
    year: 2025,
    dateConducted: "April/May 2025",
    color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-500"
  }
]

export default function PYQArchive() {
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedSubject, setSelectedSubject] = useState<string>("all")
  const [selectedExam, setSelectedExam] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [previewDoc, setPreviewDoc] = useState<PYQDocument | null>(null)

  const filteredDocs = useMemo(() => {
    return PYQ_DOCUMENTS.filter(doc => {
      const matchYear = selectedYear === "all" || doc.year.toString() === selectedYear
      const matchSubject = selectedSubject === "all" || doc.subject.toLowerCase() === selectedSubject.toLowerCase()
      const matchExam = selectedExam === "all" || doc.examNumber.toString() === selectedExam
      const matchType = selectedType === "all" || doc.type === selectedType
      const matchSearch = searchQuery.trim() === "" ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.year.toString().includes(searchQuery)

      return matchYear && matchSubject && matchExam && matchType && matchSearch
    })
  }, [selectedYear, selectedSubject, selectedExam, selectedType, searchQuery])

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "Physics":
        return <Atom className="h-4 w-4 text-cyan-500" />
      case "Chemistry":
        return <FlaskConical className="h-4 w-4 text-purple-500" />
      case "Mathematics":
        return <Calculator className="h-4 w-4 text-amber-500" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in p-4 sm:p-6 pb-20">
      <SEO
        title="2nd PUC 2026 & 2025 Official Question Papers & Key Answers (PCM Exam 1 & 2)"
        description="Download official KSEAB 2nd PUC 2026 and 2025 Physics, Chemistry, and Mathematics Question Papers and step-by-step Schemes of Evaluation / Answer Keys for Exam 1 & Exam 2."
        url="https://kcetcoded.dev/puc/pyq"
        keywords="2nd PUC 2026 question paper with answers, 2nd PUC 2025 physics question paper, chemistry scheme of evaluation 2025 2026, 2nd puc mathematics key answers exam 1 exam 2, kseab official model answers"
      />

      {/* Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-card via-card/90 to-primary/5 p-6 sm:p-8 border border-border shadow-xs overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs border-primary/40 text-primary bg-primary/10 px-2.5 py-0.5">
              OFFICIAL KSEAB 2ND PUC ARCHIVE
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              2026 & 2025 BATCHES
            </Badge>
            <Badge variant="outline" className="font-mono text-xs text-emerald-500 border-emerald-500/30 bg-emerald-500/10">
              SOLVED SCHEMES INCLUDED
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            2nd PUC Official Question Papers & Schemes of Evaluation
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Direct access to official KSEAB board question papers alongside official Schemes of Evaluation (step-wise marking keys, formula points, and complete answers) for Physics, Chemistry, and Mathematics across 2026 and 2025 (Exam 1 & Exam 2).
          </p>
        </div>
      </div>

      {/* Quick Statistics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border border-border/70 bg-card/60 p-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <Atom className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Physics (33)</div>
              <div className="text-sm font-bold font-mono">2026 & 2025 (8 Files)</div>
            </div>
          </div>
        </Card>
        <Card className="border border-border/70 bg-card/60 p-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <FlaskConical className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Chemistry (34)</div>
              <div className="text-sm font-bold font-mono">2026 & 2025 (8 Files)</div>
            </div>
          </div>
        </Card>
        <Card className="border border-border/70 bg-card/60 p-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Mathematics (35)</div>
              <div className="text-sm font-bold font-mono">2026 & 2025 (8 Files)</div>
            </div>
          </div>
        </Card>
        <Card className="border border-border/70 bg-card/60 p-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Verified PDFs</div>
              <div className="text-sm font-bold font-mono text-emerald-500">24 Documents</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search Bar */}
      <Card className="border border-border bg-card shadow-xs">
        <CardContent className="p-4 space-y-3.5">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subject, exam, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Year Filter */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground px-2">Year:</span>
                {[
                  { label: "All Years", val: "all" },
                  { label: "2026", val: "2026" },
                  { label: "2025", val: "2025" }
                ].map((yr) => (
                  <button
                    key={yr.val}
                    onClick={() => setSelectedYear(yr.val)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                      selectedYear === yr.val
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {yr.label}
                  </button>
                ))}
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground px-2">Subject:</span>
                {["all", "Physics", "Chemistry", "Mathematics"].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                      selectedSubject === sub
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sub === "all" ? "All PCM" : sub}
                  </button>
                ))}
              </div>

              {/* Exam Number Filter */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground px-2">Exam:</span>
                {[
                  { label: "All", val: "all" },
                  { label: "Exam 1", val: "1" },
                  { label: "Exam 2", val: "2" }
                ].map((ex) => (
                  <button
                    key={ex.val}
                    onClick={() => setSelectedExam(ex.val)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                      selectedExam === ex.val
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border text-xs">
                <span className="text-[11px] font-semibold text-muted-foreground px-2">Type:</span>
                {[
                  { label: "All", val: "all" },
                  { label: "Papers", val: "qp" },
                  { label: "Answers", val: "scheme" }
                ].map((t) => (
                  <button
                    key={t.val}
                    onClick={() => setSelectedType(t.val)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors font-medium ${
                      selectedType === t.val
                        ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grouped View by Subject */}
      {["Physics", "Chemistry", "Mathematics"].map((subjectName) => {
        const subjectDocs = filteredDocs.filter(d => d.subject === subjectName)
        if (subjectDocs.length === 0) return null

        return (
          <div key={subjectName} className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <div className="flex items-center gap-2">
                {getSubjectIcon(subjectName)}
                <h2 className="text-lg font-bold tracking-tight text-foreground">
                  {subjectName} (Code: {subjectDocs[0]?.subjectCode})
                </h2>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {subjectDocs.length} {subjectDocs.length === 1 ? "File" : "Files"}
              </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {subjectDocs.map((doc) => (
                <Card
                  key={doc.id}
                  className="flex flex-col justify-between border border-border hover:border-primary/50 transition-all bg-card/70 hover:shadow-xs rounded-xl overflow-hidden"
                >
                  <CardHeader className="pb-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="font-mono text-[10px] font-semibold"
                        >
                          {doc.year} • {doc.examLabel}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`font-mono text-[10px] ${
                            doc.type === "scheme"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                              : "bg-blue-500/10 text-blue-500 border-blue-500/30"
                          }`}
                        >
                          {doc.type === "scheme" ? "MODEL ANSWERS / SCHEME" : "QUESTION PAPER"}
                        </Badge>
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                        {doc.fileSize}
                      </span>
                    </div>

                    <CardTitle className="text-base font-bold text-foreground leading-snug">
                      {doc.title}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {doc.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/50 pt-2 font-mono">
                      <span>Pages: {doc.pageCount}</span>
                      <span>Conducted: {doc.dateConducted}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs h-8 flex items-center justify-center gap-1.5 cursor-pointer"
                        onClick={() => setPreviewDoc(doc)}
                      >
                        <Eye className="h-3.5 w-3.5" /> View PDF
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 text-xs h-8 flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer"
                        onClick={() => downloadFile(doc.filePath, doc.fileName)}
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {/* Zero State */}
      {filteredDocs.length === 0 && (
        <Card className="border border-border p-12 text-center space-y-3">
          <HelpCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-semibold">No question papers found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try resetting your search query or switching the year, subject, and exam filters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedYear("all")
              setSelectedSubject("all")
              setSelectedExam("all")
              setSelectedType("all")
              setSearchQuery("")
            }}
          >
            Reset All Filters
          </Button>
        </Card>
      )}

      {/* Info Callout */}
      <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2 text-xs text-muted-foreground">
        <div className="font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          About KSEAB 3-Exam System (2025 & 2026)
        </div>
        <p className="leading-relaxed">
          Starting from the 2023-24 / 2024-25 academic year, Karnataka School Examination and Assessment Board (KSEAB) introduced the 3-exam policy. Students can retain the best score among their attempts. Practicing both 2025 and 2026 Examination-1 and Examination-2 papers with their official evaluation schemes provides the ultimate blueprint for board exam scoring and KCET PCM preparation.
        </p>
      </div>

      {/* PDF In-App Preview Modal */}
      <PdfViewerModal
        open={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        url={previewDoc?.filePath || ""}
        title={previewDoc?.title || ""}
        fileName={previewDoc?.fileName}
        subtitle={`${previewDoc?.subject || ""} • ${previewDoc?.examLabel || ""} • ${previewDoc?.year || ""}`}
        fileSize={previewDoc?.fileSize}
        badgeText={previewDoc?.subject}
        totalPages={previewDoc?.pageCount}
      />
    </div>
  )
}

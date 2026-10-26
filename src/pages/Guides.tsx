import React, { useState, useMemo } from "react"
import { SEO } from "@/components/SEO"
import {
  BookOpen,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Search,
  Sparkles,
  Atom,
  FlaskConical,
  CheckCircle2,
  Share2,
  BookMarked,
  ShieldAlert,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PdfViewerModal } from "@/components/PdfViewerModal"
import { toast } from "sonner"
import { Link } from "react-router-dom"

export interface GuideMaterial {
  id: string
  title: string
  subject: "Physics" | "Chemistry"
  publication: string
  driveUrl: string
  previewUrl: string
  downloadUrl: string
  description: string
  category: string
  features: string[]
  recommendedFor: string
  icon: typeof Atom
  gradient: string
  accentColor: string
}

export const GUIDES_DATA: GuideMaterial[] = [
  {
    id: "jeevith-physics",
    title: "Jeevith Publications Physics Material",
    subject: "Physics",
    publication: "Jeevith Publications",
    driveUrl: "https://drive.google.com/file/d/1yC5G9DP1RTbmFCELan1O-5TwCh2S0dbN/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/1yC5G9DP1RTbmFCELan1O-5TwCh2S0dbN/preview",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1yC5G9DP1RTbmFCELan1O-5TwCh2S0dbN",
    description: "Comprehensive 2nd PUC & KCET Physics companion with detailed chapter-wise theory, formula derivations, solved board numericals, and revision notes.",
    category: "Full Course Study Material",
    features: [
      "Complete 2nd PUC & KCET syllabus coverage",
      "Chapter-wise key formulas & derivations simplified",
      "Step-by-step solved numericals & previous year questions",
      "Diagrams and concept summaries for quick last-minute recall"
    ],
    recommendedFor: "KSEAB 2nd PUC Board Exam & KCET Physics Aspirants",
    icon: Atom,
    gradient: "from-blue-600/15 via-cyan-500/10 to-indigo-600/5",
    accentColor: "text-blue-500 border-blue-500/30 bg-blue-500/10"
  },
  {
    id: "jeevith-chemistry",
    title: "Jeevith Publications Chemistry Material",
    subject: "Chemistry",
    publication: "Jeevith Publications",
    driveUrl: "https://drive.google.com/file/d/1oa8nNBaRuYSTykM5q2K7zEcj5OpdIdgS/view?usp=sharing",
    previewUrl: "https://drive.google.com/file/d/1oa8nNBaRuYSTykM5q2K7zEcj5OpdIdgS/preview",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1oa8nNBaRuYSTykM5q2K7zEcj5OpdIdgS",
    description: "Handcrafted master notes covering Physical, Inorganic, and Organic Chemistry with all named reactions, mechanisms, structures, and practice questions.",
    category: "Full Course Study Material",
    features: [
      "Physical Chemistry formulas and numerical problem patterns",
      "Inorganic Chemistry trends, reasoning questions & preparation schemes",
      "Organic Chemistry named reactions, mechanisms & conversion charts",
      "High-yield board exam questions & KCET conceptual clarity"
    ],
    recommendedFor: "KSEAB 2nd PUC Board Exam & KCET Chemistry Aspirants",
    icon: FlaskConical,
    gradient: "from-emerald-600/15 via-teal-500/10 to-cyan-600/5",
    accentColor: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
  }
]

export default function Guides() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [previewItem, setPreviewItem] = useState<GuideMaterial | null>(null)

  const filteredGuides = useMemo(() => {
    return GUIDES_DATA.filter(guide => {
      const matchesTab = activeTab === "all" || guide.subject.toLowerCase() === activeTab.toLowerCase()
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.publication.toLowerCase().includes(q) ||
        guide.subject.toLowerCase().includes(q) ||
        guide.description.toLowerCase().includes(q)
      return matchesTab && matchesSearch
    })
  }, [activeTab, searchQuery])

  const copyShareLink = (guide: GuideMaterial) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(guide.driveUrl)
      toast.success("Drive link copied to clipboard!")
    } else {
      window.open(guide.driveUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-3 sm:px-4 md:px-0 py-2 sm:py-4 animate-fade-in">
      <SEO
        title="Jeevith Publications Physics & Chemistry Guides – 2nd PUC & KCET"
        description="Access and download Jeevith Publications Physics and Chemistry study materials and revision guides for Karnataka 2nd PUC and KCET preparation."
        url="https://kcetcoded.dev/guides"
        keywords="Jeevith publications physics material, Jeevith publications chemistry material, 2nd PUC guides, KCET physics guide, KCET chemistry guide, KSEAB study material"
      />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-secondary/40 to-background p-4 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Curated Study Guides & Notes</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Study Guides & Reference Materials
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            Essential reference materials and publication notes for 2nd PUC Board Exams and KCET.
            Featuring comprehensive <span className="font-semibold text-foreground">Jeevith Publications</span> Physics and Chemistry materials with instant preview and download.
          </p>
        </div>
      </div>

      {/* Controls: Search & Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search guides, subjects, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-xs sm:text-sm bg-muted/30 focus-visible:ring-primary"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid grid-cols-3 w-full sm:w-auto h-10">
            <TabsTrigger value="all" className="text-xs">All Guides</TabsTrigger>
            <TabsTrigger value="physics" className="text-xs">Physics</TabsTrigger>
            <TabsTrigger value="chemistry" className="text-xs">Chemistry</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredGuides.map((guide) => {
          const Icon = guide.icon
          return (
            <Card
              key={guide.id}
              className={`flex flex-col justify-between overflow-hidden border border-border/70 hover:border-primary/40 transition-all duration-200 hover:shadow-md bg-gradient-to-b ${guide.gradient}`}
            >
              <CardHeader className="p-4 sm:p-6 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-background/80 border border-border/60 shadow-sm shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 ${guide.accentColor}`}>
                        {guide.subject} · {guide.publication}
                      </Badge>
                      <CardTitle className="text-lg sm:text-xl font-bold mt-1 text-foreground leading-snug">
                        {guide.title}
                      </CardTitle>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-2.5 leading-relaxed">
                  {guide.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Key Highlights:
                  </div>
                  <ul className="space-y-1.5 text-xs text-foreground/90">
                    {guide.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="rounded-lg bg-background/60 border border-border/50 p-2.5 text-[11px] text-muted-foreground">
                    <span className="font-semibold text-foreground">Recommended for: </span>
                    {guide.recommendedFor}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border/50 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full text-xs gap-1.5 cursor-pointer shadow-sm"
                      onClick={() => setPreviewItem(guide)}
                    >
                      <Eye className="h-3.5 w-3.5" /> Preview Material
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs gap-1.5 cursor-pointer bg-background hover:bg-muted"
                      asChild
                    >
                      <a href={guide.driveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3.5 w-3.5" /> Open in Drive
                      </a>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
                      asChild
                    >
                      <a href={guide.downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3.5 w-3.5" /> Direct Download
                      </a>
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground"
                      onClick={() => copyShareLink(guide)}
                    >
                      <Share2 className="h-3.5 w-3.5" /> Share Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredGuides.length === 0 && (
        <div className="p-8 text-center border border-dashed rounded-xl bg-muted/20">
          <BookMarked className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-foreground">No guides matching your query</p>
          <p className="text-xs text-muted-foreground mt-1">Try clearing your search term or selecting another filter tab.</p>
        </div>
      )}

      {/* Additional Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
        <Link to="/puc/question-banks" className="group">
          <Card className="h-full hover:border-primary/40 transition-colors bg-muted/30">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold group-hover:text-primary transition-colors">Official KSEAB Question Banks</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">565+ page state-prescribed chapter banks</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/puc/pyq" className="group">
          <Card className="h-full hover:border-primary/40 transition-colors bg-muted/30">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold group-hover:text-primary transition-colors">2nd PUC Solved PYQs</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">Annual exams with official schemes of evaluation</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/materials" className="group sm:col-span-2 md:col-span-1">
          <Card className="h-full hover:border-primary/40 transition-colors bg-muted/30">
            <CardContent className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold group-hover:text-primary transition-colors">KCET Cutoffs & Materials</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">Official cutoffs and formula sheets</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Educational Notice */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 sm:p-4 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Educational Disclaimer: </span>
          These study materials and guides are shared strictly for educational and self-study purposes to assist 2nd PUC and KCET students. All copyrights and intellectual property belong to their respective authors and publishers (Jeevith Publications).
        </div>
      </div>

      {/* In-browser Drive / PDF Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in">
          <div className="relative w-full max-w-5xl h-[88vh] sm:h-[90vh] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2 min-w-0">
                <Badge variant="outline" className="text-[10px] shrink-0 font-mono">
                  {previewItem.subject}
                </Badge>
                <h3 className="font-semibold text-xs sm:text-sm truncate text-foreground">
                  {previewItem.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2 gap-1"
                  asChild
                >
                  <a href={previewItem.driveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3" />
                    <span className="hidden sm:inline">Drive View</span>
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 text-xs px-2 gap-1"
                  asChild
                >
                  <a href={previewItem.downloadUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-3 w-3" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => setPreviewItem(null)}
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="flex-1 w-full bg-muted/20 relative">
              <iframe
                src={previewItem.previewUrl}
                title={previewItem.title}
                className="w-full h-full border-none"
                allow="autoplay"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

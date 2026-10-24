import React, { useMemo, useState } from "react"
import { BookOpen, CalendarDays, CheckCircle2, Download, ExternalLink, Eye, FileText, Filter, Plus, RotateCcw, Search, Sparkles, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { PdfViewerModal } from "@/components/PdfViewerModal"
import { downloadFile } from "@/lib/download-helper"
import rawPapers from "@/data/puc-papers.json"

export interface PucPaper {
  id: string
  title: string
  fileName: string
  url: string
  subject: string
  yearBatch: string
  sizeKb: number
  type: string
}

const subjectsList = [
  { name: "All Subjects", count: rawPapers.length },
  { name: "Physics", count: rawPapers.filter(p => p.subject === "Physics").length },
  { name: "Chemistry", count: rawPapers.filter(p => p.subject === "Chemistry").length },
  { name: "Mathematics", count: rawPapers.filter(p => p.subject === "Mathematics").length },
  { name: "English", count: rawPapers.filter(p => p.subject === "English").length },
  { name: "Kannada", count: rawPapers.filter(p => p.subject === "Kannada").length },
  { name: "Hindi", count: rawPapers.filter(p => p.subject === "Hindi").length },
]

const yearsList = ["All Years", "2026-27", "2025-26", "2024-25", "2023-24", "2022-23", "2021-22"]

export function PucQuestionPapers() {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects")
  const [selectedYear, setSelectedYear] = useState("All Years")
  const [searchQuery, setSearchQuery] = useState("")
  const [previewPaper, setPreviewPaper] = useState<PucPaper | null>(null)

  const filteredPapers = useMemo(() => {
    return (rawPapers as PucPaper[]).filter(paper => {
      const matchSub = selectedSubject === "All Subjects" || paper.subject === selectedSubject
      const matchYear = selectedYear === "All Years" || paper.yearBatch === selectedYear
      const matchQuery = !searchQuery.trim() || 
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.yearBatch.toLowerCase().includes(searchQuery.toLowerCase())
      return matchSub && matchYear && matchQuery
    })
  }, [selectedSubject, selectedYear, searchQuery])

  const subjectBadges: Record<string, string> = {
    Physics: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    Chemistry: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    Mathematics: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    English: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    Kannada: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    Hindi: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  }

  return (
    <Page 
      title="Question Papers & Model Papers" 
      subtitle="Comprehensive archive of official KSEAB 2nd PUC Model Question Papers (MQPs) and blueprints across years."
    >
      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Total Official Papers</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-foreground">{rawPapers.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Active Cycles</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-primary">6 Years</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Latest 2026–27 Set</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-emerald-500">15 Papers</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">PCM Focus</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-blue-500">41 Papers</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls & Search */}
      <Card className="border border-border/60">
        <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by subject, paper number, or cycle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs sm:text-sm"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="h-10 text-xs rounded-md border border-input bg-background px-3 py-2 w-full sm:w-auto ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y === "All Years" ? "All Academic Years" : `Cycle: ${y}`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Subject Pills - Horizontal touch scrolling on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-1 border-t border-border/50">
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1 shrink-0">
              <Filter className="h-3 w-3" /> Subject:
            </span>
            {subjectsList.map(sub => (
              <Button
                key={sub.name}
                variant={selectedSubject === sub.name ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs rounded-full px-2.5 sm:px-3 shrink-0 whitespace-nowrap"
                onClick={() => setSelectedSubject(sub.name)}
              >
                {sub.name} <span className="ml-1 opacity-70">({sub.count})</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Paper List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Showing {filteredPapers.length} of {rawPapers.length} Papers
          </p>
          {(selectedSubject !== "All Subjects" || selectedYear !== "All Years" || searchQuery) && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSelectedSubject("All Subjects")
                setSelectedYear("All Years")
                setSearchQuery("")
              }}
            >
              Reset Filters
            </Button>
          )}
        </div>

        {filteredPapers.length === 0 ? (
          <Card className="p-8 text-center border-dashed">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm font-semibold">No question papers match your filters</p>
            <p className="text-xs text-muted-foreground mt-1">Try switching the subject or cycle, or clear your search term.</p>
          </Card>
        ) : (
          <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPapers.map((paper) => (
              <Card 
                key={paper.url} 
                className="flex flex-col justify-between hover:border-primary/40 transition-all hover:shadow-sm group bg-card"
              >
                <CardHeader className="p-3.5 sm:p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="outline" className={`text-[10px] font-semibold capitalize ${subjectBadges[paper.subject] || "border-border"}`}>
                      {paper.subject}
                    </Badge>
                    <span className="text-[10px] sm:text-[11px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                      {paper.yearBatch}
                    </span>
                  </div>
                  <CardTitle className="text-xs sm:text-sm font-semibold leading-snug pt-1.5 sm:pt-2 group-hover:text-primary transition-colors">
                    {paper.title}
                  </CardTitle>
                  <CardDescription className="text-[10px] sm:text-[11px]">
                    Official KSEAB Blueprint / MQP • {paper.sizeKb} KB
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3.5 sm:p-4 pt-0">
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs gap-1 cursor-pointer w-full"
                      onClick={() => setPreviewPaper(paper)}
                    >
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-8 text-xs gap-1 cursor-pointer w-full"
                      onClick={() => downloadFile(paper.url, paper.fileName)}
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      <PdfViewerModal
        open={!!previewPaper}
        onClose={() => setPreviewPaper(null)}
        url={previewPaper?.url || ""}
        title={previewPaper?.title || ""}
        fileName={previewPaper?.fileName}
        subtitle={`${previewPaper?.subject || ""} • Cycle: ${previewPaper?.yearBatch || ""}`}
        fileSize={previewPaper ? `${previewPaper.sizeKb} KB` : undefined}
        badgeText={previewPaper?.subject}
      />
    </Page>
  )
}

import { pucBlueprintsData, SubjectBlueprint } from "@/data/puc-blueprints"

export function PucSubjects() {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string>("chemistry")
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string; fileName: string } | null>(null)

  const activeBlueprint: SubjectBlueprint = pucBlueprintsData[selectedSubjectKey] || pucBlueprintsData.chemistry

  return (
    <Page 
      title="Official KSEAB 2nd PUC Blueprints & Weightage" 
      subtitle="Complete digitized unit-wise marks, teaching hours, and question paper blueprint distributions for 2026–27."
    >
      {/* Subject Tabs & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-border/60 pb-3">
        {/* Horizontal scrollable pills for subjects on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {Object.entries(pucBlueprintsData).map(([key, bp]) => (
            <Button
              key={key}
              variant={selectedSubjectKey === key ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs font-semibold shrink-0 whitespace-nowrap"
              onClick={() => setSelectedSubjectKey(key)}
            >
              {bp.subjectName} <span className="opacity-70 text-[10px]">({bp.subjectCode})</span>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            onClick={() => setPreviewPdf({ url: activeBlueprint.pdfUrl, title: `${activeBlueprint.subjectName} Blueprint`, fileName: activeBlueprint.pdfFileName })}
          >
            <Eye className="h-3.5 w-3.5" /> View PDF
          </Button>
          <Button 
            size="sm" 
            className="h-8 text-xs gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            onClick={() => downloadFile(activeBlueprint.pdfUrl, activeBlueprint.pdfFileName)}
          >
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </div>

      {/* Blueprint Header Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Max Theory Marks</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-foreground">{activeBlueprint.maxMarks} M</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Total Paper Marks</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-primary">{activeBlueprint.totalPaperMarks} M</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Total Teaching Hours</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-foreground">{activeBlueprint.totalTeachingHours}h</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Academic Cycle</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-emerald-500">{activeBlueprint.academicCycle}</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Paper Pattern Structure */}
      <Card className="border-border/60">
        <CardHeader className="p-3.5 sm:p-5 pb-2.5 sm:pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
            <div>
              <CardTitle className="text-xs sm:text-sm font-semibold">Question Paper Structure & Part-wise Weightage</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs">Summary of choice distribution and section breakdown</CardDescription>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0">
              <span className="text-[10px] text-muted-foreground sm:hidden font-mono">← Swipe table →</span>
              <Badge variant="outline" className="text-primary border-primary/30 text-[9px] sm:text-[10px]">
                KSEAB Official Blueprint
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[480px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-2.5 px-3 font-semibold">Section / Part</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Marks Per Question</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Questions Given</th>
                  <th className="py-2.5 px-3 font-semibold text-center">To Answer</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Total Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {activeBlueprint.partsInfo.map((part) => (
                  <tr key={part.part} className="hover:bg-muted/20">
                    <td className="py-2.5 px-3 font-medium text-foreground">{part.part}</td>
                    <td className="py-2.5 px-3 text-center">{part.marksPerQuestion} Mark{part.marksPerQuestion > 1 ? "s" : ""}</td>
                    <td className="py-2.5 px-3 text-center font-mono">{part.questionsGiven}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-primary font-semibold">{part.questionsToAnswer}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">{part.totalMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Digital Blueprint Interactive Table */}
      <Card className="border border-border/70 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/20 border-b border-border/50 p-3.5 sm:p-4 pb-2.5 sm:pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div>
              <CardTitle className="text-xs sm:text-base font-semibold">Unit & Chapter-wise Blueprint Matrix</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs">
                Question count allocation across 1M, 2M, 3M, and 5M sections per chapter
              </CardDescription>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-1.5 pt-1 sm:pt-0">
              <span className="text-[10px] text-muted-foreground sm:hidden font-mono">← Swipe columns →</span>
              <Badge variant="secondary" className="font-mono text-[10px] sm:text-xs">
                Code {activeBlueprint.subjectCode} · {activeBlueprint.subjectName}
              </Badge>
              <Badge variant="outline" className="text-[10px] sm:text-xs text-primary border-primary/30">
                Max {activeBlueprint.maxMarks} M
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider divide-x divide-border/40">
                  <th className="py-3 px-3 font-semibold text-center w-12">#</th>
                  <th className="py-3 px-4 font-semibold min-w-[200px]">Chapter Name</th>
                  <th className="py-3 px-3 text-center font-semibold w-16 whitespace-nowrap">Hrs</th>
                  <th className="py-3 px-3 text-center font-semibold w-20 whitespace-nowrap">Marks</th>
                  <th className="py-3 px-3 text-center font-semibold w-24 whitespace-nowrap text-blue-600 dark:text-blue-400">
                    1M <span className="opacity-70 font-normal">(Part A)</span>
                  </th>
                  <th className="py-3 px-3 text-center font-semibold w-24 whitespace-nowrap text-emerald-600 dark:text-emerald-400">
                    2M <span className="opacity-70 font-normal">(Part B)</span>
                  </th>
                  <th className="py-3 px-3 text-center font-semibold w-24 whitespace-nowrap text-amber-600 dark:text-amber-400">
                    3M <span className="opacity-70 font-normal">(Part C)</span>
                  </th>
                  <th className="py-3 px-3 text-center font-semibold w-24 whitespace-nowrap text-purple-600 dark:text-purple-400">
                    5M <span className="opacity-70 font-normal">(Part D)</span>
                  </th>
                  {selectedSubjectKey === "mathematics" && (
                    <>
                      <th className="py-3 px-3 text-center font-semibold w-24 whitespace-nowrap text-rose-600 dark:text-rose-400">
                        6M <span className="opacity-70 font-normal">(Part E)</span>
                      </th>
                      <th className="py-3 px-3 text-center font-semibold w-24 whitespace-nowrap text-orange-600 dark:text-orange-400">
                        4M <span className="opacity-70 font-normal">(Part E)</span>
                      </th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {activeBlueprint.chapters.map((ch, idx) => (
                  <tr 
                    key={idx} 
                    className={`divide-x divide-border/30 transition-colors ${
                      idx % 2 === 1 ? "bg-muted/[0.08]" : ""
                    } hover:bg-primary/[0.03]`}
                  >
                    <td className="py-2.5 px-3 font-mono font-medium text-center text-muted-foreground">
                      {ch.unitNumber || ch.chapterNumber}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-foreground">
                      {ch.name}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-muted-foreground">
                      {ch.teachingHours}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-foreground">
                      <span className="inline-block px-2 py-0.5 rounded bg-muted/60 text-primary">
                        {ch.marks}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      {ch.partA_1m !== "-" ? (
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-semibold rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          {ch.partA_1m} Q
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {ch.partB_2m && ch.partB_2m !== "-" ? (
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {ch.partB_2m} Q
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {ch.partC_3m && ch.partC_3m !== "-" ? (
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {ch.partC_3m} Q
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {ch.partD_5m && ch.partD_5m !== "-" ? (
                        <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-semibold rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          {ch.partD_5m} Q
                        </span>
                      ) : (
                        <span className="text-muted-foreground/30 font-mono">—</span>
                      )}
                    </td>
                    {selectedSubjectKey === "mathematics" && (
                      <>
                        <td className="py-2 px-3 text-center">
                          {ch.partE_6m && ch.partE_6m !== "-" ? (
                            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-semibold rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                              {ch.partE_6m} Q
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30 font-mono">—</span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {ch.partE_4m && ch.partE_4m !== "-" ? (
                            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 text-xs font-semibold rounded bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                              {ch.partE_4m} Q
                            </span>
                          ) : (
                            <span className="text-muted-foreground/30 font-mono">—</span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {/* Row 1: Question Counts */}
                <tr className="border-t-2 border-border/80 bg-muted/30 divide-x divide-border/40 text-foreground">
                  <td colSpan={2} className="py-2.5 px-4 text-xs font-semibold">
                    Questions Given / To Answer
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-medium text-muted-foreground">
                    {activeBlueprint.totalTeachingHours}h
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs font-bold text-primary font-mono">
                    Total
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">20 / 20</span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {selectedSubjectKey === "mathematics" ? "6 / 9" : selectedSubjectKey === "physics" ? "5 / 8" : "3 / 5"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {selectedSubjectKey === "mathematics" ? "6 / 9" : selectedSubjectKey === "physics" ? "5 / 8" : "8 / 15"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      {selectedSubjectKey === "mathematics" ? "4 / 7" : selectedSubjectKey === "physics" ? "5 / 9" : "4 / 6"}
                    </span>
                  </td>
                  {selectedSubjectKey === "mathematics" && (
                    <>
                      <td className="py-2.5 px-3 text-center font-mono text-xs">
                        <span className="font-semibold text-rose-600 dark:text-rose-400">1 / 2</span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-xs">
                        <span className="font-semibold text-orange-600 dark:text-orange-400">1 / 2</span>
                      </td>
                    </>
                  )}
                </tr>

                {/* Row 2: Marks Earned vs Paper Marks */}
                <tr className="border-t border-border/40 bg-muted/50 divide-x divide-border/40 font-bold text-foreground">
                  <td colSpan={2} className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-primary">
                    Marks Earned / Max Marks
                  </td>
                  <td className="py-2.5 px-3 text-center text-[10px] text-muted-foreground uppercase font-mono">
                    Hours
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs text-primary font-bold">
                    {activeBlueprint.maxMarks} / {activeBlueprint.totalPaperMarks} M
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs text-blue-600 dark:text-blue-400">
                    20 / 20 M
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    {selectedSubjectKey === "mathematics" ? "12 / 18 M" : selectedSubjectKey === "physics" ? "10 / 16 M" : "6 / 10 M"}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs text-amber-600 dark:text-amber-400">
                    {selectedSubjectKey === "mathematics" ? "18 / 27 M" : selectedSubjectKey === "physics" ? "15 / 24 M" : "24 / 45 M"}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-xs text-purple-600 dark:text-purple-400">
                    {selectedSubjectKey === "mathematics" ? "20 / 35 M" : selectedSubjectKey === "physics" ? "25 / 45 M" : "20 / 30 M"}
                  </td>
                  {selectedSubjectKey === "mathematics" && (
                    <>
                      <td className="py-2.5 px-3 text-center font-mono text-xs text-rose-600 dark:text-rose-400">
                        6 / 12 M
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-xs text-orange-600 dark:text-orange-400">
                        4 / 8 M
                      </td>
                    </>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      <PdfViewerModal
        open={!!previewPdf}
        onClose={() => setPreviewPdf(null)}
        url={previewPdf?.url || ""}
        title={previewPdf?.title || ""}
        fileName={previewPdf?.fileName}
        subtitle="Official KSEAB Karnataka 2nd PUC Blueprint PDF"
        badgeText={activeBlueprint.subjectName}
      />
    </Page>
  )
}


export function PucMarksCalculator() {
  const [marks, setMarks] = useState<Record<string, string>>({})
  const fields = ["Language 1", "Language 2", "Physics", "Chemistry", "Mathematics / Biology"]
  const total = useMemo(() => fields.reduce((sum, field) => sum + Math.min(100, Math.max(0, Number(marks[field]) || 0)), 0), [marks])
  const percentage = (total / (fields.length * 100)) * 100

  // Calculate PCM for KCET
  const pcmTotal = useMemo(() => {
    const p = Math.min(100, Math.max(0, Number(marks["Physics"]) || 0))
    const c = Math.min(100, Math.max(0, Number(marks["Chemistry"]) || 0))
    const m = Math.min(100, Math.max(0, Number(marks["Mathematics / Biology"]) || 0))
    return p + c + m
  }, [marks])
  const pcmPercentage = (pcmTotal / 300) * 100

  return (
    <Page 
      title="PUC Marks & KCET Weightage Calculator" 
      subtitle="Enter your expected 2nd PUC scores to project both your total board aggregate and your KCET-qualifying PCM percentage."
    >
      <div className="grid gap-3.5 sm:gap-5 lg:grid-cols-[1fr_320px]">
        <Card className="border border-border/60">
          <CardHeader className="p-3.5 sm:p-5 pb-2 sm:pb-3">
            <CardTitle className="text-xs sm:text-sm font-semibold">Subject-wise marks (/ 100)</CardTitle>
            <CardDescription className="text-[11px] sm:text-xs">Include both theory and practical marks in the total per paper.</CardDescription>
          </CardHeader>
          <CardContent className="p-3.5 sm:p-5 pt-0 space-y-3 sm:space-y-4">
            <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
              {fields.map(field => (
                <label key={field} className="space-y-1 block">
                  <span className="text-[11px] sm:text-xs font-medium text-foreground">{field}</span>
                  <Input 
                    type="number" 
                    inputMode="decimal"
                    min="0" 
                    max="100" 
                    placeholder="0–100" 
                    value={marks[field] || ""} 
                    onChange={e => setMarks({ ...marks, [field]: e.target.value })} 
                    className="h-10 text-xs sm:text-sm"
                  />
                </label>
              ))}
            </div>
            <div className="pt-1 sm:pt-2">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-8 text-muted-foreground hover:text-foreground" onClick={() => setMarks({})}>
                <RotateCcw className="h-3.5 w-3.5" /> Reset All Marks
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2.5 sm:space-y-3">
          <Card className="bg-primary/[0.04] border-primary/20">
            <CardHeader className="p-3.5 sm:p-4 pb-1 sm:pb-2">
              <Badge variant="outline" className="w-fit text-[10px] text-primary border-primary/30">Total Board Aggregate</Badge>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-primary pt-1">{percentage.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 pt-0 space-y-1.5 sm:space-y-2">
              <p className="text-[11px] sm:text-xs text-muted-foreground">{total} / {fields.length * 100} marks overall</p>
              <div className="pt-1.5 sm:pt-2 border-t border-border/50 text-[10px] sm:text-[11px] text-muted-foreground flex gap-1.5 leading-snug">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span>Standard KSEAB 5-subject passing aggregate.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-muted/30">
            <CardHeader className="p-3.5 sm:p-4 pb-1 sm:pb-2">
              <Badge variant="outline" className="w-fit text-[10px] text-blue-600 dark:text-blue-400 border-blue-500/30">
                KCET PCM Rank Weightage (50%)
              </Badge>
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground pt-1">{pcmPercentage.toFixed(1)}%</CardTitle>
            </CardHeader>
            <CardContent className="p-3.5 sm:p-4 pt-0 space-y-2">
              <p className="text-[11px] sm:text-xs text-muted-foreground">{pcmTotal} / 300 PCM total marks</p>
              <div className="pt-2 sm:pt-3">
                <a 
                  href={`/rank-predictor?puc=${Math.round(pcmPercentage)}`}
                  className="w-full inline-flex items-center justify-center rounded-md text-xs font-semibold bg-primary text-primary-foreground h-10 px-3 hover:bg-primary/90 transition-colors gap-1.5 shadow-sm active:scale-[0.99]"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Send to KCET Rank Predictor
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  )
}

import { pucPracticalsData, PracticalScheme } from "@/data/puc-practicals"

export function PucPracticals() {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string>("physics")
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string; fileName: string } | null>(null)

  const activeScheme: PracticalScheme = pucPracticalsData[selectedSubjectKey] || pucPracticalsData.physics

  return (
    <Page
      title="Official 2nd PUC Practical Scheme of Evaluation"
      subtitle="Complete laboratory marks distribution, step-wise evaluation rubrics, and official practical examination guidelines."
    >
      {/* Subject Selector Tabs & Download Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-border/60 pb-3">
        {/* Horizontal scrollable pills for subjects on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {Object.entries(pucPracticalsData).map(([key, scheme]) => (
            <Button
              key={key}
              variant={selectedSubjectKey === key ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs font-semibold shrink-0 whitespace-nowrap"
              onClick={() => setSelectedSubjectKey(key)}
            >
              {scheme.subjectName} <span className="opacity-70 text-[10px]">({scheme.subjectCode})</span>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            onClick={() => setPreviewPdf({ url: activeScheme.pdfUrl, title: `${activeScheme.subjectName} Practical Scheme`, fileName: activeScheme.pdfFileName })}
          >
            <Eye className="h-3.5 w-3.5" /> View PDF
          </Button>
          <Button 
            size="sm" 
            className="h-8 text-xs gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            onClick={() => downloadFile(activeScheme.pdfUrl, activeScheme.pdfFileName)}
          >
            <Download className="h-3.5 w-3.5" /> Download
          </Button>
        </div>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Max Practical Marks</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-foreground">{activeScheme.maxMarks} M</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Lab Exam Duration</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-primary">{activeScheme.duration}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Lab Experiment Work</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-emerald-500">20 Marks</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Record + Attendance</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-blue-500">10 M (5+5)</p>
          </CardContent>
        </Card>
      </div>

      {/* High Level 30-Mark Weightage Breakdown */}
      <Card className="border border-border/70 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/20 border-b border-border/50 p-3.5 sm:p-4 pb-2.5 sm:pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
            <div>
              <CardTitle className="text-xs sm:text-base font-semibold">Overall Practical Examination Structure</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs">Summary of 30-mark weightage components</CardDescription>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30 text-[10px] sm:text-xs font-mono w-fit">
              Total: {activeScheme.maxMarks} Marks
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[340px]">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider divide-x divide-border/40">
                  <th className="py-2.5 px-3 font-semibold text-center w-12">#</th>
                  <th className="py-2.5 px-4 font-semibold">Evaluation Particulars</th>
                  <th className="py-2.5 px-3 text-center font-semibold w-24">Allotted Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {activeScheme.overallWeightage.map((item) => (
                  <tr key={item.slNo} className="divide-x divide-border/30 hover:bg-muted/10 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono text-muted-foreground">{item.slNo}</td>
                    <td className="py-2.5 px-4 font-medium text-foreground">{item.particulars}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-primary">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-muted/60">{item.marks} M</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Rubrics & Step Breakdown */}
      <div className="space-y-3 sm:space-y-4">
        {activeScheme.sections.map((sec, idx) => (
          <Card key={idx} className="border border-border/70 overflow-hidden shadow-sm">
            <CardHeader className="bg-muted/20 border-b border-border/50 p-3.5 sm:p-4 pb-2 sm:pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <CardTitle className="text-xs sm:text-sm font-semibold">{sec.title}</CardTitle>
                  {sec.description && <CardDescription className="text-[11px] sm:text-xs mt-0.5">{sec.description}</CardDescription>}
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 pt-0.5 sm:pt-0">
                  <span className="text-[10px] text-muted-foreground sm:hidden font-mono">← Swipe rubric →</span>
                  <Badge variant="secondary" className="font-mono text-[10px] sm:text-xs w-fit">
                    {sec.marks} Marks
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-wider divide-x divide-border/40">
                      <th className="py-2.5 px-3 text-center w-12 font-semibold">Step</th>
                      <th className="py-2.5 px-4 font-semibold min-w-[200px]">Evaluation Rubric / Task</th>
                      <th className="py-2.5 px-4 font-semibold min-w-[160px]">Official Criterion / Guidelines</th>
                      <th className="py-2.5 px-3 text-center w-20 font-semibold">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {sec.breakdown.map((item, bIdx) => (
                      <tr key={bIdx} className="divide-x divide-border/30 hover:bg-muted/10 transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono text-muted-foreground">{bIdx + 1}</td>
                        <td className="py-2.5 px-4 font-medium text-foreground">{item.step}</td>
                        <td className="py-2.5 px-4 text-xs text-muted-foreground">{item.notes || "—"}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-primary">
                          <span className="inline-flex items-center justify-center min-w-[28px] h-6 px-1.5 text-xs font-semibold rounded bg-primary/10 text-primary border border-primary/20">
                            {item.marks} M
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Suggested Salts (For Chemistry) */}
      {activeScheme.suggestedSaltsOrApparatus && (
        <Card className="border border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recommended Salts for Practical Examination</CardTitle>
            <CardDescription className="text-xs">
              Official list of inorganic salts suggested by KSEAB for practical examination qualitative analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {activeScheme.suggestedSaltsOrApparatus.map((salt) => (
                <Badge key={salt} variant="outline" className="font-mono text-xs px-2.5 py-1 bg-muted/40">
                  {salt}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescribed Curriculum Experiments List */}
      {activeScheme.curriculumList && (
        <Card className="border border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              KSEAB Prescribed Laboratory Experiments List ({activeScheme.curriculumList.length} Experiments)
            </CardTitle>
            <CardDescription className="text-xs">
              Official list of experiments to be conducted and recorded during the 2025–26 / 2026–27 academic year
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-2 sm:grid-cols-2">
              {activeScheme.curriculumList.map((exp) => (
                <div key={exp.expNo} className="flex gap-2.5 items-start p-2.5 rounded-md border border-border/50 bg-muted/20 text-xs">
                  <span className="font-mono font-semibold text-primary shrink-0 w-6">#{exp.expNo}</span>
                  <span className="text-muted-foreground leading-snug">{exp.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <PdfViewerModal
        open={!!previewPdf}
        onClose={() => setPreviewPdf(null)}
        url={previewPdf?.url || ""}
        title={previewPdf?.title || ""}
        fileName={previewPdf?.fileName}
        subtitle="Official KSEAB Scheme of Practical Evaluation"
        badgeText={activeScheme.subjectName}
      />
    </Page>
  )
}

import { pucQuestionBanksData, QuestionBankMeta } from "@/data/puc-question-banks"

export function PucQuestionBanks() {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<string>("physics")
  const [previewPdf, setPreviewPdf] = useState<{ url: string; title: string; fileName: string; initialPage?: number } | null>(null)
  const [isDownloadingTop, setIsDownloadingTop] = useState(false)

  const activeBank: QuestionBankMeta = pucQuestionBanksData[selectedSubjectKey] || pucQuestionBanksData.physics

  const handleDownloadTop = async () => {
    setIsDownloadingTop(true)
    try {
      await downloadFile(activeBank.pdfUrl, activeBank.pdfFileName)
    } finally {
      setIsDownloadingTop(false)
    }
  }

  return (
    <Page
      title="Official 2nd PUC Chapter-wise Question Banks"
      subtitle="Complete state-prescribed question banks for Physics, Chemistry, and Mathematics released by KSEAB & Department of School Education."
    >
      {/* Subject Tabs & Direct Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-border/60 pb-3">
        {/* Horizontal scrollable pills for subjects on mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {Object.entries(pucQuestionBanksData).map(([key, bank]) => (
            <Button
              key={key}
              variant={selectedSubjectKey === key ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs font-semibold shrink-0 whitespace-nowrap"
              onClick={() => setSelectedSubjectKey(key)}
            >
              {bank.subjectName} <span className="opacity-70 text-[10px]">({bank.subjectCode})</span>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            onClick={() => setPreviewPdf({ url: activeBank.pdfUrl, title: `${activeBank.subjectName} Question Bank`, fileName: activeBank.pdfFileName, initialPage: 1 })}
          >
            <Eye className="h-3.5 w-3.5" /> View PDF ({activeBank.totalPages}p)
          </Button>
          <Button 
            size="sm" 
            className="h-8 text-xs gap-1.5 cursor-pointer w-full sm:w-auto justify-center"
            onClick={handleDownloadTop}
            disabled={isDownloadingTop}
          >
            <Download className="h-3.5 w-3.5" /> {isDownloadingTop ? "..." : `Download (${activeBank.fileSizeMb}MB)`}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Total Repository Size</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-foreground">{activeBank.totalPages} Pages</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Chapters Covered</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-primary">{activeBank.chapters.length} Chapters</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Academic Year</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-emerald-500">2026 Set</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/40">
          <CardContent className="p-3 sm:p-4">
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium truncate">Official Release</p>
            <p className="text-lg sm:text-2xl font-bold mt-0.5 sm:mt-1 text-blue-500">KSEAB Bank</p>
          </CardContent>
        </Card>
      </div>

      {/* Question Bank Features List */}
      <Card className="border border-border/70 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/20 border-b border-border/50 p-3.5 sm:p-4 pb-2.5 sm:pb-3">
          <CardTitle className="text-xs sm:text-base font-semibold">Repository Highlights & Question Categories</CardTitle>
          <CardDescription className="text-[11px] sm:text-xs">
            What is included in the official {activeBank.subjectName} question repository
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3.5 sm:p-4 space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {activeBank.features.map((feat, idx) => (
              <div key={idx} className="flex gap-2.5 items-start p-2.5 rounded-md border border-border/50 bg-muted/20 text-xs">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chapter Breakdown Matrix */}
      <Card className="border border-border/70 overflow-hidden shadow-sm">
        <CardHeader className="bg-muted/20 border-b border-border/50 p-3.5 sm:p-4 pb-2.5 sm:pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs sm:text-base font-semibold">Chapter-wise Question Bank Coverage</CardTitle>
              <CardDescription className="text-[11px] sm:text-xs">
                Official syllabus chapters indexed with blueprint weightage
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-primary border-primary/30 text-[10px] sm:text-xs font-mono">
              {activeBank.subjectName}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile Card List (< 640px) */}
          <div className="block sm:hidden divide-y divide-border/40">
            {activeBank.chapters.map((ch) => (
              <div key={ch.unitNumber} className="p-3 flex items-center justify-between gap-2.5 hover:bg-muted/10 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                      Ch.{ch.unitNumber}
                    </span>
                    <span className="text-[10px] font-bold text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                      {ch.marks} M
                    </span>
                    {ch.startPage && (
                      <span className="text-[10px] text-muted-foreground font-mono">
                        p.{ch.startPage}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-foreground leading-snug truncate">
                    {ch.name}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs text-primary hover:text-primary gap-1 shrink-0 px-2.5 cursor-pointer"
                  onClick={() => setPreviewPdf({ url: activeBank.pdfUrl, title: `${activeBank.subjectName} - ${ch.name}`, fileName: activeBank.pdfFileName, initialPage: ch.startPage })}
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </Button>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground uppercase text-[10px] tracking-wider divide-x divide-border/40">
                  <th className="py-2.5 px-3 font-semibold text-center w-12">#</th>
                  <th className="py-2.5 px-4 font-semibold">Chapter Name</th>
                  <th className="py-2.5 px-3 text-center font-semibold w-24">Board Marks</th>
                  <th className="py-2.5 px-4 text-center font-semibold w-36">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {activeBank.chapters.map((ch) => (
                  <tr key={ch.unitNumber} className="divide-x divide-border/30 hover:bg-muted/10 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono text-muted-foreground">{ch.unitNumber}</td>
                    <td className="py-2.5 px-4 font-medium text-foreground">{ch.name}</td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-primary">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-muted/60">{ch.marks} M</span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-primary hover:text-primary gap-1 cursor-pointer"
                        onClick={() => setPreviewPdf({ url: activeBank.pdfUrl, title: `${activeBank.subjectName} - ${ch.name}`, fileName: activeBank.pdfFileName, initialPage: ch.startPage })}
                      >
                        <Eye className="h-3 w-3" /> View in PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* PDF Modal */}
      <PdfViewerModal
        open={!!previewPdf}
        onClose={() => setPreviewPdf(null)}
        url={previewPdf?.url || ""}
        title={previewPdf?.title || ""}
        fileName={previewPdf?.fileName}
        subtitle="Official KSEAB 2nd PUC Question Bank"
        fileSize={`${activeBank.fileSizeMb} MB`}
        badgeText={`Code: ${activeBank.subjectCode}`}
        totalPages={activeBank.totalPages}
        initialPage={previewPdf?.initialPage || 1}
      />
    </Page>
  )
}

export function PucStudyPlanner() {
  const [tasks, setTasks] = useState<string[]>([])
  const [task, setTask] = useState("")
  const add = () => { if (task.trim()) { setTasks([...tasks, task.trim()]); setTask("") } }
  const remove = (index: number) => { setTasks(tasks.filter((_, i) => i !== index)) }

  return (
    <Page title="Study Planner & Revision Targets" subtitle="Keep a lightweight, practical list of what chapters or questions you want to finish today.">
      <Card className="max-w-xl border border-border/60">
        <CardContent className="p-3.5 sm:p-5 space-y-3 sm:space-y-4">
          <div className="flex gap-2">
            <Input 
              placeholder="e.g. Revise Ray Optics or solve Chemistry MQP 1" 
              value={task} 
              onChange={e => setTask(e.target.value)} 
              onKeyDown={e => e.key === "Enter" && add()} 
              className="h-10 text-xs sm:text-sm"
            />
            <Button size="icon" className="h-10 w-10 shrink-0 cursor-pointer" onClick={add} aria-label="Add task">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 sm:py-8 text-center border border-dashed rounded-md">
                No active targets. Add your first revision goal or model paper to solve.
              </p>
            ) : (
              tasks.map((item, i) => (
                <div key={`${item}-${i}`} className="flex items-center justify-between gap-2 rounded-md border border-border p-2.5 sm:p-3 text-xs bg-muted/20">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                  <button 
                    onClick={() => remove(i)} 
                    className="text-muted-foreground hover:text-destructive transition-colors p-1.5 shrink-0"
                    aria-label="Remove task"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </Page>
  )
}

function Page({ title, subtitle, children }: { title: string, subtitle: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-6xl mx-auto px-2 sm:px-4 md:px-0">
      <div>
        <Badge variant="outline" className="text-primary border-primary/30 mb-1.5 text-[10px] sm:text-xs px-2 py-0.5">KSEAB · 2nd PUC</Badge>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

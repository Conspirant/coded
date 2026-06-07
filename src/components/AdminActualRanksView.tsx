import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trash2, Users, Medal, RefreshCw, BarChart2, BookOpen, FileText, ChevronUp, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ActualRankService, ActualRankSubmission } from "@/lib/actual-rank-service"
import { formatDistanceToNow } from "date-fns"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default function AdminActualRanksView() {
    const [submissions, setSubmissions] = useState<ActualRankSubmission[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState<"created_at" | "actual_rank" | "kcet_marks" | "puc_aggregate">("created_at")
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
    const { toast } = useToast()

    const loadSubmissions = async () => {
        setLoading(true)
        const data = await ActualRankService.getAllSubmissions()
        setSubmissions(data)
        setLoading(false)
    }

    useEffect(() => {
        loadSubmissions()
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this rank submission?")) return
        const success = await ActualRankService.deleteSubmission(id)
        if (success) {
            toast({
                title: "Record Deleted",
                description: "The rank calibration record was removed successfully."
            })
            loadSubmissions()
        } else {
            toast({
                title: "Delete Failed",
                description: "Could not remove the entry from Supabase.",
                variant: "destructive"
            })
        }
    }

    // In-memory sorting logic
    const sortedSubmissions = [...submissions].sort((a, b) => {
        let valA: any = a[sortBy]
        let valB: any = b[sortBy]

        if (valA === undefined || valA === null) return sortOrder === "asc" ? 1 : -1
        if (valB === undefined || valB === null) return sortOrder === "asc" ? -1 : 1

        if (sortBy === "created_at") {
            const timeA = new Date(valA).getTime()
            const timeB = new Date(valB).getTime()
            return sortOrder === "asc" ? timeA - timeB : timeB - timeA
        }

        const numA = Number(valA)
        const numB = Number(valB)
        return sortOrder === "asc" ? numA - numB : numB - numA
    })

    const handleSortHeader = (column: typeof sortBy) => {
        if (sortBy === column) {
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))
        } else {
            setSortBy(column)
            setSortOrder("desc")
        }
    }

    // Canvas Chart Generator Helper
    const generateChartImage = (
        data: ActualRankSubmission[],
        xKey: "kcet_marks" | "puc_aggregate" | "composite",
        title: string,
        xLabel: string,
        yLabel: string
    ): string => {
        const canvas = document.createElement("canvas")
        canvas.width = 800
        canvas.height = 450
        const ctx = canvas.getContext("2d")
        if (!ctx) return ""

        // Background
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const margin = { top: 60, right: 65, bottom: 65, left: 85 }
        const chartWidth = canvas.width - margin.left - margin.right
        const chartHeight = canvas.height - margin.top - margin.bottom

        // Map data points
        const points = data.map(item => {
            let xVal = 0
            if (xKey === "composite") {
                xVal = (Number(item.kcet_marks) / 180 * 50) + (Number(item.puc_aggregate) * 0.5)
            } else {
                xVal = Number(item[xKey])
            }
            return {
                x: xVal,
                y: Number(item.actual_rank)
            }
        }).filter(pt => !isNaN(pt.x) && !isNaN(pt.y))

        if (points.length === 0) return ""

        const xValues = points.map(p => p.x)
        const yValues = points.map(p => p.y)

        const minX = 0
        const maxX = xKey === "kcet_marks" ? 180 : 100
        const minY = 0
        const maxRankVal = Math.max(...yValues)
        const maxY = Math.ceil(maxRankVal / 10000) * 10000 || 10000

        const getX = (xVal: number) => margin.left + ((xVal - minX) / (maxX - minX)) * chartWidth
        const getY = (yVal: number) => margin.top + (1 - (yVal - minY) / (maxY - minY)) * chartHeight

        // Draw Title
        ctx.fillStyle = "#0f172a"
        ctx.font = "bold 20px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(title, canvas.width / 2, 35)

        // Grid lines setup
        ctx.strokeStyle = "#e2e8f0"
        ctx.lineWidth = 1
        ctx.font = "11px sans-serif"
        ctx.fillStyle = "#475569"

        // Draw X Ticks & Grid
        const xTicks = 10
        ctx.textAlign = "center"
        for (let i = 0; i <= xTicks; i++) {
            const xVal = minX + (i / xTicks) * (maxX - minX)
            const cx = getX(xVal)

            ctx.beginPath()
            ctx.moveTo(cx, margin.top)
            ctx.lineTo(cx, margin.top + chartHeight)
            ctx.stroke()

            ctx.fillText(xVal.toFixed(0), cx, margin.top + chartHeight + 20)
        }

        // Draw Y Ticks & Grid
        const yTicks = 6
        ctx.textAlign = "right"
        for (let i = 0; i <= yTicks; i++) {
            const yVal = minY + (i / yTicks) * (maxY - minY)
            const cy = getY(yVal)

            ctx.beginPath()
            ctx.moveTo(margin.left, cy)
            ctx.lineTo(margin.left + chartWidth, cy)
            ctx.stroke()

            ctx.fillText(yVal.toLocaleString(), margin.left - 12, cy + 4)
        }

        // Axis boundary lines
        ctx.strokeStyle = "#1e293b"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(margin.left, margin.top)
        ctx.lineTo(margin.left, margin.top + chartHeight)
        ctx.lineTo(margin.left + chartWidth, margin.top + chartHeight)
        ctx.stroke()

        // Labels
        ctx.fillStyle = "#0f172a"
        ctx.font = "bold 13px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(xLabel, margin.left + chartWidth / 2, margin.top + chartHeight + 45)

        ctx.save()
        ctx.translate(28, margin.top + chartHeight / 2)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText(yLabel, 0, 0)
        ctx.restore()

        // Trendline (Linear Regression: y = mx + c)
        if (points.length > 1) {
            const n = points.length
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0
            for (const p of points) {
                sumX += p.x
                sumY += p.y
                sumXY += p.x * p.y
                sumXX += p.x * p.x
            }
            const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
            const c = (sumY - m * sumX) / n

            const startX = Math.min(...xValues)
            const endX = Math.max(...xValues)
            const startY = m * startX + c
            const endY = m * endX + c

            ctx.strokeStyle = "rgba(220, 38, 38, 0.7)"
            ctx.lineWidth = 2.5
            ctx.setLineDash([6, 6])
            ctx.beginPath()
            ctx.moveTo(getX(startX), getY(startY))
            ctx.lineTo(getX(endX), getY(endY))
            ctx.stroke()
            ctx.setLineDash([])
        }

        // Scatter Points
        ctx.fillStyle = "rgba(79, 70, 229, 0.8)"
        for (const p of points) {
            const cx = getX(p.x)
            const cy = getY(p.y)

            ctx.beginPath()
            ctx.arc(cx, cy, 6, 0, 2 * Math.PI)
            ctx.fill()

            ctx.strokeStyle = "#312e81"
            ctx.lineWidth = 1.2
            ctx.stroke()
        }

        return canvas.toDataURL("image/png")
    }

    // PDF Export function
    const handleDownloadPDF = () => {
        if (submissions.length === 0) return

        try {
            const doc = new jsPDF()

            // Header banner (Page 1)
            doc.setFillColor(30, 27, 75)
            doc.rect(0, 0, 210, 38, "F")

            doc.setTextColor(255, 255, 255)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(18)
            doc.text("KCET 2026 Calibration Report", 15, 16)

            doc.setFont("helvetica", "normal")
            doc.setFontSize(9)
            doc.text(`Report generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} | KCET Coded Admin Hub`, 15, 26)

            // Statistics Header
            doc.setTextColor(15, 23, 42)
            doc.setFont("helvetica", "bold")
            doc.setFontSize(12)
            doc.text("Database Summary Metrics", 15, 48)

            doc.setDrawColor(226, 232, 240)
            doc.setLineWidth(0.5)
            doc.line(15, 51, 195, 51)

            // Summary Stats Grid
            doc.setFont("helvetica", "normal")
            doc.setFontSize(9)
            doc.text("Total crowd-sourced submissions:", 15, 61)
            doc.setFont("helvetica", "bold")
            doc.text(`${totalEntries}`, 65, 61)

            doc.setFont("helvetica", "normal")
            doc.text("Average Rank:", 115, 61)
            doc.setFont("helvetica", "bold")
            doc.text(`${avgRank.toLocaleString()}`, 140, 61)

            doc.setFont("helvetica", "normal")
            doc.text("Average KCET Score:", 15, 71)
            doc.setFont("helvetica", "bold")
            doc.text(`${avgMarks} / 180`, 50, 71)

            doc.setFont("helvetica", "normal")
            doc.text("Average PUC PCM %:", 115, 71)
            doc.setFont("helvetica", "bold")
            doc.text(`${avgPuc}%`, 147, 71)

            // Draw Chart 1
            const chart1 = generateChartImage(submissions, "kcet_marks", "KCET Marks vs Actual Rank (2026 Batch)", "KCET Marks (out of 180)", "Actual Rank")
            if (chart1) {
                doc.addImage(chart1, "PNG", 15, 80, 180, 105)
            }

            // Draw footer on Page 1
            doc.setFontSize(8)
            doc.setTextColor(148, 163, 184)
            doc.text("Page 1 of 3 | KCET Coded Admin", 15, 285)

            // Add Page 2
            doc.addPage()
            doc.setFillColor(30, 27, 75)
            doc.rect(0, 0, 210, 15, "F")
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(10)
            doc.setFont("helvetica", "bold")
            doc.text("KCET 2026 Calibration Report | Detailed Distributions", 15, 10)

            // Draw Chart 2
            const chart2 = generateChartImage(submissions, "puc_aggregate", "PUC PCM % vs Actual Rank (2026 Batch)", "PUC PCM Aggregate %", "Actual Rank")
            if (chart2) {
                doc.addImage(chart2, "PNG", 15, 25, 180, 105)
            }

            // Draw Chart 3
            const chart3 = generateChartImage(submissions, "composite", "KEA Composite % vs Actual Rank (2026 Batch)", "KEA Composite Percentage (50% Board + 50% CET)", "Actual Rank")
            if (chart3) {
                doc.addImage(chart3, "PNG", 15, 145, 180, 105)
            }

            // Draw footer on Page 2
            doc.setFontSize(8)
            doc.setTextColor(148, 163, 184)
            doc.text("Page 2 of 3 | KCET Coded Admin", 15, 285)

            // Add Page 3 (Table)
            doc.addPage()
            doc.setFillColor(30, 27, 75)
            doc.rect(0, 0, 210, 15, "F")
            doc.setTextColor(255, 255, 255)
            doc.setFontSize(10)
            doc.setFont("helvetica", "bold")
            doc.text("KCET 2026 Calibration Report | Full Database Records", 15, 10)

            const sortedForTable = [...submissions].sort((a, b) => Number(a.actual_rank) - Number(b.actual_rank))

            const rows = sortedForTable.map(item => {
                const comp = ((Number(item.kcet_marks) / 180 * 50) + (Number(item.puc_aggregate) * 0.5)).toFixed(2)
                return [
                    item.actual_rank.toLocaleString(),
                    `${item.kcet_marks} / 180`,
                    `${item.puc_aggregate}%`,
                    `${comp}%`,
                    item.puc_board || "State Board",
                    item.category || "GM",
                    item.created_at ? new Date(item.created_at).toLocaleDateString() : "--"
                ]
            })

            autoTable(doc, {
                head: [["Actual Rank", "KCET Marks", "PUC PCM %", "KEA Composite %", "12th Board", "Category", "Date Submitted"]],
                body: rows,
                startY: 25,
                theme: "striped",
                headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: "bold" },
                styles: { fontSize: 8 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                didDrawPage: (data) => {
                    const pageCount = doc.getNumberOfPages()
                    doc.setFontSize(8)
                    doc.setTextColor(148, 163, 184)
                    doc.text(`Page ${pageCount} | KCET Coded Admin`, 15, doc.internal.pageSize.height - 10)
                }
            })

            doc.save("KCET_2026_Calibration_Report.pdf")
            toast({
                title: "Report Saved! 📄",
                description: "The PDF report with scatter plots and tabular records was downloaded."
            })
        } catch (error) {
            console.error("PDF generation failed:", error)
            toast({
                title: "Report Failed",
                description: "An error occurred during PDF generation.",
                variant: "destructive"
            })
        }
    }

    const SortArrow = ({ column }: { column: typeof sortBy }) => {
        if (sortBy !== column) return null
        return sortOrder === "asc" ? <ChevronUp className="h-3.5 w-3.5 inline ml-1 text-indigo-400" /> : <ChevronDown className="h-3.5 w-3.5 inline ml-1 text-indigo-400" />
    }

    // Statistics
    const totalEntries = submissions.length
    const avgRank = totalEntries > 0 ? Math.round(submissions.reduce((sum, s) => sum + s.actual_rank, 0) / totalEntries) : 0
    const avgMarks = totalEntries > 0 ? Math.round(submissions.reduce((sum, s) => sum + Number(s.kcet_marks), 0) / totalEntries * 10) / 10 : 0
    const avgPuc = totalEntries > 0 ? Math.round(submissions.reduce((sum, s) => sum + Number(s.puc_aggregate), 0) / totalEntries * 10) / 10 : 0

    // Board Breakdown
    const boardCounts = submissions.reduce((acc, s) => {
        const board = s.puc_board || "Other"
        acc[board] = (acc[board] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Summary statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-400" />
                            Total Submissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalEntries}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">For 2027 Model Calibration</p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Medal className="h-4 w-4 text-emerald-400" />
                            Average Rank
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-300">
                            {avgRank > 0 ? avgRank.toLocaleString() : "--"}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Direct from official results</p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <BarChart2 className="h-4 w-4 text-amber-400" />
                            Average KCET Marks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-300">
                            {avgMarks > 0 ? `${avgMarks}/180` : "--"}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Out of 180 total</p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-cyan-400" />
                            Average PUCPCM %
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-cyan-300">
                            {avgPuc > 0 ? `${avgPuc}%` : "--"}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">Board average PCM</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table Card */}
            <Card className="glass border-white/5">
                <CardHeader className="pb-4 border-b border-white/5">
                    <div>
                        <CardTitle className="text-lg font-bold">2027 Calibration Database</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            Crowd-sourced actual ranks, marks, and aggregates used for trend prediction
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {submissions.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p className="font-semibold text-sm">No calibration data yet.</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Submissions from Results Day Hub will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Toolbar with Sorting Options & Download PDF */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground font-medium">Sort by:</span>
                                        <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                                            <SelectTrigger className="w-[140px] bg-black/20 border-white/10 h-9 text-xs text-white">
                                                <SelectValue placeholder="Sort Column" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-xs text-foreground">
                                                <SelectItem value="created_at">Submission Date</SelectItem>
                                                <SelectItem value="actual_rank">Actual Rank</SelectItem>
                                                <SelectItem value="kcet_marks">KCET Marks</SelectItem>
                                                <SelectItem value="puc_aggregate">PUC Aggregate %</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground font-medium">Order:</span>
                                        <Select value={sortOrder} onValueChange={(val: "asc" | "desc") => setSortOrder(val)}>
                                            <SelectTrigger className="w-[110px] bg-black/20 border-white/10 h-9 text-xs text-white">
                                                <SelectValue placeholder="Order" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-slate-900 border-white/10 text-xs text-foreground">
                                                <SelectItem value="asc">Ascending</SelectItem>
                                                <SelectItem value="desc">Descending</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={handleDownloadPDF}
                                        variant="outline"
                                        size="sm"
                                        className="border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-400 h-9 text-xs"
                                        disabled={loading || submissions.length === 0}
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Download PDF Report
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={loadSubmissions} className="border-white/10 h-9 text-xs text-white" disabled={loading}>
                                        <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                                        Refresh
                                    </Button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10">
                                            <TableHead 
                                                className="text-xs uppercase tracking-wider cursor-pointer select-none hover:text-white"
                                                onClick={() => handleSortHeader("created_at")}
                                            >
                                                Submitted
                                                <SortArrow column="created_at" />
                                            </TableHead>
                                            <TableHead 
                                                className="text-xs uppercase tracking-wider cursor-pointer select-none hover:text-white"
                                                onClick={() => handleSortHeader("actual_rank")}
                                            >
                                                Actual Rank
                                                <SortArrow column="actual_rank" />
                                            </TableHead>
                                            <TableHead 
                                                className="text-xs uppercase tracking-wider cursor-pointer select-none hover:text-white"
                                                onClick={() => handleSortHeader("kcet_marks")}
                                            >
                                                KCET Marks
                                                <SortArrow column="kcet_marks" />
                                            </TableHead>
                                            <TableHead 
                                                className="text-xs uppercase tracking-wider cursor-pointer select-none hover:text-white"
                                                onClick={() => handleSortHeader("puc_aggregate")}
                                            >
                                                PUCPCM Aggregate
                                                <SortArrow column="puc_aggregate" />
                                            </TableHead>
                                            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/60 cursor-default select-none">12th Board</TableHead>
                                            <TableHead className="text-xs uppercase tracking-wider text-muted-foreground/60 cursor-default select-none">Category</TableHead>
                                            <TableHead className="text-right text-xs uppercase tracking-wider text-muted-foreground/60 cursor-default select-none">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedSubmissions.map(item => (
                                            <TableRow key={item.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : "--"}
                                                </TableCell>
                                                <TableCell className="font-mono font-bold text-indigo-300 text-sm">
                                                    {item.actual_rank.toLocaleString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="border-amber-500/25 bg-amber-500/5 text-amber-300 font-mono text-xs">
                                                        {item.kcet_marks} / 180
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="border-emerald-500/25 bg-emerald-500/5 text-emerald-300 font-mono text-xs">
                                                        {item.puc_aggregate}%
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs font-medium text-foreground/80">
                                                    {item.puc_board}
                                                </TableCell>
                                                <TableCell>
                                                    {item.category ? (
                                                        <Badge variant="secondary" className="bg-white/5 border border-white/10 text-xs font-mono">
                                                            {item.category}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground/60">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => item.id && handleDelete(item.id)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Board Breakdown Panel */}
            {submissions.length > 0 && (
                <Card className="glass border-white/5">
                    <CardHeader className="pb-3 border-b border-white/5">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">Board Enrollment Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.entries(boardCounts).map(([board, count]) => {
                            const percent = Math.round((count / totalEntries) * 100)
                            return (
                                <div key={board} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                                    <div className="text-xs text-muted-foreground truncate">{board}</div>
                                    <div className="text-lg font-bold flex items-baseline gap-1">
                                        {count}
                                        <span className="text-[10px] text-muted-foreground/80 font-normal">({percent}%)</span>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}


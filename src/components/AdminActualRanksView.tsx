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
import { Trash2, Users, Medal, RefreshCw, BarChart2, BookOpen } from "lucide-react"
import { ActualRankService, ActualRankSubmission } from "@/lib/actual-rank-service"
import { formatDistanceToNow } from "date-fns"

export default function AdminActualRanksView() {
    const [submissions, setSubmissions] = useState<ActualRankSubmission[]>([])
    const [loading, setLoading] = useState(true)
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

            {/* Main Table */}
            <Card className="glass border-white/5">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-white/5">
                    <div>
                        <CardTitle className="text-lg font-bold">2027 Calibration Database</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            Crowd-sourced actual ranks, marks, and aggregates used for trend prediction
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadSubmissions} className="border-white/10 h-9" disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </CardHeader>
                <CardContent className="pt-6">
                    {submissions.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p className="font-semibold text-sm">No calibration data yet.</p>
                            <p className="text-xs text-muted-foreground/60 mt-1">Submissions from Results Day Hub will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead className="text-xs uppercase tracking-wider">Submitted</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wider">Actual Rank</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wider">KCET Marks</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wider">PUCPCM Aggregate</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wider">12th Board</TableHead>
                                        <TableHead className="text-xs uppercase tracking-wider">Category</TableHead>
                                        <TableHead className="text-right text-xs uppercase tracking-wider">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {submissions.map(item => (
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

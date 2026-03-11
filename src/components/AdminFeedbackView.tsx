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
import { Trash2, Users, Medal, RefreshCw } from "lucide-react"
import { AdminFeedbackService, RankFeedbackEntry } from "@/lib/admin-feedback-service"
import { formatDistanceToNow } from "date-fns"

export default function AdminFeedbackView() {
    const [feedbacks, setFeedbacks] = useState<RankFeedbackEntry[]>([])
    const { toast } = useToast()

    const loadFeedback = () => {
        setFeedbacks(AdminFeedbackService.getAllFeedback())
    }

    useEffect(() => {
        loadFeedback()
    }, [])

    const handleDelete = (id: string) => {
        AdminFeedbackService.deleteFeedback(id)
        loadFeedback()
        toast({
            title: "Feedback Deleted",
            description: "The rank feedback entry has been removed.",
        })
    }

    const handleClearAll = () => {
        if (confirm("Are you sure you want to clear all feedback data? This cannot be undone.")) {
            AdminFeedbackService.clearAll()
            loadFeedback()
            toast({
                title: "All Feedback Cleared",
                description: "All rank feedback entries have been removed.",
            })
        }
    }

    // Basic Stats
    const totalEntries = feedbacks.length;
    const avgRank = totalEntries > 0 ? Math.round(feedbacks.reduce((sum, f) => sum + f.actual_rank, 0) / totalEntries) : 0;
    const avgMarks = totalEntries > 0 ? Math.round(feedbacks.reduce((sum, f) => sum + f.kcet_marks, 0) / totalEntries) : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-400" />
                            Total Submissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalEntries}</div>
                        <p className="text-xs text-muted-foreground mt-1">From 2025 Aspirants</p>
                    </CardContent>
                </Card>
                
                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Medal className="h-4 w-4 text-emerald-400" />
                            Average Rank
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-300">{avgRank > 0 ? avgRank.toLocaleString() : '--'}</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on submissions</p>
                    </CardContent>
                </Card>

                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Medal className="h-4 w-4 text-amber-400" />
                            Avg KCET Marks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-amber-300">{avgMarks > 0 ? avgMarks : '--'}</div>
                        <p className="text-xs text-muted-foreground mt-1">Out of 180</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <Card className="glass border-white/5">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Rank Predictor Feedback</CardTitle>
                        <CardDescription>Real data submitted by users to improve model accuracy</CardDescription>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={loadFeedback} className="border-white/10">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleClearAll} disabled={totalEntries === 0}>
                            Clear All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {totalEntries === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No feedback collected yet.</p>
                            <p className="text-sm text-muted-foreground/60 mt-1">When users submit their actual rankings, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead>Time</TableHead>
                                        <TableHead>Actual Rank</TableHead>
                                        <TableHead>KCET Marks</TableHead>
                                        <TableHead>PUC (%)</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {feedbacks.map((item) => (
                                        <TableRow key={item.id} className="border-white/5">
                                            <TableCell className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell className="font-mono text-indigo-300 font-medium text-lg">
                                                {item.actual_rank.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                                                    {item.kcet_marks} / 180
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">
                                                    {item.puc_marks}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
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
        </div>
    )
}

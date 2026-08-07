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
import { Trash2, Users, Medal, RefreshCw, Star, MessageSquare, Sparkles } from "lucide-react"
import { AdminFeedbackService, RankFeedbackEntry } from "@/lib/admin-feedback-service"
import { SiteReviewService } from "@/lib/site-review-service"
import { SiteReview } from "@/types/siteReview"
import { formatDistanceToNow } from "date-fns"

export default function AdminFeedbackView() {
    const [feedbacks, setFeedbacks] = useState<RankFeedbackEntry[]>([])
    const [siteReviews, setSiteReviews] = useState<SiteReview[]>([])
    const { toast } = useToast()

    const loadData = async () => {
        setFeedbacks(AdminFeedbackService.getAllFeedback())
        const siteRev = await SiteReviewService.getApprovedReviews()
        setSiteReviews(siteRev)
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleDeleteRankFeedback = (id: string) => {
        AdminFeedbackService.deleteFeedback(id)
        loadData()
        toast({
            title: "Feedback Deleted",
            description: "The rank feedback entry has been removed.",
        })
    }

    const handleClearAllRankFeedback = () => {
        if (confirm("Are you sure you want to clear all rank feedback data?")) {
            AdminFeedbackService.clearAll()
            loadData()
            toast({
                title: "All Feedback Cleared",
                description: "All rank feedback entries have been removed.",
            })
        }
    }

    const avgSiteRating = siteReviews.length > 0
        ? (siteReviews.reduce((sum, r) => sum + r.rating, 0) / siteReviews.length).toFixed(1)
        : "5.0";

    const totalEntries = feedbacks.length;
    const avgRank = totalEntries > 0 ? Math.round(feedbacks.reduce((sum, f) => sum + f.actual_rank, 0) / totalEntries) : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* ═══ Website Reviews & Aspirant Feedback Section ═══ */}
            <Card className="glass border-violet-500/20 bg-slate-950/40">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                            Website & Platform Reviews ({siteReviews.length})
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            Ratings & feedback submitted by students using KCET Coded tools and blog guides
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-amber-300">{avgSiteRating} / 5.0</span>
                    </div>
                </CardHeader>
                <CardContent>
                    {siteReviews.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs">No website reviews collected yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Student Name & Rank</TableHead>
                                        <TableHead>Review Comment</TableHead>
                                        <TableHead>Useful Tools</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {siteReviews.map((rev) => (
                                        <TableRow key={rev.id} className="border-white/5">
                                            <TableCell>
                                                <div className="flex items-center gap-1 text-amber-400">
                                                    {Array.from({ length: rev.rating }).map((_, i) => (
                                                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5">
                                                    <span className="text-xs font-semibold text-white block">{rev.name}</span>
                                                    {rev.rank && (
                                                        <span className="text-[10px] text-violet-400 font-mono block">{rev.rank}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="text-xs text-foreground/90 leading-relaxed italic">
                                                    "{rev.comment}"
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {rev.usefulTools.map((t, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-[10px] border-violet-500/30 text-violet-300">
                                                            {t}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(rev.createdAt), { addSuffix: true })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ═══ Rank Predictor Feedback Section ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-400" />
                            Rank Predictor Submissions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalEntries}</div>
                        <p className="text-xs text-muted-foreground mt-1">From 2025/2026 Aspirants</p>
                    </CardContent>
                </Card>
                
                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Medal className="h-4 w-4 text-emerald-400" />
                            Average Submitted Rank
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-emerald-300">{avgRank > 0 ? avgRank.toLocaleString() : '--'}</div>
                        <p className="text-xs text-muted-foreground mt-1">Based on student reports</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="glass border-white/5">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Rank Predictor Model Feedback</CardTitle>
                        <CardDescription>Rank calibration data submitted by users</CardDescription>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={loadData} className="border-white/10">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleClearAllRankFeedback} disabled={totalEntries === 0}>
                            Clear All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {totalEntries === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="text-xs">No rank feedback collected yet.</p>
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
                                                    onClick={() => handleDeleteRankFeedback(item.id)}
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

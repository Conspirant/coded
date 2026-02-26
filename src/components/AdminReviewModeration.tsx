import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    MessageSquare, Flag, Eye, EyeOff, Trash2, Search,
    CheckCircle, XCircle, AlertTriangle, Star, Shield, RefreshCw
} from "lucide-react"
import {
    getAllReviewsForAdmin, getReviewReports, getReviewStats,
    moderateReview, deleteReviewFromSupabase, dismissReport,
    markReportReviewed, CollegeReview, ReviewReport
} from "@/lib/college-service"

type TabMode = 'overview' | 'reported' | 'all'

const AdminReviewModeration = () => {
    const [tab, setTab] = useState<TabMode>('overview')
    const [reviews, setReviews] = useState<CollegeReview[]>([])
    const [reports, setReports] = useState<ReviewReport[]>([])
    const [stats, setStats] = useState({ totalReviews: 0, pendingReports: 0, hiddenReviews: 0, flaggedReviews: 0 })
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const loadAll = useCallback(async () => {
        setLoading(true)
        try {
            const [r, rep, s] = await Promise.all([
                getAllReviewsForAdmin(),
                getReviewReports(),
                getReviewStats()
            ])
            setReviews(r)
            setReports(rep)
            setStats(s)
        } catch (e) {
            console.error('Error loading moderation data:', e)
        }
        setLoading(false)
    }, [])

    useEffect(() => { loadAll() }, [loadAll])

    // Enrich reports with review data
    const enrichedReports = reports.map(rep => ({
        ...rep,
        review: reviews.find(r => r.id === rep.review_id)
    }))

    const pendingReports = enrichedReports.filter(r => r.status === 'pending')

    // Filter reviews by search
    const filteredReviews = reviews.filter(r => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
            r.review_text?.toLowerCase().includes(q) ||
            r.collegeName?.toLowerCase().includes(q) ||
            r.collegeCode?.toLowerCase().includes(q)
        )
    })

    const handleModerate = async (reviewId: string, status: 'visible' | 'hidden' | 'flagged') => {
        setActionLoading(reviewId)
        const success = await moderateReview(reviewId, status)
        if (success) await loadAll()
        setActionLoading(null)
    }

    const handleDeleteReview = async (reviewId: string) => {
        if (!confirm('Permanently delete this review? This cannot be undone.')) return
        setActionLoading(reviewId)
        const success = await deleteReviewFromSupabase(reviewId)
        if (success) await loadAll()
        setActionLoading(null)
    }

    const handleDismissReport = async (reportId: string) => {
        setActionLoading(reportId)
        await dismissReport(reportId)
        await loadAll()
        setActionLoading(null)
    }

    const handleReviewReport = async (reportId: string, reviewId: string) => {
        setActionLoading(reportId)
        await markReportReviewed(reportId)
        await moderateReview(reviewId, 'hidden')
        await loadAll()
        setActionLoading(null)
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'hidden': return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">Hidden</Badge>
            case 'flagged': return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">Flagged</Badge>
            default: return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Visible</Badge>
        }
    }

    const getReasonBadge = (reason: string) => {
        const config: Record<string, { color: string; label: string }> = {
            spam: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: '🚫 Spam' },
            offensive: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: '⚠️ Offensive' },
            fake: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: '🤥 Fake' },
            other: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: '📋 Other' },
        }
        const c = config[reason] || config.other
        return <Badge className={`${c.color} text-[10px]`}>{c.label}</Badge>
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading moderation data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: 'Total Reviews', value: stats.totalReviews, icon: MessageSquare, color: 'text-blue-400' },
                    { label: 'Pending Reports', value: stats.pendingReports, icon: Flag, color: stats.pendingReports > 0 ? 'text-red-400' : 'text-emerald-400' },
                    { label: 'Hidden', value: stats.hiddenReviews, icon: EyeOff, color: 'text-amber-400' },
                    { label: 'Flagged', value: stats.flaggedReviews, icon: AlertTriangle, color: 'text-orange-400' },
                ].map((s, i) => (
                    <Card key={i} className="glass border-white/5">
                        <CardContent className="py-3 px-4">
                            <div className="flex items-center gap-2">
                                <s.icon className={`h-4 w-4 ${s.color}`} />
                                <div>
                                    <p className="text-xs text-muted-foreground">{s.label}</p>
                                    <p className="text-lg font-bold">{s.value}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── Sub-tabs ── */}
            <div className="flex items-center gap-2 flex-wrap">
                {[
                    { key: 'overview' as const, label: 'Overview', icon: Shield },
                    { key: 'reported' as const, label: `Reported (${pendingReports.length})`, icon: Flag },
                    { key: 'all' as const, label: 'All Reviews', icon: MessageSquare },
                ].map(t => (
                    <Button key={t.key} variant={tab === t.key ? 'default' : 'outline'}
                        size="sm" onClick={() => setTab(t.key)}
                        className={`rounded-xl text-xs ${tab === t.key
                            ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30'
                            : 'border-white/10 text-muted-foreground'}`}>
                        <t.icon className="h-3.5 w-3.5 mr-1.5" />
                        {t.label}
                    </Button>
                ))}
                <Button variant="outline" size="sm" onClick={loadAll}
                    className="ml-auto border-white/10 text-muted-foreground rounded-xl text-xs">
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />Refresh
                </Button>
            </div>

            {/* ── Overview Tab ── */}
            {tab === 'overview' && (
                <div className="space-y-4">
                    <Card className="glass border-white/5">
                        <CardContent className="p-5">
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                                <Shield className="h-4 w-4 text-indigo-400" />
                                Moderation Summary
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="text-muted-foreground">Spam filter</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="text-muted-foreground">Profanity filter</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="text-muted-foreground">URL/Link blocking</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="text-muted-foreground">Report system</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="text-muted-foreground">Rate limiting</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">3/min</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="text-muted-foreground">XSS protection</span>
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">DOMPurify</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent reports preview */}
                    {pendingReports.length > 0 && (
                        <Card className="glass border-red-500/10">
                            <CardContent className="p-5">
                                <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-red-400">
                                    <Flag className="h-4 w-4" />
                                    Pending Reports ({pendingReports.length})
                                </h3>
                                <div className="space-y-2">
                                    {pendingReports.slice(0, 3).map(rep => (
                                        <div key={rep.id} className="rounded-xl bg-white/[0.02] border border-white/5 p-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {getReasonBadge(rep.reason)}
                                                        <span className="text-[10px] text-muted-foreground">
                                                            {new Date(rep.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-foreground/70 line-clamp-2">
                                                        {rep.review?.review_text || 'Review not found'}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">
                                                        {rep.review?.collegeName}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <Button variant="ghost" size="sm"
                                                        onClick={() => handleReviewReport(rep.id, rep.review_id)}
                                                        disabled={actionLoading === rep.id}
                                                        className="h-7 px-2 text-[10px] text-red-400 hover:bg-red-500/10 rounded-lg">
                                                        <EyeOff className="h-3 w-3 mr-1" />Hide
                                                    </Button>
                                                    <Button variant="ghost" size="sm"
                                                        onClick={() => handleDismissReport(rep.id)}
                                                        disabled={actionLoading === rep.id}
                                                        className="h-7 px-2 text-[10px] text-muted-foreground hover:bg-white/5 rounded-lg">
                                                        <XCircle className="h-3 w-3 mr-1" />Dismiss
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {pendingReports.length > 3 && (
                                        <Button variant="outline" size="sm" onClick={() => setTab('reported')}
                                            className="w-full border-white/10 text-xs rounded-xl">
                                            View all {pendingReports.length} reports →
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* ── Reported Tab ── */}
            {tab === 'reported' && (
                <div className="space-y-3">
                    {pendingReports.length === 0 ? (
                        <Card className="glass border-white/5">
                            <CardContent className="p-10 text-center">
                                <CheckCircle className="h-10 w-10 text-emerald-400/30 mx-auto mb-3" />
                                <h3 className="font-semibold mb-1">All Clear!</h3>
                                <p className="text-sm text-muted-foreground">No pending reports to review.</p>
                            </CardContent>
                        </Card>
                    ) : pendingReports.map(rep => (
                        <Card key={rep.id} className="glass border-white/5 hover:border-white/10 transition-colors">
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {/* Report header */}
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            {getReasonBadge(rep.reason)}
                                            <span className="text-[10px] text-muted-foreground">
                                                Reported {new Date(rep.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        {rep.review && getStatusBadge(rep.review.status)}
                                    </div>

                                    {/* Review content */}
                                    {rep.review ? (
                                        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold text-indigo-400">{rep.review.collegeName}</span>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                    <span className="text-xs font-bold text-amber-400">{rep.review.rating}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground/80">{rep.review.review_text}</p>
                                            <div className="text-[10px] text-muted-foreground">
                                                Posted {new Date(rep.review.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground italic">Original review not found (may have been deleted)</p>
                                    )}

                                    {rep.description && (
                                        <p className="text-xs text-muted-foreground bg-white/[0.02] rounded-lg p-2">
                                            <strong>Reporter note:</strong> {rep.description}
                                        </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <Button size="sm" onClick={() => handleReviewReport(rep.id, rep.review_id)}
                                            disabled={actionLoading === rep.id}
                                            className="rounded-xl text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20 h-8">
                                            <EyeOff className="h-3 w-3 mr-1" />Hide Review
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={() => handleDismissReport(rep.id)}
                                            disabled={actionLoading === rep.id}
                                            className="rounded-xl text-xs border-white/10 h-8">
                                            <XCircle className="h-3 w-3 mr-1" />Dismiss Report
                                        </Button>
                                        {rep.review && (
                                            <Button size="sm" variant="outline"
                                                onClick={() => handleDeleteReview(rep.review_id)}
                                                disabled={actionLoading === rep.id}
                                                className="rounded-xl text-xs border-red-500/20 text-red-400 hover:bg-red-500/10 h-8 ml-auto">
                                                <Trash2 className="h-3 w-3 mr-1" />Delete Forever
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* ── All Reviews Tab ── */}
            {tab === 'all' && (
                <div className="space-y-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search reviews by text, college..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-10 bg-white/5 border-white/10 rounded-xl" />
                    </div>

                    <p className="text-xs text-muted-foreground">{filteredReviews.length} reviews</p>

                    {filteredReviews.map(review => {
                        // Count reports for this review
                        const reviewReports = reports.filter(r => r.review_id === review.id)

                        return (
                            <Card key={review.id} className={`glass border-white/5 hover:border-white/10 transition-colors ${review.status === 'hidden' ? 'opacity-50' : ''}`}>
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="text-xs font-semibold text-indigo-400">{review.collegeName}</span>
                                                    <Badge variant="outline" className="text-[9px] font-mono bg-white/5 border-white/10">{review.collegeCode}</Badge>
                                                    {getStatusBadge(review.status)}
                                                    {reviewReports.length > 0 && (
                                                        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[9px]">
                                                            <Flag className="h-2.5 w-2.5 mr-0.5" />{reviewReports.length} report{reviewReports.length !== 1 ? 's' : ''}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-foreground/80 line-clamp-2">{review.review_text}</p>
                                                <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Star className="h-2.5 w-2.5 text-amber-400" />{review.rating}/5
                                                    </span>
                                                    <span>{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {review.status !== 'hidden' ? (
                                                    <Button variant="ghost" size="sm"
                                                        onClick={() => handleModerate(review.id, 'hidden')}
                                                        disabled={actionLoading === review.id}
                                                        className="h-7 px-2 text-[10px] text-amber-400 hover:bg-amber-500/10 rounded-lg"
                                                        title="Hide review">
                                                        <EyeOff className="h-3 w-3" />
                                                    </Button>
                                                ) : (
                                                    <Button variant="ghost" size="sm"
                                                        onClick={() => handleModerate(review.id, 'visible')}
                                                        disabled={actionLoading === review.id}
                                                        className="h-7 px-2 text-[10px] text-emerald-400 hover:bg-emerald-500/10 rounded-lg"
                                                        title="Make visible">
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="sm"
                                                    onClick={() => handleDeleteReview(review.id)}
                                                    disabled={actionLoading === review.id}
                                                    className="h-7 px-2 text-[10px] text-red-400 hover:bg-red-500/10 rounded-lg"
                                                    title="Delete permanently">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default AdminReviewModeration

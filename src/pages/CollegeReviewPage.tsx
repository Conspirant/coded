import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Star, MessageSquare, ArrowLeft, Share2, User, Calendar,
    CheckCircle, Trash2, Sparkles, PenLine, ThumbsUp, Flag, ShieldAlert, AlertTriangle, X
} from "lucide-react"
import {
    loadColleges, loadCollegeReviews, saveReviewToSupabase,
    deleteReview, isUserReview, reportReview, College, CollegeReview
} from "@/lib/college-service"
import {
    validateReviewText, validateRating, checkRateLimit, checkSpamContent,
    getUserIdentifier, VALIDATION_LIMITS, RATE_LIMITS
} from "@/lib/security"

/* ── Star helpers ── */
const StarRating = ({
    rating, onRatingChange, interactive = false, size = "md"
}: {
    rating: number; onRatingChange?: (r: number) => void; interactive?: boolean; size?: "sm" | "md" | "lg"
}) => {
    const s = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-7 w-7" }[size]
    const gap = size === "lg" ? "gap-1.5" : "gap-0.5"
    return (
        <div className={`flex items-center ${gap}`}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i}
                    className={`${s} transition-all ${i <= rating ? "fill-amber-400 text-amber-400" : "text-white/15"} ${interactive ? "cursor-pointer hover:text-amber-300 active:scale-125" : ""}`}
                    onClick={() => interactive && onRatingChange?.(i)}
                />
            ))}
        </div>
    )
}

const RatingBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-xs font-medium text-muted-foreground w-24 flex-shrink-0">{label}</span>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden flex-1">
            <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${(value / 5) * 100}%` }} />
        </div>
        <span className="text-xs font-bold tabular-nums w-8 text-right">{value.toFixed(1)}</span>
    </div>
)

const CategoryRatingInput = ({ label, rating, onRatingChange }: { label: string; rating: number; onRatingChange: (r: number) => void }) => (
    <div className="flex items-center justify-between py-3 px-3 rounded-xl bg-white/[0.02] border border-white/5">
        <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
        <StarRating rating={rating} onRatingChange={onRatingChange} interactive size="sm" />
    </div>
)

/* ── Page ── */
const CollegeReviewPage = () => {
    const { collegeCode } = useParams<{ collegeCode: string }>()
    const [college, setCollege] = useState<College | null>(null)
    const [reviews, setReviews] = useState<CollegeReview[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddReview, setShowAddReview] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [spamError, setSpamError] = useState<string[] | null>(null)
    const [reportingId, setReportingId] = useState<string | null>(null)
    const [reportedIds, setReportedIds] = useState<Set<string>>(new Set())
    const [reportSuccess, setReportSuccess] = useState<string | null>(null)
    const [newReview, setNewReview] = useState({
        rating: 0, review_text: "", faculty_rating: 1,
        infrastructure_rating: 1, placements_rating: 1,
        comment: "", course: "", graduation_year: new Date().getFullYear(),
    })
    const [showSharePopup, setShowSharePopup] = useState(false)

    const handlePopupShare = async () => {
        const url = window.location.origin
        const text = "Help build the biggest student-driven review database for KCET! Share your college experience on KCET Coded."

        if (navigator.share) {
            try { await navigator.share({ title: 'KCET Coded - College Reviews', text, url }) } catch { }
        } else {
            await navigator.clipboard.writeText(`${text} ${url}`)
            alert("Link copied to clipboard! Share it with your friends.")
        }
        setShowSharePopup(false)
    }

    useEffect(() => {
        const load = async () => {
            try {
                const colleges = await loadColleges()
                const found = colleges.find(c => c.code === collegeCode?.toUpperCase())
                if (found) setCollege(found)
                const all = await loadCollegeReviews()
                setReviews(all.filter(r => r.collegeCode === collegeCode?.toUpperCase()))
            } catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        load()
    }, [collegeCode])

    const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
    const avgCats = reviews.length > 0 ? {
        placements: reviews.reduce((s, r) => s + r.placements_rating, 0) / reviews.length,
        faculty: reviews.reduce((s, r) => s + r.faculty_rating, 0) / reviews.length,
        infrastructure: reviews.reduce((s, r) => s + r.infrastructure_rating, 0) / reviews.length,
    } : null

    const handleShare = async () => {
        const url = window.location.href
        if (navigator.share) {
            try { await navigator.share({ title: `Review ${college?.name}`, url }) } catch { }
        } else {
            await navigator.clipboard.writeText(url)
            alert("Link copied!")
        }
    }

    const handleSubmit = async () => {
        setSpamError(null)
        const uid = getUserIdentifier()
        const rl = checkRateLimit(uid, RATE_LIMITS.REVIEW_SUBMISSION)
        if (!rl.allowed) { alert(`Too many submissions. Wait until ${new Date(rl.resetTime).toLocaleTimeString()}.`); return }
        if (!newReview.rating || !newReview.review_text.trim()) { alert("Please provide a rating and review text."); return }
        const tv = validateReviewText(newReview.review_text); if (!tv.isValid) { alert(tv.error); return }
        const rv = validateRating(newReview.rating); if (!rv.isValid) { alert(rv.error); return }

        // ── Spam filter ──
        const spam = checkSpamContent(newReview.review_text)
        if (spam.isSpam) { setSpamError(spam.reasons); return }

        try {
            setSubmitting(true)
            const saved = await saveReviewToSupabase({
                collegeCode: college!.code, rating: newReview.rating,
                review_text: tv.sanitized, faculty_rating: newReview.faculty_rating,
                infrastructure_rating: newReview.infrastructure_rating,
                placements_rating: newReview.placements_rating,
                comment: newReview.comment || tv.sanitized,
                course: newReview.course, graduation_year: newReview.graduation_year,
            })
            if (saved) {
                setReviews(prev => [saved, ...prev])
                setNewReview({ rating: 0, review_text: "", faculty_rating: 1, infrastructure_rating: 1, placements_rating: 1, comment: "", course: "", graduation_year: new Date().getFullYear() })
                setShowAddReview(false)
                setShowSharePopup(true)
            } else { alert("Failed to save review.") }
        } catch (e: any) { alert(`Error: ${e.message || "Unknown"}`) }
        finally { setSubmitting(false) }
    }

    const handleReport = async (reviewId: string, reason: 'spam' | 'offensive' | 'fake' | 'other') => {
        const success = await reportReview(reviewId, reason)
        if (success) {
            setReportedIds(prev => new Set(prev).add(reviewId))
            setReportSuccess(reviewId)
            setTimeout(() => setReportSuccess(null), 3000)
        } else {
            alert("Failed to report. Please try again.")
        }
        setReportingId(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this review?")) return
        try {
            if (await deleteReview(id)) setReviews(prev => prev.filter(r => r.id !== id))
            else alert("Failed to delete.")
        } catch (e: any) { alert(`Error: ${e.message}`) }
    }

    /* ── Loading ── */
    if (loading) return (
        <div className="max-w-3xl mx-auto space-y-4 px-1">
            <div className="rounded-2xl glass border border-white/5 p-5 sm:p-8 animate-pulse">
                <div className="h-6 bg-white/5 rounded-lg w-48 mb-3" />
                <div className="h-4 bg-white/5 rounded-lg w-full max-w-xs mb-6" />
                <div className="space-y-3"><div className="h-16 bg-white/5 rounded-xl" /><div className="h-16 bg-white/5 rounded-xl" /></div>
            </div>
        </div>
    )

    /* ── Not found ── */
    if (!college) return (
        <div className="max-w-3xl mx-auto px-1">
            <div className="rounded-2xl glass border border-white/5 p-8 sm:p-12 text-center">
                <h2 className="text-lg font-bold mb-2">College Not Found</h2>
                <p className="text-sm text-muted-foreground mb-4">No college with code "{collegeCode}"</p>
                <Link to="/reviews">
                    <Button variant="outline" className="rounded-xl border-white/10 h-11">
                        <ArrowLeft className="h-4 w-4 mr-2" />Browse All
                    </Button>
                </Link>
            </div>
        </div>
    )

    /* ── Full Page ── */
    return (
        <div className="max-w-3xl mx-auto space-y-4 px-1">

            {/* ═══ Top Bar ═══ */}
            <div className="flex items-center justify-between">
                <Link to="/reviews">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground rounded-xl h-10 px-3">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">All Reviews</span>
                    </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleShare}
                    className="rounded-xl border-white/10 text-muted-foreground hover:text-foreground h-10 px-3">
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Share</span>
                </Button>
            </div>

            {/* ═══ College Header ═══ */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
                className="relative overflow-hidden rounded-2xl glass border border-white/5 p-4 sm:p-6">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-indigo-500/8 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <h1 className="text-base sm:text-xl lg:text-2xl font-bold tracking-tight mb-2 leading-snug">{college.name}</h1>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="font-mono text-[10px] bg-white/5 border-white/10">{college.code}</Badge>
                        {reviews.length > 0 && (
                            <div className="flex items-center gap-1.5">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-semibold text-amber-400">{avgRating.toFixed(1)}</span>
                                <span className="text-[11px] text-muted-foreground">· {reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* ═══ Average Ratings ═══ */}
            {avgCats && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                    className="rounded-xl glass border border-white/5 p-4 sm:p-5">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Average Ratings</h4>
                    <div className="space-y-2.5">
                        <RatingBar label="Placements" value={avgCats.placements} color="bg-emerald-400" />
                        <RatingBar label="Faculty" value={avgCats.faculty} color="bg-blue-400" />
                        <RatingBar label="Infrastructure" value={avgCats.infrastructure} color="bg-purple-400" />
                    </div>
                </motion.div>
            )}

            {/* ═══ Reviews Header + CTA ═══ */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Reviews ({reviews.length})</h3>
                    <Button onClick={() => setShowAddReview(!showAddReview)} size="sm"
                        className={`rounded-xl text-xs font-semibold h-10 px-4 transition-all ${showAddReview
                            ? "bg-white/10 text-muted-foreground hover:bg-white/15 border border-white/10"
                            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0"}`}>
                        {showAddReview ? "Cancel" : <><PenLine className="h-3.5 w-3.5 mr-1.5" />Write Review</>}
                    </Button>
                </div>

                {/* ── Review Form ── */}
                {showAddReview && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl glass border border-indigo-500/20 p-4 sm:p-5 space-y-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="h-4 w-4 text-indigo-400" />
                            <h4 className="font-semibold text-sm">Share Your Experience</h4>
                        </div>

                        {/* Overall Rating — big touch targets */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Overall Rating *</Label>
                            <div className="py-1">
                                <StarRating rating={newReview.rating} onRatingChange={r => setNewReview(p => ({ ...p, rating: r }))} interactive size="lg" />
                            </div>
                        </div>

                        {/* Review Text */}
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Your Review *</Label>
                            <Textarea value={newReview.review_text}
                                onChange={e => setNewReview(p => ({ ...p, review_text: e.target.value }))}
                                placeholder="Share your experience..."
                                rows={4} maxLength={VALIDATION_LIMITS.MAX_REVIEW_LENGTH}
                                className="rounded-xl bg-white/5 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 resize-none text-sm min-h-[100px]" />
                            <div className="text-[10px] text-muted-foreground text-right tabular-nums">{newReview.review_text.length}/{VALIDATION_LIMITS.MAX_REVIEW_LENGTH}</div>
                        </div>

                        {/* Course & Year — stacked on mobile */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Course</Label>
                                <Input value={newReview.course} onChange={e => setNewReview(p => ({ ...p, course: e.target.value }))}
                                    placeholder="CS, ECE..." maxLength={50}
                                    className="rounded-xl bg-white/5 border-white/10 focus:border-indigo-500/50 text-sm h-10" />
                            </div>
                            <div className="space-y-1">
                                <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Grad Year</Label>
                                <Input type="number" value={newReview.graduation_year}
                                    onChange={e => setNewReview(p => ({ ...p, graduation_year: parseInt(e.target.value) || new Date().getFullYear() }))}
                                    min="2000" max="2035" className="rounded-xl bg-white/5 border-white/10 focus:border-indigo-500/50 text-sm h-10" />
                            </div>
                        </div>

                        {/* Category Ratings — stacked on mobile for big touch targets */}
                        <div className="space-y-1.5">
                            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Category Ratings</Label>
                            <div className="space-y-2">
                                <CategoryRatingInput label="Placements" rating={newReview.placements_rating} onRatingChange={r => setNewReview(p => ({ ...p, placements_rating: r }))} />
                                <CategoryRatingInput label="Faculty" rating={newReview.faculty_rating} onRatingChange={r => setNewReview(p => ({ ...p, faculty_rating: r }))} />
                                <CategoryRatingInput label="Infrastructure" rating={newReview.infrastructure_rating} onRatingChange={r => setNewReview(p => ({ ...p, infrastructure_rating: r }))} />
                            </div>
                        </div>

                        {/* ── Spam Error Alert ── */}
                        <AnimatePresence>
                            {spamError && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                    className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 space-y-1.5">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-xs font-semibold">Review blocked by safety filter</span>
                                        <button onClick={() => setSpamError(null)} className="ml-auto p-0.5 hover:bg-red-500/20 rounded">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <ul className="space-y-0.5 pl-6">
                                        {spamError.map((r, i) => (
                                            <li key={i} className="text-[11px] text-red-300/80 list-disc">{r}</li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit — full width on mobile */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <Button onClick={handleSubmit} disabled={submitting || !newReview.rating || !newReview.review_text.trim()}
                                className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0 text-sm font-semibold h-11 disabled:opacity-40 w-full sm:w-auto">
                                {submitting ? "Submitting..." : "Submit Review"}
                            </Button>
                            <Button variant="outline" onClick={() => setShowAddReview(false)}
                                className="rounded-xl border-white/10 text-muted-foreground hover:bg-white/5 text-sm h-11 w-full sm:w-auto">
                                Cancel
                            </Button>
                        </div>

                        {/* Safety notice */}
                        <div className="flex items-start gap-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-2.5">
                            <ShieldAlert className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <p className="text-[10px] text-emerald-300/70 leading-relaxed">
                                Your review is checked for spam, profanity, and inappropriate content before submission. No personal data is collected — reviews are fully anonymous.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* ── Reviews List ── */}
                {reviews.length > 0 ? (
                    <div className="space-y-3">
                        {reviews.map((review, i) => (
                            <motion.div key={review.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.04 * Math.min(i, 8) }}
                                className="rounded-xl glass border border-white/5 hover:border-white/10 transition-colors p-4">
                                <div className="space-y-3">
                                    {/* Author row */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                                <User className="h-4 w-4 text-indigo-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-semibold truncate">{review.author}</span>
                                                    {review.verified && <CheckCircle className="h-3 w-3 text-emerald-400 flex-shrink-0" />}
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                    <Calendar className="h-2.5 w-2.5" />
                                                    <span>{new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <StarRating rating={review.rating} size="sm" />
                                    </div>

                                    {/* Review text */}
                                    <p className="text-sm text-foreground/80 leading-relaxed">{review.review_text}</p>

                                    {/* Sub-ratings — compact row on mobile */}
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-muted-foreground">
                                        <span className="flex items-center gap-1"><Star className="h-2.5 w-2.5 text-emerald-400" />Placements {review.placements_rating}/5</span>
                                        <span className="flex items-center gap-1"><Star className="h-2.5 w-2.5 text-blue-400" />Faculty {review.faculty_rating}/5</span>
                                        <span className="flex items-center gap-1"><Star className="h-2.5 w-2.5 text-purple-400" />Infra {review.infrastructure_rating}/5</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <ThumbsUp className="h-3 w-3" /><span className="font-medium">{review.helpful_votes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {/* Report button (not for own reviews) */}
                                            {!isUserReview(review) && (
                                                <div className="relative">
                                                    {reportedIds.has(review.id) || reportSuccess === review.id ? (
                                                        <span className="flex items-center gap-1 text-[10px] text-amber-400/70 px-2 py-1">
                                                            <CheckCircle className="h-3 w-3" />Reported
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <Button variant="ghost" size="sm"
                                                                onClick={() => setReportingId(reportingId === review.id ? null : review.id)}
                                                                className="h-8 px-2 text-muted-foreground/50 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg text-[10px]">
                                                                <Flag className="h-3 w-3 mr-1" />Report
                                                            </Button>
                                                            {/* Report dropdown */}
                                                            <AnimatePresence>
                                                                {reportingId === review.id && (
                                                                    <motion.div
                                                                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                                                        className="absolute right-0 bottom-full mb-1 z-50 w-44 rounded-xl glass border border-white/10 shadow-xl shadow-black/30 p-1.5 space-y-0.5">
                                                                        <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1">Report as:</p>
                                                                        {[
                                                                            { key: 'spam' as const, label: '🚫 Spam', desc: 'Irrelevant or promotional' },
                                                                            { key: 'offensive' as const, label: '⚠️ Offensive', desc: 'Hateful or abusive' },
                                                                            { key: 'fake' as const, label: '🤥 Fake Review', desc: 'Misleading or false' },
                                                                            { key: 'other' as const, label: '📋 Other', desc: 'Other reason' },
                                                                        ].map(opt => (
                                                                            <button key={opt.key}
                                                                                onClick={() => handleReport(review.id, opt.key)}
                                                                                className="w-full text-left rounded-lg px-2.5 py-1.5 hover:bg-white/5 transition-colors">
                                                                                <div className="text-[11px] font-medium">{opt.label}</div>
                                                                                <div className="text-[9px] text-muted-foreground/60">{opt.desc}</div>
                                                                            </button>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {/* Delete button (own reviews only) */}
                                            {isUserReview(review) && (
                                                <Button variant="ghost" size="sm" onClick={() => handleDelete(review.id)}
                                                    className="h-8 px-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-[10px]">
                                                    <Trash2 className="h-3 w-3 mr-1" />Delete
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : !showAddReview ? (
                    <div className="rounded-xl glass border border-white/5 p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="h-7 w-7 text-muted-foreground/30" />
                        </div>
                        <h3 className="font-semibold mb-1.5 text-sm">No reviews yet</h3>
                        <p className="text-xs text-muted-foreground mb-4">Be the first to share your experience!</p>
                        <Button onClick={() => setShowAddReview(true)} size="sm"
                            className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0 text-sm font-semibold h-11 px-6">
                            <PenLine className="h-3.5 w-3.5 mr-1.5" />Write First Review
                        </Button>
                    </div>
                ) : null}
            </motion.div>
            {/* Share Post-Review Popup */}
            <Dialog open={showSharePopup} onOpenChange={setShowSharePopup}>
                <DialogContent className="sm:max-w-md glass border-indigo-500/20">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Sparkles className="h-5 w-5 text-indigo-400" />
                            Thank You for Your Review!
                        </DialogTitle>
                        <DialogDescription className="text-sm pt-2 text-foreground/80 leading-relaxed">
                            To help us build the most comprehensive database for KCET students, please <strong>share this website with your circle of friends</strong> so we can accumulate as many helpful reviews as possible!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 mt-4">
                        <Button onClick={handlePopupShare} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0 h-12 text-base">
                            <Share2 className="h-5 w-5 mr-2" />
                            Share with Friends
                        </Button>
                        <Button variant="outline" onClick={() => setShowSharePopup(false)} className="w-full border-white/10 text-muted-foreground hover:bg-white/5 h-10">
                            Maybe Later
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CollegeReviewPage

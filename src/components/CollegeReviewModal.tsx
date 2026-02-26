import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, MessageSquare, ThumbsUp, User, Calendar, CheckCircle, Trash2, Sparkles, PenLine } from "lucide-react"
import { College, CollegeReview, saveReviewToSupabase, deleteReview, isUserReview } from "@/lib/college-service"
import {
  validateReviewText,
  validateRating,
  checkRateLimit,
  getUserIdentifier,
  VALIDATION_LIMITS,
  RATE_LIMITS
} from "@/lib/security"

interface CollegeReviewModalProps {
  college: College | null;
  reviews: CollegeReview[];
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: CollegeReview) => void;
  onDeleteReview: (reviewId: string) => void;
}

const StarRating = ({
  rating,
  onRatingChange,
  interactive = false,
  size = "md"
}: {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
}) => {
  const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" }
  const starSize = sizeMap[size]
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} transition-all ${star <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-white/10"
            } ${interactive ? "cursor-pointer hover:text-amber-300 hover:scale-110" : ""}`}
          onClick={() => interactive && onRatingChange?.(star)}
        />
      ))}
    </div>
  );
};

const RatingBar = ({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-xs font-bold tabular-nums">{value.toFixed(1)}/5</span>
    </div>
    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
      <div
        className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${(value / 5) * 100}%` }}
      />
    </div>
  </div>
);

const CategoryRatingInput = ({
  label,
  rating,
  onRatingChange,
}: {
  label: string;
  rating: number;
  onRatingChange: (rating: number) => void;
}) => (
  <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5">
    <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
    <StarRating rating={rating} onRatingChange={onRatingChange} interactive size="sm" />
  </div>
);

export const CollegeReviewModal = ({
  college,
  reviews,
  isOpen,
  onClose,
  onAddReview,
  onDeleteReview
}: CollegeReviewModalProps) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    review_text: "",
    faculty_rating: 1,
    infrastructure_rating: 1,
    placements_rating: 1,
    comment: "",
    course: "",
    graduation_year: new Date().getFullYear(),
  });

  if (!college) return null;

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const avgCategories = reviews.length > 0 ? {
    placements: reviews.reduce((sum, r) => sum + r.placements_rating, 0) / reviews.length,
    faculty: reviews.reduce((sum, r) => sum + r.faculty_rating, 0) / reviews.length,
    infrastructure: reviews.reduce((sum, r) => sum + r.infrastructure_rating, 0) / reviews.length,
  } : null;

  const handleSubmitReview = async () => {
    const userIdentifier = getUserIdentifier();
    const rateLimitCheck = checkRateLimit(userIdentifier, RATE_LIMITS.REVIEW_SUBMISSION);

    if (!rateLimitCheck.allowed) {
      const resetTime = new Date(rateLimitCheck.resetTime).toLocaleTimeString();
      alert(`Too many submissions. Please wait until ${resetTime}.`);
      return;
    }

    if (newReview.rating === 0 || !newReview.review_text) {
      alert("Please provide a rating and review text.");
      return;
    }

    const textValidation = validateReviewText(newReview.review_text);
    if (!textValidation.isValid) { alert(textValidation.error); return; }

    const ratingValidation = validateRating(newReview.rating);
    if (!ratingValidation.isValid) { alert(ratingValidation.error); return; }

    const facultyValidation = validateRating(newReview.faculty_rating);
    if (!facultyValidation.isValid) { alert(`Faculty: ${facultyValidation.error}`); return; }

    const infraValidation = validateRating(newReview.infrastructure_rating);
    if (!infraValidation.isValid) { alert(`Infrastructure: ${infraValidation.error}`); return; }

    const placementsValidation = validateRating(newReview.placements_rating);
    if (!placementsValidation.isValid) { alert(`Placements: ${placementsValidation.error}`); return; }

    try {
      setSubmitting(true);
      const savedReview = await saveReviewToSupabase({
        collegeCode: college.code,
        rating: newReview.rating,
        review_text: textValidation.sanitized,
        faculty_rating: newReview.faculty_rating,
        infrastructure_rating: newReview.infrastructure_rating,
        placements_rating: newReview.placements_rating,
        comment: newReview.comment || textValidation.sanitized,
        course: newReview.course,
        graduation_year: newReview.graduation_year,
      });

      if (savedReview) {
        onAddReview(savedReview);
        setNewReview({
          rating: 0, review_text: "", faculty_rating: 1,
          infrastructure_rating: 1, placements_rating: 1,
          comment: "", course: "", graduation_year: new Date().getFullYear(),
        });
        setShowAddReview(false);
      } else {
        alert("Failed to save review. Please try again.");
      }
    } catch (error: any) {
      console.error("Error saving review:", error);
      alert(`Failed to save review: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;

    try {
      const success = await deleteReview(reviewId);
      if (success) {
        onDeleteReview(reviewId);
      } else {
        alert("Failed to delete review.");
      }
    } catch (error: any) {
      console.error("Error deleting review:", error);
      alert(`Failed to delete: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-2xl border-white/10 mx-2 sm:mx-0 rounded-2xl"
        aria-describedby="college-review-modal-description"
      >
        {/* ═══ Header ═══ */}
        <DialogHeader className="space-y-4 pb-4 border-b border-white/5">
          <div>
            <DialogTitle className="text-lg sm:text-xl font-bold break-words leading-tight mb-2">
              {college.name}
            </DialogTitle>
            <p id="college-review-modal-description" className="sr-only">
              Reviews for {college.name} ({college.code})
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="font-mono text-[10px] bg-white/5 border-white/10">
                {college.code}
              </Badge>
              {reviews.length > 0 && (
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(averageRating)} size="sm" />
                  <span className="text-sm font-semibold text-amber-400">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* ═══ Average Ratings Overview ═══ */}
          {avgCategories && (
            <div className="rounded-xl glass border border-white/5 p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Average Ratings
              </h4>
              <div className="space-y-3">
                <RatingBar label="Placements" value={avgCategories.placements} color="bg-emerald-400" />
                <RatingBar label="Faculty" value={avgCategories.faculty} color="bg-blue-400" />
                <RatingBar label="Infrastructure" value={avgCategories.infrastructure} color="bg-purple-400" />
              </div>
            </div>
          )}

          {/* ═══ Reviews Section ═══ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Reviews ({reviews.length})
              </h3>
              <Button
                onClick={() => setShowAddReview(!showAddReview)}
                size="sm"
                className={`rounded-xl text-xs font-semibold transition-all ${showAddReview
                    ? "bg-white/10 text-muted-foreground hover:bg-white/15 border border-white/10"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0"
                  }`}
              >
                {showAddReview ? (
                  <>Cancel</>
                ) : (
                  <>
                    <PenLine className="h-3.5 w-3.5 mr-1.5" />
                    Write Review
                  </>
                )}
              </Button>
            </div>

            {/* ═══ Add Review Form ═══ */}
            {showAddReview && (
              <div className="rounded-xl glass border border-indigo-500/20 p-5 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <h4 className="font-semibold text-sm">Share Your Experience</h4>
                </div>

                {/* Overall Rating */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Overall Rating *
                  </Label>
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                    interactive
                    size="lg"
                  />
                </div>

                {/* Review Text */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Review *
                  </Label>
                  <Textarea
                    value={newReview.review_text}
                    onChange={(e) => setNewReview(prev => ({ ...prev, review_text: e.target.value }))}
                    placeholder="Share your detailed experience about this college..."
                    rows={4}
                    maxLength={VALIDATION_LIMITS.MAX_REVIEW_LENGTH}
                    className="rounded-xl bg-white/5 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 resize-none text-sm"
                  />
                  <div className="text-[10px] text-muted-foreground text-right tabular-nums">
                    {newReview.review_text.length}/{VALIDATION_LIMITS.MAX_REVIEW_LENGTH}
                  </div>
                </div>

                {/* Course & Year */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Course (Optional)
                    </Label>
                    <Input
                      value={newReview.course}
                      onChange={(e) => setNewReview(prev => ({ ...prev, course: e.target.value }))}
                      placeholder="e.g., CS, ECE"
                      maxLength={50}
                      className="rounded-xl bg-white/5 border-white/10 focus:border-indigo-500/50 text-sm h-9"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Grad Year (Optional)
                    </Label>
                    <Input
                      type="number"
                      value={newReview.graduation_year}
                      onChange={(e) => setNewReview(prev => ({ ...prev, graduation_year: parseInt(e.target.value) || new Date().getFullYear() }))}
                      min="2000"
                      max="2035"
                      className="rounded-xl bg-white/5 border-white/10 focus:border-indigo-500/50 text-sm h-9"
                    />
                  </div>
                </div>

                {/* Category Ratings */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Category Ratings
                  </Label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <CategoryRatingInput
                      label="Placements"
                      rating={newReview.placements_rating}
                      onRatingChange={(r) => setNewReview(prev => ({ ...prev, placements_rating: r }))}
                    />
                    <CategoryRatingInput
                      label="Faculty"
                      rating={newReview.faculty_rating}
                      onRatingChange={(r) => setNewReview(prev => ({ ...prev, faculty_rating: r }))}
                    />
                    <CategoryRatingInput
                      label="Infrastructure"
                      rating={newReview.infrastructure_rating}
                      onRatingChange={(r) => setNewReview(prev => ({ ...prev, infrastructure_rating: r }))}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={submitting || newReview.rating === 0 || !newReview.review_text.trim()}
                    className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0 text-sm font-semibold disabled:opacity-40"
                  >
                    {submitting ? "Submitting..." : "Submit Review"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddReview(false)}
                    className="rounded-xl border-white/10 text-muted-foreground hover:bg-white/5 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* ═══ Reviews List ═══ */}
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl glass border border-white/5 hover:border-white/10 transition-colors p-4 sm:p-5"
                  >
                    <div className="space-y-3">
                      {/* Review header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-indigo-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">{review.author}</span>
                              {review.verified && (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <Calendar className="h-2.5 w-2.5" />
                              <span>{new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>

                      {/* Review content */}
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {review.review_text}
                      </p>

                      {/* Review footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 text-emerald-400" />
                            Placements: {review.placements_rating}/5
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 text-blue-400" />
                            Faculty: {review.faculty_rating}/5
                          </span>
                          <span className="flex items-center gap-1 hidden sm:flex">
                            <Star className="h-2.5 w-2.5 text-purple-400" />
                            Infra: {review.infrastructure_rating}/5
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            <span className="font-medium">{review.helpful_votes}</span>
                          </div>
                          {isUserReview(review) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteReview(review.id)}
                              className="h-6 w-6 p-0 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                              title="Delete your review"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : !showAddReview ? (
              <div className="rounded-xl glass border border-white/5 p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-7 w-7 text-muted-foreground/30" />
                </div>
                <h3 className="font-semibold mb-1.5">No reviews yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to share your experience with this college!
                </p>
                <Button
                  onClick={() => setShowAddReview(true)}
                  size="sm"
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0 text-sm font-semibold"
                >
                  <PenLine className="h-3.5 w-3.5 mr-1.5" />
                  Write First Review
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, MessageSquare, ThumbsUp, User, Calendar, CheckCircle, Trash2, AlertCircle } from "lucide-react"
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
  interactive = false 
}: { 
  rating: number; 
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:text-yellow-300" : ""}`}
          onClick={() => interactive && onRatingChange?.(star)}
        />
      ))}
    </div>
  );
};

const CategoryRating = ({ 
  label, 
  rating, 
  onRatingChange, 
  interactive = false 
}: { 
  label: string; 
  rating: number; 
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-sm font-medium text-gray-300">{label}</Label>
      <StarRating 
        rating={rating} 
        onRatingChange={onRatingChange}
        interactive={interactive}
      />
    </div>
  );
};

export const CollegeReviewModal = ({ 
  college, 
  reviews, 
  isOpen, 
  onClose, 
  onAddReview,
  onDeleteReview
}: CollegeReviewModalProps) => {
  const [showAddReview, setShowAddReview] = useState(false);
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
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const averageCategories = reviews.length > 0 ? {
    placements: (reviews.reduce((sum, review) => sum + review.placements_rating, 0) / reviews.length).toFixed(1),
    faculty: (reviews.reduce((sum, review) => sum + review.faculty_rating, 0) / reviews.length).toFixed(1),
    infrastructure: (reviews.reduce((sum, review) => sum + review.infrastructure_rating, 0) / reviews.length).toFixed(1),
  } : null;

  const handleSubmitReview = async () => {
    // Check rate limiting first
    const userIdentifier = getUserIdentifier();
    const rateLimitCheck = checkRateLimit(userIdentifier, RATE_LIMITS.REVIEW_SUBMISSION);
    
    if (!rateLimitCheck.allowed) {
      const resetTime = new Date(rateLimitCheck.resetTime).toLocaleTimeString();
      alert(`Too many review submissions. Please wait until ${resetTime} before submitting another review.`);
      return;
    }

    // Validate required fields
    if (newReview.rating === 0 || !newReview.review_text) {
      alert("Please fill in all required fields and provide a rating");
      return;
    }

    // Validate review text
    const textValidation = validateReviewText(newReview.review_text);
    if (!textValidation.isValid) {
      alert(textValidation.error);
      return;
    }

    // Validate ratings
    const ratingValidation = validateRating(newReview.rating);
    if (!ratingValidation.isValid) {
      alert(ratingValidation.error);
      return;
    }

    const facultyValidation = validateRating(newReview.faculty_rating);
    if (!facultyValidation.isValid) {
      alert(`Faculty rating: ${facultyValidation.error}`);
      return;
    }

    const infrastructureValidation = validateRating(newReview.infrastructure_rating);
    if (!infrastructureValidation.isValid) {
      alert(`Infrastructure rating: ${infrastructureValidation.error}`);
      return;
    }

    const placementsValidation = validateRating(newReview.placements_rating);
    if (!placementsValidation.isValid) {
      alert(`Placements rating: ${placementsValidation.error}`);
      return;
    }

    try {
      const savedReview = await saveReviewToSupabase({
        collegeCode: college.code,
        rating: newReview.rating,
        review_text: textValidation.sanitized, // Use sanitized text
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
          rating: 0,
          review_text: "",
          faculty_rating: 1,
          infrastructure_rating: 1,
          placements_rating: 1,
          comment: "",
          course: "",
          graduation_year: new Date().getFullYear(),
        });
        setShowAddReview(false);
      } else {
        console.error('Review save returned null');
        alert("Failed to save review. Please check the console for details and try again.");
      }
    } catch (error) {
      console.error("Error saving review:", error);
      alert(`Failed to save review: ${error.message || 'Unknown error'}. Please check the console for details.`);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      return;
    }

    try {
      const success = await deleteReview(reviewId);
      if (success) {
        onDeleteReview(reviewId);
      } else {
        alert("Failed to delete review. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(`Failed to delete review: ${error.message || 'Unknown error'}. Please try again.`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 mx-4 sm:mx-0"
        aria-describedby="college-review-modal-description"
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-lg sm:text-2xl font-bold break-words text-white leading-tight">{college.name}</DialogTitle>
          <p id="college-review-modal-description" className="sr-only">
            View and manage reviews for {college.name} ({college.code}). {reviews.length > 0 ? `Currently showing ${reviews.length} review${reviews.length !== 1 ? 's' : ''}.` : 'No reviews available yet.'}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <Badge variant="outline" className="bg-gray-700 text-gray-200 border-gray-600 w-fit">{college.code}</Badge>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <StarRating rating={Math.round(parseFloat(averageRating.toString()))} />
                <span className="text-xs sm:text-sm">{averageRating}/5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Average Ratings */}
          {averageCategories && (
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-lg text-white">Average Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CategoryRating label="Placements" rating={parseFloat(averageCategories.placements)} />
                  <CategoryRating label="Faculty" rating={parseFloat(averageCategories.faculty)} />
                  <CategoryRating label="Infrastructure" rating={parseFloat(averageCategories.infrastructure)} />
                </div>
              </CardContent>
            </Card>
          )}

            {/* Reviews Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-white">Reviews ({reviews.length})</h3>
                <Button onClick={() => setShowAddReview(!showAddReview)} className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base w-full sm:w-auto">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {showAddReview ? "Cancel" : "Add Review"}
                </Button>
              </div>

            {/* Add Review Form */}
            {showAddReview && (
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white">Write a Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Overall Rating *</Label>
                    <StarRating 
                      rating={newReview.rating} 
                      onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                      interactive
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-white">Your Review *</Label>
                    <Textarea
                      value={newReview.review_text}
                      onChange={(e) => setNewReview(prev => ({ ...prev, review_text: e.target.value }))}
                      placeholder="Share your detailed experience..."
                      rows={4}
                      maxLength={VALIDATION_LIMITS.MAX_REVIEW_LENGTH}
                      className="border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                    <div className="text-xs text-gray-400 text-right">
                      {newReview.review_text.length}/{VALIDATION_LIMITS.MAX_REVIEW_LENGTH} characters
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Course (Optional)</Label>
                      <Input
                        value={newReview.course}
                        onChange={(e) => setNewReview(prev => ({ ...prev, course: e.target.value }))}
                        placeholder="e.g., Computer Science"
                        maxLength={50}
                        className="border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Graduation Year (Optional)</Label>
                      <Input
                        type="number"
                        value={newReview.graduation_year}
                        onChange={(e) => setNewReview(prev => ({ ...prev, graduation_year: parseInt(e.target.value) || new Date().getFullYear() }))}
                        placeholder="2024"
                        min="2000"
                        max="2030"
                        className="border-2 border-gray-600 bg-gray-800 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white text-sm">Category Ratings</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <CategoryRating 
                        label="Placements" 
                        rating={newReview.placements_rating} 
                        onRatingChange={(rating) => setNewReview(prev => ({ 
                          ...prev, 
                          placements_rating: rating
                        }))}
                        interactive
                      />
                      <CategoryRating 
                        label="Faculty" 
                        rating={newReview.faculty_rating} 
                        onRatingChange={(rating) => setNewReview(prev => ({ 
                          ...prev, 
                          faculty_rating: rating
                        }))}
                        interactive
                      />
                      <CategoryRating 
                        label="Infrastructure" 
                        rating={newReview.infrastructure_rating} 
                        onRatingChange={(rating) => setNewReview(prev => ({ 
                          ...prev, 
                          infrastructure_rating: rating
                        }))}
                        interactive
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Button onClick={handleSubmitReview} className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base">Submit Review</Button>
                    <Button variant="outline" onClick={() => setShowAddReview(false)} className="border-gray-600 text-gray-300 hover:bg-gray-600 text-sm sm:text-base">Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="border-2 border-gray-600 hover:border-blue-400 transition-colors bg-gray-700">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} />
                            {review.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-200 font-medium leading-relaxed">{review.review_text}</p>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                            <span className="font-medium text-gray-300">{review.author}</span>
                            <span className="text-gray-500 hidden sm:inline">•</span>
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                              <span className="font-medium text-gray-300">{review.helpful_votes}</span>
                            </div>
                            {isUserReview(review) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteReview(review.id)}
                                className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                title="Delete your review"
                              >
                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">No reviews yet</h3>
                    <p className="text-gray-400 mb-4">
                      Be the first to share your experience with this college!
                    </p>
                    <Button onClick={() => setShowAddReview(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Write First Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

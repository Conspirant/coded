import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, Heart, Sparkles, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { SiteReviewService } from "@/lib/site-review-service";

interface WebsiteReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewSubmitted?: () => void;
}

const AVAILABLE_TOOLS = [
  "College Predictor",
  "Cutoff Explorer",
  "Admissions Journal",
  "Round Tracker",
  "COMEDK Explorer",
  "CET News",
  "Rank Predictor",
  "Cutoff Predictor"
];

const RATING_LABELS: Record<number, string> = {
  5: "5 Stars - Essential & Life-Saving!",
  4: "4 Stars - Very Helpful & Clean",
  3: "3 Stars - Good & Useful",
  2: "2 Stars - Okay, Needs Work",
  1: "1 Star - Needs Improvement"
};

export const WebsiteReviewModal: React.FC<WebsiteReviewModalProps> = ({
  open,
  onOpenChange,
  onReviewSubmitted,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [comment, setComment] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([
    "College Predictor",
    "Admissions Journal"
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error("Please write a quick comment about your experience.");
      return;
    }

    setIsSubmitting(true);

    try {
      await SiteReviewService.submitReview({
        rating,
        name: name.trim() || "Anonymous Student",
        rank: rank.trim() || undefined,
        comment: comment.trim(),
        usefulTools: selectedTools,
      });

      setIsSubmitted(true);
      toast.success("Thank you! Your review has been recorded.");

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      setTimeout(() => {
        onOpenChange(false);
        setIsSubmitted(false);
        setComment("");
      }, 2000);
    } catch (err) {
      console.error("Failed to submit review:", err);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-lg max-h-[85vh] overflow-y-auto bg-card border border-border text-foreground rounded-2xl p-4 sm:p-6 shadow-2xl">
        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Thank You for Your Feedback!</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Your review helps us keep KCET Coded 100% accurate, fast, and free for Karnataka students.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader className="space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 uppercase tracking-wider">
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Student Review & Feedback</span>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                How has KCET Coded helped your counseling prep?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Share your honest rating and feedback to help us improve the platform for KCET & COMEDK 2026 aspirants.
              </DialogDescription>
            </DialogHeader>

            {/* Rating Stars */}
            <div className="space-y-2 text-center py-2 bg-secondary/30 rounded-xl border border-border/50 p-4">
              <span className="text-xs font-medium text-muted-foreground block">
                Rate Your Overall Experience
              </span>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          active
                            ? "text-amber-400 fill-amber-400"
                            : "text-muted-foreground opacity-30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] font-semibold text-violet-400 block pt-0.5">
                {RATING_LABELS[hoverRating || rating]}
              </span>
            </div>

            {/* Tools Multi-Select */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">
                Which tools helped you most?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TOOLS.map((tool) => {
                  const isSelected = selectedTools.includes(tool);
                  return (
                    <button
                      key={tool}
                      type="button"
                      onClick={() => toggleTool(tool)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors border ${
                        isSelected
                          ? "bg-violet-600 text-white border-violet-600"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tool} {isSelected ? "✓" : "+"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Comment */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Your Review / Experience <span className="text-rose-400">*</span>
              </label>
              <Textarea
                required
                rows={3}
                placeholder="What did you like about KCET Coded? Did option entry or cutoff data help you?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-background border-border text-xs rounded-xl focus:border-violet-500"
              />
            </div>

            {/* Name & Rank Optional Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground block">
                  Your Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Rahul M. or Anonymous"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background border-border text-xs h-9 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-muted-foreground block">
                  Your Rank (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g. KCET Rank 4,200"
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="bg-background border-border text-xs h-9 rounded-lg"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs text-muted-foreground rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                size="sm"
                className="bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold px-4"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

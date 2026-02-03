import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, Users, ChevronRight } from "lucide-react"

import { CollegeReview } from "@/lib/college-service"

interface CollegeReviewCardProps {
  college: {
    code: string;
    name: string;
  };
  reviews: CollegeReview[];
  onClick?: () => void;
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const CategoryRating = ({ 
  label, 
  rating 
}: { 
  label: string; 
  rating: number; 
}) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-300">{label}</span>
      <div className="flex items-center gap-1">
        <StarRating rating={rating} />
        <span className="text-gray-400 ml-1">{rating}/5</span>
      </div>
    </div>
  );
};

export const CollegeReviewCard = ({ college, reviews, onClick }: CollegeReviewCardProps) => {
  return (
    <Card 
      className="w-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-blue-400 group bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 hover:scale-[1.01] sm:hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-bold group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight text-white">
              {college.name}
            </CardTitle>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <Badge variant="outline" className="text-xs font-semibold px-2 py-1 bg-blue-900 text-blue-300 border-blue-600 w-fit">
                {college.code}
              </Badge>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0" />
                <span className="font-medium">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-700 group-hover:bg-gray-600 transition-colors flex-shrink-0">
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-4 sm:px-6">
        {reviews.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                <span className="font-medium">Recent reviews available</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              Click to view detailed reviews and ratings
            </p>
            <div className="flex items-center gap-1">
              <span className="text-xs sm:text-sm text-gray-300 font-medium">View reviews for details</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 sm:py-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-200 mb-1">No reviews yet</p>
            <p className="text-xs text-gray-400">Be the first to review this college!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


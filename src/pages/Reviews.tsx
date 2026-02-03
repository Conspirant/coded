import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CollegeReviewCard } from "@/components/CollegeReviewCard"
import { CollegeReviewModal } from "@/components/CollegeReviewModal"
import { Search, Filter, Star } from "lucide-react"
import { getCollegesWithReviews, College, CollegeReview } from "@/lib/college-service"

const Reviews = () => {
  const [collegesWithReviews, setCollegesWithReviews] = useState<{ college: College; reviews: CollegeReview[] }[]>([])
  const [filteredColleges, setFilteredColleges] = useState<{ college: College; reviews: CollegeReview[] }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCollegesWithReviews()
        setCollegesWithReviews(data)
        setFilteredColleges(data)
      } catch (error) {
        console.error("❌ Reviews page: Error loading college reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredColleges(collegesWithReviews)
    } else {
      const filtered = collegesWithReviews.filter(({ college }) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredColleges(filtered)
    }
  }, [searchTerm, collegesWithReviews])

  const handleCollegeClick = async (college: College) => {
    setSelectedCollege(college)
    setIsModalOpen(true)
    
    // Refresh reviews for this college when modal opens
    try {
      const data = await getCollegesWithReviews()
      setCollegesWithReviews(data)
      setFilteredColleges(data)
    } catch (error) {
      console.error("Error refreshing reviews:", error)
    }
  }

  const handleAddReview = (review: CollegeReview) => {
    setCollegesWithReviews(prev => 
      prev.map(item => 
        item.college.code === review.collegeCode 
          ? { ...item, reviews: [review, ...item.reviews] }
          : item
      )
    )

    setFilteredColleges(prev => 
      prev.map(item => 
        item.college.code === review.collegeCode 
          ? { ...item, reviews: [review, ...item.reviews] }
          : item
      )
    )
  }

  const handleDeleteReview = (reviewId: string) => {
    setCollegesWithReviews(prev => 
      prev.map(item => ({
        ...item,
        reviews: item.reviews.filter(review => review.id !== reviewId)
      }))
    )

    setFilteredColleges(prev => 
      prev.map(item => ({
        ...item,
        reviews: item.reviews.filter(review => review.id !== reviewId)
      }))
    )
  }

  const selectedCollegeReviews = selectedCollege 
    ? collegesWithReviews.find(item => item.college.code === selectedCollege.code)?.reviews || []
    : []

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2 px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">College Reviews</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Student reviews and ratings for KCET colleges</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="px-4 sm:px-6">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-2 px-4 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">College Reviews</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Student reviews and ratings for KCET colleges</p>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mx-4 sm:mx-0">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search colleges by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm sm:text-base"
              />
            </div>
            <Badge variant="outline" className="flex items-center gap-1 w-fit self-center sm:self-auto">
              <Filter className="h-3 w-3" />
              <span className="text-xs sm:text-sm">{filteredColleges.length} colleges</span>
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* College Review Cards */}
      {filteredColleges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-0">
          {filteredColleges.map(({ college, reviews }) => (
            <CollegeReviewCard
              key={college.code}
              college={college}
              reviews={reviews}
              onClick={() => handleCollegeClick(college)}
            />
          ))}
        </div>
      ) : (
        <Card className="mx-4 sm:mx-0">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or browse all colleges.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* College Review Modal */}
      <CollegeReviewModal
        college={selectedCollege}
        reviews={selectedCollegeReviews}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCollege(null)
        }}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
      />
    </div>
  )
}

export default Reviews
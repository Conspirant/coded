import { SEO } from "@/components/SEO"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CollegeReviewCard } from "@/components/CollegeReviewCard"
import { Search, Star, MessageSquare, TrendingUp, Sparkles, Heart } from "lucide-react"
import { getCollegesWithReviews, College, CollegeReview } from "@/lib/college-service"
import { WebsiteReviewModal } from "@/components/WebsiteReviewModal"
import { SiteReviewService } from "@/lib/site-review-service"
import { SiteReview } from "@/types/siteReview"

type SortMode = "reviews" | "name" | "code"

const Reviews = () => {
  const navigate = useNavigate()
  const [collegesWithReviews, setCollegesWithReviews] = useState<{ college: College; reviews: CollegeReview[] }[]>([])
  const [filteredColleges, setFilteredColleges] = useState<{ college: College; reviews: CollegeReview[] }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [sortMode, setSortMode] = useState<SortMode>("reviews")
  const [showOnlyWithReviews, setShowOnlyWithReviews] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [siteReviews, setSiteReviews] = useState<SiteReview[]>([])

  const loadSiteReviews = async () => {
    const res = await SiteReviewService.getApprovedReviews()
    setSiteReviews(res)
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCollegesWithReviews()
        setCollegesWithReviews(data)
        setFilteredColleges(data)
        await loadSiteReviews()
      } catch (error) {
        console.error("Error loading college reviews:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let result = [...collegesWithReviews]
    if (searchTerm) {
      result = result.filter(({ college }) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (showOnlyWithReviews) {
      result = result.filter(({ reviews }) => reviews.length > 0)
    }
    if (sortMode === "reviews") result.sort((a, b) => b.reviews.length - a.reviews.length)
    else if (sortMode === "name") result.sort((a, b) => a.college.name.localeCompare(b.college.name))
    else if (sortMode === "code") result.sort((a, b) => a.college.code.localeCompare(b.college.code))
    setFilteredColleges(result)
  }, [searchTerm, collegesWithReviews, sortMode, showOnlyWithReviews])

  const handleCollegeClick = (college: College) => {
    navigate(`/reviews/${college.code}`)
  }

  const totalReviews = collegesWithReviews.reduce((sum, { reviews }) => sum + reviews.length, 0)
  const collegesWithReviewsCount = collegesWithReviews.filter(({ reviews }) => reviews.length > 0).length

  // Loading
  if (loading) {
    return (
      <div className="space-y-4 px-1">
      <SEO
        title="KCET College Reviews – Real Student Experiences & Ratings"
        description="Read honest reviews from real KCET students about engineering colleges in Karnataka. Compare placements, campus life, faculty & infrastructure before choosing your college."
        url="https://kcetcoded.dev/reviews"
        keywords="KCET college reviews, engineering college reviews Karnataka, student reviews KCET colleges, college placement reviews, campus life reviews"
      />
        <div className="rounded-2xl glass border border-white/5 p-5 sm:p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-7 bg-white/5 rounded-lg w-48"></div>
            <div className="h-4 bg-white/5 rounded-lg w-full max-w-xs"></div>
            <div className="h-11 bg-white/5 rounded-xl w-full"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl glass border border-white/5 p-5 animate-pulse">
              <div className="h-5 bg-white/5 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-white/5 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 px-1">
      {/* ═══ Header ═══ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl glass border border-white/5 p-4 sm:p-6 lg:p-8">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-indigo-500/8 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-4">
          {/* Title + Stats + Write Website Review */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">College & Website Reviews</h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Real reviews from students. Compare colleges or leave feedback for KCET Coded.
              </p>
            </div>

            <Button
              onClick={() => setReviewModalOpen(true)}
              size="sm"
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold gap-1.5 rounded-xl self-start sm:self-auto shadow-md"
            >
              <Sparkles className="h-3.5 w-3.5" /> Rate KCET Coded
            </Button>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/5">
              <MessageSquare className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-semibold">{totalReviews}</span>
              <span className="text-[10px] text-muted-foreground hidden xs:inline">reviews</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass border border-white/5">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-semibold">{collegesWithReviewsCount}</span>
              <span className="text-[10px] text-muted-foreground hidden xs:inline">reviewed</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search colleges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 rounded-xl bg-white/5 border-white/10 focus:border-indigo-500/50 focus:ring-indigo-500/20 text-sm"
            />
          </div>

          {/* Filters — scroll horizontally on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            <Button
              variant={showOnlyWithReviews ? "default" : "outline"}
              size="sm"
              onClick={() => setShowOnlyWithReviews(!showOnlyWithReviews)}
              className={`h-9 rounded-lg text-[11px] font-medium whitespace-nowrap flex-shrink-0 ${showOnlyWithReviews
                  ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30"
                  : "border-white/10 text-muted-foreground hover:bg-white/5"
                }`}
            >
              <Sparkles className="h-3 w-3 mr-1" />With Reviews
            </Button>
            <div className="h-5 w-px bg-white/10 flex-shrink-0" />
            {(["reviews", "name", "code"] as SortMode[]).map((mode) => (
              <button key={mode} onClick={() => setSortMode(mode)}
                className={`h-9 px-3 rounded-lg text-[11px] font-medium whitespace-nowrap flex-shrink-0 transition-all ${sortMode === mode ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5"
                  }`}>
                {mode === "reviews" ? "Top" : mode === "name" ? "A–Z" : "Code"}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <div className="px-1">
        <span className="text-[10px] text-muted-foreground font-medium">
          {filteredColleges.length} of {collegesWithReviews.length} colleges
        </span>
      </div>

      {/* ═══ Cards Grid ═══ */}
      {filteredColleges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredColleges.map(({ college, reviews }, i) => (
            <motion.div key={college.code}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.2) }}>
              <CollegeReviewCard college={college} reviews={reviews} onClick={() => handleCollegeClick(college)} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl glass border border-white/5 p-8 sm:p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
            <Search className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <h3 className="text-base font-semibold mb-1.5">No colleges found</h3>
          <p className="text-xs text-muted-foreground mb-4">Try different search terms</p>
          {(searchTerm || showOnlyWithReviews) && (
            <Button variant="outline" size="sm" className="rounded-xl border-white/10 text-xs"
              onClick={() => { setSearchTerm(""); setShowOnlyWithReviews(false) }}>
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* ═══ Platform Reviews & Aspirant Feedback ═══ */}
      <div className="pt-8 border-t border-border/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" /> What Aspirants Say About KCET Coded
            </h2>
            <p className="text-xs text-muted-foreground">
              Feedback and reviews submitted by KCET candidates.
            </p>
          </div>
          <Button
            onClick={() => setReviewModalOpen(true)}
            size="sm"
            variant="outline"
            className="border-border text-xs gap-1.5 rounded-xl self-start sm:self-auto"
          >
            <Heart className="h-3.5 w-3.5 text-rose-400" /> Share Your Feedback
          </Button>
        </div>

        {siteReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {siteReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-card border border-border/60 p-4 rounded-xl space-y-2.5 flex flex-col justify-between hover:border-violet-500/40 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star key={idx} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                    {rev.rank && (
                      <span className="text-[10px] font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20">
                        {rev.rank}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/90 italic leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{rev.name}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border p-6 rounded-xl text-center space-y-2">
            <p className="text-xs text-muted-foreground">No platform reviews submitted yet. Be the first!</p>
            <Button
              onClick={() => setReviewModalOpen(true)}
              size="sm"
              className="bg-violet-600 hover:bg-violet-500 text-white text-xs"
            >
              Write First Review
            </Button>
          </div>
        )}
      </div>

      <WebsiteReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        onReviewSubmitted={loadSiteReviews}
      />
    </div>
  )
}

export default Reviews
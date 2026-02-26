import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, ChevronRight } from "lucide-react"
import { CollegeReview } from "@/lib/college-service"

interface CollegeReviewCardProps {
  college: { code: string; name: string }
  reviews: CollegeReview[]
  onClick?: () => void
}

const CollegeReviewCard = ({ college, reviews, onClick }: CollegeReviewCardProps) => {
  const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  const avgP = reviews.length > 0 ? reviews.reduce((s, r) => s + r.placements_rating, 0) / reviews.length : 0
  const avgF = reviews.length > 0 ? reviews.reduce((s, r) => s + r.faculty_rating, 0) / reviews.length : 0
  const avgI = reviews.length > 0 ? reviews.reduce((s, r) => s + r.infrastructure_rating, 0) / reviews.length : 0

  return (
    <button
      className="group relative w-full text-left rounded-2xl glass border border-white/5 hover:border-indigo-500/20 transition-all duration-300 active:scale-[0.98] hover:shadow-lg hover:shadow-indigo-500/5 overflow-hidden"
      onClick={onClick}
    >
      {/* Accent line */}
      {reviews.length > 0 && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      <div className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] sm:text-sm font-semibold group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
              {college.name}
            </h3>
          </div>
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 group-hover:bg-indigo-500/10 transition-all flex-shrink-0">
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-0.5 transform transition-all duration-200" />
          </div>
        </div>

        {/* Code + Rating inline */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant="outline" className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-white/5 border-white/10 text-muted-foreground">
            {college.code}
          </Badge>
          {reviews.length > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">{avg.toFixed(1)}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
            <MessageSquare className="h-3 w-3" />
            <span className="font-medium">{reviews.length}</span>
          </div>
        </div>

        {/* Mini rating bars — only if has reviews */}
        {reviews.length > 0 && (
          <div className="space-y-1.5">
            {[
              { label: "Placements", value: avgP, color: "bg-emerald-400" },
              { label: "Faculty", value: avgF, color: "bg-blue-400" },
              { label: "Infra", value: avgI, color: "bg-purple-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-16 flex-shrink-0">{label}</span>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden flex-1">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / 5) * 100}%` }} />
                </div>
                <span className="text-[10px] font-medium tabular-nums w-6 text-right">{value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {reviews.length === 0 && (
          <div className="text-center py-2">
            <p className="text-[11px] text-muted-foreground/60">Tap to write the first review</p>
          </div>
        )}
      </div>
    </button>
  )
}

export { CollegeReviewCard }

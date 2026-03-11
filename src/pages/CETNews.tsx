import { SEO } from "@/components/SEO"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Newspaper, CalendarDays, AlertCircle } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  url: string
  source: string
  publishedAt: string
  type?: string
  summary?: string
}

const OFFICIAL_NOTICE = {
  pressNoteNo: "No. ED/KEA/Press Note/2026",
  date: "13-02-2026",
  title: "Date extended for registration and to apply online for CET-2026",
  examDates: "23-04-2026 and 24-04-2026",
  previousApplyDeadline: "16-02-2026",
  previousFeeDeadline: "18-02-2026",
  extendedApplyDeadline: "11:59 PM on 22-02-2026",
  extendedFeeDeadline: "5:30 PM on 24-02-2026",
  registeredCandidates: "287,909",
  specialNote:
    "Candidates who have already applied should verify all submitted details. If there is any mistake, it can be corrected by logging in again before final submission.",
}

export default function CETNews() {
  const [feed, setFeed] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/news.json", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load news")
        const data = await res.json()
        setFeed(Array.isArray(data) ? data : [])
      } catch {
        setFeed([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const sortedFeed = useMemo(() => {
    return [...feed]
      .filter((item) => item?.title && item?.url)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 18)
  }, [feed])

  return (
    <div className="space-y-6">
      <SEO
        title="CET News"
        description="Official notices, updates, and news regarding KCET admissions, counseling, and exams."
        url="https://kcet-coded2.vercel.app/cet-news"
        keywords="KCET news, KCET 2026 updates, KEA notifications, KCET counseling news, KCET result news, KCET exam updates"
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-indigo-400" />
            CET News
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Official notices and important KCET/CET updates in one place.
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          Updated {new Date().toLocaleDateString()}
        </Badge>
      </div>

      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{OFFICIAL_NOTICE.pressNoteNo}</span>
            <span>•</span>
            <span>Date: {OFFICIAL_NOTICE.date}</span>
          </div>
          <CardTitle className="text-lg sm:text-xl text-red-500">
            {OFFICIAL_NOTICE.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm sm:text-base leading-relaxed">
          <p>
            CET-2026 is scheduled on <strong>{OFFICIAL_NOTICE.examDates}</strong>. The earlier deadlines were{" "}
            <strong>{OFFICIAL_NOTICE.previousApplyDeadline}</strong> (application) and{" "}
            <strong>{OFFICIAL_NOTICE.previousFeeDeadline}</strong> (fee payment). About{" "}
            <strong>{OFFICIAL_NOTICE.registeredCandidates}</strong> candidates had already registered.
          </p>
          <p>
            The deadlines have been extended to <strong>{OFFICIAL_NOTICE.extendedApplyDeadline}</strong> for registration/applications and{" "}
            <strong>{OFFICIAL_NOTICE.extendedFeeDeadline}</strong> for fee payment.
          </p>
          <p>
            <strong>Special Note:</strong> {OFFICIAL_NOTICE.specialNote}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Always verify final dates on the official KEA website before taking action.</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-blue-400" />
            News Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading news feed...</p>
          ) : sortedFeed.length === 0 ? (
            <p className="text-sm text-muted-foreground">No news feed items available.</p>
          ) : (
            <div className="space-y-3">
              {sortedFeed.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium leading-tight">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.source} • {item.publishedAt}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      Open
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


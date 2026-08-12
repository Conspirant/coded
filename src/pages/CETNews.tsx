import { SEO } from "@/components/SEO"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ExternalLink,
  Newspaper,
  CalendarDays,
  AlertCircle,
  Search,
  Bell,
  CheckCircle2,
  ShieldAlert,
  Info,
  Sparkles
} from "lucide-react"

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
  pressNoteNo: "No. ED/KEA/UGCET-2026/ChoiceEntry",
  date: "16-07-2026",
  title: "UGCET 2026 Round 1 Choice Selection, Online Fee Payment & College Reporting Guidelines",
  choiceDeadline: "July 23, 2026 (11:59 PM)",
  feePaymentDeadline: "July 24, 2026 (4:00 PM)",
  reportingDeadline: "July 25, 2026 (5:30 PM)",
  registeredCandidates: "310,000+",
  specialNote:
    "Candidates allotted seats in Round 1 MUST log in to select Choice 1, Choice 2, Choice 3, or Choice 4. Candidates selecting Choice 1 or Choice 2 must complete fee payment online or via bank challan before downloading admission orders.",
}

export default function CETNews() {
  const [feed, setFeed] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/data/news.dat", { cache: "no-store" })
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

  const filteredFeed = useMemo(() => {
    return feed
      .filter((item) => item?.title && item?.url)
      .filter((item) => {
        if (categoryFilter === "all") return true
        return item.type?.toLowerCase() === categoryFilter.toLowerCase()
      })
      .filter((item) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.source.toLowerCase().includes(q) ||
          (item.summary && item.summary.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }, [feed, categoryFilter, searchQuery])

  return (
    <div className="space-y-8 pb-10">
      <SEO
        title="KCET 2026 News & Official KEA Notifications"
        description="Official press notes, counseling alerts, Choice Entry updates, and latest announcements for KCET 2026 and COMEDK admissions."
        url="https://kcetcoded.dev/cet-news"
        keywords="KCET news, KCET 2026 press notes, KEA official announcements, KCET counseling updates, KCET choice entry date, KCET fee payment link"
      />

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl glass border border-white/10 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Newspaper className="h-3.5 w-3.5" />
              <span>Official News Bulletin</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>CET News & KEA Notices</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Verified official press releases, choice entry updates, and admission deadlines.
            </p>
          </div>
          <Badge variant="outline" className="border-white/10 text-slate-300 text-xs self-start sm:self-center">
            Updated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* Featured Press Note */}
      <Card className="glass border-indigo-500/30 bg-slate-950/90 shadow-lg shadow-indigo-500/5 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400" />
        <CardHeader className="p-6 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-indigo-300 font-medium mb-1">
            <span>{OFFICIAL_NOTICE.pressNoteNo}</span>
            <span>Issued Date: {OFFICIAL_NOTICE.date}</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-white leading-snug">
            {OFFICIAL_NOTICE.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            The Karnataka Examinations Authority (KEA) has officially enabled the online Choice Selection portal for Round 1 seat allotment. Over <strong>{OFFICIAL_NOTICE.registeredCandidates}</strong> candidates participating in UGCET 2026 engineering & agricultural counseling can exercise their post-allotment options.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl border border-white/5 bg-white/5 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Choice Entry Deadline</span>
              <span className="text-indigo-300 font-bold mt-0.5 block">{OFFICIAL_NOTICE.choiceDeadline}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Online Fee Payment Deadline</span>
              <span className="text-emerald-400 font-bold mt-0.5 block">{OFFICIAL_NOTICE.feePaymentDeadline}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">College Reporting Deadline</span>
              <span className="text-amber-400 font-bold mt-0.5 block">{OFFICIAL_NOTICE.reportingDeadline}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-xs text-indigo-200">
            <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <span><strong>Special Note:</strong> {OFFICIAL_NOTICE.specialNote}</span>
          </div>
        </CardContent>
      </Card>

      {/* News Feed Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Latest Notifications</h2>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search news or notices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-950/60 border-white/10 text-xs text-white placeholder:text-slate-500 rounded-xl h-9"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {["all", "official", "announcement", "news"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${categoryFilter === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "glass text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              {cat === "all" ? "All Updates" : cat}
            </button>
          ))}
        </div>

        {/* News Feed Items */}
        {loading ? (
          <div className="p-8 text-center glass rounded-2xl border border-white/5 text-slate-400 text-xs">
            Loading latest CET news...
          </div>
        ) : filteredFeed.length === 0 ? (
          <div className="p-8 text-center glass rounded-2xl border border-white/5 text-slate-400 text-xs">
            No news items match your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredFeed.map((item) => (
              <Card key={item.id} className="glass border-white/5 bg-slate-950/60 hover:border-white/15 transition-all">
                <CardContent className="p-5 sm:p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                      <Badge variant="outline" className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] uppercase">
                        {item.type || "official"}
                      </Badge>
                      <span>{item.source}</span>
                      <span>•</span>
                      <span className="text-slate-400 font-normal">{item.publishedAt}</span>
                    </div>

                    <Button asChild size="sm" variant="ghost" className="text-xs text-indigo-300 hover:text-white hover:bg-white/5 self-start sm:self-auto h-8 px-3">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <span>Read Notice</span>
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>

                  {item.summary && (
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

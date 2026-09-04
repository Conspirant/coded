import { SEO } from "@/components/SEO"
import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ExternalLink,
  Newspaper,
  CalendarDays,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Radio
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

const ACTIVE_NOTICE = {
  pressNoteNo: "ED/KEA/UGCET-2026/R3-Provisional",
  date: "04-09-2026",
  title: "KCET 2026 Round 3 Provisional Seat Allotment & Cutoffs Declared",
  choiceDeadline: "Sep 07, 2026 (11:59 PM)",
  feePaymentDeadline: "Sep 08, 2026 (4:00 PM)",
  reportingDeadline: "Sep 09, 2026 (5:30 PM)",
  portalUrl: "https://cetonline.karnataka.gov.in",
  keyPoints: [
    "KEA has officially published the UGCET 2026 Third Round provisional allotment cut-off ranks for engineering.",
    "Candidates allotted seats in Round 3 can confirm allotments, clear tuition fee balance, and download the official Admission Order.",
    "Mandatory in-person reporting to allotted colleges with original documents by September 9, 2026 (5:30 PM)."
  ]
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
        if (categoryFilter === "official") return item.type === "official"
        if (categoryFilter === "comedk") return item.title.toLowerCase().includes("comedk") || item.source.toLowerCase().includes("comedk")
        if (categoryFilter === "announcement") return item.type === "announcement" || item.type === "news"
        return true
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
    <div className="max-w-5xl mx-auto space-y-6 pb-12 pt-2 px-4 sm:px-6">
      <SEO
        title="KCET 2026 CET News & Official KEA Notifications"
        description="Verified press notes, Round 2 final seat allotment updates, college reporting deadlines, and COMEDK counseling notifications for Karnataka engineering admissions."
        url="https://kcetcoded.dev/cet-news"
        keywords="KCET news, KCET 2026 press notes, KEA official announcements, KCET round 2 allotment, KCET reporting deadline, COMEDK round 4 dates"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Live Counseling Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">CET News & KEA Notices</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified official press releases, choice entry deadlines, and admission circulars.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="outline" className="bg-white/[0.02] border-white/10 text-muted-foreground text-[11px] font-normal py-1 px-2.5">
            Updated August 25, 2026
          </Badge>
        </div>
      </div>

      {/* Active Urgent Notice Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-indigo-950/20 p-5 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px] uppercase font-mono tracking-wider">
                Live Active Stage
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">{ACTIVE_NOTICE.pressNoteNo}</span>
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {ACTIVE_NOTICE.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-muted-foreground block">Choice Entry Deadline</span>
                <span className="text-xs font-semibold text-indigo-300 mt-0.5 block">{ACTIVE_NOTICE.choiceDeadline}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-muted-foreground block">Fee Payment Deadline</span>
                <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">{ACTIVE_NOTICE.feePaymentDeadline}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-[11px] text-muted-foreground block">College Reporting</span>
                <span className="text-xs font-semibold text-amber-300 mt-0.5 block">{ACTIVE_NOTICE.reportingDeadline}</span>
              </div>
            </div>

            <ul className="space-y-1 text-xs text-slate-300 pt-1">
              {ACTIVE_NOTICE.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <a
            href={ACTIVE_NOTICE.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-all shadow-md shadow-indigo-600/20 shrink-0 self-start"
          >
            <span>KEA Candidate Portal</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Updates" },
            { id: "official", label: "KEA Official" },
            { id: "comedk", label: "COMEDK" },
            { id: "announcement", label: "Announcements" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                categoryFilter === tab.id
                  ? "bg-white/10 text-white border border-white/15"
                  : "text-muted-foreground hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white/[0.03] border-white/10 text-xs text-white placeholder:text-muted-foreground rounded-lg h-8 w-full"
          />
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-muted-foreground">
          Loading verified news updates...
        </div>
      ) : filteredFeed.length === 0 ? (
        <div className="py-12 text-center text-xs text-muted-foreground border border-white/5 rounded-xl bg-white/[0.01]">
          No news items found matching "{searchQuery}".
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeed.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-xl border border-white/5 bg-card/40 hover:bg-card/70 hover:border-white/10 transition-all space-y-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <Badge
                    variant="outline"
                    className="border-white/10 bg-white/[0.02] text-slate-300 text-[10px] uppercase font-mono py-0.5 px-2"
                  >
                    {item.type || "official"}
                  </Badge>
                  <span className="font-medium text-slate-300">{item.source}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {new Date(item.publishedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors self-start sm:self-auto font-medium"
                >
                  <span>Open Notice</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                {item.title}
              </h3>

              {item.summary && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.summary}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

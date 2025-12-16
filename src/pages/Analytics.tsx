import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock } from "lucide-react"
import { finderStore, FinderMatch } from "@/store/finderStore"

interface CutoffData {
  institute: string
  institute_code: string
  course: string
  category: string
  cutoff_rank: number
  year: string
  round: string
}

interface CutoffResponseMeta {
  last_updated?: string
  total_entries?: number
  total_institutes?: number
  total_courses?: number
  total_categories?: number
  years_covered?: string[]
  source_files?: string[]
}

interface CutoffResponse {
  metadata?: CutoffResponseMeta
  cutoffs?: CutoffData[]
}

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [cutoffs, setCutoffs] = useState<CutoffData[]>([])
  const [metadata, setMetadata] = useState<CutoffResponseMeta | null>(null)
  const [liveMatches, setLiveMatches] = useState<FinderMatch[]>(finderStore.getState().matches)
  const [liveRank, setLiveRank] = useState<number | null>(finderStore.getState().userRank)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError("")
      try {
        const urls = [
          '/data/kcet_cutoffs_consolidated.json',
          '/kcet_cutoffs.json',
          '/kcet_cutoffs_round3_2025.json',
          '/kcet_cutoffs2025.json'
        ]

        let response: Response | null = null
        for (const url of urls) {
          response = await fetch(url, { cache: 'no-store' })
          if (response.ok) break
        }
        if (!response || !response.ok) {
          throw new Error('Failed to load consolidated data')
        }

        const raw = await response.json()
        let processed: CutoffResponse
        if (Array.isArray(raw)) {
          processed = { cutoffs: raw }
        } else {
          processed = raw
        }

        // Alternate keys fallback
        const cutoffsArr: CutoffData[] = (processed.cutoffs as any)
          ?? (processed as any).data
          ?? (processed as any).cutoffs_data
          ?? []

        const normalized = (cutoffsArr as any[]).map((i: any) => ({
          institute: (i.institute ?? '').toString().trim(),
          institute_code: (i.institute_code ?? '').toString().trim().toUpperCase(),
          course: (i.course ?? '').toString().trim(),
          category: (i.category ?? '').toString().trim(),
          cutoff_rank: Number(i.cutoff_rank ?? 0),
          year: (i.year ?? '').toString().trim(),
          round: (i.round ?? '').toString().trim(),
        })) as CutoffData[]

        setCutoffs(normalized)
        setMetadata(processed.metadata ?? null)
      } catch (e: any) {
        setError(e?.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Subscribe to live updates from CollegeFinder
    const unsubscribe = finderStore.subscribe((s) => {
      setLiveMatches(s.matches)
      setLiveRank(s.userRank)
    })
    return () => { unsubscribe() }
  }, [])

  const stats = useMemo(() => {
    const totalEntries = metadata?.total_entries ?? cutoffs.length
    const totalInstitutes = metadata?.total_institutes ?? new Set(cutoffs.map(c => c.institute_code)).size
    const totalCourses = metadata?.total_courses ?? new Set(cutoffs.map(c => c.course)).size
    const totalCategories = metadata?.total_categories ?? new Set(cutoffs.map(c => c.category)).size
    const yearsCovered = metadata?.years_covered ?? Array.from(new Set(cutoffs.map(c => c.year))).sort((a, b) => b.localeCompare(a))
    return { totalEntries, totalInstitutes, totalCourses, totalCategories, yearsCovered }
  }, [metadata, cutoffs])

  const liveStats = useMemo(() => {
    if (!liveMatches || liveMatches.length === 0) return null
    const institutes = new Set(liveMatches.map(m => m.institute_code)).size
    const courses = new Set(liveMatches.map(m => m.course)).size
    const categories = new Set(liveMatches.map(m => m.category)).size
    const years = Array.from(new Set(liveMatches.map(m => m.year))).sort((a, b) => b.localeCompare(a))
    return { count: liveMatches.length, institutes, courses, categories, years }
  }, [liveMatches])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Visual insights across years, branches, and seat types</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Dataset Overview
          </CardTitle>
          {metadata?.last_updated && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last updated {metadata.last_updated}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading consolidated analytics…</div>
          ) : error ? (
            <div className="py-8 text-center text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-md border">
                <div className="text-xs text-muted-foreground">Entries</div>
                <div className="text-xl font-semibold">{stats.totalEntries.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-md border">
                <div className="text-xs text-muted-foreground">Institutes</div>
                <div className="text-xl font-semibold">{stats.totalInstitutes.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-md border">
                <div className="text-xs text-muted-foreground">Courses</div>
                <div className="text-xl font-semibold">{stats.totalCourses.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-md border">
                <div className="text-xs text-muted-foreground">Categories</div>
                <div className="text-xl font-semibold">{stats.totalCategories.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-md border col-span-2 sm:col-span-3 lg:col-span-2">
                <div className="text-xs text-muted-foreground">Years Covered</div>
                <div className="text-sm font-medium truncate" title={stats.yearsCovered.join(', ')}>
                  {stats.yearsCovered.join(', ')}
                </div>
              </div>
              {metadata?.source_files && metadata.source_files.length > 0 && (
                <div className="p-4 rounded-md border col-span-2">
                  <div className="text-xs text-muted-foreground">Source Files</div>
                  <div className="text-sm font-medium truncate" title={metadata.source_files.join(', ')}>
                    {metadata.source_files.length} files
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {liveStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Current Results Overview
            </CardTitle>
            {typeof liveRank === 'number' && (
              <div className="text-sm text-muted-foreground">
                Based on current College Finder results at rank {liveRank.toLocaleString()}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-md border">
                <div className="text-xs text-muted-foreground">Matches</div>
                <div className="text-xl font-semibold">{liveStats.count.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-md border">
                <div className="text-xs text-muted-foreground">Institutes</div>
                <div className="text-xl font-semibold">{liveStats.institutes.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-md border">
                <div className="text-xs text-muted-foreground">Courses</div>
                <div className="text-xl font-semibold">{liveStats.courses.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-md border">
                <div className="text-xs text-muted-foreground">Categories</div>
                <div className="text-xl font-semibold">{liveStats.categories.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-md border col-span-2 sm:col-span-3 lg:col-span-2">
                <div className="text-xs text-muted-foreground">Years Present</div>
                <div className="text-sm font-medium truncate" title={liveStats.years.join(', ')}>
                  {liveStats.years.join(', ')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Analytics
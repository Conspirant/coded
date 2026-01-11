import { useState, useEffect } from "react"
import { loadSettings } from '@/lib/settings'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  GraduationCap,
  BarChart3,
  Search,
  Target,
  Calculator,
  BookOpen,
  ExternalLink,
  Calendar,
  Users,
  ArrowRight
} from "lucide-react"
import { Link } from "react-router-dom"
import CountdownTimer from "@/components/CountdownTimer"

interface DataStats {
  totalRecords: number
  totalColleges: number
  totalBranches: number
  years: { [key: string]: number }
  categories: { [key: string]: number }
  topBranches: Array<{ code: string; name: string; count: number }>
  seatTypes: { [key: string]: number }
}

const Dashboard = () => {
  const [stats, setStats] = useState<DataStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const appSettings = loadSettings()
        const urls = appSettings.dashboardFastMode
          ? ['/data/cutoffs-summary.json', '/data/kcet_cutoffs_consolidated.json', '/kcet_cutoffs.json']
          : ['/data/kcet_cutoffs_consolidated.json', '/kcet_cutoffs.json']
        let response: Response | null = null
        for (const url of urls) {
          const r = await fetch(url, { cache: 'no-store' })
          if (r.ok) { response = r; break }
        }
        if (!response) throw new Error('Failed to load data')

        const raw = await response.json()

        if (!Array.isArray(raw) && raw.totals && raw.years && raw.categories) {
          const sortedYears: { [key: string]: number } = {}
          Object.keys(raw.years).sort((a, b) => b.localeCompare(a)).forEach(y => { sortedYears[y] = raw.years[y] })
          setStats({
            totalRecords: raw.totals.records,
            totalColleges: raw.totals.colleges,
            totalBranches: raw.totals.branches,
            years: sortedYears,
            categories: raw.categories,
            topBranches: [],
            seatTypes: {}
          })
          setLoading(false)
          return
        }

        const cutoffs = Array.isArray(raw) ? raw : (raw.cutoffs || raw.data || raw.cutoffs_data || [])

        const colleges = new Map()
        const branches = new Map()
        const years: { [key: string]: number } = {}
        const categories: { [key: string]: number } = {}
        const rounds: { [key: string]: number } = {}

        cutoffs.forEach((record: any) => {
          years[record.year] = (years[record.year] || 0) + 1
          categories[record.category] = (categories[record.category] || 0) + 1
          rounds[record.round] = (rounds[record.round] || 0) + 1

          if (record.institute_code) {
            const collegeKey = record.institute_code
            colleges.set(collegeKey, {
              code: record.institute_code,
              name: record.institute,
              count: (colleges.get(collegeKey)?.count || 0) + 1
            })
          }

          if (record.course) {
            const branchKey = record.course
            branches.set(branchKey, {
              code: record.course,
              name: record.course,
              count: (branches.get(branchKey)?.count || 0) + 1
            })
          }
        })

        const topBranches = Array.from(branches.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)

        const sortedYears: { [key: string]: number } = {}
        Object.keys(years).sort((a, b) => b.localeCompare(a)).forEach(y => { sortedYears[y] = years[y] })

        setStats({
          totalRecords: cutoffs.length,
          totalColleges: colleges.size,
          totalBranches: branches.size,
          years: sortedYears,
          categories,
          topBranches,
          seatTypes: rounds
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const quickActions = [
    { title: "Find Colleges", description: "Search based on your rank", icon: Search, href: "/college-finder", color: "bg-blue-600", shadow: "shadow-blue-500/25" },
    { title: "Cutoff Explorer", description: "Analyze cutoff trends", icon: BarChart3, href: "/cutoff-explorer", color: "bg-emerald-600", shadow: "shadow-emerald-500/25" },
    { title: "Rank Predictor", description: "Predict rank from marks", icon: Calculator, href: "/rank-predictor", color: "bg-purple-600", shadow: "shadow-purple-500/25" },
    { title: "Mock Simulator", description: "Simulate seat allotment", icon: Target, href: "/mock-simulator", color: "bg-orange-600", shadow: "shadow-orange-500/25" }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 mx-auto rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your comprehensive guide to KCET admissions</p>
      </div>

      {/* Disclaimer */}
      <Card className="shadow-md">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">Note:</span> This is an independent project and is not affiliated with r/kcet community or its moderation team.
          </p>
        </CardContent>
      </Card>

      {/* Countdown Timer */}
      <CountdownTimer />

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.href} className="group">
            <Card className={`h-full transition-all hover:shadow-lg hover:-translate-y-0.5 ${action.shadow}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${action.color} shadow-lg ${action.shadow}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* CET 2026 Schedule */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary shadow-lg shadow-primary/25">
                <Calendar className="h-5 w-5 text-primary-foreground" />
              </div>
              CET 2026 Exam Schedule
            </CardTitle>
            <a
              href="https://cetonline.karnataka.gov.in/kea/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              KEA Website <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {/* Main exam info */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="text-center px-3 py-2 rounded-lg bg-primary text-primary-foreground min-w-[60px] shadow-lg shadow-primary/25">
              <div className="text-lg font-bold font-mono">23-24</div>
              <div className="text-[10px] uppercase tracking-wider opacity-90">APR</div>
            </div>
            <div>
              <div className="font-semibold">CET 2026</div>
              <div className="text-sm text-muted-foreground">Applications from 17th January</div>
            </div>
          </div>

          {/* Day-wise schedule */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Day 1 */}
            <div className="rounded-lg border overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-muted/50 border-b flex items-center justify-between">
                <span className="font-medium">Day 1 • April 23</span>
                <span className="text-xs text-muted-foreground">Thursday</span>
              </div>
              <div className="divide-y">
                <div className="p-3 flex items-center gap-3">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">AM</span>
                  <div>
                    <div className="font-medium text-sm">Physics</div>
                    <div className="text-xs text-muted-foreground">10:30 - 11:50 • 60 Marks</div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-3">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">PM</span>
                  <div>
                    <div className="font-medium text-sm">Chemistry</div>
                    <div className="text-xs text-muted-foreground">2:30 - 3:50 • 60 Marks</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="rounded-lg border overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-muted/50 border-b flex items-center justify-between">
                <span className="font-medium">Day 2 • April 24</span>
                <span className="text-xs text-muted-foreground">Friday</span>
              </div>
              <div className="divide-y">
                <div className="p-3 flex items-center gap-3">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">AM</span>
                  <div>
                    <div className="font-medium text-sm">Mathematics</div>
                    <div className="text-xs text-muted-foreground">10:30 - 11:50 • 60 Marks</div>
                  </div>
                </div>
                <div className="p-3 flex items-center gap-3">
                  <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800">PM</span>
                  <div>
                    <div className="font-medium text-sm">Biology</div>
                    <div className="text-xs text-muted-foreground">2:30 - 3:50 • 60 Marks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/30 border">
            <span className="font-medium">Apr 22:</span> Kannada Language Test (Horanadu & Gadinadu candidates)
          </p>
        </CardContent>
      </Card>

      {/* Reddit Communities */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-md hover:shadow-lg transition-shadow border-orange-200/50 dark:border-orange-800/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
                  <span className="text-white font-bold">r/</span>
                </div>
                <div>
                  <h3 className="font-semibold">KCET Community</h3>
                  <p className="text-sm text-muted-foreground">Discussions & answers</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <a href="https://www.reddit.com/r/kcet/" target="_blank" rel="noopener noreferrer">
                  Visit <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border-blue-200/50 dark:border-blue-800/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold">r/</span>
                </div>
                <div>
                  <h3 className="font-semibold">KCET Coded</h3>
                  <p className="text-sm text-muted-foreground">Website feedback</p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer">
                  Join <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalRecords.toLocaleString()}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Colleges</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalColleges}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <GraduationCap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Branches</p>
                  <p className="text-2xl font-bold mt-1">{stats.totalBranches}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Years of Data</p>
                  <p className="text-2xl font-bold mt-1">{Object.keys(stats.years).length}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Year-wise Data */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Data by Year
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.years)
                  .sort(([a], [b]) => parseInt(b) - parseInt(a))
                  .map(([year, count]) => (
                    <div key={year} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{year}</span>
                        <span className="text-muted-foreground">{count.toLocaleString()}</span>
                      </div>
                      <Progress value={(count / stats.totalRecords) * 100} className="h-2" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Data by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.categories)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium px-2 py-1 rounded bg-muted border">{category}</span>
                        <span className="text-sm">{count.toLocaleString()}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {((count / stats.totalRecords) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Dashboard
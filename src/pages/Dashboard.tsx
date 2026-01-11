import { useState, useEffect } from "react"
import { loadSettings } from '@/lib/settings'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  GraduationCap,
  MapPin,
  Users,
  BarChart3,
  Search,
  Target,
  Calculator,
  BookOpen,
  Star,
  ExternalLink
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

interface NewsItem {
  id: string
  title: string
  image: string
  url: string
  source?: string
  publishedAt?: string
  summary?: string
}

const Dashboard = () => {
  const [stats, setStats] = useState<DataStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [news, setNews] = useState<NewsItem[]>([])

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Prefer the consolidated dataset to ensure latest counts
        // Try tiny summary first for instant load
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

        // If summary shape, set stats quickly and return
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

        // Calculate statistics
        const colleges = new Map()
        const branches = new Map()
        const years: { [key: string]: number } = {}
        const categories: { [key: string]: number } = {}
        const rounds: { [key: string]: number } = {}

        cutoffs.forEach((record: any) => {
          // Count by year
          years[record.year] = (years[record.year] || 0) + 1

          // Count by category
          categories[record.category] = (categories[record.category] || 0) + 1

          // Count by round
          rounds[record.round] = (rounds[record.round] || 0) + 1

          // Count colleges
          if (record.institute_code) {
            const collegeKey = record.institute_code
            colleges.set(collegeKey, {
              code: record.institute_code,
              name: record.institute,
              count: (colleges.get(collegeKey)?.count || 0) + 1
            })
          }

          // Count branches/courses
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

        // Sort years descending for display
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

  useEffect(() => {
    const loadNews = async () => {
      try {
        const response = await fetch('/data/news.json')
        if (!response.ok) throw new Error('Failed to load news')
        const items: NewsItem[] = await response.json()

        // Use placeholder images for items without images
        const enriched = items.map((item) => ({
          ...item,
          image: item.image || '/placeholder.svg'
        }))

        setNews(enriched)
      } catch (err) {
        console.warn('News not available yet. Create public/data/news.json to enable.', err)
      }
    }
    loadNews()
  }, [])

  const quickActions = [
    {
      title: "Find Colleges",
      description: "Search colleges based on your rank",
      icon: Search,
      href: "/college-finder",
      color: "bg-blue-500"
    },
    {
      title: "Cutoff Explorer",
      description: "Browse and analyze cutoff trends",
      icon: BarChart3,
      href: "/cutoff-explorer",
      color: "bg-green-500"
    },
    {
      title: "Rank Predictor",
      description: "Predict your rank from marks",
      icon: Calculator,
      href: "/rank-predictor",
      color: "bg-purple-500"
    },
    {
      title: "Mock Simulator",
      description: "Simulate seat allotment",
      icon: Target,
      href: "/mock-simulator",
      color: "bg-orange-500"
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground/70 mt-2">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">KCET Coded Dashboard</h1>
        <p className="text-foreground/80">Your comprehensive guide to KCET admissions</p>
      </div>

      {/* Disclaimer */}
      <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <p className="text-sm text-slate-300">
            <strong className="text-slate-200">Disclaimer:</strong> This is an independent project and is not affiliated with r/kcet community or its moderation team in any way.
          </p>
        </CardContent>
      </Card>

      {/* News - Primary section */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Star className="h-5 w-5" />
              KCET News & Updates
            </CardTitle>
            <Badge variant="secondary">Latest</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* CET 2026 Countdown Timer */}
            <CountdownTimer />

            {/* CET 2026 Exam Dates Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">📅 CET - 2026 Exam Schedule</h4>
                  <a
                    href="https://cetonline.karnataka.gov.in/kea/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-2 py-1 rounded hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                  >
                    KEA Official Website
                  </a>
                </div>
              </div>

              {/* CET 2026 Main Dates */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-600 text-white px-3 py-2 rounded-lg text-center">
                      <div className="text-lg font-bold">23, 24</div>
                      <div className="text-xs">APRIL</div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-900 dark:text-purple-100 text-lg">CET - 2026</div>
                      <div className="text-xs text-purple-700 dark:text-purple-300">Online Application starts: 17th January</div>
                    </div>
                  </div>

                  {/* Exam Schedule Responsive Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Day 1 */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
                      <div className="bg-purple-100 dark:bg-purple-900/50 p-3 flex justify-between items-center border-b border-purple-200 dark:border-purple-800">
                        <div className="font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                          <span className="text-lg">23</span>
                          <div className="flex flex-col leading-none text-xs">
                            <span>APRIL</span>
                            <span>2026</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Thursday</Badge>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        <div className="p-3 flex items-center gap-3">
                          <div className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded min-w-[60px] text-center">
                            MORNING
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">Physics</div>
                            <div className="text-xs text-slate-500">10:30 AM - 11:50 AM • 60 Marks</div>
                          </div>
                        </div>
                        <div className="p-3 flex items-center gap-3">
                          <div className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded min-w-[60px] text-center">
                            AFTERNOON
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">Chemistry</div>
                            <div className="text-xs text-slate-500">2:30 PM - 3:50 PM • 60 Marks</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Day 2 */}
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
                      <div className="bg-purple-100 dark:bg-purple-900/50 p-3 flex justify-between items-center border-b border-purple-200 dark:border-purple-800">
                        <div className="font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                          <span className="text-lg">24</span>
                          <div className="flex flex-col leading-none text-xs">
                            <span>APRIL</span>
                            <span>2026</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Friday</Badge>
                      </div>
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        <div className="p-3 flex items-center gap-3">
                          <div className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded min-w-[60px] text-center">
                            MORNING
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">Mathematics</div>
                            <div className="text-xs text-slate-500">10:30 AM - 11:50 AM • 60 Marks</div>
                          </div>
                        </div>
                        <div className="p-3 flex items-center gap-3">
                          <div className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded min-w-[60px] text-center">
                            AFTERNOON
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 dark:text-slate-200">Biology</div>
                            <div className="text-xs text-slate-500">2:30 PM - 3:50 PM • 60 Marks</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg border border-purple-200 dark:border-purple-800/50">
                    <div className="bg-purple-200 dark:bg-purple-800 p-1 rounded">
                      <div className="font-bold text-center leading-none">
                        <div className="text-[10px]">APR</div>
                        <div className="text-sm">22</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">Kannada Language Test</div>
                      <div className="opacity-80">For Horanadu & Gadinadu Kannadiga candidates only (4th Session)</div>
                    </div>
                  </div>
                </div>

                {/* Other Exams 2026 */}
                <div className="mt-4">
                  <h5 className="text-md font-bold text-slate-900 dark:text-slate-100 mb-3">📚 Other Exams Dates - 2026</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-pink-50 dark:bg-pink-950 p-3 rounded-lg border border-pink-200 dark:border-pink-800 text-center">
                      <div className="font-bold text-pink-900 dark:text-pink-100">01 MARCH</div>
                      <div className="text-sm font-semibold text-pink-700 dark:text-pink-300 mt-1">KRIES</div>
                      <div className="text-xs text-pink-600 dark:text-pink-400">Admission to 6th std Residential Schools</div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-950 p-3 rounded-lg border border-pink-200 dark:border-pink-800 text-center">
                      <div className="font-bold text-pink-900 dark:text-pink-100">14 MAY</div>
                      <div className="text-sm font-semibold text-pink-700 dark:text-pink-300 mt-1">PGCET</div>
                      <div className="text-xs text-pink-600 dark:text-pink-400">MBA, MCA</div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-950 p-3 rounded-lg border border-pink-200 dark:border-pink-800 text-center">
                      <div className="font-bold text-pink-900 dark:text-pink-100">23 MAY</div>
                      <div className="text-sm font-semibold text-pink-700 dark:text-pink-300 mt-1">PGCET</div>
                      <div className="text-xs text-pink-600 dark:text-pink-400">M.E / M.Tech</div>
                    </div>
                    <div className="bg-pink-50 dark:bg-pink-950 p-3 rounded-lg border border-pink-200 dark:border-pink-800 text-center">
                      <div className="font-bold text-pink-900 dark:text-pink-100">23 MAY</div>
                      <div className="text-sm font-semibold text-pink-700 dark:text-pink-300 mt-1">DCET</div>
                      <div className="text-xs text-pink-600 dark:text-pink-400">Lateral Entry to engineering courses</div>
                    </div>
                    <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded-lg border border-violet-200 dark:border-violet-800 text-center">
                      <div className="font-bold text-violet-900 dark:text-violet-100">18 JULY</div>
                      <div className="text-sm font-semibold text-violet-700 dark:text-violet-300 mt-1">M.Sc Nursing, MPT, M.Sc-AHS</div>
                    </div>
                    <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded-lg border border-violet-200 dark:border-violet-800 text-center">
                      <div className="font-bold text-violet-900 dark:text-violet-100">11 OCTOBER</div>
                      <div className="text-sm font-semibold text-violet-700 dark:text-violet-300 mt-1">KSET</div>
                    </div>
                    <div className="bg-violet-50 dark:bg-violet-950 p-3 rounded-lg border border-violet-200 dark:border-violet-800 text-center">
                      <div className="font-bold text-violet-900 dark:text-violet-100">21 NOVEMBER</div>
                      <div className="text-sm font-semibold text-violet-700 dark:text-violet-300 mt-1">M - Pharma & Pharma - D</div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-4 bg-slate-100 dark:bg-slate-700 p-3 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex flex-wrap items-center gap-4">
                    <span>📧 keaugcet25@gmail.com</span>
                    <span>🌐 https://cetonline.karnataka.gov.in/kea/</span>
                    <span>📞 080-23 460 460</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Reddit Community */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">r/</span>
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 dark:text-orange-200">KCET Community</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300">Visit r/kcet for more answers and discussions</p>
              </div>
            </div>
            <Button
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <a
                href="https://www.reddit.com/r/kcet/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Reddit
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KCET Coded Subreddit */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">r/</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-800 dark:text-blue-200">KCET Coded Community</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">Join r/KCETCoded for questions about this website and KCET guidance</p>
              </div>
            </div>
            <Button
              asChild
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <a
                href="https://www.reddit.com/r/KCETCoded/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Join Community
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.title} to={action.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{action.title}</h3>
                    <p className="text-sm text-foreground/70">{action.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Data Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <TrendingUp className="h-4 w-4 text-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRecords.toLocaleString()}</div>
              <p className="text-xs text-foreground/70">
                Cutoff entries across all years
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colleges</CardTitle>
              <GraduationCap className="h-4 w-4 text-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalColleges}</div>
              <p className="text-xs text-foreground/70">
                Engineering colleges covered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Branches</CardTitle>
              <BookOpen className="h-4 w-4 text-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBranches}</div>
              <p className="text-xs text-foreground/70">
                Engineering branches available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Years</CardTitle>
              <BarChart3 className="h-4 w-4 text-foreground/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.years).length}</div>
              <p className="text-xs text-foreground/70">
                Years of data available
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Statistics */}
      {stats && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Year-wise Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
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
                        <span className="text-foreground/70">{count.toLocaleString()} records</span>
                      </div>
                      <Progress
                        value={(count / stats.totalRecords) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Data by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.categories)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{category}</Badge>
                        <span className="text-sm">{count.toLocaleString()}</span>
                      </div>
                      <span className="text-sm text-foreground/70">
                        {((count / stats.totalRecords) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>


          {/* Top Branches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Top Branches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topBranches.map((branch, index) => (
                  <div key={branch.code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{branch.name}</div>
                        <div className="text-xs text-foreground/70">{branch.code}</div>
                      </div>
                    </div>
                    <Badge variant="secondary">{branch.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}


      {/* End News */}
    </div>
  )
}

export default Dashboard
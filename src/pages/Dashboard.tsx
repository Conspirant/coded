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
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false)

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
            {/* YouTube Video - First Item */}
            <a href="https://youtu.be/5gdCJ0yo8uc?si=fpklluR2TCVw6X5U" target="_blank" rel="noreferrer" className="block group">
              <div className="relative overflow-hidden rounded-none border-2 border-foreground/30 bg-card shadow-[6px_6px_0_0_rgba(0,0,0,0.35)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                <img
                  src="/images/kea-ugcet-2025-thumbnail.png"
                  alt="KEA Third Round UG CET Counseling Update - YouTube Video"
                  className="w-full h-[300px] object-cover group-hover:scale-[1.02] transition-transform"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span className="px-2 py-0.5 bg-red-600/80">YouTube</span>
                    <span className="opacity-80">Latest Update</span>
                  </div>
                  <h3 className="mt-1 text-white text-xl font-extrabold leading-snug tracking-tight">
                    KEA Third Round UG CET Counseling Update (By Prasanna Sir)
                  </h3>
                </div>
              </div>
            </a>

            {/* Detailed Summary Section */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex flex-col gap-3 mb-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">📢 KEA – Third Round UG CET Counseling Update (By Prasanna Sir)</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                    className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    {isSummaryExpanded ? 'Show Less' : 'Expand to view full details'}
                  </Button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-1 rounded">by u/upbeat-sign-7525</span>
                  <a 
                    href="https://www.reddit.com/r/kcet/comments/1ne49dq/kea_third_round_ug_cet_counseling_update_by/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 px-2 py-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                  >
                    View Original Post
                  </a>
                </div>
              </div>
              
              {isSummaryExpanded ? (
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
                  {/* News */}
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">📢 News</div>
                    <div className="ml-4 space-y-1">
                      <div>• <strong>Third Round Results Declared:</strong> KEA has published the final results of the 3rd round for UGCET courses (Engineering, Farm Sciences, Veterinary, Nursing, Allied Health Sciences, D. Pharma, etc.)</div>
                      <div>• Seats allotted strictly as per the options entered by students</div>
                    </div>
                  </div>

                  {/* Admission Process */}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">📋 Admission Process</div>
                    <div className="ml-4 space-y-2">
                      <div>• Students must download the Seat Confirmation Slip and report to the allotted college with all original documents before <strong>13th September</strong></div>
                      <div><strong>Fee Details:</strong>
                        <div className="ml-4 mt-1 space-y-1">
                          <div>• If already paid, balance will be adjusted</div>
                          <div>• If more is required → pay via challan/online</div>
                          <div>• If less is required → refund will be credited to the student</div>
                          <div>• SC/ST students (income under ₹1 lakh) who paid ₹10,000 will get full refund</div>
                        </div>
                      </div>
                      <div>• No further choice entry in 3rd round → only admission</div>
                    </div>
                  </div>

                  {/* Mandatory Reporting & Penalty */}
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    <div className="font-semibold text-red-900 dark:text-red-100 mb-2">⚠️ Mandatory Reporting & Penalty</div>
                    <div className="ml-4 space-y-1">
                      <div>• Students allotted seats must join the college</div>
                      <div>• If they skip:</div>
                      <div className="ml-4">- Penalty of 5× course fee</div>
                      <div className="ml-4">- 4-year ban from KEA counseling</div>
                      <div>• KEA IT team is tracking students who didn't report in earlier rounds; police action was taken last year against intentional seat blocking</div>
                    </div>
                  </div>

                  {/* Medical & Dental Seats */}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">🔹 Medical & Dental Seats</div>
                    <div className="ml-4 space-y-2">
                      <div><strong>Dental Confusion:</strong>
                        <div className="ml-4 mt-1 space-y-1">
                          <div>• Admissions depend on MCC schedule, which is repeatedly delayed</div>
                          <div>• NMC is still approving new colleges & extra seats (e.g., Farooqui Medical College – 100 seats, PS Medical College – +50 seats). Seat matrix not yet received</div>
                          <div>• Provisional allotment shown now; admissions only after MCC finalizes</div>
                          <div>• In earlier rounds, some dental seats were shown without deposit collection</div>
                          <div>• In 3rd round, fresh candidates must pay at least ₹10,000 deposit</div>
                          <div>• Students facing issues can email KEA; cases will be considered. No need to panic</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AYUSH Courses */}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">🧘 AYUSH Courses</div>
                    <div className="ml-4 space-y-1">
                      <div>• Fresh option entry for AYUSH will open from 15–17 September</div>
                      <div>• Choices 1, 2 & 4 will be allowed</div>
                      <div>• AYUSH will be clubbed with Medical & Dental allotments in the next MCC-linked round</div>
                    </div>
                  </div>

                  {/* Engineering Specific */}
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">🎓 Engineering Specific</div>
                    <div className="ml-4 space-y-2">
                      <div>• Last date of admission (ACC TO AICTE): <strong>15th September</strong></div>
                      <div>• After that, unallotted seats will be handed over to colleges</div>
                      <div>• List of unallotted seats will be published in KEA website</div>
                      <div>• Only students with a valid KCET rank who have not been allotted through KEA can approach colleges directly for vacant seats</div>
                      <div><strong>Who cannot take admission directly to colleges:</strong>
                        <div className="ml-4 mt-1 space-y-1">
                          <div>• Students who have already been allotted and admitted through KEA</div>
                          <div>• Students who have not written KCET and therefore do not have a KCET rank</div>
                        </div>
                      </div>
                      <div>• Government Engineering Colleges: Fees only ₹23,000 per year (5 branches available). 17 govt + 8 aided colleges listed on KEA website</div>
                    </div>
                  </div>

                  {/* Important Note for Medical Aspirants */}
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                    <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">📝 Important Note for Medical Aspirants</div>
                    <div className="ml-4 space-y-1">
                      <div>• Students allotted seats in UG CET courses (Eng/Agri/Nursing/etc.) but waiting for Medical/Dental should go and get admitted to allotted college</div>
                      <div>• Later they will be allowed to upgrade later in next round you will be allowed to leave that course and get admitted to medical/dental</div>
                      <div>• Already deposited fees will be adjusted/refunded accordingly</div>
                    </div>
                  </div>

                  {/* Action Required */}
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <div className="font-semibold text-green-900 dark:text-green-100 mb-2">✅ Action Required for Students:</div>
                    <div className="ml-4 space-y-1">
                      <div>• If allotted in UGCET 3rd round → Download seat slip, pay fee if needed, and report to college with originals by 13th Sept</div>
                      <div>• Engineering admissions close on 15th Sept (AS PER AICTE) – check KEA website for vacant seats</div>
                      <div>• Medical/Dental/AYUSH aspirants → Wait for MCC's next schedule, KEA will notify</div>
                    </div>
                  </div>

                  {/* Important Note */}
                  <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg">
                    <div className="font-semibold text-orange-900 dark:text-orange-100 mb-2">🚫 NOTE:</div>
                    <div className="ml-4 space-y-1">
                      <div>• <strong>No Further Rounds for UGCET Courses:</strong> There will be no additional rounds of counseling for UGCET and Engineering courses</div>
                      <div>• Engineering vacant seats left over by Medical/Dental candidates (after the AICTE admission deadline) will be carried forward and used for next year's DCET Lateral Entry</div>
                      <div>• Veterinary and Agriculture vacant seats will be managed as per the decision of the respective universities</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p className="mb-3 font-semibold">
                    📢 KEA has published the final results of the 3rd round for UGCET courses (Engineering, Farm Sciences, Veterinary, Nursing, Allied Health Sciences, D. Pharma, etc.).
                  </p>
                  
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">📋 ADMISSION PROCESS:</div>
                      <div className="text-xs space-y-1">
                        <div>• Download Seat Confirmation Slip and report to college with originals before <strong>13th September</strong></div>
                        <div>• Fee adjustment: If already paid, balance will be adjusted; if more required, pay via challan/online</div>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                      <div className="font-semibold text-red-900 dark:text-red-100 mb-2">⚠️ MANDATORY REPORTING:</div>
                      <div className="text-xs">
                        <strong>Students allotted seats must join the college. If they skip: Penalty of 5× course fee + 4-year ban from KEA counseling.</strong>
                      </div>
                    </div>

                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">🎓 KEY UPDATES:</div>
                      <div className="ml-4 space-y-1 text-xs">
                        <div>• <strong>Engineering:</strong> Last date of admission (AICTE): 15th September. Unallotted seats will be handed over to colleges</div>
                        <div>• <strong>Medical/Dental:</strong> Admissions depend on MCC schedule (repeatedly delayed). NMC still approving new colleges & extra seats</div>
                        <div>• <strong>AYUSH:</strong> Fresh option entry from 15–17 September. Will be clubbed with Medical & Dental in next MCC-linked round</div>
                        <div>• <strong>Government Engineering:</strong> Fees only ₹23,000 per year (5 branches available)</div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg">
                      <div className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">📝 IMPORTANT NOTE:</div>
                      <div className="text-xs">
                        <strong>No Further Rounds for UGCET Courses. Engineering vacant seats will be used for next year's DCET Lateral Entry.</strong>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
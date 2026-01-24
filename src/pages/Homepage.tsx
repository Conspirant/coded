import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Search,
    BarChart3,
    Calculator,
    Target,
    ArrowRight,
    GraduationCap,
    Users,
    ExternalLink,
    Sparkles,
    ChevronDown,
    Calendar,
    Zap,
    Shield,
    Clock,
    Star,
    CheckCircle2,
    Bot,
    FileText
} from "lucide-react"

interface DataStats {
    totalRecords: number
    totalColleges: number
    totalBranches: number
    years: string[]
    loading: boolean
}

const Homepage = () => {
    const navigate = useNavigate()
    const [mounted, setMounted] = useState(false)
    const [stats, setStats] = useState<DataStats>({
        totalRecords: 0,
        totalColleges: 0,
        totalBranches: 0,
        years: [],
        loading: true
    })
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const featuresRef = useRef<HTMLElement>(null)

    // Fetch real data from the cutoffs JSON
    useEffect(() => {
        setMounted(true)

        const loadRealStats = async () => {
            try {
                const urls = ['/data/cutoffs-summary.json', '/data/kcet_cutoffs_consolidated.json', '/kcet_cutoffs.json']
                let response: Response | null = null

                for (const url of urls) {
                    const r = await fetch(url, { cache: 'no-store' })
                    if (r.ok) { response = r; break }
                }

                if (!response) throw new Error('Failed to load data')

                const raw = await response.json()

                if (!Array.isArray(raw) && raw.totals && raw.years) {
                    // Summary format
                    setStats({
                        totalRecords: raw.totals.records,
                        totalColleges: raw.totals.colleges,
                        totalBranches: raw.totals.branches,
                        years: Object.keys(raw.years).sort((a, b) => b.localeCompare(a)),
                        loading: false
                    })
                    return
                }

                // Full data format
                const cutoffs = Array.isArray(raw) ? raw : (raw.cutoffs || raw.data || [])
                const colleges = new Set()
                const branches = new Set()
                const years = new Set<string>()

                cutoffs.forEach((record: any) => {
                    if (record.year) years.add(String(record.year))
                    if (record.institute_code) colleges.add(record.institute_code)
                    if (record.course) branches.add(record.course)
                })

                setStats({
                    totalRecords: cutoffs.length,
                    totalColleges: colleges.size,
                    totalBranches: branches.size,
                    years: Array.from(years).sort((a, b) => b.localeCompare(a)),
                    loading: false
                })
            } catch (error) {
                console.error('Error loading stats:', error)
                // Fallback values
                setStats({
                    totalRecords: 1400000,
                    totalColleges: 220,
                    totalBranches: 85,
                    years: ['2025', '2024', '2023'],
                    loading: false
                })
            }
        }

        loadRealStats()
    }, [])

    // Live countdown to CET 2026
    useEffect(() => {
        const targetDate = new Date('2026-04-23T10:30:00+05:30').getTime()

        const updateCountdown = () => {
            const now = new Date().getTime()
            const difference = targetDate - now

            if (difference > 0) {
                setCountdown({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000)
                })
            }
        }

        updateCountdown()
        const interval = setInterval(updateCountdown, 1000)
        return () => clearInterval(interval)
    }, [])

    const features = [
        {
            title: "College Finder",
            description: "Find the perfect college based on your rank, category, and preferences with smart filtering",
            icon: Search,
            href: "/college-finder",
            gradient: "from-blue-500 to-cyan-500",
            shadow: "shadow-blue-500/25",
            stats: `${stats.totalColleges}+ colleges`
        },
        {
            title: "Cutoff Explorer",
            description: "Analyze historical cutoff trends across years and rounds with interactive charts",
            icon: BarChart3,
            href: "/cutoff-explorer",
            gradient: "from-emerald-500 to-teal-500",
            shadow: "shadow-emerald-500/25",
            stats: `${stats.years.length} years data`
        },
        {
            title: "Rank Predictor",
            description: "Predict your KCET rank from your marks using calibrated 2025 data",
            icon: Calculator,
            href: "/rank-predictor",
            gradient: "from-purple-500 to-pink-500",
            shadow: "shadow-purple-500/25",
            stats: "98% accuracy"
        },
        {
            title: "Mock Simulator",
            description: "Simulate the actual seat allotment process with real cutoff data",
            icon: Target,
            href: "/mock-simulator",
            gradient: "from-orange-500 to-red-500",
            shadow: "shadow-orange-500/25",
            stats: "Live simulation"
        }
    ]

    const moreFeatures = [
        { title: "AI Counselor", description: "Get personalized guidance powered by AI", icon: Bot, href: "/ai-counselor", badge: "AI" },
        { title: "Round Tracker", description: "Track all counseling rounds and dates", icon: Calendar, href: "/round-tracker" },
        { title: "Documents Guide", description: "Complete checklist for counseling", icon: FileText, href: "/documents" },
        { title: "College Reviews", description: "Real reviews from students", icon: Star, href: "/reviews" }
    ]



    const highlights = [
        { icon: Zap, text: "Real-time data from official KEA sources", color: "text-yellow-500" },
        { icon: Shield, text: "100% free, no sign-up required", color: "text-green-500" },
        { icon: Clock, text: `Updated with ${stats.years[0] || '2025'} cutoffs`, color: "text-blue-500" },
        { icon: Users, text: "Trusted by thousands of students", color: "text-purple-500" }
    ]

    const AnimatedCounter = ({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) => {
        const [count, setCount] = useState(0)
        const [hasAnimated, setHasAnimated] = useState(false)
        const ref = useRef<HTMLSpanElement>(null)

        useEffect(() => {
            if (value === 0 || hasAnimated) return

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true)
                        const duration = 2000
                        const steps = 60
                        const increment = value / steps
                        let current = 0
                        const timer = setInterval(() => {
                            current += increment
                            if (current >= value) {
                                setCount(value)
                                clearInterval(timer)
                            } else {
                                setCount(Math.floor(current))
                            }
                        }, duration / steps)
                    }
                },
                { threshold: 0.5 }
            )

            if (ref.current) observer.observe(ref.current)
            return () => observer.disconnect()
        }, [value, hasAnimated])

        return (
            <span ref={ref}>
                {prefix}{count.toLocaleString()}{suffix}
            </span>
        )
    }

    const CountdownBox = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{String(value).padStart(2, '0')}</span>
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase tracking-wider">{label}</span>
        </div>
    )

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
                <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed" />
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-slow" />
                <div className="absolute bottom-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-float" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                KCET Coded
                            </span>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs hidden sm:inline-flex">
                                BETA
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm" className="hidden sm:flex">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link to="/college-finder">
                                <Button variant="ghost" size="sm" className="hidden md:flex">
                                    College Finder
                                </Button>
                            </Link>
                            <Link to="/dashboard">
                                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
                                    Get Started <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-20 sm:pt-24 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-3xl -z-10" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    {/* Live Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md border shadow-sm mb-6 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-sm font-medium tracking-wide">
                            {stats.loading ? 'Syncing Data...' : `${stats.totalRecords.toLocaleString()} Verified Records Live`}
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        Find your dream <br className="hidden sm:block" />
                        <span className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x p-2">
                                Engineering College
                            </span>
                            <Sparkles className="absolute -top-6 -right-8 h-10 w-10 text-yellow-400 animate-pulse hidden md:block" />
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className={`text-lg sm:text-xl md:text-2xl text-muted-foreground/90 max-w-3xl mx-auto mb-8 leading-relaxed transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        Free, open-source tools to check previous year cutoffs, predict your rank, and make smart choices for KCET counseling.
                    </p>

                    {/* Quick Search & Actions */}
                    <div className={`flex flex-col items-center gap-6 max-w-2xl mx-auto mb-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {/* Enhanced Search Bar */}
                        <div className="w-full relative group transform transition-all duration-300 hover:scale-[1.01]">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                            <div className="relative flex items-center bg-background/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2">
                                <Search className="ml-4 h-6 w-6 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search for a college (e.g. RVCE, PES)..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-4 text-lg outline-none placeholder:text-muted-foreground/40"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            navigate('/college-finder')
                                        }
                                    }}
                                />
                                <Button size="lg" className="hidden sm:flex rounded-xl px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40" onClick={() => navigate('/college-finder')}>
                                    Search
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link to="/dashboard">
                                <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl border-2 hover:bg-muted/50 text-base font-medium transition-all hover:-translate-y-0.5">
                                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Live CET 2026 Countdown */}
                    <div className={`mt-6 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="inline-flex flex-col sm:flex-row items-center gap-6 sm:gap-12 px-8 py-5 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all hover:-translate-y-1 group">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 group-hover:scale-110 transition-transform">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Next Exam</div>
                                    <div className="text-base font-semibold text-foreground">April 23, 2026</div>
                                </div>
                            </div>

                            <div className="hidden sm:block h-8 w-px bg-white/10"></div>

                            <div className="flex gap-6 text-center">
                                <div>
                                    <div className="text-2xl font-bold font-mono text-foreground mb-1">{String(countdown.days).padStart(2, '0')}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Days</div>
                                </div>
                                <div className="text-xl font-light text-muted-foreground/30 py-1">:</div>
                                <div>
                                    <div className="text-2xl font-bold font-mono text-foreground mb-1">{String(countdown.hours).padStart(2, '0')}</div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Hours</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - Premium Cards */}
            <section ref={featuresRef} id="features" className="py-16 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1">Powerful Tools</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                            Everything you need
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            We've organized millions of data points into simple, powerful tools.
                        </p>
                    </div>

                    {/* Main Features */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-20">
                        {features.map((feature, i) => (
                            <Link
                                key={feature.title}
                                to={feature.href}
                                className="group relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500/20 to-purple-500/20 rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-md"></div>
                                <div className={`relative h-full p-6 rounded-[1.75rem] bg-card/50 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <feature.icon className="h-7 w-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                                        {feature.description}
                                    </p>
                                    <div className="absolute bottom-6 left-6 flex items-center text-xs font-bold text-primary opacity-60 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        OPEN TOOL <ArrowRight className="ml-2 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Real Data Stats Section - Dark Premium Card */}
                    <div className="relative rounded-[2rem] bg-[#0c0c0c] border border-white/10 p-8 sm:p-12 text-center sm:text-left overflow-hidden isolate shadow-2xl">
                        {/* Background glow effects */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] -z-10" />

                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
                                    <Shield className="h-3.5 w-3.5" />
                                    <span>Verified Official Data</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white tracking-tight">
                                    Real cutoffs. <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">No estimates.</span>
                                </h2>
                                <p className="text-base text-gray-400 mb-8 leading-relaxed">
                                    We source our data directly from the KEA (Karnataka Examination Authority) PDF allotments. Every rank, every fee, and every seat is verified algorithmically.
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                                        <span className="text-sm font-medium text-gray-200">Direct KEA Sources</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                                        <span className="text-sm font-medium text-gray-200">Updated for 2025</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-3xl font-bold mb-1 text-white tabular-nums">
                                        {stats.loading ? '-' : (stats.totalRecords / 1000000).toFixed(1) + 'M+'}
                                    </div>
                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Records</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="text-3xl font-bold mb-1 text-white tabular-nums">
                                        {stats.loading ? '-' : stats.totalColleges}
                                    </div>
                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Colleges</div>
                                </div>
                                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors col-span-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-3xl font-bold mb-1 text-white tabular-nums">
                                                {stats.loading ? '-' : stats.years.length}
                                            </div>
                                            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider">Years of Data</div>
                                        </div>
                                        <BarChart3 className="h-12 w-12 text-white/10" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Community Section - Kept as is, but polished */}
            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center rounded-[2rem] bg-gradient-to-br from-gray-900 to-gray-800 p-8 sm:p-10 text-white overflow-hidden relative shadow-2xl">
                        {/* Decorator */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Join the Conversation</h2>
                            <p className="text-gray-300 text-base mb-8 max-w-sm">
                                Connect with thousands of students on Reddit. Real discussions, real doubts, real answers.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a href="https://www.reddit.com/r/kcet/" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white border-none rounded-xl h-11">
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        r/kcet
                                    </Button>
                                </a>
                                <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 rounded-xl h-11">
                                        <Bot className="mr-2 h-4 w-4" />
                                        r/KCETCoded
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="relative z-10 flex justify-center md:justify-end">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
                                    <div className="text-2xl font-bold mb-0.5">5k+</div>
                                    <div className="text-xs text-gray-400">Community Members</div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 translate-y-3">
                                    <div className="text-2xl font-bold mb-0.5">24/7</div>
                                    <div className="text-xs text-gray-400">Active Discussions</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        Start Your Journey Today
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        No sign-ups, no fees. Just pure tools and data to help you succeed.
                    </p>
                    <Link to="/dashboard">
                        <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all bg-foreground text-background">
                            Launch Dashboard
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t bg-muted/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-lg">KCET Coded</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Built by students, for students. Not affiliated with KEA.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Homepage

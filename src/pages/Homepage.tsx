import { SEO } from "@/components/SEO"
import { useState, useEffect, useRef, useCallback } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
import { CursorSpotlight, RippleEffect } from "@/components/InteractiveEffects"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/ui/Logo"
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
    Calendar,
    Zap,
    Shield,
    Clock,
    Star,
    CheckCircle2,
    Bot,
    FileText,
    ChevronRight,
    TrendingUp,
    Database,
    Flame,
    Sword,
    MapPin,
    Bus,
    Heart,
    Building2
} from "lucide-react"

interface DataStats {
    totalRecords: number
    totalColleges: number
    totalBranches: number
    years: string[]
    loading: boolean
}

const HERO_WORDS = ["Dream College", "Perfect Branch", "Best Rank", "Right Seat"]

const Homepage = () => {
    const [mounted, setMounted] = useState(false)
    const [stats, setStats] = useState<DataStats>({
        totalRecords: 0,
        totalColleges: 0,
        totalBranches: 0,
        years: [],
        loading: true
    })
    const [currentWord, setCurrentWord] = useState(0)
    const heroRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll()
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95])

    // Simple word cycling effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % HERO_WORDS.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    // Fetch real data
    useEffect(() => {
        setMounted(true)

        const loadRealStats = async () => {
            try {
                const urls = [
                    '/data/kcet_cutoffs_high_volume.dat',
                    '/data/kcet_cutoffs_master.dat',
                    '/data/kcet_cutoffs_consolidated.dat',
                    '/kcet_cutoffs_high_volume.dat',
                    '/kcet_cutoffs_master.dat',
                    '/kcet_cutoffs_consolidated.dat',
                    '/kcet_cutoffs.dat'
                ]
                let response: Response | null = null

                for (const url of urls) {
                    const r = await fetch(url, { cache: 'no-store' })
                    if (r.ok) { response = r; break }
                }

                if (!response) throw new Error('Failed to load data')

                const raw = await response.json()

                if (!Array.isArray(raw) && raw.totals && raw.years) {
                    setStats({
                        totalRecords: raw.totals.records,
                        totalColleges: raw.totals.colleges,
                        totalBranches: raw.totals.branches,
                        years: Object.keys(raw.years).sort((a, b) => b.localeCompare(a)),
                        loading: false
                    })
                    return
                }

                const metadata = Array.isArray(raw) ? null : (raw.metadata || null)
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
                    totalRecords: metadata?.total_entries ?? cutoffs.length,
                    totalColleges: metadata?.total_institutes ?? colleges.size,
                    totalBranches: metadata?.total_courses ?? branches.size,
                    years: Array.isArray(metadata?.years_covered) && metadata.years_covered.length > 0
                        ? [...metadata.years_covered].map(String).sort((a, b) => b.localeCompare(a))
                        : Array.from(years).sort((a, b) => b.localeCompare(a)),
                    loading: false
                })
            } catch (error) {
                console.error('Error loading stats:', error)
                setStats({
                    totalRecords: 0,
                    totalColleges: 0,
                    totalBranches: 0,
                    years: [],
                    loading: false
                })
            }
        }

        loadRealStats()
    }, [])

    const features = [
        {
            title: "College Predictor",
            description: "Find the perfect college based on your rank, category, and preferences with smart filtering",
            icon: Search,
            href: "/college-predictor",
            gradient: "from-blue-500 to-cyan-400",
            iconBg: "bg-blue-500/10",
            large: true,
            stat: `${stats.totalColleges.toLocaleString()} colleges`
        },
        {
            title: "Daily Challenge",
            description: "Test your KCET prep with 5 daily questions. Build your streak!",
            icon: Flame,
            href: "/daily-challenge",
            gradient: "from-orange-500 to-red-500",
            iconBg: "bg-orange-500/10",
            large: true,
            stat: "New Quiz Daily"
        },
        {
            title: "Cutoff Clash",
            description: "Play the Higher/Lower game with real college cutoffs. Test your knowledge!",
            icon: Sword,
            href: "/cutoff-clash",
            gradient: "from-pink-500 to-rose-500",
            iconBg: "bg-pink-500/10",
            large: true,
            stat: "VS Battle Mode"
        },
        {
            title: "Cutoff Explorer",
            description: "Analyze historical cutoff trends across years and rounds with interactive charts",
            icon: BarChart3,
            href: "/cutoff-explorer",
            gradient: "from-emerald-500 to-teal-400",
            iconBg: "bg-emerald-500/10",
            large: true,
            stat: `${stats.years.length} years data`
        },
        {
            title: "Rank Predictor",
            description: "Predict your KCET rank from marks using calibrated 2025 data",
            icon: Calculator,
            href: "/rank-predictor",
            gradient: "from-purple-500 to-pink-400",
            iconBg: "bg-purple-500/10",
            large: false,
            stat: "98% accuracy"
        },
        {
            title: "Mock Simulator",
            description: "Simulate the actual seat allotment with real cutoff data",
            icon: Target,
            href: "/mock-simulator",
            gradient: "from-orange-500 to-amber-400",
            iconBg: "bg-orange-500/10",
            large: false,
            stat: "Live simulation"
        }
    ]

    const moreFeatures = [
        { title: "College Directory", description: "All 232+ KCET colleges with ROI meters, placement statistics & reviews.", icon: Building2, href: "/colleges", badge: "New" },
        { title: "Admissions Assistant", description: "Interactive reference Q&A for counseling", icon: Bot, href: "/ai-counselor", badge: "Beta" },
        { title: "Mock Verification", description: "Check if your study & reserve papers are correct", icon: CheckCircle2, href: "/document-verification", badge: "New" },
        { title: "Documents Guide", description: "Complete checklist for counseling", icon: FileText, href: "/documents" }
    ]

    const statItems = [
        { value: stats.totalRecords, label: "Verified Records", icon: Database },
        { value: stats.totalColleges, label: "Colleges", icon: GraduationCap },
        { value: stats.totalBranches, label: "Branches", icon: TrendingUp },
    ]

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            <SEO
                title="KCET Coded – Free KCET 2026 Tools: Rank Predictor, Cutoffs & College Predictor"
                description="KCET Coded is an independent free platform for KCET 2026 aspirants. Predict your rank, explore college-wise cutoffs (2023-2025), find engineering colleges, simulate mock allotments & get interactive counseling assistance — all 100% free."
                url="https://kcetcoded.dev"
                keywords="KCET 2026, KCET tools, free KCET resources, KCET counseling guidance, Karnataka CET tools, KCET rank predictor, KCET cutoff 2025"
            />
            {/* ═══ Aurora Background ═══ */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 animate-aurora opacity-60 hidden md:block" />
                <div className="absolute inset-0 bg-background/40" />
                {/* Floating orbs */}
                <div className="absolute top-20 left-[15%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float-gentle hidden md:block" />
                <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-float-gentle hidden md:block" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/3 to-transparent rounded-full hidden md:block" />
            </div>

            {/* ═══ Navigation ═══ */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-2xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Logo mode="default" iconSize={24} textSize="text-lg" />
                            <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-semibold tracking-wider hidden sm:inline-flex">
                                BETA
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 sm:px-3">
                                    <span className="hidden sm:inline">r/KCETCoded</span>
                                    <ExternalLink className="h-4 w-4 sm:ml-1" />
                                </Button>
                            </a>
                            <a href="https://discord.gg/QZcjtJKjYJ" target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[#5865F2] px-2 sm:px-3">
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                    </svg>
                                </Button>
                            </a>
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link to="/college-predictor">
                                <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-foreground">
                                    College Predictor
                                </Button>
                            </Link>
                            <Link to="/dashboard">
                                <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0 transition-all hover:shadow-indigo-500/30 hover:scale-[1.02]">
                                    Get Started <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ═══ Hero Section ═══ */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
            >
                {/* Morphing blob behind headline */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] animate-morph bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-cyan-500/10 blur-2xl -z-10 hidden md:block" />

                {/* Interactive cursor spotlight + click ripple */}
                <div className="hidden md:block">
                    <CursorSpotlight containerRef={heroRef} />
                    <RippleEffect containerRef={heroRef} />
                </div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    {/* Live indicator pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-white/10 shadow-lg mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 animate-pulse-glow"></span>
                            </span>
                            <span className="text-sm font-medium text-foreground/80">
                                {stats.loading ? 'Syncing Data...' : `${stats.totalRecords.toLocaleString()} Verified Records Live`}
                            </span>
                        </div>
                    </motion.div>

                    {/* Headline with word cycling */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[0.95]"
                    >
                        Find your <br className="hidden sm:block" />
                        <motion.span
                            key={currentWord}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="gradient-text inline-block"
                        >
                            {HERO_WORDS[currentWord]}
                        </motion.span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Free, open-source tools to check previous year cutoffs, predict your rank, and make smart choices for KCET counseling.
                    </motion.p>



                    {/* Secondary Navigation buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-5"
                    >
                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <Link to="/dashboard">
                                <Button size="lg" className="h-12 rounded-xl border-0 bg-white px-7 font-semibold text-slate-950 shadow-lg shadow-white/10 transition-all hover:-translate-y-0.5 hover:bg-white/90">
                                    Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link to="/mock-simulator">
                                <Button variant="outline" size="lg" className="h-12 rounded-xl border-white/10 bg-white/5 px-6 text-foreground backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/10">
                                    Option entry simulator
                                </Button>
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">No login required</span>
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Verified KCET 2023-2025 cutoffs</span>
                            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">Anonymous contributions</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="mx-auto grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3"
                    >
                        {[
                            { icon: BarChart3, label: "Explore cutoffs", href: "/cutoff-explorer" },
                            { icon: Calculator, label: "Estimate rank", href: "/rank-predictor" },
                            { icon: Target, label: "Simulate allotment", href: "/mock-simulator" },
                        ].map((item) => (
                            <Link key={item.label} to={item.href} className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-foreground/85 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-indigo-300 transition-colors group-hover:text-cyan-300">
                                    <item.icon className="h-4 w-4" />
                                </span>
                                <span className="flex-1">{item.label}</span>
                                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* ═══ Stats Ticker ═══ */}
            {!stats.loading && stats.totalRecords > 0 && (
                <section className="py-6 border-y border-white/5 overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
                    <div className="flex animate-ticker whitespace-nowrap">
                        {[...Array(2)].map((_, dupeIdx) => (
                            <div key={dupeIdx} className="flex items-center gap-12 px-6">
                                {statItems.map((stat, i) => (
                                    <div key={`${dupeIdx}-${i}`} className="flex items-center gap-3">
                                        <stat.icon className="h-4 w-4 text-indigo-400" />
                                        <span className="text-sm font-semibold">{stat.value.toLocaleString()}</span>
                                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                                    </div>
                                ))}
                                <div className="flex items-center gap-3">
                                    <Zap className="h-4 w-4 text-amber-400" />
                                    <span className="text-sm text-muted-foreground">Real-time data from official KEA sources</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Shield className="h-4 w-4 text-emerald-400" />
                                    <span className="text-sm text-muted-foreground">100% free, no sign-up required</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-blue-400" />
                                    <span className="text-sm text-muted-foreground">Updated with {stats.years[0] || '2025'} cutoffs</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ═══ Features — Bento Grid ═══ */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        <Badge className="mb-4 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-4 py-1.5 text-xs font-semibold tracking-wider">
                            POWERFUL TOOLS
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                            Everything you need
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                            {stats.loading
                                ? "We're syncing the latest verified cutoffs into simple, powerful tools."
                                : `${stats.totalRecords.toLocaleString()} verified cutoff records organized into simple, powerful tools.`}
                        </p>
                    </motion.div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <Link to={feature.href} className="group block h-full">
                                    <div className={`rainbow-border relative h-full rounded-2xl glass hover:bg-white/[0.06] transition-all duration-500 tilt-card ${feature.large ? 'p-8' : 'p-6'}`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                                <feature.icon className="h-6 w-6 text-white" />
                                            </div>
                                            <Badge variant="secondary" className="bg-white/5 border-white/10 text-muted-foreground text-xs">
                                                {feature.stat}
                                            </Badge>
                                        </div>
                                        <h3 className={`${feature.large ? 'text-2xl' : 'text-xl'} font-bold mb-2 group-hover:text-indigo-400 transition-colors`}>
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                                            {feature.description}
                                        </p>
                                        <div className="absolute bottom-6 left-6 sm:left-8 flex items-center gap-2 text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                            OPEN TOOL <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* ═══ Data Section ═══ */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="relative rounded-3xl overflow-hidden glass border border-white/5 p-8 sm:p-12 shadow-2xl">
                            {/* Background glow */}
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 hidden md:block" />
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl -z-10 hidden md:block" />

                            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                                <div className="max-w-xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-5">
                                        <Shield className="h-3.5 w-3.5" />
                                        <span>Verified Official Data</span>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
                                        Real cutoffs. <br />
                                        <span className="gradient-text">No estimates.</span>
                                    </h2>
                                    <p className="text-muted-foreground mb-8 leading-relaxed">
                                        We source our data directly from the KEA (Karnataka Examination Authority) PDF allotments. Every rank, every fee, and every seat is verified algorithmically.
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/5">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                            <span className="text-sm font-medium">Direct KEA Sources</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/5">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                            <span className="text-sm font-medium">Updated for 2025</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto">
                                    <div className="glass rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-indigo-500/20 transition-colors group">
                                        <div className="text-2xl sm:text-3xl font-bold mb-1 tabular-nums group-hover:text-indigo-400 transition-colors">
                                            {stats.loading ? '—' : stats.totalRecords.toLocaleString()}
                                        </div>
                                        <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Records</div>
                                    </div>
                                    <div className="glass rounded-2xl p-4 sm:p-6 border border-white/5 hover:border-purple-500/20 transition-colors group">
                                        <div className="text-2xl sm:text-3xl font-bold mb-1 tabular-nums group-hover:text-purple-400 transition-colors">
                                            {stats.loading ? '—' : stats.totalColleges}
                                        </div>
                                        <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Colleges</div>
                                    </div>
                                    <div className="glass rounded-2xl p-4 sm:p-6 border border-white/5 col-span-2 hover:border-cyan-500/20 transition-colors group">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl sm:text-3xl font-bold mb-1 tabular-nums group-hover:text-cyan-400 transition-colors">
                                                    {stats.loading ? '—' : stats.years.length}
                                                </div>
                                                <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">Years of Data</div>
                                            </div>
                                            <BarChart3 className="h-10 w-10 text-white/5 group-hover:text-white/10 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ═══ More Tools ═══ */}
                    <div className="mt-14">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">More Tools</span>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {moreFeatures.map((item, i) => (
                                <Link key={item.title} to={item.href}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: i * 0.08 }}
                                        className="group relative p-5 rounded-2xl glass border border-white/5 hover:border-indigo-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer h-full tilt-card"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/15 transition-colors shrink-0">
                                                <item.icon className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-sm group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                                                    {item.badge && (
                                                        <Badge className="text-[10px] px-1.5 py-0 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-sm">
                                                            {item.badge}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Community Section ═══ */}
            <section className="py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid md:grid-cols-5 gap-0 rounded-3xl overflow-hidden glass border border-white/5 shadow-2xl"
                    >
                        {/* Left Side */}
                        <div className="md:col-span-3 p-8 sm:p-12 relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/8 rounded-full blur-3xl" />

                            <Badge variant="outline" className="w-fit mb-6 border-indigo-500/20 text-indigo-400 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold tracking-wider">
                                OFFICIAL SUPPORT HUB
                            </Badge>

                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Have questions? <br />
                                <span className="gradient-text">Ask r/KCETCoded</span>
                            </h2>
                            <p className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-lg">
                                The dedicated community for this website. Report bugs, suggest features, or discuss counseling strategies directly with the developer.
                            </p>

                            <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="rounded-xl h-13 px-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 text-base font-semibold transition-all hover:scale-[1.02] border-0">
                                    <Users className="mr-2 h-5 w-5" />
                                    Join r/KCETCoded
                                </Button>
                            </a>
                        </div>

                        {/* Right Side */}
                        <div className="md:col-span-2 bg-white/[0.02] p-8 border-l border-white/5 flex flex-col justify-between relative">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        Broader Community
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Explore additional student-run communities for broader discussions and crowd insights.
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <a href="https://www.reddit.com/r/kcet/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors">
                                            Visit r/kcet <ArrowRight className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                </div>

                                <div className="h-px bg-white/5 w-full" />

                                {/* Discord */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                        <svg className="h-4 w-4 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                        </svg>
                                        Join our Discord
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Real-time chat, voice channels, and direct support from the developer.
                                    </p>
                                    <a href="https://discord.gg/QZcjtJKjYJ" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-[#5865F2] hover:text-[#7289DA] transition-colors">
                                        Join Discord Server <ArrowRight className="ml-1 h-3 w-3" />
                                    </a>
                                </div>

                                <div className="h-px bg-white/5 w-full" />

                                <div>
                                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        Independent Project
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                                        "KCET Coded" is an individual initiative built to help students. We are <strong>not affiliated</strong> with Reddit or with the moderation team of r/kcet. These are independent public communities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ CTA Section ═══ */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-radial from-indigo-500/8 to-transparent rounded-full blur-2xl" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight">
                        Start Your Journey <span className="gradient-text">Today</span>
                    </h2>
                    <p className="text-lg text-muted-foreground mb-10">
                        No sign-ups, no fees. Just pure tools and data to help you succeed.
                    </p>
                    <Link to="/dashboard">
                        <Button size="lg" className="h-14 px-12 text-base rounded-full shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:scale-105 border-0">
                            Launch Dashboard
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </motion.div>
            </section>

            {/* ═══ Coded Labs Section ═══ */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative border-t border-white/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <Badge variant="outline" className="mb-4 text-xs font-mono tracking-widest border-purple-500/30 text-purple-400 bg-purple-500/5">
                            EXPERIMENTAL FEATURES
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Coded <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Labs</span>
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Unique tools you won't find anywhere else. Testing new ideas to solve old problems.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Squad Finder Card */}
                        <Link to="/squad-finder" className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-1">
                            <div className="absolute top-4 right-4">
                                <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 border-0 text-[10px] font-bold">NEW</Badge>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Users className="h-6 w-6 text-pink-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-pink-300 transition-colors">Squad Finder</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Don't split the gang. Find colleges where <span className="text-white">all your friends</span> can get a seat together.
                            </p>
                            <div className="flex items-center text-xs font-medium text-pink-400">
                                Try it out <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* Metro Mapper Card */}
                        <Link to="/metro-mapper" className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-1">
                            <div className="absolute top-4 right-4">
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-[10px] font-bold">BETA</Badge>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MapPin className="h-6 w-6 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-green-300 transition-colors">Metro Mapper</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Beat the traffic. Filter top colleges that are strictly within <span className="text-white">walking distance</span> of a Metro station.
                                <br /><span className="text-xs text-green-500/50 mt-2 block font-mono">✓ Verified distances from Google Maps</span>
                            </p>
                            <div className="flex items-center text-xs font-medium text-green-400">
                                View Map <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>

                        {/* BMTC Route Mapper Card */}
                        <Link to="/bmtc-mapper" className="block group">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all duration-300 h-full relative overflow-hidden flex flex-col items-start hover:border-blue-500/30">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-500/30">
                                    <Bus className="h-5 w-5 text-blue-400" />
                                </div>
                                <Badge variant="secondary" className="mb-3 bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] uppercase tracking-wider font-semibold">Public Transit</Badge>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-300 transition-colors">BMTC Bus Mapper</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Navigate like a local. Find which <span className="text-white">BMTC bus routes</span> and transport hubs connect to top engineering colleges.
                                    <br /><span className="text-xs text-blue-500/50 mt-2 block font-mono">✓ Verified 2024-2025 routes</span>
                                </p>
                                <div className="flex items-center text-xs font-medium text-blue-400">
                                    Find Routes <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>

                        {/* Hidden Gems Card */}
                        <Link to="/hidden-gems" className="group relative p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:-translate-y-1">
                            <div className="absolute top-4 right-4">
                                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 border-0 text-[10px] font-bold">HOT</Badge>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Sparkles className="h-6 w-6 text-amber-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-amber-300 transition-colors">Hidden Gems</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                High ROI, Low Cutoff. Our algorithm finds colleges with <span className="text-white">great placements</span> that are easier to get into.
                                <br /><span className="text-xs text-amber-500/50 mt-2 block font-mono">✓ Real placement data from official sources</span>
                            </p>
                            <div className="flex items-center text-xs font-medium text-amber-400">
                                Reveal Gems <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ Disclaimer Section ═══ */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 rounded-2xl glass border border-white/5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
                        <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                Independent Initiative
                                <Badge variant="outline" className="text-[10px] py-0 h-5 border-orange-500/20 text-orange-400 bg-orange-500/5">
                                    NOT OFFICIAL KEA
                                </Badge>
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                KCET Coded is an independent, community-driven project developed by students for students. We are <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected</strong> with the Karnataka Examination Authority (KEA), the Government of Karnataka, or any of their subsidiaries or affiliates.
                            </p>
                            <div className="pt-1">
                                <a
                                    href="https://cetonline.karnataka.gov.in/kea/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
                                >
                                    Visit Official KEA Website <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Footer ═══ */}
            <footer className="relative pt-12 pb-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <Logo mode="default" iconSize={22} textSize="text-base" />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Free, open-source tools built by students to simplify KCET counseling.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-xs mb-3 text-muted-foreground uppercase tracking-[0.15em]">Quick Links</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <Link to="/college-predictor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">College Predictor</Link>
                                <Link to="/cutoff-explorer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cutoff Explorer</Link>
                                <Link to="/rank-predictor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Rank Predictor</Link>
                                <Link to="/mock-simulator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mock Simulator</Link>
                                <Link to="/ai-counselor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Admissions Assistant</Link>
                                <Link to="/round-tracker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Round Tracker</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-xs mb-3 text-muted-foreground uppercase tracking-[0.15em]">Community</h4>
                            <div className="flex flex-col gap-2">
                                <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">r/KCETCoded</a>
                                <a href="https://discord.gg/QZcjtJKjYJ" target="_blank" rel="noopener noreferrer" className="text-sm text-[#5865F2] hover:text-[#7289DA] transition-colors">Discord Server</a>
                                <a href="https://www.reddit.com/r/kcet/" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">r/kcet</a>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-xs mb-3 text-muted-foreground uppercase tracking-[0.15em]">Creator</h4>
                            <div className="flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Built independently by a student to make counseling simpler for everyone.
                                </p>
                                <a href="https://www.reddit.com/user/Elegant_Compote9073/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center mt-1">
                                    Contact u/Elegant_Compote9073 <ArrowRight className="ml-1 h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="h-px bg-white/5 mb-6" />
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} KCET Coded. Not affiliated with KEA.
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                            <Link to="/payment-policy" className="hover:text-foreground transition-colors">Payment Policy</Link>
                            <Link to="/donate" className="hover:text-pink-400 transition-colors flex items-center gap-1">
                                <Heart className="h-3 w-3" /> Donate
                            </Link>
                        </div>
                        <p className="text-[11px] text-muted-foreground/60 tracking-wide text-center sm:text-right">
                            Created by & if any queries contact{' '}
                            <a 
                                href="https://www.reddit.com/user/Elegant_Compote9073/" 
                                target="_blank" 
                                rel="noreferrer"
                                className="font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline"
                            >
                                u/Elegant_Compote9073
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div >
    )
}

export default Homepage

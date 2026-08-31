import { SEO } from "@/components/SEO"
import AdUnit from "@/components/AdUnit"
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform } from "framer-motion"
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
    Shield,
    Clock,
    CheckCircle2,
    Bot,
    FileText,
    ChevronRight,
    TrendingUp,
    Database,
    Flame,
    Sword,
    MapPin,
    Building2,
    Heart,
    Sparkles,
    Layers,
    GitCompare,
    Bell,
    BookOpenCheck,
    Newspaper,
    Book,
    Gem,
    Bus
} from "lucide-react"

interface DataStats {
    totalRecords: number
    totalColleges: number
    totalBranches: number
    years: string[]
    loading: boolean
}

const HERO_WORDS = ["College Decisions", "Branch Cutoffs", "Rank Normalization", "Seat Planning"]

const Homepage = () => {
    const [stats, setStats] = useState<DataStats>({
        totalRecords: 240804,
        totalColleges: 269,
        totalBranches: 525,
        years: ['2026', '2025', '2024', '2023'],
        loading: false
    })
    const [currentWord, setCurrentWord] = useState(0)
    const heroRef = useRef<HTMLElement>(null)

    const { scrollYProgress } = useScroll()
    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98])

    // Load live statistics from cutoffs summary if available
    useEffect(() => {
        fetch('/data/cutoffs-summary.json')
            .then(res => res.json())
            .then(data => {
                if (data && data.totals) {
                    setStats({
                        totalRecords: data.totals.records || 240804,
                        totalColleges: data.totals.colleges || 269,
                        totalBranches: data.totals.branches || 525,
                        years: data.years ? Object.keys(data.years).reverse() : ['2026', '2025', '2024', '2023'],
                        loading: false
                    })
                }
            })
            .catch(err => console.warn('Could not load cutoff summary:', err))
    }, [])

    // Word cycling
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % HERO_WORDS.length)
        }, 3200)

        return () => clearInterval(interval)
    }, [])

    // 1. Core Admissions & Cutoffs
    const admissionTools = [
        {
            title: "TesselBot AI Counselor",
            description: "Instant cutoff query and admissions advisor backed by 240,804 verified KEA records across all 269 colleges and 25 quotas.",
            icon: Bot,
            href: "/ai-counselor",
            stat: "240k+ Cutoff Rows"
        },
        {
            title: "College Predictor",
            description: "Instant admission probability matching using multi-year KEA cutoff benchmarks and category quotas.",
            icon: Target,
            href: "/college-predictor",
            stat: `${stats.totalColleges.toLocaleString('en-IN')}+ Colleges`
        },
        {
            title: "Rank Predictor",
            description: "Calibrated rank estimation based on 50% KCET marks + 50% Board PCM normalized distribution.",
            icon: Calculator,
            href: "/rank-predictor",
            stat: "Normalized Model"
        },
        {
            title: "Cutoff Explorer",
            description: "Search official KEA cutoff ranks across GM, 2A, 3B, HK quotas, rounds, and branches from 2023 to 2026.",
            icon: BarChart3,
            href: "/cutoff-explorer",
            stat: "2023–2026 Database"
        },
        {
            title: "College Cutoffs",
            description: "Deep-dive cutoff archives categorized by college institute code, branches, and quotas.",
            icon: Building2,
            href: "/college-cutoffs",
            stat: "Per-Campus Data"
        },
        {
            title: "Cutoff Trends",
            description: "Analyze historical cutoff variations and rank inflation shifts across 2023 to 2026.",
            icon: TrendingUp,
            href: "/cutoff-trends",
            stat: "Multi-Year Analysis"
        },
        {
            title: "Mock Allotment Simulator",
            description: "Simulate official choice filling and seat allotment algorithms before locking your real options.",
            icon: Layers,
            href: "/mock-simulator",
            stat: "KEA Logic Engine"
        }
    ]

    // 2. Counseling & Verification Resources
    const counselingTools = [
        { title: "Round 3 Cutoff Predictor", description: "High-precision Round 3 cutoff forecasts anchored on 2026 Round 1 & Round 2 provisional allotment data.", icon: Target, href: "/round-predictor" },
        { title: "Round Tracker", description: "Real-time counseling calendar, choice entry windows, and seat allotment alerts.", icon: Bell, href: "/round-tracker" },
        { title: "Fee Structure Calculator", description: "Calculate exact tuition, university, and hostel fees across Govt vs Private seats.", icon: Calculator, href: "/fee-calculator" },
        { title: "College Directory", description: "Comprehensive profiles of 269+ engineering campuses with branch seats & placement stats.", icon: GraduationCap, href: "/colleges" },
        { title: "Mock Document Verification", description: "Verify study certificates, rural/kannada medium certificates, and RD numbers.", icon: BookOpenCheck, href: "/document-verification" },
        { title: "Official CET News", description: "Real-time notifications, circulars, and announcements directly from KEA.", icon: Newspaper, href: "/cet-news" }
    ]

    // 3. Prep & Practice
    const practiceTools = [
        { title: "Daily Practice Challenge", description: "Targeted KCET PCM daily question sets to sharpen conceptual problem-solving speed.", icon: Flame, href: "/daily-challenge", stat: "Daily Quizzes" },
        { title: "Cutoff Clash", description: "Benchmark your cutoff intuition with historical college vs college cutoff comparisons.", icon: Sword, href: "/cutoff-clash", stat: "Versus Battle" },
        { title: "Study Materials & Notes", description: "Curated chapter formulas, quick revision sheets, and previous year answer keys.", icon: Book, href: "/materials", stat: "Free Notes" }
    ]

    // 4. Coded Labs
    const codedLabsFeatures = [
        {
            title: "Squad Finder",
            description: "Don't split the gang. Find engineering colleges where all your friends can secure seats together across branches.",
            icon: Users,
            href: "/squad-finder",
            badge: "COMMUNITY",
            actionText: "Find Colleges for Squad"
        },
        {
            title: "Metro Mapper",
            description: "Locate Bangalore engineering campuses within direct walking distance or feeder connectivity to Namma Metro stations.",
            icon: MapPin,
            href: "/metro-mapper",
            badge: "TRANSIT",
            actionText: "Explore Metro Connected"
        },
        {
            title: "Hidden Gems",
            description: "Discover high-ROI institutions with moderate cutoff barriers, strong core placements, and active alumni networks.",
            icon: Gem,
            href: "/hidden-gems",
            badge: "CURATED",
            actionText: "Reveal Hidden Gems"
        },
        {
            title: "BMTC Transit Mapper",
            description: "Check direct bus routes, depot proximities, and student bus pass eligibility across Karnataka colleges.",
            icon: Bus,
            href: "/bmtc-mapper",
            badge: "ROUTES",
            actionText: "Map Transit Routes"
        }
    ]

    return (
        <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
            <SEO
                title="KCET Coded – Karnataka CET Cutoffs, Rank Predictor & College Analytics"
                description="Comprehensive academic analytics platform for Karnataka CET aspirants. Access verified KEA cutoffs (2023–2026), calculate rank predictions, and simulate option entries with verified data modeling."
                url="https://kcetcoded.dev"
                keywords="KCET 2026, KCET rank predictor, KCET cutoff 2026, KCET college predictor, Karnataka CET counseling, KEA cutoffs"
            />

            {/* Background Texture */}
            <div className="fixed inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-10" />

            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center gap-2.5">
                            <Logo mode="default" iconSize={26} textSize="text-base sm:text-lg font-bold tracking-tight text-foreground" />
                            <Badge variant="secondary" className="bg-muted text-muted-foreground border-border text-[10px] font-mono font-medium px-1.5 py-0 hidden sm:inline-flex">
                                2026
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs h-8">
                                    <span className="hidden sm:inline">r/KCETCoded</span>
                                    <ExternalLink className="h-3.5 w-3.5 sm:ml-1" />
                                </Button>
                            </a>
                            <Link to="/cutoff-explorer">
                                <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground hover:text-foreground text-xs h-8">
                                    Cutoffs
                                </Button>
                            </Link>
                            <Link to="/rank-predictor">
                                <Button variant="ghost" size="sm" className="hidden md:flex text-muted-foreground hover:text-foreground text-xs h-8">
                                    Rank Predictor
                                </Button>
                            </Link>
                            <Link to="/neet">
                                <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs h-8 font-semibold">
                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
                                    NEET Hub
                                </Button>
                            </Link>
                            <Link to="/dashboard">
                                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8 px-3.5 shadow-xs">
                                    Open Dashboard <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8"
            >
                <div className="max-w-4xl mx-auto text-center">
                    {/* Status Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border mb-6"
                    >
                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-medium text-muted-foreground">
                            {`${stats.totalRecords.toLocaleString('en-IN')} Verified Records • 2023–2026 Database`}
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 leading-[1.1] text-foreground"
                    >
                        Precision Analytics for <br />
                        <span className="text-primary inline-block">
                            {HERO_WORDS[currentWord]}
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
                    >
                        Data-backed Karnataka Common Entrance Test analytics. Analyze official KEA cutoffs, model rank distributions, and plan option entries with clarity.
                    </motion.p>

                    {/* Primary Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center gap-3 mb-10"
                    >
                        <Link to="/rank-predictor">
                            <Button size="lg" className="h-10 px-6 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs text-sm">
                                <Calculator className="mr-2 h-4 w-4" /> Estimate 2026 Rank
                            </Button>
                        </Link>
                        <Link to="/cutoff-explorer">
                            <Button variant="outline" size="lg" className="h-10 px-6 text-foreground bg-card hover:bg-muted border-border text-sm">
                                <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" /> Explore Cutoff Database
                            </Button>
                        </Link>
                        <Link to="/college-predictor">
                            <Button variant="outline" size="lg" className="h-10 px-6 text-foreground bg-card hover:bg-muted border-border text-sm">
                                <Target className="mr-2 h-4 w-4 text-muted-foreground" /> College Predictor
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Quick Metric Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left"
                    >
                        <div className="p-3.5 rounded-lg border border-border bg-card shadow-xs">
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Official Records</span>
                            <span className="text-xl font-bold font-mono text-foreground mt-0.5 block">{stats.totalRecords.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3.5 rounded-lg border border-border bg-card shadow-xs">
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Institutes Covered</span>
                            <span className="text-xl font-bold font-mono text-foreground mt-0.5 block">{stats.totalColleges.toLocaleString('en-IN')}+</span>
                        </div>
                        <div className="p-3.5 rounded-lg border border-border bg-card shadow-xs">
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Branches & Streams</span>
                            <span className="text-xl font-bold font-mono text-foreground mt-0.5 block">{stats.totalBranches.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="p-3.5 rounded-lg border border-border bg-card shadow-xs">
                            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">Dataset Timeline</span>
                            <span className="text-xl font-bold font-mono text-emerald-500 mt-0.5 block">2023–2026</span>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ═══ SECTION 1: Admissions & Cutoffs ═══ */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
                    <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono block mb-1">SECTION 01</span>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Admissions & Cutoff Analytics</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Core calculation and cutoff intelligence tools calibrated against official KEA records.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {admissionTools.map((tool) => (
                        <Link key={tool.title} to={tool.href} className="group block">
                            <div className="h-full p-5 rounded-lg border border-border bg-card hover:border-slate-600 transition-all shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <tool.icon className="h-4.5 w-4.5" />
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] font-mono text-muted-foreground px-2 py-0.5">
                                            {tool.stat}
                                        </Badge>
                                    </div>
                                    <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1.5">
                                        {tool.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {tool.description}
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-border/60 flex items-center text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                                    Launch Tool <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Ad Placement */}
            <div className="max-w-4xl mx-auto px-4">
                <AdUnit />
            </div>

            {/* ═══ SECTION 2: Counseling & Verification ═══ */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
                    <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono block mb-1">SECTION 02</span>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Counseling & Verification Resources</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Official guidance, fee estimates, document audits, and round schedules.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {counselingTools.map((item) => (
                        <Link key={item.title} to={item.href} className="group block">
                            <div className="p-4 rounded-lg border border-border bg-card hover:border-slate-600 transition-colors shadow-xs h-full flex flex-col justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="p-2.5 rounded-md bg-muted text-muted-foreground group-hover:text-foreground transition-colors shrink-0">
                                        <item.icon className="h-4.5 w-4.5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                                <div className="mt-3 pt-2 text-[11px] font-semibold text-muted-foreground group-hover:text-foreground flex items-center">
                                    View Resource <ArrowRight className="h-3 w-3 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 3: Practice & Challenges ═══ */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
                    <div>
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mono block mb-1">SECTION 03</span>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Prep & Practice Arena</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Targeted question quizzes, cutoff benchmarking games, and revision resources.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {practiceTools.map((practice) => (
                        <Link key={practice.title} to={practice.href} className="group block">
                            <div className="p-5 rounded-lg border border-border bg-card hover:border-slate-600 transition-all shadow-xs h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 rounded-md bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <practice.icon className="h-4 w-4" />
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] font-mono">{practice.stat}</Badge>
                                    </div>
                                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1">{practice.title}</h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{practice.description}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-border/60 text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex items-center">
                                    Start Practice <ArrowRight className="h-3 w-3 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ SECTION 4: Coded Labs ═══ */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-muted text-muted-foreground text-xs font-mono font-medium mb-3">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        EXPERIMENTAL RESEARCH
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Coded <span className="text-primary">Labs</span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Specialized decision algorithms and transit mappings built to solve complex counseling dilemmas.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {codedLabsFeatures.map((lab) => (
                        <Link key={lab.title} to={lab.href} className="group block h-full">
                            <div className="p-5 rounded-lg border border-border bg-card hover:border-slate-600 transition-all shadow-xs h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2.5 rounded-md bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                                            <lab.icon className="h-5 w-5" />
                                        </div>
                                        <Badge variant="secondary" className="text-[9px] font-mono px-1.5 py-0 text-muted-foreground">
                                            {lab.badge}
                                        </Badge>
                                    </div>
                                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-1.5">
                                        {lab.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {lab.description}
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-border/60 flex items-center text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {lab.actionText} <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══ Official KEA Disclaimer Box ═══ */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-border">
                <div className="rounded-lg border border-border bg-card p-6 sm:p-8 shadow-xs">
                    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                        <div className="p-3 rounded-md bg-muted text-amber-500 shrink-0">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-foreground">Independent Academic Platform</h3>
                                <Badge variant="outline" className="text-[10px] py-0 h-4 border-amber-500/20 text-amber-500 bg-amber-500/5 font-mono">
                                    NOT OFFICIAL KEA
                                </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                KCET Coded is an independent student initiative. We are <strong>not affiliated, associated, authorized, endorsed by, or officially connected</strong> with the Karnataka Examination Authority (KEA), the Government of Karnataka, or any government body.
                            </p>
                            <div className="pt-1">
                                <a
                                    href="https://cetonline.karnataka.gov.in/kea/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-foreground hover:underline inline-flex items-center gap-1"
                                >
                                    Visit Official KEA Portal (cetonline.karnataka.gov.in) <ExternalLink className="h-3 w-3 ml-0.5 text-muted-foreground" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Comprehensive Footer ═══ */}
            <footer className="pt-14 pb-8 border-t border-border bg-card/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                        {/* Col 1: Brand & Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Logo mode="default" iconSize={26} textSize="text-base sm:text-lg font-bold text-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Free, independent counseling analytics and admission modeling tools built to simplify Karnataka CET seat selection for every aspirant.
                            </p>
                            <div className="pt-1">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Archive: 2023–2026 Multi-Year KEA
                                </span>
                            </div>
                        </div>

                        {/* Col 2: Tools */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider font-mono">Admission Tools</h4>
                            <ul className="space-y-2 text-xs text-muted-foreground">
                                <li><Link to="/college-predictor" className="hover:text-foreground transition-colors">College Predictor</Link></li>
                                <li><Link to="/cutoff-explorer" className="hover:text-foreground transition-colors">Cutoff Explorer</Link></li>
                                <li><Link to="/rank-predictor" className="hover:text-foreground transition-colors">Rank & Score Predictor</Link></li>
                                <li><Link to="/mock-simulator" className="hover:text-foreground transition-colors">Mock Allotment Simulator</Link></li>
                                <li><Link to="/round-tracker" className="hover:text-foreground transition-colors">Round Tracker</Link></li>
                                <li><Link to="/fee-calculator" className="hover:text-foreground transition-colors">Fee Structure Calculator</Link></li>
                                <li><Link to="/cutoff-trends" className="hover:text-foreground transition-colors">Multi-Year Cutoff Trends</Link></li>
                            </ul>
                        </div>

                        {/* Col 3: Community & Resources */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider font-mono">Community & Resources</h4>
                            <ul className="space-y-2 text-xs text-muted-foreground">
                                <li><a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1">r/KCETCoded Subreddit <ExternalLink className="h-3 w-3 text-muted-foreground" /></a></li>
                                <li><a href="https://discord.gg/QZcjtJKjYJ" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1">Discord Student Server <ExternalLink className="h-3 w-3 text-muted-foreground" /></a></li>
                                <li><a href="https://www.reddit.com/r/kcet/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors inline-flex items-center gap-1">r/kcet Community <ExternalLink className="h-3 w-3 text-muted-foreground" /></a></li>
                                <li><Link to="/colleges" className="hover:text-foreground transition-colors">College Directory (269+)</Link></li>
                                <li><Link to="/documents" className="hover:text-foreground transition-colors">Counseling Documents Checklist</Link></li>
                                <li><Link to="/document-verification" className="hover:text-foreground transition-colors">Mock Document Verification</Link></li>
                                <li><Link to="/cet-news" className="hover:text-foreground transition-colors">Official CET News Feed</Link></li>
                            </ul>
                        </div>

                        {/* Col 4: Creator & Project */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider font-mono">Project & Creator</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Developed independently to provide high-speed, transparent counseling tools to all students free of charge.
                            </p>
                            <div className="pt-1 space-y-2">
                                <a
                                    href="https://www.reddit.com/user/Elegant_Compote9073/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-semibold text-foreground hover:underline inline-flex items-center gap-1.5"
                                >
                                    Contact u/Elegant_Compote9073 <ArrowRight className="h-3 w-3" />
                                </a>
                                <div>
                                    <Link to="/supporters" className="text-xs text-muted-foreground hover:text-foreground transition-colors block">
                                        Supporters Wall
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border/80 mb-6" />

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                        <p>
                            © {new Date().getFullYear()} KCET Coded. All cutoff data sourced from official KEA archives.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                            <Link to="/payment-policy" className="hover:text-foreground transition-colors">Payment Policy</Link>
                            <Link to="/donate" className="hover:text-pink-500 transition-colors flex items-center gap-1 font-medium text-foreground">
                                <Heart className="h-3.5 w-3.5 text-pink-500" /> Support the Project
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Homepage

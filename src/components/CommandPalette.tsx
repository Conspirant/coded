import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Calculator,
    BarChart3,
    Target,
    TrendingUp,
    Home,
    LayoutDashboard,
    Building2,
    Bell,
    FileText,
    Star,
    Info,
    Book,
    Bot,
    Shuffle,
    GitCompare,
    ClipboardList,
    ArrowRight,
    Command,
    CornerDownLeft,
    Flame,
    Sword,
    Newspaper,
    ShieldCheck,
    Brain
} from "lucide-react"
import { useExamMode } from "@/contexts/ExamModeContext"

interface CommandItem {
    id: string
    title: string
    description: string
    icon: any
    href: string
    keywords: string[]
    category: "main" | "tools"
    external?: boolean
}

const COMMANDS: CommandItem[] = [
    { id: "home", title: "Home", description: "Go to homepage", icon: Home, href: "/", keywords: ["home", "landing", "main"], category: "main" },
    { id: "daily-challenge", title: "Daily Challenge", description: "Daily KCET quiz & streak", icon: Flame, href: "/daily-challenge", keywords: ["daily", "quiz", "challenge", "test", "streak"], category: "main" },
    { id: "cutoff-clash", title: "Cutoff Clash", description: "Higher/Lower cutoff game", icon: Sword, href: "/cutoff-clash", keywords: ["game", "play", "clash", "cutoff", "higher", "lower", "vs"], category: "main" },
    { id: "dashboard", title: "Dashboard", description: "Overview & stats", icon: LayoutDashboard, href: "/dashboard", keywords: ["dashboard", "overview", "stats"], category: "main" },
    { id: "college-finder", title: "College Finder", description: "Find colleges by rank", icon: Target, href: "/college-finder", keywords: ["college", "find", "search", "rank"], category: "main" },
    { id: "cutoff-explorer", title: "Cutoff Explorer", description: "Analyze cutoff trends", icon: BarChart3, href: "/cutoff-explorer", keywords: ["cutoff", "explore", "trends", "analyze"], category: "main" },
    { id: "comedk-explorer", title: "COMEDK Explorer", description: "Browse COMEDK cutoffs with source PDFs", icon: ShieldCheck, href: "/comedk-explorer", keywords: ["comedk", "cutoff", "explorer", "gm", "kkr", "hkr"], category: "main" },
    { id: "rank-predictor", title: "Rank Predictor", description: "Predict rank from marks", icon: Calculator, href: "/rank-predictor", keywords: ["rank", "predict", "marks", "score"], category: "main" },
    { id: "college-cutoffs", title: "College Cutoffs", description: "View cutoff matrix for all colleges", icon: Building2, href: "/college-cutoffs", keywords: ["college", "cutoffs", "matrix", "browse"], category: "main" },
    { id: "college-directory", title: "College Directory", description: "Browse 232+ KCET colleges with ROI, placements & reviews", icon: Building2, href: "/colleges", keywords: ["college", "directory", "list", "info", "roi", "placement", "reviews", "cet"], category: "main" },
    { id: "cutoff-trends", title: "Cutoff Trends", description: "Year-over-year cutoff rank charts", icon: TrendingUp, href: "/cutoff-trends", keywords: ["trend", "chart", "graph", "year", "history", "cutoff", "compare"], category: "main" },
    { id: "mock-simulator", title: "Mock Simulator", description: "Simulate seat allotment", icon: Shuffle, href: "/mock-simulator", keywords: ["mock", "simulate", "allotment", "seat"], category: "tools" },
    { id: "round-tracker", title: "Round Tracker", description: "Counseling round dates", icon: Bell, href: "/round-tracker", keywords: ["round", "track", "counseling", "dates"], category: "tools" },
    { id: "documents", title: "Documents Guide", description: "Required documents checklist", icon: FileText, href: "/documents", keywords: ["documents", "checklist", "guide"], category: "tools" },
    { id: "cet-news", title: "CET News", description: "Official CET updates and notices", icon: Newspaper, href: "/cet-news", keywords: ["cet", "news", "update", "press note", "kea"], category: "tools" },
    { id: "reviews", title: "College Reviews", description: "Student reviews", icon: Star, href: "/reviews", keywords: ["reviews", "feedback", "students"], category: "tools" },
    { id: "info-centre", title: "Info Centre", description: "KCET information hub", icon: Info, href: "/info-centre", keywords: ["info", "information", "centre", "hub"], category: "tools" },
    { id: "materials", title: "Study Materials", description: "Preparation resources", icon: Book, href: "/materials", keywords: ["materials", "study", "resources", "prep"], category: "tools" },
    { id: "kcet", title: "r/kcet", description: "Open KCET community", icon: ArrowRight, href: "https://www.reddit.com/r/kcet/", keywords: ["kcet", "reddit", "community", "discussion"], category: "tools", external: true },
    { id: "planner", title: "Planner", description: "Plan your admissions", icon: ClipboardList, href: "/planner", keywords: ["planner", "plan", "admissions"], category: "tools" },
    { id: "college-compare", title: "College Compare", description: "Compare colleges side by side", icon: GitCompare, href: "/college-compare", keywords: ["compare", "college", "versus", "vs"], category: "tools" },
    { id: "ai-counselor", title: "Admissions Assistant", description: "Interactive reference assistant", icon: Bot, href: "/ai-counselor", keywords: ["assistant", "counselor", "guidance", "help", "ask", "chat"], category: "tools" },
]

export function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(0)
    const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null)
    const listRef = useRef<HTMLDivElement>(null)
    const { examMode } = useExamMode()

    const commands = useMemo(() => {
        return COMMANDS
            .filter((cmd) => cmd.id !== "comedk-explorer")
            .map((cmd) => {
            if (cmd.id === "cutoff-explorer") {
                return examMode === "COMEDK"
                    ? {
                        ...cmd,
                        title: "COMEDK Explorer",
                        description: "Browse COMEDK cutoffs with source PDFs",
                        keywords: ["comedk", "cutoff", "explorer", "gm", "kkr", "hkr"],
                    }
                    : {
                        ...cmd,
                        title: "Cutoff Explorer",
                        description: "Analyze KCET cutoff trends",
                        keywords: ["kcet", "cutoff", "explore", "trends", "analyze"],
                    }
            }

            if (cmd.id === "rank-predictor") {
                return examMode === "COMEDK"
                    ? {
                        ...cmd,
                        title: "COMEDK Rank Predictor",
                        description: "Predict COMEDK rank from marks",
                        keywords: ["comedk", "rank", "predict", "marks", "score"],
                    }
                    : cmd
            }

            if (cmd.id === "kcet") {
                return examMode === "COMEDK"
                    ? {
                        ...cmd,
                        title: "r/COMEDK",
                        description: "Open COMEDK community",
                        href: "https://www.reddit.com/r/comedk/",
                        keywords: ["comedk", "reddit", "community", "discussion"],
                    }
                    : cmd
            }

            return cmd
        })
    }, [examMode])

    // Filter commands
    const filtered = query.trim() === ""
        ? commands
        : commands.filter(cmd =>
            cmd.title.toLowerCase().includes(query.toLowerCase()) ||
            cmd.description.toLowerCase().includes(query.toLowerCase()) ||
            cmd.keywords.some(k => k.includes(query.toLowerCase()))
        )

    // Keyboard shortcut to open
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault()
                setOpen(prev => !prev)
            }
            if (e.key === "Escape") {
                setOpen(false)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    // Focus input when opened
    useEffect(() => {
        if (open) {
            setQuery("")
            setSelectedIndex(0)
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [open])

    // Reset selection on filter change
    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    // Scroll selected item into view
    useEffect(() => {
        if (!listRef.current) return
        const items = listRef.current.querySelectorAll('[data-command-item]')
        items[selectedIndex]?.scrollIntoView({ block: 'nearest' })
    }, [selectedIndex])

    const onSelect = useCallback((item: CommandItem) => {
        setOpen(false)
        if (item.external) {
            window.open(item.href, "_blank", "noopener,noreferrer")
            return
        }
        navigate(item.href)
    }, [navigate])

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelectedIndex(i => Math.min(i + 1, filtered.length - 1))
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex(i => Math.max(i - 1, 0))
        } else if (e.key === "Enter") {
            e.preventDefault()
            if (filtered[selectedIndex]) {
                onSelect(filtered[selectedIndex])
            }
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="fixed inset-x-2 top-16 bottom-24 z-[201] md:inset-x-auto md:top-[15%] md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:w-[95vw] md:max-w-xl"
                    >
                        <div className="glass-strong rounded-2xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden h-full md:h-auto flex flex-col">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
                                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={onKeyDown}
                                    placeholder="Search tools, pages... Jump anywhere"
                                    className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground/50"
                                />
                                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-muted-foreground font-mono">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div ref={listRef} className="flex-1 min-h-0 md:max-h-[50vh] overflow-y-auto py-2">
                                {filtered.length === 0 ? (
                                    <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                                        No results found for "{query}"
                                    </div>
                                ) : (
                                    filtered.map((item, i) => (
                                        <button
                                            key={item.id}
                                            data-command-item
                                            onClick={() => onSelect(item)}
                                            onMouseEnter={() => setSelectedIndex(i)}
                                            className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${i === selectedIndex
                                                ? "bg-indigo-500/10 text-foreground"
                                                : "text-muted-foreground hover:bg-white/5"
                                                }`}
                                        >
                                            <div className={`p-2 rounded-lg transition-colors ${i === selectedIndex ? "bg-indigo-500/20 text-indigo-400" : "bg-white/5"
                                                }`}>
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-sm">{item.title}</div>
                                                <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                                            </div>
                                            {i === selectedIndex && (
                                                <CornerDownLeft className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>

                            {/* Footer hint */}
                            <div className="px-5 py-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground/60">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↑↓</kbd>
                                        Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">↵</kbd>
                                        Open
                                    </span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <Command className="h-3 w-3" />K to toggle
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

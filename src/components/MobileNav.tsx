import { NavLink, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import {
    Home,
    LayoutDashboard,
    Search,
    BarChart3,
    Calculator,
    Target,
    Sparkles,
    MoreHorizontal,
    X,
    Bot,
    Bell,
    FileText,
    Star,
    Info,
    Book,
    Building2,
    Shuffle,
    GitCompare,
    ClipboardList,
    Command,
    Flame,
    Sword,
    ExternalLink,
    TrendingUp
} from "lucide-react"
import { useExamMode } from "@/contexts/ExamModeContext"

/* ═══════════════════════════════════════════════════
   MOBILE DOCK — iOS-style bottom navigation
   Shows on screens < 768px, replaces sidebar
   ═══════════════════════════════════════════════════ */

interface DockItem {
    icon: any
    label: string
    href: string
}

interface MoreItem extends DockItem {
    external?: boolean
}

const getDockItems = (examMode: "KCET" | "COMEDK"): DockItem[] =>
    examMode === "COMEDK"
        ? [
            { icon: Home, label: "Home", href: "/" },
            { icon: LayoutDashboard, label: "Dash", href: "/dashboard" },
            { icon: BarChart3, label: "COMEDK", href: "/cutoff-explorer" },
            { icon: Calculator, label: "Predict", href: "/rank-predictor" },
        ]
        : [
            { icon: Home, label: "Home", href: "/" },
            { icon: Search, label: "Predictor", href: "/college-predictor" },
            { icon: BarChart3, label: "Cutoffs", href: "/cutoff-explorer" },
            { icon: Calculator, label: "Predict", href: "/rank-predictor" },
        ]

const getMoreItems = (examMode: "KCET" | "COMEDK"): MoreItem[] => {
    if (examMode === "COMEDK") {
        return [
            { icon: Flame, label: "Daily Quiz", href: "/daily-challenge" },
            { icon: Sword, label: "VS Clash", href: "/cutoff-clash" },
            { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
            { icon: Building2, label: "Colleges", href: "/colleges" },
            { icon: Bell, label: "Rounds", href: "/round-tracker" },
            { icon: FileText, label: "Documents", href: "/documents" },
            { icon: Star, label: "Reviews", href: "/reviews" },
            { icon: Info, label: "Info", href: "/info-centre" },
            { icon: Book, label: "Materials", href: "/materials" },
            { icon: Bot, label: "Admissions Assistant", href: "/ai-counselor" },
            { icon: ExternalLink, label: "r/COMEDK", href: "https://www.reddit.com/r/comedk/", external: true },
        ]
    }

    return [
        { icon: Calculator, label: "Fee Calc", href: "/fee-calculator" },
        { icon: Flame, label: "Daily Quiz", href: "/daily-challenge" },
        { icon: Sword, label: "VS Clash", href: "/cutoff-clash" },
        { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
        { icon: Building2, label: "Colleges", href: "/colleges" },
        { icon: Target, label: "Mock Sim", href: "/mock-simulator" },
        { icon: Building2, label: "Cutoffs", href: "/college-cutoffs" },
        { icon: TrendingUp, label: "Trends", href: "/cutoff-trends" },
        { icon: Bell, label: "Rounds", href: "/round-tracker" },
        { icon: FileText, label: "Documents", href: "/documents" },
        { icon: Star, label: "Reviews", href: "/reviews" },
        { icon: Info, label: "Info", href: "/info-centre" },
        { icon: Book, label: "Materials", href: "/materials" },
        { icon: Bot, label: "Admissions Assistant", href: "/ai-counselor" },
        { icon: ExternalLink, label: "KCETards", href: "https://www.reddit.com/r/KCETards/", external: true },
        { icon: Shuffle, label: "Mock Sim", href: "/mock-simulator" },
    ]
}

export function MobileDock() {
    const [moreOpen, setMoreOpen] = useState(false)
    const location = useLocation()
    const sheetRef = useRef<HTMLDivElement>(null)
    const { examMode } = useExamMode()
    const dockItems = getDockItems(examMode)
    const moreItems = getMoreItems(examMode)

    // Close sheet on route change
    useEffect(() => {
        setMoreOpen(false)
    }, [location.pathname])

    // Close on outside click
    useEffect(() => {
        if (!moreOpen) return
        const onClick = (e: MouseEvent) => {
            if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
                setMoreOpen(false)
            }
        }
        document.addEventListener("mousedown", onClick)
        return () => document.removeEventListener("mousedown", onClick)
    }, [moreOpen])

    return (
        <>
            {/* More menu — bottom sheet */}
            <AnimatePresence>
                {moreOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            ref={sheetRef}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-[91] md:hidden"
                        >
                            <div className="glass-strong rounded-t-3xl border-t border-x border-white/10 shadow-2xl shadow-black/40 pb-24 max-h-[70vh] overflow-y-auto">
                                {/* Handle bar */}
                                <div className="flex justify-center pt-3 pb-2">
                                    <div className="w-10 h-1 rounded-full bg-white/20" />
                                </div>

                                {/* Header */}
                                <div className="px-5 pb-4 flex items-center justify-between">
                                    <h3 className="font-bold text-lg">All Tools</h3>
                                    <button
                                        onClick={() => setMoreOpen(false)}
                                        className="p-2 rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        <X className="h-5 w-5 text-muted-foreground" />
                                    </button>
                                </div>

                                {/* Grid of tools */}
                                <div className="grid grid-cols-4 gap-2 px-4">
                                    {moreItems.map((item, i) => (
                                        item.external ? (
                                            <a
                                                key={item.href + i}
                                                href={item.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => setMoreOpen(false)}
                                                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all text-muted-foreground hover:bg-white/5 active:scale-95"
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
                                            </a>
                                        ) : (
                                            <NavLink
                                                key={item.href + i}
                                                to={item.href}
                                                className={({ isActive }) =>
                                                    `flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${isActive
                                                        ? "bg-indigo-500/15 text-indigo-400"
                                                        : "text-muted-foreground hover:bg-white/5 active:scale-95"
                                                    }`
                                                }
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
                                            </NavLink>
                                        )
                                    ))}
                                </div>

                                {/* Cmd+K hint */}
                                <div className="px-5 pt-4 pb-2">
                                    <button
                                        onClick={() => {
                                            setMoreOpen(false)
                                            window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))
                                        }}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl glass border border-white/5 text-sm text-muted-foreground"
                                    >
                                        <Command className="h-3.5 w-3.5" />
                                        Search anything…
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ═══ Bottom Dock Bar ═══ */}
            <nav className="fixed bottom-0 left-0 right-0 z-[80] md:hidden">
                {/* Frosted bar */}
                <div className="mx-3 mb-3 rounded-2xl glass-strong border border-white/10 shadow-2xl shadow-black/30">
                    <div className="flex items-center justify-around px-2 py-1.5">
                        {dockItems.map((item) => (
                            <DockIcon key={item.href} item={item} />
                        ))}
                        {/* More button */}
                        <button
                            onClick={() => setMoreOpen(!moreOpen)}
                            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all active:scale-90 ${moreOpen ? "text-indigo-400" : "text-muted-foreground"
                                }`}
                        >
                            <div className="relative">
                                <MoreHorizontal className="h-5 w-5" />
                                {moreOpen && (
                                    <motion.div
                                        layoutId="dock-indicator"
                                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400"
                                    />
                                )}
                            </div>
                            <span className="text-[10px] font-medium mt-0.5">More</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    )
}

function DockIcon({ item }: { item: DockItem }) {
    const location = useLocation()
    const isActive = item.href === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.href)

    return (
        <NavLink
            to={item.href}
            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all active:scale-90 ${isActive ? "text-indigo-400" : "text-muted-foreground"
                }`}
        >
            <div className="relative">
                <motion.div
                    animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <item.icon className="h-5 w-5" style={isActive ? { filter: "drop-shadow(0 0 6px rgba(99,102,241,0.5))" } : {}} />
                </motion.div>
                {isActive && (
                    <motion.div
                        layoutId="dock-indicator"
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-400 shadow-lg shadow-indigo-500/50"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                )}
            </div>
            <span className={`text-[10px] font-medium mt-0.5 ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
        </NavLink>
    )
}

/* ═══════════════════════════════════════════════════
   FLOATING ACTION BUTTON — radial quick actions
   ═══════════════════════════════════════════════════ */

const getFabActions = (examMode: "KCET" | "COMEDK") =>
    examMode === "COMEDK"
        ? [
            { icon: Flame, label: "Daily Quiz", href: "/daily-challenge", color: "from-orange-500 to-red-500" },
            { icon: BarChart3, label: "COMEDK Explorer", href: "/cutoff-explorer", color: "from-amber-500 to-orange-500" },
            { icon: Calculator, label: "Predict Rank", href: "/rank-predictor", color: "from-purple-500 to-pink-400" },
            { icon: Bot, label: "Admissions Assistant", href: "/ai-counselor", color: "from-emerald-500 to-teal-400" },
        ]
        : [
            { icon: Flame, label: "Daily Quiz", href: "/daily-challenge", color: "from-orange-500 to-red-500" },
            { icon: Search, label: "Find College", href: "/college-predictor", color: "from-blue-500 to-cyan-400" },
            { icon: Calculator, label: "Predict Rank", href: "/rank-predictor", color: "from-purple-500 to-pink-400" },
            { icon: Bot, label: "Admissions Assistant", href: "/ai-counselor", color: "from-emerald-500 to-teal-400" },
        ]

export function FloatingActionButton() {
    const [open, setOpen] = useState(false)
    const location = useLocation()
    const { examMode } = useExamMode()
    const fabActions = getFabActions(examMode)

    // Hide on homepage (it has its own CTA)
    if (location.pathname === "/") return null

    return (
        <div className="fixed bottom-20 left-4 z-[75] md:hidden">
            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 -z-10"
                            onClick={() => setOpen(false)}
                        />

                        {/* Action items */}
                        {fabActions.map((action, i) => (
                            <motion.div
                                key={action.href}
                                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                                animate={{ opacity: 1, y: -(60 * (i + 1)), scale: 1 }}
                                exit={{ opacity: 0, y: 0, scale: 0.5 }}
                                transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 20 }}
                                className="absolute bottom-0 left-0"
                            >
                                <NavLink
                                    to={action.href}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-2.5"
                                >
                                    <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                                        <action.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="px-3 py-1.5 rounded-lg glass-strong border border-white/10 text-xs font-medium shadow-lg whitespace-nowrap">
                                        {action.label}
                                    </span>
                                </NavLink>
                            </motion.div>
                        ))}
                    </>
                )}
            </AnimatePresence>

            {/* Main FAB */}
            <motion.button
                onClick={() => setOpen(!open)}
                animate={{ rotate: open ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30 active:scale-90 transition-transform"
            >
                <Sparkles className="h-6 w-6 text-white" />
            </motion.button>
        </div>
    )
}

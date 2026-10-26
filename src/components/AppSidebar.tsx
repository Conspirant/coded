import {
  Calculator,
  Search,
  Target,
  Shuffle,
  Bell,
  GitCompare,
  FileText,
  FileCheck,
  Star,
  Home,
  ExternalLink,
  Info,
  Book,
  BookOpen,
  FlaskConical,
  Bot,
  LayoutDashboard,
  Building2,
  Flame,
  Sword,
  Newspaper,
  Lightbulb,
  BookOpenCheck,
  ShieldCheck,
  Heart,
  TrendingUp,
  Award,
  Crown,
  MessageSquare,
  Users,
  MapPin,
  Gem,
  GraduationCap,
  Sparkles,
  Brain,
  Bus,
  HeartPulse,
  ListOrdered,
  HelpCircle,
  IndianRupee,
  Grid3X3,
} from "lucide-react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useExamMode } from "@/contexts/ExamModeContext"
import { Logo } from "./ui/Logo"
import { useEffect, useState } from "react"
import { isUnlocked, subscribeToUnlockState } from "@/lib/unlock"

interface NavItem {
  title: string
  url?: string
  icon: any
  isNew?: boolean
  underDevelopment?: boolean
  external?: boolean
  isPremiumTrigger?: boolean
  onClick?: () => void
}

interface NavSection {
  label: string
  items: NavItem[]
}

const getKcetSections = (unlocked: boolean, onUnlockClick?: () => void): NavSection[] => {
  const sections: NavSection[] = [
    {
      label: "Overview",
      items: [
        { title: "Home", url: "/", icon: Home },
        { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { title: "Discussion Forum", url: "/forum", icon: MessageSquare, isNew: true },
      ]
    },
    {
      label: "Admissions & Cutoffs",
      items: [
        { title: "College Predictor", url: "/college-predictor", icon: Target },
        { title: "Rank Predictor", url: "/rank-predictor", icon: Calculator },
        { title: "Cutoff Explorer", url: "/cutoff-explorer", icon: Search },
        { title: "Cutoff Predictor", url: "/cutoff-predictor", icon: Brain, isNew: true },
        { title: "College Cutoffs", url: "/college-cutoffs", icon: Building2 },
        { title: "Cutoff Trends", url: "/cutoff-trends", icon: TrendingUp, isNew: true },
        { title: "Mock Allotment Simulator", url: "/mock-simulator", icon: Shuffle, underDevelopment: true },
        { title: "College Compare", url: "/college-compare", icon: GitCompare, underDevelopment: true },
      ]
    },
    {
      label: "Counseling & Verification",
      items: [
        { title: "Round Tracker", url: "/round-tracker", icon: Bell },
        { title: "Fee Calculator", url: "/fee-calculator", icon: Calculator, isNew: true },
        { title: "College Directory", url: "/colleges", icon: GraduationCap, isNew: true },
        { title: "Mock Document Verification", url: "/document-verification", icon: BookOpenCheck, isNew: true },
        { title: "Counseling Documents", url: "/documents", icon: FileText },
        { title: "Info Centre", url: "/info-centre", icon: Info },
        { title: "Reviews & Ratings", url: "/reviews", icon: Star },
        { title: "Official CET News", url: "/cet-news", icon: Newspaper },
      ]
    },
    {
      label: "Prep & Practice Arena",
      items: [
        { title: "Daily Challenge", url: "/daily-challenge", icon: Flame },
        { title: "Cutoff Clash", url: "/cutoff-clash", icon: Sword },
        { title: "PYQ Mock Test", url: "/pyq-test", icon: Award, isNew: true },
        { title: "Study Materials", url: "/materials", icon: Book },
        { title: "Guides & Jeevith Notes", url: "/guides", icon: BookOpenCheck, isNew: true },
      ]
    },
    {
      label: "Coded Labs & AI",
      items: [
        { title: "TesselBot", url: "/ai-counselor", icon: Bot, isNew: true },
        { title: "Squad Finder", url: "/squad-finder", icon: Users, isNew: true },
        { title: "Metro Mapper", url: "/metro-mapper", icon: MapPin, isNew: true },
        { title: "Hidden Gems", url: "/hidden-gems", icon: Gem, isNew: true },
        { title: "BMTC Transit Mapper", url: "/bmtc-mapper", icon: Bus, isNew: true },
        { title: "Blog & Updates", url: "/blog", icon: BookOpen },
      ]
    },
    {
      label: "Community & Support",
      items: [
        { title: "Supporters Wall", url: "/supporters", icon: Award },
        { title: "Support Us (Donate)", url: "/donate", icon: Heart },
        { title: "Feature Request", url: "/request-feature", icon: Lightbulb },
        { title: "r/KCETCoded", url: "https://www.reddit.com/r/KCETcoded/", icon: ExternalLink, external: true },
        { title: "Discord Server", url: "https://discord.gg/QZcjtJKjYJ", icon: ExternalLink, external: true },
      ]
    }
  ]

  if (!unlocked) {
    sections[sections.length - 1].items.unshift({
      title: "Unlock Pro Tier",
      onClick: onUnlockClick,
      icon: Crown,
      isPremiumTrigger: true
    })
  }

  return sections
}

const getKseabSections = (): NavSection[] => [
  {
    label: "KSEAB 2nd PUC",
    items: [
      { title: "PUC Overview", url: "/puc", icon: Home },
      { title: "Guides & Reference", url: "/guides", icon: BookOpenCheck, isNew: true },
      { title: "Subjects & Syllabus", url: "/puc/subjects", icon: BookOpen },
      { title: "Practical Scheme", url: "/puc/practicals", icon: FlaskConical },
      { title: "PYQs with Answers", url: "/puc/pyq", icon: FileCheck, isNew: true },
      { title: "Question Papers Library", url: "/puc/question-papers", icon: FileText },
      { title: "Question Banks", url: "/puc/question-banks", icon: BookOpenCheck },
      { title: "Marks Calculator", url: "/puc/marks-calculator", icon: Calculator },
    ],
  },
  {
    label: "Plan & Prepare",
    items: [
      { title: "Study Planner", url: "/puc/study-planner", icon: LayoutDashboard, underDevelopment: true },
      { title: "Mock Tests", url: "/puc/mock-tests", icon: Award, underDevelopment: true },
      { title: "Updates", url: "/puc/updates", icon: Newspaper, underDevelopment: true },
    ],
  },
  {
    label: "Continue to KCET",
    items: [{ title: "KCET Rank Predictor", url: "/rank-predictor", icon: Target }],
  },
]



function SidebarNavItem({
  item,
  state,
  isMobile,
  setOpenMobile
}: {
  item: NavItem
  state: string
  isMobile: boolean
  setOpenMobile: (v: boolean) => void
}) {
  if (item.onClick) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => {
            item.onClick?.()
            if (isMobile) setOpenMobile(false)
          }}
          className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 transition-colors w-full text-left group ${item.isPremiumTrigger
              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 font-semibold border border-emerald-500/20"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
            }`}
        >
          <item.icon
            className={`h-4 w-4 flex-shrink-0 transition-colors ${item.isPremiumTrigger ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
              }`}
          />
          {state !== "collapsed" && (
            <span className="truncate text-xs font-medium">{item.title}</span>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  if (item.external && item.url) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-md px-3 py-1.5 transition-colors text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 group"
          >
            <item.icon className="h-4 w-4 flex-shrink-0 text-slate-400 group-hover:text-slate-200 transition-colors" />
            {state !== "collapsed" && (
              <div className="flex items-center justify-between w-full min-w-0">
                <span className="truncate text-xs font-medium">{item.title}</span>
                <ExternalLink className="h-3 w-3 text-slate-500 shrink-0" />
              </div>
            )}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  if (!item.url) return null

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          onClick={() => {
            if (isMobile) setOpenMobile(false)
          }}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-md px-3 py-1.5 transition-colors group relative ${isActive
              ? "pill-indicator bg-slate-800/90 text-slate-100 font-semibold"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
            }`
          }
        >
          <item.icon className="h-4 w-4 flex-shrink-0 text-slate-400 group-hover:text-slate-200 transition-colors" />
          {state !== "collapsed" && (
            <div className="flex items-center justify-between w-full min-w-0 gap-1.5">
              <span className="truncate text-xs font-medium">{item.title}</span>
              {item.underDevelopment && (
                <Badge variant="secondary" className="text-[9px] px-1 py-0 h-3.5 bg-amber-500/10 text-amber-400 border-amber-500/20 font-mono shrink-0">
                  BETA
                </Badge>
              )}
              {item.isNew && (
                <Badge className="text-[9px] px-1 py-0 h-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-mono shrink-0">
                  NEW
                </Badge>
              )}
            </div>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar({ onUnlockClick }: { onUnlockClick?: () => void }) {
  const { state, setOpenMobile, isMobile } = useSidebar()
  const { examMode, setExamMode } = useExamMode()
  const navigate = useNavigate()
  const location = useLocation()
  const [unlocked, setUnlocked] = useState(isUnlocked())

  useEffect(() => {
    return subscribeToUnlockState(setUnlocked)
  }, [])

  const isPucRoute = location.pathname.startsWith("/puc")

  // Auto-align examMode with route: If user visits /dashboard or non-puc route, default to KCET
  useEffect(() => {
    if (isPucRoute && examMode !== "KSEAB") {
      setExamMode("KSEAB")
    } else if (!isPucRoute && examMode === "KSEAB") {
      setExamMode("KCET")
    }
  }, [location.pathname, isPucRoute, examMode, setExamMode])

  const effectiveMode = isPucRoute ? "KSEAB" : examMode
  const sections = effectiveMode === "KSEAB" ? getKseabSections() : getKcetSections(unlocked, onUnlockClick)

  return (
    <Sidebar
      className={`${state === "collapsed" ? "w-14" : "w-64"} border-r border-border bg-sidebar`}
      collapsible="icon"
    >
      <SidebarContent className="py-3 overflow-y-auto">
        {/* Brand Header */}
        <div className="px-3.5 pb-3 border-b border-border/60 mb-2 flex items-center">
          <Logo
            mode={effectiveMode}
            showText={state !== "collapsed"}
            iconSize={24}
            textSize="text-sm font-bold tracking-tight text-slate-100"
          />
        </div>

        {state !== "collapsed" && (
          <div className="px-3 pb-2 grid grid-cols-2 gap-1.5">
            {(["KCET", "KSEAB"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setExamMode(mode)
                  navigate(mode === "KSEAB" ? "/puc" : "/dashboard")
                }}
                className={`rounded-md px-2 py-1.5 text-[10px] font-bold tracking-wide transition-colors ${effectiveMode === mode ? "bg-primary/15 text-primary border border-primary/30" : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"}`}
              >
                {mode === "KSEAB" ? "2nd PUC" : mode}
              </button>
            ))}
          </div>
        )}

        {/* Organized Navigation Sections */}
        {sections.map((section, idx) => (
          <SidebarGroup key={section.label} className="py-1">
            {state !== "collapsed" && (
              <SidebarGroupLabel className="px-3 py-1 mb-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  {section.label}
                </span>
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {section.items.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    item={item}
                    state={state}
                    isMobile={isMobile}
                    setOpenMobile={setOpenMobile}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            {idx < sections.length - 1 && state !== "collapsed" && (
              <div className="mx-3 mt-2 mb-1 h-px bg-border/40" />
            )}
          </SidebarGroup>
        ))}

        {/* Disclaimer Footer Note */}
        {state !== "collapsed" && (
          <div className="px-3.5 pt-4 pb-2 mt-auto border-t border-border/40">
            <p className="text-[10px] leading-relaxed text-slate-400">
              Independent student platform. Not affiliated with KEA or official examination authorities.
            </p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  )
}

import { Calculator, Search, Target, Shuffle, Bell, GitCompare, FileText, Star, Home, ClipboardList, ExternalLink, Info, Book, Bot, LayoutDashboard, Building2, Flame, Sword } from "lucide-react"
import { NavLink } from "react-router-dom"
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

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Daily Challenge", url: "/daily-challenge", icon: Flame },
  { title: "Cutoff Clash", url: "/cutoff-clash", icon: Sword },
  { title: "Rank Predictor", url: "/rank-predictor", icon: Calculator },
  { title: "Cutoff Explorer", url: "/cutoff-explorer", icon: Search },
  { title: "College Directory", url: "/college-list", icon: Building2 },
  { title: "College Finder", url: "/college-finder", icon: Target },
]

const toolItems = [
  { title: "Round Tracker", url: "/round-tracker", icon: Bell },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Reviews", url: "/reviews", icon: Star },
  { title: "Info Centre", url: "/info-centre", icon: Info },
  { title: "Materials", url: "/materials", icon: Book },
  { title: "Mock Simulator", url: "/mock-simulator", icon: Shuffle, underDevelopment: true },
  { title: "College Compare", url: "/college-compare", icon: GitCompare, underDevelopment: true },
  { title: "Planner", url: "/planner", icon: ClipboardList, underDevelopment: true },
]

const specialItems = [
  { title: "AI Counselor", url: "/ai-counselor", icon: Bot, isAI: true },
  { title: "r/KCETCoded", url: "https://www.reddit.com/r/KCETcoded/", icon: ExternalLink, external: true },
  { title: "r/KCETards", url: "https://www.reddit.com/r/KCETards/", icon: ExternalLink, external: true },
]

function SidebarNavItem({ item, state, isMobile, setOpenMobile }: {
  item: any
  state: string
  isMobile: boolean
  setOpenMobile: (v: boolean) => void
}) {
  if (item.external) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 text-sidebar-foreground hover:bg-white/5 hover:text-foreground group"
          >
            <item.icon className="h-4 w-4 flex-shrink-0 text-muted-foreground group-hover:text-indigo-400 transition-colors" />
            {state !== "collapsed" && (
              <span className="truncate text-sm">{item.title}</span>
            )}
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={item.url}
          onClick={() => { if (isMobile) setOpenMobile(false) }}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative ${isActive
              ? "pill-indicator bg-indigo-500/10 text-indigo-400 font-medium"
              : "text-sidebar-foreground hover:bg-white/5 hover:text-foreground"
            }`
          }
        >
          <item.icon className="h-4 w-4 flex-shrink-0 transition-colors" />
          {state !== "collapsed" && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="truncate text-sm">{item.title}</span>
              {item.isAI && (
                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-sm shadow-purple-500/20">
                  AI
                </Badge>
              )}
              {item.underDevelopment && (
                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 bg-amber-500/10 text-amber-400 border-amber-500/20">
                  Beta
                </Badge>
              )}
            </div>
          )}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar()

  return (
    <Sidebar className={`${state === "collapsed" ? "w-14" : "w-64"} border-r border-white/5`} collapsible="icon">
      <SidebarContent className="py-2">
        {/* Brand */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-1">
            {state !== "collapsed" && (
              <span className="text-xs font-bold gradient-text tracking-[0.12em] uppercase">KCET Coded</span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainItems.map((item) => (
                <SidebarNavItem key={item.title} item={item} state={state} isMobile={isMobile} setOpenMobile={setOpenMobile} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Separator */}
        {state !== "collapsed" && (
          <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        )}

        {/* Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-1">
            {state !== "collapsed" && (
              <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-[0.15em]">Resources</span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {toolItems.map((item) => (
                <SidebarNavItem key={item.title} item={item} state={state} isMobile={isMobile} setOpenMobile={setOpenMobile} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Separator */}
        {state !== "collapsed" && (
          <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        )}

        {/* Special */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {specialItems.map((item) => (
                <SidebarNavItem key={item.title} item={item} state={state} isMobile={isMobile} setOpenMobile={setOpenMobile} />
              ))}
            </SidebarMenu>
            {state !== "collapsed" && (
              <p className="px-3 pt-2 text-[10px] leading-relaxed text-muted-foreground/70">
                Community links are independent. KCET Coded is not affiliated with Reddit, r/kcet, or r/KCETards.
              </p>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

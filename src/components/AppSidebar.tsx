<<<<<<< HEAD
import { Calculator, Search, Target, Shuffle, Bell, GitCompare, FileText, Star, Home, ClipboardList, ExternalLink, Info, Book, Gamepad2 } from "lucide-react"
=======
import { Calculator, Search, Target, Shuffle, Bell, GitCompare, FileText, Star, Home, ClipboardList, ExternalLink, Info } from "lucide-react"
>>>>>>> 82408278e254f3eb73dbf3a79636d6dcc595fabc
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

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Rank Predictor", url: "/rank-predictor", icon: Calculator },
  { title: "Cutoff Explorer", url: "/cutoff-explorer", icon: Search },
  { title: "College Finder", url: "/college-finder", icon: Target },
  { title: "Round Tracker", url: "/round-tracker", icon: Bell },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Reviews", url: "/reviews", icon: Star },
  { title: "Info Centre", url: "/info-centre", icon: Info },
<<<<<<< HEAD
  { title: "Materials", url: "/materials", icon: Book },
=======
>>>>>>> 82408278e254f3eb73dbf3a79636d6dcc595fabc
  { title: "Mock Simulator", url: "/mock-simulator", icon: Shuffle, underDevelopment: true },
  { title: "College Compare", url: "/college-compare", icon: GitCompare, underDevelopment: true },
  { title: "Planner", url: "/planner", icon: ClipboardList, underDevelopment: true },
  { title: "Reddit Community", url: "https://www.reddit.com/r/KCETcoded/", icon: ExternalLink, external: true },
]

export function AppSidebar() {
  const { state, setOpenMobile, isMobile } = useSidebar()

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary font-semibold">
            {state !== "collapsed" && "KCET Coded"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.external ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {state !== "collapsed" && (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="truncate">{item.title}</span>
                            {item.underDevelopment && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700 text-xs px-1.5 py-0.5">
                                Beta
                              </Badge>
                            )}
                          </div>
                        )}
                      </a>
                    ) : (
                      <NavLink
                        to={item.url}
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false)
                          }
                        }}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors text-sidebar-foreground ${isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-accent hover:text-accent-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {state !== "collapsed" && (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="truncate">{item.title}</span>
                            {item.underDevelopment && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700 text-xs px-1.5 py-0.5">
                                Beta
                              </Badge>
                            )}
                          </div>
                        )}
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
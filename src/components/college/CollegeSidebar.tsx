import { Home, TrendingUp, Users, BookOpen } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavLink, useParams } from "react-router-dom"

export function CollegeSidebar() {
    const { collegeCode } = useParams<{ collegeCode: string }>()

    // Base URL for the current college
    const baseUrl = `/college/${collegeCode}`

    const items = [
        { title: "Overview", url: baseUrl, icon: Home, end: true },
        { title: "Analytics & Trends", url: `${baseUrl}/analytics`, icon: TrendingUp },
        { title: "Community & Mentors", url: `${baseUrl}/community`, icon: Users },
    ]

    return (
        <Sidebar collapsible="none" className="h-full w-64 border-r bg-background hidden md:block">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>College Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={false} tooltip={item.title}>
                                        <NavLink
                                            to={item.url}
                                            end={item.end}
                                            className={({ isActive }) =>
                                                `flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors ${isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                                }`
                                            }
                                        >
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </NavLink>
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

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Settings } from "lucide-react"
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { loadSettings, saveSettings, applyRuntimeSettings, defaultSettings, type AppSettings } from '@/lib/settings'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const s = loadSettings()
    setSettings(s)
    // Apply on load
    applyRuntimeSettings(s)
  }, [])

  const update = (partial: Partial<AppSettings>) => {
    const next = { ...settings, ...partial }
    setSettings(next)
    saveSettings(next)
    applyRuntimeSettings(next)
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header - Mobile Optimized */}
          <header className="h-14 sm:h-16 border-b bg-background/70 backdrop-blur-xl flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <SidebarTrigger />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">KCET Coded</h1>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-[10px] sm:text-xs px-1 sm:px-2">
                    BETA
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-foreground/70 hidden sm:block">KCET Helping Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" aria-label="Settings" onClick={() => setOpen(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-lg z-[100] max-h-[90vh] overflow-y-auto mx-2"
                  aria-describedby="settings-dialog-description"
                >
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <p id="settings-dialog-description" className="sr-only">
                      Configure application settings including dashboard mode, theme preferences, and data loading options.
                    </p>
                  </DialogHeader>
                  <div className="space-y-4 sm:space-y-5">
                    {/* Theme */}
                    <div className="space-y-2">
                      <Label>Theme</Label>
                      <Select value={settings.theme} onValueChange={(v: any) => update({ theme: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Toggles - Stack on mobile */}
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="compact" className="text-sm">Compact mode</Label>
                        <Switch id="compact" checked={settings.compactMode} onCheckedChange={(v) => update({ compactMode: !!v })} />
                      </div>
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="motion" className="text-sm">Reduce animations</Label>
                        <Switch id="motion" checked={settings.reduceMotion} onCheckedChange={(v) => update({ reduceMotion: !!v })} />
                      </div>
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="fast" className="text-sm">Fast dashboard</Label>
                        <Switch id="fast" checked={settings.dashboardFastMode} onCheckedChange={(v) => update({ dashboardFastMode: !!v })} />
                      </div>
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="codes" className="text-sm">Show course codes</Label>
                        <Switch id="codes" checked={settings.showCourseCodes} onCheckedChange={(v) => update({ showCourseCodes: !!v })} />
                      </div>
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="instcodes" className="text-sm">Show institute codes</Label>
                        <Switch id="instcodes" checked={settings.showInstituteCodes} onCheckedChange={(v) => update({ showInstituteCodes: !!v })} />
                      </div>
                    </div>

                    {/* Defaults - Stack on very small screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Default Year</Label>
                        <Select value={settings.defaultYear || undefined} onValueChange={(v: any) => update({ defaultYear: v })}>
                          <SelectTrigger><SelectValue placeholder="Auto" /></SelectTrigger>
                          <SelectContent className="z-[200]">
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Default Round</Label>
                        <Select value={settings.defaultRound || undefined} onValueChange={(v: any) => update({ defaultRound: v })}>
                          <SelectTrigger><SelectValue placeholder="Auto" /></SelectTrigger>
                          <SelectContent className="z-[200]">
                            <SelectItem value="R1">R1</SelectItem>
                            <SelectItem value="R2">R2</SelectItem>
                            <SelectItem value="R3">R3</SelectItem>
                            <SelectItem value="EXT">EXT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">Default Category</Label>
                        <Select value={settings.defaultCategory || undefined} onValueChange={(v: any) => update({ defaultCategory: v })}>
                          <SelectTrigger><SelectValue placeholder="Auto" /></SelectTrigger>
                          <SelectContent className="z-[200]">
                            <SelectItem value="GM">GM</SelectItem>
                            <SelectItem value="GMK">GMK</SelectItem>
                            <SelectItem value="GMR">GMR</SelectItem>
                            <SelectItem value="1G">1G</SelectItem>
                            <SelectItem value="2AG">2AG</SelectItem>
                            <SelectItem value="3BG">3BG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content - Mobile Optimized Padding */}
          <main className="flex-1 p-3 sm:p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
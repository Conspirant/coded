import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Sparkles } from "lucide-react"
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { loadSettings, saveSettings, applyRuntimeSettings, defaultSettings, type AppSettings } from '@/lib/settings'
import { SidebarHint } from './SidebarHint'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const s = loadSettings()
    setSettings(s)
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
          {/* Header — Frosted Glass */}
          <header className="h-14 sm:h-16 border-b border-white/5 bg-background/60 backdrop-blur-2xl flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 relative">
              <SidebarTrigger />
              <SidebarHint />
              <div className="flex flex-col min-w-0 ml-1">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-base sm:text-lg font-bold gradient-text truncate">KCET Coded</h1>
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[9px] sm:text-[10px] px-1.5 font-semibold tracking-wider">
                    BETA
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">KCET Helping Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white/5 group" aria-label="Settings" onClick={() => setOpen(true)}>
                    <Settings className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:rotate-90 transition-all duration-300" />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-lg z-[100] max-h-[90vh] overflow-y-auto mx-2 glass-strong border-white/10"
                  aria-describedby="settings-dialog-description"
                >
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      Settings
                    </DialogTitle>
                    <p id="settings-dialog-description" className="sr-only">
                      Configure application settings including dashboard mode, theme preferences, and data loading options.
                    </p>
                  </DialogHeader>
                  <div className="space-y-4 sm:space-y-5">
                    {/* Theme */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Theme</Label>
                      <Select value={settings.theme} onValueChange={(v: any) => update({ theme: v })}>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: "compact", label: "Compact mode", key: "compactMode" as const },
                        { id: "motion", label: "Reduce animations", key: "reduceMotion" as const },
                        { id: "fast", label: "Fast dashboard", key: "dashboardFastMode" as const },
                        { id: "codes", label: "Show course codes", key: "showCourseCodes" as const },
                        { id: "instcodes", label: "Show institute codes", key: "showInstituteCodes" as const },
                      ].map(toggle => (
                        <div key={toggle.id} className="flex items-center justify-between rounded-xl p-3 bg-white/[0.03] border border-white/5">
                          <Label htmlFor={toggle.id} className="text-sm">{toggle.label}</Label>
                          <Switch id={toggle.id} checked={settings[toggle.key] as boolean} onCheckedChange={(v) => update({ [toggle.key]: !!v })} />
                        </div>
                      ))}
                    </div>

                    {/* Defaults */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Default Year</Label>
                        <Select value={settings.defaultYear || undefined} onValueChange={(v: any) => update({ defaultYear: v })}>
                          <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Auto" /></SelectTrigger>
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
                          <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Auto" /></SelectTrigger>
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
                          <SelectTrigger className="bg-white/5 border-white/10"><SelectValue placeholder="Auto" /></SelectTrigger>
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
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white/5">
                <User className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </header>

          {/* Main Content — pb-20 for mobile dock clearance */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 pb-24 md:pb-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
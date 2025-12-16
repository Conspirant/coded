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
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-background/70 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-foreground">KCET Coded</h1>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                    BETA
                  </Badge>
                </div>
                <p className="text-sm text-foreground/70">KCET Helping Hub</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Settings" onClick={() => setOpen(true)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-lg z-[100]"
                  aria-describedby="settings-dialog-description"
                >
                  <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <p id="settings-dialog-description" className="sr-only">
                      Configure application settings including dashboard mode, theme preferences, and data loading options.
                    </p>
                  </DialogHeader>
                  <div className="space-y-5">
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

                    {/* Toggles */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="compact">Compact mode</Label>
                        <Switch id="compact" checked={settings.compactMode} onCheckedChange={(v) => update({ compactMode: !!v })} />
                      </div>
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="motion">Reduce animations</Label>
                        <Switch id="motion" checked={settings.reduceMotion} onCheckedChange={(v) => update({ reduceMotion: !!v })} />
                      </div>
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="fast">Fast dashboard (summary)</Label>
                        <Switch id="fast" checked={settings.dashboardFastMode} onCheckedChange={(v) => update({ dashboardFastMode: !!v })} />
                      </div>
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="codes">Show course codes</Label>
                        <Switch id="codes" checked={settings.showCourseCodes} onCheckedChange={(v) => update({ showCourseCodes: !!v })} />
                      </div>
                      <div className="flex items-center justify-between border rounded p-3">
                        <Label htmlFor="instcodes">Show institute codes</Label>
                        <Switch id="instcodes" checked={settings.showInstituteCodes} onCheckedChange={(v) => update({ showInstituteCodes: !!v })} />
                      </div>
                    </div>

                    {/* Defaults */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Default Year</Label>
                        <Select value={settings.defaultYear || undefined} onValueChange={(v: any) => update({ defaultYear: v })}>
                          <SelectTrigger><SelectValue placeholder="Auto (latest)" /></SelectTrigger>
                          <SelectContent className="z-[200]">
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Default Round</Label>
                        <Select value={settings.defaultRound || undefined} onValueChange={(v: any) => update({ defaultRound: v })}>
                          <SelectTrigger><SelectValue placeholder="Auto (first)" /></SelectTrigger>
                          <SelectContent className="z-[200]">
                            <SelectItem value="R1">R1</SelectItem>
                            <SelectItem value="R2">R2</SelectItem>
                            <SelectItem value="R3">R3</SelectItem>
                            <SelectItem value="EXT">EXT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Default Category</Label>
                        <Select value={settings.defaultCategory || undefined} onValueChange={(v: any) => update({ defaultCategory: v })}>
                          <SelectTrigger><SelectValue placeholder="Auto (first)" /></SelectTrigger>
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
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
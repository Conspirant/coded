import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Sparkles, Key, Lock, Unlock, CheckCircle, Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { loadSettings, saveSettings, applyRuntimeSettings, defaultSettings, type AppSettings } from '@/lib/settings'
import { SidebarHint } from './SidebarHint'
import { useExamMode } from "@/contexts/ExamModeContext"
import { Input } from "@/components/ui/input"
import { isUnlocked, validateAndUnlock, lockFeatures, subscribeToUnlockState } from "@/lib/unlock"
import { toast } from "sonner"

import { Logo } from "./ui/Logo"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [open, setOpen] = useState(false)
  const { examMode, setExamMode } = useExamMode()
  const [unlocked, setUnlocked] = useState(isUnlocked)
  const [settingsKey, setSettingsKey] = useState("")
  const [showSettingsKey, setShowSettingsKey] = useState(false)

  useEffect(() => {
    return subscribeToUnlockState(setUnlocked)
  }, [])

  const handleSettingsUnlock = (e: React.FormEvent) => {
    e.preventDefault()
    if (!settingsKey.trim()) {
      toast.error("Please enter an access key.")
      return
    }
    const success = validateAndUnlock(settingsKey)
    if (success) {
      toast.success("Successfully unlocked all premium features!", {
        description: "You now have full access to early tools."
      })
      setSettingsKey("")
    } else {
      toast.error("Invalid access key. Please try again.")
    }
  }

  const handleLockFeatures = () => {
    lockFeatures()
    toast.info("All premium features are now locked.", {
      description: "Access restriction has been re-enabled."
    })
  }

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
                  <Logo mode={examMode} iconSize={22} textSize="text-sm sm:text-base" />
                  <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[9px] sm:text-[10px] px-1.5 font-semibold tracking-wider">
                    BETA
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  {examMode === "COMEDK" ? "COMEDK Counseling Reference" : "KCET Counseling Reference"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden md:inline-flex relative h-8 w-[9.5rem] items-center rounded-full border border-white/10 bg-white/5 p-0.5">
                <span
                  className={`absolute left-0.5 h-7 w-[4.5rem] rounded-full transition-all duration-300 ease-in-out ${
                    examMode === "COMEDK"
                      ? "translate-x-[4.5rem] bg-amber-500 shadow-lg shadow-amber-500/25"
                      : "translate-x-0 bg-indigo-500 shadow-lg shadow-indigo-500/25"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setExamMode("KCET")}
                  className={`relative z-10 flex h-7 w-[4.5rem] items-center justify-center rounded-full text-xs font-semibold transition-colors duration-200 ${
                    examMode === "KCET" ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  KCET
                </button>
                <button
                  type="button"
                  onClick={() => setExamMode("COMEDK")}
                  className={`relative z-10 flex h-7 w-[4.5rem] items-center justify-center rounded-full text-xs font-semibold transition-colors duration-200 ${
                    examMode === "COMEDK" ? "text-black" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  COMEDK
                </button>
              </div>
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
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Exam Mode</Label>
                      <div className="relative inline-flex h-9 w-[10.5rem] items-center rounded-full border border-white/10 bg-white/5 p-0.5">
                        <span
                          className={`absolute left-0.5 h-8 w-[5rem] rounded-full transition-all duration-300 ease-in-out ${
                            examMode === "COMEDK"
                              ? "translate-x-[5rem] bg-amber-500 shadow-lg shadow-amber-500/25"
                              : "translate-x-0 bg-indigo-500 shadow-lg shadow-indigo-500/25"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setExamMode("KCET")}
                          className={`relative z-10 flex h-8 w-[5rem] items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
                            examMode === "KCET" ? "text-white" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          KCET
                        </button>
                        <button
                          type="button"
                          onClick={() => setExamMode("COMEDK")}
                          className={`relative z-10 flex h-8 w-[5rem] items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200 ${
                            examMode === "COMEDK" ? "text-black" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          COMEDK
                        </button>
                      </div>
                    </div>

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

                    {/* Access Key Section */}
                    <div className="border-t border-white/5 pt-4 mt-2">
                      <Label className="text-sm font-semibold text-slate-200 block mb-2">Access Key Configuration</Label>
                      {unlocked ? (
                        <div className="flex items-center justify-between rounded-xl p-3 bg-emerald-500/5 border border-emerald-500/10">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full bg-emerald-500/10">
                              <CheckCircle className="h-4 w-4 text-emerald-400 animate-pulse" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-emerald-400 block">Premium Access Active</span>
                              <span className="text-[10px] text-muted-foreground">All features unlocked.</span>
                            </div>
                          </div>
                          <Button 
                            onClick={handleLockFeatures} 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg shrink-0"
                          >
                            <Lock className="h-3 w-3 mr-1" />
                            Lock Features
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <form onSubmit={handleSettingsUnlock} className="flex gap-2">
                            <div className="relative flex-1">
                              <Input
                                type={showSettingsKey ? "text" : "password"}
                                placeholder="Enter Access Key..."
                                value={settingsKey}
                                onChange={(e) => setSettingsKey(e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-amber-500/50 rounded-lg h-9 text-xs font-mono pr-8 shadow-none"
                              />
                              <button
                                type="button"
                                onClick={() => setShowSettingsKey(!showSettingsKey)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                              >
                                {showSettingsKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </button>
                            </div>
                            <Button
                              type="submit"
                              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs h-9 px-3 rounded-lg shadow-sm flex items-center gap-1 shrink-0"
                            >
                              <Unlock className="h-3.5 w-3.5" />
                              Unlock
                            </Button>
                          </form>
                          <p className="text-[10px] text-muted-foreground">
                            Access the College Predictor, Admissions Assistant, and other tools early.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-white/5">
                <User className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 pb-6 flex flex-col min-h-[calc(100vh-4rem)]">
            <div className="flex-1">
              {children}
            </div>
            
            {/* Minimalist Creator Credit */}
            <div className="mt-8 pt-4 border-t border-white/5 text-center w-full">
              <p className="text-[11px] text-muted-foreground/60 tracking-wide">
                Created by & if any queries contact{' '}
                <a 
                  href="https://www.reddit.com/user/Elegant_Compote9073/" 
                  target="_blank" 
                  rel="noreferrer"
                  className="font-medium text-muted-foreground hover:text-foreground transition-colors hover:underline"
                >
                  u/Elegant_Compote9073
                </a>
              </p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

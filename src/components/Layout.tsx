import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Sparkles, Key, Lock, Unlock, CheckCircle, Eye, EyeOff, Crown, Loader2, Copy } from "lucide-react"
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { loadSettings, saveSettings, applyRuntimeSettings, defaultSettings, type AppSettings } from '@/lib/settings'
import { SidebarHint } from './SidebarHint'
import { useExamMode } from "@/contexts/ExamModeContext"
import { Input } from "@/components/ui/input"
import { isUnlocked, validateAndUnlock, verifyAndUnlockAccessKey, lockFeatures, subscribeToUnlockState, setGlobalPaywallDisabled, getSavedAccessCode } from "@/lib/unlock"
import { copyToClipboard } from "@/lib/utils"
import { AdminSuggestionsService } from "@/lib/admin-suggestions-service"
import { toast } from "sonner"
import { PremiumUpgradeModal } from "./PremiumUpgradeModal"
import { GlobalDonationPopup } from "./GlobalDonationPopup"
import { LiveVisitorCounter } from "./LiveVisitorCounter"
import { UserProfileModal, type StoredUserProfile } from "./UserProfileModal"

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
  const [settingsKeyLoading, setSettingsKeyLoading] = useState(false)
  const [showSettingsKey, setShowSettingsKey] = useState(false)
  const [premiumUpgradeOpen, setPremiumUpgradeOpen] = useState(false)
  const [userProfileOpen, setUserProfileOpen] = useState(false)
  const [userProfileData, setUserProfileData] = useState<StoredUserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("kcet_user_profile")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const saved = localStorage.getItem("kcet_user_profile")
        if (saved) setUserProfileData(JSON.parse(saved))
      } catch {}
    }
    window.addEventListener("kcet_user_profile_updated", handleProfileUpdate)
    window.addEventListener("storage", handleProfileUpdate)
    return () => {
      window.removeEventListener("kcet_user_profile_updated", handleProfileUpdate)
      window.removeEventListener("storage", handleProfileUpdate)
    }
  }, [])

  useEffect(() => {
    return subscribeToUnlockState(setUnlocked)
  }, [])

  const handleSettingsUnlock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settingsKey.trim()) {
      toast.error("Please enter an access key.")
      return
    }
    setSettingsKeyLoading(true)
    const res = await verifyAndUnlockAccessKey(settingsKey)
    setSettingsKeyLoading(false)

    if (res.success) {
      toast.success("Successfully unlocked all premium features!", {
        description: "You now have full access to early tools."
      })
      setSettingsKey("")
    } else {
      toast.error(res.error || "Invalid access key. Please try again.")
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

    const checkPaywall = async () => {
      try {
        const disabled = await AdminSuggestionsService.isPaywallDisabledGlobally()
        setGlobalPaywallDisabled(disabled)
      } catch (err) {
        console.error("Failed to check global paywall state on boot:", err)
      }
    }
    checkPaywall()
  }, [])

  const update = (partial: Partial<AppSettings>) => {
    const next = { ...settings, ...partial }
    setSettings(next)
    saveSettings(next)
    applyRuntimeSettings(next)
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar onUnlockClick={() => setPremiumUpgradeOpen(true)} />
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="h-14 border-b border-border bg-background/90 backdrop-blur-md flex items-center justify-between px-3 sm:px-6 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 relative">
            <SidebarTrigger />
            <SidebarHint />
            <div className="flex flex-col min-w-0 ml-1">
              <div className="flex items-center gap-2">
                <Logo mode={examMode} iconSize={20} textSize="text-sm sm:text-base font-bold text-foreground" />
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[9px] sm:text-[10px] px-1.5 font-semibold tracking-wider font-mono">
                  BETA
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {examMode === "COMEDK" ? "COMEDK Counseling Reference" : "KCET Counseling Reference"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LiveVisitorCounter variant="compact" />
            <div className="hidden md:inline-flex relative h-8 w-[9.5rem] items-center rounded-md border border-border bg-muted p-0.5">
              <span
                className={`absolute left-0.5 h-7 w-[4.5rem] rounded transition-all duration-200 ease-in-out ${examMode === "COMEDK"
                    ? "translate-x-[4.5rem] bg-amber-500 text-black shadow-xs"
                    : "translate-x-0 bg-primary text-primary-foreground shadow-xs"
                  }`}
              />
              <button
                type="button"
                onClick={() => setExamMode("KCET")}
                className={`relative z-10 flex h-7 w-[4.5rem] items-center justify-center rounded text-xs font-semibold transition-colors duration-150 ${examMode === "KCET" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                KCET
              </button>
              <button
                type="button"
                onClick={() => setExamMode("COMEDK")}
                className={`relative z-10 flex h-7 w-[4.5rem] items-center justify-center rounded text-xs font-semibold transition-colors duration-150 ${examMode === "COMEDK" ? "text-black font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                COMEDK
              </button>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" aria-label="Settings" onClick={() => setOpen(true)}>
                  <Settings className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-lg z-[100] max-h-[90vh] overflow-y-auto mx-2 bg-card border-border shadow-lg"
                aria-describedby="settings-dialog-description"
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                    <Settings className="h-4 w-4 text-primary" />
                    Platform Settings
                  </DialogTitle>
                  <p id="settings-dialog-description" className="sr-only">
                    Configure application settings including dashboard mode, theme preferences, and data loading options.
                  </p>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exam Track</Label>
                    <div className="relative inline-flex h-9 w-[10.5rem] items-center rounded-md border border-border bg-muted p-0.5">
                      <span
                        className={`absolute left-0.5 h-8 w-[5rem] rounded transition-all duration-200 ease-in-out ${examMode === "COMEDK"
                            ? "translate-x-[5rem] bg-amber-500"
                            : "translate-x-0 bg-primary"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setExamMode("KCET")}
                        className={`relative z-10 flex h-8 w-[5rem] items-center justify-center rounded text-xs font-semibold transition-colors duration-150 ${examMode === "KCET" ? "text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        KCET
                      </button>
                      <button
                        type="button"
                        onClick={() => setExamMode("COMEDK")}
                        className={`relative z-10 flex h-8 w-[5rem] items-center justify-center rounded text-xs font-semibold transition-colors duration-150 ${examMode === "COMEDK" ? "text-black font-bold" : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        COMEDK
                      </button>
                    </div>
                  </div>

                  {/* Theme */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Theme Preference</Label>
                    <Select value={settings.theme} onValueChange={(v: "light" | "dark" | "system") => update({ theme: v })}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[200]">
                        <SelectItem value="system">System Default</SelectItem>
                        <SelectItem value="light">Light Mode</SelectItem>
                        <SelectItem value="dark">Dark Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: "compact", label: "Compact mode", key: "compactMode" as const },
                      { id: "motion", label: "Reduce animations", key: "reduceMotion" as const },
                      { id: "fast", label: "Fast dashboard", key: "dashboardFastMode" as const },
                      { id: "codes", label: "Show course codes", key: "showCourseCodes" as const },
                      { id: "instcodes", label: "Show institute codes", key: "showInstituteCodes" as const },
                    ].map(toggle => (
                      <div key={toggle.id} className="flex items-center justify-between rounded-md p-2.5 bg-muted/40 border border-border">
                        <Label htmlFor={toggle.id} className="text-xs font-medium cursor-pointer text-foreground">{toggle.label}</Label>
                        <Switch id={toggle.id} checked={settings[toggle.key] as boolean} onCheckedChange={(v) => update({ [toggle.key]: !!v })} />
                      </div>
                    ))}
                  </div>

                  {/* Defaults */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Default Year</Label>
                      <Select value={settings.defaultYear || undefined} onValueChange={(v: string) => update({ defaultYear: v })}>
                        <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Auto" /></SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Default Round</Label>
                      <Select value={settings.defaultRound || undefined} onValueChange={(v: string) => update({ defaultRound: v })}>
                        <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Auto" /></SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="R1">R1</SelectItem>
                          <SelectItem value="R2">R2</SelectItem>
                          <SelectItem value="R3">R3</SelectItem>
                          <SelectItem value="EXT">EXT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Default Category</Label>
                      <Select value={settings.defaultCategory || undefined} onValueChange={(v: string) => update({ defaultCategory: v })}>
                        <SelectTrigger className="bg-background border-border"><SelectValue placeholder="Auto" /></SelectTrigger>
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
                  <div className="border-t border-border pt-4 mt-2 space-y-3">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Access Key Configuration</Label>

                    {/* Display Saved Access Code if Available */}
                    {getSavedAccessCode() && (
                      <div className="rounded-md p-3 bg-primary/5 border border-primary/20 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Your Device Access Code</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              const code = getSavedAccessCode();
                              if (code) {
                                const ok = await copyToClipboard(code);
                                if (ok) {
                                  toast.success("Access code copied to clipboard!");
                                } else {
                                  toast.error("Could not copy code. Please copy manually.");
                                }
                              }
                            }}
                            className="h-6 text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-2 rounded flex items-center gap-1 font-mono"
                          >
                            <Copy className="h-3 w-3" />
                            Copy Code
                          </Button>
                        </div>
                        <div className="font-mono text-xs font-semibold tracking-wider text-foreground">
                          {getSavedAccessCode()}
                        </div>
                      </div>
                    )}

                    {unlocked ? (
                      <div className="flex items-center justify-between p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-xs font-semibold">Pro Tier Unlocked</span>
                        </div>
                        <Button
                          onClick={handleLockFeatures}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded shrink-0"
                        >
                          <Lock className="h-3 w-3 mr-1" />
                          Lock
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
                              className="bg-background border-border focus:border-primary rounded-md h-8 text-xs font-mono pr-8"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSettingsKey(!showSettingsKey)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showSettingsKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                          <Button
                            type="submit"
                            disabled={settingsKeyLoading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-8 px-3 rounded-md shadow-xs flex items-center gap-1 shrink-0"
                          >
                            {settingsKeyLoading ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Unlock className="h-3.5 w-3.5" />
                            )}
                            {settingsKeyLoading ? "Verifying..." : "Unlock"}
                          </Button>
                        </form>
                        <div className="flex gap-2 w-full mt-2 pt-2 border-t border-border">
                          <Button
                            type="button"
                            onClick={() => {
                              setOpen(false);
                              setPremiumUpgradeOpen(true);
                            }}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-8 rounded-md flex items-center justify-center gap-1.5"
                          >
                            <Crown className="h-3.5 w-3.5" />
                            Unlock Pro (₹119)
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setUserProfileOpen(true)}
              className="h-8 px-2 sm:px-2.5 hover:bg-muted/80 flex items-center gap-1.5 rounded-lg border border-transparent hover:border-border/60 transition-all cursor-pointer group"
              title="Student Profile & Quick Center"
            >
              <div className="relative flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-indigo-500/20 border border-primary/30 flex items-center justify-center text-[11px] font-bold text-primary group-hover:scale-105 transition-transform">
                  {(userProfileData?.name || "C").charAt(0).toUpperCase()}
                </div>
                {unlocked ? (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 ring-1 ring-background">
                    <Crown className="h-2 w-2 text-black fill-black" />
                  </span>
                ) : (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2 items-center justify-center rounded-full bg-emerald-500 ring-1 ring-background" />
                )}
              </div>
              {userProfileData?.rank && (
                <span className="hidden sm:inline font-mono font-bold text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                  #{userProfileData.rank >= 1000 ? `${(userProfileData.rank / 1000).toFixed(userProfileData.rank % 1000 === 0 ? 0 : 1)}k` : userProfileData.rank}
                </span>
              )}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 pb-12 w-full">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>

          {/* Minimalist Footer Credit */}
          <div className="mt-16 pt-6 border-t border-border/60 text-center w-full">
            <p className="text-[11px] text-muted-foreground">
              Karnataka CET Admissions Analytics & Counseling Platform • Built independently for KCET aspirants
            </p>
          </div>
        </main>
      </div>
      <PremiumUpgradeModal open={premiumUpgradeOpen} onOpenChange={setPremiumUpgradeOpen} />
      <UserProfileModal open={userProfileOpen} onOpenChange={setUserProfileOpen} onUpgradeClick={() => setPremiumUpgradeOpen(true)} />
      <GlobalDonationPopup />
    </SidebarProvider>
  )
}

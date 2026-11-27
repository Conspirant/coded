import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Sparkles, Key, Lock, Unlock, CheckCircle, Eye, EyeOff, Crown, Loader2, Copy, MessageSquare, ExternalLink, Sun, Moon } from "lucide-react"
import { motion, useScroll, useSpring } from "framer-motion"
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
import { ShortlistPinboard } from "./ShortlistPinboard"

import { Logo } from "./ui/Logo"
import { useLocation } from "react-router-dom"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isAiCounselor = location.pathname === "/ai-counselor"
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 260, damping: 32, restDelta: 0.001 })
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
      } catch { }
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
        {/* Header (Hidden on Tessel AI /ai-counselor) */}
        {!isAiCounselor && (
          <header className="h-14 border-b border-border/80 bg-background/80 backdrop-blur-xl flex items-center justify-between gap-2 px-2.5 sm:px-6 sticky top-0 z-40 shrink-0 transition-colors">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 flex-1 overflow-hidden relative">
              <SidebarTrigger className="shrink-0" />
              <SidebarHint />
              <div className="flex items-center gap-1.5 min-w-0 overflow-hidden md:hidden">
                <Logo mode={location.pathname.startsWith("/puc") ? "KSEAB" : "KCET"} iconSize={20} textSize="text-xs sm:text-sm font-bold text-foreground truncate" />
              </div>
              <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground min-w-0">
                <span className="font-mono text-[11px] uppercase tracking-wider">
                  {location.pathname.startsWith("/puc") ? "KSEAB" : "KCET"}
                </span>
                <span className="text-border">/</span>
                <span className="text-foreground font-medium capitalize truncate">
                  {location.pathname === "/"
                    ? "Overview"
                    : location.pathname.replace(/^\//, "").split("/")[0].replace(/-/g, " ")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <ShortlistPinboard />
              <div className="hidden min-[430px]:flex items-center">
                <LiveVisitorCounter variant="compact" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-muted"
                aria-label="Toggle theme"
                title="Switch theme"
                onClick={() => {
                  const isDark = document.documentElement.classList.contains("dark")
                  update({ theme: isDark ? "light" : "dark" })
                }}
              >
                <Sun className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors hidden dark:block" />
                <Moon className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors block dark:hidden" />
              </Button>
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
                        <div className="flex items-center justify-between p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs font-semibold">Pro Tier Unlocked</span>
                          </div>
                          <Button
                            onClick={handleLockFeatures}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-rose-500/25 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-700 dark:hover:text-rose-300 rounded shrink-0"
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
                              Unlock Pro (₹19)
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Developer Support & Bug Report Link */}
                      <div className="pt-2 border-t border-border">
                        <a
                          href="https://www.reddit.com/user/Elegant_Compote9073/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full p-2.5 rounded-md border border-orange-500/25 bg-orange-500/10 dark:bg-orange-950/20 hover:bg-orange-500/15 dark:hover:bg-orange-950/40 transition-colors flex items-center justify-between text-xs group cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                            <div className="text-left">
                              <span className="font-semibold text-foreground text-[11px] block">
                                Report Bugs & Contact Developer
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                Reddit: u/Elegant_Compote9073
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setUserProfileOpen(true)}
                className="h-8 w-8 hover:bg-muted relative"
                aria-label="Student Profile"
                title="Student Profile & Preferences"
              >
                <User className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                {unlocked ? (
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                ) : (
                  <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </Button>
            </div>
          </header>
        )}

        {/* Main Content */}
        {isAiCounselor ? (
          <main className="flex-1 w-full min-w-0 h-screen overflow-hidden p-0 m-0 bg-background">
            {children}
          </main>
        ) : (
          <main className="relative flex-1 p-3 sm:p-4 md:p-6 pb-24 md:pb-12 w-full min-w-0 overflow-x-hidden">
            {/* Razor-thin scroll progress indicator */}
            {!settings.reduceMotion && (
              <motion.div
                style={{ scaleX }}
                className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-50 pointer-events-none opacity-80"
              />
            )}
            {/* Subtle atmospheric top-light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,hsl(var(--primary)/0.045),transparent)] -z-10"
            />
            <motion.div
              key={location.pathname}
              initial={settings.reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-7xl mx-auto w-full min-w-0"
            >
              {children}
            </motion.div>

            {/* Minimalist Footer Credit */}
            <div className="mt-16 pt-6 border-t border-border/60 text-center w-full">
              <p className="text-[11px] text-muted-foreground">
                Karnataka CET Admissions Analytics & Counseling Platform • Built independently for KCET aspirants
              </p>
            </div>
          </main>
        )}
      </div>
      <PremiumUpgradeModal open={premiumUpgradeOpen} onOpenChange={setPremiumUpgradeOpen} />
      <UserProfileModal open={userProfileOpen} onOpenChange={setUserProfileOpen} onUpgradeClick={() => setPremiumUpgradeOpen(true)} />
      <GlobalDonationPopup />
    </SidebarProvider>
  )
}

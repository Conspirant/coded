import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sparkles, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react"

export function ProxyResultsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Do not trigger popup if already on the results checker page
    if (location.pathname === "/results") {
      return
    }

    // Show popup once per user session to avoid nagging returning users
    const hasSeen = sessionStorage.getItem("hasSeenProxyPopup")
    if (!hasSeen) {
      // Delay to avoid conflicts with other modals/layout shifts
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [location.pathname])

  const handleClose = useCallback(() => {
    sessionStorage.setItem("hasSeenProxyPopup", "true")
    setIsOpen(false)
  }, [])

  const handleNavigate = useCallback(() => {
    sessionStorage.setItem("hasSeenProxyPopup", "true")
    setIsOpen(false)
    navigate("/results")
  }, [navigate])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal content */}
      <div className="relative w-full max-w-md bg-slate-950 border border-white/10 text-foreground overflow-hidden rounded-2xl p-6 shadow-2xl animate-scale-in">
        {/* Neon blur background cards */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative space-y-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
              <AlertTriangle className="h-5 w-5 text-white animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-1.5">
                KEA Website Crashing?
              </h3>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded font-bold uppercase tracking-wider block mt-0.5 w-fit">
                Server Overload Bypass
              </span>
            </div>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed pt-1">
            During peak hours, KEA results pages frequently fail with 503 or timeout errors due to massive concurrent traffic.
          </p>
        </div>

        {/* Body */}
        <div className="relative space-y-4 py-2">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">Deduplicated Request Proxying</span>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Our serverless functions queue incoming queries and retry connections automatically, saving you from constant page refreshing.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200 block">Instant Database Caching</span>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Once a scorecard is successfully retrieved, it is saved in our cache. Parents and friends checkups load in 0ms instantly!
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleNavigate}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-black font-extrabold shadow-lg shadow-amber-500/10 h-11 transition-all flex items-center justify-center gap-1.5 text-sm"
            >
              Try Live Proxy Checker
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button 
              onClick={handleClose} 
              variant="ghost" 
              className="text-muted-foreground hover:text-slate-200 text-xs h-9"
            >
              I'll check on KEA directly
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, X, Check } from "lucide-react"

const STORAGE_KEY = "kcet_scope_notice_dismissed_v1"

export function ScopeNotification() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem(STORAGE_KEY)
      // Check if redirected from an unsupported route query param
      const params = new URLSearchParams(window.location.search)
      const forceShow = params.get("notice") === "exam-scope"

      if (forceShow || !isDismissed) {
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }

    // Listen for custom trigger event (e.g. When redirected from old routes)
    const handleTrigger = () => setVisible(true)
    window.addEventListener("kcet_show_scope_notice", handleTrigger)
    return () => window.removeEventListener("kcet_show_scope_notice", handleTrigger)
  }, [])

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true")
    } catch { }
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-40 w-full bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md border-b border-sky-500/20 px-3 sm:px-6 py-2.5 shadow-sm text-foreground"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Info className="h-3 w-3" />
              </span>
              <p className="text-slate-300 leading-tight truncate sm:whitespace-normal">
                <strong className="font-semibold text-slate-100">Admissions Scope:</strong>{" "}
                KCET Coded is currently dedicated exclusively to Karnataka CET (Engineering & Architecture) admissions. We regret that we do not support NEET or COMEDK counseling at this time.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDismiss}
                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors"
              >
                <Check className="h-3 w-3 text-emerald-400" />
                Understood
              </button>
              <button
                onClick={handleDismiss}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
                aria-label="Dismiss notice"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function triggerScopeNotice() {
  window.dispatchEvent(new CustomEvent("kcet_show_scope_notice"))
}

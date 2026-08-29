import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Maximize2, Minimize2, Gamepad2, ArrowUp, ArrowDown, Sparkles } from "lucide-react"

interface DinoGameModalProps {
  open: boolean
  onClose: () => void
}

export function DinoGameModal({ open, onClose }: DinoGameModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, isFullscreen, onClose])

  // Reset loading state when opened
  useEffect(() => {
    if (open) {
      setIsLoading(true)
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed z-[251] ${
              isFullscreen
                ? "inset-2 sm:inset-4 w-auto h-auto max-w-none"
                : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-3xl h-[85vh] max-h-[640px]"
            }`}
          >
            <div className="w-full h-full flex flex-col rounded-2xl bg-card border border-white/10 shadow-2xl shadow-indigo-500/20 overflow-hidden backdrop-blur-xl">
              {/* Header Bar */}
              <div className="px-4 sm:px-6 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10">
                    <Gamepad2 className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-sm sm:text-base gradient-text">Chrome Dino Runner</h2>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        Arcade Mini-Game
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      Press <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px]">Space</kbd> or <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px]">↑</kbd> to jump, <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px]">↓</kbd> to duck
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreen((prev) => !prev)}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={onClose}
                    title="Close"
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-muted-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Game Frame Area */}
              <div className="flex-1 relative w-full h-full bg-[#f7f7f7] dark:bg-[#1a1a1a] overflow-hidden">
                {isLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Loading Dino Arcade...
                    </p>
                  </div>
                )}
                <iframe
                  src="https://chromedino.com/embed/"
                  frameBorder="0"
                  scrolling="no"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  title="Chrome Dino Runner"
                  onLoad={() => setIsLoading(false)}
                  className="w-full h-full border-0 absolute inset-0"
                />
              </div>

              {/* Mobile Quick Control Hint Bar */}
              <div className="px-4 py-2 bg-white/[0.02] border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground shrink-0 gap-2">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="font-semibold text-foreground">Controls:</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">↑</kbd> Jump
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">↓</kbd> Duck
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground/60 hidden sm:block">
                  Press <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px]">Esc</kbd> to exit
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

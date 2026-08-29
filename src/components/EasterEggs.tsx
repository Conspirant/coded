import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Command, HelpCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react"
import { DinoGameModal } from "./DinoGameModal"

/* ═══════════════════════════════════════════════════
   KONAMI CODE PARTY MODE 🎉
   ↑↑↓↓←→←→BA triggers confetti + neon celebration
   ═══════════════════════════════════════════════════ */

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

function createConfettiPiece(container: HTMLElement) {
    const piece = document.createElement("div")
    const colors = ["#6366f1", "#a855f7", "#ec4899", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6"]
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = Math.random() * 8 + 4
    const x = Math.random() * window.innerWidth
    const rotation = Math.random() * 360
    const duration = Math.random() * 2 + 2

    piece.style.cssText = `
    position: fixed;
    top: -20px;
    left: ${x}px;
    width: ${size}px;
    height: ${size * 0.6}px;
    background: ${color};
    border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    transform: rotate(${rotation}deg);
    z-index: 10000;
    pointer-events: none;
    animation: confetti-fall ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    opacity: 1;
  `
    container.appendChild(piece)
    setTimeout(() => piece.remove(), duration * 1000)
}

export function KonamiEasterEgg() {
    const [partyMode, setPartyMode] = useState(false)
    const [showBanner, setShowBanner] = useState(false)
    const inputRef = useRef<string[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if typing in inputs
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

            inputRef.current.push(e.key.length === 1 ? e.key.toLowerCase() : e.key)
            if (inputRef.current.length > 10) inputRef.current.shift()

            const joined = inputRef.current.join(",")
            const konamiStr = KONAMI.join(",")

            if (joined === konamiStr) {
                inputRef.current = []
                activatePartyMode()
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    const activatePartyMode = useCallback(() => {
        setPartyMode(true)
        setShowBanner(true)

        // Burst confetti
        if (containerRef.current) {
            for (let wave = 0; wave < 3; wave++) {
                setTimeout(() => {
                    for (let i = 0; i < 60; i++) {
                        setTimeout(() => {
                            if (containerRef.current) createConfettiPiece(containerRef.current)
                        }, i * 15)
                    }
                }, wave * 400)
            }
        }

        // Add party class to body
        document.body.classList.add("party-mode")

        // Auto-dismiss after 6 seconds
        setTimeout(() => {
            setShowBanner(false)
            setTimeout(() => {
                setPartyMode(false)
                document.body.classList.remove("party-mode")
            }, 500)
        }, 6000)
    }, [])

    return (
        <>
            <div ref={containerRef} className="fixed inset-0 z-[9999] pointer-events-none" />

            <AnimatePresence>
                {showBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -80, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -80, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 z-[10001] pointer-events-auto"
                    >
                        <div className="glass-strong rounded-2xl border border-white/10 shadow-2xl shadow-indigo-500/20 px-8 py-4 flex items-center gap-4">
                            <div className="text-3xl animate-bounce">🎉</div>
                            <div>
                                <h3 className="font-bold text-lg gradient-text">Party Mode Activated!</h3>
                                <p className="text-sm text-muted-foreground">You found the easter egg! ↑↑↓↓←→←→BA</p>
                            </div>
                            <button onClick={() => setShowBanner(false)} className="ml-4 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

/* ═══════════════════════════════════════════════════
   KEYBOARD SHORTCUTS HUD ⌨️
   Press ? to see all shortcuts
   ═══════════════════════════════════════════════════ */

interface Shortcut {
    keys: string[]
    description: string
    category: string
}

const SHORTCUTS: Shortcut[] = [
    { keys: ["Ctrl", "K"], description: "Open command palette — search anything", category: "Navigation" },
    { keys: ["?"], description: "Show this shortcuts panel", category: "Navigation" },
    { keys: ["↑↑↓↓←→←→BA"], description: "Activate party mode 🎉", category: "Easter Eggs" },
    { keys: ["d", "i", "n", "o"], description: "Play Chrome Dino runner 🦖", category: "Easter Eggs" },
    { keys: ["Esc"], description: "Close any open panel or dialog", category: "General" },
    { keys: ["↑", "↓"], description: "Navigate command palette results", category: "Command Palette" },
    { keys: ["Enter"], description: "Select highlighted result", category: "Command Palette" },
]

export function KeyboardShortcutsHUD() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
            if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
                e.preventDefault()
                setOpen(prev => !prev)
            }
            if (e.key === "Escape") setOpen(false)
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    // Group by category
    const grouped = SHORTCUTS.reduce((acc, s) => {
        acc[s.category] = acc[s.category] || []
        acc[s.category].push(s)
        return acc
    }, {} as Record<string, Shortcut[]>)

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[95vw] max-w-lg"
                    >
                        <div className="glass-strong rounded-2xl shadow-2xl shadow-black/40 border border-white/10 overflow-hidden">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <HelpCircle className="h-5 w-5 text-indigo-400" />
                                    <h2 className="font-bold text-lg">Keyboard Shortcuts</h2>
                                </div>
                                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Shortcuts list */}
                            <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
                                {Object.entries(grouped).map(([category, shortcuts]) => (
                                    <div key={category}>
                                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-2.5 px-2">{category}</h3>
                                        <div className="space-y-1">
                                            {shortcuts.map((s, i) => (
                                                <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors">
                                                    <span className="text-sm">{s.description}</span>
                                                    <div className="flex items-center gap-1 shrink-0 ml-4">
                                                        {s.keys.map((key, j) => (
                                                            <span key={j}>
                                                                {j > 0 && <span className="text-muted-foreground/40 mx-0.5 text-xs">+</span>}
                                                                <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-muted-foreground min-w-[28px] text-center inline-block">
                                                                    {key}
                                                                </kbd>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-3 border-t border-white/5 text-center">
                                <p className="text-[10px] text-muted-foreground/50">
                                    Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px]">?</kbd> to toggle this panel
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

/* ═══════════════════════════════════════════════════
   DINO RUNNER EASTER EGG 🦖
   Typing "dino" opens the arcade runner modal
   ═══════════════════════════════════════════════════ */

export function DinoEasterEgg() {
    const [open, setOpen] = useState(false)
    const bufferRef = useRef<string[]>([])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

            // Handle secret trigger sequence "dino"
            bufferRef.current.push(e.key.toLowerCase())
            if (bufferRef.current.length > 4) bufferRef.current.shift()

            if (bufferRef.current.join("") === "dino") {
                bufferRef.current = []
                setOpen(true)
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return <DinoGameModal open={open} onClose={() => setOpen(false)} />
}


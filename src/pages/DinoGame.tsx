import { useState } from "react"
import { SEO } from "@/components/SEO"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Gamepad2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Flame,
  Sword,
  Trophy,
  Zap,
  Info
} from "lucide-react"

export default function DinoGame() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [key, setKey] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const reloadGame = () => {
    setIsLoading(true)
    setKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <SEO
        title="Chrome Dino Runner Game | KCET Coded Mini-Game Arcade"
        description="Take a study break and play the classic Chrome T-Rex Dinosaur runner game. Jump over cacti, duck under pterodactyls, and beat your high score!"
        url="https://kcetcoded.dev/dino"
      />

      {/* Aurora Ambient Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 animate-aurora opacity-40" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Home
              </Button>
            </Link>
            <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Gamepad2 className="h-4 w-4" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black gradient-text">Chrome Dino Runner</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={reloadGame}
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Restart Game
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5 mr-1.5" /> Normal View
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5 mr-1.5" /> Fullscreen
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Game Arcade Container */}
        <motion.div
          layout
          className={`relative rounded-2xl border border-white/10 shadow-2xl shadow-indigo-500/10 overflow-hidden bg-card transition-all ${
            isFullscreen
              ? "fixed inset-2 sm:inset-4 z-[300] h-auto"
              : "w-full h-[480px] sm:h-[540px] mb-8"
          }`}
        >
          {isFullscreen && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsFullscreen(false)}
                className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-md rounded-xl border border-white/10 text-xs"
              >
                <Minimize2 className="h-3.5 w-3.5 mr-1.5" /> Exit Fullscreen (Esc)
              </Button>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Loading Dino Arcade...
              </p>
            </div>
          )}

          <iframe
            key={key}
            src="https://chromedino.com/embed/"
            frameBorder="0"
            scrolling="no"
            width="100%"
            height="100%"
            loading="lazy"
            title="Chrome Dino Runner"
            onLoad={() => setIsLoading(false)}
            className="w-full h-full border-0 absolute inset-0 bg-[#f7f7f7] dark:bg-[#1a1a1a]"
          />
        </motion.div>

        {/* Control guide & Arcade Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Controls Card */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 text-indigo-400 font-semibold text-sm">
              <Zap className="h-4 w-4" /> Keyboard Controls
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span>Start / Jump</span>
                <div className="flex gap-1">
                  <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px]">Space</kbd>
                  <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px]">↑</kbd>
                </div>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span>Duck / Fast Drop</span>
                <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px]">↓</kbd>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>Restart After Crash</span>
                <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px]">Space</kbd>
              </div>
            </div>
          </div>

          {/* Gameplay Pro Tips */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 text-amber-400 font-semibold text-sm">
              <Trophy className="h-4 w-4" /> Pro Survival Tips
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
              <li>Pterodactyls begin flying toward you once you surpass <strong>450 points</strong>.</li>
              <li>Day-to-night inversion triggers every <strong>700 points</strong>.</li>
              <li>Pressing <kbd className="px-1 py-0.2 rounded bg-white/5 border border-white/10 font-mono text-[10px]">↓</kbd> mid-air snaps the Dino to the ground quickly.</li>
            </ul>
          </div>

          {/* More Mini-Games & Break Tools */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold text-sm">
              <Sparkles className="h-4 w-4" /> More Brain Breaks
            </div>
            <div className="space-y-2">
              <Link
                to="/daily-challenge"
                className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-3.5 w-3.5 text-orange-400" />
                  <span className="font-medium text-foreground">Daily KCET Challenge</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Streak & Quiz</span>
              </Link>
              <Link
                to="/cutoff-clash"
                className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs"
              >
                <div className="flex items-center gap-2">
                  <Sword className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="font-medium text-foreground">Cutoff Clash</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Higher/Lower</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-muted-foreground/60 py-4 mt-auto">
          <p>
            Study break mini-game · Chrome Dinosaur Runner · KCET Coded
          </p>
        </div>
      </div>
    </div>
  )
}

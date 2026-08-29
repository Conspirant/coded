import { useState } from "react"
import { SEO } from "@/components/SEO"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Rocket, Gamepad2 } from "lucide-react"
import { DinoGameModal } from "@/components/DinoGameModal"

const NotFound = () => {
  const [dinoModalOpen, setDinoModalOpen] = useState(false)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Head back to KCET Coded to explore rank predictor, cutoff explorer, college predictor and more."
        url="https://kcetcoded.dev/404"
      />
      {/* Dino Game Modal */}
      <DinoGameModal open={dinoModalOpen} onClose={() => setDinoModalOpen(false)} />
      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 animate-aurora opacity-50" />
        <div className="absolute inset-0 bg-background/50" />
      </div>

      {/* Floating Stars */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="text-center px-6 relative z-10">
        {/* Floating astronaut */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8 inline-block"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 rounded-full border border-dashed border-white/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-16 rounded-full border border-dashed border-white/5"
            />
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center shadow-2xl shadow-indigo-500/10 backdrop-blur-sm border border-white/10">
              <Rocket className="h-12 w-12 text-indigo-400" />
            </div>
          </div>
        </motion.div>

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter gradient-text select-none">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold mb-3">Lost in Space</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            This page drifted into a black hole. Don't worry, your KCET journey is still on track!
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/">
            <Button size="lg" className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0 transition-all hover:scale-105">
              <Home className="mr-2 h-4 w-4" /> Go Home
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 transition-all"
            onClick={() => setDinoModalOpen(true)}
          >
            <Gamepad2 className="mr-2 h-4 w-4 text-indigo-400" /> Play Dino Game
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </motion.div>

        {/* Drift text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-12 text-xs text-muted-foreground/50"
        >
          Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px]">Ctrl+K</kbd> to jump anywhere instantly
        </motion.p>
      </div>
    </div>
  )
}

export default NotFound

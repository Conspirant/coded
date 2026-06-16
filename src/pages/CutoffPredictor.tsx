// ╔══════════════════════════════════════════════════════════════════╗
// ║  CUTOFF PREDICTOR — UNDER MAINTENANCE                            ║
// ║  To restore the active predictor: run the git command:          ║
// ║  git restore src/pages/CutoffPredictor.tsx                       ║
// ╚══════════════════════════════════════════════════════════════════╝

import { SEO } from "@/components/SEO"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wrench, Clock, ArrowRight, Bot, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const CutoffPredictor = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-grid-pattern relative overflow-hidden">
      <SEO
        title="KCET Cutoff Predictor – Under Maintenance"
        description="The Cutoff Predictor tool is currently undergoing maintenance and algorithm updates. Check back soon for updated predictions."
        url="https://kcet-coded2.vercel.app/cutoff-predictor"
      />

      {/* Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/[0.04] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-xl w-full"
      >
        {/* Glow border effect */}
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/[0.08] via-indigo-500/[0.06] to-white/[0.03] -z-10" />
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-indigo-500/20 via-transparent to-rose-500/10 blur-sm -z-20" />

        <Card className="glass rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
          <CardContent className="p-8 sm:p-12 text-center space-y-8">
            
            {/* Maintenance Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
                </span>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  System Upgrades In Progress
                </span>
              </div>
            </div>

            {/* Premium Maintenance Icon with custom micro-animations */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-white/[0.08] flex items-center justify-center shadow-lg relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <Wrench className="h-10 w-10 text-violet-400" />
                </motion.div>
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                Predictor Under{" "}
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                  Maintenance
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md mx-auto">
                We are currently upgrading the prediction algorithms to incorporate the latest KEA seat intake updates, category revisions, and recent trends for the upcoming round forecasts.
              </p>
            </div>

            {/* Quick Status Check Card */}
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-5 text-left space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Estimated Availability</h4>
                  <p className="text-xs text-slate-400 mt-0.5">We expect this module to return shortly with enhanced accuracy and newly consolidated seat matrix integration.</p>
                </div>
              </div>
              
              <div className="h-px bg-white/[0.05]" />

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Upgrade status</span>
                <span className="text-indigo-400 font-semibold">Database Integration • 85%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
                <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
              </div>
            </div>

            {/* Actions / Alternative tools */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-semibold shadow-lg shadow-indigo-600/20 h-11 px-6 rounded-xl gap-2 transition-all duration-300 cursor-pointer"
              >
                <Link to="/cutoff-explorer">
                  <Search className="h-4 w-4" />
                  Cutoff Explorer
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-medium h-11 px-6 rounded-xl gap-2 transition-all cursor-pointer"
              >
                <Link to="/ai-counselor">
                  <Bot className="h-4 w-4 text-violet-400" />
                  AI Counselor
                </Link>
              </Button>
            </div>

            {/* Footer hint */}
            <p className="text-xs text-slate-500">
              For other active tools, please visit the{" "}
              <Link to="/dashboard" className="text-indigo-400 hover:underline transition-all">
                Dashboard
              </Link>
              .
            </p>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default CutoffPredictor

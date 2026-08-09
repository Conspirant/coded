import React from "react"
import { Eye, Users, Activity, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useVisitorCounter } from "@/lib/visitor-service"

interface LiveVisitorCounterProps {
  variant?: "compact" | "detailed" | "pill"
  className?: string
  showActiveOnline?: boolean
}

export const LiveVisitorCounter: React.FC<LiveVisitorCounterProps> = ({
  variant = "compact",
  className = "",
  showActiveOnline = true
}) => {
  const { totalVisits, activeOnline, isLive } = useVisitorCounter()

  const formattedVisits = totalVisits.toLocaleString("en-IN")

  if (variant === "pill") {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium ${className}`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-semibold text-emerald-300">{formattedVisits}</span>
        <span className="text-muted-foreground text-[11px]">visits</span>
        {showActiveOnline && activeOnline > 0 && (
          <>
            <span className="text-emerald-500/40">•</span>
            <span className="text-xs text-emerald-400/90 font-medium flex items-center gap-1">
              <Users className="h-3 w-3 text-emerald-400" /> {activeOnline} online
            </span>
          </>
        )}
      </div>
    )
  }

  if (variant === "detailed") {
    return (
      <div className={`p-4 sm:p-5 rounded-2xl glass-strong border border-white/10 bg-gradient-to-br from-indigo-950/30 via-slate-900/40 to-emerald-950/20 shadow-xl ${className}`}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                Live Visitor Counter
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                  REALTIME
                </Badge>
              </h4>
              <p className="text-xs text-muted-foreground">Total unique visitors served</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{activeOnline} Active Now</span>
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between pt-2 border-t border-white/5">
          <div className="space-y-0.5">
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent font-mono">
              {formattedVisits}
            </div>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" /> Counted atomically via Supabase Realtime
            </p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="bg-white/5 text-muted-foreground border-white/10 text-xs">
              Base 51,783+
            </Badge>
          </div>
        </div>
      </div>
    )
  }

  // Default "compact" variant for Navbar Header
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium transition-colors cursor-default ${className}`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-emerald-400 opacity-75' : 'bg-amber-400 opacity-50'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <Eye className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200 font-mono tracking-tight">{formattedVisits}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs space-y-1 bg-slate-900 border-slate-800">
          <p className="font-semibold text-emerald-400 flex items-center gap-1">
            <Activity className="h-3 w-3" /> Live Visitor Analytics
          </p>
          <p className="text-slate-300">{formattedVisits} total visits logged</p>
          {activeOnline > 0 && (
            <p className="text-slate-400 text-[11px] flex items-center gap-1">
              <Users className="h-3 w-3 text-emerald-400" /> {activeOnline} active user{activeOnline > 1 ? 's' : ''} currently on site
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

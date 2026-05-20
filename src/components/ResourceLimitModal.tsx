import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  Cpu, 
  Database, 
  Server, 
  Clock, 
  Terminal, 
  Image as ImageIcon, 
  Globe, 
  FileCheck,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Home,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export const ResourceLimitModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);

  // Define allowed paths
  const cleanPath = location.pathname.endsWith('/') && location.pathname.length > 1 
    ? location.pathname.slice(0, -1) 
    : location.pathname;

  // Add /donate to allowed paths so user can access the donation page
  const isAllowed = 
    cleanPath === '' || 
    cleanPath === '/' || 
    cleanPath === '/rank-predictor' || 
    cleanPath === '/admin' || 
    cleanPath === '/donate';

  // If path is allowed, do not show the blocking overlay
  if (isAllowed) return null;

  // Resource metrics based on user image
  const primaryMetrics = [
    {
      name: "Fast Data Transfer",
      used: "75.78 GB",
      limit: "100 GB",
      percentage: 75.78,
      status: "critical",
      colorClass: "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]",
      textColorClass: "text-amber-400",
      bgClass: "bg-amber-500/10 border-amber-500/20",
      description: "Aggregated bandwidth used to serve assets, data feeds, and pages.",
      icon: Globe
    },
    {
      name: "Edge Requests",
      used: "463K",
      limit: "1M",
      percentage: 46.3,
      status: "warning",
      colorClass: "bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]",
      textColorClass: "text-indigo-400",
      bgClass: "bg-indigo-500/10 border-indigo-500/20",
      description: "Global routing and middleware requests executed at the edge.",
      icon: Server
    }
  ];

  const detailedMetrics = [
    { name: "Fluid Active CPU", used: "9m 2s", limit: "4h", percentage: 3.76, icon: Cpu },
    { name: "Fluid Provisioned Memory", used: "5.1 GB-Hrs", limit: "360 GB-Hrs", percentage: 1.42, icon: Database },
    { name: "Edge Request CPU Duration", used: "42s", limit: "1h", percentage: 1.16, icon: Clock },
    { name: "ISR Reads", used: "2.2K", limit: "1M", percentage: 0.22, icon: FileCheck },
    { name: "Function Invocations", used: "2.1K", limit: "1M", percentage: 0.21, icon: Terminal },
    { name: "Image Optimization", used: "10", limit: "5K", percentage: 0.20, icon: ImageIcon },
    { name: "Fast Origin Transfer", used: "17.05 MB", limit: "10 GB", percentage: 0.17, icon: Activity }
  ];

  const handleRedirect = () => {
    navigate('/rank-predictor');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoDonate = () => {
    navigate('/donate');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-background/90 backdrop-blur-xl overflow-y-auto grid place-items-center p-4">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 via-background/40 to-amber-950/10 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-2xl bg-slate-950/90 border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-7 md:p-8 backdrop-blur-2xl overflow-hidden my-auto"
      >
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Warning Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-5 relative z-10">
          <div className="p-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 animate-pulse">
            <AlertTriangle className="h-6.5 w-6.5 text-amber-500" />
          </div>
          <div className="space-y-1">
            <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/5 font-semibold text-[9px] sm:text-[10px] tracking-wider uppercase px-2.5 py-0.5">
              Service Notice: Resource Limit Approaching
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
              Temporary Feature Suspension
            </h2>
          </div>
        </div>

        {/* Explanatory Description */}
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed text-center space-y-3 mb-6 max-w-xl mx-auto relative z-10">
          <p className="font-semibold text-slate-200">
            We sincerely apologize for any inconvenience caused.
          </p>
          <p>
            Secondary features, including the <strong>College Predictor</strong> (College Finder), the <strong>AI Counselor</strong>, and other tools, will be fully reactivated and made available once the official results are declared or the counselling phase begins.
          </p>
          <p className="text-amber-200/90 font-semibold">
            Currently, only the <strong className="text-white underline decoration-amber-400 decoration-2 underline-offset-4">Rank Predictor</strong> remains active and fully operational.
          </p>
          <div className="text-[11px] sm:text-xs text-slate-300/90 bg-white/[0.02] border border-white/5 rounded-lg p-3.5 mt-3 text-left">
            <p className="text-center sm:text-left leading-relaxed">
              <strong>Resource Management Note:</strong> The primary objective of temporarily suspending these services is to prevent unnecessary consumption of our hosted server resources prior to the active counselling period. If you require early access to specific features, please feel free to reach out to the developer. Thank you for your support and understanding.
            </p>
          </div>
        </div>

        {/* Resource Usage Dashboard */}
        <div className="space-y-3 bg-white/[0.02] border border-white/5 rounded-xl p-4 sm:p-5 mb-6 relative z-10">
          <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
            <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-indigo-400" /> Live Resource Utilization
            </span>
            <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[9px] sm:text-[10px]">
              Active Guard Enabled
            </Badge>
          </div>

          {/* Primary Indicator Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {primaryMetrics.map((metric) => (
              <div 
                key={metric.name} 
                className={`p-3.5 rounded-xl border transition-all duration-300 ${metric.bgClass}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5">
                      <metric.icon className={`h-4 w-4 ${metric.textColorClass}`} />
                    </div>
                    <span className="text-xs font-semibold text-white">{metric.name}</span>
                  </div>
                  <span className={`text-xs font-extrabold ${metric.textColorClass}`}>{metric.percentage}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${metric.colorClass}`}
                    style={{ width: `${metric.percentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-muted-foreground">
                  <span>Usage: <strong>{metric.used}</strong></span>
                  <span>Limit: {metric.limit}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/75 mt-2 leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>

          {/* Collapsible Detailed Metrics */}
          <div className="border-t border-white/5 pt-2.5">
            <button
              onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}
              className="flex items-center justify-center gap-1.5 w-full py-1 text-xs font-semibold text-muted-foreground hover:text-white transition-colors"
            >
              <span>{showDetailedMetrics ? "Hide Detailed System Metrics" : "Show All System Metrics"}</span>
              {showDetailedMetrics ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            <AnimatePresence>
              {showDetailedMetrics && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3 pt-2.5 border-t border-white/5">
                    {detailedMetrics.map((metric) => (
                      <div key={metric.name} className="p-2.5 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <metric.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-[11px] sm:text-xs text-slate-300 truncate">{metric.name}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] sm:text-xs font-medium text-white">{metric.used} / {metric.limit}</div>
                          <div className="text-[9px] sm:text-[10px] text-muted-foreground">{metric.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-4 border-t border-white/5 relative z-10">
          <Button
            onClick={handleRedirect}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm h-11 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 flex items-center justify-center gap-2"
          >
            Access Rank Predictor
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              onClick={handleGoHome}
              variant="outline"
              className="border-white/10 hover:bg-white/5 text-xs h-10 rounded-xl flex items-center justify-center gap-1 text-slate-300 px-2"
            >
              <Home className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Home</span>
            </Button>

            <a 
              href="https://discord.gg/QZcjtJKjYJ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5 text-xs h-10 rounded-xl flex items-center justify-center gap-1 text-slate-300 px-2"
              >
                <svg className="h-3.5 w-3.5 text-[#5865F2] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                <span className="truncate">Discord</span>
              </Button>
            </a>

            <a 
              href="https://www.reddit.com/user/Elegant_Compote9073/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full block"
            >
              <Button
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5 text-xs h-10 rounded-xl flex items-center justify-center gap-1 text-slate-300 px-2"
              >
                <MessageSquare className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                <span className="truncate">u/Elegant_Compote</span>
              </Button>
            </a>

            <Button
              onClick={handleGoDonate}
              variant="outline"
              className="border-rose-500/20 hover:bg-rose-500/5 text-xs h-10 rounded-xl flex items-center justify-center gap-1 text-rose-300 hover:text-rose-200 px-2"
            >
              <Heart className="h-3.5 w-3.5 text-rose-500 shrink-0 animate-pulse" />
              <span className="truncate">Donate</span>
            </Button>
          </div>

          <div className="text-[10px] text-center text-muted-foreground/60">
            For support or feature inquiries, join Discord or contact the developer on Reddit.
          </div>
        </div>
      </motion.div>
    </div>
  );
};

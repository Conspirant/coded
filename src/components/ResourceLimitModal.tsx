import React, { useState, useEffect } from 'react';
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
  Heart,
  Key,
  Eye,
  EyeOff,
  Unlock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { isUnlocked, validateAndUnlock, subscribeToUnlockState } from '@/lib/unlock';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { AdminSuggestionsService } from '@/lib/admin-suggestions-service';

export const ResourceLimitModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    return subscribeToUnlockState(setUnlocked);
  }, []);

  const [suggestionInput, setSuggestionInput] = useState('');
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);
  const [suggestionError, setSuggestionError] = useState('');
  const [suggestionSuccess, setSuggestionSuccess] = useState('');

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestionError('');
    setSuggestionSuccess('');

    if (!suggestionInput.trim()) {
      setSuggestionError('Please enter a suggestion or doubt.');
      return;
    }

    setIsSubmittingSuggestion(true);
    const result = await AdminSuggestionsService.addSuggestion(suggestionInput.trim());
    setIsSubmittingSuggestion(false);

    if (result.success) {
      setSuggestionSuccess('Thank you! Your message has been sent to the admin dashboard.');
      toast.success('Submitted successfully!', {
        description: 'Thank you for your feedback!'
      });
      setSuggestionInput('');
    } else {
      setSuggestionError(result.error || 'Failed to submit. Please try again.');
      toast.error('Submission failed', {
        description: 'An error occurred while saving your suggestion.'
      });
    }
  };

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!accessKeyInput.trim()) {
      setErrorMsg('Please enter an access key.');
      return;
    }

    const success = validateAndUnlock(accessKeyInput);
    if (success) {
      setSuccessMsg('Access granted! Unlocking features...');
      toast.success('Successfully unlocked all premium features!', {
        description: 'You now have full access to early tools.'
      });
      setAccessKeyInput('');
    } else {
      setErrorMsg('Invalid access key. Please check and try again.');
      toast.error('Unlock failed', {
        description: 'The access key you entered is incorrect.'
      });
    }
  };

  // Define allowed paths
  const cleanPath = location.pathname.endsWith('/') && location.pathname.length > 1 
    ? location.pathname.slice(0, -1) 
    : location.pathname;

  // Set of exact match paths that are lightweight and allowed
  const allowedExact = new Set([
    '', '/', '/rank-predictor', '/admin', '/donate',
    '/daily-challenge', '/cutoff-clash', '/cet-news',
    '/about', '/privacy', '/terms', '/reviews',
    '/documents', '/materials', '/info-centre',
    '/squad-finder', '/metro-mapper', '/bmtc-mapper',
    '/hidden-gems', '/college-list', '/college-cutoffs',
    '/results', '/dashboard'
  ]);

  // Prefix checks for sub-routes
  const allowedPrefixes = ['/reviews/', '/college/'];

  const isAllowed = 
    allowedExact.has(cleanPath) || 
    allowedPrefixes.some(prefix => cleanPath.startsWith(prefix));

  // If path is allowed or already unlocked, do not show the blocking overlay
  if (isAllowed || unlocked) return null;

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
              Service Notice: Hosting Resources Normalizing
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
              Hosting Status & Launch Update
            </h2>
          </div>
        </div>

        {/* Explanatory Description */}
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed text-center space-y-3 mb-6 max-w-xl mx-auto relative z-10">
          <p className="font-semibold text-slate-200">
            THANK YOU TO ALL THE USERS FOR THEIR PATIENCE.
          </p>
          <p>
            We are pleased to inform you that our hosting server resources are currently returning to normal. We sincerely thank every single one of you for showing interest in using our website, whether it is the <strong>College Predictor (College by Rank)</strong>, the <strong>Rank Predictor</strong>, or any other feature.
          </p>
          <p>
            This project took approximately 12 months and the orchestration of around 20 machine learning models to take shape, and we are overwhelmed by the number of people showing interest by requesting access keys. We are extremely grateful for your response and are dedicated to continuing this project, even though visitor traffic temporarily reduced following the shutdown.
          </p>
          <p className="text-amber-200/95 font-semibold">
            Rest assured, the website will be fully functional and open to all aspirants from Monday, 01/06/2026 (June 1st, 2026).
          </p>
          <div className="text-[11px] sm:text-xs text-slate-300/90 bg-white/[0.02] border border-white/5 rounded-lg p-3.5 mt-3 text-left">
            <p className="text-center sm:text-left leading-relaxed">
              Until then, users with an active access key can continue to use and test the features, which grants our team the valuable time needed to optimize the platform. If you need an access key, please do contact us—we try to reply as quickly as possible.
            </p>
          </div>
        </div>

        {/* Suggestions & Doubts Input Section */}
        <div className="bg-white/[0.02] border border-white/10 hover:border-indigo-500/25 transition-all duration-300 rounded-xl p-4 sm:p-5 mb-6 relative z-10 shadow-lg shadow-black/40">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-md bg-indigo-500/10">
              <MessageSquare className="h-4 w-4 text-indigo-400 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Suggestions & Doubts
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-300/90 mb-3 text-left leading-relaxed">
            Until the official publication, if you have any suggestions, improvements, or doubts, please write them below. Your feedback will be sent directly to our admin dashboard.
          </p>
          
          <form onSubmit={handleSuggestionSubmit} className="space-y-3">
            <Textarea
              placeholder="Write your suggestion or doubt here..."
              value={suggestionInput}
              onChange={(e) => {
                setSuggestionInput(e.target.value);
                if (suggestionError) setSuggestionError('');
              }}
              className="bg-black/40 border-white/15 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl min-h-[90px] text-sm placeholder:text-muted-foreground/60 transition-all resize-none shadow-none w-full"
            />
            
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmittingSuggestion}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex items-center gap-1.5 shrink-0"
              >
                {isSubmittingSuggestion ? 'Submitting...' : 'Submit Message'}
              </Button>
            </div>
          </form>
          
          <AnimatePresence>
            {suggestionError && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-rose-400 mt-2 font-medium flex items-center gap-1"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                {suggestionError}
              </motion.p>
            )}
            {suggestionSuccess && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1 animate-pulse"
              >
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                {suggestionSuccess}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Access Key Section */}
        <div className="bg-white/[0.02] border border-white/10 hover:border-amber-500/25 transition-all duration-300 rounded-xl p-4 sm:p-5 mb-6 relative z-10 shadow-lg shadow-black/40">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-md bg-amber-500/10">
              <Key className="h-4 w-4 text-amber-400 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Unlock Blocked Features
            </span>
          </div>
          
          <form onSubmit={handleUnlockSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="Enter Access Key..."
                value={accessKeyInput}
                onChange={(e) => {
                  setAccessKeyInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                className="bg-black/40 border-white/15 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 rounded-xl h-10 pr-10 font-mono text-sm placeholder:font-sans transition-all shadow-none w-full"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs h-10 px-4 rounded-xl shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Unlock className="h-3.5 w-3.5" />
              Unlock
            </Button>
          </form>
          
          <AnimatePresence>
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-rose-400 mt-2 font-medium flex items-center gap-1"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                {errorMsg}
              </motion.p>
            )}
            {successMsg && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1 animate-pulse"
              >
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                {successMsg}
              </motion.p>
            )}
          </AnimatePresence>
          
          <p className="text-[10px] text-muted-foreground/60 mt-2 leading-relaxed">
            Enter the beta access key to bypass the temporary service block and test early features.
          </p>

          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5">
            <span className="text-[10px] text-muted-foreground self-center">Don't have a key?</span>
            <a 
              href="https://discord.gg/QZcjtJKjYJ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
            >
              Request on Discord →
            </a>
            <span className="text-[10px] text-muted-foreground/45 self-center">•</span>
            <a 
              href="https://www.reddit.com/user/Elegant_Compote9073/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-orange-400 hover:text-orange-300 hover:underline transition-all"
            >
              Reddit DM Developer →
            </a>
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

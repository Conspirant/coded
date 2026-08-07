import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSuggestionsService } from "@/lib/admin-suggestions-service";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Home, ArrowLeft, Crown, Key, Loader2, Check, Lock, ExternalLink, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isUnlocked, subscribeToUnlockState, initiatePremiumPayment, verifyAndUnlockAccessKey } from "@/lib/unlock";

interface PresenceAndBlockContextValue {
  blockedPages: string[];
  maintenancePages: string[];
  isSiteShutdown: boolean;
  isBlocked: boolean;
  isMaintenance: boolean;
}

const PresenceAndBlockContext = createContext<PresenceAndBlockContextValue | undefined>(undefined);

export function PresenceAndBlockProvider({ children }: { children: React.ReactNode }) {
  const [blockedPages, setBlockedPages] = useState<string[]>([]);
  const [maintenancePages, setMaintenancePages] = useState<string[]>([]);
  const [isSiteShutdown, setIsSiteShutdown] = useState(false);
  const [unlocked, setUnlocked] = useState(isUnlocked());
  const [amount, setAmount] = useState<number>(19);
  const [totalAmount, setTotalAmount] = useState<number>(78);
  const [accessKey, setAccessKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showKeyForm, setShowKeyForm] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const presenceChannelRef = useRef<any>(null);

  // Listen to global unlock state transitions
  useEffect(() => {
    return subscribeToUnlockState((isUnlockedVal) => {
      setUnlocked(isUnlockedVal);
    });
  }, []);

  // Fetch blocked pages and total donations on mount
  useEffect(() => {
    const fetchBlocked = async () => {
      const paths = await AdminSuggestionsService.getBlockedPages();
      setBlockedPages(paths);
    };

    const fetchMaintenance = async () => {
      const paths = await AdminSuggestionsService.getMaintenancePages();
      setMaintenancePages(paths);
    };

    const fetchShutdown = async () => {
      const config = await AdminSuggestionsService.getSiteShutdownConfig();
      setShutdownConfig(config);
      setIsSiteShutdown(config.shutdown);
    };

    const fetchTotalAmount = async () => {
      try {
        const { data, error } = await supabase
          .from('donors' as any)
          .select('amount_inr');

        if (error) throw error;

        const donorsList = (data as any[]) || [];
        const dbTotal: number = donorsList.reduce((sum: number, d: any) => sum + (Number(d?.amount_inr) || 0), 0);
        setTotalAmount(78 + dbTotal);
      } catch (err) {
        console.error('Error fetching total amount:', err);
      }
    };

    fetchBlocked();
    fetchMaintenance();
    fetchShutdown();
    fetchTotalAmount();

    const dbChannel = supabase
      .channel("blocked-pages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:blocked_pages",
        },
        (payload) => {
          const paths = (payload.new as any)?.results_json?.blockedPaths || [];
          setBlockedPages(paths);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:blocked_pages",
        },
        (payload) => {
          const paths = (payload.new as any)?.results_json?.blockedPaths || [];
          setBlockedPages(paths);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:maintenance_pages",
        },
        (payload) => {
          const paths = (payload.new as any)?.results_json?.maintenancePaths || [];
          setMaintenancePages(paths);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:maintenance_pages",
        },
        (payload) => {
          const paths = (payload.new as any)?.results_json?.maintenancePaths || [];
          setMaintenancePages(paths);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:site_shutdown",
        },
        (payload) => {
          const raw = (payload.new as any)?.results_json || {};
          const cfg = {
            shutdown: raw.shutdown === true,
            errorCode: raw.errorCode || "404",
            title: raw.title || "Page Not Found",
            message: raw.message || "The requested URL {path} does not exist or has been moved.",
            buttonText: raw.buttonText || "Go Back",
            showButton: raw.showButton !== false
          };
          setShutdownConfig(cfg);
          setIsSiteShutdown(cfg.shutdown);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:site_shutdown",
        },
        (payload) => {
          const raw = (payload.new as any)?.results_json || {};
          const cfg = {
            shutdown: raw.shutdown === true,
            errorCode: raw.errorCode || "404",
            title: raw.title || "Page Not Found",
            message: raw.message || "The requested URL {path} does not exist or has been moved.",
            buttonText: raw.buttonText || "Go Back",
            showButton: raw.showButton !== false
          };
          setShutdownConfig(cfg);
          setIsSiteShutdown(cfg.shutdown);
        }
      )
      .subscribe();

    return () => {
      dbChannel.unsubscribe();
    };
  }, []);

  // Track real-time presence
  useEffect(() => {
    let sessionId = sessionStorage.getItem("presence_user_session_id");
    if (!sessionId) {
      sessionId = `USER:${Math.random().toString(36).substring(2, 10)}`;
      sessionStorage.setItem("presence_user_session_id", sessionId);
    }

    const channel = supabase.channel("global-alerts");
    presenceChannelRef.current = channel;

    channel
      .on("broadcast", { event: "site_shutdown_updated" }, (payload: any) => {
        const raw = payload?.payload?.config || {};
        const cfg = {
          shutdown: raw.shutdown === true,
          errorCode: raw.errorCode || "404",
          title: raw.title || "Page Not Found",
          message: raw.message || "The requested URL {path} does not exist or has been moved.",
          buttonText: raw.buttonText || "Go Back",
          showButton: raw.showButton !== false
        };
        setShutdownConfig(cfg);
        setIsSiteShutdown(cfg.shutdown);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.track({
            online_at: new Date().toISOString(),
            page: location.pathname,
            sessionId: sessionId
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Update tracked path whenever route changes
  useEffect(() => {
    const channel = presenceChannelRef.current;
    let sessionId = sessionStorage.getItem("presence_user_session_id");
    if (!sessionId) {
      sessionId = `USER:${Math.random().toString(36).substring(2, 10)}`;
      sessionStorage.setItem("presence_user_session_id", sessionId);
    }

    if (channel) {
      channel.track({
        online_at: new Date().toISOString(),
        page: location.pathname,
        sessionId: sessionId
      });
    }
  }, [location.pathname]);

  const handlePayment = async () => {
    if (amount < 5) {
      setErrorMsg("Minimum contribution is ₹5.");
      return;
    }
    setIsPaying(true);
    setErrorMsg("");
    await initiatePremiumPayment(
      () => {
        setIsPaying(false);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1500);
      },
      () => {
        setIsPaying(false);
      },
      amount
    );
  };

  const handleKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!accessKey.trim()) {
      setErrorMsg("Please enter a key.");
      return;
    }
    setLoading(true);
    const res = await verifyAndUnlockAccessKey(accessKey);
    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    } else {
      setErrorMsg(res.error || "Failed to verify key.");
    }
  };

  const currentPath = location.pathname;
  const normalizedPath = currentPath.length > 1 && currentPath.endsWith('/') 
    ? currentPath.slice(0, -1) 
    : currentPath;

  const isAdminRoute = normalizedPath === "/admin" || normalizedPath.startsWith("/admin/");
  const shouldShutdown = isSiteShutdown && !isAdminRoute;
  const isExempt = isAdminRoute || (!isSiteShutdown && (normalizedPath === "/" || normalizedPath === "/dashboard"));
  const isMaintenance = !isExempt && maintenancePages.includes(normalizedPath);
  const isBlocked = !isExempt && blockedPages.includes(normalizedPath) && !unlocked;

  return (
    <PresenceAndBlockContext.Provider value={{ blockedPages, maintenancePages, isSiteShutdown, isBlocked, isMaintenance }}>
      <AnimatePresence mode="wait">
        {shouldShutdown ? (
          <motion.div
            key="shutdown-404-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 bg-[#0a0d14] text-slate-200 font-sans select-none"
          >
            <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl">
              <div className="space-y-2">
                {shutdownConfig.errorCode && (
                  <div className="text-6xl font-black font-mono tracking-tight text-white font-sans">
                    {shutdownConfig.errorCode}
                  </div>
                )}
                <h1 className="text-lg font-bold text-slate-100">
                  {shutdownConfig.title || "Page Not Found"}
                </h1>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                {(shutdownConfig.message || "The requested URL {path} does not exist or has been moved.").replace("{path}", location.pathname)}
              </p>

              {shutdownConfig.showButton !== false && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="text-xs text-slate-300 border-white/10 bg-white/5 hover:bg-white/10 hover:text-white rounded-xl h-9 px-5"
                  >
                    {shutdownConfig.buttonText || "Go Back"}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        ) : isMaintenance ? (
          <motion.div
            key="maintenance-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md text-white overflow-hidden"
          >
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-violet-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="max-w-md w-full text-center space-y-5 p-6 rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-2xl shadow-2xl relative"
            >
              <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Wrench className="h-7 w-7 text-amber-400 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Tool Under Maintenance
                </h2>
                <p className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                  ROUTINE DATA UPDATE IN PROGRESS
                </p>
              </div>

              <div className="border border-white/5 bg-white/[0.02] p-4 rounded-2xl text-xs text-muted-foreground leading-relaxed space-y-2 text-left">
                <p>
                  We are currently updating seat matrix algorithms, cutoff statistics, or deploying platform improvements for this tool.
                </p>
                {unlocked && (
                  <p className="text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-[11px]">
                    ✓ Paid User Status: Active & Protected. Your unlocked access remains 100% saved and will automatically resume once maintenance completes!
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="w-full text-slate-300 hover:text-white hover:bg-white/5 text-xs h-9 rounded-xl border border-white/10"
                >
                  <Home className="h-3.5 w-3.5 mr-1.5" /> Homepage
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/dashboard")}
                  className="w-full text-slate-300 hover:text-white hover:bg-white/5 text-xs h-9 rounded-xl border border-white/10"
                >
                  Dashboard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : isBlocked ? (
          <motion.div
            key="blocked-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md text-white overflow-hidden"
          >
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="max-w-md w-full text-center space-y-5 p-6 rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-2xl shadow-2xl relative"
            >
              {success ? (
                <div className="space-y-4 py-8 animate-pulse">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-400">Successfully Unlocked!</h3>
                  <p className="text-sm text-slate-400">Enjoy full premium access to this feature.</p>
                </div>
              ) : (
                <>
                  {/* Lock/Crown Icon Container */}
                  <div className="mx-auto w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Crown className="h-7 w-7 text-indigo-400" />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Unlock Premium Features
                    </h2>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                      KCET & COMEDK COUNSELING SUITE
                    </p>
                  </div>

                  {/* Scrollable Note Container */}
                  <div className="border border-white/5 bg-white/[0.01] p-4 rounded-2xl max-h-48 overflow-y-auto text-left space-y-3 pr-2 text-xs text-muted-foreground leading-relaxed custom-scrollbar">
                    <div className="font-bold text-white">Note from the Developer</div>
                    <p>
                      Due to high user traffic, nominal contributions help cover ongoing server infrastructure and maintenance costs to keep these counseling tools running efficiently.
                    </p>
                    <p>
                      A small contribution (suggested <span className="text-emerald-400 font-semibold">₹19</span>, minimum <span className="text-emerald-400 font-semibold">₹5</span>) grants full site-wide access to all premium tools.
                    </p>
                    
                    <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-xs space-y-1.5 mt-2">
                      <div className="font-bold text-white">Need free access?</div>
                      <p className="text-muted-foreground">
                        If you prefer not to pay or cannot afford to contribute, you can request a <span className="text-white font-semibold">100% free access code</span>. Simply reach out via our{" "}
                        <a href="https://discord.gg/QZcjtJKjYJ" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 font-semibold underline transition-colors">
                          Discord
                        </a>{" "}
                        or{" "}
                        <a href="https://www.reddit.com/user/Elegant_Compote9073/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-semibold underline transition-colors">
                          Reddit
                        </a>{" "}
                        and I will gladly share one with you. We understand student budgets and truly never wanted to place a financial burden on anyone, so please feel entirely comfortable requesting a free access code without hesitation.
                      </p>
                    </div>
                  </div>

                  {/* Live Donation counter row */}
                  <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/10 px-4 py-3 rounded-2xl text-xs">
                    <div className="flex items-center text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <span className="relative flex h-2 w-2 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      Total Contributions Received
                    </div>
                    <div className="font-extrabold text-white text-sm">
                      ₹{totalAmount}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Amount Input */}
                    <div className="text-left space-y-1.5">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Your Contribution (Min ₹5)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-semibold text-xs">
                          ₹
                        </span>
                        <Input
                          type="number"
                          min={5}
                          value={amount === 0 ? "" : amount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setAmount(isNaN(val) ? 0 : val);
                          }}
                          className="pl-7 bg-slate-950/40 border-white/10 h-10 text-xs text-white focus:border-indigo-500/50 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Pay Button */}
                    <Button
                      onClick={handlePayment}
                      disabled={isPaying || amount < 5}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all h-10 text-xs shadow-lg shadow-indigo-500/20 rounded-xl flex items-center justify-center gap-2"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <Lock className="h-3.5 w-3.5 shrink-0" />
                          Pay ₹{amount} to Unlock Everything
                        </>
                      )}
                    </Button>

                    {/* Access Key Section */}
                    {showKeyForm ? (
                      <form onSubmit={handleKeySubmit} className="space-y-2 text-left bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Enter access code"
                            value={accessKey}
                            onChange={(e) => setAccessKey(e.target.value)}
                            className="bg-black/40 border-white/10 h-8 text-xs text-white rounded-lg"
                          />
                          <Button
                            type="submit"
                            disabled={loading}
                            className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3 rounded-lg"
                          >
                            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Verify"}
                          </Button>
                        </div>
                        {errorMsg && (
                          <p className="text-[10px] text-rose-400 font-semibold">{errorMsg}</p>
                        )}
                      </form>
                    ) : (
                      <button
                        onClick={() => setShowKeyForm(true)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mx-auto transition-colors"
                      >
                        <Key className="h-3.5 w-3.5" /> Have an access key? Unlock here
                      </button>
                    )}
                  </div>

                  {errorMsg && !showKeyForm && (
                    <p className="text-[10px] text-rose-400 font-semibold">{errorMsg}</p>
                  )}

                  {/* Navigation Footer Row */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/")}
                      className="w-full text-slate-400 hover:text-white hover:bg-white/5 text-xs h-9 rounded-xl border border-white/5"
                    >
                      Homepage
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate("/dashboard")}
                      className="w-full text-slate-400 hover:text-white hover:bg-white/5 text-xs h-9 rounded-xl border border-white/5"
                    >
                      Dashboard
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        ) : (
          children
        )}
      </AnimatePresence>
    </PresenceAndBlockContext.Provider>
  );
}

export function usePresenceAndBlock() {
  const context = useContext(PresenceAndBlockContext);
  if (!context) {
    throw new Error("usePresenceAndBlock must be used within PresenceAndBlockProvider");
  }
  return context;
}

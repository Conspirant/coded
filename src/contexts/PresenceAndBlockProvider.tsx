import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSuggestionsService } from "@/lib/admin-suggestions-service";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Home, ArrowLeft, Crown, Key, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isUnlocked, subscribeToUnlockState, initiatePremiumPayment, verifyAndUnlockAccessKey } from "@/lib/unlock";

interface PresenceAndBlockContextValue {
  blockedPages: string[];
  isBlocked: boolean;
}

const PresenceAndBlockContext = createContext<PresenceAndBlockContextValue | undefined>(undefined);

export function PresenceAndBlockProvider({ children }: { children: React.ReactNode }) {
  const [blockedPages, setBlockedPages] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState(isUnlocked());
  const [accessKey, setAccessKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showKeyForm, setShowKeyForm] = useState(false);
  
  const location = useLocation();
  const presenceChannelRef = useRef<any>(null);

  // Listen to global unlock state transitions
  useEffect(() => {
    return subscribeToUnlockState((isUnlockedVal) => {
      setUnlocked(isUnlockedVal);
    });
  }, []);

  // 1. Fetch blocked pages on mount & subscribe to real-time configuration changes
  useEffect(() => {
    const fetchBlocked = async () => {
      const paths = await AdminSuggestionsService.getBlockedPages();
      setBlockedPages(paths);
    };

    fetchBlocked();

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
      .subscribe();

    return () => {
      dbChannel.unsubscribe();
    };
  }, []);

  // 2. Track real-time presence including current page path
  useEffect(() => {
    let sessionId = sessionStorage.getItem("presence_user_session_id");
    if (!sessionId) {
      sessionId = `USER:${Math.random().toString(36).substring(2, 10)}`;
      sessionStorage.setItem("presence_user_session_id", sessionId);
    }

    const channel = supabase.channel("global-alerts");
    presenceChannelRef.current = channel;

    channel.subscribe((status) => {
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
    setIsPaying(true);
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
      }
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
  // Admin page should never be blocked, home page shouldn't either. Also bypassed if already unlocked.
  const isBlocked = blockedPages.includes(currentPath) && currentPath !== "/admin" && currentPath !== "/" && !unlocked;

  return (
    <PresenceAndBlockContext.Provider value={{ blockedPages, isBlocked }}>
      <AnimatePresence mode="wait">
        {isBlocked ? (
          <motion.div
            key="blocked-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 bg-slate-950 text-white overflow-hidden"
          >
            {/* Ambient background glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative"
            >
              {success ? (
                <div className="space-y-4 py-8">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Check className="h-8 w-8 text-emerald-400 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-400">Successfully Unlocked!</h3>
                  <p className="text-sm text-slate-400">Enjoy full premium access to this feature.</p>
                </div>
              ) : (
                <>
                  {/* Lock/Crown Icon Container */}
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                    <Crown className="h-8 w-8 text-indigo-400 animate-pulse" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl font-extrabold tracking-tight text-white bg-gradient-to-r from-indigo-200 to-purple-300 bg-clip-text text-transparent">
                      Unlock Premium Feature
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Access to this tool is reserved for Premium users. Unlock all advanced counseling simulators instantly.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Unlock via Payment */}
                    <Button
                      onClick={handlePayment}
                      disabled={isPaying}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all h-10 text-xs shadow-lg shadow-indigo-500/20"
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        "Unlock Instantly — ₹19"
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
                            className="bg-black/40 border-white/10 h-8 text-xs text-white"
                          />
                          <Button
                            type="submit"
                            disabled={loading}
                            className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border border-white/10 px-3"
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
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mx-auto transition-colors"
                      >
                        <Key className="h-3.5 w-3.5" /> Have an access key? Unlock here
                      </button>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => (window.location.href = "/")}
                      className="w-full text-slate-400 hover:text-white text-xs h-9"
                    >
                      <Home className="mr-2 h-4 w-4" /> Go to Homepage
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

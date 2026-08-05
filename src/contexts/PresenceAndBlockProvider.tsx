import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSuggestionsService } from "@/lib/admin-suggestions-service";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PresenceAndBlockContextValue {
  blockedPages: string[];
  isBlocked: boolean;
}

const PresenceAndBlockContext = createContext<PresenceAndBlockContextValue | undefined>(undefined);

export function PresenceAndBlockProvider({ children }: { children: React.ReactNode }) {
  const [blockedPages, setBlockedPages] = useState<string[]>([]);
  const location = useLocation();
  const presenceChannelRef = useRef<any>(null);

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
    // Generate or retrieve a persistent anonymous user session identifier
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

  const currentPath = location.pathname;
  // Admin page should never be blocked, home page shouldn't either
  const isBlocked = blockedPages.includes(currentPath) && currentPath !== "/admin" && currentPath !== "/";

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
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative"
            >
              {/* Shield Icon Container */}
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-amber-500/20 border border-red-500/30 flex items-center justify-center shadow-lg shadow-red-500/10">
                <ShieldAlert className="h-8 w-8 text-red-500 animate-pulse" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-white bg-gradient-to-r from-red-400 to-amber-300 bg-clip-text text-transparent">
                  Access Restricted
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  This page has been temporarily locked or disabled by the system administrator. It will be back online shortly.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Home className="mr-2 h-4 w-4" /> Go back Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => window.history.back()}
                  className="w-full border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous Page
                </Button>
              </div>
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

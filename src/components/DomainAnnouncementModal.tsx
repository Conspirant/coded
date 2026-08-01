import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Sparkles, X, Heart, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DomainAnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed this announcement
    const dismissed = localStorage.getItem("kcetcoded_domain_announcement_v1") === "true";
    if (!dismissed) {
      // Small delay for smooth pop-in after page load
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("kcetcoded_domain_announcement_v1", "true");
    setIsOpen(false);
  };

  const handleVisitDomain = () => {
    localStorage.setItem("kcetcoded_domain_announcement_v1", "true");
    setIsOpen(false);
    if (window.location.hostname !== "kcetcoded.dev") {
      window.open("https://kcetcoded.dev", "_blank", "noopener,noreferrer");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-indigo-500/20 bg-slate-950/90 p-6 sm:p-8 shadow-[0_0_60px_-15px_rgba(99,102,241,0.25)] backdrop-blur-2xl z-10"
          >
            {/* Ambient Background Glows */}
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/15 transition-all"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Top Pill & Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
                <Globe className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
                <span>Official Domain Release</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Welcome to</span>
                  <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                    kcetcoded.dev
                  </span>
                  <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Next-Generation KCET & COMEDK Counseling & Analytics Platform
                </p>
              </div>
            </div>

            {/* Message Body */}
            <div className="mt-5 space-y-3.5 text-sm text-slate-300 leading-relaxed font-normal">
              <p>
                We are proud to formally announce that our official domain is now live at{" "}
                <strong className="text-indigo-300 font-semibold underline decoration-indigo-500/40 underline-offset-4">
                  kcetcoded.dev
                </strong>
                .
              </p>
              <p>
                We extend our deepest gratitude to our community members and donors. Your generous support has enabled us to upgrade high-performance database resources and maintain seamless server infrastructure.
              </p>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>100% Free & Unlocked Access</span>
                </div>
                <p className="text-xs text-slate-300 leading-normal">
                  To celebrate this milestone, <strong className="text-white">all premium features</strong> (College Predictor, Cutoff Explorer, Mock Simulator, and Rank Predictor) are completely free for everyone for a limited period.
                </p>
              </div>
              <p className="text-xs text-slate-400 italic">
                Sustaining high-volume analytics servers requires continuous infrastructure support. We sincerely appreciate any ongoing contributions to help keep this platform fast and free.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <Button
                onClick={handleVisitDomain}
                className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-indigo-500/20 rounded-xl h-11 transition-all flex items-center justify-center gap-2"
              >
                <span>Visit kcetcoded.dev</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={handleClose}
                className="w-full sm:w-auto text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-11 px-5"
              >
                Explore Platform
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

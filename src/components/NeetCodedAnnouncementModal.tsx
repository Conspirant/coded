import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, X, ArrowRight, CheckCircle2, Bell, Compass, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const NeetCodedAnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notified, setNotified] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const dismissed = localStorage.getItem("kcetcoded_neet_announcement_v1") === "true";
    if (!dismissed) {
      const timer = setTimeout(() => setIsOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Keyboard accessibility: Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem("kcetcoded_neet_announcement_v1", "true");
    setIsOpen(false);
  };

  const handleNotifyMe = () => {
    localStorage.setItem("kcetcoded_neet_announcement_v1", "true");
    setNotified(true);
    toast({
      title: "You're on the list!",
      description: "We will notify you as soon as NEET Coded launches.",
    });
    setTimeout(() => {
      setIsOpen(false);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="neet-modal-title"
          aria-describedby="neet-modal-description"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-500/20 bg-zinc-950 p-6 text-zinc-100 shadow-2xl z-10 space-y-4"
          >
            {/* Header Area */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h2 id="neet-modal-title" className="text-xl font-bold tracking-tight text-white leading-snug">
                    NEET Coded is Coming
                  </h2>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">
                    Built based on student requests
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors shrink-0"
                aria-label="Close announcement"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description Body */}
            <div id="neet-modal-description" className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <p>
                We received multiple requests from students asking for a NEET version of Coded. We're now building it with the same fast rank predictors, clean cutoffs, and counseling tools you use for KCET & COMEDK.
              </p>

              {/* Highlights */}
              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60">
                  <Award className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-100">Rank & College Predictors</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Cutoff matching for All India Quota (AIQ) & State MBBS/BDS counseling.</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/60">
                  <Compass className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-100">Cutoff Trends</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Round-wise opening and closing ranks for medical colleges.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <p className="text-xs text-zinc-300 font-medium">
                  Clean interface and transparent data.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-1">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg h-9 px-4 text-xs font-medium transition-colors"
              >
                Dismiss
              </Button>
              <Button
                onClick={handleNotifyMe}
                disabled={notified}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg h-9 px-4 text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-950/40"
              >
                {notified ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    <span>You're on the list</span>
                  </>
                ) : (
                  <>
                    <Bell className="h-3.5 w-3.5" />
                    <span>Notify Me When Live</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-80" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

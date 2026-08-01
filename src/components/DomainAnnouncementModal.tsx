import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DomainAnnouncementModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("kcetcoded_domain_announcement_v1") === "true";
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          {/* Minimalist Dark Backdrop */}
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
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-7 text-zinc-100 shadow-2xl z-10"
          >
            {/* Accessible Dismiss / Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close announcement"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header / Badge */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 text-xs font-medium tracking-wide">
                <Globe className="h-3.5 w-3.5 text-zinc-400" />
                <span>Domain Announcement</span>
              </div>

              <div className="space-y-1 pr-8">
                <h2 id="modal-title" className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Official Domain: kcetcoded.dev
                </h2>
                <p className="text-xs text-zinc-400 font-medium">
                  KCET & COMEDK Counseling Platform
                </p>
              </div>
            </div>

            {/* Concise & Professional Body */}
            <div id="modal-description" className="mt-4 space-y-3 text-sm text-zinc-300 leading-relaxed">
              <p>
                We have officially migrated our platform to{" "}
                <strong className="text-white font-medium underline decoration-zinc-700 underline-offset-4">
                  kcetcoded.dev
                </strong>
                .
              </p>
              <p>
                Thank you to our supporters and donors. Your contributions directly help cover our server hosting and database infrastructure costs.
              </p>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3.5 space-y-1">
                <div className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
                  Temporary Free Access
                </div>
                <p className="text-xs text-zinc-300 leading-normal">
                  To mark this transition, all tools—including College Predictor, Cutoff Explorer, Mock Simulator, and Rank Predictor—are unlocked for all users for a limited period.
                </p>
              </div>
              <p className="text-xs text-zinc-400">
                Continued community support helps us sustain server operations and keep high-volume analytics resources running smoothly.
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg h-10 px-4 text-sm font-medium transition-colors"
              >
                Dismiss
              </Button>
              <Button
                onClick={handleVisitDomain}
                className="w-full sm:w-auto bg-white hover:bg-zinc-200 text-zinc-950 font-medium rounded-lg h-10 px-4 text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>Visit kcetcoded.dev</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

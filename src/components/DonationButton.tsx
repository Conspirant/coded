import { useState, useEffect } from 'react';
import { Heart, X, Coffee, Sparkles, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { isUnlocked } from '@/lib/unlock';

export const DonationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [hasSeenPrompt, setHasSeenPrompt] = useState(false);
  const location = useLocation();

  // Hide the FAB on the donate page itself (redundant there)
  const isDonatePage = location.pathname === '/donate';

  // Auto-trigger polite popup after 5 seconds if not paid and not already dismissed
  useEffect(() => {
    if (isUnlocked()) return;

    const alreadyDismissed = localStorage.getItem('donation-popup-dismissed-2026') === 'true';
    if (alreadyDismissed) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      setShowPulse(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Show a gentle nudge pulse after 60 seconds on site (once per session)
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('donation-prompt-seen');
    if (alreadySeen) {
      setHasSeenPrompt(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!alreadySeen) {
        setShowPulse(true);
      }
    }, 60000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setShowPulse(false);
    if (!hasSeenPrompt) {
      sessionStorage.setItem('donation-prompt-seen', 'true');
      setHasSeenPrompt(true);
    }
  };

  const handleClose = () => {
    localStorage.setItem('donation-popup-dismissed-2026', 'true');
    setIsOpen(false);
  };

  if (isDonatePage) return null;

  return (
    <>
      {/* Floating Action Button — positioned higher on mobile to avoid the mobile dock + FAB */}
      <motion.button
        onClick={handleOpen}
        className="fixed bottom-20 md:bottom-8 right-4 z-[90] group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Support this project"
        id="donation-fab"
      >
        {/* Pulse ring animation */}
        {showPulse && (
          <motion.span
            className="absolute inset-0 rounded-full bg-pink-500/20"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}

        {/* Glow effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 opacity-60 blur-lg group-hover:opacity-80 transition-opacity" />

        {/* Button body */}
        <span className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 shadow-lg shadow-pink-500/25 border border-white/20">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
        </span>

        {/* Tooltip — hidden on mobile (no hover) */}
        <span className="hidden md:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-sm text-xs text-white/90 border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          Support Coded ❤️
        </span>
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content — bottom sheet on mobile, centered on desktop */}
            <motion.div
              className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-t-2xl sm:rounded-2xl border border-white/10 bg-gradient-to-b from-[hsl(222,47%,8%)] to-[hsl(222,47%,5%)] shadow-2xl shadow-pink-500/5"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Top decorative gradient bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-t-2xl" />

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 p-2 sm:p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all duration-200"
                aria-label="Close donation dialog"
                id="donation-close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Content */}
              <div className="relative p-6 text-center space-y-6 pt-10">
                {/* Title */}
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  Support Coded
                </h3>

                {/* Message */}
                <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
                  Coded is free, ad-free, and open to all.
                  If the platform has helped you, consider making a small donation to help cover our hosting costs.
                </p>

                <div className="border border-white/10 bg-slate-900/50 rounded-xl p-3.5 flex flex-col items-center justify-center space-y-1 relative overflow-hidden">
                  <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    amount received by people till now
                  </div>
                  <div className="text-xl font-bold text-white font-mono">₹78</div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                  <Link to="/donate" onClick={handleClose}>
                    <button className="w-full py-2.5 px-4 rounded-xl bg-white text-black hover:bg-white/90 font-bold flex items-center justify-center gap-2 transition-all duration-200 text-sm">
                      Donate Online
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    onClick={handleClose}
                    className="w-full py-2 px-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/10 font-semibold text-white/60 hover:text-white transition-all duration-200 text-xs"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>

              {/* Bottom sheen */}
              <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

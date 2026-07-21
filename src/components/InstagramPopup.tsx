import { useState, useEffect } from 'react';
import { Instagram, X, Sparkles, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const InstagramPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const alreadyDismissed = localStorage.getItem('instagram-popup-dismissed-2026') === 'true';
    if (alreadyDismissed) return;

    // Trigger popup after 2.5 seconds on page load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem('instagram-popup-dismissed-2026', 'true');
    setIsOpen(false);
  };

  const handleFollowClick = () => {
    localStorage.setItem('instagram-popup-dismissed-2026', 'true');
    setIsOpen(false);
    window.open('https://www.instagram.com/kcet.coded/', '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal Box */}
          <motion.div
            className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-slate-950/95 text-white shadow-2xl p-6 sm:p-7 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Instagram-themed decorative gradient bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 rounded-t-2xl" />

            {/* Glowing lights behind content */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1.5 rounded-full border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all z-20"
              aria-label="Close instagram announcement"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-5 pt-4">
              {/* Instagram Icon Container */}
              <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-500 shadow-xl shadow-pink-500/20 text-white border border-white/20">
                <Instagram className="w-8 h-8 stroke-[1.75]" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
              </div>

              {/* Title & Badge */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-pink-500/20 bg-pink-500/10 text-[10px] font-bold tracking-wider text-pink-400 uppercase">
                  <Sparkles className="h-3 w-3 animate-pulse" /> Community Update
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white/95 pt-1">
                  We are now on Instagram!
                </h3>
              </div>

              {/* Message */}
              <div className="space-y-3 text-sm text-slate-300 leading-relaxed text-left max-w-sm">
                <p>
                  We are super excited to launch our official Instagram handle <strong className="text-pink-400">@kcet.coded</strong>! 
                </p>
                <p>
                  Follow us to get real-time alerts on KCET & COMEDK, option entry masterclasses, cutoff statistics, college reviews, and campus life updates directly on your feed.
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  We strive to keep Coded completely free and ad-free. If our tools have helped you predict your rank, compare colleges, or plan your journey, please show some support by giving us a follow! It would mean the world to us. ❤️
                </p>
              </div>

              {/* Action Buttons */}
              <div className="w-full pt-2 space-y-2">
                <button
                  onClick={handleFollowClick}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 hover:from-purple-700 hover:via-pink-600 hover:to-amber-600 text-white font-extrabold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-pink-500/25 text-sm active:scale-[0.98]"
                >
                  Follow @kcet.coded
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-2 px-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/10 font-semibold text-slate-400 hover:text-white transition-all duration-200 text-xs"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

import { useState, useEffect } from 'react';
import { Heart, X, Coffee, Sparkles, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

export const DonationButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [hasSeenPrompt, setHasSeenPrompt] = useState(false);
  const location = useLocation();

  // Hide the FAB on the donate page itself (redundant there)
  const isDonatePage = location.pathname === '/donate';

  // Show a gentle nudge after 60 seconds on site (once per session)
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
              {/* Mobile drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Top decorative gradient bar */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-t-2xl" />

              {/* Decorative background blobs */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

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
              <div className="relative p-5 sm:p-6 pt-4 sm:pt-8 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-amber-500 rounded-full blur-xl opacity-30 animate-pulse" />
                    <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center">
                      <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-pink-400" />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Support Coded
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h3>

                {/* Message */}
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 sm:mb-6 max-w-sm mx-auto">
                  Coded is built with dedication and made available completely free of charge.
                  While hosting and infrastructure are currently free-tier, they come with limitations.
                  Your generous contribution helps us keep the platform running smoothly and motivates
                  continued development. Every donation, no matter how small, is deeply appreciated.
                </p>

                {/* QR Code */}
                <div className="relative inline-block mb-4 sm:mb-5">
                  {/* Glow behind QR */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-amber-500/20 rounded-2xl blur-xl" />

                  <div className="relative p-3 sm:p-4 bg-white rounded-2xl shadow-lg shadow-black/20 border border-white/20">
                    <img
                      src="/images/donate-qr.png"
                      alt="UPI QR Code for donations"
                      className="w-40 h-40 sm:w-48 sm:h-48 object-contain mx-auto"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Scan instruction */}
                <p className="text-[11px] sm:text-xs text-white/40 mb-1">
                  Scan with any UPI app to donate
                </p>
                <p className="text-[10px] sm:text-[11px] text-white/25 mb-4 sm:mb-5">
                  Google Pay • PhonePe • Paytm • BHIM
                </p>

                {/* Thank you note */}
                <div className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 shrink-0" />
                  <p className="text-[11px] sm:text-xs text-white/50">
                    Thank you for supporting the time and effort behind Coded!
                  </p>
                </div>

                {/* Learn more link */}
                <Link
                  to="/donate"
                  onClick={handleClose}
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-pink-400 hover:text-pink-300 transition-colors"
                >
                  Learn why your support matters <ArrowRight className="w-3 h-3" />
                </Link>
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

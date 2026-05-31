import { useState, useEffect } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const ThankYouBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already dismissed the thank you note
    const dismissed = localStorage.getItem('kcet_thank_you_dismissed') === 'true';
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('kcet_thank_you_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative w-full overflow-hidden rounded-2xl border border-emerald-500/20 bg-slate-950/80 backdrop-blur-2xl shadow-2xl p-5 mb-6 before:absolute before:inset-0 before:bg-gradient-to-r before:from-emerald-500/10 before:via-teal-500/5 before:to-indigo-500/10 before:pointer-events-none"
        >
          {/* Decorative corner glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            {/* Pulsing Icon Wrapper */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 shrink-0 mt-0.5 shadow-lg shadow-emerald-500/5 animate-pulse">
              <Heart className="h-5 w-5 text-emerald-400 fill-emerald-400" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                  Thank You for Your Support!
                  <Sparkles className="h-4 w-4 text-amber-400 animate-spin-slow" />
                </h4>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
                  Fully Unlocked
                </span>
              </div>
              
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                To show our gratitude to our amazing community, we have <strong className="text-emerald-400">completely unlocked</strong> all premium features of the website for everyone! 
                We sincerely thank you for showing interest, sharing your feedback, and supporting this project. 
                Enjoy the usage of the College Predictor, AI Counselor, Cutoff Explorer, and more without any limits. We hope this helps you secure your dream seat! ✨
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-lg border border-white/5 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all shrink-0 self-start sm:self-center"
              aria-label="Dismiss message"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom animated border sheen */}
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

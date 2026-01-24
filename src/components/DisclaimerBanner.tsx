import { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const DisclaimerBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] max-w-md w-[calc(100%-2rem)]">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl p-4 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:to-purple-500/10 before:pointer-events-none"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0 mt-0.5">
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white/90">Verification Required</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This tool uses historical data for reference only. Actual allotments may vary. Please verify all information with official KEA/CET Cell documents before decision making.
                </p>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-white transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Animated sheen effect */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

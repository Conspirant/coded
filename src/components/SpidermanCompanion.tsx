import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Compass, ArrowRight, RefreshCw, X, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SpidermanCompanionProps {
  userRank?: number;
  userCategory?: string;
}

const SPIDEY_QUOTES = [
  {
    quote: "You have to be greater than what you suffer. Keep your head high — your college journey is just beginning.",
    context: "Andrew's Peter Parker • TASM 2",
    tip: "Pro Tip: Enter at least 40+ choices in KEA option entry to ensure a safe landing."
  },
  {
    quote: "Secrets have a cost, they're not free. But our 4-year cutoff analytics? Completely open for you.",
    context: "Peter Parker • TASM",
    tip: "Pro Tip: Compare both Round 1 & Round 2 cutoffs before locking your choice sequence."
  },
  {
    quote: "I like to think Spider-Man gives people hope. We're gonna get you into the best engineering branch possible.",
    context: "Your Friendly Neighborhood Guide",
    tip: "Pro Tip: Even a 500-rank drift in Round 2 can unlock top branches at BMSCE, MSRIT, or DSCE."
  },
  {
    quote: "With great CET rank comes great responsibility. Don't put a lower college above your dream college!",
    context: "Spidey's Law of Option Entry",
    tip: "Critical: If KEA allots you choice #10, all choices below #10 get deleted automatically."
  },
  {
    quote: "Every day I wake up knowing that no matter how tough it gets, you never give up on the final round.",
    context: "Peter Parker • TASM 2",
    tip: "Pro Tip: Extended Round is where COMEDK surrenders create surprise seat vacancies."
  },
  {
    quote: "You're in great shape, kid. Just keep your focus sharp and your study certificates verified.",
    context: "Peter Parker",
    tip: "Pro Tip: Ensure your Rural (1R-3BR) or Kannada medium certificates have proper BEO seals."
  }
];

export const SpidermanCompanion: React.FC<SpidermanCompanionProps> = ({ userRank, userCategory }) => {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isSquinting, setIsSquinting] = useState(false);
  const [spideySenseActive, setSpideySenseActive] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [webShot, setWebShot] = useState(false);

  const current = SPIDEY_QUOTES[quoteIndex];

  const handleNextQuote = () => {
    setWebShot(true);
    setSpideySenseActive(true);
    setIsSquinting(true);
    setTimeout(() => setWebShot(false), 600);
    setTimeout(() => setIsSquinting(false), 400);
    setTimeout(() => setSpideySenseActive(false), 1200);
    setQuoteIndex((prev) => (prev + 1) % SPIDEY_QUOTES.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-500/25 bg-gradient-to-br from-slate-950 via-slate-900/90 to-red-950/30 p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Spider-Web Hexagonal Background Grid Texture */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(239, 68, 68, 0.4) 1px, transparent 0)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Spidey Sense Ambient Glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-red-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl" />

      {/* Web Line Hanging from Top */}
      <div className="absolute top-0 left-8 sm:left-12 h-6 w-0.5 bg-gradient-to-b from-white/60 to-transparent" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left Side: Avatar & Interactive Mask */}
        <div className="flex items-center gap-4.5">
          {/* TASM2 Spider-Man Interactive Mask Avatar */}
          <div 
            onClick={handleNextQuote}
            onMouseEnter={() => setIsSquinting(true)}
            onMouseLeave={() => setIsSquinting(false)}
            className="group relative cursor-pointer select-none shrink-0"
            title="Click to activate Spidey Sense & get advice!"
          >
            {/* Spidey Sense Tingles Effect */}
            <AnimatePresence>
              {spideySenseActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.25 }}
                  exit={{ opacity: 0, scale: 1.5 }}
                  className="absolute -inset-2.5 rounded-full border-2 border-dashed border-red-500 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              )}
            </AnimatePresence>

            {/* Glowing Mask Frame */}
            <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-blue-900 p-0.5 shadow-lg shadow-red-600/30 transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              <div className="relative flex h-full w-full items-center justify-center rounded-[14px] bg-gradient-to-b from-red-950 via-slate-950 to-blue-950 overflow-hidden border border-red-500/40">
                {/* Honeycomb Web Pattern Overlay */}
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 6px)`
                  }}
                />

                {/* TASM2 Styled Spider-Man Mask Graphic */}
                <svg
                  viewBox="0 0 100 100"
                  className="h-14 w-14 sm:h-16 sm:w-16 drop-shadow-[0_2px_8px_rgba(239,68,68,0.5)] transition-all duration-300"
                >
                  {/* Mask Base Contour */}
                  <path
                    d="M 50 10 C 26 10 18 28 18 52 C 18 76 34 92 50 92 C 66 92 82 76 82 52 C 82 28 74 10 50 10 Z"
                    fill="url(#suitGradient)"
                    stroke="#b91c1c"
                    strokeWidth="2"
                  />

                  {/* Web Pattern Lines on Mask */}
                  <path d="M 50 10 L 50 92" stroke="#450a0a" strokeWidth="1" opacity="0.6" />
                  <path d="M 18 52 L 82 52" stroke="#450a0a" strokeWidth="1" opacity="0.6" />
                  <path d="M 28 26 Q 50 40 72 26" stroke="#450a0a" strokeWidth="1" fill="none" opacity="0.6" />
                  <path d="M 22 45 Q 50 62 78 45" stroke="#450a0a" strokeWidth="1" fill="none" opacity="0.6" />
                  <path d="M 26 70 Q 50 82 74 70" stroke="#450a0a" strokeWidth="1" fill="none" opacity="0.6" />

                  {/* Left Eye Lens (Andrew Garfield Big Reflective Eyes) */}
                  <motion.path
                    d="M 26 40 C 32 32 44 38 46 54 C 44 64 34 68 28 62 C 24 54 22 46 26 40 Z"
                    fill="#f8fafc"
                    stroke="#09090b"
                    strokeWidth="3"
                    animate={{
                      scaleY: isSquinting ? 0.7 : 1,
                      scaleX: isSquinting ? 0.95 : 1
                    }}
                    transition={{ duration: 0.15 }}
                  />

                  {/* Right Eye Lens */}
                  <motion.path
                    d="M 74 40 C 68 32 56 38 54 54 C 56 64 66 68 72 62 C 76 54 78 46 74 40 Z"
                    fill="#f8fafc"
                    stroke="#09090b"
                    strokeWidth="3"
                    animate={{
                      scaleY: isSquinting ? 0.7 : 1,
                      scaleX: isSquinting ? 0.95 : 1
                    }}
                    transition={{ duration: 0.15 }}
                  />

                  {/* Eye Lens Inner Glow Shading */}
                  <path
                    d="M 29 44 C 34 38 41 42 43 52 C 40 58 34 60 30 56 Z"
                    fill="#e2e8f0"
                    opacity="0.8"
                  />
                  <path
                    d="M 71 44 C 66 38 59 42 57 52 C 60 58 66 60 70 56 Z"
                    fill="#e2e8f0"
                    opacity="0.8"
                  />

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="suitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#dc2626" />
                      <stop offset="60%" stopColor="#991b1b" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Web Sling Flash Effect */}
                {webShot && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    className="absolute inset-0 bg-white/40 rounded-full"
                  />
                )}
              </div>
            </div>

            {/* Live Status Indicator Pill */}
            <span className="absolute -bottom-1.5 -right-1.5 flex h-5 items-center gap-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white shadow-md border border-red-400/40">
              <Zap className="h-2.5 w-2.5 fill-white animate-pulse" />
              TASM
            </span>
          </div>

          {/* Titles & Context */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Counseling Ally • Spider-Man
              </span>
              <span className="rounded-md bg-blue-950/60 px-1.5 py-0.5 text-[10px] font-mono text-blue-300 border border-blue-500/30">
                Andrew Garfield Edition
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>"Your Friendly Neighborhood Guide"</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Click Spidey's mask for instant motivation & counseling wisdom.
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Pills */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <button
            type="button"
            onClick={handleNextQuote}
            className="flex-1 md:flex-initial h-8.5 px-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-red-950"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Next Quip / Tip</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/college-predictor")}
            className="flex-1 md:flex-initial h-8.5 px-3.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-red-600/30"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Web-Sling Predictor</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Quote & Practical Tip Bubble */}
      <div className="mt-4 pt-3.5 border-t border-red-500/20 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        <div className="md:col-span-8 bg-black/40 rounded-xl p-3 border border-white/5 space-y-1">
          <p className="text-xs sm:text-[13px] text-zinc-200 italic font-medium leading-relaxed">
            "{current.quote}"
          </p>
          <p className="text-[10px] text-red-400 font-mono font-semibold">
            — {current.context}
          </p>
        </div>

        <div className="md:col-span-4 bg-red-950/30 rounded-xl p-3 border border-red-500/20 space-y-0.5">
          <div className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Strategic Spidey Tip
          </div>
          <p className="text-[11px] text-zinc-300 leading-snug">
            {current.tip}
          </p>
        </div>
      </div>
    </div>
  );
};

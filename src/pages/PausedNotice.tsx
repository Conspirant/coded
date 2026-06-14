import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Heart, Users, ArrowRight, CheckCircle2, Sparkles, MessageSquare, Send } from "lucide-react";

// Generate or retrieve a persistent session ID
const getSessionId = (): string => {
  const KEY = "coded_session_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
};

const PausedNotice = () => {
  const [voteCount, setVoteCount] = useState<number>(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [justVoted, setJustVoted] = useState(false);
  const [recentVoters, setRecentVoters] = useState<number>(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const particleId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if user already voted
  useEffect(() => {
    const voted = localStorage.getItem("coded_bring_it_back_voted");
    if (voted === "true") {
      setHasVoted(true);
    }
  }, []);

  // Fetch initial count and subscribe to real-time changes
  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("bring_it_back_votes" as any)
        .select("*", { count: "exact", head: true });

      if (!error && count !== null) {
        setVoteCount(count);
      }
    };

    fetchCount();

    // Subscribe to real-time inserts
    const channel = supabase
      .channel("bring_it_back_realtime")
      .on(
        "postgres_changes" as any,
        {
          event: "INSERT",
          schema: "public",
          table: "bring_it_back_votes",
        },
        () => {
          setVoteCount((prev) => prev + 1);
          setRecentVoters((prev) => prev + 1);
          // Reset recent voters indicator after 3s
          setTimeout(() => setRecentVoters((prev) => Math.max(0, prev - 1)), 3000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const spawnParticles = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newParticles = Array.from({ length: 12 }, () => ({
      id: particleId.current++,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);
  }, []);

  const handleVote = async (e: React.MouseEvent) => {
    if (hasVoted || isVoting) return;
    setIsVoting(true);
    spawnParticles(e);

    try {
      const sessionId = getSessionId();
      const payload: Record<string, any> = { session_id: sessionId };
      if (message.trim()) {
        payload.message = message.trim();
      }

      const { error } = await supabase
        .from("bring_it_back_votes" as any)
        .insert(payload as any);

      if (error) {
        // Duplicate vote (unique constraint on session_id)
        if (error.code === "23505") {
          setHasVoted(true);
          localStorage.setItem("coded_bring_it_back_voted", "true");
        } else {
          console.error("Vote error:", error);
        }
      } else {
        setHasVoted(true);
        setJustVoted(true);
        localStorage.setItem("coded_bring_it_back_voted", "true");
      }
    } catch (err) {
      console.error("Vote failed:", err);
    } finally {
      setIsVoting(false);
    }
  };

  const milestone = voteCount >= 500 ? 1000 : voteCount >= 200 ? 500 : voteCount >= 50 ? 200 : 50;
  const progress = Math.min((voteCount / milestone) * 100, 100);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0a0a0f] overflow-hidden flex flex-col items-center justify-center px-4 py-12"
    >
      {/* ═══ Ambient Background ═══ */}
      <div className="fixed inset-0 -z-10">
        {/* Deep radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Floating orbs */}
        <div className="absolute top-[20%] left-[10%] w-80 h-80 bg-indigo-600/[0.06] rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-[15%] right-[15%] w-96 h-96 bg-rose-500/[0.05] rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-[50%] left-[60%] w-64 h-64 bg-amber-500/[0.04] rounded-full blur-[80px] animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* ═══ Click Particles ═══ */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
            animate={{
              x: p.x + (Math.random() - 0.5) * 200,
              y: p.y - Math.random() * 150 - 50,
              scale: 0,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full pointer-events-none z-50"
            style={{
              background: `hsl(${Math.random() * 60 + 330}, 90%, 65%)`,
            }}
          />
        ))}
      </AnimatePresence>

      {/* ═══ Logo ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-3 mb-12"
      >
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent">
          KCET Coded
        </span>
      </motion.div>

      {/* ═══ Main Card ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative w-full max-w-2xl"
      >
        {/* Glow border effect */}
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-white/[0.08] via-indigo-500/[0.06] to-white/[0.03] -z-10" />
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-indigo-500/20 via-transparent to-rose-500/10 blur-sm -z-20" />

        <div className="rounded-3xl bg-[#111118]/90 backdrop-blur-2xl border border-white/[0.06] p-8 sm:p-12">
          {/* Status badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
              </span>
              <span className="text-sm font-semibold text-amber-300 tracking-wide">
                PROJECT PAUSED
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-white mb-5 leading-tight tracking-tight">
            We've hit{" "}
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              pause
            </span>
          </h1>

          {/* Explanation */}
          <p className="text-center text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-4">
            Due to a significant decline in active users, we've decided to{" "}
            <span className="text-white font-medium">temporarily pause</span> all operations of KCET Coded.
          </p>
          <p className="text-center text-slate-500 text-sm leading-relaxed max-w-md mx-auto mb-10">
            We built this with love for the KCET community. If you still need these tools — cutoff explorer, rank predictor, mock simulator, and everything else — let us know. Your voice matters.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <Heart className="h-4 w-4 text-rose-500/50" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ═══ Vote Section ═══ */}
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-2">
              Want KCET Coded back?
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              One click. No sign-up. Your support is anonymous.
            </p>

            {/* Optional message toggle */}
            {!hasVoted && (
              <div className="mb-5">
                <button
                  onClick={() => setShowMessage((prev) => !prev)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 mx-auto mb-3"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  {showMessage ? "Hide message" : "Add an optional message"}
                </button>
                <AnimatePresence>
                  {showMessage && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="relative max-w-sm mx-auto">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Why you need it back..."
                          maxLength={200}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 transition-all"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 tabular-nums">
                          {message.length}/200
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Vote Button */}
            <AnimatePresence mode="wait">
              {hasVoted ? (
                <motion.div
                  key="voted"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-3"
                >
                  <div className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-semibold text-sm">You've been counted!</span>
                  </div>
                  {justVoted && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xs text-slate-500"
                    >
                      Thank you for supporting KCET Coded 💛
                    </motion.p>
                  )}
                </motion.div>
              ) : (
                <motion.button
                  key="vote"
                  onClick={handleVote}
                  disabled={isVoting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 disabled:opacity-50 overflow-hidden"
                >
                  {/* Button gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500 rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 rounded-2xl overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                  {/* Shadow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-500/30 via-pink-500/30 to-indigo-500/30 rounded-2xl blur-lg -z-10 group-hover:blur-xl transition-all" />

                  <span className="relative z-10 flex items-center gap-3">
                    {isVoting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending your vote...
                      </>
                    ) : (
                      <>
                        <Heart className="h-5 w-5 fill-white" />
                        Yes, Bring It Back!
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ═══ Live Counter ═══ */}
          <div className="relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8">
            {/* Real-time glow dot */}
            {recentVoters > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute top-4 right-4 flex items-center gap-1.5"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[10px] font-medium text-emerald-400">LIVE</span>
              </motion.div>
            )}

            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Students Who Want It Back
              </span>
            </div>

            {/* Big number */}
            <motion.div
              key={voteCount}
              initial={{ scale: 1.15, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-center"
            >
              <span className="text-6xl sm:text-7xl font-black tabular-nums bg-gradient-to-b from-white via-white to-slate-400 bg-clip-text text-transparent">
                {voteCount.toLocaleString()}
              </span>
            </motion.div>

            {/* Progress bar */}
            <div className="mt-6 mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-medium text-slate-500">
                  Progress to {milestone} supporters
                </span>
                <span className="text-[11px] font-bold text-indigo-400 tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-indigo-500 relative"
                >
                  {/* Shimmer on bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2s_infinite]" />
                </motion.div>
              </div>
            </div>

            {/* Milestone indicators */}
            <div className="flex justify-between text-[10px] text-slate-600 font-medium mt-1">
              <span>0</span>
              <span className={voteCount >= milestone / 2 ? "text-indigo-400" : ""}>
                {Math.round(milestone / 2)}
              </span>
              <span className={voteCount >= milestone ? "text-emerald-400 font-bold" : ""}>
                {milestone} 🎯
              </span>
            </div>
          </div>

          {/* ═══ Milestone message ═══ */}
          {voteCount >= 50 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/15">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-300">
                  {voteCount >= 500
                    ? "🚀 Incredible! Revival is being seriously considered!"
                    : voteCount >= 200
                    ? "🔥 Amazing momentum! We're listening!"
                    : voteCount >= 100
                    ? "💪 Strong support! Keep it going!"
                    : "🌱 Growing! Share this with your KCET friends!"}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* ═══ Footer ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 text-center space-y-3"
      >
        <p className="text-xs text-slate-600">
          Built with ❤️ for the KCET community
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://www.reddit.com/r/KCETCoded/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-indigo-400 transition-colors"
          >
            r/KCETCoded
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://discord.gg/QZcjtJKjYJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-[#5865F2] transition-colors"
          >
            Discord
          </a>
        </div>
      </motion.div>

      {/* Shimmer keyframe via style tag */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default PausedNotice;

import { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Crown, Star, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Donor {
  id: string;
  display_name: string;
  amount_inr: number;
  is_anonymous: boolean;
  created_at: string;
}

// Predefined accent colors for donor cards
const ACCENT_COLORS = [
  'from-rose-500/20 to-pink-500/20 border-rose-500/20',
  'from-violet-500/20 to-purple-500/20 border-violet-500/20',
  'from-blue-500/20 to-cyan-500/20 border-blue-500/20',
  'from-emerald-500/20 to-teal-500/20 border-emerald-500/20',
  'from-amber-500/20 to-orange-500/20 border-amber-500/20',
  'from-indigo-500/20 to-blue-500/20 border-indigo-500/20',
  'from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/20',
  'from-sky-500/20 to-cyan-500/20 border-sky-500/20',
];

const TEXT_COLORS = [
  'text-rose-400',
  'text-violet-400',
  'text-blue-400',
  'text-emerald-400',
  'text-amber-400',
  'text-indigo-400',
  'text-fuchsia-400',
  'text-sky-400',
];

const AVATAR_GRADIENTS = [
  'from-rose-500 to-pink-600',
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-indigo-500 to-blue-600',
  'from-fuchsia-500 to-pink-600',
  'from-sky-500 to-cyan-600',
];

function getInitials(name: string): string {
  if (name === 'Anonymous' || !name) return '?';
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const MOCK_DONORS: Donor[] = [
  {
    id: "mock-1",
    display_name: "Yashas",
    amount_inr: 19,
    is_anonymous: false,
    created_at: new Date('2026-07-19T17:08:00').toISOString(),
  },
  {
    id: "mock-2",
    display_name: "Anonymous",
    amount_inr: 19,
    is_anonymous: true,
    created_at: new Date('2026-07-18T16:08:00').toISOString(),
  },
  {
    id: "mock-3",
    display_name: "Anonymous",
    amount_inr: 20,
    is_anonymous: true,
    created_at: new Date('2026-07-18T14:08:00').toISOString(),
  },
  {
    id: "mock-4",
    display_name: "Anonymous",
    amount_inr: 10,
    is_anonymous: true,
    created_at: new Date('2026-07-18T11:08:00').toISOString(),
  },
  {
    id: "mock-5",
    display_name: "Anonymous",
    amount_inr: 10,
    is_anonymous: true,
    created_at: new Date('2026-07-18T09:08:00').toISOString(),
  }
];

const Supporters = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('donors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setDonors(data);
        setTotalAmount(data.reduce((sum: number, d: Donor) => sum + Number(d.amount_inr), 0));
      } else {
        setDonors(MOCK_DONORS);
        setTotalAmount(78);
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
      setDonors(MOCK_DONORS);
      setTotalAmount(78);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Our Supporters — KCET Coded"
        description="Thank you to everyone who has supported KCET Coded with a donation. Your contributions keep this platform free, ad-free, and constantly improving."
        url="https://kcet-coded2.vercel.app/supporters"
        keywords="supporters KCET Coded, donors, donations wall"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-background to-emerald-950/20 pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-4xl mx-auto px-4 pt-12 pb-8 sm:pt-16 sm:pb-12 text-center">
          {/* Back link */}
          <Link
            to="/donate"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Donate
          </Link>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center mb-5"
          >
            <Heart className="h-7 w-7 text-pink-400 fill-pink-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3"
          >
            Our Supporters
            <Sparkles className="inline-block ml-2 h-6 w-6 text-amber-400" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed"
          >
            Every contribution, big or small, helps keep this platform free and ad-free for all students. Thank you for believing in this project.
          </motion.p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 mt-8"
          >
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono">₹{totalAmount || 78}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Total Raised</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono">{donors.length || '—'}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-1">Supporters</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Donors Grid */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 mt-3">Loading supporters...</p>
          </div>
        ) : donors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center mb-4">
              <Crown className="h-7 w-7 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-400 mb-2">Be the first supporter!</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Your name could be the first on this wall. Every contribution helps keep Coded running.
            </p>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              <Heart className="h-4 w-4" />
              Make a Donation
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {donors.map((donor, index) => {
                const colorIdx = index % ACCENT_COLORS.length;
                const displayName = donor.is_anonymous ? 'Anonymous' : donor.display_name;
                const initials = getInitials(displayName);

                return (
                  <motion.div
                    key={donor.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={`group relative bg-gradient-to-br ${ACCENT_COLORS[colorIdx]} border rounded-2xl p-5 hover:scale-[1.02] transition-all duration-300`}
                  >
                    {/* Top donor badge for first place */}
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 bg-amber-500 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-lg shadow-amber-500/30">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        TOP
                      </div>
                    )}

                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${AVATAR_GRADIENTS[colorIdx]} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                        {initials}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold text-sm ${donor.is_anonymous ? 'text-slate-400 italic' : 'text-white'} truncate`}>
                          {displayName}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {timeAgo(donor.created_at)}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className={`shrink-0 text-right`}>
                        <span className={`text-sm font-bold font-mono ${TEXT_COLORS[colorIdx]}`}>
                          ₹{Number(donor.amount_inr)}
                        </span>
                      </div>
                    </div>

                    {/* Subtle shine effect on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-white/0 via-white/[0.03] to-white/0 pointer-events-none" />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* CTA at bottom */}
        {donors.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 pt-8 border-t border-white/5"
          >
            <p className="text-sm text-slate-500 mb-4">Want to see your name here?</p>
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              <Heart className="h-4 w-4" />
              Support Coded
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Supporters;

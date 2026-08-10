import { useState, useEffect } from 'react';
import { SEO } from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Crown, Star, ArrowLeft, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DonationCertificateModal } from '@/components/DonationCertificateModal';

interface Donor {
  id: string;
  display_name: string;
  amount_inr: number;
  is_anonymous: boolean;
  created_at: string;
}

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

// Simple timeAgo formatter
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

const Supporters = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedDonorForCert, setSelectedDonorForCert] = useState<Donor | null>(null);

  // Find the top donor (highest amount_inr)
  const topDonor = donors.length > 0
    ? [...donors].reduce((max, d) => Number(d.amount_inr) > Number(max.amount_inr) ? d : max, donors[0])
    : null;

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

      const items: Donor[] = (data || []).map((d: any) => ({
        id: d.id,
        display_name: d.display_name || 'Anonymous',
        amount_inr: d.amount_inr || 0,
        is_anonymous: d.is_anonymous ?? false,
        created_at: d.created_at || new Date().toISOString(),
      }));

      setDonors(items);

      const dbTotal = items.reduce((sum, d) => sum + Number(d.amount_inr), 0);
      setTotalAmount(78 + dbTotal);
    } catch (err) {
      console.error('Error fetching donors:', err);
      setDonors([]);
      setTotalAmount(78);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-300 font-sans selection:bg-white/10">
      <SEO
        title="Supporters Wall — KCET Coded"
        description="A heartfelt thank you to all Karnataka students and parents supporting KCET Coded."
        url="https://kcetcoded.dev/supporters"
        keywords="KCET Coded supporters, donations, community"
      />

      <div className="max-w-xl mx-auto px-6 py-16">
        {/* Navigation */}
        <div className="mb-12">
          <Link
            to="/donate"
            className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors group"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Back to Donate
          </Link>
        </div>

        {/* Header Section */}
        <div className="space-y-3.5 mb-12">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
              <Heart className="h-3 w-3 text-pink-400 fill-pink-400" />
            </div>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">Support Wall</span>
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Our Supporters
          </h1>
          
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Thank you to the students and parents who contribute to keep this platform free, fast, and accessible to everyone.
          </p>

          {/* Stats Bar */}
          <div className="flex items-center gap-6 pt-2">
            <div>
              <div className="text-xl font-bold text-white font-mono">₹{totalAmount}</div>
              <div className="text-[9px] tracking-wider uppercase text-slate-500 font-medium mt-0.5">Total Raised</div>
            </div>
            <div className="w-px h-6 bg-white/10" />
            <div>
              <div className="text-xl font-bold text-white font-mono">{donors.length}</div>
              <div className="text-[9px] tracking-wider uppercase text-slate-500 font-medium mt-0.5">Supporters</div>
            </div>
          </div>
        </div>

        {/* Top Supporter Section (Minimalist) */}
        {!loading && topDonor && Number(topDonor.amount_inr) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 border border-amber-500/20 bg-amber-500/[0.03] rounded-xl flex items-center justify-between group/top hover:border-amber-500/30 hover:bg-amber-500/[0.05] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover/top:scale-105 transition-transform duration-300">
                <Crown className="h-4 w-4 fill-amber-400/10" />
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-widest font-semibold text-amber-500/80 block">Top Supporter</span>
                <span className={`text-xs font-medium ${topDonor.is_anonymous ? 'text-slate-400/90 italic' : 'text-white'}`}>
                  {topDonor.is_anonymous ? 'Anonymous' : topDonor.display_name}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedDonorForCert(topDonor)}
                className="text-[10px] font-semibold px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
              >
                <Award className="h-3.5 w-3.5 text-amber-400" />
                <span>Certificate</span>
              </button>
              <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                ₹{Number(topDonor.amount_inr)}
              </span>
            </div>
          </motion.div>
        )}

        {/* Supporters List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 border border-white/[0.04] bg-white/[0.01] rounded-xl">
            <div className="w-4 h-4 border-2 border-slate-700 border-t-white rounded-full animate-spin" />
            <p className="text-[10px] text-slate-500 mt-2.5 font-medium">Loading wall...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-12 border border-white/[0.04] bg-white/[0.01] rounded-xl space-y-3">
            <p className="text-xs text-slate-400">Be the first to support this project.</p>
            <Link
              to="/donate"
              className="inline-flex items-center gap-1.5 bg-white text-black font-semibold text-[11px] px-3.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Support Coded
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            <AnimatePresence>
              {donors.map((donor, index) => {
                const displayName = donor.is_anonymous ? 'Anonymous' : donor.display_name;
                const initials = getInitials(displayName);
                const isTopDonor = topDonor && Number(donor.amount_inr) === Number(topDonor.amount_inr) && Number(donor.amount_inr) > 0;

                return (
                  <motion.div
                    key={donor.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.02, duration: 0.15 }}
                    className="flex items-center justify-between p-2.5 border border-white/[0.04] bg-white/[0.01] rounded-lg hover:bg-white/[0.02] hover:border-white/[0.06] transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Avatar */}
                      <div className="w-7 h-7 rounded-md bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-400 text-[10px] font-semibold select-none group-hover:border-white/10 transition-colors">
                        {initials}
                      </div>

                      {/* Name & Time */}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-medium ${donor.is_anonymous ? 'text-slate-400/90 italic' : 'text-white'}`}>
                            {displayName}
                          </span>
                          {isTopDonor && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold px-1 py-0.25 rounded">
                              <Star className="h-1.5 w-1.5 fill-current" />
                              Top
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-0.5 block">
                          {timeAgo(donor.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Certificate & Amount */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDonorForCert(donor)}
                        className="text-[9px] font-mono px-2 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
                        title="View Official Certificate"
                      >
                        <Award className="h-3.5 w-3.5 text-amber-400" />
                        <span>Certificate</span>
                      </button>
                      <span className="text-xs font-semibold font-mono text-white">
                        ₹{Number(donor.amount_inr)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Footer CTA */}
        {donors.length > 0 && (
          <div className="mt-12 text-center pt-6 border-t border-white/[0.04] space-y-2.5">
            <p className="text-[11px] text-slate-500 font-medium">Want to see your name on the wall?</p>
            <Link
              to="/donate"
              className="inline-flex items-center gap-1.5 bg-white text-black font-semibold text-xs px-3.5 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Heart className="h-3 w-3 fill-current text-pink-600" />
              Support Coded
            </Link>
          </div>
        )}

        {/* Certificate Modal */}
        {selectedDonorForCert && (
          <DonationCertificateModal
            open={!!selectedDonorForCert}
            onOpenChange={(open) => {
              if (!open) setSelectedDonorForCert(null);
            }}
            donorName={selectedDonorForCert.is_anonymous ? "Anonymous Supporter" : selectedDonorForCert.display_name}
            amount={selectedDonorForCert.amount_inr}
            date={new Date(selectedDonorForCert.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            paymentId={`KCET-CERT-${selectedDonorForCert.id.substring(0, 8).toUpperCase()}`}
          />
        )}
      </div>
    </div>
  );
};

export default Supporters;

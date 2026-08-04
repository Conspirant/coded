import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart,
  Crown, 
  Key, 
  Eye, 
  EyeOff, 
  Unlock, 
  AlertCircle, 
  CheckCircle,
  Home,
  ArrowRight,
  Loader2,
  ChevronDown,
  MessageCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { isUnlocked, validateAndUnlock, verifyAndUnlockAccessKey, subscribeToUnlockState, unlockGlobally } from '@/lib/unlock';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PageDetails {
  title: string;
  description: string;
  benefits: string[];
}

const PAGE_INFO: Record<string, PageDetails> = {
  '/cutoff-explorer': {
    title: 'KCET Cutoff Explorer',
    description: 'A deep-dive tool to search and inspect the database of official KCET cutoff ranks from previous years. It aggregates round-by-round allotment results for all colleges in Karnataka, allowing you to filter by specific quotas, course categories, and college codes.',
    benefits: [
      'Analyze comprehensive historical cutoff databases covering years 2023, 2024, 2025, and the latest 2026 rounds.',
      'Filter dynamically by college type (Government, Private, Aided), course branch (CSE, ECE, ISE, etc.), and categories (GM, 2AG, 3BG, SC, ST, Rural, Kannada, etc.).',
      'Cross-verify data trust markers directly linked to the official KEA PDF source files and page numbers where the cutoff was published.',
      'Access detailed seat matrix data including total seats and remaining vacant seats per branch/college.'
    ]
  },
  '/comedk-explorer': {
    title: 'COMEDK Cutoff Explorer',
    description: 'Search and analyze COMEDK UGET cutoff ranks from past counseling cycles. This dashboard aggregates final cutoff data for top engineering colleges in Karnataka participating in the COMEDK counseling process.',
    benefits: [
      'Access comprehensive historical COMEDK cutoff metrics covering Mock Rounds, Round 1, Round 2 (Phase 1 & Phase 2), and Round 3.',
      'Target top colleges in Bengaluru and other cities by searching through COMEDK institute codes and course branches.',
      'Compare opening and closing ranks for general merit and other reservation sub-categories (HKR, KMP, etc.).',
      'Verify cutoffs against official COMEDK PDF pages to ensure absolute accuracy before filling options.'
    ]
  },
  '/college-finder': {
    title: 'College Finder & Predictor',
    description: 'A recommendation engine that matches your rank with historical cutoff databases to show which colleges and branches you can realistically get. It sorts options by probability so you can structure your entry form.',
    benefits: [
      'Personalized recommendations sorted into dynamic categories: "Safe" (90%+ chance), "Target" (medium chance), and "Dream" (borderline/stretch target).',
      'Support for dual exam modes (KCET and COMEDK) adapting filters to your specific category and ranking index.',
      'Bookmarking utility to save target colleges directly to your personal counseling profile.',
      'Export your tailored college match list directly into an Excel sheet or formatted PDF report.',
      'Detailed overview of tuition fees, college location, and average packages for matched recommendations.'
    ]
  },
  '/cutoff-trends': {
    title: 'Cutoff Trends Dashboard',
    description: 'A visual analytics dashboard displaying trends of opening and closing ranks over the years. By charting cutoffs, you can predict whether a branch is becoming more competitive or easier to get into.',
    benefits: [
      'Visual Recharts area charts demonstrating the year-over-year trajectory of cutoffs (2023–2026).',
      'Multi-college comparison capabilities to chart and analyze multiple college-branch combinations simultaneously.',
      'Spot rank inflation/deflation patterns for specific categories (e.g., GM) to avoid missing out on border colleges.',
      'Filter trends by specific rounds (Mock, Round 1, Round 2) to see how cutoffs shift as counseling progresses.'
    ]
  },
  '/mock-simulator': {
    title: 'Mock Simulator & Choice Filler',
    description: 'A counselor simulation tool where you can input your choice-filling priority order. The simulator runs the allotment algorithm using your preferences and historical ranks to predict which college you will get.',
    benefits: [
      'Build and edit an option list with up to 100 choices, utilizing drag-and-drop reordering with Framer Motion.',
      'Import your existing option list directly by uploading an official KEA option-entry PDF report.',
      'Run a smart allotment simulator that highlights safety level indicators (e.g., high risk, balanced, highly secure) for every choice on your list.',
      'Export your prioritized choice list to a PDF format to print out or reference during real option entry.'
    ]
  },
  '/round-tracker': {
    title: 'Counseling Round Tracker',
    description: 'A schedule tracking timeline showing deadlines, notification announcements, mock allotment dates, and fee payment deadlines for each counseling round.',
    benefits: [
      'Real-time countdown timers for ongoing choice-filling windows, fee payments, and reporting deadlines.',
      'Detailed, step-by-step advisory alerts and guidance lists explaining what action you must take in each stage (e.g., choice selections: Freeze, Slide, Float).',
      'Notifications of provisional results, final list releases, and objection windows.'
    ]
  },
  '/college-compare': {
    title: 'College Compare Tool',
    description: 'A side-by-side comparison matrix for comparing multiple engineering colleges on all academic, placement, and infrastructural parameters.',
    benefits: [
      'Compare up to 3 colleges side-by-side across key academic, financial, and placement statistics.',
      'Examine placement metrics such as average package, highest package, and placement percentage.',
      'Contrast college type (government, private, aided), establishment year, location, and tier ranking.',
      'Highlight best-performing values (highest package, lowest fees) to easily identify high-ROI choices.'
    ]
  },
  '/document-verification': {
    title: 'Mock Verification Wizard',
    description: 'An eligibility and certificate verification advisor. It walks you through KEA guidelines to ensure your study certificates, reservations, and signatures are valid to prevent verification rejection.',
    benefits: [
      'Step-by-step verification checks for standard documents (SSLC Marks Card, 2nd PU Marks Card, Study Certificates).',
      'Specific reservation verification checklists (Rural Certificate, Kannada Medium Certificate, Hyderabad-Karnataka / 371(J) quota, Caste and Income certificates).',
      'Verification of mandatory signatures (e.g., Block Education Officer - BEO, Tahsildar) and validity formats (RD numbers).',
      'Actionable feedback and warning indicators for mismatched student details (e.g., names, dates, categories).'
    ]
  },
  '/colleges': {
    title: 'College Directory',
    description: 'A comprehensive library of Karnataka engineering colleges listing detailed college profiles, fee configurations, contact info, and Return on Investment (ROI) scores.',
    benefits: [
      'Browse comprehensive profiles for over 200+ colleges participating in KCET and COMEDK.',
      'Access Return on Investment (ROI) scores computed by dividing average placement packages by total 4-year tuition fees.',
      'View structural details: seat count, government vs private classification, infrastructure tags, and tier classifications.',
      'Read reviews, placements, and campus connectivity details.'
    ]
  },
  '/ai-counselor': {
    title: 'AI Counselor (Gemini Powered)',
    description: 'A natural language chat assistant powered by Gemini AI, fine-tuned to answer questions regarding admissions, college selections, choice-filling strategy, and documents.',
    benefits: [
      'Ask complex queries such as "Which is better: CSE at college A or ISE at college B?" or "How do I claim rural reservation?".',
      'Preset quick-prompts helping you address common inquiries about fees, choice options, and documents in one click.',
      'Receive tailored counseling strategy recommendations based on your rank, target branch, and category.'
    ]
  },
  '/request-feature': {
    title: 'Feature Request Portal',
    description: 'A feedback board where students suggest new tools, improvements, or report bugs, enabling users to vote on updates they want to see next.',
    benefits: [
      'Submit feature suggestions, engineering calculators, or design improvements.',
      'Upvote other students\' requests to influence development priority.',
      'Stay updated with the developer\'s responses and feature status tags (e.g., planned, in progress, implemented).'
    ]
  },
  '/pyq-test': {
    title: 'PYQ Practice Test Portal',
    description: 'An exam preparation portal containing previous years\' question banks for KCET and COMEDK. It allows users to take practice tests, identify weak areas, and check solution explanations.',
    benefits: [
      'Practice chapter-by-chapter previous year questions (PYQs) for KCET/COMEDK.',
      'Configure custom quick tests (10, 20, or 30 questions) with active countdown timers.',
      'View detailed steps and solutions for each question after completing the test.',
      'Performance reports showing attempted questions, accuracy rates, and category statistics.'
    ]
  }
};


export const ResourceLimitModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [accessKeyInput, setAccessKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [customAmount, setCustomAmount] = useState('19');
  const [paymentFailurePopup, setPaymentFailurePopup] = useState<{ show: boolean; title: string; message: string }>({ show: false, title: '', message: '' });
  const [showDonorNamePopup, setShowDonorNamePopup] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorIsAnonymous, setDonorIsAnonymous] = useState(false);
  const [paymentSuccessCode, setPaymentSuccessCode] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(78);

  useEffect(() => {
    const fetchTotalAmount = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('donors')
          .select('amount_inr');

        if (error) throw error;

        const dbTotal = (data || []).reduce((sum: number, d: { amount_inr: number }) => sum + Number(d.amount_inr), 0);
        setTotalAmount(78 + dbTotal);
      } catch (err) {
        console.error('Error fetching total amount:', err);
      }
    };
    fetchTotalAmount();
  }, []);

  useEffect(() => {
    return subscribeToUnlockState(setUnlocked);
  }, []);

  // Compute whether the paywall should show (used for scroll lock)
  const cleanPathForLock = location.pathname.endsWith('/') && location.pathname.length > 1 
    ? location.pathname.slice(0, -1) 
    : location.pathname;
  const allowedExactForLock = new Set([
    '', '/', '/rank-predictor', '/admin', '/donate', '/supporters',
    '/daily-challenge', '/cutoff-clash', '/cet-news',
    '/about', '/privacy', '/terms', '/payment-policy', '/reviews',
    '/documents', '/materials', '/info-centre',
    '/squad-finder', '/metro-mapper', '/bmtc-mapper',
    '/hidden-gems', '/college-list', '/college-cutoffs',
    '/dashboard'
  ]);
  const allowedPrefixesForLock = ['/reviews/', '/college/'];
  const isAllowedForLock = allowedExactForLock.has(cleanPathForLock) || allowedPrefixesForLock.some(p => cleanPathForLock.startsWith(p));
  const shouldShowPaywall = !isAllowedForLock && !unlocked;

  // Grace period: let users try premium pages briefly before showing paywall
  const GRACE_PERIOD_MS = 15_000;
  const [graceActive, setGraceActive] = useState(true);

  useEffect(() => {
    if (!shouldShowPaywall) {
      // Reset grace when navigating to a free page
      setGraceActive(true);
      return;
    }
    // Every time the user lands on a (new) premium page, restart the grace timer
    setGraceActive(true);
    const timer = setTimeout(() => setGraceActive(false), GRACE_PERIOD_MS);
    return () => clearTimeout(timer);
  }, [cleanPathForLock, shouldShowPaywall]);

  // Lock body scroll when paywall overlay is actually visible (grace must be over)
  useEffect(() => {
    if ((shouldShowPaywall && !graceActive) || paymentSuccessCode) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [shouldShowPaywall, graceActive, paymentSuccessCode]);

  const handleUnlockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const inputKey = accessKeyInput.trim();
    if (!inputKey) {
      setErrorMsg('Please enter an access key.');
      return;
    }

    setIsProcessing(true);
    const res = await verifyAndUnlockAccessKey(inputKey);
    setIsProcessing(false);

    if (res.success) {
      setSuccessMsg('Access granted! Unlocking features...');
      toast.success('Successfully unlocked all premium features!', {
        description: 'You now have full access to early tools.'
      });
      setAccessKeyInput('');
    } else {
      setErrorMsg(res.error || 'Invalid access key. Please check and try again.');
      toast.error('Unlock failed', {
        description: res.error || 'Double check the key spelling or try a different one.'
      });
    }
  };

  // Called when user clicks the Pay button — show name popup first
  const handlePayButtonClick = () => {
    const amtVal = parseFloat(customAmount);
    if (isNaN(amtVal) || amtVal < 5) {
      toast.error('Invalid Amount', {
        description: 'The minimum contribution is ₹5.'
      });
      return;
    }
    setShowDonorNamePopup(true);
  };

  // Called after user confirms name in popup
  const handleRazorpayPayment = async () => {
    if (typeof (window as any).Razorpay === 'undefined') {
      toast.error('Razorpay SDK not loaded. Please disable content blockers or reload the page.');
      return;
    }

    const amtVal = parseFloat(customAmount);
    if (isNaN(amtVal) || amtVal < 5) {
      toast.error('Invalid Amount', {
        description: 'The minimum contribution is ₹5.'
      });
      return;
    }

    setIsProcessing(true);

    try {
      const paiseAmount = Math.round(amtVal * 100);
      // Step 1: Create Order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: paiseAmount })
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error ${orderRes.status}`);
      }

      const order = await orderRes.json();

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "KCET Coded",
        description: "Unlock Premium Counseling Features",
        order_id: order.order_id,
        handler: async function (response: any) {
          setIsProcessing(true);
          try {
            // Step 3: Verify Payment Signature
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            });

            const verifyData = await verifyRes.json().catch(() => ({}));

            if (verifyRes.ok && verifyData.success) {
              // Generate access code
              const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
              let generatedCode = 'CODED-';
              for (let i = 0; i < 4; i++) {
                generatedCode += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              generatedCode += '-';
              for (let i = 0; i < 4; i++) {
                generatedCode += chars.charAt(Math.floor(Math.random() * chars.length));
              }

              // Save code to Supabase
              try {
                await (supabase as any).from('access_codes').insert({
                  code: generatedCode,
                  is_used: false,
                  payment_id: response.razorpay_payment_id
                });
              } catch (e) {
                console.error('Failed to save access code:', e);
              }

              // Save donor to Supabase
              try {
                await (supabase as any).from('donors').insert({
                  display_name: donorIsAnonymous ? 'Anonymous' : (donorName.trim() || 'Anonymous'),
                  amount_inr: amtVal,
                  is_anonymous: donorIsAnonymous || !donorName.trim(),
                  payment_id: response.razorpay_payment_id,
                });
              } catch (e) {
                console.error('Failed to save donor:', e);
              }

              setTotalAmount(prev => prev + amtVal);
              setPaymentSuccessCode(generatedCode);

              toast.success('Payment Successful! 🎉', {
                description: 'Copy your unique one-time access code to use on another device!'
              });
            } else {
              toast.error('Payment Verification Failed', {
                description: verifyData.error || 'Could not verify your payment signature.'
              });
            }
          } catch (err: any) {
            toast.error('Verification Error', {
              description: err.message || 'An error occurred during verification.'
            });
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: donorIsAnonymous ? '' : donorName,
          email: "",
          contact: ""
        },
        theme: {
          color: "#6366f1"
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setPaymentFailurePopup({
              show: true,
              title: 'Payment Cancelled',
              message: "Left midway? No worries! If you faced any issues during checkout, I'm here to help."
            });
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        setPaymentFailurePopup({
          show: true,
          title: 'Payment Failed',
          message: response.error?.description || "Something went wrong with the payment. Don't worry — I can help you fix it!"
        });
      });
      rzp.open();

    } catch (err: any) {
      console.error('Payment Checkout Failed:', err);
      toast.error('Payment Error', {
        description: err.message || 'Could not initiate checkout.'
      });
      setIsProcessing(false);
    }
  };

  // Define allowed paths
  const cleanPath = location.pathname.endsWith('/') && location.pathname.length > 1 
    ? location.pathname.slice(0, -1) 
    : location.pathname;

  // Set of allowed routes (non-premium)
  const allowedExact = new Set([
    '', '/', '/rank-predictor', '/admin', '/donate', '/supporters',
    '/daily-challenge', '/cutoff-clash', '/cet-news',
    '/about', '/privacy', '/terms', '/payment-policy', '/reviews',
    '/documents', '/materials', '/info-centre',
    '/squad-finder', '/metro-mapper', '/bmtc-mapper',
    '/hidden-gems', '/college-list', '/college-cutoffs',
    '/dashboard'
  ]);

  // Prefix checks for sub-routes
  const allowedPrefixes = ['/reviews/', '/college/'];

  const isAllowed = 
    allowedExact.has(cleanPath) || 
    allowedPrefixes.some(prefix => cleanPath.startsWith(prefix));

  if (paymentSuccessCode) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl overflow-y-auto flex flex-col items-center justify-center p-4 py-8 sm:py-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 via-background/40 to-emerald-950/10 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 text-center"
        >
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center mb-5 animate-bounce">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>

          <h2 className="text-xl font-extrabold text-white mb-2 font-sans">Payment Successful! 🎉</h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            All premium counseling features are now unlocked on this browser. 
            We've also generated a unique one-time access code to use on your **mobile phone, laptop, or other device**:
          </p>

          {/* Access Code Display */}
          <div className="bg-slate-950 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-3 mb-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-lg font-bold font-mono text-white tracking-widest selection:bg-indigo-500/30">
              {paymentSuccessCode}
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(paymentSuccessCode);
                toast.success("Access code copied to clipboard!");
              }}
              className="text-xs bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Copy Code
            </Button>
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-lg text-left text-[10px] text-slate-400 leading-relaxed mb-6">
            <strong className="text-indigo-400">How to use:</strong> On your other device, open this site, click "Redeem an Access Code" on the paywall modal, and paste this code. It can only be used once.
          </div>

          <Button
            onClick={() => {
              setPaymentSuccessCode('');
              unlockGlobally();
            }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm h-11 rounded-xl shadow-lg shadow-indigo-500/20"
          >
            Get Started
          </Button>
        </motion.div>
      </div>
    );
  }

  if (isAllowed || (unlocked && !paymentSuccessCode)) return null;

  // During grace period, let users freely use the premium page
  if (graceActive && !paymentSuccessCode) return null;

  return (
    <>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop Overlay (does not dismiss on click, since it is a hard paywall page-blocker) */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative max-w-md w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] z-10"
      >
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2 shrink-0">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
            <Crown className="h-6 w-6 text-indigo-500 fill-indigo-500/20 animate-pulse" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight text-center">
              Unlock Premium Features
            </h3>
            <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">
              KCET & COMEDK Counseling Suite
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto pr-1 flex-1 my-4 space-y-4 custom-scrollbar text-xs">
          {/* Note from the Developer */}
          <div className="text-zinc-400 leading-relaxed space-y-2.5 px-1">
            <p className="font-bold text-zinc-200 text-xs">Note from the Developer</p>
            <p>
              Due to high user traffic, nominal contributions help cover ongoing server infrastructure and maintenance costs to keep these counseling tools running efficiently.
            </p>
            <p>
              A small contribution (suggested <strong className="text-emerald-400 font-semibold">₹19</strong>, minimum <strong className="text-emerald-400 font-semibold">₹5</strong>) grants full site-wide access to all premium tools. You can customize your amount below.
            </p>
            <p>
              If you would like an access code directly, feel free to reach out via our <a href="https://discord.gg/QZcjtJKjYJ" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 font-semibold underline transition-colors">Discord</a> or <a href="https://www.reddit.com/user/Elegant_Compote9073/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-semibold underline transition-colors">Reddit</a> and I can share one with you.
            </p>
          </div>

          {/* Donations counter */}
          <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Total Contributions Received
            </div>
            <div className="text-sm font-bold text-white font-mono">₹{totalAmount}</div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-1.5 p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <label className="text-[11px] font-medium text-zinc-400 block">
              Your Contribution (Min ₹5)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs font-semibold">₹</span>
              <Input
                type="number"
                min="5"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="bg-black/40 border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-lg h-9.5 pl-6 text-xs text-white"
                placeholder="19"
              />
            </div>
            {parseFloat(customAmount) < 5 && (
              <p className="text-[9.5px] text-rose-400 font-medium mt-1">Minimum is ₹5</p>
            )}
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePayButtonClick}
            disabled={isProcessing || isNaN(parseFloat(customAmount)) || parseFloat(customAmount) < 5}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-10 rounded-lg shadow-lg shadow-indigo-500/10 transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                Pay ₹{customAmount || '19'} to Unlock Everything
              </>
            )}
          </Button>

          {/* Access Key & Supporters Links */}
          <div className="flex flex-col items-center gap-2 pt-1 text-center">
            <button
              type="button"
              onClick={() => setShowKeyForm(!showKeyForm)}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors underline font-medium"
            >
              {showKeyForm ? "Hide Access Key verification" : "Redeem an Access Code"}
            </button>

            <button
              type="button"
              onClick={() => navigate('/supporters')}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-semibold hover:underline"
            >
              See Supporters Wall
            </button>
          </div>

          {/* Access Key Form */}
          <AnimatePresence>
            {showKeyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <form onSubmit={handleUnlockSubmit} className="pt-3 border-t border-zinc-800 space-y-2">
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showKey ? "text" : "password"}
                        placeholder="Enter Access Code..."
                        value={accessKeyInput}
                        onChange={(e) => {
                          setAccessKeyInput(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        className="bg-black/40 border-zinc-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-lg h-9.5 pr-9 font-mono text-xs w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                      >
                        {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      className="border-zinc-800 hover:bg-zinc-900 text-xs h-9.5 rounded-lg px-4 shrink-0 bg-transparent text-zinc-300"
                    >
                      Redeem
                    </Button>
                  </div>

                  {errorMsg && (
                    <p className="text-[10px] text-rose-400 font-medium flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
                      {errorMsg}
                    </p>
                  )}
                  {successMsg && (
                    <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 animate-pulse">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      {successMsg}
                    </p>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Info Callout */}
          <div className="border-t border-zinc-800 pt-3">
            {(() => {
              const pageInfo = PAGE_INFO[cleanPath] || {
                title: 'Premium Counselor Tool',
                description: 'Access advanced tools, simulator engines, comparison charts, and AI assistance.',
                benefits: [
                  'Unlock all premium features site-wide',
                  'Advanced counseling tools and AI assistance',
                  'Simulators, visual trends, and verification check wizards'
                ]
              };
              return (
                <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                      {pageInfo.title}
                    </h3>
                    <Badge variant="secondary" className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[9px] font-semibold py-0">
                      Premium Feature
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                    {pageInfo.description}
                  </p>
                  <div className="space-y-1.5 pt-1.5 border-t border-zinc-800">
                    <p className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider">
                      What you unlock in this tool:
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-zinc-400">
                      {pageInfo.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 shrink-0 select-none font-semibold">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex w-full gap-3 pt-3 mt-auto border-t border-zinc-800 shrink-0">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="flex-1 border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold h-10 rounded-lg"
          >
            Homepage
          </Button>

          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="flex-1 border-zinc-800 bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-900 text-xs font-semibold h-10 rounded-lg"
          >
            Dashboard
          </Button>
        </div>
      </motion.div>
    </div>

    {/* Payment Failure / Cancellation Popup */}
    <AnimatePresence>
      {paymentFailurePopup.show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPaymentFailurePopup({ show: false, title: '', message: '' })}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl shadow-2xl p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPaymentFailurePopup({ show: false, title: '', message: '' })}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            <div className="mx-auto w-14 h-14 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-7 w-7 text-orange-500" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-white mb-2">
              {paymentFailurePopup.title}
            </h3>

            {/* Message */}
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              {paymentFailurePopup.message}
            </p>

            {/* Reddit Contact CTA */}
            <a
              href="https://www.reddit.com/user/Elegant_Compote9073/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm h-11 rounded-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-550/30 transition-all"
            >
              <MessageCircle className="h-4.5 w-4.5" />
              Contact Me on Reddit
            </a>

            {/* Secondary actions */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  setPaymentFailurePopup({ show: false, title: '', message: '' });
                  handlePayButtonClick();
                }}
                className="flex-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors py-2 rounded-lg hover:bg-zinc-900"
              >
                Try Again
              </button>
              <span className="text-zinc-800">|</span>
              <button
                onClick={() => setPaymentFailurePopup({ show: false, title: '', message: '' })}
                className="flex-1 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors py-2 rounded-lg hover:bg-zinc-900"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Donor Name Collection Popup */}
    <AnimatePresence>
      {showDonorNamePopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDonorNamePopup(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowDonorNamePopup(false)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-5">
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-3">
                <Heart className="h-5 w-5 text-indigo-500 fill-indigo-500/20" />
              </div>
              <h3 className="text-base font-bold text-white">One last thing!</h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Your name will be displayed on our{' '}
                <span className="text-indigo-400 font-semibold">Supporters Wall</span>{' '}
                to thank you publicly.
              </p>
            </div>

            {/* Name Input */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5 block">
                  Your Name
                </label>
                <Input
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Rahul S."
                  disabled={donorIsAnonymous}
                  className={`bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-10 rounded-lg text-sm ${donorIsAnonymous ? 'opacity-40' : ''}`}
                  maxLength={30}
                />
              </div>

              {/* Anonymous toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer group py-1">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={donorIsAnonymous}
                    onChange={(e) => {
                      setDonorIsAnonymous(e.target.checked);
                      if (e.target.checked) setDonorName('');
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-[18px] bg-zinc-800 rounded-full peer-checked:bg-indigo-600 transition-colors" />
                  <div className="absolute top-[2px] left-[2px] w-[14px] h-[14px] bg-white rounded-full transition-transform peer-checked:translate-x-[14px] shadow-sm" />
                </div>
                <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  Keep me anonymous
                </span>
              </label>
            </div>

            {/* Action buttons */}
            <div className="mt-5 space-y-2.5">
              <button
                onClick={() => {
                  setShowDonorNamePopup(false);
                  handleRazorpayPayment();
                }}
                disabled={!donorIsAnonymous && !donorName.trim()}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm h-11 rounded-lg shadow-lg shadow-indigo-500/10 transition-all"
              >
                <Crown className="h-4 w-4" />
                {donorIsAnonymous ? 'Continue as Anonymous' : `Continue as "${donorName.trim() || '...'}"`}
              </button>
              <button
                onClick={() => setShowDonorNamePopup(false)}
                className="w-full text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors py-2"
              >
                Go Back
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};

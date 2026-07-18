import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Crown, 
  Key, 
  Eye, 
  EyeOff, 
  Unlock, 
  AlertCircle, 
  CheckCircle,
  Home,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { isUnlocked, validateAndUnlock, subscribeToUnlockState } from '@/lib/unlock';
import { toast } from 'sonner';

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

  useEffect(() => {
    return subscribeToUnlockState(setUnlocked);
  }, []);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!accessKeyInput.trim()) {
      setErrorMsg('Please enter an access key.');
      return;
    }

    const success = validateAndUnlock(accessKeyInput);
    if (success) {
      setSuccessMsg('Access granted! Unlocking features...');
      toast.success('Successfully unlocked all premium features!', {
        description: 'You now have full access to early tools.'
      });
      setAccessKeyInput('');
    } else {
      setErrorMsg('Invalid access key. Please check and try again.');
      toast.error('Unlock failed', {
        description: 'The access key you entered is incorrect.'
      });
    }
  };

  const handleRazorpayPayment = async () => {
    if (typeof (window as any).Razorpay === 'undefined') {
      toast.error('Razorpay SDK not loaded. Please disable content blockers or reload the page.');
      return;
    }

    const amtVal = parseFloat(customAmount);
    if (isNaN(amtVal) || amtVal < 10) {
      toast.error('Invalid Amount', {
        description: 'The minimum contribution to unlock premium features is ₹10.'
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
              validateAndUnlock("COUNS2026"); // Automatically unlocks globally
              toast.success('Payment Successful! 🎉', {
                description: 'All premium features are now unlocked.'
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
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#6366f1"
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast('Payment Cancelled', {
              description: 'You closed the checkout modal.'
            });
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsProcessing(false);
        toast.error('Payment Failed', {
          description: response.error?.description || 'Checkout payment failed.'
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
    '', '/', '/rank-predictor', '/admin', '/donate',
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

  if (isAllowed || unlocked) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl overflow-y-auto flex flex-col items-center justify-start md:justify-center p-4 py-8 sm:py-12">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/20 via-background/40 to-emerald-950/10 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-3xl bg-slate-950/90 border border-white/10 rounded-2xl shadow-2xl p-5 sm:p-8 backdrop-blur-2xl overflow-visible my-auto md:my-0 flex flex-col"
      >
        {/* Glow lights */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6 relative z-10 border-b border-white/5 pb-4">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Crown className="h-5 w-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mt-1 flex items-center justify-center gap-1.5">
            Unlock Premium features
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </h2>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            KCET & COMEDK Counseling Suite
          </p>
          <div className="w-full max-w-xs mt-3 border border-white/10 bg-slate-900/50 rounded-xl p-3 flex flex-col items-center justify-center space-y-1 relative overflow-hidden">
            <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              amount received by people till now
            </div>
            <div className="text-xl font-bold text-white font-mono">₹30</div>
          </div>
        </div>

        {/* 2-Column Grid Layout for Wider, Shorter Aspect */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start relative z-10">
          
          {/* Left Column: Announcement Disclaimer */}
          <div className="text-xs text-slate-300 leading-relaxed space-y-3 md:border-r md:border-white/5 pr-0 md:pr-8 border-b border-white/5 md:border-b-0 pb-6 md:pb-0">
            <p className="font-bold text-white text-[13px] flex items-center gap-1.5">
              Hosting & Scaling Announcement
            </p>
            <p>
              Due to high visitor traffic, our server hosting resources are currently close to exhaustion. We are actively planning to scale up the website's core architecture to support the growing user base, which requires additional operational funds.
            </p>
            <p>
              To support these costs, we have introduced a nominal **₹19** premium activation fee to unlock all advanced features.
            </p>
            <p className="text-slate-400">
              Since this platform is built entirely for students, if you cannot afford this fee, we are sincerely sorry. You can still reach out to us at any time. Please join our <a href="https://discord.gg/QZcjtJKjYJ" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 font-semibold underline">Discord Server</a> or send a DM on <a href="https://www.reddit.com/user/Elegant_Compote9073/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-semibold underline">Reddit</a>, and we will gladly provide you with a free access key. If you have the means, please also consider donating to support the project further.
            </p>
          </div>

          {/* Right Column: Payment CTA & Access Codes */}
          <div className="space-y-4">
            {/* Custom Amount Entry */}
            <div className="space-y-1.5 p-3.5 rounded-xl border border-white/5 bg-white/[0.01]">
              <label className="text-[11px] font-medium text-slate-400 block">
                Contribution Amount (Min ₹10)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">₹</span>
                <Input
                  type="number"
                  min="10"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="bg-black/40 border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl h-9.5 pl-6 text-xs text-white"
                  placeholder="19"
                />
              </div>
              {parseFloat(customAmount) < 10 && (
                <p className="text-[9.5px] text-rose-400 font-medium mt-1">Amount cannot be less than ₹10</p>
              )}
            </div>

            <Button
              onClick={handleRazorpayPayment}
              disabled={isProcessing || isNaN(parseFloat(customAmount)) || parseFloat(customAmount) < 10}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs sm:text-sm h-11 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
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

            {/* Access Key Toggle button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowKeyForm(!showKeyForm)}
                className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors underline"
              >
                {showKeyForm ? "Hide Access Key verification" : "Redeem an Access Code"}
              </button>
            </div>

            {/* Collapsible Access Key Form */}
            <AnimatePresence>
              {showKeyForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleUnlockSubmit} className="pt-2.5 border-t border-white/5 space-y-2">
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
                          className="bg-black/40 border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 rounded-xl h-9.5 pr-9 font-mono text-xs w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowKey(!showKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                        >
                          {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <Button
                        type="submit"
                        variant="outline"
                        className="border-white/10 hover:bg-white/5 text-xs h-9.5 rounded-xl px-4 shrink-0"
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
          </div>
        </div>

        {/* Footer Navigation helpers */}
        <div className="grid grid-cols-2 gap-2.5 pt-4 mt-6 border-t border-white/5 relative z-10">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-xs h-9.5 rounded-xl flex items-center justify-center gap-1.5 text-slate-400 hover:text-white"
          >
            <Home className="h-3.5 w-3.5" />
            Homepage
          </Button>

          <Button
            onClick={() => navigate('/rank-predictor')}
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-xs h-9.5 rounded-xl flex items-center justify-center gap-1.5 text-slate-400 hover:text-white"
          >
            Predictor
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

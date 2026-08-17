import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Unlock, 
  Crown, 
  Check, 
  X,
  FileText,
  Users,
  Compass,
  MessageSquare,
  Loader2,
  Award
} from "lucide-react";
import { verifyAndUnlockAccessKey, initiatePremiumPayment, restorePurchase, getSavedAccessCode } from "@/lib/unlock";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { DonationCertificateModal } from "./DonationCertificateModal";
import { Copy, CheckCheck, LogIn, Sparkles, ArrowRight, ExternalLink } from "lucide-react";

interface PremiumUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PremiumUpgradeModal = ({ open, onOpenChange }: PremiumUpgradeModalProps) => {
  const [accessKey, setAccessKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showKeyForm, setShowKeyForm] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(78);
  const [showCert, setShowCert] = useState(false);

  const { user, signInWithGoogle } = useAuth();

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
    if (open) {
      fetchTotalAmount();
    }
  }, [open]);

  const handlePayment = async () => {
    setIsPaying(true);
    await initiatePremiumPayment(
      (code?: string) => {
        setIsPaying(false);
        const activeCode = code || getSavedAccessCode() || "CODED-PRO";
        setGeneratedCode(activeCode);
        setSuccess(true);
        setTotalAmount(prev => prev + 19);
      },
      () => {
        setIsPaying(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!accessKey.trim()) {
      setErrorMsg("Please enter an access key or payment ID.");
      return;
    }

    setLoading(true);
    const res = await restorePurchase(accessKey);
    setLoading(false);
    
    if (res.success) {
      setGeneratedCode(res.code || accessKey);
      setSuccess(true);
      toast.success("Access Restored! 🎉", {
        description: "Your premium features are now fully unlocked."
      });
    } else {
      setErrorMsg(res.error || "No matching key or payment found.");
      toast.error("Restoration failed", {
        description: res.error || "Could not verify your access key or payment ID."
      });
    }
  };

  const handleCopyCode = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Passcode copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const premiumFeatures = [
    {
      title: "Option Entry Planner",
      description: "Analyze option-entry lists of any size without limitations or blurred rows.",
      icon: FileText
    },
    {
      title: "Enhanced Mock Simulator",
      description: "Manually build up to 100 choices and export options to PDF.",
      icon: Compass
    },
    {
      title: "Squad Finder Pro",
      description: "Find the best colleges where your entire squad can get in together.",
      icon: Users
    },
    {
      title: "Unlimited AI Counselor",
      description: "Ask unlimited counseling and admission questions.",
      icon: MessageSquare
    }
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md bg-zinc-950 border border-zinc-800 text-zinc-200 p-6 rounded-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl z-[120]">
          <div className="space-y-4 relative z-10 overflow-y-auto max-h-[calc(90vh-1rem)] custom-scrollbar">
            <DialogHeader className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
                {success ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Unlock className="h-5 w-5 text-indigo-400" />
                  </motion.div>
                ) : (
                  <Crown className="h-5 w-5 text-indigo-500 fill-indigo-500/20 animate-pulse" />
                )}
              </div>
              
              <DialogTitle className="text-base font-bold tracking-tight text-white text-center">
                {success ? "Pro Unlocked Successfully! 🎉" : "Unlock Premium Features"}
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs leading-relaxed text-center mt-1">
                {success 
                  ? "All premium counseling & prediction tools are now active on your device."
                  : "Sustain our platform and get full access to advanced planning tools."}
              </DialogDescription>
            </DialogHeader>

            {/* Form / Success Screen */}
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3.5 py-2 text-left"
                >
                  {/* Passcode Box */}
                  <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400 font-medium">Your Access Passcode:</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Saved in Settings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-black/60 border border-zinc-800 rounded-lg px-3 py-1.5 font-mono text-sm font-bold text-amber-400 tracking-wider">
                        {generatedCode || getSavedAccessCode() || "CODED-PRO-ACTIVE"}
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleCopyCode}
                        className="h-8 px-2.5 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                      >
                        {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Optional Cross-Device Sync Callout */}
                  <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-indigo-300">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span>Use on your Phone, Tablet, or PC</span>
                    </div>
                    {user ? (
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        ✅ <strong className="text-zinc-200">Synced to {user.email}</strong>. Simply sign in with this account on any device to use Pro features automatically.
                      </p>
                    ) : (
                      <>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          <strong className="text-zinc-200">Optional:</strong> Sign in with Google to link Pro to your account so you don't need passcodes on other devices. (You can also do this anytime later in Settings or just close this window).
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            signInWithGoogle();
                          }}
                          className="w-full h-8 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-200 flex items-center justify-center gap-2"
                        >
                          <LogIn className="h-3.5 w-3.5 text-indigo-400" />
                          Link Pro with Google Sign In
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Primary & Secondary Close Buttons */}
                  <div className="space-y-2 pt-1">
                    <Button
                      type="button"
                      onClick={() => onOpenChange(false)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      Done • Start Exploring Tools
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCert(true)}
                      className="w-full text-zinc-400 hover:text-zinc-200 text-xs h-7"
                    >
                      <Award className="h-3.5 w-3.5 mr-1 text-amber-400" />
                      View Supporter Certificate 📜
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Feature List */}
                  <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                    {premiumFeatures.map((feat, index) => {
                      const Icon = feat.icon;
                      return (
                        <div key={index} className="flex gap-2.5 p-2 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors">
                          <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 shrink-0 self-start">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="space-y-0.5">
                            <h5 className="text-[11.5px] font-semibold text-zinc-200">{feat.title}</h5>
                            <p className="text-[10px] leading-relaxed text-zinc-400">{feat.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Developer note & Reddit Contact */}
                  <div className="text-[10.5px] leading-relaxed text-zinc-400 bg-zinc-900/40 border border-zinc-800 rounded-xl p-3 space-y-2.5">
                    <p className="font-semibold text-zinc-200">Hosting Resource Update</p>
                    <p>
                      Due to high traffic, nominal contributions help sustain server infrastructure costs. A small contribution of <strong className="text-emerald-400">₹19</strong> grants full access to all premium tools.
                    </p>

                    {/* Highly Visible Reddit & Discord Support Card */}
                    <div className="p-3 rounded-xl border border-orange-500/30 bg-orange-950/20 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-orange-400 flex items-center gap-1.5">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Found a bug or need a free code?
                        </span>
                        <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-[9px] font-mono">
                          DIRECT DEV SUPPORT
                        </Badge>
                      </div>
                      <p className="text-[11px] text-zinc-300 leading-relaxed">
                        If you encounter any payment/sync issue or need a 100% free student access code, message the developer directly on Reddit:
                      </p>
                      <div className="flex items-center gap-2 pt-0.5">
                        <a
                          href="https://www.reddit.com/user/Elegant_Compote9073/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-600/30 transition-all cursor-pointer"
                        >
                          <span>DM on Reddit: u/Elegant_Compote9073</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Live Funding Status */}
                  <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-3 flex flex-col items-center justify-center space-y-1 relative overflow-hidden">
                    <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      amount received by people till now
                    </div>
                    <div className="text-xl font-bold text-white font-mono">₹{totalAmount}</div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handlePayment}
                      disabled={isPaying}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-10 rounded-lg shadow-lg shadow-indigo-500/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Crown className="h-4 w-4 shrink-0 fill-white/20 animate-pulse" />
                      {isPaying ? "Processing..." : "Pay ₹19 to Unlock Everything"}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setShowKeyForm(!showKeyForm)}
                        className="text-[10.5px] text-indigo-400 hover:text-indigo-300 transition-colors underline font-semibold flex items-center justify-center gap-1 mx-auto"
                      >
                        <Unlock className="h-3 w-3" />
                        {showKeyForm ? "Hide Restore Purchase form" : "Already Paid or Have an Access Key? Restore Purchase"}
                      </button>
                    </div>
                  </div>

                  {showKeyForm && (
                    <form onSubmit={handleSubmit} className="space-y-2.5 pt-2.5 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-medium text-zinc-300">Access Key or Razorpay Payment ID</label>
                          {errorMsg && <span className="text-[9.5px] text-red-400 flex items-center gap-0.5"><X className="h-3 w-3" /> {errorMsg}</span>}
                        </div>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="e.g. CODED-ABCD-1234 or pay_Pxxxxxxxx"
                            value={accessKey}
                            onChange={(e) => {
                              setAccessKey(e.target.value);
                              setErrorMsg("");
                            }}
                            disabled={loading}
                            className="bg-black/40 border-zinc-800 text-white text-xs h-9 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 font-mono"
                          />
                        </div>
                        <p className="text-[9.5px] text-zinc-500">
                          Tip: You can find your Payment ID (starts with <code>pay_</code>) in your UPI app receipt or Razorpay email.
                        </p>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading}
                        variant="outline"
                        className="w-full border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs text-indigo-300 h-9 rounded-lg flex items-center justify-center gap-1.5 font-semibold"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Restoring Purchase...
                          </>
                        ) : (
                          "Restore Purchase / Verify Key"
                        )}
                      </Button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      {/* Certificate Popup */}
      <DonationCertificateModal
        open={showCert}
        onOpenChange={setShowCert}
        donorName="Premium Supporter"
        amount={19}
      />
    </>
  );
};



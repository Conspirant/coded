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
  Loader2
} from "lucide-react";
import { verifyAndUnlockAccessKey, initiatePremiumPayment } from "@/lib/unlock";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PremiumUpgradeModal = ({ open, onOpenChange }: PremiumUpgradeModalProps) => {
  const [accessKey, setAccessKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showKeyForm, setShowKeyForm] = useState(false);
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
    if (open) {
      fetchTotalAmount();
    }
  }, [open]);

  const handlePayment = async () => {
    setIsPaying(true);
    await initiatePremiumPayment(
      () => {
        setIsPaying(false);
        setSuccess(true);
        setTotalAmount(prev => prev + 19);
        setTimeout(() => {
          onOpenChange(false);
          setSuccess(false);
        }, 1500);
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
      setErrorMsg("Please enter an access key.");
      return;
    }

    setLoading(true);
    const res = await verifyAndUnlockAccessKey(accessKey);
    setLoading(false);
    
    if (res.success) {
      setSuccess(true);
      toast.success("Premium access activated! 🎉", {
        description: "All advanced features are now fully unlocked."
      });
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        setAccessKey("");
      }, 1500);
    } else {
      setErrorMsg(res.error || "Invalid key. Please check and try again.");
      toast.error("Unlock failed", {
        description: res.error || "The access key you entered is incorrect."
      });
    }
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-950 border border-zinc-800 text-zinc-200 p-6 rounded-xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
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
              Unlock Premium Features
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs leading-relaxed text-center mt-1">
              Sustain our platform and get full access to advanced planning tools.
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
                className="text-center py-6 space-y-3"
              >
                <div className="mx-auto w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Check className="h-5 w-5 text-emerald-400" />
                </div>
                <h4 className="text-lg font-semibold text-emerald-400">Access Granted!</h4>
                <p className="text-sm text-zinc-400">Enjoy the full power of KCETCoded premium features.</p>
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

                {/* Developer note */}
                <div className="text-[10.5px] leading-relaxed text-zinc-400 bg-zinc-900/30 border border-zinc-800 rounded-xl p-3 space-y-1.5">
                  <p className="font-semibold text-amber-500">Hosting Resource Update</p>
                  <p>
                    Due to high traffic, our free hosting resources are exhausted. To sustain the server costs, a nominal fee of <strong className="text-emerald-400">₹19</strong> is required to unlock premium features.
                  </p>
                  <p>
                    If you cannot afford this, you can get free access. Please join our <a href="https://discord.gg/QZcjtJKjYJ" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 font-bold underline transition-colors">Discord Server</a> or message the developer on <a href="https://www.reddit.com/user/Elegant_Compote9073/" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-bold underline transition-colors">Reddit</a> to get a free key.
                  </p>
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
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors underline font-medium"
                    >
                      {showKeyForm ? "Hide Access Key form" : "Have an Access Key? Click here"}
                    </button>
                  </div>
                </div>

                {showKeyForm && (
                  <form onSubmit={handleSubmit} className="space-y-2.5 pt-2.5 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[11px] font-medium text-zinc-300">Access Key</label>
                        {errorMsg && <span className="text-[9.5px] text-red-400 flex items-center gap-0.5"><X className="h-3 w-3" /> {errorMsg}</span>}
                      </div>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="e.g. KCETCODED, DEVELOPER"
                          value={accessKey}
                          onChange={(e) => {
                            setAccessKey(e.target.value);
                            setErrorMsg("");
                          }}
                          disabled={loading}
                          className="bg-black/40 border-zinc-800 text-white text-xs h-9 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-lg focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      variant="outline"
                      className="w-full border-zinc-800 hover:bg-zinc-900 text-xs text-zinc-300 h-9 rounded-lg flex items-center justify-center gap-1.5 bg-transparent"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Unlock Key"
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
  );
};

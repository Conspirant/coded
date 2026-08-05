import { useState, useEffect } from "react"
import { SEO } from "@/components/SEO"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
    Heart,
    CheckCircle2,
    Loader2,
    Sparkles,
    Crown,
    X,
    MessageCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/integrations/supabase/client"
import { saveAccessCode } from "@/lib/unlock"
import { copyToClipboard } from "@/lib/utils"

const Donate = () => {
    const { toast } = useToast()
    const [amount, setAmount] = useState<string>("100")
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [txnDetails, setTxnDetails] = useState<{ paymentId: string; orderId: string } | null>(null)
    const [showDonorNamePopup, setShowDonorNamePopup] = useState(false)
    const [donorName, setDonorName] = useState('')
    const [donorIsAnonymous, setDonorIsAnonymous] = useState(false)
    const [donateSuccessCode, setDonateSuccessCode] = useState('')
    const [totalAmount, setTotalAmount] = useState<number>(78)

    useEffect(() => {
        const fetchTotalAmount = async () => {
            try {
                const { data, error } = await (supabase as any)
                    .from('donors')
                    .select('amount_inr')

                if (error) throw error

                const dbTotal = (data || []).reduce((sum: number, d: { amount_inr: number }) => sum + Number(d.amount_inr), 0)
                setTotalAmount(78 + dbTotal)
            } catch (err) {
                console.error('Error fetching total amount:', err)
            }
        }
        fetchTotalAmount()
    }, [])

    const predefinedAmounts = [50, 100, 250, 500]

    const handlePayButtonClick = () => {
        const amtVal = parseFloat(amount)
        if (isNaN(amtVal) || amtVal <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid amount to donate.",
                variant: "destructive",
            })
            return
        }

        const paiseAmount = Math.round(amtVal * 100)
        if (paiseAmount < 100) {
            toast({
                title: "Minimum Amount",
                description: "The minimum donation amount is ₹1 (100 paise).",
                variant: "destructive",
            })
            return
        }
        setShowDonorNamePopup(true)
    }

    const handleRazorpayPayment = async () => {
        const amtVal = parseFloat(amount)
        if (isNaN(amtVal) || amtVal <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid amount to donate.",
                variant: "destructive",
            })
            return
        }

        const paiseAmount = Math.round(amtVal * 100)
        if (paiseAmount < 100) {
            toast({
                title: "Minimum Amount",
                description: "The minimum donation amount is ₹1 (100 paise).",
                variant: "destructive",
            })
            return
        }

        if (typeof (window as unknown as { Razorpay?: unknown }).Razorpay === 'undefined') {
            toast({
                title: "Razorpay SDK not loaded",
                description: "Payment checkout script is not loaded. Please reload the page or disable content blockers.",
                variant: "destructive",
            })
            return
        }

        setIsProcessing(true)
        setPaymentStatus('idle')

        try {
            // Step 1: Create order on the backend
            const orderRes = await fetch('/api/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: paiseAmount })
            })

            if (!orderRes.ok) {
                const errData = (await orderRes.json().catch(() => ({}))) as { error?: string };
                throw new Error(errData.error || `HTTP error ${orderRes.status}`)
            }

            const order = (await orderRes.json()) as { order_id: string; amount: number; currency: string }

            // Step 2: Open Razorpay modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "KCET Coded",
                description: `Support KCET Coded - Donation of ₹${amtVal}`,
                order_id: order.order_id,
                handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
                    setIsProcessing(true)
                    try {
                        // Step 3: Verify signature on the backend
                        const verifyRes = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                donor_name: donorIsAnonymous ? 'Anonymous' : (donorName.trim() || 'Anonymous'),
                                is_anonymous: donorIsAnonymous || !donorName.trim(),
                                amount_inr: amtVal
                            })
                        })

                        const verifyData = (await verifyRes.json().catch(() => ({}))) as { success?: boolean; code?: string; error?: string }

                        if (verifyRes.ok && verifyData.success) {
                            let finalCode = verifyData.code;

                            if (!finalCode) {
                                // Generate access code fallback
                                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                                finalCode = 'CODED-';
                                for (let i = 0; i < 4; i++) finalCode += chars.charAt(Math.floor(Math.random() * chars.length));
                                finalCode += '-';
                                for (let i = 0; i < 4; i++) finalCode += chars.charAt(Math.floor(Math.random() * chars.length));

                                try {
                                    await supabase.from('access_codes').insert({
                                        code: finalCode,
                                        is_used: false,
                                        payment_id: response.razorpay_payment_id
                                    })
                                } catch (e) {
                                    console.error('Failed to save access code to database:', e)
                                }

                                try {
                                    await supabase.from('donors').insert({
                                        display_name: donorIsAnonymous ? 'Anonymous' : (donorName.trim() || 'Anonymous'),
                                        amount_inr: amtVal,
                                        is_anonymous: donorIsAnonymous || !donorName.trim(),
                                        payment_id: response.razorpay_payment_id,
                                    })
                                } catch (e) {
                                    console.error('Failed to save donor to database:', e)
                                }
                            }

                            saveAccessCode(finalCode)
                            setDonateSuccessCode(finalCode)
                            setPaymentStatus('success')
                            setTotalAmount(prev => prev + amtVal)
                            setTxnDetails({
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                            })
                            toast({
                                title: "Payment Successful!",
                                description: `Thank you so much for your donation of ₹${amtVal}! Your access code (${finalCode}) is saved in Settings.`,
                            })
                        } else {
                            setPaymentStatus('error')
                            toast({
                                title: "Verification Failed",
                                description: verifyData.error || "Could not verify your payment signature.",
                                variant: "destructive",
                            })
                        }
                    } catch (err: unknown) {
                        setPaymentStatus('error')
                        const errorObj = err as Error;
                        toast({
                            title: "Verification Error",
                            description: errorObj.message || "An error occurred while verifying the payment.",
                            variant: "destructive",
                        })
                    } finally {
                        setIsProcessing(false)
                    }
                },
                prefill: {
                    name: donorIsAnonymous ? "" : donorName,
                    email: "",
                    contact: "",
                },
                theme: {
                    color: "#ec4899",
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false)
                        toast({
                            title: "Payment Cancelled",
                            description: "Left midway? Did it fail? Contact me on Reddit if you're facing any issues.",
                            duration: 10000,
                            action: (
                                <div className="mt-2">
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => window.open('https://www.reddit.com/user/Elegant_Compote9073/', '_blank')}
                                    >
                                        Contact Me
                                    </Button>
                                </div>
                            )
                        })
                    }
                }
            }

            const RazorpayClass = (window as unknown as { Razorpay: new (opts: unknown) => { open: () => void; on: (event: string, cb: (res: { error?: { description?: string } }) => void) => void } }).Razorpay;
            const rzp = new RazorpayClass(options)
            rzp.on('payment.failed', function (response: { error?: { description?: string } }) {
                setIsProcessing(false)
                setPaymentStatus('error')
                toast({
                    title: "Payment Failed",
                    description: response.error?.description || "Did it fail? Contact me on Reddit if you're facing any issues.",
                    variant: "destructive",
                    duration: 10000,
                    action: (
                        <div className="mt-2">
                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => window.open('https://www.reddit.com/user/Elegant_Compote9073/', '_blank')}
                            >
                                Contact Me
                            </Button>
                        </div>
                    )
                })
            })

            rzp.open()
        } catch (err: unknown) {
            const errorObj = err as Error;
            console.error('Payment checkout initiation failed:', errorObj)
            toast({
                title: "Checkout Failed",
                description: errorObj.message || "Could not connect to server or initiate payment.",
                variant: "destructive",
            })
            setIsProcessing(false)
        }
    }

    return (
        <div className="max-w-md mx-auto py-16 px-4 space-y-8 flex flex-col justify-center min-h-[80vh]">
            <SEO
                title="Support Coded — Donate"
                description="Support KCET Coded with a small donation. Help us keep the platform running, ad-free, and constantly improving for all Karnataka students."
                url="https://kcetcoded.dev/donate"
                keywords="donate KCET Coded, support KCET tools, online donation"
            />

            {/* Simple Minimal Header */}
            <div className="text-center space-y-3">
                <div className="relative inline-block">
                    <Heart className="h-10 w-10 text-pink-500 fill-pink-500 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Support Coded</h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    This platform is free, ad-free, and requires no sign-up. 
                    If it helped you, consider supporting our hosting costs with a small contribution.
                </p>
            </div>

            {/* Funding Status Box */}
            <div className="border border-white/10 bg-slate-900/50 rounded-xl p-4 flex flex-col items-center justify-center space-y-1 relative overflow-hidden">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    amount received by people till now
                </div>
                <div className="text-2xl font-bold text-white font-mono">₹{totalAmount}</div>
            </div>

            {/* Elegant Minimal Payment Card */}
            <Card className="border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <CardContent className="p-6 sm:p-8 space-y-6 relative">
                    {/* Payment States UI */}
                    {paymentStatus === 'success' ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-6 text-center">
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-base text-foreground">Thank You ❤️</h3>
                                <p className="text-xs text-muted-foreground">Your contribution keeps Coded online and ad-free.</p>
                            </div>
                            <Link 
                                to="/supporters" 
                                className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 transition-all font-semibold mt-2 animate-pulse"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                View your name on the Supporters Wall
                            </Link>
                            {donateSuccessCode && (
                                <div className="space-y-2 w-full mt-2 bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-xl text-center">
                                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                                        Your One-Time Access Code
                                    </div>
                                    <div className="text-base font-bold font-mono text-white tracking-widest my-1.5 selection:bg-indigo-500/30">
                                        {donateSuccessCode}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={async () => {
                                            const ok = await copyToClipboard(donateSuccessCode);
                                            if (ok) {
                                                toast({ title: "Copied!", description: "Access code copied to clipboard." });
                                            } else {
                                                toast({ title: "Error", description: "Failed to copy. Please select and copy manually.", variant: "destructive" });
                                            }
                                        }}
                                        className="text-[10px] h-7 px-3 border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-semibold"
                                    >
                                        Copy Code
                                    </Button>
                                    <div className="text-[9px] text-slate-500 leading-relaxed max-w-[240px] mx-auto pt-1">
                                        Use this to unlock premium features on another device (phone, laptop, etc.). It can only be used once.
                                    </div>
                                </div>
                            )}
                            {txnDetails && (
                                <div className="text-left w-full text-[10px] text-muted-foreground/80 space-y-1 bg-white/[0.02] p-2.5 rounded-lg border border-white/5 font-mono">
                                    <div className="truncate"><span className="text-white/40">Payment ID:</span> {txnDetails.paymentId}</div>
                                    <div className="truncate"><span className="text-white/40">Order ID:</span> {txnDetails.orderId}</div>
                                </div>
                            )}
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setPaymentStatus('idle')}
                                className="text-xs border-white/10 hover:bg-white/5"
                            >
                                Donate Again
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Predefined Amounts */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground font-medium">Select Amount</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {predefinedAmounts.map((amt) => (
                                        <Button
                                            key={amt}
                                            type="button"
                                            variant={amount === amt.toString() ? "default" : "outline"}
                                            onClick={() => setAmount(amt.toString())}
                                            className={`text-xs font-semibold h-9 transition-all ${
                                                amount === amt.toString() 
                                                ? "bg-white text-black hover:bg-white/90 border-0" 
                                                : "border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                            }`}
                                        >
                                            ₹{amt}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Amount Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="custom-amount" className="text-xs text-muted-foreground font-medium">Or Custom Amount</Label>
                                    <span className="text-[10px] text-muted-foreground/40">Min: ₹1</span>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground/60 font-semibold">₹</span>
                                    <Input
                                        id="custom-amount"
                                        type="number"
                                        min="1"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="pl-7 bg-white/5 border-white/10 focus:border-white/20 text-sm h-10 text-foreground"
                                    />
                                </div>
                            </div>

                            {/* Action button */}
                            <Button
                                onClick={handlePayButtonClick}
                                disabled={isProcessing}
                                className="w-full bg-white text-black hover:bg-white/90 font-bold h-10 transition-all duration-200 mt-2 border-0"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin animate-spin-slow" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay ₹{amount || "0"} Online
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Supporters Link */}
            <div className="text-center">
                <Link to="/supporters" className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                    <Sparkles className="h-3.5 w-3.5" />
                    View Supporters Wall
                </Link>
            </div>

            {/* Back Link */}
            <div className="text-center">
                <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                    Back to Dashboard
                </Link>
            </div>

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
                            className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-7"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setShowDonorNamePopup(false)}
                                className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-5">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center mb-3">
                                    <Sparkles className="h-5 w-5 text-indigo-400" />
                                </div>
                                <h3 className="text-base font-bold text-white">One last thing!</h3>
                                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                                    Your name will be displayed on our{' '}
                                    <span className="text-indigo-400 font-semibold">Supporters Wall</span>{' '}
                                    to thank you publicly.
                                </p>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-3 text-left">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                                        Your Name
                                    </Label>
                                    <Input
                                        value={donorName}
                                        onChange={(e) => setDonorName(e.target.value)}
                                        placeholder="e.g. Rahul S."
                                        disabled={donorIsAnonymous}
                                        className={`bg-slate-800/50 border-white/10 text-white placeholder:text-slate-600 h-10 rounded-xl text-sm ${donorIsAnonymous ? 'opacity-40' : ''}`}
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
                                        <div className="w-8 h-[18px] bg-slate-700 rounded-full peer-checked:bg-indigo-500 transition-colors" />
                                        <div className="absolute top-[2px] left-[2px] w-[14px] h-[14px] bg-white rounded-full transition-transform peer-checked:translate-x-[14px] shadow-sm" />
                                    </div>
                                    <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
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
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm h-11 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                                >
                                    <Crown className="h-4 w-4" />
                                    {donorIsAnonymous ? 'Continue as Anonymous' : `Continue as "${donorName.trim() || '...'}"`}
                                </button>
                                <button
                                    onClick={() => setShowDonorNamePopup(false)}
                                    className="w-full text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors py-2"
                                >
                                    Go Back
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Donate

import { useState } from "react"
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
} from "lucide-react"

const Donate = () => {
    const { toast } = useToast()
    const [amount, setAmount] = useState<string>("100")
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [txnDetails, setTxnDetails] = useState<{ paymentId: string; orderId: string } | null>(null)

    const predefinedAmounts = [50, 100, 250, 500]

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
                            })
                        })

                        const verifyData = (await verifyRes.json().catch(() => ({}))) as { success?: boolean; error?: string }

                        if (verifyRes.ok && verifyData.success) {
                            setPaymentStatus('success')
                            setTxnDetails({
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                            })
                            toast({
                                title: "Payment Successful!",
                                description: `Thank you so much for your donation of ₹${amtVal}!`,
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
                    name: "",
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
                            description: "You closed the payment modal.",
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
                    description: response.error?.description || "Razorpay payment failed.",
                    variant: "destructive",
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
                url="https://kcet-coded2.vercel.app/donate"
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
                <div className="text-2xl font-bold text-white font-mono">₹30</div>
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
                                onClick={handleRazorpayPayment}
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

            {/* Back Link */}
            <div className="text-center">
                <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}

export default Donate

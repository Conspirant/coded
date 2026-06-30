import { useState } from "react"
import { SEO } from "@/components/SEO"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
    Heart,
    Coffee,
    Sparkles,
    Server,
    Clock,
    Code,
    Users,
    ArrowRight,
    ExternalLink,
    Zap,
    Shield,
    CheckCircle2,
    Activity,
    Globe,
    HardDrive,
    Cpu,
    MemoryStick,
    Database,
    BarChart3,
    CreditCard,
    Loader2,
} from "lucide-react"
import { motion } from "framer-motion"

/* ─── Resource usage data (update periodically from Vercel dashboard) ─── */
const USAGE_DATA = [
    {
        label: "Web Analytics Events",
        used: "25K",
        limit: "50K",
        percent: 50,
        icon: BarChart3,
        color: "#818cf8", // indigo
    },
    {
        label: "Fast Data Transfer",
        used: "42.92 GB",
        limit: "100 GB",
        percent: 43,
        icon: Globe,
        color: "#38bdf8", // sky
    },
    {
        label: "Edge Requests",
        used: "235K",
        limit: "1M",
        percent: 24,
        icon: Activity,
        color: "#34d399", // emerald
    },
    {
        label: "Fluid Active CPU",
        used: "2m 3s",
        limit: "4h",
        percent: 1,
        icon: Cpu,
        color: "#a78bfa", // violet
    },
    {
        label: "Edge Request CPU Duration",
        used: "21s",
        limit: "1h",
        percent: 1,
        icon: Clock,
        color: "#f472b6", // pink
    },
    {
        label: "Fluid Provisioned Memory",
        used: "1.7 GB-Hrs",
        limit: "360 GB-Hrs",
        percent: 0.5,
        icon: MemoryStick,
        color: "#fb923c", // orange
    },
    {
        label: "Function Invocations",
        used: "329",
        limit: "1M",
        percent: 0.03,
        icon: Zap,
        color: "#facc15", // yellow
    },
    {
        label: "ISR Reads",
        used: "236",
        limit: "1M",
        percent: 0.02,
        icon: Database,
        color: "#2dd4bf", // teal
    },
    {
        label: "Fast Origin Transfer",
        used: "2.2 MB",
        limit: "10 GB",
        percent: 0.02,
        icon: HardDrive,
        color: "#c084fc", // purple
    },
]

/* ─── Mini circular progress ring ─── */
const UsageRing = ({ percent, color, size = 28 }: { percent: number; color: string; size?: number }) => {
    const stroke = 3
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (Math.min(percent, 100) / 100) * circumference

    return (
        <svg width={size} height={size} className="shrink-0 -rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                className="text-white/[0.06]"
            />
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                whileInView={{ strokeDashoffset: offset }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            />
        </svg>
    )
}

const DISCORD_INVITE = "https://discord.gg/QZcjtJKjYJ"

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.6 },
}

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
                    color: "#ec4899", // matches pink theme
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
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
            <SEO
                title="Support Coded — Donate"
                description="Support KCET Coded with a small donation. Help us keep the platform running, ad-free, and constantly improving for all Karnataka students."
                url="https://kcet-coded2.vercel.app/donate"
                keywords="donate KCET Coded, support KCET tools, KCET Coded UPI"
            />

            {/* ═══ Hero ═══ */}
            <motion.div {...fadeUp} className="text-center space-y-5">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-amber-500 rounded-2xl blur-2xl opacity-25 animate-pulse" />
                    <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 rounded-2xl shadow-2xl shadow-pink-500/25">
                        <Heart className="h-10 w-10 text-white fill-white" />
                    </div>
                </div>

                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                    Support{" "}
                    <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                        KCET Coded
                    </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    This platform is free, has no ads, and requires no sign-up.
                    If it has helped you, consider showing your appreciation with a small contribution.
                </p>
            </motion.div>

            {/* ═══ Why Donate ═══ */}
            <motion.div {...fadeUp}>
                <Card className="border-2 border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-rose-500/5 overflow-hidden relative">
                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
                    <CardContent className="p-6 sm:p-8 space-y-5 relative">
                        <div className="flex items-center gap-2">
                            <Coffee className="h-5 w-5 text-pink-400" />
                            <h2 className="text-xl font-bold">Why Your Support Matters</h2>
                        </div>

                        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                            <p>
                                KCET Coded was built by a single student during exam season, fueled by chai and the
                                belief that <strong className="text-foreground">every aspirant deserves free access to good tools</strong> — not
                                just the ones who can afford ₹50,000 counseling packages.
                            </p>
                            <p>
                                While the platform is currently hosted on free tiers (Vercel, Supabase), these come
                                with <strong className="text-foreground">strict bandwidth and usage limits</strong>. During peak counseling
                                season, thousands of students hit the site simultaneously — and free tiers can
                                struggle to keep up.
                            </p>
                            <p>
                                Your donation directly helps with:
                            </p>
                        </div>

                        {/* What donations cover */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                {
                                    icon: Server,
                                    title: "Hosting & Infrastructure",
                                    desc: "Keeping servers responsive during peak traffic (counseling days)",
                                    color: "text-blue-400",
                                    bg: "bg-blue-500/10",
                                },
                                {
                                    icon: Zap,
                                    title: "API & AI Costs",
                                    desc: "AI Counselor, rank predictions, and real-time data processing",
                                    color: "text-amber-400",
                                    bg: "bg-amber-500/10",
                                },
                                {
                                    icon: Clock,
                                    title: "Developer Time",
                                    desc: "Hundreds of hours building, debugging, and updating data each year",
                                    color: "text-emerald-400",
                                    bg: "bg-emerald-500/10",
                                },
                                {
                                    icon: Shield,
                                    title: "Keeping It Ad-Free",
                                    desc: "Your support lets us say no to intrusive ads and paywalls",
                                    color: "text-purple-400",
                                    bg: "bg-purple-500/10",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors"
                                >
                                    <div className={`p-2 rounded-lg ${item.bg} shrink-0`}>
                                        <item.icon className={`h-4 w-4 ${item.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* ═══ Live Resource Usage ═══ */}
            <motion.div {...fadeUp}>
                <Card className="border-2 border-sky-500/15 bg-gradient-to-br from-sky-500/[0.03] to-indigo-500/[0.03] overflow-hidden relative">
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-500/[0.04] rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/[0.04] rounded-full blur-3xl pointer-events-none" />

                    <CardContent className="p-6 sm:p-8 space-y-5 relative">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-sky-500/10">
                                    <Server className="h-4 w-4 text-sky-400" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Live Resource Usage</h2>
                                    <p className="text-[11px] text-muted-foreground">Vercel Free Tier — Last 30 days</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="bg-sky-500/10 border-sky-500/20 text-sky-300 text-[10px] w-fit">
                                <span className="relative flex h-1.5 w-1.5 mr-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-400" />
                                </span>
                                Free Tier
                            </Badge>
                        </div>

                        {/* Usage list */}
                        <div className="divide-y divide-white/[0.04] rounded-xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
                            {USAGE_DATA.map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                >
                                    <UsageRing percent={item.percent} color={item.color} />
                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                        <item.icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 hidden sm:block" />
                                        <span className="text-sm text-foreground/90 truncate">{item.label}</span>
                                    </div>
                                    <span className="text-sm tabular-nums text-muted-foreground whitespace-nowrap ml-auto">
                                        <span className="text-foreground/80 font-medium">{item.used}</span>
                                        <span className="text-muted-foreground/50"> / {item.limit}</span>
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer note */}
                        <p className="text-[11px] text-muted-foreground/60 text-center leading-relaxed">
                            These are real limits from our Vercel free tier. During peak counseling rounds, traffic can spike 10×.
                            <br className="hidden sm:block" /> Your support helps us upgrade before we hit these walls.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* ═══ Donation Card Section ═══ */}
            <motion.div {...fadeUp} className="max-w-md mx-auto">
                <Card className="overflow-hidden relative flex flex-col justify-between">
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    <CardContent className="p-6 sm:p-8 space-y-6 relative flex-grow flex flex-col justify-between">
                        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/8 rounded-full blur-3xl pointer-events-none" />

                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2">
                                <CreditCard className="h-5 w-5 text-indigo-400" />
                                <h2 className="text-xl font-bold">Pay Online (Razorpay)</h2>
                            </div>

                            <p className="text-xs text-muted-foreground max-w-md mx-auto text-center">
                                Support us instantly using Credit/Debit Cards, Net Banking, Wallet, or UPI with secure Razorpay Checkout.
                            </p>
                        </div>

                        {/* Payment States UI */}
                        {paymentStatus === 'success' ? (
                            <div className="flex-grow flex flex-col items-center justify-center space-y-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                <CheckCircle2 className="h-12 w-12 text-emerald-400 animate-bounce" />
                                <div className="text-center">
                                    <h3 className="font-bold text-emerald-400 text-sm">Payment Successful!</h3>
                                    <p className="text-[11px] text-muted-foreground mt-1">Thank you for your generous support!</p>
                                </div>
                                {txnDetails && (
                                    <div className="text-left w-full text-[10px] text-muted-foreground/80 space-y-1 bg-black/20 p-2.5 rounded-lg border border-white/5 font-mono">
                                        <div className="truncate"><span className="text-white/40">Pay ID:</span> {txnDetails.paymentId}</div>
                                        <div className="truncate"><span className="text-white/40">Ord ID:</span> {txnDetails.orderId}</div>
                                    </div>
                                )}
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setPaymentStatus('idle')}
                                    className="text-xs border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400"
                                >
                                    Donate Again
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-5 flex-grow flex flex-col justify-center">
                                {/* Predefined Amounts */}
                                <div className="space-y-2">
                                    <Label className="text-xs text-muted-foreground">Select Amount</Label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {predefinedAmounts.map((amt) => (
                                            <Button
                                                key={amt}
                                                type="button"
                                                variant={amount === amt.toString() ? "default" : "outline"}
                                                onClick={() => setAmount(amt.toString())}
                                                className={`text-xs font-semibold h-9 ${
                                                    amount === amt.toString() 
                                                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 text-white" 
                                                    : "border-white/10 hover:bg-white/5"
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
                                        <Label htmlFor="custom-amount" className="text-xs text-muted-foreground">Or Enter Custom Amount</Label>
                                        <span className="text-[10px] text-muted-foreground/50">Min: ₹1</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-semibold">₹</span>
                                        <Input
                                            id="custom-amount"
                                            type="number"
                                            min="1"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="pl-7 bg-white/5 border-white/10 focus:border-indigo-500 text-sm h-10 text-foreground"
                                        />
                                    </div>
                                </div>

                                {/* Action button */}
                                <Button
                                    onClick={handleRazorpayPayment}
                                    disabled={isProcessing}
                                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold h-11 shadow-lg shadow-indigo-500/20 border-0 transition-all duration-200 mt-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Pay ₹{amount || "0"} Online
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        {/* Reassurance */}
                        <div className="flex flex-col gap-1 items-center justify-center pt-2 border-t border-white/[0.05]">
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                <span>Instant verification & confirmation</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                                <span>PCI-DSS compliant secure servers</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* ═══ Other Ways to Help ═══ */}
            <motion.div {...fadeUp}>
                <div className="space-y-5">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Other Ways to Support</h2>
                        <p className="text-sm text-muted-foreground">Can't donate right now? No worries — here's how else you can help.</p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {/* Spread the word */}
                        <Card className="group hover:border-indigo-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3 text-center">
                                <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6 text-indigo-400" />
                                </div>
                                <h3 className="font-bold text-sm">Spread the Word</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Share Coded with your classmates, in WhatsApp groups, or on Reddit. The more students who know, the more students we help.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Join Discord */}
                        <Card className="group hover:border-[#5865F2]/30 transition-colors">
                            <CardContent className="p-5 space-y-3 text-center">
                                <div className="mx-auto w-12 h-12 rounded-xl bg-[#5865F2]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="h-6 w-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-sm">Join our Discord</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Connect with other aspirants, get help, and stay updated with the latest features and announcements.
                                </p>
                                <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="border-[#5865F2]/30 hover:bg-[#5865F2]/10 text-[#5865F2] text-xs">
                                        <ExternalLink className="h-3 w-3 mr-1" /> Join Server
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>

                        {/* Report Bugs */}
                        <Card className="group hover:border-emerald-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3 text-center">
                                <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Code className="h-6 w-6 text-emerald-400" />
                                </div>
                                <h3 className="font-bold text-sm">Report Bugs</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Found something broken? Let us know on Reddit or Discord. Bug reports are incredibly valuable.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>

            {/* ═══ Thank You ═══ */}
            <motion.div {...fadeUp}>
                <div className="text-center p-8 rounded-3xl glass border border-white/5 bg-gradient-to-br from-pink-500/5 via-transparent to-amber-500/5 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />

                    <div className="relative space-y-4">
                        <Heart className="h-8 w-8 text-pink-400 fill-pink-400 mx-auto" />
                        <h2 className="text-2xl font-bold">Thank You ❤️</h2>
                        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                            Whether you donate, share the platform, or simply use it — you're the reason this project exists.
                            Every student who benefits from Coded makes all the late-night coding sessions worth it.
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
                            <Link to="/dashboard">
                                <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/20 border-0">
                                    Back to Dashboard <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Button>
                            </Link>
                            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="sm" className="border-[#5865F2]/30 hover:bg-[#5865F2]/10">
                                    <svg className="h-4 w-4 mr-1.5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                    </svg>
                                    Join Discord
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default Donate

import { SEO } from "@/components/SEO"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, ShieldCheck, RefreshCw, HelpCircle, Mail } from "lucide-react"

const PaymentPolicy = () => {
    const lastUpdated = "July 18, 2026"

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
            <SEO
                title="Payment & Refund Policy"
                description="Payment, refund, and cancellation policies for KCET Coded. Read about transaction processing, fees, and refund eligibility."
                url="https://kcet-coded2.vercel.app/payment-policy"
            />
            
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Payment & Refund Policy</h1>
                <p className="text-muted-foreground">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            <div className="grid gap-6">
                <Card className="border-white/10 bg-slate-900/20 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-indigo-400" />
                            1. Services & Pricing Structure
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                        <p>
                            <strong>KCET Coded</strong> offers both free features and paid/premium options designed to cover hosting, API resources, and database servers:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Premium Tools Activation:</strong> Unlocking the Mock Simulator, advanced Option Entry Table, and AI Counselor requires a one-time activation contribution of <strong>₹19</strong>.</li>
                            <li><strong>Voluntary Donations:</strong> Users can choose to support the platform further by contributing custom donation amounts (e.g. ₹50, ₹100, ₹250, etc.). All donations are completely voluntary.</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-slate-900/20 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <RefreshCw className="h-5 w-5 text-indigo-400" />
                            2. Refund & Cancellation Policy
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                        <p>
                            Due to the nature of digital goods and instant activation of premium features, standard refunds are handled under the following conditions:
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <strong>Double Debits:</strong> If your account is debited twice for a single activation/transaction, we will refund the duplicate payment.
                            </li>
                            <li>
                                <strong>Failed Activations:</strong> If you paid but the premium features did not unlock, please contact us immediately with your transaction/payment ID. If we cannot resolve the unlock manually, a full refund will be processed.
                            </li>
                            <li>
                                <strong>Refund Processing Timeline:</strong> Approved refunds will be credited back via the original payment channel within <strong>5-7 business days</strong> as per bank guidelines.
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-slate-900/20 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-indigo-400" />
                            3. Secure Payment Processing
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                        <p>
                            All transactions are securely processed through industry-standard payment gateways (e.g., Razorpay). We do not store or have direct access to your card details, UPI credentials, or bank login passwords. All payments comply with PCI-DSS security protocols.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-slate-900/20 backdrop-blur-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-indigo-400" />
                            4. Contact Support
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                        <p>
                            If you encounter any payment issues, checkout errors, or have questions regarding a charge, please contact our support channels immediately:
                        </p>
                        <div className="flex flex-col gap-2.5 mt-2 bg-white/[0.02] p-3 rounded-lg border border-white/5 font-medium">
                            <div className="flex items-center gap-2 text-xs">
                                <Mail className="h-4 w-4 text-orange-400" />
                                <span>Support Email: </span>
                                <a href="mailto:support@kcetcoded.in" className="text-indigo-400 hover:underline">support@kcetcoded.in</a>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-orange-400 font-bold font-mono">Reddit:</span>
                                <a href="https://www.reddit.com/user/Elegant_Compote9073/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">u/Elegant_Compote9073</a>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default PaymentPolicy

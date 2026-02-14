import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, FileCheck, Scale, Info, Construction } from "lucide-react"

const Terms = () => {
    const lastUpdated = "February 15, 2026"

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
                <p className="text-muted-foreground">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            {/* Critical Disclaimer - Front and Center */}
            <Alert variant="destructive" className="border-2 border-red-500/20 bg-red-500/5">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle className="text-lg font-bold">Important Disclaimer: Not an Official Government Site</AlertTitle>
                <AlertDescription className="mt-2 text-base leading-relaxed">
                    <strong>KCET Coded</strong> is an independent, community-driven project developed by students for students.
                    We are <strong>NOT affiliated, associated, authorized, endorsed by, or in any way officially connected with</strong> the Karnataka Examination Authority (KEA), the Government of Karnataka, or any of their subsidiaries or affiliates.
                    <br /><br />
                    The official website of the KEA can be found at <a href="https://cetonline.karnataka.gov.in/kea/" className="underline font-semibold hover:text-red-700" target="_blank" rel="noopener noreferrer">cetonline.karnataka.gov.in/kea/</a>.
                </AlertDescription>
            </Alert>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileCheck className="h-5 w-5" />
                            1. Acceptance of Terms
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <p>
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this websites particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            2. Accuracy of Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground space-y-3">
                        <p>
                            While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
                        </p>
                        <p>
                            <strong>Rank Predictions & Cutoffs:</strong> The data provided regarding previous year cutoffs and rank predictions is based on historical data.
                            <strong> Actual cutoff ranks for the current year may vary significantly</strong> due to factors such as the number of applicants, seat availability, and reservation policies.
                        </p>
                        <p>
                            Any reliance you place on such information is therefore strictly at your own risk.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Scale className="h-5 w-5" />
                            3. Limitation of Liability
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <p>
                            In no event will <strong>KCET Coded</strong>, its developers, or contributors be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
                        </p>
                        <p className="mt-2">
                            You are strongly advised to verify all critical information (dates, fees, eligibility) from the official KEA information brochure.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Construction className="h-5 w-5" />
                            4. "As Is" Basis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <p>
                            This service is provided on an "AS IS" and "AS AVAILABLE" basis. We reserve the right to modify, suspend, or discontinue the Service (in whole or in part) at any time, with or without notice to you. You agree that we will not be liable to you or to any third party for any modification, suspension, or discontinuation of the Service.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4">
                <p>
                    If you do not agree to abide by the above, please do not use this service.
                </p>
            </div>
        </div>
    )
}

export default Terms

import { SEO } from "@/components/SEO"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Lock, Eye, FileText, Globe, Server } from "lucide-react"

const PrivacyPolicy = () => {
    const lastUpdated = "February 15, 2026"

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      <SEO
        title="Privacy Policy"
        description="Privacy policy for KCET Coded. Learn how we handle your data, what information we collect, and your privacy rights."
        url="https://kcetcoded.dev/privacy"
      />
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="text-muted-foreground">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        Commitment to Privacy
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <p>
                        At <strong>KCET Coded</strong> ("we", "our", "us"), we prioritize the privacy regarding your personal information.
                        This Privacy Policy document contains types of information that is collected and recorded by KCET Coded and how we use it.
                    </p>
                    <p>
                        By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                    </p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Server className="h-5 w-5 text-blue-500" />
                            1. Data Collection & Storage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                            <strong>Local Storage:</strong> Most of your data (such as bookmarked colleges, rank prediction history, and checklist progress) is stored locally on your device using "Local Storage". We do not transmit this data to our servers.
                        </p>
                        <p>
                            <strong>No Personal Accounts:</strong> We do not currently require you to create an account or sign in. Therefore, we do not store your name, email, or phone number in our database.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Eye className="h-5 w-5 text-green-500" />
                            2. Log Files & Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                            Like many other websites, KCET Coded makes use of log files. These files merely log visitors to the site. The information collected includes:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Internet Protocol (IP) addresses</li>
                            <li>Browser type and version</li>
                            <li>Date and time stamp</li>
                            <li>Referring/exit pages</li>
                        </ul>
                        <p>
                            This data is used for analyzing trends, administering the site, and gathering demographic information to improve user experience. It is not linked to any information that is personally identifiable.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Lock className="h-5 w-5 text-orange-500" />
                            3. Cookies and Web Beacons
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                            KCET Coded uses 'cookies'. These cookies are used to store information including visitors' preferences (like theme mode) and the pages on the website that the visitor accessed or visited.
                        </p>
                        <p>
                            You can choose to disable cookies through your individual browser options.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Globe className="h-5 w-5 text-purple-500" />
                            4. Third Party Policies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>
                            KCET Coded's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party servers for more detailed information.
                        </p>
                        <p>
                            <strong>Google Analytics / Vercel Analytics:</strong> We may use these services to understand website traffic. They collect anonymous data about your visit.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        GDPR & CCPA Rights
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p>
                        Depending on your location, you may have rights regarding your data:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
                        <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
                        <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
                    </ul>
                    <p>
                        Since we rely primarily on Local Storage, you can exercise these rights instantly by clearing your browser cache/storage for our site.
                    </p>
                </CardContent>
            </Card>

            <div className="text-center text-sm text-muted-foreground pt-8">
                <p>If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>
                <p className="mt-2">Email: support@kcetcoded.com</p>
            </div>
        </div>
    )
}

export default PrivacyPolicy

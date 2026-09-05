import { SEO } from "@/components/SEO"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, FileText, Globe, Server, UserCheck, Key, Database, RefreshCw } from "lucide-react"

const PrivacyPolicy = () => {
    const lastUpdated = "August 17, 2026"

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
            <SEO
                title="Privacy Policy"
                description="Privacy policy for KCET Coded. Learn how we handle your data, authentication, optional accounts, and your privacy rights."
                url="https://kcetcoded.dev/privacy"
            />

            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
                <p className="text-muted-foreground text-sm">
                    Last Updated: {lastUpdated}
                </p>
            </div>

            {/* Commitment Card */}
            <Card className="border-2 border-primary/20 bg-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        Our Commitment to Student Privacy
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground text-sm leading-relaxed">
                    <p>
                        At <strong>KCET Coded</strong> ("we", "our", "us"), accessible from <a href="https://kcetcoded.dev" className="text-primary hover:underline font-semibold">kcetcoded.dev</a>, we are committed to protecting the personal data and privacy of every KCET aspirant.
                    </p>
                    <p>
                        This document outlines what data we collect, how it is stored, how authentication works, and your rights regarding your personal information. By using our website and services, you consent to this Privacy Policy.
                    </p>
                </CardContent>
            </Card>

            {/* Policy Sections Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* 1. Authentication & Optional Sign-In */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                            <UserCheck className="h-5 w-5 text-indigo-400" />
                            1. Optional User Accounts & Sign-In
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2.5 leading-relaxed">
                        <p>
                            <strong>100% Optional:</strong> Signing in is entirely optional. You can explore cutoff archives, simulate seat allocations, predict marks-vs-rank, and calculate fees without creating an account.
                        </p>
                        <p>
                            <strong>Why Sign In?</strong> When you choose to sign in (via Google OAuth or Email Magic Link), it allows you to:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Sync your Pro membership & access across multiple devices (phone, laptop, tablet).</li>
                            <li>Save counseling target ranks, reservation categories, and preferred colleges to your cloud profile.</li>
                            <li>Post and answer questions on the KCET Student Discussion Forum.</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* 2. Google OAuth & Collected Data */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                            <Key className="h-5 w-5 text-emerald-400" />
                            2. Information Collected via Sign-In
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2.5 leading-relaxed">
                        <p>
                            When you sign in with Google or Email, we only receive and store basic identity details necessary for account identification:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Email Address:</strong> To identify your account and restore your Pro subscription.</li>
                            <li><strong>Display Name & Profile Picture:</strong> To show your forum username and candidate badge.</li>
                            <li><strong>Zero Passwords:</strong> We utilize secure passwordless authentication (Google OAuth & Email OTP) — we never see or store passwords.</li>
                        </ul>
                        <p>
                            We will <strong>never sell, rent, or share</strong> your email address with third-party advertisers or spammers.
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Local Storage vs Cloud Storage */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                            <Database className="h-5 w-5 text-blue-400" />
                            3. Data Storage & Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2.5 leading-relaxed">
                        <p>
                            <strong>Local-First Storage:</strong> For guest visitors, all preferences, saved cutoffs, and mock choice lists remain stored solely in your browser's local storage.
                        </p>
                        <p>
                            <strong>Cloud Database Security:</strong> For logged-in users, authentication sessions and forum discussions are encrypted and securely stored using Supabase (PostgreSQL with Row Level Security).
                        </p>
                    </CardContent>
                </Card>

                {/* 4. Log Files & Analytics */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                            <Eye className="h-5 w-5 text-amber-400" />
                            4. Log Files & Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2.5 leading-relaxed">
                        <p>
                            Like most web applications, our servers automatically collect non-personally identifiable diagnostic information such as IP addresses, browser types, timestamps, and page visits.
                        </p>
                        <p>
                            This data is solely used to detect system errors, monitor server performance during high-traffic KEA result days, and improve user experience.
                        </p>
                    </CardContent>
                </Card>

                {/* 5. Cookies */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                            <Lock className="h-5 w-5 text-orange-400" />
                            5. Cookies & Session Tokens
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2.5 leading-relaxed">
                        <p>
                            We use standard browser cookies and local storage tokens to remember your theme preference (Dark/Light mode) and keep you signed in between browser tabs.
                        </p>
                        <p>
                            You can clear cookies or storage at any time through your browser settings.
                        </p>
                    </CardContent>
                </Card>

                {/* 6. Third-Party Services */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                            <Globe className="h-5 w-5 text-purple-400" />
                            6. Third-Party Service Providers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2.5 leading-relaxed">
                        <p>We rely on trusted third-party providers to power platform features:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Google Identity Services:</strong> For optional one-click sign-in.</li>
                            <li><strong>Supabase:</strong> For secure database hosting and token management.</li>
                            <li><strong>Razorpay:</strong> For secure payment gateway processing (we never see or store card/bank details).</li>
                            <li><strong>Vercel:</strong> For CDN and web hosting.</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* User Rights Card */}
            <Card className="border border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        7. Your Privacy Rights & Data Deletion
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <p>
                        You have complete control over your personal data:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5">
                        <li><strong>Right to Sign Out:</strong> You can sign out anytime with a single click from the Profile / Settings modal.</li>
                        <li><strong>Right to Access & Rectify:</strong> You can update your candidate nickname, target rank, or reservation category anytime.</li>
                        <li><strong>Right to Erasure (Account Deletion):</strong> You have the right to request full deletion of your user profile and forum history. Simply email us with your registered address.</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Contact Footer */}
            <div className="text-center text-sm text-muted-foreground pt-4 space-y-1">
                <p>If you have any questions, concerns, or data requests regarding this Privacy Policy, reach out to us:</p>
                <p className="font-semibold text-foreground">Email: <a href="mailto:support@kcetcoded.dev" className="text-primary hover:underline">support@kcetcoded.dev</a></p>
            </div>
        </div>
    )
}

export default PrivacyPolicy

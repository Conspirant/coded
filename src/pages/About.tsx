import { SEO } from "@/components/SEO"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    GraduationCap,
    Search,
    BarChart3,
    Calculator,
    Target,
    Bot,
    Calendar,
    FileText,
    Star,
    Users,
    Flame,
    Sword,
    MapPin,
    Bus,
    Gem,
    BookOpen,
    Newspaper,
    Heart,
    ArrowRight,
    Shield,
    Code,
    ExternalLink,
    Sparkles,
    Info,
    Clock
} from "lucide-react"

const About = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
            <SEO
                title="About"
                description="Learn about KCET Coded — a free, open-source platform built by a fellow KCET aspirant to help students navigate counseling with real data and powerful tools."
                url="https://kcet-coded2.vercel.app/about"
        keywords="about KCET Coded, KCET tools website, free KCET platform"
            />

            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl shadow-lg shadow-orange-500/25 mx-auto">
                    <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                    About <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">KCET Coded</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Built by a KCET aspirant, for KCET aspirants.
                </p>
            </div>

            {/* The Story */}
            <Card className="border-2 border-indigo-500/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Heart className="h-5 w-5 text-red-400" />
                        Why This Exists
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        Let's be real — KCET counseling is terrifying. You've spent months (or years) preparing for the exam, you finally get your rank, and then... you're staring at a massive PDF with tens of thousands of rows of cutoff data, trying to figure out which college you can actually get into. There's no good way to search, filter, or compare. You're opening five tabs, asking seniors in random WhatsApp groups, and still not confident in your choices.
                    </p>
                    <p>
                        I went through the same thing. That frustration is exactly why <strong className="text-foreground">KCET Coded</strong> exists.
                    </p>
                    <p>
                        This isn't some startup trying to sell you a "premium counseling package." It's not backed by any coaching institute. It's just one student who thought — <em>"what if I took all the publicly available data from KEA, organized it properly, and built tools that actually help?"</em>
                    </p>
                    <p>
                        Every feature on this site was built because I personally needed it, or because someone on <a href="https://www.reddit.com/r/KCETards/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">r/KCETards</a> or <a href="https://www.reddit.com/r/kcet/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">r/kcet</a> asked for it.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">100% Free</Badge>
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">No Sign-up Required</Badge>
                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Open Source</Badge>
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20">No Ads</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Data Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Shield className="h-5 w-5 text-emerald-400" />
                        Where Does the Data Come From?
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                    <p>
                        Every single cutoff rank, college name, branch code, and seat count on this website comes directly from the official <strong className="text-foreground">KEA (Karnataka Examinations Authority)</strong> PDF allotment documents. We don't estimate, we don't guess, and we definitely don't make numbers up.
                    </p>
                    <p>
                        The process is straightforward: we take the official PDFs that KEA publishes after each counseling round, extract every single row of data algorithmically (not by hand — we wrote scripts for that), clean it up, normalize all the messy formatting (like different college names across years, or branch codes that changed over time), and load it into the site.
                    </p>
                    <p>
                        We currently have data spanning <strong className="text-foreground">2023, 2024, and 2025</strong> cutoffs — that's Mock rounds, Round 1, Round 2, Round 3, and Extended rounds. For every college, every branch, every category, every round. That's hundreds of thousands of verified data points at your fingertips.
                    </p>
                    <p className="text-sm italic border-l-2 border-amber-500/50 pl-4 py-1">
                        Important: We always recommend you cross-verify with the official KEA PDFs. Every entry in our Cutoff Explorer has a "View Source" button that links directly to the exact page in the official PDF where that data was extracted from.
                    </p>
                </CardContent>
            </Card>

            {/* Features Section */}
            <div className="space-y-6">
                <div className="text-center space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        What Each Feature Does for You
                    </h2>
                    <p className="text-muted-foreground">
                        Every tool was built to solve a real problem that KCET aspirants face. Here's exactly what each one does and why it matters.
                    </p>
                </div>

                {/* Core Tools */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em]">Core Tools</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* College Finder */}
                    <Card className="group hover:border-blue-500/20 transition-colors">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shrink-0">
                                    <Search className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold">College Finder</h3>
                                        <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-400">FLAGSHIP</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">The problem:</strong> You know your rank, but you have no clue which colleges will accept you. The KEA PDF is 200+ pages and completely unsearchable. You'd have to manually scan thousands of rows to find colleges where your rank falls within the cutoff.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What it does:</strong> Enter your KCET rank, select your reservation category, and the College Finder instantly shows you every single college-branch combination where you're eligible — pulled directly from real historical cutoff data. You can filter by year, round, specific colleges, or specific courses.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What makes it special:</strong> Each result shows an "<span className="text-emerald-400">admission probability</span>" label (High / Moderate / Borderline) based on how comfortably your rank fits within the cutoff. There's a built-in <span className="text-indigo-400">sparkline trend chart</span> showing whether that particular college-branch cutoff has been rising or falling across years. You can <span className="text-amber-400">bookmark</span> colleges you like, <span className="text-purple-400">compare up to 3 colleges side-by-side</span>, <span className="text-cyan-400">verify any entry</span> against the official KEA PDF with one click, and <span className="text-pink-400">export your entire results as a professional PDF</span> to share with your parents or keep for reference during counseling.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cutoff Explorer */}
                    <Card className="group hover:border-emerald-500/20 transition-colors">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shrink-0">
                                    <BarChart3 className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h3 className="text-lg font-bold">Cutoff Explorer</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">The problem:</strong> You want to look up the exact cutoff rank for a specific college + branch + category + year + round combination. In the old world, you'd download a PDF, Ctrl+F with your fingers crossed, and hope the college name is spelled the same way across documents.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What it does:</strong> A full-blown database browser for every cutoff entry we have. Search by college name (or its abbreviation — typing "RVCE" or "PES" works), filter by year, round, category, branch, or institute. The results are displayed in a clean, paginated table with summary statistics showing how many results matched, how many institutes appeared, how many distinct courses, etc.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What makes it special:</strong> The smart search engine understands abbreviations and initialisms. Type "MSRIT" and it finds "M.S. Ramaiah Institute of Technology." Type "DSCE" and it finds "Dayananda Sagar College of Engineering." Every single row has a <span className="text-cyan-400">"View Source" button</span> that opens the exact page of the official KEA PDF where that data was extracted from — so you never have to take our word for it.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rank Predictor */}
                    <Card className="group hover:border-purple-500/20 transition-colors">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center shadow-lg shrink-0">
                                    <Calculator className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h3 className="text-lg font-bold">Rank Predictor</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">The problem:</strong> KCET results are out, you know your marks, but ranks haven't been released yet. Or you're preparing and you want to know "if I score X in KCET and Y in PUC, what rank can I expect?" There's no reliable tool out there that actually uses real data.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What it does:</strong> Uses the official <span className="text-indigo-400">KEA composite formula</span> (50% KCET score + 50% PUC percentage) calibrated against actual 2025 rank distribution data from community-sourced analysis. You just slide two sliders — your KCET PCM score out of 180 and your PUC PCM percentage — and it instantly shows your predicted rank for 2025 <em>and</em> an estimated 2026 rank (accounting for expected competition increase).
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What makes it special:</strong> It doesn't just give you one number — it gives you a <span className="text-emerald-400">confidence range</span> (low, medium, high estimates) with a visual gauge. There's a full <span className="text-amber-400">methodology page</span> showing exactly how the prediction works, with links to the original Reddit analysis post and credits to the community members who compiled the data. You can <span className="text-pink-400">download a shareable rank card as a PNG image</span>, <span className="text-green-400">share your prediction</span> with friends, save multiple results to track progress over time, and with one click navigate directly to College Finder pre-filled with your predicted rank.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mock Simulator */}
                    <Card className="group hover:border-orange-500/20 transition-colors">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shrink-0">
                                    <Target className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <h3 className="text-lg font-bold">Mock Simulator</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">The problem:</strong> The actual KCET counseling process is high-stakes and confusing. You have to list college preferences in a specific order, and the allotment depends on your rank, category, and the cutoffs of that round. If you mess up your preference order, you could end up in a college you didn't want — and there are no redos.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What it does:</strong> Simulates the exact KEA seat allotment process using real historical cutoff data. You enter your rank and category, then build a priority list of college-branch preferences (just like you would in the real counseling). Hit "Run Simulation" and it tells you exactly which college you would have gotten in each counseling round — Round 1, Round 2, Round 3, and Extended rounds.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What makes it special:</strong> Each preference you add gets an instant <span className="text-emerald-400">safety badge</span> (Safe / Likely / Risky / N/A) showing how realistic that choice is for your rank. The results are displayed as a beautiful <span className="text-indigo-400">round-by-round timeline</span> showing exactly where you'd get allotted in each round. You can reorder preferences by dragging, remove them, and re-run the simulation as many times as you want. It's basically a practice mode for the real thing — so when counseling day comes, you already know your best strategy.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Practice & Fun */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-[0.2em]">Prep & Fun</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Daily Challenge */}
                    <Card className="group hover:border-orange-500/20 transition-colors">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shrink-0">
                                    <Flame className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold">Daily Challenge</h3>
                                        <Badge variant="secondary" className="text-[10px] bg-orange-500/10 text-orange-400">GAMIFIED</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What it does:</strong> Every day, 5 fresh KCET-style questions appear. Complete them, build a streak, and track your consistency. It's designed to keep you in the habit of daily practice even when you don't feel like opening a textbook. The questions rotate daily so there's always something new.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">Why it helps:</strong> KCET prep isn't just about marathon study sessions — it's about consistency. Even 5 minutes a day keeps your brain engaged with the material. The streak system adds a small psychological push to not break the chain.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cutoff Clash */}
                    <Card className="group hover:border-pink-500/20 transition-colors">
                        <CardContent className="p-6 space-y-3">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shrink-0">
                                    <Sword className="h-6 w-6 text-white" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold">Cutoff Clash</h3>
                                        <Badge variant="secondary" className="text-[10px] bg-pink-500/10 text-pink-400">GAME</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">What it does:</strong> A Higher/Lower guessing game where you're shown two real colleges and you have to guess which one has a higher cutoff rank. It uses actual cutoff data, so you're learning real college rankings while playing.
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        <strong className="text-foreground">Why it helps:</strong> Most students have a rough idea about the top 10-15 colleges but are clueless about the 200+ others. This game passively teaches you which colleges are more competitive than others, which branches are popular, and how cutoffs vary by category — all while being actually fun to play. It's the kind of thing you play during a study break and accidentally learn something useful.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Support & Info */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <span className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em]">Counseling Support</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {/* AI Counselor */}
                        <Card className="group hover:border-purple-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shrink-0">
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold flex items-center gap-2">AI Counselor <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-400">BETA</Badge></h3>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    An AI chatbot trained on KCET knowledge that you can ask anything — "Which colleges are good for CS near Bangalore?", "Explain the KCET counseling process step by step", "Is RVCE better than MSRIT for ECE?". It uses multiple AI models (Gemini, Llama, Qwen, Nemotron, Mistral) for robust responses. Not perfect yet, but incredibly helpful for quick guidance when you don't know who to ask.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Round Tracker */}
                        <Card className="group hover:border-blue-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shrink-0">
                                        <Calendar className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="font-bold">Round Tracker</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Keeps track of all KCET counseling rounds with dates, deadlines, and what you need to do for each round. No more panicking because you missed a fee payment deadline or forgot which document to bring. It's your personal counseling calendar with all the important dates in one place.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Documents Guide */}
                        <Card className="group hover:border-green-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shrink-0">
                                        <FileText className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="font-bold">Documents Guide</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    A complete checklist of every document you'll need for counseling — SSLC marks card, PUC marks card, CET hall ticket, caste certificate, income certificate, Aadhar, photos, etc. Interactive checklist format so you can tick off documents as you collect them. No more last-minute scrambling on counseling day because you forgot one piece of paper.
                                </p>
                            </CardContent>
                        </Card>

                        {/* College Reviews */}
                        <Card className="group hover:border-amber-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-lg shrink-0">
                                        <Star className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="font-bold">College Reviews</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Real reviews from actual students about their colleges — infrastructure, placements, faculty quality, hostel life, canteen, everything. Unlike Google Reviews which are generic, these are written by engineering students specifically for people who are choosing between colleges. You can browse reviews by college, read detailed experiences, and submit your own once you're in.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Info Centre */}
                        <Card className="group hover:border-indigo-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shrink-0">
                                        <Info className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="font-bold">Info Centre</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Everything you need to know about KCET — from how the exam works, to how counseling happens, cutoff categories, reservation policies, seat matrix, fee structure, and frequently asked questions, all compiled in one place. Think of it as a comprehensive KCET encyclopedia that saves you from googling every small doubt.
                                </p>
                            </CardContent>
                        </Card>

                        {/* CET News */}
                        <Card className="group hover:border-cyan-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shrink-0">
                                        <Newspaper className="h-5 w-5 text-white" />
                                    </div>
                                    <h3 className="font-bold">CET News</h3>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Curated news updates about KCET — exam dates, result announcements, counseling schedule changes, policy updates, court orders affecting admissions, and everything else you'd want to know. No more scouring 10 different news websites for KCET-related updates.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Coded Labs */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-[0.2em]">Coded Labs</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                        These are experimental features you won't find on any other platform. We're testing new ideas to solve problems that nobody else has addressed.
                    </p>

                    <div className="grid gap-4 md:grid-cols-3">
                        {/* Squad Finder */}
                        <Card className="group hover:border-pink-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
                                        <Users className="h-5 w-5 text-pink-400" />
                                    </div>
                                    <h3 className="font-bold text-sm">Squad Finder</h3>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Enter your rank and your friends' ranks, and it finds colleges where <em>all of you</em> are eligible — so you don't have to split up. Because nobody wants to go to a new city alone if you can avoid it.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Metro Mapper */}
                        <Card className="group hover:border-green-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                        <MapPin className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h3 className="font-bold text-sm">Metro Mapper</h3>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Filters colleges that are within walking distance of a Namma Metro station — verified using Google Maps distances. Bangalore traffic is real. This helps you pick a college with a sane commute.
                                </p>
                            </CardContent>
                        </Card>

                        {/* BMTC Bus Mapper */}
                        <Card className="group hover:border-blue-500/20 transition-colors">
                            <CardContent className="p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                        <Bus className="h-5 w-5 text-blue-400" />
                                    </div>
                                    <h3 className="font-bold text-sm">BMTC Bus Mapper</h3>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Find colleges accessible via BMTC bus routes. Many students commute from different parts of Bangalore. This filters colleges based on public transport accessibility so you can make a practical choice, not just an academic one.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Philosophy */}
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-indigo-500/5">
                <CardContent className="p-6 sm:p-8 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Code className="h-5 w-5 text-purple-400" />
                        Our Philosophy
                    </h2>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                        <p>
                            <strong className="text-foreground">No gatekeeping.</strong> All the data on this site is publicly available from KEA. We just organized it better. We believe every student should have access to the same information — whether your parents can afford a ₹50,000 counseling session or not.
                        </p>
                        <p>
                            <strong className="text-foreground">No login walls.</strong> You don't need to sign up, create an account, or give us your phone number to use any tool. Your data stays on your device in local storage. We don't track you, we don't sell your data, because there's nothing to sell.
                        </p>
                        <p>
                            <strong className="text-foreground">Transparency over polish.</strong> We'd rather show you exactly where our data comes from (with links to the original PDF page) than present a slick dashboard hiding uncertain information. If our predictor has limitations, <Link to="/rank-predictor" className="text-indigo-400 hover:underline">we tell you</Link>. If a feature is experimental, it says "Beta." We don't pretend to be perfect.
                        </p>
                        <p>
                            <strong className="text-foreground">Community-driven.</strong> This project started on Reddit, and the community continues to shape what we build. Feature requests, bug reports, data corrections — most of what you see here came from student suggestions on <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">r/KCETCoded</a>.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Community */}
            <Card>
                <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="space-y-3 flex-1">
                            <h2 className="text-xl font-bold">Questions? Suggestions? Bugs?</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Head over to <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-medium hover:underline">r/KCETCoded</a> — our dedicated subreddit. You can report bugs, suggest features, or just discuss counseling strategies directly with the developer. Every meaningful suggestion gets considered, and many features you see on this site today started as a Reddit post.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-2">
                                <a href="https://www.reddit.com/r/KCETCoded/" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        r/KCETCoded
                                    </Button>
                                </a>
                                <a href="https://www.reddit.com/r/KCETards/" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        r/KCETards
                                    </Button>
                                </a>
                                <a href="https://www.reddit.com/r/kcet/" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="border-orange-500/20 hover:bg-orange-500/10 hover:border-orange-500/40">
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        r/kcet
                                    </Button>
                                </a>
                                <a href="https://discord.gg/QZcjtJKjYJ" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm" className="border-[#5865F2]/20 hover:bg-[#5865F2]/10 hover:border-[#5865F2]/40">
                                        <svg className="h-4 w-4 mr-2 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                        </svg>
                                        Discord
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="text-center text-xs text-muted-foreground space-y-2 pt-4">
                <p className="italic">
                    "KCET Coded" is an independent student project. We are <strong>not affiliated</strong> with KEA (Karnataka Examinations Authority), any college, Reddit, or any coaching institute.
                </p>
                <p>
                    All cutoff data is sourced from publicly available KEA documents. Always verify critical information from official KEA sources before making admission decisions.
                </p>
                <div className="flex items-center justify-center gap-4 pt-4">
                    <Link to="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>
                    <span className="text-white/10">•</span>
                    <Link to="/terms" className="text-indigo-400 hover:underline">Terms of Service</Link>
                    <span className="text-white/10">•</span>
                    <Link to="/donate" className="text-pink-400 hover:underline flex items-center gap-1">
                        <Heart className="h-3 w-3" /> Support Us
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default About

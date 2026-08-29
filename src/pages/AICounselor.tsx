import { SEO } from "@/components/SEO";
import { useState, useRef, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    ArrowUp,
    Sparkles,
    Loader2,
    MessageSquare,
    AlertCircle,
    Copy,
    Check,
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    RotateCcw,
    SlidersHorizontal,
    SquarePen,
    ShieldCheck,
    Database,
    Cpu,
    Scale,
    FileCheck,
    ExternalLink,
    Filter,
    Search
} from "lucide-react";
import { sendMessage, PROMPT_CATEGORIES, type Message } from "@/lib/gemini";
import type { StudentProfileFilters } from "@/lib/ai-tools";
import { COLLEGE_DATABASE } from "@/data/collegeDatabase";
import { CounselorRecommendationCard } from "@/components/counselor/CounselorRecommendationCard";
import { TesselAvatar } from "@/components/TesselAvatar";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from "react-router-dom";
import { toast } from "sonner";

export const ALL_KEA_CATEGORIES = [
    { code: "GM", label: "GM - General Merit" },
    { code: "3AG", label: "3AG - Category 3A (General)" },
    { code: "3AR", label: "3AR - Category 3A (Rural)" },
    { code: "3AK", label: "3AK - Category 3A (Kannada Medium)" },
    { code: "2AG", label: "2AG - Category 2A (General)" },
    { code: "2AR", label: "2AR - Category 2A (Rural)" },
    { code: "2AK", label: "2AK - Category 2A (Kannada Medium)" },
    { code: "1G", label: "1G - Category 1 (General)" },
    { code: "1R", label: "1R - Category 1 (Rural)" },
    { code: "1K", label: "1K - Category 1 (Kannada Medium)" },
    { code: "2BG", label: "2BG - Category 2B (General)" },
    { code: "2BR", label: "2BR - Category 2B (Rural)" },
    { code: "2BK", label: "2BK - Category 2B (Kannada Medium)" },
    { code: "3BG", label: "3BG - Category 3B (General)" },
    { code: "3BR", label: "3BR - Category 3B (Rural)" },
    { code: "3BK", label: "3BK - Category 3B (Kannada Medium)" },
    { code: "SCG", label: "SCG - Scheduled Caste (General)" },
    { code: "SCR", label: "SCR - Scheduled Caste (Rural)" },
    { code: "SCK", label: "SCK - Scheduled Caste (Kannada Medium)" },
    { code: "STG", label: "STG - Scheduled Tribe (General)" },
    { code: "STR", label: "STR - Scheduled Tribe (Rural)" },
    { code: "STK", label: "STK - Scheduled Tribe (Kannada Medium)" },
    { code: "GMK", label: "GMK - General Merit (Kannada Medium)" },
    { code: "GMR", label: "GMR - General Merit (Rural)" },
    { code: "SNQ", label: "SNQ - Supernumerary Quota (100% Waiver)" }
];

const AICounselor = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showTransparency, setShowTransparency] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [showCutoffBar, setShowCutoffBar] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [status, setStatus] = useState<string>("");
    const [selectedCategoryTab, setSelectedCategoryTab] = useState(0);

    // 269 College Dropdown Cutoff Selector State
    const [cutoffCollegeCode, setCutoffCollegeCode] = useState<string>("E126");
    const [cutoffYear, setCutoffYear] = useState<string>("2026");
    const [cutoffRound, setCutoffRound] = useState<string>("R2");
    const [cutoffCategory, setCutoffCategory] = useState<string>("3AG");
    const [collegeSearchOpen, setCollegeSearchOpen] = useState(false);

    // Student Profile Filters
    const [profileFilters, setProfileFilters] = useState<StudentProfileFilters>({
        rank: undefined,
        category: "GM",
        budgetQuota: "all",
        locationCommute: "all",
        streamFocus: "all",
    });

    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        }
    }, [messages, isLoading, status]);

    // Focus input on load
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
        }
    }, [input]);

    const handleSend = async (messageText?: string) => {
        const textToSend = messageText || input.trim();
        if (!textToSend || isLoading) return;

        setError(null);
        setInput("");
        setStatus("");

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }

        const userMessage: Message = {
            role: 'user',
            content: textToSend,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const result = await sendMessage(
                textToSend,
                messages,
                (newStatus) => setStatus(newStatus),
                profileFilters
            );

            const assistantMessage: Message = {
                role: 'assistant',
                content: result.response,
                timestamp: new Date(),
                recommendations: result.recommendations,
                actionChips: result.actionChips,
                quickReplies: result.quickReplies,
                stepType: result.stepType
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error('AI response error:', err);
            setError(err instanceof Error ? err.message : 'Failed to get response. Please try again.');
        } finally {
            setIsLoading(false);
            setStatus("");
            textareaRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
        textareaRef.current?.focus();
    };

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const isFilterActive = !!(
        profileFilters.rank ||
        profileFilters.category !== "GM" ||
        profileFilters.budgetQuota !== "all" ||
        profileFilters.locationCommute !== "all" ||
        profileFilters.streamFocus !== "all"
    );

    const counselorJsonLd = {
        "@graph": [
            {
                "@type": "WebApplication",
                "@id": "https://kcetcoded.dev/ai-counselor#app",
                "name": "TesselBot – KCET Cutoff & Admissions Counselor",
                "url": "https://kcetcoded.dev/ai-counselor",
                "applicationCategory": "EducationalApplication",
                "operatingSystem": "Web Browser",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "INR"
                },
                "featureList": [
                    "240,000+ official KEA cutoff records from 2023 to 2026",
                    "All 269 Karnataka engineering colleges and codes",
                    "All 25 reservation quotas including GM, 3A, 2A, 1G, SC, ST, SNQ, Rural, and Kannada medium",
                    "Deterministic cutoff query without hallucination",
                    "Option entry and choice filling decision tree analysis"
                ],
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "ratingCount": "720",
                    "bestRating": "5"
                }
            },
            {
                "@type": "FAQPage",
                "@id": "https://kcetcoded.dev/ai-counselor#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is TesselBot and how does it query KCET cutoffs?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "TesselBot is a specialized KCET and COMEDK admissions intelligence assistant. It uses deterministic database retrieval against 240,804 verified KEA cutoff records across all 269 Karnataka engineering institutions, returning exact closing ranks for all branches, rounds, and quotas."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Does TesselBot support all 25 KEA reservation category quotas?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. TesselBot supports all 25 official KEA quotas, including General Merit (GM, GMK, GMR), Category 1 (1G, 1K, 1R), Category 2A (2AG, 2AK, 2AR), Category 2B (2BG, 2BK, 2BR), Category 3A (3AG, 3AK, 3AR), Category 3B (3BG, 3BK, 3BR), SC (SCG, SCK, SCR), ST (STG, STK, STR), and Supernumerary Quota (SNQ)."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "How does TesselBot help with KCET Option Entry and Choice Filling?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "TesselBot analyzes your rank and target branches to recommend a structured choice-filling matrix: Dream Tier (top-tier colleges), Realistic Target Tier (safe matching bounds), and Guaranteed Safety Tier, while advising on KEA Choice 1, Choice 2, Choice 3, and Choice 4 rules."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What years of KCET cutoff data are covered in TesselBot?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "TesselBot covers verified historical cutoff benchmarks across 2023, 2024, 2025, and 2026 latest benchmarks across Mock Round 1, Mock Round 2, Round 1, Round 2, and Extended Round (Round 3)."
                        }
                    }
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://kcetcoded.dev/ai-counselor#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://kcetcoded.dev"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "TesselBot KCET Counselor",
                        "item": "https://kcetcoded.dev/ai-counselor"
                    }
                ]
            }
        ]
    };

    return (
        <>
            <SEO
                title="TesselBot – KCET & COMEDK Cutoff Intelligence & Admissions Counselor (2026)"
                description="Free, data-backed KCET & COMEDK admissions counselor. Access verified KEA cutoff benchmarks (2023–2026) across 269 Karnataka engineering colleges, 25 category quotas, and tactical choice filling guidance."
                url="https://kcetcoded.dev/ai-counselor"
                keywords="TesselBot, KCET AI Counselor, KCET Cutoff Bot, KCET counseling bot, KCET 2026 cutoffs, KCET 2025 cutoffs, KEA engineering cutoffs, KCET choice filling, Karnataka CET college predictor, COMEDK cutoff counselor, RVCE cutoffs, BMSCE cutoffs, MSRIT cutoffs, PES cutoffs, KCET rank cutoff analysis, 3AG cutoffs, 2AG cutoffs, SNQ fee waiver, KEA round 2 cutoffs, KEA option entry bot"
                jsonLd={counselorJsonLd}
            />

            {/* Model Training & Ground Truth Transparency Dialog (Deep Blue Theme) */}
            <Dialog open={showTransparency} onOpenChange={setShowTransparency}>
                <DialogContent className="sm:max-w-2xl border-slate-800 bg-[#0b111e] text-slate-100 max-h-[88vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <TesselAvatar size="sm" />
                            <div>
                                <DialogTitle className="text-base sm:text-lg font-semibold text-slate-100 flex items-center gap-2">
                                    <span>TesselBot 3.0 Training & Architecture</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono">
                                        VERIFIED 2025-26
                                    </span>
                                </DialogTitle>
                                <p className="text-xs text-slate-400">
                                    Public disclosure of data sources, ingestion pipeline, and counseling architecture.
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <DialogDescription asChild>
                        <div className="space-y-4 pt-2 text-xs text-slate-400 leading-relaxed">
                            {/* Stats Ribbon */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-base font-bold text-slate-100 font-mono">240,000+</div>
                                    <div className="text-[10px] text-slate-400 font-medium">Cutoff Records</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-base font-bold text-slate-100 font-mono">1,840+</div>
                                    <div className="text-[10px] text-slate-400 font-medium">Senior Threads</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-base font-bold text-slate-100 font-mono">269</div>
                                    <div className="text-[10px] text-slate-400 font-medium">Verified Colleges</div>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                                    <div className="text-base font-bold text-blue-400 font-mono">100%</div>
                                    <div className="text-[10px] text-blue-300 font-medium">Student-First</div>
                                </div>
                            </div>

                            {/* Data Ingestion Sources */}
                            <div className="space-y-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                    <Database className="h-3.5 w-3.5 text-blue-400" />
                                    1. Data Ingestion Sources & Knowledge Base
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                                            <FileCheck className="h-3.5 w-3.5 text-blue-400" />
                                            Official KEA Archives (2022–2026)
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            Official Mock, Round 1, Round 2, and Extended Round gazettes across all 269 colleges, 40+ engineering disciplines, and 11 reservation categories.
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                                            <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
                                            1,840+ Senior Discussions (r/kcet)
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            Senior ground truths from r/kcet, r/comedk, r/Btechtards, and r/PESU covering placement medians, attendance strictness, and transit feasibility.
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                                            <Scale className="h-3.5 w-3.5 text-blue-400" />
                                            2025–2026 KEA Policies & Quotas
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            Trained on 50:50 Board + KCET composite normalization, Supernumerary Quota (SNQ ₹20k fee waiver), NEET surrender shifts, and 15-digit RD verification.
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                                        <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                                            <Cpu className="h-3.5 w-3.5 text-blue-400" />
                                            COMEDK & College Fee Matrices
                                        </div>
                                        <p className="text-[11px] text-slate-400 leading-relaxed">
                                            Comparisons across Govt Quota (~₹1.1L), SNQ (~₹25k), and COMEDK (~₹2.8L+) fee tiers, plus Autonomous VTU vs Deemed University structures.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* How It Reasons (Zero-Hallucination Pipeline) */}
                            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                                    <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                                    2. Deterministic RAG Architecture
                                </span>
                                <div className="space-y-1.5 text-[11px] text-slate-300">
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-blue-400 font-mono">01.</span>
                                        <span><strong>Deterministic Database Query:</strong> Direct query against the 240,804 official cutoff records before generating natural language.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-blue-400 font-mono">02.</span>
                                        <span><strong>Context Injection:</strong> The exact official KEA institution code (e.g. RVCE E005, BMSCE E003) and multi-round trends are dynamically injected into model reasoning.</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold text-blue-400 font-mono">03.</span>
                                        <span><strong>Anti-Sponsorship Neutrality:</strong> Zero sponsored college placements or brand partnerships. Recommendations are strictly mathematical and student-first.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogDescription>

                    <DialogFooter className="pt-2 border-t border-slate-800">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setShowTransparency(false)}
                            className="w-full text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm transition-colors"
                        >
                            Understood • Back to Counseling
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Main Canvas with Deep Navy / Slate Blue Background (Dynamic Mobile Viewport) */}
            <div className="flex flex-col h-[100dvh] w-full bg-[#080d1a] text-slate-100 relative overflow-hidden">
                {/* Header Bar */}
                <div className="sticky top-0 z-20 flex items-center justify-between px-3 md:px-5 py-2.5 border-b border-slate-800/80 bg-[#080d1a]/95 backdrop-blur-md">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <SidebarTrigger className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors" />
                        <div className="flex items-center gap-2">
                            <TesselAvatar size="xs" />
                            <span className="text-slate-100 font-semibold tracking-tight text-sm">
                                TesselBot
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono font-semibold">
                                3.0
                            </span>
                        </div>

                        {/* Transparency Trigger Button */}
                        <button
                            onClick={() => setShowTransparency(true)}
                            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors ml-1 group"
                            title="View training data and dataset provenance"
                        >
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                            <span>2025–26 Verified Training</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setShowTransparency(true)}
                            className="sm:hidden inline-flex items-center justify-center h-8 px-2 text-xs font-medium bg-slate-900 text-slate-300 border border-slate-800 rounded-lg"
                            title="Training Transparency"
                        >
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                        </button>

                        <Button
                            variant={showCutoffBar ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => {
                                setShowCutoffBar(!showCutoffBar);
                                if (showFilters) setShowFilters(false);
                            }}
                            className={`h-8 px-2.5 sm:px-3 text-xs font-medium gap-1.5 rounded-lg transition-colors ${
                                showCutoffBar 
                                    ? "bg-blue-600 text-white font-semibold shadow-md" 
                                    : "bg-blue-950/40 text-blue-300 hover:text-white hover:bg-blue-900/60 border border-blue-800/40"
                            }`}
                        >
                            <Filter className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                            <span className="hidden sm:inline">Cutoff Explorer (269)</span>
                            <span className="sm:hidden text-[11px]">Cutoffs</span>
                        </Button>

                        <Button
                            variant={isFilterActive ? "secondary" : "ghost"}
                            size="sm"
                            onClick={() => {
                                setShowFilters(!showFilters);
                                if (showCutoffBar) setShowCutoffBar(false);
                            }}
                            className={`h-8 px-3 text-xs font-medium gap-1.5 rounded-lg transition-colors ${
                                isFilterActive 
                                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold" 
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                            }`}
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                            <span className="hidden sm:inline">Preferences</span>
                            {isFilterActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                            )}
                            {showFilters ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearChat}
                            className="h-8 w-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
                            title="New chat"
                        >
                            <SquarePen className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Expandable Preferences Drawer */}
                {showFilters && (
                    <div className="px-4 py-3.5 border-b border-slate-800 bg-[#0b111e]/95 backdrop-blur-md animate-fade-in-up z-10">
                        <div className="max-w-3xl mx-auto space-y-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 text-xs">
                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                        KCET Rank
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 14500"
                                        value={profileFilters.rank || ""}
                                        onChange={(e) =>
                                            setProfileFilters({
                                                ...profileFilters,
                                                rank: e.target.value ? parseInt(e.target.value) : undefined,
                                            })
                                        }
                                        className="h-8 text-xs font-mono bg-slate-950 border-slate-800 focus:border-blue-500 text-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                        Category Quota
                                    </label>
                                    <Select
                                        value={profileFilters.category}
                                        onValueChange={(val) =>
                                            setProfileFilters({ ...profileFilters, category: val })
                                        }
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0b111e] border-slate-800 text-slate-100">
                                            <SelectItem value="GM">GM (General Merit)</SelectItem>
                                            <SelectItem value="GMR">GMR (GM Rural)</SelectItem>
                                            <SelectItem value="GMK">GMK (GM Kannada)</SelectItem>
                                            <SelectItem value="2AG">2AG (Category 2A)</SelectItem>
                                            <SelectItem value="2AR">2AR (2A Rural)</SelectItem>
                                            <SelectItem value="2BG">2BG (Category 2B)</SelectItem>
                                            <SelectItem value="3AG">3AG (Category 3A)</SelectItem>
                                            <SelectItem value="3BG">3BG (Category 3B)</SelectItem>
                                            <SelectItem value="SCG">SCG (Schedule Caste)</SelectItem>
                                            <SelectItem value="STG">STG (Schedule Tribe)</SelectItem>
                                            <SelectItem value="1G">1G (Category 1)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                        Location
                                    </label>
                                    <Select
                                        value={profileFilters.locationCommute}
                                        onValueChange={(val) =>
                                            setProfileFilters({ ...profileFilters, locationCommute: val })
                                        }
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500">
                                            <SelectValue placeholder="Location" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0b111e] border-slate-800 text-slate-100">
                                            <SelectItem value="all">Any Karnataka</SelectItem>
                                            <SelectItem value="metro">Bengaluru (Metro)</SelectItem>
                                            <SelectItem value="bangalore">Bengaluru City</SelectItem>
                                            <SelectItem value="mysore">Mysuru</SelectItem>
                                            <SelectItem value="mangalore">Mangaluru</SelectItem>
                                            <SelectItem value="north-karnataka">North Karnataka</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                        Budget / Quota
                                    </label>
                                    <Select
                                        value={profileFilters.budgetQuota}
                                        onValueChange={(val) =>
                                            setProfileFilters({ ...profileFilters, budgetQuota: val })
                                        }
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500">
                                            <SelectValue placeholder="Budget" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0b111e] border-slate-800 text-slate-100">
                                            <SelectItem value="all">All Quotas</SelectItem>
                                            <SelectItem value="govt">Govt Only (&lt;₹60k/yr)</SelectItem>
                                            <SelectItem value="private">Govt Quota in Pvt (&lt;₹1.2L/yr)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                                        Stream Focus
                                    </label>
                                    <Select
                                        value={profileFilters.streamFocus}
                                        onValueChange={(val) =>
                                            setProfileFilters({ ...profileFilters, streamFocus: val })
                                        }
                                    >
                                        <SelectTrigger className="h-8 text-xs bg-slate-950 border-slate-800 text-slate-100 focus:border-blue-500">
                                            <SelectValue placeholder="Stream" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0b111e] border-slate-800 text-slate-100">
                                            <SelectItem value="all">All Streams</SelectItem>
                                            <SelectItem value="tech">Tech (CSE/ISE/AI/DS)</SelectItem>
                                            <SelectItem value="circuital">Circuital (ECE/EEE/EIE)</SelectItem>
                                            <SelectItem value="core">Core (Mech/Civil/Aero)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {isFilterActive && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                                    <span className="font-medium text-slate-300 text-[10px]">Active Filters:</span>
                                    {profileFilters.rank && (
                                        <Badge variant="outline" className="text-[10px] font-mono py-0 h-4 border-blue-500/30 text-blue-300 bg-blue-500/10">
                                            Rank #{profileFilters.rank.toLocaleString()}
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="text-[10px] py-0 h-4 border-blue-500/30 text-blue-300 bg-blue-500/10">
                                        {profileFilters.category}
                                    </Badge>
                                    {profileFilters.locationCommute !== 'all' && (
                                        <Badge variant="outline" className="text-[10px] py-0 h-4 border-blue-500/30 text-blue-300 bg-blue-500/10">
                                            {profileFilters.locationCommute}
                                        </Badge>
                                    )}
                                    {profileFilters.streamFocus !== 'all' && (
                                        <Badge variant="outline" className="text-[10px] py-0 h-4 border-blue-500/30 text-blue-300 bg-blue-500/10">
                                            {profileFilters.streamFocus.toUpperCase()}
                                        </Badge>
                                    )}
                                    <button
                                        onClick={() =>
                                            setProfileFilters({
                                                rank: undefined,
                                                category: "GM",
                                                budgetQuota: "all",
                                                locationCommute: "all",
                                                streamFocus: "all",
                                            })
                                        }
                                        className="text-[10px] text-slate-400 hover:text-blue-400 inline-flex items-center gap-1 ml-auto transition-colors"
                                    >
                                        <RotateCcw className="h-2.5 w-2.5" />
                                        Reset
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 269-College Quick Cutoff Dropdown Bar */}
                {showCutoffBar && (
                    <div className="p-3 border-b border-blue-900/40 bg-[#080d1a]/95 backdrop-blur-md animate-fade-in-up z-20">
                        <div className="max-w-4xl mx-auto space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-1.5">
                                    <Filter className="w-3.5 h-3.5 text-blue-400" />
                                    <span>Cutoff Explorer (All 269 Colleges & 25 Quotas)</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">240,804 Live Records</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                                {/* 1. College Dropdown (All 269 Colleges) */}
                                <div className="relative">
                                    <Popover open={collegeSearchOpen} onOpenChange={setCollegeSearchOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full h-8 justify-between text-[11px] bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white font-normal truncate"
                                            >
                                                <span className="truncate font-mono">
                                                    {cutoffCollegeCode} - {COLLEGE_DATABASE.find(c => c.code.toUpperCase() === cutoffCollegeCode.toUpperCase())?.shortName || 'Select College'}
                                                </span>
                                                <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] sm:w-[360px] p-0 bg-slate-950 border-slate-800 text-slate-200 z-50">
                                            <Command className="bg-slate-950 text-slate-200">
                                                <CommandInput placeholder="Search 269 colleges (e.g. E126, RVCE, BMSIT)..." className="h-8 text-xs text-slate-200" />
                                                <CommandList className="max-h-56">
                                                    <CommandEmpty className="text-xs p-2 text-slate-500">No college found.</CommandEmpty>
                                                    <CommandGroup heading="All 269 Karnataka Colleges">
                                                        {COLLEGE_DATABASE.map((c) => (
                                                            <CommandItem
                                                                key={c.code}
                                                                value={`${c.code} ${c.name} ${c.shortName} ${c.city}`}
                                                                onSelect={() => {
                                                                    setCutoffCollegeCode(c.code);
                                                                    setCollegeSearchOpen(false);
                                                                }}
                                                                className="text-xs hover:bg-slate-800 cursor-pointer flex items-center justify-between"
                                                            >
                                                                <div className="flex flex-col truncate">
                                                                    <span className="font-semibold text-slate-100 font-mono text-[11px]">
                                                                        {c.code} - {c.shortName}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 truncate">
                                                                        {c.name} ({c.city})
                                                                    </span>
                                                                </div>
                                                                {cutoffCollegeCode === c.code && (
                                                                    <Check className="ml-2 h-3.5 w-3.5 text-blue-400 shrink-0" />
                                                                )}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* 2. Year Select */}
                                <Select 
                                    value={cutoffYear} 
                                    onValueChange={(yr) => {
                                        setCutoffYear(yr);
                                        if (yr === "2026" && cutoffRound === "R3") {
                                            setCutoffRound("R2");
                                        } else if (yr === "2023" && (cutoffRound === "MOCK" || cutoffRound === "MOCK2")) {
                                            setCutoffRound("R2");
                                        }
                                    }}
                                >
                                    <SelectTrigger className="h-8 text-[11px] bg-slate-900 border-slate-800 text-slate-200">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-950 border-slate-800 text-slate-200 z-50">
                                        <SelectItem value="2026">2026 Latest Benchmark</SelectItem>
                                        <SelectItem value="2025">2025 Cutoffs</SelectItem>
                                        <SelectItem value="2024">2024 Cutoffs</SelectItem>
                                        <SelectItem value="2023">2023 Cutoffs</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* 3. Round Select (Filtered by Year) */}
                                <Select value={cutoffRound} onValueChange={setCutoffRound}>
                                    <SelectTrigger className="h-8 text-[11px] bg-slate-900 border-slate-800 text-slate-200">
                                        <SelectValue placeholder="Round" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-950 border-slate-800 text-slate-200 z-50">
                                        <SelectItem value="R2">Round 2 (R2)</SelectItem>
                                        <SelectItem value="R1">Round 1 (R1)</SelectItem>
                                        {cutoffYear !== "2026" && (
                                            <SelectItem value="R3">Round 3 / Extended</SelectItem>
                                        )}
                                        {cutoffYear !== "2023" && (
                                            <SelectItem value="MOCK">Mock Round</SelectItem>
                                        )}
                                        {cutoffYear === "2026" && (
                                            <SelectItem value="MOCK2">Mock Round 2</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>

                                {/* 4. Category Select (All 25 Categories) */}
                                <Select value={cutoffCategory} onValueChange={setCutoffCategory}>
                                    <SelectTrigger className="h-8 text-[11px] bg-slate-900 border-slate-800 text-slate-200">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-950 border-slate-800 text-slate-200 max-h-60 z-50">
                                        {ALL_KEA_CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.code} value={cat.code} className="text-xs">
                                                {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-slate-400">
                                    Selected: <span className="font-mono text-blue-300 font-medium">{cutoffCollegeCode}</span> • <span className="font-mono text-blue-300">{cutoffYear}</span> • <span className="font-mono text-blue-300">{cutoffRound}</span> • <span className="font-mono text-blue-300">{cutoffCategory}</span>
                                </span>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        const col = COLLEGE_DATABASE.find(c => c.code.toUpperCase() === cutoffCollegeCode.toUpperCase());
                                        const colName = col ? col.shortName : cutoffCollegeCode;
                                        handleSend(`${cutoffCollegeCode} ${colName} ${cutoffCategory} Round ${cutoffRound} ${cutoffYear} cutoffs`);
                                    }}
                                    className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm"
                                >
                                    <Sparkles className="w-3 h-3 mr-1 text-blue-200" />
                                    View Official Cutoffs
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Conversation Viewport */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 px-3 md:px-6">
                    {messages.length === 0 ? (
                        // Deep Slate-Blue Hero Screen
                        <div className="flex flex-col items-center justify-center py-10 md:py-16 max-w-2xl mx-auto text-center animate-fade-in-up">
                            <div className="mb-4">
                                <TesselAvatar size="xl" className="border border-slate-800 shadow-md" />
                            </div>

                            <div className="space-y-2 mb-6">
                                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
                                    TesselBot – KCET & COMEDK Admissions Counselor
                                </h1>
                                <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                                    Query 240,804 verified KEA cutoff records across all 269 colleges, all 25 reservation quotas (GM, 3A, 2A, 1G, SC, ST, SNQ, Rural, Kannada), and counseling choice-filling strategies.
                                </p>
                            </div>

                            {/* Prompt Categories */}
                            <div className="w-full space-y-3.5">
                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    {PROMPT_CATEGORIES.map((cat, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedCategoryTab(idx)}
                                            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                                                selectedCategoryTab === idx
                                                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold"
                                                    : "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80"
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                                    {PROMPT_CATEGORIES[selectedCategoryTab].prompts.map((prompt, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSend(prompt)}
                                            className="p-3 text-xs rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 hover:border-blue-500/40 transition-colors text-left text-slate-300 hover:text-slate-100 leading-relaxed group"
                                        >
                                            <span className="block font-medium">
                                                {prompt}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Message Stream with Slate-Blue Theme
                        <div className="max-w-3xl mx-auto py-5 space-y-6">
                            {messages.map((message, index) => (
                                <div key={index} className="space-y-1.5 animate-fade-in-up">
                                    {message.role === 'user' ? (
                                        // User Message Bubble (Slate-800 with subtle Blue Accent)
                                        <div className="flex justify-end">
                                            <div className="max-w-[90%] sm:max-w-[75%] rounded-2xl rounded-tr-xs px-3.5 sm:px-4 py-2 sm:py-2.5 bg-slate-800 text-slate-100 border border-slate-700/80 font-normal text-xs md:text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                                                {message.content}
                                            </div>
                                        </div>
                                    ) : (
                                        // Assistant Message Card (Deep Slate-Blue Minimalist)
                                        <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-3.5 sm:p-5 space-y-3 sm:space-y-3.5 shadow-sm">
                                            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                                                <div className="flex items-center gap-2">
                                                    <TesselAvatar size="xs" />
                                                    <span className="text-xs font-semibold text-slate-200 tracking-tight">TesselBot</span>
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono">
                                                        VERIFIED DATA
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>

                                            {/* Markdown Content */}
                                            <div className="text-xs md:text-sm leading-relaxed text-slate-200 space-y-3 overflow-x-auto">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        table: ({ node, ...props }) => (
                                                            <div className="my-3 overflow-hidden rounded-xl border border-slate-800 bg-[#080d1a]/95 shadow-md">
                                                                <div className="overflow-x-auto w-full touch-pan-x scrollbar-thin scrollbar-thumb-slate-800">
                                                                    <table className="w-full text-left text-xs border-collapse min-w-[320px] sm:min-w-[460px]" {...props} />
                                                                </div>
                                                            </div>
                                                        ),
                                                        thead: ({ node, ...props }) => (
                                                            <thead className="bg-slate-900 text-blue-400 font-semibold border-b border-slate-800 text-[10px] sm:text-[11px] uppercase tracking-wider" {...props} />
                                                        ),
                                                        tbody: ({ node, ...props }) => (
                                                            <tbody className="divide-y divide-slate-800/60" {...props} />
                                                        ),
                                                        tr: ({ node, ...props }) => (
                                                            <tr className="hover:bg-slate-800/50 transition-colors even:bg-slate-900/40" {...props} />
                                                        ),
                                                        th: ({ node, ...props }) => (
                                                            <th className="px-3.5 sm:px-4 py-2.5 font-semibold text-blue-400 whitespace-nowrap text-[10px] sm:text-[11px] uppercase tracking-wider" {...props} />
                                                        ),
                                                        td: ({ node, ...props }) => (
                                                            <td className="px-3.5 sm:px-4 py-2.5 font-normal text-slate-200 border-r border-slate-800/40 last:border-r-0 text-xs sm:text-sm" {...props} />
                                                        ),
                                                        h1: ({ node, ...props }) => (
                                                            <h1 className="text-base md:text-lg font-bold text-slate-100 tracking-tight pt-2 pb-1 border-b border-slate-800" {...props} />
                                                        ),
                                                        h2: ({ node, ...props }) => (
                                                            <h2 className="text-sm md:text-base font-bold text-slate-100 tracking-tight pt-2 pb-1" {...props} />
                                                        ),
                                                        h3: ({ node, ...props }) => (
                                                            <h3 className="text-xs md:text-sm font-semibold text-blue-400 tracking-tight pt-1.5" {...props} />
                                                        ),
                                                        p: ({ node, ...props }) => (
                                                            <p className="leading-relaxed text-slate-300 font-normal" {...props} />
                                                        ),
                                                        ul: ({ node, ...props }) => (
                                                            <ul className="list-disc list-outside pl-4 space-y-1.5 text-slate-300" {...props} />
                                                        ),
                                                        ol: ({ node, ...props }) => (
                                                            <ol className="list-decimal list-outside pl-4 space-y-1.5 text-slate-300" {...props} />
                                                        ),
                                                        li: ({ node, ...props }) => (
                                                            <li className="leading-relaxed text-slate-300" {...props} />
                                                        ),
                                                        blockquote: ({ node, ...props }) => (
                                                            <blockquote className="border-l-2 border-blue-500 pl-3 py-1 text-slate-300 italic bg-blue-950/20 rounded-r-lg my-2 text-xs" {...props} />
                                                        ),
                                                        code: ({ node, inline, ...props }: any) =>
                                                            inline ? (
                                                                <code className="px-1.5 py-0.5 rounded bg-slate-800 text-blue-300 font-mono text-[11px] border border-slate-700/60" {...props} />
                                                            ) : (
                                                                <div className="my-2.5 rounded-xl border border-slate-800 bg-[#080d1a] p-3 overflow-x-auto">
                                                                    <code className="text-slate-200 font-mono text-xs block leading-relaxed" {...props} />
                                                                </div>
                                                            ),
                                                        strong: ({ node, ...props }) => (
                                                            <strong className="font-semibold text-slate-100" {...props} />
                                                        )
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>

                                            {/* In-Message 269-College Searchable Dropdown */}
                                            {message.stepType === 'college' && (
                                                <div className="pt-2.5 pb-1 border-t border-slate-800/60 space-y-2">
                                                    <div className="text-[10px] uppercase font-mono font-semibold text-blue-400/90 tracking-wider">
                                                        Search & Select Any of all 269 Colleges:
                                                    </div>
                                                    <div className="max-w-md">
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    role="combobox"
                                                                    className="w-full h-9 justify-between text-xs bg-slate-900/90 border-blue-800/50 text-slate-200 hover:bg-slate-800 hover:text-white font-normal truncate shadow-sm"
                                                                >
                                                                    <span className="truncate flex items-center gap-1.5 font-mono text-slate-300">
                                                                        <Search className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                                        Choose any College from all 269...
                                                                    </span>
                                                                    <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-60" />
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-[calc(100vw-2.5rem)] sm:w-[420px] max-w-md p-0 bg-slate-950 border-slate-800 text-slate-200 z-50">
                                                                <Command className="bg-slate-950 text-slate-200">
                                                                    <CommandInput placeholder="Type college name or code (e.g. E126, RVCE, BMSIT)..." className="h-9 text-xs text-slate-200" />
                                                                    <CommandList className="max-h-64">
                                                                        <CommandEmpty className="text-xs p-3 text-slate-500">No college found.</CommandEmpty>
                                                                        <CommandGroup heading="All 269 Karnataka Engineering Colleges">
                                                                            {COLLEGE_DATABASE.map((c) => (
                                                                                <CommandItem
                                                                                    key={c.code}
                                                                                    value={`${c.code} ${c.name} ${c.shortName} ${c.city}`}
                                                                                    onSelect={() => {
                                                                                        handleSend(`${c.code} ${c.shortName || c.name}`);
                                                                                    }}
                                                                                    className="text-xs hover:bg-blue-600/20 cursor-pointer flex items-center justify-between py-2"
                                                                                >
                                                                                    <div className="flex flex-col truncate">
                                                                                        <span className="font-semibold text-slate-100 font-mono text-xs">
                                                                                            {c.code} - {c.shortName}
                                                                                        </span>
                                                                                        <span className="text-[10px] text-slate-400 truncate">
                                                                                            {c.name} ({c.city})
                                                                                        </span>
                                                                                    </div>
                                                                                </CommandItem>
                                                                            ))}
                                                                        </CommandGroup>
                                                                    </CommandList>
                                                                </Command>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>
                                                </div>
                                            )}

                                            {/* In-Message Category Dropdown */}
                                            {message.stepType === 'category' && (
                                                <div className="pt-2.5 pb-1 border-t border-slate-800/60 space-y-2">
                                                    <div className="text-[10px] uppercase font-mono font-semibold text-blue-400/90 tracking-wider">
                                                        Select from all 25 Reservation Quotas:
                                                    </div>
                                                    <div className="max-w-xs">
                                                        <Select onValueChange={(val) => handleSend(val)}>
                                                            <SelectTrigger className="h-9 text-xs bg-slate-900/90 border-blue-800/50 text-slate-200">
                                                                <SelectValue placeholder="Choose any Category Quota (All 25)..." />
                                                            </SelectTrigger>
                                                            <SelectContent className="bg-slate-950 border-slate-800 text-slate-200 max-h-64 z-50">
                                                                {ALL_KEA_CATEGORIES.map((cat) => (
                                                                    <SelectItem key={cat.code} value={cat.code} className="text-xs">
                                                                        {cat.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            )}

                                            {/* In-Chat Quick Reply Chips */}
                                            {message.quickReplies && message.quickReplies.length > 0 && (
                                                <div className="pt-2.5 border-t border-slate-800/60">
                                                    <div className="text-[10px] uppercase font-mono font-semibold text-blue-400/90 tracking-wider mb-2">
                                                        Select an option:
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {message.quickReplies.map((qr, qIdx) => (
                                                            <button
                                                                key={qIdx}
                                                                onClick={() => handleSend(qr)}
                                                                className="px-3 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-600 hover:text-white border border-blue-800/40 text-xs text-blue-200 font-medium transition-all shadow-sm active:scale-95"
                                                            >
                                                                {qr}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Action Chips */}
                                            {message.actionChips && message.actionChips.length > 0 && (
                                                <div className="pt-2 border-t border-slate-800/60">
                                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                                        Recommended Tools & Actions
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {message.actionChips.map((chip, chipIndex) => (
                                                            <Link
                                                                key={chipIndex}
                                                                to={chip.url}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white transition-colors"
                                                            >
                                                                <span>{chip.label}</span>
                                                                <ExternalLink className="h-3 w-3 text-slate-400" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recommendations Cards */}
                                            {message.recommendations && message.recommendations.length > 0 && (
                                                <div className="pt-3 border-t border-slate-800/60 space-y-2">
                                                    <div className="text-xs font-semibold text-slate-300">
                                                        Predicted College Options ({message.recommendations.length})
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                        {message.recommendations.map((rec, recIndex) => (
                                                            <CounselorRecommendationCard key={recIndex} data={rec} />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Footer Actions */}
                                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                                                <span>Data-backed tactical response</span>
                                                <button
                                                    onClick={() => copyToClipboard(message.content, index)}
                                                    className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors px-2 py-0.5 rounded hover:bg-slate-800"
                                                >
                                                    {copiedIndex === index ? (
                                                        <>
                                                            <Check className="h-3 w-3 text-emerald-400" />
                                                            <span className="text-emerald-400">Copied</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="h-3 w-3" />
                                                            <span>Copy</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 space-y-2 animate-fade-in-up shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <TesselAvatar size="xs" />
                                        <span className="text-xs font-semibold text-slate-300">TesselBot</span>
                                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-blue-500/30 text-blue-400 bg-blue-500/10 font-mono">
                                            THINKING
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                                        <span>{status || "Synthesizing response..."}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>

                {/* Input Area (Mobile Safe-Area Optimized with Slate-Blue styling) */}
                <div className="px-3 sm:px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 bg-[#080d1a]">
                    <div className="max-w-3xl mx-auto space-y-1.5">
                        <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/40 transition-colors p-2 sm:p-2.5">
                            {/* Textarea */}
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask TesselBot (e.g. 'E126 BMSIT CSE 3AG Round 2 2026' or 'Rank 12000 GM colleges')..."
                                disabled={isLoading}
                                rows={1}
                                className="w-full resize-none bg-transparent border-0 focus:outline-none focus:ring-0 text-xs md:text-sm px-2 py-1 max-h-40 min-h-[36px] text-slate-100 placeholder:text-slate-500 leading-relaxed font-normal"
                            />

                            {/* Controls */}
                            <div className="flex items-center justify-between pt-1 px-1">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                            isFilterActive
                                                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent"
                                        }`}
                                    >
                                        <SlidersHorizontal className="h-3 w-3 text-slate-400" />
                                        <span>
                                            {isFilterActive ? `${profileFilters.category}${profileFilters.rank ? ` • #${profileFilters.rank.toLocaleString()}` : ''}` : 'Preferences'}
                                        </span>
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed shrink-0 shadow-sm"
                                    title="Send message"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    ) : (
                                        <ArrowUp className="h-4 w-4 stroke-[2.5]" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                            <span>TesselBot can make mistakes. Verify critical dates and cutoffs on official portals.</span>
                            <span className="hidden sm:inline font-mono text-[10px]">Enter to send • Shift+Enter for new line</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AICounselor;

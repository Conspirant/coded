import { useState, useEffect, useMemo } from "react";
import { CutoffService, type CutoffData } from "@/lib/cutoff-service";
import { COLLEGE_DATABASE, type CollegeInfo } from "@/data/collegeDatabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Search,
    Building2,
    Calendar,
    Layers,
    Users,
    Sparkles,
    Check,
    RotateCcw,
    Copy,
    ArrowRight,
    Filter,
    ChevronRight,
    GraduationCap,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

interface InteractiveCutoffWizardProps {
    onSelectForChat?: (query: string) => void;
    onClose?: () => void;
}

export const InteractiveCutoffWizard = ({
    onSelectForChat,
    onClose
}: InteractiveCutoffWizardProps) => {
    // Dataset state
    const [allCutoffs, setAllCutoffs] = useState<CutoffData[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Step state: 1 = College, 2 = Year, 3 = Round, 4 = Category, 5 = Results
    const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

    // Filter states
    const [searchCollege, setSearchCollege] = useState("");
    const [selectedCollegeCode, setSelectedCollegeCode] = useState<string>("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedRound, setSelectedRound] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [branchSearch, setBranchSearch] = useState("");
    const [copied, setCopied] = useState(false);

    // Load master cutoff data
    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setIsLoadingData(true);
            try {
                const data = await CutoffService.loadCutoffs();
                if (isMounted) {
                    setAllCutoffs(data);
                }
            } catch (e) {
                console.error("Failed to load cutoffs for wizard:", e);
            } finally {
                if (isMounted) setIsLoadingData(false);
            }
        };
        load();
        return () => { isMounted = false; };
    }, []);

    // Filtered colleges for Step 1
    const collegeList = useMemo(() => {
        const query = searchCollege.trim().toLowerCase();
        if (!query) {
            return COLLEGE_DATABASE.slice(0, 40);
        }
        return COLLEGE_DATABASE.filter(c =>
            c.code.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(query) ||
            c.shortName.toLowerCase().includes(query) ||
            c.city.toLowerCase().includes(query)
        ).slice(0, 50);
    }, [searchCollege]);

    const selectedCollegeInfo: CollegeInfo | undefined = useMemo(() => {
        return COLLEGE_DATABASE.find(c => c.code.toUpperCase() === selectedCollegeCode.toUpperCase());
    }, [selectedCollegeCode]);

    // Available Years for selected college
    const availableYears = useMemo(() => {
        if (!selectedCollegeCode) return [];
        const records = allCutoffs.filter(c => c.institute_code.toUpperCase() === selectedCollegeCode.toUpperCase());
        const years = Array.from(new Set(records.map(c => c.year).filter(Boolean)));
        return years.sort((a, b) => b.localeCompare(a));
    }, [allCutoffs, selectedCollegeCode]);

    // Available Rounds for selected college + year
    const availableRounds = useMemo(() => {
        if (!selectedCollegeCode || !selectedYear) return [];
        const records = allCutoffs.filter(c =>
            c.institute_code.toUpperCase() === selectedCollegeCode.toUpperCase() &&
            c.year === selectedYear
        );
        const rounds = Array.from(new Set(records.map(c => c.round).filter(Boolean)));
        // Sort rounds: R1, R2, R3/Extended, MOCK
        const roundOrder: Record<string, number> = { 'R1': 1, 'R2': 2, 'R3': 3, 'EXT': 4, 'MOCK': 5, 'MOCK1': 6, 'MOCK2': 7 };
        return rounds.sort((a, b) => {
            const ordA = roundOrder[a.toUpperCase()] || 99;
            const ordB = roundOrder[b.toUpperCase()] || 99;
            return ordA - ordB;
        });
    }, [allCutoffs, selectedCollegeCode, selectedYear]);

    // Available Categories for selected college + year + round
    const availableCategories = useMemo(() => {
        if (!selectedCollegeCode || !selectedYear || !selectedRound) return [];
        const records = allCutoffs.filter(c =>
            c.institute_code.toUpperCase() === selectedCollegeCode.toUpperCase() &&
            c.year === selectedYear &&
            c.round.toUpperCase() === selectedRound.toUpperCase()
        );
        const cats = Array.from(new Set(records.map(c => c.category).filter(Boolean)));
        
        // Put GM, 3AG, 2AG, 1G, 2BG, 3BG first
        const priorityOrder: Record<string, number> = {
            'GM': 1, '3AG': 2, '2AG': 3, '1G': 4, '2BG': 5, '3BG': 6,
            'SCG': 7, 'STG': 8, 'GMK': 9, 'GMR': 10, '3AR': 11, '2AR': 12
        };
        return cats.sort((a, b) => {
            const pA = priorityOrder[a.toUpperCase()] || 50;
            const pB = priorityOrder[b.toUpperCase()] || 50;
            if (pA !== pB) return pA - pB;
            return a.localeCompare(b);
        });
    }, [allCutoffs, selectedCollegeCode, selectedYear, selectedRound]);

    // Final Cutoff Records for all branches
    const finalCutoffRecords = useMemo(() => {
        if (!selectedCollegeCode || !selectedYear || !selectedRound || !selectedCategory) return [];
        const matches = allCutoffs.filter(c =>
            c.institute_code.toUpperCase() === selectedCollegeCode.toUpperCase() &&
            c.year === selectedYear &&
            c.round.toUpperCase() === selectedRound.toUpperCase() &&
            c.category.toUpperCase() === selectedCategory.toUpperCase()
        );

        // Filter by branch search if provided
        let filtered = matches;
        if (branchSearch.trim()) {
            const q = branchSearch.trim().toLowerCase();
            filtered = filtered.filter(c => (c.course || c.branch_name || '').toLowerCase().includes(q));
        }

        // Sort by cutoff rank ascending (lowest rank = most competitive)
        return filtered.sort((a, b) => a.cutoff_rank - b.cutoff_rank);
    }, [allCutoffs, selectedCollegeCode, selectedYear, selectedRound, selectedCategory, branchSearch]);

    // Helpers
    const handleSelectCollege = (code: string) => {
        setSelectedCollegeCode(code);
        setSelectedYear("");
        setSelectedRound("");
        setSelectedCategory("");
        setStep(2);
    };

    const handleSelectYear = (year: string) => {
        setSelectedYear(year);
        setSelectedRound("");
        setSelectedCategory("");
        setStep(3);
    };

    const handleSelectRound = (round: string) => {
        setSelectedRound(round);
        setSelectedCategory("");
        setStep(4);
    };

    const handleSelectCategory = (cat: string) => {
        setSelectedCategory(cat);
        setStep(5);
    };

    const handleReset = () => {
        setSelectedCollegeCode("");
        setSelectedYear("");
        setSelectedRound("");
        setSelectedCategory("");
        setBranchSearch("");
        setStep(1);
    };

    const handleAskTesselBot = () => {
        if (!selectedCollegeCode || !selectedYear || !selectedRound || !selectedCategory) return;
        const collegeName = selectedCollegeInfo?.shortName || selectedCollegeInfo?.name || selectedCollegeCode;
        const prompt = `Give me a strategic analysis for ${selectedCollegeCode} ${collegeName} Round ${selectedRound} ${selectedYear} cutoffs in ${selectedCategory} category and explain which branches are safe or high ROI.`;
        if (onSelectForChat) {
            onSelectForChat(prompt);
        }
    };

    const handleCopyTable = () => {
        if (finalCutoffRecords.length === 0) return;
        const collegeName = selectedCollegeInfo?.name || selectedCollegeCode;
        let text = `Official KCET Cutoffs: ${collegeName} (${selectedCollegeCode})\n`;
        text += `Year: ${selectedYear} | Round: ${selectedRound} | Category: ${selectedCategory}\n\n`;
        text += `| Branch / Course | Category | Cutoff Closing Rank |\n`;
        text += `| :--- | :--- | :--- |\n`;
        finalCutoffRecords.forEach(c => {
            const b = c.course || c.branch_name || 'Engineering';
            text += `| ${b} | ${c.category} | ${c.cutoff_rank.toLocaleString()} |\n`;
        });

        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Cutoff table copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full bg-slate-900/90 border border-blue-900/40 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md text-slate-100">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-blue-800/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Filter className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-base sm:text-lg text-slate-100 flex items-center gap-2">
                            Interactive Cutoff Explorer
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-xs">
                                Verified Database
                            </Badge>
                        </h3>
                        <p className="text-xs text-slate-400">
                            Step-by-step cutoff query builder across all 269 colleges & 2023-2026 archives.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {step > 1 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="h-8 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        >
                            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                            Reset
                        </Button>
                    )}
                    {onClose && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="h-8 text-xs text-slate-400 hover:text-slate-200"
                        >
                            Close
                        </Button>
                    )}
                </div>
            </div>

            {/* Breadcrumb / Step Indicator */}
            <div className="flex items-center gap-2 py-3 text-xs overflow-x-auto no-scrollbar">
                <button
                    onClick={() => setStep(1)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        step === 1
                            ? "bg-blue-600 text-white font-medium shadow-md"
                            : selectedCollegeCode
                            ? "bg-slate-800 text-blue-300 hover:bg-slate-700"
                            : "bg-slate-800/40 text-slate-400"
                    }`}
                >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{selectedCollegeCode ? `${selectedCollegeCode}` : "1. College"}</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                <button
                    disabled={!selectedCollegeCode}
                    onClick={() => setStep(2)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        step === 2
                            ? "bg-blue-600 text-white font-medium shadow-md"
                            : selectedYear
                            ? "bg-slate-800 text-blue-300 hover:bg-slate-700"
                            : "bg-slate-800/40 text-slate-400 disabled:opacity-50"
                    }`}
                >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedYear ? `${selectedYear}` : "2. Year"}</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                <button
                    disabled={!selectedYear}
                    onClick={() => setStep(3)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        step === 3
                            ? "bg-blue-600 text-white font-medium shadow-md"
                            : selectedRound
                            ? "bg-slate-800 text-blue-300 hover:bg-slate-700"
                            : "bg-slate-800/40 text-slate-400 disabled:opacity-50"
                    }`}
                >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{selectedRound ? `Round ${selectedRound}` : "3. Round"}</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                <button
                    disabled={!selectedRound}
                    onClick={() => setStep(4)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                        step === 4
                            ? "bg-blue-600 text-white font-medium shadow-md"
                            : selectedCategory
                            ? "bg-slate-800 text-blue-300 hover:bg-slate-700"
                            : "bg-slate-800/40 text-slate-400 disabled:opacity-50"
                    }`}
                >
                    <Users className="w-3.5 h-3.5" />
                    <span>{selectedCategory ? `${selectedCategory}` : "4. Category"}</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />

                <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                        step === 5
                            ? "bg-emerald-600 text-white font-medium shadow-md"
                            : "bg-slate-800/40 text-slate-400"
                    }`}
                >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>5. All Cutoffs</span>
                </div>
            </div>

            {/* STEP 1: Select College */}
            {step === 1 && (
                <div className="space-y-4 pt-2">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search college by code (e.g. E126, E005, E003) or name..."
                            value={searchCollege}
                            onChange={(e) => setSearchCollege(e.target.value)}
                            className="pl-10 bg-slate-950/60 border-blue-900/40 text-slate-100 placeholder:text-slate-500 focus-visible:ring-blue-500"
                        />
                    </div>

                    {/* Quick Popular Picks */}
                    {!searchCollege && (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-slate-400 font-medium">Quick Picks:</span>
                            {[
                                { code: "E005", name: "RVCE" },
                                { code: "E003", name: "BMSCE" },
                                { code: "E006", name: "MSRIT" },
                                { code: "E126", name: "BMSIT" },
                                { code: "E007", name: "DSCE" },
                                { code: "E001", name: "UVCE" },
                                { code: "E018", name: "BIT" },
                                { code: "E099", name: "NHCE" }
                            ].map(item => (
                                <button
                                    key={item.code}
                                    onClick={() => handleSelectCollege(item.code)}
                                    className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700/60 transition-colors"
                                >
                                    <span className="font-mono text-blue-400 mr-1">{item.code}</span>
                                    {item.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* College List Scroll */}
                    <ScrollArea className="h-64 rounded-xl border border-slate-800 bg-slate-950/40 p-2">
                        <div className="space-y-1.5">
                            {collegeList.map(c => (
                                <div
                                    key={c.code}
                                    onClick={() => handleSelectCollege(c.code)}
                                    className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between hover:bg-blue-950/40 hover:border-blue-700/40 border border-transparent transition-all cursor-pointer ${
                                        selectedCollegeCode.toUpperCase() === c.code.toUpperCase() ? "bg-blue-950/60 border-blue-600" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-mono text-xs">
                                            {c.code}
                                        </Badge>
                                        <div>
                                            <div className="font-medium text-slate-200 text-sm">{c.name}</div>
                                            <div className="text-xs text-slate-400">{c.city} • {c.autonomous ? "Autonomous" : "VTU Affiliated"} • {c.tier}</div>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                                </div>
                            ))}
                            {collegeList.length === 0 && (
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    No colleges matching "{searchCollege}"
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            )}

            {/* STEP 2: Select Year */}
            {step === 2 && (
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Step 2 of 4</span>
                            <h4 className="text-sm font-semibold text-slate-100">Select Cutoff Year for {selectedCollegeInfo?.shortName || selectedCollegeCode}</h4>
                        </div>
                        <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 font-mono">
                            {selectedCollegeCode}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {availableYears.map(yr => (
                            <button
                                key={yr}
                                onClick={() => handleSelectYear(yr)}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                                    selectedYear === yr
                                        ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                                        : "bg-slate-950/60 border-slate-800 hover:border-blue-600 hover:bg-slate-900 text-slate-200"
                                }`}
                            >
                                <Calendar className="w-5 h-5 text-blue-400" />
                                <span className="font-bold text-lg">{yr}</span>
                                <span className="text-[10px] text-slate-400 uppercase">
                                    {yr === "2026" ? "Latest Benchmark" : "Official KEA Archive"}
                                </span>
                            </button>
                        ))}
                    </div>

                    {availableYears.length === 0 && !isLoadingData && (
                        <div className="text-center py-6 text-slate-400 text-sm">
                            No cutoff years found for college code {selectedCollegeCode}.
                        </div>
                    )}
                </div>
            )}

            {/* STEP 3: Select Round */}
            {step === 3 && (
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Step 3 of 4</span>
                            <h4 className="text-sm font-semibold text-slate-100">Select Counseling Round ({selectedYear})</h4>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 font-mono text-xs">{selectedCollegeCode}</Badge>
                            <Badge className="bg-slate-800 text-slate-300 text-xs">{selectedYear}</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {availableRounds.map(rnd => (
                            <button
                                key={rnd}
                                onClick={() => handleSelectRound(rnd)}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                                    selectedRound === rnd
                                        ? "bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20"
                                        : "bg-slate-950/60 border-slate-800 hover:border-blue-600 hover:bg-slate-900 text-slate-200"
                                }`}
                            >
                                <Layers className="w-5 h-5 text-blue-400" />
                                <span className="font-bold text-base">
                                    {rnd.toUpperCase().includes('R2') ? 'Round 2 (R2)' :
                                     rnd.toUpperCase().includes('R1') ? 'Round 1 (R1)' :
                                     rnd.toUpperCase().includes('R3') ? 'Round 3 / Ext' :
                                     rnd.toUpperCase().includes('MOCK') ? 'Mock Allotment' : rnd}
                                </span>
                                <span className="text-[10px] text-slate-400">Official KEA Allotment</span>
                            </button>
                        ))}
                    </div>

                    {availableRounds.length === 0 && (
                        <div className="text-center py-6 text-slate-400 text-sm">
                            No rounds recorded for {selectedYear}.
                        </div>
                    )}
                </div>
            )}

            {/* STEP 4: Select Category */}
            {step === 4 && (
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Step 4 of 4</span>
                            <h4 className="text-sm font-semibold text-slate-100">Select Reservation Category</h4>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500/15 text-blue-300 border-blue-500/30 font-mono text-xs">{selectedCollegeCode}</Badge>
                            <Badge className="bg-slate-800 text-slate-300 text-xs">{selectedYear} • {selectedRound}</Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {availableCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleSelectCategory(cat)}
                                className={`p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                                    selectedCategory === cat
                                        ? "bg-blue-600 text-white border-blue-400 shadow-md"
                                        : "bg-slate-950/60 border-slate-800 hover:border-blue-600 hover:bg-slate-900 text-slate-200"
                                }`}
                            >
                                <span className="font-bold text-sm">{cat}</span>
                                <span className="text-[9px] text-slate-400">
                                    {cat === 'GM' ? 'General' :
                                     cat === '3AG' ? 'Cat 3A' :
                                     cat === '2AG' ? 'Cat 2A' :
                                     cat === '1G' ? 'Cat 1' :
                                     cat === '3BG' ? 'Cat 3B' :
                                     cat === 'SCG' ? 'SC Quota' :
                                     cat === 'STG' ? 'ST Quota' : 'Quota'}
                                </span>
                            </button>
                        ))}
                    </div>

                    {availableCategories.length === 0 && (
                        <div className="text-center py-6 text-slate-400 text-sm">
                            No categories found for this round.
                        </div>
                    )}
                </div>
            )}

            {/* STEP 5: Results View - All Branches */}
            {step === 5 && (
                <div className="space-y-4 pt-2">
                    {/* College Banner & Context */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-blue-900/40 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-blue-600 text-white font-mono text-xs">{selectedCollegeCode}</Badge>
                                <span className="font-semibold text-slate-100 text-sm sm:text-base">
                                    {selectedCollegeInfo?.name || selectedCollegeCode}
                                </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                                <span>{selectedCollegeInfo?.city || 'Karnataka'}</span>
                                <span>•</span>
                                <span>{selectedCollegeInfo?.autonomous ? 'Autonomous' : 'VTU Affiliated'}</span>
                                {selectedCollegeInfo?.medianPackage && (
                                    <>
                                        <span>•</span>
                                        <span className="text-emerald-400">Median: ~₹{selectedCollegeInfo.medianPackage} LPA</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Selected Filters Badges */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30 text-xs">
                                Year: {selectedYear}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30 text-xs">
                                Round: {selectedRound}
                            </Badge>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-xs">
                                Category: {selectedCategory}
                            </Badge>
                        </div>
                    </div>

                    {/* Filter Branches Search */}
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Filter branches (e.g. Computer Science, AI, Electronics, Civil)..."
                                value={branchSearch}
                                onChange={(e) => setBranchSearch(e.target.value)}
                                className="h-9 pl-9 text-xs bg-slate-950/60 border-slate-800 text-slate-100 placeholder:text-slate-500"
                            />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopyTable}
                            className="h-9 text-xs border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800"
                        >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                            {copied ? "Copied" : "Copy Table"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleAskTesselBot}
                            className="h-9 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md"
                        >
                            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-blue-200" />
                            Ask TesselBot
                        </Button>
                    </div>

                    {/* Results Table */}
                    <div className="border border-blue-900/30 rounded-xl overflow-hidden bg-slate-950/60">
                        <ScrollArea className="max-h-72">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-900/90 text-slate-300 uppercase text-[10px] tracking-wider border-b border-blue-900/40 sticky top-0 backdrop-blur-sm">
                                    <tr>
                                        <th className="py-2.5 px-3.5 font-semibold">Branch / Engineering Course</th>
                                        <th className="py-2.5 px-3.5 font-semibold text-center">Category</th>
                                        <th className="py-2.5 px-3.5 font-semibold text-right">Cutoff Closing Rank</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                                    {finalCutoffRecords.map((c, idx) => {
                                        const branchName = c.course || c.branch_name || 'Engineering Course';
                                        return (
                                            <tr key={idx} className="hover:bg-blue-950/30 transition-colors">
                                                <td className="py-2.5 px-3.5 font-medium flex items-center gap-2">
                                                    <GraduationCap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                    <span>{branchName}</span>
                                                </td>
                                                <td className="py-2.5 px-3.5 text-center">
                                                    <Badge variant="outline" className="bg-slate-900 text-slate-300 border-slate-700 text-[10px] font-mono">
                                                        {c.category}
                                                    </Badge>
                                                </td>
                                                <td className="py-2.5 px-3.5 text-right font-mono font-bold text-blue-300">
                                                    {c.cutoff_rank.toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {finalCutoffRecords.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="py-6 text-center text-slate-400">
                                                No records found for the selected combination.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </ScrollArea>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span>Showing <strong>{finalCutoffRecords.length}</strong> branches for <strong>{selectedCollegeCode}</strong> ({selectedYear}, {selectedRound}, {selectedCategory})</span>
                        <button
                            onClick={() => setStep(4)}
                            className="text-blue-400 hover:text-blue-300 underline font-medium"
                        >
                            Change Category
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

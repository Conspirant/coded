import { useState, useEffect, useMemo } from "react";
import { CutoffService, type CutoffData } from "@/lib/cutoff-service";
import { COLLEGE_DATABASE, type CollegeInfo } from "@/data/collegeDatabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Search,
    Check,
    RotateCcw,
    Copy,
    Sparkles,
    X,
    ChevronDown,
    Building2,
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
    const [isLoading, setIsLoading] = useState(true);

    // Selections
    const [collegeSearch, setCollegeSearch] = useState("");
    const [selectedCollegeCode, setSelectedCollegeCode] = useState<string>("E126"); // Default BMSIT
    const [selectedYear, setSelectedYear] = useState<string>("2026");
    const [selectedRound, setSelectedRound] = useState<string>("R2");
    const [selectedCategory, setSelectedCategory] = useState<string>("3AG");
    const [branchQuery, setBranchQuery] = useState("");
    const [showCollegePicker, setShowCollegePicker] = useState(false);
    const [copied, setCopied] = useState(false);

    // Load master cutoff data
    useEffect(() => {
        let isMounted = true;
        const load = async () => {
            setIsLoading(true);
            try {
                const data = await CutoffService.loadCutoffs();
                if (isMounted) setAllCutoffs(data);
            } catch (e) {
                console.error("Failed to load cutoffs:", e);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        load();
        return () => { isMounted = false; };
    }, []);

    const selectedCollegeInfo: CollegeInfo | undefined = useMemo(() => {
        return COLLEGE_DATABASE.find(c => c.code.toUpperCase() === selectedCollegeCode.toUpperCase());
    }, [selectedCollegeCode]);

    // Available Years
    const availableYears = useMemo(() => {
        if (!selectedCollegeCode) return ["2026", "2025", "2024", "2023"];
        const records = allCutoffs.filter(c => c.institute_code.toUpperCase() === selectedCollegeCode.toUpperCase());
        const years = Array.from(new Set(records.map(c => c.year).filter(Boolean)));
        return years.length > 0 ? years.sort((a, b) => b.localeCompare(a)) : ["2026", "2025", "2024", "2023"];
    }, [allCutoffs, selectedCollegeCode]);

    // Available Rounds
    const availableRounds = useMemo(() => {
        if (!selectedCollegeCode || !selectedYear) return ["R1", "R2"];
        const records = allCutoffs.filter(c =>
            c.institute_code.toUpperCase() === selectedCollegeCode.toUpperCase() &&
            c.year === selectedYear
        );
        const rounds = Array.from(new Set(records.map(c => c.round).filter(Boolean)));
        const roundOrder: Record<string, number> = { 'R1': 1, 'R2': 2, 'R3': 3, 'EXT': 4, 'MOCK': 5, 'MOCK1': 6, 'MOCK2': 7 };
        return rounds.length > 0
            ? rounds.sort((a, b) => (roundOrder[a.toUpperCase()] || 99) - (roundOrder[b.toUpperCase()] || 99))
            : ["R1", "R2"];
    }, [allCutoffs, selectedCollegeCode, selectedYear]);

    // Available Categories
    const availableCategories = useMemo(() => {
        if (!selectedCollegeCode || !selectedYear || !selectedRound) return ["GM", "3AG", "2AG", "1G", "2BG", "3BG", "SCG", "STG"];
        const records = allCutoffs.filter(c =>
            c.institute_code.toUpperCase() === selectedCollegeCode.toUpperCase() &&
            c.year === selectedYear &&
            c.round.toUpperCase() === selectedRound.toUpperCase()
        );
        const cats = Array.from(new Set(records.map(c => c.category).filter(Boolean)));
        const priorityOrder: Record<string, number> = {
            'GM': 1, '3AG': 2, '2AG': 3, '1G': 4, '2BG': 5, '3BG': 6,
            'SCG': 7, 'STG': 8, 'GMK': 9, 'GMR': 10, '3AR': 11, '2AR': 12
        };
        return cats.length > 0
            ? cats.sort((a, b) => (priorityOrder[a.toUpperCase()] || 50) - (priorityOrder[b.toUpperCase()] || 50))
            : ["GM", "3AG", "2AG", "1G", "2BG", "3BG", "SCG", "STG"];
    }, [allCutoffs, selectedCollegeCode, selectedYear, selectedRound]);

    // Ensure valid selections when options change
    useEffect(() => {
        if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
            setSelectedYear(availableYears[0]);
        }
    }, [availableYears, selectedYear]);

    useEffect(() => {
        if (availableRounds.length > 0 && !availableRounds.includes(selectedRound)) {
            setSelectedRound(availableRounds[0]);
        }
    }, [availableRounds, selectedRound]);

    useEffect(() => {
        if (availableCategories.length > 0 && !availableCategories.includes(selectedCategory)) {
            setSelectedCategory(availableCategories.includes("3AG") ? "3AG" : availableCategories[0]);
        }
    }, [availableCategories, selectedCategory]);

    // Filtered colleges list
    const filteredColleges = useMemo(() => {
        const q = collegeSearch.trim().toLowerCase();
        if (!q) return COLLEGE_DATABASE.slice(0, 30);
        return COLLEGE_DATABASE.filter(c =>
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.shortName.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q)
        ).slice(0, 40);
    }, [collegeSearch]);

    // Final Cutoff Records
    const results = useMemo(() => {
        if (!selectedCollegeCode || !selectedYear || !selectedRound || !selectedCategory) return [];
        let matches = allCutoffs.filter(c =>
            c.institute_code.toUpperCase() === selectedCollegeCode.toUpperCase() &&
            c.year === selectedYear &&
            c.round.toUpperCase() === selectedRound.toUpperCase() &&
            c.category.toUpperCase() === selectedCategory.toUpperCase()
        );

        if (branchQuery.trim()) {
            const bq = branchQuery.trim().toLowerCase();
            matches = matches.filter(c => (c.course || c.branch_name || '').toLowerCase().includes(bq));
        }

        return matches.sort((a, b) => a.cutoff_rank - b.cutoff_rank);
    }, [allCutoffs, selectedCollegeCode, selectedYear, selectedRound, selectedCategory, branchQuery]);

    const handleCopy = () => {
        if (results.length === 0) return;
        const colName = selectedCollegeInfo?.shortName || selectedCollegeCode;
        let text = `${colName} (${selectedCollegeCode}) - ${selectedYear} Round ${selectedRound} (${selectedCategory} Quota)\n\n`;
        text += `| Branch | Cutoff Rank |\n| :--- | :--- |\n`;
        results.forEach(r => {
            text += `| ${r.course || r.branch_name} | ${r.cutoff_rank.toLocaleString()} |\n`;
        });
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Cutoff table copied");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAskBot = () => {
        const colName = selectedCollegeInfo?.shortName || selectedCollegeCode;
        const prompt = `${selectedCollegeCode} ${colName} ${selectedCategory} Round ${selectedRound} ${selectedYear} cutoffs analysis`;
        if (onSelectForChat) onSelectForChat(prompt);
    };

    return (
        <div className="w-full bg-[#080d1a] border border-slate-800/80 rounded-xl p-3.5 sm:p-4 text-slate-200 text-xs shadow-lg">
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 text-xs tracking-tight">Cutoff Matrix</span>
                    <span className="text-[10px] text-slate-500 font-mono">240k records</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-7 px-2 text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    >
                        {copied ? <Check className="w-3 h-3 text-emerald-400 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAskBot}
                        className="h-7 px-2 text-[11px] text-blue-400 hover:text-blue-300 hover:bg-blue-950/40"
                    >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Analyze
                    </Button>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Minimalist 4-Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-3">
                {/* 1. College Selector */}
                <div className="relative">
                    <button
                        onClick={() => setShowCollegePicker(!showCollegePicker)}
                        className="w-full h-8 px-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-left transition-colors"
                    >
                        <span className="truncate text-slate-200 font-mono text-[11px]">
                            {selectedCollegeCode} - {selectedCollegeInfo?.shortName || 'College'}
                        </span>
                        <ChevronDown className="w-3 h-3 text-slate-500 shrink-0 ml-1" />
                    </button>

                    {showCollegePicker && (
                        <div className="absolute top-9 left-0 w-72 z-50 bg-slate-950 border border-slate-800 rounded-lg shadow-2xl p-2 animate-in fade-in-50 zoom-in-95">
                            <Input
                                autoFocus
                                placeholder="Search college or code (e.g. E126, RVCE)..."
                                value={collegeSearch}
                                onChange={(e) => setCollegeSearch(e.target.value)}
                                className="h-7 text-[11px] bg-slate-900 border-slate-800 mb-1.5"
                            />
                            <ScrollArea className="h-48">
                                <div className="space-y-0.5">
                                    {filteredColleges.map(c => (
                                        <button
                                            key={c.code}
                                            onClick={() => {
                                                setSelectedCollegeCode(c.code);
                                                setShowCollegePicker(false);
                                                setCollegeSearch("");
                                            }}
                                            className={`w-full text-left px-2 py-1.5 rounded text-[11px] flex items-center justify-between hover:bg-slate-800 ${
                                                selectedCollegeCode === c.code ? 'bg-blue-600/20 text-blue-300 font-medium' : 'text-slate-300'
                                            }`}
                                        >
                                            <span className="font-mono text-slate-400 mr-2">{c.code}</span>
                                            <span className="truncate flex-1">{c.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )}
                </div>

                {/* 2. Year Pills */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 h-8">
                    {availableYears.map(yr => (
                        <button
                            key={yr}
                            onClick={() => setSelectedYear(yr)}
                            className={`flex-1 h-full rounded text-[10px] font-mono font-medium transition-colors ${
                                selectedYear === yr
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {yr}
                        </button>
                    ))}
                </div>

                {/* 3. Round Pills */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 h-8">
                    {availableRounds.map(rnd => (
                        <button
                            key={rnd}
                            onClick={() => setSelectedRound(rnd)}
                            className={`flex-1 h-full rounded text-[10px] font-mono font-medium transition-colors ${
                                selectedRound === rnd
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {rnd}
                        </button>
                    ))}
                </div>

                {/* 4. Category Selector / Quick Chips */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar bg-slate-900 border border-slate-800 rounded-lg p-0.5 h-8">
                    {availableCategories.slice(0, 6).map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-2 h-full rounded text-[10px] font-mono font-medium transition-colors shrink-0 ${
                                selectedCategory === cat
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick Filter Branch Search */}
            <div className="pt-2.5 flex items-center justify-between gap-2">
                <div className="relative flex-1 max-w-xs">
                    <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <Input
                        placeholder="Filter branches..."
                        value={branchQuery}
                        onChange={(e) => setBranchQuery(e.target.value)}
                        className="h-7 pl-7 text-[11px] bg-slate-900/60 border-slate-800 text-slate-200 placeholder:text-slate-500"
                    />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                    {results.length} branches • {selectedCollegeCode} {selectedYear} {selectedRound} [{selectedCategory}]
                </div>
            </div>

            {/* Minimalist Cutoff Table */}
            <div className="mt-2 border border-slate-800/80 rounded-lg overflow-hidden bg-slate-950/40">
                <ScrollArea className="max-h-56">
                    <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-900/60 text-slate-400 uppercase text-[9px] font-medium tracking-wider border-b border-slate-800">
                            <tr>
                                <th className="py-2 px-3">Branch</th>
                                <th className="py-2 px-3 text-center w-16">Quota</th>
                                <th className="py-2 px-3 text-right w-24">Cutoff Rank</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 text-slate-300 font-mono">
                            {results.map((r, i) => (
                                <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                                    <td className="py-2 px-3 font-sans text-slate-200 font-normal truncate max-w-[200px] sm:max-w-none">
                                        {r.course || r.branch_name}
                                    </td>
                                    <td className="py-2 px-3 text-center text-slate-400 text-[10px]">
                                        {r.category}
                                    </td>
                                    <td className="py-2 px-3 text-right font-bold text-blue-400">
                                        {r.cutoff_rank.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {results.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={3} className="py-6 text-center text-slate-500 font-sans text-[11px]">
                                        No branches found matching this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </ScrollArea>
            </div>
        </div>
    );
};

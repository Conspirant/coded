import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Layers, Users, Sparkles, Filter, Check } from "lucide-react";

interface InChatMessageCutoffSelectorProps {
    collegeCode: string;
    collegeName: string;
    currentYear?: string;
    currentRound?: string;
    currentCategory?: string;
    onSelectCombination: (query: string) => void;
}

export const InChatMessageCutoffSelector = ({
    collegeCode,
    collegeName,
    currentYear = "2026",
    currentRound = "R2",
    currentCategory = "3AG",
    onSelectCombination
}: InChatMessageCutoffSelectorProps) => {
    const [year, setYear] = useState(currentYear);
    const [round, setRound] = useState(currentRound);
    const [category, setCategory] = useState(currentCategory);

    const years = ["2026", "2025", "2024", "2023"];
    const rounds = ["R2", "R1", "R3", "MOCK"];
    const categories = ["3AG", "GM", "2AG", "1G", "2BG", "3BG", "SCG", "STG"];

    const handleApply = (newYear = year, newRound = round, newCat = category) => {
        setYear(newYear);
        setRound(newRound);
        setCategory(newCat);
        const query = `${collegeCode} ${collegeName} ${newCat} Round ${newRound} ${newYear} cutoffs`;
        onSelectCombination(query);
    };

    return (
        <div className="w-full mt-3 p-3 rounded-xl bg-[#080d1a]/95 border border-slate-800/90 text-slate-200 text-xs shadow-md">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/60 mb-2.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-300 text-[11px]">
                    <Filter className="w-3 h-3 text-blue-400" />
                    <span>In-Chat Cutoff Controls:</span>
                    <Badge variant="outline" className="text-[10px] font-mono py-0 h-4 border-blue-500/30 text-blue-300 bg-blue-500/10">
                        {collegeCode}
                    </Badge>
                </div>
                <span className="text-[10px] text-slate-500">Tap to update table</span>
            </div>

            {/* In-Chat Filter Chips */}
            <div className="space-y-2">
                {/* Year Select */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono w-14 shrink-0">Year:</span>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {years.map(y => (
                            <button
                                key={y}
                                onClick={() => handleApply(y, round, category)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                                    year === y
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                }`}
                            >
                                {y}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Round Select */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono w-14 shrink-0">Round:</span>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {rounds.map(r => (
                            <button
                                key={r}
                                onClick={() => handleApply(year, r, category)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                                    round === r
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                }`}
                            >
                                {r === 'R1' ? 'Round 1' : r === 'R2' ? 'Round 2' : r === 'R3' ? 'Round 3' : 'Mock'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Category Select */}
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono w-14 shrink-0">Quota:</span>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => handleApply(year, round, c)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                                    category === c
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                                }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

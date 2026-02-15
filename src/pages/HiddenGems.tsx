import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Diamond,
    TrendingUp,
    Award,
    ArrowUpRight,
    Sparkles,
    Filter
} from "lucide-react"

// Mock Data (To be replaced with real Placements JSON)
// "Hidden Gem" factor: High Package + High Cutoff Rank (Easy to get)
const PLACEMENT_DATA = [
    { code: "E001", name: "UVCE", avgPackage: 10.5, maxPackage: 58, cutoff: 2500, branch: "CS", fees: 0.4 },
    { code: "E003", name: "BMS College of Engineering", avgPackage: 12.5, maxPackage: 50, cutoff: 900, branch: "CS", fees: 10 },
    { code: "E005", name: "RV College of Engineering", avgPackage: 15, maxPackage: 62, cutoff: 250, branch: "CS", fees: 10 },
    { code: "E006", name: "MSRIT", avgPackage: 11, maxPackage: 50, cutoff: 800, branch: "CS", fees: 10 },
    { code: "E009", name: "PES University (RR)", avgPackage: 13, maxPackage: 65, cutoff: 550, branch: "CS", fees: 16 },

    // Potential Gems (Good placement, easier cutoff)
    { code: "E00X", name: "BMS Institute of Technology (BMSIT)", avgPackage: 8.5, maxPackage: 44, cutoff: 5000, branch: "CS", fees: 10 },
    { code: "E00Y", name: "Nitte Meenakshi (NMIT)", avgPackage: 7.5, maxPackage: 40, cutoff: 8500, branch: "CS", fees: 10 },
    { code: "E00Z", name: "RNS Institute of Technology", avgPackage: 7, maxPackage: 56, cutoff: 12000, branch: "CS", fees: 9 },
    { code: "E0XX", name: "JSS Academy (JSSATE)", avgPackage: 6.5, maxPackage: 43, cutoff: 15000, branch: "CS", fees: 9 },
    { code: "E0YY", name: "New Horizon College", avgPackage: 8, maxPackage: 35, cutoff: 9000, branch: "CS", fees: 12 },

    // "Super Gems" (Special Branches in Top Colleges)
    { code: "E006", name: "MSRIT", branch: "Medical Electronics", avgPackage: 9, maxPackage: 20, cutoff: 25000, fees: 10 }, // High ROI
    { code: "E003", name: "BMSCE", branch: "Chemical Engg", avgPackage: 8, maxPackage: 15, cutoff: 35000, fees: 10 },
    { code: "E001", name: "UVCE", branch: "Civil Engg", avgPackage: 6, maxPackage: 12, cutoff: 45000, fees: 0.4 }, // Low Fees Gem
]

// Logic: Gem Score = (AvgPackage^2 * CutoffRank) / (Fees + 1)
// We emphasize Package and Rank. Low fees boosts score massively.
const calculateGemScore = (college: any) => {
    // Normalize values roughly
    const packageScore = Math.pow(college.avgPackage, 1.5) // Emphasis on package
    const rankScore = Math.log10(college.cutoff) // Log scale for rank (10k vs 1k)
    const feePenalty = Math.max(1, college.fees) // Avoid div by zero

    return (packageScore * rankScore * 10) / feePenalty
}

const HiddenGems = () => {
    const [minPackage, setMinPackage] = useState(6)
    const [maxRank, setMaxRank] = useState(50000)

    // Sort by Gem Score
    const gems = useMemo(() => {
        return PLACEMENT_DATA
            .filter(c => c.avgPackage >= minPackage && c.cutoff <= maxRank)
            .map(c => ({ ...c, score: calculateGemScore(c) }))
            .sort((a, b) => b.score - a.score)
    }, [minPackage, maxRank])

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans selection:bg-amber-500/30">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-4 py-1 rounded-full border-amber-500/50 text-amber-400 bg-amber-500/10 text-sm uppercase tracking-widest">
                        beta feature
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
                        <Diamond className="h-10 w-10 text-amber-400 fill-amber-400/20" />
                        Hidden Gems
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        The Algorithm knows. Find colleges with <span className="text-white font-semibold">High ROI</span> (Return on Investment) that others miss.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Filters:</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Min Package:</span>
                        <Input
                            type="number"
                            value={minPackage}
                            onChange={e => setMinPackage(Number(e.target.value))}
                            className="w-20 bg-black/40 border-white/10 h-8"
                        />
                        <span className="text-xs">LPA</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Max Rank:</span>
                        <Input
                            type="number"
                            value={maxRank}
                            onChange={e => setMaxRank(Number(e.target.value))}
                            className="w-24 bg-black/40 border-white/10 h-8"
                        />
                    </div>
                </div>

                {/* Gems Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gems.map((gem, idx) => (
                        <div key={idx} className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 hover:shadow-[0_0_30px_-10px_rgba(251,191,36,0.3)] transition-all duration-300">

                            {/* Rank Badge */}
                            <div className="absolute top-4 right-4 text-5xl font-black text-white/[0.03] group-hover:text-amber-500/10 transition-colors">
                                #{idx + 1}
                            </div>

                            <div className="space-y-4 relative z-10">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border-amber-500/20 mb-2">
                                            Gem Score: {gem.score.toFixed(0)}
                                        </Badge>
                                        {gem.fees < 2 && (
                                            <Badge variant="outline" className="border-green-500/30 text-green-400 bg-green-500/5">
                                                Super Low Fees
                                            </Badge>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-xl leading-tight text-white group-hover:text-amber-200 transition-colors">
                                        {gem.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">{gem.branch}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Package</p>
                                        <p className="text-2xl font-black text-green-400">{gem.avgPackage} <span className="text-sm font-normal text-white/50">LPA</span></p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Cutoff Rank</p>
                                        <p className="text-2xl font-black text-white">{gem.cutoff.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-xs text-muted-foreground">
                                    <span>Fees: ~{gem.fees}L / year</span>
                                    <span>Max: {gem.maxPackage} LPA</span>
                                </div>

                                <Button className="w-full bg-white/10 hover:bg-amber-500 hover:text-black font-bold transition-all group-hover:translate-y-[-2px]">
                                    View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default HiddenGems

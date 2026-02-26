import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Diamond,
    TrendingUp,
    ArrowUpRight,
    Sparkles,
    Filter,
    Loader2,
    Info
} from "lucide-react"
import { Link } from "react-router-dom"
import { PLACEMENT_DATA, CollegePlacement } from "@/lib/college-placements"
import { CutoffService, CutoffData } from "@/lib/cutoff-service"

// Gem Score = (AvgPackage^1.5 × log10(CutoffRank) × 10) / Fees
// Emphasizes package while rewarding easier-to-get-into colleges and low fees
const calculateGemScore = (avgPackage: number, cutoff: number, fees: number) => {
    if (cutoff <= 0) return 0
    const packageScore = Math.pow(avgPackage, 1.5)
    const rankScore = Math.log10(cutoff)
    const feePenalty = Math.max(0.5, fees)
    return (packageScore * rankScore * 10) / feePenalty
}

interface GemEntry extends CollegePlacement {
    cutoff: number
    score: number
}

const HiddenGems = () => {
    const [minPackage, setMinPackage] = useState(5)
    const [maxRank, setMaxRank] = useState(50000)
    const [cutoffMap, setCutoffMap] = useState<Map<string, number>>(new Map())
    const [loading, setLoading] = useState(true)

    // Load real cutoff data
    useEffect(() => {
        async function loadCutoffs() {
            try {
                const cutoffs = await CutoffService.loadCutoffs()
                const map = new Map<string, number>()

                // For each college, get the GM cutoff for their relevant branch
                // Use the latest year, R2 round as the most representative
                cutoffs.forEach((c: CutoffData) => {
                    if (c.category !== "GM") return
                    // Only consider the best cutoff for each institute code
                    const existing = map.get(c.institute_code)
                    if (!existing || c.cutoff_rank > existing) {
                        // Higher cutoff_rank = easier to get in (for hidden gems we want the broadest branch)
                        map.set(c.institute_code, c.cutoff_rank)
                    }
                })

                setCutoffMap(map)
            } catch (e) {
                console.error("Failed to load cutoffs for HiddenGems", e)
            } finally {
                setLoading(false)
            }
        }
        loadCutoffs()
    }, [])

    // Sort by Gem Score
    const gems = useMemo<GemEntry[]>(() => {
        return PLACEMENT_DATA
            .map(c => {
                const cutoff = cutoffMap.get(c.code) || 0
                return {
                    ...c,
                    cutoff,
                    score: calculateGemScore(c.avgPackage, cutoff, c.fees)
                }
            })
            .filter(c => c.avgPackage >= minPackage && c.cutoff <= maxRank && c.cutoff > 0)
            .sort((a, b) => b.score - a.score)
    }, [minPackage, maxRank, cutoffMap])

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans selection:bg-amber-500/30">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-4 py-1 rounded-full border-amber-500/50 text-amber-400 bg-amber-500/10 text-sm uppercase tracking-widest">
                        Real Placement Data
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
                        <Diamond className="h-10 w-10 text-amber-400 fill-amber-400/20" />
                        Hidden Gems
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        The Algorithm knows. Find colleges with <span className="text-white font-semibold">High ROI</span> (Return on Investment) that others miss.
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-mono flex items-center justify-center gap-1">
                        <Info className="h-3 w-3" />
                        Placement data from Shiksha, Careers360, & official sites. Cutoffs from KEA.
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

                {/* Loading */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                    </div>
                ) : (
                    <>
                        {/* Results count */}
                        <div className="text-center text-sm text-muted-foreground">
                            {gems.length} gems found — sorted by ROI score
                        </div>

                        {/* Gems Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {gems.map((gem, idx) => (
                                <div key={`${gem.code}-${gem.branch}-${idx}`} className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 hover:border-amber-500/50 hover:shadow-[0_0_30px_-10px_rgba(251,191,36,0.3)] transition-all duration-300">

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
                                                <p className="text-2xl font-black text-white">{gem.cutoff > 0 ? gem.cutoff.toLocaleString() : '—'}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                                            <span>Fees: ~{gem.fees}L / year</span>
                                            <span>Max: {gem.maxPackage} LPA</span>
                                        </div>

                                        <div className="flex justify-between items-center text-[10px] text-muted-foreground/50">
                                            <span>Source: {gem.source}</span>
                                        </div>

                                        <Link to={`/college/${gem.code}`}>
                                            <Button className="w-full bg-white/10 hover:bg-amber-500 hover:text-black font-bold transition-all group-hover:translate-y-[-2px]">
                                                View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {gems.length === 0 && !loading && (
                            <div className="text-center py-12 text-muted-foreground">
                                <Sparkles className="h-8 w-8 mx-auto mb-3 text-amber-400/30" />
                                <p>No gems match your filters. Try increasing Max Rank or lowering Min Package.</p>
                            </div>
                        )}
                    </>
                )}

            </div>
        </div>
    )
}

export default HiddenGems

import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
    Diamond,
    TrendingUp,
    ArrowUpRight,
    Sparkles,
    Filter,
    Loader2,
    Info,
    Building2,
    CheckCircle2
} from "lucide-react"
import { Link } from "react-router-dom"
import { PLACEMENT_DATA, CollegePlacement } from "@/lib/college-placements"
import { CutoffService, CutoffData } from "@/lib/cutoff-service"

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

export const HiddenGems = () => {
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

                cutoffs.forEach((c: CutoffData) => {
                    if (c.category !== "GM") return
                    const existing = map.get(c.institute_code)
                    if (!existing || c.cutoff_rank > existing) {
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
        <div className="space-y-8 max-w-5xl mx-auto px-4 py-6 text-foreground font-sans animate-scale-in">
            <SEO
                title="KCET Hidden Gems – Underrated Engineering Colleges in Karnataka"
                description="Discover underrated engineering colleges in Karnataka with excellent placements & faculty at lower cutoff ranks. These hidden gems are often overlooked by KCET aspirants."
                url="https://kcetcoded.dev/hidden-gems"
                keywords="underrated KCET colleges, hidden gem colleges Karnataka, best value engineering colleges, low cutoff good colleges KCET"
            />

            {/* Header Area */}
            <div className="p-6 rounded-lg border border-border bg-card shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] font-mono font-semibold uppercase">
                        <Sparkles className="h-3 w-3" />
                        Coded Labs Placement ROI Model
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] text-amber-500 border-amber-500/20 bg-amber-500/10">
                        High ROI Index
                    </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Diamond className="h-6 w-6 text-amber-500" />
                    Hidden <span className="text-primary">Gems</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    Filter out overpriced brand hype. Discover institutions with high placement-to-cutoff ROI ratios where moderate ranks yield strong median packages and low tuition barriers.
                </p>
            </div>

            {/* Controls Filter Bar */}
            <div className="p-4 rounded-lg border border-border bg-card shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Min Avg Package</Label>
                        <span className="text-xs font-mono font-bold text-foreground">₹{minPackage} LPA</span>
                    </div>
                    <Input
                        type="range"
                        min={3}
                        max={15}
                        step={0.5}
                        value={minPackage}
                        onChange={(e) => setMinPackage(Number(e.target.value))}
                        className="h-2 cursor-pointer bg-muted"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Max KCET Rank Threshold</Label>
                        <span className="text-xs font-mono font-bold text-foreground">#{maxRank.toLocaleString()}</span>
                    </div>
                    <Input
                        type="range"
                        min={5000}
                        max={150000}
                        step={5000}
                        value={maxRank}
                        onChange={(e) => setMaxRank(Number(e.target.value))}
                        className="h-2 cursor-pointer bg-muted"
                    />
                </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        Top High-ROI Colleges ({gems.length})
                    </h2>
                    <span className="text-[11px] font-mono text-muted-foreground">Ranked by Placement/Cutoff Ratio</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Calculating ROI indexes...
                    </div>
                ) : gems.length === 0 ? (
                    <div className="p-8 rounded-lg border border-border bg-card text-center space-y-2">
                        <Diamond className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                        <h3 className="text-sm font-semibold text-foreground">No matches within current thresholds</h3>
                        <p className="text-xs text-muted-foreground">Try lowering the minimum salary expectation or increasing the rank threshold.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {gems.map((college, idx) => (
                            <Card key={college.code} className="border border-border bg-card shadow-xs hover:border-slate-600 transition-colors flex flex-col justify-between">
                                <CardContent className="p-5 space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="outline" className="font-mono text-[10px] border-primary/20 text-primary bg-primary/5">
                                                    {college.code}
                                                </Badge>
                                                <Badge variant="secondary" className="font-mono text-[10px] text-amber-500 bg-amber-500/10 border-amber-500/20">
                                                    ROI Score: {Math.round(college.score)}
                                                </Badge>
                                            </div>
                                            <h3 className="text-sm font-bold text-foreground leading-snug">
                                                {college.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-border/60">
                                        <div className="p-2 rounded bg-muted/40 border border-border/60">
                                            <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block">Avg Package</span>
                                            <span className="font-bold text-emerald-500 font-mono">₹{college.avgPackage} LPA</span>
                                        </div>
                                        <div className="p-2 rounded bg-muted/40 border border-border/60">
                                            <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block">Cutoff (GM)</span>
                                            <span className="font-bold font-mono text-foreground">#{college.cutoff.toLocaleString()}</span>
                                        </div>
                                        <div className="p-2 rounded bg-muted/40 border border-border/60">
                                            <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block">Annual Fees</span>
                                            <span className="font-bold font-mono text-foreground">~₹{college.fees}L</span>
                                        </div>
                                    </div>

                                    {college.highlight && (
                                        <p className="text-[11px] text-muted-foreground bg-muted/20 p-2 rounded border border-border/40 leading-relaxed">
                                            ✨ {college.highlight}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default HiddenGems

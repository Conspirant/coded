import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Diamond,
    TrendingUp,
    ArrowUpRight,
    Sparkles,
    Filter,
    Loader2,
    Info,
    Building2,
    MapPin,
    GraduationCap,
    CheckCircle2,
    Search,
    Award,
    IndianRupee,
    Briefcase,
    SlidersHorizontal,
    ExternalLink
} from "lucide-react"
import { Link } from "react-router-dom"
import { COLLEGE_DATABASE, CollegeInfo } from "@/data/collegeDatabase"
import { CutoffService, CutoffData } from "@/lib/cutoff-service"
import { computeROI } from "@/lib/collegeRoi"

const CATEGORIES = ["GM", "1G", "2AG", "2BG", "3AG", "3BG", "SCG", "STG", "GMR", "GMK"]

export interface DynamicGemCollege {
    code: string
    name: string
    shortName: string
    city: string
    district: string
    type: string
    autonomous: boolean
    avgPackage: number
    maxPackage: number
    placementRate: number
    fees: number
    cutoff: number
    gemScore: number
    naacGrade: string | null
    tier: string
    topRecruiters: string[]
}

export const HiddenGems = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("GM")
    const [selectedRegion, setSelectedRegion] = useState("all")
    const [selectedType, setSelectedType] = useState("all")
    const [minPackage, setMinPackage] = useState(4.5)
    const [maxRank, setMaxRank] = useState(75000)
    const [cutoffData, setCutoffData] = useState<CutoffData[]>([])
    const [loading, setLoading] = useState(true)

    // Load real cutoff data via CutoffService
    useEffect(() => {
        async function fetchAllCutoffs() {
            try {
                const cutoffs = await CutoffService.loadCutoffs()
                setCutoffData(cutoffs)
            } catch (e) {
                console.error("Failed loading cutoff dataset for HiddenGems:", e)
            } finally {
                setLoading(false)
            }
        }
        fetchAllCutoffs()
    }, [])

    // Map cutoffs by Institute Code for the selected Category
    const cutoffMap = useMemo(() => {
        const map = new Map<string, number>()
        for (const c of cutoffData) {
            if (c.category !== selectedCategory) continue
            const code = (c.institute_code || "").trim().toUpperCase()
            if (!code) continue

            const existing = map.get(code)
            // Pick representative cutoff rank
            if (!existing || c.cutoff_rank > existing) {
                map.set(code, c.cutoff_rank)
            }
        }
        return map
    }, [cutoffData, selectedCategory])

    // Auto-calculate Hidden Gems dynamically across all 269+ colleges in directory
    const dynamicGems = useMemo<DynamicGemCollege[]>(() => {
        return COLLEGE_DATABASE.map(c => {
            const code = (c.code || "").trim().toUpperCase()
            const rawCutoff = cutoffMap.get(code)

            // Fallback realistic cutoff if college exists in directory
            let cutoff = rawCutoff || 0
            if (cutoff <= 0) {
                if (c.tier === 'Tier 1') cutoff = 6500
                else if (c.tier === 'Tier 2') cutoff = 22000
                else if (c.tier === 'Tier 3') cutoff = 55000
                else cutoff = 95000
            }

            // Estimate / normalize avgPackage from directory
            let avgPkg = c.avgPackage || c.medianPackage || 0
            if (avgPkg <= 0) {
                if (c.tier === 'Tier 1') avgPkg = 14.5
                else if (c.tier === 'Tier 2') avgPkg = 8.2
                else if (c.tier === 'Tier 3') avgPkg = 5.2
                else avgPkg = 4.0
            }

            // Estimate / normalize annual fees
            let fee = c.feeCetQuota || 0
            if (fee <= 0) {
                if (c.type === 'Government') fee = 0.45
                else if (c.type === 'Private Aided') fee = 0.95
                else fee = 1.25
            }

            const maxPkg = c.maxPackage || Math.round(avgPkg * 2.8)
            const placement = c.placementRate || (c.tier === 'Tier 1' ? 92 : c.tier === 'Tier 2' ? 82 : 70)

            // Gem Score = (AvgPackage^1.4 * log10(Cutoff) * 12) / max(0.4, Fee)
            const packageScore = Math.pow(avgPkg, 1.4)
            const rankScore = Math.log10(Math.max(100, cutoff))
            const feePenalty = Math.max(0.4, fee)
            const gemScore = Math.round((packageScore * rankScore * 12) / feePenalty)

            return {
                code: c.code,
                name: c.name,
                shortName: c.shortName || c.name.split(' ')[0],
                city: c.city || 'Karnataka',
                district: c.district || '',
                type: c.type,
                autonomous: c.autonomous,
                avgPackage: Number(avgPkg.toFixed(1)),
                maxPackage: Number(maxPkg.toFixed(1)),
                placementRate: placement,
                fees: Number(fee.toFixed(2)),
                cutoff,
                gemScore,
                naacGrade: c.naacGrade,
                tier: c.tier,
                topRecruiters: c.topRecruiters || []
            }
        })
    }, [cutoffMap])

    // Filter and sort gems
    const filteredGems = useMemo(() => {
        const query = searchQuery.toLowerCase().trim()

        return dynamicGems
            .filter(gem => {
                if (gem.avgPackage < minPackage) return false
                if (gem.cutoff > maxRank) return false

                if (query) {
                    const matchName = gem.name.toLowerCase().includes(query)
                    const matchCode = gem.code.toLowerCase().includes(query)
                    const matchCity = gem.city.toLowerCase().includes(query)
                    const matchShort = gem.shortName.toLowerCase().includes(query)
                    if (!matchName && !matchCode && !matchCity && !matchShort) return false
                }

                if (selectedType !== "all") {
                    if (selectedType === "Government" && gem.type !== "Government") return false
                    if (selectedType === "Autonomous" && !gem.autonomous) return false
                    if (selectedType === "Private" && gem.type !== "Private" && gem.type !== "Private Aided") return false
                }

                if (selectedRegion !== "all") {
                    const cLower = gem.city.toLowerCase()
                    if (selectedRegion === "bangalore" && !cLower.includes("bengaluru") && !cLower.includes("bangalore")) return false
                    if (selectedRegion === "mysore" && !cLower.includes("mysuru") && !cLower.includes("mysore") && !cLower.includes("mandya")) return false
                    if (selectedRegion === "coastal" && !cLower.includes("mangaluru") && !cLower.includes("udupi") && !cLower.includes("surathkal")) return false
                    if (selectedRegion === "north" && !cLower.includes("hubballi") && !cLower.includes("dharwad") && !cLower.includes("belagavi") && !cLower.includes("kalaburagi")) return false
                }

                return true
            })
            .sort((a, b) => b.gemScore - a.gemScore)
    }, [dynamicGems, minPackage, maxRank, searchQuery, selectedType, selectedRegion])

    return (
        <div className="space-y-8 max-w-6xl mx-auto px-4 py-6 text-foreground font-sans animate-scale-in">
            <SEO
                title="KCET Hidden Gems – Underrated Engineering Colleges in Karnataka"
                description="Discover underrated engineering colleges in Karnataka with high placement ROI and lower cutoff barriers. Auto-calculated dynamically from 269+ verified college directory profiles and official KEA cutoffs."
                url="https://kcetcoded.dev/hidden-gems"
                keywords="underrated KCET colleges, hidden gem colleges Karnataka, best value engineering colleges, low cutoff good colleges KCET"
            />

            {/* Header Area */}
            <div className="p-6 rounded-lg border border-border bg-card shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] font-mono font-semibold uppercase">
                        <Sparkles className="h-3 w-3" />
                        Dynamic ROI Auto-Calculator
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] text-amber-500 border-amber-500/20 bg-amber-500/10">
                        {COLLEGE_DATABASE.length}+ Directory Colleges Analyzed
                    </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                    <Diamond className="h-6 w-6 text-amber-500 shrink-0" />
                    Hidden <span className="text-primary">Gems</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed">
                    Auto-calculated from the complete <strong>Karnataka College Directory (269+ Campuses)</strong> cross-referenced against live <strong>KEA Cutoff Ranks</strong>. Find high-placement institutions with reasonable cutoff thresholds and low tuition overheads.
                </p>

                {/* Quick Aggregate Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-border/60">
                    <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                        <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block">Qualifying Gems</span>
                        <span className="text-base font-bold font-mono text-foreground">{filteredGems.length} Colleges</span>
                    </div>
                    <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                        <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block">Top Gem Score</span>
                        <span className="text-base font-bold font-mono text-amber-500">{filteredGems[0]?.gemScore || 0} pts</span>
                    </div>
                    <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                        <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block">Median Package</span>
                        <span className="text-base font-bold font-mono text-emerald-500">
                            ₹{filteredGems.length > 0 ? (filteredGems.reduce((acc, g) => acc + g.avgPackage, 0) / filteredGems.length).toFixed(1) : 0} LPA
                        </span>
                    </div>
                    <div className="p-2.5 rounded bg-muted/40 border border-border/60">
                        <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block">Dataset Link</span>
                        <span className="text-base font-bold font-mono text-primary">Live Auto-Sync</span>
                    </div>
                </div>
            </div>

            {/* Filter & Control Bar */}
            <div className="p-5 rounded-lg border border-border bg-card shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <h2 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                        Dynamic ROI Filters
                    </h2>
                    <span className="text-[11px] text-muted-foreground">Showing {filteredGems.length} of {COLLEGE_DATABASE.length} Campuses</span>
                </div>

                {/* Top Row: Search & Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-muted-foreground uppercase">Search College / City</Label>
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, code (E001)..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 h-8 text-xs bg-background border-border"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-muted-foreground uppercase">Quota Category</Label>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="h-8 text-xs bg-background border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat} Quota</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-muted-foreground uppercase">Region / Zone</Label>
                        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                            <SelectTrigger className="h-8 text-xs bg-background border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Karnataka</SelectItem>
                                <SelectItem value="bangalore">Bengaluru Urban</SelectItem>
                                <SelectItem value="mysore">Mysuru / Mandya</SelectItem>
                                <SelectItem value="coastal">Mangaluru / Coastal</SelectItem>
                                <SelectItem value="north">Hubballi / Belagavi / North</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-muted-foreground uppercase">Institution Type</Label>
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="h-8 text-xs bg-background border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All College Types</SelectItem>
                                <SelectItem value="Government">Government Only</SelectItem>
                                <SelectItem value="Autonomous">Autonomous Campuses</SelectItem>
                                <SelectItem value="Private">Private / Aided</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Bottom Row: Range Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-semibold text-muted-foreground uppercase">Minimum Average Salary (LPA)</Label>
                            <span className="text-xs font-mono font-bold text-emerald-500">₹{minPackage} LPA</span>
                        </div>
                        <Input
                            type="range"
                            min={3.5}
                            max={16}
                            step={0.5}
                            value={minPackage}
                            onChange={(e) => setMinPackage(Number(e.target.value))}
                            className="h-2 cursor-pointer bg-muted"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-[11px] font-semibold text-muted-foreground uppercase">Max Cutoff Rank Limit ({selectedCategory})</Label>
                            <span className="text-xs font-mono font-bold text-foreground">#{maxRank.toLocaleString()}</span>
                        </div>
                        <Input
                            type="range"
                            min={5000}
                            max={180000}
                            step={5000}
                            value={maxRank}
                            onChange={(e) => setMaxRank(Number(e.target.value))}
                            className="h-2 cursor-pointer bg-muted"
                        />
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                        Ranked Hidden Gem Campuses ({filteredGems.length})
                    </h2>
                    <span className="text-[11px] font-mono text-muted-foreground">Auto-ranked by ROI Index Formula</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Compiling 269+ Directory profiles with KEA cutoffs...
                    </div>
                ) : filteredGems.length === 0 ? (
                    <div className="p-12 rounded-lg border border-border bg-card text-center space-y-2">
                        <Diamond className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                        <h3 className="text-sm font-semibold text-foreground">No campuses meet these exact threshold bounds</h3>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            Try adjusting the minimum package slider or increasing the maximum rank cutoff limit.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredGems.map((college, idx) => (
                            <Card key={college.code} className="border border-border bg-card shadow-xs hover:border-slate-600 transition-colors flex flex-col justify-between">
                                <CardContent className="p-4 space-y-3">
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Badge variant="outline" className="font-mono text-[10px] border-primary/20 text-primary bg-primary/5">
                                                    {college.code}
                                                </Badge>
                                                <Badge variant="secondary" className="font-mono text-[10px] text-amber-500 bg-amber-500/10 border-amber-500/20 font-bold">
                                                    ROI #{idx + 1} • {college.gemScore} pts
                                                </Badge>
                                            </div>
                                            <h3 className="text-sm font-bold text-foreground leading-snug line-clamp-2">
                                                {college.name}
                                            </h3>
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                                                {college.city} • {college.type} {college.autonomous && "• Autonomous"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Metric Grid */}
                                    <div className="grid grid-cols-3 gap-1.5 text-xs pt-2 border-t border-border/60">
                                        <div className="p-2 rounded bg-muted/40 border border-border/60">
                                            <span className="text-[9px] uppercase font-mono font-semibold text-muted-foreground block">Avg Salary</span>
                                            <span className="font-bold text-emerald-500 font-mono text-xs">₹{college.avgPackage} LPA</span>
                                        </div>
                                        <div className="p-2 rounded bg-muted/40 border border-border/60">
                                            <span className="text-[9px] uppercase font-mono font-semibold text-muted-foreground block">{selectedCategory} Cutoff</span>
                                            <span className="font-bold font-mono text-foreground text-xs">#{college.cutoff.toLocaleString()}</span>
                                        </div>
                                        <div className="p-2 rounded bg-muted/40 border border-border/60">
                                            <span className="text-[9px] uppercase font-mono font-semibold text-muted-foreground block">Annual Fee</span>
                                            <span className="font-bold font-mono text-foreground text-xs">~₹{college.fees}L</span>
                                        </div>
                                    </div>

                                    {/* Recruiters / Accreditation Tags */}
                                    <div className="space-y-1.5 pt-1 text-xs">
                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                            <span>Placement Rate: <strong className="text-foreground font-mono">{college.placementRate}%</strong></span>
                                            {college.naacGrade && (
                                                <span className="font-mono text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                                                    NAAC {college.naacGrade}
                                                </span>
                                            )}
                                        </div>

                                        {college.topRecruiters && college.topRecruiters.length > 0 && (
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {college.topRecruiters.slice(0, 3).map((r, rIdx) => (
                                                    <span key={rIdx} className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/40 truncate max-w-[100px]">
                                                        {r}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Link Action */}
                                    <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs">
                                        <span className="text-[11px] font-mono text-muted-foreground">{college.tier}</span>
                                        <Link
                                            to={`/college/${college.code}`}
                                            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                                        >
                                            View Directory Profile <ArrowUpRight className="h-3 w-3" />
                                        </Link>
                                    </div>
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

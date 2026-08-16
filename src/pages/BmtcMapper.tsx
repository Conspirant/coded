import { SEO } from "@/components/SEO"
import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
    MapPin,
    Bus,
    Navigation,
    School,
    ExternalLink,
    Search,
    Map,
    Sparkles,
    CheckCircle2
} from "lucide-react"
import { Link } from "react-router-dom"
import { BMTC_COLLEGES } from "@/lib/bmtc-colleges"

export const BmtcMapper = () => {
    const [searchQuery, setSearchQuery] = useState("")

    const filteredColleges = useMemo(() => {
        const query = searchQuery.toLowerCase().trim()
        if (!query) return BMTC_COLLEGES

        return BMTC_COLLEGES.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.area.toLowerCase().includes(query) ||
            c.nearestStop.toLowerCase().includes(query) ||
            c.primaryRoutes.some(r => r.toLowerCase().includes(query)) ||
            c.connectivityHubs.some(h => h.toLowerCase().includes(query))
        )
    }, [searchQuery])

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 py-6 text-foreground font-sans animate-scale-in">
            <SEO
                title="KCET BMTC Route Mapper – Engineering Colleges on Bus Routes"
                description="Find engineering colleges in Bangalore accessible by BMTC bus routes. Plan your daily commute to college using public transport."
                url="https://kcetcoded.dev/bmtc-mapper"
                keywords="engineering colleges BMTC bus routes, colleges near bus stop Bangalore, BMTC college commute"
            />

            {/* Header Area */}
            <div className="p-6 rounded-lg border border-border bg-card shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] font-mono font-semibold uppercase">
                        <Sparkles className="h-3 w-3" />
                        Coded Labs Transit Research
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground border-border">
                        BMTC Public Transit Map
                    </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    BMTC Route <span className="text-primary">Mapper</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    Commute smart. Find which engineering colleges have direct frequency from major bus terminals (Majestic, KR Market, Hebbal, Silk Board) and student pass accessibility.
                </p>
            </div>

            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by college name, bus route (e.g. 500-D, 365, 201), hub (Majestic), or area (Whitefield)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-background border-border text-xs sm:text-sm focus:border-primary rounded-md"
                />
            </div>

            {/* Layout: Key Transit Info & Colleges */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Transit Tips (Left Panel) */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border border-border bg-card shadow-xs">
                        <CardContent className="p-4 space-y-3 text-xs">
                            <h3 className="font-bold text-foreground flex items-center gap-1.5 border-b border-border/60 pb-2">
                                <Map className="h-3.5 w-3.5 text-primary" /> Major Hubs
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                <strong>Majestic (KBS)</strong>, <strong>KR Market</strong>, <strong>Silk Board</strong>, and <strong>Yeshwanthpur</strong> connect to over 85% of campuses.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border border-border bg-card shadow-xs">
                        <CardContent className="p-4 space-y-3 text-xs">
                            <h3 className="font-bold text-foreground flex items-center gap-1.5 border-b border-border/60 pb-2">
                                <Bus className="h-3.5 w-3.5 text-primary" /> Student Passes
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                BMTC student passes give unlimited travel on non-AC buses for ~₹1,500/year upon producing KEA verification slips.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* College List (Right Panel) */}
                <div className="lg:col-span-3 space-y-3">
                    <div className="flex items-center justify-between pb-1">
                        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <School className="h-4 w-4 text-primary" />
                            Bus Accessible Campuses ({filteredColleges.length})
                        </h2>
                    </div>

                    {filteredColleges.length === 0 ? (
                        <div className="p-8 rounded-lg border border-border bg-card text-center space-y-2">
                            <Bus className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                            <h3 className="text-sm font-semibold text-foreground">No matching transit routes found</h3>
                            <p className="text-xs text-muted-foreground">Try searching with a broader area name or major terminal hub.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredColleges.map((college, idx) => (
                                <Card key={idx} className="border border-border bg-card shadow-xs hover:border-slate-600 transition-colors">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="font-mono text-[10px] border-primary/20 text-primary bg-primary/5">
                                                        {college.code || "KCET"}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        {college.area}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-foreground">
                                                    {college.name}
                                                </h3>
                                            </div>
                                            <Badge variant="secondary" className="text-[11px] font-mono bg-muted text-foreground shrink-0">
                                                Stop: {college.nearestStop}
                                            </Badge>
                                        </div>

                                        <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
                                            <div>
                                                <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block mb-1">Primary Bus Routes</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {college.primaryRoutes.map((route, rIdx) => (
                                                        <Badge key={rIdx} variant="secondary" className="text-[10px] font-mono font-bold bg-muted/80 text-foreground border-border">
                                                            {route}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block mb-1">Connected Terminal Hubs</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {college.connectivityHubs.map((hub, hIdx) => (
                                                        <span key={hIdx} className="text-[11px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/40">
                                                            {hub}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default BmtcMapper

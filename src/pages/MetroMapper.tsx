import { SEO } from "@/components/SEO"
import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    MapPin,
    Train,
    Navigation,
    School,
    ExternalLink,
    Clock,
    Sparkles,
    ChevronRight
} from "lucide-react"
import { Link } from "react-router-dom"
import { METRO_LINES, METRO_COLLEGES } from "@/lib/metro-colleges"

export const MetroMapper = () => {
    const [selectedLine, setSelectedLine] = useState<string>("purple")

    const filteredColleges = useMemo(() => {
        return METRO_COLLEGES
            .filter(c => c.line === selectedLine)
            .sort((a, b) => {
                const aNum = parseInt(a.walkTime) || 99
                const bNum = parseInt(b.walkTime) || 99
                return aNum - bNum
            })
    }, [selectedLine])

    const currentLine = METRO_LINES.find(l => l.id === selectedLine)

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 py-6 text-foreground font-sans animate-scale-in">
            <SEO
                title="KCET Metro Mapper – Engineering Colleges Near Bangalore Metro"
                description="Find top engineering colleges in Bangalore within walking distance of Namma Metro stations. Filter by metro line, distance & cutoff ranks."
                url="https://kcetcoded.dev/metro-mapper"
                keywords="engineering colleges near Bangalore metro, colleges near metro station, Namma Metro colleges, KCET metro colleges"
            />

            {/* Header Area */}
            <div className="p-6 rounded-lg border border-border bg-card shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] font-mono font-semibold uppercase">
                        <Sparkles className="h-3 w-3" />
                        Coded Labs Transit Research
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground border-border">
                        Bengaluru Transit Network
                    </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Metro <span className="text-primary">Mapper</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    Beat the Silk Board and Outer Ring Road gridlock. Discover reputable engineering campuses with direct pedestrian walking distance or feeder connectivity to Namma Metro stations.
                </p>
            </div>

            {/* Line Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {METRO_LINES.map(line => {
                    const isSelected = selectedLine === line.id
                    const count = METRO_COLLEGES.filter(c => c.line === line.id).length
                    return (
                        <button
                            key={line.id}
                            type="button"
                            onClick={() => setSelectedLine(line.id)}
                            className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between gap-2 ${
                                isSelected
                                    ? 'border-primary bg-primary/10 text-foreground shadow-xs'
                                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-slate-600'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <div className={`w-3.5 h-3.5 rounded-full ${line.id === 'purple' ? 'bg-purple-500' : line.id === 'green' ? 'bg-emerald-500' : line.id === 'yellow' ? 'bg-amber-500' : 'bg-pink-500'}`} />
                                <span className="text-xs sm:text-sm font-bold text-foreground">{line.name}</span>
                            </div>
                            <Badge variant="secondary" className="font-mono text-[10px] px-1.5 py-0">
                                {count} {count === 1 ? 'College' : 'Colleges'}
                            </Badge>
                        </button>
                    )
                })}
            </div>

            {/* Layout: Stations & Colleges */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Station Line Trail (Left Column) */}
                <div className="lg:col-span-1 space-y-3">
                    <Card className="border border-border bg-card shadow-xs">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-border/60">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                                    <Train className="h-3.5 w-3.5 text-primary" />
                                    Station Line
                                </h2>
                                <span className="text-[11px] font-mono text-muted-foreground">{currentLine?.stations.length} Stops</span>
                            </div>

                            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                                {currentLine?.stations.map((station, idx) => {
                                    const matchingColleges = filteredColleges.filter(c => c.station === station)
                                    const hasCollege = matchingColleges.length > 0

                                    return (
                                        <div key={idx} className="flex items-center justify-between gap-2 text-xs py-1 border-b border-border/30 last:border-0">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <div className={`w-2 h-2 rounded-full shrink-0 ${hasCollege ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-muted-foreground/40'}`} />
                                                <span className={`truncate ${hasCollege ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                                                    {station}
                                                </span>
                                            </div>
                                            {hasCollege && (
                                                <Badge variant="outline" className="text-[9px] font-mono text-emerald-500 border-emerald-500/20 bg-emerald-500/10 shrink-0">
                                                    {matchingColleges.length}
                                                </Badge>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* College Cards (Right Column) */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between pb-1">
                        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                            <School className="h-4 w-4 text-primary" />
                            Connected Campuses ({filteredColleges.length})
                        </h2>
                    </div>

                    {filteredColleges.length === 0 ? (
                        <div className="p-8 rounded-lg border border-border bg-card text-center space-y-2">
                            <School className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                            <h3 className="text-sm font-semibold text-foreground">No campuses listed for this line yet</h3>
                            <p className="text-xs text-muted-foreground">Select another metro corridor to browse transit-connected institutions.</p>
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
                                                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                                        {college.station} Station
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-foreground">
                                                    {college.name}
                                                </h3>
                                            </div>
                                            <Badge variant="secondary" className="text-xs font-mono font-bold bg-muted text-foreground shrink-0 flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-primary" />
                                                {college.walkTime}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                                            <div className="p-2 rounded bg-muted/40 border border-border/60">
                                                <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block">Transit Distance</span>
                                                <span className="font-bold text-foreground">{college.distance}</span>
                                            </div>
                                            <div className="p-2 rounded bg-muted/40 border border-border/60">
                                                <span className="text-[10px] uppercase font-mono font-semibold text-muted-foreground block">Typical Cutoff Range</span>
                                                <span className="font-bold font-mono text-foreground">{college.typicalCutoff || "Varies by branch"}</span>
                                            </div>
                                        </div>

                                        {college.transitNote && (
                                            <p className="text-[11px] text-muted-foreground bg-muted/20 p-2 rounded border border-border/40 leading-relaxed">
                                                💡 {college.transitNote}
                                            </p>
                                        )}
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

export default MetroMapper

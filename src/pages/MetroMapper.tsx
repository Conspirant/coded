import { useState, useEffect, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    MapPin,
    Train,
    Navigation,
    School,
    ExternalLink,
    Loader2
} from "lucide-react"
import { Link } from "react-router-dom"
import { METRO_LINES, METRO_COLLEGES } from "@/lib/metro-colleges"

const MetroMapper = () => {
    const [selectedLine, setSelectedLine] = useState<string>("purple")

    const filteredColleges = useMemo(() => {
        return METRO_COLLEGES
            .filter(c => c.line === selectedLine)
            .sort((a, b) => {
                // Sort by distance (walk time) — shorter first
                const aNum = parseInt(a.walkTime) || 99
                const bNum = parseInt(b.walkTime) || 99
                return aNum - bNum
            })
    }, [selectedLine])

    const currentLine = METRO_LINES.find(l => l.id === selectedLine)

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans selection:bg-green-500/30">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-4 py-1 rounded-full border-green-500/50 text-green-400 bg-green-500/10 text-sm uppercase tracking-widest">
                        Namma Metro × KCET
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Metro Mapper
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Beat the Bangalore traffic. Find top engineering colleges accessible via <span className="text-white font-semibold">Namma Metro</span>.
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-mono">
                        Distances verified from Google Maps & yometro.com
                    </p>
                </div>

                {/* Map Visualization */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl p-1">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Line Selection */}
                    <div className="flex flex-wrap justify-center gap-4 p-6 bg-black/40">
                        {METRO_LINES.map(line => (
                            <button
                                key={line.id}
                                onClick={() => setSelectedLine(line.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full md:rounded-xl md:flex-1 transition-all
                            ${selectedLine === line.id
                                        ? `${line.color} text-white shadow-lg scale-105`
                                        : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                                    }`}
                            >
                                <Train className="h-5 w-5" />
                                <span className="font-bold">{line.name}</span>
                                <Badge variant="secondary" className="bg-white/10 text-white/70 text-[10px] ml-1">
                                    {METRO_COLLEGES.filter(c => c.line === line.id).length}
                                </Badge>
                            </button>
                        ))}
                    </div>

                    <div className="p-6 sm:p-10 min-h-[400px]">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Station List (Left Panel) */}
                            <div className="space-y-4 lg:col-span-1">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-white/60" />
                                        Stations
                                    </h3>
                                    <span className="text-xs text-muted-foreground">{currentLine?.stations.length} stops</span>
                                </div>
                                <div className="space-y-2 relative max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
                                    {/* Vertical Line */}
                                    <div className={`absolute left-2.5 top-2 bottom-2 w-0.5 ${currentLine?.color} opacity-30`} />

                                    {currentLine?.stations.map((station, idx) => {
                                        const hasCollege = filteredColleges.some(c => c.station === station)
                                        return (
                                            <div key={idx} className={`flex items-center gap-4 group ${hasCollege ? 'font-semibold' : ''}`}>
                                                <div className={`h-5 w-5 rounded-full border-4 border-black z-10 shrink-0 transition-all ${currentLine.color} ${hasCollege ? 'ring-2 ring-white/30 scale-110' : ''}`} />
                                                <span className={`text-sm transition-colors ${hasCollege ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                                                    {station}
                                                    {hasCollege && <span className="ml-1 text-xs text-green-400">●</span>}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Colleges List (Right Panel) */}
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                    <School className="h-5 w-5 text-white/60" />
                                    Colleges on this Line
                                    <span className="text-sm font-normal text-muted-foreground ml-2">
                                        ({filteredColleges.length} found)
                                    </span>
                                </h3>

                                <div className="grid gap-4">
                                    {filteredColleges.map((college) => (
                                        <div key={college.code + college.station} className="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-green-500/30 hover:shadow-[0_0_30px_-10px_rgba(34,197,94,0.15)] transition-all duration-300">

                                            <div className="flex-1 space-y-1 mb-4 sm:mb-0">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="border-white/10 text-[10px] text-white/40 font-mono tracking-wider">{college.code}</Badge>
                                                    <h4 className="font-bold text-lg text-white group-hover:text-green-300 transition-colors">{college.name}</h4>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                                                    <Navigation className="h-3.5 w-3.5 text-green-500/50" />
                                                    <span>Nearest: <span className="text-white/90 font-medium">{college.station}</span></span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 sm:text-right bg-black/40 p-3 rounded-xl border border-white/5">
                                                <div>
                                                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Walking Time</div>
                                                    <div className="font-black text-green-400 flex items-center gap-1">
                                                        <span>{college.walkTime}</span>
                                                    </div>
                                                </div>
                                                <div className="px-4 border-l border-white/10">
                                                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Map Distance</div>
                                                    <div className="font-black text-white">{college.distance}</div>
                                                </div>
                                                <Link to={`/college/${college.code}`}>
                                                    <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 text-white/40 hover:text-white hover:bg-white/10 shrink-0 border border-white/5 hover:border-white/20 transition-all">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MetroMapper

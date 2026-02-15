import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    MapPin,
    Train,
    Navigation,
    School,
    ExternalLink
} from "lucide-react"

// Mock Data for Metro Lines and Stations
const METRO_LINES = [
    { id: "purple", name: "Purple Line", color: "bg-purple-600", stations: ["Kengeri", "Mysore Road", "Vijayanagar", "Majestic", "MG Road", "Indiranagar", "Baiyappanahalli", "Whitefield"] },
    { id: "green", name: "Green Line", color: "bg-green-600", stations: ["Silk Institute", "Banashankari", "National College", "Majestic", "Mantri Square", "Yeshwanthpur", "Peenya", "Nagasandra"] },
    { id: "yellow", name: "Yellow Line (Upcoming)", color: "bg-yellow-500", stations: ["Bommasandra", "Electronic City", "Silk Board", "RV Road"] },
]

// Mock Data for Colleges near Metro
const METRO_COLLEGES = [
    {
        code: "E001",
        name: "UVCE",
        line: "purple",
        station: "Dr. B.R. Ambedkar Station",
        distance: "0.2 km",
        walkTime: "3 mins",
        cutoff: 2500
    },
    {
        code: "E003",
        name: "BMS College of Engineering",
        line: "green",
        station: "National College",
        distance: "0.8 km",
        walkTime: "10 mins",
        cutoff: 900
    },
    {
        code: "E005",
        name: "RV College of Engineering",
        line: "purple",
        station: "Pattanagere",
        distance: "1.2 km",
        walkTime: "15 mins",
        cutoff: 250
    },
    {
        code: "E006",
        name: "MSRIT",
        line: "green",
        station: "Sandal Soap Factory",
        distance: "1.5 km",
        walkTime: "18 mins",
        cutoff: 800
    },
    {
        code: "E008",
        name: "Bangalore Institute of Technology",
        line: "green",
        station: "National College",
        distance: "0.5 km",
        walkTime: "6 mins",
        cutoff: 3500
    },
    {
        code: "E009",
        name: "PES University (RR)",
        line: "purple",
        station: "Mysore Road",
        distance: "2.5 km (Auto req)",
        walkTime: "Auto: 10 mins",
        cutoff: 550
    },
    {
        code: "E002",
        name: "SKSJT Institute",
        line: "purple",
        station: "Dr. B.R. Ambedkar Station",
        distance: "0.1 km",
        walkTime: "1 min",
        cutoff: 15000
    }
]

const MetroMapper = () => {
    const [selectedLine, setSelectedLine] = useState<string>("purple")

    const filteredColleges = METRO_COLLEGES.filter(c => c.line === selectedLine)
    const currentLine = METRO_LINES.find(l => l.id === selectedLine)

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans selection:bg-green-500/30">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-4 py-1 rounded-full border-green-500/50 text-green-400 bg-green-500/10 text-sm uppercase tracking-widest">
                        beta feature
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Metro Mapper
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Beat the Bangalore traffic. Find top engineering colleges accessible via <span className="text-white font-semibold">Namma Metro</span>.
                    </p>
                </div>

                {/* Map Visualization (Conceptual) */}
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
                                        ? `${line.color} text-white shadow-lg shadow-${line.id}-500/20 scale-105`
                                        : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                                    }`}
                            >
                                <Train className="h-5 w-5" />
                                <span className="font-bold">{line.name}</span>
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
                                        Major Stations
                                    </h3>
                                </div>
                                <div className="space-y-2 relative">
                                    {/* Vertical Line */}
                                    <div className={`absolute left-2.5 top-2 bottom-2 w-0.5 ${currentLine?.color} opacity-30`} />

                                    {currentLine?.stations.map((station, idx) => (
                                        <div key={idx} className="flex items-center gap-4 group">
                                            <div className={`h-5 w-5 rounded-full border-4 border-black z-10 shrink-0 transition-all ${currentLine.color}`} />
                                            <span className="text-sm text-white/50 group-hover:text-white transition-colors">{station}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Colleges List (Right Panel) */}
                            <div className="lg:col-span-2 space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                                    <School className="h-5 w-5 text-white/60" />
                                    Colleges on this Line
                                </h3>

                                {filteredColleges.length === 0 ? (
                                    <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
                                        <p className="text-muted-foreground">No major colleges mapped on this line yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {filteredColleges.map((college) => (
                                            <div key={college.code} className="group flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all">

                                                <div className="flex-1 space-y-1 mb-4 sm:mb-0">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="border-white/10 text-xs text-white/40">{college.code}</Badge>
                                                        <h4 className="font-bold text-lg">{college.name}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Navigation className="h-3 w-3" />
                                                        <span>Nearest: <span className="text-white">{college.station}</span></span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-6 sm:text-right">
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Walking Time</div>
                                                        <div className="font-bold text-green-400">{college.walkTime}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-muted-foreground">Distance</div>
                                                        <div className="font-bold">{college.distance}</div>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MetroMapper

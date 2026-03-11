import { SEO } from "@/components/SEO"
import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    MapPin,
    Bus,
    Navigation,
    School,
    ExternalLink,
    Search,
    Map
} from "lucide-react"
import { Link } from "react-router-dom"
import { BMTC_COLLEGES } from "@/lib/bmtc-colleges"

const BmtcMapper = () => {
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
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans selection:bg-blue-500/30">
      <SEO
        title="KCET BMTC Route Mapper – Engineering Colleges on Bus Routes"
        description="Find engineering colleges in Bangalore accessible by BMTC bus routes. Plan your daily commute to college using public transport."
        url="https://kcet-coded2.vercel.app/bmtc-mapper"
        keywords="engineering colleges BMTC bus routes, colleges near bus stop Bangalore, BMTC college commute"
      />
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    <Badge variant="outline" className="px-4 py-1 rounded-full border-blue-500/50 text-blue-400 bg-blue-500/10 text-sm uppercase tracking-widest flex items-center gap-2 w-fit mx-auto">
                        <Bus className="h-4 w-4" /> BMTC Connectivity
                    </Badge>
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                        Bus Route Mapper
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Navigate Bangalore like a pro. Find which engineering colleges are best connected by the <span className="text-white font-semibold flex-inline items-center gap-1">BMTC network</span>.
                    </p>
                    <p className="text-xs text-muted-foreground/60 font-mono">
                        Data verified for 2024-2025 routes
                    </p>
                </div>

                {/* Search & Map Visualization */}
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl p-1">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

                    {/* Search Bar */}
                    <div className="p-6 sm:p-8 bg-black/40 border-b border-white/5">
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by college, area, route (e.g., 500-D), or hub (e.g., Majestic)..."
                                className="w-full pl-12 h-14 bg-white/5 border-white/10 rounded-2xl text-lg focus-visible:ring-blue-500/50"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="p-6 sm:p-10 min-h-[400px]">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                            {/* Info Left Panel */}
                            <div className="space-y-6 lg:col-span-1 hidden lg:block">
                                <div className="space-y-2">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Map className="h-5 w-5 text-blue-400" /> Key Hubs
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Majestic, KR Market, Silk Board, and Yeshwanthpur offer direct buses to most colleges.</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Bus className="h-5 w-5 text-blue-400" /> Route Types
                                    </h3>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        <li><span className="text-blue-300">500 series:</span> Outer Ring Road</li>
                                        <li><span className="text-blue-300">200 series:</span> South/West Bangalore</li>
                                        <li><span className="text-blue-300">300 series:</span> East Bangalore</li>
                                        <li><span className="text-blue-300">Vajra:</span> AC Volvo Services</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Colleges List */}
                            <div className="lg:col-span-3 space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <School className="h-5 w-5 text-white/60" />
                                        Connected Colleges
                                    </h3>
                                    <span className="text-sm font-medium text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full">
                                        {filteredColleges.length} results
                                    </span>
                                </div>

                                {filteredColleges.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5 p-8 text-center space-y-4">
                                        <Search className="h-10 w-10 text-muted-foreground" />
                                        <div>
                                            <p className="font-bold text-lg">No routes found</p>
                                            <p className="text-muted-foreground">Try a different area, college, or bus number.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {filteredColleges.map((college) => (
                                            <div key={college.code} className="group relative flex flex-col md:flex-row items-stretch md:items-start justify-between p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] hover:border-blue-500/30 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] transition-all duration-300 gap-6">

                                                {/* Left side: College Info */}
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge variant="outline" className="border-white/10 text-[10px] text-white/40 font-mono tracking-wider">{college.code}</Badge>
                                                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400/80">{college.area}</span>
                                                        </div>
                                                        <h4 className="font-bold text-xl text-white group-hover:text-blue-300 transition-colors">{college.name}</h4>
                                                    </div>

                                                    <div className="flex items-start sm:items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4 text-blue-500/60 mt-0.5 sm:mt-0" />
                                                        <div>
                                                            Nearest Stop: <span className="text-white/90 font-medium">{college.nearestStop}</span>
                                                            <span className="md:hidden block mt-1 text-xs text-blue-400 font-medium">{college.walkTime} walk</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        {college.connectivityHubs.map(hub => (
                                                            <Badge key={hub} variant="secondary" className="bg-white/5 text-white/60 font-normal hover:bg-white/10 transition-colors">
                                                                From {hub}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Right side: Bus Data */}
                                                <div className="flex flex-col justify-between items-start md:items-end gap-4 min-w-[200px]">
                                                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 w-full md:w-auto text-center md:text-right">
                                                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Primary Routes</div>
                                                        <div className="flex flex-wrap justify-center md:justify-end gap-1.5">
                                                            {college.primaryRoutes.map(route => (
                                                                <span key={route} className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                                                                    {route}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6">
                                                        <div className="hidden md:block text-right">
                                                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Walking Time</div>
                                                            <div className="font-black text-blue-400">{college.walkTime}</div>
                                                        </div>
                                                        <Link to={`/college/${college.code}`}>
                                                            <Button variant="ghost" className="rounded-full bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20 transition-all font-semibold px-6">
                                                                View College <ExternalLink className="ml-2 h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
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

export default BmtcMapper

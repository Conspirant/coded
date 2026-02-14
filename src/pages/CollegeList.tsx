import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Building2, ArrowRight } from "lucide-react"

interface College {
    code: string
    name: string
}

const CollegeList = () => {
    const [colleges, setColleges] = useState<College[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const loadColleges = async () => {
            try {
                setLoading(true)
                // Prefer high-volume merged dataset first, then fall back.
                const urls = [
                    '/data/kcet_cutoffs_high_volume.json',
                    '/data/kcet_cutoffs_master.json',
                    '/data/kcet_cutoffs_consolidated.json',
                    '/kcet_cutoffs_high_volume.json',
                    '/kcet_cutoffs_master.json',
                    '/kcet_cutoffs_consolidated.json',
                ]
                let response: Response | null = null
                for (const url of urls) {
                    const res = await fetch(url)
                    if (res.ok) {
                        response = res
                        break
                    }
                }
                if (!response) throw new Error('Failed to load data')

                const data = await response.json()
                let rawList: any[] = []

                if (Array.isArray(data)) rawList = data
                else if (data.data) rawList = data.data
                else if (data.cutoffs) rawList = data.cutoffs

                // Extract unique colleges with stable naming: choose the most frequent
                // institute name per code to avoid one-off OCR/name variants.
                const uniqueColl = new Map<string, Map<string, number>>()
                rawList.forEach(item => {
                    if (item.institute_code && item.institute) {
                        const code = item.institute_code.trim().toUpperCase()
                        const name = String(item.institute).trim()
                        if (!name) return
                        if (!uniqueColl.has(code)) uniqueColl.set(code, new Map<string, number>())
                        const nameCounts = uniqueColl.get(code)!
                        nameCounts.set(name, (nameCounts.get(name) || 0) + 1)
                    }
                })

                const list = Array.from(uniqueColl.entries()).map(([code, nameCounts]) => {
                    let bestName = ""
                    let bestCount = -1
                    for (const [name, count] of nameCounts.entries()) {
                        if (count > bestCount || (count === bestCount && name < bestName)) {
                            bestName = name
                            bestCount = count
                        }
                    }
                    return {
                        code,
                        name: bestName || code
                    }
                }).sort((a, b) => a.code.localeCompare(b.code))

                setColleges(list)
            } catch (error) {
                console.error("Error loading colleges", error)
            } finally {
                setLoading(false)
            }
        }
        loadColleges()
    }, [])

    const filteredColleges = colleges.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">College Directory</h1>
                        <p className="text-muted-foreground mt-1">
                            Browse all KCET colleges and access detailed analytics, community, and mentors.
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative max-w-md w-full mb-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by college name or code..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-32 bg-secondary/20 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredColleges.map((college) => (
                            <Link key={college.code} to={`/college/${college.code}`}>
                                <Card className="h-full hover:shadow-md transition-all hover:border-blue-500/50 group cursor-pointer bg-card/50 backdrop-blur-sm">
                                    <CardContent className="p-6 flex items-start justify-between gap-4">
                                        <div className="space-y-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-lg leading-tight group-hover:text-blue-500 transition-colors">
                                                    {college.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground mt-1 font-mono">
                                                    Code: {college.code}
                                                </div>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}

                        {filteredColleges.length === 0 && (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                No colleges found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default CollegeList

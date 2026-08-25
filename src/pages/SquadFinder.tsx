import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Users,
    UserPlus,
    Trash2,
    Search,
    MapPin,
    Sparkles,
    ArrowRight,
    School,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    Shield
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { CutoffService, CutoffData } from "@/lib/cutoff-service"

interface Friend {
    id: string
    name: string
    rank: number
}

interface CollegeMatch {
    code: string
    name: string
    branches: {
        name: string
        cutoff: number
    }[]
}

const CATEGORIES = ["GM", "1G", "1K", "1R", "2AG", "2AK", "2AR", "2BG", "2BK", "2BR", "3AG", "3AK", "3AR", "3BG", "3BK", "3BR", "GMK", "GMR", "SCG", "SCK", "SCR", "STG", "STK", "STR"]

export const SquadFinder = () => {
    const { toast } = useToast()

    // State
    const [myRank, setMyRank] = useState<number | "">("")
    const [friends, setFriends] = useState<Friend[]>([])
    const [newName, setNewName] = useState("")
    const [newRank, setNewRank] = useState<number | "">("")
    const [results, setResults] = useState<CollegeMatch[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("GM")
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [cutoffData, setCutoffData] = useState<CutoffData[]>([])
    const [dataLoaded, setDataLoaded] = useState(false)

    // Load Cutoff Data via CutoffService Vault
    useEffect(() => {
        const fetchCutoffs = async () => {
            try {
                const data = await CutoffService.loadCutoffs()
                if (data && data.length > 0) {
                    setCutoffData(data)
                    setDataLoaded(true)
                }
            } catch (err) {
                console.error("SquadFinder data load error:", err)
            }
        }

        fetchCutoffs()
    }, [])

    const addFriend = () => {
        if (!newName.trim()) {
            toast({ title: "Name required", description: "Please enter your friend's name", variant: "destructive" })
            return
        }
        if (!newRank || Number(newRank) <= 0) {
            toast({ title: "Valid rank required", description: "Please enter a valid rank", variant: "destructive" })
            return
        }
        if (friends.length >= 3) {
            toast({ title: "Squad full", description: "You can add up to 3 friends (4 total squad size)", variant: "destructive" })
            return
        }

        setFriends([...friends, { id: Math.random().toString(), name: newName.trim(), rank: Number(newRank) }])
        setNewName("")
        setNewRank("")
    }

    const removeFriend = (id: string) => {
        setFriends(friends.filter(f => f.id !== id))
    }

    const handleSearch = () => {
        if (!myRank) {
            toast({ title: "Your rank is required", description: "Please enter your own KCET rank to proceed", variant: "destructive" })
            return
        }

        setIsSearching(true)

        setTimeout(() => {
            const allRanks = [Number(myRank), ...friends.map(f => f.rank)]
            const worstRank = Math.max(...allRanks)

            const targetCategory = selectedCategory || "GM"

            const validRows = cutoffData.filter(row => {
                if (row.category !== targetCategory) return false
                if (selectedLocation !== "all") {
                    const isBlr = (row.college_name || row.institute_code).toLowerCase().includes("bangalore") ||
                        (row.college_name || row.institute_code).toLowerCase().includes("bengaluru")
                    if (selectedLocation === "bangalore" && !isBlr) return false
                    if (selectedLocation === "other" && isBlr) return false
                }
                return row.cutoff_rank >= worstRank
            })

            const collegeMap = new Map<string, CollegeMatch>()

            for (const row of validRows) {
                const code = row.institute_code
                if (!collegeMap.has(code)) {
                    collegeMap.set(code, {
                        code,
                        name: row.college_name || code,
                        branches: []
                    })
                }
                const college = collegeMap.get(code)!
                if (!college.branches.some(b => b.name === row.course)) {
                    college.branches.push({
                        name: row.course,
                        cutoff: row.cutoff_rank
                    })
                }
            }

            const sortedColleges = Array.from(collegeMap.values()).sort((a, b) => b.branches.length - a.branches.length)

            setResults(sortedColleges)
            setIsSearching(false)

            if (sortedColleges.length === 0) {
                toast({
                    title: "No perfect matches found",
                    description: "Try adjusting the target category or removing extreme rank gaps in the squad.",
                })
            }
        }, 300)
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 py-6 text-foreground font-sans animate-scale-in">
            <SEO
                title="KCET Squad Finder – Find Colleges Where Friends Can Go Together"
                description="Don't split the gang! Enter your friends' KCET ranks and find colleges where everyone can get a seat together. Unique squad-matching tool for KCET aspirants."
                url="https://kcetcoded.dev/squad-finder"
                keywords="KCET squad finder, KCET group college predictor, KCET friends same college, study group finder KCET"
            />

            {/* Header Area */}
            <div className="p-6 rounded-lg border border-border bg-card shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded border border-primary/20 bg-primary/10 text-primary text-[10px] font-mono font-semibold uppercase">
                        <Sparkles className="h-3 w-3" />
                        Coded Labs Research
                    </div>
                    <Badge variant="outline" className={`text-[10px] font-mono ${dataLoaded ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/10" : "text-amber-500 border-amber-500/20 bg-amber-500/10"}`}>
                        {dataLoaded ? "197k+ Records Ready" : "Loading Dataset..."}
                    </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    Squad <span className="text-primary">Finder</span>
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                    Don't split the gang. Enter your rank alongside your friends' ranks to find top engineering campuses where <strong>everyone in the squad</strong> can get admitted simultaneously.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Section */}
                <div className="space-y-5">
                    <Card className="border border-border bg-card shadow-xs">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                                <Users className="h-4.5 w-4.5 text-primary" />
                                Build Your Squad
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Configure your team ranks and seat quota.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Category Selector */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quota Category</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="bg-background border-border">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Location Filter */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Campus Location</Label>
                                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                    <SelectTrigger className="bg-background border-border">
                                        <SelectValue placeholder="All Karnataka" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Karnataka Institutes</SelectItem>
                                        <SelectItem value="bangalore">Bengaluru Urban Only</SelectItem>
                                        <SelectItem value="other">Outside Bengaluru</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* My Rank */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-semibold text-foreground">Your Rank (Leader)</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 14500"
                                    value={myRank}
                                    onChange={(e) => setMyRank(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="bg-background border-border font-mono text-sm"
                                />
                            </div>

                            {/* Friends List */}
                            <div className="space-y-2 pt-2 border-t border-border/60">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-semibold text-muted-foreground">Squad Members ({friends.length}/3)</Label>
                                    <span className="text-[11px] text-muted-foreground">Max 4 Members Total</span>
                                </div>

                                {friends.map(friend => (
                                    <div key={friend.id} className="flex items-center justify-between p-2.5 rounded-md bg-muted/40 border border-border text-xs">
                                        <div className="flex items-center gap-2.5">
                                            <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold font-mono text-[10px]">
                                                {friend.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground">{friend.name}</p>
                                                <p className="text-[11px] font-mono text-muted-foreground">Rank: #{friend.rank.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeFriend(friend.id)} className="h-7 w-7 text-muted-foreground hover:text-rose-400">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                ))}

                                {/* Add Friend Form */}
                                {friends.length < 3 && (
                                    <div className="flex gap-2 pt-1.5">
                                        <Input
                                            placeholder="Friend Name"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="bg-background border-border text-xs h-8"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="KCET Rank"
                                            value={newRank}
                                            onChange={(e) => setNewRank(e.target.value === "" ? "" : Number(e.target.value))}
                                            className="bg-background border-border text-xs font-mono h-8 w-28"
                                        />
                                        <Button
                                            type="button"
                                            onClick={addFriend}
                                            variant="outline"
                                            className="h-8 px-2.5 text-xs border-border shrink-0"
                                        >
                                            <UserPlus className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={handleSearch}
                                disabled={isSearching || !myRank}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs h-9 rounded-md shadow-xs flex items-center justify-center gap-2"
                            >
                                {isSearching ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Matching Cutoffs...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-4 w-4" />
                                        <span>Find Matching Colleges for Squad</span>
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Results Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                            <School className="h-4 w-4 text-primary" />
                            Squad Compatible Colleges ({results.length})
                        </h2>
                    </div>

                    {results.length === 0 ? (
                        <div className="p-8 rounded-lg border border-border bg-card text-center space-y-2">
                            <Users className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                            <h3 className="text-sm font-semibold text-foreground">No squad calculation yet</h3>
                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                Enter your rank and add your friends to compute campuses where all candidate ranks pass the cutoff criteria.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                            {results.map(college => (
                                <Card key={college.code} className="border border-border bg-card shadow-xs">
                                    <CardContent className="p-4 space-y-2.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <Badge variant="outline" className="font-mono text-[10px] border-primary/20 text-primary bg-primary/5">
                                                        {college.code}
                                                    </Badge>
                                                    <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" /> All {friends.length + 1} Qualify
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-foreground leading-snug">
                                                    {college.name}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5 pt-2 border-t border-border/60">
                                            <p className="text-[11px] font-semibold text-muted-foreground">Available Branches for Squad:</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {college.branches.slice(0, 5).map((b, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-[10px] font-medium bg-muted text-foreground border-border">
                                                        {b.name} (Cutoff: #{b.cutoff.toLocaleString('en-IN')})
                                                    </Badge>
                                                ))}
                                                {college.branches.length > 5 && (
                                                    <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                                                        +{college.branches.length - 5} more
                                                    </Badge>
                                                )}
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

export default SquadFinder

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
    AlertTriangle
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

interface Friend {
    id: string
    name: string
    rank: number
}

interface CutoffData {
    institute: string
    institute_code: string
    course: string
    category: string
    cutoff_rank: number | string
    year: string
    round: string
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

const SquadFinder = () => {
    const { toast } = useToast()

    // State
    const [myRank, setMyRank] = useState<number | "">("")
    const [friends, setFriends] = useState<Friend[]>([])
    const [newName, setNewName] = useState("")
    const [newRank, setNewRank] = useState<number | "">("")
    const [results, setResults] = useState<CollegeMatch[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [loadingData, setLoadingData] = useState(false)

    // Filters
    const [selectedCategory, setSelectedCategory] = useState("GM")
    const [cutoffData, setCutoffData] = useState<CutoffData[]>([])
    const [dataLoaded, setDataLoaded] = useState(false)

    // Load Data on Mount
    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true)
            try {
                // Fetching the consolidated file
                const response = await fetch('/kcet_cutoffs_consolidated.json')
                if (!response.ok) throw new Error("Failed to load data")

                const json = await response.json()
                if (json.cutoffs && Array.isArray(json.cutoffs)) {
                    // Optimization: Filter strictly for what we need to save memory?
                    // For now, keep it in memory but maybe only latest year/round if possible?
                    // Actually, let's keep all and filter client side for flexibility
                    setCutoffData(json.cutoffs)
                    setDataLoaded(true)
                }
            } catch (error) {
                console.error("Failed to load cutoffs:", error)
                toast({
                    title: "Data Load Failed",
                    description: "Could not load real cutoff data. Please try again.",
                    variant: "destructive"
                })
            } finally {
                setLoadingData(false)
            }
        }

        loadData()
    }, [])

    // Add friend handler
    const addFriend = () => {
        if (!newName.trim()) {
            toast({ title: "Name required", description: "Please enter your friend's name", variant: "destructive" })
            return
        }
        if (!newRank || newRank <= 0) {
            toast({ title: "Valid rank required", description: "Please enter a valid KCET rank", variant: "destructive" })
            return
        }
        if (friends.length >= 3) {
            toast({ title: "Squad full", description: "Max 3 friends allowed", variant: "destructive" })
            return
        }

        setFriends([...friends, {
            id: Date.now().toString(),
            name: newName,
            rank: Number(newRank)
        }])
        setNewName("")
        setNewRank("")
    }

    const removeFriend = (id: string) => {
        setFriends(friends.filter(f => f.id !== id))
    }

    // CORE LOGIC
    const findSquadColleges = () => {
        if (!myRank) {
            toast({ title: "Rank required", description: "Please enter your rank", variant: "destructive" })
            return
        }
        if (!dataLoaded) {
            toast({ title: "Loading Data", description: "Please wait for college data to load...", variant: "default" })
            return
        }

        setIsSearching(true)

        // Simulate processing delay for UX
        setTimeout(() => {
            const allRanks = [Number(myRank), ...friends.map(f => f.rank)]
            const maxRank = Math.max(...allRanks)

            // 1. Filter by Category
            // 2. Filter by Year (Prefer latest 2024/2025 data points)
            // 3. Filter where Cutoff Rank >= maxRank

            // Get unique colleges first
            const collegeMap = new Map<string, CollegeMatch>()

            cutoffData.forEach(item => {
                // Filter Logic
                if (item.category !== selectedCategory) return

                const cutoff = typeof item.cutoff_rank === 'number' ? item.cutoff_rank : parseInt(item.cutoff_rank)
                if (isNaN(cutoff)) return

                // We want matches where the cutoff is greater than our worst rank (meaning even the lowest rank gets in)
                if (cutoff < maxRank) return

                // Prefer latest data (2024/2025)
                // If multiple entries for same college+course, usually handled by data quality or valid checks
                // We will just accumulate valid branches

                if (!collegeMap.has(item.institute_code)) {
                    collegeMap.set(item.institute_code, {
                        code: item.institute_code,
                        name: item.institute,
                        branches: []
                    })
                }

                const college = collegeMap.get(item.institute_code)!
                // Avoid duplicate branches (e.g. from different rounds/years)
                // Simple heuristic: if branch already exists, keep the one with higher cutoff (safer)? 
                // Or just list unique branches. Let's list unique branches.
                if (!college.branches.find(b => b.name === item.course)) {
                    college.branches.push({ name: item.course, cutoff })
                }
            })

            // Convert map to array and sort
            // Sort: Most branches available -> then by Name
            const resultsArray = Array.from(collegeMap.values())
                .filter(c => c.branches.length > 0)
                .sort((a, b) => b.branches.length - a.branches.length)
                .slice(0, 50) // Limit to top 50 relevant results

            setResults(resultsArray)
            setIsSearching(false)

            if (resultsArray.length > 0) {
                toast({ title: "Squad Assembled!", description: `Found ${resultsArray.length} colleges for your squad.` })
            } else {
                toast({ title: "No Matches", description: "Rank too low for selected category/colleges. Try a different category?", variant: "destructive" })
            }
        }, 500)
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 sm:p-8 font-sans selection:bg-indigo-500/30">
      <SEO
        title="KCET Squad Finder – Find Colleges Where Friends Can Go Together"
        description="Don't split the gang! Enter your friends' KCET ranks and find colleges where everyone can get a seat together. Unique squad-matching tool for KCET aspirants."
        url="https://kcet-coded2.vercel.app/squad-finder"
        keywords="KCET squad finder, KCET group college finder, KCET friends same college, study group finder KCET"
      />
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center space-y-4">
                    {!dataLoaded ? (
                        <Badge variant="outline" className="px-4 py-1 rounded-full border-yellow-500/50 text-yellow-500 bg-yellow-500/10 animate-pulse">
                            Loading Database...
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="px-4 py-1 rounded-full border-green-500/50 text-green-400 bg-green-500/10">
                            Database Connected
                        </Badge>
                    )}
                    <h1 className="text-4xl sm:text-6xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Squad Finder
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Find colleges where <span className="text-white font-semibold">all of you</span> can get a seat together.
                        <br />
                        <span className="text-xs text-muted-foreground">Powered by Real 2024/25 Cutoff Data</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-indigo-400" />
                                    Build Your Squad
                                </CardTitle>
                                <CardDescription>
                                    Enter ranks and category.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                {/* Category Selector */}
                                <div className="space-y-2">
                                    <Label className="text-indigo-300">Category</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="bg-black/40 border-white/10">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Me */}
                                <div className="space-y-2">
                                    <Label className="text-indigo-300">Your Rank</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 15000"
                                        value={myRank}
                                        onChange={(e) => setMyRank(Number(e.target.value))}
                                        className="bg-black/40 border-white/10 focus:border-indigo-500/50 text-lg"
                                    />
                                </div>

                                {/* Friends List */}
                                <div className="space-y-3">
                                    <Label>Squad Members ({friends.length}/3)</Label>

                                    {friends.map(friend => (
                                        <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 animate-in slide-in-from-left-2">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                                                    {friend.name[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{friend.name}</p>
                                                    <p className="text-xs text-muted-foreground">Rank: {friend.rank.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeFriend(friend.id)} className="text-white/40 hover:text-red-400">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    {/* Add Friend Form */}
                                    {friends.length < 3 && (
                                        <div className="flex gap-2 pt-2">
                                            <Input
                                                placeholder="Friend Name"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="bg-black/20 border-white/10"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Rank"
                                                value={newRank}
                                                onChange={(e) => setNewRank(Number(e.target.value))}
                                                className="bg-black/20 border-white/10 w-24"
                                            />
                                            <Button size="icon" onClick={addFriend} className="bg-indigo-600 hover:bg-indigo-700 shrink-0">
                                                <UserPlus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <Button
                                    className="w-full bg-white text-black hover:bg-white/90 font-bold py-6 text-lg rounded-xl shadow-lg shadow-white/5 disabled:opacity-50"
                                    onClick={findSquadColleges}
                                    disabled={isSearching || !myRank || !dataLoaded}
                                >
                                    {isSearching ? (
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 animate-spin" />
                                            Analyzing {cutoffData.length > 0 ? (cutoffData.length / 1000).toFixed(0) + 'k' : ''} Records...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Find Our College <ArrowRight className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>

                            </CardContent>
                        </Card>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <School className="h-5 w-5 text-purple-400" />
                                Squad Matches
                            </h2>
                            {results.length > 0 && (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                                    {results.length} Found
                                </Badge>
                            )}
                        </div>

                        {/* Empty State */}
                        {!isSearching && results.length === 0 && (
                            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5 text-center p-6">
                                {loadingData ? (
                                    <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
                                ) : (
                                    <Users className="h-12 w-12 text-white/20 mb-4" />
                                )}
                                <h3 className="text-lg font-medium text-white/60">
                                    {loadingData ? "Loading Database..." : "No Squad Matches Yet"}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                                    {loadingData ? "Please wait while we fetch the latest cutoffs." : "Add ranks and hit search to find colleges where everyone can get in."}
                                </p>
                            </div>
                        )}

                        {/* Results List */}
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {results.map((college, idx) => (
                                <div key={idx} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <Badge variant="outline" className="mb-2 text-[10px] border-white/10 text-white/50">{college.code}</Badge>
                                                <h3 className="font-bold text-lg leading-tight group-hover:text-indigo-300 transition-colors">
                                                    {college.name}
                                                </h3>
                                            </div>
                                            <div className="text-right">
                                                <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-400">
                                                    {college.branches.length} Options
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {college.branches.slice(0, 5).map((b, i) => (
                                                <Badge key={i} variant="secondary" className="bg-white/5 hover:bg-white/10 text-[10px] h-6 flex gap-1">
                                                    {b.name}
                                                    <span className="text-white/40 border-l border-white/10 pl-1 ml-1">
                                                        {b.cutoff}
                                                    </span>
                                                </Badge>
                                            ))}
                                            {college.branches.length > 5 && (
                                                <span className="text-[10px] self-center text-muted-foreground">+{college.branches.length - 5} more</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SquadFinder

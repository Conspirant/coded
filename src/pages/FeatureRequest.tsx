import { useState, useEffect } from "react"
import { SEO } from '@/components/SEO'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { FeatureRequestService, FeatureRequestEntry } from "@/lib/feature-request-service"
import { Lightbulb, Plus, ThumbsUp, Send, Loader2, Sparkles, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function FeatureRequest() {
    const { toast } = useToast()
    const [requests, setRequests] = useState<FeatureRequestEntry[]>([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState<'feature' | 'improvement' | 'bug' | 'other'>('feature')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // A simple set to track what the user voted for locally in this session
    const [votedIds, setVotedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        loadRequests()
    }, [])

    const loadRequests = () => {
        setRequests(FeatureRequestService.getAllRequests())
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !description.trim()) {
            toast({ title: "Incomplete", description: "Please provide a title and description.", variant: "destructive" })
            return
        }

        setIsSubmitting(true)
        // simulate a small delay for UX
        setTimeout(() => {
            FeatureRequestService.addRequest({
                title: title.trim(),
                description: description.trim(),
                type
            })
            toast({
                title: "Idea Submitted!",
                description: "Thanks for helping improve KCET Coded.",
            })
            setTitle("")
            setDescription("")
            setType('feature')
            setIsSubmitting(false)
            loadRequests()
        }, 600)
    }

    const handleUpvote = (id: string) => {
        if (votedIds.has(id)) {
            toast({ description: "You've already voted for this idea." })
            return
        }
        FeatureRequestService.upvoteRequest(id)
        setVotedIds(prev => new Set(prev).add(id))
        loadRequests()
        toast({ title: "Upvoted!", description: "Your vote has been recorded." })
    }

    const getTypeColor = (t: string) => {
        switch (t) {
            case 'feature': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            case 'improvement': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'bug': return 'bg-red-500/20 text-red-400 border-red-500/30'
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            case 'planned': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'in-progress': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            case 'completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        }
    }

    return (
        <div className="container mx-auto max-w-5xl py-8 space-y-8 animate-in fade-in duration-500 pb-24">
            <SEO
                title="Feature Requests"
                description="Help shape the future of KCET Coded. Suggest new features, report bugs, or request improvements to existing tools."
                url="https://kcet-coded2.vercel.app/request-feature"
        keywords="KCET Coded feedback, KCET feature request"
            />

            {/* Header Section */}
            <div className="text-center space-y-4 pt-6 pb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 text-indigo-400 shadow-xl shadow-indigo-500/10 ring-1 ring-white/10 mb-4">
                    <Lightbulb className="h-8 w-8" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                    Shape the Future
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    What should we build next? Suggest features, flag bugs, or upvote ideas from other KCET aspirants. 
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left Col: Submission Form */}
                <div className="lg:col-span-1 lg:sticky lg:top-24">
                    <Card className="glass-strong border-white/10 shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-amber-400" />
                                Submit an Idea
                            </CardTitle>
                            <CardDescription>Tell us what would you like to see.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-xs text-muted-foreground uppercase tracking-wider">Category</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['feature', 'improvement', 'bug'] as const).map(t => (
                                            <Badge
                                                key={t}
                                                variant="outline"
                                                className={`cursor-pointer px-3 py-1.5 transition-all ${type === t ? getTypeColor(t) + ' ring-1 ring-white/20' : 'bg-transparent text-muted-foreground hover:bg-white/5 border-white/10'}`}
                                                onClick={() => setType(t)}
                                            >
                                                {t.charAt(0).toUpperCase() + t.slice(1)}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs text-muted-foreground uppercase tracking-wider">Title</Label>
                                    <Input 
                                        id="title" 
                                        placeholder="E.g. Add dark mode toggle" 
                                        value={title} 
                                        onChange={e => setTitle(e.target.value)} 
                                        className="bg-white/5 border-white/10"
                                        maxLength={60}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="desc" className="text-xs text-muted-foreground uppercase tracking-wider">Description</Label>
                                    <Textarea 
                                        id="desc" 
                                        placeholder="Describe how it works and why it helps..." 
                                        value={description} 
                                        onChange={e => setDescription(e.target.value)} 
                                        className="bg-white/5 border-white/10 min-h-[120px] resize-none"
                                        maxLength={500}
                                    />
                                </div>
                                
                                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 h-10 mt-2" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
                                    ) : (
                                        <><Send className="h-4 w-4 mr-2" /> Submit Request</>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col: Feed */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-indigo-400" />
                            Community Requests
                        </h3>
                        <span className="text-sm text-muted-foreground bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            {requests.length} total
                        </span>
                    </div>

                    {requests.length === 0 ? (
                        <div className="text-center py-20 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
                            <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                            <h3 className="text-xl font-medium mb-2 text-foreground/70">No requests yet</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto">Be the first to suggest a brilliant idea and watch it get built by the KCET Coded team!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req) => (
                                <Card key={req.id} className="glass border-white/5 transition-all hover:bg-white/[0.04] group">
                                    <CardContent className="p-4 sm:p-5 flex gap-4 sm:gap-6">
                                        
                                        {/* Upvote Column */}
                                        <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleUpvote(req.id)}
                                                disabled={votedIds.has(req.id)}
                                                className={`h-10 w-10 p-0 rounded-full transition-all ${votedIds.has(req.id) ? 'bg-indigo-500/20 text-indigo-400' : 'hover:bg-indigo-500/10 hover:text-indigo-400'}`}
                                            >
                                                <ThumbsUp className={`h-4 w-4 ${votedIds.has(req.id) ? 'fill-current' : ''}`} />
                                            </Button>
                                            <span className={`text-sm font-bold ${votedIds.has(req.id) ? 'text-indigo-400' : 'text-muted-foreground'}`}>
                                                {req.votes}
                                            </span>
                                        </div>

                                        {/* Content Column */}
                                        <div className="flex-1 space-y-2 overflow-hidden">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <Badge variant="outline" className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${getTypeColor(req.type)}`}>
                                                    {req.type}
                                                </Badge>
                                                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(req.timestamp), { addSuffix: true })}
                                                </span>
                                            </div>
                                            
                                            <h3 className="text-lg font-semibold text-foreground/90 leading-tight">
                                                {req.title}
                                            </h3>
                                            
                                            <p className="text-sm text-muted-foreground/90 whitespace-pre-wrap leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                                                {req.description}
                                            </p>

                                            <div className="pt-3 flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-widest pl-1 border-l border-white/20">Status</span>
                                                <Badge variant="secondary" className={`text-[11px] px-2 py-0 border ${getStatusColor(req.status)} capitalize`}>
                                                    {req.status.replace('-', ' ')}
                                                </Badge>
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

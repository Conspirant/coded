import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trash2, ClipboardPaste, RefreshCw, MessageSquare } from "lucide-react"
import { AdminSuggestionsService, SuggestionEntry } from "@/lib/admin-suggestions-service"
import { formatDistanceToNow } from "date-fns"

export default function AdminSuggestionsView() {
    const [suggestions, setSuggestions] = useState<SuggestionEntry[]>([])
    const [loading, setLoading] = useState(true)
    const { toast } = useToast()

    const loadSuggestions = async () => {
        setLoading(true)
        const data = await AdminSuggestionsService.getAllSuggestions()
        setSuggestions(data)
        setLoading(false)
    }

    useEffect(() => {
        loadSuggestions()
    }, [])

    const handleDelete = async (id: string) => {
        const success = await AdminSuggestionsService.deleteSuggestion(id)
        if (success) {
            loadSuggestions()
            toast({
                title: "Suggestion Deleted",
                description: "The suggestion has been removed from Supabase.",
            })
        } else {
            toast({
                title: "Delete Failed",
                description: "Failed to remove the suggestion.",
                variant: "destructive",
            })
        }
    }

    const handleClearAll = async () => {
        if (confirm("Are you sure you want to clear all suggestions? This cannot be undone.")) {
            const success = await AdminSuggestionsService.clearAll()
            if (success) {
                loadSuggestions()
                toast({
                    title: "All Suggestions Cleared",
                    description: "All user suggestions have been removed from Supabase.",
                })
            } else {
                toast({
                    title: "Clear Failed",
                    description: "Failed to clear suggestions.",
                    variant: "destructive",
                })
            }
        }
    }

    const totalSuggestions = suggestions.length

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ClipboardPaste className="h-4 w-4 text-indigo-400" />
                            Total Suggestions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalSuggestions}</div>
                        <p className="text-xs text-muted-foreground mt-1">Submitted via Notice Screen</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table */}
            <Card className="glass border-white/5">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>User Suggestions & Doubts</CardTitle>
                        <CardDescription>Messages submitted by aspirants regarding site features and access</CardDescription>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={loadSuggestions} className="border-white/10" disabled={loading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleClearAll} disabled={totalSuggestions === 0 || loading}>
                            Clear All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <RefreshCw className="h-8 w-8 mx-auto mb-4 animate-spin opacity-40" />
                            <p>Loading suggestions from Supabase...</p>
                        </div>
                    ) : totalSuggestions === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No suggestions or doubts collected yet.</p>
                            <p className="text-sm text-muted-foreground/60 mt-1">When users write in the notice screen suggestions box, their messages will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead className="w-48">Submitted</TableHead>
                                        <TableHead>Message (Suggestion / Doubt)</TableHead>
                                        <TableHead className="w-24 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suggestions.map((item) => (
                                        <TableRow key={item.id} className="border-white/5">
                                            <TableCell className="text-xs text-muted-foreground align-top pt-4">
                                                {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : 'unknown'}
                                            </TableCell>
                                            <TableCell className="text-sm text-foreground/90 font-medium whitespace-pre-wrap leading-relaxed max-w-xl py-3">
                                                {item.suggestion}
                                            </TableCell>
                                            <TableCell className="text-right align-top pt-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

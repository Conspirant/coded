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
import { Trash2, Lightbulb, RefreshCw, CheckCircle, Clock, PlayCircle } from "lucide-react"
import { FeatureRequestService, FeatureRequestEntry } from "@/lib/feature-request-service"
import { formatDistanceToNow } from "date-fns"

export default function AdminFeatureRequestsView() {
    const [requests, setRequests] = useState<FeatureRequestEntry[]>([])
    const { toast } = useToast()

    const loadRequests = () => {
        setRequests(FeatureRequestService.getAllRequests())
    }

    useEffect(() => {
        loadRequests()
    }, [])

    const handleDelete = (id: string) => {
        FeatureRequestService.deleteRequest(id)
        loadRequests()
        toast({ title: "Deleted", description: "Request removed." })
    }

    const handleUpdateStatus = (id: string, newStatus: FeatureRequestEntry['status']) => {
        FeatureRequestService.updateStatus(id, newStatus)
        loadRequests()
        toast({ title: "Status Updated", description: `Request marked as ${newStatus}.` })
    }

    const handleClearAll = () => {
        if (confirm("Clear all feature requests?")) {
            FeatureRequestService.clearAll()
            loadRequests()
        }
    }

    const getTypeColor = (t: string) => {
        switch (t) {
            case 'feature': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
            case 'improvement': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
            case 'bug': return 'bg-red-500/20 text-red-400 border-red-500/30'
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
        }
    }

    const totalRequests = requests.length;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <Card className="glass border-white/5">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-indigo-400" />
                            Feature Requests ({totalRequests})
                        </CardTitle>
                        <CardDescription>Review and triage ideas submitted by students</CardDescription>
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={loadRequests} className="border-white/10">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleClearAll} disabled={totalRequests === 0}>
                            Clear All
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {totalRequests === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-20" />
                            <p>No feature requests yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10">
                                        <TableHead className="w-16">Votes</TableHead>
                                        <TableHead>Request</TableHead>
                                        <TableHead className="w-32">Status</TableHead>
                                        <TableHead className="w-32 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((item) => (
                                        <TableRow key={item.id} className="border-white/5">
                                            <TableCell className="font-bold text-center">
                                                <Badge variant="outline" className="text-indigo-300 bg-indigo-500/10 border-indigo-500/20 px-2 py-1">
                                                    ▲ {item.votes}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-foreground/90">{item.title}</span>
                                                        <Badge variant="outline" className={`text-[9px] uppercase tracking-wider px-1.5 py-0 ${getTypeColor(item.type)}`}>
                                                            {item.type}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground line-clamp-2 md:line-clamp-none max-w-xl">
                                                        {item.description}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground/60">
                                                        {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {/* Status Toggle buttons */}
                                                <div className="flex flex-col gap-1">
                                                    {item.status === 'pending' && <Badge variant="outline" className="justify-center border-amber-500/30 text-amber-500 bg-amber-500/5 hover:bg-amber-500/20 cursor-pointer transition-colors" onClick={() => handleUpdateStatus(item.id, 'planned')}><Clock className="h-3 w-3 mr-1"/> Pending</Badge>}
                                                    {item.status === 'planned' && <Badge variant="outline" className="justify-center border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/20 cursor-pointer transition-colors" onClick={() => handleUpdateStatus(item.id, 'in-progress')}><Clock className="h-3 w-3 mr-1"/> Planned</Badge>}
                                                    {item.status === 'in-progress' && <Badge variant="outline" className="justify-center border-indigo-500/30 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/20 cursor-pointer transition-colors" onClick={() => handleUpdateStatus(item.id, 'completed')}><PlayCircle className="h-3 w-3 mr-1"/> Doing</Badge>}
                                                    {item.status === 'completed' && <Badge variant="outline" className="justify-center border-emerald-500/30 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/20 cursor-pointer transition-colors" onClick={() => handleUpdateStatus(item.id, 'pending')}><CheckCircle className="h-3 w-3 mr-1"/> Done</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right align-top">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0 mt-1"
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

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { ShieldCheck, Plus, Trash2, Search, Edit3, Save, X, Image as ImageIcon, Database, ClipboardPaste, Check } from "lucide-react"

// Simple Auth Gate like AdminCutoffs
const ADMIN_PASS = "kcetadmin2026"
const AUTH_KEY = "kcet_admin_auth"

function AdminAuthGate({ onAuth }: { onAuth: () => void }) {
    const [pass, setPass] = useState("")
    const [error, setError] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pass === ADMIN_PASS) {
            sessionStorage.setItem(AUTH_KEY, "1")
            onAuth()
        } else {
            setError(true)
            setTimeout(() => setError(false), 2000)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md glass-strong border-white/10">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Enter passphrase to manage PYQ data</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Passphrase"
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                            className={error ? 'border-red-500' : ''}
                        />
                        <Button type="submit" className="w-full">
                            <ShieldCheck className="h-4 w-4 mr-2" /> Authenticate
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default function AdminPYQ() {
    const [authed, setAuthed] = useState(sessionStorage.getItem(AUTH_KEY) === "1")
    const [questions, setQuestions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [showOCRModal, setShowOCRModal] = useState(false)
    const [ocrText, setOcrText] = useState("")
    const [ocrChapter, setOcrChapter] = useState("1")
    const [parsedPreview, setParsedPreview] = useState<any[]>([])
    const [selectedQ, setSelectedQ] = useState<any>(null)
    const { toast } = useToast()

    // Map for chapter names
    const CHAPTER_MAP: Record<number, string> = {
        1: "Units and Measurements", 2: "Motion in a Straight Line", 3: "Motion in a Plane",
        4: "Laws of Motion", 5: "Work, Energy and Power", 6: "System of Particles and Rotational Motion",
        7: "Gravitation", 8: "Mechanical Properties of Solids", 9: "Mechanical Properties of Fluids",
        10: "Thermal Properties of Matter", 11: "Thermodynamics", 12: "Kinetic Theory",
        13: "Oscillations", 14: "Waves", 15: "Electric Charges and Fields",
        16: "Electrostatic Potential and Capacitance", 17: "Current Electricity", 18: "Moving Charges and Magnetism",
        19: "Magnetism and Matter", 20: "Electromagnetic Induction", 21: "Alternating Current",
        22: "Electromagnetic Waves", 23: "Ray Optics and Optical Instruments", 24: "Wave Optics",
        25: "Dual Nature of Radiation and Matter", 26: "Atoms", 27: "Nuclei", 28: "Semiconductor Electronics"
    }

    const fetchQuestions = async () => {
        setLoading(true)
        const { data, error } = await supabase.from('pyq_questions' as any).select('*').order('created_at', { ascending: false })
        if (error) {
            toast({ title: "Error fetching PYQs", description: error.message, variant: "destructive" })
        } else {
            setQuestions(data || [])
        }
        setLoading(false)
    }

    useEffect(() => {
        if (authed) fetchQuestions()
    }, [authed])

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this question?")) return
        const { error } = await supabase.from('pyq_questions' as any).delete().eq('id', id)
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" })
        else {
            toast({ title: "Deleted", description: "Question removed" })
            fetchQuestions()
        }
    }

    const parseOCR = () => {
        if (!ocrText.trim()) return;
        const lines = ocrText.split('\n');
        const questions: any[] = [];
        let currentQ: any = null;
        let parsingAnswers = false;
        let answersMap: Record<number, number> = {};

        // Helper to convert option letters to index
        const optToIndex = (opt: string) => {
            if (opt === 'a' || opt === 'A') return 0;
            if (opt === 'b' || opt === 'B') return 1;
            if (opt === 'c' || opt === 'C') return 2;
            if (opt === 'd' || opt === 'D') return 3;
            return 0;
        }

        // First pass: extract answers if "ANSWER KEY" exists
        const ansKeyIdx = lines.findIndex(l => l.toUpperCase().includes("ANSWER KEY"));
        if (ansKeyIdx !== -1) {
            const ansLines = lines.slice(ansKeyIdx + 1).join(" ");
            const matches = [...ansLines.matchAll(/(\d+)\.\s*\(([a-d])\)/gi)];
            matches.forEach(m => {
                answersMap[parseInt(m[1])] = optToIndex(m[2].toLowerCase());
            });
        }

        const questionLines = ansKeyIdx !== -1 ? lines.slice(0, ansKeyIdx) : lines;

        for (let i = 0; i < questionLines.length; i++) {
            let line = questionLines[i].trim();
            if (!line) continue;

            const qStartMatch = line.match(/^(\d+)\.\s+(.*)/);
            if (qStartMatch) {
                if (currentQ) questions.push(currentQ);
                const qNum = parseInt(qStartMatch[1]);
                currentQ = {
                    _tempId: Math.random().toString(),
                    _qNum: qNum, // track number to match answers later
                    chapter: CHAPTER_MAP[parseInt(ocrChapter)] || "Unknown Chapter",
                    chapter_number: parseInt(ocrChapter),
                    question: qStartMatch[2],
                    options: ["Option A", "Option B", "Option C", "Option D"], // Will refine below
                    correct_answer: answersMap[qNum] ?? 0,
                    year: 2024,
                    explanation: "",
                    needs_image: false,
                    image_url: ""
                };
                
                // Extract inline year eg (2006)
                const yearMatch = line.match(/\((20\d\d)\)/);
                if (yearMatch) {
                    currentQ.year = parseInt(yearMatch[1]);
                    // Clean year from question text
                    currentQ.question = currentQ.question.replace(/\s*\((20\d\d)\)\s*/, '');
                }
            } else if (currentQ) {
                // Try to extract year if not already found and it's isolated on a line
                const yearMatch = line.match(/^\((20\d\d)\)$/);
                if (yearMatch) {
                    currentQ.year = parseInt(yearMatch[1]);
                    continue;
                }
                
                // Fallback inline year extraction from trailing line
                const inlineYearMatch = line.match(/\((20\d\d)\)$/);
                if (inlineYearMatch) {
                     currentQ.year = parseInt(inlineYearMatch[1]);
                     line = line.replace(/\s*\((20\d\d)\)$/, '');
                }

                // Append text. We can refine options extraction later, for now we just shove the raw text as needed.
                // A smart extraction would look for (a) (b) (c) (d) block.
                const hasOptions = line.match(/\([a-d]\)/i);
                if (hasOptions) {
                    // Try to parse options
                    const optMatches = [...line.matchAll(/\(([a-d])\)\s*(.*?)(?=\s*\([a-d]\)|$)/gi)];
                    if (optMatches.length > 0) {
                        optMatches.forEach(m => {
                            const idx = optToIndex(m[1]);
                            currentQ.options[idx] = m[2].trim();
                        });
                    }
                } else {
                    currentQ.question += "\n" + line;
                }
            }
        }
        if (currentQ) questions.push(currentQ);

        setParsedPreview(questions);
    }

    const saveParsedList = async () => {
        if (parsedPreview.length === 0) return;
        setLoading(true);
        // Remove temp tracking fields
        const toInsert = parsedPreview.map(q => {
            const { _tempId, _qNum, ...rest } = q;
            return rest;
        });

        const { error } = await supabase.from('pyq_questions' as any).insert(toInsert);
        if (error) {
            toast({ title: "Error importing", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Import Successful", description: `Added ${toInsert.length} questions.` });
            setParsedPreview([]);
            setOcrText("");
            setShowOCRModal(false);
            fetchQuestions();
        }
        setLoading(false);
    }

    if (!authed) return <AdminAuthGate onAuth={() => setAuthed(true)} />

    const filtered = questions.filter(q => 
        q.question.toLowerCase().includes(search.toLowerCase()) || 
        q.chapter.toLowerCase().includes(search.toLowerCase()) ||
        String(q.year).includes(search)
    )

    return (
        <div className="container py-8 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">PYQ Manager</h1>
                    <p className="text-muted-foreground">Manage KCET previous year questions</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setShowOCRModal(true)} className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                        <ClipboardPaste className="h-4 w-4 mr-2" /> Paste OCR Text
                    </Button>
                    <Button onClick={() => { setSelectedQ(null); setShowAddModal(true) }} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                        <Plus className="h-4 w-4 mr-2" /> Add Question
                    </Button>
                </div>
            </div>

            <Card className="glass border-white/10">
                <CardHeader className="py-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search questions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 bg-white/5 border-white/10"
                            />
                        </div>
                        <Badge variant="outline" className="border-white/10">{filtered.length} Questions</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="w-[80px]">Year</TableHead>
                                <TableHead className="w-[120px]">Chapter</TableHead>
                                <TableHead>Question</TableHead>
                                <TableHead className="w-[80px]">Image</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground"><Database className="h-8 w-8 mx-auto mb-2 opacity-30"/>No questions found</TableCell></TableRow>
                            ) : filtered.map(q => (
                                <TableRow key={q.id} className="border-white/5">
                                    <TableCell className="font-mono text-sm">{q.year}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">CH {q.chapter_number}</TableCell>
                                    <TableCell className="max-w-[400px] truncate" title={q.question}>{q.question}</TableCell>
                                    <TableCell>
                                        {q.needs_image ? <Badge className="bg-amber-500/10 text-amber-400">Needs</Badge> : 
                                         q.image_url ? <Badge className="bg-emerald-500/10 text-emerald-400">Yes</Badge> : 
                                         <Badge variant="outline" className="opacity-50">No</Badge>}
                                    </TableCell>
                                    <TableCell className="text-right whitespace-nowrap">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400" onClick={() => { setSelectedQ(q); setShowAddModal(true) }}>
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDelete(q.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogContent className="glass-strong border-white/10 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedQ ? 'Edit Question' : 'Add Question'}</DialogTitle>
                        <DialogDescription>Add or update a PYQ entry.</DialogDescription>
                    </DialogHeader>
                    <div className="py-8 text-center text-muted-foreground border border-dashed border-white/20 rounded-xl">
                        Full Edit Form UI will be loaded here.
                        <br/>
                        <span className="text-xs">Supports Image Upload to Supabase Storage</span>
                    </div>
                </DialogContent>
            </Dialog>

            {/* OCR Paste Modal */}
            <Dialog open={showOCRModal} onOpenChange={setShowOCRModal}>
                <DialogContent className="glass-strong border-white/10 sm:max-w-4xl max-h-[95vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Import via OCR Paste</DialogTitle>
                        <DialogDescription>Paste raw text from ChatGPT, Tesseract, or PDF copy to auto-parse questions.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Chapter</Label>
                                <Select value={ocrChapter} onValueChange={setOcrChapter}>
                                    <SelectTrigger className="bg-white/5 border-white/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-64">
                                        {Object.entries(CHAPTER_MAP).map(([num, name]) => (
                                            <SelectItem key={num} value={num}>CH {num}: {name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Raw OCR Text</Label>
                            <Textarea 
                                placeholder="1. The physical quantity having...\n(a) Option 1\n(b) Option 2\n\nANSWER KEY\n1. (a)" 
                                className="min-h-[200px] h-[30vh] bg-white/5 border-white/10 font-mono text-xs whitespace-pre"
                                value={ocrText}
                                onChange={e => setOcrText(e.target.value)}
                            />
                            <Button onClick={parseOCR} variant="secondary" className="w-full mt-2">
                                <Search className="h-4 w-4 mr-2" /> Parse Text
                            </Button>
                        </div>

                        {parsedPreview.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-emerald-400">Parsed {parsedPreview.length} Questions</h3>
                                    <Button onClick={saveParsedList} className="bg-gradient-to-r from-emerald-500 to-green-600">
                                        <Save className="h-4 w-4 mr-2" /> Save All to Database
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {parsedPreview.map((q, idx) => (
                                        <Card key={idx} className="bg-white/5 border-white/10">
                                            <CardContent className="p-4 space-y-2">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="font-medium text-sm flex-1">{idx+1}. {q.question}</div>
                                                    <Badge variant="outline">{q.year}</Badge>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 -mr-2 -mt-2" onClick={() => {
                                                        const fresh = [...parsedPreview];
                                                        fresh.splice(idx, 1);
                                                        setParsedPreview(fresh);
                                                    }}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground ml-4">
                                                    <div className={q.correct_answer === 0 ? "text-emerald-400 font-semibold" : ""}>a) {q.options[0]}</div>
                                                    <div className={q.correct_answer === 1 ? "text-emerald-400 font-semibold" : ""}>b) {q.options[1]}</div>
                                                    <div className={q.correct_answer === 2 ? "text-emerald-400 font-semibold" : ""}>c) {q.options[2]}</div>
                                                    <div className={q.correct_answer === 3 ? "text-emerald-400 font-semibold" : ""}>d) {q.options[3]}</div>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2 pt-2 border-t border-white/5">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <Checkbox 
                                                            checked={q.needs_image} 
                                                            onCheckedChange={(c) => {
                                                                const fresh = [...parsedPreview];
                                                                fresh[idx].needs_image = !!c;
                                                                setParsedPreview(fresh);
                                                            }}
                                                        />
                                                        <span className="text-xs text-amber-400 flex items-center gap-1"><ImageIcon className="h-3 w-3"/> Needs Image/Diagram</span>
                                                    </label>
                                                    
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <Label className="text-xs text-emerald-400 whitespace-nowrap">Image URL:</Label>
                                                        <Input 
                                                            className="h-7 text-xs bg-black/20 border-white/10" 
                                                            value={q.image_url} 
                                                            placeholder="/pyq-images/ch1_2006_q1.png"
                                                            onChange={e => {
                                                                const fresh = [...parsedPreview];
                                                                fresh[idx].image_url = e.target.value;
                                                                setParsedPreview(fresh);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

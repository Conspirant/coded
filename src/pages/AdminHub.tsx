import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import {
    ShieldCheck, Lock, AlertTriangle, Database, BookOpenCheck,
    ClipboardPaste, Plus, Trash2, Search, Edit3, Save, X,
    Image as ImageIcon, Download, FileJson, ChevronRight,
    BarChart3, MessageSquare, Lightbulb, Star, Settings, BrainCircuit,
    Building2, Key, Loader2, Heart, Activity, Users, Monitor, ShieldAlert, StopCircle,
    Megaphone, Vote, Power, Sparkles
} from "lucide-react"

// Lazy load heavy admin components
import AdminCutoffsPage from "./AdminCutoffs"
import AdminReviewModeration from "@/components/AdminReviewModeration"
import AdminFeedbackView from "@/components/AdminFeedbackView"
import AdminFeatureRequestsView from "@/components/AdminFeatureRequestsView"
import AdminSuggestionsView from "@/components/AdminSuggestionsView"
import { AdminAIExtractor } from "@/components/admin/AdminAIExtractor"
import AdminActualRanksView from "@/components/AdminActualRanksView"
import { AdminCollegeEditor } from "@/components/admin/AdminCollegeEditor"
import { AdminPopupControllerSection } from "@/components/admin/AdminPopupControllerSection"
import { AdminPollManager } from "@/components/admin/AdminPollManager"
import { COLLEGE_DATABASE } from "@/data/collegeDatabase"

import { Switch } from "@/components/ui/switch"
import { setGlobalPaywallDisabled } from "@/lib/unlock"
import { AdminSuggestionsService, type SiteShutdownConfig } from "@/lib/admin-suggestions-service"
import { LiveVisitorCounter } from "@/components/LiveVisitorCounter"
import { VisitorService, useVisitorCounter } from "@/lib/visitor-service"

const AUTH_KEY = "kcet_admin_auth"

import { SUBJECTS, Subject, getChaptersForSubject } from "@/data/pyqQuestionBank"

async function hashPassphrase(message: string): Promise<string> {
    try {
        if (!crypto?.subtle) {
            return "FALLBACK_NO_CRYPTO";
        }
        const msgBuffer = new TextEncoder().encode(message)
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
        return hashHex
    } catch (e) {
        console.warn("crypto.subtle failed, using fallback", e)
        return "FALLBACK_NO_CRYPTO"
    }
}

// ─── Auth Gate ─────────────────────────────────────────────────
function AdminAuthGate({ onAuth }: { onAuth: () => void }) {
    const [pass, setPass] = useState("")
    const [error, setError] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { inputRef.current?.focus() }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmedPass = pass.trim()
        const hashedInput = await hashPassphrase(trimmedPass)
        const envPass = import.meta.env.VITE_ADMIN_PASSPHRASE
        
        let isAuthorized = false
        if (envPass && envPass.trim() !== "") {
            isAuthorized = trimmedPass === envPass.trim() || 
                           (hashedInput !== "FALLBACK_NO_CRYPTO" && hashedInput === await hashPassphrase(envPass.trim()))
        } else {
            // Default passphrase "kcetadmin2026"
            isAuthorized = trimmedPass === "kcetadmin2026" || 
                           hashedInput === "d810ebe01545b5eb232dc2415c249c815b26f351425d4a300412b1809f76cd30"
        }

        if (isAuthorized) {
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
                    <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Enter passphrase to access admin features</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="admin-pass">Passphrase</Label>
                            <Input
                                ref={inputRef}
                                id="admin-pass"
                                type="password"
                                placeholder="Enter admin passphrase..."
                                value={pass}
                                onChange={e => setPass(e.target.value)}
                                className={`bg-white/5 border-white/10 ${error ? 'border-red-500 animate-shake' : ''}`}
                            />
                            {error && (
                                <p className="text-xs text-red-400 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Invalid passphrase
                                </p>
                            )}
                        </div>
                        <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                            <ShieldCheck className="h-4 w-4 mr-2" /> Authenticate
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

// ─── PYQ Manager Section ───────────────────────────────────────
function AdminPYQSection() {
    const [questions, setQuestions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterSubject, setFilterSubject] = useState<string>("all")
    const [filterChapter, setFilterChapter] = useState<string>("all")
    const [showOCRModal, setShowOCRModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [ocrText, setOcrText] = useState("")
    const [ocrChapter, setOcrChapter] = useState("1")
    const [ocrSubject, setOcrSubject] = useState<Subject>("Physics")
    const [parsedPreview, setParsedPreview] = useState<any[]>([])
    const [editingQ, setEditingQ] = useState<any>(null)
    const { toast } = useToast()

    const fetchQuestions = async () => {
        setLoading(true)
        const { data, error } = await supabase.from('pyq_questions' as any).select('*').order('created_at', { ascending: false })
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" })
        else setQuestions(data || [])
        setLoading(false)
    }

    useEffect(() => { fetchQuestions() }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this question?")) return
        const { error } = await supabase.from('pyq_questions' as any).delete().eq('id', id)
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" })
        else { toast({ title: "Deleted" }); fetchQuestions() }
    }

    const handleSaveEdit = async () => {
        if (!editingQ) return
        const { id, created_at, ...updateData } = editingQ
        if (id) {
            // Update existing
            const { error } = await supabase.from('pyq_questions' as any).update(updateData).eq('id', id)
            if (error) toast({ title: "Error", description: error.message, variant: "destructive" })
            else { toast({ title: "Saved!" }); setShowEditModal(false); fetchQuestions() }
        } else {
            // Insert new
            const { error } = await supabase.from('pyq_questions' as any).insert([updateData])
            if (error) toast({ title: "Error", description: error.message, variant: "destructive" })
            else { toast({ title: "Question Added!" }); setShowEditModal(false); fetchQuestions() }
        }
    }

    const openNewQuestion = () => {
        setEditingQ({
            subject: "Physics",
            chapter: "Units and Measurements",
            chapter_number: 1,
            question: "",
            options: ["", "", "", ""],
            correct_answer: 0,
            year: 2024,
            explanation: "",
            needs_image: false,
            image_url: "",
            option_images: ["", "", "", ""]
        })
        setShowEditModal(true)
    }

    const openEditQuestion = (q: any) => {
        setEditingQ({ ...q, options: [...(q.options || ["", "", "", ""])], option_images: [...(q.option_images || ["", "", "", ""])] })
        setShowEditModal(true)
    }

    // ─── OCR Parser ────────────────────────────────────────────
    const parseOCR = () => {
        if (!ocrText.trim()) return
        const lines = ocrText.split('\n')
        const questions: any[] = []
        let currentQ: any = null
        const answersMap: Record<number, number> = {}
        const chapters = getChaptersForSubject(ocrSubject)

        const optToIndex = (opt: string) => ({ a: 0, b: 1, c: 2, d: 3 }[opt.toLowerCase()] ?? 0)

        // Extract ANSWER KEY
        const ansKeyIdx = lines.findIndex(l => l.toUpperCase().includes("ANSWER KEY"))
        if (ansKeyIdx !== -1) {
            const ansText = lines.slice(ansKeyIdx + 1, lines.findIndex(l => l.toUpperCase().trim().startsWith("EXPLANATIONS")) !== -1 ? lines.findIndex(l => l.toUpperCase().trim().startsWith("EXPLANATIONS")) : undefined).join(" ")
            for (const m of ansText.matchAll(/(\d+)\.\s*\(([a-dA-D])\)/g)) {
                answersMap[parseInt(m[1])] = optToIndex(m[2])
            }
        }

        // Extract EXPLANATIONS
        const explIdx = lines.findIndex(l => l.toUpperCase().trim().startsWith("EXPLANATIONS"))
        const explanationsMap: Record<number, string> = {}
        if (explIdx !== -1) {
            let currentExplNum = -1
            for (let i = explIdx + 1; i < lines.length; i++) {
                const line = lines[i].trim()
                if (!line) continue
                const explMatch = line.match(/^(\d+)\.\s*(?:\([a-dA-D]\)\s*:?\s*)?(?::\s*)?(.*)/)
                if (explMatch) {
                    currentExplNum = parseInt(explMatch[1])
                    explanationsMap[currentExplNum] = explMatch[2]
                } else if (currentExplNum !== -1) {
                    explanationsMap[currentExplNum] += "\n" + line
                }
            }
        }

        const stopIdx = lines.findIndex(l => {
            const upper = l.toUpperCase().trim()
            return upper.includes("ANSWER KEY") || upper.startsWith("EXPLANATIONS")
        })
        const rawQuestionLines = stopIdx !== -1 ? lines.slice(0, stopIdx) : lines

        // Pre-process lines to separate concatenated columns (e.g., "7. Question text 12.")
        const questionLines: string[] = [];
        for (let line of rawQuestionLines) {
            const match = line.match(/^(.*?)[ \t]+(\d+)\.\s*$/);
            if (match) {
                 if (match[1].trim() !== "") questionLines.push(match[1].trim());
                 questionLines.push(match[2] + ".");
            } else {
                 questionLines.push(line);
            }
        }

        // Track orphaned options/years from multi-column OCR bleed
        const spilloverOptions: Record<number, string[]> = { 0: [], 1: [], 2: [], 3: [] };
        const spilloverYears: number[] = [];
        let lastAppendedTo: 'Q' | 0 | 1 | 2 | 3 = 'Q';

        const normalizeOptions = (text: string) => {
            let s = text.replace(/\)([a-dA-D])\(/gi, '($1)')
            s = s.replace(/(?:^|\s)([a-dA-D])\)/gi, ' ($1)')
            return s
        }

        for (let i = 0; i < questionLines.length; i++) {
            let line = questionLines[i].trim()
            if (!line) continue

            if (/^CHAPTER$/i.test(line)) continue
            if (/^\d+\s+[A-Z][a-z]+\s+and/i.test(line) && !line.match(/^\d+\.\s/)) continue

            line = normalizeOptions(line)

            // Relaxed space check to allow isolated question chunks like "12."
            const qMatch = line.match(/^(\d+)\.\s*(.*)/)
            if (qMatch) {
                if (currentQ) questions.push(currentQ)
                const qNum = parseInt(qMatch[1])
                let qText = qMatch[2]
                lastAppendedTo = 'Q'

                let year = 2024
                const yearsInQ = [...qText.matchAll(/\((20\d\d)\)/g)]
                if (yearsInQ.length > 0) {
                    for (const ym of yearsInQ) {
                        const parsedYear = parseInt(ym[1])
                        if (year === 2024) year = parsedYear
                        else spilloverYears.push(parsedYear)
                    }
                    qText = qText.replace(/\s*\((20\d\d)\)/g, '').trim()
                }

                const inlineOptions: { idx: number, text: string }[] = []
                const parts = qText.split(/\(([a-dA-D])\)/i)
                if (parts.length > 1) {
                    qText = parts[0].trim()
                    for (let p = 1; p < parts.length; p += 2) {
                        const optLetter = parts[p]
                        const optText = (parts[p+1] || "").trim()
                        inlineOptions.push({ idx: optToIndex(optLetter), text: optText })
                        lastAppendedTo = optToIndex(optLetter) as any
                    }
                }

                currentQ = {
                    _qNum: qNum,
                    subject: ocrSubject,
                    chapter: chapters[parseInt(ocrChapter)] || "Unknown",
                    chapter_number: parseInt(ocrChapter),
                    question: qText.trim(),
                    options: ["", "", "", ""],
                    correct_answer: answersMap[qNum] ?? 0,
                    year: year,
                    explanation: explanationsMap[qNum] || "",
                    needs_image: false,
                    image_url: "",
                    option_images: ["", "", "", ""]
                }

                // Apply spillovers FIRST
                for (let j = 0; j < 4; j++) {
                    if (spilloverOptions[j].length > 0) {
                        currentQ.options[j] = spilloverOptions[j].shift()!
                    }
                }
                
                // If this new question didn't find a year but we have an orphaned year, use it
                if (currentQ.year === 2024 && spilloverYears.length > 0) {
                    currentQ.year = spilloverYears.shift()!
                }

                // Apply inline options
                for (const opt of inlineOptions) {
                    if (!currentQ.options[opt.idx]) {
                        currentQ.options[opt.idx] = opt.text
                    } else {
                        spilloverOptions[opt.idx].push(opt.text)
                    }
                }
            } else if (currentQ) {
                const yearOnly = line.match(/^\s*\((20\d\d)\)\s*$/)
                if (yearOnly) {
                    const parsedYear = parseInt(yearOnly[1]);
                    if (currentQ.year === 2024) currentQ.year = parsedYear
                    else spilloverYears.push(parsedYear)
                    continue
                }

                const yearMatches = [...line.matchAll(/\((20\d\d)\)/g)]
                if (yearMatches.length > 0) {
                    for (const ym of yearMatches) {
                        const parsedYear = parseInt(ym[1]);
                        if (currentQ.year === 2024) currentQ.year = parsedYear
                        else spilloverYears.push(parsedYear)
                    }
                    line = line.replace(/\s*\((20\d\d)\)/g, '').trim()
                    if (!line) continue
                }

                const parts = line.split(/\(([a-dA-D])\)/i)
                if (parts.length > 1) {
                    const leadingText = parts[0].trim()
                    if (leadingText) {
                        if (lastAppendedTo === 'Q') {
                            currentQ.question += "\n" + leadingText
                        } else {
                            currentQ.options[lastAppendedTo] += (currentQ.options[lastAppendedTo] ? "\n" : "") + leadingText
                        }
                    }
                    for (let p = 1; p < parts.length; p += 2) {
                        const idx = optToIndex(parts[p])
                        const text = (parts[p+1] || "").trim()
                        if (!currentQ.options[idx]) {
                            currentQ.options[idx] = text
                        } else {
                            spilloverOptions[idx].push(text)
                        }
                        lastAppendedTo = idx as any
                    }
                } else if (line.trim()) {
                    if (lastAppendedTo === 'Q') {
                        currentQ.question += "\n" + line.trim()
                    } else {
                        currentQ.options[lastAppendedTo] += (currentQ.options[lastAppendedTo] ? "\n" : "") + line.trim()
                    }
                }
            }
        }
        if (currentQ) questions.push(currentQ)

        // Sort by question number to ensure UI sequential match despite OCR column scrambling
        questions.sort((a, b) => a._qNum - b._qNum)
        setParsedPreview(questions)
    }

    const saveParsedToDb = async () => {
        if (!parsedPreview.length) return
        setLoading(true)
        const toInsert = parsedPreview.map(q => {
            const { _qNum, ...rest } = q
            return rest
        })

        const { error } = await supabase.from('pyq_questions' as any).insert(toInsert)
        if (error) toast({ title: "Error", description: error.message, variant: "destructive" })
        else {
            toast({ title: "Imported!", description: `${toInsert.length} questions added.` })
            setParsedPreview([])
            setOcrText("")
            setShowOCRModal(false)
            fetchQuestions()
        }
        setLoading(false)
    }

    const exportParsedJSON = () => {
        const json = JSON.stringify(parsedPreview.map(q => { const { _qNum, ...r } = q; return r }), null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url; a.download = `pyq_${ocrSubject}_ch${ocrChapter}.json`; a.click()
        URL.revokeObjectURL(url)
    }

    const updateParsedQ = (idx: number, field: string, value: any) => {
        const fresh = [...parsedPreview]
        if (field.startsWith("options.")) {
            const optIdx = parseInt(field.split(".")[1])
            fresh[idx].options[optIdx] = value
        } else {
            fresh[idx][field] = value
        }
        setParsedPreview(fresh)
    }

    const filtered = questions.filter(q => {
        const matchSearch = !search || q.question?.toLowerCase().includes(search.toLowerCase()) ||
            q.chapter?.toLowerCase().includes(search.toLowerCase()) || String(q.year).includes(search)
        const matchSubject = filterSubject === "all" || q.subject === filterSubject
        const matchChapter = filterChapter === "all" || String(q.chapter_number) === filterChapter
        return matchSearch && matchSubject && matchChapter
    })

    const groupedQuestions = filtered.reduce((acc, q) => {
        const key = `CH ${q.chapter_number}: ${q.chapter}`
        if (!acc[key]) acc[key] = []
        acc[key].push(q)
        return acc
    }, {} as Record<string, typeof questions>)

    const sortedChapters = Object.keys(groupedQuestions).sort((a, b) => {
        const numA = parseInt(a.replace(/\D/g, '')) || 0
        const numB = parseInt(b.replace(/\D/g, '')) || 0
        return numA - numB
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">PYQ Manager</h2>
                    <p className="text-muted-foreground text-sm">Add, edit, and manage KCET previous year questions across all subjects</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" onClick={() => setShowOCRModal(true)} className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                        <ClipboardPaste className="h-4 w-4 mr-2" /> Paste OCR Text
                    </Button>
                    <Button onClick={openNewQuestion} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                        <Plus className="h-4 w-4 mr-2" /> Add Question
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..."
                        className="pl-9 bg-white/5 border-white/10" />
                </div>
                <Select value={filterSubject} onValueChange={v => { setFilterSubject(v); setFilterChapter("all") }}>
                    <SelectTrigger className="w-[160px] bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={filterChapter} onValueChange={setFilterChapter} disabled={filterSubject === "all"}>
                    <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
                        <SelectValue placeholder="All Chapters" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                        <SelectItem value="all">All Chapters</SelectItem>
                        {filterSubject !== "all" && Object.entries(getChaptersForSubject(filterSubject as Subject)).map(([n, name]) => (
                            <SelectItem key={n} value={n}>CH {n}: {name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Badge variant="outline" className="border-white/10">{filtered.length} Questions</Badge>
            </div>

            {/* Questions List */}
            <div className="space-y-8 mt-6">
                {loading ? (
                    <div className="text-center py-16 text-muted-foreground"><Database className="h-8 w-8 mx-auto mb-3 opacity-30" />Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground"><Database className="h-8 w-8 mx-auto mb-3 opacity-30" />No questions yet. Use "Paste OCR Text" or "Add Question" to get started.</div>
                ) : sortedChapters.map(chapterName => (
                    <div key={chapterName} className="space-y-3">
                        <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                            <h3 className="text-lg font-bold text-indigo-400">{chapterName}</h3>
                            <Badge variant="secondary" className="bg-white/5">{groupedQuestions[chapterName].length} Qs</Badge>
                        </div>
                        {groupedQuestions[chapterName].map(q => (
                            <Card key={q.id} className="bg-white/[0.03] border-white/10 hover:border-white/20 transition-colors">
                                <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <Badge className="bg-indigo-500/15 text-indigo-400 border-0 text-[10px]">{q.subject || "Physics"}</Badge>
                                        <Badge variant="outline" className="text-[10px]">CH {q.chapter_number}</Badge>
                                        <Badge variant="outline" className="text-[10px] font-mono">{q.year}</Badge>
                                        {q.needs_image && <Badge className="bg-amber-500/10 text-amber-400 border-0 text-[10px]">📷 Needs Image</Badge>}
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{q.question}</p>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-2 text-xs text-muted-foreground">
                                        {(q.options || []).map((opt: string, i: number) => (
                                            <div key={i} className={q.correct_answer === i ? "text-emerald-400 font-semibold" : ""}>
                                                {String.fromCharCode(97 + i)}) {opt || "—"}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400" onClick={() => openEditQuestion(q)}>
                                        <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400" onClick={() => handleDelete(q.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                    </div>
                ))}
            </div>

            {/* ─── Edit / Add Question Dialog ─── */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="glass-strong border-white/10 sm:max-w-3xl max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl">{editingQ?.id ? "Edit Question" : "Add New Question"}</DialogTitle>
                        <DialogDescription>Fill in all fields. Correct answer is highlighted green.</DialogDescription>
                    </DialogHeader>
                    {editingQ && (
                        <div className="space-y-6 py-2">
                            {/* Row 1: Subject + Chapter + Year */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Select value={editingQ.subject || "Physics"} onValueChange={v => setEditingQ({ ...editingQ, subject: v, chapter: getChaptersForSubject(v as Subject)[1] || "", chapter_number: 1 })}>
                                        <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                                        <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Chapter</Label>
                                    <Select value={String(editingQ.chapter_number)} onValueChange={v => {
                                        const chapters = getChaptersForSubject((editingQ.subject || "Physics") as Subject)
                                        setEditingQ({ ...editingQ, chapter_number: parseInt(v), chapter: chapters[parseInt(v)] || "" })
                                    }}>
                                        <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                                        <SelectContent className="max-h-64">
                                            {Object.entries(getChaptersForSubject((editingQ.subject || "Physics") as Subject)).map(([n, name]) => (
                                                <SelectItem key={n} value={n}>CH {n}: {name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Year</Label>
                                    <Input type="number" value={editingQ.year} onChange={e => setEditingQ({ ...editingQ, year: parseInt(e.target.value) || 2024 })}
                                        className="bg-white/5 border-white/10" />
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="space-y-2">
                                <Label>Question</Label>
                                <Textarea value={editingQ.question} onChange={e => setEditingQ({ ...editingQ, question: e.target.value })}
                                    className="min-h-[100px] bg-white/5 border-white/10" placeholder="Enter the question text..." />
                            </div>

                            {/* 4 Options */}
                            <div className="space-y-3">
                                <Label>Options (click the radio to set correct answer)</Label>
                                {[0, 1, 2, 3].map(i => (
                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${editingQ.correct_answer === i ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
                                        <button
                                            type="button"
                                            onClick={() => setEditingQ({ ...editingQ, correct_answer: i })}
                                            className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${editingQ.correct_answer === i ? 'border-emerald-500 bg-emerald-500' : 'border-white/30'}`}
                                        >
                                            {editingQ.correct_answer === i && <div className="h-2 w-2 rounded-full bg-white" />}
                                        </button>
                                        <span className="mt-1 text-sm font-semibold text-muted-foreground w-6">{String.fromCharCode(65 + i)}.</span>
                                        <div className="flex-1 flex flex-col gap-2">
                                            <Input
                                                value={editingQ.options[i] || ""}
                                                onChange={e => {
                                                    const opts = [...editingQ.options]
                                                    opts[i] = e.target.value
                                                    setEditingQ({ ...editingQ, options: opts })
                                                }}
                                                placeholder={`Option ${String.fromCharCode(65 + i)} Text`}
                                                className="bg-transparent border-0 border-b border-white/10 focus-visible:ring-0 px-0 rounded-none h-auto text-sm"
                                            />
                                            <Input
                                                value={editingQ.option_images?.[i] || ""}
                                                onChange={e => {
                                                    const imgs = [...(editingQ.option_images || ["", "", "", ""])]
                                                    imgs[i] = e.target.value
                                                    setEditingQ({ ...editingQ, option_images: imgs })
                                                }}
                                                placeholder={`Option ${String.fromCharCode(65 + i)} Image URL (optional)`}
                                                className="bg-white/5 border-white/10 h-7 text-xs"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Explanation */}
                            <div className="space-y-2">
                                <Label>Explanation (optional)</Label>
                                <Textarea value={editingQ.explanation || ""} onChange={e => setEditingQ({ ...editingQ, explanation: e.target.value })}
                                    className="min-h-[80px] bg-white/5 border-white/10" placeholder="Why is this the correct answer?" />
                            </div>

                            {/* Image */}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <Checkbox checked={editingQ.needs_image} onCheckedChange={c => setEditingQ({ ...editingQ, needs_image: !!c })} />
                                    <span className="text-sm text-amber-400 flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" /> Needs Image/Diagram</span>
                                </label>
                                <div className="flex-1">
                                    <Input value={editingQ.image_url || ""} onChange={e => setEditingQ({ ...editingQ, image_url: e.target.value })}
                                        placeholder="/pyq-images/ch1_2006_q1.png" className="bg-white/5 border-white/10 text-sm" />
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditModal(false)} className="border-white/10">Cancel</Button>
                        <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                            <Save className="h-4 w-4 mr-2" /> {editingQ?.id ? "Save Changes" : "Add Question"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── OCR Paste Dialog ─── */}
            <Dialog open={showOCRModal} onOpenChange={setShowOCRModal}>
                <DialogContent className="glass-strong border-white/10 sm:max-w-5xl max-h-[95vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Import via OCR / Text Paste</DialogTitle>
                        <DialogDescription>Paste text from the PDF, ChatGPT, or any source. The parser will extract questions, options, years, and match the answer key automatically.</DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                        {/* Subject + Chapter selector */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select value={ocrSubject} onValueChange={v => { setOcrSubject(v as Subject); setOcrChapter("1") }}>
                                    <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                                    <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Chapter</Label>
                                <Select value={ocrChapter} onValueChange={setOcrChapter}>
                                    <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                                    <SelectContent className="max-h-64">
                                        {Object.entries(getChaptersForSubject(ocrSubject)).map(([n, name]) => (
                                            <SelectItem key={n} value={n}>CH {n}: {name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Text Area */}
                        <div className="space-y-2">
                            <Label>Raw Text</Label>
                            <Textarea
                                placeholder={"1. The physical quantity having...\n(a) resistance\n(b) resistivity\n(c) electrical conductivity\n(d) electromotive force. (2006)\n\nANSWER KEY\n1. (c) 2. (a) ..."}
                                className="min-h-[200px] h-[28vh] bg-white/5 border-white/10 font-mono text-xs"
                                value={ocrText}
                                onChange={e => setOcrText(e.target.value)}
                            />
                            <Button onClick={parseOCR} variant="secondary" className="w-full">
                                <Search className="h-4 w-4 mr-2" /> Parse Text
                            </Button>
                        </div>

                        {/* Parsed Preview — Editable Cards */}
                        {parsedPreview.length > 0 && (
                            <div className="space-y-5 pt-4 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg text-emerald-400">Parsed {parsedPreview.length} Questions</h3>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" onClick={exportParsedJSON} className="border-white/10">
                                            <FileJson className="h-4 w-4 mr-2" /> Export JSON
                                        </Button>
                                        <Button onClick={saveParsedToDb} className="bg-gradient-to-r from-emerald-500 to-green-600">
                                            <Save className="h-4 w-4 mr-2" /> Save All to Database
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {parsedPreview.map((q, idx) => (
                                        <Card key={idx} className="bg-white/[0.03] border-white/10">
                                            <CardContent className="p-5 space-y-4">
                                                {/* Header: number, year, delete */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-indigo-400">{idx + 1}.</span>
                                                        <Badge className="bg-indigo-500/15 text-indigo-400 border-0 text-[10px]">{q.subject}</Badge>
                                                        <Badge variant="outline" className="text-[10px]">CH {q.chapter_number}</Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Input type="number" value={q.year} onChange={e => updateParsedQ(idx, "year", parseInt(e.target.value) || 2024)}
                                                            className="w-20 h-7 text-xs bg-white/5 border-white/10 text-center" />
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400" onClick={() => {
                                                            setParsedPreview(p => p.filter((_, i) => i !== idx))
                                                        }}><X className="h-4 w-4" /></Button>
                                                    </div>
                                                </div>

                                                {/* Question text — editable */}
                                                <Textarea value={q.question} onChange={e => updateParsedQ(idx, "question", e.target.value)}
                                                    className="bg-white/5 border-white/10 text-sm min-h-[60px]" />

                                                {/* 4 Options — editable with correct answer radio */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                    {[0, 1, 2, 3].map(i => (
                                                        <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg border transition-colors ${q.correct_answer === i ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-white/10'}`}>
                                                            <button type="button" onClick={() => updateParsedQ(idx, "correct_answer", i)}
                                                                className={`mt-1 h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center ${q.correct_answer === i ? 'border-emerald-500 bg-emerald-500' : 'border-white/30'}`}>
                                                                {q.correct_answer === i && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                                            </button>
                                                            <span className="mt-1 text-xs font-semibold text-muted-foreground">{String.fromCharCode(97 + i)})</span>
                                                            <div className="flex-1 flex flex-col gap-1.5">
                                                                <Input value={q.options[i] || ""} onChange={e => updateParsedQ(idx, `options.${i}`, e.target.value)}
                                                                    className="bg-transparent border-0 border-b border-white/5 focus-visible:ring-0 p-0 h-auto text-xs rounded-none" placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                                                                <Input value={q.option_images?.[i] || ""} onChange={e => {
                                                                    const imgs = [...(q.option_images || ["", "", "", ""])]
                                                                    imgs[i] = e.target.value
                                                                    updateParsedQ(idx, "option_images", imgs)
                                                                }}
                                                                    className="bg-white/5 border-white/10 h-6 p-1 text-[10px]" placeholder="Image URL (optional)" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Explanation — editable */}
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-muted-foreground">Explanation</Label>
                                                    <Textarea
                                                        value={q.explanation || ""}
                                                        onChange={e => updateParsedQ(idx, "explanation", e.target.value)}
                                                        placeholder="Why is this the correct answer? This will be shown to students after they answer."
                                                        className="min-h-[60px] text-xs bg-white/5 border-white/10"
                                                    />
                                                </div>

                                                {/* Image row */}
                                                <div className="flex items-center gap-4">
                                                    <label className="flex items-center gap-2 cursor-pointer shrink-0">
                                                        <Checkbox checked={q.needs_image} onCheckedChange={c => updateParsedQ(idx, "needs_image", !!c)} />
                                                        <span className="text-xs text-amber-400"><ImageIcon className="inline h-3 w-3 mr-1" />Needs Image</span>
                                                    </label>
                                                    <Input value={q.image_url || ""} onChange={e => updateParsedQ(idx, "image_url", e.target.value)}
                                                        placeholder="/pyq-images/ch1_q1.png" className="h-7 text-xs bg-white/5 border-white/10 flex-1" />
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

// ─── Access Codes Manager Section ─────────────────────────────
function AdminAccessCodesSection() {
    const [codes, setCodes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const { toast } = useToast()

    const fetchCodes = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('access_codes' as any)
                .select('*')
                .order('created_at', { ascending: false })
            if (error) throw error
            setCodes(data || [])
        } catch (err: any) {
            toast({
                title: "Error fetching codes",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCodes()
    }, [])

    const handleGenerateCode = async () => {
        setGenerating(true)
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let generatedCode = 'CODED-';
        for (let i = 0; i < 4; i++) {
            generatedCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        generatedCode += '-';
        for (let i = 0; i < 4; i++) {
            generatedCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        try {
            const { error } = await supabase
                .from('access_codes' as any)
                .insert({
                    code: generatedCode,
                    is_used: false,
                    payment_id: 'ADMIN-GENERATED'
                })
            if (error) throw error
            toast({
                title: "Code Generated",
                description: `Successfully created: ${generatedCode}`
            })
            fetchCodes()
        } catch (err: any) {
            toast({
                title: "Failed to generate code",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setGenerating(false)
        }
    }

    const handleDeleteCode = async (code: string) => {
        if (!confirm(`Delete access code ${code}?`)) return
        try {
            const { error } = await supabase
                .from('access_codes' as any)
                .delete()
                .eq('code', code)
            if (error) throw error
            toast({
                title: "Code Deleted",
                description: "Access code has been removed."
            })
            fetchCodes()
        } catch (err: any) {
            toast({
                title: "Failed to delete code",
                description: err.message,
                variant: "destructive"
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Key className="h-5 w-5 text-indigo-400" />
                        Access Codes Manager
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Generate and distribute unique, one-time access codes for premium features.
                    </p>
                </div>
                <Button 
                    onClick={handleGenerateCode} 
                    disabled={generating}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 font-bold font-sans"
                >
                    {generating ? "Generating..." : "Generate Code"}
                </Button>
            </div>

            <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                            Loading access codes...
                        </div>
                    ) : codes.length === 0 ? (
                        <div className="py-20 text-center text-xs text-muted-foreground">
                            No access codes found in the database. Generate one above!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-wider text-slate-400">
                                        <th className="p-4 font-semibold">Code</th>
                                        <th className="p-4 font-semibold">Status</th>
                                        <th className="p-4 font-semibold">Generated By</th>
                                        <th className="p-4 font-semibold">Created At</th>
                                        <th className="p-4 font-semibold">Redeemed At</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 font-mono">
                                    {codes.map((c) => (
                                        <tr key={c.code} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="p-4 font-bold text-white text-sm tracking-wider">{c.code}</td>
                                            <td className="p-4">
                                                <Badge variant={c.is_used ? "secondary" : "default"} className={c.is_used ? "bg-red-500/10 text-red-400 border-red-500/10" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"}>
                                                    {c.is_used ? "Redeemed" : "Active"}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-slate-400 font-sans">{c.payment_id || 'Checkout Payment'}</td>
                                            <td className="p-4 text-slate-500 font-sans">{new Date(c.created_at).toLocaleString()}</td>
                                            <td className="p-4 text-slate-500 font-sans">{c.used_at ? new Date(c.used_at).toLocaleString() : '—'}</td>
                                            <td className="p-4 text-right">
                                                <Button 
                                                    size="icon" 
                                                    variant="ghost" 
                                                    onClick={() => handleDeleteCode(c.code)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 rounded-lg"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// ─── Crowdsourced College Suggestions Section ─────────────────
function AdminCollegeSuggestionsSection() {
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const { toast } = useToast()

    const fetchSuggestions = async () => {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('college_suggestions' as any)
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false })
            if (error) throw error
            setSuggestions(data || [])
        } catch (err: any) {
            toast({
                title: "Error fetching suggestions",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSuggestions()
    }, [])

    const handleApprove = async (suggestion: any) => {
        setProcessingId(suggestion.id)
        try {
            const code = suggestion.college_code.toUpperCase()
            const suggest = (suggestion.suggested_data as any) || {}

            // 1. Fetch current override (if any)
            const { data: currentOverride } = await supabase
                .from('colleges')
                .select('*')
                .eq('code', code)
                .maybeSingle()

            // 2. Fetch static data from COLLEGE_DATABASE
            const staticCollege = COLLEGE_DATABASE.find(c => c.code.toUpperCase() === code)

            // 3. Construct fees_structure and placement_stats payloads
            const currentFees = (currentOverride?.fees_structure as any) || {}
            const fees_structure = {
                feeCetQuota: currentFees.feeCetQuota ?? staticCollege?.feeCetQuota ?? null,
                feeManagement: currentFees.feeManagement ?? staticCollege?.feeManagement ?? null
            }

            const currentPlacement = (currentOverride?.placement_stats as any) || {}
            const placement_stats = {
                avgPackage: currentPlacement.avgPackage ?? staticCollege?.avgPackage ?? null,
                medianPackage: currentPlacement.medianPackage ?? staticCollege?.medianPackage ?? null,
                maxPackage: currentPlacement.maxPackage ?? staticCollege?.maxPackage ?? null,
                minPackage: currentPlacement.minPackage ?? staticCollege?.minPackage ?? null,
                placementRate: currentPlacement.placementRate ?? staticCollege?.placementRate ?? null,
                topRecruiters: currentPlacement.topRecruiters ?? staticCollege?.topRecruiters ?? [],
                tier: currentPlacement.tier ?? staticCollege?.tier ?? 'Tier 3',
                naacGrade: currentPlacement.naacGrade ?? staticCollege?.naacGrade ?? null,
                nbaAccredited: currentPlacement.nbaAccredited ?? staticCollege?.nbaAccredited ?? null,
                autonomous: currentPlacement.autonomous ?? (staticCollege?.autonomous || false),
                nirfRank: currentPlacement.nirfRank ?? staticCollege?.nirfRank ?? null,
                tags: currentPlacement.tags ?? staticCollege?.tags ?? [],
                logoUrl: currentPlacement.logoUrl ?? staticCollege?.logoUrl ?? null,
                totalIntake: currentPlacement.totalIntake ?? staticCollege?.totalIntake ?? null
            }

            // Merge suggestions
            if (suggest.avgPackage !== null && suggest.avgPackage !== undefined) {
                placement_stats.avgPackage = suggest.avgPackage
            }
            if (suggest.medianPackage !== null && suggest.medianPackage !== undefined) {
                placement_stats.medianPackage = suggest.medianPackage
            }
            if (suggest.placementRate !== null && suggest.placementRate !== undefined) {
                placement_stats.placementRate = suggest.placementRate
            }
            if (suggest.feeCetQuota !== null && suggest.feeCetQuota !== undefined) {
                fees_structure.feeCetQuota = suggest.feeCetQuota
            }
            if (suggest.feeManagement !== null && suggest.feeManagement !== undefined) {
                fees_structure.feeManagement = suggest.feeManagement
            }

            // 4. Build upsert payload
            const payload = {
                code,
                name: currentOverride?.name || staticCollege?.name || code,
                website: currentOverride?.website || staticCollege?.website || null,
                location: currentOverride?.location || staticCollege?.city || null,
                district: currentOverride?.district || staticCollege?.district || null,
                established_year: currentOverride?.established_year || staticCollege?.established || null,
                type: currentOverride?.type || staticCollege?.type || 'Private',
                fees_structure,
                placement_stats,
                facilities: currentOverride?.facilities || staticCollege?.facilities || []
            }

            // 5. Upsert changes to colleges table
            const { error: upsertError } = await supabase
                .from('colleges')
                .upsert(payload, { onConflict: 'code' })
            if (upsertError) throw upsertError

            // 6. Update suggestion status to approved
            const { error: updateError } = await supabase
                .from('college_suggestions' as any)
                .update({ status: 'approved' })
                .eq('id', suggestion.id)
            if (updateError) throw updateError

            toast({
                title: "Suggestion Approved!",
                description: `Successfully applied edits for ${code}`
            })

            fetchSuggestions()
        } catch (err: any) {
            toast({
                title: "Approval Failed",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setProcessingId(null)
        }
    }

    const handleReject = async (id: string) => {
        if (!confirm("Reject this suggestion?")) return
        setProcessingId(id)
        try {
            const { error } = await supabase
                .from('college_suggestions' as any)
                .update({ status: 'rejected' })
                .eq('id', id)
            if (error) throw error

            toast({
                title: "Suggestion Rejected",
                description: "Suggestion has been marked as rejected."
            })

            fetchSuggestions()
        } catch (err: any) {
            toast({
                title: "Rejection Failed",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Edit3 className="h-5 w-5 text-indigo-400" />
                    College Edits Suggestion Queue
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Review and approve crowd-sourced placement, package, and fee suggestions from public users.
                </p>
            </div>

            <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                            <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                            Loading suggestions queue...
                        </div>
                    ) : suggestions.length === 0 ? (
                        <div className="py-20 text-center text-xs text-muted-foreground">
                            No pending suggestions found. The data is up to date!
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {suggestions.map((item) => {
                                const suggest = item.suggested_data
                                const current = item.current_data
                                return (
                                    <div key={item.id} className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start hover:bg-white/[0.01] transition-colors">
                                        <div className="space-y-4 flex-1">
                                            <div className="flex items-center gap-2.5">
                                                <Badge className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border-indigo-500/10 font-mono text-xs">
                                                    {item.college_code}
                                                </Badge>
                                                <span className="text-[10px] text-muted-foreground">
                                                    Submitted: {new Date(item.created_at).toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Comparison table */}
                                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4 text-[11px]">
                                                {/* Avg Package */}
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Avg Package</span>
                                                    <span className="text-slate-400">{current.avgPackage ? `${current.avgPackage} LPA` : '—'}</span>
                                                    <span className="text-slate-300 block font-bold">
                                                        👉 {suggest.avgPackage ? `${suggest.avgPackage} LPA` : '—'}
                                                    </span>
                                                </div>

                                                {/* Median Package */}
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Median Package</span>
                                                    <span className="text-slate-400">{current.medianPackage ? `${current.medianPackage} LPA` : '—'}</span>
                                                    <span className="text-slate-300 block font-bold">
                                                        👉 {suggest.medianPackage ? `${suggest.medianPackage} LPA` : '—'}
                                                    </span>
                                                </div>

                                                {/* Placement Rate */}
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Placement Rate</span>
                                                    <span className="text-slate-400">{current.placementRate ? `${current.placementRate}%` : '—'}</span>
                                                    <span className="text-slate-300 block font-bold">
                                                        👉 {suggest.placementRate ? `${suggest.placementRate}%` : '—'}
                                                    </span>
                                                </div>

                                                {/* CET Fee */}
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">CET Fee</span>
                                                    <span className="text-slate-400">{current.feeCetQuota ? `₹${current.feeCetQuota.toLocaleString()}` : '—'}</span>
                                                    <span className="text-slate-300 block font-bold">
                                                        👉 {suggest.feeCetQuota ? `₹${suggest.feeCetQuota.toLocaleString()}` : '—'}
                                                    </span>
                                                </div>

                                                {/* Mgmt Fee */}
                                                <div className="space-y-1">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Mgmt Fee</span>
                                                    <span className="text-slate-400">{current.feeManagement ? `₹${current.feeManagement.toLocaleString()}` : '—'}</span>
                                                    <span className="text-slate-300 block font-bold">
                                                        👉 {suggest.feeManagement ? `₹${suggest.feeManagement.toLocaleString()}` : '—'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Comments */}
                                            {suggest.comments && (
                                                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-slate-300 text-xs leading-relaxed">
                                                    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Source & Verification Notes:</div>
                                                    {suggest.comments}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 shrink-0 self-center md:self-start mt-4 md:mt-0">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={processingId === item.id}
                                                onClick={() => handleReject(item.id)}
                                                className="border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300 h-9 rounded-xl text-xs px-4"
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                size="sm"
                                                disabled={processingId === item.id}
                                                onClick={() => handleApprove(item)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 rounded-xl text-xs px-4 shadow-lg shadow-emerald-500/15"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// ─── Live Donation Broadcast Controller ──────────────────────────
function AdminDonationBroadcastController() {
    const [onlineCount, setOnlineCount] = useState(0)
    const [dismissedCount, setDismissedCount] = useState(0)
    const [triedCount, setTriedCount] = useState(0)
    const [broadcastId, setBroadcastId] = useState<number | null>(null)
    const [channelInstance, setChannelInstance] = useState<any>(null)
    const { toast } = useToast()

    useEffect(() => {
        // Fetch active broadcast ID on mount
        const init = async () => {
            const activeId = await AdminSuggestionsService.getActiveDonationBroadcast()
            if (activeId) {
                setBroadcastId(activeId)
                const counts = await AdminSuggestionsService.getDonationActionCounts(activeId)
                setDismissedCount(counts.dismiss)
                setTriedCount(counts.try)
            }
        }
        init()

        // Periodically refresh counts every 5 seconds to capture new database logs
        const interval = setInterval(async () => {
            const activeId = await AdminSuggestionsService.getActiveDonationBroadcast()
            if (activeId) {
                setBroadcastId(activeId)
                const counts = await AdminSuggestionsService.getDonationActionCounts(activeId)
                setDismissedCount(counts.dismiss)
                setTriedCount(counts.try)
            }
        }, 5000)

        const channel = supabase.channel("global-alerts")

        channel
            .on("presence", { event: "sync" }, () => {
                const presenceState = channel.presenceState()
                setOnlineCount(Object.keys(presenceState).length)
            })
            .on("broadcast", { event: "client-response" }, (payload) => {
                const { action } = payload.payload || {}
                if (action === "dismiss") {
                    setDismissedCount(c => c + 1)
                } else if (action === "try") {
                    setTriedCount(c => c + 1)
                }
            })
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    channel.track({ online_at: new Date().toISOString(), role: "admin" })
                }
            })

        setChannelInstance(channel)

        return () => {
            channel.unsubscribe()
            clearInterval(interval)
        }
    }, [])

    const handleBroadcast = async () => {
        let ch = channelInstance
        if (!ch) {
            ch = supabase.channel("global-alerts")
            ch.subscribe()
            setChannelInstance(ch)
        }

        const newId = Date.now()
        setBroadcastId(newId)
        setDismissedCount(0)
        setTriedCount(0)

        // Save session config to DB (100% reliable)
        await AdminSuggestionsService.setActiveDonationBroadcast(newId)

        try {
            const res = await ch.send({
                type: "broadcast",
                event: "donation-prompt",
                payload: { broadcastId: newId }
            })

            toast({
                title: "Broadcast Dispatched!",
                description: `Donation prompt (Session ID: ${newId}) broadcasted. Status: ${res || 'sent'}`,
            })
        } catch (err: any) {
            toast({
                title: "Broadcast Failed",
                description: err.message,
                variant: "destructive"
            })
        }

        try {
            await supabase.from("admin_activities").insert({
                action: "broadcast_donation_prompt",
                admin_id: "admin_manual",
                changes: { broadcastId: newId }
            })
        } catch (e) {
            console.warn("Failed to log activity:", e)
        }
    }

    const handleStopBroadcast = async () => {
        let ch = channelInstance
        if (!ch) {
            ch = supabase.channel("global-alerts")
            ch.subscribe()
            setChannelInstance(ch)
        }

        setBroadcastId(null)

        // Clear active session in DB (100% reliable)
        await AdminSuggestionsService.setActiveDonationBroadcast(null)

        // Close local test if active on current window
        window.dispatchEvent(new CustomEvent("donation-prompt-local-stop"))

        try {
            await ch.send({
                type: "broadcast",
                event: "donation-prompt-stop",
                payload: { broadcastId: null }
            })

            toast({
                title: "Broadcast Stopped",
                description: "Active donation request broadcast has been stopped and cleared.",
            })
        } catch (err: any) {
            toast({
                title: "Stop Broadcast Issue",
                description: err.message,
                variant: "destructive"
            })
        }

        try {
            await supabase.from("admin_activities").insert({
                action: "stop_donation_prompt",
                admin_id: "admin_manual",
                changes: { stoppedAt: new Date().toISOString() }
            })
        } catch (e) {
            console.warn("Failed to log activity:", e)
        }
    }

    const handleTestLocal = () => {
        // Trigger a local custom event for the current window to preview layout
        const customEvent = new CustomEvent("donation-prompt-local-test", {
            detail: { broadcastId: Date.now() }
        })
        window.dispatchEvent(customEvent)

        toast({
            title: "Local Preview Triggered",
            description: "Check the bottom right corner of your screen to see the popup.",
        })
    }

    return (
        <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500" />
                    Live Donation Request Broadcast
                </CardTitle>
                <CardDescription className="text-xs">
                    Broadcast a professional, non-intrusive donation request to all active online users.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Active Users Online</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-1">{onlineCount}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Dismissed Alert</div>
                        <div className="text-2xl font-bold text-zinc-400 mt-1">{dismissedCount}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 text-center border border-white/5">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase">Clicked Support</div>
                        <div className="text-2xl font-bold text-rose-400 mt-1">{triedCount}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="text-xs text-muted-foreground max-w-md">
                        {broadcastId ? (
                            <span>Active Broadcast Session: <code className="text-indigo-400 font-mono">{broadcastId}</code></span>
                        ) : (
                            <span>No active broadcast session yet. Click the button to trigger one.</span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {broadcastId && (
                            <Button 
                                variant="destructive"
                                onClick={handleStopBroadcast} 
                                className="bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-semibold px-3 h-9 flex items-center gap-1.5 border border-rose-500/30"
                            >
                                <StopCircle className="h-3.5 w-3.5" />
                                Stop Broadcast
                            </Button>
                        )}
                        <Button 
                            variant="outline"
                            onClick={handleTestLocal} 
                            className="border-white/10 hover:bg-white/5 text-xs h-9 px-3"
                        >
                            Test on Self
                        </Button>
                        <Button 
                            onClick={handleBroadcast} 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 h-9"
                        >
                            {broadcastId ? "Restart Broadcast" : "Send Donation Popup"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const BLOCKABLE_PAGES = [
  { name: "Rank Predictor", path: "/rank-predictor" },
  { name: "College Predictor", path: "/college-predictor" },
  { name: "Fee Calculator", path: "/fee-calculator" },
  { name: "Cutoff Explorer", path: "/cutoff-explorer" },
  { name: "Cutoff Predictor", path: "/cutoff-predictor" },
  { name: "COMEDK Explorer", path: "/comedk-explorer" },
  { name: "Cutoff Trends", path: "/cutoff-trends" },
  { name: "Mock Simulator", path: "/mock-simulator" },
  { name: "Round Tracker", path: "/round-tracker" },
  { name: "College Compare", path: "/college-compare" },
  { name: "College Cutoffs & Directory", path: "/college-cutoffs" },
  { name: "College Info Hub", path: "/college-info-hub" },
  { name: "Blog & Guides", path: "/blog" },
  { name: "Daily Challenge Quiz", path: "/daily-challenge" },
  { name: "Cutoff Clash Game", path: "/cutoff-clash" },
  { name: "PYQ Mock Tests", path: "/pyq-test" },
  { name: "Documents Directory", path: "/documents" },
  { name: "Document Verification (Mock)", path: "/document-verification" },
  { name: "Reviews", path: "/reviews" },
  { name: "Info Centre", path: "/info-centre" },
  { name: "Study Materials", path: "/materials" },
  { name: "CET News", path: "/cet-news" },
  { name: "AI Counselor", path: "/ai-counselor" },
  { name: "Squad Finder", path: "/squad-finder" },
  { name: "Metro Mapper", path: "/metro-mapper" },
  { name: "BMTC Mapper", path: "/bmtc-mapper" },
  { name: "Hidden Gems", path: "/hidden-gems" },
  { name: "Donate Page", path: "/donate" },
  { name: "Supporters Page", path: "/supporters" },
  { name: "Feature Requests", path: "/feature-requests" }
];

function AdminSystemSettingsSection() {
    const [greetingText, setGreetingText] = useState(() => localStorage.getItem("kcet_admin_greeting_text") || "User")
    const [devMessageText, setDevMessageText] = useState(() => localStorage.getItem("kcet_dev_message_text") || "")
    const [devMessageEnabled, setDevMessageEnabled] = useState(() => localStorage.getItem("kcet_dev_message_enabled") === "true")
    const [devMessageType, setDevMessageType] = useState(() => localStorage.getItem("kcet_dev_message_type") || "info")
    
    const [paywallDisabled, setPaywallDisabled] = useState(false)
    const [donationButtonEnabled, setDonationButtonEnabled] = useState(false)
    const [siteShutdown, setSiteShutdown] = useState(false)
    const [shutdownConfig, setShutdownConfig] = useState<SiteShutdownConfig>({
        shutdown: false,
        errorCode: "404",
        title: "Page Not Found",
        message: "The requested URL {path} does not exist or has been moved.",
        buttonText: "Go Back",
        showButton: true
    })
    const [savingShutdownConfig, setSavingShutdownConfig] = useState(false)
    const [blockedPages, setBlockedPages] = useState<string[]>([])
    const [maintenancePages, setMaintenancePages] = useState<string[]>([])
    const [savingMaintenance, setSavingMaintenance] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [savingBlocks, setSavingBlocks] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState<any[]>([])
    const { toast } = useToast()

    const handleSaveGreeting = async () => {
        const val = greetingText.trim() || "User"
        setSaving(true)
        const ok = await AdminSuggestionsService.setAdminGreetingName(val)
        setSaving(false)
        if (ok) {
            toast({
                title: "Global Greeting Saved",
                description: `Dashboard greeting name globally updated to "${val}" for all users.`
            })
        } else {
            toast({
                title: "Save Failed",
                description: "Could not save custom greeting to database.",
                variant: "destructive"
            })
        }
    }

    const handleSaveDevMessage = async () => {
        setSaving(true)
        const ok = await AdminSuggestionsService.setDevAnnouncementConfig({
            message: devMessageText.trim(),
            enabled: devMessageEnabled,
            type: devMessageType
        })
        setSaving(false)
        if (ok) {
            toast({
                title: "Global Developer Announcement Saved",
                description: devMessageEnabled 
                    ? "Announcement live on Dashboard for all visitors globally!" 
                    : "Announcement saved to database (hidden).",
            })
        } else {
            toast({
                title: "Save Failed",
                description: "Could not save announcement to database.",
                variant: "destructive"
            })
        }
    }

    const fetchSettings = async () => {
        try {
            setLoading(true)
            const [disabled, blocked, maintenance, shutdownCfg, name, devCfg] = await Promise.all([
                AdminSuggestionsService.isPaywallDisabledGlobally(),
                AdminSuggestionsService.getBlockedPages(),
                AdminSuggestionsService.getMaintenancePages(),
                AdminSuggestionsService.getSiteShutdownConfig(),
                AdminSuggestionsService.getAdminGreetingName(),
                AdminSuggestionsService.getDevAnnouncementConfig()
            ])
            setPaywallDisabled(disabled)
            setBlockedPages(blocked)
            setMaintenancePages(maintenance)
            setShutdownConfig(shutdownCfg)
            setSiteShutdown(shutdownCfg.shutdown)
            setGreetingText(name)
            setDevMessageText(devCfg.message)
            setDevMessageEnabled(devCfg.enabled)
            setDevMessageType(devCfg.type)
            setDonationButtonEnabled(localStorage.getItem('kcet_donation_button_enabled') === 'true')
        } catch (err: any) {
            toast({
                title: "Error fetching settings",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            await AdminSuggestionsService.setPaywallDisabledGlobally(paywallDisabled)
            toast({
                title: "Settings Saved",
                description: "Global paywall bypass flag has been updated."
            })
        } catch (err: any) {
            toast({
                title: "Failed to save settings",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setSaving(false)
        }
    }

    const handleToggleSiteShutdown = async (checked: boolean) => {
        setSiteShutdown(checked)
        const updatedConfig = { ...shutdownConfig, shutdown: checked }
        setShutdownConfig(updatedConfig)
        try {
            const success = await AdminSuggestionsService.setSiteShutdownConfig(updatedConfig)
            if (success) {
                toast({
                    title: checked ? "Website Completely Shut Down" : "Website Restored",
                    description: checked 
                        ? "The entire website is now offline for users except /admin." 
                        : "The website is back online for all users.",
                    variant: checked ? "destructive" : "default"
                })
            } else {
                throw new Error("Failed to update database")
            }
        } catch (err: any) {
            setSiteShutdown(!checked)
            setShutdownConfig({ ...shutdownConfig, shutdown: !checked })
            toast({
                title: "Error updating site shutdown status",
                description: err.message,
                variant: "destructive"
            })
        }
    }

    const handleSaveShutdownConfig = async () => {
        try {
            setSavingShutdownConfig(true)
            const success = await AdminSuggestionsService.setSiteShutdownConfig(shutdownConfig)
            if (success) {
                toast({
                    title: "Popup Content Saved",
                    description: "Shutdown 404 popup title, message, and error code have been updated."
                })
            } else {
                throw new Error("Database error saving popup content")
            }
        } catch (err: any) {
            toast({
                title: "Failed to save popup content",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setSavingShutdownConfig(false)
        }
    }

    const handleSaveBlockedPages = async () => {
        try {
            setSavingBlocks(true)
            await Promise.all([
                AdminSuggestionsService.setBlockedPages(blockedPages),
                AdminSuggestionsService.setMaintenancePages(maintenancePages)
            ])
            toast({
                title: "Settings Saved",
                description: "Page access & maintenance configurations updated."
            })
        } catch (err: any) {
            toast({
                title: "Failed to save settings",
                description: err.message,
                variant: "destructive"
            })
        } finally {
            setSavingBlocks(false)
        }
    }

    useEffect(() => {
        fetchSettings()

        const channel = supabase.channel("global-alerts")

        const syncPresence = () => {
            const presenceState = channel.presenceState()
            const activeUsersMap: Record<string, { sessionId: string; page: string; online_at: string; isAgentOrAdmin?: boolean }> = {};
            
            Object.values(presenceState).forEach((presences: any) => {
                presences.forEach((presence: any) => {
                    if (!presence.sessionId) return;
                    const existing = activeUsersMap[presence.sessionId];
                    if (!existing || new Date(presence.online_at).getTime() > new Date(existing.online_at).getTime()) {
                        activeUsersMap[presence.sessionId] = {
                            sessionId: presence.sessionId,
                            page: presence.page || "Unknown",
                            online_at: presence.online_at,
                            isAgentOrAdmin: presence.role === "admin"
                        };
                    }
                });
            });
            
            setOnlineUsers(Object.values(activeUsersMap))
        }

        channel
            .on("presence", { event: "sync" }, syncPresence)
            .subscribe((status) => {
                if (status === "SUBSCRIBED") {
                    channel.track({ online_at: new Date().toISOString(), role: "admin", sessionId: "ADMIN_PANEL" })
                }
            })

        return () => {
            channel.unsubscribe()
        }
    }, [])

    const regularUsers = onlineUsers.filter(u => !u.isAgentOrAdmin && u.sessionId !== "ADMIN_PANEL")
    
    // Count users per page
    const pageCounts: Record<string, number> = {}
    regularUsers.forEach(u => {
        pageCounts[u.page] = (pageCounts[u.page] || 0) + 1
    })

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-400" />
                    System Settings
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                    Manage global platform-level flags, page access, and monitor user presence.
                </p>
            </div>

            {/* Dashboard Greeting Name Override Card */}
            <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-400" /> Dashboard Greeting Name Override
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                        Customize the greeting suffix shown on the dashboard header ("Good evening, [Admin Custom Name]").
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            value={greetingText}
                            onChange={(e) => setGreetingText(e.target.value)}
                            placeholder="e.g. Aspirant, Future Engineer, Scholar..."
                            className="bg-white/5 border-white/10 text-xs font-semibold text-white"
                        />
                        <Button
                            onClick={handleSaveGreeting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 px-4 shrink-0"
                        >
                            Save Greeting
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Dashboard Natural Description Subtitle Card */}
            <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md shadow-lg">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                            <Edit3 className="h-4 w-4 text-emerald-400" /> Dashboard Subtitle / Custom Description
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs text-slate-300">Enable Custom Subtitle</Label>
                            <Switch
                                checked={devMessageEnabled}
                                onCheckedChange={(val) => setDevMessageEnabled(val)}
                            />
                        </div>
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                        Set custom description text displayed naturally under the greeting on the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-300 font-semibold">Description Text</Label>
                        <Textarea
                            value={devMessageText}
                            onChange={(e) => setDevMessageText(e.target.value)}
                            placeholder="e.g. Option entry window is live! Verify your college preferences before submitting."
                            rows={3}
                            className="bg-white/5 border-white/10 text-xs text-white"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSaveDevMessage}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 shrink-0"
                        >
                            Save Subtitle Text
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Emergency Complete Site Shutdown Card */}
            <Card className={`border shadow-lg transition-all ${
                siteShutdown 
                    ? "bg-rose-950/40 border-rose-500/50 shadow-rose-500/20" 
                    : "border-white/10 bg-slate-950/40 backdrop-blur-md"
            }`}>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                                <Power className={`h-5 w-5 ${siteShutdown ? "text-rose-500 animate-pulse" : "text-slate-400"}`} />
                                Emergency Complete Website Shutdown
                                {siteShutdown ? (
                                    <Badge variant="destructive" className="bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5">
                                        Active (Website Offline)
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                                        Online (Normal Operation)
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription className="text-xs text-muted-foreground max-w-2xl">
                                Completely shut down the entire website for all users (including Homepage & Dashboard). Every visitor will see a custom error screen. <strong className="text-amber-400">Only the <code className="text-indigo-400">/admin</code> route remains accessible.</strong>
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-xs font-semibold ${siteShutdown ? "text-rose-400" : "text-muted-foreground"}`}>
                                {siteShutdown ? "SHUTDOWN ACTIVE" : "NORMAL SITE ACCESS"}
                            </span>
                            <Switch
                                className="data-[state=checked]:bg-rose-600 scale-125"
                                checked={siteShutdown}
                                onCheckedChange={handleToggleSiteShutdown}
                            />
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-0 border-t border-white/5 mt-4">
                    <div className="pt-4 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                            <Edit3 className="h-3.5 w-3.5 text-indigo-400" /> Customize 404 Popup Content & Message
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-1 space-y-1">
                                        <Label className="text-xs text-muted-foreground">Error Code</Label>
                                        <Input
                                            value={shutdownConfig.errorCode || "404"}
                                            onChange={e => setShutdownConfig({ ...shutdownConfig, errorCode: e.target.value })}
                                            placeholder="404"
                                            className="bg-white/5 border-white/10 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <Label className="text-xs text-muted-foreground">Headline Title</Label>
                                        <Input
                                            value={shutdownConfig.title || "Page Not Found"}
                                            onChange={e => setShutdownConfig({ ...shutdownConfig, title: e.target.value })}
                                            placeholder="Page Not Found"
                                            className="bg-white/5 border-white/10 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground flex justify-between">
                                        <span>Message Body Text</span>
                                        <span className="text-[10px] text-indigo-400 font-mono">Use {"{path}"} for route</span>
                                    </Label>
                                    <Textarea
                                        value={shutdownConfig.message || "The requested URL {path} does not exist or has been moved."}
                                        onChange={e => setShutdownConfig({ ...shutdownConfig, message: e.target.value })}
                                        placeholder="The requested URL {path} does not exist or has been moved."
                                        className="bg-white/5 border-white/10 text-xs min-h-[80px]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 items-center">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-muted-foreground">Button Text</Label>
                                        <Input
                                            value={shutdownConfig.buttonText || "Go Back"}
                                            onChange={e => setShutdownConfig({ ...shutdownConfig, buttonText: e.target.value })}
                                            placeholder="Go Back"
                                            className="bg-white/5 border-white/10 text-xs"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between pt-4">
                                        <Label className="text-xs text-muted-foreground">Show Button</Label>
                                        <Switch
                                            checked={shutdownConfig.showButton !== false}
                                            onCheckedChange={checked => setShutdownConfig({ ...shutdownConfig, showButton: checked })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Live Mini Preview Box */}
                            <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                                    <Monitor className="h-3 w-3 text-slate-400" /> Live Popup Preview
                                </Label>
                                <div className="border border-white/10 bg-[#0a0d14] rounded-xl p-6 text-center space-y-4 shadow-inner min-h-[220px] flex flex-col justify-center items-center">
                                    <div className="space-y-1">
                                        {shutdownConfig.errorCode && (
                                            <div className="text-4xl font-black font-mono tracking-tight text-white">
                                                {shutdownConfig.errorCode}
                                            </div>
                                        )}
                                        <h5 className="text-sm font-bold text-slate-100">
                                            {shutdownConfig.title || "Page Not Found"}
                                        </h5>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs whitespace-pre-wrap">
                                        {(shutdownConfig.message || "The requested URL {path} does not exist or has been moved.").replace("{path}", "/rank-predictor")}
                                    </p>
                                    {shutdownConfig.showButton !== false && (
                                        <Button variant="outline" size="sm" className="text-[10px] text-slate-300 border-white/10 bg-white/5 h-7 px-3 rounded-lg pointer-events-none">
                                            {shutdownConfig.buttonText || "Go Back"}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-white/5">
                            <Button
                                onClick={handleSaveShutdownConfig}
                                disabled={savingShutdownConfig}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xs h-9 px-4"
                            >
                                {savingShutdownConfig ? "Saving Content..." : "Save Popup Content & Config"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Live User Activity Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Live user summary and counts by page */}
                <Card className="lg:col-span-1 border-white/10 bg-slate-950/40 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
                            Live Statistics
                        </CardTitle>
                        <CardDescription className="text-[11px] text-muted-foreground">
                            Current active sessions breakdown by page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                            <div className="text-2xl font-black text-emerald-400">
                                {regularUsers.length}
                            </div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-1">
                                Users Online Now
                            </div>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                            <div className="text-xs font-semibold text-muted-foreground/80 px-1">
                                Users Per Page
                            </div>
                            {Object.keys(pageCounts).length === 0 ? (
                                <p className="text-xs text-muted-foreground px-1 py-2 italic">
                                    No user activity detected.
                                </p>
                            ) : (
                                Object.entries(pageCounts).map(([page, count]) => {
                                    const pageObj = BLOCKABLE_PAGES.find(p => p.path === page);
                                    const pageName = pageObj ? pageObj.name : page;
                                    return (
                                        <div key={page} className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-lg px-3 py-2 text-xs">
                                            <span className="text-slate-300 font-medium truncate max-w-[180px]">
                                                {pageName}
                                            </span>
                                            <Badge className="bg-indigo-500/20 text-indigo-300 border-none font-bold">
                                                {count} {count === 1 ? "user" : "users"}
                                            </Badge>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Live user list */}
                <Card className="lg:col-span-2 border-white/10 bg-slate-950/40 backdrop-blur-md shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                            <Users className="h-4 w-4 text-indigo-400" />
                            Live User Directory
                        </CardTitle>
                        <CardDescription className="text-[11px] text-muted-foreground">
                            Real-time overview of active user sessions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border border-white/5 rounded-xl overflow-hidden">
                            <div className="max-h-[350px] overflow-y-auto w-full overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[500px]">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5 text-[10px] font-bold uppercase text-muted-foreground tracking-wider">
                                            <th className="px-4 py-3">Session ID</th>
                                            <th className="px-4 py-3">Active Page</th>
                                            <th className="px-4 py-3 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                                        {regularUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="text-center py-8 text-muted-foreground italic">
                                                    No active user sessions online right now.
                                                </td>
                                            </tr>
                                        ) : (
                                            regularUsers.map((user) => {
                                                const pageObj = BLOCKABLE_PAGES.find(p => p.path === user.page);
                                                const pageName = pageObj ? pageObj.name : user.page;
                                                return (
                                                    <tr key={user.sessionId} className="hover:bg-white/[0.01] transition-colors">
                                                        <td className="px-4 py-3 font-mono text-[11px] text-indigo-400">
                                                            {user.sessionId.replace("USER:", "#")}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="font-medium text-white">{pageName}</span>
                                                            <span className="text-[10px] text-muted-foreground block truncate max-w-[200px]">
                                                                {user.page}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                                Active
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Page Access Management Card */}
            <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-rose-500" />
                        Page Access Control
                    </CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground">
                        Block individual routes/features of the platform to prevent public access. whitelisted admin routes remain accessible.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {loading ? (
                        <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                            Loading configuration...
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {BLOCKABLE_PAGES.map((page) => {
                                    const isPageBlocked = blockedPages.includes(page.path);
                                    const isPageMaintenance = maintenancePages.includes(page.path);
                                    return (
                                        <div 
                                            key={page.path} 
                                            className={`flex flex-col gap-2.5 p-3 rounded-xl border transition-all ${
                                                isPageMaintenance
                                                    ? "bg-amber-500/5 border-amber-500/30"
                                                    : isPageBlocked 
                                                    ? "bg-rose-500/5 border-rose-500/20" 
                                                    : "bg-white/[0.02] border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-0.5 pr-2 truncate">
                                                    <div className="text-xs font-semibold text-white flex items-center gap-1.5 truncate">
                                                        <span className="truncate">{page.name}</span>
                                                        {isPageMaintenance && (
                                                            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[8px] px-1 py-0 h-3.5 uppercase font-bold shrink-0">
                                                                Maintenance
                                                            </Badge>
                                                        )}
                                                        {isPageBlocked && (
                                                            <Badge variant="destructive" className="text-[8px] px-1 py-0 h-3.5 uppercase font-bold shrink-0">
                                                                Paywall
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-[9px] text-muted-foreground font-mono block truncate">
                                                        {page.path}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px]">
                                                {/* Paywall Toggle */}
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-muted-foreground">Paywall:</span>
                                                    <Switch
                                                        className="data-[state=checked]:bg-rose-500 scale-75"
                                                        checked={isPageBlocked}
                                                        onCheckedChange={async (checked) => {
                                                            const updated = checked 
                                                                ? [...blockedPages.filter(p => p !== page.path), page.path]
                                                                : blockedPages.filter(p => p !== page.path);
                                                            setBlockedPages(updated);
                                                            await AdminSuggestionsService.setBlockedPages(updated);
                                                            toast({
                                                                title: checked ? "Paywall Enabled" : "Paywall Disabled",
                                                                description: `Paywall setting for ${page.name} updated globally.`
                                                            });
                                                        }}
                                                    />
                                                </div>

                                                {/* Maintenance Toggle */}
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-amber-400 font-medium">Maintenance:</span>
                                                    <Switch
                                                        className="data-[state=checked]:bg-amber-500 scale-75"
                                                        checked={isPageMaintenance}
                                                        onCheckedChange={async (checked) => {
                                                            const updated = checked 
                                                                ? [...maintenancePages.filter(p => p !== page.path), page.path]
                                                                : maintenancePages.filter(p => p !== page.path);
                                                            setMaintenancePages(updated);
                                                            await AdminSuggestionsService.setMaintenancePages(updated);
                                                            toast({
                                                                title: checked ? "Maintenance Mode Active" : "Maintenance Mode Off",
                                                                description: `Maintenance status for ${page.name} updated globally.`
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-end pt-2 border-t border-white/5">
                                <Button 
                                    onClick={handleSaveBlockedPages} 
                                    disabled={savingBlocks} 
                                    className="bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-600 hover:to-amber-700 text-white font-semibold text-xs h-9 px-4 shadow-lg shadow-rose-500/10"
                                >
                                    {savingBlocks ? "Saving..." : "Save Page Access Settings"}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-sm font-bold text-white">Premium Feature Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                            Checking paywall status...
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        Disable Premium Paywall Site-Wide
                                        <Badge variant={paywallDisabled ? "secondary" : "default"} className={paywallDisabled ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"}>
                                            {paywallDisabled ? "Bypassed (Free)" : "Active (Premium)"}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground max-w-xl">
                                        When enabled, all premium features (Mock Simulator, Cutoff Explorer, AI Counselor, etc.) will be completely free and accessible for all users without any unlock keys or payment prompts.
                                    </p>
                                </div>
                                <Switch
                                    className="data-[state=checked]:bg-emerald-500"
                                    checked={paywallDisabled}
                                    onCheckedChange={setPaywallDisabled}
                                />
                            </div>

                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="space-y-0.5">
                                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                                        Enable Floating Support (Heart) Button
                                        <Badge variant={donationButtonEnabled ? "default" : "secondary"} className={donationButtonEnabled ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"}>
                                            {donationButtonEnabled ? "Visible" : "Hidden"}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground max-w-xl">
                                        Show the floating pink Heart button at the bottom-right corner of the platform for candidate contributions.
                                    </p>
                                </div>
                                <Switch
                                    className="data-[state=checked]:bg-rose-500"
                                    checked={donationButtonEnabled}
                                    onCheckedChange={(checked) => {
                                        setDonationButtonEnabled(checked)
                                        localStorage.setItem('kcet_donation_button_enabled', checked ? 'true' : 'false')
                                        toast({
                                            title: checked ? "Floating Heart Button Enabled" : "Floating Heart Button Hidden",
                                            description: checked ? "The floating support button is now visible to users." : "The floating support button is now hidden from users."
                                        })
                                    }}
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-xs h-9 px-4">
                                    {saving ? "Saving..." : "Save Settings"}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <AdminVisitorCounterControl />

            <AdminDonationBroadcastController />
        </div>
    )
}

function AdminVisitorCounterControl() {
    const { totalVisits, activeOnline, isLive, overrideVisits } = useVisitorCounter()
    const [newVal, setNewVal] = useState(String(totalVisits))
    const [saving, setSaving] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        setNewVal(String(totalVisits))
    }, [totalVisits])

    const handleUpdate = async () => {
        const num = Number(newVal)
        if (isNaN(num) || num < 51783) {
            toast({
                title: "Invalid Count",
                description: "Baseline count cannot be less than 51,783.",
                variant: "destructive"
            })
            return
        }
        setSaving(true)
        const ok = await overrideVisits(num)
        setSaving(false)
        if (ok) {
            toast({
                title: "Visitor Count Updated",
                description: `Live visitor counter baseline updated to ${num.toLocaleString('en-IN')}`
            })
        } else {
            toast({
                title: "Update Failed",
                description: "Could not save updated count to database.",
                variant: "destructive"
            })
        }
    }

    return (
        <Card className="border-white/10 bg-slate-950/40 backdrop-blur-md shadow-lg">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-400" /> Realtime Visitor Counter Manager
                    </span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                        {isLive ? "REALTIME SYNC ACTIVE" : "CONNECTING..."}
                    </Badge>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                    Monitor site visits starting from baseline 51,783 and override counter values live.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <LiveVisitorCounter variant="detailed" />

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <Label className="text-xs font-medium text-slate-300">Override Total Visitor Baseline</Label>
                    <div className="flex gap-2">
                        <Input
                            type="number"
                            value={newVal}
                            onChange={(e) => setNewVal(e.target.value)}
                            className="bg-white/5 border-white/10 text-xs font-mono"
                            placeholder="Enter new visitor count..."
                        />
                        <Button
                            onClick={handleUpdate}
                            disabled={saving}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 shrink-0"
                        >
                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Count"}
                        </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                        Updating this will broadcast the new count immediately to all active visitors in real-time.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

// ─── Admin Hub Tabs ────────────────────────────────────────────
const ADMIN_SECTIONS = [
    { id: "pyq", label: "PYQ Manager", icon: BookOpenCheck },
    { id: "polls", label: "Community Polls", icon: Vote },
    { id: "popups", label: "Popups & Alerts", icon: Megaphone },
    { id: "ai-extractor", label: "AI Extractor", icon: BrainCircuit },
    { id: "cutoffs", label: "Cutoffs", icon: BarChart3 },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "colleges", label: "Colleges Override", icon: Building2 },
    { id: "college-suggestions", label: "Crowdsourced Edits", icon: Edit3 },
    { id: "access-codes", label: "Access Codes", icon: Key },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "suggestions", label: "Suggestions & Doubts", icon: ClipboardPaste },
    { id: "features", label: "Feature Requests", icon: Lightbulb },
    { id: "actual-ranks", label: "2027 Ranks Database", icon: Database },
    { id: "settings", label: "System Settings", icon: Settings },
] as const

type SectionId = typeof ADMIN_SECTIONS[number]["id"]

export default function AdminHub() {
    const [authed, setAuthed] = useState(sessionStorage.getItem(AUTH_KEY) === "1")
    const [activeSection, setActiveSection] = useState<SectionId>("pyq")

    if (!authed) return <AdminAuthGate onAuth={() => setAuthed(true)} />

    return (
        <div className="min-h-screen bg-background">
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Sidebar */}
                <aside className="w-56 min-h-screen border-r border-white/5 bg-white/[0.02] p-4 space-y-2 shrink-0 hidden md:block">
                    <div className="px-2 pb-4 mb-2 border-b border-white/10">
                        <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground/60 flex items-center gap-2">
                            <Settings className="h-3.5 w-3.5" /> Admin Panel
                        </h2>
                    </div>
                    {ADMIN_SECTIONS.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                activeSection === section.id
                                    ? "bg-indigo-500/10 text-indigo-400 font-medium"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                            }`}
                        >
                            <section.icon className="h-4 w-4" />
                            {section.label}
                        </button>
                    ))}
                </aside>

                {/* Mobile tabs */}
                <div className="md:hidden w-full border-b border-white/5 bg-white/[0.02] px-4 pt-4 pb-2 flex gap-1 overflow-x-auto">
                    {ADMIN_SECTIONS.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all ${
                                activeSection === section.id
                                    ? "bg-indigo-500/10 text-indigo-400 font-medium"
                                    : "text-muted-foreground"
                            }`}
                        >
                            <section.icon className="h-3.5 w-3.5" />
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <main className="flex-1 p-6 md:p-8 max-w-7xl">
                    {activeSection === "pyq" && <AdminPYQSection />}
                    {activeSection === "polls" && <AdminPollManager />}
                    {activeSection === "popups" && <AdminPopupControllerSection />}
                    {activeSection === "ai-extractor" && <AdminAIExtractor />}
                    {activeSection === "cutoffs" && <AdminCutoffsPage />}
                    {activeSection === "reviews" && <AdminReviewModeration />}
                    {activeSection === "feedback" && <AdminFeedbackView />}
                    {activeSection === "suggestions" && <AdminSuggestionsView />}
                    {activeSection === "features" && <AdminFeatureRequestsView />}
                    {activeSection === "actual-ranks" && <AdminActualRanksView />}
                    {activeSection === "colleges" && <AdminCollegeEditor />}
                    {activeSection === "college-suggestions" && <AdminCollegeSuggestionsSection />}
                    {activeSection === "access-codes" && <AdminAccessCodesSection />}
                    {activeSection === "settings" && <AdminSystemSettingsSection />}
                </main>
            </div>
        </div>
    )
}

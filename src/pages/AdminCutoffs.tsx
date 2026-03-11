import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { AdminCutoffService, AdminCutoffEntry } from "@/lib/admin-cutoff-service"
import AdminReviewModeration from "@/components/AdminReviewModeration"
import AdminFeedbackView from "@/components/AdminFeedbackView"
import AdminFeatureRequestsView from "@/components/AdminFeatureRequestsView"
import {
    ShieldCheck, Plus, Download, Upload, Undo2, Trash2, Search,
    Edit3, Save, X, FileJson, FileSpreadsheet, Copy, RefreshCw,
    AlertTriangle, CheckCircle2, Database, Clock, Filter, ChevronLeft,
    ChevronRight, Lock, ArrowUpDown, RotateCcw, Zap, Grid3X3, MessageSquare, LineChart, Lightbulb
} from "lucide-react"

const ADMIN_PASS = "kcetadmin2026"
const AUTH_KEY = "kcet_admin_auth"

// ─── Category colors (matching CutoffExplorer) ────────────────
const getCategoryColor = (cat: string) => {
    switch (cat?.toUpperCase()) {
        case 'GM': return 'bg-blue-500/15 text-blue-400 border-blue-500/20'
        case 'GMK': return 'bg-blue-500/15 text-blue-300 border-blue-500/20'
        case 'GMR': return 'bg-sky-500/15 text-sky-400 border-sky-500/20'
        case 'SC': return 'bg-green-500/15 text-green-400 border-green-500/20'
        case 'SCK': return 'bg-green-500/15 text-green-300 border-green-500/20'
        case 'SCR': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
        case 'ST': return 'bg-purple-500/15 text-purple-400 border-purple-500/20'
        case 'STK': return 'bg-purple-500/15 text-purple-300 border-purple-500/20'
        case 'STR': return 'bg-violet-500/15 text-violet-400 border-violet-500/20'
        case '1G': return 'bg-red-500/15 text-red-400 border-red-500/20'
        case '1GK': return 'bg-red-500/15 text-red-300 border-red-500/20'
        case '1GR': return 'bg-rose-500/15 text-rose-400 border-rose-500/20'
        case '2A': case '2AG': return 'bg-orange-500/15 text-orange-400 border-orange-500/20'
        case '2AK': case '2AR': return 'bg-orange-500/15 text-orange-300 border-orange-500/20'
        case '2B': case '2BG': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20'
        case '2BK': case '2BR': return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20'
        case '3A': case '3AG': return 'bg-pink-500/15 text-pink-400 border-pink-500/20'
        case '3AK': case '3AR': return 'bg-pink-500/15 text-pink-300 border-pink-500/20'
        case '3B': case '3BG': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20'
        case '3BK': case '3BR': return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20'
        default: return 'bg-gray-500/15 text-gray-400 border-gray-500/20'
    }
}

const getRoundColor = (round: string) => {
    const r = round?.toUpperCase()
    if (r?.includes('MOCK')) return 'bg-amber-500/15 text-amber-400 border-amber-500/20'
    if (r?.includes('1') || r === 'R1') return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20'
    if (r?.includes('2') || r === 'R2') return 'bg-teal-500/15 text-teal-400 border-teal-500/20'
    if (r?.includes('3') || r === 'R3') return 'bg-lime-500/15 text-lime-400 border-lime-500/20'
    return 'bg-gray-500/15 text-gray-400 border-gray-500/20'
}

// ─── Auth Gate ─────────────────────────────────────────────────
function AdminAuthGate({ onAuth }: { onAuth: () => void }) {
    const [pass, setPass] = useState("")
    const [error, setError] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { inputRef.current?.focus() }, [])

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
                    <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Enter passphrase to manage cutoff data</p>
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

// ─── Add Entry Form ────────────────────────────────────────────
interface AddEntryFormProps {
    onClose: () => void
    onAdded: () => void
    templateEntry?: AdminCutoffEntry | null
}

// Per-field validation errors
interface FieldErrors {
    year?: string
    round?: string
    institute_code?: string
    institute?: string
    course?: string
    category?: string
    cutoff_rank?: string
}

function AddEntryForm({ onClose, onAdded, templateEntry }: AddEntryFormProps) {
    const { toast } = useToast()
    const [batchMode, setBatchMode] = useState(false)
    const [form, setForm] = useState({
        year: templateEntry?.year || '2025',
        round: templateEntry?.round || 'R1',
        institute_code: templateEntry?.institute_code || '',
        institute: (templateEntry as any)?.institute || templateEntry?.college_name || '',
        course: templateEntry?.course || '',
        category: templateEntry?.category || 'GM',
        cutoff_rank: templateEntry?.cutoff_rank?.toString() || '',
    })
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false)
    const [pendingDuplicate, setPendingDuplicate] = useState<AdminCutoffEntry | null>(null)

    const institutes = useMemo(() => AdminCutoffService.getUniqueInstitutes(), [])
    const categories = useMemo(() => AdminCutoffService.getUniqueCategories(), [])
    const courses = useMemo(() => AdminCutoffService.getUniqueCourses(), [])
    const [instSearch, setInstSearch] = useState('')
    const [courseSearch, setCourseSearch] = useState('')

    const filteredInstitutes = useMemo(() => {
        if (!instSearch) return institutes.slice(0, 50)
        const q = instSearch.toLowerCase()
        return institutes.filter(i => i.code.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)).slice(0, 50)
    }, [institutes, instSearch])

    const filteredCourses = useMemo(() => {
        if (!courseSearch) return courses.slice(0, 50)
        const q = courseSearch.toLowerCase()
        return courses.filter(c => c.toLowerCase().includes(q)).slice(0, 50)
    }, [courses, courseSearch])

    // ─── Live duplicate detection ───────────────────────────────
    const liveDuplicate = useMemo(() => {
        if (!form.year || !form.round || !form.institute_code || !form.course || !form.category) return null
        return AdminCutoffService.checkDuplicate({
            year: form.year,
            round: form.round,
            institute_code: form.institute_code.trim().toUpperCase(),
            course: form.course.trim().toUpperCase(),
            category: form.category.trim().toUpperCase(),
        })
    }, [form.year, form.round, form.institute_code, form.course, form.category])

    // ─── Comprehensive validation ───────────────────────────────
    const validate = (): boolean => {
        const errors: FieldErrors = {}
        let hasError = false

        // Year
        if (!form.year.trim()) { errors.year = 'Year is required'; hasError = true }

        // Round
        if (!form.round.trim()) { errors.round = 'Round is required'; hasError = true }

        // Institute code
        const instCode = form.institute_code.trim()
        if (!instCode) {
            errors.institute_code = 'Institute code is required'; hasError = true
        } else if (!/^E\d{1,4}$/i.test(instCode) && !/^[A-Z]{1,5}\d{0,5}$/i.test(instCode)) {
            errors.institute_code = 'Invalid format — expected pattern like E001, E123, etc.'
            hasError = true
        } else {
            // Check if institute code exists in the database
            const codeExists = institutes.some(i => i.code === instCode.toUpperCase())
            if (!codeExists) {
                // Soft warning, not a blocking error — appended as a note
                errors.institute_code = `⚠ "${instCode}" is a new code not in existing data — double check`
                // Don't set hasError, this is a warning
            }
        }

        // Course
        const courseVal = form.course.trim()
        if (!courseVal) {
            errors.course = 'Course code is required'; hasError = true
        } else if (courseVal.length < 2) {
            errors.course = 'Course code seems too short — double check'; hasError = true
        } else {
            const courseExists = courses.some(c => c.toUpperCase() === courseVal.toUpperCase())
            if (!courseExists) {
                errors.course = `⚠ "${courseVal}" is a new course not in existing data — double check`
            }
        }

        // Category
        if (!form.category.trim()) { errors.category = 'Category is required'; hasError = true }

        // Cutoff rank
        const rankStr = form.cutoff_rank.trim()
        if (!rankStr) {
            errors.cutoff_rank = 'Cutoff rank is required'; hasError = true
        } else {
            const rank = parseInt(rankStr)
            if (isNaN(rank)) {
                errors.cutoff_rank = 'Must be a valid number'; hasError = true
            } else if (rank <= 0) {
                errors.cutoff_rank = 'Rank must be a positive number (≥ 1)'; hasError = true
            } else if (rank > 300000) {
                errors.cutoff_rank = `⚠ Rank ${rank.toLocaleString()} is unusually high — are you sure?`
                // Soft warning
            } else if (liveDuplicate && liveDuplicate.cutoff_rank === rank) {
                errors.cutoff_rank = `⚠ Same rank as existing entry (${rank.toLocaleString()}) — no change needed`
            }
        }

        setFieldErrors(errors)
        return !hasError
    }

    // ─── Save logic ─────────────────────────────────────────────
    const handleSave = () => {
        if (!validate()) {
            toast({ title: "Fix Errors", description: "Please fix the highlighted fields", variant: "destructive" })
            return
        }

        const rank = parseInt(form.cutoff_rank.trim())

        // If duplicate exists, show confirmation dialog first
        if (liveDuplicate) {
            setPendingDuplicate(liveDuplicate)
            setShowOverwriteConfirm(true)
            return
        }

        // No duplicate — save directly
        doSave(rank, false)
    }

    const handleConfirmOverwrite = () => {
        const rank = parseInt(form.cutoff_rank.trim())
        setShowOverwriteConfirm(false)
        setPendingDuplicate(null)
        doSave(rank, true)
    }

    const doSave = (rank: number, isOverwrite: boolean) => {
        const result = AdminCutoffService.addEntry({
            year: form.year.trim(),
            round: form.round.trim(),
            institute_code: form.institute_code.trim().toUpperCase(),
            institute: form.institute.trim(),
            course: form.course.trim().toUpperCase(),
            category: form.category.trim().toUpperCase(),
            cutoff_rank: rank,
        } as any)

        if (isOverwrite && pendingDuplicate) {
            const oldRank = pendingDuplicate.cutoff_rank
            const change = rank - oldRank
            const changeText = change > 0 ? `+${change.toLocaleString()}` : change.toLocaleString()
            toast({
                title: "✅ Entry Overwritten",
                description: `${form.institute_code} / ${form.course} / ${form.category} — Rank: ${oldRank.toLocaleString()} → ${rank.toLocaleString()} (${changeText})`,
            })
        } else {
            toast({
                title: "✅ Entry Added",
                description: `Added rank ${rank.toLocaleString()} for ${form.institute_code} / ${form.course} / ${form.category} (${form.year} ${form.round})`,
            })
        }

        onAdded()
        setFieldErrors({})

        if (batchMode) {
            setForm(prev => ({ ...prev, cutoff_rank: '' }))
        } else {
            onClose()
        }
    }

    // ─── Field error display helper ──────────────────────────────
    const FieldError = ({ field }: { field: keyof FieldErrors }) => {
        const msg = fieldErrors[field]
        if (!msg) return null
        const isWarning = msg.startsWith('⚠')
        return (
            <p className={`text-xs mt-1 flex items-center gap-1 ${isWarning ? 'text-amber-400' : 'text-red-400'}`}>
                <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                <span>{msg}</span>
            </p>
        )
    }

    return (
        <div className="space-y-4">
            {/* Batch mode toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div>
                    <Label className="text-sm font-medium">Batch Entry Mode</Label>
                    <p className="text-xs text-muted-foreground">Keep form open after saving — only rank resets</p>
                </div>
                <Switch checked={batchMode} onCheckedChange={setBatchMode} />
            </div>

            {/* ─── LIVE DUPLICATE WARNING ───────────────────────────── */}
            {liveDuplicate && (
                <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/[0.07] p-4 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0" />
                        <span className="font-semibold text-amber-300 text-sm">Duplicate Entry Found</span>
                    </div>
                    <p className="text-xs text-amber-200/80">
                        An entry with this exact combination already exists in the database. Saving will <strong>overwrite</strong> the existing rank.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                        <div className="rounded-lg bg-white/5 p-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Institute</p>
                            <p className="text-sm font-mono text-indigo-400">{liveDuplicate.institute_code}</p>
                            <p className="text-xs text-muted-foreground truncate">{(liveDuplicate as any).institute || liveDuplicate.college_name || '—'}</p>
                        </div>
                        <div className="rounded-lg bg-white/5 p-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Course / Category</p>
                            <p className="text-sm font-mono">{liveDuplicate.course}</p>
                            <Badge className={`${getCategoryColor(liveDuplicate.category)} text-[10px] mt-0.5`}>{liveDuplicate.category}</Badge>
                        </div>
                        <div className="rounded-lg bg-white/5 p-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Year / Round</p>
                            <p className="text-sm">{liveDuplicate.year} <Badge className={`${getRoundColor(liveDuplicate.round)} text-[10px] ml-1`}>{liveDuplicate.round}</Badge></p>
                        </div>
                        <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 sm:col-span-3">
                            <p className="text-[10px] text-amber-400 uppercase tracking-wider">Current Rank in Database</p>
                            <p className="text-xl font-bold font-mono text-amber-300">{liveDuplicate.cutoff_rank?.toLocaleString()}</p>
                            {liveDuplicate._modified_by && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    Last modified by admin on {liveDuplicate._modified_at ? new Date(liveDuplicate._modified_at).toLocaleString() : 'unknown'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Year */}
                <div className="space-y-2">
                    <Label>Year *</Label>
                    <Select value={form.year} onValueChange={v => { setForm(p => ({ ...p, year: v })); setFieldErrors(e => ({ ...e, year: undefined })) }}>
                        <SelectTrigger className={`bg-white/5 border-white/10 ${fieldErrors.year && !fieldErrors.year.startsWith('⚠') ? 'border-red-500/50' : ''}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {['2025', '2024', '2023', '2022', '2021'].map(y => (
                                <SelectItem key={y} value={y}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FieldError field="year" />
                </div>

                {/* Round */}
                <div className="space-y-2">
                    <Label>Round *</Label>
                    <Select value={form.round} onValueChange={v => { setForm(p => ({ ...p, round: v })); setFieldErrors(e => ({ ...e, round: undefined })) }}>
                        <SelectTrigger className={`bg-white/5 border-white/10 ${fieldErrors.round && !fieldErrors.round.startsWith('⚠') ? 'border-red-500/50' : ''}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {['MOCK', 'R1', 'R2', 'R3'].map(r => (
                                <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FieldError field="round" />
                </div>

                {/* Institute Code */}
                <div className="space-y-2">
                    <Label>Institute Code *</Label>
                    <Input
                        placeholder="E001"
                        value={form.institute_code}
                        onChange={e => {
                            const v = e.target.value.toUpperCase()
                            setForm(p => ({ ...p, institute_code: v }))
                            setInstSearch(v)
                            setFieldErrors(er => ({ ...er, institute_code: undefined }))
                            // Auto-fill institute name
                            const match = institutes.find(i => i.code === v)
                            if (match) setForm(p => ({ ...p, institute_code: v, institute: match.name }))
                        }}
                        className={`bg-white/5 border-white/10 font-mono ${fieldErrors.institute_code && !fieldErrors.institute_code.startsWith('⚠') ? 'border-red-500/50' : ''}`}
                    />
                    <FieldError field="institute_code" />
                    {instSearch && filteredInstitutes.length > 0 && form.institute_code.length >= 1 && (
                        <div className="max-h-32 overflow-y-auto rounded-lg border border-white/10 bg-background/95 backdrop-blur text-xs">
                            {filteredInstitutes.slice(0, 8).map(inst => (
                                <button
                                    key={inst.code}
                                    className="w-full text-left px-3 py-1.5 hover:bg-white/5 transition-colors"
                                    onClick={() => {
                                        setForm(p => ({ ...p, institute_code: inst.code, institute: inst.name }))
                                        setInstSearch('')
                                        setFieldErrors(er => ({ ...er, institute_code: undefined }))
                                    }}
                                >
                                    <span className="font-mono text-indigo-400">{inst.code}</span>
                                    <span className="text-muted-foreground ml-2">{inst.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Institute Name */}
                <div className="space-y-2">
                    <Label>Institute Name</Label>
                    <Input
                        placeholder="Auto-filled from code"
                        value={form.institute}
                        onChange={e => setForm(p => ({ ...p, institute: e.target.value }))}
                        className="bg-white/5 border-white/10"
                    />
                </div>

                {/* Course */}
                <div className="space-y-2">
                    <Label>Course Code *</Label>
                    <Input
                        placeholder="CS, EC, ME..."
                        value={form.course}
                        onChange={e => {
                            const v = e.target.value.toUpperCase()
                            setForm(p => ({ ...p, course: v }))
                            setCourseSearch(v)
                            setFieldErrors(er => ({ ...er, course: undefined }))
                        }}
                        className={`bg-white/5 border-white/10 font-mono ${fieldErrors.course && !fieldErrors.course.startsWith('⚠') ? 'border-red-500/50' : ''}`}
                    />
                    <FieldError field="course" />
                    {courseSearch && filteredCourses.length > 0 && form.course.length >= 1 && (
                        <div className="max-h-32 overflow-y-auto rounded-lg border border-white/10 bg-background/95 backdrop-blur text-xs">
                            {filteredCourses.slice(0, 8).map(c => (
                                <button
                                    key={c}
                                    className="w-full text-left px-3 py-1.5 hover:bg-white/5 transition-colors font-mono"
                                    onClick={() => { setForm(p => ({ ...p, course: c })); setCourseSearch(''); setFieldErrors(er => ({ ...er, course: undefined })) }}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label>Category *</Label>
                    <Select value={form.category} onValueChange={v => { setForm(p => ({ ...p, category: v })); setFieldErrors(er => ({ ...er, category: undefined })) }}>
                        <SelectTrigger className={`bg-white/5 border-white/10 ${fieldErrors.category && !fieldErrors.category.startsWith('⚠') ? 'border-red-500/50' : ''}`}><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-64">
                            {categories.length > 0 ? categories.map(c => (
                                <SelectItem key={c} value={c}>
                                    <Badge className={`${getCategoryColor(c)} text-xs`}>{c}</Badge>
                                </SelectItem>
                            )) : (
                                ['GM', 'GMK', 'GMR', 'SC', 'SCK', 'SCR', 'ST', 'STK', 'STR', '1G', '1GK', '1GR', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR'].map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    <FieldError field="category" />
                </div>

                {/* Cutoff Rank */}
                <div className="space-y-2 sm:col-span-2">
                    <Label>Cutoff Rank *</Label>
                    <Input
                        type="number"
                        placeholder="Enter cutoff rank..."
                        value={form.cutoff_rank}
                        onChange={e => { setForm(p => ({ ...p, cutoff_rank: e.target.value })); setFieldErrors(er => ({ ...er, cutoff_rank: undefined })) }}
                        className={`bg-white/5 border-white/10 font-mono text-lg ${fieldErrors.cutoff_rank && !fieldErrors.cutoff_rank.startsWith('⚠') ? 'border-red-500/50' : ''}`}
                        min={1}
                        autoFocus
                    />
                    <FieldError field="cutoff_rank" />
                    {/* Quick rank comparison when duplicate exists */}
                    {liveDuplicate && form.cutoff_rank && parseInt(form.cutoff_rank) > 0 && parseInt(form.cutoff_rank) !== liveDuplicate.cutoff_rank && (
                        <p className="text-xs text-sky-400 flex items-center gap-1 mt-1">
                            <Edit3 className="h-3 w-3" />
                            Will change rank from <strong>{liveDuplicate.cutoff_rank.toLocaleString()}</strong> → <strong>{parseInt(form.cutoff_rank).toLocaleString()}</strong>
                            {' '}({parseInt(form.cutoff_rank) > liveDuplicate.cutoff_rank ? '+' : ''}{(parseInt(form.cutoff_rank) - liveDuplicate.cutoff_rank).toLocaleString()})
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onClose} className="border-white/10">
                    <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button onClick={handleSave} className={liveDuplicate
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                    : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                }>
                    <Save className="h-4 w-4 mr-1" /> {liveDuplicate ? (batchMode ? 'Overwrite & Continue' : 'Overwrite Entry') : (batchMode ? 'Save & Continue' : 'Save Entry')}
                </Button>
            </div>

            {/* ─── OVERWRITE CONFIRMATION DIALOG ─────────────────── */}
            <Dialog open={showOverwriteConfirm} onOpenChange={setShowOverwriteConfirm}>
                <DialogContent className="sm:max-w-lg glass-strong border-white/10">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-amber-400">
                            <AlertTriangle className="h-5 w-5" />
                            Confirm Overwrite
                        </DialogTitle>
                        <DialogDescription>
                            This entry already exists. Do you want to overwrite the existing rank?
                        </DialogDescription>
                    </DialogHeader>
                    {pendingDuplicate && (
                        <div className="space-y-3">
                            <div className="rounded-lg bg-white/5 p-3 text-sm">
                                <p className="text-muted-foreground text-xs mb-2">Entry location:</p>
                                <p><strong className="text-indigo-400">{pendingDuplicate.institute_code}</strong> — {(pendingDuplicate as any).institute || pendingDuplicate.college_name || 'Unknown'}</p>
                                <p className="text-muted-foreground mt-1">
                                    {pendingDuplicate.course} · {pendingDuplicate.category} · {pendingDuplicate.year} {pendingDuplicate.round}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.05] p-3 text-center">
                                    <p className="text-[10px] text-red-400 uppercase tracking-wider mb-1">Current Rank</p>
                                    <p className="text-2xl font-bold font-mono text-red-300">{pendingDuplicate.cutoff_rank?.toLocaleString()}</p>
                                </div>
                                <div className="rounded-lg border border-green-500/20 bg-green-500/[0.05] p-3 text-center">
                                    <p className="text-[10px] text-green-400 uppercase tracking-wider mb-1">New Rank</p>
                                    <p className="text-2xl font-bold font-mono text-green-300">{parseInt(form.cutoff_rank)?.toLocaleString()}</p>
                                </div>
                            </div>
                            {parseInt(form.cutoff_rank) === pendingDuplicate.cutoff_rank && (
                                <div className="rounded-lg border border-sky-500/20 bg-sky-500/[0.05] p-2 text-center">
                                    <p className="text-xs text-sky-400">⚠ Both ranks are identical — no actual change will occur</p>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowOverwriteConfirm(false)} className="border-white/10">Cancel</Button>
                        <Button onClick={handleConfirmOverwrite} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                            <Save className="h-4 w-4 mr-1" /> Yes, Overwrite
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

// ─── Inline Edit Cell ──────────────────────────────────────────
function EditableCell({ value, onSave, type = 'text', className = '' }: {
    value: string | number
    onSave: (val: string) => void
    type?: 'text' | 'number'
    className?: string
}) {
    const [editing, setEditing] = useState(false)
    const [editVal, setEditVal] = useState(String(value))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { if (editing) inputRef.current?.select() }, [editing])

    const save = () => {
        if (editVal !== String(value)) onSave(editVal)
        setEditing(false)
    }

    if (editing) {
        return (
            <Input
                ref={inputRef}
                type={type}
                value={editVal}
                onChange={e => setEditVal(e.target.value)}
                onBlur={save}
                onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false) }}
                className={`h-7 px-2 text-sm bg-white/5 border-indigo-500/50 ${className}`}
            />
        )
    }

    return (
        <span
            className={`cursor-pointer hover:bg-white/5 px-1.5 py-0.5 rounded transition-colors inline-block group ${className}`}
            onClick={() => { setEditVal(String(value)); setEditing(true) }}
            title="Click to edit"
        >
            {type === 'number' ? Number(value).toLocaleString() : value}
            <Edit3 className="h-3 w-3 ml-1 inline-block opacity-0 group-hover:opacity-50 transition-opacity" />
        </span>
    )
}

// ─── Main Admin Page ──────────────────────────────────────────
const AdminCutoffs = () => {
    const [authed, setAuthed] = useState(sessionStorage.getItem(AUTH_KEY) === "1")
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<AdminCutoffEntry[]>([])
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showImportDialog, setShowImportDialog] = useState(false)
    const [showResetDialog, setShowResetDialog] = useState(false)
    const [templateEntry, setTemplateEntry] = useState<AdminCutoffEntry | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTab, setSelectedTab] = useState("all")
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(50)
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
    const [sortField, setSortField] = useState<string>("institute_code")
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [csvText, setCsvText] = useState("")
    const [filterYear, setFilterYear] = useState("ALL")
    const [filterRound, setFilterRound] = useState("ALL")
    const [filterCategory, setFilterCategory] = useState("ALL")
    // Matrix view state
    const [matrixYear, setMatrixYear] = useState('2025')
    const [matrixRound, setMatrixRound] = useState('R1')
    const [matrixInstitute, setMatrixInstitute] = useState('')
    const [matrixInstSearch, setMatrixInstSearch] = useState('')
    const [matrixEditCell, setMatrixEditCell] = useState<{ course: string; category: string } | null>(null)
    const [matrixEditVal, setMatrixEditVal] = useState('')
    const [matrixEditCourse, setMatrixEditCourse] = useState<string | null>(null)
    const [matrixCourseVal, setMatrixCourseVal] = useState('')
    const matrixEditRef = useRef<HTMLInputElement>(null)
    const matrixCourseRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Stats
    const [stats, setStats] = useState({ base: 0, modified: 0, total: 0, deleted: 0, undoCount: 0 })

    const refreshData = useCallback(() => {
        const merged = AdminCutoffService.getMergedData()
        setData(merged)
        setStats({
            base: AdminCutoffService.getBaseCount(),
            modified: AdminCutoffService.getModifiedCount(),
            total: merged.length,
            deleted: AdminCutoffService.getDeletedCount(),
            undoCount: AdminCutoffService.getUndoCount(),
        })
    }, [])

    useEffect(() => {
        if (!authed) return
        const initAdmin = async () => {
            setLoading(true)
            await AdminCutoffService.init()
            refreshData()
            setLoading(false)
        }
        initAdmin()
    }, [authed, refreshData])

    // Filter & sort
    const filteredData = useMemo(() => {
        let result = data

        // Tab-based filtering
        if (selectedTab === 'changes') {
            result = AdminCutoffService.getAdminEntries()
        } else if (selectedTab === 'deleted') {
            result = AdminCutoffService.getDeletedEntries()
        }

        // Dropdown filters
        if (filterYear !== 'ALL') result = result.filter(e => e.year === filterYear)
        if (filterRound !== 'ALL') result = result.filter(e => e.round === filterRound)
        if (filterCategory !== 'ALL') result = result.filter(e => e.category === filterCategory)

        // Search
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(e =>
                e.institute_code?.toLowerCase().includes(q) ||
                (e as any).institute?.toLowerCase().includes(q) ||
                e.college_name?.toLowerCase().includes(q) ||
                e.course?.toLowerCase().includes(q) ||
                e.category?.toLowerCase().includes(q) ||
                String(e.cutoff_rank).includes(q)
            )
        }

        // Sort
        result = [...result].sort((a: any, b: any) => {
            let aVal = a[sortField] ?? ''
            let bVal = b[sortField] ?? ''
            if (sortField === 'cutoff_rank') {
                aVal = Number(aVal) || 0
                bVal = Number(bVal) || 0
            } else {
                aVal = String(aVal).toLowerCase()
                bVal = String(bVal).toLowerCase()
            }
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
            return 0
        })

        return result
    }, [data, selectedTab, searchQuery, filterYear, filterRound, filterCategory, sortField, sortDir])

    const totalPages = Math.ceil(filteredData.length / pageSize)
    const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize)

    // Unique values for filters
    const years = useMemo(() => AdminCutoffService.getUniqueYears(), [data])
    const rounds = useMemo(() => AdminCutoffService.getUniqueRounds(), [data])
    const categories = useMemo(() => AdminCutoffService.getUniqueCategories(), [data])

    // Handlers
    const handleSort = (field: string) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortField(field); setSortDir('asc') }
        setPage(1)
    }

    const handleInlineEdit = (key: string, field: string, value: string) => {
        const updates: any = {}
        if (field === 'cutoff_rank') updates[field] = parseInt(value) || 0
        else updates[field] = value
        AdminCutoffService.updateEntry(key, updates)
        refreshData()
        toast({ title: "Updated", description: `${field} updated to ${value}` })
    }

    const handleDelete = (keys: string[]) => {
        const count = AdminCutoffService.bulkDelete(keys)
        setSelectedKeys(new Set())
        refreshData()
        toast({ title: "Deleted", description: `${count} entries removed` })
    }

    const handleUndo = () => {
        const op = AdminCutoffService.undo()
        if (op) {
            refreshData()
            toast({ title: "Undone", description: `Reverted ${op.type} operation` })
        }
    }

    const handleExportCSV = () => {
        const csv = AdminCutoffService.exportAsCSV(filteredData.length < data.length ? filteredData : undefined)
        AdminCutoffService.downloadFile(csv, `kcet_cutoffs_admin_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv')
        toast({ title: "Exported", description: "CSV file downloaded" })
    }

    const handleExportJSON = () => {
        const json = AdminCutoffService.exportAsJSON()
        AdminCutoffService.downloadFile(json, `kcet_cutoffs_admin_${new Date().toISOString().slice(0, 10)}.json`)
        toast({ title: "Exported", description: "JSON file downloaded" })
    }

    const handleExportChanges = () => {
        const json = AdminCutoffService.exportChangesOnly()
        AdminCutoffService.downloadFile(json, `kcet_admin_changes_${new Date().toISOString().slice(0, 10)}.json`)
        toast({ title: "Exported", description: "Admin changes exported" })
    }

    const handleImportCSV = () => {
        if (!csvText.trim()) {
            toast({ title: "Error", description: "No CSV content to import", variant: "destructive" })
            return
        }
        const result = AdminCutoffService.importFromCSV(csvText)
        refreshData()
        setShowImportDialog(false)
        setCsvText("")
        toast({
            title: "Import Complete",
            description: `${result.imported} entries imported. ${result.errors.length > 0 ? `${result.errors.length} errors.` : ''}`,
        })
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            setCsvText(event.target?.result as string)
        }
        reader.readAsText(file)
    }

    const handleReset = () => {
        AdminCutoffService.resetAllChanges()
        refreshData()
        setShowResetDialog(false)
        toast({ title: "Reset", description: "All admin changes have been cleared" })
    }

    const handleCopyAsTemplate = (entry: AdminCutoffEntry) => {
        setTemplateEntry(entry)
        setShowAddDialog(true)
    }

    const toggleSelectAll = () => {
        if (selectedKeys.size === pagedData.length) {
            setSelectedKeys(new Set())
        } else {
            setSelectedKeys(new Set(pagedData.map(e => e._key)))
        }
    }

    const toggleSelect = (key: string) => {
        const next = new Set(selectedKeys)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        setSelectedKeys(next)
    }

    if (!authed) return <AdminAuthGate onAuth={() => setAuthed(true)} />

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto" />
                    <p className="text-muted-foreground">Loading admin panel...</p>
                </div>
            </div>
        )
    }

    const SortableHeader = ({ field, children, className = '' }: { field: string; children: React.ReactNode; className?: string }) => (
        <TableHead className={`cursor-pointer select-none hover:text-foreground transition-colors ${className}`} onClick={() => handleSort(field)}>
            <div className="flex items-center gap-1">
                {children}
                <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-indigo-400' : 'opacity-30'}`} />
            </div>
        </TableHead>
    )

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 space-y-6 max-w-[1400px]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <ShieldCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
                            <p className="text-sm text-muted-foreground">Manage KCET cutoff data with zero data loss</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Button variant="outline" size="sm" onClick={handleUndo} disabled={stats.undoCount === 0} className="border-white/10">
                            <Undo2 className="h-4 w-4 mr-1" /> Undo ({stats.undoCount})
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowResetDialog(true)} className="border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/10">
                            <RotateCcw className="h-4 w-4 mr-1" /> Reset
                        </Button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                        { label: 'Total Entries', value: stats.total.toLocaleString(), icon: Database, color: 'text-blue-400' },
                        { label: 'Base Data', value: stats.base.toLocaleString(), icon: FileJson, color: 'text-green-400' },
                        { label: 'Admin Modified', value: stats.modified.toString(), icon: Edit3, color: 'text-amber-400' },
                        { label: 'Deleted', value: stats.deleted.toString(), icon: Trash2, color: 'text-red-400' },
                        { label: 'Filtered View', value: filteredData.length.toLocaleString(), icon: Filter, color: 'text-indigo-400' },
                    ].map((s, i) => (
                        <Card key={i} className="glass border-white/5">
                            <CardContent className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                    <s.icon className={`h-4 w-4 ${s.color}`} />
                                    <div>
                                        <p className="text-xs text-muted-foreground">{s.label}</p>
                                        <p className="text-lg font-bold">{s.value}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Action Bar */}
                <Card className="glass border-white/5">
                    <CardContent className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Button size="sm" onClick={() => { setTemplateEntry(null); setShowAddDialog(true) }} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                                <Plus className="h-4 w-4 mr-1" /> Add Entry
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)} className="border-white/10">
                                <Upload className="h-4 w-4 mr-1" /> Import CSV
                            </Button>
                            <div className="h-6 w-px bg-white/10 mx-1" />
                            <Button variant="outline" size="sm" onClick={handleExportCSV} className="border-white/10">
                                <FileSpreadsheet className="h-4 w-4 mr-1" /> Export CSV
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExportJSON} className="border-white/10">
                                <FileJson className="h-4 w-4 mr-1" /> Export JSON
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExportChanges} className="border-white/10">
                                <Download className="h-4 w-4 mr-1" /> Changes Only
                            </Button>
                            {selectedKeys.size > 0 && (
                                <>
                                    <div className="h-6 w-px bg-white/10 mx-1" />
                                    <Button variant="outline" size="sm" onClick={() => handleDelete([...selectedKeys])} className="border-red-500/20 text-red-400 hover:text-red-300">
                                        <Trash2 className="h-4 w-4 mr-1" /> Delete ({selectedKeys.size})
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs + Filters */}
                <div className="space-y-4">
                    <Tabs value={selectedTab} onValueChange={v => { setSelectedTab(v); setPage(1) }}>
                        <TabsList className="bg-white/5 border border-white/10">
                            <TabsTrigger value="all" className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-indigo-400">
                                All Data ({stats.total.toLocaleString()})
                            </TabsTrigger>
                            <TabsTrigger value="matrix" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
                                <Grid3X3 className="h-3.5 w-3.5 mr-1" /> Matrix View
                            </TabsTrigger>
                            <TabsTrigger value="changes" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
                                Admin Changes ({stats.modified})
                            </TabsTrigger>
                            <TabsTrigger value="deleted" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                                Deleted ({stats.deleted})
                            </TabsTrigger>
                            <TabsTrigger value="reviews" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                                <MessageSquare className="h-3.5 w-3.5 mr-1" /> Reviews
                            </TabsTrigger>
                            <TabsTrigger value="feedback" className="data-[state=active]:bg-pink-500/20 data-[state=active]:text-pink-400">
                                <LineChart className="h-3.5 w-3.5 mr-1" /> 2025 Feedback
                            </TabsTrigger>
                            <TabsTrigger value="requests" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
                                <Lightbulb className="h-3.5 w-3.5 mr-1" /> Features
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Filters Row */}
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[200px]">
                            <Label className="text-xs text-muted-foreground mb-1 block">Search</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Institute, course, category..."
                                    value={searchQuery}
                                    onChange={e => { setSearchQuery(e.target.value); setPage(1) }}
                                    className="pl-10 bg-white/5 border-white/10"
                                />
                            </div>
                        </div>
                        <div className="w-28">
                            <Label className="text-xs text-muted-foreground mb-1 block">Year</Label>
                            <Select value={filterYear} onValueChange={v => { setFilterYear(v); setPage(1) }}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Years</SelectItem>
                                    {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-28">
                            <Label className="text-xs text-muted-foreground mb-1 block">Round</Label>
                            <Select value={filterRound} onValueChange={v => { setFilterRound(v); setPage(1) }}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All Rounds</SelectItem>
                                    {rounds.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-28">
                            <Label className="text-xs text-muted-foreground mb-1 block">Category</Label>
                            <Select value={filterCategory} onValueChange={v => { setFilterCategory(v); setPage(1) }}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent className="max-h-64">
                                    <SelectItem value="ALL">All</SelectItem>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-24">
                            <Label className="text-xs text-muted-foreground mb-1 block">Per Page</Label>
                            <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setPage(1) }}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {[25, 50, 100, 200].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* ───────────── REVIEWS MODERATION TAB ───────────── */}
                {selectedTab === 'reviews' && <AdminReviewModeration />}

                {/* ───────────── 2025 FEEDBACK TAB ───────────── */}
                {selectedTab === 'feedback' && <AdminFeedbackView />}

                {/* ───────────── FEATURE REQUESTS TAB ───────────── */}
                {selectedTab === 'requests' && <AdminFeatureRequestsView />}

                {/* ───────────── MATRIX VIEW ───────────── */}
                {selectedTab === 'matrix' && (() => {
                    const ORDERED_CATS = ['1G', '1K', '1R', '2AG', '2AK', '2AR', '2BG', '2BK', '2BR', '3AG', '3AK', '3AR', '3BG', '3BK', '3BR', 'GM', 'GMK', 'GMR', 'SCG', 'SCK', 'SCR', 'STG', 'STK', 'STR']

                    // Get filtered data for selected year/round/institute
                    const matrixData = data.filter(e =>
                        e.year === matrixYear &&
                        e.round === matrixRound &&
                        e.institute_code === matrixInstitute
                    )

                    // Build lookup: course -> { category -> entry }
                    const courseMap = new Map<string, Map<string, AdminCutoffEntry>>()
                    for (const entry of matrixData) {
                        if (!courseMap.has(entry.course)) courseMap.set(entry.course, new Map())
                        courseMap.get(entry.course)!.set(entry.category, entry)
                    }
                    const sortedCourses = [...courseMap.keys()].sort()

                    // Only show categories that have data
                    const activeCats = ORDERED_CATS.filter(cat => {
                        for (const cMap of courseMap.values()) {
                            if (cMap.has(cat)) return true
                        }
                        return false
                    })
                    const displayCats = activeCats.length > 0 ? activeCats : ORDERED_CATS

                    // Institute name
                    const instObj = AdminCutoffService.getUniqueInstitutes().find(i => i.code === matrixInstitute)
                    const instName = instObj?.name || ''

                    // Filtered institutes for search
                    const matrixFilteredInstitutes = (() => {
                        const all = AdminCutoffService.getUniqueInstitutes()
                        if (!matrixInstSearch) return all.slice(0, 60)
                        const q = matrixInstSearch.toLowerCase()
                        return all.filter(i => i.code.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)).slice(0, 60)
                    })()

                    const handleMatrixCellSave = (course: string, category: string, value: string) => {
                        const rank = parseInt(value)
                        if (isNaN(rank) || rank <= 0) {
                            toast({ title: 'Invalid Rank', description: 'Enter a valid positive number', variant: 'destructive' })
                            setMatrixEditCell(null)
                            return
                        }
                        const existing = courseMap.get(course)?.get(category)
                        if (existing) {
                            AdminCutoffService.updateEntry(existing._key, { cutoff_rank: rank })
                            toast({ title: '✅ Updated', description: `${course} / ${category}: ${existing.cutoff_rank.toLocaleString()} → ${rank.toLocaleString()}` })
                        } else {
                            AdminCutoffService.addEntry({
                                year: matrixYear, round: matrixRound,
                                institute_code: matrixInstitute,
                                institute: instName,
                                course, category, cutoff_rank: rank,
                            } as any)
                            toast({ title: '✅ Added', description: `New: ${course} / ${category} = ${rank.toLocaleString()}` })
                        }
                        refreshData()
                        setMatrixEditCell(null)
                    }

                    const handleMatrixCourseRename = (oldCourse: string, newCourse: string) => {
                        const trimmed = newCourse.trim().toUpperCase()
                        if (!trimmed || trimmed === oldCourse) {
                            setMatrixEditCourse(null)
                            return
                        }
                        const entries = courseMap.get(oldCourse)
                        if (!entries) { setMatrixEditCourse(null); return }
                        let count = 0
                        for (const [, entry] of entries) {
                            AdminCutoffService.updateEntry(entry._key, { course: trimmed })
                            count++
                        }
                        refreshData()
                        setMatrixEditCourse(null)
                        toast({ title: '✅ Course Renamed', description: `"${oldCourse}" → "${trimmed}" (${count} entries updated)` })
                    }

                    return (
                        <Card className="glass border-white/5">
                            <CardContent className="p-4 space-y-4">
                                {/* Matrix Selectors */}
                                <div className="flex flex-wrap items-end gap-3">
                                    <div className="w-28">
                                        <Label className="text-xs text-muted-foreground mb-1 block">Year</Label>
                                        <Select value={matrixYear} onValueChange={setMatrixYear}>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="w-28">
                                        <Label className="text-xs text-muted-foreground mb-1 block">Round</Label>
                                        <Select value={matrixRound} onValueChange={setMatrixRound}>
                                            <SelectTrigger className="bg-white/5 border-white/10 h-10"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {rounds.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 min-w-[240px]">
                                        <Label className="text-xs text-muted-foreground mb-1 block">Institute</Label>
                                        <Input
                                            placeholder="Search by code or name..."
                                            value={matrixInstSearch || matrixInstitute}
                                            onChange={e => {
                                                setMatrixInstSearch(e.target.value.toUpperCase())
                                                const exact = AdminCutoffService.getUniqueInstitutes().find(i => i.code === e.target.value.toUpperCase())
                                                if (exact) { setMatrixInstitute(exact.code); setMatrixInstSearch('') }
                                            }}
                                            onFocus={() => setMatrixInstSearch(matrixInstitute || '')}
                                            className="bg-white/5 border-white/10 font-mono h-10"
                                        />
                                        {matrixInstSearch && matrixFilteredInstitutes.length > 0 && (
                                            <div className="absolute z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-background/95 backdrop-blur text-xs shadow-xl w-[400px]">
                                                {matrixFilteredInstitutes.map(inst => (
                                                    <button
                                                        key={inst.code}
                                                        className="w-full text-left px-3 py-2 hover:bg-white/5 transition-colors"
                                                        onClick={() => {
                                                            setMatrixInstitute(inst.code)
                                                            setMatrixInstSearch('')
                                                        }}
                                                    >
                                                        <span className="font-mono text-indigo-400">{inst.code}</span>
                                                        <span className="text-muted-foreground ml-2">{inst.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Institute Header */}
                                {matrixInstitute && (
                                    <div className="rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-mono text-indigo-400 font-bold text-lg">{matrixInstitute}</span>
                                                <span className="text-muted-foreground ml-3">{instName}</span>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={`${getRoundColor(matrixRound)} mr-2`}>{matrixRound}</Badge>
                                                <span className="text-sm font-mono text-muted-foreground">{matrixYear}</span>
                                                <span className="text-xs text-muted-foreground ml-3">{sortedCourses.length} courses · {matrixData.length} entries</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Matrix Table */}
                                {!matrixInstitute ? (
                                    <div className="text-center py-16 text-muted-foreground">
                                        <Grid3X3 className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">Select an institute to view its cutoff matrix</p>
                                        <p className="text-xs mt-1">Pick year, round, and type an institute code above</p>
                                    </div>
                                ) : sortedCourses.length === 0 ? (
                                    <div className="text-center py-16 text-muted-foreground">
                                        <Database className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                        <p className="font-medium">No data for {matrixInstitute} in {matrixYear} {matrixRound}</p>
                                        <p className="text-xs mt-1">Try a different year or round</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border border-white/5">
                                        <table className="w-full text-xs font-mono border-collapse">
                                            <thead>
                                                <tr className="bg-white/[0.03]">
                                                    <th className="text-left px-3 py-2 font-semibold text-muted-foreground border-b border-r border-white/5 sticky left-0 bg-background/95 backdrop-blur z-10 min-w-[180px]">
                                                        Course
                                                    </th>
                                                    {displayCats.map(cat => (
                                                        <th key={cat} className="px-1 py-2 text-center border-b border-white/5 min-w-[60px]">
                                                            <Badge className={`${getCategoryColor(cat)} text-[9px] px-1.5`}>{cat}</Badge>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedCourses.map((course, rowIdx) => (
                                                    <tr key={course} className={`${rowIdx % 2 === 0 ? 'bg-white/[0.01]' : ''} hover:bg-white/[0.04] transition-colors`}>
                                                        <td className="px-3 py-1.5 font-semibold text-sm border-r border-white/5 sticky left-0 bg-background/95 backdrop-blur z-10 whitespace-nowrap">
                                                            {matrixEditCourse === course ? (
                                                                <input
                                                                    ref={matrixCourseRef}
                                                                    type="text"
                                                                    value={matrixCourseVal}
                                                                    onChange={e => setMatrixCourseVal(e.target.value.toUpperCase())}
                                                                    onBlur={() => handleMatrixCourseRename(course, matrixCourseVal)}
                                                                    onKeyDown={e => {
                                                                        if (e.key === 'Enter') handleMatrixCourseRename(course, matrixCourseVal)
                                                                        if (e.key === 'Escape') setMatrixEditCourse(null)
                                                                    }}
                                                                    autoFocus
                                                                    className="w-full h-7 text-sm font-mono bg-indigo-500/10 border border-indigo-500/40 rounded px-2 outline-none focus:border-indigo-400"
                                                                />
                                                            ) : (
                                                                <span
                                                                    className="cursor-pointer hover:text-indigo-400 transition-colors group"
                                                                    onClick={() => { setMatrixEditCourse(course); setMatrixCourseVal(course) }}
                                                                    title="Click to rename course"
                                                                >
                                                                    {course}
                                                                    <Edit3 className="h-3 w-3 ml-1 inline-block opacity-0 group-hover:opacity-40 transition-opacity" />
                                                                </span>
                                                            )}
                                                        </td>
                                                        {displayCats.map(cat => {
                                                            const entry = courseMap.get(course)?.get(cat)
                                                            const isEditing = matrixEditCell?.course === course && matrixEditCell?.category === cat
                                                            const isModified = entry?._modified_by === 'admin'

                                                            if (isEditing) {
                                                                return (
                                                                    <td key={cat} className="px-0.5 py-0.5 text-center border-white/5">
                                                                        <input
                                                                            ref={matrixEditRef}
                                                                            type="number"
                                                                            value={matrixEditVal}
                                                                            onChange={e => setMatrixEditVal(e.target.value)}
                                                                            onBlur={() => {
                                                                                if (matrixEditVal.trim()) handleMatrixCellSave(course, cat, matrixEditVal)
                                                                                else setMatrixEditCell(null)
                                                                            }}
                                                                            onKeyDown={e => {
                                                                                if (e.key === 'Enter') { handleMatrixCellSave(course, cat, matrixEditVal); }
                                                                                if (e.key === 'Escape') setMatrixEditCell(null)
                                                                                if (e.key === 'Tab') {
                                                                                    e.preventDefault()
                                                                                    if (matrixEditVal.trim()) handleMatrixCellSave(course, cat, matrixEditVal)
                                                                                    // Move to next category
                                                                                    const idx = displayCats.indexOf(cat)
                                                                                    if (idx < displayCats.length - 1) {
                                                                                        const nextCat = displayCats[idx + 1]
                                                                                        const nextEntry = courseMap.get(course)?.get(nextCat)
                                                                                        setMatrixEditCell({ course, category: nextCat })
                                                                                        setMatrixEditVal(nextEntry ? String(nextEntry.cutoff_rank) : '')
                                                                                    } else if (rowIdx < sortedCourses.length - 1) {
                                                                                        // Move to first cat of next row
                                                                                        const nextCourse = sortedCourses[rowIdx + 1]
                                                                                        const nextEntry = courseMap.get(nextCourse)?.get(displayCats[0])
                                                                                        setMatrixEditCell({ course: nextCourse, category: displayCats[0] })
                                                                                        setMatrixEditVal(nextEntry ? String(nextEntry.cutoff_rank) : '')
                                                                                    }
                                                                                }
                                                                            }}
                                                                            autoFocus
                                                                            className="w-full h-7 text-center text-xs font-mono bg-indigo-500/10 border border-indigo-500/40 rounded px-1 outline-none focus:border-indigo-400"
                                                                        />
                                                                    </td>
                                                                )
                                                            }

                                                            return (
                                                                <td
                                                                    key={cat}
                                                                    className={`px-1 py-1.5 text-center cursor-pointer transition-colors border-white/5 ${entry
                                                                        ? isModified
                                                                            ? 'hover:bg-amber-500/10 text-foreground'
                                                                            : 'hover:bg-white/5 text-foreground'
                                                                        : 'hover:bg-indigo-500/10 text-muted-foreground/30'
                                                                        }`}
                                                                    title={entry
                                                                        ? `${course} / ${cat} = ${entry.cutoff_rank.toLocaleString()}${isModified ? ' (admin modified)' : ''} — click to edit`
                                                                        : `No data for ${course} / ${cat} — click to add`
                                                                    }
                                                                    onClick={() => {
                                                                        setMatrixEditCell({ course, category: cat })
                                                                        setMatrixEditVal(entry ? String(entry.cutoff_rank) : '')
                                                                    }}
                                                                >
                                                                    {entry ? (
                                                                        <span className={isModified ? 'text-amber-300 font-semibold' : ''}>
                                                                            {entry.cutoff_rank.toLocaleString()}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="opacity-20">--</span>
                                                                    )}
                                                                </td>
                                                            )
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Legend */}
                                {matrixInstitute && sortedCourses.length > 0 && (
                                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground pt-1">
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Base data</span>
                                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/15 border border-amber-500/30" /> Admin modified</span>
                                        <span className="flex items-center gap-1"><span className="opacity-30">--</span> No data (click to add)</span>
                                        <span className="ml-auto">Tab to move between cells · Enter to save · Esc to cancel</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )
                })()}

                {/* Data Table (hidden when matrix view or other special tabs are active) */}
                {['all', 'changes', 'deleted'].includes(selectedTab) && <Card className="glass border-white/5">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/5 hover:bg-transparent">
                                        <TableHead className="w-10">
                                            <Checkbox
                                                checked={pagedData.length > 0 && selectedKeys.size === pagedData.length}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <SortableHeader field="year">Year</SortableHeader>
                                        <SortableHeader field="round">Round</SortableHeader>
                                        <SortableHeader field="institute_code">Institute</SortableHeader>
                                        <SortableHeader field="course">Course</SortableHeader>
                                        <SortableHeader field="category">Category</SortableHeader>
                                        <SortableHeader field="cutoff_rank" className="text-right">Rank</SortableHeader>
                                        <TableHead className="w-24 text-center">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pagedData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                                                <Database className="h-8 w-8 mx-auto mb-2 opacity-30" />
                                                No entries found
                                            </TableCell>
                                        </TableRow>
                                    ) : pagedData.map(entry => {
                                        const isModified = !!entry._modified_by
                                        return (
                                            <TableRow
                                                key={entry._key}
                                                className={`border-white/5 transition-colors ${isModified ? 'bg-amber-500/[0.03]' : ''} ${selectedKeys.has(entry._key) ? 'bg-indigo-500/[0.05]' : ''}`}
                                            >
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedKeys.has(entry._key)}
                                                        onCheckedChange={() => toggleSelect(entry._key)}
                                                    />
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    <EditableCell value={entry.year} onSave={v => handleInlineEdit(entry._key, 'year', v)} />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${getRoundColor(entry.round)} text-xs font-mono`}>
                                                        {entry.round}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <EditableCell
                                                            value={entry.institute_code}
                                                            onSave={v => handleInlineEdit(entry._key, 'institute_code', v)}
                                                            className="font-mono text-sm text-indigo-400"
                                                        />
                                                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                            {(entry as any).institute || entry.college_name || ''}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <EditableCell
                                                        value={entry.course}
                                                        onSave={v => handleInlineEdit(entry._key, 'course', v)}
                                                        className="font-mono text-sm"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`${getCategoryColor(entry.category)} text-xs`}>
                                                        {entry.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <EditableCell
                                                        value={entry.cutoff_rank}
                                                        onSave={v => handleInlineEdit(entry._key, 'cutoff_rank', v)}
                                                        type="number"
                                                        className="font-mono font-semibold"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleCopyAsTemplate(entry)}
                                                            className="h-7 w-7 p-0 hover:bg-white/5"
                                                            title="Copy as template"
                                                        >
                                                            <Copy className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete([entry._key])}
                                                            className="h-7 w-7 p-0 hover:bg-red-500/10 hover:text-red-400"
                                                            title="Delete entry"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                        {isModified && (
                                                            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/20 text-[9px] px-1" title={`Modified: ${entry._modified_at}`}>
                                                                <Edit3 className="h-2.5 w-2.5" />
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
                                <p className="text-sm text-muted-foreground">
                                    Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, filteredData.length)} of {filteredData.length.toLocaleString()}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="border-white/10">
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-mono px-2">{page} / {totalPages}</span>
                                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="border-white/10">
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>}

                {/* Add Entry Dialog */}
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto glass-strong border-white/10">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5 text-indigo-400" />
                                {templateEntry ? 'Add Entry (from template)' : 'Add New Cutoff Entry'}
                            </DialogTitle>
                            <DialogDescription>
                                Fill in the cutoff details. All fields marked with * are required.
                            </DialogDescription>
                        </DialogHeader>
                        <AddEntryForm
                            onClose={() => setShowAddDialog(false)}
                            onAdded={refreshData}
                            templateEntry={templateEntry}
                        />
                    </DialogContent>
                </Dialog>

                {/* Import CSV Dialog */}
                <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                    <DialogContent className="sm:max-w-xl glass-strong border-white/10">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5 text-indigo-400" />
                                Import from CSV
                            </DialogTitle>
                            <DialogDescription>
                                Upload a CSV file or paste CSV content. Expected columns: year, round, institute_code, institute, course, category, cutoff_rank
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Upload CSV File</Label>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="bg-white/5 border-white/10 mt-1"
                                />
                            </div>
                            <div>
                                <Label>Or Paste CSV Content</Label>
                                <textarea
                                    value={csvText}
                                    onChange={e => setCsvText(e.target.value)}
                                    placeholder="year,round,institute_code,institute,course,category,cutoff_rank&#10;2025,R1,E001,RV College,CS,GM,5000"
                                    className="w-full h-40 mt-1 rounded-lg border border-white/10 bg-white/5 p-3 text-sm font-mono resize-none focus:border-indigo-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowImportDialog(false)} className="border-white/10">Cancel</Button>
                            <Button onClick={handleImportCSV} className="bg-gradient-to-r from-indigo-500 to-purple-600">
                                <Upload className="h-4 w-4 mr-1" /> Import
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reset Confirmation */}
                <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                    <DialogContent className="sm:max-w-md glass-strong border-white/10">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-red-400">
                                <AlertTriangle className="h-5 w-5" />
                                Reset All Changes
                            </DialogTitle>
                            <DialogDescription>
                                This will permanently remove all admin modifications and restore the original base data. This cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowResetDialog(false)} className="border-white/10">Cancel</Button>
                            <Button variant="destructive" onClick={handleReset}>
                                <RotateCcw className="h-4 w-4 mr-1" /> Reset Everything
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

export default AdminCutoffs

import React, { useState, useEffect, useMemo } from "react"
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
import { MathRenderer } from "@/components/MathRenderer"
import {
    Plus, Trash2, Search, Edit3, Save, X, Image as ImageIcon,
    Database, ClipboardPaste, Filter, CheckCircle2, AlertCircle,
    ArrowUpDown, ChevronDown, ChevronRight, ChevronLeft, Copy, Check, Sparkles,
    RefreshCw, Layers, BookOpen, Calendar, HelpCircle, FileJson,
    CheckSquare, Square, Eye, EyeOff, LayoutGrid, List, ArrowLeft,
    Flag, AlertTriangle
} from "lucide-react"
import { SUBJECTS, Subject, getChaptersForSubject } from "@/data/pyqQuestionBank"
import { ImageUploader } from "@/components/admin/ImageUploader"

export interface PYQStudentReport {
    id: string;
    question_id: string;
    subject?: string;
    chapter_number?: number;
    chapter?: string;
    year?: number;
    reason: string;
    reason_label: string;
    comment: string;
    reported_at?: string;
    created_at?: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface AdminPYQQuestion {
    id?: string;
    subject: Subject;
    chapter: string;
    chapter_number: number;
    question: string;
    options: string[];
    correct_answer: number;
    year: number;
    explanation?: string;
    needs_image?: boolean;
    image_url?: string;
    explanation_image_url?: string;
    option_images?: string[];
    created_at?: string;
    _qNum?: number;
}

const DEFAULT_NEW_QUESTION: AdminPYQQuestion = {
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
    explanation_image_url: "",
    option_images: ["", "", "", ""]
}

export function AdminPYQSection() {
    const [questions, setQuestions] = useState<AdminPYQQuestion[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterSubject, setFilterSubject] = useState<string>("all")
    const [filterChapter, setFilterChapter] = useState<string>("all")
    const [filterYear, setFilterYear] = useState<string>("all")
    const [filterNeedsImage, setFilterNeedsImage] = useState<string>("all") // "all" | "yes" | "no"
    const [sortBy, setSortBy] = useState<"created_desc" | "year_desc" | "year_asc" | "chapter_asc">("chapter_asc")
    const [viewMode, setViewMode] = useState<"compact" | "cards">("cards")
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [search, filterSubject, filterChapter, filterYear, filterNeedsImage, sortBy, pageSize])

    // Multi-select actions
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [isBatchDeleting, setIsBatchDeleting] = useState(false)

    // Modals
    const [showOCRModal, setShowOCRModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)  // Only used for "Add New Question"
    const [editingQ, setEditingQ] = useState<AdminPYQQuestion | null>(null)
    const [showMathLivePreview, setShowMathLivePreview] = useState(true)

    // Fullscreen edit mode (replaces question list with editor + navigation)
    const [fullscreenEditIndex, setFullscreenEditIndex] = useState<number | null>(null)

    // Quick single-field inline edit / quick question editor
    const [quickEditId, setQuickEditId] = useState<string | null>(null)

    // OCR Modal state
    const [ocrText, setOcrText] = useState("")
    const [ocrSubject, setOcrSubject] = useState<Subject>("Physics")
    const [ocrChapter, setOcrChapter] = useState("1")
    const [parsedPreview, setParsedPreview] = useState<AdminPYQQuestion[]>([])
    const [activeOcrTab, setActiveOcrTab] = useState<"paste" | "preview">("paste")

    // Student reported questions
    const [studentReports, setStudentReports] = useState<PYQStudentReport[]>([])
    const [loadingReports, setLoadingReports] = useState(false)

    const { toast } = useToast()

    // ─── Fetch questions (all pages) ───
    const fetchQuestions = async () => {
        setLoading(true)
        try {
            const allFetched: AdminPYQQuestion[] = []
            const pageSize = 1000
            let from = 0
            let hasMore = true

            while (hasMore) {
                const { data, error } = await supabase
                    .from('pyq_questions' as any)
                    .select('*')
                    .order('created_at', { ascending: false })
                    .range(from, from + pageSize - 1)

                if (error) throw error
                if (data && data.length > 0) {
                    allFetched.push(...(data as unknown as AdminPYQQuestion[]))
                    if (data.length < pageSize) {
                        hasMore = false
                    } else {
                        from += pageSize
                    }
                } else {
                    hasMore = false
                }
            }

            setQuestions(allFetched)
            fetchStudentReports()
        } catch (err: any) {
            toast({ title: "Error loading questions", description: err.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const fetchStudentReports = async () => {
        try {
            setLoadingReports(true)
            const { data, error } = await supabase
                .from('college_suggestions' as any)
                .select('*')
                .eq('college_code', 'PYQ_REPORT')
                .eq('status', 'pending')
                .order('created_at', { ascending: false })

            if (error) throw error
            if (data) {
                const mapped: PYQStudentReport[] = data.map((d: any) => ({
                    id: d.id,
                    question_id: d.suggested_data?.question_id || d.current_data?.question_id || "",
                    subject: d.suggested_data?.subject || d.current_data?.subject,
                    chapter_number: d.suggested_data?.chapter_number || d.current_data?.chapter_number,
                    chapter: d.suggested_data?.chapter || d.current_data?.chapter,
                    year: d.suggested_data?.year || d.current_data?.year,
                    reason: d.suggested_data?.reason || "other",
                    reason_label: d.suggested_data?.reason_label || "Discrepancy Reported",
                    comment: d.suggested_data?.comment || "",
                    reported_at: d.suggested_data?.reported_at || d.created_at,
                    created_at: d.created_at,
                    status: d.status
                }))
                setStudentReports(mapped)
            }
        } catch (err: any) {
            console.warn("Could not load student reports:", err.message)
        } finally {
            setLoadingReports(false)
        }
    }

    const markReportResolved = async (reportId: string) => {
        try {
            const { error } = await supabase
                .from('college_suggestions' as any)
                .update({ status: 'approved' })
                .eq('id', reportId)
            if (error) throw error
            toast({ title: "Report Resolved", description: "Student flag marked resolved." })
            setStudentReports(prev => prev.filter(r => r.id !== reportId))
        } catch (err: any) {
            toast({ title: "Failed to resolve report", description: err.message, variant: "destructive" })
        }
    }

    const markReportDismissed = async (reportId: string) => {
        try {
            const { error } = await supabase
                .from('college_suggestions' as any)
                .update({ status: 'rejected' })
                .eq('id', reportId)
            if (error) throw error
            toast({ title: "Report Dismissed", description: "Flag removed from pending list." })
            setStudentReports(prev => prev.filter(r => r.id !== reportId))
        } catch (err: any) {
            toast({ title: "Failed to dismiss report", description: err.message, variant: "destructive" })
        }
    }

    useEffect(() => {
        fetchQuestions()
        fetchStudentReports()
    }, [])

    const reportsByQuestionId = useMemo(() => {
        const map = new Map<string, PYQStudentReport[]>()
        studentReports.forEach(r => {
            if (r.question_id) {
                const list = map.get(r.question_id) || []
                list.push(r)
                map.set(r.question_id, list)
            }
        })
        return map
    }, [studentReports])

    // ─── Unique years list for filter ───
    const availableYears = useMemo(() => {
        const years = new Set<number>()
        questions.forEach(q => { if (q.year) years.add(q.year) })
        return Array.from(years).sort((a, b) => b - a)
    }, [questions])

    // ─── Diagram Anomaly Detector ───
    const DIAGRAM_KEYWORDS = /\b(figure|diagram|circuit|graph|shown below|in the adjacent|as shown|ray diagram|schematic)\b/i
    const isQuestionMissingDiagram = (q: AdminPYQQuestion) => {
        const hasImage = !!q.image_url && q.image_url.trim() !== ""
        return !hasImage && (!!q.needs_image || DIAGRAM_KEYWORDS.test(q.question || ""))
    }

    // ─── Stats summary ───
    const stats = useMemo(() => {
        const total = questions.length
        const physics = questions.filter(q => q.subject === "Physics").length
        const chemistry = questions.filter(q => q.subject === "Chemistry").length
        const math = questions.filter(q => q.subject === "Mathematics").length
        const needsImage = questions.filter(q => q.needs_image).length
        const missingDiagrams = questions.filter(isQuestionMissingDiagram).length
        const studentFlagged = studentReports.length
        return { total, physics, chemistry, math, needsImage, missingDiagrams, studentFlagged }
    }, [questions, studentReports])

    // ─── Filter & Sort ───
    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            // Search filter
            if (search.trim()) {
                const s = search.toLowerCase()
                const inQ = q.question?.toLowerCase().includes(s)
                const inCh = q.chapter?.toLowerCase().includes(s)
                const inYr = String(q.year || "").includes(s)
                const inExpl = q.explanation?.toLowerCase().includes(s)
                const inOpts = (q.options || []).some(o => o.toLowerCase().includes(s))
                if (!inQ && !inCh && !inYr && !inExpl && !inOpts) return false
            }

            // Subject filter
            if (filterSubject !== "all" && q.subject !== filterSubject) return false

            // Chapter filter
            if (filterChapter !== "all" && String(q.chapter_number) !== filterChapter) return false

            // Year filter
            if (filterYear !== "all" && String(q.year) !== filterYear) return false

            // Needs image / Student Flag filter
            if (filterNeedsImage === "flagged_by_students" && !reportsByQuestionId.has(q.id!)) return false
            if (filterNeedsImage === "missing_or_needed" && !isQuestionMissingDiagram(q)) return false
            if (filterNeedsImage === "has_image" && (!q.image_url || q.image_url.trim() === "")) return false
            if (filterNeedsImage === "yes" && !q.needs_image) return false
            if (filterNeedsImage === "no" && (q.needs_image || isQuestionMissingDiagram(q))) return false

            return true
        }).sort((a, b) => {
            if (sortBy === "year_desc") return (b.year || 0) - (a.year || 0)
            if (sortBy === "year_asc") return (a.year || 0) - (b.year || 0)
            if (sortBy === "chapter_asc") {
                const chDiff = (a.chapter_number || 0) - (b.chapter_number || 0)
                if (chDiff !== 0) return chDiff
                return (b.year || 0) - (a.year || 0)
            }
            // created_desc
            return (new Date(b.created_at || 0).getTime()) - (new Date(a.created_at || 0).getTime())
        })
    }, [questions, search, filterSubject, filterChapter, filterYear, filterNeedsImage, sortBy])

    // ─── Pagination computations ───
    const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / pageSize))
    const paginatedQuestions = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filteredQuestions.slice(start, start + pageSize)
    }, [filteredQuestions, currentPage, pageSize])

    // ─── Group current page by Chapter for structured view ───
    const groupedChapters = useMemo(() => {
        const groups: Record<string, { title: string; subject: string; chNum: number; items: AdminPYQQuestion[] }> = {}
        paginatedQuestions.forEach(q => {
            const key = `${q.subject || "Physics"}_${q.chapter_number || 0}`
            if (!groups[key]) {
                groups[key] = {
                    title: `CH ${q.chapter_number || 1}: ${q.chapter || "General"}`,
                    subject: q.subject || "Physics",
                    chNum: q.chapter_number || 1,
                    items: []
                }
            }
            groups[key].items.push(q)
        })
        return Object.values(groups).sort((a, b) => {
            if (a.subject !== b.subject) return a.subject.localeCompare(b.subject)
            return a.chNum - b.chNum
        })
    }, [paginatedQuestions])

    // ─── Selection handlers ───
    const handleToggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleSelectAllFiltered = () => {
        if (selectedIds.size === filteredQuestions.length && filteredQuestions.length > 0) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredQuestions.map(q => q.id!).filter(Boolean)))
        }
    }

    // ─── Single Delete ───
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return
        try {
            const { error } = await supabase.from('pyq_questions' as any).delete().eq('id', id)
            if (error) throw error
            toast({ title: "Question deleted" })
            setQuestions(prev => prev.filter(q => q.id !== id))
            setSelectedIds(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
            if (fullscreenEditIndex !== null) {
                exitFullscreenEdit()
            }
        } catch (err: any) {
            toast({ title: "Failed to delete", description: err.message, variant: "destructive" })
        }
    }

    // ─── Batch Delete ───
    const handleBatchDelete = async () => {
        if (selectedIds.size === 0) return
        if (!confirm(`Delete all ${selectedIds.size} selected questions? This cannot be undone.`)) return
        setIsBatchDeleting(true)
        try {
            const idList = Array.from(selectedIds)
            const { error } = await supabase.from('pyq_questions' as any).delete().in('id', idList)
            if (error) throw error
            toast({ title: `Deleted ${idList.length} questions` })
            setQuestions(prev => prev.filter(q => !selectedIds.has(q.id!)))
            setSelectedIds(new Set())
        } catch (err: any) {
            toast({ title: "Batch delete failed", description: err.message, variant: "destructive" })
        } finally {
            setIsBatchDeleting(false)
        }
    }

    // ─── Add / Edit Modal Actions ───
    const openNewQuestion = () => {
        const defaultSubject = filterSubject !== "all" ? (filterSubject as Subject) : "Physics"
        const defaultChNum = filterChapter !== "all" ? parseInt(filterChapter) : 1
        const chapters = getChaptersForSubject(defaultSubject)

        setEditingQ({
            ...DEFAULT_NEW_QUESTION,
            subject: defaultSubject,
            chapter_number: defaultChNum,
            chapter: chapters[defaultChNum] || "Units and Measurements",
            year: filterYear !== "all" ? parseInt(filterYear) : 2024
        })
        setShowEditModal(true)
    }

    const openEditQuestion = (q: AdminPYQQuestion) => {
        // Find index in filteredQuestions for prev/next navigation
        const idx = filteredQuestions.findIndex(fq => fq.id === q.id)
        setEditingQ({
            ...q,
            options: [...(q.options || ["", "", "", ""])],
            option_images: [...(q.option_images || ["", "", "", ""])]
        })
        setFullscreenEditIndex(idx !== -1 ? idx : 0)
    }

    const handleDuplicateQuestion = (q: AdminPYQQuestion) => {
        const { id, created_at, ...rest } = q
        setEditingQ({
            ...rest,
            question: rest.question + " (Copy)",
            options: [...(rest.options || ["", "", "", ""])],
            option_images: [...(rest.option_images || ["", "", "", ""])]
        })
        setShowEditModal(true)
    }

    const handleSaveEdit = async () => {
        if (!editingQ) return
        if (!editingQ.question?.trim()) {
            toast({ title: "Validation error", description: "Question text cannot be empty", variant: "destructive" })
            return
        }

        const isNewDraft = !editingQ.id || editingQ.id.startsWith("draft-new-")
        const { id, created_at, ...payload } = editingQ as any

        try {
            if (!isNewDraft) {
                const { error } = await supabase.from('pyq_questions' as any).update(payload).eq('id', id)
                if (error) throw error
                toast({ title: "Question updated successfully" })
                setQuestions(prev => prev.map(q => q.id === id ? { ...editingQ } : q))
            } else {
                const insertPayload = {
                    ...payload,
                    created_at: editingQ.created_at || new Date().toISOString()
                }
                const { data, error } = await supabase.from('pyq_questions' as any).insert([insertPayload]).select()
                if (error) throw error
                toast({ title: "Question inserted successfully in sequence!" })
                if (data && data[0]) {
                    const insertedQ = data[0] as unknown as AdminPYQQuestion
                    setQuestions(prev => prev.map(q => q.id === editingQ.id ? insertedQ : q))
                    setEditingQ(insertedQ)
                } else {
                    fetchQuestions()
                }
            }
            // Close dialog only (fullscreen stays open for continued editing)
            setShowEditModal(false)
        } catch (err: any) {
            toast({ title: "Save failed", description: err.message, variant: "destructive" })
        }
    }

    // ─── Fullscreen navigation helpers ───
    const navigateToQuestion = (index: number) => {
        if (index < 0 || index >= filteredQuestions.length) return
        const q = filteredQuestions[index]
        setEditingQ({
            ...q,
            options: [...(q.options || ["", "", "", ""])],
            option_images: [...(q.option_images || ["", "", "", ""])]
        })
        setFullscreenEditIndex(index)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const exitFullscreenEdit = () => {
        // Clean up unsaved empty drafts when exiting fullscreen
        setQuestions(prev => prev.filter(q => !q.id?.startsWith("draft-new-") || !!q.question?.trim()))
        setFullscreenEditIndex(null)
        setEditingQ(null)
    }

    // ─── Insert Question in the Middle ───
    const handleInsertQuestionAfter = (targetQ: AdminPYQQuestion, afterIndex?: number) => {
        const targetIdx = afterIndex !== undefined && afterIndex >= 0 
            ? afterIndex 
            : filteredQuestions.findIndex(q => q.id === targetQ.id)

        let insertCreatedAt: string = new Date().toISOString()
        const currentCreated = targetQ.created_at ? new Date(targetQ.created_at).getTime() : Date.now()
        
        const nextQ = targetIdx !== -1 && targetIdx < filteredQuestions.length - 1 
            ? filteredQuestions[targetIdx + 1] 
            : null
        
        if (nextQ && nextQ.created_at) {
            const nextCreated = new Date(nextQ.created_at).getTime()
            if (currentCreated !== nextCreated) {
                insertCreatedAt = new Date(Math.floor((currentCreated + nextCreated) / 2)).toISOString()
            } else {
                insertCreatedAt = new Date(currentCreated - 500).toISOString()
            }
        } else {
            insertCreatedAt = new Date(currentCreated - 1000).toISOString()
        }

        const draftQ: AdminPYQQuestion = {
            id: `draft-new-${Date.now()}`,
            subject: targetQ.subject,
            chapter: targetQ.chapter,
            chapter_number: targetQ.chapter_number,
            year: targetQ.year,
            question: "",
            options: ["", "", "", ""],
            correct_answer: 0,
            explanation: "",
            needs_image: false,
            image_url: "",
            option_images: ["", "", "", ""],
            created_at: insertCreatedAt
        }

        // Insert draft directly into questions array right after target question
        const qIndexInMain = questions.findIndex(q => q.id === targetQ.id)
        const insertPos = qIndexInMain !== -1 ? qIndexInMain + 1 : 0

        setQuestions(prev => {
            const clean = prev.filter(q => !q.id?.startsWith("draft-new-"))
            const next = [...clean]
            next.splice(insertPos, 0, draftQ)
            return next
        })

        setEditingQ(draftQ)
        const newFilteredIndex = targetIdx !== -1 ? targetIdx + 1 : 0
        setFullscreenEditIndex(newFilteredIndex)
        window.scrollTo({ top: 0, behavior: 'smooth' })
        toast({
            title: "Insert Mode Active",
            description: `Adding missed question after #${targetIdx + 1} (${targetQ.subject} CH ${targetQ.chapter_number}, KCET ${targetQ.year}). Fill details and click Save Changes.`
        })
    }

    // Keyboard shortcuts for fullscreen navigation (Alt+Left/Right, Ctrl+S, Esc)
    useEffect(() => {
        if (fullscreenEditIndex === null) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault()
                handleSaveEdit()
            } else if (e.altKey && e.key === 'ArrowLeft') {
                e.preventDefault()
                if (fullscreenEditIndex > 0) {
                    navigateToQuestion(fullscreenEditIndex - 1)
                }
            } else if (e.altKey && e.key === 'ArrowRight') {
                e.preventDefault()
                if (fullscreenEditIndex < filteredQuestions.length - 1) {
                    navigateToQuestion(fullscreenEditIndex + 1)
                }
            } else if (e.key === 'Escape') {
                const target = e.target as HTMLElement
                if (!target?.closest('[role="listbox"]') && !target?.closest('[role="dialog"]')) {
                    exitFullscreenEdit()
                }
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [fullscreenEditIndex, filteredQuestions, editingQ])

    // ─── Intelligent OCR & Text Parser ───
    const parseOCR = () => {
        if (!ocrText.trim()) return
        const lines = ocrText.split('\n')
        const questionsList: AdminPYQQuestion[] = []
        let currentQ: any = null
        const answersMap: Record<number, number> = {}
        const chapters = getChaptersForSubject(ocrSubject)

        const optToIndex = (opt: string) => ({ a: 0, b: 1, c: 2, d: 3 }[opt.toLowerCase()] ?? 0)

        // 1. Extract ANSWER KEY
        const ansKeyIdx = lines.findIndex(l => l.toUpperCase().includes("ANSWER KEY") || l.toUpperCase().includes("ANSWERS:"))
        if (ansKeyIdx !== -1) {
            const explStopIdx = lines.findIndex(l => l.toUpperCase().trim().startsWith("EXPLANATION"))
            const ansText = lines.slice(ansKeyIdx + 1, explStopIdx !== -1 ? explStopIdx : undefined).join(" ")
            for (const m of ansText.matchAll(/(\d+)[\.\s\:\-\)]+\s*(?:\()?([a-dA-D])(?:\))?/g)) {
                answersMap[parseInt(m[1])] = optToIndex(m[2])
            }
        }

        // 2. Extract EXPLANATIONS
        const explIdx = lines.findIndex(l => l.toUpperCase().trim().startsWith("EXPLANATION"))
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
            return upper.includes("ANSWER KEY") || upper.startsWith("EXPLANATION")
        })
        const rawQuestionLines = stopIdx !== -1 ? lines.slice(0, stopIdx) : lines

        // Pre-process concatenated columns
        const questionLines: string[] = []
        for (let line of rawQuestionLines) {
            const match = line.match(/^(.*?)[ \t]+(\d+)\.\s*$/)
            if (match) {
                if (match[1].trim() !== "") questionLines.push(match[1].trim())
                questionLines.push(match[2] + ".")
            } else {
                questionLines.push(line)
            }
        }

        const spilloverOptions: Record<number, string[]> = { 0: [], 1: [], 2: [], 3: [] }
        const spilloverYears: number[] = []
        let lastAppendedTo: 'Q' | 0 | 1 | 2 | 3 = 'Q'

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

            const qMatch = line.match(/^(\d+)\.\s*(.*)/)
            if (qMatch) {
                if (currentQ) questionsList.push(currentQ)
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

                const inlineOptions: { idx: number; text: string }[] = []
                const parts = qText.split(/\(([a-dA-D])\)/i)
                if (parts.length > 1) {
                    qText = parts[0].trim()
                    for (let p = 1; p < parts.length; p += 2) {
                        const optLetter = parts[p]
                        const optText = (parts[p + 1] || "").trim()
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

                for (let j = 0; j < 4; j++) {
                    if (spilloverOptions[j].length > 0) {
                        currentQ.options[j] = spilloverOptions[j].shift()!
                    }
                }

                if (currentQ.year === 2024 && spilloverYears.length > 0) {
                    currentQ.year = spilloverYears.shift()!
                }

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
                    const parsedYear = parseInt(yearOnly[1])
                    if (currentQ.year === 2024) currentQ.year = parsedYear
                    else spilloverYears.push(parsedYear)
                    continue
                }

                const yearMatches = [...line.matchAll(/\((20\d\d)\)/g)]
                if (yearMatches.length > 0) {
                    for (const ym of yearMatches) {
                        const parsedYear = parseInt(ym[1])
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
                        const text = (parts[p + 1] || "").trim()
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
        if (currentQ) questionsList.push(currentQ)

        questionsList.sort((a, b) => (a._qNum || 0) - (b._qNum || 0))
        setParsedPreview(questionsList)
        setActiveOcrTab("preview")
        toast({ title: `Parsed ${questionsList.length} Questions!`, description: "Review and edit questions below before saving." })
    }

    const saveParsedToDb = async () => {
        if (!parsedPreview.length) return
        setLoading(true)
        const toInsert = parsedPreview.map(q => {
            const { _qNum, ...rest } = q
            return rest
        })

        try {
            const { error } = await supabase.from('pyq_questions' as any).insert(toInsert)
            if (error) throw error
            toast({ title: "Import Successful!", description: `${toInsert.length} questions saved to database.` })
            setParsedPreview([])
            setOcrText("")
            setShowOCRModal(false)
            fetchQuestions()
        } catch (err: any) {
            toast({ title: "Error saving questions", description: err.message, variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    const exportParsedJSON = () => {
        const json = JSON.stringify(parsedPreview.map(q => { const { _qNum, ...r } = q; return r }), null, 2)
        const blob = new Blob([json], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `pyq_${ocrSubject}_ch${ocrChapter}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const updateParsedQ = (idx: number, field: string, value: any) => {
        const fresh = [...parsedPreview]
        if (field.startsWith("options.")) {
            const optIdx = parseInt(field.split(".")[1])
            fresh[idx].options[optIdx] = value
        } else {
            (fresh[idx] as any)[field] = value
        }
        setParsedPreview(fresh)
    }

    // Reset filters
    const resetFilters = () => {
        setSearch("")
        setFilterSubject("all")
        setFilterChapter("all")
        setFilterYear("all")
        setFilterNeedsImage("all")
    }

    return (
        <div className="space-y-6 pb-12">

            {/* ═══════════════════════════════════════════════════════════════════
                FULLSCREEN QUESTION EDITOR (shown when editing an existing question)
                ═══════════════════════════════════════════════════════════════════ */}
            {fullscreenEditIndex !== null && editingQ && (
                <div className="space-y-4">
                    {/* ─── Navigation Bar ─── */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exitFullscreenEdit}
                                className="h-9 px-3 border-white/10 rounded-xl text-xs text-muted-foreground hover:text-white hover:bg-white/5 flex items-center gap-1.5"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to Question List
                            </Button>

                            <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/5 h-9">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={fullscreenEditIndex === 0}
                                    onClick={() => navigateToQuestion(fullscreenEditIndex - 1)}
                                    className="h-full px-2.5 rounded-none border-r border-white/10 hover:bg-white/5 text-[11px] text-muted-foreground hover:text-white disabled:opacity-30 flex items-center justify-center font-bold"
                                    title="Previous Question (Alt+Left)"
                                >
                                    ◀ Prev
                                </Button>
                                <span className="text-[10px] text-muted-foreground px-2.5 font-bold font-mono select-none whitespace-nowrap shrink-0">
                                    {fullscreenEditIndex + 1} / {filteredQuestions.length}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    disabled={fullscreenEditIndex === filteredQuestions.length - 1}
                                    onClick={() => navigateToQuestion(fullscreenEditIndex + 1)}
                                    className="h-full px-2.5 rounded-none hover:bg-white/5 text-[11px] text-muted-foreground hover:text-white disabled:opacity-30 flex items-center justify-center font-bold"
                                    title="Next Question (Alt+Right)"
                                >
                                    Next ▶
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 justify-between sm:justify-start">
                            <Badge variant="outline" className="font-mono text-indigo-400 border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1.5 text-xs font-bold hidden md:inline-flex items-center gap-1.5">
                                Active: KCET {editingQ.year} • {editingQ.subject} (CH {editingQ.chapter_number})
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowMathLivePreview(!showMathLivePreview)}
                                className="h-9 px-3 rounded-xl border-white/10 text-xs text-indigo-300 hover:bg-indigo-500/10 flex items-center gap-1.5"
                            >
                                {showMathLivePreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                <span className="hidden sm:inline">{showMathLivePreview ? "Hide Preview" : "Show Preview"}</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleInsertQuestionAfter(editingQ, fullscreenEditIndex)}
                                className="h-9 px-3 rounded-xl border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hover:text-white flex items-center gap-1.5"
                                title="Insert a missed question directly after this one"
                            >
                                <Plus className="h-3.5 w-3.5 text-indigo-400" />
                                <span className="hidden sm:inline">Insert Question After</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(editingQ.id!)}
                                className="h-9 px-3 rounded-xl border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-1.5"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Delete</span>
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                size="sm"
                                className="h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
                            >
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </div>
                    </div>

                    {/* ─── Editor Title ─── */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                            <Edit3 className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                Edit Question
                                <Badge variant="outline" className="text-[10px] font-mono bg-white/5 border-white/10 text-slate-300">
                                    KCET {editingQ.year}
                                </Badge>
                                <Badge className="bg-indigo-500/10 text-indigo-400 border-0 text-[10px]">
                                    CH {editingQ.chapter_number}
                                </Badge>
                                {isQuestionMissingDiagram(editingQ) && (
                                    <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] flex items-center gap-1 font-semibold">
                                        <ImageIcon className="h-3 w-3" /> Missing Diagram
                                    </Badge>
                                )}
                                {reportsByQuestionId.has(editingQ.id!) && (
                                    <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] flex items-center gap-1 font-semibold animate-pulse">
                                        <Flag className="h-3 w-3" /> Flagged by Student
                                    </Badge>
                                )}
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Format with standard text or LaTeX math (e.g. $F = ma$ or $E = mc^2$). Click any option radio to select the correct answer.
                            </p>
                        </div>
                    </div>

                    {/* ─── Student Report Banner inside Editor if Flagged ─── */}
                    {reportsByQuestionId.has(editingQ.id!) && (
                        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 space-y-3 shadow-lg shadow-rose-950/50">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
                                        <Flag className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-rose-200">
                                            Student Discrepancy Reported ({reportsByQuestionId.get(editingQ.id!)?.length})
                                        </h3>
                                        <p className="text-[11px] text-rose-300/80">
                                            Students reported an issue while taking or reviewing tests on this question.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {reportsByQuestionId.get(editingQ.id!)?.map(rep => (
                                        <Button
                                            key={rep.id}
                                            size="sm"
                                            onClick={() => markReportResolved(rep.id)}
                                            className="h-7 text-xs bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-sm"
                                        >
                                            Mark Resolved
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                                {reportsByQuestionId.get(editingQ.id!)?.map(rep => (
                                    <div key={rep.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-rose-500/20 text-xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-rose-300 capitalize flex items-center gap-1.5">
                                                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                                                {rep.reason_label || rep.reason || "Discrepancy"}
                                            </span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(rep.created_at || rep.reported_at || Date.now()).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {rep.comment && (
                                            <p className="text-slate-300 italic pl-5">
                                                "{rep.comment}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ─── Editor Form ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        {/* Main Editor Column (Left 7-8 cols) */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-5 min-w-0">
                            {/* Card 1: Question Statement & Subject Details */}
                            <Card className="bg-slate-900/60 border-white/10 shadow-lg">
                                <CardHeader className="pb-3 border-b border-white/5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-indigo-400" />
                                            Question Statement & Metadata
                                        </CardTitle>
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant="outline" className="text-[10px] font-mono bg-white/5 border-white/10 text-slate-300">
                                                KCET {editingQ.year}
                                            </Badge>
                                            <Badge className="bg-indigo-500/10 text-indigo-400 border-0 text-[10px]">
                                                CH {editingQ.chapter_number}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-5 space-y-4">
                                    {/* Metadata Row: Subject, Chapter, Year */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-300 font-semibold">Subject</Label>
                                            <Select
                                                value={editingQ.subject || "Physics"}
                                                onValueChange={v => {
                                                    const sub = v as Subject
                                                    const chapters = getChaptersForSubject(sub)
                                                    setEditingQ({
                                                        ...editingQ,
                                                        subject: sub,
                                                        chapter_number: 1,
                                                        chapter: chapters[1] || ""
                                                    })
                                                }}
                                            >
                                                <SelectTrigger className="bg-white/5 border-white/10 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-300 font-semibold">Chapter</Label>
                                            <Select
                                                value={String(editingQ.chapter_number || 1)}
                                                onValueChange={v => {
                                                    const chNum = parseInt(v)
                                                    const chapters = getChaptersForSubject((editingQ.subject || "Physics") as Subject)
                                                    setEditingQ({
                                                        ...editingQ,
                                                        chapter_number: chNum,
                                                        chapter: chapters[chNum] || ""
                                                    })
                                                }}
                                            >
                                                <SelectTrigger className="bg-white/5 border-white/10 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-64">
                                                    {Object.entries(getChaptersForSubject((editingQ.subject || "Physics") as Subject)).map(([n, name]) => (
                                                        <SelectItem key={n} value={n}>CH {n}: {name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label className="text-xs text-slate-300 font-semibold">KCET Exam Year</Label>
                                            <Input
                                                type="number"
                                                value={editingQ.year || 2024}
                                                onChange={e => setEditingQ({ ...editingQ, year: parseInt(e.target.value) || 2024 })}
                                                className="bg-white/5 border-white/10 text-xs text-white"
                                                placeholder="2024"
                                            />
                                        </div>
                                    </div>

                                    {/* Question Text */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-xs text-slate-300 font-semibold">Question Statement (LaTeX supported)</Label>
                                            <span className="text-[11px] text-slate-500 font-mono">Wrap math in $...$</span>
                                        </div>
                                        <Textarea
                                            value={editingQ.question}
                                            onChange={e => setEditingQ({ ...editingQ, question: e.target.value })}
                                            className="min-h-[120px] bg-white/5 border-white/10 text-xs sm:text-sm font-mono text-white placeholder:text-slate-500 focus:border-indigo-500/50"
                                            placeholder="Enter question statement here. E.g. The dimensional formula for universal gravitational constant $G$ is..."
                                        />
                                        {showMathLivePreview && editingQ.question && (
                                            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 text-xs sm:text-sm text-slate-200 space-y-1">
                                                <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                                    <Sparkles className="h-3 w-3" /> Live LaTeX Render
                                                </div>
                                                <div className="overflow-x-auto pt-0.5">
                                                    <MathRenderer content={editingQ.question} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 2: 4 Options Grid */}
                            <Card className="bg-slate-900/60 border-white/10 shadow-lg">
                                <CardHeader className="pb-3 border-b border-white/5">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <div>
                                            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                                Answer Options
                                            </CardTitle>
                                            <CardDescription className="text-xs text-slate-400 mt-0.5">
                                                Select the radio button on the verified answer key.
                                            </CardDescription>
                                        </div>
                                        <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1">
                                            Verified Key: Option {String.fromCharCode(65 + (editingQ.correct_answer || 0))}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                        {[0, 1, 2, 3].map(i => {
                                            const isCorrect = editingQ.correct_answer === i
                                            return (
                                                <div
                                                    key={i}
                                                    className={`p-3.5 rounded-xl border transition-all ${
                                                        isCorrect
                                                            ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/30'
                                                            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingQ({ ...editingQ, correct_answer: i })}
                                                            className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                                isCorrect
                                                                    ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold'
                                                                    : 'border-white/30 hover:border-white/60'
                                                            }`}
                                                        >
                                                            {isCorrect && <Check className="h-3 w-3 stroke-[3]" />}
                                                        </button>
                                                        <span className="text-xs font-bold text-slate-200">
                                                            Option {String.fromCharCode(65 + i)}
                                                        </span>
                                                        {isCorrect && (
                                                            <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px] ml-auto">
                                                                Correct Answer
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <Textarea
                                                        value={editingQ.options?.[i] || ""}
                                                        onChange={e => {
                                                            const opts = [...(editingQ.options || ["", "", "", ""])]
                                                            opts[i] = e.target.value
                                                            setEditingQ({ ...editingQ, options: opts })
                                                        }}
                                                        placeholder={`Option ${String.fromCharCode(65 + i)} text / LaTeX`}
                                                        className="bg-white/5 border-white/10 text-xs min-h-[55px] font-mono focus:border-indigo-500/50"
                                                    />

                                                    {/* Distinct, sleek LaTeX preview strip */}
                                                    {showMathLivePreview && editingQ.options?.[i] && (
                                                        <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 flex items-center gap-1.5 overflow-hidden">
                                                            <span className="text-[9px] uppercase font-bold text-indigo-400 font-mono shrink-0 select-none">LaTeX:</span>
                                                            <div className="overflow-x-auto min-w-0">
                                                                <MathRenderer content={editingQ.options[i]} inline />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Option Image Uploader */}
                                                    <div className="mt-2.5 pt-2 border-t border-white/5">
                                                        <ImageUploader
                                                            value={editingQ.option_images?.[i] || ""}
                                                            onChange={url => {
                                                                const imgs = [...(editingQ.option_images || ["", "", "", ""])]
                                                                imgs[i] = url
                                                                setEditingQ({ ...editingQ, option_images: imgs })
                                                            }}
                                                            compact
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Sidebar Column (Right 4-5 cols) */}
                        <div className="lg:col-span-5 xl:col-span-4 space-y-5 min-w-0">
                            {/* Card 3: Question Graphic / Diagram */}
                            <Card className="bg-slate-900/60 border-white/10 shadow-lg">
                                <CardHeader className="pb-3 border-b border-white/5">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-amber-400" />
                                            Question Graphic / Diagram
                                        </CardTitle>
                                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-amber-300">
                                            <Checkbox
                                                checked={editingQ.needs_image}
                                                onCheckedChange={c => setEditingQ({ ...editingQ, needs_image: !!c })}
                                                className="border-white/30"
                                            />
                                            <span className="text-[11px] font-medium">Needs Diagram</span>
                                        </label>
                                    </div>
                                    <CardDescription className="text-[11px] text-slate-400 mt-0.5">
                                        Attach circuit diagram, graph, or optics ray diagram.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <ImageUploader
                                        value={editingQ.image_url || ""}
                                        onChange={url => setEditingQ({
                                            ...editingQ,
                                            image_url: url,
                                            needs_image: !!url ? false : editingQ.needs_image
                                        })}
                                        previewHeight="max-h-48"
                                    />
                                </CardContent>
                            </Card>

                            {/* Card 4: Explanation & Solution */}
                            <Card className="bg-slate-900/60 border-white/10 shadow-lg">
                                <CardHeader className="pb-3 border-b border-white/5">
                                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-purple-400" />
                                        Explanation & Solution (Optional)
                                    </CardTitle>
                                    <CardDescription className="text-[11px] text-slate-400 mt-0.5">
                                        Step-by-step mathematical derivation or reasoning.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <Textarea
                                        value={editingQ.explanation || ""}
                                        onChange={e => setEditingQ({ ...editingQ, explanation: e.target.value })}
                                        className="min-h-[90px] bg-white/5 border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:border-indigo-500/50"
                                        placeholder="Provide step-by-step derivation or reasoning..."
                                    />
                                    {showMathLivePreview && editingQ.explanation && (
                                        <div className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 text-xs text-slate-300 overflow-x-auto">
                                            <div className="text-[10px] text-purple-400 font-semibold mb-1">Preview:</div>
                                            <MathRenderer content={editingQ.explanation} />
                                        </div>
                                    )}

                                    <div className="pt-2 border-t border-white/5">
                                        <Label className="text-[11px] text-slate-400 font-semibold mb-1.5 block">
                                            Solution Diagram / Working (Optional)
                                        </Label>
                                        <ImageUploader
                                            value={editingQ.explanation_image_url || ""}
                                            onChange={url => {
                                                const cleanUrl = url.trim()
                                                let updatedExpl = editingQ.explanation || ""
                                                if (!cleanUrl) {
                                                    updatedExpl = updatedExpl.replace(/\n*!\[Solution Diagram\]\([^\)]+\)/g, "").trim()
                                                } else if (!updatedExpl.includes(cleanUrl)) {
                                                    updatedExpl = updatedExpl ? `${updatedExpl}\n\n![Solution Diagram](${cleanUrl})` : `![Solution Diagram](${cleanUrl})`
                                                }
                                                setEditingQ({
                                                    ...editingQ,
                                                    explanation: updatedExpl,
                                                    explanation_image_url: cleanUrl
                                                })
                                            }}
                                            previewHeight="max-h-40"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card 5: Navigation & Quick Actions */}
                            <Card className="bg-slate-900/60 border-white/10 shadow-lg">
                                <CardHeader className="pb-2.5 border-b border-white/5">
                                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-indigo-400" />
                                        Navigation & Quick Actions
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={fullscreenEditIndex === 0}
                                            onClick={() => navigateToQuestion(fullscreenEditIndex - 1)}
                                            className="border-white/10 text-xs text-slate-300 h-8 justify-center"
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev (Alt+←)
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={fullscreenEditIndex >= filteredQuestions.length - 1}
                                            onClick={() => navigateToQuestion(fullscreenEditIndex + 1)}
                                            className="border-white/10 text-xs text-slate-300 h-8 justify-center"
                                        >
                                            Next (Alt+→) <ChevronRight className="h-3.5 w-3.5 ml-1" />
                                        </Button>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleInsertQuestionAfter(editingQ, fullscreenEditIndex)}
                                        className="w-full border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold text-xs h-8 justify-center"
                                    >
                                        <Plus className="h-3.5 w-3.5 mr-1.5 text-indigo-400" /> Insert Question After This
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            handleDuplicateQuestion(editingQ)
                                            exitFullscreenEdit()
                                        }}
                                        className="w-full border-white/10 text-xs text-slate-300 h-8 justify-center"
                                    >
                                        <Copy className="h-3.5 w-3.5 mr-1.5" /> Duplicate as Template
                                    </Button>

                                    {/* Jump to specific question */}
                                    <div className="pt-2 border-t border-white/5 space-y-1">
                                        <Label className="text-[11px] text-slate-400 font-medium">Jump Directly to Question #</Label>
                                        <div className="flex items-center gap-1.5">
                                            <Input
                                                type="number"
                                                min={1}
                                                max={filteredQuestions.length}
                                                placeholder={`1 - ${filteredQuestions.length}`}
                                                className="h-8 text-xs bg-white/5 border-white/10 text-white"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const val = parseInt((e.target as HTMLInputElement).value)
                                                        if (!isNaN(val) && val >= 1 && val <= filteredQuestions.length) {
                                                            navigateToQuestion(val - 1)
                                                        }
                                                    }
                                                }}
                                            />
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="h-8 text-xs px-3 shrink-0"
                                                onClick={(e) => {
                                                    const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                                                    const val = parseInt(input?.value)
                                                    if (!isNaN(val) && val >= 1 && val <= filteredQuestions.length) {
                                                        navigateToQuestion(val - 1)
                                                    }
                                                }}
                                            >
                                                Jump
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-white/5 text-[10px] text-slate-500 space-y-0.5 font-mono">
                                        <div><kbd className="bg-white/10 px-1 py-0.5 rounded text-[9px] text-slate-300">Ctrl+S</kbd> Save changes</div>
                                        <div><kbd className="bg-white/10 px-1 py-0.5 rounded text-[9px] text-slate-300">Alt+← / →</kbd> Prev / Next</div>
                                        <div><kbd className="bg-white/10 px-1 py-0.5 rounded text-[9px] text-slate-300">Esc</kbd> Back to question list</div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* ─── Bottom Navigation Bar ─── */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 sticky bottom-4 z-20 shadow-2xl">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={exitFullscreenEdit}
                                className="h-9 px-3 border-white/10 rounded-xl text-xs text-muted-foreground hover:text-white"
                            >
                                <ArrowLeft className="h-3.5 w-3.5 mr-1.5" /> Back to List
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={fullscreenEditIndex === 0}
                                onClick={() => navigateToQuestion(fullscreenEditIndex - 1)}
                                className="h-9 border-white/10 rounded-xl text-xs text-slate-300 disabled:opacity-30"
                            >
                                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs text-muted-foreground font-mono">
                                Question <span className="text-indigo-400 font-bold">{fullscreenEditIndex + 1}</span> of {filteredQuestions.length}
                            </span>
                            <Button
                                onClick={handleSaveEdit}
                                size="sm"
                                className="h-9 px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/20"
                            >
                                <Save className="h-4 w-4 mr-1.5" />
                                Save Changes
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleInsertQuestionAfter(editingQ, fullscreenEditIndex)}
                                className="h-9 px-3 border-indigo-500/30 rounded-xl text-xs text-indigo-300 hover:bg-indigo-500/10 flex items-center gap-1.5"
                                title="Insert a missed question directly after this one"
                            >
                                <Plus className="h-3.5 w-3.5 text-indigo-400" />
                                <span className="hidden sm:inline">Insert After</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={fullscreenEditIndex >= filteredQuestions.length - 1}
                                onClick={() => navigateToQuestion(fullscreenEditIndex + 1)}
                                className="h-9 border-white/10 rounded-xl text-xs text-slate-300 disabled:opacity-30"
                            >
                                Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                QUESTION LIST VIEW (hidden when fullscreen editor is open)
                ═══════════════════════════════════════════════════════════════════ */}
            {fullscreenEditIndex === null && (<>
            {/* ─── Top Control Bar ─── */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                PYQ Manager Studio
                                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">v2.0 Pro</Badge>
                            </h2>
                            <p className="text-sm text-slate-400">
                                Seamlessly add, batch edit, OCR import, and filter KCET previous year questions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        variant="outline"
                        onClick={() => fetchQuestions()}
                        disabled={loading}
                        className="border-white/10 text-slate-300 hover:bg-white/5"
                        title="Refresh question bank"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setParsedPreview([])
                            setActiveOcrTab("paste")
                            setShowOCRModal(true)
                        }}
                        className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20"
                    >
                        <ClipboardPaste className="h-4 w-4 mr-2 text-indigo-400" />
                        Paste OCR / Bulk Import
                    </Button>
                    <Button
                        onClick={openNewQuestion}
                        className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 font-semibold"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Add Question
                    </Button>
                </div>
            </div>

            {/* ─── Metric Stat Cards ─── */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Card className="bg-slate-900/40 border-white/5 backdrop-blur-sm">
                    <CardContent className="p-3.5">
                        <div className="text-xs text-slate-400 font-medium">Total Questions</div>
                        <div className="text-2xl font-bold text-white mt-0.5">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="bg-indigo-950/20 border-indigo-500/20">
                    <CardContent className="p-3.5">
                        <div className="text-xs text-indigo-300 font-medium">Physics</div>
                        <div className="text-2xl font-bold text-indigo-400 mt-0.5">{stats.physics}</div>
                    </CardContent>
                </Card>
                <Card className="bg-purple-950/20 border-purple-500/20">
                    <CardContent className="p-3.5">
                        <div className="text-xs text-purple-300 font-medium">Chemistry</div>
                        <div className="text-2xl font-bold text-purple-400 mt-0.5">{stats.chemistry}</div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-950/20 border-emerald-500/20">
                    <CardContent className="p-3.5">
                        <div className="text-xs text-emerald-300 font-medium">Mathematics</div>
                        <div className="text-2xl font-bold text-emerald-400 mt-0.5">{stats.math}</div>
                    </CardContent>
                </Card>
                <Card className="bg-amber-950/20 border-amber-500/20">
                    <CardContent className="p-3.5">
                        <div className="text-xs text-amber-300 font-medium">Needs Image</div>
                        <div className="text-2xl font-bold text-amber-400 mt-0.5">{stats.needsImage}</div>
                    </CardContent>
                </Card>
            </div>

            {/* ─── Comprehensive Filter Panel ─── */}
            <Card className="bg-slate-900/60 border-white/10 shadow-lg">
                <CardContent className="p-4 space-y-3">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search by keywords, formula, chapter, year, or option..."
                                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* View Switcher & Selection Count */}
                        <div className="flex items-center gap-2 self-end md:self-auto">
                            <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10">
                                <Button
                                    variant={viewMode === "cards" ? "secondary" : "ghost"}
                                    size="sm"
                                    className="h-7 px-2.5 text-xs"
                                    onClick={() => setViewMode("cards")}
                                >
                                    <LayoutGrid className="h-3.5 w-3.5 mr-1" /> Detailed
                                </Button>
                                <Button
                                    variant={viewMode === "compact" ? "secondary" : "ghost"}
                                    size="sm"
                                    className="h-7 px-2.5 text-xs"
                                    onClick={() => setViewMode("compact")}
                                >
                                    <List className="h-3.5 w-3.5 mr-1" /> Compact
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Dropdowns Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-1">
                        {/* Subject */}
                        <div className="space-y-1">
                            <Label className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Subject</Label>
                            <Select
                                value={filterSubject}
                                onValueChange={v => {
                                    setFilterSubject(v)
                                    setFilterChapter("all")
                                }}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs">
                                    <SelectValue placeholder="All Subjects" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subjects ({questions.length})</SelectItem>
                                    {SUBJECTS.map(s => {
                                        const count = questions.filter(q => q.subject === s).length
                                        return (
                                            <SelectItem key={s} value={s}>
                                                {s} ({count})
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Chapter */}
                        <div className="space-y-1">
                            <Label className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Chapter</Label>
                            <Select
                                value={filterChapter}
                                onValueChange={setFilterChapter}
                                disabled={filterSubject === "all"}
                            >
                                <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs">
                                    <SelectValue placeholder={filterSubject === "all" ? "Select Subject first" : "All Chapters"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    <SelectItem value="all">All Chapters</SelectItem>
                                    {filterSubject !== "all" &&
                                        Object.entries(getChaptersForSubject(filterSubject as Subject)).map(([n, name]) => {
                                            const count = questions.filter(q => q.subject === filterSubject && String(q.chapter_number) === n).length
                                            return (
                                                <SelectItem key={n} value={n}>
                                                    CH {n}: {name} ({count})
                                                </SelectItem>
                                            )
                                        })}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Year */}
                        <div className="space-y-1">
                            <Label className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Exam Year</Label>
                            <Select value={filterYear} onValueChange={setFilterYear}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs">
                                    <SelectValue placeholder="All Years" />
                                </SelectTrigger>
                                <SelectContent className="max-h-72">
                                    <SelectItem value="all">All Years</SelectItem>
                                    {availableYears.map(yr => (
                                        <SelectItem key={yr} value={String(yr)}>
                                            KCET {yr}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Diagram / Image status */}
                        <div className="space-y-1">
                            <Label className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Image / Diagram</Label>
                            <Select value={filterNeedsImage} onValueChange={setFilterNeedsImage}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs">
                                    <SelectValue placeholder="All" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Questions</SelectItem>
                                    <SelectItem value="flagged_by_students">🚩 Student Reports ({studentReports.length})</SelectItem>
                                    <SelectItem value="missing_or_needed">⚠️ Needs Diagram Audit ({stats.missingDiagrams})</SelectItem>
                                    <SelectItem value="has_image">🖼️ Has Image Attached</SelectItem>
                                    <SelectItem value="yes">📷 Marked 'Needs Image' ({stats.needsImage})</SelectItem>
                                    <SelectItem value="no">Text-only Questions</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort Order */}
                        <div className="space-y-1">
                            <Label className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Sort By</Label>
                            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                                <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="chapter_asc">Chapter Sequence (1 → 28)</SelectItem>
                                    <SelectItem value="year_desc">Latest Year (2024 → 2004)</SelectItem>
                                    <SelectItem value="year_asc">Oldest Year (2004 → 2024)</SelectItem>
                                    <SelectItem value="created_desc">Recently Added</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Active Filter Badges & Batch Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-slate-400">
                                Showing <strong className="text-white">{filteredQuestions.length}</strong> of {questions.length} questions
                            </span>

                            {/* One-Click Quick Audit Button */}
                            <Button
                                variant={filterNeedsImage === "missing_or_needed" ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    if (filterNeedsImage === "missing_or_needed") {
                                        setFilterNeedsImage("all")
                                    } else {
                                        setFilterNeedsImage("missing_or_needed")
                                        setFilterSubject("all")
                                        setFilterChapter("all")
                                        setFilterYear("all")
                                        setSearch("")
                                    }
                                }}
                                className={`h-7 px-2.5 text-xs rounded-lg font-medium transition-all ${
                                    filterNeedsImage === "missing_or_needed"
                                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                                        : 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10'
                                }`}
                                title="Filter questions that mention a diagram/circuit/figure but have no image"
                            >
                                <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
                                Needs Diagram ({stats.missingDiagrams})
                            </Button>

                            {/* One-Click Student Reports Filter Button */}
                            {studentReports.length > 0 && (
                                <Button
                                    variant={filterNeedsImage === "flagged_by_students" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        if (filterNeedsImage === "flagged_by_students") {
                                            setFilterNeedsImage("all")
                                        } else {
                                            setFilterNeedsImage("flagged_by_students")
                                            setFilterSubject("all")
                                            setFilterChapter("all")
                                            setFilterYear("all")
                                            setSearch("")
                                        }
                                    }}
                                    className={`h-7 px-2.5 text-xs rounded-lg font-medium transition-all ${
                                        filterNeedsImage === "flagged_by_students"
                                            ? 'bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-md shadow-rose-500/20'
                                            : 'border-rose-500/30 text-rose-300 hover:bg-rose-500/10'
                                    }`}
                                    title="Filter questions flagged with discrepancies by students taking tests"
                                >
                                    <Flag className="h-3.5 w-3.5 mr-1.5 text-rose-400" />
                                    Student Reports ({studentReports.length})
                                </Button>
                            )}

                            {(search || filterSubject !== "all" || filterChapter !== "all" || filterYear !== "all" || filterNeedsImage !== "all") && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetFilters}
                                    className="h-6 px-2 text-[11px] text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                >
                                    Reset all filters
                                </Button>
                            )}
                        </div>

                        {/* Bulk selection controls */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleSelectAllFiltered}
                                className="h-7 text-xs text-slate-300 hover:bg-white/5"
                            >
                                {selectedIds.size === filteredQuestions.length && filteredQuestions.length > 0 ? (
                                    <>
                                        <CheckSquare className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                                        Deselect All
                                    </>
                                ) : (
                                    <>
                                        <Square className="h-3.5 w-3.5 mr-1.5" />
                                        Select All Filtered
                                    </>
                                )}
                            </Button>

                            {selectedIds.size > 0 && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleBatchDelete}
                                    disabled={isBatchDeleting}
                                    className="h-7 text-xs bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
                                >
                                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                    Delete Selected ({selectedIds.size})
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ─── Questions List ─── */}
            <div className="space-y-6">
                {loading ? (
                    <div className="text-center py-20 text-slate-400 bg-slate-900/20 rounded-2xl border border-white/5">
                        <RefreshCw className="h-8 w-8 mx-auto mb-3 animate-spin text-indigo-400" />
                        <p className="text-sm">Loading questions database...</p>
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 bg-slate-900/30 rounded-2xl border border-white/5 space-y-4">
                        <Database className="h-10 w-10 mx-auto text-slate-600" />
                        <div>
                            <p className="text-base font-medium text-slate-300">No questions matched your criteria</p>
                            <p className="text-xs text-slate-500 mt-1">Try relaxing filters or import new questions via OCR text.</p>
                        </div>
                        <div className="flex justify-center gap-3">
                            <Button variant="outline" size="sm" onClick={resetFilters} className="border-white/10 text-xs">
                                Clear Filters
                            </Button>
                            <Button size="sm" onClick={openNewQuestion} className="bg-indigo-600 text-xs">
                                <Plus className="h-3.5 w-3.5 mr-1" /> Add New Question
                            </Button>
                        </div>
                    </div>
                ) : (
                    groupedChapters.map(group => (
                        <div key={`${group.subject}_${group.chNum}`} className="space-y-3">
                            {/* Chapter Group Header */}
                            <div className="flex items-center justify-between sticky top-16 z-10 bg-slate-950/80 backdrop-blur-md py-2.5 px-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-2.5">
                                    <Badge className={`text-xs border-0 ${
                                        group.subject === "Physics"
                                            ? "bg-indigo-500/20 text-indigo-300"
                                            : group.subject === "Chemistry"
                                            ? "bg-purple-500/20 text-purple-300"
                                            : "bg-emerald-500/20 text-emerald-300"
                                    }`}>
                                        {group.subject}
                                    </Badge>
                                    <h3 className="text-base font-bold text-white tracking-wide">{group.title}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-white/5 text-slate-300 border-white/10 text-xs">
                                        {group.items.length} {group.items.length === 1 ? 'Question' : 'Questions'}
                                    </Badge>
                                </div>
                            </div>

                            {/* Questions Container */}
                            <div className={viewMode === "compact" ? "space-y-1.5" : "space-y-3"}>
                                {group.items.map((q, idx) => {
                                    const isSelected = selectedIds.has(q.id!)

                                    if (viewMode === "compact") {
                                        return (
                                            <div
                                                key={q.id || idx}
                                                className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-all ${
                                                    isSelected
                                                        ? 'bg-indigo-500/10 border-indigo-500/40'
                                                        : 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => handleToggleSelect(q.id!)}
                                                        className="border-white/30"
                                                    />
                                                    <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                                                        {q.year}
                                                    </Badge>
                                                    <div className="text-xs text-slate-200 truncate flex-1 font-medium">
                                                        {q.question.replace(/\n/g, ' ')}
                                                    </div>
                                                    <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px] shrink-0 font-mono">
                                                        Ans: {String.fromCharCode(65 + (q.correct_answer || 0))}
                                                    </Badge>
                                                    {isQuestionMissingDiagram(q) && (
                                                        <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] shrink-0 flex items-center gap-1 font-mono">
                                                            <ImageIcon className="h-2.5 w-2.5" /> Needs Diagram
                                                        </Badge>
                                                    )}
                                                    {reportsByQuestionId.has(q.id!) && (
                                                        <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] shrink-0 flex items-center gap-1 font-mono font-semibold animate-pulse">
                                                            <Flag className="h-2.5 w-2.5" /> Flagged ({reportsByQuestionId.get(q.id!)?.length})
                                                        </Badge>
                                                    )}
                                                    {q.image_url && (
                                                        <Badge className="bg-emerald-500/10 text-emerald-300 border-0 text-[10px] shrink-0 font-mono">
                                                            🖼️
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                                        onClick={() => openEditQuestion(q)}
                                                        title="Edit Question"
                                                    >
                                                        <Edit3 className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                                        onClick={() => handleInsertQuestionAfter(q)}
                                                        title="Insert Question After This"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-slate-400 hover:text-white hover:bg-white/5"
                                                        onClick={() => handleDuplicateQuestion(q)}
                                                        title="Duplicate Question"
                                                    >
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        onClick={() => handleDelete(q.id!)}
                                                        title="Delete Question"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    }

                                    // Detailed Card View
                                    return (
                                        <Card
                                            key={q.id || idx}
                                            className={`transition-all duration-200 border ${
                                                isSelected
                                                    ? 'bg-indigo-950/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                                                    : 'bg-slate-900/50 border-white/10 hover:border-white/25 hover:bg-slate-900/80'
                                            }`}
                                        >
                                            <CardContent className="p-4 sm:p-5">
                                                <div className="flex items-start justify-between gap-4">
                                                    {/* Selection + Question Body */}
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={() => handleToggleSelect(q.id!)}
                                                            className="mt-1 border-white/30"
                                                        />
                                                        <div className="space-y-3 flex-1 min-w-0">
                                                            {/* Badges Bar */}
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <Badge variant="outline" className="text-[10px] font-mono bg-white/5 border-white/10 text-slate-300">
                                                                    KCET {q.year}
                                                                </Badge>
                                                                <Badge className="bg-indigo-500/10 text-indigo-400 border-0 text-[10px]">
                                                                    CH {q.chapter_number}
                                                                </Badge>
                                                                {isQuestionMissingDiagram(q) && (
                                                                    <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] flex items-center gap-1 font-semibold animate-pulse">
                                                                        <ImageIcon className="h-3 w-3" /> Needs Diagram
                                                                    </Badge>
                                                                )}
                                                                {q.image_url && (
                                                                    <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                                                                        ✓ Diagram Linked
                                                                    </Badge>
                                                                )}
                                                                {reportsByQuestionId.has(q.id!) && (
                                                                    <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] flex items-center gap-1 font-semibold animate-pulse">
                                                                        <Flag className="h-3 w-3" /> Flagged by Student ({reportsByQuestionId.get(q.id!)?.length})
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            {/* Student Flagged Discrepancy Card */}
                                                            {reportsByQuestionId.has(q.id!) && (
                                                                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-2">
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                                                                            <Flag className="h-3.5 w-3.5 text-rose-400" />
                                                                            Student Report ({reportsByQuestionId.get(q.id!)?.length})
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            {reportsByQuestionId.get(q.id!)?.map(rep => (
                                                                                <Button
                                                                                    key={rep.id}
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    onClick={() => markReportResolved(rep.id)}
                                                                                    className="h-6 px-2 text-[10px] bg-rose-500/20 hover:bg-rose-500/40 text-rose-200 border border-rose-500/30"
                                                                                >
                                                                                    Mark Resolved
                                                                                </Button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        {reportsByQuestionId.get(q.id!)?.map(rep => (
                                                                            <div key={rep.id} className="text-xs text-rose-200/90 flex flex-wrap items-center gap-2 bg-rose-900/20 p-2 rounded-lg">
                                                                                <span className="font-semibold text-rose-300">
                                                                                    {rep.reason_label || rep.reason || "Discrepancy"}:
                                                                                </span>
                                                                                {rep.comment && (
                                                                                    <span className="text-slate-200 italic">
                                                                                        "{rep.comment}"
                                                                                    </span>
                                                                                )}
                                                                                <span className="text-[10px] text-slate-400 ml-auto">
                                                                                    {new Date(rep.created_at || rep.reported_at || Date.now()).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Question text with KaTeX preview */}
                                                            <div className="text-sm font-medium text-slate-100 leading-relaxed overflow-x-auto">
                                                                <MathRenderer content={q.question} />
                                                            </div>

                                                            {/* Image Preview if available */}
                                                            {q.image_url && (
                                                                <div className="p-2 rounded-lg bg-black/40 border border-white/10 inline-block max-w-sm">
                                                                    <img
                                                                        src={q.image_url}
                                                                        alt="Question Diagram"
                                                                        className="max-h-48 rounded object-contain"
                                                                        onError={(e: any) => { e.target.style.display = 'none' }}
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* 4 Options Grid */}
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                                {(q.options || ["", "", "", ""]).map((opt, i) => {
                                                                    const isCorrect = (q.correct_answer === i)
                                                                    return (
                                                                        <div
                                                                            key={i}
                                                                            className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-colors ${
                                                                                isCorrect
                                                                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-medium'
                                                                                    : 'bg-white/[0.02] border-white/5 text-slate-300'
                                                                            }`}
                                                                        >
                                                                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                                                                                isCorrect
                                                                                    ? 'bg-emerald-500 text-slate-950'
                                                                                    : 'bg-white/10 text-slate-400'
                                                                            }`}>
                                                                                {String.fromCharCode(65 + i)}
                                                                            </span>
                                                                            <div className="flex-1 overflow-x-auto min-w-0">
                                                                                <MathRenderer content={opt || "—"} inline />
                                                                                {q.option_images?.[i] && (
                                                                                    <img
                                                                                        src={q.option_images[i]}
                                                                                        alt={`Option ${String.fromCharCode(65 + i)}`}
                                                                                        className="max-h-20 mt-1 rounded bg-black/30 p-1 border border-white/10"
                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            {isCorrect && (
                                                                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>

                                                            {/* Explanation Snippet */}
                                                            {q.explanation && (
                                                                <div className="mt-2 p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-300">
                                                                    <div className="text-[11px] font-semibold text-indigo-400 mb-0.5 flex items-center gap-1">
                                                                        <Sparkles className="h-3 w-3" /> Explanation:
                                                                    </div>
                                                                    <MathRenderer content={q.explanation} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons Column */}
                                                    <div className="flex flex-col sm:flex-row items-center gap-1 shrink-0">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                                            onClick={() => openEditQuestion(q)}
                                                            title="Edit question"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                                                            onClick={() => handleInsertQuestionAfter(q)}
                                                            title="Insert question after this"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/5"
                                                            onClick={() => handleDuplicateQuestion(q)}
                                                            title="Duplicate as template"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                            onClick={() => handleDelete(q.id!)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ─── Pagination Controls ─── */}
            {filteredQuestions.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs">
                    <div className="flex items-center gap-3 text-slate-400">
                        <span>
                            Showing <strong className="text-white">{Math.min((currentPage - 1) * pageSize + 1, filteredQuestions.length)}</strong> to{" "}
                            <strong className="text-white">{Math.min(currentPage * pageSize, filteredQuestions.length)}</strong> of{" "}
                            <strong className="text-white">{filteredQuestions.length}</strong> questions
                        </span>
                        <div className="flex items-center gap-1.5 ml-2 border-l border-white/10 pl-3">
                            <span className="text-slate-500">Per page:</span>
                            <Select value={String(pageSize)} onValueChange={v => setPageSize(Number(v))}>
                                <SelectTrigger className="w-16 h-7 text-xs bg-white/5 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1))
                                window.scrollTo({ top: 300, behavior: 'smooth' })
                            }}
                            className="h-8 border-white/10 text-xs text-slate-300 disabled:opacity-40"
                        >
                            <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
                        </Button>

                        <div className="px-3 py-1 bg-white/5 rounded-md border border-white/10 text-slate-300 text-xs font-mono font-medium">
                            Page <span className="text-indigo-400 font-bold">{currentPage}</span> of {totalPages}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => {
                                setCurrentPage(p => Math.min(totalPages, p + 1))
                                window.scrollTo({ top: 300, behavior: 'smooth' })
                            }}
                            className="h-8 border-white/10 text-xs text-slate-300 disabled:opacity-40"
                        >
                            Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
            </>)}

            {/* ─── Add / Edit Modal ─── */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogContent className="glass-strong border-white/10 sm:max-w-4xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-950/95">
                    <DialogHeader className="p-6 pb-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                    {editingQ?.id ? (
                                        <>
                                            <Edit3 className="h-5 w-5 text-indigo-400" />
                                            Edit Question
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-5 w-5 text-emerald-400" />
                                            Add New Question
                                        </>
                                    )}
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-400 mt-1">
                                    Format with standard text or LaTeX math (e.g. $F = ma$ or $E = mc^2$). Click any option radio to select the correct answer.
                                </DialogDescription>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowMathLivePreview(!showMathLivePreview)}
                                className="text-xs text-indigo-300 hover:bg-indigo-500/10 h-7"
                            >
                                {showMathLivePreview ? <EyeOff className="h-3.5 w-3.5 mr-1" /> : <Eye className="h-3.5 w-3.5 mr-1" />}
                                {showMathLivePreview ? "Hide Math Preview" : "Show Math Preview"}
                            </Button>
                        </div>
                    </DialogHeader>

                    {editingQ && (
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {/* Metadata Row: Subject, Chapter, Year */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-300">Subject</Label>
                                    <Select
                                        value={editingQ.subject || "Physics"}
                                        onValueChange={v => {
                                            const sub = v as Subject
                                            const chapters = getChaptersForSubject(sub)
                                            setEditingQ({
                                                ...editingQ,
                                                subject: sub,
                                                chapter_number: 1,
                                                chapter: chapters[1] || ""
                                            })
                                        }}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-300">Chapter</Label>
                                    <Select
                                        value={String(editingQ.chapter_number || 1)}
                                        onValueChange={v => {
                                            const chNum = parseInt(v)
                                            const chapters = getChaptersForSubject((editingQ.subject || "Physics") as Subject)
                                            setEditingQ({
                                                ...editingQ,
                                                chapter_number: chNum,
                                                chapter: chapters[chNum] || ""
                                            })
                                        }}
                                    >
                                        <SelectTrigger className="bg-white/5 border-white/10 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-64">
                                            {Object.entries(getChaptersForSubject((editingQ.subject || "Physics") as Subject)).map(([n, name]) => (
                                                <SelectItem key={n} value={n}>CH {n}: {name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-300">KCET Exam Year</Label>
                                    <Input
                                        type="number"
                                        value={editingQ.year || 2024}
                                        onChange={e => setEditingQ({ ...editingQ, year: parseInt(e.target.value) || 2024 })}
                                        className="bg-white/5 border-white/10 text-xs"
                                        placeholder="2024"
                                    />
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-slate-300">Question Text (Supports LaTeX $...$ or $$...$$)</Label>
                                    <span className="text-[11px] text-slate-500">Tip: Wrap math in $ symbols</span>
                                </div>
                                <Textarea
                                    value={editingQ.question}
                                    onChange={e => setEditingQ({ ...editingQ, question: e.target.value })}
                                    className="min-h-[110px] bg-white/5 border-white/10 text-sm font-mono text-white placeholder:text-slate-500"
                                    placeholder="Enter question statement here. E.g. The dimensional formula for universal gravitational constant $G$ is..."
                                />
                                {showMathLivePreview && editingQ.question && (
                                    <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/20 text-sm text-slate-200">
                                        <div className="text-[10px] text-indigo-400 font-bold uppercase mb-1">Live LaTeX Render</div>
                                        <MathRenderer content={editingQ.question} />
                                    </div>
                                )}
                            </div>

                            {/* 4 Options Grid */}
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs text-slate-300">Options (Select the radio of the correct answer)</Label>
                                    <span className="text-[11px] text-emerald-400 font-medium">
                                        Correct: Option {String.fromCharCode(65 + (editingQ.correct_answer || 0))}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[0, 1, 2, 3].map(i => {
                                        const isCorrect = editingQ.correct_answer === i
                                        return (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-xl border transition-all ${
                                                    isCorrect
                                                        ? 'bg-emerald-500/10 border-emerald-500/40 ring-1 ring-emerald-500/30'
                                                        : 'bg-white/[0.02] border-white/10'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingQ({ ...editingQ, correct_answer: i })}
                                                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                                            isCorrect
                                                                ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold'
                                                                : 'border-white/30 hover:border-white/60'
                                                        }`}
                                                    >
                                                        {isCorrect && <Check className="h-3 w-3 stroke-[3]" />}
                                                    </button>
                                                    <span className="text-xs font-bold text-slate-200">
                                                        Option {String.fromCharCode(65 + i)}
                                                    </span>
                                                    {isCorrect && (
                                                        <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px] ml-auto">
                                                            Correct Answer
                                                        </Badge>
                                                    )}
                                                </div>

                                                <Textarea
                                                    value={editingQ.options?.[i] || ""}
                                                    onChange={e => {
                                                        const opts = [...(editingQ.options || ["", "", "", ""])]
                                                        opts[i] = e.target.value
                                                        setEditingQ({ ...editingQ, options: opts })
                                                    }}
                                                    placeholder={`Option ${String.fromCharCode(65 + i)} text / LaTeX`}
                                                    className="bg-white/5 border-white/10 text-xs min-h-[50px] font-mono"
                                                />

                                                {/* Live render of option math */}
                                                {showMathLivePreview && editingQ.options?.[i] && (
                                                    <div className="mt-1 px-2 py-1 rounded bg-black/30 border border-white/5 text-xs text-slate-300">
                                                        <MathRenderer content={editingQ.options[i]} inline />
                                                    </div>
                                                )}

                                                {/* Option Image Uploader / Paster */}
                                                <div className="mt-2.5 pt-2 border-t border-white/5">
                                                    <ImageUploader
                                                        value={editingQ.option_images?.[i] || ""}
                                                        onChange={url => {
                                                            const imgs = [...(editingQ.option_images || ["", "", "", ""])]
                                                            imgs[i] = url
                                                            setEditingQ({ ...editingQ, option_images: imgs })
                                                        }}
                                                        compact
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Question Diagram / Image Uploader */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <Checkbox
                                            checked={editingQ.needs_image}
                                            onCheckedChange={c => setEditingQ({ ...editingQ, needs_image: !!c })}
                                            className="border-white/30"
                                        />
                                        <span className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
                                            <ImageIcon className="h-3.5 w-3.5" /> Flag: Needs Image / Diagram
                                        </span>
                                    </label>
                                    <span className="text-[11px] text-slate-500">Flags questions requiring paper scans/diagrams</span>
                                </div>

                                <ImageUploader
                                    value={editingQ.image_url || ""}
                                    onChange={url => setEditingQ({
                                        ...editingQ,
                                        image_url: url,
                                        needs_image: !!url ? false : editingQ.needs_image
                                    })}
                                    label="Question Diagram / Graphic"
                                    description="Attach a diagram for the question statement. Paste directly from clipboard (Ctrl+V) or upload a file."
                                />
                            </div>

                            {/* Explanation & Solution Diagram */}
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-slate-300">Explanation / Step-by-Step Solution (Optional)</Label>
                                    <Textarea
                                        value={editingQ.explanation || ""}
                                        onChange={e => setEditingQ({ ...editingQ, explanation: e.target.value })}
                                        className="min-h-[80px] bg-white/5 border-white/10 text-xs text-white"
                                        placeholder="Provide step-by-step derivation or reasoning for students..."
                                    />
                                </div>

                                <ImageUploader
                                    value={editingQ.explanation_image_url || ""}
                                    onChange={url => {
                                        // Embed markdown image in explanation if preferred, or store in state
                                        const cleanUrl = url.trim()
                                        let updatedExpl = editingQ.explanation || ""
                                        // Remove existing embedded image syntax if deleting
                                        if (!cleanUrl) {
                                            updatedExpl = updatedExpl.replace(/\n*!\[Solution Diagram\]\([^\)]+\)/g, "").trim()
                                        } else if (!updatedExpl.includes(cleanUrl)) {
                                            // Append markdown image tag to explanation so it natively displays across all pages
                                            updatedExpl = updatedExpl ? `${updatedExpl}\n\n![Solution Diagram](${cleanUrl})` : `![Solution Diagram](${cleanUrl})`
                                        }
                                        setEditingQ({
                                            ...editingQ,
                                            explanation: updatedExpl,
                                            explanation_image_url: cleanUrl
                                        })
                                    }}
                                    label="Solution / Derivation Diagram (Optional)"
                                    description="Attach a handwritten solution, step-by-step diagram, or circuit calculation."
                                    previewHeight="max-h-56"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between">
                        <Button variant="ghost" onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {editingQ?.id ? "Save Changes" : "Create Question"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ─── OCR / Bulk Paste Import Modal ─── */}
            <Dialog open={showOCRModal} onOpenChange={setShowOCRModal}>
                <DialogContent className="glass-strong border-white/10 sm:max-w-5xl max-h-[92vh] flex flex-col p-0 overflow-hidden bg-slate-950/95">
                    <DialogHeader className="p-6 pb-4 border-b border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                                    <ClipboardPaste className="h-5 w-5 text-indigo-400" />
                                    OCR & Text Bulk Question Importer
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-400 mt-1">
                                    Paste raw text from KCET question papers, PDFs, or OCR tools. The parser extracts questions, options, years, and pairs answer keys automatically.
                                </DialogDescription>
                            </div>

                            {/* Sub-tab Switcher */}
                            {parsedPreview.length > 0 && (
                                <div className="flex items-center bg-white/5 p-1 rounded-lg border border-white/10 self-start sm:self-auto">
                                    <Button
                                        variant={activeOcrTab === "paste" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 text-xs"
                                        onClick={() => setActiveOcrTab("paste")}
                                    >
                                        Raw Text
                                    </Button>
                                    <Button
                                        variant={activeOcrTab === "preview" ? "secondary" : "ghost"}
                                        size="sm"
                                        className="h-7 text-xs text-emerald-400"
                                        onClick={() => setActiveOcrTab("preview")}
                                    >
                                        Parsed ({parsedPreview.length})
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                        {activeOcrTab === "paste" && (
                            <>
                                {/* Target Subject & Chapter */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-300">Target Subject</Label>
                                        <Select
                                            value={ocrSubject}
                                            onValueChange={v => {
                                                setOcrSubject(v as Subject)
                                                setOcrChapter("1")
                                            }}
                                        >
                                            <SelectTrigger className="bg-white/5 border-white/10 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-slate-300">Target Chapter</Label>
                                        <Select value={ocrChapter} onValueChange={setOcrChapter}>
                                            <SelectTrigger className="bg-white/5 border-white/10 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-64">
                                                {Object.entries(getChaptersForSubject(ocrSubject)).map(([n, name]) => (
                                                    <SelectItem key={n} value={n}>CH {n}: {name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Raw Text Input */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-slate-300">Raw Question Bank Text</Label>
                                        <span className="text-[11px] text-slate-500">Supports questions + Answer key block</span>
                                    </div>
                                    <Textarea
                                        placeholder={`1. The number of significant figures in 4.8000 x 10^4 is:\n(a) 5 and 6\n(b) 5 and 7\n(c) 2 and 7\n(d) 2 and 6 (2009)\n\n2. Dimensional formula for universal gravitational constant G is:\n(a) [M^-1 L^3 T^-2]\n(b) [M^-1 L^3 T^-1]\n(c) [M^-2 L^3 T^-2]\n(d) [M^2 L^-1 T^-2] (2008)\n\nANSWER KEY\n1. (b) 2. (a)`}
                                        className="min-h-[260px] bg-white/5 border-white/10 font-mono text-xs text-white placeholder:text-slate-600"
                                        value={ocrText}
                                        onChange={e => setOcrText(e.target.value)}
                                    />
                                </div>

                                <Button
                                    onClick={parseOCR}
                                    disabled={!ocrText.trim()}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/20"
                                >
                                    <Sparkles className="h-4 w-4 mr-2" /> Parse & Extract Questions
                                </Button>
                            </>
                        )}

                        {activeOcrTab === "preview" && (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-950/30 border border-indigo-500/20 p-4 rounded-xl">
                                    <div>
                                        <h4 className="text-base font-bold text-emerald-400">
                                            Extracted {parsedPreview.length} Questions
                                        </h4>
                                        <p className="text-xs text-slate-400">
                                            Review options and correct answers. You can tweak any field before saving to the live database.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={exportParsedJSON}
                                            className="border-white/10 text-xs text-slate-300"
                                        >
                                            <FileJson className="h-3.5 w-3.5 mr-1" /> Export JSON
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={saveParsedToDb}
                                            disabled={loading}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                                        >
                                            <Save className="h-3.5 w-3.5 mr-1.5" /> Save All ({parsedPreview.length}) to DB
                                        </Button>
                                    </div>
                                </div>

                                {/* Parsed Questions Cards */}
                                <div className="space-y-4">
                                    {parsedPreview.map((q, idx) => (
                                        <Card key={idx} className="bg-slate-900/60 border-white/10">
                                            <CardContent className="p-4 space-y-3">
                                                {/* Header row: Question #, Year, Delete */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold text-indigo-400">#{idx + 1}</span>
                                                        <Badge className="bg-indigo-500/10 text-indigo-300 border-0 text-[10px]">
                                                            {q.subject}
                                                        </Badge>
                                                        <Badge variant="outline" className="text-[10px]">
                                                            CH {q.chapter_number}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[11px] text-slate-400">Year:</span>
                                                            <Input
                                                                type="number"
                                                                value={q.year}
                                                                onChange={e => updateParsedQ(idx, "year", parseInt(e.target.value) || 2024)}
                                                                className="w-20 h-7 text-xs bg-white/5 border-white/10 text-center"
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-7 w-7 text-red-400 hover:bg-red-500/10"
                                                            onClick={() => setParsedPreview(p => p.filter((_, i) => i !== idx))}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Editable Question */}
                                                <Textarea
                                                    value={q.question}
                                                    onChange={e => updateParsedQ(idx, "question", e.target.value)}
                                                    className="bg-white/5 border-white/10 text-xs min-h-[60px] font-mono"
                                                    placeholder="Question statement..."
                                                />

                                                {/* 4 Options Grid with Correct Answer Selector */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {[0, 1, 2, 3].map(i => {
                                                        const isCorrect = q.correct_answer === i
                                                        return (
                                                            <div
                                                                key={i}
                                                                className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${
                                                                    isCorrect
                                                                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                                                                        : 'bg-white/[0.02] border-white/10 text-slate-300'
                                                                }`}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateParsedQ(idx, "correct_answer", i)}
                                                                    className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                                                                        isCorrect
                                                                            ? 'border-emerald-400 bg-emerald-500 text-slate-950 font-bold'
                                                                            : 'border-white/30 hover:border-white/60'
                                                                    }`}
                                                                >
                                                                    {isCorrect && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                                                </button>
                                                                <span className="font-semibold text-muted-foreground mt-0.5">
                                                                    {String.fromCharCode(97 + i)})
                                                                </span>
                                                                <Input
                                                                    value={q.options[i] || ""}
                                                                    onChange={e => updateParsedQ(idx, `options.${i}`, e.target.value)}
                                                                    className="bg-transparent border-0 border-b border-white/10 p-0 h-6 text-xs rounded-none focus-visible:ring-0"
                                                                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                {/* Needs Image & Uploader */}
                                                <div className="pt-2 border-t border-white/5 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-amber-300">
                                                            <Checkbox
                                                                checked={q.needs_image}
                                                                onCheckedChange={c => updateParsedQ(idx, "needs_image", !!c)}
                                                                className="border-white/30"
                                                            />
                                                            Needs Diagram
                                                        </label>
                                                    </div>
                                                    <ImageUploader
                                                        value={q.image_url || ""}
                                                        onChange={url => {
                                                            updateParsedQ(idx, "image_url", url)
                                                            if (url) updateParsedQ(idx, "needs_image", false)
                                                        }}
                                                        compact
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="p-4 border-t border-white/10 bg-slate-950 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => setShowOCRModal(false)}
                            className="text-slate-400 hover:text-white"
                        >
                            Cancel
                        </Button>
                        {activeOcrTab === "preview" && (
                            <Button
                                onClick={saveParsedToDb}
                                disabled={loading || parsedPreview.length === 0}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium"
                            >
                                <Save className="h-4 w-4 mr-2" /> Save All to DB
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

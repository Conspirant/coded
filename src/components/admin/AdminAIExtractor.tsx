import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Loader2, BrainCircuit, CheckCircle2, ChevronRight, Save } from "lucide-react"
import * as pdfjsLib from 'pdfjs-dist'
import Tesseract from 'tesseract.js'
import { SUBJECTS, getChaptersForSubject, Subject, PYQQuestion } from "@/data/pyqQuestionBank"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export function AdminAIExtractor() {
  const [file, setFile] = useState<File | null>(null)
  const [startPage, setStartPage] = useState<number>(1)
  const [endPage, setEndPage] = useState<number>(5)
  const [subject, setSubject] = useState<Subject>("Physics")
  const [chapterNumber, setChapterNumber] = useState<number>(1)
  
  const [isExtracting, setIsExtracting] = useState(false)
  const [progressLog, setProgressLog] = useState<string[]>([])
  const [extractedQuestions, setExtractedQuestions] = useState<any[]>([])
  
  const { toast } = useToast()

  const log = (msg: string) => setProgressLog(prev => [...prev, msg])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const runExtration = async () => {
    if (!file) return toast({ title: "No PDF", description: "Please select the PDF file first.", variant: "destructive" })
    
    setIsExtracting(true)
    setProgressLog([])
    setExtractedQuestions([])
    
    try {
      log(`Loading PDF: ${file.name}...`)
      const arrayBuffer = await file.arrayBuffer()
      const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      
      const totalPages = pdfDoc.numPages
      log(`PDF loaded. Total pages: ${totalPages}. Target: ${startPage} to ${endPage}`)

      // Limit pages
      const safeStart = Math.max(1, startPage)
      const safeEnd = Math.min(totalPages, endPage)
      
      let allExtracted: any[] = []
      
      const chapterName = getChaptersForSubject(subject)[chapterNumber] || "Unknown"

      // Pre-initialize Tesseract worker to speed up loop
      log(`Initializing Tesseract OCR worker...`)
      const worker = await Tesseract.createWorker('eng')
      log(`Tesseract worker ready!`)

      for (let p = safeStart; p <= safeEnd; p++) {
         log(`[Page ${p}] Extracting standard text...`)
         const page = await pdfDoc.getPage(p)
         const textContent = await page.getTextContent()
         let pageText = textContent.items.map((item: any) => item.str).join(' ')
        
         if (pageText.length < 50) {
            log(`[Page ${p}] Standard extraction empty! Running Tesseract OCR... (this may take 5-10 seconds)`)
            const viewport = page.getViewport({ scale: 2.0 }) // High scale for better OCR
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            if (context) {
               canvas.height = viewport.height
               canvas.width = viewport.width
               await page.render({ canvasContext: context, viewport } as any).promise
               const dataUrl = canvas.toDataURL('image/png')
               const { data: { text } } = await worker.recognize(dataUrl)
               pageText = text
            }
         }

         if (pageText.length < 50) {
            log(`[Page ${p}] Skipping (page is fully blank).`)
            continue
         }

         log(`[Page ${p}] Sending to Nvidia Nemotron-3 Super 120B...`)
        
         const systemPrompt = `You are an expert exam parser. I am giving you raw text from a KCET PYQ PDF.
Extract ALL multiple-choice questions from this text. Ignore syllabus, answers, keys, or title text.
Use this EXACT JSON format (return array of objects):
[
  {
    "question": "The physical quantity having...",
    "options": ["resistance", "resistivity", "electrical"], // Exactly 4 options max
    "correct_answer": 0, // 0-3 index
    "year": 2006, // MUST BE A NUMBER, 2024 if missing
    "explanation": "",
    "needs_image": false // true if question references diagram not present in text
  }
]
RETURN ONLY VALID JSON AND NOTHING ELSE. NO MARKDOWN BACKTICKS.`

         const messages = [
           { role: "system", content: systemPrompt },
           { role: "user", content: pageText.substring(0, 10000) } // safeguard length
         ]

         try {
           const res = await fetch('/api/nvidia-chat', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ messages })
           })

           const data = await res.json()
           let content = data.content || "[]"
           
           content = content.replace(/^```json/gi, '').replace(/^```/g, '').replace(/```$/g, '').trim()
           
           let parsed = JSON.parse(content)
           if (Array.isArray(parsed)) {
              if (parsed.length === 0) {
                 log(`[Page ${p}] ⚠️ AI found no valid questions.`)
              } else {
                 const mapped = parsed.map(q => ({
                   id: `gen-${Math.random().toString(36).substr(2, 9)}`,
                   ...q,
                   subject,
                   chapter_number: chapterNumber,
                   chapter: chapterName,
                   option_images: ["", "", "", ""] // blank
                 }))
                 allExtracted = [...allExtracted, ...mapped]
                 log(`[Page ${p}] ✅ Extracted ${mapped.length} questions.`)
                 setExtractedQuestions([...allExtracted]) // update UI incrementally
              }
           } else {
              log(`[Page ${p}] ⚠️ AI didn't return an array.`)
           }
         } catch (err) {
           log(`[Page ${p}] ❌ Parsing failed: ${(err as Error).message}`)
         }
      }
      
      await worker.terminate()
      log(`🎉 Done! Extracted ${allExtracted.length} total questions.`)

    } catch (e: any) {
      log(`Critical Error: ${e.message}`)
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setIsExtracting(false)
    }
  }

  const saveToSupabase = async () => {
    if (extractedQuestions.length === 0) return
    setIsExtracting(true)

    const payload = extractedQuestions.map(q => {
        const { id, ...rest } = q;
        return rest;
    })

    const { error } = await supabase.from('pyq_questions' as any).insert(payload)
    setIsExtracting(false)

    if (error) {
        toast({ title: "Save Failed", description: error.message, variant: "destructive" })
    } else {
        toast({ title: "Success", description: `Saved ${extractedQuestions.length} questions to database!` })
        setExtractedQuestions([])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Controls */}
        <Card className="glass-strong border-white/10 w-full md:w-1/3 h-fit">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              AI PDF Extractor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="space-y-2">
              <Label>Select PDF File</Label>
              <Input type="file" accept="application/pdf" onChange={handleFileChange} className="bg-white/5 border-white/10" />
              <p className="text-xs text-muted-foreground">Select local 240-page PDF to avoid upload limits.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Page</Label>
                <Input type="number" min={1} value={startPage} onChange={e => setStartPage(Number(e.target.value))} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>End Page</Label>
                <Input type="number" min={1} value={endPage} onChange={e => setEndPage(Number(e.target.value))} className="bg-white/5 border-white/10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Subject</Label>
              <Select value={subject} onValueChange={(v) => { setSubject(v as Subject); setChapterNumber(1); }}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Chapter Map</Label>
              <Select value={String(chapterNumber)} onValueChange={v => setChapterNumber(parseInt(v))}>
                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                <SelectContent className="max-h-64">
                   {Object.entries(getChaptersForSubject(subject)).map(([n, name]) => (
                      <SelectItem key={n} value={n}>CH {n}: {name}</SelectItem>
                   ))}
                </SelectContent>
              </Select>
            </div>

            <Button onClick={runExtration} disabled={isExtracting || !file} className="w-full bg-indigo-500 hover:bg-indigo-600">
               {isExtracting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
               Run AI Extraction
            </Button>
            
          </CardContent>
        </Card>

        {/* Console / Output */}
        <div className="w-full md:w-2/3 space-y-4">
           <Card className="glass flex-1 border-white/10 min-h-[150px] max-h-[300px] overflow-y-auto">
             <CardContent className="p-4 font-mono text-xs text-slate-300 flex flex-col gap-1">
               {progressLog.length === 0 ? (
                  <span className="text-slate-500 italic">Logs will appear here...</span>
               ) : (
                  progressLog.map((log, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-slate-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                      <span>{log}</span>
                    </div>
                  ))
               )}
             </CardContent>
           </Card>

           {extractedQuestions.length > 0 && (
              <div className="flex justify-between items-center bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                     <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                   </div>
                   <div>
                     <p className="font-semibold text-emerald-400">Extraction Complete</p>
                     <p className="text-sm text-slate-300">Found {extractedQuestions.length} questions ready to save.</p>
                   </div>
                 </div>
                 <Button onClick={saveToSupabase} disabled={isExtracting} className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                    <Save className="w-4 h-4 mr-2" />
                    Save All to Database
                 </Button>
              </div>
           )}

           <div className="grid grid-cols-1 gap-3">
               {extractedQuestions.map((q, i) => (
                 <Card key={q.id || i} className="bg-white/5 border-white/10">
                   <CardContent className="p-4 space-y-3">
                     <div className="flex justify-between">
                       <Badge className="bg-indigo-500/20 text-indigo-300 border-0">{q.subject} • CH {q.chapter_number}</Badge>
                       <Badge variant="outline">{q.year}</Badge>
                     </div>
                     <p className="font-medium text-sm leading-relaxed">{q.question}</p>
                     <div className="grid grid-cols-2 gap-2 text-xs">
                       {(q.options || []).map((o: string, idx: number) => (
                         <div key={idx} className={idx === q.correct_answer ? "text-emerald-400 font-bold" : "text-slate-400"}>
                           {String.fromCharCode(65+idx)}. {o}
                         </div>
                       ))}
                     </div>
                   </CardContent>
                 </Card>
               ))}
           </div>
        </div>

      </div>
    </div>
  )
}

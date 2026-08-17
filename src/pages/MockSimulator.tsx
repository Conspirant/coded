import { SEO } from "@/components/SEO"
import { isUnlocked } from "@/lib/unlock"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Reorder } from "framer-motion"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import {
  Play,
  FileDown,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Trophy,
  Target,
  TrendingUp,
  GraduationCap,
  Search,
  Settings,
  GripVertical,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Upload,
  Loader2,
  FileText
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { loadSettings } from "@/lib/settings"
import { normalizeCourseName } from "@/lib/course-normalization"
import { PDFParser, type ParsedOption } from "@/lib/pdf-parser"
import {
  simulateAllotment,
  getAvailableRounds,
  getEligibleCategories,
  getPreferenceSafetyLevel,
  type PreferenceOption,
  type CutoffData,
  type SimulationResult,
  type SimulationInput
} from "@/lib/mock-simulator"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"

interface CutoffResponse {
  metadata?: {
    years_covered?: string[]
    detected_categories?: string[]
    institute_names?: Record<string, string>
    auto_detected_courses?: string[]
  }
  cutoffs: CutoffData[]
}

const COURSE_CODE_RULES: Array<[RegExp, string]> = [
  [/CYBER\s*SECURITY/i, "CY"],
  [/DATA\s*SCIENCE|DAT\s*A\s*SCIENCE|D\s*ATA\s*SCIENCE/i, "DS"],
  [/ARTIFICIAL\s+INTELLIGENCE.*MACHINE\s+LEARNING|ARTIFICIA\s*L\s+INTELLIGENCE.*MACHINE\s+LEARNING|\bAI\s*&?\s*ML\b/i, "AI"],
  [/ARTIFICIAL\s+INTELLIGENCE/i, "AI"],
  [/INFORMATION\s+SCIENCE/i, "IS"],
  [/INFORMATION\s+TECHNOLOGY/i, "IT"],
  [/ELECTRONICS.*COMMUNICATION|COMMUNICATIO\s*N/i, "EC"],
  [/ELECTRICAL.*ELECTRONICS/i, "EE"],
  [/COMPUTER\s+SCIENCE.*ENGINEERING|COMPUTER\s+SCIENCE.*ENGG|\bCS\s+COMPUTERS\b/i, "CS"],
  [/MECHANICAL/i, "ME"],
  [/CIVIL/i, "CE"],
  [/BIO\s*-?\s*TECHNOLOGY|BIOTECH/i, "BT"],
  [/BIO\s*-?\s*MEDICAL/i, "BM"],
  [/AERONAUTICAL/i, "AE"],
  [/AEROSPACE/i, "SE"],
  [/ROBOTICS/i, "RA"],
  [/AUTOMOBILE|AUTOMOTIVE/i, "AU"],
  [/CHEMICAL/i, "CH"],
]

const COLLEGE_QUALITY_SCORES: Record<string, number> = {
  E005: 99, // RV College of Engineering
  E004: 98, // BMS College of Engineering
  E006: 97, // M S Ramaiah Institute of Technology
  E023: 96, // PES University
  E001: 95, // UVCE
  E021: 93, // JSS / SJCE Mysuru
  E007: 92, // Bangalore Institute of Technology
  E011: 91, // Dayananda Sagar College of Engineering
  E012: 89, // Sir M Visvesvaraya Institute of Technology
  E013: 88, // NIE Mysuru
  E019: 87, // Siddaganga Institute of Technology
  E017: 84, // Sri Siddhartha Institute of Technology
  E173: 73, // Sai Vidya Institute of Technology
  E255: 62, // GITAM off-campus Bengaluru
}

const MockSimulator = () => {
  const { toast } = useToast()
  const preferencePageSize = 10

  // PDF Upload state
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadedOptions, setUploadedOptions] = useState<ParsedOption[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process uploaded PDF file
  const processUploadFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    setIsParsing(true);
    setParseProgress(10);
    setParseError("");
    setUploadFileName(file.name);

    try {
      setParseProgress(30);

      // Parse the PDF with timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('PDF parsing timed out. Please try again or check the file.')), 30000);
      });

      const parsePromise = PDFParser.parseWithFallback(file);
      const options = await Promise.race([parsePromise, timeoutPromise]);

      setParseProgress(80);

      if (options.length === 0) {
        setParseError("No option codes (like E005CS) found. Ensure you are uploading a digitally generated KEA Option Entry PDF (copied from the portal), not a photo, scan, or cropped screenshot.");
        toast({
          title: "No Option Codes Found",
          description: "Ensure this is a digital PDF, not a photo or scanned copy.",
          variant: "destructive"
        });
      } else {
        setUploadedOptions(options);
        toast({
          title: "PDF Parsed Successfully! 🎉",
          description: `Extracted ${options.length} options from your Option Entry PDF`
        });
      }

      setParseProgress(100);
    } catch (error) {
      console.error('PDF parsing error:', error);
      setParseError(error instanceof Error ? error.message : 'Failed to parse PDF');
      toast({
        title: "Parsing Error",
        description: "Failed to parse the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => setIsParsing(false), 300);
    }
  };

  // Handle file drop for upload
  const handleUploadDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setIsUploadDialogOpen(true);
      await processUploadFile(files[0]);
    }
  }, []);

  // Handle file input change
  const handleUploadFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploadDialogOpen(true);
      await processUploadFile(files[0]);
    }
  };

  // Clear uploaded data
  const clearUploadData = () => {
    setUploadedOptions([]);
    setUploadFileName("");
    setParseError("");
    setParseProgress(0);
  };

  // Import choices into simulator preferences
  const importUploadedChoices = () => {
    if (uploadedOptions.length === 0) return;

    setPreferences(
      uploadedOptions.map((opt) => ({
        id: opt.id,
        collegeCode: opt.collegeCode,
        branchCode: opt.branchCode,
        collegeName: opt.collegeName,
        branchName: opt.branchName,
        priority: opt.priority,
        courseFee: opt.courseFee,
        collegeCourse: opt.collegeCourse
      }))
    );

    setIsUploadDialogOpen(false);
    clearUploadData();

    toast({
      title: "Preferences Loaded! 📋",
      description: `Imported ${uploadedOptions.length} options from your PDF into the simulator sheet.`
    });
  };

  // Data state
  const [cutoffs, setCutoffs] = useState<CutoffData[]>([])
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  // Available options
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableColleges, setAvailableColleges] = useState<{ code: string, name: string }[]>([])
  const [availableBranches, setAvailableBranches] = useState<string[]>([])

  // User inputs
  const [userRank, setUserRank] = useState<number>(50000)
  const [userCategory, setUserCategory] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedRound, setSelectedRound] = useState<string>("")

  // Derived state
  const [availableRounds, setAvailableRounds] = useState<string[]>([])

  // Preference building
  const [preferences, setPreferences] = useState<PreferenceOption[]>([])
  const [preferencePage, setPreferencePage] = useState(1)
  const [newCollegeCode, setNewCollegeCode] = useState<string>("")
  const [newBranchCode, setNewBranchCode] = useState<string>("")
  const [collegeSearch, setCollegeSearch] = useState<string>("")
  const [courseSearch, setCourseSearch] = useState<string>("")
  const [isCollegeDropdownOpen, setIsCollegeDropdownOpen] = useState(false)
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false)

  // Choice Filler state
  const [isFillerOpen, setIsFillerOpen] = useState(false)
  const [selectedBranches, setSelectedBranches] = useState<string[]>(["CS & Allied"])
  const [fillerStrategy, setFillerStrategy] = useState<string>("dream_first")
  const [fillerLimit, setFillerLimit] = useState<string>("30")
  const [isGeneratingChoices, setIsGeneratingChoices] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<string>("")
  const [generationDetail, setGenerationDetail] = useState<string>("")

  // Simulation results
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isResultsOpen, setIsResultsOpen] = useState(false)
  const requiredProfileMissing = userRank <= 0 || !userCategory || !selectedYear || !selectedRound

  // Choice Filler list generator
  const generateChoices = async () => {
    if (requiredProfileMissing) {
      toast({
        title: "Complete your rank profile",
        description: "Enter your rank, then choose category and round to move forward.",
        variant: "destructive"
      })
      return
    }

    setIsGeneratingChoices(true)
    setGenerationStatus("Reading your profile")
    setGenerationDetail(`Rank ${userRank.toLocaleString()} | ${userCategory} | ${selectedYear} ${selectedRound}`)

    const eligibleCats = getEligibleCategories(userCategory)
    const requestedLimit = Math.max(5, parseInt(fillerLimit, 10) || 5)
    const getQualityScore = (collegeCode: string, collegeName: string, cutoff: number) => {
      const codeScore = COLLEGE_QUALITY_SCORES[collegeCode] ?? 0
      const name = collegeName.toLowerCase()
      const nameScore =
        name.includes("autonomous") ? 4 :
        name.includes("university") ? 3 :
        name.includes("institute of technology") ? 2 :
        name.includes("college of engineering") ? 1 : 0
      const demandProxy = Math.max(0, 30 - Math.log10(Math.max(cutoff, 1)) * 4)
      return codeScore || Math.round(45 + nameScore + demandProxy)
    }
    const getBranchScore = (course: string) => {
      const normalized = normalizeCourseName(course).toLowerCase()
      if (normalized.includes("computer science & engineering") || normalized.includes("computer science and engineering")) return 12
      if (normalized.includes("data science")) return 11
      if (normalized.includes("ai") || normalized.includes("artificial intelligence") || normalized.includes("machine learning")) return 10
      if (normalized.includes("information science")) return 9
      if (normalized.includes("cyber")) return 8
      if (normalized.includes("electronics")) return 6
      return 3
    }
    const yearCutoffs = cutoffs.filter(c => 
      c.year === selectedYear && 
      c.round === selectedRound &&
      eligibleCats.includes(c.category)
    )
    setGenerationStatus("Filtering cutoff records")
    setGenerationDetail(`Found ${yearCutoffs.length.toLocaleString()} rows for your category fallbacks in ${selectedRound}.`)

    if (yearCutoffs.length === 0) {
      toast({
        title: "No Data Available",
        description: "No cutoff data found for the selected year and category.",
        variant: "destructive"
      })
      setIsGeneratingChoices(false)
      setGenerationStatus("")
      setGenerationDetail("")
      return
    }

    const choiceMap = new Map<string, {
      collegeCode: string
      collegeName: string
      branchCode: string
      branchName: string
      cutoff: number
      category: string
      qualityScore: number
      id: string
    }>()

    yearCutoffs.forEach(c => {
      const key = `${c.institute_code}-${c.course}`
      let matches = false
      const courseLower = c.course.toLowerCase()
      
      if (selectedBranches.includes("CS & Allied")) {
        if (courseLower.includes("computer") || courseLower.includes("cs") || courseLower.includes("artificial") || 
            courseLower.includes("data science") || courseLower.includes("information science") || courseLower.includes("ise") || 
            courseLower.includes("is") || courseLower.includes("cyber") || courseLower.includes("software") || 
            courseLower.includes("machine learning") || courseLower.includes("ai") || courseLower.includes("ml") || 
            courseLower.includes("iot")) {
          matches = true
        }
      }
      if (selectedBranches.includes("Electronics & Electrical")) {
        if (courseLower.includes("electronics") || courseLower.includes("ec") || courseLower.includes("electrical") || 
            courseLower.includes("ee") || courseLower.includes("telecommunication") || courseLower.includes("instrumentation") ||
            courseLower.includes("ei")) {
          matches = true
        }
      }
      if (selectedBranches.includes("Mechanical & Allied")) {
        if (courseLower.includes("mechanical") || courseLower.includes("me") || courseLower.includes("aerospace") || 
            courseLower.includes("aeronautical") || courseLower.includes("automobile") || courseLower.includes("robotics")) {
          matches = true
        }
      }
      if (selectedBranches.includes("Civil & Allied")) {
        if (courseLower.includes("civil") || courseLower.includes("cv") || courseLower.includes("environmental")) {
          matches = true
        }
      }
      if (selectedBranches.includes("Biotech & Allied")) {
        if (courseLower.includes("biotech") || courseLower.includes("bio") || courseLower.includes("chemical") || courseLower.includes("bt")) {
          matches = true
        }
      }

      if (!matches) return

      const existing = choiceMap.get(key)
      if (!existing || c.cutoff_rank > existing.cutoff) {
        choiceMap.set(key, {
          collegeCode: c.institute_code,
          collegeName: c.institute,
          branchCode: c.course,
          branchName: normalizeCourseName(c.course),
          cutoff: c.cutoff_rank,
          category: c.category,
          qualityScore: getQualityScore(c.institute_code, c.institute, c.cutoff_rank),
          id: `${c.institute_code}-${c.course}`.replace(/\s+/g, ' ')
        })
      }
    })

    const allChoices = Array.from(choiceMap.values())
    setGenerationStatus("Building candidate pool")
    setGenerationDetail(`Matched ${allChoices.length.toLocaleString()} college-course options for ${selectedBranches.join(", ")}.`)

    if (allChoices.length === 0) {
      toast({
        title: "No Matching Options",
        description: "No options found matching your selected branch categories.",
        variant: "destructive"
      })
      setIsGeneratingChoices(false)
      setGenerationStatus("")
      setGenerationDetail("")
      return
    }

    const byQualityThenCutoff = (a: typeof allChoices[number], b: typeof allChoices[number]) => (
      b.qualityScore - a.qualityScore || a.cutoff - b.cutoff
    )
    let selectedChoices = allChoices

    if (fillerStrategy === "dream_first") {
      setGenerationStatus("Ranking by quality tiers")
      setGenerationDetail("Sorting dream, realistic, and safer backups by college strength and cutoff fit.")
      const limit = requestedLimit
      const dreamChoices = allChoices
        .filter(choice => choice.cutoff < userRank)
        .sort(byQualityThenCutoff)
      const realisticChoices = allChoices
        .filter(choice => choice.cutoff >= userRank)
        .sort(byQualityThenCutoff)
      const saferChoices = allChoices
        .filter(choice => choice.cutoff >= userRank + 15000)
        .sort(byQualityThenCutoff)
      const closestChoices = [...allChoices].sort((a, b) => (
        Math.abs(a.cutoff - userRank) - Math.abs(b.cutoff - userRank) ||
        b.qualityScore - a.qualityScore
      ))
      const picked = new Map<string, typeof allChoices[number]>()
      const addChoices = (choices: typeof allChoices, targetSize: number) => {
        choices.forEach(choice => {
          if (picked.size >= targetSize) return
          picked.set(`${choice.collegeCode}-${choice.branchCode}`, choice)
        })
      }

      const dreamCount = Math.min(Math.max(6, Math.floor(limit * 0.35)), Math.max(0, limit - 1))
      const safeCount = Math.min(Math.max(5, Math.floor(limit * 0.15)), saferChoices.length)
      addChoices(dreamChoices, dreamCount)
      addChoices(realisticChoices, Math.max(dreamCount, limit - safeCount))
      addChoices(saferChoices, limit)
      addChoices(closestChoices, limit)
      selectedChoices = Array.from(picked.values())
    } else if (fillerStrategy === "probability_centric") {
      setGenerationStatus("Ranking realistic choices")
      setGenerationDetail("Putting reachable colleges first, then sorting by college quality and cutoff distance.")
      const eligible = allChoices
        .filter(choice => choice.cutoff >= userRank)
        .sort((a, b) => b.qualityScore - a.qualityScore || Math.abs(a.cutoff - userRank) - Math.abs(b.cutoff - userRank))
      const missed = allChoices
        .filter(choice => choice.cutoff < userRank)
        .sort((a, b) => b.qualityScore - a.qualityScore || Math.abs(a.cutoff - userRank) - Math.abs(b.cutoff - userRank))
      selectedChoices = [...eligible, ...missed]
    } else if (fillerStrategy === "ai_lister") {
      setGenerationStatus("Preparing AI candidate shortlist")
      setGenerationDetail("Creating a compact shortlist with college, branch, cutoff, and quality signals.")
      const localAiOrder = [...allChoices].sort((a, b) => {
        const score = (choice: typeof allChoices[number]) => {
          const cutoffFit = choice.cutoff >= userRank
            ? Math.max(0, 24 - Math.abs(choice.cutoff - userRank) / 4000)
            : Math.max(-20, (choice.cutoff - userRank) / 2500)
          return choice.qualityScore * 12 + getBranchScore(choice.branchName) * 5 + cutoffFit
        }
        return score(b) - score(a)
      })
      selectedChoices = localAiOrder

      try {
        const aiPool = localAiOrder.slice(0, Math.max(80, Math.min(localAiOrder.length, requestedLimit * 2)))
        setGenerationStatus("Asking Nemotron AI")
        setGenerationDetail(`Sending ${aiPool.length.toLocaleString()} shortlisted options for placement/infra/faculty-aware ordering.`)
        const response = await fetch('/api/ai-lister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rank: userRank,
            category: userCategory,
            year: selectedYear,
            round: selectedRound,
            branches: selectedBranches,
            limit: Math.min(requestedLimit, aiPool.length),
            candidates: aiPool.map(choice => ({
              id: choice.id,
              collegeCode: choice.collegeCode,
              collegeName: choice.collegeName,
              branchName: choice.branchName,
              cutoff: choice.cutoff,
              category: choice.category,
              qualityScore: choice.qualityScore,
            })),
          }),
        })

        if (response.ok) {
          setGenerationStatus("Reading AI response")
          setGenerationDetail("Validating the AI order and merging any missing backup options.")
          const data = await response.json() as { orderedIds?: string[] }
          const aiIds = Array.isArray(data.orderedIds) ? data.orderedIds : []
          const byId = new Map(aiPool.map(choice => [choice.id, choice]))
          const used = new Set<string>()
          const aiChoices = aiIds
            .map(id => byId.get(id))
            .filter((choice): choice is typeof aiPool[number] => {
              if (!choice?.id || used.has(choice.id)) return false
              used.add(choice.id)
              return true
            })
          selectedChoices = [...aiChoices, ...localAiOrder.filter(choice => !choice.id || !used.has(choice.id))]
        } else {
          setGenerationStatus("Using local fallback")
          setGenerationDetail("Nemotron did not respond successfully, so the local quality model is finishing the list.")
          toast({
            title: "AI Lister fallback used",
            description: "Nemotron was unavailable, so the local quality model created the list.",
          })
        }
      } catch {
        setGenerationStatus("Using local fallback")
        setGenerationDetail("Nemotron could not be reached, so the local quality model is finishing the list.")
        toast({
          title: "AI Lister fallback used",
          description: "Nemotron could not be reached, so the local quality model created the list.",
        })
      }
    }

    setGenerationStatus("Applying generated list")
    setGenerationDetail(`Adding ${Math.min(requestedLimit, selectedChoices.length).toLocaleString()} options to your sheet.`)
    const finalChoices = selectedChoices.slice(0, requestedLimit)
    const newPrefs: PreferenceOption[] = finalChoices.map((c, idx) => ({
      id: `pref-filler-${Date.now()}-${idx}`,
      collegeCode: c.collegeCode,
      branchCode: c.branchCode,
      collegeName: c.collegeName,
      branchName: c.branchName,
      priority: idx + 1
    }))

    setPreferences(newPrefs)
    setPreferencePage(1)
    setIsFillerOpen(false)

    toast({
      title: "Priority Options Generated! ⚡",
      description: `Auto-generated ${newPrefs.length} choices for ${selectedRound}, with realistic and safer backups included.`
    })
    setIsGeneratingChoices(false)
    setGenerationStatus("")
    setGenerationDetail("")
  }

  const getCourseCode = (course: string) => {
    const cleaned = (course || '').replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim()
    const codeMatch = cleaned.match(/^([A-Z]{2})(?:\s|-)/)
    if (codeMatch) return codeMatch[1]
    if (/^[A-Z]{2}$/.test(cleaned)) return cleaned
    const rule = COURSE_CODE_RULES.find(([pattern]) => pattern.test(cleaned))
    return rule?.[1] ?? ""
  }

  const getCollegeCourseCode = (pref: PreferenceOption) => {
    if (pref.collegeCourse && !/[A-Z]\d{3}[A-Z]{3,}/.test(pref.collegeCourse)) return pref.collegeCourse
    const college = (pref.collegeCode || '').replace(/\s+/g, '').toUpperCase()
    const course = getCourseCode(pref.branchCode || pref.branchName)
    return course ? `${college}${course}` : college
  }

  const branchesByCollege = useMemo(() => {
    const branchMap = new Map<string, string[]>()
    const dedupe = new Map<string, Set<string>>()

    cutoffs.forEach(cutoff => {
      if (selectedYear && cutoff.year !== selectedYear) return
      const code = cutoff.institute_code
      if (!code || !cutoff.course) return

      if (!dedupe.has(code)) {
        dedupe.set(code, new Set<string>())
      }

      const seen = dedupe.get(code)!
      if (!seen.has(cutoff.course)) {
        seen.add(cutoff.course)
      }
    })

    dedupe.forEach((courses, code) => {
      branchMap.set(code, Array.from(courses).sort())
    })

    return branchMap
  }, [cutoffs, selectedYear])

  const eligibleCategories = useMemo(() => (
    userCategory ? getEligibleCategories(userCategory) : []
  ), [userCategory])

  const totalPreferencePages = Math.max(1, Math.ceil(preferences.length / preferencePageSize))
  const preferencePageStart = (preferencePage - 1) * preferencePageSize
  const visiblePreferences = useMemo(
    () => preferences.slice(preferencePageStart, preferencePageStart + preferencePageSize),
    [preferences, preferencePageStart, preferencePageSize]
  )

  const reorderVisiblePreferences = (newVisibleOrder: PreferenceOption[]) => {
    const updated = [...preferences]
    updated.splice(preferencePageStart, newVisibleOrder.length, ...newVisibleOrder)
    setPreferences(updated.map((p, i) => ({ ...p, priority: i + 1 })))
  }

  const pdfPreferenceRows = useMemo(() => (
    preferences.map(pref => [
      pref.priority.toString(),
      getCollegeCourseCode(pref),
      normalizeCourseName(pref.branchName || pref.branchCode),
      pref.collegeName,
      pref.courseFee && pref.courseFee !== 'Not specified' ? pref.courseFee : 'Not listed'
    ])
  ), [preferences])

  const safetyCutoffs = useMemo(() => (
    cutoffs.filter(cutoff =>
      cutoff.year === selectedYear &&
      eligibleCategories.includes(cutoff.category)
    )
  ), [cutoffs, selectedYear, eligibleCategories])

  const simulationCutoffs = useMemo(() => (
    selectedYear ? cutoffs.filter(cutoff => cutoff.year === selectedYear) : cutoffs
  ), [cutoffs, selectedYear])

  // Priority warnings for strategic choice filling order
  const priorityWarnings = useMemo(() => {
    const warnings = new Map<string, string>()
    if (visiblePreferences.length < 2) return warnings

    const prefCutoffs = visiblePreferences.map(pref => {
      const collegeCutoffs = cutoffs.filter(c => 
        c.institute_code.toUpperCase() === pref.collegeCode.toUpperCase() &&
        c.year === selectedYear &&
        eligibleCategories.includes(c.category)
      )
      
      let matchedCutoff: number | null = null
      if (collegeCutoffs.length > 0) {
        const cleanPrefCourse = (pref.branchCode || pref.branchName).toLowerCase().replace(/[^a-z0-9]/g, '')
        const matched = collegeCutoffs.filter(c => {
          const cleanCutoffCourse = c.course.toLowerCase().replace(/[^a-z0-9]/g, '')
          return cleanCutoffCourse.includes(cleanPrefCourse) || cleanPrefCourse.includes(cleanCutoffCourse)
        })
        if (matched.length > 0) {
          matchedCutoff = Math.max(...matched.map(c => c.cutoff_rank))
        } else {
          matchedCutoff = Math.max(...collegeCutoffs.map(c => c.cutoff_rank))
        }
      }

      return {
        id: pref.id,
        collegeName: pref.collegeName,
        branchName: pref.branchName,
        cutoff: matchedCutoff
      }
    })

    for (let i = 0; i < prefCutoffs.length; i++) {
      const itemI = prefCutoffs[i]
      if (itemI.cutoff === null) continue

      for (let j = i + 1; j < prefCutoffs.length; j++) {
        const itemJ = prefCutoffs[j]
        if (itemJ.cutoff === null) continue

        if (itemJ.cutoff < itemI.cutoff - 1500) {
          warnings.set(
            itemJ.id,
            `Strategic alert: this option has a harder historical cutoff (${itemJ.cutoff.toLocaleString()}) than option #${preferencePageStart + i + 1} (${itemI.collegeName} - ${itemI.branchName}, cutoff ${itemI.cutoff.toLocaleString()}). If you prefer this college/course, move it above the easier option so higher-priority allotment chances are not wasted. Keep easier backup choices below it.`
          )
        }
      }
    }

    return warnings
  }, [visiblePreferences, cutoffs, selectedYear, eligibleCategories, preferencePageStart])

  // Update available rounds when year changes
  useEffect(() => {
    if (selectedYear && cutoffs.length > 0) {
      const getOrder = (r: string) => {
        const up = r.toUpperCase()
        if (up === 'MOCK' || up === 'MOCK1' || up === 'MR1') return 0
        if (up === 'MOCK2' || up === 'MOCK_R2' || up === 'MR2') return 0.5
        if (up === 'R1') return 1
        if (up === 'R2') return 2
        if (up === 'R3' || up === 'EXT') return 3
        const num = parseInt(up.replace(/\D/g, '')) || 0
        return num || 99
      }

      const rounds = [...new Set(
        cutoffs
          .filter(c => String(c.year) === String(selectedYear))
          .map(c => c.round)
      )].sort((a, b) => getOrder(a) - getOrder(b))

      setAvailableRounds(rounds)
      if (rounds.length > 0) {
        if (!selectedRound || !rounds.includes(selectedRound)) {
          setSelectedRound(rounds[0])
        }
      } else {
        setSelectedRound("")
      }
    } else {
      setAvailableRounds([])
      setSelectedRound("")
    }
  }, [selectedYear, cutoffs])

  // Load preferences from Planner (via sessionStorage)
  useEffect(() => {
    const storedPrefs = sessionStorage.getItem('mockSimulatorPreferences')
    if (storedPrefs) {
      try {
        const parsedPrefs = JSON.parse(storedPrefs) as PreferenceOption[]
        if (parsedPrefs.length > 0) {
          setPreferences(parsedPrefs)
          toast({
            title: "Preferences Loaded! 📋",
            description: `Imported ${parsedPrefs.length} options from your uploaded PDF`
          })
          // Clear after loading to avoid re-loading on refresh
          sessionStorage.removeItem('mockSimulatorPreferences')
        }
      } catch (e) {
        console.error('Failed to parse stored preferences:', e)
      }
    }
  }, [toast])

  // Load cutoff data
  useEffect(() => {
    const loadData = async () => {
      try {
        setProgress(10)

        const urls = [
          '/data/kcet_cutoffs_consolidated.dat',
          '/kcet_cutoffs.dat',
          '/kcet_cutoffs_round3_2025.dat'
        ]

        let response: Response | null = null
        for (const url of urls) {
          const r = await fetch(url, { cache: 'no-store' })
          if (r.ok) {
            response = r
            break
          }
        }

        if (!response) throw new Error('Failed to load data')

        setProgress(40)
        const data: CutoffResponse = await response.json()
        setProgress(70)

        let processedData = data
        if (!data.cutoffs && Array.isArray(data)) {
          processedData = { cutoffs: data as unknown as CutoffData[] }
        }

        const normalizedCutoffs: CutoffData[] = processedData.cutoffs.map(item => ({
          institute: (item.institute ?? '').toString().trim(),
          institute_code: (item.institute_code ?? '').toString().trim().toUpperCase(),
          course: (item.course ?? '').toString().trim(),
          category: (item.category ?? '').toString().trim(),
          cutoff_rank: Number(item.cutoff_rank ?? 0),
          year: (item.year ?? '').toString().trim(),
          round: (item.round ?? '').toString().trim()
        }))

        setCutoffs(normalizedCutoffs)
        setProgress(85)

        // Extract unique values
        const years = [...new Set(normalizedCutoffs.map(c => c.year))].sort((a, b) => b.localeCompare(a))
        const categories = [...new Set(normalizedCutoffs.map(c => c.category))].sort()
        const branches = [...new Set(normalizedCutoffs.map(c => c.course))].sort()

        // Build college list with codes
        const collegeMap = new Map<string, string>()
        normalizedCutoffs.forEach(c => {
          if (c.institute_code && c.institute) {
            collegeMap.set(c.institute_code, c.institute)
          }
        })
        const colleges = Array.from(collegeMap.entries())
          .map(([code, name]) => ({ code, name }))
          .sort((a, b) => a.code.localeCompare(b.code))

        setAvailableYears(years)
        setAvailableCategories(categories)
        setAvailableColleges(colleges)
        setAvailableBranches(branches)

        // Set defaults from user's saved settings
        const savedSettings = loadSettings()

        // Year: use saved default if valid, otherwise latest
        const defaultYear = savedSettings.defaultYear && years.includes(savedSettings.defaultYear)
          ? savedSettings.defaultYear
          : years[0]
        if (years.length > 0) setSelectedYear(defaultYear)

        // Category: use saved default if valid, otherwise first
        const defaultCategory = savedSettings.defaultCategory && categories.includes(savedSettings.defaultCategory)
          ? savedSettings.defaultCategory
          : categories[0]
        if (categories.length > 0) setUserCategory(defaultCategory)

        setProgress(100)

        toast({
          title: "Data Loaded",
          description: `Loaded ${normalizedCutoffs.length.toLocaleString()} cutoff records`
        })

      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: "Error",
          description: "Failed to load cutoff data",
          variant: "destructive"
        })
      } finally {
        setTimeout(() => setLoading(false), 200)
      }
    }

    loadData()
  }, [toast])

  // Filter colleges based on search
  const filteredColleges = useMemo(() => {
    const query = collegeSearch.trim().toLowerCase()

    if (!query || newCollegeCode) {
      return availableColleges.slice(0, 30)
    }

    return availableColleges.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query)
    ).slice(0, 30)
  }, [availableColleges, collegeSearch, newCollegeCode])

  const filteredBranches = useMemo(() => {
    const query = courseSearch.trim().toLowerCase()
    const source = newCollegeCode ? availableBranches : []

    if (!query) {
      return source.slice(0, 30)
    }

    return source.filter(branch => {
      const normalized = normalizeCourseName(branch)
      return (
        branch.toLowerCase().includes(query) ||
        normalized.toLowerCase().includes(query)
      )
    }).slice(0, 30)
  }, [availableBranches, courseSearch, newCollegeCode])

  useEffect(() => {
    if (preferencePage > totalPreferencePages) {
      setPreferencePage(totalPreferencePages)
    }
  }, [preferencePage, totalPreferencePages])

  // Update available branches when college is selected
  useEffect(() => {
    if (newCollegeCode) {
      const uniqueBranches = branchesByCollege.get(newCollegeCode) ?? []
      setAvailableBranches(uniqueBranches)

      // Reset branch selection if current branch is not in new list
      if (newBranchCode && !uniqueBranches.includes(newBranchCode)) {
        setNewBranchCode("")
        setCourseSearch("")
      }
    } else {
      setAvailableBranches([])
      setCourseSearch("")
    }
  }, [newCollegeCode, branchesByCollege, newBranchCode])

  // Add preference
  const addPreference = () => {
    if (!newCollegeCode || !newBranchCode) {
      toast({
        title: "Missing Information",
        description: "Please select both college and branch",
        variant: "destructive"
      })
      return
    }

    const college = availableColleges.find(c => c.code === newCollegeCode)
    if (!college) return

    const newPref: PreferenceOption = {
      id: `pref-${Date.now()}`,
      collegeCode: newCollegeCode,
      branchCode: newBranchCode,
      collegeName: college.name,
      branchName: normalizeCourseName(newBranchCode),
      priority: preferences.length + 1
    }

    setPreferences([...preferences, newPref])
    setNewCollegeCode("")
    setNewBranchCode("")
    setCollegeSearch("")
    setCourseSearch("")
    setIsCollegeDropdownOpen(false)
    setIsCourseDropdownOpen(false)

    toast({
      title: "Preference Added",
      description: `Added ${college.name} - ${newBranchCode} as preference #${preferences.length + 1}`
    })
  }

  // Remove preference
  const removePreference = (id: string) => {
    const updated = preferences
      .filter(p => p.id !== id)
      .map((p, i) => ({ ...p, priority: i + 1 }))
    setPreferences(updated)
  }

  // Move preference
  const movePreference = (id: string, direction: 'up' | 'down') => {
    const index = preferences.findIndex(p => p.id === id)
    if (index === -1) return

    const newPrefs = [...preferences]
    if (direction === 'up' && index > 0) {
      [newPrefs[index], newPrefs[index - 1]] = [newPrefs[index - 1], newPrefs[index]]
    } else if (direction === 'down' && index < newPrefs.length - 1) {
      [newPrefs[index], newPrefs[index + 1]] = [newPrefs[index + 1], newPrefs[index]]
    }

    setPreferences(newPrefs.map((p, i) => ({ ...p, priority: i + 1 })))
  }

  // Run simulation
  const runSimulation = () => {
    if (requiredProfileMissing) {
      toast({
        title: "Complete your rank profile",
        description: "Enter your rank, then choose category and round to move forward.",
        variant: "destructive"
      })
      return
    }

    if (preferences.length === 0) {
      toast({
        title: "No Preferences",
        description: "Please add at least one preference before simulating",
        variant: "destructive"
      })
      return
    }

    setIsSimulating(true)

    // Simulate with small delay for UX
    setTimeout(() => {
      // If a specific round is selected, filter cutoffs for THAT round only
      // But we need to pass a valid structure to simulateAllotment which expects standard CutoffData
      // Actually, simulateAllotment runs for ALL available rounds for the year.
      // We should let it run, but then focus the UI on the user's selected round.

      const input: SimulationInput = {
        userRank,
        category: userCategory,
        year: selectedYear,
        preferences
      }

      const result = simulateAllotment(input, simulationCutoffs)
      setSimulationResult(result)
      setIsResultsOpen(true)
      setIsSimulating(false)

      // Find result for selected round
      const selectedRoundResult = result.roundResults.find(r => r.round === selectedRound)

      if (selectedRoundResult?.allottedCollege) {
        toast({
          title: `Allotment in ${selectedRound}! 🎉`,
          description: `You would get: ${selectedRoundResult.allottedCollege.collegeName} (${selectedRoundResult.allottedCollege.branchName})`
        })
      } else if (selectedRoundResult) {
        toast({
          title: `No Seat in ${selectedRound}`,
          description: "Based on previous year data, you would not get a seat in this specific round.",
          variant: "destructive"
        })
      } else if (result.summary.bestOutcome) {
        // Fallback if no specific round selected or found
        toast({
          title: "Simulation Complete! 🎉",
          description: `Best outcome: ${result.summary.bestOutcome.college.collegeName} (Preference #${result.summary.bestOutcome.preferenceNumber})`
        })
      } else {
        toast({
          title: "Simulation Complete",
          description: "No seat allotted based on your preferences and rank",
          variant: "destructive"
        })
      }
    }, 500)
  }

  // Get safety badge for a preference
  const visiblePreferenceSafety = useMemo(() => {
    const levels = new Map<string, ReturnType<typeof getPreferenceSafetyLevel>>()

    visiblePreferences.forEach(pref => {
      levels.set(
        pref.id,
        getPreferenceSafetyLevel(userRank, pref, safetyCutoffs, selectedYear, userCategory)
      )
    })

    return levels
  }, [visiblePreferences, userRank, safetyCutoffs, selectedYear, userCategory])

  const getSafetyBadge = (pref: PreferenceOption) => {
    const level = visiblePreferenceSafety.get(pref.id) ?? 'unknown'

    switch (level) {
      case 'safe':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Safe</Badge>
      case 'moderate':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">Likely</Badge>
      case 'risky':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20">Risky</Badge>
      default:
        return <Badge variant="outline" className="text-muted-foreground border-white/10" title="No matching cutoff data found for this branch in the selected year/category">No data</Badge>
    }
  }

  const focusedRoundResult = simulationResult?.roundResults.find(r => r.round === selectedRound)
  const focusedOutcome = focusedRoundResult?.allottedCollege
    ? {
      round: focusedRoundResult.round,
      college: focusedRoundResult.allottedCollege,
      preferenceNumber: focusedRoundResult.allottedPreferenceNumber ?? 0
    }
    : simulationResult?.summary.bestOutcome

  const downloadSimulationPdf = () => {
    if (!isUnlocked()) {
      toast({
        title: "Premium Feature",
        description: "PDF export is available for premium users. Unlock to download your simulation results.",
        variant: "destructive"
      })
      return
    }
    if (preferences.length === 0) {
      toast({
        title: "No options to export",
        description: "Add preferences or generate choices before downloading the PDF.",
        variant: "destructive"
      })
      return
    }

    const doc = new jsPDF({ orientation: "landscape" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const now = new Date()
    const selectedRoundResult = simulationResult?.roundResults.find(r => r.round === selectedRound)
    const selectedOutcome = selectedRoundResult?.allottedCollege
    const bestOutcome = simulationResult?.summary.bestOutcome

    const addFooter = () => {
      const pages = doc.getNumberOfPages()
      for (let page = 1; page <= pages; page += 1) {
        doc.setPage(page)
        doc.setFontSize(8)
        doc.setTextColor(115, 123, 140)
        doc.text("KCET Coded Mock Simulator - verify final decisions with official KEA data.", 14, pageHeight - 9)
        doc.text(`Page ${page} of ${pages}`, pageWidth - 36, pageHeight - 9)
      }
    }

    doc.setFillColor(20, 25, 43)
    doc.rect(0, 0, pageWidth, 42, "F")
    doc.setFillColor(99, 102, 241)
    doc.roundedRect(14, 10, 42, 8, 4, 4, "F")
    doc.setFillColor(14, 165, 233)
    doc.roundedRect(50, 10, 30, 8, 4, 4, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(23)
    doc.text("KCET Mock Allotment Report", 14, 27)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.text(`Generated ${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`, pageWidth - 78, 16)
    doc.text("Desktop mode recommended for editing large option lists.", pageWidth - 96, 24)

    const cardY = 52
    const cards = [
      ["Rank", userRank > 0 ? userRank.toLocaleString() : "Not set"],
      ["Category", userCategory || "Not set"],
      ["Year / Round", `${selectedYear || "Not set"} / ${selectedRound || "Not set"}`],
      ["Options", preferences.length.toLocaleString()]
    ]

    cards.forEach(([label, value], index) => {
      const x = 14 + index * 68
      doc.setFillColor(index === 0 ? 238 : 248, index === 0 ? 242 : 250, index === 0 ? 255 : 252)
      doc.roundedRect(x, cardY, 58, 24, 3, 3, "F")
      doc.setTextColor(90, 97, 117)
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.text(label, x + 5, cardY + 8)
      doc.setTextColor(20, 25, 43)
      doc.setFontSize(13)
      doc.text(value, x + 5, cardY + 18)
    })

    doc.setFillColor(selectedOutcome ? 220 : bestOutcome ? 235 : 254, selectedOutcome ? 252 : bestOutcome ? 245 : 226, selectedOutcome ? 231 : bestOutcome ? 255 : 226)
    doc.roundedRect(14, 85, pageWidth - 28, 27, 3, 3, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(20, 25, 43)
    doc.text(selectedOutcome ? `${selectedRound} Outcome` : bestOutcome ? "Best Possible Outcome" : "No Seat Allotted Yet", 20, 96)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    const outcomeText = selectedOutcome
      ? `${selectedOutcome.collegeName} - ${normalizeCourseName(selectedOutcome.branchName || selectedOutcome.branchCode)}`
      : bestOutcome
        ? `${bestOutcome.college.collegeName} - ${normalizeCourseName(bestOutcome.college.branchName || bestOutcome.college.branchCode)}`
        : simulationResult
          ? "No option matched historical cutoff data for this profile."
          : "Run the simulation to include round-wise allotment results."
    doc.text(doc.splitTextToSize(outcomeText, pageWidth - 44), 20, 105)

    autoTable(doc, {
      startY: 122,
      head: [["Opt", "College Course", "Course", "College", "Fee"]],
      body: pdfPreferenceRows,
      theme: "striped",
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 247, 251] },
      styles: { fontSize: 7.4, cellPadding: 2.2, overflow: "linebreak", valign: "middle" },
      columnStyles: {
        0: { cellWidth: 13, halign: "center" },
        1: { cellWidth: 28 },
        2: { cellWidth: 68 },
        3: { cellWidth: 132 },
        4: { cellWidth: 26 }
      },
      margin: { left: 14, right: 14 }
    })

    const afterPrefsY = ((doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 122) + 10
    if (simulationResult?.roundResults.length) {
      autoTable(doc, {
        startY: afterPrefsY,
        head: [["Round", "Allotted Preference", "College", "Course", "Cutoff"]],
        body: simulationResult.roundResults.map(round => [
          round.round,
          round.allottedPreferenceNumber ? `#${round.allottedPreferenceNumber}` : "None",
          round.allottedCollege?.collegeName || "No allotment",
          round.allottedCollege ? normalizeCourseName(round.allottedCollege.branchName || round.allottedCollege.branchCode) : "-",
          round.cutoffRank ? round.cutoffRank.toLocaleString() : "-"
        ]),
        theme: "grid",
        headStyles: { fillColor: [14, 165, 233], textColor: 255, fontStyle: "bold" },
        styles: { fontSize: 7.4, cellPadding: 2.1, overflow: "linebreak" },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 34 },
          2: { cellWidth: 128 },
          3: { cellWidth: 72 },
          4: { cellWidth: 22, halign: "right" }
        },
        margin: { left: 14, right: 14 }
      })
    }

    addFooter()
    doc.save(`kcet_mock_simulation_rank_${userRank || "profile"}.pdf`)
    toast({
      title: "PDF downloaded",
      description: "Your mock simulation report is ready."
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Mock Simulator</h1>
          <p className="text-muted-foreground">Loading cutoff data...</p>
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-center">
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SEO
        title="KCET Mock Allotment Simulator 2026 – Simulate Seat Allotment"
        description="Simulate your KCET 2026 seat allotment using real historical cutoff data. Enter your rank, add college preferences, and see which seat you'd get in each counseling round — free mock simulator."
        url="https://kcetcoded.dev/mock-simulator"
        keywords="KCET mock allotment, KCET seat simulator, KCET 2026 seat allotment, KCET counseling simulator, mock counseling KCET, KCET preference list"
      />
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              Mock Simulator
            </h1>
            <p className="text-muted-foreground">
              Set your rank profile, build the option-entry sheet, then simulate the selected round.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-white/10">
              {cutoffs.length.toLocaleString()} records
            </Badge>
            <Button
              variant="outline"
              onClick={downloadSimulationPdf}
              disabled={preferences.length === 0}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button
              onClick={runSimulation}
              disabled={preferences.length === 0 || isSimulating}
            >
              <Play className="h-4 w-4 mr-2" />
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </div>
        </div>

        <Alert className="border-sky-500/25 bg-sky-500/10 text-sky-100">
          <Info className="h-4 w-4" />
          <AlertTitle>Best on desktop</AlertTitle>
          <AlertDescription>
            The simulator works best on a desktop screen or mobile desktop mode, especially while editing large option lists. It stays smoother on low-end devices by rendering the option list in small pages and optimizing the simulation path.
          </AlertDescription>
        </Alert>

        <Card className="border-white/10 bg-muted/20">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="rank">Rank</Label>
                <Input
                  id="rank"
                  type="number"
                  value={userRank}
                  onChange={(e) => setUserRank(parseInt(e.target.value) || 0)}
                  placeholder="Enter rank"
                  min={1}
                  className="h-10 font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={userCategory} onValueChange={setUserCategory}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Round</Label>
                <Select
                  value={selectedRound}
                  onValueChange={setSelectedRound}
                  disabled={!selectedYear || availableRounds.length === 0}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={availableRounds.length === 0 ? "Select year first" : "Select round"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRounds.map(round => (
                      <SelectItem key={round} value={round}>{round}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-visible border-white/10 bg-background/95 shadow-xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table className="min-w-[1000px]">
                <TableHeader>
                  <TableRow className="bg-muted/60 hover:bg-muted/60">
                    <TableHead colSpan={8} className="h-auto px-5 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-foreground">Option Entry Simulator Sheet</p>
                          <p className="text-sm font-normal text-muted-foreground">
                            Search institution and course here, then add rows in option-entry order. Drag rows using the handles to reorder.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => setIsUploadDialogOpen(true)}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-primary/30 text-primary hover:bg-primary/10"
                            onClick={() => setIsFillerOpen(true)}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Smart Choice Filler
                          </Button>
                          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                            {preferences.length} options
                          </Badge>
                        </div>
                      </div>
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-card hover:bg-card">
                    <TableHead colSpan={3} className="w-[380px]">Institution Search</TableHead>
                    <TableHead colSpan={4} className="w-[420px]">Course Search</TableHead>
                    <TableHead className="w-[120px]">Add</TableHead>
                  </TableRow>
                </TableHeader>
                <tbody>
                  <TableRow className="align-top bg-muted/20 hover:bg-muted/20">
                    <TableCell colSpan={3} className="relative">
                      <Search className="absolute left-5 top-5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="h-10 pl-9"
                        placeholder="Institution name or code"
                        value={collegeSearch}
                        onChange={(e) => {
                          setCollegeSearch(e.target.value)
                          if (newCollegeCode) {
                            setNewCollegeCode("")
                            setNewBranchCode("")
                            setCourseSearch("")
                          }
                          setIsCollegeDropdownOpen(true)
                        }}
                        onFocus={() => setIsCollegeDropdownOpen(true)}
                        onBlur={() => window.setTimeout(() => setIsCollegeDropdownOpen(false), 120)}
                      />
                      {isCollegeDropdownOpen && !newCollegeCode && filteredColleges.length > 0 && (
                        <div className="absolute left-4 right-4 top-14 z-50 max-h-72 overflow-y-auto rounded-md border border-white/10 bg-popover shadow-2xl">
                          {filteredColleges.map(college => (
                            <button
                              key={college.code}
                              type="button"
                              className="w-full border-b border-white/5 px-3 py-3 text-left text-sm last:border-0 hover:bg-primary/10"
                              onMouseDown={(e) => {
                                e.preventDefault()
                                setNewCollegeCode(college.code)
                                setNewBranchCode("")
                                setCourseSearch("")
                                setCollegeSearch(`${college.code} - ${college.name}`)
                                setIsCollegeDropdownOpen(false)
                                setIsCourseDropdownOpen(true)
                              }}
                            >
                              <span className="block font-mono font-bold text-primary">{college.code}</span>
                              <span className="block text-foreground/80">{college.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell colSpan={4} className="relative">
                      <Search className="absolute left-5 top-5 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="h-10 pl-9"
                        placeholder={newCollegeCode ? "Course name or code" : "Select institution first"}
                        value={courseSearch}
                        disabled={!newCollegeCode}
                        onChange={(e) => {
                          setCourseSearch(e.target.value)
                          setNewBranchCode("")
                          setIsCourseDropdownOpen(true)
                        }}
                        onFocus={() => newCollegeCode && setIsCourseDropdownOpen(true)}
                        onBlur={() => window.setTimeout(() => setIsCourseDropdownOpen(false), 120)}
                      />
                      {isCourseDropdownOpen && newCollegeCode && !newBranchCode && filteredBranches.length > 0 && (
                        <div className="absolute left-4 right-4 top-14 z-50 max-h-72 overflow-y-auto rounded-md border border-white/10 bg-popover shadow-2xl">
                          {filteredBranches.map(branch => {
                            const normalized = normalizeCourseName(branch)
                            return (
                              <button
                                key={branch}
                                type="button"
                                className="w-full border-b border-white/5 px-3 py-3 text-left text-sm last:border-0 hover:bg-primary/10"
                                onMouseDown={(e) => {
                                  e.preventDefault()
                                  setNewBranchCode(branch)
                                  setCourseSearch(normalized)
                                  setIsCourseDropdownOpen(false)
                                }}
                              >
                                <span className="block font-medium text-foreground">{normalized}</span>
                                {normalized !== branch && (
                                  <span className="block text-xs text-muted-foreground">{branch}</span>
                                )}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={addPreference}
                        disabled={!newCollegeCode || !newBranchCode}
                        size="sm"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow className="bg-muted/60 hover:bg-muted/60">
                    <TableHead className="w-[40px]"></TableHead>
                    <TableHead>Optn. No</TableHead>
                    <TableHead>College Course</TableHead>
                    <TableHead>Course Name</TableHead>
                  <TableHead className="hidden xl:table-cell">Course Fee per Annum(Rs)</TableHead>
                    <TableHead>College Name</TableHead>
                    <TableHead>Safety</TableHead>
                    <TableHead>Controls</TableHead>
                  </TableRow>
                </tbody>

                {isParsing ? (
                   <tbody>
                     <TableRow>
                       <TableCell colSpan={8} className="h-48 text-center p-8">
                         <div className="space-y-4 max-w-md mx-auto">
                           <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                           <div>
                             <p className="text-sm font-medium text-foreground">Parsing {uploadFileName}...</p>
                             <p className="text-xs text-muted-foreground">Extracting your option entries</p>
                           </div>
                           <Progress value={parseProgress} className="w-full h-1.5" />
                         </div>
                       </TableCell>
                     </TableRow>
                   </tbody>
                 ) : preferences.length === 0 ? (
                   <tbody>
                     <TableRow>
                       <TableCell colSpan={8} className="h-48 text-center text-muted-foreground p-8">
                         <div className="grid md:grid-cols-2 gap-6 items-center max-w-2xl mx-auto">
                           <div className="space-y-2 border-r border-white/10 pr-6 text-left">
                             <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                               <Plus className="h-4 w-4 text-primary" />
                               Option 1: Add Manually
                             </h4>
                             <p className="text-xs text-muted-foreground">
                               Search for institutions and courses using the search bars above, then click 'Add' to build your preference list row-by-row.
                             </p>
                           </div>
                           <div
                             className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                               isDragging
                                 ? 'border-primary bg-primary/5'
                                 : 'border-white/10 hover:border-primary/50'
                             }`}
                             onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                             onDragLeave={() => setIsDragging(false)}
                             onDrop={handleUploadDrop}
                             onClick={() => fileInputRef.current?.click()}
                           >
                             <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                             <h4 className="text-sm font-semibold text-foreground">Option 2: Upload PDF</h4>
                             <p className="text-xs text-muted-foreground mt-1">
                               Drag & drop your KEA Option Entry PDF here, or click to browse.
                             </p>
                             <input
                               ref={fileInputRef}
                               type="file"
                               accept=".pdf"
                               onChange={handleUploadFileChange}
                               className="hidden"
                             />
                           </div>
                         </div>
                       </TableCell>
                     </TableRow>
                   </tbody>
                 ) : (
                  <Reorder.Group
                    values={visiblePreferences}
                    onReorder={reorderVisiblePreferences}
                    as="tbody"
                  >
                    {visiblePreferences.map((pref, pageIndex) => {
                      const index = preferencePageStart + pageIndex
                      const warning = priorityWarnings.get(pref.id)
                      return (
                        <Reorder.Item
                          key={pref.id}
                          value={pref}
                          as="tr"
                          className="group border-b border-white/5 hover:bg-muted/10 transition-colors"
                        >
                          <TableCell className="cursor-grab active:cursor-grabbing text-muted-foreground select-none">
                            <GripVertical className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                          </TableCell>
                          <TableCell className="font-mono text-lg font-bold text-primary">
                            {pref.priority}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="rounded-full border-white/10 px-3 py-1 font-mono text-xs font-bold text-foreground">
                              {getCollegeCourseCode(pref)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="max-w-[300px] font-semibold uppercase leading-snug line-clamp-2" title={pref.branchName}>
                                {normalizeCourseName(pref.branchName || pref.branchCode)}
                              </p>
                              {warning && (
                                <div className="mt-2 max-w-[320px] rounded-md border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-amber-300">
                                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
                                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                    Order note
                                  </div>
                                  <p className="mt-1 text-xs font-medium leading-relaxed text-amber-100/90">
                                    {warning}
                                  </p>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden font-mono font-medium text-muted-foreground xl:table-cell">
                            {pref.courseFee && pref.courseFee !== 'Not specified' ? pref.courseFee : 'Not listed'}
                          </TableCell>
                          <TableCell>
                            <p className="max-w-[280px] font-semibold leading-snug line-clamp-3" title={pref.collegeName}>
                              {pref.collegeName}
                            </p>
                          </TableCell>
                          <TableCell>{getSafetyBadge(pref)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => movePreference(pref.id, 'up')}
                                disabled={index === 0}
                                className="h-8 w-8"
                                title="Move up"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => movePreference(pref.id, 'down')}
                                disabled={index === preferences.length - 1}
                                className="h-8 w-8"
                                title="Move down"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removePreference(pref.id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600"
                                title="Remove"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </Reorder.Item>
                      )
                    })}
                  </Reorder.Group>
                )}
              </Table>
            </div>
            {preferences.length > preferencePageSize && (
              <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {preferencePageStart + 1}-{Math.min(preferencePageStart + visiblePreferences.length, preferences.length)} of {preferences.length} options
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreferencePage(page => Math.max(1, page - 1))}
                    disabled={preferencePage === 1}
                  >
                    Previous
                  </Button>
                  <span className="font-mono text-xs">
                    {preferencePage} / {totalPreferencePages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreferencePage(page => Math.min(totalPreferencePages, page + 1))}
                    disabled={preferencePage === totalPreferencePages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isFillerOpen} onOpenChange={setIsFillerOpen}>
          <DialogContent className="flex max-h-[88vh] max-w-3xl flex-col overflow-hidden border-primary/30 bg-background p-0 text-foreground">
            <DialogHeader className="shrink-0 border-b border-white/10 px-6 py-4">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                Smart Choice Filler
              </DialogTitle>
              <DialogDescription>
                Auto-generate a strategic priority list matching your rank, category, round, preferred branches, and college quality signals.
              </DialogDescription>
            </DialogHeader>
            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-4">
              {requiredProfileMissing && (
                <Alert className="border-amber-500/30 bg-amber-500/10 text-amber-200">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Rank profile required</AlertTitle>
                  <AlertDescription>
                    Enter your rank, then choose category and round to move forward.
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="border-sky-500/25 bg-sky-500/10 text-sky-100">
                <Info className="h-4 w-4" />
                <AlertTitle>Smart Choice guidance and disclaimer</AlertTitle>
                <div className="mt-2 space-y-3 text-sm leading-relaxed text-sky-50/90">
                  <p>
                    This filler uses your rank, category, year, round, selected branch streams, maximum option count, historical cutoff matches, course fit, and college-quality signals to build the option-entry list.
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <strong className="text-sky-50">Branch streams:</strong> filters the courses before ranking, so only your selected fields are added.
                    </div>
                    <div>
                      <strong className="text-sky-50">Maximum options:</strong> adds the exact count you choose when enough matching choices exist.
                    </div>
                    <div>
                      <strong className="text-sky-50">Quality-first:</strong> groups dream, realistic, and safe choices, then puts stronger colleges higher in each group.
                    </div>
                    <div>
                      <strong className="text-sky-50">Realistic first:</strong> starts with choices closer to your rank, while still prioritizing college quality over tiny cutoff differences.
                    </div>
                    <div className="md:col-span-2">
                      <strong className="text-sky-50">AI Quality Lister:</strong> sends a compact shortlisted set to Nemotron AI for placement, infrastructure, faculty, reputation, branch demand, and cutoff-fit ordering. If the API is slow or unavailable, it falls back to the local quality model.
                    </div>
                  </div>
                  <p className="text-sky-100/75">
                    This is guidance, not an official KEA result or a guarantee of seat allotment, placements, faculty quality, or infrastructure. Verify final choices with official KEA data and current college sources. Best used on desktop or mobile desktop mode for large lists.
                  </p>
                </div>
              </Alert>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">1. Select Target Branch Streams</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "CS & Allied", name: "Computer Science & Allied (CSE, AIML, AI, DS, CSBS, Cybersecurity)" },
                    { id: "Electronics & Electrical", name: "Electronics & Electrical (ECE, EEE, EIE, Telecom)" },
                    { id: "Mechanical & Allied", name: "Mechanical & Allied (Mechanical, Aerospace, Robotics)" },
                    { id: "Civil & Allied", name: "Civil & Allied (Civil, Environmental)" },
                    { id: "Biotech & Allied", name: "Biotech & Chemical" }
                  ].map(category => {
                    const isChecked = selectedBranches.includes(category.id)
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedBranches(selectedBranches.filter(b => b !== category.id))
                          } else {
                            setSelectedBranches([...selectedBranches, category.id])
                          }
                        }}
                        className={`flex items-start gap-3 p-3 rounded-lg border text-left text-sm transition-all hover:bg-muted/50 ${
                          isChecked
                            ? "border-primary bg-primary/5 text-foreground font-medium shadow-md shadow-primary/5"
                            : "border-white/10 bg-transparent text-muted-foreground"
                        }`}
                      >
                        <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          isChecked ? "border-primary bg-primary text-primary-foreground" : "border-white/20"
                        }`}>
                          {isChecked && <Plus className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span>{category.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">2. Strategy & Rule</Label>
                  <Select value={fillerStrategy} onValueChange={setFillerStrategy}>
                    <SelectTrigger className="h-10 border-white/10">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dream_first">
                        Quality-first Tier Order
                      </SelectItem>
                      <SelectItem value="probability_centric">
                        Realistic Cutoffs First
                      </SelectItem>
                      <SelectItem value="ai_lister">
                        AI Quality Lister
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fillerStrategy === "dream_first" 
                      ? "Quality-first: ranks stronger colleges first inside dream, realistic, and safe groups."
                      : fillerStrategy === "probability_centric"
                        ? "Realistic-first: starts with colleges you can realistically get, ranked by quality before cutoff closeness."
                        : "AI Lister: uses web-informed college quality, branch demand, and cutoff fit to build a stronger order."}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold">3. Maximum Options to Add</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={fillerLimit}
                      onChange={(e) => setFillerLimit(e.target.value.replace(/\D/g, ""))}
                      placeholder="195"
                      className="h-10 w-28 border-white/10 font-mono"
                    />
                    <span className="text-sm text-muted-foreground">colleges & courses</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generates exactly the number you choose when enough matching options are available. The page stays smooth by rendering the list in small pages.
                  </p>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-xs text-amber-500 flex gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Tip:</strong> Quality-first order uses a curated college-strength score plus cutoff fit. You can still move rows manually if your personal preference differs.
                </div>
              </div>

              {isGeneratingChoices && (
                <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 animate-pulse text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{generationStatus || "Generating options"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{generationDetail || "Preparing the best option-entry order..."}</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-background/70">
                        <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex shrink-0 justify-end gap-3 border-t border-white/10 px-6 py-4">
              <Button variant="ghost" onClick={() => setIsFillerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={generateChoices} disabled={selectedBranches.length === 0 || isGeneratingChoices} className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold">
                {isGeneratingChoices ? "Generating..." : "Generate Choices"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
          {simulationResult && (
            <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto border-primary/30">
              <DialogHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <DialogTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Simulation Results
                  </DialogTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadSimulationPdf}
                    className="border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <DialogDescription>
                  Based on {selectedYear} cutoffs for {userCategory} category at rank {userRank.toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div>
                <Tabs defaultValue="summary">
                  <TabsList className="mb-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="rounds">Round-wise</TabsTrigger>
                    <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary">
                    {focusedOutcome ? (
                      <div className="space-y-4">
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-700 dark:text-green-300">
                            {focusedRoundResult ? `${selectedRound} Outcome` : 'Best Possible Outcome'}
                          </AlertTitle>
                          <AlertDescription className="text-green-600 dark:text-green-400">
                            <strong>{focusedOutcome.college.collegeName}</strong>
                            <br />
                            {focusedOutcome.college.branchName}
                            <br />
                            <span className="text-sm">
                              Preference #{focusedOutcome.preferenceNumber} - {focusedRoundResult ? `Selected round ${focusedOutcome.round}` : `Best in ${focusedOutcome.round}`}
                            </span>
                          </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-4 border rounded-lg">
                            <p className="text-2xl font-bold text-primary">
                              {simulationResult.summary.totalRoundsWithAllotment}
                            </p>
                            <p className="text-sm text-muted-foreground">Rounds with Seat</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <p className="text-2xl font-bold text-primary">
                              #{focusedOutcome.preferenceNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">{focusedRoundResult ? 'Selected Round Pref' : 'Best Preference'}</p>
                          </div>
                          <div className="p-4 border rounded-lg">
                            <p className="text-2xl font-bold text-primary">
                              {simulationResult.summary.consistentAllotment ? '✓' : '~'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {simulationResult.summary.consistentAllotment ? 'Consistent' : 'Varies'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-700 dark:text-red-300">No Seat Allotted</AlertTitle>
                        <AlertDescription className="text-red-600 dark:text-red-400">
                          Based on historical data, none of your preferences would result in a seat allotment.
                          Consider adding more preferences or colleges with higher cutoffs.
                        </AlertDescription>
                      </Alert>
                    )}
                  </TabsContent>

                  <TabsContent value="rounds" className="mt-4">
                    <div className="relative space-y-0 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      {simulationResult.roundResults.map((round, i) => (
                        <div key={round.round} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active mb-8 last:mb-0">
                          {/* Icon */}
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            {round.allottedCollege ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>

                          {/* Card */}
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                            <div className="flex items-center justify-between mb-1">
                              <div className="font-bold text-white/90">{round.round}</div>
                              <Badge variant={round.allottedCollege ? 'default' : 'outline'} className={round.allottedCollege ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'text-muted-foreground'}>
                                {round.allottedCollege ? 'Allotted' : 'Not Allotted'}
                              </Badge>
                            </div>
                            {round.allottedCollege ? (
                              <div className="space-y-1">
                                <div className="font-semibold text-lg text-primary">{round.allottedCollege.collegeName}</div>
                                <div className="text-sm text-white/70">{round.allottedCollege.branchName}</div>
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="outline" className="text-xs">Pref #{round.allottedPreferenceNumber}</Badge>
                                  <Badge variant="outline" className="text-xs">Cutoff: {round.cutoffRank?.toLocaleString()}</Badge>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No seat allotted in this round based on your priorities.
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="details">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>College</TableHead>
                            <TableHead>Branch</TableHead>
                            {simulationResult.roundResults.map(r => (
                              <TableHead key={r.round} className="text-center">{r.round}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {preferences.map((pref, idx) => (
                            <TableRow key={pref.id}>
                              <TableCell className="font-medium">{idx + 1}</TableCell>
                              <TableCell className="max-w-[150px] truncate">{pref.collegeName}</TableCell>
                              <TableCell className="max-w-[100px] truncate">{pref.branchName}</TableCell>
                              {simulationResult.roundResults.map(r => {
                                const detail = r.eligibilityDetails.find(d => d.preference.id === pref.id)
                                return (
                                  <TableCell key={r.round} className="text-center" title={detail?.reason}>
                                    {detail?.isEligible ? (
                                      <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-400 mx-auto" />
                                    )}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          )}
        </Dialog>

        <Dialog open={isUploadDialogOpen} onOpenChange={(open) => {
          setIsUploadDialogOpen(open);
          if (!open) clearUploadData();
        }}>
          <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden border-primary/30 bg-background p-0 text-foreground">
            <DialogHeader className="shrink-0 border-b border-white/10 px-6 py-4">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Upload className="h-5 w-5 text-primary" />
                Import KEA Option Entry PDF
              </DialogTitle>
              <DialogDescription>
                Upload your downloaded Option Entry PDF from the KEA portal to import your preference choices.
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
              {/* Upload section */}
              {uploadedOptions.length === 0 && !isParsing && (
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-white/10 hover:border-primary/50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    const files = e.dataTransfer.files;
                    if (files.length > 0) processUploadFile(files[0]);
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf';
                    input.onchange = (e) => {
                      const files = (e.target as HTMLInputElement).files;
                      if (files && files.length > 0) processUploadFile(files[0]);
                    };
                    input.click();
                  }}
                >
                  <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Drag and drop your PDF here</h3>
                  <p className="text-muted-foreground mb-4">or click to browse from your device</p>
                </div>
              )}

              {/* Parsing Progress */}
              {isParsing && (
                <div className="text-center py-12 space-y-4">
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Parsing {uploadFileName}...</p>
                    <p className="text-sm text-muted-foreground">Extracting your option entries</p>
                  </div>
                  <Progress value={parseProgress} className="w-full max-w-md mx-auto" />
                </div>
              )}

              {/* Parse Error */}
              {parseError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Parsing PDF</AlertTitle>
                  <AlertDescription>{parseError}</AlertDescription>
                </Alert>
              )}

              {/* Preview of options */}
              {uploadedOptions.length > 0 && !isParsing && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/20 border border-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-foreground">{uploadFileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {uploadedOptions.length} choices successfully extracted
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={clearUploadData}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear PDF
                    </Button>
                  </div>

                  <div className="border border-white/10 rounded-lg overflow-hidden">
                    <div className="max-h-72 overflow-y-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-20 font-bold text-center">Optn. No</TableHead>
                            <TableHead className="w-28 font-bold">College Course</TableHead>
                            <TableHead className="font-bold">Course Name</TableHead>
                            <TableHead className="w-48 font-bold">Course Fee per Annum(Rs)</TableHead>
                            <TableHead className="font-bold">College Name</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uploadedOptions.map((option, index) => (
                            <TableRow key={option.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                              <TableCell className="text-center font-medium">
                                {option.priority}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-mono text-xs">
                                  {option.collegeCourse}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-medium">
                                {option.branchName}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {option.courseFee || 'Not specified'}
                              </TableCell>
                              <TableCell className="text-sm">
                                {option.collegeName}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="p-4 bg-muted/30 border border-white/5 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Total Options:</span>
                        <span className="ml-2 font-semibold text-foreground">{uploadedOptions.length}</span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Unique Colleges:</span>
                        <span className="ml-2 font-semibold text-foreground">
                          {new Set(uploadedOptions.map(o => o.collegeCode)).size}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Unique Branches:</span>
                        <span className="ml-2 font-semibold text-foreground">
                          {new Set(uploadedOptions.map(o => o.branchCode)).size}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">First Choice:</span>
                        <span className="ml-2 font-semibold text-foreground">
                          {uploadedOptions[0]?.collegeCourse || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex shrink-0 justify-end gap-3 border-t border-white/10 px-6 py-4 bg-muted/10">
              <Button variant="ghost" onClick={() => {
                setIsUploadDialogOpen(false);
                clearUploadData();
              }}>
                Cancel
              </Button>
              <Button
                onClick={importUploadedChoices}
                disabled={uploadedOptions.length === 0 || isParsing}
                className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold"
              >
                Import Choices
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default MockSimulator


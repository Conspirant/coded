import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Search, MapPin, GraduationCap, TrendingUp, Star, Users, Check, ChevronsUpDown, FileSpreadsheet, Trash2, FileText, AlertCircle, Info, ChevronDown, ChevronUp, BarChart3, Download, Bookmark, Scale, X } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { XLSXLoader } from "@/lib/xlsx-loader"
import { finderStore } from "@/store/finderStore"
import { loadSettings } from '@/lib/settings'
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { normalizeCourse, getUniqueCourses, isSameCourse } from "@/lib/course-normalizer"

interface CutoffData {
  institute: string
  institute_code: string
  course: string
  category: string
  cutoff_rank: number
  year: string
  round: string
  total_seats?: number
  available_seats?: number
}

interface CutoffResponse {
  metadata: {
    last_updated: string
    total_entries: number
    total_institutes: number
    total_courses: number
    total_categories: number
    years_covered: string[]
    extraction_method: string
    source_files: string[]
    auto_detected_courses: string[]
    detected_categories: string[]
    institute_names: Record<string, string>
  }
  cutoffs: CutoffData[]
}

interface CollegeMatch {
  institute: string
  institute_code: string
  course: string
  category: string
  cutoff_rank: number
  year: string
  round: string
  matchScore: number
  safetyLevel: 'Eligible'
  admissionProbability: 'High' | 'Moderate' | 'Borderline' | 'Exact'
  marginPercent: number
}


const Sparkline = ({ data }: { data: number[] }) => {
  if (data.length < 2) return null
  const height = 24
  const width = 60
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  // Normalize points (invert Y so lower rank/better is higher)
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width
    const y = ((d - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="flex flex-col items-center select-none" title={`Trend: ${data.join(' → ')}`}>
      <div className="relative h-6 w-[60px]">
        <svg width={width} height={height} className="overflow-visible stroke-primary/80 fill-none stroke-2">
          <polyline points={points} vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Dots for points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width
          const y = ((d - min) / range) * height
          return (
            <div
              key={i}
              className="absolute h-1.5 w-1.5 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            />
          )
        })}
      </div>
      <div className="text-[9px] text-muted-foreground flex justify-between w-full px-0.5 mt-1 font-mono">
        <span>'23</span>
        <span>'25</span>
      </div>
    </div>
  )
}
const CollegeFinder = () => {
  const [cutoffs, setCutoffs] = useState<CutoffData[]>([])
  const [matches, setMatches] = useState<CollegeMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [progress, setProgress] = useState<number>(0)
  const [tipIndex, setTipIndex] = useState<number>(0)
  const [secondsLeft, setSecondsLeft] = useState<number>(0)
  const [metadata, setMetadata] = useState<CutoffResponse['metadata'] | null>(null)

  // Dynamic options extracted from JSON data
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableCourses, setAvailableCourses] = useState<string[]>([])
  const [availableInstitutes, setAvailableInstitutes] = useState<string[]>([])
  const [availableRounds, setAvailableRounds] = useState<string[]>([])

  // User inputs
  const [userRank, setUserRank] = useState<number>(50000)
  const [userCategory, setUserCategory] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedRound, setSelectedRound] = useState("")
  const [selectedInstitute, setSelectedInstitute] = useState("")
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [locationFilter, setLocationFilter] = useState("")
  const [minRank, setMinRank] = useState<number>(1)
  const [maxRank, setMaxRank] = useState<number>(300000)
  const [collegeSearchTerm, setCollegeSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const isMobile = useIsMobile()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Bookmarked colleges (persisted to localStorage)
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('kcet_bookmarks')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })

  // Toggle bookmark for a college
  const toggleBookmark = (key: string) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      localStorage.setItem('kcet_bookmarks', JSON.stringify([...next]))
      return next
    })
  }

  // Trend Analysis
  const trendIndex = useMemo(() => {
    const map = new Map<string, { year: number, rank: number }[]>()
    if (cutoffs.length === 0) return map

    cutoffs.forEach(c => {
      const key = `${c.institute_code}-${c.course}-${c.category}`
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push({ year: parseInt(c.year) || 0, rank: c.cutoff_rank })
    })

    for (const list of map.values()) {
      list.sort((a, b) => a.year - b.year)
    }
    return map
  }, [cutoffs])

  const getTrendData = (match: CollegeMatch) => {
    const key = `${match.institute_code}-${match.course}-${match.category}`
    const list = trendIndex.get(key)
    if (!list || list.length < 2) return []
    return list.map(l => l.rank)
  }

  // Compare Mode State
  const [compareList, setCompareList] = useState<CollegeMatch[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  const toggleCompare = (match: CollegeMatch) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.institute_code === match.institute_code && p.course === match.course)
      if (exists) {
        return prev.filter(p => !(p.institute_code === match.institute_code && p.course === match.course))
      }
      if (prev.length >= 3) {
        toast({ title: "Compare limit reached", description: "You can compare up to 3 colleges at a time" })
        return prev
      }
      return [...prev, match]
    })
  }

  // Export results to CSV
  const exportToCSV = () => {
    if (matches.length === 0) {
      toast({ title: "No results to export", variant: "destructive" })
      return
    }

    const headers = ['Institute', 'Code', 'Course', 'Category', 'Cutoff Rank', 'Year', 'Round']
    const rows = matches.map(m => [
      `"${m.institute}"`,
      m.institute_code,
      `"${m.course}"`,
      m.category,
      m.cutoff_rank,
      m.year,
      m.round
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kcet_colleges_rank_${userRank}.csv`
    a.click()
    URL.revokeObjectURL(url)

    toast({ title: "Exported!", description: `${matches.length} results saved to CSV` })
  }

  // Read rank from URL params (from RankPredictor "Find Colleges" button)
  useEffect(() => {
    const rankFromUrl = searchParams.get('rank')
    if (rankFromUrl) {
      const rank = parseInt(rankFromUrl, 10)
      if (!isNaN(rank) && rank > 0 && rank <= 300000) {
        setUserRank(rank)
        toast({
          title: "Rank Pre-filled",
          description: `Searching for colleges with rank ${rank.toLocaleString()}`,
        })
      }
    }
  }, [searchParams])

  // Mapping: course codes to canonical names (normalized display) - EXACT MATCHING
  const courseCodeToName: Record<string, string> = {
    // Engineering Courses
    AD: 'Artificial Intelligence And Data Science',
    AE: 'Aeronautical Engineering',
    AI: 'Artificial Intelligence and Machine Learning',
    AR: 'Architecture',
    AT: 'Automotive Engineering',
    AU: 'Automobile Engineering',
    BC: 'BTech Computer Technology',
    BD: 'Computer Science Engineering-Big Data',
    BE: 'Bio-Electronics Engineering',
    BI: 'Information Technology and Engineering',
    BM: 'Bio Medical Engineering',
    BR: 'BioMedical and Robotic Engineering',
    BS: 'Bachelor of Science (Honours)',
    BT: 'Bio Technology',
    CA: 'Computer Science Engineering-AI',
    CB: 'Computer Science and Business Systems',
    CC: 'Computer and Communication Engineering',
    CD: 'Computer Science and Design',
    CE: 'Civil Engineering',
    CF: 'Computer Science Engineering-Artificial',
    CG: 'Computer Science and Technology',
    CH: 'Chemical Engineering',
    CI: 'Computer Science and Information',
    CK: 'Civil Engineering (Kannada Medium)',
    CM: 'Electronics Engineering (VLSI Design)',
    CO: 'Computer Engineering',
    CP: 'Civil Engineering and Planning',
    CR: 'Ceramics and Cement Technology',
    CS: 'Computer Science And Engineering',
    CT: 'Construction Technology and Management',
    CV: 'Civil Environmental Engineering',
    CY: 'Computer Science Engineering-Cyber',
    DC: 'Data Sciences',
    DG: 'Design',
    DM: 'Computer Science and Engineering',
    DS: 'Computer Science Engineering-Data',
    EA: 'Agriculture Engineering',
    EB: 'Electronics and Communication (Advanced)',
    EC: 'Electronics and Communication Engineering',
    EE: 'Electrical And Electronics Engineering',
    EG: 'Energy Engineering',
    EI: 'Electronics and Instrumentation Engineering',
    EL: 'Electronics and Instrumentation Technology',
    EN: 'Environmental Engineering',
    EP: 'BTech Technology and Entrepreneurship',
    ER: 'Electrical and Computer Engineering',
    ES: 'Electronics and Computer Engineering',
    ET: 'Electronics and Telecommunication',
    EV: 'Electronics Engineering (VLSI Design)',
    IB: 'Computer Science Engg - IoT including Blockchain',
    IC: 'Computer Science - Internet of Things',
    IE: 'Information Science and Engineering',
    IG: 'Information Technology',
    II: 'Electronics and Communication - Industrial',
    IM: 'Industrial Engineering and Management',
    IO: 'Computer Science Engineering - Internet of Things',
    IP: 'Industrial and Production Engineering',
    IS: 'Information Science and Technology',
    IT: 'Instrumentation Technology',
    IY: 'Computer Science - Information Technology - Cyber Security',
    LA: 'B Plan',
    LC: 'Computer Science Engineering - Block Chain',
    LJ: 'BTech in Computer Science',
    MC: 'Mathematics and Computing',
    MD: 'Medical Electronics',
    ME: 'Mechanical Engineering',
    MK: 'Mechanical Engineering (Kannada Medium)',
    MM: 'Mechanical and Smart Manufacturing',
    MN: 'Mining Engineering',
    MR: 'Marine Engineering',
    MS: 'Manufacturing Science and Engineering',
    MT: 'Mechatronics',
    NT: 'Nano Technology',
    OP: 'Computer Science Engineering - DevOps',
    OT: 'Industrial IoT',
    PE: 'Petrochemical Engineering',
    PL: 'Petroleum Engineering',
    PM: 'Precision Manufacturing',
    PT: 'Polymer Science and Technology',
    RA: 'Robotics and Automation',
    RB: 'Robotics',
    RI: 'Robotics and Artificial Intelligence',
    RM: 'Computer Science - Robotic Engineering - AI',
    RO: 'Automation and Robotics Engineering',
    SA: 'Smart Agritech',
    SE: 'Aerospace Engineering',
    SS: 'Computer Science and System Engineering',
    ST: 'Silk Technology',
    TC: 'Telecommunication Engineering',
    TE: 'Tool Engineering',
    TX: 'Textile Technology',
    UP: 'Planning',
    UR: 'Planning',
    ZC: 'Computer Science',

    // B.Tech Specialisations (prefixed with "B")
    AM: 'B Tech in Computer Science & Engg (AI & ML)',
    BA: 'B.Tech (Agricultural Engineering)',
    BB: 'B Tech in Electronics & Communication',
    BF: 'B Tech (Hons) Comp Sci and Engg (Data)',
    BG: 'B Tech in Artificial Intelligence and Data',
    BH: 'B Tech in Artificial Intelligence and ML',
    BJ: 'B Tech in Electrical & Electronics',
    BK: 'B Tech in Energy Engineering',
    BL: 'B Tech in Aerospace Engineering',
    BN: 'B Tech in Computer Science and Tech (Big Data)',
    BO: 'B Tech in Bio-Technology',
    BP: 'B Tech in Civil Engineering',
    BQ: 'B Tech in Computer Science',
    BU: 'B Tech in Computer Science and Information',
    BV: 'B Tech in Computer Engineering',
    BW: 'B Tech in Computer Science',
    BX: 'B Tech in Computer Science and Engg (Cyber)',
    BY: 'B Tech in Computer Science',
    BZ: 'B Tech in Computer Science',
    CL: 'B Tech in Electronics & Computer',
    CN: 'B Tech in Computer Science and Engg (IoT and ...)',
    CQ: 'B Tech in Computer Science',
    CU: 'B Tech in Information Science',
    CW: 'B Tech in Information Technology',
    CX: 'B Tech in Information Science & ...',
    CZ: 'B Tech in Computer Science',
    DA: 'B Tech in Mathematics and Computing',
    DB: 'B Tech in Mechanical Engineering',
    DD: 'B Tech in Mechatronics Engineering',
    DE: 'B Tech in Petroleum Engineering',
    DF: 'B Tech in Robotics and Automation',
    DH: 'B Tech in Robotics and Artificial Intelligence',
    DI: 'B Tech in Robotic Engineering',
    DJ: 'B Tech in Robotics',
    DK: 'B Tech in Computer Science and System',
    DL: 'B Tech in Computer Science',
    DN: 'B Tech in VLSI',
    LD: 'B Tech in Computer Science (Data)',
    LE: 'B Tech in Computer Science (AI & ML)',
    LF: 'B Tech in Computer Science (Cloud)',
    LG: 'B Tech in Computer Science (Cyber)',
    LH: 'B Tech in Computer Science (Information)',
    LK: 'B Tech in Computer Science (Internet of Things)',

    // Farm Science Courses
    FH: 'B.F.Sc. Fisheries Science',
    AB: 'B.Tech (Biotechnology)',
    AMB: 'B.Sc. (Hons) Ag. Business Management',
    AG: 'B.Sc. (Hons) Agriculture',
    HS: 'B.Sc. (Hons) Community Science',
    FR: 'B.Sc. (Hons) Forestry',
    HT: 'B.Sc. (Hons) Horticulture',
    SR: 'B.Sc. (Hons) Sericulture',
    VS: 'B.V.Sc. and A.H',
    DT: 'B.Tech (Dairy Technology)',
    FS: 'B.Tech (Food Technology)',
    FT: 'B.Tech (Food Technology)',
    HE: 'Horticultural Engineering',

    // New 2025 course names
    'ARTIFICIAL\nINTELLIGENCE AND\nDATA SCIENCE': 'Artificial Intelligence and Data Science',
    'ARTIFICIAL\nINTELLIGENCE AND\nMACHINE\nLEARNING': 'Artificial Intelligence and Machine Learning',
    'AUTOMATION\nAND ROBOTICS': 'Automation and Robotics',
    'AUTOMATION AND\nROBOTICS': 'Automation and Robotics',
    'AUTOMOBILE\nENGINEERING': 'Automobile Engineering',
    'AUTOMOTIVE\nENGINEERING': 'Automotive Engineering',
    'B TECH (HONS)\nCOMPUTER\nSCIENCE AND\nENGINEERING(D\nATA SCIENCE)': 'B.Tech (Hons) Computer Science and Engineering (Data Science)',
    'B TECH (HONS)\nCOMPUTER\nSCIENCE AND\nENGINEERING(DAT\nA SCIENCE)': 'B.Tech (Hons) Computer Science and Engineering (Data Science)',
    'B TECH IN\nAERONAUTICAL\nENGINEERING': 'B.Tech in Aeronautical Engineering',
    'B TECH IN\nAGRICULTURAL\nENGINEERING': 'B.Tech in Agricultural Engineering',
    'B TECH IN\nARTIFICIAL\nINTELLIGENCE\nAND DATA\nSCIENCE': 'B.Tech in Artificial Intelligence and Data Science',
    'B TECH IN\nARTIFICIAL\nINTELLIGENCE\nAND MACHINE\nLEARNING': 'B.Tech in Artificial Intelligence and Machine Learning',
    'B TECH IN\nCOMPUTER\nENGINEERING': 'B.Tech in Computer Engineering',
    'B TECH IN\nCOMPUTER\nSCIENCE': 'B.Tech in Computer Science',
    'B TECH IN\nCOMPUTER\nSCIENCE\n(CLOUD\nCOMPUTING)': 'B.Tech in Computer Science (Cloud Computing)',
    'B TECH IN\nCOMPUTER\nSCIENCE\n(CYBER\nSECURITY)': 'B.Tech in Computer Science (Cyber Security)',
    'B TECH IN\nCOMPUTER\nSCIENCE &\nENGG\n(ARTIFICIAL\nINTELLIGENCE\nAND FUTURE\nTECHNOLOGIES\n)': 'B.Tech in Computer Science & Engineering (Artificial Intelligence and Future Technologies)',
    'B TECH IN\nCOMPUTER\nSCIENCE &\nENGINEERING\n(ARTIFICAL\nINTELLIGENCE &\nMACHINE\nLEARNING)': 'B.Tech in Computer Science & Engineering (Artificial Intelligence and Machine Learning)',
    'B TECH IN\nCOMPUTER\nSCIENCE & ENGG\n(ARTIFICIAL\nINTELLIGENCE AND\nFUTURE\nTECHNOLOGIES)': 'B.Tech in Computer Science & Engineering (Artificial Intelligence and Future Technologies)',
    'B TECH IN\nCOMPUTER\nSCIENCE (CLOUD\nCOMPUTING)': 'B.Tech in Computer Science (Cloud Computing)',
    'B TECH IN\nCOMPUTER\nSCIENCE (CYBER\nSECURITY)': 'B.Tech in Computer Science (Cyber Security)',
    'B TECH IN\nCOMPUTER\nSCIENCE (DATA\nSCIENCE)': 'B.Tech in Computer Science (Data Science)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING': 'B.Tech in Computer Science and Engineering',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(A\nRTIFICIAL\nINTELLIGENCE &\nDATA SCIENCE)': 'B.Tech in Computer Science and Engineering (Artificial Intelligence and Data Science)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(ARTI\nFICAL\nINTELLIGENCE &\nDATA SCIENCE)': 'B.Tech in Computer Science and Engineering (Artificial Intelligence and Data Science)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(BLO\nCK CHAIN)': 'B.Tech in Computer Science and Engineering (Block Chain)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(C\nYBER\nSECURITY)': 'B.Tech in Computer Science and Engineering (Cyber Security)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(CYB\nER SECURITY)': 'B.Tech in Computer Science and Engineering (Cyber Security)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(D\nATA SCIENCE)': 'B.Tech in Computer Science and Engineering (Data Science)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(DAT\nA SCIENCE)': 'B.Tech in Computer Science and Engineering (Data Science)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(I\nOT INCLUDING\nBLOCK CHAIN)': 'B.Tech in Computer Science and Engineering (IoT including Block Chain)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(I\nOT)': 'B.Tech in Computer Science and Engineering (IoT)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(IOT\nINCLUDING BLOCK\nCHAIN)': 'B.Tech in Computer Science and Engineering (IoT including Block Chain)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nENGINEERING(IOT)': 'B.Tech in Computer Science and Engineering (IoT)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nINFORMATION\nTECHNOLOGY': 'B.Tech in Computer Science and Information Technology',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nTECHNOLOGY': 'B.Tech in Computer Science and Technology',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nTECHNOLOGY(BIG\nDATA)': 'B.Tech in Computer Science and Technology (Big Data)',
    'B TECH IN\nCOMPUTER\nSCIENCE AND\nTECHNOLOGY(DEV\nOPS)': 'B.Tech in Computer Science and Technology (DevOps)',
    'B TECH IN\nELECTRICAL &\nELECTRONICS\nENGINEERING': 'B.Tech in Electrical & Electronics Engineering',
    'B TECH IN\nELECTRONICS &\nCOMMUNICATIO\nN ENGINEERING': 'B.Tech in Electronics & Communication Engineering',
    'B TECH IN\nELECTRONICS &\nCOMMUNICATION\nENGINEERING': 'B.Tech in Electronics & Communication Engineering',
    'B TECH IN\nELECTRONICS &\nCOMPUTER\nENGINEERING': 'B.Tech in Electronics & Computer Engineering',
    'B TECH IN\nINFORMATION\nSCIENCE\nENGINEERING': 'B.Tech in Information Science Engineering',
    'B TECH IN\nINFORMATION\nSCIENCE &\nTECHNOLOGY': 'B.Tech in Information Science & Technology',
    'B TECH IN\nINFORMATION\nTECHNOLOGY': 'B.Tech in Information Technology',
    'B TECH IN\nMATHAMATICS\nAND\nCOMPUTING': 'B.Tech in Mathematics and Computing',
    'B TECH IN\nMATHAMATICS\nAND COMPUTING': 'B.Tech in Mathematics and Computing',
    'B TECH IN\nMECHANICAL\nENGINEERING': 'B.Tech in Mechanical Engineering',
    'B TECH IN\nMECHATRONICS\nENGINEERING': 'B.Tech in Mechatronics Engineering',
    'B TECH IN\nPETROLEUM\nENGINEERING': 'B.Tech in Petroleum Engineering',
    'B TECH IN\nROBOTIC\nENGINEERING': 'B.Tech in Robotic Engineering',
    'B TECH IN\nROBOTICS\nENGINEERING': 'B.Tech in Robotics Engineering',
    'B TECH IN\nROBOTICS AND\nAUTOMATION': 'B.Tech in Robotics and Automation',
    'B TECH IN AERO\nSPACE\nENGINEERING': 'B.Tech in Aerospace Engineering',
    'B TECH IN BIO-\nTECHNOLOGY': 'B.Tech in Bio-Technology',
    'B TECH IN CIVIL\nENGINEERING': 'B.Tech in Civil Engineering',
    'B TECH IN ENERGY\nENGINEERING': 'B.Tech in Energy Engineering',
    'B Tech in\nComputer\nScience(AI &ML)': 'B.Tech in Computer Science (AI & ML)',
    'B Tech in\nComputer Science\n(Information\nSecurity)': 'B.Tech in Computer Science (Information Security)',
    'B Tech in\nROBOTICS AND\nARTIFICIAL\nINTELLIGENCE': 'B.Tech in Robotics and Artificial Intelligence',
    'B Tech in Computer\nScience (Information\nSecurity)': 'B.Tech in Computer Science (Information Security)',
    'B Tech in Computer\nScience(AI &ML)': 'B.Tech in Computer Science (AI & ML)',
    'B.Plan': 'B.Plan',
    'B.TECH IN\nCOMPUTER\nENGINEERING(S\nOFTWARE\nPRODUCT\nDEVELOPMENT)': 'B.Tech in Computer Engineering (Software Product Development)',
    'B.TECH IN\nCOMPUTER\nENGINEERING(SOF\nTWARE PRODUCT\nDEVELOPMENT)': 'B.Tech in Computer Engineering (Software Product Development)',
    'B.TECH IN\nCOMPUTER\nSCIENCE AND\nARTIFICIAL\nINTELLIGENCE': 'B.Tech in Computer Science and Artificial Intelligence',
    'B.TECH IN\nCOMPUTER\nSCIENCE AND\nENGG\n(ROBOTICS)': 'B.Tech in Computer Science and Engineering (Robotics)',
    'B.TECH IN\nCOMPUTER\nSCIENCE AND\nENGG (ROBOTICS)': 'B.Tech in Computer Science and Engineering (Robotics)',
    'B.TECH IN\nCOMPUTER\nSICENCE AND\nENGG (DATA\nANALYTICS)': 'B.Tech in Computer Science and Engineering (Data Analytics)',
    'B.TECH IN\nComputer Science\nand Medical\nEngineering': 'B.Tech in Computer Science and Medical Engineering',
    'B.TECH IN\nELECTRICAL\nENGINEERING\nAND COMPUTER\nSCIENCE': 'B.Tech in Electrical Engineering and Computer Science',
    'B.TECH IN\nELECTRICAL\nENGINEERING AND\nCOMPUTER\nSCIENCE': 'B.Tech in Electrical Engineering and Computer Science',
    'B.TECH IN\nELECTRONICS\nENGINEERING': 'B.Tech in Electronics Engineering',
    'B.TECH IN\nELECTRONICS\nENGINEERING\n(VLSI AND\nEMBEDDED\nSYSTEM)': 'B.Tech in Electronics Engineering (VLSI and Embedded System)',
    'B.TECH IN\nEMBEDDED\nSYSTEM AND\nVLSI': 'B.Tech in Embedded System and VLSI',
    'B.TECH IN\nEMBEDDED\nSYSTEM AND VLSI': 'B.Tech in Embedded System and VLSI',
    'B.TECH IN\nMECHANICAL\nAND\nAEROSPACE\nENGINEERING': 'B.Tech in Mechanical and Aerospace Engineering',
    'B.TECH IN\nMECHANICAL AND\nAEROSPACE\nENGINEERING': 'B.Tech in Mechanical and Aerospace Engineering',
    'B.TECH IN CIVIL\nCONSTRUCTION\nAND\nSUSTAINABILITY\nENGINEERING': 'B.Tech in Civil Construction and Sustainability Engineering',
    'B.Tech In\nBIOTECHNOLOG\nY & BIO-\nENGINEERING': 'B.Tech in Biotechnology & Bio-Engineering',
    'B.Tech In\nBIOTECHNOLOGY\n& BIO-\nENGINEERING': 'B.Tech in Biotechnology & Bio-Engineering',
    'B.Tech in\nCOMPUTER\nSCIENCE & ENGG\n(Business Systems)': 'B.Tech in Computer Science & Engineering (Business Systems)',
    'B.Tech in\nComputer Science\n(Internet of\nThings)': 'B.Tech in Computer Science (Internet of Things)',
    'B.Tech in\nComputer Science\nand\nEngineering(Clou\nd Computing)': 'B.Tech in Computer Science and Engineering (Cloud Computing)',
    'B.Tech in\nComputer Science\nand\nEngineering(Dev\nOps)': 'B.Tech in Computer Science and Engineering (DevOps)',
    'B.Tech in\nComputer Science\nand\nEngineering(Full\nStack\nDevelopment)': 'B.Tech in Computer Science and Engineering (Full Stack Development)',
    'B.Tech in\nElectrical and\nElectronics\nEngineering\n(Electrical Vehicle\nTechnology)': 'B.Tech in Electrical and Electronics Engineering (Electrical Vehicle Technology)',
    'B.Tech in Computer\nScience (Internet of\nThings)': 'B.Tech in Computer Science (Internet of Things)',
    'B.Tech in Computer\nScience and\nEngineering(Cloud\nComputing)': 'B.Tech in Computer Science and Engineering (Cloud Computing)',
    'B.Tech in Computer\nScience and\nEngineering(Dev\nOps)': 'B.Tech in Computer Science and Engineering (DevOps)',
    'B.Tech in Computer\nScience and\nEngineering(Full\nStack Development)': 'B.Tech in Computer Science and Engineering (Full Stack Development)',
    'B.Tech in Electrical\nand Electronics\nEngineering\n(Electrical Vehicle\nTechnology)': 'B.Tech in Electrical and Electronics Engineering (Electrical Vehicle Technology)',
    'B.Tech in VLSI': 'B.Tech in VLSI',
    'BIO-\nTECHNOLOGY': 'Bio-Technology',
    'BIO-MEDICAL\nENGINEERING': 'Bio Medical Engineering',
    'BIO-TECHNOLOGY': 'Bio-Technology',
    'BIOMEDICAL\nAND ROBOTIC\nENGINEERING': 'Biomedical and Robotic Engineering',
    'BIOMEDICAL AND\nROBOTIC\nENGINEERING': 'Biomedical and Robotic Engineering',
    'BTECH IN\nCOMPUTER\nSCIENCE AND\nBUSINESS\nSYSTEMS': 'B.Tech in Computer Science and Business Systems',
    'BTECH IN\nCOMPUTER\nSCIENCE AND\nDESIGN': 'B.Tech in Computer Science and Design',
    'BTECH IN\nELECTRONICS\nENGINEERING(V\nLSI DESIGN &\nTECHNOLOGY)': 'B.Tech in Electronics Engineering (VLSI Design & Technology)',
    'BTECH IN\nELECTRONICS\nENGINEERING(VLSI\nDESIGN &\nTECHNOLOGY)': 'B.Tech in Electronics Engineering (VLSI Design & Technology)',
    'BTECH IN\nINFORMATION\nTECHNOLOGY\nDATA\nANALYTICS': 'B.Tech in Information Technology Data Analytics',
    'BTECH IN\nINFORMATION\nTECHNOLOGY\nDATA ANALYTICS': 'B.Tech in Information Technology Data Analytics',
    'BTECH IN\nMECHANICAL AND\nSMART\nMANUFACTURING': 'B.Tech in Mechanical and Smart Manufacturing',
    'BTECH IN\nPHARMACEUTICAL\nENGINEERING': 'B.Tech in Pharmaceutical Engineering',
    'CERAMICS &\nCEMENT\nENGINEERING': 'Ceramics and Cement Engineering',
    'CHEMICAL\nENGINEERING': 'Chemical Engineering',
    'CIVIL\nENGINEERING': 'Civil Engineering',
    'CIVIL\nENGINEERING\n(KANNADA\nMEDIUM)': 'Civil Engineering (Kannada Medium)',
    'CIVIL\nENGINEERING\nWITH COMPUTER\nAPPLICATION': 'Civil Engineering with Computer Application',
    'CIVIL\nENVIRONMENTA\nL ENGINEERING': 'Civil Environmental Engineering',
    'CIVIL\nENVIRONMENTAL\nENGINEERING': 'Civil Environmental Engineering',
    'COMMUNICATION\nDESIGN': 'Communication Design',
    'COMPUTER\nENGINEERING': 'Computer Engineering',
    'COMPUTER\nSCIENCE': 'Computer Science',
    'COMPUTER\nSCIENCE &\nTECHNOLOGY': 'Computer Science & Technology',
    'COMPUTER\nSCIENCE AND\nBUSINESS\nSYSTEMS': 'Computer Science and Business Systems',
    'COMPUTER\nSCIENCE AND\nDESIGN': 'Computer Science and Design',
    'COMPUTER\nSCIENCE AND\nENGG\n(ARTIFICIAL\nINTELLIGENCE)': 'Computer Science and Engineering (Artificial Intelligence)',
    'COMPUTER\nSCIENCE AND\nENGG (ARTIFICIAL\nINTELLIGENCE)': 'Computer Science and Engineering (Artificial Intelligence)',
    'COMPUTER\nSCIENCE AND\nENGG(ARTIFICIA\nL INTELLIGENCE\nAND MACHINE\nLEARNING)': 'Computer Science and Engineering (Artificial Intelligence and Machine Learning)',
    'COMPUTER\nSCIENCE AND\nENGG(ARTIFICIAL\nINTELLIGENCE AND\nMACHINE\nLEARNING)': 'Computer Science and Engineering (Artificial Intelligence and Machine Learning)',
    'COMPUTER\nSCIENCE AND\nENGG(INTERNE\nT OF THINGS &\nCYBER\nSECURITY\nINCLUDING\nBLOCK CHAIN\nTECH)': 'Computer Science and Engineering (Internet of Things & Cyber Security including Block Chain Tech)',
    'COMPUTER\nSCIENCE AND\nENGG(INTERNE\nT OF THINGS)': 'Computer Science and Engineering (Internet of Things)',
    'COMPUTER\nSCIENCE AND\nENGG(INTERNET\nOF THINGS &\nCYBER SECURITY\nINCLUDING BLOCK\nCHAIN TECH)': 'Computer Science and Engineering (Internet of Things & Cyber Security including Block Chain Tech)',
    'COMPUTER\nSCIENCE AND\nENGG(INTERNET\nOF THINGS)': 'Computer Science and Engineering (Internet of Things)',
    'COMPUTER\nSCIENCE AND\nENGINEERING': 'Computer Science and Engineering',
    'COMPUTER\nSCIENCE AND\nENGINEERING\n(AIML)': 'Computer Science and Engineering (AIML)',
    'COMPUTER\nSCIENCE AND\nENGINEERING\n(CYBER\nSECURITY)': 'Computer Science and Engineering (Cyber Security)',
    'COMPUTER\nSCIENCE AND\nENGINEERING\n(CYBER SECURITY)': 'Computer Science and Engineering (Cyber Security)',
    'COMPUTER\nSCIENCE AND\nENGINEERING(A\nRTIFICAL\nINTELLIGENCE &\nDATA SCIENCE)': 'Computer Science and Engineering (Artificial Intelligence and Data Science)',
    'COMPUTER\nSCIENCE AND\nENGINEERING(ARTI\nFICAL\nINTELLIGENCE &\nDATA SCIENCE)': 'Computer Science and Engineering (Artificial Intelligence and Data Science)',
    'COMPUTER\nSCIENCE AND\nENGINEERING(D\nATA SCIENCE)': 'Computer Science and Engineering (Data Science)',
    'COMPUTER\nSCIENCE AND\nENGINEERING(DAT\nA SCIENCE)': 'Computer Science and Engineering (Data Science)',
    'COMPUTER AND\nCOMMUNICATIO\nN ENGINEERING': 'Computer and Communication Engineering',
    'COMPUTER AND\nCOMMUNICATION\nENGINEERING': 'Computer and Communication Engineering',
    'CYBER\nSECURITY': 'Cyber Security',
    'CYBER SECURITY': 'Cyber Security',
    'DATA SCIENCES': 'Data Sciences',
    'DESIGN': 'Design',
    'ELECTRICAL &\nCOMPUTER\nENGINEERING': 'Electrical & Computer Engineering',
    'ELECTRICAL &\nELECTRONICS\nENGINEERING': 'Electrical & Electronics Engineering',
    'ELECTRONICS\nAND\nCOMMUNICATIO\nN (ADVANCED\nCOMMUNICATIO\nN\nTECHNOLOGY)': 'Electronics and Communication (Advanced Communication Technology)',
    'ELECTRONICS\nAND\nCOMMUNICATIO\nN ENGG': 'Electronics and Communication Engineering',
    'ELECTRONICS\nAND\nCOMMUNICATIO\nN ENGG (VLSI\nDESIGN AND\nTECHNOLOGY)': 'Electronics and Communication Engineering (VLSI Design and Technology)',
    'ELECTRONICS\nAND\nINSTRUMENTATI\nON\nENGINEERING': 'Electronics and Instrumentation Engineering',
    'ELECTRONICS\nAND\nTELECOMMUNIC\nATION\nENGINEERING': 'Electronics and Telecommunication Engineering',
    'ELECTRONICS\nENGINEERING(V\nLSI DESIGN &\nTECHNOLOGY)': 'Electronics Engineering (VLSI Design & Technology)',
    'ELECTRONICS\nENGINEERING(VLSI\nDESIGN &\nTECHNOLOGY)': 'Electronics Engineering (VLSI Design & Technology)',
    'ELECTRONICS &\nCOMMUNICATION\nENGINEERING(IND\nUSTRIAL\nINTEGTATED)': 'Electronics & Communication Engineering (Industrial Integrated)',
    'ELECTRONICS &\nCOMPUTER\nENGINEERING': 'Electronics & Computer Engineering',
    'ELECTRONICS &\nCOMPUTER\nSCIENCE': 'Electronics & Computer Science',
    'ELECTRONICS &\nINSTRUMENTATI\nON\nENGINEERING': 'Electronics & Instrumentation Engineering',
    'ELECTRONICS &\nINSTRUMENTATION\nENGINEERING': 'Electronics & Instrumentation Engineering',
    'ELECTRONICS AND\nCOMMUNICATION\n(ADVANCED\nCOMMUNICATION\nTECHNOLOGY)': 'Electronics and Communication (Advanced Communication Technology)',
    'ELECTRONICS AND\nCOMMUNICATION\nENGG': 'Electronics and Communication Engineering',
    'ELECTRONICS AND\nCOMMUNICATION\nENGG (VLSI\nDESIGN AND\nTECHNOLOGY)': 'Electronics and Communication Engineering (VLSI Design and Technology)',
    'ELECTRONICS AND\nINSTRUMENTATION\nENGINEERING': 'Electronics and Instrumentation Engineering',
    'ELECTRONICS AND\nTELECOMMUNICAT\nION ENGINEERING': 'Electronics and Telecommunication Engineering',
    'ENGINEERING\nDESIGN': 'Engineering Design',
    'ENVIRONMENTA\nL ENGINEERING': 'Environmental Engineering',
    'ENVIRONMENTAL\nENGINEERING': 'Environmental Engineering',
    'FASHION DESIGN': 'Fashion Design',
    'INDUSTRIAL\nDESIGN': 'Industrial Design',
    'INDUSTRIAL\nENGINEERING &\nMANAGEMENT': 'Industrial Engineering & Management',
    'INDUSTRIAL &\nPRODUCTION\nENGINEERING': 'Industrial & Production Engineering',
    'INDUSTRIAL IOT': 'Industrial IoT',
    'INFORMATION\nSCIENCE': 'Information Science',
    'INFORMATION\nSCIENCE AND\nENGINEERING': 'Information Science and Engineering',
    'LIFE STYLE AND\nACCESSORY\nDESIGN': 'Life Style and Accessory Design',
    'MARINE\nENGINEERING': 'Marine Engineering',
    'MECHANICAL\nENGINEERING': 'Mechanical Engineering',
    'MECHANICAL\nENGINEERING\n(KANNADA\nMEDIUM)': 'Mechanical Engineering (Kannada Medium)',
    'MECHANICAL AND\nSMART\nMANUFACTURING': 'Mechanical and Smart Manufacturing',
    'MECHATRONICS': 'Mechatronics',
    'MEDICAL\nELECTRONICS\nENGINEERING': 'Medical Electronics Engineering',
    'MINING\nENGINEERING': 'Mining Engineering',
    'PLANNING': 'Planning',
    'POLYMER\nSCIENCE &\nTECHNOLOGY': 'Polymer Science & Technology',
    'POLYMER SCIENCE\n& TECHNOLOGY': 'Polymer Science & Technology',
    'PRODUCTION\nENGINEERING': 'Production Engineering',
    'ROBOTICS AND\nARTIFICIAL\nINTELLIGENCE': 'Robotics and Artificial Intelligence',
    'ROBOTICS AND\nAUTOMATION': 'Robotics and Automation',
    'SILK\nTECHNOLOGY': 'Silk Technology',
    'TEXTILES\nTECHNOLOGY': 'Textiles Technology',
    // Additional common variations for better matching
    'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE': 'Artificial Intelligence and Data Science',
    'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'Artificial Intelligence and Machine Learning',
    'COMPUTER SCIENCE AND ENGINEERING (AI)': 'Computer Science and Engineering (AI)',
    'COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)': 'Computer Science and Engineering (Cyber Security)',
    'COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)': 'Computer Science and Engineering (Data Science)',
    'COMPUTER SCIENCE AND ENGINEERING (IOT)': 'Computer Science and Engineering (IoT)',
    'ELECTRONICS AND COMMUNICATION ENGINEERING': 'Electronics and Communication Engineering',
    'ELECTRICAL AND ELECTRONICS ENGINEERING': 'Electrical and Electronics Engineering',
    'BIO TECHNOLOGY': 'Bio Technology',
    'BIO MEDICAL ENGINEERING': 'Bio Medical Engineering',
    'INFORMATION SCIENCE AND ENGINEERING': 'Information Science and Engineering',
    'INFORMATION TECHNOLOGY': 'Information Technology',
    'ROBOTICS AND AUTOMATION': 'Robotics and Automation',
    'ROBOTICS AND ARTIFICIAL INTELLIGENCE': 'Robotics and Artificial Intelligence',
    'AERONAUTICAL ENGINEERING': 'Aeronautical Engineering',
    'AUTOMOBILE ENGINEERING': 'Automobile Engineering',
    'AUTOMOTIVE ENGINEERING': 'Automotive Engineering',
    'AUTOMATION AND ROBOTICS': 'Automation and Robotics',
    'AEROSPACE ENGINEERING': 'Aerospace Engineering',
    'MARINE ENGINEERING': 'Marine Engineering',
    'MINING ENGINEERING': 'Mining Engineering',
    'PETROLEUM ENGINEERING': 'Petroleum Engineering',
    'POLYMER SCIENCE AND TECHNOLOGY': 'Polymer Science and Technology',
    'B.PLAN': 'B.Plan',
    'B.TECH': 'B.Tech',
    'B.TECH IN': 'B.Tech in',
    'B TECH IN': 'B.Tech in',
    'B TECH': 'B.Tech',

    // Additional mappings for specific course names found in the data
    'COMPUTER SCIENCE AND ENGG(INTERNET OF THINGS & CYBER SECURITY INCLUDING BLOCK CHAIN TECH)': 'Computer Science and Engineering (Internet of Things & Cyber Security including Block Chain Tech)',
  }

  const mapCourseName = (rawCourse: string): string => {
    const text = (rawCourse ?? '').toString().trim()
    if (!text) return text

    // Step 1: Clean the raw text - remove newlines and collapse multiple spaces
    const cleanedText = text.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim()

    // Step 2: Extract the course code (usually 2 letters at the start)
    const codeMatch = cleanedText.match(/^([A-Z]{2})\s/)
    const code = codeMatch ? codeMatch[1] : null

    // Step 3: If we have a code and it's in our legacy mapping, use it
    if (code && courseCodeToName[code]) {
      return courseCodeToName[code]
    }

    // Step 4: Use the new pattern-based normalizer (handles year-specific variations)
    const normalized = normalizeCourse(cleanedText)
    if (normalized !== cleanedText) {
      return normalized
    }

    // Step 5: Try full text matching against legacy mapping values
    const cleanedLower = cleanedText.toLowerCase()
    for (const [, name] of Object.entries(courseCodeToName)) {
      const nameLower = name.toLowerCase()
      if (nameLower === cleanedLower) {
        return name
      }
    }

    // Step 6: Fallback to normalized result
    return normalized
  }




  // Helpful rotating tips to keep users engaged
  const loadingTips: string[] = [
    'Tip: Use the course picker to filter by specific branches.',
    'Did you know? Ranks higher than yours indicate better chances.',
    'Pro tip: Toggle sort to see closest cutoffs first.',
    'You can search found colleges by name, code, or rank.',
    'Analytics shows coverage and quick stats about the dataset.'
  ]

  useEffect(() => {
    if (!loading) return
    const id = setInterval(() => {
      setTipIndex((i) => (i + 1) % loadingTips.length)
    }, 2500)
    return () => clearInterval(id)
  }, [loading])

  // Load cutoff data from consolidated data source (kcet_cutoffs.json)
  useEffect(() => {
    const loadData = async () => {
      try {

        setProgress(10)

        // Load from the main consolidated data source - try multiple sources (no-cache)
        const urls = [
          '/data/kcet_cutoffs_consolidated.json',
          '/kcet_cutoffs.json',
          '/kcet_cutoffs_round3_2025.json',
          '/kcet_cutoffs2025.json'
        ]
        let response: Response | null = null
        let dataSource = ''
        for (const url of urls) {
          const r = await fetch(url)
          if (r.ok) {
            response = r
            dataSource = url
            break
          }
        }
        if (!response) {
          throw new Error('Failed to load data from all sources')
        }

        setProgress(35)

        const data: CutoffResponse = await response.json()
        setProgress(55)

        // Handle different data structures
        let processedData = data
        if (!data.cutoffs && Array.isArray(data)) {

          processedData = { cutoffs: data, metadata: {} } as any
        } else {
          processedData = data
        }

        })
        setProgress(65)

        // Check if data has a different structure
        if (!processedData.cutoffs && (processedData as any).data) {

          processedData.cutoffs = (processedData as any).data
        }

        // Handle case where data might be nested differently
        if (!processedData.cutoffs && (processedData as any).cutoffs_data) {

          processedData.cutoffs = (processedData as any).cutoffs_data
        }

        if (!processedData.cutoffs || processedData.cutoffs.length === 0) {
          throw new Error('No cutoff data found in the JSON file')
        }

        // Normalize data: trim strings to avoid mismatches
        const normalizedCutoffs: CutoffData[] = processedData.cutoffs.map(item => {
          const cutoffRank = Number(item.cutoff_rank ?? 0)

          // Debug: Log any suspicious cutoff rank values
          if (cutoffRank === 0 || isNaN(cutoffRank)) {

          }

          // Debug: Log Sri Sairam entries during normalization
          if ((item.institute ?? '').toString().toLowerCase().includes('sri sairam')) {

          }

          return {
            institute: (item.institute ?? '').toString().trim(),
            institute_code: (item.institute_code ?? '').toString().trim().toUpperCase(),
            course: mapCourseName((item.course ?? '').toString()),
            category: (item.category ?? '').toString().trim(),
            cutoff_rank: cutoffRank,
            year: (item.year ?? '').toString().trim(),
            round: (item.round ?? '').toString().trim()
          }
        })
        setProgress(80)

        // Debug: Check for Sri Sairam College in the loaded data
        const sriSairamInData = normalizedCutoffs.filter(c =>
          c.institute.toLowerCase().includes('sri sairam')
        )

        if (sriSairamInData.length > 0) {
          )
        }

        setCutoffs(normalizedCutoffs)
        setMetadata(processedData.metadata ?? null)

        // Populate options from metadata sections when available
        const years = processedData.metadata?.years_covered
          ? [...processedData.metadata.years_covered].sort((a, b) => b.localeCompare(a))
          : [...new Set(normalizedCutoffs.map(item => item.year))].sort((a, b) => b.localeCompare(a))
        const categories = processedData.metadata?.detected_categories ? [...processedData.metadata.detected_categories] : [...new Set(normalizedCutoffs.map(item => item.category))]
        categories.sort()
        // Populate course options - use getUniqueCourses to deduplicate year-specific variations
        const rawCourses = processedData.metadata?.auto_detected_courses
          ? [...processedData.metadata.auto_detected_courses]
          : [...new Set(normalizedCutoffs.map(item => item.course))]
        // Apply normalization and deduplication
        const courses = getUniqueCourses(rawCourses)
        courses.sort()

        // Debug: Log some course names to see what we're working with
        )
        .slice(0, 10))

        // Filter institutes to only E001-E314 and remove duplicates
        let institutes: string[] = []
        if (processedData.metadata?.institute_names) {
          // Use metadata institute names but filter by code range
          const instituteEntries = Object.entries(processedData.metadata.institute_names)
          const filteredEntries = instituteEntries.filter(([code, name]) => {
            const codeNum = parseInt(code.replace('E', ''))
            return codeNum >= 1 && codeNum <= 314
          })
          institutes = filteredEntries.map(([code, name]) => `${name} (${code})`)
        } else {
          // Filter from cutoff data
          const instituteMap = new Map<string, string>()
          normalizedCutoffs.forEach(item => {
            const codeNum = parseInt(item.institute_code.replace('E', ''))
            if (codeNum >= 1 && codeNum <= 314) {
              instituteMap.set(item.institute_code, item.institute)
            }
          })
          institutes = Array.from(instituteMap.entries()).map(([code, name]) => `${name} (${code})`)
        }
        institutes.sort()
        // Rounds will be scoped per selected year; initialize using the latest year's rounds
        // Rounds should reflect the currently selected or latest year (descending years list)
        const latestYear = years[0]
        const rounds = [...new Set(
          normalizedCutoffs
            .filter(item => item.year === latestYear)
            .map(item => item.round)
        )].sort()

        setAvailableYears(years)
        setAvailableCategories(['ALL', ...categories])
        setAvailableCourses(courses)
        setAvailableInstitutes(institutes)
        setAvailableRounds(['ALL', ...rounds])
        setProgress(90)

        // Set default values based on settings
        const s = loadSettings()
        const preferredYear = s.defaultYear && years.includes(s.defaultYear) ? s.defaultYear : years[0]
        setSelectedYear(preferredYear)
        const preferredRound = s.defaultRound && rounds.includes(s.defaultRound) ? s.defaultRound : 'ALL'
        setSelectedRound(preferredRound)
        const preferredCategory = s.defaultCategory && categories.includes(s.defaultCategory) ? s.defaultCategory : 'ALL'
        setUserCategory(preferredCategory)

        , // Show first 10
          courses: courses.slice(0, 10), // Show first 10
          rounds: rounds,
          institutes: institutes.length
        })

        toast({
          title: "Success",
          description: `Loaded ${data.cutoffs.length.toLocaleString()} cutoff entries from consolidated data source!`,
        })

      } catch (error) {
        console.error('Error loading data:', error)
        toast({
          title: "Error",
          description: `Failed to load college data: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: "destructive"
        })
      } finally {
        setProgress(100)
        // brief delay so users can see 100% before content swaps
        setSecondsLeft(0)
        setTimeout(() => setLoading(false), 200)
      }
    }

    loadData()
  }, [toast])

  // Load data from XLSX files automatically
  const loadFromXLSX = async () => {
    setLoading(true)
    setProgress(10)
    try {

      const result = await XLSXLoader.loadAllXLSXFiles()
      setProgress(55)

      // Convert XLSX data to match existing format
      const convertedData: CutoffData[] = result.cutoffs.map(item => ({
        institute: item.institute || '',
        institute_code: item.institute_code || '',
        course: mapCourseName(item.course || ''),
        category: item.category || '',
        cutoff_rank: item.cutoff_rank || 0,
        year: item.year || '',
        round: item.round || ''
      }))

      setCutoffs(convertedData)
      setMetadata(null)
      setProgress(80)

      // Extract unique values for options
      const years = [...new Set(convertedData.map(item => item.year))].sort((a, b) => b.localeCompare(a))
      const categories = [...new Set(convertedData.map(item => item.category))].sort()
      const courses = [...new Set(convertedData.map(item => item.course))].sort()
      const institutes = [...new Set(convertedData.map(item => item.institute))].sort()
      const rounds = [...new Set(convertedData.map(item => item.round))].sort()

      setAvailableYears(years)
      setAvailableCategories(['ALL', ...categories])
      setAvailableCourses(courses)
      setAvailableInstitutes(institutes)
      setAvailableRounds(['ALL', ...rounds])
      setProgress(90)

      // Set default values
      if (years.length > 0) {
        setSelectedYear(years[0])
      }
      if (categories.length > 0) {
        setUserCategory('ALL')
      }
      if (rounds.length > 0) {
        setSelectedRound('ALL')
      }

      toast({
        title: "Success",
        description: `Loaded ${convertedData.length.toLocaleString()} cutoff entries from XLSX files!`,
      })
    } catch (error: any) {
      console.error('Error loading XLSX data:', error)
      toast({
        title: "Error",
        description: error?.message || 'Failed to load XLSX files',
        variant: "destructive"
      })
    } finally {
      setProgress(100)
      setSecondsLeft(0)
      setTimeout(() => setLoading(false), 200)
    }
  }

  // When year changes, recompute available rounds for that year only
  useEffect(() => {
    if (!selectedYear || cutoffs.length === 0) return
    const yearSpecificRounds = [...new Set(
      cutoffs
        .filter(c => c.year === selectedYear)
        .map(c => c.round)
    )].sort()
    setAvailableRounds(['ALL', ...yearSpecificRounds])
    if (!['ALL', ...yearSpecificRounds].includes(selectedRound)) {
      setSelectedRound('ALL')
    }
  }, [selectedYear, cutoffs])

  const findColleges = () => {
    setSearching(true)

    try {

      // Filter data based on user criteria
      // Show colleges where cutoff_rank >= userRank (colleges the user is eligible for)
      // If rank is 69918, show colleges with cutoff 69918, 69919, 70000, 100000, 200000, etc.

      // Use exact category matching - no equivalents
      // When user selects 3AG, show ONLY 3AG entries, not 3AR, 3AK, etc.

      let filteredData = cutoffs.filter(cutoff => {
        const yearMatch = cutoff.year === selectedYear
        const roundMatch = selectedRound === 'ALL' || cutoff.round === selectedRound
        // Exact category match only
        const categoryMatch = userCategory === 'ALL' || cutoff.category === userCategory
        // Only show colleges where user is eligible (cutoff rank >= user's rank)
        const isEligible = cutoff.cutoff_rank >= userRank

        return yearMatch && roundMatch && categoryMatch && isEligible
      })

      // Debug: Log some sample data to understand what's being filtered
      )






      // Debug: Check for Sri Sairam College specifically
      const sriSairamEntries = cutoffs.filter(c =>
        c.institute.toLowerCase().includes('sri sairam') &&
        c.category === userCategory &&
        c.year === selectedYear &&
        (selectedRound === 'ALL' || c.round === selectedRound)
      )

      sriSairamEntries.forEach(entry => {

      })

      // Debug: Show ALL Sri Sairam entries regardless of criteria
      const allSriSairamEntries = cutoffs.filter(c =>
        c.institute.toLowerCase().includes('sri sairam')
      )

      allSriSairamEntries.forEach(entry => {

      })

      // Also check all entries for the specific criteria
      const allMatchingEntries = cutoffs.filter(c =>
        c.category === userCategory &&
        c.year === selectedYear &&
        (selectedRound === 'ALL' || c.round === selectedRound)
      )

      )

      // Filter by selected courses - SMART MATCHING ACROSS YEAR VARIATIONS
      if (selectedCourses.length > 0) {
        filteredData = filteredData.filter(cutoff => {
          // Use the new isSameCourse function for pattern-based matching
          // This handles year-specific variations like:
          // "Computer Science And Engineering" (2023) vs "COMPUTER SCIENCE AND ENGINEERING" (2024)
          for (const selectedCourse of selectedCourses) {
            if (isSameCourse(cutoff.course, selectedCourse)) {
              return true
            }
          }

          // Fallback: Try matching by course codes
          const cutoffCourseCode = getCourseCode(cutoff.course)
          if (cutoffCourseCode) {
            const selectedCourseCodes = selectedCourses.map(c => getCourseCode(c)).filter(code => code)
            if (selectedCourseCodes.includes(cutoffCourseCode)) {
              return true
            }
          }

          return false
        })

      }

      // Filter by selected institute (optional)
      if (selectedInstitute) {
        // Extract institute code from selected institute (format: "Name (E001)")
        const selectedInstituteMatch = selectedInstitute.match(/\(([^)]+)\)/)
        const selectedInstituteCode = selectedInstituteMatch ? selectedInstituteMatch[1] : null
        const selectedInstituteName = selectedInstitute.replace(/\s*\([^)]+\)$/, '').trim()

        filteredData = filteredData.filter(cutoff => {
          // Match by exact institute name
          if (cutoff.institute.toLowerCase() === selectedInstituteName.toLowerCase()) {
            return true
          }

          // Match by institute code
          if (selectedInstituteCode && cutoff.institute_code.toLowerCase() === selectedInstituteCode.toLowerCase()) {
            return true
          }

          // Match by partial name (fallback)
          if (cutoff.institute.toLowerCase().includes(selectedInstituteName.toLowerCase())) {
            return true
          }

          return false
        })

      }

      // Filter by location
      if (locationFilter) {
        filteredData = filteredData.filter(cutoff =>
          cutoff.institute.toLowerCase().includes(locationFilter.toLowerCase())
        )

      }

      // Note: eligibleOnly filter removed - now automatically shows only colleges where user has a chance
      // (cutoff_rank > userRank means better chances of admission)

      // Helper function to calculate admission probability based on margin
      const calculateAdmissionProbability = (cutoffRank: number, userRank: number): { probability: 'High' | 'Moderate' | 'Borderline' | 'Exact', marginPercent: number } => {
        if (cutoffRank === userRank) {
          return { probability: 'Exact', marginPercent: 0 }
        }
        const margin = cutoffRank - userRank
        const marginPercent = (margin / userRank) * 100

        if (marginPercent > 20) {
          return { probability: 'High', marginPercent }
        } else if (marginPercent > 5) {
          return { probability: 'Moderate', marginPercent }
        } else {
          return { probability: 'Borderline', marginPercent }
        }
      }

      // Map data - all shown colleges are eligible (filtered above)
      // Calculate admission probability based on margin between cutoff and user rank
      const matchesWithScores: CollegeMatch[] = filteredData.map(cutoff => {
        const { probability, marginPercent } = calculateAdmissionProbability(cutoff.cutoff_rank, userRank)
        return {
          ...cutoff,
          matchScore: 100,
          safetyLevel: 'Eligible' as const,
          admissionProbability: probability,
          marginPercent: Math.round(marginPercent * 10) / 10 // Round to 1 decimal
        }
      })

      // Deduplicate results based on unique combination of key fields
      const seen = new Set<string>()
      const deduplicatedMatches = matchesWithScores.filter(match => {
        const key = `${match.institute_code}|${match.course}|${match.category}|${match.year}|${match.round}|${match.cutoff_rank}`
        if (seen.has(key)) {
          return false
        }
        seen.add(key)
        return true
      })

      // Sort by cutoff rank based on user preference
      // Ascending: shows colleges with cutoff ranks closest to user rank first (default)
      // Descending: shows colleges with highest cutoff ranks first
      deduplicatedMatches.sort((a, b) => {
        return sortOrder === 'asc'
          ? a.cutoff_rank - b.cutoff_rank
          : b.cutoff_rank - a.cutoff_rank
      })

      // Show all matches (no limit)
      setMatches(deduplicatedMatches)
      // Publish to shared store for Analytics
      finderStore.setState({
        userRank,
        userCategory,
        selectedYear,
        selectedRound,
        selectedInstitute,
        selectedCourses,
        locationFilter,
        matches: deduplicatedMatches,
      })

    } catch (error) {
      console.error('Error finding colleges:', error)
      toast({
        title: "Error",
        description: "Failed to find colleges",
        variant: "destructive"
      })
    } finally {
      setSearching(false)
    }
  }

  const getSafetyColor = (level: string) => {
    if (level === 'Eligible') {
      return 'bg-green-100 text-green-800'
    }
    return 'bg-red-100 text-red-800' // Not Eligible
  }

  const getMatchColor = (score: number) => {
    return score >= 100 ? 'text-green-600' : 'text-red-600'
  }

  // Helper function to get admission probability badge color
  const getAdmissionProbabilityColor = (probability: string) => {
    switch (probability) {
      case 'High':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Borderline':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Exact':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Helper function to get admission probability icon
  const getAdmissionProbabilityIcon = (probability: string) => {
    switch (probability) {
      case 'High':
        return '✅'
      case 'Moderate':
        return '⚠️'
      case 'Borderline':
        return '🔶'
      case 'Exact':
        return '🎯'
      default:
        return '❓'
    }
  }

  // Helper function to get category display name
  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, string> = {
      'GM': 'General (GM)',
      'GMK': 'General Karnataka (GMK)',
      'GMR': 'General Rural (GMR)',
      '1G': 'Category 1G',
      '1K': 'Category 1K',
      '1R': 'Category 1R',
      '2AG': 'Category 2AG',
      '2AK': 'Category 2AK',
      '2AR': 'Category 2AR',
      '2BG': 'Category 2BG',
      '2BK': 'Category 2BK',
      '2BR': 'Category 2BR',
      '3AG': 'Category 3AG',
      '3AK': 'Category 3AK',
      '3AR': 'Category 3AR',
      '3BG': 'Category 3BG',
      '3BK': 'Category 3BK',
      '3BR': 'Category 3BR',
      'SCG': 'Scheduled Caste General (SCG)',
      'SCK': 'Scheduled Caste Karnataka (SCK)',
      'SCR': 'Scheduled Caste Rural (SCR)',
      'STG': 'Scheduled Tribe General (STG)',
      'STK': 'Scheduled Tribe Karnataka (STK)',
      'STR': 'Scheduled Tribe Rural (STR)'
    }
    return categoryNames[category] || category
  }

  // Helper function to get round display name
  const getRoundDisplayName = (round: string) => {
    const roundNames: Record<string, string> = {
      'R1': 'Round 1',
      'R2': 'Round 2',
      'R3': 'Round 3 (Extended)',
      'EXT': 'Round 3 (Extended)',
      'MR1': 'Mock Round 1',
      'MOCK': 'Mock Round 1'
    }
    return roundNames[round] || round
  }

  // Helper function to get course code from course name - ULTRA ACCURATE
  const getCourseCode = (courseName: string): string => {
    if (!courseName) return ''

    const normalizedCourseName = courseName.toLowerCase().trim()

    // EXACT MATCH: Try to find the code by exact course name match
    for (const [code, name] of Object.entries(courseCodeToName)) {
      if (name.toLowerCase().trim() === normalizedCourseName) {

        return code
      }
    }

    // CLEAN MATCH: Try matching with line breaks and extra spaces removed
    const cleanCourseName = courseName.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
    for (const [code, name] of Object.entries(courseCodeToName)) {
      const cleanName = name.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
      if (cleanName === cleanCourseName) {

        return code
      }
    }

    // PARTIAL MATCH: Only if course name contains key engineering terms
    const engineeringTerms = ['computer', 'electronics', 'electrical', 'mechanical', 'civil', 'information', 'artificial', 'robotics', 'bio', 'chemical', 'telecommunication', 'instrumentation', 'medical', 'aeronautical', 'aerospace', 'automobile', 'automotive', 'mining', 'marine', 'petroleum', 'polymer', 'ceramics', 'textile', 'silk', 'architecture', 'planning', 'design', 'data', 'cyber', 'cloud', 'devops', 'blockchain', 'iot', 'vlsi', 'mechatronics', 'nanotechnology', 'energy', 'environmental', 'agriculture', 'food', 'dairy', 'fisheries', 'forestry', 'horticulture', 'sericulture']

    const courseWords = cleanCourseName.split(' ')
    const hasEngineeringTerm = courseWords.some(word => engineeringTerms.includes(word))

    if (hasEngineeringTerm) {
      for (const [code, name] of Object.entries(courseCodeToName)) {
        const cleanName = name.replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
        const nameWords = cleanName.split(' ')

        // Check if at least 2 key words match
        const matchingWords = courseWords.filter(word =>
          nameWords.includes(word) && word.length > 2
        )

        if (matchingWords.length >= 2) {
          })`)
          return code
        }
      }
    }

    return '' // Return empty string if no code found
  }

  // Debug function to test course code matching
  const debugCourseCodeMatching = () => {

    const sampleCourses = availableCourses.slice(0, 20)
    sampleCourses.forEach(course => {
      const code = getCourseCode(course)

    })

  }

  // Compute analytics from metadata with fallback to computed values from cutoffs
  const analytics = (() => {
    const totalEntries = metadata?.total_entries ?? cutoffs.length
    const totalInstitutes = metadata?.total_institutes ?? new Set(cutoffs.map(c => c.institute_code)).size
    const totalCourses = metadata?.total_courses ?? new Set(cutoffs.map(c => c.course)).size
    const totalCategories = metadata?.total_categories ?? new Set(cutoffs.map(c => c.category)).size
    const yearsCovered = metadata?.years_covered ?? Array.from(new Set(cutoffs.map(c => c.year))).sort((a, b) => b.localeCompare(a))
    return { totalEntries, totalInstitutes, totalCourses, totalCategories, yearsCovered }
  })()

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">College Finder</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Find the best colleges based on your KCET rank and preferences</p>
          </div>
          <div className="py-8 mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress + Tips */}
            <div className="lg:col-span-1 max-w-2xl w-full mx-auto">
              <div className="flex items-center gap-3 mb-3 justify-start">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="text-muted-foreground">Loading college data from consolidated data source…</p>
              </div>

              {/* Data Size Disclaimer */}
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-blue-800 dark:text-blue-200 font-medium mb-1">Please wait while we load the data</p>
                    <p className="text-blue-700 dark:text-blue-300 text-xs">
                      The dataset is approximately <strong>50 MB</strong> and contains comprehensive KCET cutoff data from multiple years.
                      This may take a few seconds to load and process.
                    </p>
                  </div>
                </div>
              </div>

              <Progress value={progress} />
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-muted-foreground">{loadingTips[tipIndex]}</div>
                <div className="text-right text-xs text-muted-foreground">{Math.round(progress)}% • ~{secondsLeft}s left</div>
              </div>

              {/* Step checklist tied to progress */}
              <div className="mt-4 space-y-2 text-sm">
                {[
                  { label: 'Fetching dataset', threshold: 20 },
                  { label: 'Parsing entries', threshold: 45 },
                  { label: 'Normalizing courses', threshold: 70 },
                  { label: 'Preparing filters', threshold: 85 },
                  { label: 'Finalizing', threshold: 100 },
                ].map((step, idx) => {
                  const done = progress >= step.threshold
                  return (
                    <div key={idx} className={`flex items-center gap-2 ${done ? 'text-green-700' : 'text-muted-foreground'}`}>
                      <span className={`h-4 w-4 rounded-full border ${done ? 'bg-green-500 border-green-500' : 'border-muted-foreground/40'}`}></span>
                      <span>{step.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Skeleton previews to reduce perceived wait */}
            <div className="lg:col-span-2">
              <div className="grid gap-6">
                {/* Search Criteria skeleton */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Skeleton className="h-9 w-40" />
                    <Skeleton className="h-9 w-36" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                  </div>
                </div>

                {/* Results table skeleton */}
                <div className="border rounded-md p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                  <div className="space-y-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="grid grid-cols-5 gap-3 items-center">
                        <Skeleton className="h-4 w-full col-span-2" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">College Finder</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Find the best colleges based on your KCET rank and preferences</p>
        </div>

        {/* Disclaimer */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800">
                <p className="font-medium mb-1">Important Disclaimer</p>
                <p>
                  Please cross-check all cutoff data with the official KCET PDFs from KEA website.
                  Our filtering system might miss an entry or two, so always verify critical information
                  from the original source documents.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Criteria */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Criteria
              </CardTitle>
              {isMobile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className={`space-y-6 ${isMobile && !showFilters ? 'hidden' : ''}`}>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {/* Rank Input */}
                <div className="space-y-2">
                  <Label htmlFor="rank">Your KCET Rank</Label>
                  <Input
                    id="rank"
                    type="number"
                    value={userRank}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0
                      setUserRank(val)
                      finderStore.setState({ userRank: val })
                    }}
                    placeholder="Enter your rank"
                  />
                  <p className="text-xs text-muted-foreground">
                    <strong>Tip:</strong> Colleges with cutoff ranks <strong>higher than your rank</strong> are your best chances for admission.
                  </p>
                </div>
                {/* What If Slider */}
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center text-xs">
                    <Label htmlFor="rank-slider" className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      What-If Slider
                    </Label>
                    <span className="text-muted-foreground font-mono">
                      ±20% Adjustment
                    </span>
                  </div>
                  <Slider
                    id="rank-slider"
                    min={1}
                    max={300000}
                    step={100}
                    value={[userRank]}
                    onValueChange={(val) => {
                      const newRank = val[0]
                      setUserRank(newRank)
                      finderStore.setState({ userRank: newRank })
                    }}
                    className="py-1 cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">
                    Drag to instantly see how your options change with a better/worse rank.
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={userCategory} onValueChange={setUserCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === 'ALL' ? 'All Categories' : getCategoryDisplayName(category)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Round */}
                <div className="space-y-2">
                  <Label>Round</Label>
                  <Select value={selectedRound} onValueChange={setSelectedRound}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select round" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRounds.map((round) => (
                        <SelectItem key={round} value={round}>
                          {round === 'ALL' ? 'All Rounds' : getRoundDisplayName(round)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Institute (Optional) */}
                <div className="space-y-2">
                  <Label>Institute (Optional)</Label>
                  <Select value={selectedInstitute} onValueChange={setSelectedInstitute}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select institute (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableInstitutes.map((inst) => (
                        <SelectItem key={inst} value={inst}>
                          {inst}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="City or district"
                  />
                </div>

                {/* Rank Range */}
                <div className="space-y-2">
                  <Label>Rank Range: {minRank.toLocaleString()} - {maxRank.toLocaleString()}</Label>
                  <div className="space-y-4">
                    <Slider
                      value={[minRank, maxRank]}
                      onValueChange={([min, max]) => {
                        setMinRank(min)
                        setMaxRank(max)
                      }}
                      max={300000}
                      min={1}
                      step={1000}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Search Button & Actions - Mobile Optimized */}
                <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-3">
                  <Button
                    onClick={findColleges}
                    disabled={searching || !userCategory || !selectedYear || !selectedRound}
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    {searching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Finding Colleges...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Find Colleges
                      </>
                    )}
                  </Button>

                  {/* Sort & Action Controls - Wrap on mobile */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <Label htmlFor="sort-order" className="text-xs sm:text-sm font-medium whitespace-nowrap">
                        Sort:
                      </Label>
                      <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                        <SelectTrigger className="w-full sm:w-36 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc">
                            <div className="flex items-center gap-2">
                              <ChevronUp className="h-4 w-4" />
                              <span className="hidden sm:inline">Ascending</span>
                              <span className="sm:hidden">Asc</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="desc">
                            <div className="flex items-center gap-2">
                              <ChevronDown className="h-4 w-4" />
                              <span className="hidden sm:inline">Descending</span>
                              <span className="sm:hidden">Desc</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setUserRank(50000)
                          setUserCategory("")
                          setSelectedYear("")
                          setSelectedRound("")
                          setSelectedInstitute("")
                          setSelectedCourses([])
                          setLocationFilter("")
                          setMinRank(1)
                          setMaxRank(300000)
                          setMatches([])
                          setCollegeSearchTerm("")
                          finderStore.setState({
                            userRank: 50000,
                            userCategory: '',
                            selectedYear: '',
                            selectedRound: '',
                            selectedInstitute: '',
                            selectedCourses: [],
                            locationFilter: '',
                            matches: [],
                          })
                        }}
                        className="h-9 w-9"
                        title="Clear all filters"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={loadFromXLSX}
                        className="h-9 w-9"
                        title="Load from XLSX files"
                      >
                        <FileSpreadsheet className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>



                {/* Course Selection - searchable multi-select */}
                <div className="mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-medium">Select Courses (Optional)</Label>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                        BETA
                      </Badge>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium text-orange-800">Course Selection Beta</h4>
                            <p className="text-sm text-muted-foreground">
                              This feature is still in development and may have some issues:
                            </p>
                            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                              <li>• Some courses may not be properly mapped</li>
                              <li>• Course matching might be inconsistent</li>
                              <li>• Data accuracy may vary</li>
                            </ul>
                            <p className="text-xs text-muted-foreground">
                              We're working to improve course mapping and data accuracy.
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {selectedCourses.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCourses([])}
                        className="text-xs self-start sm:self-auto"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                  <div className="mt-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {selectedCourses.length > 0 ? `${selectedCourses.length} selected` : 'Search & select courses'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[min(700px,90vw)]">
                        <Command>
                          <CommandInput placeholder="Search courses..." />
                          <CommandEmpty>No courses found.</CommandEmpty>
                          <CommandList>
                            <CommandGroup>
                              {availableCourses.map((course) => {
                                const isSelected = selectedCourses.includes(course)
                                const courseCode = getCourseCode(course)
                                return (
                                  <CommandItem
                                    key={course}
                                    value={course}
                                    onSelect={() => {
                                      if (isSelected) {
                                        setSelectedCourses(selectedCourses.filter(c => c !== course))
                                      } else {
                                        setSelectedCourses([...selectedCourses, course])
                                      }
                                    }}
                                  >
                                    <Check className={`mr-2 h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                                    <div className="flex items-center gap-2">
                                      {courseCode && (
                                        <Badge variant="secondary" className="text-xs font-mono">
                                          {courseCode}
                                        </Badge>
                                      )}
                                      <span className="truncate">{course}</span>
                                    </div>
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {selectedCourses.length > 0 && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <div className="flex flex-wrap gap-1">
                          {selectedCourses.map(course => {
                            const courseCode = getCourseCode(course)
                            return (
                              <span key={course} className="text-xs bg-muted px-2 py-1 rounded">
                                {courseCode ? `${courseCode}: ${course}` : course}
                              </span>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Results */}
        {matches.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  College Matches ({matches.length} found)
                </CardTitle>
                <div className="flex items-center gap-2">
                  {bookmarks.size > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Bookmark className="h-3 w-3" />
                      {bookmarks.size} bookmarked
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={exportToCSV} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2 mt-4">
                <p>
                  <strong>How to read results:</strong> Colleges are shown where the cutoff rank is <strong>≥ your rank ({userRank.toLocaleString()})</strong>.
                </p>
              </div>

              {/* Search Bar for Found Colleges */}
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search colleges by name, code, or rank..."
                    value={collegeSearchTerm}
                    onChange={(e) => setCollegeSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Search among found colleges by college name, institute code, or cutoff rank
                </p>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filter matches based on search term and apply sorting */}
              {(() => {
                let filteredMatches = collegeSearchTerm
                  ? matches.filter(match => {
                    const searchTerm = collegeSearchTerm.toLowerCase().trim()

                    // Search by college name
                    if (match.institute.toLowerCase().includes(searchTerm)) {
                      return true
                    }

                    // Search by institute code
                    if (match.institute_code.toLowerCase().includes(searchTerm)) {
                      return true
                    }

                    // Search by cutoff rank
                    if (match.cutoff_rank.toString().includes(searchTerm)) {
                      return true
                    }

                    // Search by course name
                    if (match.course.toLowerCase().includes(searchTerm)) {
                      return true
                    }

                    return false
                  })
                  : matches

                // Apply sorting to filtered results
                filteredMatches = [...filteredMatches].sort((a, b) => {
                  return sortOrder === 'asc'
                    ? a.cutoff_rank - b.cutoff_rank
                    : b.cutoff_rank - a.cutoff_rank
                })

                return (
                  <div className="space-y-4">
                    {collegeSearchTerm && (
                      <div className="text-sm text-muted-foreground">
                        Showing {filteredMatches.length} of {matches.length} colleges matching "{collegeSearchTerm}"
                      </div>
                    )}

                    {/* Desktop Table */}
                    <div className="hidden lg:block rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-10"></TableHead>
                            <TableHead>College</TableHead>
                            <TableHead>Course</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="cursor-pointer select-none" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                              <div className="flex items-center gap-1">
                                Cutoff Rank
                                {sortOrder === 'asc' ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Round</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMatches.map((match, index) => {
                            const bookmarkKey = `${match.institute_code}-${match.course}-${match.category}`
                            const isBookmarked = bookmarks.has(bookmarkKey)
                            return (
                              <TableRow key={`${match.institute_code}-${match.course}-${index}`}>
                                <TableCell className="w-24">
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => toggleBookmark(bookmarkKey)}
                                      title="Bookmark"
                                    >
                                      <Star className={`h-4 w-4 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={`h-8 w-8 p-0 ${compareList.some(c => c.institute_code === match.institute_code && c.course === match.course) ? 'bg-primary/10 text-primary' : ''}`}
                                      onClick={() => toggleCompare(match)}
                                      title="Compare"
                                    >
                                      <Scale className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{match.institute}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {match.institute_code}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{match.course}</div>
                                    {getCourseCode(match.course) && (
                                      <div className="text-sm text-muted-foreground font-mono">
                                        {getCourseCode(match.course)}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{match.category}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="font-mono font-semibold">
                                    {match.cutoff_rank.toLocaleString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {match.year}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {getRoundDisplayName(match.round)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden space-y-3">
                      {filteredMatches.map((match, index) => {
                        const bookmarkKey = `${match.institute_code}-${match.course}-${match.category}`
                        const isBookmarked = bookmarks.has(bookmarkKey)
                        return (
                          <Card key={`${match.institute_code}-${match.course}-${index}`} className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-medium text-lg">{match.institute}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {match.institute_code}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 flex-shrink-0"
                                    onClick={() => toggleBookmark(bookmarkKey)}
                                  >
                                    <Star className={`h-5 w-5 ${isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 w-8 p-0 flex-shrink-0 ${compareList.some(c => c.institute_code === match.institute_code && c.course === match.course) ? 'bg-primary/10 text-primary' : ''}`}
                                    onClick={() => toggleCompare(match)}
                                  >
                                    <Scale className="h-5 w-5" />
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <div className="font-medium">{match.course}</div>
                                {getCourseCode(match.course) && (
                                  <div className="text-sm text-muted-foreground font-mono">
                                    {getCourseCode(match.course)}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">{match.category}</Badge>
                                <Badge variant="outline">{match.year}</Badge>
                                <Badge variant="outline">{getRoundDisplayName(match.round)}</Badge>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Cutoff Rank:</span>
                                <span className="font-mono font-semibold text-lg">
                                  {match.cutoff_rank.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </Card>
                        )
                      })}
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!loading && !searching && matches.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No colleges found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or rank range</p>
            </CardContent>
          </Card>
        )}
        {/* Comparison Floating Bar */}
        {compareList.length > 0 && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50">
            <div className="bg-primary text-primary-foreground p-4 rounded-xl shadow-2xl flex items-center justify-between border border-primary/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{compareList.length} Selected</p>
                  <p className="text-xs opacity-80">Max 3 colleges</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setCompareList([])}
                  className="h-8 px-2 bg-white/10 hover:bg-white/20 border-0 text-white"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 font-semibold shadow-md"
                  onClick={() => setShowCompareModal(true)}
                >
                  Compare Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Modal Overlay */}
        {showCompareModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-5xl bg-card border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">College Comparison</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowCompareModal(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="overflow-auto p-6">
                <div className="grid grid-cols-[150px_repeat(auto-fit,minmax(250px,1fr))] gap-4 min-w-[800px]">
                  {/* Labels Column */}
                  <div className="space-y-4 pt-14 font-medium text-muted-foreground text-sm">
                    <div className="h-24 flex items-center">College Name</div>
                    <div className="h-10 flex items-center">Cutoff Rank</div>
                    <div className="h-10 flex items-center">Course</div>
                    <div className="h-10 flex items-center">Category</div>
                    <div className="h-10 flex items-center">Match Score</div>
                    <div className="h-10 flex items-center">Safety</div>
                    <div className="h-10 flex items-center">Year/Round</div>
                  </div>

                  {/* College Columns */}
                  {compareList.map((college, i) => (
                    <div key={i} className="space-y-4 bg-muted/10 p-4 rounded-xl border relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => toggleCompare(college)}
                      >
                        <X className="h-4 w-4" />
                      </Button>

                      <div className="h-10 flex items-center justify-center">
                        <Badge variant="outline" className="bg-background">Choice #{i + 1}</Badge>
                      </div>

                      <div className="h-24 flex items-center font-semibold text-lg leading-tight">
                        {college.institute}
                        <span className="block text-xs font-normal text-muted-foreground ml-1">({college.institute_code})</span>
                      </div>

                      <div className="h-10 flex items-center text-2xl font-bold font-mono text-primary">
                        {college.cutoff_rank.toLocaleString()}
                      </div>

                      <div className="h-10 flex items-center font-medium truncate" title={college.course}>
                        {college.course}
                      </div>

                      <div className="h-10 flex items-center">
                        <Badge variant="secondary">{college.category}</Badge>
                      </div>

                      <div className="h-10 flex items-center">
                        <div className={`font-bold ${getMatchColor(college.matchScore)}`}>
                          {college.matchScore}% Match
                        </div>
                      </div>

                      <div className="h-10 flex items-center">
                        <Badge className={getSafetyColor(college.safetyLevel)}>
                          {college.safetyLevel}
                        </Badge>
                      </div>

                      <div className="h-10 flex items-center text-sm text-muted-foreground">
                        {college.year} • {getRoundDisplayName(college.round)}
                      </div>
                    </div>
                  ))}

                  {compareList.length < 3 && (
                    <div className="space-y-4 p-4 rounded-xl border border-dashed flex flex-col items-center justify-center text-muted-foreground bg-muted/5">
                      <Scale className="h-10 w-10 opacity-20 mb-2" />
                      <p>Add another college</p>
                      <Button variant="outline" size="sm" onClick={() => setShowCompareModal(false)}>
                        Browse List
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t bg-muted/20 flex justify-end">
                <Button onClick={() => setShowCompareModal(false)}>Done</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollegeFinder
import { useState, useEffect, useMemo, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { COLLEGE_DATABASE, CollegeInfo, TIER_COLORS, TYPE_COLORS } from "@/data/collegeDatabase"
import { mergeSingleCollege } from "@/lib/college-service"
import { CollegeLogo } from "@/components/college/CollegeLogo"
import { 
  Building2, Search, Save, Loader2, Globe, MapPin, 
  Calendar, GraduationCap, Award, RotateCcw, ShieldAlert, Sparkles,
  ArrowLeft, Upload, X, CheckCircle2, ChevronDown, Check, Image as ImageIcon
} from "lucide-react"

const FACILITIES_OPTIONS = [
  "Library", "Labs", "Hostel", "Sports Complex", "Sports Ground", 
  "Cafeteria", "Wi-Fi", "Gym", "Auditorium", "Innovation Centre", 
  "Incubation Centre", "Research Centre"
]

const ALL_DISTRICTS = [...new Set(COLLEGE_DATABASE.map(c => c.district))].sort()

export function AdminCollegeEditor() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("ALL")
  const [selectedType, setSelectedType] = useState("ALL")
  const [selectedStatus, setSelectedStatus] = useState("ALL") // ALL, OVERRIDDEN, DEFAULT
  const [selectedTier, setSelectedTier] = useState("ALL")
  const [sortBy, setSortBy] = useState("CODE")
  const [visibleCount, setVisibleCount] = useState(24)

  const [selectedCode, setSelectedCode] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [overrides, setOverrides] = useState<Record<string, any>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Form State
  const [name, setName] = useState("")
  const [website, setWebsite] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [established, setEstablished] = useState("")
  const [type, setType] = useState<CollegeInfo["type"]>("Private")
  const [autonomous, setAutonomous] = useState(false)
  const [tier, setTier] = useState<CollegeInfo["tier"]>("Tier 3")
  const [naacGrade, setNaacGrade] = useState("N/A")
  const [nbaAccredited, setNbaAccredited] = useState("")
  const [nirfRank, setNirfRank] = useState("")

  const [feeCetQuota, setFeeCetQuota] = useState("")
  const [feeManagement, setFeeManagement] = useState("")

  const [minPackage, setMinPackage] = useState("")
  const [avgPackage, setAvgPackage] = useState("")
  const [medianPackage, setMedianPackage] = useState("")
  const [maxPackage, setMaxPackage] = useState("")
  const [placementRate, setPlacementRate] = useState("")
  const [topRecruiters, setTopRecruiters] = useState("")
  const [facilities, setFacilities] = useState<string[]>([])
  const [tags, setTags] = useState("")
  const [totalIntake, setTotalIntake] = useState("")

  // CSV Import state
  const [showCsvImport, setShowCsvImport] = useState(false)
  const [csvText, setCsvText] = useState("")
  const [csvParsedRows, setCsvParsedRows] = useState<any[]>([])
  const [csvValidationErrors, setCsvValidationErrors] = useState<string[]>([])
  const [csvWarnings, setCsvWarnings] = useState<string[]>([])
  const [isBulkImporting, setIsBulkImporting] = useState(false)

  // Single CSV Import states
  const [showSingleCsvImport, setShowSingleCsvImport] = useState(false)
  const [singleCsvText, setSingleCsvText] = useState("")

  // Parse CSV formatted text helper (supporting double quotes and escaped quotes)
  const parseCsvString = (text: string): string[][] => {
    const lines: string[][] = []
    let row: string[] = []
    let inQuotes = false
    let currentVal = ""
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const nextChar = text[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"'
          i++ // skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentVal)
        currentVal = ""
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++ // skip LF
        }
        row.push(currentVal)
        if (row.length > 0 && row.some(val => val.trim() !== "")) {
          lines.push(row)
        }
        row = []
        currentVal = ""
      } else {
        currentVal += char
      }
    }
    
    if (currentVal !== "" || row.length > 0) {
      row.push(currentVal)
      if (row.some(val => val.trim() !== "")) {
        lines.push(row)
      }
    }
    
    return lines
  }

  // Validate parsed CSV values
  const handleValidateCsv = () => {
    if (!csvText.trim()) {
      toast({
        title: "Empty Input",
        description: "Please paste some CSV text first.",
        variant: "destructive"
      })
      return;
    }

    try {
      const parsed = parseCsvString(csvText)
      if (parsed.length < 2) {
        toast({
          title: "Invalid CSV format",
          description: "CSV must contain at least a header row and one data row.",
          variant: "destructive"
        })
        return;
      }

      const headers = parsed[0].map(h => h.toLowerCase().trim().replace(/['"]/g, "").replace(/\s+/g, "_"))
      const dataRows = parsed.slice(1)
      
      // Find 'code' column index
      const codeIndex = headers.findIndex(h => h === "code")
      if (codeIndex === -1) {
        toast({
          title: "Header Missing",
          description: "The CSV headers must include a 'code' column (case-insensitive).",
          variant: "destructive"
        })
        return;
      }

      const HEADER_MAPPINGS: Record<string, string> = {
        code: 'code',
        name: 'name',
        college_name: 'name',
        collegename: 'name',
        fullname: 'name',
        full_name: 'name',
        website: 'website',
        website_url: 'website',
        established_year: 'established_year',
        established: 'established_year',
        est: 'established_year',
        est_year: 'established_year',
        location: 'location',
        city: 'location',
        district: 'district',
        type: 'type',
        logo_url: 'logo_url',
        logourl: 'logo_url',
        photo_url: 'logo_url',
        photourl: 'logo_url',
        image_url: 'logo_url',
        imageurl: 'logo_url',
        fee_cet: 'feeCetQuota',
        feecetquota: 'feeCetQuota',
        cet_fee: 'feeCetQuota',
        cetfee: 'feeCetQuota',
        cet_quota: 'feeCetQuota',
        cetquota: 'feeCetQuota',
        fee_mgmt: 'feeManagement',
        feemanagement: 'feeManagement',
        mgmt_fee: 'feeManagement',
        mgmtfee: 'feeManagement',
        mgmt_quota: 'feeManagement',
        mgmtquota: 'feeManagement',
        min_package: 'minPackage',
        minpackage: 'minPackage',
        lowest_package: 'minPackage',
        lowestpackage: 'minPackage',
        lowest_lpa: 'minPackage',
        lowestlpa: 'minPackage',
        min_lpa: 'minPackage',
        minlpa: 'minPackage',
        avg_package: 'avgPackage',
        avgpackage: 'avgPackage',
        average_package: 'avgPackage',
        averagepackage: 'avgPackage',
        avg_lpa: 'avgPackage',
        avglpa: 'avgPackage',
        average_lpa: 'avgPackage',
        averagelpa: 'avgPackage',
        median_package: 'medianPackage',
        medianpackage: 'medianPackage',
        median_lpa: 'medianPackage',
        medianlpa: 'medianPackage',
        max_package: 'maxPackage',
        maxpackage: 'maxPackage',
        highest_package: 'maxPackage',
        highestpackage: 'maxPackage',
        highest_lpa: 'maxPackage',
        highestlpa: 'maxPackage',
        max_lpa: 'maxPackage',
        maxlpa: 'maxPackage',
        placement_rate: 'placementRate',
        placementrate: 'placementRate',
        placement_ratio: 'placementRate',
        placementratio: 'placementRate',
        placement_percent: 'placementRate',
        placementpercent: 'placementRate',
        top_recruiters: 'topRecruiters',
        toprecruiters: 'topRecruiters',
        recruiters: 'topRecruiters',
        companies: 'topRecruiters',
        tier: 'tier',
        naac_grade: 'naacGrade',
        naacgrade: 'naacGrade',
        naac: 'naacGrade',
        nba_accredited: 'nbaAccredited',
        nbaaccredited: 'nbaAccredited',
        nba_programs: 'nbaAccredited',
        nbaprograms: 'nbaAccredited',
        nba: 'nbaAccredited',
        autonomous: 'autonomous',
        is_autonomous: 'autonomous',
        isautonomous: 'autonomous',
        autonomy: 'autonomous',
        nirf_rank: 'nirfRank',
        nirfrank: 'nirfRank',
        nirf: 'nirfRank',
        tags: 'tags',
        badges: 'tags',
        total_seats: 'totalIntake',
        totalseats: 'totalIntake',
        total_intake: 'totalIntake',
        totalintake: 'totalIntake',
        seats: 'totalIntake',
        intake: 'totalIntake',
        capacity: 'totalIntake',
        facilities: 'facilities',
        infrastructure: 'facilities',
        amenities: 'facilities'
      }

      const mappedKeys = headers.map(h => HEADER_MAPPINGS[h] || HEADER_MAPPINGS[h.replace(/[^a-z0-9]/gi, '')] || null)

      const rows: any[] = []
      const warnings: string[] = []
      const errors: string[] = []

      dataRows.forEach((rowArray, idx) => {
        const rowNum = idx + 2 // CSV is 1-indexed, first data row is line 2
        
        // Skip empty lines
        if (rowArray.length === 0 || (rowArray.length === 1 && rowArray[0] === "")) return

        const codeVal = rowArray[codeIndex]?.trim().toUpperCase()
        if (!codeVal) {
          errors.push(`Row ${rowNum}: Missing college code.`)
          return
        }

        const staticCollege = COLLEGE_DATABASE.find(c => c.code.toUpperCase() === codeVal)
        if (!staticCollege) {
          warnings.push(`Row ${rowNum}: Code "${codeVal}" is not in the default KCET 232 database list. Make sure it is correct.`)
        }

        const item: any = { code: codeVal }

        mappedKeys.forEach((key, colIdx) => {
          if (!key || key === 'code') return
          const val = rowArray[colIdx]?.trim()
          if (val === undefined || val === "") return

          // Type parsing
          if (key === 'established_year' || key === 'nbaAccredited' || key === 'nirfRank' || key === 'totalIntake') {
            const parsedInt = parseInt(val)
            if (isNaN(parsedInt)) {
              warnings.push(`Row ${rowNum}: Column "${headers[colIdx]}" has invalid integer "${val}".`)
            } else {
              item[key] = parsedInt
            }
          } else if (key === 'feeCetQuota' || key === 'feeManagement' || key === 'minPackage' || key === 'avgPackage' || key === 'medianPackage' || key === 'maxPackage' || key === 'placementRate') {
            const parsedFloat = parseFloat(val)
            if (isNaN(parsedFloat)) {
              warnings.push(`Row ${rowNum}: Column "${headers[colIdx]}" has invalid number "${val}".`)
            } else {
              item[key] = parsedFloat
            }
          } else if (key === 'autonomous') {
            const lowVal = val.toLowerCase()
            item[key] = lowVal === 'true' || lowVal === '1' || lowVal === 'yes' || lowVal === 'y'
          } else if (key === 'topRecruiters' || key === 'facilities' || key === 'tags') {
            const separator = val.includes(';') ? ';' : ','
            item[key] = val.split(separator).map((s: string) => s.trim()).filter(Boolean)
          } else if (key === 'type') {
            if (["Government", "Private Aided", "Private", "University"].includes(val)) {
              item[key] = val
            } else {
              const lower = val.toLowerCase()
              if (lower.includes('government') || lower === 'gov') item[key] = 'Government'
              else if (lower.includes('aided')) item[key] = 'Private Aided'
              else if (lower.includes('university') || lower === 'uni') item[key] = 'University'
              else item[key] = 'Private'
            }
          } else if (key === 'tier') {
            if (["Tier 1", "Tier 2", "Tier 3", "Tier 4"].includes(val)) {
              item[key] = val
            } else {
              if (val.includes('1')) item[key] = 'Tier 1'
              else if (val.includes('2')) item[key] = 'Tier 2'
              else if (val.includes('3')) item[key] = 'Tier 3'
              else if (val.includes('4')) item[key] = 'Tier 4'
              else item[key] = 'Tier 3'
            }
          } else if (key === 'naacGrade') {
            const grade = val.toUpperCase().replace(/\s/g, '')
            if (["A++", "A+", "A", "B++", "B+", "B", "C", "D", "N/A"].includes(grade)) {
              item[key] = grade
            } else {
              item[key] = "N/A"
            }
          } else {
            item[key] = val
          }
        })

        rows.push(item)
      })

      if (errors.length > 0) {
        setCsvValidationErrors(errors)
        setCsvParsedRows([])
        toast({
          title: "Validation Errors",
          description: `Found ${errors.length} fatal errors in CSV text.`,
          variant: "destructive"
        })
      } else {
        setCsvValidationErrors([])
        setCsvParsedRows(rows)
        setCsvWarnings(warnings)
        toast({
          title: "CSV Validated",
          description: `Successfully parsed ${rows.length} college records. Review the preview below before applying.`,
        })
      }
    } catch (e: any) {
      console.error(e)
      toast({
        title: "Parser Error",
        description: e.message || "Failed to parse CSV string.",
        variant: "destructive"
      })
    }
  }

  // Batch upsert merged values into database
  const handleApplyCsvImport = async () => {
    if (csvParsedRows.length === 0) return
    setIsBulkImporting(true)
    try {
      const payloads = csvParsedRows.map(row => {
        const existingOverride = overrides[row.code.toUpperCase()]
        const staticDefault = COLLEGE_DATABASE.find(c => c.code.toUpperCase() === row.code.toUpperCase())

        const payload = {
          code: row.code.toUpperCase(),
          name: row.name !== undefined ? row.name.trim() : (existingOverride?.name || staticDefault?.name || ""),
          location: row.location !== undefined ? row.location.trim() : (existingOverride?.location || staticDefault?.city || null),
          district: row.district !== undefined ? row.district.trim() : (existingOverride?.district || staticDefault?.district || null),
          established_year: row.established_year !== undefined ? row.established_year : (existingOverride?.established_year ?? staticDefault?.established ?? null),
          type: row.type !== undefined ? row.type : (existingOverride?.type || staticDefault?.type || "Private"),
          website: row.website !== undefined ? row.website.trim() : (existingOverride?.website || staticDefault?.website || null),
          facilities: row.facilities !== undefined ? row.facilities : (existingOverride?.facilities || staticDefault?.facilities || []),
          fees_structure: {
            feeCetQuota: row.feeCetQuota !== undefined ? row.feeCetQuota : (existingOverride?.fees_structure?.feeCetQuota ?? staticDefault?.feeCetQuota ?? null),
            feeManagement: row.feeManagement !== undefined ? row.feeManagement : (existingOverride?.fees_structure?.feeManagement ?? staticDefault?.feeManagement ?? null),
          },
          placement_stats: {
            avgPackage: row.avgPackage !== undefined ? row.avgPackage : (existingOverride?.placement_stats?.avgPackage ?? staticDefault?.avgPackage ?? null),
            medianPackage: row.medianPackage !== undefined ? row.medianPackage : (existingOverride?.placement_stats?.medianPackage ?? staticDefault?.medianPackage ?? null),
            maxPackage: row.maxPackage !== undefined ? row.maxPackage : (existingOverride?.placement_stats?.maxPackage ?? staticDefault?.maxPackage ?? null),
            minPackage: row.minPackage !== undefined ? row.minPackage : (existingOverride?.placement_stats?.minPackage ?? staticDefault?.minPackage ?? null),
            placementRate: row.placementRate !== undefined ? row.placementRate : (existingOverride?.placement_stats?.placementRate ?? staticDefault?.placementRate ?? null),
            topRecruiters: row.topRecruiters !== undefined ? row.topRecruiters : (existingOverride?.placement_stats?.topRecruiters || staticDefault?.topRecruiters || []),
            tier: row.tier !== undefined ? row.tier : (existingOverride?.placement_stats?.tier || staticDefault?.tier || "Tier 3"),
            naacGrade: row.naacGrade !== undefined ? (row.naacGrade === "N/A" ? null : row.naacGrade) : (existingOverride?.placement_stats?.naacGrade || staticDefault?.naacGrade || null),
            nbaAccredited: row.nbaAccredited !== undefined ? row.nbaAccredited : (existingOverride?.placement_stats?.nbaAccredited ?? staticDefault?.nbaAccredited ?? null),
            autonomous: row.autonomous !== undefined ? row.autonomous : (existingOverride?.placement_stats?.autonomous ?? staticDefault?.autonomous ?? false),
            nirfRank: row.nirfRank !== undefined ? row.nirfRank : (existingOverride?.placement_stats?.nirfRank ?? staticDefault?.nirfRank ?? null),
            tags: row.tags !== undefined ? row.tags : (existingOverride?.placement_stats?.tags || staticDefault?.tags || []),
            logoUrl: row.logoUrl !== undefined ? row.logoUrl.trim() : (existingOverride?.placement_stats?.logoUrl || null),
            totalIntake: row.totalIntake !== undefined ? row.totalIntake : (existingOverride?.placement_stats?.totalIntake ?? staticDefault?.totalIntake ?? null)
          }
        }
        return payload
      })

      // Batch upsert (50 records per batch)
      const BATCH_SIZE = 50
      for (let i = 0; i < payloads.length; i += BATCH_SIZE) {
        const batch = payloads.slice(i, i + BATCH_SIZE)
        const { error } = await supabase
          .from('colleges')
          .upsert(batch, { onConflict: 'code' })
        if (error) throw error
      }

      toast({
        title: "Bulk Import Successful",
        description: `Successfully imported/updated ${payloads.length} overrides in the database.`
      })

      setCsvText("")
      setCsvParsedRows([])
      setCsvValidationErrors([])
      setCsvWarnings([])
      setShowCsvImport(false)
      fetchAllOverrides()
    } catch (e: any) {
      console.error(e)
      toast({
        title: "Import Failed",
        description: e.message || "Failed to write bulk records to Supabase.",
        variant: "destructive"
      })
    } finally {
      setIsBulkImporting(false)
    }
  }

  // Parse and fill form fields for the currently active college editor
  const handleFillSingleCollegeFromCsv = () => {
    if (!singleCsvText.trim()) {
      toast({
        title: "Empty Input",
        description: "Please paste some CSV text first.",
        variant: "destructive"
      })
      return
    }

    try {
      const parsed = parseCsvString(singleCsvText)
      if (parsed.length < 2) {
        toast({
          title: "Invalid CSV format",
          description: "CSV must contain a header row and a data row.",
          variant: "destructive"
        })
        return
      }

      const headers = parsed[0].map(h => h.toLowerCase().trim().replace(/['"]/g, "").replace(/\s+/g, "_"))
      const dataRow = parsed[1]

      const HEADER_MAPPINGS: Record<string, string> = {
        code: 'code',
        name: 'name',
        college_name: 'name',
        collegename: 'name',
        fullname: 'name',
        full_name: 'name',
        website: 'website',
        website_url: 'website',
        established_year: 'established_year',
        established: 'established_year',
        est: 'established_year',
        est_year: 'established_year',
        location: 'location',
        city: 'location',
        district: 'district',
        type: 'type',
        logo_url: 'logo_url',
        logourl: 'logo_url',
        photo_url: 'logo_url',
        photourl: 'logo_url',
        image_url: 'logo_url',
        imageurl: 'logo_url',
        fee_cet: 'feeCetQuota',
        feecetquota: 'feeCetQuota',
        cet_fee: 'feeCetQuota',
        cetfee: 'feeCetQuota',
        cet_quota: 'feeCetQuota',
        cetquota: 'feeCetQuota',
        fee_mgmt: 'feeManagement',
        feemanagement: 'feeManagement',
        mgmt_fee: 'feeManagement',
        mgmtfee: 'feeManagement',
        mgmt_quota: 'feeManagement',
        mgmtquota: 'feeManagement',
        min_package: 'minPackage',
        minpackage: 'minPackage',
        lowest_package: 'minPackage',
        lowestpackage: 'minPackage',
        lowest_lpa: 'minPackage',
        lowestlpa: 'minPackage',
        min_lpa: 'minPackage',
        minlpa: 'minPackage',
        avg_package: 'avgPackage',
        avgpackage: 'avgPackage',
        average_package: 'avgPackage',
        averagepackage: 'avgPackage',
        avg_lpa: 'avgPackage',
        avglpa: 'avgPackage',
        average_lpa: 'avgPackage',
        averagelpa: 'avgPackage',
        median_package: 'medianPackage',
        medianpackage: 'medianPackage',
        median_lpa: 'medianPackage',
        medianlpa: 'medianPackage',
        max_package: 'maxPackage',
        maxpackage: 'maxPackage',
        highest_package: 'maxPackage',
        highestpackage: 'maxPackage',
        highest_lpa: 'maxPackage',
        highestlpa: 'maxPackage',
        max_lpa: 'maxPackage',
        maxlpa: 'maxPackage',
        placement_rate: 'placementRate',
        placementrate: 'placementRate',
        placement_ratio: 'placementRate',
        placementratio: 'placementRate',
        placement_percent: 'placementRate',
        placementpercent: 'placementRate',
        top_recruiters: 'topRecruiters',
        toprecruiters: 'topRecruiters',
        recruiters: 'topRecruiters',
        companies: 'topRecruiters',
        tier: 'tier',
        naac_grade: 'naacGrade',
        naacgrade: 'naacGrade',
        naac: 'naacGrade',
        nba_accredited: 'nbaAccredited',
        nbaaccredited: 'nbaAccredited',
        nba_programs: 'nbaAccredited',
        nbaprograms: 'nbaAccredited',
        nba: 'nbaAccredited',
        autonomous: 'autonomous',
        is_autonomous: 'autonomous',
        isautonomous: 'autonomous',
        autonomy: 'autonomous',
        nirf_rank: 'nirfRank',
        nirfrank: 'nirfRank',
        nirf: 'nirfRank',
        tags: 'tags',
        badges: 'tags',
        total_seats: 'totalIntake',
        totalseats: 'totalIntake',
        total_intake: 'totalIntake',
        totalintake: 'totalIntake',
        seats: 'totalIntake',
        intake: 'totalIntake',
        capacity: 'totalIntake',
        facilities: 'facilities',
        infrastructure: 'facilities',
        amenities: 'facilities'
      }

      // Check for code mismatch warning
      const codeIndex = headers.findIndex(h => h === "code")
      if (codeIndex !== -1) {
        const csvCode = dataRow[codeIndex]?.trim().toUpperCase()
        if (csvCode && csvCode !== selectedCode.toUpperCase()) {
          toast({
            title: "Code Mismatch Warning",
            description: `Pasted CSV has code "${csvCode}", but you are editing active college "${selectedCode}". Filling fields anyway.`,
            variant: "destructive"
          })
        }
      }

      headers.forEach((h, colIdx) => {
        const key = HEADER_MAPPINGS[h] || HEADER_MAPPINGS[h.replace(/[^a-z0-9]/gi, '')] || null
        if (!key) return
        const val = dataRow[colIdx]?.trim()
        if (val === undefined || val === "") return

        switch (key) {
          case 'name':
            setName(val)
            break
          case 'website':
            setWebsite(val)
            break
          case 'logo_url':
            setLogoUrl(val)
            break
          case 'location':
            setCity(val)
            break
          case 'district':
            setDistrict(val)
            break
          case 'established_year':
            setEstablished(val)
            break
          case 'type':
            if (["Government", "Private Aided", "Private", "University"].includes(val)) {
              setType(val as any)
            } else {
              const lower = val.toLowerCase()
              if (lower.includes('government') || lower === 'gov') setType('Government')
              else if (lower.includes('aided')) setType('Private Aided')
              else if (lower.includes('university') || lower === 'uni') setType('University')
              else setType('Private')
            }
            break
          case 'autonomous':
            const lowVal = val.toLowerCase()
            setAutonomous(lowVal === 'true' || lowVal === '1' || lowVal === 'yes' || lowVal === 'y')
            break
          case 'tier':
            if (["Tier 1", "Tier 2", "Tier 3", "Tier 4"].includes(val)) {
              setTier(val as any)
            } else {
              if (val.includes('1')) setTier('Tier 1')
              else if (val.includes('2')) setTier('Tier 2')
              else if (val.includes('3')) setTier('Tier 3')
              else if (val.includes('4')) setTier('Tier 4')
            }
            break
          case 'naacGrade':
            const grade = val.toUpperCase().replace(/\s/g, '')
            if (["A++", "A+", "A", "B++", "B+", "B", "C", "D", "N/A"].includes(grade)) {
              setNaacGrade(grade)
            } else {
              setNaacGrade("N/A")
            }
            break
          case 'nbaAccredited':
            setNbaAccredited(val)
            break
          case 'nirfRank':
            setNirfRank(val)
            break
          case 'feeCetQuota':
            setFeeCetQuota(val)
            break
          case 'feeManagement':
            setFeeManagement(val)
            break
          case 'minPackage':
            setMinPackage(val)
            break
          case 'avgPackage':
            setAvgPackage(val)
            break
          case 'medianPackage':
            setMedianPackage(val)
            break
          case 'maxPackage':
            setMaxPackage(val)
            break
          case 'placementRate':
            setPlacementRate(val)
            break
          case 'topRecruiters':
            setTopRecruiters(val.replace(/;/g, ',').split(',').map(s => s.trim()).filter(Boolean).join(', '))
            break
          case 'facilities':
            const separator = val.includes(';') ? ';' : ','
            setFacilities(val.split(separator).map(s => s.trim()).filter(Boolean))
            break
          case 'tags':
            setTags(val.replace(/;/g, ',').split(',').map(s => s.trim()).filter(Boolean).join(', '))
            break
          case 'totalIntake':
            setTotalIntake(val)
            break
          default:
            break
        }
      })

      toast({
        title: "Fields Filled",
        description: `Form values populated from CSV. Review and save.`,
      })
      setSingleCsvText("")
      setShowSingleCsvImport(false)
    } catch (e: any) {
      console.error(e)
      toast({
        title: "Parsing Failed",
        description: e.message || "Failed to parse single college CSV record.",
        variant: "destructive"
      })
    }
  }

  // Fetch overrides on mount
  const fetchAllOverrides = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
      if (data) {
        const map: Record<string, any> = {}
        data.forEach((row: any) => {
          map[row.code.toUpperCase()] = row
        })
        setOverrides(map)
      }
    } catch (e) {
      console.error("Error loading overrides:", e)
    }
  }

  useEffect(() => {
    fetchAllOverrides()
  }, [])

  // Merge static database with Supabase database overrides for the selection cards
  const mergedCollegesList = useMemo(() => {
    return COLLEGE_DATABASE.map(c => {
      const override = overrides[c.code.toUpperCase()]
      return override ? mergeSingleCollege(c, override) : c
    })
  }, [overrides])

  // Filtered colleges list for search selection
  const filtered = useMemo(() => {
    let list = mergedCollegesList
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.code.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      )
    }

    if (selectedDistrict !== "ALL") {
      list = list.filter(c => c.district === selectedDistrict)
    }

    if (selectedType !== "ALL") {
      list = list.filter(c => c.type === selectedType)
    }

    if (selectedStatus !== "ALL") {
      list = list.filter(c => {
        const hasOverride = !!overrides[c.code.toUpperCase()]
        return selectedStatus === "OVERRIDDEN" ? hasOverride : !hasOverride
      })
    }

    if (selectedTier !== "ALL") {
      list = list.filter(c => c.tier === selectedTier)
    }

    // Create a copy for sorting
    const sortedList = [...list]

    if (sortBy === "NAME") {
      sortedList.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "TIER_ASC") {
      sortedList.sort((a, b) => a.tier.localeCompare(b.tier))
    } else if (sortBy === "TIER_DESC") {
      sortedList.sort((a, b) => b.tier.localeCompare(a.tier))
    } else if (sortBy === "PKG_DESC") {
      sortedList.sort((a, b) => (b.avgPackage || 0) - (a.avgPackage || 0))
    } else if (sortBy === "RATE_DESC") {
      sortedList.sort((a, b) => (b.placementRate || 0) - (a.placementRate || 0))
    } else if (sortBy === "FEE_ASC") {
      sortedList.sort((a, b) => {
        const aFee = a.feeCetQuota === null || a.feeCetQuota === undefined ? Infinity : a.feeCetQuota
        const bFee = b.feeCetQuota === null || b.feeCetQuota === undefined ? Infinity : b.feeCetQuota
        return aFee - bFee
      })
    } else if (sortBy === "EST_ASC") {
      sortedList.sort((a, b) => (a.established || 9999) - (b.established || 9999))
    } else if (sortBy === "NIRF_ASC") {
      sortedList.sort((a, b) => {
        const aRank = a.nirfRank === null || a.nirfRank === undefined ? Infinity : a.nirfRank
        const bRank = b.nirfRank === null || b.nirfRank === undefined ? Infinity : b.nirfRank
        return aRank - bRank
      })
    }

    return sortedList
  }, [mergedCollegesList, searchQuery, selectedDistrict, selectedType, selectedStatus, selectedTier, sortBy, overrides])

  const visibleColleges = filtered.slice(0, visibleCount)

  // Compute current filtered index for Next / Previous college navigation
  const currentFilteredIndex = useMemo(() => {
    if (!selectedCode) return -1
    return filtered.findIndex(c => c.code.toUpperCase() === selectedCode.toUpperCase())
  }, [filtered, selectedCode])

  // Select a college and load data
  const handleSelectCollege = async (code: string) => {
    setSelectedCode(code)
    setLoading(true)
    
    // Find static defaults
    const staticInfo = COLLEGE_DATABASE.find(c => c.code.toUpperCase() === code.toUpperCase())
    if (!staticInfo) {
      setLoading(false)
      return
    }

    try {
      // Fetch override from Supabase
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('code', code.toUpperCase())
        .maybeSingle()

      if (error) {
        console.error("Error loading overrides:", error)
        toast({
          title: "Database Error",
          description: "Could not fetch override data from Supabase. Using static defaults.",
          variant: "destructive"
        })
      }

      // Populate form. Use override if exists, else static defaults
      const activeData = data ? {
        name: data.name || staticInfo.name,
        website: data.website || staticInfo.website || "",
        logoUrl: (data.placement_stats as any)?.logoUrl || "",
        city: data.location || staticInfo.city,
        district: data.district || staticInfo.district,
        established: data.established_year ? String(data.established_year) : staticInfo.established ? String(staticInfo.established) : "",
        type: (data.type as CollegeInfo["type"]) || staticInfo.type,
        
        feeCetQuota: (data.fees_structure as any)?.feeCetQuota != null ? String((data.fees_structure as any).feeCetQuota) : staticInfo.feeCetQuota != null ? String(staticInfo.feeCetQuota) : "",
        feeManagement: (data.fees_structure as any)?.feeManagement != null ? String((data.fees_structure as any).feeManagement) : staticInfo.feeManagement != null ? String(staticInfo.feeManagement) : "",
        
        avgPackage: (data.placement_stats as any)?.avgPackage != null ? String((data.placement_stats as any).avgPackage) : staticInfo.avgPackage != null ? String(staticInfo.avgPackage) : "",
        medianPackage: (data.placement_stats as any)?.medianPackage != null ? String((data.placement_stats as any).medianPackage) : staticInfo.medianPackage != null ? String(staticInfo.medianPackage) : "",
        maxPackage: (data.placement_stats as any)?.maxPackage != null ? String((data.placement_stats as any).maxPackage) : staticInfo.maxPackage != null ? String(staticInfo.maxPackage) : "",
        minPackage: (data.placement_stats as any)?.minPackage != null ? String((data.placement_stats as any).minPackage) : staticInfo.minPackage != null ? String(staticInfo.minPackage) : "",
        placementRate: (data.placement_stats as any)?.placementRate != null ? String((data.placement_stats as any).placementRate) : staticInfo.placementRate != null ? String(staticInfo.placementRate) : "",
        topRecruiters: Array.isArray((data.placement_stats as any)?.topRecruiters) ? ((data.placement_stats as any).topRecruiters as string[]).join(', ') : staticInfo.topRecruiters.join(', '),
        
        tier: ((data.placement_stats as any)?.tier as CollegeInfo["tier"]) || staticInfo.tier,
        naacGrade: (data.placement_stats as any)?.naacGrade || staticInfo.naacGrade || "N/A",
        nbaAccredited: (data.placement_stats as any)?.nbaAccredited != null ? String((data.placement_stats as any).nbaAccredited) : staticInfo.nbaAccredited != null ? String(staticInfo.nbaAccredited) : "",
        autonomous: (data.placement_stats as any)?.autonomous !== undefined ? !!(data.placement_stats as any).autonomous : staticInfo.autonomous,
        nirfRank: (data.placement_stats as any)?.nirfRank != null ? String((data.placement_stats as any).nirfRank) : staticInfo.nirfRank != null ? String(staticInfo.nirfRank) : "",
        tags: Array.isArray((data.placement_stats as any)?.tags) ? ((data.placement_stats as any).tags as string[]).join(', ') : staticInfo.tags.join(', '),
        totalIntake: (data.placement_stats as any)?.totalIntake != null ? String((data.placement_stats as any).totalIntake) : staticInfo.totalIntake != null ? String(staticInfo.totalIntake) : "",
        facilities: Array.isArray(data.facilities) ? (data.facilities as string[]) : staticInfo.facilities
      } : {
        name: staticInfo.name,
        website: staticInfo.website || "",
        logoUrl: "",
        city: staticInfo.city,
        district: staticInfo.district,
        established: staticInfo.established ? String(staticInfo.established) : "",
        type: staticInfo.type,
        feeCetQuota: staticInfo.feeCetQuota != null ? String(staticInfo.feeCetQuota) : "",
        feeManagement: staticInfo.feeManagement != null ? String(staticInfo.feeManagement) : "",
        avgPackage: staticInfo.avgPackage != null ? String(staticInfo.avgPackage) : "",
        medianPackage: staticInfo.medianPackage != null ? String(staticInfo.medianPackage) : "",
        maxPackage: staticInfo.maxPackage != null ? String(staticInfo.maxPackage) : "",
        minPackage: staticInfo.minPackage != null ? String(staticInfo.minPackage) : "",
        placementRate: staticInfo.placementRate != null ? String(staticInfo.placementRate) : "",
        topRecruiters: staticInfo.topRecruiters.join(', '),
        tier: staticInfo.tier,
        naacGrade: staticInfo.naacGrade || "N/A",
        nbaAccredited: staticInfo.nbaAccredited != null ? String(staticInfo.nbaAccredited) : "",
        autonomous: staticInfo.autonomous,
        nirfRank: staticInfo.nirfRank != null ? String(staticInfo.nirfRank) : "",
        tags: staticInfo.tags.join(', '),
        totalIntake: staticInfo.totalIntake != null ? String(staticInfo.totalIntake) : "",
        facilities: staticInfo.facilities
      }

      setName(activeData.name)
      setWebsite(activeData.website)
      setLogoUrl(activeData.logoUrl)
      setCity(activeData.city)
      setDistrict(activeData.district)
      setEstablished(activeData.established)
      setType(activeData.type)
      setAutonomous(activeData.autonomous)
      setTier(activeData.tier)
      setNaacGrade(activeData.naacGrade)
      setNbaAccredited(activeData.nbaAccredited)
      setNirfRank(activeData.nirfRank)
      setFeeCetQuota(activeData.feeCetQuota)
      setFeeManagement(activeData.feeManagement)
      setMinPackage(activeData.minPackage)
      setAvgPackage(activeData.avgPackage)
      setMedianPackage(activeData.medianPackage)
      setMaxPackage(activeData.maxPackage)
      setPlacementRate(activeData.placementRate)
      setTopRecruiters(activeData.topRecruiters)
      setFacilities(activeData.facilities)
      setTags(activeData.tags)
      setTotalIntake(activeData.totalIntake)

      if (data) {
        toast({
          title: "Override Loaded",
          description: `Custom details found in database for code ${code}.`
        })
      } else {
        toast({
          title: "Defaults Loaded",
          description: `No custom overrides exist yet. Loaded static fallback details.`
        })
      }

    } catch (e: any) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  // File Upload reader converting to Base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 200 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 200KB to ensure fast loading times.",
        variant: "destructive"
      })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setLogoUrl(reader.result)
        toast({
          title: "Logo Image Loaded",
          description: "Temporary local preview updated. Click save to apply changes."
        })
      }
    }
    reader.onerror = () => {
      toast({
        title: "Error Reading File",
        description: "Failed to load image.",
        variant: "destructive"
      })
    }
    reader.readAsDataURL(file)
  }

  // Toggle checklist facilities
  const handleToggleFacility = (facility: string) => {
    setFacilities(prev => 
      prev.includes(facility) 
        ? prev.filter(f => f !== facility) 
        : [...prev, facility]
    )
  }

  // Save changes to Supabase
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCode) return

    setSaving(true)
    try {
      const payload = {
        code: selectedCode.toUpperCase(),
        name: name.trim(),
        website: website.trim() || null,
        location: city.trim() || null,
        district: district.trim() || null,
        established_year: established ? parseInt(established) : null,
        type,
        fees_structure: {
          feeCetQuota: feeCetQuota ? parseFloat(feeCetQuota) : null,
          feeManagement: feeManagement ? parseFloat(feeManagement) : null,
        },
        placement_stats: {
          avgPackage: avgPackage ? parseFloat(avgPackage) : null,
          medianPackage: medianPackage ? parseFloat(medianPackage) : null,
          maxPackage: maxPackage ? parseFloat(maxPackage) : null,
          minPackage: minPackage ? parseFloat(minPackage) : null,
          placementRate: placementRate ? parseFloat(placementRate) : null,
          topRecruiters: topRecruiters.split(',').map(s => s.trim()).filter(Boolean),
          tier,
          naacGrade: naacGrade === "N/A" ? null : naacGrade,
          nbaAccredited: nbaAccredited ? parseInt(nbaAccredited) : null,
          autonomous: !!autonomous,
          nirfRank: nirfRank ? parseInt(nirfRank) : null,
          tags: tags.split(',').map(s => s.trim()).filter(Boolean),
          logoUrl: logoUrl.trim() || null,
          totalIntake: totalIntake ? parseInt(totalIntake) : null
        },
        facilities,
      }

      const { error } = await supabase
        .from('colleges')
        .upsert(payload, { onConflict: 'code' })

      if (error) throw error

      toast({
        title: "Override Saved!",
        description: `Successfully stored changes for ${name} (${selectedCode}) in Supabase.`
      })

      // Refetch overrides to update lists
      fetchAllOverrides()
    } catch (error: any) {
      console.error("Save failed:", error)
      toast({
        title: "Save Failed",
        description: error.message || "An error occurred while saving overrides.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  // Delete override to fall back to static database
  const handleDeleteOverride = async () => {
    if (!selectedCode) return
    if (!confirm("Are you sure you want to delete this custom override? Doing so will revert the college details back to the default fallback static data.")) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('colleges')
        .delete()
        .eq('code', selectedCode.toUpperCase())

      if (error) throw error

      toast({
        title: "Override Reset",
        description: "Reverted college details to static configuration."
      })
      
      // Refetch lists
      await fetchAllOverrides()
      // Reload details from default
      handleSelectCollege(selectedCode)
    } catch (error: any) {
      console.error("Reset failed:", error)
      toast({
        title: "Reset Failed",
        description: error.message || "An error occurred while deleting overrides.",
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* ─── DIRECTORY MODE (No college selected) ─── */}
      {!selectedCode && (
        <div className="space-y-6">
          <Card className="glass-strong border-white/10">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  College Directory Selector
                </CardTitle>
                <CardDescription>
                  Search and click any college card to start editing or uploading custom logo files.
                </CardDescription>
              </div>
              <Button
                variant={showCsvImport ? "default" : "outline"}
                size="sm"
                onClick={() => setShowCsvImport(!showCsvImport)}
                className="h-9 px-3.5 rounded-xl border-white/10 text-xs font-semibold flex items-center gap-1.5 self-end sm:self-auto"
              >
                {showCsvImport ? <X className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5 text-indigo-400" />}
                {showCsvImport ? "Close CSV Importer" : "Bulk CSV Import"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex flex-col lg:flex-row flex-wrap gap-3">
                <div className="relative flex-1 min-w-[260px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search college by code, name, city..."
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setVisibleCount(24); }}
                    className="pl-10 bg-white/5 border-white/10"
                  />
                </div>

                <div className="w-full lg:w-40">
                  <Select value={selectedDistrict} onValueChange={v => { setSelectedDistrict(v); setVisibleCount(24); }}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-xs"><SelectValue placeholder="District" /></SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="ALL">All Districts</SelectItem>
                      {ALL_DISTRICTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full lg:w-36">
                  <Select value={selectedType} onValueChange={v => { setSelectedType(v); setVisibleCount(24); }}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Types</SelectItem>
                      <SelectItem value="Government">Government</SelectItem>
                      <SelectItem value="Private Aided">Private Aided</SelectItem>
                      <SelectItem value="Private">Private</SelectItem>
                      <SelectItem value="University">University</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full lg:w-36">
                  <Select value={selectedTier} onValueChange={v => { setSelectedTier(v); setVisibleCount(24); }}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-xs"><SelectValue placeholder="Tier" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Tiers</SelectItem>
                      <SelectItem value="Tier 1">Tier 1</SelectItem>
                      <SelectItem value="Tier 2">Tier 2</SelectItem>
                      <SelectItem value="Tier 3">Tier 3</SelectItem>
                      <SelectItem value="Tier 4">Tier 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full lg:w-40">
                  <Select value={selectedStatus} onValueChange={v => { setSelectedStatus(v); setVisibleCount(24); }}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="OVERRIDDEN">With Custom Overrides</SelectItem>
                      <SelectItem value="DEFAULT">No Overrides</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-full lg:w-44">
                  <Select value={sortBy} onValueChange={v => { setSortBy(v); setVisibleCount(24); }}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-xs"><SelectValue placeholder="Sort By" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CODE">Sort by: Code</SelectItem>
                      <SelectItem value="NAME">Sort by: Name</SelectItem>
                      <SelectItem value="TIER_ASC">Sort by: Tier (1 to 4)</SelectItem>
                      <SelectItem value="TIER_DESC">Sort by: Tier (4 to 1)</SelectItem>
                      <SelectItem value="PKG_DESC">Sort by: Average Package</SelectItem>
                      <SelectItem value="RATE_DESC">Sort by: Placement Rate</SelectItem>
                      <SelectItem value="FEE_ASC">Sort by: CET Fee (Low to High)</SelectItem>
                      <SelectItem value="EST_ASC">Sort by: Established Year</SelectItem>
                      <SelectItem value="NIRF_ASC">Sort by: NIRF Rank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {showCsvImport && (
            <Card className="glass-strong border-white/10 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1.5 text-indigo-400">
                  <Upload className="w-4 h-4" />
                  Bulk CSV Import Panel
                </CardTitle>
                <CardDescription>
                  Paste CSV text data containing college code and attributes (e.g. Total Seats, Average Placement Package, CET Fees) to perform bulk updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Formatting Instructions */}
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2.5 text-xs text-muted-foreground">
                  <p className="font-semibold text-slate-300">💡 Supported CSV Formatting Rules:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>A header row is <strong>required</strong>, including at least a <code className="text-indigo-400 font-mono font-bold">code</code> column representing college code (e.g., E001).</li>
                    <li>Supported attribute columns: <code className="text-emerald-400 font-mono">name</code>, <code className="text-emerald-400 font-mono">website</code>, <code className="text-emerald-400 font-mono">established_year</code>, <code className="text-emerald-400 font-mono">location</code> (city), <code className="text-emerald-400 font-mono">district</code>, <code className="text-emerald-400 font-mono">type</code>, <code className="text-emerald-400 font-mono">total_seats</code>, <code className="text-emerald-400 font-mono">fee_cet</code>, <code className="text-emerald-400 font-mono">fee_mgmt</code>, <code className="text-emerald-400 font-mono">lowest_package</code>, <code className="text-emerald-400 font-mono">avg_package</code>, <code className="text-emerald-400 font-mono">median_package</code>, <code className="text-emerald-400 font-mono">max_package</code>, <code className="text-emerald-400 font-mono">placement_rate</code>, <code className="text-emerald-400 font-mono">top_recruiters</code> (comma/semicolon split), <code className="text-emerald-400 font-mono">naac_grade</code>, <code className="text-emerald-400 font-mono">nba_programs</code>, <code className="text-emerald-400 font-mono">autonomous</code>, <code className="text-emerald-400 font-mono">nirf_rank</code>, <code className="text-emerald-400 font-mono">facilities</code> (semicolon split), <code className="text-emerald-400 font-mono">tags</code> (comma split).</li>
                    <li>Columns are merged dynamically; omitting columns preserves existing override/default data.</li>
                  </ul>
                  <div className="bg-black/25 rounded-lg p-2.5 font-mono text-[10px] text-indigo-300 relative">
                    <span className="absolute right-2.5 top-1.5 text-[8px] uppercase tracking-wider font-bold text-muted-foreground select-none">Example Format</span>
                    code,total_seats,avg_package,max_package,naac_grade<br />
                    E001,650,9.2,58.0,A++<br />
                    E002,480,7.1,33.0,A+
                  </div>
                </div>

                {/* CSV text area */}
                <div className="space-y-2">
                  <Label htmlFor="csv-input" className="text-xs font-semibold text-slate-300 font-sans">Paste CSV Contents</Label>
                  <Textarea
                    id="csv-input"
                    rows={6}
                    placeholder="code,total_seats,avg_package,max_package,naac_grade&#10;E001,650,9.2,58.0,A++&#10;E002,480,7.1,33.0,A+"
                    value={csvText}
                    onChange={e => setCsvText(e.target.value)}
                    className="bg-white/5 border-white/10 font-mono text-xs"
                    disabled={isBulkImporting}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleValidateCsv}
                      disabled={isBulkImporting}
                      className="h-9 px-4 rounded-xl border-white/10 text-xs font-semibold"
                    >
                      Validate & Preview Data
                    </Button>
                    {csvParsedRows.length > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => { setCsvParsedRows([]); setCsvWarnings([]); setCsvValidationErrors([]); }}
                        disabled={isBulkImporting}
                        className="h-9 px-3 rounded-xl text-xs hover:bg-white/5"
                      >
                        Clear Preview
                      </Button>
                    )}
                  </div>
                  {csvParsedRows.length > 0 && (
                    <Button
                      type="button"
                      onClick={handleApplyCsvImport}
                      disabled={isBulkImporting}
                      className="h-9 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                    >
                      {isBulkImporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      Apply Overrides to {csvParsedRows.length} Colleges
                    </Button>
                  )}
                </div>

                {/* Fatal/Validation Errors */}
                {csvValidationErrors.length > 0 && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl space-y-1.5 text-xs">
                    <p className="font-bold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Fatal Parse Errors ({csvValidationErrors.length})</p>
                    <ul className="list-disc pl-4 space-y-1 font-mono text-[10px]">
                      {csvValidationErrors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {csvWarnings.length > 0 && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl space-y-1.5 text-xs">
                    <p className="font-bold flex items-center gap-1"><ShieldAlert className="w-3.5 h-3.5" /> Import Warnings ({csvWarnings.length})</p>
                    <div className="max-h-32 overflow-y-auto pl-1 space-y-1 font-mono text-[10px] scrollbar-hide">
                      {csvWarnings.map((warn, i) => <p key={i}>⚠️ {warn}</p>)}
                    </div>
                  </div>
                )}

                {/* Preview Table */}
                {csvParsedRows.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <Label className="text-xs font-bold text-slate-200">Data Preview ({csvParsedRows.length} rows)</Label>
                    <div className="overflow-x-auto rounded-xl border border-white/5 max-h-60 overflow-y-auto scrollbar-hide">
                      <table className="w-full text-[11px] text-left">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/5 font-bold text-muted-foreground">
                            <th className="py-2.5 px-3">Code</th>
                            <th className="py-2.5 px-3">Name</th>
                            <th className="py-2.5 px-3">Seats</th>
                            <th className="py-2.5 px-3">Placements & Packages</th>
                            <th className="py-2.5 px-3">CET Fees</th>
                            <th className="py-2.5 px-3 font-sans">Accreditation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvParsedRows.map((row, idx) => {
                            const staticInfo = COLLEGE_DATABASE.find(c => c.code.toUpperCase() === row.code.toUpperCase());
                            return (
                              <tr key={idx} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                <td className="py-2 px-3 font-mono font-bold text-indigo-400">{row.code}</td>
                                <td className="py-2 px-3 truncate max-w-[150px]">
                                  <div>{row.name || staticInfo?.name || <span className="text-muted-foreground/40">—</span>}</div>
                                  {row.topRecruiters && row.topRecruiters.length > 0 && (
                                    <div className="text-[9px] text-muted-foreground/75 truncate mt-0.5" title={row.topRecruiters.join(', ')}>
                                      🚀 {row.topRecruiters.slice(0, 3).join(', ')}{row.topRecruiters.length > 3 ? '...' : ''}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2 px-3 font-mono">{row.totalIntake !== undefined ? row.totalIntake : <span className="text-muted-foreground/40">—</span>}</td>
                                <td className="py-2 px-3 font-mono text-[10px]">
                                  <div className="flex flex-col gap-0.5">
                                    <div>
                                      <span className="text-muted-foreground">Min/Avg/Max: </span>
                                      {row.minPackage !== undefined ? `${row.minPackage}L` : '—'} / {row.avgPackage !== undefined ? `${row.avgPackage}L` : '—'} / {row.maxPackage !== undefined ? `${row.maxPackage}L` : '—'}
                                    </div>
                                    {(row.medianPackage !== undefined || row.placementRate !== undefined) && (
                                      <div className="text-[9px] text-muted-foreground/80">
                                        {row.medianPackage !== undefined && <span>Median: {row.medianPackage}L </span>}
                                        {row.placementRate !== undefined && <span className="text-emerald-400 font-semibold">({row.placementRate}% Placed)</span>}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="py-2 px-3 font-mono">{row.feeCetQuota !== undefined ? `₹${row.feeCetQuota}L` : <span className="text-muted-foreground/40">—</span>}</td>
                                <td className="py-2 px-3">
                                  <div className="flex flex-wrap gap-1 max-w-[180px]">
                                    {row.naacGrade && <Badge variant="outline" className="text-[9px] px-1 bg-amber-500/10 text-amber-400 border-amber-500/25">NAAC {row.naacGrade}</Badge>}
                                    {row.autonomous !== undefined && <Badge variant="outline" className="text-[9px] px-1 bg-cyan-500/10 text-cyan-400 border-cyan-500/25">{row.autonomous ? 'Auto' : 'Affil'}</Badge>}
                                    {row.nbaAccredited !== undefined && <Badge variant="outline" className="text-[9px] px-1 bg-purple-500/10 text-purple-400 border-purple-500/25">NBA {row.nbaAccredited}</Badge>}
                                    {row.nirfRank !== undefined && <Badge variant="outline" className="text-[9px] px-1 bg-rose-500/10 text-rose-400 border-rose-500/25">NIRF {row.nirfRank}</Badge>}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleColleges.length === 0 ? (
              <div className="col-span-full py-16 text-center text-muted-foreground Card border border-dashed border-white/10 rounded-2xl glass">
                <Building2 className="w-10 h-10 mx-auto opacity-20 mb-2" />
                <p className="text-sm">No colleges match your active search filters.</p>
              </div>
            ) : (
              visibleColleges.map(c => {
                const isOverridden = !!overrides[c.code.toUpperCase()]
                return (
                  <button
                    key={c.code}
                    onClick={() => handleSelectCollege(c.code)}
                    className="group text-left rounded-2xl border border-white/5 bg-card/45 backdrop-blur-sm p-4 hover:border-indigo-500/35 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar logo */}
                      <CollegeLogo
                        code={c.code}
                        name={c.name}
                        website={c.website}
                        tier={c.tier}
                        logoUrl={c.logoUrl}
                        sizeClassName="w-11 h-11 border border-white/10 shadow-sm rounded-xl"
                        textClassName="text-[9px]"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] font-black text-indigo-400">{c.code}</span>
                          {isOverridden && (
                            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-[8px] px-1.5 py-0">
                              Customized
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-bold text-xs leading-snug truncate mt-0.5 text-slate-200 group-hover:text-white transition-colors">
                          {c.shortName}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1.5">
                          <MapPin className="w-3 h-3 text-muted-foreground/60" />
                          <span className="truncate">{c.city}, {c.district}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                      <span>{c.type}</span>
                      {c.avgPackage && <span className="text-emerald-400 text-xs font-black font-sans lowercase tracking-normal">{c.avgPackage} lpa avg</span>}
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Load More Button */}
          {visibleCount < filtered.length && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setVisibleCount(prev => prev + 24)}
                className="h-10 px-6 rounded-xl border-white/10 text-xs font-semibold"
              >
                Load More Colleges ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ─── EDIT FORM MODE (Selected college) ─── */}
      {selectedCode && (
        <div className="space-y-4">
          
          {/* Back Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSelectedCode(""); fetchAllOverrides(); }}
                className="h-9 px-3 border-white/10 rounded-xl text-xs text-muted-foreground hover:text-white hover:bg-white/5 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to College Grid
              </Button>

              {currentFilteredIndex !== -1 && (
                <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-white/5 h-9">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={currentFilteredIndex === 0}
                    onClick={() => handleSelectCollege(filtered[currentFilteredIndex - 1].code)}
                    className="h-full px-2.5 rounded-none border-r border-white/10 hover:bg-white/5 text-[11px] text-muted-foreground hover:text-white disabled:opacity-30 flex items-center justify-center font-bold"
                    title="Previous College"
                  >
                    ◀ Prev
                  </Button>
                  <span className="text-[9px] text-muted-foreground px-2.5 font-bold font-mono select-none">
                    {currentFilteredIndex + 1} / {filtered.length}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={currentFilteredIndex === filtered.length - 1}
                    onClick={() => handleSelectCollege(filtered[currentFilteredIndex + 1].code)}
                    className="h-full px-2.5 rounded-none hover:bg-white/5 text-[11px] text-muted-foreground hover:text-white disabled:opacity-30 flex items-center justify-center font-bold"
                    title="Next College"
                  >
                    Next ▶
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 justify-between sm:justify-start">
              <Button
                variant={showSingleCsvImport ? "default" : "outline"}
                size="sm"
                type="button"
                onClick={() => setShowSingleCsvImport(!showSingleCsvImport)}
                className="h-9 px-3 rounded-xl border-white/10 text-xs font-semibold flex items-center gap-1.5"
              >
                {showSingleCsvImport ? <X className="w-3.5 h-3.5" /> : <Upload className="w-3.5 h-3.5 text-indigo-400" />}
                Fill via CSV
              </Button>
              <Badge variant="outline" className="font-mono text-indigo-400 border-indigo-500/20 bg-indigo-500/5 px-2.5 py-1.5 text-xs font-bold">
                Active Code: {selectedCode}
              </Badge>
            </div>
          </div>

          {showSingleCsvImport && (
            <Card className="glass-strong border-white/10 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-indigo-400 flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  Fill Form Fields from CSV Row
                </CardTitle>
                <CardDescription className="text-xs">
                  Paste a CSV record (requires header row and data row). This will parse and populate all matching form fields on this screen. Note: This does not save to the database automatically; you must review and click "Save Override Configuration" below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs text-muted-foreground">
                  <p className="font-semibold text-slate-300">💡 Formatting Requirements:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Header row is required, followed by a single row of values.</li>
                    <li>Supported headers include: <code className="text-emerald-400 font-mono">name</code>, <code className="text-emerald-400 font-mono">website</code>, <code className="text-emerald-400 font-mono">established_year</code>, <code className="text-emerald-400 font-mono">city</code>, <code className="text-emerald-400 font-mono">district</code>, <code className="text-emerald-400 font-mono">type</code>, <code className="text-emerald-400 font-mono">total_seats</code>, <code className="text-emerald-400 font-mono">fee_cet</code>, <code className="text-emerald-400 font-mono">fee_mgmt</code>, <code className="text-emerald-400 font-mono">lowest_package</code>, <code className="text-emerald-400 font-mono">avg_package</code>, <code className="text-emerald-400 font-mono">median_package</code>, <code className="text-emerald-400 font-mono">max_package</code>, <code className="text-emerald-400 font-mono">placement_rate</code>, <code className="text-emerald-400 font-mono">top_recruiters</code> (comma/semicolon split), <code className="text-emerald-400 font-mono">naac_grade</code>, <code className="text-emerald-400 font-mono">nba_programs</code>, <code className="text-emerald-400 font-mono">autonomous</code>, <code className="text-emerald-400 font-mono">nirf_rank</code>, <code className="text-emerald-400 font-mono">facilities</code> (semicolon split), <code className="text-emerald-400 font-mono">tags</code> (comma split).</li>
                  </ul>
                  <div className="bg-black/25 rounded-lg p-2 font-mono text-[9px] text-indigo-300">
                    name,website,established_year,total_seats,fee_cet,avg_package,max_package,naac_grade,facilities<br />
                    "PES University","https://pes.edu",1972,750,1.6,12.5,65.0,A+,"Wi-Fi; Library; Hostel; Labs"
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="single-csv-input" className="text-xs font-semibold text-slate-300 font-sans">Paste CSV Contents</Label>
                  <Textarea
                    id="single-csv-input"
                    rows={4}
                    placeholder='name,website,established_year,total_seats,fee_cet,avg_package,max_package,naac_grade,facilities&#10;"PES University","https://pes.edu",1972,750,1.6,12.5,65.0,A+,"Wi-Fi; Library; Hostel; Labs"'
                    value={singleCsvText}
                    onChange={e => setSingleCsvText(e.target.value)}
                    className="bg-white/5 border-white/10 font-mono text-xs"
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => { setShowSingleCsvImport(false); setSingleCsvText(""); }}
                    className="h-9 px-3.5 rounded-xl border-white/10 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleFillSingleCollegeFromCsv}
                    className="h-9 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl text-xs font-semibold"
                  >
                    Parse & Populate Fields
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="p-20 text-center space-y-3 Card flex flex-col items-center justify-center glass border border-white/5 rounded-2xl">
              <Loader2 className="w-9 h-9 text-indigo-500 animate-spin" />
              <p className="text-sm text-muted-foreground">Fetching records from Supabase...</p>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Panel: Primary Fields */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Basic Info */}
                  <Card className="glass-strong border-white/10 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-400" /> Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="c-name">Full College Name</Label>
                        <Input id="c-name" value={name} onChange={e => setName(e.target.value)} required className="bg-white/5 border-white/10" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="c-website" className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5 text-muted-foreground" /> Website URL
                          </Label>
                          <Input id="c-website" placeholder="https://college.edu" value={website} onChange={e => setWebsite(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="c-established" className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Established Year
                          </Label>
                          <Input id="c-established" type="number" placeholder="1984" value={established} onChange={e => setEstablished(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="c-seats" className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" /> Total Seats / Intake
                          </Label>
                          <Input id="c-seats" type="number" placeholder="600" value={totalIntake} onChange={e => setTotalIntake(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="c-city" className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> City / Location
                          </Label>
                          <Input id="c-city" value={city} onChange={e => setCity(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="c-district" className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> District
                          </Label>
                          <Input id="c-district" value={district} onChange={e => setDistrict(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* branding & Logo uploads */}
                  <Card className="glass-strong border-white/10 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-indigo-400" /> College Logo Photo Branding
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      
                      {/* Logo Preview box */}
                      <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="relative">
                          <CollegeLogo
                            code={selectedCode}
                            name={name}
                            website={website}
                            tier={tier}
                            logoUrl={logoUrl}
                            sizeClassName="w-20 h-20 sm:w-24 sm:h-24 border border-white/10 shadow-lg rounded-2xl bg-card"
                            textClassName="text-lg font-black"
                          />
                          {logoUrl && (
                            <button
                              type="button"
                              onClick={() => { setLogoUrl(""); toast({ title: "Custom Logo Cleared" }); }}
                              className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
                              title="Clear logo"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <p className="text-xs font-semibold text-slate-300">Choose how to set the logo branding:</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {/* Hidden file input */}
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleLogoUpload}
                              accept="image/*"
                              className="hidden"
                            />
                            
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                              className="h-8.5 rounded-xl border-white/10 text-xs bg-white/5 flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5 text-indigo-400" />
                              Upload Image File
                            </Button>
                          </div>
                          
                          <p className="text-[10px] text-muted-foreground">
                            Upload PNG/JPG logo (recommended limit 200KB). The image is optimized as base64 internally.
                          </p>
                        </div>
                      </div>

                      {/* URL input fallback */}
                      <div className="space-y-2">
                        <Label htmlFor="logo-url">Or Paste Absolute Image URL</Label>
                        <Input
                          id="logo-url"
                          type="url"
                          placeholder="https://example.com/logo.png"
                          value={logoUrl.startsWith('data:') ? "" : logoUrl}
                          onChange={e => setLogoUrl(e.target.value)}
                          className="bg-white/5 border-white/10 text-xs"
                          disabled={logoUrl.startsWith('data:')}
                        />
                        {logoUrl.startsWith('data:') && (
                          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Local photo file uploaded and stored as Base64. Clear it to paste an external link instead.
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Placements */}
                  <Card className="glass-strong border-white/10 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-emerald-400" /> Placement Packages & Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pkg-min">Lowest (LPA)</Label>
                          <Input id="pkg-min" type="number" step="0.01" placeholder="3.5" value={minPackage} onChange={e => setMinPackage(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pkg-avg">Average (LPA)</Label>
                          <Input id="pkg-avg" type="number" step="0.01" placeholder="6.8" value={avgPackage} onChange={e => setAvgPackage(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pkg-median">Median (LPA)</Label>
                          <Input id="pkg-median" type="number" step="0.01" placeholder="5.5" value={medianPackage} onChange={e => setMedianPackage(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="pkg-max">Highest (LPA)</Label>
                          <Input id="pkg-max" type="number" step="0.01" placeholder="42.5" value={maxPackage} onChange={e => setMaxPackage(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="pkg-rate">Placement Rate (%)</Label>
                          <Input id="pkg-rate" type="number" min="0" max="100" placeholder="85" value={placementRate} onChange={e => setPlacementRate(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="top-recruiters">Top Recruiters (comma separated)</Label>
                        <Textarea id="top-recruiters" placeholder="Microsoft, Amazon, TCS, Infosys, Wipro..." value={topRecruiters} onChange={e => setTopRecruiters(e.target.value)} className="bg-white/5 border-white/10 text-xs min-h-[60px]" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Infrastructure */}
                  <Card className="glass-strong border-white/10 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-amber-400" /> Infrastructure & Facilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Label className="text-xs text-muted-foreground block mb-2">Check all that are verified for this college campus:</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {FACILITIES_OPTIONS.map(facility => (
                          <div key={facility} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`f-${facility}`} 
                              checked={facilities.includes(facility)}
                              onCheckedChange={() => handleToggleFacility(facility)}
                            />
                            <Label htmlFor={`f-${facility}`} className="text-xs cursor-pointer font-medium text-slate-300">
                              {facility}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel: Classifications & Sidebar Form Fields */}
                <div className="space-y-6">
                  
                  {/* Accreditation */}
                  <Card className="glass-strong border-white/10 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-purple-400" /> Accreditation & Tier
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>College Type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as CollegeInfo["type"])}>
                          <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Government">Government</SelectItem>
                            <SelectItem value="Private Aided">Private Aided</SelectItem>
                            <SelectItem value="Private">Private</SelectItem>
                            <SelectItem value="University">University</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Tier Classification</Label>
                        <Select value={tier} onValueChange={(v) => setTier(v as CollegeInfo["tier"])}>
                          <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Tier 1">Tier 1 (Premier)</SelectItem>
                            <SelectItem value="Tier 2">Tier 2 (Good)</SelectItem>
                            <SelectItem value="Tier 3">Tier 3 (Average)</SelectItem>
                            <SelectItem value="Tier 4">Tier 4 (Local)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>NAAC Grade</Label>
                          <Select value={naacGrade} onValueChange={setNaacGrade}>
                            <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="N/A">N/A</SelectItem>
                              <SelectItem value="A++">A++</SelectItem>
                              <SelectItem value="A+">A+</SelectItem>
                              <SelectItem value="A">A</SelectItem>
                              <SelectItem value="B++">B++</SelectItem>
                              <SelectItem value="B+">B+</SelectItem>
                              <SelectItem value="B">B</SelectItem>
                              <SelectItem value="C">C</SelectItem>
                              <SelectItem value="D">D</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="c-nba">NBA Programs</Label>
                          <Input id="c-nba" type="number" placeholder="4" value={nbaAccredited} onChange={e => setNbaAccredited(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="c-nirf">NIRF Rank</Label>
                          <Input id="c-nirf" type="number" placeholder="85" value={nirfRank} onChange={e => setNirfRank(e.target.value)} className="bg-white/5 border-white/10" />
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                          <Checkbox id="c-auto" checked={autonomous} onCheckedChange={(v) => setAutonomous(!!v)} />
                          <Label htmlFor="c-auto" className="cursor-pointer font-semibold text-slate-300 text-xs">Autonomous Status</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fees */}
                  <Card className="glass-strong border-white/10 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-blue-400" /> Fee Structure (Annual)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fee-cet">CET Quota (Lakhs)</Label>
                        <Input id="fee-cet" type="number" step="0.01" placeholder="1.05" value={feeCetQuota} onChange={e => setFeeCetQuota(e.target.value)} className="bg-white/5 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fee-mgmt">Mgmt Quota (Lakhs)</Label>
                        <Input id="fee-mgmt" type="number" step="0.01" placeholder="3.5" value={feeManagement} onChange={e => setFeeManagement(e.target.value)} className="bg-white/5 border-white/10" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card className="glass-strong border-white/10 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-base">Tags & Badges</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Label htmlFor="c-tags">Tags (comma separated)</Label>
                      <Textarea id="c-tags" placeholder="Heritage, Low Fees, Top 10, Green Campus..." value={tags} onChange={e => setTags(e.target.value)} className="bg-white/5 border-white/10 text-xs min-h-[60px]" />
                    </CardContent>
                  </Card>

                  {/* Action Panel Buttons */}
                  <div className="space-y-3">
                    <Button type="submit" disabled={saving || deleting} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/10 h-10.5 rounded-xl">
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Override Configuration
                    </Button>

                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleDeleteOverride} 
                      disabled={deleting || saving || loading}
                      className="w-full border-red-500/20 hover:bg-red-500/10 text-red-400 h-10 rounded-xl"
                    >
                      {deleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                      Revert Override to Default
                    </Button>
                  </div>

                </div>

              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

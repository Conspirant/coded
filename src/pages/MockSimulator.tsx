import { SEO } from "@/components/SEO"
import { useState, useEffect, useMemo } from "react"
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
import {
  Play,
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
  Settings
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { loadSettings } from "@/lib/settings"
import { normalizeCourseName } from "@/lib/course-normalization"
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

const MockSimulator = () => {
  const { toast } = useToast()
  const preferencePageSize = 10

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

  // Simulation results
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isResultsOpen, setIsResultsOpen] = useState(false)

  const getCourseCode = (course: string) => {
    const cleaned = (course || '').replace(/[\r\n]/g, ' ').replace(/\s+/g, ' ').trim()
    const codeMatch = cleaned.match(/^([A-Z]{2})[\s-]/)
    if (codeMatch) return codeMatch[1]
    if (/^[A-Z]{2,3}$/.test(cleaned)) return cleaned
    return cleaned.slice(0, 3).toUpperCase()
  }

  const getCollegeCourseCode = (pref: PreferenceOption) => {
    if (pref.collegeCourse) return pref.collegeCourse
    const college = (pref.collegeCode || '').replace(/\s+/g, '').toUpperCase()
    const course = getCourseCode(pref.branchCode || pref.branchName)
    return `${college}${course}`
  }

  const branchesByCollege = useMemo(() => {
    const branchMap = new Map<string, string[]>()
    const dedupe = new Map<string, Set<string>>()

    cutoffs.forEach(cutoff => {
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
  }, [cutoffs])

  const eligibleCategories = useMemo(() => (
    userCategory ? getEligibleCategories(userCategory) : []
  ), [userCategory])

  const safetyCutoffs = useMemo(() => (
    cutoffs.filter(cutoff =>
      cutoff.year === selectedYear &&
      eligibleCategories.includes(cutoff.category)
    )
  ), [cutoffs, selectedYear, eligibleCategories])

  const simulationCutoffs = useMemo(() => (
    selectedYear ? cutoffs.filter(cutoff => cutoff.year === selectedYear) : cutoffs
  ), [cutoffs, selectedYear])

  // Update available rounds when year changes
  useEffect(() => {
    if (selectedYear && cutoffs.length > 0) {
      const rounds = [...new Set(
        cutoffs
          .filter(c => c.year === selectedYear)
          .map(c => c.round)
      )].sort((a, b) => {
        // Sort rounds naturally (Round 1, Round 2...)
        const numA = parseInt(a.replace(/\D/g, '')) || 0
        const numB = parseInt(b.replace(/\D/g, '')) || 0
        return numA - numB
      })

      setAvailableRounds(rounds)
      if (rounds.length > 0) {
        setSelectedRound(rounds[0])
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
          '/data/kcet_cutoffs_consolidated.json',
          '/kcet_cutoffs.json',
          '/kcet_cutoffs_round3_2025.json'
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

  const totalPreferencePages = Math.max(1, Math.ceil(preferences.length / preferencePageSize))
  const preferencePageStart = (preferencePage - 1) * preferencePageSize
  const visiblePreferences = useMemo(
    () => preferences.slice(preferencePageStart, preferencePageStart + preferencePageSize),
    [preferences, preferencePageStart, preferencePageSize]
  )

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
        url="https://kcet-coded2.vercel.app/mock-simulator"
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
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-white/10">
              {cutoffs.length.toLocaleString()} records
            </Badge>
            <Button
              onClick={runSimulation}
              disabled={preferences.length === 0 || isSimulating}
            >
              <Play className="h-4 w-4 mr-2" />
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
          </div>
        </div>

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
              <Table className="min-w-[920px]">
                <TableHeader>
                  <TableRow className="bg-muted/60 hover:bg-muted/60">
                    <TableHead colSpan={7} className="h-auto px-5 py-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-foreground">Option Entry Simulator Sheet</p>
                          <p className="text-sm font-normal text-muted-foreground">
                            Search institution and course here, then add rows in option-entry order.
                          </p>
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                          {preferences.length} options
                        </Badge>
                      </div>
                    </TableHead>
                  </TableRow>
                  <TableRow className="bg-card hover:bg-card">
                    <TableHead colSpan={3} className="w-[380px]">Institution Search</TableHead>
                    <TableHead colSpan={3} className="w-[420px]">Course Search</TableHead>
                    <TableHead className="w-[120px]">Add</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
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
                    <TableCell colSpan={3} className="relative">
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
                    <TableHead>Optn. No</TableHead>
                    <TableHead>College Course</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Course Fee per Annum(Rs)</TableHead>
                    <TableHead>College Name</TableHead>
                    <TableHead>Safety</TableHead>
                    <TableHead>Controls</TableHead>
                  </TableRow>

                  {preferences.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        <Target className="mx-auto mb-3 h-10 w-10 opacity-50" />
                        Add an institution and normalized course above to start building the option-entry list.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visiblePreferences.map((pref, index) => {
                      const globalIndex = preferencePageStart + index
                      return (
                      <TableRow key={pref.id} className="group">
                        <TableCell className="font-mono text-lg font-bold text-primary">
                          {pref.priority}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="rounded-full border-white/10 px-3 py-1 font-mono text-xs font-bold text-foreground">
                            {getCollegeCourseCode(pref)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="max-w-[360px] font-semibold uppercase leading-snug" title={pref.branchName}>
                            {normalizeCourseName(pref.branchName || pref.branchCode)}
                          </p>
                        </TableCell>
                        <TableCell className="font-mono font-medium text-muted-foreground">
                          {pref.courseFee && pref.courseFee !== 'Not specified' ? pref.courseFee : 'Not listed'}
                        </TableCell>
                        <TableCell>
                          <p className="max-w-[360px] font-semibold leading-snug" title={pref.collegeName}>
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
                              disabled={globalIndex === 0}
                              className="h-8 w-8"
                              title="Move up"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => movePreference(pref.id, 'down')}
                              disabled={globalIndex === preferences.length - 1}
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
                      </TableRow>
                    )})
                  )}
                </TableBody>
              </Table>
            </div>
            {preferences.length > preferencePageSize && (
              <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {preferencePageStart + 1}-{Math.min(preferencePageStart + preferencePageSize, preferences.length)} of {preferences.length} options
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
                  <Badge variant="outline" className="border-white/10">
                    {preferencePage} / {totalPreferencePages}
                  </Badge>
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

        <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
          {simulationResult && (
            <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto border-primary/30">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Simulation Results
                </DialogTitle>
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
      </div>
    </div>
  )
}

export default MockSimulator


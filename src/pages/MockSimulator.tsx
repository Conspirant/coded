import { useState, useEffect } from "react"
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
import {
  simulateAllotment,
  getAvailableRounds,
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
  const [newCollegeCode, setNewCollegeCode] = useState<string>("")
  const [newBranchCode, setNewBranchCode] = useState<string>("")
  const [collegeSearch, setCollegeSearch] = useState<string>("")

  // Simulation results
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

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
  const filteredColleges = availableColleges.filter(c =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(collegeSearch.toLowerCase())
  ).slice(0, 20)

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
      branchName: newBranchCode,
      priority: preferences.length + 1
    }

    setPreferences([...preferences, newPref])
    setNewCollegeCode("")
    setNewBranchCode("")
    setCollegeSearch("")

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

      const result = simulateAllotment(input, cutoffs)
      setSimulationResult(result)
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
  const getSafetyBadge = (pref: PreferenceOption) => {
    const level = getPreferenceSafetyLevel(userRank, pref, cutoffs, selectedYear, userCategory)

    switch (level) {
      case 'safe':
        return <Badge className="bg-green-500 hover:bg-green-600">Safe</Badge>
      case 'moderate':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Moderate</Badge>
      case 'risky':
        return <Badge className="bg-red-500 hover:bg-red-600">Risky</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
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
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Mock Simulator
        </h1>
        <p className="text-muted-foreground">
          Simulate KCET seat allotment based on your rank and preferences using historical data
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How it works</AlertTitle>
        <AlertDescription>
          Enter your rank, category, and add college preferences in order of priority.
          The simulator will check each preference against historical cutoffs and show
          which college you'd likely get in each counseling round.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Inputs */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Your Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rank">Your KCET Rank</Label>
                <Input
                  id="rank"
                  type="number"
                  value={userRank}
                  onChange={(e) => setUserRank(parseInt(e.target.value) || 0)}
                  placeholder="Enter your rank"
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={userCategory} onValueChange={setUserCategory}>
                  <SelectTrigger>
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
                <Label htmlFor="year">Reference Year</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
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
                <Label htmlFor="round">Target Round</Label>
                <Select
                  value={selectedRound}
                  onValueChange={setSelectedRound}
                  disabled={!selectedYear || availableRounds.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availableRounds.length === 0 ? "Select year first" : "Select round"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRounds.map(round => (
                      <SelectItem key={round} value={round}>{round}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Shows results exactly for this round
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Add Preference */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Preference
              </CardTitle>
              <CardDescription>
                Build your preference list in order of priority
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Search College</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-8"
                    placeholder="Search by name or code..."
                    value={collegeSearch}
                    onChange={(e) => setCollegeSearch(e.target.value)}
                  />
                </div>
                {collegeSearch && filteredColleges.length > 0 && (
                  <div className="border rounded-md max-h-40 overflow-y-auto">
                    {filteredColleges.map(college => (
                      <div
                        key={college.code}
                        className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() => {
                          setNewCollegeCode(college.code)
                          setCollegeSearch(college.name)
                        }}
                      >
                        <span className="font-medium">{college.code}</span>
                        <span className="text-muted-foreground ml-2">{college.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Branch</Label>
                <Select value={newBranchCode} onValueChange={setNewBranchCode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBranches.slice(0, 50).map(branch => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addPreference} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add to Preferences
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preferences & Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Preference List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Your Preferences ({preferences.length})
                </span>
                <Button
                  onClick={runSimulation}
                  disabled={preferences.length === 0 || isSimulating}
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isSimulating ? 'Simulating...' : 'Run Simulation'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {preferences.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No preferences added yet</p>
                  <p className="text-sm">Add colleges to start simulating</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {preferences.map((pref, index) => (
                    <div
                      key={pref.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-primary w-8">#{pref.priority}</span>
                        <div>
                          <p className="font-medium text-sm">{pref.collegeName}</p>
                          <p className="text-xs text-muted-foreground">{pref.branchName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSafetyBadge(pref)}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => movePreference(pref.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => movePreference(pref.id, 'down')}
                          disabled={index === preferences.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePreference(pref.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Simulation Results */}
          {simulationResult && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Simulation Results
                </CardTitle>
                <CardDescription>
                  Based on {selectedYear} cutoffs for {userCategory} category at rank {userRank.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="summary">
                  <TabsList className="mb-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="rounds">Round-wise</TabsTrigger>
                    <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
                  </TabsList>

                  <TabsContent value="summary">
                    {simulationResult.summary.bestOutcome ? (
                      <div className="space-y-4">
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <AlertTitle className="text-green-700 dark:text-green-300">Best Possible Outcome</AlertTitle>
                          <AlertDescription className="text-green-600 dark:text-green-400">
                            <strong>{simulationResult.summary.bestOutcome.college.collegeName}</strong>
                            <br />
                            {simulationResult.summary.bestOutcome.college.branchName}
                            <br />
                            <span className="text-sm">
                              Preference #{simulationResult.summary.bestOutcome.preferenceNumber} •
                              Best in {simulationResult.summary.bestOutcome.round}
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
                              #{simulationResult.summary.bestOutcome.preferenceNumber}
                            </p>
                            <p className="text-sm text-muted-foreground">Best Preference</p>
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

                  <TabsContent value="rounds">
                    <div className="space-y-3">
                      {simulationResult.roundResults.map((round) => (
                        <div
                          key={round.round}
                          className={`p-4 border rounded-lg ${round.allottedCollege
                            ? 'border-green-500 bg-green-50 dark:bg-green-950'
                            : 'border-gray-200'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {round.allottedCollege ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-gray-400" />
                              )}
                              <span className="font-medium">{round.round}</span>
                            </div>
                            {round.allottedCollege && (
                              <Badge className="bg-green-500">
                                Preference #{round.allottedPreferenceNumber}
                              </Badge>
                            )}
                          </div>
                          {round.allottedCollege ? (
                            <div className="mt-2 ml-8">
                              <p className="font-medium">{round.allottedCollege.collegeName}</p>
                              <p className="text-sm text-muted-foreground">
                                {round.allottedCollege.branchName} • Cutoff: {round.cutoffRank?.toLocaleString()}
                              </p>
                            </div>
                          ) : (
                            <p className="mt-2 ml-8 text-sm text-muted-foreground">
                              No eligible preference in this round
                            </p>
                          )}
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
                                  <TableCell key={r.round} className="text-center">
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default MockSimulator
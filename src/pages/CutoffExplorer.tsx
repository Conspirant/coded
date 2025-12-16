import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Filter, Upload, FileSpreadsheet, AlertCircle, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { XLSXLoader } from "@/lib/xlsx-loader"
import { COURSES, COURSE_CODE_TO_NAME } from "@/lib/courses"

// Types for the cutoff data
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
    total_files_processed: number
    total_entries: number
  }
  cutoffs: CutoffData[]
}

const CutoffExplorer = () => {
  console.log('CutoffExplorer component rendering')
  const [cutoffs, setCutoffs] = useState<CutoffData[]>([])
  const [allCutoffs, setAllCutoffs] = useState<CutoffData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedInstitute, setSelectedInstitute] = useState("")
  const [selectedRound, setSelectedRound] = useState("")
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [availableInstitutes, setAvailableInstitutes] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [availableRounds, setAvailableRounds] = useState<string[]>([])
  const [stats, setStats] = useState<{ total: number; institutes: number; courses: number; categories: number }>({ total: 0, institutes: 0, courses: 0, categories: 0 })
  const [page, setPage] = useState(1)
  const [pageSize] = useState(50)
  const [errorMessage, setErrorMessage] = useState("")
  const [xlsxLoading, setXlsxLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const isMobile = useIsMobile()
  
  // Keep filters open by default on mobile
  useEffect(() => {
    if (isMobile) {
      setShowFilters(true)
    }
  }, [isMobile])
  const { toast } = useToast()

  // Load data from local JSON file
  const loadCutoffData = async () => {
    setLoading(true)
    try {
      console.log('Loading cutoff data from local JSON file...')
      
      // Try multiple data sources with fallback
      let response = await fetch('/data/kcet_cutoffs_consolidated.json', { cache: 'no-store' })
      let dataSource = 'data/kcet_cutoffs_consolidated.json'
      
      if (!response.ok) {
        // Try root consolidated
        response = await fetch('/kcet_cutoffs.json', { cache: 'no-store' })
        dataSource = 'kcet_cutoffs.json'
        
        if (!response.ok) {
          // Try public directory
          response = await fetch('/public/data/kcet_cutoffs_consolidated.json', { cache: 'no-store' })
          dataSource = 'public/data/kcet_cutoffs_consolidated.json'
          
          if (!response.ok) {
            // Try the 2025 data file
            response = await fetch('/kcet_cutoffs2025.json', { cache: 'no-store' })
            dataSource = 'kcet_cutoffs2025.json'
            
            if (!response.ok) {
              // Try the new Round 3 2025 specific data
              response = await fetch('/kcet_cutoffs_round3_2025.json', { cache: 'no-store' })
              dataSource = 'kcet_cutoffs_round3_2025.json'
              
              if (!response.ok) {
                throw new Error(`Failed to load data from all sources: ${response.status} ${response.statusText}`)
              }
            }
          }
        }
      }
      
      console.log(`Loading data from: ${dataSource}`)
      
      const rawData = await response.json()
      console.log('Raw data structure:', Object.keys(rawData))
      
      // Handle different data structures
      let data: CutoffResponse
      if (!rawData.cutoffs && Array.isArray(rawData)) {
        console.log('Data is a direct array, wrapping in response format')
        data = { cutoffs: rawData, metadata: {} } as any
      } else {
        data = rawData
      }
      
      console.log('Loaded cutoff data:', data.cutoffs.length, 'records')
      console.log('First record:', data.cutoffs[0])
      
      setAllCutoffs(data.cutoffs)
      
      // Extract unique values from the data
      const years = [...new Set(data.cutoffs.map(item => item.year))].sort((a, b) => b.localeCompare(a))
      
      // Filter institutes to only E001 to E314
      const allInstitutes = [...new Set(data.cutoffs.map(item => item.institute))].sort()
      const filteredInstitutes = allInstitutes.filter(inst => {
        const match = inst.match(/E(\d+)/)
        if (match) {
          const num = parseInt(match[1])
          return num >= 1 && num <= 314
        }
        return false
      })
      
      const categories = [...new Set(data.cutoffs.map(item => item.category))].sort()
      const rounds = [...new Set(data.cutoffs.map(item => item.round))].sort()
      
      console.log('Available institutes:', filteredInstitutes.length, filteredInstitutes.slice(0, 10))
      
      setAvailableYears(years)
      setAvailableInstitutes(filteredInstitutes)
      setAvailableCategories(['ALL', ...categories])
      setAvailableRounds(['ALL', ...rounds])
      
      // Set default year to the most recent year
      if (years.length > 0) {
        setSelectedYear(years[0])
      }
      if (categories.length > 0) {
        setSelectedCategory('ALL')
      }
      if (rounds.length > 0) {
        setSelectedRound('ALL')
      }
      
      setCutoffs(data.cutoffs.slice(0, 200)) // Show first 200 records initially
    } catch (error: any) {
      console.error('Error loading cutoff data:', error)
      console.error('Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name
      })
      setErrorMessage(`Failed to load cutoff data: ${error?.message || 'Unknown error'}. Please check the console for more details.`)
      toast({
        title: "Error",
        description: "Failed to load cutoff data. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Load data from XLSX files automatically
  const loadFromXLSX = async () => {
    setXlsxLoading(true)
    try {
      const result = await XLSXLoader.loadAllXLSXFiles()
      
      // Convert XLSX data to match existing format
      const convertedData: CutoffData[] = result.cutoffs.map(item => ({
        institute: item.institute || '',
        institute_code: item.institute_code || '',
        course: item.course || '',
        category: item.category || '',
        cutoff_rank: item.cutoff_rank || 0,
        year: item.year || '',
        round: item.round || ''
      }))

      setAllCutoffs(convertedData)
      
      // Extract unique values from the data
      const years = [...new Set(convertedData.map(item => item.year))].sort((a, b) => b.localeCompare(a))
      
      // Filter institutes to only E001 to E314
      const allInstitutes = [...new Set(convertedData.map(item => item.institute))].sort()
      const filteredInstitutes = allInstitutes.filter(inst => {
        const match = inst.match(/E(\d+)/)
        if (match) {
          const num = parseInt(match[1])
          return num >= 1 && num <= 314
        }
        return false
      })
      
      const categories = [...new Set(convertedData.map(item => item.category))].sort()
      const rounds = [...new Set(convertedData.map(item => item.round))].sort()
      
      setAvailableYears(years)
      setAvailableInstitutes(filteredInstitutes)
      setAvailableCategories(['ALL', ...categories])
      setAvailableRounds(['ALL', ...rounds])
      
      // Set default year to the most recent year
      if (years.length > 0) {
        setSelectedYear(years[0])
      }
      if (categories.length > 0) {
        setSelectedCategory('ALL')
      }
      if (rounds.length > 0) {
        setSelectedRound('ALL')
      }
      
      setCutoffs(convertedData.slice(0, 200)) // Show first 200 records initially
      
      toast({
        title: "Success",
        description: `Loaded ${convertedData.length} records from XLSX files`,
      })
    } catch (error: any) {
      console.error('Error loading XLSX data:', error)
      toast({
        title: "Error",
        description: error?.message || 'Failed to load XLSX files',
        variant: "destructive"
      })
    } finally {
      setXlsxLoading(false)
    }
  }

  // Filter data based on current filters
  const filterData = () => {
    console.log('Filtering data with:', { selectedYear, selectedCategory, selectedCourse, selectedInstitute, selectedRound, searchQuery })
    
    let filteredData = allCutoffs

    // Filter by year
    if (selectedYear) {
      filteredData = filteredData.filter(item => item.year === selectedYear)
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== 'ALL') {
      filteredData = filteredData.filter(item => item.category === selectedCategory)
    }

    // Filter by institute
    if (selectedInstitute) {
      filteredData = filteredData.filter(item => item.institute === selectedInstitute)
    }

    // Filter by round
    if (selectedRound && selectedRound !== 'ALL') {
      filteredData = filteredData.filter(item => item.round === selectedRound)
    }

    // Filter by search query
    if (searchQuery) {
      filteredData = filteredData.filter(item => 
        item.institute?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institute_code?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by selected course
    if (selectedCourse) {
      filteredData = filteredData.filter(item => item.course === selectedCourse)
    }

    // Update stats
    const instituteSet = new Set(filteredData.map(i => i.institute_code))
    const courseSet = new Set(filteredData.map(i => i.course))
    const categorySet = new Set(filteredData.map(i => i.category))
    setStats({
      total: filteredData.length,
      institutes: instituteSet.size,
      courses: courseSet.size,
      categories: categorySet.size,
    })

    // Pagination
    const start = (page - 1) * pageSize
    const end = start + pageSize
    console.log('Filtered data:', filteredData.length, 'records')
    setCutoffs(filteredData.slice(start, end))
  }

  useEffect(() => {
    loadCutoffData()
  }, [])

  useEffect(() => {
    if (allCutoffs.length > 0) {
      filterData()
    }
  }, [selectedYear, selectedCategory, selectedCourse, selectedInstitute, selectedRound, searchQuery, allCutoffs, page, pageSize])

  const handleSearch = () => {
    filterData()
  }

  const getSeatTypeColor = (seatType: string) => {
    switch (seatType) {
      case 'government': return 'bg-green-100 text-green-800'
      case 'management': return 'bg-yellow-100 text-yellow-800'
      case 'comed_k': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'GM': return 'bg-blue-100 text-blue-800'
      case 'SC': return 'bg-green-100 text-green-800'
      case 'ST': return 'bg-purple-100 text-purple-800'
      case '1G': return 'bg-red-100 text-red-800'
      case '2A': return 'bg-orange-100 text-orange-800'
      case '2B': return 'bg-yellow-100 text-yellow-800'
      case '3A': return 'bg-pink-100 text-pink-800'
      case '3B': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoundDisplayName = (round: string) => {
    switch (round) {
      case 'Round 1': return 'Round 1'
      case 'Round 2': return 'Round 2'
      case 'Round 3': return 'Round 3'
      case 'Round 3 (Extended)': return 'Round 3 (Extended)'
      case 'Mock Round 1': return 'Mock Round 1'
      default: return round
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Cutoff Explorer</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Explore and analyze KCET cutoff data across different years, colleges, and categories
            </p>
          </div>
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

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                Search & Filters
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
          <CardContent className="pt-0">
            <div className={`space-y-4 transition-all duration-200 ${isMobile && !showFilters ? 'hidden' : ''}`}>
              {/* Search - always visible on mobile */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="College or branch name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filter Grid - responsive */}
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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

                <div className="space-y-2">
                  <Label>Institute</Label>
                  <Select value={selectedInstitute || 'ALL'} onValueChange={(v) => setSelectedInstitute(v === 'ALL' ? '' : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select institute" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      <SelectItem value="ALL">All Institutes</SelectItem>
                      {availableInstitutes.map((inst) => (
                        <SelectItem key={inst} value={inst}>
                          {inst}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat === 'ALL' ? 'All Categories' : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={selectedCourse || 'ALL'} onValueChange={(v) => setSelectedCourse(v === 'ALL' ? '' : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All courses" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      <SelectItem value="ALL">All Courses</SelectItem>
                      {COURSES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code} — {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={handleSearch} className="w-full">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Matching cutoff entries</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Institutes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.institutes}</div>
              <p className="text-xs text-muted-foreground">Appearing in results</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.courses}</div>
              <p className="text-xs text-muted-foreground">Distinct course codes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.categories}</div>
              <p className="text-xs text-muted-foreground">Present in results</p>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                Cutoff Results ({stats.total} total, page {page})
              </CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">{selectedYear}</Badge>
                {selectedCategory && <Badge variant="outline">{selectedCategory.toUpperCase()}</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 rounded-none border-2 border-destructive/40 bg-destructive/10 p-3 text-sm">
                <div className="font-semibold">Data load failed</div>
                <div className="opacity-80">{errorMessage}</div>
              </div>
            )}
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading cutoffs...</p>
              </div>
            ) : cutoffs.length > 0 ? (
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden lg:block rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Institute</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Round</TableHead>
                        <TableHead className="text-right">Cutoff Rank</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cutoffs.map((cutoff, index) => (
                        <TableRow key={`${cutoff.institute_code}-${cutoff.course}-${cutoff.category}-${index}`}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{cutoff.institute}</div>
                              <div className="text-sm text-muted-foreground">
                                {cutoff.institute_code}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{COURSE_CODE_TO_NAME[cutoff.course] || cutoff.course}</div>
                              <div className="text-sm text-muted-foreground">{cutoff.course}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getCategoryColor(cutoff.category)}>
                              {cutoff.category?.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {cutoff.round}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold">
                            {cutoff.cutoff_rank?.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm">
                              {/* <Eye className="h-4 w-4" /> */}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {cutoffs.map((cutoff, index) => (
                    <Card key={`${cutoff.institute_code}-${cutoff.course}-${cutoff.category}-${index}`} className="p-4 hover:shadow-md transition-shadow">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-lg leading-tight">{cutoff.institute}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {cutoff.institute_code}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">
                              {cutoff.cutoff_rank?.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Cutoff Rank</div>
                          </div>
                        </div>
                        
                        {/* Course Info */}
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="font-medium text-base">{COURSE_CODE_TO_NAME[cutoff.course] || cutoff.course}</div>
                          <div className="text-sm text-muted-foreground">{cutoff.course}</div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${getCategoryColor(cutoff.category)} text-xs px-2 py-1`}>
                            {cutoff.category?.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            {cutoff.round}
                          </Badge>
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            {cutoff.year}
                          </Badge>
                        </div>

                        {/* Additional Info */}
                        {(cutoff.total_seats || cutoff.available_seats) && (
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            {cutoff.total_seats && (
                              <div className="text-center p-2 bg-muted/30 rounded">
                                <div className="font-semibold">{cutoff.total_seats}</div>
                                <div className="text-muted-foreground">Total Seats</div>
                              </div>
                            )}
                            {cutoff.available_seats && (
                              <div className="text-center p-2 bg-muted/30 rounded">
                                <div className="font-semibold">{cutoff.available_seats}</div>
                                <div className="text-muted-foreground">Available</div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t bg-muted/20">
                  <div className="text-sm text-muted-foreground text-center sm:text-left">
                    Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, stats.total)} of {stats.total}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPage(Math.max(1, page - 1))} 
                      disabled={page === 1}
                      className="min-h-[44px] min-w-[44px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">←</span>
                    </Button>
                    <div className="flex items-center px-3 py-2 text-sm font-medium bg-background border rounded-md min-h-[44px]">
                      Page {page}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setPage(page * pageSize < stats.total ? page + 1 : page)} 
                      disabled={page * pageSize >= stats.total}
                      className="min-h-[44px] min-w-[44px] touch-manipulation"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">→</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No cutoffs found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CutoffExplorer
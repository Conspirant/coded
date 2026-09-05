import { SEO } from "@/components/SEO";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, AlertCircle, ChevronDown, ChevronUp, Eye, Database, ShieldCheck, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComedkCutoffRow {
  institute: string;
  institute_code: string;
  course: string;
  course_code?: string;
  category: string;
  cutoff_rank: number;
  year: string;
  round: string;
  source_pdf?: string;
  source_page?: number;
}

interface ComedkResponse {
  metadata: {
    exam: string;
    last_updated: string;
    total_entries: number;
    total_colleges: number;
    total_courses: number;
    years_covered: string[];
    categories: string[];
  };
  cutoffs: ComedkCutoffRow[];
}

const ROUND_ORDER = ["MOCK", "R1", "R2P1", "R2P2", "R2", "R3", "R4"];

const normalizeText = (text: string) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const STOP_WORDS = new Set(["OF", "AND", "THE", "FOR", "IN", "AT", "TO", "ON", "A", "AN"]);

const toInitialism = (text: string) =>
  String(text || "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => !STOP_WORDS.has(token))
    .map((token) => token[0])
    .join("");

const buildSearchBlob = (...parts: string[]) => {
  const base = parts.filter(Boolean).join(" ");
  const compact = normalizeText(base);
  const initials = toInitialism(base).toLowerCase();
  return `${base.toLowerCase()} ${compact} ${initials}`;
};

const cleanCourseForDisplay = (raw: string) => {
  let text = String(raw || "")
    .replace(/\s+/g, " ")
    .trim();

  text = text
    .replace(/([A-Z]{1,4})\s*-\s*/g, "$1-")
    .replace(/([A-Za-z])-\s+([A-Za-z])/g, "$1$2")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")");

  const codeMatches = [...text.matchAll(/[A-Z]{1,4}-/g)];
  if (codeMatches.length > 1) {
    text = text.slice(0, codeMatches[1].index).trim();
  }

  return text;
};

const getCourseCodeFromText = (course: string) => {
  const match = String(course || "").match(/^([A-Z]{1,4})-/);
  return match ? match[1].toUpperCase() : "";
};

const isGarbageCourse = (course: string) => {
  const text = String(course || "").trim();
  if (!text) return true;
  if (!/[A-Za-z]/.test(text)) return true;
  if (/^&/.test(text)) return true;
  if (/^[A-Z]{1,4}-$/.test(text)) return true;
  return false;
};

const isFragmentCourse = (course: string) => {
  const text = String(course || "").trim();
  if (isGarbageCourse(text)) return true;
  if (!getCourseCodeFromText(text) && /\)$/.test(text) && !/\(/.test(text)) return true;
  if (!getCourseCodeFromText(text) && text.split(/\s+/).length <= 2 && /^(Science|Technology|Design)\)?$/i.test(text)) return true;
  return false;
};

const instituteCodeOrder = (code: string) => {
  const match = String(code || "").trim().toUpperCase().match(/^E(\d+)$/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
};

const roundOrder = (round: string) => {
  const index = ROUND_ORDER.indexOf(String(round || "").toUpperCase());
  return index === -1 ? 999 : index;
};

const getRoundDisplayName = (round: string) => {
  switch (String(round || "").toUpperCase()) {
    case "MOCK":
      return "Mock";
    case "R1":
      return "R1";
    case "R2P1":
      return "R2 Phase 1";
    case "R2P2":
      return "R2 Phase 2";
    case "R2":
      return "R2";
    case "R3":
      return "R3";
    case "R4":
      return "R4";
    default:
      return round;
  }
};

const getCategoryColor = (category: string) => {
  switch (String(category || "").toUpperCase()) {
    case "GM":
      return "bg-teal-100 text-teal-900 border-teal-200";
    case "KKR":
      return "bg-amber-100 text-amber-900 border-amber-200";
    case "HKR":
      return "bg-sky-100 text-sky-900 border-sky-200";
    default:
      return "bg-slate-100 text-slate-900 border-slate-200";
  }
};

const ComedkExplorer = () => {
  const [allCutoffs, setAllCutoffs] = useState<ComedkCutoffRow[]>([]);
  const [cutoffs, setCutoffs] = useState<ComedkCutoffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedRound, setSelectedRound] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableRounds, setAvailableRounds] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableInstitutes, setAvailableInstitutes] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [stats, setStats] = useState({ total: 0, institutes: 0, courses: 0, categories: 0 });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(50);
  const [showFilters, setShowFilters] = useState(false);

  const isMobile = useIsMobile();
  const { toast } = useToast();
  const getDisplayCourse = (row: ComedkCutoffRow) => cleanCourseForDisplay(row.course);

  useEffect(() => {
    if (isMobile) {
      setShowFilters(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/data/comedk_cutoffs.dat", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: ComedkResponse = await response.json();
        const rows = Array.isArray(data.cutoffs) ? data.cutoffs : [];
        setAllCutoffs(rows);

        const years = [...new Set(rows.map((row) => String(row.year)))].sort((a, b) => b.localeCompare(a));
        const rounds = [...new Set(rows.map((row) => String(row.round).toUpperCase()))].sort((a, b) => roundOrder(a) - roundOrder(b));
        const categories = [...new Set(rows.map((row) => String(row.category).toUpperCase()))].sort((a, b) => {
          const order = ["GM", "HKR", "KKR"];
          const diff = order.indexOf(a) - order.indexOf(b);
          return diff === 0 ? a.localeCompare(b) : diff;
        });

        const courseCounts = new Map<string, number>();
        const cleanedCourses = rows.map((row) => cleanCourseForDisplay(row.course));
        for (const label of cleanedCourses) {
          courseCounts.set(label, (courseCounts.get(label) || 0) + 1);
        }

        const isLikelySuffixFragment = (label: string) => {
          if (getCourseCodeFromText(label)) return false;
          if (!/^[A-Za-z]+\)?$/.test(label)) return false;
          const lower = label.toLowerCase();
          const ownCount = courseCounts.get(label) || 0;
          let parentCount = 0;
          for (const [otherLabel, otherCount] of courseCounts.entries()) {
            const otherLower = otherLabel.toLowerCase();
            if (otherLower === lower) continue;
            if (otherLower.includes(lower) && otherLabel.length > label.length) {
              parentCount += otherCount;
            }
          }
          return parentCount > ownCount;
        };

        const courses = [...new Set(cleanedCourses)]
          .filter((course) => !isFragmentCourse(course))
          .filter((course) => !isLikelySuffixFragment(course))
          .sort((a, b) => a.localeCompare(b));

        const codeToNames = new Map<string, Map<string, number>>();
        for (const row of rows) {
          const code = String(row.institute_code || "").trim().toUpperCase();
          const name = String(row.institute || "").trim();
          if (!code) continue;
          if (!codeToNames.has(code)) {
            codeToNames.set(code, new Map());
          }
          if (name) {
            const names = codeToNames.get(code)!;
            names.set(name, (names.get(name) || 0) + 1);
          }
        }

        const institutes = [...codeToNames.entries()]
          .sort((a, b) => instituteCodeOrder(a[0]) - instituteCodeOrder(b[0]) || a[0].localeCompare(b[0]))
          .map(([code, names]) => {
            let bestName = code;
            let bestCount = -1;
            for (const [name, count] of names.entries()) {
              if (
                count > bestCount ||
                (count === bestCount && name.length > bestName.length) ||
                (count === bestCount && name.length === bestName.length && name < bestName)
              ) {
                bestName = name;
                bestCount = count;
              }
            }
            return `${code} - ${bestName}`;
          });

        setAvailableYears(["ALL", ...years]);
        setAvailableCategories(["ALL", ...categories]);
        setAvailableInstitutes(institutes);
        setAvailableCourses(courses);
      } catch (error: any) {
        setErrorMessage(`Failed to load COMEDK data: ${error?.message || "Unknown error"}`);
        toast({
          title: "COMEDK data unavailable",
          description: "The COMEDK cutoff dataset could not be loaded.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  // Dynamically update available rounds when selectedYear changes
  useEffect(() => {
    if (!allCutoffs.length) return;
    const relevant = (selectedYear && selectedYear !== "ALL")
      ? allCutoffs.filter((row) => String(row.year) === selectedYear)
      : allCutoffs;

    const rounds = [...new Set(relevant.map((row) => normalizeRound(row.round)))]
      .sort((a, b) => roundOrder(a) - roundOrder(b));

    const newRounds = ["ALL", ...rounds];
    setAvailableRounds(newRounds);

    if (selectedRound && selectedRound !== "ALL" && !rounds.includes(normalizeRound(selectedRound))) {
      setSelectedRound("ALL");
    }
  }, [allCutoffs, selectedYear]);

  useEffect(() => {
    if (!allCutoffs.length) return;

    let filtered = allCutoffs;

    if (selectedYear !== "ALL") {
      filtered = filtered.filter((row) => String(row.year) === selectedYear);
    }

    if (selectedRound !== "ALL") {
      filtered = filtered.filter((row) => String(row.round).toUpperCase() === selectedRound);
    }

    if (selectedCategory !== "ALL") {
      filtered = filtered.filter((row) => String(row.category).toUpperCase() === selectedCategory);
    }

    if (selectedInstitute) {
      const selectedCode = selectedInstitute.split(" - ")[0]?.trim().toUpperCase();
      filtered = filtered.filter((row) => String(row.institute_code || "").toUpperCase() === selectedCode);
    }

    if (selectedCourse) {
      filtered = filtered.filter((row) => {
        const displayCourse = getDisplayCourse(row);
        return displayCourse === selectedCourse;
      });
    }

    if (searchQuery) {
      const query = normalizeText(searchQuery);
      filtered = filtered.filter((row) =>
        buildSearchBlob(
          row.institute,
          row.institute_code,
          getDisplayCourse(row),
          row.course,
          row.course_code || "",
        ).includes(query) ||
        toInitialism(row.institute).toLowerCase().includes(query),
      );
    }

    filtered = [...filtered].sort((a, b) => {
      const codeDiff = instituteCodeOrder(a.institute_code) - instituteCodeOrder(b.institute_code);
      if (codeDiff !== 0) return codeDiff;

      const roundDiff = roundOrder(a.round) - roundOrder(b.round);
      if (roundDiff !== 0) return roundDiff;

      const categoryDiff = String(a.category || "").localeCompare(String(b.category || ""));
      if (categoryDiff !== 0) return categoryDiff;

      const courseDiff = String(getDisplayCourse(a)).localeCompare(String(getDisplayCourse(b)));
      if (courseDiff !== 0) return courseDiff;

      return Number(a.cutoff_rank || 0) - Number(b.cutoff_rank || 0);
    });

    setStats({
      total: filtered.length,
      institutes: new Set(filtered.map((row) => row.institute_code)).size,
      courses: new Set(filtered.map((row) => getDisplayCourse(row))).size,
      categories: new Set(filtered.map((row) => row.category)).size,
    });

    const start = (page - 1) * pageSize;
    setCutoffs(filtered.slice(start, start + pageSize));
  }, [
    allCutoffs,
    page,
    pageSize,
    searchQuery,
    selectedCategory,
    selectedCourse,
    selectedInstitute,
    selectedRound,
    selectedYear,
  ]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedCourse, selectedInstitute, selectedRound, selectedYear]);

  const openSource = (row: ComedkCutoffRow) => {
    if (!row.source_pdf) {
      toast({
        title: "Source PDF not available",
        description: "This row does not have a linked COMEDK PDF.",
        variant: "destructive",
      });
      return;
    }

    const url = `${row.source_pdf}#page=${row.source_page || 1}&search=${encodeURIComponent(row.institute_code)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    toast({
      title: "Source opened",
      description: row.source_page ? `Jumped to page ${row.source_page}.` : "Opened COMEDK source PDF.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="COMEDK Cutoff Explorer"
        description="Explore COMEDK cutoffs from 2022 to 2025 with year, round, category, institute, and course filters."
        url="https://kcetcoded.dev/comedk-explorer"
        keywords="COMEDK cutoff explorer, COMEDK cutoffs 2022 2023 2024 2025, COMEDK round wise cutoff, COMEDK GM KKR HKR cutoff"
      />

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-500 via-orange-500 to-sky-600 text-white shadow-xl">
          <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-white/30 bg-white/15 text-white hover:bg-white/20">COMEDK Explorer</Badge>
                <Badge className="border-white/30 bg-black/15 text-white hover:bg-black/20">2022-2025</Badge>
                <Badge className="border-white/30 bg-black/15 text-white hover:bg-black/20">R2 Phase 1 excluded</Badge>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">COMEDK cutoff explorer with source-linked PDFs</h1>
                <p className="mt-2 max-w-3xl text-sm text-white/85 sm:text-base">
                  Dedicated COMEDK browsing experience with GM, KKR, and HKR categories, round-wise filtering, and direct page jumps into the original cutoff PDFs.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-white/90">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Every row includes a linked source page
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 self-start">
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.18em] text-white/65">Results</div>
                <div className="mt-2 text-3xl font-bold">{stats.total.toLocaleString()}</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.18em] text-white/65">Institutes</div>
                <div className="mt-2 text-3xl font-bold">{stats.institutes}</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.18em] text-white/65">Courses</div>
                <div className="mt-2 text-3xl font-bold">{stats.courses}</div>
              </div>
              <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
                <div className="text-xs uppercase tracking-[0.18em] text-white/65">Categories</div>
                <div className="mt-2 text-3xl font-bold">{stats.categories}</div>
              </div>
            </div>
          </CardContent>
        </Card>



        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5 text-amber-600" />
                Search & Filters
              </CardTitle>
              {isMobile && (
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showFilters ? "Hide" : "Show"} Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`space-y-4 ${isMobile && !showFilters ? "hidden" : ""}`}>
              <div className="space-y-2">
                <Label htmlFor="comedk-search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="comedk-search"
                    placeholder="Institute, course, or course code..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

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
                          {year === "ALL" ? "All Years" : year}
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
                          {round === "ALL" ? "All Rounds" : getRoundDisplayName(round)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Institute</Label>
                  <Select value={selectedInstitute || "ALL"} onValueChange={(value) => setSelectedInstitute(value === "ALL" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Institutes" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      <SelectItem value="ALL">All Institutes</SelectItem>
                      {availableInstitutes.map((institute) => (
                        <SelectItem key={institute} value={institute}>
                          {institute}
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
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category === "ALL" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select value={selectedCourse || "ALL"} onValueChange={(value) => setSelectedCourse(value === "ALL" ? "" : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      <SelectItem value="ALL">All Courses</SelectItem>
                      {availableCourses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-amber-300 text-amber-900 hover:bg-amber-50"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedYear("ALL");
                      setSelectedRound("ALL");
                      setSelectedCategory("ALL");
                      setSelectedInstitute("");
                      setSelectedCourse("");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                COMEDK Results ({stats.total} total, page {page})
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{selectedYear === "ALL" ? "All Years" : selectedYear}</Badge>
                <Badge variant="outline">{selectedRound === "ALL" ? "All Rounds" : getRoundDisplayName(selectedRound)}</Badge>
                <Badge variant="outline">{selectedCategory === "ALL" ? "All Categories" : selectedCategory}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
                <div className="font-semibold">Data load failed</div>
                <div className="opacity-80">{errorMessage}</div>
              </div>
            )}

            {loading ? (
              <div className="py-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-amber-500" />
                <p className="mt-2 text-muted-foreground">Loading COMEDK cutoffs...</p>
              </div>
            ) : cutoffs.length ? (
              <div className="space-y-4">
                <div className="hidden rounded-md border lg:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Institute</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Round</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead className="text-right">Cutoff Rank</TableHead>
                        <TableHead className="w-[90px] text-center">Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cutoffs.map((row, index) => (
                        <TableRow key={`${row.institute_code}-${row.course}-${row.category}-${row.round}-${row.year}-${index}`}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{row.institute}</div>
                              <div className="text-sm text-muted-foreground">{row.institute_code}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{getDisplayCourse(row)}</div>
                              {row.course_code && <div className="text-sm text-muted-foreground">{row.course_code}</div>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getCategoryColor(row.category)}>{row.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getRoundDisplayName(row.round)}</Badge>
                          </TableCell>
                          <TableCell>{row.year}</TableCell>
                          <TableCell className="text-right font-mono font-semibold">{row.cutoff_rank?.toLocaleString()}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => openSource(row)}
                              title="Open source PDF"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Source</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="space-y-4 lg:hidden">
                  {cutoffs.map((row, index) => (
                    <Card key={`${row.institute_code}-${row.course}-${row.category}-${row.round}-${row.year}-${index}`} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold leading-tight">{row.institute}</div>
                            <div className="mt-1 text-sm text-muted-foreground">{row.institute_code}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-amber-600">{row.cutoff_rank?.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Cutoff Rank</div>
                          </div>
                        </div>

                        <div className="rounded-lg bg-muted/50 p-3">
                          <div className="font-medium">{getDisplayCourse(row)}</div>
                          {row.course_code && <div className="text-sm text-muted-foreground">{row.course_code}</div>}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge className={getCategoryColor(row.category)}>{row.category}</Badge>
                          <Badge variant="outline">{getRoundDisplayName(row.round)}</Badge>
                          <Badge variant="secondary">{row.year}</Badge>
                          <Badge variant="outline">PDF page {row.source_page || 1}</Badge>
                          <Button variant="outline" size="sm" className="ml-auto" onClick={() => openSource(row)}>
                            <Eye className="mr-1 h-4 w-4" />
                            Source
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t bg-muted/20 p-4 sm:flex-row">
                  <div className="text-center text-sm text-muted-foreground sm:text-left">
                    Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, stats.total)} of {stats.total}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-[44px] min-w-[44px]"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">←</span>
                    </Button>
                    <div className="flex min-h-[44px] items-center rounded-md border bg-background px-3 py-2 text-sm font-medium">
                      Page {page}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="min-h-[44px] min-w-[44px]"
                      onClick={() => setPage(page * pageSize < stats.total ? page + 1 : page)}
                      disabled={page * pageSize >= stats.total}
                    >
                      <span className="hidden sm:inline">Next</span>
                      <span className="sm:hidden">→</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No COMEDK cutoffs found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComedkExplorer;

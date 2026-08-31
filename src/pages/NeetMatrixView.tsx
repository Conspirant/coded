import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Grid3X3,
  Search,
  SlidersHorizontal,
  Download,
  Target,
  Sparkles,
  Filter,
  ArrowUpDown,
  Building2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Eye,
  RotateCcw,
  IndianRupee,
  Layers,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useExamMode } from "@/contexts/ExamModeContext";
import {
  MEDICAL_FINAL_CUTOFFS,
  MEDICAL_MOCK_CUTOFFS,
  DENTAL_FINAL_CUTOFFS,
  DENTAL_MOCK_CUTOFFS,
  FEE_BY_CODE,
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  getCategoryLabel,
  formatFee,
  type NeetCutoffEntry,
} from "@/data/neet2026Data";

// Major category presets for matrix view
const CATEGORY_PRESETS = {
  all: { label: "All Categories", cats: ALL_CATEGORIES },
  general: { label: "General & Sub-Quotas", cats: ["GM", "GMR", "GMK", "GMH", "GMP", "OPN"] },
  obc: { label: "OBC (2A, 2B, 3A, 3B, Cat 1)", cats: ["2AG", "2AR", "2AH", "2BG", "2BR", "2BH", "3AG", "3AR", "3AH", "3BG", "3BR", "3BH", "1G"] },
  sc_st: { label: "SC & ST Reservations", cats: ["S1G", "S1R", "S1H", "S2G", "S2R", "S2H", "S3G", "STG", "STR", "STH"] },
  pvt_nri: { label: "Private & NRI / Open", cats: ["GMP", "OPN", "NRI", "MA", "MU", "MEH"] },
};

export default function NeetMatrixView() {
  const { setExamMode } = useExamMode();

  const [courseType, setCourseType] = useState<"MBBS" | "BDS">("MBBS");
  const [roundType, setRoundType] = useState<"final" | "mock">("final");
  const [seatTypeFilter, setSeatTypeFilter] = useState<string>("Government");
  const [categoryPreset, setCategoryPreset] = useState<keyof typeof CATEGORY_PRESETS>("general");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userRankHighlight, setUserRankHighlight] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"gm" | "code" | "name">("gm");

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  // Select dataset
  const rawCutoffs = useMemo(() => {
    if (courseType === "MBBS") {
      return roundType === "final" ? MEDICAL_FINAL_CUTOFFS : MEDICAL_MOCK_CUTOFFS;
    } else {
      return roundType === "final" ? DENTAL_FINAL_CUTOFFS : DENTAL_MOCK_CUTOFFS;
    }
  }, [courseType, roundType]);

  // Active columns
  const activeCategories = useMemo(() => {
    return CATEGORY_PRESETS[categoryPreset].cats;
  }, [categoryPreset]);

  // Aggregate rows by college
  const matrixData = useMemo(() => {
    // Group cutoffs by college_code
    const collegeMap = new Map<
      string,
      {
        college_code: string;
        college_name: string;
        course_name: string;
        course_type: string;
        seat_type: string;
        cutoffs: Record<string, NeetCutoffEntry>;
      }
    >();

    for (const c of rawCutoffs) {
      if (seatTypeFilter !== "ALL" && c.seat_type !== seatTypeFilter) {
        continue;
      }

      if (!collegeMap.has(c.college_code)) {
        collegeMap.set(c.college_code, {
          college_code: c.college_code,
          college_name: c.college_name,
          course_name: c.course_name,
          course_type: c.course_type,
          seat_type: c.seat_type,
          cutoffs: {},
        });
      }

      const college = collegeMap.get(c.college_code)!;
      // Store under category
      college.cutoffs[c.allotted_category] = c;
    }

    let rows = Array.from(collegeMap.values());

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.college_name.toLowerCase().includes(q) ||
          r.college_code.toLowerCase().includes(q)
      );
    }

    // Sort
    rows.sort((a, b) => {
      if (sortBy === "gm") {
        const aGm = a.cutoffs["GM"]?.closing_rank || 9999999;
        const bGm = b.cutoffs["GM"]?.closing_rank || 9999999;
        return aGm - bGm;
      }
      if (sortBy === "code") {
        return a.college_code.localeCompare(b.college_code);
      }
      return a.college_name.localeCompare(b.college_name);
    });

    return rows;
  }, [rawCutoffs, seatTypeFilter, searchQuery, sortBy]);

  // Export Matrix CSV
  const exportMatrixCSV = () => {
    if (matrixData.length === 0) return;
    const headerCols = ["College Code", "College Name", "Seat Type", ...activeCategories];
    const headerLine = headerCols.map((c) => `"${c}"`).join(",");

    const rowLines = matrixData.map((row) => {
      const rowCols = [
        row.college_code,
        row.college_name.replace(/"/g, '""'),
        row.seat_type,
        ...activeCategories.map((cat) => {
          const entry = row.cutoffs[cat];
          return entry ? String(entry.closing_rank) : "—";
        }),
      ];
      return rowCols.map((c) => `"${c}"`).join(",");
    });

    const csvContent = [headerLine, ...rowLines].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Karnataka_NEET_Cutoff_Matrix_${courseType}_${roundType}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankCellColor = (closingRank: number | undefined) => {
    if (!closingRank) return "text-muted-foreground/40 bg-card/20";

    const isEligible = userRankHighlight > 0 && userRankHighlight <= closingRank;

    if (isEligible) {
      return "bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30";
    }

    if (closingRank <= 10000) {
      return "text-emerald-400 bg-emerald-950/15";
    } else if (closingRank <= 35000) {
      return "text-cyan-400 bg-cyan-950/15";
    } else if (closingRank <= 80000) {
      return "text-amber-400 bg-amber-950/15";
    } else {
      return "text-purple-400 bg-purple-950/15";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-[1600px] mx-auto space-y-6">
      <Helmet>
        <title>Karnataka NEET Cutoff Matrix Grid 2026 | Category-Wise Table | NEETCoded</title>
        <meta
          name="description"
          content="Complete visual category-wise cutoff matrix for Karnataka MBBS and BDS colleges. Compare GM, 2A, 2B, 3A, 3B, SC, ST, and HK quotas in a single high-density grid."
        />
      </Helmet>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-muted/60 border border-border/70 text-muted-foreground text-[11px] font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Category Matrix Grid
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-brand text-foreground">
              Karnataka Medical <span className="text-foreground">Cutoff Matrix</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Explore closing ranks across all reservation categories in an interactive high-density matrix. Highlight eligible colleges against your NEET AIR in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={exportMatrixCSV}
              className="border-border/70 text-xs h-8 text-foreground"
            >
              <Download className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
              Export Matrix CSV
            </Button>
            <Button asChild variant="outline" className="border-border/70 text-xs h-8 text-foreground">
              <Link to="/neet-predictor">
                <Target className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
                Predictor
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Matrix Controls & Highlight Toolbar */}
      <div className="p-4 rounded-2xl border border-border/60 bg-card/60 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Course Selector */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Course</label>
            <Select value={courseType} onValueChange={(v) => setCourseType(v as any)}>
              <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MBBS" className="text-xs">MBBS (68 Colleges)</SelectItem>
                <SelectItem value="BDS" className="text-xs">BDS (39 Colleges)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Round Selector */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Round</label>
            <Select value={roundType} onValueChange={(v) => setRoundType(v as any)}>
              <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="final" className="text-xs">Round 1 Final</SelectItem>
                <SelectItem value="mock" className="text-xs">Mock Allotment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seat Type */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Seat Type</label>
            <Select value={seatTypeFilter} onValueChange={setSeatTypeFilter}>
              <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Seat Types</SelectItem>
                <SelectItem value="Government" className="text-xs">Government Only</SelectItem>
                <SelectItem value="Private" className="text-xs">Private Seats</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Columns Preset */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Category Columns</label>
            <Select value={categoryPreset} onValueChange={(v) => setCategoryPreset(v as any)}>
              <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_PRESETS).map(([key, item]) => (
                  <SelectItem key={key} value={key} className="text-xs">
                    {item.label} ({item.cats.length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Sort Rows</label>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gm" className="text-xs">GM Cutoff (Ascending)</SelectItem>
                <SelectItem value="code" className="text-xs">College Code</SelectItem>
                <SelectItem value="name" className="text-xs">College Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* User Rank Live Highlighter */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-rose-400">
              Highlight Odds (Your AIR)
            </label>
            <Input
              type="number"
              value={userRankHighlight || ""}
              onChange={(e) => setUserRankHighlight(Number(e.target.value) || 0)}
              placeholder="e.g. 45000"
              className="h-8 font-mono text-xs bg-background border-rose-500/40"
            />
          </div>
        </div>

        {/* Search and stats bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search college name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            {userRankHighlight > 0 && (
              <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-[10px]">
                Glowing green = Your AIR {userRankHighlight.toLocaleString()} is eligible
              </Badge>
            )}
            <span className="font-mono">
              {matrixData.length} colleges • {activeCategories.length} category columns
            </span>
          </div>
        </div>
      </div>

      {/* ═══ HIGH DENSITY MATRIX GRID ═══ */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[750px]">
          <table className="w-full text-xs border-collapse">
            {/* Header Row */}
            <thead className="bg-muted/40 sticky top-0 z-20 shadow-sm">
              <tr className="border-b border-border/60">
                <th className="p-2.5 text-left w-12 font-mono text-[10px] text-muted-foreground uppercase sticky left-0 z-30 bg-muted/90 backdrop-blur-md">
                  #
                </th>
                <th className="p-2.5 text-left w-20 font-mono text-[10px] text-muted-foreground uppercase sticky left-12 z-30 bg-muted/90 backdrop-blur-md">
                  Code
                </th>
                <th className="p-2.5 text-left min-w-[240px] max-w-[280px] text-[10px] text-muted-foreground uppercase sticky left-32 z-30 bg-muted/90 backdrop-blur-md border-r border-border/50">
                  College Name
                </th>
                {activeCategories.map((cat) => (
                  <th
                    key={cat}
                    className="p-2 text-center font-mono text-[11px] font-bold text-rose-300 min-w-[90px] whitespace-nowrap"
                    title={getCategoryLabel(cat)}
                  >
                    {cat}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Matrix Body */}
            <tbody className="divide-y divide-border/30">
              {matrixData.map((row, idx) => {
                const fee = FEE_BY_CODE.get(row.college_code);

                return (
                  <tr key={row.college_code + idx} className="hover:bg-muted/30 transition-colors">
                    {/* Index */}
                    <td className="p-2.5 font-mono text-muted-foreground sticky left-0 z-10 bg-card/90 backdrop-blur-md">
                      {idx + 1}
                    </td>

                    {/* Code */}
                    <td className="p-2.5 font-mono font-bold text-rose-400 sticky left-12 z-10 bg-card/90 backdrop-blur-md">
                      {row.college_code}
                    </td>

                    {/* College Name & Meta */}
                    <td className="p-2.5 sticky left-32 z-10 bg-card/90 backdrop-blur-md border-r border-border/50">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-foreground line-clamp-1 text-xs" title={row.college_name}>
                          {row.college_name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <span className="truncate">{row.seat_type}</span>
                          {fee && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400 font-mono font-semibold">{formatFee(fee.govt_fees)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category Cells */}
                    {activeCategories.map((cat) => {
                      const entry = row.cutoffs[cat];
                      const closingRank = entry?.closing_rank;

                      return (
                        <td key={cat} className="p-1 text-center font-mono">
                          {entry ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  className={`w-full py-1.5 px-1 rounded-md text-[11px] transition-all cursor-pointer ${getRankCellColor(
                                    closingRank
                                  )}`}
                                >
                                  {closingRank?.toLocaleString("en-IN")}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-3 text-xs space-y-2 bg-card border-border/60 shadow-xl" side="top">
                                <div className="space-y-0.5">
                                  <Badge variant="outline" className="text-[9px] font-mono border-rose-500/30 text-rose-400">
                                    {cat} — {getCategoryLabel(cat)}
                                  </Badge>
                                  <p className="font-bold text-foreground text-xs line-clamp-1">{row.college_name}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-background/60 border border-border/40 text-[11px]">
                                  <div>
                                    <span className="text-[9px] text-muted-foreground uppercase block">Closing Rank</span>
                                    <span className="font-bold text-rose-400">#{closingRank?.toLocaleString("en-IN")}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-muted-foreground uppercase block">Opening Rank</span>
                                    <span className="font-bold text-foreground">#{entry.opening_rank.toLocaleString("en-IN")}</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-muted-foreground uppercase block">Seats Allotted</span>
                                    <span className="font-bold text-foreground">{entry.total_allotted} seats</span>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-muted-foreground uppercase block">Course Fee</span>
                                    <span className="font-bold text-emerald-400">{entry.course_fees ? formatFee(entry.course_fees) : "—"}</span>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <span className="text-muted-foreground/30 text-[10px]">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

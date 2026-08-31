import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import {
  Target,
  Search,
  SlidersHorizontal,
  Filter,
  MapPin,
  GraduationCap,
  Sparkles,
  Download,
  Bookmark,
  Check,
  AlertCircle,
  IndianRupee,
  Building2,
  ChevronRight,
  Scale,
  ListOrdered,
  FileSpreadsheet,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExamMode } from "@/contexts/ExamModeContext";
import {
  MEDICAL_FINAL_CUTOFFS,
  DENTAL_FINAL_CUTOFFS,
  FEE_BY_CODE,
  TOP_CATEGORIES,
  getCategoryLabel,
  formatFee,
  type NeetCutoffEntry,
} from "@/data/neet2026Data";

interface CollegeMatchItem extends NeetCutoffEntry {
  probability: "High" | "Moderate" | "Borderline";
  marginPercent: number;
}

export default function NeetCollegePredictor() {
  const { setExamMode } = useExamMode();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial from URL if provided
  const initialRank = Number(searchParams.get("rank")) || 42000;
  const initialCat = searchParams.get("category") || "GM";

  const [rank, setRank] = useState<number>(initialRank);
  const [category, setCategory] = useState<string>(initialCat);
  const [courseType, setCourseType] = useState<"MBBS" | "BDS">("MBBS");
  const [collegeTypeFilter, setCollegeTypeFilter] = useState<string>("ALL");
  const [seatTypeFilter, setSeatTypeFilter] = useState<string>("ALL");
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [probabilityFilter, setProbabilityFilter] = useState<string>("ALL");
  const [bookmarkedCodes, setBookmarkedCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  // Source Dataset
  const dataset = useMemo(() => {
    return courseType === "MBBS" ? MEDICAL_FINAL_CUTOFFS : DENTAL_FINAL_CUTOFFS;
  }, [courseType]);

  // Compute matches with probabilities & margin %
  const matches = useMemo(() => {
    if (!rank || rank <= 0) return [];

    const filtered = dataset.filter((c) => {
      if (c.allotted_category !== category) return false;
      if (seatTypeFilter !== "ALL" && c.seat_type !== seatTypeFilter) return false;
      if (maxBudget > 0 && (c.course_fees || 0) > maxBudget) return false;

      if (collegeTypeFilter !== "ALL") {
        const feeInfo = FEE_BY_CODE.get(c.college_code);
        if (feeInfo && feeInfo.college_type !== collegeTypeFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !c.college_name.toLowerCase().includes(q) &&
          !c.course_code.toLowerCase().includes(q) &&
          !c.college_code.toLowerCase().includes(q)
        )
          return false;
      }

      return true;
    });

    // Calculate probability & margin
    const results: CollegeMatchItem[] = [];
    for (const c of filtered) {
      const margin = ((c.closing_rank - rank) / c.closing_rank) * 100;
      let probability: "High" | "Moderate" | "Borderline";

      if (rank <= c.closing_rank * 0.85) {
        probability = "High";
      } else if (rank <= c.closing_rank) {
        probability = "Moderate";
      } else if (rank <= c.closing_rank * 1.15) {
        probability = "Borderline";
      } else {
        continue; // Exclude out-of-reach beyond 15%
      }

      if (probabilityFilter !== "ALL" && probability !== probabilityFilter) {
        continue;
      }

      results.push({
        ...c,
        probability,
        marginPercent: Math.round(margin),
      });
    }

    return results.sort((a, b) => a.closing_rank - b.closing_rank);
  }, [dataset, rank, category, seatTypeFilter, maxBudget, collegeTypeFilter, searchQuery, probabilityFilter]);

  // Toggle Bookmark
  const toggleBookmark = (code: string) => {
    setBookmarkedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  // Export CSV
  const exportCSV = () => {
    if (matches.length === 0) return;
    const headers = "Course Code,College Code,College Name,Course Name,Seat Type,Category,2026 R1 Closing Rank,Annual Fee,Probability,Margin %\n";
    const rows = matches
      .map(
        (m) =>
          `"${m.course_code}","${m.college_code}","${m.college_name.replace(/"/g, '""')}","${m.course_name}","${m.seat_type}","${m.allotted_category}","${m.closing_rank}","${m.course_fees || 0}","${m.probability}","${m.marginPercent}%"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NEET_College_Matches_AIR${rank}_${category}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getProbBadge = (prob: "High" | "Moderate" | "Borderline") => {
    switch (prob) {
      case "High":
        return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">High Chance</Badge>;
      case "Moderate":
        return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]">Moderate</Badge>;
      case "Borderline":
        return <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-[10px]">Borderline / Stretch</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>NEET College Predictor 2026 | Karnataka MBBS/BDS Finder | NEETCoded</title>
        <meta
          name="description"
          content="Predict your eligible Karnataka Medical & Dental Colleges based on your NEET 2026 All India Rank (AIR), category reservation quota, and fee budget."
        />
      </Helmet>

      {/* ═══ HEADER ═══ */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-muted/60 border border-border/70 text-muted-foreground text-[11px] font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              NEET AIR Recommendation Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-brand text-foreground">
              Karnataka Medical <span className="text-foreground">College Predictor</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Match your exact NEET All India Rank with verified Round 1 closing cutoffs across 107 Karnataka colleges.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" className="border-border/70 text-xs h-8">
              <Link to="/neet-option-builder">
                <ListOrdered className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Option Entry Builder
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-border/70 text-xs h-8">
              <Link to="/neet-compare">
                <Scale className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Compare
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ PREDICTOR CONTROL PANEL ═══ */}
      <div className="p-5 rounded-2xl border border-border/60 bg-card/60 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-rose-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Candidate Parameters & Filters
            </span>
          </div>
          <button
            onClick={() => {
              setRank(42000);
              setCategory("GM");
              setCourseType("MBBS");
              setSeatTypeFilter("ALL");
              setCollegeTypeFilter("ALL");
              setMaxBudget(0);
              setSearchQuery("");
              setProbabilityFilter("ALL");
            }}
            className="text-[11px] text-muted-foreground hover:text-rose-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Rank */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">NEET AIR</label>
            <Input
              type="number"
              value={rank}
              onChange={(e) => setRank(Number(e.target.value) || 0)}
              placeholder="e.g. 42000"
              className="h-8 font-mono text-xs bg-background"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TOP_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat} — {getCategoryLabel(cat)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Course */}
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

          {/* College Type */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">College Type</label>
            <Select value={collegeTypeFilter} onValueChange={setCollegeTypeFilter}>
              <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Types</SelectItem>
                <SelectItem value="Government" className="text-xs">Government</SelectItem>
                <SelectItem value="Minority (L,R)" className="text-xs">Minority</SelectItem>
                <SelectItem value="Private UnAided" className="text-xs">Private UnAided</SelectItem>
                <SelectItem value="Private/Deemed University" className="text-xs">Deemed Univ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Max Budget */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Max Annual Fee</label>
            <Select value={String(maxBudget)} onValueChange={(v) => setMaxBudget(Number(v))}>
              <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0" className="text-xs">Any Budget</SelectItem>
                <SelectItem value="70000" className="text-xs">≤ ₹70K (Govt)</SelectItem>
                <SelectItem value="160000" className="text-xs">≤ ₹1.6L (Govt Quota)</SelectItem>
                <SelectItem value="1300000" className="text-xs">≤ ₹13L (Private)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search & Probability Secondary Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search college name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={probabilityFilter} onValueChange={setProbabilityFilter}>
              <SelectTrigger className="h-8 text-xs w-32 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Odds</SelectItem>
                <SelectItem value="High" className="text-xs">High Chance</SelectItem>
                <SelectItem value="Moderate" className="text-xs">Moderate</SelectItem>
                <SelectItem value="Borderline" className="text-xs">Borderline</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              disabled={matches.length === 0}
              className="h-8 text-xs border-border/60"
            >
              <Download className="h-3 w-3 mr-1.5" /> Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ RESULTS COUNT & OVERVIEW ═══ */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-muted-foreground">
          Found <strong className="text-foreground">{matches.length}</strong> matching options for AIR {rank.toLocaleString("en-IN")} in {category}
        </span>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-emerald-400 font-semibold">{matches.filter((m) => m.probability === "High").length} High</span>
          <span>•</span>
          <span className="text-amber-400 font-semibold">{matches.filter((m) => m.probability === "Moderate").length} Moderate</span>
          <span>•</span>
          <span className="text-rose-400 font-semibold">{matches.filter((m) => m.probability === "Borderline").length} Borderline</span>
        </div>
      </div>

      {/* ═══ MATCHES CARDS & LIST ═══ */}
      {matches.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-border/60 bg-card/40 space-y-3">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
          <div className="space-y-1">
            <p className="text-base font-bold text-foreground">No Matching Colleges Found</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              No college closing ranks match your criteria. Try adjusting your rank number, raising the annual fee budget, or switching seat types.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {matches.map((item, idx) => {
            const isBookmarked = bookmarkedCodes.has(item.course_code);
            const fee = FEE_BY_CODE.get(item.college_code);

            return (
              <div
                key={item.course_code + item.allotted_category + idx}
                className="p-4 rounded-2xl border border-border/50 bg-card/60 hover:bg-card/90 hover:border-rose-500/30 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground font-semibold">#{idx + 1}</span>
                      <h3 className="text-sm font-bold text-foreground truncate max-w-[340px] sm:max-w-[500px]">
                        {item.college_name}
                      </h3>
                      {getProbBadge(item.probability)}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <Badge variant="outline" className="text-[9px] font-mono border-rose-500/30 text-rose-300">
                        {item.course_code}
                      </Badge>
                      <span>•</span>
                      <span>{item.course_name}</span>
                      <span>•</span>
                      <span className="text-foreground/80">{item.seat_type}</span>
                      {fee && (
                        <>
                          <span>•</span>
                          <span className="text-[11px] text-muted-foreground">{fee.college_type}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bookmark and Fast Action */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(item.course_code)}
                      className={`h-7 w-7 rounded-lg ${isBookmarked ? "text-rose-400" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Bookmark className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Metrics Breakdown Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-background/50 border border-border/30 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">2026 R1 Closing</span>
                    <span className="font-mono font-bold text-rose-400">#{item.closing_rank.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Opening Rank</span>
                    <span className="font-mono font-bold text-foreground">#{item.opening_rank.toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Annual Tuition</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {item.course_fees ? formatFee(item.course_fees) : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Safety Margin</span>
                    <span
                      className={`font-mono font-bold ${
                        item.marginPercent >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {item.marginPercent >= 0 ? `+${item.marginPercent}%` : `${item.marginPercent}%`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

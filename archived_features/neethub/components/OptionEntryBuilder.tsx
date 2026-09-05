import React, { useState, useMemo } from "react";
import {
  ListOrdered,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Copy,
  Check,
  Plus,
  AlertTriangle,
  HelpCircle,
  IndianRupee,
  Shield,
  Target,
  Flame,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MEDICAL_FINAL_CUTOFFS,
  DENTAL_FINAL_CUTOFFS,
  FEE_BY_CODE,
  TOP_CATEGORIES,
  getCategoryLabel,
  formatFee,
  type NeetCutoffEntry,
} from "@/data/neet2026Data";

export interface OptionItem {
  id: string;
  course_code: string;
  college_code: string;
  college_name: string;
  course_name: string;
  seat_type: string;
  allotted_category: string;
  closing_rank: number;
  course_fees: number | null;
  tier: "dream" | "target" | "safe" | "custom";
}

export function OptionEntryBuilder() {
  const [rank, setRank] = useState<number>(45000);
  const [category, setCategory] = useState<string>("GM");
  const [courseType, setCourseType] = useState<"MBBS" | "BDS">("MBBS");
  const [seatTypeFilter, setSeatTypeFilter] = useState<string>("ALL");
  const [maxBudget, setMaxBudget] = useState<number>(0);
  const [listScope, setListScope] = useState<"all" | "curated">("all");
  const [copied, setCopied] = useState<boolean>(false);
  const [manualSelectCode, setManualSelectCode] = useState<string>("");

  // Selected Option List
  const [options, setOptions] = useState<OptionItem[]>([]);

  // Source Cutoffs
  const sourceCutoffs = useMemo(() => {
    return courseType === "MBBS" ? MEDICAL_FINAL_CUTOFFS : DENTAL_FINAL_CUTOFFS;
  }, [courseType]);

  // All filtered unique colleges matching current category and seat type filters
  const allMatchingColleges = useMemo(() => {
    const filtered = sourceCutoffs.filter((c) => {
      if (c.allotted_category !== category) return false;
      if (seatTypeFilter !== "ALL" && c.seat_type !== seatTypeFilter) return false;
      if (maxBudget > 0 && (c.course_fees || 0) > maxBudget) return false;
      return true;
    });

    const seen = new Set<string>();
    return filtered.filter((c) => {
      if (seen.has(c.course_code)) return false;
      seen.add(c.course_code);
      return true;
    });
  }, [sourceCutoffs, category, seatTypeFilter, maxBudget]);

  // Generate Smart Tiered Options based on rank
  const generateSmartList = () => {
    if (!rank || rank <= 0) return;

    // Dream: Closing rank < rank (aspirational, highly competitive)
    const dreamPool = allMatchingColleges
      .filter((c) => c.closing_rank < rank)
      .sort((a, b) => a.closing_rank - b.closing_rank);

    // Target: Closing rank between rank and 1.35 * rank (realistic safety cushion)
    const targetPool = allMatchingColleges
      .filter((c) => c.closing_rank >= rank && c.closing_rank <= rank * 1.35)
      .sort((a, b) => a.closing_rank - b.closing_rank);

    // Safe: Closing rank > 1.35 * rank (high probability safety net)
    const safePool = allMatchingColleges
      .filter((c) => c.closing_rank > rank * 1.35)
      .sort((a, b) => a.closing_rank - b.closing_rank);

    const dream = (listScope === "curated" ? dreamPool.slice(0, 6) : dreamPool).map((c) => ({
      id: `${c.course_code}-${c.allotted_category}-${Math.random()}`,
      course_code: c.course_code,
      college_code: c.college_code,
      college_name: c.college_name,
      course_name: c.course_name,
      seat_type: c.seat_type,
      allotted_category: c.allotted_category,
      closing_rank: c.closing_rank,
      course_fees: c.course_fees,
      tier: "dream" as const,
    }));

    const target = (listScope === "curated" ? targetPool.slice(0, 10) : targetPool).map((c) => ({
      id: `${c.course_code}-${c.allotted_category}-${Math.random()}`,
      course_code: c.course_code,
      college_code: c.college_code,
      college_name: c.college_name,
      course_name: c.course_name,
      seat_type: c.seat_type,
      allotted_category: c.allotted_category,
      closing_rank: c.closing_rank,
      course_fees: c.course_fees,
      tier: "target" as const,
    }));

    const safe = (listScope === "curated" ? safePool.slice(0, 6) : safePool).map((c) => ({
      id: `${c.course_code}-${c.allotted_category}-${Math.random()}`,
      course_code: c.course_code,
      college_code: c.college_code,
      college_name: c.college_name,
      course_name: c.course_name,
      seat_type: c.seat_type,
      allotted_category: c.allotted_category,
      closing_rank: c.closing_rank,
      course_fees: c.course_fees,
      tier: "safe" as const,
    }));

    const combined = [...dream, ...target, ...safe];
    setOptions(combined);
  };

  // Add individual college manually
  const handleAddManualCollege = () => {
    if (!manualSelectCode) return;
    const match = allMatchingColleges.find((c) => c.course_code === manualSelectCode);
    if (!match) return;

    if (options.some((o) => o.course_code === match.course_code)) {
      return;
    }

    let tier: "dream" | "target" | "safe" = "target";
    if (match.closing_rank < rank) tier = "dream";
    else if (match.closing_rank > rank * 1.35) tier = "safe";

    const newItem: OptionItem = {
      id: `${match.course_code}-${match.allotted_category}-${Math.random()}`,
      course_code: match.course_code,
      college_code: match.college_code,
      college_name: match.college_name,
      course_name: match.course_name,
      seat_type: match.seat_type,
      allotted_category: match.allotted_category,
      closing_rank: match.closing_rank,
      course_fees: match.course_fees,
      tier,
    };

    setOptions((prev) => [...prev, newItem]);
    setManualSelectCode("");
  };

  // Add all matching colleges directly
  const handleAddAllColleges = () => {
    const allItems: OptionItem[] = allMatchingColleges.map((c) => {
      let tier: "dream" | "target" | "safe" = "target";
      if (c.closing_rank < rank) tier = "dream";
      else if (c.closing_rank > rank * 1.35) tier = "safe";

      return {
        id: `${c.course_code}-${c.allotted_category}-${Math.random()}`,
        course_code: c.course_code,
        college_code: c.college_code,
        college_name: c.college_name,
        course_name: c.course_name,
        seat_type: c.seat_type,
        allotted_category: c.allotted_category,
        closing_rank: c.closing_rank,
        course_fees: c.course_fees,
        tier,
      };
    });
    setOptions(allItems.sort((a, b) => a.closing_rank - b.closing_rank));
  };

  // Clear list
  const handleClearList = () => {
    setOptions([]);
  };

  // Move Option Up
  const moveUp = (index: number) => {
    if (index === 0) return;
    setOptions((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Move Option Down
  const moveDown = (index: number) => {
    if (index === options.length - 1) return;
    setOptions((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Delete Option
  const removeOption = (id: string) => {
    setOptions((prev) => prev.filter((o) => o.id !== id));
  };

  // Copy as Text
  const copyToClipboard = () => {
    if (options.length === 0) return;
    const text = options
      .map(
        (o, i) =>
          `Priority ${i + 1}: [${o.course_code}] ${o.college_name} (${o.course_name} - ${o.seat_type}) | Closing: #${o.closing_rank.toLocaleString("en-IN")} | Fee: ${o.course_fees ? formatFee(o.course_fees) : "—"}`
      )
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export CSV
  const downloadCSV = () => {
    if (options.length === 0) return;
    const headers = "Priority,College Code,Course Code,College Name,Course Name,Seat Type,Category,2026 R1 Closing Rank,Annual Fee\n";
    const rows = options
      .map(
        (o, i) =>
          `"${i + 1}","${o.college_code}","${o.course_code}","${o.college_name.replace(/"/g, '""')}","${o.course_name}","${o.seat_type}","${o.allotted_category}","${o.closing_rank}","${o.course_fees || 0}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `KEA_NEET_Option_Entry_List_${category}_AIR${rank}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header Card */}
      <div className="p-5 rounded-2xl border border-rose-500/30 bg-card/70 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <ListOrdered className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                KEA Smart Option Entry Builder
              </h2>
              <p className="text-xs text-muted-foreground">
                Build a battle-tested priority list with Dream, Target, and Safe safety tiers.
              </p>
            </div>
          </div>
          <Button
            onClick={generateSmartList}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-9 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Generate Priority List
          </Button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Your NEET AIR</label>
            <Input
              type="number"
              value={rank}
              onChange={(e) => setRank(Number(e.target.value) || 0)}
              placeholder="e.g. 45000"
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TOP_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs">
                    {cat} ({getCategoryLabel(cat)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Course</label>
            <Select value={courseType} onValueChange={(v) => setCourseType(v as any)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MBBS" className="text-xs">MBBS ({MEDICAL_FINAL_CUTOFFS.length > 0 ? "68 Colleges" : ""})</SelectItem>
                <SelectItem value="BDS" className="text-xs">BDS ({DENTAL_FINAL_CUTOFFS.length > 0 ? "39 Colleges" : ""})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Seat Type</label>
            <Select value={seatTypeFilter} onValueChange={setSeatTypeFilter}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Seat Types</SelectItem>
                <SelectItem value="Government" className="text-xs">Government Only</SelectItem>
                <SelectItem value="Private" className="text-xs">Private Seats</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">Max Fee</label>
            <Select value={String(maxBudget)} onValueChange={(v) => setMaxBudget(Number(v))}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0" className="text-xs">No Fee Limit</SelectItem>
                <SelectItem value="70000" className="text-xs">≤ ₹70K (Govt)</SelectItem>
                <SelectItem value="160000" className="text-xs">≤ ₹1.6L (Govt Quota)</SelectItem>
                <SelectItem value="1300000" className="text-xs">≤ ₹13L (Private)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1 col-span-2 sm:col-span-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">List Depth</label>
            <Select value={listScope} onValueChange={(v: any) => setListScope(v)}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Matching ({allMatchingColleges.length} Total)</SelectItem>
                <SelectItem value="curated" className="text-xs">Curated Top 20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Manual College Adder and Database Counter */}
        <div className="pt-2 border-t border-border/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{allMatchingColleges.length}</span> matching {courseType} colleges in database for {category}
          </div>

          <div className="flex items-center gap-2">
            <Select value={manualSelectCode} onValueChange={setManualSelectCode}>
              <SelectTrigger className="h-8 text-xs min-w-[220px] max-w-[320px] truncate">
                <SelectValue placeholder="Add specific college..." />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {allMatchingColleges.map((c) => {
                  const alreadyAdded = options.some((o) => o.course_code === c.course_code);
                  return (
                    <SelectItem
                      key={c.course_code}
                      value={c.course_code}
                      disabled={alreadyAdded}
                      className="text-xs"
                    >
                      [{c.course_code}] {c.college_name.split(",")[0]} (Close: #{c.closing_rank.toLocaleString("en-IN")}) {alreadyAdded ? "✓ Added" : ""}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <Button
              type="button"
              size="sm"
              onClick={handleAddManualCollege}
              disabled={!manualSelectCode}
              variant="outline"
              className="h-8 text-xs border-rose-500/30 hover:bg-rose-500/10 text-rose-300"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* KEA Golden Rule Warning Banner */}
      <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-2.5 text-xs text-amber-200/90">
        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-amber-300">KEA Option Entry Golden Rule:</span>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Always place your most desired colleges at the very top (Priority 1, 2, 3), regardless of cutoff. In KEA algorithm, if you get allotted Option #4, all options below it (#5, #6...) are permanently destroyed for subsequent rounds!
          </p>
        </div>
      </div>

      {/* Option List Display */}
      {options.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-foreground">
                Your Option Entry Priority List ({options.length} colleges)
              </span>
              <div className="hidden sm:flex items-center gap-2 text-[10px]">
                <Badge className="bg-rose-500/15 text-rose-300 border-rose-500/30">
                  <Flame className="h-2.5 w-2.5 mr-1" /> Dream ({options.filter((o) => o.tier === "dream").length})
                </Badge>
                <Badge className="bg-amber-500/15 text-amber-300 border-amber-500/30">
                  <Target className="h-2.5 w-2.5 mr-1" /> Target ({options.filter((o) => o.tier === "target").length})
                </Badge>
                <Badge className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
                  <Shield className="h-2.5 w-2.5 mr-1" /> Safe ({options.filter((o) => o.tier === "safe").length})
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {options.length < allMatchingColleges.length && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddAllColleges}
                  className="h-7 text-xs border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add All ({allMatchingColleges.length})
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="h-7 text-xs border-border/60"
              >
                {copied ? <Check className="h-3 w-3 mr-1 text-emerald-400" /> : <Copy className="h-3 w-3 mr-1" />}
                {copied ? "Copied" : "Copy Text"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadCSV}
                className="h-7 text-xs border-border/60"
              >
                <Download className="h-3 w-3 mr-1" />
                Export CSV
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearList}
                className="h-7 text-xs text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 px-2"
                title="Clear entire priority list"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-2">
            {options.map((opt, idx) => {
              const isDream = opt.tier === "dream";
              const isTarget = opt.tier === "target";
              const isSafe = opt.tier === "safe";

              return (
                <div
                  key={opt.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border transition-all ${
                    isDream
                      ? "border-rose-500/30 bg-rose-950/15 hover:bg-rose-950/25"
                      : isTarget
                      ? "border-amber-500/30 bg-amber-950/15 hover:bg-amber-950/25"
                      : "border-emerald-500/30 bg-emerald-950/15 hover:bg-emerald-950/25"
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                    {/* Order Number Badge */}
                    <div className="flex flex-col items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-background/80 border border-border/60 shrink-0 mt-0.5 sm:mt-0">
                      <span className="text-[10px] text-muted-foreground font-semibold">#{idx + 1}</span>
                    </div>

                    {/* College & Course Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-foreground truncate max-w-[240px] sm:max-w-[450px]">
                          {opt.college_name}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] h-4 px-1 font-mono ${
                            isDream
                              ? "border-rose-400 text-rose-300"
                              : isTarget
                              ? "border-amber-400 text-amber-300"
                              : "border-emerald-400 text-emerald-300"
                          }`}
                        >
                          {opt.tier.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground flex-wrap">
                        <span className="font-mono text-foreground/80 font-medium">[{opt.course_code}]</span>
                        <span>•</span>
                        <span>{opt.course_name}</span>
                        <span>•</span>
                        <span className="text-foreground/70">{opt.seat_type}</span>
                      </div>
                    </div>
                  </div>

                  {/* Closing Rank, Fee & Action Buttons */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/30">
                    <div className="text-left sm:text-right space-y-0.5">
                      <p className="text-xs font-mono font-bold text-foreground">
                        Close: <span className="text-rose-400">#{opt.closing_rank.toLocaleString("en-IN")}</span>
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {opt.course_fees ? formatFee(opt.course_fees) + "/yr" : "—"}
                      </p>
                    </div>

                    {/* Actions (Move Up, Down, Delete) */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={idx === 0}
                        onClick={() => moveUp(idx)}
                        className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={idx === options.length - 1}
                        onClick={() => moveDown(idx)}
                        className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(opt.id)}
                        className="h-7 w-7 rounded-md text-muted-foreground hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl border border-dashed border-border/60 bg-card/30 space-y-4">
          <ListOrdered className="h-8 w-8 text-rose-400 mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">No Option Entry List Generated Yet</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Found <strong className="text-foreground">{allMatchingColleges.length}</strong> matching {courseType} colleges in Karnataka for {category}. Generate a tiered sequence or load all colleges directly.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-1">
            <Button
              onClick={generateSmartList}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs h-9 shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Generate Priority List ({listScope === "all" ? `All ${allMatchingColleges.length}` : "Top 20"})
            </Button>
            <Button
              variant="outline"
              onClick={handleAddAllColleges}
              className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs h-9"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Load All {allMatchingColleges.length} Colleges
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

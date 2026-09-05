import React, { useState, useMemo } from "react";
import {
  Scale,
  Building2,
  CheckCircle2,
  X,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  IndianRupee,
  GraduationCap,
  Sparkles,
} from "lucide-react";
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
  MEDICAL_MOCK_CUTOFFS,
  DENTAL_MOCK_CUTOFFS,
  FEE_STRUCTURE,
  FEE_BY_CODE,
  TOP_CATEGORIES,
  getCategoryLabel,
  formatFee,
  type NeetCutoffEntry,
  type NeetFeeEntry,
} from "@/data/neet2026Data";

export function CollegeComparator() {
  const [courseType, setCourseType] = useState<"MBBS" | "BDS">("MBBS");
  const [college1Code, setCollege1Code] = useState<string>("M001"); // Bangalore Medical College
  const [college2Code, setCollege2Code] = useState<string>("M021"); // Mysore Medical College
  const [college3Code, setCollege3Code] = useState<string>("M004"); // MS Ramaiah

  // Colleges list for dropdown
  const collegesList = useMemo(() => {
    const feeColleges = FEE_STRUCTURE.filter(
      (f) => f.course === courseType
    ).sort((a, b) => a.college_name.localeCompare(b.college_name));
    return feeColleges;
  }, [courseType]);

  // Selected Colleges Data
  const getCollegeData = (code: string) => {
    if (!code) return null;
    const fee = FEE_BY_CODE.get(code);
    const cutoffsSrc = courseType === "MBBS" ? MEDICAL_FINAL_CUTOFFS : DENTAL_FINAL_CUTOFFS;
    const mockSrc = courseType === "MBBS" ? MEDICAL_MOCK_CUTOFFS : DENTAL_MOCK_CUTOFFS;

    const cutoffs = cutoffsSrc.filter((c) => c.college_code === code);
    const mockCutoffs = mockSrc.filter((c) => c.college_code === code);

    // Map category to closing rank
    const categoryMap: Record<string, { open: number; close: number; seats: number }> = {};
    for (const c of cutoffs) {
      categoryMap[c.allotted_category] = {
        open: c.opening_rank,
        close: c.closing_rank,
        seats: c.total_allotted,
      };
    }

    const mockMap: Record<string, number> = {};
    for (const m of mockCutoffs) {
      mockMap[m.allotted_category] = m.closing_rank;
    }

    const totalSeats = cutoffs.reduce((acc, curr) => acc + curr.total_allotted, 0);

    return {
      fee,
      cutoffs,
      categoryMap,
      mockMap,
      totalSeats,
      name: fee ? fee.college_name : cutoffs[0]?.college_name || code,
      type: fee ? fee.college_type : cutoffs[0]?.seat_type || "Unknown",
    };
  };

  const col1 = useMemo(() => getCollegeData(college1Code), [college1Code, courseType]);
  const col2 = useMemo(() => getCollegeData(college2Code), [college2Code, courseType]);
  const col3 = useMemo(() => getCollegeData(college3Code), [college3Code, courseType]);

  const comparedColleges = [col1, col2, col3].filter(Boolean);

  const compareCategories = ["GM", "GMR", "GMH", "2AG", "2BG", "3AG", "3BG", "S1G", "STG", "OPN", "GMP"];

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="p-5 rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">
                Side-by-Side Medical College Comparator
              </h2>
              <p className="text-xs text-muted-foreground">
                Compare fees, government quotas, category cutoffs, and mock shifts across 2 or 3 colleges.
              </p>
            </div>
          </div>

          <Select value={courseType} onValueChange={(v) => setCourseType(v as any)}>
            <SelectTrigger className="h-8 text-xs w-28"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MBBS" className="text-xs">MBBS</SelectItem>
              <SelectItem value="BDS" className="text-xs">BDS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 3 Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">College 1</label>
            <Select value={college1Code} onValueChange={setCollege1Code}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-60">
                {collegesList.map((c) => (
                  <SelectItem key={c.college_code} value={c.college_code} className="text-xs truncate">
                    [{c.college_code}] {c.college_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">College 2</label>
            <Select value={college2Code} onValueChange={setCollege2Code}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-60">
                {collegesList.map((c) => (
                  <SelectItem key={c.college_code} value={c.college_code} className="text-xs truncate">
                    [{c.college_code}] {c.college_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-semibold text-muted-foreground">College 3 (Optional)</label>
            <Select value={college3Code} onValueChange={setCollege3Code}>
              <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent className="max-h-60">
                {collegesList.map((c) => (
                  <SelectItem key={c.college_code} value={c.college_code} className="text-xs truncate">
                    [{c.college_code}] {c.college_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            {/* College Names Header */}
            <thead className="bg-muted/30 border-b border-border/40">
              <tr>
                <th className="p-3 text-left w-48 text-[11px] font-semibold text-muted-foreground uppercase">
                  Metric / Attribute
                </th>
                {comparedColleges.map((c, i) => (
                  <th key={i} className="p-3 text-left min-w-[220px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[9px] font-mono border-rose-500/40 text-rose-300">
                          {c?.fee?.college_code || `COL-${i + 1}`}
                        </Badge>
                        <Badge className="text-[9px] bg-background/80 text-foreground border-border/50">
                          {c?.type}
                        </Badge>
                      </div>
                      <p className="font-bold text-xs text-foreground line-clamp-2">{c?.name}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-border/30">
              {/* SECTION: FEES */}
              <tr className="bg-muted/15 font-semibold text-[10px] text-rose-300 uppercase tracking-wider">
                <td colSpan={comparedColleges.length + 1} className="px-3 py-1.5">
                  Fee Structure (Annual Tuition)
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-muted-foreground">Govt Quota Fee</td>
                {comparedColleges.map((c, i) => (
                  <td key={i} className="p-3 font-mono font-bold text-emerald-400">
                    {c?.fee?.govt_fees ? formatFee(c.fee.govt_fees) : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-muted-foreground">Private Quota Fee</td>
                {comparedColleges.map((c, i) => (
                  <td key={i} className="p-3 font-mono text-amber-400">
                    {c?.fee?.private_fees ? formatFee(c.fee.private_fees) : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-muted-foreground">Management / NRI Fee</td>
                {comparedColleges.map((c, i) => (
                  <td key={i} className="p-3 font-mono text-rose-400">
                    {c?.fee?.management_fees ? formatFee(c.fee.management_fees) : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-3 font-medium text-muted-foreground">5-Year Degree Cost (Govt Seat)</td>
                {comparedColleges.map((c, i) => (
                  <td key={i} className="p-3 font-mono font-bold text-foreground">
                    {c?.fee?.govt_fees ? formatFee(c.fee.govt_fees * 5) : "—"}
                  </td>
                ))}
              </tr>

              {/* SECTION: SEATS & INTAKE */}
              <tr className="bg-muted/15 font-semibold text-[10px] text-rose-300 uppercase tracking-wider">
                <td colSpan={comparedColleges.length + 1} className="px-3 py-1.5">
                  Allotted Seats in Round 1
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium text-muted-foreground">Round 1 Allotted Seats</td>
                {comparedColleges.map((c, i) => (
                  <td key={i} className="p-3 font-mono font-bold text-foreground">
                    {c?.totalSeats || 0} seats
                  </td>
                ))}
              </tr>

              {/* SECTION: CATEGORY CLOSING RANKS */}
              <tr className="bg-muted/15 font-semibold text-[10px] text-rose-300 uppercase tracking-wider">
                <td colSpan={comparedColleges.length + 1} className="px-3 py-1.5">
                  Round 1 Final Closing Ranks (AIR)
                </td>
              </tr>
              {compareCategories.map((cat) => (
                <tr key={cat} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-medium text-foreground">
                    <span className="font-mono font-bold text-rose-400">{cat}</span>
                    <span className="text-[10px] text-muted-foreground ml-1.5">({getCategoryLabel(cat)})</span>
                  </td>
                  {comparedColleges.map((c, i) => {
                    const finalClose = c?.categoryMap[cat]?.close;
                    const mockClose = c?.mockMap[cat];
                    const shift = finalClose && mockClose ? finalClose - mockClose : null;

                    return (
                      <td key={i} className="p-3 font-mono">
                        {finalClose ? (
                          <div>
                            <span className="font-bold text-rose-400">#{finalClose.toLocaleString("en-IN")}</span>
                            {shift !== null && (
                              <span
                                className={`text-[10px] ml-1.5 ${
                                  shift > 0 ? "text-amber-400" : shift < 0 ? "text-emerald-400" : "text-muted-foreground"
                                }`}
                              >
                                ({shift > 0 ? `+${shift}` : shift})
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

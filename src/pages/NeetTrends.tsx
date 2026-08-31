import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Target,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  MEDICAL_MOCK_CUTOFFS,
  DENTAL_FINAL_CUTOFFS,
  DENTAL_MOCK_CUTOFFS,
  TOP_CATEGORIES,
  type NeetCutoffEntry,
} from "@/data/neet2026Data";

export default function NeetTrendsPage() {
  const { setExamMode } = useExamMode();
  const [courseType, setCourseType] = useState<"medical" | "dental">("medical");
  const [categoryFilter, setCategoryFilter] = useState<string>("GM");
  const [seatFilter, setSeatFilter] = useState<string>("Government");

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  const comparisons = useMemo(() => {
    const mockSrc = courseType === "medical" ? MEDICAL_MOCK_CUTOFFS : DENTAL_MOCK_CUTOFFS;
    const finalSrc = courseType === "medical" ? MEDICAL_FINAL_CUTOFFS : DENTAL_FINAL_CUTOFFS;

    const mockMap = new Map<string, NeetCutoffEntry>();
    for (const c of mockSrc) {
      const key = c.course_code + "|" + c.allotted_category;
      mockMap.set(key, c);
    }

    const results: { final: NeetCutoffEntry; mock: NeetCutoffEntry | null; shift: number | null }[] = [];
    for (const f of finalSrc) {
      if (categoryFilter !== "ALL" && f.allotted_category !== categoryFilter) continue;
      if (seatFilter !== "ALL" && f.seat_type !== seatFilter) continue;

      const key = f.course_code + "|" + f.allotted_category;
      const m = mockMap.get(key) || null;
      const shift = m ? f.closing_rank - m.closing_rank : null;
      results.push({ final: f, mock: m, shift });
    }

    return results.sort((a, b) => a.final.closing_rank - b.final.closing_rank);
  }, [courseType, categoryFilter, seatFilter]);

  const stats = useMemo(() => {
    const shifts = comparisons.filter((c) => c.shift !== null).map((c) => c.shift!);
    if (shifts.length === 0) return null;
    return {
      avg: Math.round(shifts.reduce((a, b) => a + b, 0) / shifts.length),
      max: Math.max(...shifts),
      min: Math.min(...shifts),
      relaxed: shifts.filter((s) => s > 0).length,
      tightened: shifts.filter((s) => s < 0).length,
    };
  }, [comparisons]);

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>NEET Mock vs Final Cutoff Trends 2026 | Shift Analyzer | NEETCoded</title>
        <meta
          name="description"
          content="Analyze closing rank drift and volatility from KEA Mock Allotment to Round 1 Final across Karnataka Medical and Dental Colleges."
        />
      </Helmet>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-950/40 via-card to-background p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-semibold uppercase tracking-wider">
              <TrendingUp className="h-3.5 w-3.5" />
              Round Volatility & Drift Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-brand text-foreground">
              Mock vs Final <span className="text-amber-400">Cutoff Trends</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Track rank movements between KEA Mock Allotment and Round 1 Final to understand seat redistribution and predict Round 2 trajectory.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" className="border-border/60 text-xs h-8">
              <Link to="/neet-explorer">
                <BarChart3 className="mr-1.5 h-3.5 w-3.5 text-blue-400" />
                Cutoff Explorer
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-border/60 text-xs h-8">
              <Link to="/neet-predictor">
                <Target className="mr-1.5 h-3.5 w-3.5 text-rose-400" />
                Predictor
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistical Overview Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Average Shift</p>
            <p
              className={`text-2xl font-extrabold font-mono ${
                stats.avg > 0 ? "text-amber-400" : stats.avg < 0 ? "text-emerald-400" : "text-foreground"
              }`}
            >
              {stats.avg > 0 ? "+" : ""}
              {stats.avg.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Relaxed (Easier)</p>
            <p className="text-2xl font-extrabold font-mono text-amber-400">{stats.relaxed}</p>
          </div>
          <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Tightened (Harder)</p>
            <p className="text-2xl font-extrabold font-mono text-emerald-400">{stats.tightened}</p>
          </div>
          <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Max Relaxed</p>
            <p className="text-2xl font-extrabold font-mono text-rose-400">+{stats.max.toLocaleString("en-IN")}</p>
          </div>
          <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">Max Tightened</p>
            <p className="text-2xl font-extrabold font-mono text-emerald-400">{stats.min.toLocaleString("en-IN")}</p>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl border border-border/60 bg-card/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Select value={courseType} onValueChange={(v) => setCourseType(v as any)}>
              <SelectTrigger className="h-8 text-xs w-32 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="medical" className="text-xs">Medical (MBBS)</SelectItem>
                <SelectItem value="dental" className="text-xs">Dental (BDS)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 text-xs w-32 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Categories</SelectItem>
                {TOP_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={seatFilter} onValueChange={setSeatFilter}>
              <SelectTrigger className="h-8 text-xs w-36 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL" className="text-xs">All Seat Types</SelectItem>
                <SelectItem value="Government" className="text-xs">Government Only</SelectItem>
                <SelectItem value="Private" className="text-xs">Private Seats</SelectItem>
                <SelectItem value="NRI" className="text-xs">NRI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <span className="text-xs text-muted-foreground font-mono">
            {comparisons.length} colleges evaluated
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[700px]">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 sticky top-0 z-10">
              <tr className="text-left text-[10px] uppercase text-muted-foreground font-semibold">
                <th className="px-3 py-2.5">#</th>
                <th className="px-3 py-2.5">College Name</th>
                <th className="px-3 py-2.5">Code</th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5 text-right">Mock Close</th>
                <th className="px-3 py-2.5 text-right">Final Close</th>
                <th className="px-3 py-2.5 text-right">Rank Drift</th>
                <th className="px-3 py-2.5 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {comparisons.map((row, i) => (
                <tr key={row.final.course_code + row.final.allotted_category + i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2 max-w-[260px] truncate font-medium text-foreground">{row.final.college_name}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{row.final.course_code}</td>
                  <td className="px-3 py-2 font-mono">{row.final.allotted_category}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">
                    {row.mock ? row.mock.closing_rank.toLocaleString("en-IN") : "—"}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-rose-400">
                    {row.final.closing_rank.toLocaleString("en-IN")}
                  </td>
                  <td
                    className={`px-3 py-2 text-right font-mono font-bold ${
                      row.shift === null
                        ? "text-muted-foreground"
                        : row.shift > 0
                        ? "text-amber-400"
                        : row.shift < 0
                        ? "text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {row.shift === null ? "—" : (row.shift > 0 ? "+" : "") + row.shift.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {row.shift === null ? (
                      <Minus className="h-3.5 w-3.5 text-muted-foreground inline" />
                    ) : row.shift > 0 ? (
                      <span title="Cutoff relaxed (easier)">
                        <TrendingDown className="h-3.5 w-3.5 text-amber-400 inline" />
                      </span>
                    ) : row.shift < 0 ? (
                      <span title="Cutoff tightened (harder)">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400 inline" />
                      </span>
                    ) : (
                      <Minus className="h-3.5 w-3.5 text-muted-foreground inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

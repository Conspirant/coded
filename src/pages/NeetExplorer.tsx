import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Search,
  Building2,
  Stethoscope,
  Filter,
  MapPin,
  Bed,
  GraduationCap,
  Sparkles,
  Download,
  IndianRupee,
  ChevronRight,
  ShieldCheck,
  Award,
  BarChart3,
  Target,
  Scale,
  ListOrdered,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useExamMode } from "@/contexts/ExamModeContext";
import {
  MEDICAL_FINAL_CUTOFFS,
  DENTAL_FINAL_CUTOFFS,
  TOP_CATEGORIES,
  getCategoryLabel,
  formatFee,
  type NeetCutoffEntry,
} from "@/data/neet2026Data";

export default function NeetExplorer() {
  const { setExamMode } = useExamMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [courseType, setCourseType] = useState<"MBBS" | "BDS">("MBBS");
  const [seatFilter, setSeatFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("GM");
  const [sortBy, setSortBy] = useState<"closing" | "opening" | "seats">("closing");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  const source = courseType === "MBBS" ? MEDICAL_FINAL_CUTOFFS : DENTAL_FINAL_CUTOFFS;

  const filtered = useMemo(() => {
    return source
      .filter((c) => {
        if (categoryFilter !== "ALL" && c.allotted_category !== categoryFilter) return false;
        if (seatFilter !== "ALL" && c.seat_type !== seatFilter) return false;
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
      })
      .sort((a, b) => {
        const mul = sortDir === "asc" ? 1 : -1;
        if (sortBy === "closing") return (a.closing_rank - b.closing_rank) * mul;
        if (sortBy === "opening") return (a.opening_rank - b.opening_rank) * mul;
        return (a.total_allotted - b.total_allotted) * mul;
      });
  }, [source, searchQuery, seatFilter, categoryFilter, sortBy, sortDir]);

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = "College Code,Course Code,College Name,Course Name,Seat Type,Category,Opening Rank,Closing Rank,Seats,Annual Fee\n";
    const rows = filtered
      .map(
        (c) =>
          `"${c.college_code}","${c.course_code}","${c.college_name.replace(/"/g, '""')}","${c.course_name}","${c.seat_type}","${c.allotted_category}","${c.opening_rank}","${c.closing_rank}","${c.total_allotted}","${c.course_fees || 0}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Karnataka_NEET_Cutoffs_${courseType}_${categoryFilter}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Karnataka NEET Medical & Dental Cutoffs 2026 | MBBS/BDS Explorer | NEETCoded</title>
        <meta
          name="description"
          content="Explore official Karnataka KEA Round 1 closing ranks across 5,336 cutoff records for Government, Private, and Deemed colleges across GM, 2A, 2B, 3A, 3B, SC, ST, and GMP quotas."
        />
      </Helmet>

      {/* Hero Banner */}
      <div className="p-6 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm space-y-4">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Karnataka UG-NEET 2026 Admissions Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Medical Cutoffs <span className="text-foreground font-black">Archive & Explorer</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">
              Official KEA Round 1 verified database across 5,336 cutoff records for 107 MBBS and BDS institutes. Filter by college, course, quota, and category.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCSV}
              className="border-border/60 text-xs h-9 text-foreground"
            >
              <Download className="mr-1.5 h-4 w-4 text-muted-foreground" />
              Export CSV
            </Button>
            <Button asChild variant="outline" size="sm" className="border-border/60 text-xs h-9 text-foreground">
              <Link to="/neet-predictor">
                <Target className="mr-1.5 h-4 w-4 text-rose-500" />
                Predictor
              </Link>
            </Button>
          </div>
        </header>
      </div>

      {/* Filter Control Toolbar */}
      <div className="p-4 rounded-2xl border border-border/60 bg-card/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Search & Filter Cutoffs
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {filtered.length.toLocaleString()} matching records
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <Input
            placeholder="Search college / code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs bg-background col-span-2 sm:col-span-1"
          />
          <Select value={courseType} onValueChange={(v) => setCourseType(v as any)}>
            <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MBBS" className="text-xs">MBBS (Medical)</SelectItem>
              <SelectItem value="BDS" className="text-xs">BDS (Dental)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Categories</SelectItem>
              {TOP_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat} className="text-xs">
                  {cat} — {getCategoryLabel(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={seatFilter} onValueChange={setSeatFilter}>
            <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Seat Types</SelectItem>
              <SelectItem value="Government" className="text-xs">Government Only</SelectItem>
              <SelectItem value="Private" className="text-xs">Private Seats</SelectItem>
              <SelectItem value="NRI" className="text-xs">NRI</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={`${sortBy}-${sortDir}`}
            onValueChange={(v) => {
              const [s, d] = v.split("-");
              setSortBy(s as any);
              setSortDir(d as any);
            }}
          >
            <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="closing-asc" className="text-xs">Closing Rank ↑</SelectItem>
              <SelectItem value="closing-desc" className="text-xs">Closing Rank ↓</SelectItem>
              <SelectItem value="seats-desc" className="text-xs">Most Seats</SelectItem>
              <SelectItem value="opening-asc" className="text-xs">Opening Rank ↑</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[700px]">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 sticky top-0 z-10">
              <tr className="text-left text-[10px] uppercase text-muted-foreground font-semibold">
                <th className="px-3 py-2.5">#</th>
                <th className="px-3 py-2.5">College Name</th>
                <th className="px-3 py-2.5">Code</th>
                <th className="px-3 py-2.5">Seat</th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5 text-right">Opening Rank</th>
                <th className="px-3 py-2.5 text-right">Closing Rank</th>
                <th className="px-3 py-2.5 text-right">Seats Allotted</th>
                <th className="px-3 py-2.5 text-right">Annual Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.slice(0, 300).map((c, i) => (
                <tr key={c.course_code + c.allotted_category + i} className="hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2 max-w-[260px] truncate font-medium text-foreground">{c.college_name}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{c.course_code}</td>
                  <td className="px-3 py-2">
                    <Badge
                      variant="outline"
                      className={`text-[9px] h-4 px-1 ${
                        c.seat_type === "Government"
                          ? "border-emerald-500/40 text-emerald-400"
                          : c.seat_type === "Private"
                          ? "border-amber-500/40 text-amber-400"
                          : "border-purple-500/40 text-purple-400"
                      }`}
                    >
                      {c.seat_type === "Government" ? "GOVT" : c.seat_type === "Private" ? "PVT" : c.seat_type}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 font-mono font-semibold">{c.allotted_category}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">{c.opening_rank.toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-rose-400">
                    {c.closing_rank.toLocaleString("en-IN")}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">{c.total_allotted}</td>
                  <td className="px-3 py-2 text-right font-mono text-emerald-400">
                    {c.course_fees ? formatFee(c.course_fees) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length > 300 && (
          <div className="px-3 py-2 text-[11px] text-muted-foreground bg-muted/20 text-center">
            Showing first 300 of {filtered.length.toLocaleString()} matching records. Narrow your search query to see specific colleges.
          </div>
        )}
      </div>
    </div>
  );
}

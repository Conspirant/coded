import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  IndianRupee,
  Search,
  SlidersHorizontal,
  Building2,
  GraduationCap,
  Sparkles,
  Download,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Target,
  FileCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { useExamMode } from "@/contexts/ExamModeContext";
import {
  FEE_STRUCTURE,
  formatFee,
  type NeetFeeEntry,
} from "@/data/neet2026Data";

export default function NeetFeeCalculator() {
  const { setExamMode } = useExamMode();
  const [courseFilter, setCourseFilter] = useState<"ALL" | "MBBS" | "BDS">("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"govt" | "private" | "management" | "nri">("govt");
  const [includeHostel, setIncludeHostel] = useState<boolean>(true);
  const [annualHostelCost, setAnnualHostelCost] = useState<number>(120000);

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  const filtered = useMemo(() => {
    return FEE_STRUCTURE.filter((f) => {
      if (courseFilter !== "ALL" && f.course !== courseFilter) return false;
      if (typeFilter !== "ALL" && f.college_type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!f.college_name.toLowerCase().includes(q) && !f.college_code.toLowerCase().includes(q)) return false;
      }
      return true;
    }).sort((a, b) => {
      const key =
        sortBy === "govt"
          ? "govt_fees"
          : sortBy === "private"
          ? "private_fees"
          : sortBy === "management"
          ? "management_fees"
          : "nri_fees";
      return (a[key] || 0) - (b[key] || 0);
    });
  }, [courseFilter, typeFilter, searchQuery, sortBy]);

  const stats = useMemo(() => {
    const mbbs = FEE_STRUCTURE.filter((f) => f.course === "MBBS");
    const bds = FEE_STRUCTURE.filter((f) => f.course === "BDS");
    const govtMbbs = mbbs.filter((f) => f.college_type === "Government");

    return {
      mbbsCount: mbbs.length,
      bdsCount: bds.length,
      lowestGovt: govtMbbs.length > 0 ? Math.min(...govtMbbs.map((f) => f.govt_fees)) : 64350,
      lowestPvt: Math.min(...mbbs.filter((f) => f.private_fees > 0).map((f) => f.private_fees)),
    };
  }, []);

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = "College Code,College Name,Type,Course,Govt Seat Fee,Private Seat Fee,Management Fee,NRI Fee,5-Year Govt Cost,5-Year Pvt Cost\n";
    const rows = filtered
      .map(
        (f) =>
          `"${f.college_code}","${f.college_name.replace(/"/g, '""')}","${f.college_type}","${f.course}","${f.govt_fees}","${f.private_fees}","${f.management_fees}","${f.nri_fees}","${f.govt_fees * 5}","${f.private_fees * 5}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Karnataka_Medical_Fee_Structure_107_Colleges.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Karnataka Medical & Dental Fee Structure 2026 | 107 Colleges | NEETCoded</title>
        <meta
          name="description"
          content="Complete verified fee structure for 68 MBBS and 39 BDS colleges in Karnataka. Calculate 5-year total degree costs across Govt, Private, Management, and NRI quotas."
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
              Medical & Dental <span className="text-foreground font-black">Fee Structure & 5-Year Costs</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">
              Official KEA verified fee schedules across 107 colleges (68 MBBS + 39 BDS). Calculate itemized annual tuition and total 5-year degree expenses across Govt, Private, and Management quotas.
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

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">MBBS Colleges</p>
          <p className="text-2xl font-extrabold font-mono text-foreground">{stats.mbbsCount}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">BDS Colleges</p>
          <p className="text-2xl font-extrabold font-mono text-foreground">{stats.bdsCount}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Lowest Govt MBBS Fee</p>
          <p className="text-2xl font-extrabold font-mono text-emerald-400">{formatFee(stats.lowestGovt)}</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">5-Yr Total (Govt)</p>
          <p className="text-2xl font-extrabold font-mono text-foreground">{formatFee(stats.lowestGovt * 5)}</p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="p-4 rounded-2xl border border-border/60 bg-card/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground">
            Filter by Course, College Type & Quota Sort
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {filtered.length} colleges matching
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Input
            placeholder="Search college name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs bg-background col-span-2 sm:col-span-1"
          />
          <Select value={courseFilter} onValueChange={(v) => setCourseFilter(v as any)}>
            <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All Courses (107)</SelectItem>
              <SelectItem value="MBBS" className="text-xs">MBBS (68 Colleges)</SelectItem>
              <SelectItem value="BDS" className="text-xs">BDS (39 Colleges)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">All College Types</SelectItem>
              <SelectItem value="Government" className="text-xs">Government</SelectItem>
              <SelectItem value="Minority (L,R)" className="text-xs">Minority</SelectItem>
              <SelectItem value="Private UnAided" className="text-xs">Private UnAided</SelectItem>
              <SelectItem value="Private/Deemed University" className="text-xs">Deemed Univ</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="govt" className="text-xs">Sort: Govt Fee (Lowest)</SelectItem>
              <SelectItem value="private" className="text-xs">Sort: Private Fee (Lowest)</SelectItem>
              <SelectItem value="management" className="text-xs">Sort: Mgmt Fee</SelectItem>
              <SelectItem value="nri" className="text-xs">Sort: NRI Fee</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Full Fee Table */}
      <div className="rounded-2xl border border-border/60 bg-card/40 overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[700px]">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 sticky top-0 z-10">
              <tr className="text-left text-[10px] uppercase text-muted-foreground font-semibold">
                <th className="px-3 py-2.5">#</th>
                <th className="px-3 py-2.5">Code</th>
                <th className="px-3 py-2.5">College Name</th>
                <th className="px-3 py-2.5">Type</th>
                <th className="px-3 py-2.5">Course</th>
                <th className="px-3 py-2.5 text-right">Govt Quota Fee</th>
                <th className="px-3 py-2.5 text-right">Private Quota Fee</th>
                <th className="px-3 py-2.5 text-right">Mgmt Fee</th>
                <th className="px-3 py-2.5 text-right">NRI Fee</th>
                <th className="px-3 py-2.5 text-right">5-Year Govt Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((f, i) => (
                <tr key={f.college_code + f.course} className="hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2 font-mono text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2 font-mono font-semibold text-foreground">{f.college_code}</td>
                  <td className="px-3 py-2 max-w-[240px] truncate font-medium text-foreground">{f.college_name}</td>
                  <td className="px-3 py-2">
                    <Badge
                      variant="outline"
                      className={`text-[9px] h-4 px-1 ${
                        f.college_type === "Government"
                          ? "border-emerald-500/40 text-emerald-400"
                          : f.college_type.includes("Minority")
                          ? "border-blue-500/40 text-blue-400"
                          : f.college_type.includes("Deemed")
                          ? "border-purple-500/40 text-purple-400"
                          : "border-amber-500/40 text-amber-400"
                      }`}
                    >
                      {f.college_type === "Government"
                        ? "GOVT"
                        : f.college_type.includes("Minority")
                        ? "MIN"
                        : f.college_type.includes("Deemed")
                        ? "DEEMED"
                        : "PVT"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 font-mono">{f.course}</td>
                  <td className="px-3 py-2 text-right font-mono text-emerald-400 font-bold">
                    {formatFee(f.govt_fees)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-amber-400">{formatFee(f.private_fees)}</td>
                  <td className="px-3 py-2 text-right font-mono text-rose-400">{formatFee(f.management_fees)}</td>
                  <td className="px-3 py-2 text-right font-mono text-purple-400">{formatFee(f.nri_fees)}</td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-foreground">
                    {f.govt_fees > 0 ? formatFee(f.govt_fees * 5) : "—"}
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

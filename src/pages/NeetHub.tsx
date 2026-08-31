import React, { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Search,
  Target,
  ListOrdered,
  Scale,
  TrendingUp,
  IndianRupee,
  ShieldCheck,
  Grid3X3,
  Building2,
  ChevronRight,
  HelpCircle,
  BarChart3,
  MapPin,
  FileSpreadsheet,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExamMode } from "@/contexts/ExamModeContext";
import { formatFee } from "@/data/neet2026Data";

const PREMIER_COLLEGES = [
  {
    code: "M001",
    name: "Bangalore Medical College and Research Institute (BMCRI)",
    location: "Bengaluru Urban",
    type: "Government",
    beds: "2,800+",
    seats: 250,
    gmCutoff: 2655,
    govtFee: 64350,
  },
  {
    code: "M021",
    name: "Mysore Medical College and Research Institute (MMCRI)",
    location: "Mysuru",
    type: "Government",
    beds: "1,800+",
    seats: 150,
    gmCutoff: 6539,
    govtFee: 64350,
  },
  {
    code: "M082",
    name: "Shri Atal Bihari Vajpayee IMS (SABVIMS / Bowring)",
    location: "Bengaluru Urban",
    type: "Government",
    beds: "1,200+",
    seats: 150,
    gmCutoff: 8022,
    govtFee: 64350,
  },
  {
    code: "M051",
    name: "Kasturba Medical College (KMC)",
    location: "Mangaluru",
    type: "Private / Deemed",
    beds: "1,500+",
    seats: 250,
    gmCutoff: 9426,
    govtFee: 153571,
  },
  {
    code: "M066",
    name: "ESI Post Graduate Institute of Medical Sciences",
    location: "Bengaluru Urban (Rajajinagar)",
    type: "Government (ESI)",
    beds: "1,000+",
    seats: 125,
    gmCutoff: 11745,
    govtFee: 109350,
  },
  {
    code: "M011",
    name: "St. John's Medical College",
    location: "Bengaluru Urban",
    type: "Private (Minority)",
    beds: "1,350+",
    seats: 150,
    gmCutoff: 14500,
    govtFee: 810535,
  },
];

export default function NeetHub() {
  const { setExamMode } = useExamMode();

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  const toolCategories = useMemo(
    () => [
      {
        id: "predictors",
        title: "Predictors & Option Planning",
        items: [
          {
            title: "College Predictor (AIR)",
            desc: "Filter eligible MBBS & BDS colleges by your NEET All India Rank, category, and budget.",
            icon: Target,
            href: "/neet-predictor",
            metric: "2026 Model",
          },
          {
            title: "Cutoff Matrix Grid",
            desc: "Category-wise closing ranks table across all 107 colleges with live AIR highlight.",
            icon: Grid3X3,
            href: "/neet-matrix",
            metric: "Category Grid",
          },
          {
            title: "Option Entry Builder",
            desc: "Structure your choice list into Dream, Target, and Safety Net tiers before KEA locking.",
            icon: ListOrdered,
            href: "/neet-option-builder",
            metric: "Strategy Tool",
          },
          {
            title: "Choice 1/2/3/4 Decision Engine",
            desc: "Procedural guide and decision simulator for post-allotment KEA choices and fee deadlines.",
            icon: HelpCircle,
            href: "/neet-choice-simulator",
            metric: "KEA Rules",
          },
        ],
      },
      {
        id: "analytics",
        title: "Cutoffs, Fees & Institutional Analytics",
        items: [
          {
            title: "Medical Cutoffs Explorer",
            desc: "Search through 5,336 Round 1 closing cutoffs across GM, OBC, SC/ST, and HK quotas.",
            icon: Search,
            href: "/neet-explorer",
            metric: "5,336 Records",
          },
          {
            title: "College Comparator",
            desc: "Side-by-side evaluation of up to 3 medical institutes across hospital beds, fees, and ranks.",
            icon: Scale,
            href: "/neet-compare",
            metric: "Side-by-Side",
          },
          {
            title: "Fee & Degree Cost Calculator",
            desc: "Verified itemized annual tuition schedules and calculated 5-year total degree expenses.",
            icon: IndianRupee,
            href: "/neet-fees",
            metric: "107 Colleges",
          },
          {
            title: "Mock vs Final Trends",
            desc: "Analyze closing rank drift and seat movement between KEA Mock and Round 1 Final.",
            icon: TrendingUp,
            href: "/neet-trends",
            metric: "Shift Analyzer",
          },
        ],
      },
      {
        id: "guidelines",
        title: "Seat Quotas & Service Obligations",
        items: [
          {
            title: "Quota & Rural Bond Guide",
            desc: "Karnataka 85% vs MCC 15% quota rules, category classifications, and 1-year rural bond terms.",
            icon: ShieldCheck,
            href: "/neet-quotas",
            metric: "Official Policy",
          },
        ],
      },
    ],
    []
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-foreground font-sans animate-scale-in">
      <Helmet>
        <title>Karnataka UG-NEET 2026 Counseling Hub | NEETCoded</title>
        <meta
          name="description"
          content="Official Round 1 closing ranks, college predictor, cutoff matrix, fee structures, and option entry builder for Karnataka UG-NEET Medical & Dental Admissions."
        />
      </Helmet>

      {/* ===================================================================
          SECTION 1: HERO HEADER & STATS STRIP (KCETCODED FORMAT)
         =================================================================== */}
      <div className="p-6 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm space-y-6">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Karnataka UG-NEET 2026 Admissions Workspace
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Medical & Dental <span className="text-foreground font-black">Admissions Hub</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">
              Official KEA Round 1 verified database across <strong>107 colleges</strong> (68 MBBS + 39 BDS). Explore category closing ranks, simulate option entry sequences, and inspect fee structures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button asChild size="sm" className="font-semibold text-xs h-9 px-4 bg-foreground text-background hover:bg-foreground/90">
              <Link to="/neet-predictor">
                <Target className="mr-1.5 h-4 w-4 text-rose-500" /> College Predictor
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-border/60 text-xs h-9 px-3.5 text-foreground">
              <Link to="/neet-matrix">
                <Grid3X3 className="mr-1.5 h-4 w-4 text-muted-foreground" /> Cutoff Matrix Grid
              </Link>
            </Button>
          </div>
        </header>

        {/* METRICS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-border/40">
          <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Verified Colleges</p>
              <p className="text-xl font-mono font-bold text-foreground">107</p>
              <p className="text-[10px] text-muted-foreground">68 MBBS · 39 BDS</p>
            </div>
            <Building2 className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cutoff Records</p>
              <p className="text-xl font-mono font-bold text-foreground">5,336</p>
              <p className="text-[10px] text-muted-foreground">KEA R1 Allotments</p>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Govt MBBS Fee</p>
              <p className="text-xl font-mono font-bold text-foreground">₹64,350<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
              <p className="text-[10px] text-muted-foreground">BMCRI / MMCRI</p>
            </div>
            <IndianRupee className="h-5 w-5 text-muted-foreground/40" />
          </div>
          <div className="p-3 rounded-xl border border-border/40 bg-background/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">State Quota Pool</p>
              <p className="text-xl font-mono font-bold text-foreground">85%</p>
              <p className="text-[10px] text-muted-foreground">KEA Counseling Pool</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-muted-foreground/40" />
          </div>
        </div>
      </div>

      {/* ===================================================================
          SECTION 2: ACTION TOOLS BY CATEGORY (KCETCODED FORMAT)
         =================================================================== */}
      <div className="space-y-6">
        {toolCategories.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              {cat.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cat.items.map((item) => (
                <Link
                  key={item.title}
                  to={item.href}
                  className="p-4 rounded-xl border border-border/40 bg-card/40 hover:bg-card hover:border-border/80 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-muted/60 text-muted-foreground group-hover:text-foreground transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono border-border/60 text-muted-foreground">
                        {item.metric}
                      </Badge>
                    </div>
                    <h3 className="text-xs font-bold text-foreground group-hover:text-foreground transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border/20 flex items-center justify-between text-[10px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                    <span>Open Tool</span>
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ===================================================================
          SECTION 3: PREMIER MEDICAL INSTITUTES PREVIEW
         =================================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Premier Medical Colleges (Karnataka UG-NEET R1)
          </h2>
          <Button asChild variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground hover:text-foreground">
            <Link to="/neet-explorer">
              View All 107 Colleges <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PREMIER_COLLEGES.map((col) => (
            <div key={col.code} className="p-4 rounded-xl border border-border/40 bg-card/40 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[9px] font-mono border-border text-muted-foreground">
                    {col.code}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-medium">{col.type}</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">{col.seats} Seats</span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-foreground line-clamp-1">{col.name}</h3>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-muted-foreground" /> {col.location}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-background/50 border border-border/40 text-[11px]">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold block">GM Cutoff (R1)</span>
                  <span className="font-mono font-bold text-foreground">#{col.gmCutoff.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-semibold block">Annual Tuition</span>
                  <span className="font-mono font-bold text-foreground">{formatFee(col.govtFee)}/yr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

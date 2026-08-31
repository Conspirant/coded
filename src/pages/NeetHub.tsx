import React, { useState, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Stethoscope,
  Search,
  Target,
  Calculator,
  ListOrdered,
  Scale,
  TrendingUp,
  IndianRupee,
  ShieldCheck,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Flame,
  Award,
  BookOpen,
  MapPin,
  Bed,
  Grid3X3,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useExamMode } from "@/contexts/ExamModeContext";
import {
  MEDICAL_FINAL_CUTOFFS,
  DENTAL_FINAL_CUTOFFS,
  FEE_STRUCTURE,
  TOP_CATEGORIES,
  getCategoryLabel,
  formatFee,
} from "@/data/neet2026Data";
import { calculateNeetPrediction } from "@/lib/neet-rank-predictor";

const HERO_WORDS = [
  "MBBS Admissions 2026",
  "Govt Medical Cutoffs",
  "State Merit Rank",
  "Option Entry Ordering",
  "Choice 1/2/3/4 Decision",
];

const PREMIER_COLLEGES = [
  {
    code: "M001",
    name: "Bangalore Medical College (BMCRI)",
    location: "Bengaluru Urban",
    type: "Government",
    beds: "2,800+",
    seats: 250,
    gmCutoff: 2655,
    govtFee: 64350,
    established: 1955,
  },
  {
    code: "M021",
    name: "Mysore Medical College (MMCRI)",
    location: "Mysuru",
    type: "Government",
    beds: "1,800+",
    seats: 150,
    gmCutoff: 6539,
    govtFee: 64350,
    established: 1924,
  },
  {
    code: "M082",
    name: "Shri Atal Bihari Vajpayee IMS (SABVIMS)",
    location: "Bengaluru Urban",
    type: "Government",
    beds: "1,200+",
    seats: 150,
    gmCutoff: 8022,
    govtFee: 64350,
    established: 2019,
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
    established: 1953,
  },
  {
    code: "M066",
    name: "ESI Medical College, Rajajinagar",
    location: "Bengaluru Urban",
    type: "Government (ESI)",
    beds: "1,000+",
    seats: 125,
    gmCutoff: 11745,
    govtFee: 109350,
    established: 2012,
  },
  {
    code: "M011",
    name: "St. John's Medical College",
    location: "Bengaluru Urban",
    type: "Minority (L,R)",
    beds: "1,350+",
    seats: 150,
    gmCutoff: 14500,
    govtFee: 810535,
    established: 1963,
  },
];

const SCORE_DISTRIBUTION_DATA = [
  { scoreRange: "680+", air: "AIR 1 - 2,500", odds: "Top Govt MBBS", color: "#10b981" },
  { scoreRange: "620 - 679", air: "AIR 2,500 - 15,000", odds: "Govt Medical", color: "#06b6d4" },
  { scoreRange: "560 - 619", air: "AIR 15,000 - 55,000", odds: "Govt Quota in Pvt", color: "#6366f1" },
  { scoreRange: "480 - 559", air: "AIR 55,000 - 1,40,000", odds: "GMP / Pvt Quota", color: "#f59e0b" },
  { scoreRange: "380 - 479", air: "AIR 1.4L - 3.2L", odds: "Govt BDS / Deemed", color: "#ec4899" },
  { scoreRange: "135 - 379", air: "AIR 3.2L - 10L+", odds: "Private BDS / Mgmt", color: "#8b5cf6" },
];

export default function NeetHub() {
  const { setExamMode } = useExamMode();
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [scoreInput, setScoreInput] = useState<number>(605);
  const [selectedCategory, setSelectedCategory] = useState<string>("GM");

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  // Word cycler
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentWordIdx((prev) => (prev + 1) % HERO_WORDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const prediction = useMemo(() => {
    return calculateNeetPrediction(scoreInput, selectedCategory);
  }, [scoreInput, selectedCategory]);

  const tools = [
    {
      title: "College Predictor",
      desc: "Instant matching engine by NEET AIR & category with probability tiers and budget filters.",
      icon: Target,
      href: "/neet-predictor",
      tag: "AIR Matching",
      accent: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400",
    },
    {
      title: "Option Entry Builder",
      desc: "Auto-organize your choices into Dream, Target, and Safe tiers. Drag, reorder, and export CSV.",
      icon: ListOrdered,
      href: "/neet-option-builder",
      tag: "Priority Planner",
      accent: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    },
    {
      title: "Cutoff Matrix Grid",
      desc: "Full-width category-wise closing ranks grid across all quotas with real-time AIR eligibility highlighting.",
      icon: Grid3X3,
      href: "/neet-matrix",
      tag: "Category Grid",
      accent: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400",
    },
    {
      title: "Choice 1/2/3/4 Simulator",
      desc: "Interactive post-allotment decision advisor. Understand fee deadlines, upgrades, and forfeiture rules.",
      icon: HelpCircle,
      href: "/neet-choice-simulator",
      tag: "KEA Decision",
      accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Medical Cutoffs Explorer",
      desc: "Search through all 5,336 Round 1 closing ranks across GM, OBC, SC/ST, and HK quotas.",
      icon: Search,
      href: "/neet-explorer",
      tag: "5,336 Cutoffs",
      accent: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
    },
    {
      title: "Compare Colleges",
      desc: "Side-by-side evaluation of 2–3 medical colleges across fees, hospital beds, and category ranks.",
      icon: Scale,
      href: "/neet-compare",
      tag: "Side-by-Side",
      accent: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
    },
    {
      title: "Fee & Cost Calculator",
      desc: "Itemized annual tuition fees across 107 colleges (68 MBBS + 39 BDS) with 5-year degree cost.",
      icon: IndianRupee,
      href: "/neet-fees",
      tag: "107 Colleges",
      accent: "from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-400",
    },
    {
      title: "Mock vs Final Trends",
      desc: "Track rank drift and volatility from Mock Allotment to Round 1 Final across all institutes.",
      icon: TrendingUp,
      href: "/neet-trends",
      tag: "Rank Drift",
      accent: "from-amber-500/20 to-rose-500/10 border-amber-500/30 text-amber-400",
    },
    {
      title: "Quota & Rural Bond Guide",
      desc: "Karnataka 85% vs MCC 15% rules, reservation quotas, and 1-Year mandatory service bond stipends.",
      icon: ShieldCheck,
      href: "/neet-quotas",
      tag: "Bond & Quota",
      accent: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      <Helmet>
        <title>NEETCoded Dashboard | Karnataka Medical & Dental Admissions 2026</title>
        <meta
          name="description"
          content="NEETCoded is Karnataka's dedicated medical counseling suite. Predict your NEET AIR, explore official MBBS & BDS cutoffs, compare 107 colleges, and simulate KEA Option Entry."
        />
      </Helmet>

      {/* ═══ 1. HERO SECTION & LIVE SCORE ESTIMATOR ═══ */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-500/25 bg-gradient-to-br from-rose-950/40 via-card to-background p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Introduction */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <HeartPulse className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
              Karnataka UG-NEET Admissions Suite 2026
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-brand leading-tight">
              Precision Intelligence for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-pink-400">
                {HERO_WORDS[currentWordIdx]}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground max-w-xl leading-relaxed">
              Empowering Karnataka medical aspirants with official KEA Round 1 data. Explore closing ranks for <strong>68 MBBS</strong> + <strong>39 BDS</strong> colleges, simulate option entry priority, and track fees.
            </p>

            {/* Quick Action Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm h-9 px-4 shadow-md">
                <Link to="/neet-predictor">
                  <Target className="mr-1.5 h-4 w-4" /> Launch Predictor
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-border/60 hover:bg-card text-xs sm:text-sm h-9 px-4">
                <Link to="/neet-option-builder">
                  <ListOrdered className="mr-1.5 h-4 w-4 text-rose-400" /> Option Entry Builder
                </Link>
              </Button>
              <Button asChild variant="ghost" className="text-xs sm:text-sm h-9 px-3 text-muted-foreground hover:text-foreground">
                <Link to="/neet-explorer">
                  Browse Cutoffs <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: Score-to-AIR Quick Estimator Card */}
          <div className="lg:col-span-5">
            <div className="p-5 sm:p-6 rounded-2xl border border-rose-500/30 bg-background/80 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Quick Score Estimator
                  </span>
                </div>
                <Badge className="bg-rose-500/15 text-rose-300 border-rose-500/30 text-[10px] font-mono">
                  2026 Model
                </Badge>
              </div>

              {/* Score Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">NEET Score:</span>
                  <span className="font-mono font-extrabold text-xl text-rose-400">
                    {scoreInput} <span className="text-xs font-normal text-muted-foreground">/ 720</span>
                  </span>
                </div>
                <Slider
                  value={[scoreInput]}
                  min={120}
                  max={720}
                  step={1}
                  onValueChange={(v) => setScoreInput(v[0])}
                  className="py-1"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>120</span>
                  <span>450</span>
                  <span>600</span>
                  <span>720</span>
                </div>
              </div>

              {/* Category Picker */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted-foreground">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-8 text-xs bg-card/60"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TOP_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs">
                        {cat} — {getCategoryLabel(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Metric Result Blocks */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/20 text-center">
                  <span className="text-[10px] uppercase font-semibold text-rose-300/80 block">Estimated AIR</span>
                  <span className="font-mono font-extrabold text-lg text-rose-400 block mt-0.5">
                    #{prediction.air.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-center">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">State Rank</span>
                  <span className="font-mono font-extrabold text-lg text-foreground block mt-0.5">
                    ~{prediction.karnatakaStateRank.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Bottom CTA */}
              <Button asChild className="w-full bg-rose-600/90 hover:bg-rose-600 text-white font-semibold text-xs h-8">
                <Link to={`/neet-predictor?rank=${prediction.air}&category=${selectedCategory}`}>
                  View Eligible Colleges ({prediction.air.toLocaleString()}) <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. KEY METRICS STRIP ═══ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase font-semibold">Total Verified Colleges</p>
          <p className="text-2xl font-extrabold font-mono text-foreground">107</p>
          <p className="text-[10px] text-muted-foreground">68 MBBS + 39 BDS</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase font-semibold">Round 1 Cutoffs</p>
          <p className="text-2xl font-extrabold font-mono text-emerald-400">5,336</p>
          <p className="text-[10px] text-muted-foreground">Derived from KEA Allotments</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase font-semibold">Lowest Govt MBBS Fee</p>
          <p className="text-2xl font-extrabold font-mono text-rose-400">₹64,350</p>
          <p className="text-[10px] text-muted-foreground">Per Year (BMCRI / MMCRI)</p>
        </div>
        <div className="p-4 rounded-2xl border border-border/50 bg-card/60 text-center space-y-1">
          <p className="text-[11px] text-muted-foreground uppercase font-semibold">State Domicile Quota</p>
          <p className="text-2xl font-extrabold font-mono text-foreground">85%</p>
          <p className="text-[10px] text-muted-foreground">KEA Counseling Pool</p>
        </div>
      </section>

      {/* ═══ 3. ALL 8 DEDICATED COUNSELING TOOLS ═══ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px] font-mono uppercase">
              Tool Suite
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-brand mt-1">
              NEET Admissions Toolkit
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Dedicated utilities for every phase of medical option entry and choice filling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              to={tool.href}
              className="group p-5 rounded-2xl border border-border/60 bg-card/60 hover:bg-card/90 hover:border-rose-500/40 hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-105 transition-transform">
                    <tool.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono border-border text-muted-foreground">
                    {tool.tag}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-rose-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-rose-400 group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 4. PREMIER MEDICAL COLLEGES PREVIEW ═══ */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[10px] font-mono uppercase">
              Top Institutes
            </Badge>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-brand mt-1">
              Top Medical Colleges in Karnataka
            </h2>
          </div>
          <Button asChild variant="outline" size="sm" className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs">
            <Link to="/neet-explorer">
              View All 107 Colleges <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PREMIER_COLLEGES.map((col) => (
            <Card key={col.code} className="border-border/60 bg-card/60 hover:border-rose-500/30 transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] font-semibold border-rose-500/30 text-rose-400 font-mono">
                    {col.code}
                  </Badge>
                  <Badge className="text-[9px] bg-background/80 text-foreground border-border/50">
                    {col.type}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-bold line-clamp-1 mt-1 text-foreground">
                  {col.name}
                </CardTitle>
                <CardDescription className="text-xs flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-rose-500" />
                  {col.location} • Est. {col.established}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-0 text-xs">
                <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-background/50 border border-border/40">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">MBBS Seats</span>
                    <p className="font-mono font-bold">{col.seats}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase">Hospital Beds</span>
                    <p className="font-mono font-bold text-rose-400">{col.beds}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-[11px]">
                  <span className="text-muted-foreground">GM Closing Rank:</span>
                  <span className="font-mono font-bold text-rose-400">
                    #{col.gmCutoff.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-muted-foreground">Govt Fee:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatFee(col.govtFee)}/yr
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ═══ 5. SCORE BAND & PROBABILITY SPECTRUM ═══ */}
      <section className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card/60 space-y-5">
        <div className="space-y-1">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-mono uppercase">
            Score Inflation Spectrum
          </Badge>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight font-brand text-foreground">
            NEET 2026 Score Bands vs Karnataka Admission Odds
          </h2>
          <p className="text-xs text-muted-foreground">
            Estimated seat allocations across marks ranges based on 2026 inflation calibrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SCORE_DISTRIBUTION_DATA.map((band) => (
            <div key={band.scoreRange} className="p-4 rounded-xl border border-border/40 bg-background/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-rose-400">{band.scoreRange} Marks</span>
                <Badge variant="outline" className="text-[9px] font-mono border-border text-muted-foreground">
                  {band.air}
                </Badge>
              </div>
              <p className="text-xs font-semibold text-foreground">{band.odds}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 6. CALL TO ACTION ═══ */}
      <section className="p-8 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-950/40 via-card to-rose-950/20 text-center space-y-4 shadow-xl">
        <h3 className="text-xl sm:text-2xl font-bold font-brand text-foreground">
          Ready to Find Your Medical College Match?
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
          Start predicting with your exact NEET All India Rank, browse verified closing ranks, or structure your priority list.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm h-9 px-5">
            <Link to="/neet-predictor">
              Launch College Predictor <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-border text-xs sm:text-sm h-9 px-5">
            <Link to="/neet-option-builder">
              Build Option Entry List
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

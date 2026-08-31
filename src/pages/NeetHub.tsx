import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Search,
  Target,
  ListOrdered,
  Scale,
  TrendingUp,
  IndianRupee,
  ShieldCheck,
  Grid3X3,
  Building2,
  ArrowRight,
  ChevronRight,
  HelpCircle,
  BarChart3,
  MapPin,
  Bed,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExamMode } from "@/contexts/ExamModeContext";
import {
  formatFee,
} from "@/data/neet2026Data";

const HERO_WORDS = [
  "MBBS Admissions 2026",
  "Govt Medical Cutoffs",
  "Option Entry Ordering",
  "Choice 1/2/3/4 Decision",
  "Seat Matrix & Quotas",
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

export default function NeetHub() {
  const { setExamMode } = useExamMode();
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

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

  const tools = [
    {
      title: "College Predictor",
      desc: "Match your exact NEET AIR & category with closing cutoffs and budget tiers.",
      icon: Target,
      href: "/neet-predictor",
      tag: "AIR Matcher",
    },
    {
      title: "Option Entry Builder",
      desc: "Auto-organize your choices into Dream, Target, and Safe tiers. Reorder and export CSV.",
      icon: ListOrdered,
      href: "/neet-option-builder",
      tag: "Strategy",
    },
    {
      title: "Cutoff Matrix Grid",
      desc: "Full-width category-wise closing ranks matrix with live AIR eligibility highlighting.",
      icon: Grid3X3,
      href: "/neet-matrix",
      tag: "Matrix View",
    },
    {
      title: "Choice 1/2/3/4 Simulator",
      desc: "Interactive post-allotment decision advisor. Understand deadlines, fees, and rules.",
      icon: HelpCircle,
      href: "/neet-choice-simulator",
      tag: "Decisions",
    },
    {
      title: "Medical Cutoffs Explorer",
      desc: "Search through 5,336 Round 1 closing ranks across GM, OBC, SC/ST, and HK quotas.",
      icon: Search,
      href: "/neet-explorer",
      tag: "Cutoffs",
    },
    {
      title: "Compare Colleges",
      desc: "Side-by-side evaluation of medical colleges across fees, beds, and category ranks.",
      icon: Scale,
      href: "/neet-compare",
      tag: "Compare",
    },
    {
      title: "Fee & Cost Calculator",
      desc: "Itemized annual tuition fees across 107 colleges with 5-year degree cost estimates.",
      icon: IndianRupee,
      href: "/neet-fees",
      tag: "Fees",
    },
    {
      title: "Mock vs Final Trends",
      desc: "Track rank drift and volatility from Mock Allotment to Round 1 Final across institutes.",
      icon: TrendingUp,
      href: "/neet-trends",
      tag: "Drift",
    },
    {
      title: "Quota & Rural Bond Guide",
      desc: "Karnataka 85% vs MCC 15% rules, reservation quotas, and 1-year rural service terms.",
      icon: ShieldCheck,
      href: "/neet-quotas",
      tag: "Guidelines",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <Helmet>
        <title>NEETCoded | Karnataka Medical & Dental Admissions Hub 2026</title>
        <meta
          name="description"
          content="Minimalist intelligence portal for Karnataka UG-NEET medical & dental admissions. Predict eligible colleges by AIR, view category cutoffs, and plan option entry."
        />
      </Helmet>

      {/* ═══ 1. MINIMALIST HERO SECTION ═══ */}
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Main Title & Info */}
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-muted/60 border border-border/70 text-muted-foreground text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Karnataka UG-NEET Admissions 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-brand leading-tight text-foreground">
              Precision Intelligence for <br />
              <span className="text-foreground/90 underline decoration-rose-500/50 decoration-2 underline-offset-4">
                {HERO_WORDS[currentWordIdx]}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Official KEA Round 1 verified database. Explore closing cutoffs for <strong>68 MBBS</strong> + <strong>39 BDS</strong> colleges, simulate option entry, and estimate fees.
            </p>

            {/* Quick Action Links */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs h-8 px-4">
                <Link to="/neet-predictor">
                  <Target className="mr-1.5 h-3.5 w-3.5 text-rose-500" /> College Predictor (AIR)
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-border/70 hover:bg-muted/40 text-xs h-8 px-3.5 text-foreground">
                <Link to="/neet-matrix">
                  <Grid3X3 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /> Cutoff Matrix Grid
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-border/70 hover:bg-muted/40 text-xs h-8 px-3.5 text-foreground">
                <Link to="/neet-option-builder">
                  <ListOrdered className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" /> Option Entry Builder
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="text-xs h-8 px-3 text-muted-foreground hover:text-foreground">
                <Link to="/neet-explorer">
                  Browse Cutoffs <ChevronRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Highlights Pill */}
          <div className="lg:w-80 p-4 rounded-xl border border-border/70 bg-background/50 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="font-bold text-foreground">KEA Counseling Fast Facts</span>
              <Badge variant="outline" className="text-[9px] font-mono border-border/70 text-muted-foreground">
                2026 R1
              </Badge>
            </div>
            <div className="space-y-1.5 text-muted-foreground">
              <div className="flex justify-between">
                <span>Government MBBS Pool:</span>
                <span className="font-mono font-bold text-foreground">24 Colleges</span>
              </div>
              <div className="flex justify-between">
                <span>Private & Deemed MBBS:</span>
                <span className="font-mono font-bold text-foreground">44 Colleges</span>
              </div>
              <div className="flex justify-between">
                <span>Karnataka Domicile:</span>
                <span className="font-mono font-bold text-foreground">85% State Quota</span>
              </div>
              <div className="flex justify-between">
                <span>Mandatory Rural Bond:</span>
                <span className="font-mono font-bold text-foreground">1 Year Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 2. MINIMAL STATS STRIP ═══ */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 text-center space-y-0.5">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Total Verified Colleges</p>
          <p className="text-xl font-bold font-mono text-foreground">107</p>
          <p className="text-[10px] text-muted-foreground">68 MBBS + 39 BDS</p>
        </div>
        <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 text-center space-y-0.5">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Round 1 Cutoffs</p>
          <p className="text-xl font-bold font-mono text-foreground">5,336</p>
          <p className="text-[10px] text-muted-foreground">Official KEA Records</p>
        </div>
        <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 text-center space-y-0.5">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">Lowest Govt MBBS Fee</p>
          <p className="text-xl font-bold font-mono text-foreground">
            ₹64,350<span className="text-xs font-normal text-muted-foreground">/yr</span>
          </p>
          <p className="text-[10px] text-muted-foreground">BMCRI / MMCRI</p>
        </div>
        <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 text-center space-y-0.5">
          <p className="text-[10px] text-muted-foreground uppercase font-semibold">State Domicile Pool</p>
          <p className="text-xl font-bold font-mono text-foreground">85%</p>
          <p className="text-[10px] text-muted-foreground">KEA Counseling Seats</p>
        </div>
      </section>

      {/* ═══ 3. MINIMAL TOOL GRID ═══ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Admissions Toolkit
          </h2>
          <span className="text-xs text-muted-foreground font-mono">8 Tools Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              to={tool.href}
              className="group p-4 rounded-xl border border-border/60 bg-card/40 hover:bg-card hover:border-border hover:shadow-sm transition-all flex flex-col justify-between space-y-2.5"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-muted/60 text-muted-foreground group-hover:text-foreground transition-colors">
                    <tool.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono border-border/60 text-muted-foreground">
                    {tool.tag}
                  </Badge>
                </div>
                <h3 className="text-xs font-bold text-foreground group-hover:text-foreground">
                  {tool.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                <span>Launch</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 4. PREMIER COLLEGES (MINIMAL) ═══ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold tracking-tight text-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Top Medical Colleges Preview
          </h2>
          <Button asChild variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground hover:text-foreground">
            <Link to="/neet-explorer">
              View All 107 <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PREMIER_COLLEGES.map((col) => (
            <div key={col.code} className="p-3.5 rounded-xl border border-border/60 bg-card/40 space-y-2">
              <div className="flex items-start justify-between gap-1.5">
                <Badge variant="outline" className="text-[9px] font-mono border-border text-muted-foreground">
                  {col.code}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{col.type}</span>
              </div>
              <h3 className="text-xs font-bold text-foreground line-clamp-1">{col.name}</h3>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 text-muted-foreground" /> {col.location}
              </p>

              <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-background/50 border border-border/40 text-[11px] pt-1">
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase block">GM Cutoff</span>
                  <span className="font-mono font-bold text-foreground">#{col.gmCutoff.toLocaleString("en-IN")}</span>
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase block">Govt Fee</span>
                  <span className="font-mono font-bold text-foreground">{formatFee(col.govtFee)}/yr</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

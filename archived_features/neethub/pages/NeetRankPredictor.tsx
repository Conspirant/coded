import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Calculator,
  Award,
  Sparkles,
  TrendingUp,
  Building2,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateNeetPrediction,
  NEET_CATEGORY_LIST,
} from "@/lib/neet-rank-predictor";
import { KARNATAKA_MEDICAL_COLLEGES } from "@/data/neetMedicalData";

export default function NeetRankPredictor() {
  const [score, setScore] = useState<number>(580);
  const [category, setCategory] = useState<string>("GM");

  const prediction = useMemo(() => {
    return calculateNeetPrediction(score, category);
  }, [score, category]);

  const scorePresets = [
    { label: "Top Govt (680+)", score: 685 },
    { label: "Govt Medical (620+)", score: 625 },
    { label: "Pvt Govt Quota (560+)", score: 565 },
    { label: "Pvt GMP Quota (490+)", score: 495 },
    { label: "Deemed / BDS (420+)", score: 420 },
  ];

  const getProbabilityBadge = (prob: "High" | "Moderate" | "Low" | "Unlikely") => {
    switch (prob) {
      case "High":
        return <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">High Chance</Badge>;
      case "Moderate":
        return <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs">Moderate</Badge>;
      case "Low":
        return <Badge className="bg-orange-500/15 text-orange-400 border-orange-500/30 text-xs">Borderline</Badge>;
      default:
        return <Badge className="bg-rose-500/15 text-rose-400 border-rose-500/30 text-xs">Unlikely</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <Helmet>
        <title>NEET Rank Predictor 2026 | Score to AIR & Karnataka State Rank | NEETCoded</title>
        <meta
          name="description"
          content="Predict your NEET 2026 All India Rank (AIR), estimated Karnataka State Merit Rank, and MBBS/BDS seat odds across Govt, Private, and Deemed colleges."
        />
      </Helmet>

      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/40 via-background to-card p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <HeartPulse className="h-3.5 w-3.5 text-rose-400 animate-pulse" />
              NEET Medical Predictor Engine
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-brand">
              NEET <span className="text-rose-500">Marks vs Rank</span> Predictor
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Calibrated model for NEET 2026 score inflation. Estimate your All India Rank (AIR), Karnataka State Merit Rank, and MBBS/BDS quota eligibility.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-center">
            <Button asChild variant="outline" className="border-rose-500/30 hover:bg-rose-500/10 text-xs">
              <Link to="/cutoff-explorer">
                <Stethoscope className="mr-1.5 h-3.5 w-3.5 text-rose-400" />
                Medical Cutoffs
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-border hover:bg-muted text-xs">
              <Link to="/fee-calculator">
                <Calculator className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Fee & Bond Calc
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/60 bg-card/60 backdrop-blur-md shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5 text-rose-500" />
                Score & Reservation
              </CardTitle>
              <CardDescription className="text-xs">
                Enter your expected or actual NEET-UG total score (out of 720)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Input & Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">NEET Score (0 - 720)</Label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={720}
                      value={score}
                      onChange={(e) => setScore(Math.max(0, Math.min(720, Number(e.target.value) || 0)))}
                      className="w-20 text-center font-mono font-extrabold text-lg bg-background border border-rose-500/40 rounded-lg py-1 px-2 text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40"
                    />
                    <span className="text-xs text-muted-foreground font-mono">/ 720</span>
                  </div>
                </div>

                <Slider
                  value={[score]}
                  min={0}
                  max={720}
                  step={1}
                  onValueChange={(val) => setScore(val[0])}
                  className="py-3"
                />

                {/* Score Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {scorePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setScore(preset.score)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                        score === preset.score
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold"
                          : "bg-muted/40 text-muted-foreground border-border/40 hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selector */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Counseling Category / Quota</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-background border-border text-xs sm:text-sm">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border max-h-72">
                    <SelectItem value="GM">GM - General Merit</SelectItem>
                    <SelectItem value="2AG">2A General (15% OBC)</SelectItem>
                    <SelectItem value="2BG">2B General (4% Muslim)</SelectItem>
                    <SelectItem value="3AG">3A General (4% Vokkaliga)</SelectItem>
                    <SelectItem value="3BG">3B General (5% Lingayat)</SelectItem>
                    <SelectItem value="SCG">SC - Scheduled Caste (15%)</SelectItem>
                    <SelectItem value="STG">ST - Scheduled Tribe (3%)</SelectItem>
                    <SelectItem value="GMP">GMP - Karnataka Private College Quota</SelectItem>
                    <SelectItem value="OPN">OPN - Open Quota (All-India in Karnataka)</SelectItem>
                    <SelectItem value="HKR">HKR - Hyderabad Karnataka (371J)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  KEA applies category reservations for 85% Karnataka State Quota seats.
                </p>
              </div>

              {/* Qualification Status Box */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                prediction.isQualified
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/20 text-rose-300"
              }`}>
                {prediction.isQualified ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs space-y-1">
                  <p className="font-bold">
                    {prediction.isQualified ? "Eligible for NEET Counseling" : "Below Expected Qualifying Cutoff"}
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    Expected cutoff: <span className="font-mono font-bold text-foreground">{prediction.qualifyingCutoff}</span> marks ({category === "GM" ? "50th percentile" : "40th percentile"}).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QUICK SUMMARY CARD */}
          <Card className="border-border/60 bg-card/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Karnataka Medical Quota Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>• <strong>Govt Quota (G):</strong> 100% of Govt colleges + 40% of Private colleges allotted via KEA (~₹1.41L/yr).</p>
              <p>• <strong>Private Quota (P/GMP):</strong> 40% of Private college seats for Karnataka candidates (~₹11.5L/yr).</p>
              <p>• <strong>Open Quota (OPN):</strong> Open to non-Karnataka candidates in Karnataka private medical colleges.</p>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: PREDICTIONS & ADMISSION ODDS */}
        <div className="lg:col-span-7 space-y-6">
          {/* STATS STRIP */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-950/20 backdrop-blur-md">
              <p className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">Predicted All India Rank</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-400 mt-1">
                #{prediction.air.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                Range: {prediction.airRange[0].toLocaleString()} - {prediction.airRange[1].toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Karnataka State Rank</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-foreground mt-1">
                ~{prediction.karnatakaStateRank.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                Range: {prediction.stateRankRange[0].toLocaleString()} - {prediction.stateRankRange[1].toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Estimated Percentile</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                {prediction.percentile}%
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Top bracket among 24L+ test takers</p>
            </div>
          </div>

          {/* ADMISSION PROBABILITY BREAKDOWN */}
          <Card className="border-border/60 bg-card/60 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-rose-500" />
                  Medical Seat Probability by Quota
                </span>
                <span className="text-xs font-normal text-muted-foreground">Category: {category}</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-world admission likelihood across Government, Private, and Deemed quotas in Karnataka
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {/* Govt MBBS */}
              <div className="p-3.5 rounded-xl border border-border/40 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <p className="text-xs font-bold text-foreground">Government Medical Colleges (MBBS)</p>
                    <span className="text-[10px] text-muted-foreground font-mono">~₹1.40 Lakh/yr</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{prediction.admissionBands.govtMbbs.description}</p>
                </div>
                <div>{getProbabilityBadge(prediction.admissionBands.govtMbbs.probability)}</div>
              </div>

              {/* Private Govt Quota */}
              <div className="p-3.5 rounded-xl border border-border/40 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-emerald-400" />
                    <p className="text-xs font-bold text-foreground">Private Colleges - Govt Quota (MBBS)</p>
                    <span className="text-[10px] text-muted-foreground font-mono">~₹1.41 Lakh/yr</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{prediction.admissionBands.pvtGovtMbbs.description}</p>
                </div>
                <div>{getProbabilityBadge(prediction.admissionBands.pvtGovtMbbs.probability)}</div>
              </div>

              {/* Private GMP Quota */}
              <div className="p-3.5 rounded-xl border border-border/40 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                    <p className="text-xs font-bold text-foreground">Private Quota / GMP (MBBS)</p>
                    <span className="text-[10px] text-muted-foreground font-mono">~₹11.50 Lakh/yr</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{prediction.admissionBands.pvtPrivateMbbs.description}</p>
                </div>
                <div>{getProbabilityBadge(prediction.admissionBands.pvtPrivateMbbs.probability)}</div>
              </div>

              {/* Deemed Universities */}
              <div className="p-3.5 rounded-xl border border-border/40 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-400" />
                    <p className="text-xs font-bold text-foreground">Deemed Universities (KMC, JSS, Yenepoya)</p>
                    <span className="text-[10px] text-muted-foreground font-mono">~₹18-22 Lakh/yr</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{prediction.admissionBands.deemedMbbs.description}</p>
                </div>
                <div>{getProbabilityBadge(prediction.admissionBands.deemedMbbs.probability)}</div>
              </div>

              {/* Dental & AYUSH */}
              <div className="p-3.5 rounded-xl border border-border/40 bg-background/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-sky-400" />
                    <p className="text-xs font-bold text-foreground">Dental (BDS) & AYUSH (BAMS/BHMS)</p>
                    <span className="text-[10px] text-muted-foreground font-mono">Govt & Pvt</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{prediction.admissionBands.bdsGovtPvt.description}</p>
                </div>
                <div>{getProbabilityBadge(prediction.admissionBands.bdsGovtPvt.probability)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

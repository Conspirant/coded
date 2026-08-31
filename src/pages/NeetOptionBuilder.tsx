import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ListOrdered,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Scale,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExamMode } from "@/contexts/ExamModeContext";
import { OptionEntryBuilder } from "@/components/neet/OptionEntryBuilder";

export default function NeetOptionBuilderPage() {
  const { setExamMode } = useExamMode();

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>KEA NEET Option Entry Builder 2026 | Priority List Generator | NEETCoded</title>
        <meta
          name="description"
          content="Build your strategic 3-tier KEA UG-NEET option entry sequence with Dream, Target, and Safe safety tiers based on 2026 closing ranks."
        />
      </Helmet>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-950/40 via-card to-background p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-semibold uppercase tracking-wider">
              <ListOrdered className="h-3.5 w-3.5" />
              KEA Medical Strategy Tool
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-brand text-foreground">
              NEET Option Entry <span className="text-amber-400">Priority Builder</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Construct an optimized choice list divided into Dream, Target, and Safety Net tiers to maximize your admission chances without risking seat loss.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" className="border-border/60 text-xs h-8">
              <Link to="/neet-choice-simulator">
                <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                Choice 1/2/3/4 Guide
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

      {/* Main Interactive Tool */}
      <OptionEntryBuilder />
    </div>
  );
}

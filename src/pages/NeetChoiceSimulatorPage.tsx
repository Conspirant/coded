import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ListOrdered,
  Scale,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExamMode } from "@/contexts/ExamModeContext";
import { ChoiceSimulator } from "@/components/neet/ChoiceSimulator";

export default function NeetChoiceSimulatorPage() {
  const { setExamMode } = useExamMode();

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>KEA Choice 1/2/3/4 Simulator 2026 | Post-Allotment Decision Engine | NEETCoded</title>
        <meta
          name="description"
          content="Simulate and understand KEA Choice 1 (Accept), Choice 2 (Upgrade), Choice 3 (Reject), and Choice 4 (Exit) consequences for NEET MBBS/BDS admissions."
        />
      </Helmet>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-950/40 via-card to-background p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" />
              Post-Allotment Decision Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-brand text-foreground">
              KEA Choice <span className="text-emerald-400">1, 2, 3, 4 Decision Simulator</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Understand the exact rules, challan fee payments, reporting deadlines, and legal implications of every KEA choice before submitting.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" className="border-border/60 text-xs h-8">
              <Link to="/neet-option-builder">
                <ListOrdered className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                Option Entry Builder
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

      {/* Interactive Tool */}
      <ChoiceSimulator />
    </div>
  );
}

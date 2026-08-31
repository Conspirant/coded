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
              KEA Choice <span className="text-foreground font-black">1, 2, 3, 4 Decision Engine</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">
              Factual procedural reference and interactive advisor for KEA post-allotment choices, fee challan deadlines, document verification, and seat forfeiture rules.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm" className="border-border/60 text-xs h-9 text-foreground">
              <Link to="/neet-option-builder">
                <ListOrdered className="mr-1.5 h-4 w-4 text-muted-foreground" />
                Option Entry Builder
              </Link>
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

      {/* Interactive Tool */}
      <ChoiceSimulator />
    </div>
  );
}

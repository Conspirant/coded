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
              Option Entry <span className="text-foreground font-black">Priority Builder</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">
              Organize your choice preferences into structured Dream, Target, and Safety Net tiers before submitting on the official KEA portal.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm" className="border-border/60 text-xs h-9 text-foreground">
              <Link to="/neet-choice-simulator">
                <HelpCircle className="mr-1.5 h-4 w-4 text-muted-foreground" />
                Choice 1/2/3/4 Guide
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

      {/* Main Interactive Tool */}
      <OptionEntryBuilder />
    </div>
  );
}

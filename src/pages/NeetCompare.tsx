import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Target,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExamMode } from "@/contexts/ExamModeContext";
import { CollegeComparator } from "@/components/neet/CollegeComparator";

export default function NeetComparePage() {
  const { setExamMode } = useExamMode();

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Compare Karnataka Medical Colleges 2026 | Side-by-Side Evaluation | NEETCoded</title>
        <meta
          name="description"
          content="Compare up to 3 Karnataka Medical & Dental Colleges across annual fees, 5-year costs, hospital beds, and category closing ranks."
        />
      </Helmet>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-muted/60 border border-border/70 text-muted-foreground text-[11px] font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Side-by-Side Comparison
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-brand text-foreground">
              Medical College <span className="text-foreground">Comparator</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Evaluate tuition fees, hospital patient capacity, total seats, and category cutoffs side-by-side to make confident decisions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" className="border-border/70 text-xs h-8 text-foreground">
              <Link to="/neet-explorer">
                <Search className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Cutoff Explorer
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-border/70 text-xs h-8 text-foreground">
              <Link to="/neet-predictor">
                <Target className="mr-1.5 h-3.5 w-3.5 text-rose-500" />
                Predictor
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tool */}
      <CollegeComparator />
    </div>
  );
}

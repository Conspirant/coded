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
              Medical College <span className="text-foreground font-black">Comparator</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">
              Side-by-side evaluation of up to 3 medical and dental institutions across hospital bed capacities, annual fees, 5-year degree expenses, and category cutoffs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" size="sm" className="border-border/60 text-xs h-9 text-foreground">
              <Link to="/neet-explorer">
                <Search className="mr-1.5 h-4 w-4 text-muted-foreground" />
                Cutoff Explorer
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

      {/* Main Tool */}
      <CollegeComparator />
    </div>
  );
}

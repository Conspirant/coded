import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Building,
  GraduationCap,
  Scale,
  Award,
  FileCheck,
  Target,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useExamMode } from "@/contexts/ExamModeContext";
import { QuotaMatrix } from "@/components/neet/QuotaMatrix";

export default function NeetQuotasPage() {
  const { setExamMode } = useExamMode();

  useEffect(() => {
    setExamMode("NEET");
  }, [setExamMode]);

  return (
    <div className="min-h-screen bg-background text-foreground py-6 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <Helmet>
        <title>Karnataka NEET Quota & Rural Bond Guide 2026 | KEA vs AIQ | NEETCoded</title>
        <meta
          name="description"
          content="Comprehensive guide to Karnataka Medical Quotas (Govt, GMP, OPN, NRI), Reservation Categories (2A, 2B, 3A, 3B, SC, ST, HK-371J), and 1-Year Mandatory Rural Service Bond."
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
              Seat Quotas, Reservations & <span className="text-foreground font-black">Rural Bond Guide</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed max-w-3xl">
              Factual breakdown of Karnataka 85% state quota vs 15% All India Quota, reservation sub-categories (2A, 2B, 3A, 3B, SC, ST, HK-371J), and mandatory 1-year rural service terms.
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

      {/* Main Quota Component */}
      <QuotaMatrix />
    </div>
  );
}

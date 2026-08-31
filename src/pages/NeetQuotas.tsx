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
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-muted/60 border border-border/70 text-muted-foreground text-[11px] font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              KEA Eligibility & Legal Guidelines
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-brand text-foreground">
              Karnataka Medical <span className="text-foreground">Quota & Rural Bond Guide</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Understand seat classification across Government, Private, and Deemed colleges, domicile reservation sub-quotas, and mandatory 1-year rural service bond terms.
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

      {/* Main Quota Component */}
      <QuotaMatrix />
    </div>
  );
}

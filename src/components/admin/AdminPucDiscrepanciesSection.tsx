import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MathRenderer } from "@/components/MathRenderer";
import {
  CheckCircle2,
  ExternalLink,
  Flag,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

interface PucReportRow {
  id: string;
  college_code: string;
  status: string;
  created_at: string;
  current_data: {
    question_id?: string;
    subject?: string;
    subject_key?: string;
    chapter_number?: number;
    chapter_name?: string;
    question_number?: number;
    question_type?: string;
    question_preview?: string;
    correct_answer?: string;
    image_url?: string | null;
  } | null;
  suggested_data: {
    type?: string;
    question_id?: string;
    subject?: string;
    subject_key?: string;
    chapter_number?: number;
    chapter_name?: string;
    question_number?: number;
    question_type?: string;
    reason?: string;
    reason_label?: string;
    comment?: string;
    reported_at?: string;
  } | null;
}

export function AdminPucDiscrepanciesSection() {
  const [reports, setReports] = useState<PucReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [subjectFilter, setSubjectFilter] = useState<"all" | "Physics" | "Chemistry" | "Mathematics">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("college_suggestions" as any)
        .select("*")
        .eq("college_code", "PUC_QB_REPORT")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports((data as unknown as PucReportRow[]) || []);
    } catch (err: any) {
      toast({
        title: "Failed to load PUC QB reports",
        description: err.message || "Could not fetch reports from Supabase.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id: string, status: "pending" | "approved" | "rejected") => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("college_suggestions" as any)
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
      toast({
        title:
          status === "approved"
            ? "Marked Resolved"
            : status === "rejected"
            ? "Dismissed Report"
            : "Reopened Report",
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteReport = async (id: string) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from("college_suggestions" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;

      setReports((prev) => prev.filter((r) => r.id !== id));
      toast({ title: "Report deleted" });
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === "pending").length,
      resolved: reports.filter((r) => r.status === "approved").length,
      dismissed: reports.filter((r) => r.status === "rejected").length,
    };
  }, [reports]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      const subj = r.suggested_data?.subject || r.current_data?.subject || "";
      if (subjectFilter !== "all" && subj !== subjectFilter) return false;
      if (!q) return true;
      const hay = [
        subj,
        r.current_data?.chapter_name,
        r.current_data?.question_preview,
        r.suggested_data?.reason_label,
        r.suggested_data?.comment,
        String(r.current_data?.question_number || ""),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [reports, statusFilter, subjectFilter, searchQuery]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Flag className="h-5 w-5 text-rose-400" />
            2nd PUC Question Bank Discrepancies
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Student-reported errors across 2nd PUC Physics, Chemistry, and Mathematics Question Banks.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchReports} disabled={loading} className="gap-1.5 text-xs">
          <RefreshCcw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-card/60">
          <CardContent className="p-3.5">
            <p className="text-[11px] text-muted-foreground">Total Reports</p>
            <p className="text-xl font-bold">{counts.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="p-3.5">
            <p className="text-[11px] text-amber-400">Pending Review</p>
            <p className="text-xl font-bold text-amber-400">{counts.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-3.5">
            <p className="text-[11px] text-emerald-400">Resolved</p>
            <p className="text-xl font-bold text-emerald-400">{counts.resolved}</p>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-3.5">
            <p className="text-[11px] text-muted-foreground">Dismissed</p>
            <p className="text-xl font-bold">{counts.dismissed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["all", "pending", "approved", "rejected"] as const).map((st) => (
            <Button
              key={st}
              size="sm"
              variant={statusFilter === st ? "default" : "outline"}
              className="h-8 sm:h-7 text-xs capitalize"
              onClick={() => setStatusFilter(st)}
            >
              {st === "approved" ? "Resolved" : st === "rejected" ? "Dismissed" : st}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {(["all", "Physics", "Chemistry", "Mathematics"] as const).map((subj) => (
            <Button
              key={subj}
              size="sm"
              variant={subjectFilter === subj ? "secondary" : "ghost"}
              className="h-8 sm:h-7 text-xs px-2.5"
              onClick={() => setSubjectFilter(subj)}
            >
              {subj === "all" ? "All" : subj}
            </Button>
          ))}
          <div className="relative w-full sm:w-56 mt-1 sm:mt-0">
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question, chapter..."
              className="h-9 sm:h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading PUC QB reports...
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-xs text-muted-foreground">
            No PUC Question Bank discrepancy reports match the current filters.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((rep) => {
            const cur = rep.current_data || {};
            const sug = rep.suggested_data || {};
            const subject = sug.subject || cur.subject || "Unknown";
            const chNum = sug.chapter_number ?? cur.chapter_number ?? "?";
            const chName = sug.chapter_name || cur.chapter_name || "";
            const qNum = sug.question_number ?? cur.question_number ?? "?";
            const qType = (sug.question_type || cur.question_type || "mcq").toUpperCase();
            const preview = cur.question_preview || "";
            const googleQuery = `${preview.replace(/\$/g, "")} 2nd PUC ${subject} answer`;
            const isBusy = updatingId === rep.id;

            return (
              <Card key={rep.id} className="border-border/80">
                <CardContent className="p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="text-[10px]">
                        {subject}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        Ch.{chNum} · PDF Q.{qNum} · {qType}
                      </Badge>
                      <Badge className="bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px]">
                        {sug.reason_label || sug.reason || "Discrepancy"}
                      </Badge>
                      {rep.status === "pending" ? (
                        <Badge className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px]">
                          Pending
                        </Badge>
                      ) : rep.status === "approved" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px]">
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Dismissed
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(rep.created_at).toLocaleString()}
                    </span>
                  </div>

                  {chName && (
                    <p className="text-[11px] text-muted-foreground">
                      Chapter: <span className="text-foreground font-medium">{chName}</span>{" "}
                      {cur.question_id && <span className="font-mono opacity-60">({cur.question_id})</span>}
                    </p>
                  )}

                  {preview && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/60 text-xs leading-relaxed">
                      <MathRenderer content={preview} />
                    </div>
                  )}

                  {cur.correct_answer && (
                    <p className="text-xs text-muted-foreground">
                      Stored Key: <span className="text-foreground font-semibold">{cur.correct_answer}</span>
                    </p>
                  )}

                  {sug.comment && (
                    <div className="p-2.5 rounded-md bg-rose-500/5 border border-rose-500/20 text-xs">
                      <span className="font-semibold text-rose-400">Student Note: </span>
                      <span className="text-foreground">{sug.comment}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 hover:underline"
                    >
                      <Search className="h-3.5 w-3.5" />
                      Verify on Google
                      <ExternalLink className="h-3 w-3" />
                    </a>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {rep.status !== "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() => updateStatus(rep.id, "approved")}
                          className="h-7 text-xs gap-1 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                        </Button>
                      )}
                      {rep.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() => updateStatus(rep.id, "rejected")}
                          className="h-7 text-xs gap-1"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Dismiss
                        </Button>
                      )}
                      {rep.status !== "pending" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isBusy}
                          onClick={() => updateStatus(rep.id, "pending")}
                          className="h-7 text-xs gap-1"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Reopen
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isBusy}
                        onClick={() => deleteReport(rep.id)}
                        className="h-7 text-xs gap-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

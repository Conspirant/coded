import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  CounsellorApplication,
  CounsellorRecruitmentService,
  L2_SCENARIO_QUESTIONS,
  LEVEL_META,
  VerificationLevel,
} from "@/lib/counsellor-recruitment-service";
import {
  Users,
  ShieldCheck,
  GraduationCap,
  Award,
  Search,
  ExternalLink,
  Trash2,
  Loader2,
  RefreshCw,
  Ban,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Linkedin,
  Copy,
  Download,
} from "lucide-react";

const isImageUrl = (url: string) =>
  /\.(png|jpe?g|webp|gif|bmp)(\?.*)?$/i.test(url);

export function AdminCounsellorRecruitmentSection() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<CounsellorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selected, setSelected] = useState<CounsellorApplication | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    const data = await CounsellorRecruitmentService.getAllApplications();
    setApplications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const openDetails = (app: CounsellorApplication) => {
    setSelected(app);
    setAdminNotes(app.admin_notes || "");
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  const handleUpdate = async (
    app: CounsellorApplication,
    patch: {
      verification_level?: VerificationLevel;
      status?: "pending" | "active" | "suspended" | "rejected";
      admin_notes?: string;
    },
    successMsg: string
  ) => {
    setUpdatingId(app.id);
    const res = await CounsellorRecruitmentService.updateVerification(app.id, patch);
    setUpdatingId(null);

    if (!res.success) {
      toast({ title: "Update failed", description: res.error, variant: "destructive" });
      return;
    }

    toast({ title: successMsg });
    await loadApplications();
    if (selected?.id === app.id) {
      setSelected((prev) => (prev ? { ...prev, ...patch } : null));
    }
  };

  const handleDelete = async (id: string) => {
    setUpdatingId(id);
    const ok = await CounsellorRecruitmentService.deleteApplication(id);
    setUpdatingId(null);
    if (!ok) {
      toast({ title: "Delete failed", variant: "destructive" });
      return;
    }
    toast({ title: "Application deleted" });
    setSelected(null);
    await loadApplications();
  };

  const filtered = applications.filter((app) => {
    if (statusFilter !== "all" && app.status !== statusFilter) return false;
    if (levelFilter !== "all" && String(app.verification_level) !== levelFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        app.full_name.toLowerCase().includes(q) ||
        app.college_name.toLowerCase().includes(q) ||
        app.branch.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        (app.phone_number || "").toLowerCase().includes(q) ||
        app.contact_handle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    l1: applications.filter((a) => a.status === "active" && a.verification_level === 1).length,
    l2: applications.filter((a) => a.status === "active" && a.verification_level === 2).length,
    l3: applications.filter((a) => a.status === "active" && a.verification_level === 3).length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">1-on-1 Counselling Recruitment</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Level-by-level verification (L0 Pending → L1 Senior → L2 1-on-1 → L3 Lead). Form:{" "}
            <code className="text-xs px-1.5 py-0.5 rounded bg-muted">/counsellor-apply</code>
          </p>
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto min-h-[38px]" onClick={loadApplications} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-[11px] sm:text-xs text-muted-foreground">Total</div>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-[11px] sm:text-xs text-muted-foreground">L0 Pending</div>
            <div className="text-xl sm:text-2xl font-bold text-amber-500">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-[11px] sm:text-xs text-muted-foreground">L1 Seniors</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-500">{stats.l1}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="text-[11px] sm:text-xs text-muted-foreground">L2 1-on-1</div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-500">{stats.l2}</div>
          </CardContent>
        </Card>
        <Card className="col-span-2 sm:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="text-[11px] sm:text-xs text-muted-foreground">L3 Lead</div>
            <div className="text-xl sm:text-2xl font-bold text-purple-500">{stats.l3}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            className="pl-9 min-h-[40px]"
            placeholder="Search name, phone, college, branch, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2.5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36 min-h-[40px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-40 min-h-[40px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="0">Level 0 (Pending)</SelectItem>
              <SelectItem value="1">Level 1 (Senior)</SelectItem>
              <SelectItem value="2">Level 2 (1-on-1)</SelectItem>
              <SelectItem value="3">Level 3 (Lead)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Applicants ({filtered.length})
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Tap any applicant to inspect phone number, email, uploaded proof, and L2 quiz answers.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6 pt-0">
          {loading ? (
            <div className="py-10 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No counsellor applications match your filters.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1.5 cursor-pointer flex-1 min-w-0" onClick={() => openDetails(app)}>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-sm">{app.full_name}</span>
                      <Badge variant="outline" className="text-[11px]">
                        {LEVEL_META[app.verification_level]?.shortLabel || `L${app.verification_level}`}
                      </Badge>
                      <Badge
                        variant={
                          app.status === "active"
                            ? "default"
                            : app.status === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                        className="text-[11px] capitalize"
                      >
                        {app.status}
                      </Badge>
                      {app.l2_quiz_score !== null && (
                        <Badge variant="secondary" className="text-[11px]">
                          L2: {app.l2_quiz_score}/{app.l2_quiz_total}
                        </Badge>
                      )}
                      {app.expected_earning && (
                        <Badge variant="outline" className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          {app.expected_earning}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {app.college_name} • {app.branch} • {app.current_status} • {app.exam_quota}
                      {app.entrance_rank ? ` (Rank ${app.entrance_rank})` : ""}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      {app.phone_number && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {app.phone_number}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 truncate">
                        <Mail className="h-3 w-3" /> {app.email}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" /> {app.contact_handle}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none min-h-[36px]" onClick={() => openDetails(app)}>
                      Full Details
                    </Button>
                    {app.verification_level < 1 && (
                      <Button
                        size="sm"
                        className="flex-1 sm:flex-none min-h-[36px]"
                        disabled={updatingId === app.id}
                        onClick={() =>
                          handleUpdate(app, { verification_level: 1, status: "active" }, "Approved as Level 1 Senior")
                        }
                      >
                        <GraduationCap className="h-3.5 w-3.5 mr-1" />
                        Approve L1
                      </Button>
                    )}
                    {app.verification_level === 1 && (
                      <Button
                        size="sm"
                        className="flex-1 sm:flex-none min-h-[36px]"
                        disabled={updatingId === app.id}
                        onClick={() =>
                          handleUpdate(app, { verification_level: 2, status: "active" }, "Promoted to Level 2 Counsellor")
                        }
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        Promote L2
                      </Button>
                    )}
                    {app.verification_level === 2 && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 sm:flex-none min-h-[36px]"
                        disabled={updatingId === app.id}
                        onClick={() =>
                          handleUpdate(app, { verification_level: 3, status: "active" }, "Promoted to Level 3 Lead")
                        }
                      >
                        <Award className="h-3.5 w-3.5 mr-1" />
                        Promote L3
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Applicant Details Modal (Mobile Optimized) */}
      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2 text-base sm:text-lg pr-6">
                  {selected.full_name}
                  <Badge variant="outline">{LEVEL_META[selected.verification_level]?.shortLabel}</Badge>
                  <Badge variant={selected.status === "active" ? "default" : "secondary"} className="capitalize">
                    {selected.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  {selected.college_name} • {selected.branch} ({selected.current_status}) • Applied{" "}
                  {new Date(selected.created_at).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 text-sm">
                {/* Direct Contact Card */}
                <div className="p-3 rounded-xl border bg-muted/30 space-y-2 text-xs">
                  <div className="font-semibold text-foreground">Contact Information</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border">
                      <span className="flex items-center gap-1.5 truncate">
                        <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                        {selected.phone_number ? (
                          <a href={`tel:${selected.phone_number}`} className="underline">
                            {selected.phone_number}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not provided</span>
                        )}
                      </span>
                      {selected.phone_number && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => copyText(selected.phone_number!, "Phone")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border">
                      <span className="flex items-center gap-1.5 truncate">
                        <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                        <a href={`mailto:${selected.email}`} className="underline truncate">
                          {selected.email}
                        </a>
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                        onClick={() => copyText(selected.email, "Email")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-background border sm:col-span-2">
                      <span className="flex items-center gap-1.5 truncate">
                        <MessageCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>Handle: {selected.contact_handle}</span>
                      </span>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                        onClick={() => copyText(selected.contact_handle, "Handle")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Academic & Session Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs p-3 rounded-xl border bg-muted/20">
                  <div><strong>Exam / Quota:</strong> {selected.exam_quota}</div>
                  <div><strong>Entrance Rank:</strong> {selected.entrance_rank ?? "Not provided"}</div>
                  <div><strong>Admission Year:</strong> {selected.admission_year ?? "N/A"}</div>
                  <div><strong>Availability:</strong> {selected.weekly_availability}</div>
                  <div><strong>Expected Earning:</strong> {selected.expected_earning || "Not specified"}</div>
                  <div><strong>1-on-1 Opt-in:</strong> {selected.wants_one_on_one ? "Yes" : "No (L1 only)"}</div>
                  <div><strong>Highlight Badge:</strong> {selected.highlight_badge || "None"}</div>
                  {selected.linkedin_url && (
                    <div className="sm:col-span-2 flex items-center gap-1.5">
                      <Linkedin className="h-3.5 w-3.5 text-blue-600" />
                      <a href={selected.linkedin_url} target="_blank" rel="noopener noreferrer" className="underline text-primary truncate">
                        {selected.linkedin_url}
                      </a>
                    </div>
                  )}
                  {selected.booking_url && (
                    <div className="sm:col-span-2 flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                      <a href={selected.booking_url} target="_blank" rel="noopener noreferrer" className="underline text-primary truncate">
                        {selected.booking_url}
                      </a>
                    </div>
                  )}
                </div>

                {/* Bio & Motivation */}
                {selected.bio && (
                  <div className="p-3 rounded-xl border text-xs space-y-1">
                    <div className="font-semibold text-muted-foreground">Bio</div>
                    <p>{selected.bio}</p>
                  </div>
                )}
                {selected.motivation && (
                  <div className="p-3 rounded-xl border text-xs space-y-1">
                    <div className="font-semibold text-muted-foreground">Motivation / Experience</div>
                    <p className="text-muted-foreground">{selected.motivation}</p>
                  </div>
                )}

                {/* L1 Proof File Preview & Download */}
                <div className="p-3 rounded-xl border space-y-2.5 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">Level 1 Verification Proof</span>
                    {selected.l1_proof_url && selected.l1_proof_url.startsWith("http") && (
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                          <a href={selected.l1_proof_url} target="_blank" rel="noopener noreferrer">
                            Open <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                        <Button size="sm" variant="secondary" className="h-7 text-xs" asChild>
                          <a href={selected.l1_proof_url} download target="_blank" rel="noopener noreferrer">
                            Download <Download className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                  {selected.l1_proof_url ? (
                    isImageUrl(selected.l1_proof_url) ? (
                      <img
                        src={selected.l1_proof_url}
                        alt="L1 Proof"
                        className="max-h-64 w-full object-contain rounded-lg border bg-black/5"
                      />
                    ) : (
                      <div className="p-2 rounded bg-muted/50 break-all text-muted-foreground">
                        {selected.l1_proof_url}
                      </div>
                    )
                  ) : (
                    <div className="text-muted-foreground">No proof provided.</div>
                  )}
                </div>

                {/* L2 Quiz Breakdown */}
                {selected.l2_quiz_score !== null && (
                  <div className="p-3 rounded-xl border space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Level 2 Scenario Check</span>
                      <Badge variant="secondary">
                        Score: {selected.l2_quiz_score} / {selected.l2_quiz_total}
                      </Badge>
                    </div>
                    {selected.l2_quiz_answers && (
                      <div className="space-y-1.5 pt-1">
                        {L2_SCENARIO_QUESTIONS.map((q, idx) => {
                          const chosen = selected.l2_quiz_answers?.[q.id];
                          const correct = chosen === q.correctIndex;
                          return (
                            <div
                              key={q.id}
                              className={`p-2 rounded-lg border ${
                                correct ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"
                              }`}
                            >
                              <div className="font-medium">
                                Q{idx + 1}: {correct ? "Correct" : "Incorrect"}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                Selected: {chosen !== undefined ? q.options[chosen] : "No answer"}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Topics, Languages, Modes */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-muted-foreground">Topics, Languages & Modes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.topics.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[11px]">{t}</Badge>
                    ))}
                    {selected.languages.map((l) => (
                      <Badge key={l} variant="outline" className="text-[11px]">{l}</Badge>
                    ))}
                    {selected.session_modes.map((m) => (
                      <Badge key={m} variant="outline" className="text-[11px]">{m}</Badge>
                    ))}
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-muted-foreground">Admin Notes</div>
                  <Textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Verification notes or rejection reason..."
                  />
                </div>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between pt-2">
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full sm:w-auto min-h-[38px]"
                  disabled={updatingId === selected.id}
                  onClick={() => handleDelete(selected.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="min-h-[38px]"
                    disabled={updatingId === selected.id}
                    onClick={() =>
                      handleUpdate(selected, { status: "rejected", admin_notes: adminNotes }, "Application rejected")
                    }
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="min-h-[38px]"
                    disabled={updatingId === selected.id}
                    onClick={() =>
                      handleUpdate(selected, { status: "suspended", admin_notes: adminNotes }, "Counsellor suspended")
                    }
                  >
                    <Ban className="h-3.5 w-3.5 mr-1" />
                    Suspend
                  </Button>
                  <Button
                    size="sm"
                    className="min-h-[38px]"
                    disabled={updatingId === selected.id}
                    onClick={() =>
                      handleUpdate(
                        selected,
                        { verification_level: 1, status: "active", admin_notes: adminNotes },
                        "Verified as Level 1 Senior"
                      )
                    }
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                    Set L1
                  </Button>
                  <Button
                    size="sm"
                    className="min-h-[38px]"
                    disabled={updatingId === selected.id}
                    onClick={() =>
                      handleUpdate(
                        selected,
                        { verification_level: 2, status: "active", admin_notes: adminNotes },
                        "Verified as Level 2 1-on-1 Counsellor"
                      )
                    }
                  >
                    <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                    Set L2
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="col-span-2 sm:col-span-1 min-h-[38px]"
                    disabled={updatingId === selected.id}
                    onClick={() =>
                      handleUpdate(
                        selected,
                        { verification_level: 3, status: "active", admin_notes: adminNotes },
                        "Promoted to Level 3 Lead"
                      )
                    }
                  >
                    <Award className="h-3.5 w-3.5 mr-1" />
                    Set L3
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

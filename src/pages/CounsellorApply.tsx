import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  CounsellorRecruitmentService,
  L2_SCENARIO_QUESTIONS,
  scoreL2Quiz,
} from "@/lib/counsellor-recruitment-service";
import {
  ShieldCheck,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Users,
  Award,
  Loader2,
  ClipboardCheck,
  Upload,
  FileCheck2,
  X,
  MessageSquare,
  IndianRupee,
} from "lucide-react";

const REDDIT_CONTACT_URL = "https://www.reddit.com/user/Elegant_Compote9073/";
const EARNING_PRESETS = [
  "Volunteer / Free",
  "₹100–₹250 / session",
  "₹250–₹500 / session",
  "₹500+ / session",
  "Monthly stipend",
];

const TOPIC_OPTIONS = [
  "Option Entry & Choice Filling",
  "Round 1–3 / Extended Round Strategy",
  "Document Verification & Clause Codes",
  "College & Branch Comparison",
  "Hostel, Campus Life & Placements",
  "KCET vs Other Exams Decision",
];

const LANGUAGE_OPTIONS = ["English", "Kannada", "Hindi", "Telugu", "Tamil"];
const SESSION_MODES = ["Google Meet / Zoom", "Audio Call", "Text / Chat"];

export default function CounsellorApply() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [submittedResult, setSubmittedResult] = useState<{
    id?: string;
    quizScore?: number;
    quizTotal?: number;
  } | null>(null);

  // Step 1: Identity & Academic
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactHandle, setContactHandle] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [branch, setBranch] = useState("");
  const [currentStatus, setCurrentStatus] = useState("2nd Year");
  const [examQuota, setExamQuota] = useState("KCET");
  const [entranceRank, setEntranceRank] = useState("");
  const [admissionYear, setAdmissionYear] = useState("2024");
  const [bio, setBio] = useState("");
  const [topics, setTopics] = useState<string[]>(["Option Entry & Choice Filling"]);
  const [languages, setLanguages] = useState<string[]>(["English"]);

  // Step 2: Verification Proof & Availability
  const [l1ProofUrl, setL1ProofUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [highlightBadge, setHighlightBadge] = useState("");
  const [weeklyAvailability, setWeeklyAvailability] = useState("Weekends (2–4 slots/week)");
  const [expectedEarning, setExpectedEarning] = useState("₹100–₹250 / session");
  const [sessionModes, setSessionModes] = useState<string[]>(["Google Meet / Zoom"]);
  const [bookingUrl, setBookingUrl] = useState("");
  const [motivation, setMotivation] = useState("");
  const [wantsOneOnOne, setWantsOneOnOne] = useState(true);
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);

  // Step 3: L2 Scenario Check
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast({
        title: "File too large",
        description: "Please upload an image or PDF under 5 MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadingProof(true);
    const res = await CounsellorRecruitmentService.uploadProofFile(file);
    setUploadingProof(false);

    if (!res.success || !res.url) {
      toast({
        title: "Upload failed",
        description: res.error || "You can paste a Google Drive / Imgur link below instead.",
        variant: "destructive",
      });
      return;
    }

    setL1ProofUrl(res.url);
    setUploadedFileName(file.name);
    toast({ title: "Proof file uploaded", description: file.name });
  };

  const validateStep1 = () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !contactHandle.trim() ||
      !collegeName.trim() ||
      !branch.trim()
    ) {
      toast({
        title: "Missing required fields",
        description: "Please fill in your name, email, phone number, contact handle, college, and branch.",
        variant: "destructive",
      });
      return false;
    }
    if (topics.length === 0) {
      toast({
        title: "Select at least one topic",
        description: "Pick the counselling areas you can help students with.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!l1ProofUrl.trim()) {
      toast({
        title: "Verification proof required for Level 1",
        description: "Upload your College ID / allotment slip or paste a Drive link.",
        variant: "destructive",
      });
      return false;
    }
    if (sessionModes.length === 0) {
      toast({
        title: "Select a session mode",
        description: "Choose at least one way you can conduct sessions.",
        variant: "destructive",
      });
      return false;
    }
    if (!agreedToGuidelines) {
      toast({
        title: "Agreement required",
        description: "Please confirm the non-official advisory & code of conduct guidelines.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    let l2Score: number | null = null;
    let l2Total: number | null = null;
    let l2AnswersPayload: Record<string, number> | null = null;

    if (wantsOneOnOne) {
      const answeredCount = Object.keys(quizAnswers).length;
      if (answeredCount < L2_SCENARIO_QUESTIONS.length) {
        toast({
          title: "Complete the Level 2 scenario check",
          description: `Please answer all ${L2_SCENARIO_QUESTIONS.length} questions before submitting.`,
          variant: "destructive",
        });
        return;
      }
      const result = scoreL2Quiz(quizAnswers);
      l2Score = result.score;
      l2Total = result.total;
      l2AnswersPayload = quizAnswers;
    }

    setSubmitting(true);
    const res = await CounsellorRecruitmentService.submitApplication({
      full_name: fullName.trim(),
      email: email.trim(),
      phone_number: phoneNumber.trim(),
      contact_handle: contactHandle.trim(),
      college_name: collegeName.trim(),
      branch: branch.trim(),
      current_status: currentStatus,
      exam_quota: examQuota,
      entrance_rank: entranceRank ? parseInt(entranceRank, 10) : null,
      admission_year: admissionYear ? parseInt(admissionYear, 10) : null,
      bio,
      topics,
      languages,
      highlight_badge: highlightBadge,
      weekly_availability: weeklyAvailability,
      expected_earning: expectedEarning,
      session_modes: sessionModes,
      booking_url: bookingUrl,
      linkedin_url: linkedinUrl,
      motivation,
      wants_one_on_one: wantsOneOnOne,
      l1_proof_url: l1ProofUrl,
      l2_quiz_answers: l2AnswersPayload,
      l2_quiz_score: l2Score,
      l2_quiz_total: l2Total,
      agreed_to_guidelines: agreedToGuidelines,
    });
    setSubmitting(false);

    if (!res.success) {
      toast({
        title: "Submission failed",
        description: res.error || "Please try again.",
        variant: "destructive",
      });
      return;
    }

    setSubmittedResult({
      id: res.id,
      quizScore: l2Score ?? undefined,
      quizTotal: l2Total ?? undefined,
    });
    toast({
      title: "Application submitted!",
      description: "Your profile is now in the Level-by-Level verification queue.",
    });
  };

  if (submittedResult) {
    return (
      <div className="container max-w-2xl mx-auto py-8 sm:py-12 px-3 sm:px-4">
        <Helmet>
          <title>Application Received | KCET Coded</title>
        </Helmet>
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="text-center space-y-3 p-4 sm:p-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Application Received</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Thanks for stepping up to guide incoming students. Here is how your level-by-level verification works:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            {submittedResult.quizScore !== undefined && (
              <div className="p-3 rounded-lg border bg-background/60 flex items-center justify-between text-sm">
                <span className="font-medium">Level 2 Scenario Check Score</span>
                <Badge variant="secondary">
                  {submittedResult.quizScore} / {submittedResult.quizTotal}
                </Badge>
              </div>
            )}
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p><strong>1. Level 0 → Level 1 (Verified Senior):</strong> An admin checks your college ID / allotment proof and activates your public senior card.</p>
              <p><strong>2. Level 1 → Level 2 (1-on-1 Counsellor):</strong> Your scenario check & rank credentials are reviewed so you can host 1-on-1 option-entry and round-strategy sessions.</p>
              <p><strong>3. Level 2 → Level 3 (Lead Counsellor):</strong> Earned after completing 1-on-1 sessions with strong student feedback.</p>
            </div>
            <Button className="w-full min-h-[44px]" variant="outline" onClick={() => window.location.assign("/")}>
              Back to Home
            </Button>
            <Button className="w-full min-h-[44px]" variant="secondary" asChild>
              <a href={REDDIT_CONTACT_URL} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="mr-2 h-4 w-4" />
                Message u/Elegant_Compote9073 on Reddit
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-5 sm:py-8 px-3 sm:px-4 space-y-5 sm:space-y-6">
      <Helmet>
        <title>1-on-1 Counselling Member Recruitment | KCET Coded</title>
      </Helmet>

      {/* Header & Verification Ladder */}
      <div className="space-y-2.5 sm:space-y-3">
        <Badge variant="secondary" className="gap-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5" />
          1-on-1 Counselling Recruitment Drive
        </Badge>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
          Join the Verified Student Counsellor Team
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Help incoming KCET students navigate option entry, round upgrades, document verification, and campus life. We use a 3-level verification ladder to keep advice accurate and trustworthy.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl border bg-muted/30">
          <span className="text-xs text-muted-foreground">
            Have questions or want to reach out directly before applying?
          </span>
          <Button size="sm" variant="outline" className="w-full sm:w-auto min-h-[38px] shrink-0" asChild>
            <a href={REDDIT_CONTACT_URL} target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-1.5 h-3.5 w-3.5 text-orange-500" />
              DM u/Elegant_Compote9073 on Reddit
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
          <div className="p-3 rounded-xl border bg-card/60 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-500">
              <GraduationCap className="h-4 w-4 shrink-0" />
              Level 1 • Verified Senior
            </div>
            <p className="text-xs text-muted-foreground">
              College ID / allotment verified. Answer campus, hostel & branch Q&A.
            </p>
          </div>
          <div className="p-3 rounded-xl border bg-card/60 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              Level 2 • 1-on-1 Counsellor
            </div>
            <p className="text-xs text-muted-foreground">
              Passes KEA rules scenario check. Cleared for 1-on-1 counselling slots.
            </p>
          </div>
          <div className="p-3 rounded-xl border bg-card/60 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
              <Award className="h-4 w-4 shrink-0" />
              Level 3 • Lead Counsellor
            </div>
            <p className="text-xs text-muted-foreground">
              Earned via verified 1-on-1 sessions & high student ratings.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile-friendly Stepper Indicator */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-medium overflow-x-auto pb-1">
        <Badge variant={step === 1 ? "default" : "secondary"} className="shrink-0">
          1. Profile & Academics
        </Badge>
        <span className="text-muted-foreground shrink-0">→</span>
        <Badge variant={step === 2 ? "default" : "secondary"} className="shrink-0">
          2. L1 Proof & Slots
        </Badge>
        {wantsOneOnOne && (
          <>
            <span className="text-muted-foreground shrink-0">→</span>
            <Badge variant={step === 3 ? "default" : "secondary"} className="shrink-0">
              3. L2 Check
            </Badge>
          </>
        )}
      </div>

      <Card>
        {step === 1 && (
          <>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-5 w-5 text-primary shrink-0" />
                Step 1: Identity & Academic Background
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Your phone, email, and handle stay private with admins; your college, branch, and bio appear on your mentor card once verified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Full Name *</Label>
                  <Input className="min-h-[42px]" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g., Aditya Kumar" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Email Address *</Label>
                  <Input className="min-h-[42px]" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Phone Number *</Label>
                  <Input
                    className="min-h-[42px]"
                    type="tel"
                    inputMode="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98XXXXXXXX"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">WhatsApp / Telegram / Discord *</Label>
                  <Input className="min-h-[42px]" value={contactHandle} onChange={(e) => setContactHandle(e.target.value)} placeholder="e.g., @handle or same as phone" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">College Name *</Label>
                  <Input className="min-h-[42px]" value={collegeName} onChange={(e) => setCollegeName(e.target.value)} placeholder="e.g., RV College of Engineering" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Branch / Course *</Label>
                  <Input className="min-h-[42px]" value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="e.g., Computer Science (CSE)" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Current Status *</Label>
                  <Select value={currentStatus} onValueChange={setCurrentStatus}>
                    <SelectTrigger className="min-h-[42px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                      <SelectItem value="Alumni">Alumni</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Admission Quota / Exam</Label>
                  <Select value={examQuota} onValueChange={setExamQuota}>
                    <SelectTrigger className="min-h-[42px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KCET">KCET</SelectItem>
                      <SelectItem value="COMEDK">COMEDK</SelectItem>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Rank (Optional)</Label>
                  <Input className="min-h-[42px]" type="number" inputMode="numeric" value={entranceRank} onChange={(e) => setEntranceRank(e.target.value)} placeholder="e.g., 2450" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Admission Year</Label>
                  <Input className="min-h-[42px]" type="number" inputMode="numeric" value={admissionYear} onChange={(e) => setAdmissionYear(e.target.value)} placeholder="2024" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Short Bio / Headline</Label>
                <Input
                  className="min-h-[42px]"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={140}
                  placeholder="e.g., 3rd Yr CSE @ RVCE • Upgraded from R1 to R2 via Choice 2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Topics You Can Counsel On *</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TOPIC_OPTIONS.map((t) => (
                    <label key={t} className="flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer hover:bg-muted/40 min-h-[42px]">
                      <Checkbox checked={topics.includes(t)} onCheckedChange={() => toggleItem(topics, setTopics, t)} />
                      <span>{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Languages Spoken</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <Button
                      key={lang}
                      type="button"
                      size="sm"
                      className="min-h-[36px]"
                      variant={languages.includes(lang) ? "default" : "outline"}
                      onClick={() => toggleItem(languages, setLanguages, lang)}
                    >
                      {lang}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="button"
                  className="w-full sm:w-auto min-h-[44px]"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                >
                  Next: L1 Verification & Availability
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ShieldCheck className="h-5 w-5 text-blue-500 shrink-0" />
                Step 2: Level 1 Proof & Session Setup
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Upload your College ID or KEA allotment slip (only visible to admins) and set your availability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              {/* File Upload + URL Fallback */}
              <div className="space-y-2.5 p-3.5 rounded-xl border bg-muted/20">
                <Label className="text-xs sm:text-sm">College ID / Allotment Proof * (Image or PDF, max 5 MB)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="min-h-[42px] w-full sm:w-auto"
                    disabled={uploadingProof}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadingProof ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploadingProof ? "Uploading..." : "Upload ID / Slip"}
                  </Button>
                  {uploadedFileName && (
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex-1">
                      <span className="flex items-center gap-1.5 truncate">
                        <FileCheck2 className="h-4 w-4 shrink-0" />
                        <span className="truncate">{uploadedFileName}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedFileName(null);
                          setL1ProofUrl("");
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] text-muted-foreground">Or paste a Google Drive / Imgur link</Label>
                  <Input
                    className="min-h-[40px] text-xs"
                    value={l1ProofUrl}
                    onChange={(e) => {
                      setL1ProofUrl(e.target.value);
                      if (uploadedFileName) setUploadedFileName(null);
                    }}
                    placeholder="https://drive.google.com/... or uploaded file URL"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">LinkedIn Profile URL (Optional)</Label>
                  <Input className="min-h-[42px]" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Highlight Tag (Optional)</Label>
                  <Input className="min-h-[42px]" value={highlightBadge} onChange={(e) => setHighlightBadge(e.target.value)} placeholder="e.g., Intern @ Microsoft / KEA R3" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Weekly Availability *</Label>
                  <Input
                    className="min-h-[42px]"
                    value={weeklyAvailability}
                    onChange={(e) => setWeeklyAvailability(e.target.value)}
                    placeholder="e.g., Weekends 5–8 PM (3 slots/week)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm">Cal.com / Calendly Link (Optional)</Label>
                  <Input className="min-h-[42px]" value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} placeholder="https://cal.com/your-handle" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm flex items-center gap-1.5">
                  <IndianRupee className="h-3.5 w-3.5 text-primary" />
                  How much would you like to earn from this guidance?
                </Label>
                <div className="flex flex-wrap gap-2">
                  {EARNING_PRESETS.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      size="sm"
                      className="min-h-[36px] text-xs"
                      variant={expectedEarning === preset ? "default" : "outline"}
                      onClick={() => setExpectedEarning(preset)}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
                <Input
                  className="min-h-[42px]"
                  value={expectedEarning}
                  onChange={(e) => setExpectedEarning(e.target.value)}
                  placeholder="Or type your expected payout (e.g., ₹200/session or ₹3,000/month)"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs sm:text-sm">Preferred Session Modes *</Label>
                <div className="flex flex-wrap gap-2">
                  {SESSION_MODES.map((mode) => (
                    <Button
                      key={mode}
                      type="button"
                      size="sm"
                      className="min-h-[38px]"
                      variant={sessionModes.includes(mode) ? "default" : "outline"}
                      onClick={() => toggleItem(sessionModes, setSessionModes, mode)}
                    >
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm">Why do you want to join? / Past mentoring experience</Label>
                <Textarea
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Briefly share what you wish you knew during your own counselling..."
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-muted/30">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-medium">Apply for Level 2 (1-on-1 Counselling Sessions)</div>
                  <div className="text-[11px] sm:text-xs text-muted-foreground">
                    Includes a quick 5-question KEA rules check in Step 3. Turn off for Level 1 (general campus Q&A only).
                  </div>
                </div>
                <Switch checked={wantsOneOnOne} onCheckedChange={setWantsOneOnOne} />
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer">
                <Checkbox
                  checked={agreedToGuidelines}
                  onCheckedChange={(v) => setAgreedToGuidelines(Boolean(v))}
                />
                <span className="text-muted-foreground leading-relaxed">
                  I understand this is a non-official student guidance initiative. I will not make guaranteed allotment claims, solicit unauthorized fees, or share misleading KEA/COMEDK rules.
                </span>
              </label>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
                <Button type="button" variant="outline" className="min-h-[44px]" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                {wantsOneOnOne ? (
                  <Button
                    type="button"
                    className="min-h-[44px]"
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                  >
                    Next: L2 Scenario Check
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" className="min-h-[44px]" disabled={submitting} onClick={handleSubmit}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit for Level 1 Verification
                  </Button>
                )}
              </div>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ClipboardCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                Step 3: Level 2 Counselling Scenario Check
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                5 quick scenario questions to verify your understanding of KEA choice rules and responsible guidance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 p-4 sm:p-6 pt-0">
              {L2_SCENARIO_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="p-3 sm:p-4 rounded-xl border space-y-2.5">
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const selected = quizAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                          className={`w-full text-left text-xs p-3 rounded-lg border transition-colors min-h-[42px] ${
                            selected
                              ? "border-primary bg-primary/10 font-medium"
                              : "hover:bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2">
                <Button type="button" variant="outline" className="min-h-[44px]" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="button" className="min-h-[44px]" disabled={submitting} onClick={handleSubmit}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}

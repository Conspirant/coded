import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { type PucQuestion, type PucSubjectKey } from "@/data/puc-qb";
import { MathRenderer } from "@/components/MathRenderer";
import { AlertTriangle, CheckCircle2, Flag, Loader2 } from "lucide-react";

interface ReportPucQuestionModalProps {
  question: PucQuestion | null;
  subject: PucSubjectKey;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const REPORT_REASONS = [
  { id: "wrong_key", label: "Wrong Answer Key", desc: "The verified correct answer differs from the KSEAB key shown" },
  { id: "missing_diagram", label: "Missing / Clipped Diagram", desc: "Figure, graph, circuit, or table is missing or cropped" },
  { id: "typo_formula", label: "Typo or Broken Math", desc: "LaTeX formula has a syntax error or text has OCR typos" },
  { id: "missing_content", label: "Incomplete Question / Options", desc: "Part of the question stem or options is missing or merged" },
  { id: "other", label: "Other Discrepancy", desc: "Duplicate question or chapter mismatch" },
] as const;

export function ReportPucQuestionModal({
  question,
  subject,
  open,
  onOpenChange,
}: ReportPucQuestionModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("wrong_key");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  if (!question) return null;

  const subjectLabel = subject.charAt(0).toUpperCase() + subject.slice(1);
  const currentAnswerText =
    question.type === "mcq"
      ? `${String.fromCharCode(65 + question.correctIndex)}${question.options[question.correctIndex] ? `: ${question.options[question.correctIndex]}` : ""}`
      : question.answer;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const reasonObj = REPORT_REASONS.find((r) => r.id === selectedReason) || REPORT_REASONS[0];

      const reportPayload = {
        college_code: "PUC_QB_REPORT",
        status: "pending",
        current_data: {
          question_id: question.id,
          subject: subjectLabel,
          subject_key: subject,
          chapter_number: question.chapterNumber,
          chapter_name: question.chapterName,
          question_number: question.questionNumber,
          question_type: question.type,
          question_preview: question.question.slice(0, 220),
          correct_answer: currentAnswerText,
          image_url: question.imageUrl || null,
        },
        suggested_data: {
          type: "puc_qb_discrepancy",
          question_id: question.id,
          subject: subjectLabel,
          subject_key: subject,
          chapter_number: question.chapterNumber,
          chapter_name: question.chapterName,
          question_number: question.questionNumber,
          question_type: question.type,
          reason: selectedReason,
          reason_label: reasonObj.label,
          comment: comment.trim(),
          reported_at: new Date().toISOString(),
        },
      };

      const { error } = await supabase.from("college_suggestions" as any).insert([reportPayload]);
      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Report Sent to Developer",
        description: "Thank you! The admin will review this 2nd PUC question.",
      });
      setTimeout(() => {
        setSubmitted(false);
        setComment("");
        onOpenChange(false);
      }, 1100);
    } catch (err: any) {
      toast({
        title: "Failed to submit report",
        description: err.message || "Please check your network connection.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-lg max-h-[88dvh] sm:max-h-[85vh] flex flex-col p-0 gap-0 bg-slate-950 border border-white/15 text-white shadow-2xl rounded-2xl overflow-hidden focus:outline-none focus-visible:outline-none">
        <DialogHeader className="px-5 py-4 border-b border-white/10 shrink-0 bg-slate-950/95 backdrop-blur text-left pr-12">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-white">
            <Flag className="h-4 w-4 text-rose-400 shrink-0" />
            Report Question Discrepancy
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 mt-1">
            Flag errors in the 2nd PUC Question Bank. Reports appear in the Admin PUC QB section.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-12 px-6 text-center space-y-3 my-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white">Report Successfully Submitted!</p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Our team will verify this question against the official KSEAB question bank and key.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-y-auto px-5 py-4 space-y-4 flex-1 overscroll-contain">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <Badge variant="outline" className="font-mono bg-white/5 border-white/10 text-slate-300">
                    PDF Q.{question.questionNumber} · {question.type.toUpperCase()}
                  </Badge>
                  <Badge className="bg-indigo-500/15 text-indigo-300 border-0">
                    {subjectLabel} • Ch.{question.chapterNumber}
                  </Badge>
                  <span className="text-slate-400 truncate max-w-[200px]">
                    {question.chapterName}
                  </span>
                </div>
                <div className="text-xs text-slate-200 font-sans max-h-24 overflow-y-auto leading-relaxed pr-1">
                  <MathRenderer content={question.question} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-slate-300 font-semibold">
                  What is the issue with this question?
                </Label>
                <div className="grid grid-cols-1 gap-1.5">
                  {REPORT_REASONS.map((r) => {
                    const isSel = selectedReason === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedReason(r.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 sm:gap-3 cursor-pointer ${
                          isSel
                            ? "bg-rose-500/15 border-rose-500/60 text-white ring-1 ring-rose-500/40"
                            : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-slate-300"
                        }`}
                      >
                        <div
                          className={`mt-0.5 h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                            isSel ? "border-rose-400 bg-rose-500" : "border-white/30"
                          }`}
                        >
                          {isSel && <div className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold leading-tight">{r.label}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300 font-semibold">
                  Details or Corrections (Optional)
                </Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="E.g., Official KSEAB key specifies Option C, or matrix row 2 is missing..."
                  className="min-h-[64px] max-h-[110px] text-xs bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-rose-500/50 resize-y"
                />
              </div>
            </div>

            <DialogFooter className="px-5 py-3.5 border-t border-white/10 bg-slate-950/95 shrink-0 flex flex-row items-center justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={submitting}
                onClick={handleSubmit}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5 mr-1.5" /> Submit Report
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

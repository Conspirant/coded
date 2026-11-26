import { supabase } from "@/integrations/supabase/client";

export type VerificationLevel = 0 | 1 | 2 | 3;
export type ApplicationStatus = "pending" | "active" | "suspended" | "rejected";

export interface CounsellorApplication {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  contact_handle: string;
  college_name: string;
  branch: string;
  current_status: string;
  exam_quota: string;
  entrance_rank: number | null;
  admission_year: number | null;
  bio: string | null;
  topics: string[];
  languages: string[];
  highlight_badge: string | null;
  weekly_availability: string;
  expected_earning: string | null;
  session_modes: string[];
  booking_url: string | null;
  linkedin_url: string | null;
  motivation: string | null;
  wants_one_on_one: boolean;
  verification_level: VerificationLevel;
  status: ApplicationStatus;
  l1_proof_url: string | null;
  l1_verified_at: string | null;
  l2_quiz_answers: Record<string, number> | null;
  l2_quiz_score: number | null;
  l2_quiz_total: number | null;
  l2_verified_at: string | null;
  l3_promoted_at: string | null;
  sessions_completed: number;
  admin_notes: string | null;
  agreed_to_guidelines: boolean;
  created_at: string;
  updated_at: string;
}

export interface CounsellorApplicationInput {
  full_name: string;
  email: string;
  phone_number: string;
  contact_handle: string;
  college_name: string;
  branch: string;
  current_status: string;
  exam_quota: string;
  entrance_rank: number | null;
  admission_year: number | null;
  bio: string;
  topics: string[];
  languages: string[];
  highlight_badge: string;
  weekly_availability: string;
  expected_earning: string;
  session_modes: string[];
  booking_url: string;
  linkedin_url: string;
  motivation: string;
  wants_one_on_one: boolean;
  l1_proof_url: string;
  l2_quiz_answers: Record<string, number> | null;
  l2_quiz_score: number | null;
  l2_quiz_total: number | null;
  agreed_to_guidelines: boolean;
}

export interface L2ScenarioQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export const L2_SCENARIO_QUESTIONS: L2ScenarioQuestion[] = [
  {
    id: "kea_choice_2",
    question:
      "In KEA KCET counselling, a student is satisfied with their Round 1 allotted seat but wants to try for a higher-preference option in Round 2 while keeping the current seat as backup. Which Choice should they select?",
    options: [
      "Choice 1 — Accept and freeze the allotted seat",
      "Choice 2 — Accept the seat, pay fees, and participate in next round for upgradation",
      "Choice 3 — Reject the seat and participate in next round",
      "Choice 4 — Quit counselling completely",
    ],
    correctIndex: 1,
  },
  {
    id: "kea_choice_3_risk",
    question:
      "What happens if a student selects Choice 3 after Round 1 allotment?",
    options: [
      "They keep their Round 1 seat if nothing higher is allotted in Round 2",
      "They surrender the Round 1 seat and enter Round 2 without any backup seat",
      "They are automatically exited from KCET counselling",
      "Their fees are refunded only after Round 3",
    ],
    correctIndex: 1,
  },
  {
    id: "option_entry_order",
    question:
      "How should a student order their preferences in KEA option entry?",
    options: [
      "Put safe backup colleges at the top so they get allotted faster",
      "Put dream/highest-priority college-branch pairs strictly at the top in descending order of genuine preference",
      "Randomize order based on last year's Round 3 cutoffs only",
      "Enter only 5 options to avoid confusion",
    ],
    correctIndex: 1,
  },
  {
    id: "doc_verification",
    question:
      "If a student claims a Karnataka study clause (e.g., Clause A) during KCET counselling, what should a counsellor advise?",
    options: [
      "Tell them study certificates are optional if they have Aadhaar",
      "Advise them to verify exact required study/horanadu/gadinadu documents from the official KEA brochure and keep originals + attested copies ready",
      "Guarantee that KEA will accept any school bonafide letter",
      "Skip document verification until college reporting",
    ],
    correctIndex: 1,
  },
  {
    id: "counsellor_ethics",
    question:
      "A student asks you to guarantee they will get CSE at a top college in Round 2 based on 2024 cutoffs. What is the right response?",
    options: [
      "Confirm it is 100% guaranteed if last year's cutoff was higher than their rank",
      "Explain that cutoffs shift every round/year, walk them through historical trends & realistic backup options, and remind them guidance is advisory",
      "Ask them to pay a small fee for a guaranteed seat prediction",
      "Tell them to delete all other branches from option entry",
    ],
    correctIndex: 1,
  },
];

export function scoreL2Quiz(answers: Record<string, number>): { score: number; total: number } {
  let score = 0;
  for (const q of L2_SCENARIO_QUESTIONS) {
    if (answers[q.id] === q.correctIndex) {
      score += 1;
    }
  }
  return { score, total: L2_SCENARIO_QUESTIONS.length };
}

export const LEVEL_META: Record<
  VerificationLevel,
  { label: string; shortLabel: string; description: string }
> = {
  0: {
    label: "Level 0 — Applied (Pending)",
    shortLabel: "L0 Pending",
    description: "Application submitted; awaiting admin review.",
  },
  1: {
    label: "Level 1 — Verified Senior",
    shortLabel: "L1 Verified Senior",
    description: "College identity verified. Cleared for campus & branch Q&A.",
  },
  2: {
    label: "Level 2 — Certified 1-on-1 Counsellor",
    shortLabel: "L2 1-on-1 Counsellor",
    description: "Identity + counselling rules verified. Cleared for 1-on-1 sessions.",
  },
  3: {
    label: "Level 3 — Lead Counsellor",
    shortLabel: "L3 Lead Counsellor",
    description: "Proven 1-on-1 track record and featured directory placement.",
  },
};

const table = () => (supabase as any).from("counsellor_applications");
const PROOF_BUCKET = "counsellor-proofs";

export class CounsellorRecruitmentService {
  static async uploadProofFile(
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `proofs/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(PROOF_BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || (ext === "pdf" ? "application/pdf" : undefined),
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from(PROOF_BUCKET).getPublicUrl(path);
      return { success: true, url: publicData?.publicUrl };
    } catch (e: any) {
      console.error("Failed to upload proof file:", e);
      return {
        success: false,
        error: e?.message || "File upload failed. You can paste a Drive/Imgur link instead.",
      };
    }
  }
  static async submitApplication(
    input: CounsellorApplicationInput
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const payload = {
        ...input,
        phone_number: input.phone_number.trim() || null,
        expected_earning: input.expected_earning.trim() || null,
        entrance_rank: input.entrance_rank || null,
        admission_year: input.admission_year || null,
        bio: input.bio.trim() || null,
        highlight_badge: input.highlight_badge.trim() || null,
        booking_url: input.booking_url.trim() || null,
        linkedin_url: input.linkedin_url.trim() || null,
        motivation: input.motivation.trim() || null,
        l1_proof_url: input.l1_proof_url.trim() || null,
        verification_level: 0,
        status: "pending",
      };

      const { data, error } = await table().insert([payload]).select("id").single();
      if (error) throw error;
      return { success: true, id: data?.id };
    } catch (e: any) {
      console.error("Failed to submit counsellor application:", e);
      return { success: false, error: e?.message || "Submission failed" };
    }
  }

  static async getAllApplications(): Promise<CounsellorApplication[]> {
    try {
      const { data, error } = await table()
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as CounsellorApplication[];
    } catch (e) {
      console.error("Failed to fetch counsellor applications:", e);
      return [];
    }
  }

  static async getActiveCounsellors(collegeName?: string): Promise<CounsellorApplication[]> {
    try {
      let query = table()
        .select("*")
        .eq("status", "active")
        .gte("verification_level", 1)
        .order("verification_level", { ascending: false })
        .order("sessions_completed", { ascending: false });

      if (collegeName) {
        query = query.ilike("college_name", `%${collegeName}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as CounsellorApplication[];
    } catch (e) {
      console.error("Failed to fetch active counsellors:", e);
      return [];
    }
  }

  static async updateVerification(
    id: string,
    updates: {
      verification_level?: VerificationLevel;
      status?: ApplicationStatus;
      admin_notes?: string;
      highlight_badge?: string | null;
      sessions_completed?: number;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const now = new Date().toISOString();
      const patch: Record<string, any> = {
        ...updates,
        updated_at: now,
      };

      if (updates.verification_level === 1) {
        patch.l1_verified_at = now;
      } else if (updates.verification_level === 2) {
        patch.l2_verified_at = now;
      } else if (updates.verification_level === 3) {
        patch.l3_promoted_at = now;
      }

      const { error } = await table().update(patch).eq("id", id);
      if (error) throw error;
      return { success: true };
    } catch (e: any) {
      console.error("Failed to update counsellor verification:", e);
      return { success: false, error: e?.message || "Update failed" };
    }
  }

  static async deleteApplication(id: string): Promise<boolean> {
    try {
      const { error } = await table().delete().eq("id", id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Failed to delete counsellor application:", e);
      return false;
    }
  }
}

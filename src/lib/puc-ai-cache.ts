import { supabase } from "@/integrations/supabase/client";

const TABLE_NAME = "puc_ai_explanations";

export async function getCachedAiExplanation(questionId: string): Promise<string | null> {
  try {
    const { data, error } = await (supabase as any)
      .from(TABLE_NAME)
      .select("explanation")
      .eq("question_id", questionId)
      .maybeSingle();

    if (error || !data?.explanation) return null;
    return String(data.explanation);
  } catch {
    return null;
  }
}

export async function saveCachedAiExplanation(params: {
  questionId: string;
  subject: string;
  chapterNumber?: number;
  explanation: string;
}): Promise<void> {
  try {
    await (supabase as any)
      .from(TABLE_NAME)
      .upsert(
        {
          question_id: params.questionId,
          subject: params.subject,
          chapter_number: params.chapterNumber ?? null,
          explanation: params.explanation,
        },
        { onConflict: "question_id", ignoreDuplicates: true }
      );
  } catch {
    // Non-fatal: cache write failure should not block displaying the explanation
  }
}

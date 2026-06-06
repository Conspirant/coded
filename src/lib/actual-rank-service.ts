import { supabase } from "@/integrations/supabase/client"

export interface ActualRankSubmission {
  id?: string;
  kcet_marks: number;
  puc_aggregate: number;
  puc_board: string;
  actual_rank: number;
  category?: string | null;
  year?: number;
  created_at?: string | null;
}

export class ActualRankService {
  /** Submit official rank data anonymously to train the next year's predictor */
  static async submitRank(data: ActualRankSubmission): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('actual_rank_submissions')
        .insert([{
          kcet_marks: data.kcet_marks,
          puc_aggregate: data.puc_aggregate,
          puc_board: data.puc_board,
          actual_rank: data.actual_rank,
          category: data.category || null,
          year: data.year || 2026
        }])
      
      if (error) throw error;
      return { success: true };
    } catch (e: any) {
      console.error("Error submitting actual rank to Supabase:", e);
      return { success: false, error: e.message || "Failed to submit rank data" };
    }
  }

  /** Retrieve all submissions (useful for admins or statistical analysis) */
  static async getAllSubmissions(): Promise<ActualRankSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('actual_rank_submissions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error;
      return (data || []) as ActualRankSubmission[];
    } catch (e) {
      console.error("Error fetching rank submissions from Supabase:", e);
      return [];
    }
  }

  /** Delete a single submission (admin only) */
  static async deleteSubmission(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('actual_rank_submissions')
        .delete()
        .eq('id', id)
      
      if (error) throw error;
      return true;
    } catch (e) {
      console.error("Error deleting rank submission from Supabase:", e);
      return false;
    }
  }
}

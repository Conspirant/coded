import { supabase } from "@/integrations/supabase/client"

export interface SuggestionEntry {
    id: string;
    suggestion: string;
    created_at: string | null;
}

export class AdminSuggestionsService {
    static async addSuggestion(suggestionText: string): Promise<{ success: boolean; error?: string }> {
        try {
            const { error } = await supabase
                .from('user_suggestions')
                .insert([{ suggestion: suggestionText }])
            
            if (error) throw error;
            return { success: true };
        } catch (e: any) {
            console.error("Error adding suggestion to Supabase:", e);
            return { success: false, error: e.message || "Failed to submit suggestion" };
        }
    }

    static async getAllSuggestions(): Promise<SuggestionEntry[]> {
        try {
            const { data, error } = await supabase
                .from('user_suggestions')
                .select('*')
                .order('created_at', { ascending: false })
            
            if (error) throw error;
            return (data || []) as SuggestionEntry[];
        } catch (e) {
            console.error("Error fetching suggestions from Supabase:", e);
            return [];
        }
    }

    static async deleteSuggestion(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('user_suggestions')
                .delete()
                .eq('id', id)
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Error deleting suggestion from Supabase:", e);
            return false;
        }
    }
    
    static async clearAll(): Promise<boolean> {
        try {
            // Delete all entries safely by applying a broad filter
            const { error } = await supabase
                .from('user_suggestions')
                .delete()
                .neq('id', '00000000-0000-0000-0000-000000000000')
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Error clearing suggestions from Supabase:", e);
            return false;
        }
    }
}

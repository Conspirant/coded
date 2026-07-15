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
                .not('suggestion', 'like', 'CONFIG:%')
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
            // Delete all entries safely by applying a filter that excludes config variables
            const { error } = await supabase
                .from('user_suggestions')
                .delete()
                .not('suggestion', 'like', 'CONFIG:%')
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Error clearing suggestions from Supabase:", e);
            return false;
        }
    }

    static async isPaywallDisabledGlobally(): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('user_suggestions')
                .select('suggestion')
                .like('suggestion', 'CONFIG:premium_paywall_enabled:false')
            
            if (error) throw error;
            return (data && data.length > 0);
        } catch (e) {
            console.error("Error checking paywall status:", e);
            return false;
        }
    }

    static async setPaywallDisabledGlobally(disabled: boolean): Promise<boolean> {
        try {
            // Delete any existing config rows first
            const { error: delError } = await supabase
                .from('user_suggestions')
                .delete()
                .like('suggestion', 'CONFIG:premium_paywall_enabled:%')
            
            if (delError) throw delError;

            if (disabled) {
                // Insert CONFIG:premium_paywall_enabled:false to bypass/disable paywall
                const { error: insError } = await supabase
                    .from('user_suggestions')
                    .insert([{ suggestion: 'CONFIG:premium_paywall_enabled:false' }])
                
                if (insError) throw insError;
            }
            return true;
        } catch (e) {
            console.error("Error setting paywall status:", e);
            return false;
        }
    }
}

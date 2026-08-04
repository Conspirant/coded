import { supabase } from "@/integrations/supabase/client"

export interface SuggestionEntry {
    id: string;
    suggestion: string;
    created_at: string | null;
}

export class AdminSuggestionsService {
    static async addSuggestion(suggestionText: string): Promise<{ success: boolean; error?: string }> {
        try {
            const suggestionId = `SUGGESTION:${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
            const { error } = await supabase
                .from('ugcet_results_cache')
                .insert([{
                    appl_no: suggestionId,
                    dob: 'suggestion',
                    name: 'suggestion',
                    results_json: { text: suggestionText }
                }]);
            
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
                .from('ugcet_results_cache')
                .select('*')
                .like('appl_no', 'SUGGESTION:%');
            
            if (error) throw error;

            // Sort manually in JS since PostgreSQL order on timestamptz columns works but we want to guarantee order
            const sortedData = (data || []).sort((a, b) => {
                const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
                const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
                return timeB - timeA;
            });

            return sortedData.map(row => ({
                id: row.appl_no,
                suggestion: (row.results_json as any)?.text || '',
                created_at: row.created_at
            })) as SuggestionEntry[];
        } catch (e) {
            console.error("Error fetching suggestions from Supabase:", e);
            return [];
        }
    }

    static async deleteSuggestion(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('ugcet_results_cache')
                .delete()
                .eq('appl_no', id);
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Error deleting suggestion from Supabase:", e);
            return false;
        }
    }
    
    static async clearAll(): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('ugcet_results_cache')
                .delete()
                .like('appl_no', 'SUGGESTION:%');
            
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
                .from('ugcet_results_cache')
                .select('results_json')
                .eq('appl_no', 'CONFIG:premium_paywall_enabled');
            
            if (error) throw error;
            if (data && data.length > 0) {
                return (data[0].results_json as any)?.disabled === true;
            }
            return false;
        } catch (e) {
            console.error("Error checking paywall status:", e);
            return false;
        }
    }

    static async setPaywallDisabledGlobally(disabled: boolean): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('ugcet_results_cache')
                .upsert([{
                    appl_no: 'CONFIG:premium_paywall_enabled',
                    dob: 'config',
                    name: 'config',
                    results_json: { disabled }
                }]);
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Error setting paywall status:", e);
            return false;
        }
    }

    static async getActiveDonationBroadcast(): Promise<number | null> {
        try {
            const { data, error } = await supabase
                .from('ugcet_results_cache')
                .select('results_json')
                .eq('appl_no', 'CONFIG:active_donation_broadcast')
                .maybeSingle();
            
            if (error) throw error;
            if (data && data.results_json) {
                return (data.results_json as any).broadcastId || null;
            }
            return null;
        } catch (e) {
            console.error("Error getting active broadcast:", e);
            return null;
        }
    }

    static async setActiveDonationBroadcast(broadcastId: number | null): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('ugcet_results_cache')
                .upsert([{
                    appl_no: 'CONFIG:active_donation_broadcast',
                    dob: 'config',
                    name: 'config',
                    results_json: { broadcastId }
                }], { onConflict: 'appl_no' });
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Error setting active broadcast:", e);
            return false;
        }
    }

    static async recordDonationAction(broadcastId: number, action: 'dismiss' | 'try'): Promise<boolean> {
        try {
            const key = `ANALYTICS:donation_${action}:${broadcastId}:${Math.random().toString(36).substring(2, 10)}`;
            const { error } = await supabase
                .from('ugcet_results_cache')
                .insert([{
                    appl_no: key,
                    dob: 'analytics',
                    name: 'analytics',
                    results_json: { broadcastId, action, timestamp: Date.now() }
                }]);
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Error recording donation action:", e);
            return false;
        }
    }

    static async getDonationActionCounts(broadcastId: number): Promise<{ dismiss: number; try: number }> {
        try {
            const { data, error } = await supabase
                .from('ugcet_results_cache')
                .select('appl_no')
                .like('appl_no', `ANALYTICS:donation_%:${broadcastId}:%`);

            if (error) throw error;
            let dismiss = 0;
            let tryCount = 0;

            for (const row of (data || [])) {
                if (row.appl_no.includes('donation_dismiss:')) {
                    dismiss++;
                } else if (row.appl_no.includes('donation_try:')) {
                    tryCount++;
                }
            }

            return { dismiss, try: tryCount };
        } catch (e) {
            console.error("Error getting action counts:", e);
            return { dismiss: 0, try: 0 };
        }
    }
}

import { supabase } from "@/integrations/supabase/client"

export interface SuggestionEntry {
    id: string;
    suggestion: string;
    created_at: string | null;
}

export interface SiteShutdownConfig {
    shutdown: boolean;
    errorCode?: string;
    title?: string;
    message?: string;
    buttonText?: string;
    showButton?: boolean;
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

    static async getBlockedPages(): Promise<string[]> {
        try {
            const { data, error } = await supabase
                .from('ugcet_results_cache')
                .select('results_json')
                .eq('appl_no', 'CONFIG:blocked_pages')
                .maybeSingle();
            
            if (error) throw error;
            if (data && data.results_json) {
                return (data.results_json as any).blockedPaths || [];
            }
            return [];
        } catch (e) {
            console.error("Error getting blocked pages:", e);
            return [];
        }
    }

    static async setBlockedPages(blockedPaths: string[]): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('ugcet_results_cache')
                .upsert([{
                    appl_no: 'CONFIG:blocked_pages',
                    dob: 'config',
                    name: 'config',
                    results_json: { blockedPaths }
                }], { onConflict: 'appl_no' });
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Error setting blocked pages:", e);
            return false;
        }
    }

    static async getMaintenancePages(): Promise<string[]> {
        try {
            const { data, error } = await supabase
                .from('ugcet_results_cache')
                .select('results_json')
                .eq('appl_no', 'CONFIG:maintenance_pages')
                .maybeSingle();
            
            if (error) throw error;
            if (data && data.results_json) {
                return (data.results_json as any).maintenancePaths || [];
            }
            return [];
        } catch (e) {
            console.error("Error getting maintenance pages:", e);
            return [];
        }
    }

    static async setMaintenancePages(maintenancePaths: string[]): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('ugcet_results_cache')
                .upsert([{
                    appl_no: 'CONFIG:maintenance_pages',
                    dob: 'config',
                    name: 'config',
                    results_json: { maintenancePaths }
                }], { onConflict: 'appl_no' });
            
            if (error) throw error;
            return true;
        } catch (e) {
            console.error("Error setting maintenance pages:", e);
            return false;
        }
    }

    static async getSiteShutdownConfig(): Promise<SiteShutdownConfig> {
        try {
            const { data, error } = await supabase
                .from('ugcet_results_cache')
                .select('results_json')
                .eq('appl_no', 'CONFIG:site_shutdown')
                .maybeSingle();
            
            if (error) throw error;
            if (data && data.results_json) {
                const json = data.results_json as any;
                const cfg: SiteShutdownConfig = {
                    shutdown: json.shutdown === true,
                    errorCode: json.errorCode || "404",
                    title: json.title || "Page Not Found",
                    message: json.message || "The requested URL {path} does not exist or has been moved.",
                    buttonText: json.buttonText || "Go Back",
                    showButton: json.showButton !== false
                };
                try { localStorage.setItem('kcet_site_shutdown_config_backup', JSON.stringify(cfg)); } catch {}
                return cfg;
            }

            const stored = localStorage.getItem('kcet_site_shutdown_config_backup');
            if (stored) {
                try { return JSON.parse(stored); } catch {}
            }

            return {
                shutdown: false,
                errorCode: "404",
                title: "Page Not Found",
                message: "The requested URL {path} does not exist or has been moved.",
                buttonText: "Go Back",
                showButton: true
            };
        } catch (e) {
            console.error("Error getting site shutdown config:", e);
            const stored = localStorage.getItem('kcet_site_shutdown_config_backup');
            if (stored) {
                try { return JSON.parse(stored); } catch {}
            }
            return {
                shutdown: false,
                errorCode: "404",
                title: "Page Not Found",
                message: "The requested URL {path} does not exist or has been moved.",
                buttonText: "Go Back",
                showButton: true
            };
        }
    }

    static async setSiteShutdownConfig(config: SiteShutdownConfig): Promise<boolean> {
        try {
            try { localStorage.setItem('kcet_site_shutdown_config_backup', JSON.stringify(config)); } catch {}

            const { error } = await supabase
                .from('ugcet_results_cache')
                .upsert([{
                    appl_no: 'CONFIG:site_shutdown',
                    dob: 'config',
                    name: 'config',
                    results_json: config as any
                }], { onConflict: 'appl_no' });
            
            if (error) throw error;

            try {
                const channel = supabase.channel("global-alerts");
                await channel.send({
                    type: "broadcast",
                    event: "site_shutdown_updated",
                    payload: { config, timestamp: Date.now() }
                });
            } catch (bErr) {
                console.warn("Site shutdown broadcast warning:", bErr);
            }

            return true;
        } catch (e) {
            console.error("Error setting site shutdown config:", e);
            return false;
        }
    }

    static async isSiteShutdownGlobally(): Promise<boolean> {
        const config = await this.getSiteShutdownConfig();
        return config.shutdown;
    }

    static async setSiteShutdownGlobally(shutdown: boolean): Promise<boolean> {
        const current = await this.getSiteShutdownConfig();
        return this.setSiteShutdownConfig({ ...current, shutdown });
    }

    // Global Admin Greeting Name Override (Supabase DB + Realtime Broadcast)
    static async getAdminGreetingName(): Promise<string> {
        try {
            const { data, error } = await supabase
                .from('ugcet_results_cache')
                .select('results_json')
                .eq('appl_no', 'CONFIG:admin_greeting_name')
                .maybeSingle();

            if (error) throw error;
            if (data && data.results_json && (data.results_json as any).name) {
                const name = (data.results_json as any).name;
                try { localStorage.setItem('kcet_admin_greeting_text', name); } catch {}
                return name;
            }
            return localStorage.getItem('kcet_admin_greeting_text') || "User";
        } catch (e) {
            console.error("Error getting admin greeting name:", e);
            return localStorage.getItem('kcet_admin_greeting_text') || "User";
        }
    }

    static async setAdminGreetingName(name: string): Promise<boolean> {
        try {
            const cleanName = name.trim() || "User";
            try { localStorage.setItem('kcet_admin_greeting_text', cleanName); } catch {}

            const { error } = await supabase
                .from('ugcet_results_cache')
                .upsert([{
                    appl_no: 'CONFIG:admin_greeting_name',
                    dob: 'config',
                    name: 'config',
                    results_json: { name: cleanName }
                }], { onConflict: 'appl_no' });

            if (error) throw error;

            try {
                const channel = supabase.channel("global-alerts");
                await channel.send({
                    type: "broadcast",
                    event: "admin_greeting_updated",
                    payload: { name: cleanName, timestamp: Date.now() }
                });
            } catch (bErr) {
                console.warn("Greeting broadcast warning:", bErr);
            }

            return true;
        } catch (e) {
            console.error("Error setting admin greeting name:", e);
            return false;
        }
    }

    // Global Developer Announcement Message (Supabase DB + Realtime Broadcast)
    static async getDevAnnouncementConfig(): Promise<{ message: string; enabled: boolean; type: string }> {
        try {
            const { data, error } = await supabase
                .from('ugcet_results_cache')
                .select('results_json')
                .eq('appl_no', 'CONFIG:dev_announcement')
                .maybeSingle();

            if (error) throw error;
            if (data && data.results_json) {
                const json = data.results_json as any;
                const cfg = {
                    message: json.message || "",
                    enabled: json.enabled === true,
                    type: json.type || "info"
                };
                try {
                    localStorage.setItem('kcet_dev_message_text', cfg.message);
                    localStorage.setItem('kcet_dev_message_enabled', cfg.enabled ? "true" : "false");
                    localStorage.setItem('kcet_dev_message_type', cfg.type);
                } catch {}
                return cfg;
            }
            return {
                message: localStorage.getItem('kcet_dev_message_text') || "",
                enabled: localStorage.getItem('kcet_dev_message_enabled') === "true",
                type: localStorage.getItem('kcet_dev_message_type') || "info"
            };
        } catch (e) {
            console.error("Error getting dev announcement config:", e);
            return {
                message: localStorage.getItem('kcet_dev_message_text') || "",
                enabled: localStorage.getItem('kcet_dev_message_enabled') === "true",
                type: localStorage.getItem('kcet_dev_message_type') || "info"
            };
        }
    }

    static async setDevAnnouncementConfig(config: { message: string; enabled: boolean; type: string }): Promise<boolean> {
        try {
            try {
                localStorage.setItem('kcet_dev_message_text', config.message);
                localStorage.setItem('kcet_dev_message_enabled', config.enabled ? "true" : "false");
                localStorage.setItem('kcet_dev_message_type', config.type);
            } catch {}

            const { error } = await supabase
                .from('ugcet_results_cache')
                .upsert([{
                    appl_no: 'CONFIG:dev_announcement',
                    dob: 'config',
                    name: 'config',
                    results_json: config as any
                }], { onConflict: 'appl_no' });

            if (error) throw error;

            try {
                const channel = supabase.channel("global-alerts");
                await channel.send({
                    type: "broadcast",
                    event: "dev_message_updated",
                    payload: { config, timestamp: Date.now() }
                });
            } catch (bErr) {
                console.warn("Dev announcement broadcast warning:", bErr);
            }

            return true;
        } catch (e) {
            console.error("Error setting dev announcement config:", e);
            return false;
        }
    }
}




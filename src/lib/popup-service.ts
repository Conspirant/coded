import { supabase } from "@/integrations/supabase/client";
import { SitePopup } from "@/types/popup";

const POPUP_PREFIX = "POPUP:";
const CONFIG_KEY = "CONFIG:site_popups_list";
const REALTIME_CHANNEL = "site-popups-channel";

export const DEFAULT_INITIAL_POPUPS: SitePopup[] = [];

// Helper to sanitize array of popups
function formatPopupsList(rawList: any[]): SitePopup[] {
  if (!Array.isArray(rawList)) return DEFAULT_INITIAL_POPUPS;
  return rawList.map(item => ({
    id: String(item.id || `popup_${Math.random().toString(36).substring(2, 9)}`),
    title: String(item.title || "Announcement"),
    subtitle: item.subtitle ? String(item.subtitle) : undefined,
    message: String(item.message || ""),
    type: item.type === "maintenance" || item.type === "maintenance_announcement" ? item.type : "announcement",
    icon: item.icon ? String(item.icon) : undefined,
    badgeText: item.badgeText ? String(item.badgeText) : undefined,
    actionText: item.actionText ? String(item.actionText) : undefined,
    actionUrl: item.actionUrl ? String(item.actionUrl) : undefined,
    secondaryActionText: item.secondaryActionText ? String(item.secondaryActionText) : undefined,
    targetPages: Array.isArray(item.targetPages) ? item.targetPages : ["*"],
    dismissible: item.dismissible !== false,
    isForced: Boolean(item.isForced),
    enabled: Boolean(item.enabled),
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString()
  }));
}

// Memory cache fallback for ultra-fast local state & offline backup
let localPopupsMemoryCache: SitePopup[] | null = null;

export class PopupService {
  /**
   * Fetch all popups (both enabled and disabled)
   */
  static async getAllPopups(): Promise<SitePopup[]> {
    try {
      const { data, error } = await supabase
        .from("ugcet_results_cache" as any)
        .select("results_json")
        .eq("appl_no", CONFIG_KEY)
        .maybeSingle();

      if (error) throw error;

      if (data && (data as any).results_json?.popups) {
        const parsed = formatPopupsList((data as any).results_json.popups);
        localPopupsMemoryCache = parsed;
        return parsed;
      }

      // If no config found in DB yet, initialize with default list
      await this.saveAllPopups(DEFAULT_INITIAL_POPUPS);
      localPopupsMemoryCache = DEFAULT_INITIAL_POPUPS;
      return DEFAULT_INITIAL_POPUPS;
    } catch (e) {
      console.warn("⚠️ PopupService: Error loading popups from Supabase, returning local fallback:", e);
      if (localPopupsMemoryCache) return localPopupsMemoryCache;
      
      const stored = localStorage.getItem("kcetcoded_admin_popups_backup");
      if (stored) {
        try {
          return formatPopupsList(JSON.parse(stored));
        } catch {}
      }
      return DEFAULT_INITIAL_POPUPS;
    }
  }

  /**
   * Fetch only active (enabled) popups for public visitors
   */
  static async getActivePopups(): Promise<SitePopup[]> {
    const all = await this.getAllPopups();
    return all.filter(p => p.enabled);
  }

  /**
   * Save entire list of popups
   */
  static async saveAllPopups(popups: SitePopup[]): Promise<boolean> {
    try {
      localPopupsMemoryCache = popups;
      localStorage.setItem("kcetcoded_admin_popups_backup", JSON.stringify(popups));

      const { error } = await supabase
        .from("ugcet_results_cache" as any)
        .upsert(
          [
            {
              appl_no: CONFIG_KEY,
              dob: "config",
              name: "config",
              results_json: { popups, updatedAt: new Date().toISOString() }
            }
          ],
          { onConflict: "appl_no" }
        );

      if (error) throw error;

      // Broadcast changes live via Supabase Realtime channel
      try {
        const channel = supabase.channel(REALTIME_CHANNEL);
        await channel.send({
          type: "broadcast",
          event: "popups_updated",
          payload: { timestamp: Date.now() }
        });
      } catch (broadcastErr) {
        console.warn("Broadcast trigger silent warning:", broadcastErr);
      }

      return true;
    } catch (e) {
      console.error("❌ PopupService: Error saving popups to Supabase:", e);
      return false;
    }
  }

  /**
   * Create or update a single popup
   */
  static async upsertPopup(popupData: Partial<SitePopup> & { title: string; message: string; type: SitePopup['type'] }): Promise<{ success: boolean; popup?: SitePopup; error?: string }> {
    try {
      const all = await this.getAllPopups();
      const now = new Date().toISOString();

      let target: SitePopup;
      const existingIdx = popupData.id ? all.findIndex(p => p.id === popupData.id) : -1;

      if (existingIdx >= 0) {
        target = {
          ...all[existingIdx],
          ...popupData,
          updatedAt: now
        };
        all[existingIdx] = target;
      } else {
        const newId = popupData.id || `popup_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
        target = {
          id: newId,
          title: popupData.title,
          subtitle: popupData.subtitle,
          message: popupData.message,
          type: popupData.type,
          icon: popupData.icon || (popupData.type === 'maintenance' ? 'wrench' : popupData.type === 'maintenance_announcement' ? 'alert-triangle' : 'bell'),
          badgeText: popupData.badgeText,
          actionText: popupData.actionText,
          actionUrl: popupData.actionUrl,
          secondaryActionText: popupData.secondaryActionText,
          targetPages: popupData.targetPages || ["*"],
          dismissible: popupData.dismissible !== false,
          isForced: Boolean(popupData.isForced),
          enabled: popupData.enabled !== false,
          createdAt: now,
          updatedAt: now
        };
        all.unshift(target); // Add new popup to the top of the list
      }

      const ok = await this.saveAllPopups(all);
      if (!ok) return { success: false, error: "Failed to persist popup changes." };

      return { success: true, popup: target };
    } catch (e: any) {
      return { success: false, error: e.message || "An error occurred while saving popup." };
    }
  }

  /**
   * Enable or disable a popup by ID
   */
  static async togglePopupStatus(id: string, enabled: boolean): Promise<boolean> {
    try {
      const all = await this.getAllPopups();
      const popup = all.find(p => p.id === id);
      if (!popup) return false;

      popup.enabled = enabled;
      popup.updatedAt = new Date().toISOString();

      return await this.saveAllPopups(all);
    } catch (e) {
      console.error("Error toggling popup status:", e);
      return false;
    }
  }

  /**
   * Delete a popup by ID
   */
  static async deletePopup(id: string): Promise<boolean> {
    try {
      const all = await this.getAllPopups();
      const filtered = all.filter(p => p.id !== id);
      return await this.saveAllPopups(filtered);
    } catch (e) {
      console.error("Error deleting popup:", e);
      return false;
    }
  }

  /**
   * Subscribe to real-time changes in popups across sessions
   */
  static subscribeToPopups(onUpdate: () => void): () => void {
    const channel = supabase.channel(REALTIME_CHANNEL);

    channel
      .on("broadcast", { event: "popups_updated" }, () => {
        onUpdate();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }
}

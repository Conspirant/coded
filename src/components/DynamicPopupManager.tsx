import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  AlertTriangle,
  Stethoscope,
  Megaphone,
  Sparkles,
  ShieldAlert,
  Info,
  Bell,
  X,
  ArrowRight,
  CheckCircle2,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface SitePopupConfig {
  id?: string;
  enabled: boolean;
  type: "maintenance" | "maintenance_announcement" | "feature_update" | "general_announcement";
  title: string;
  subtitle?: string;
  message: string;
  badgeText?: string;
  icon?: string;
  actionText?: string;
  actionUrl?: string;
  dismissible: boolean;
  secondaryActionText?: string;
  version?: number;
  scheduled_at?: string;
  expires_at?: string;
}

export function DynamicPopupManager({
  isPreview = false,
  previewConfig = null
}: {
  isPreview?: boolean;
  previewConfig?: SitePopupConfig | null;
}) {
  const [popup, setPopup] = useState<SitePopupConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [actionDone, setActionDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isPreview && previewConfig) {
      setPopup(previewConfig);
      setIsOpen(true);
      return;
    }

    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("ugcet_results_cache")
          .select("results_json")
          .eq("appl_no", "CONFIG:site_popup_modal")
          .maybeSingle();

        if (!error && data?.results_json) {
          const cfg = data.results_json as SitePopupConfig;

          if (cfg.enabled) {
            // Check expiry
            if (cfg.expires_at && new Date(cfg.expires_at) < new Date()) {
              setIsOpen(false);
              return;
            }

            // Check if dismissed
            const dismissedKey = `dismissed_popup_${cfg.id || "default"}_v${cfg.version || 1}`;
            const isDismissed = localStorage.getItem(dismissedKey);

            if (!isDismissed) {
              setPopup(cfg);
              setIsOpen(true);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load site popup modal config:", err);
      }
    };

    fetchConfig();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("site-popup-modal-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:site_popup_modal"
        },
        (payload) => {
          const newCfg = (payload.new as any)?.results_json as SitePopupConfig;
          if (newCfg?.enabled) {
            const dismissedKey = `dismissed_popup_${newCfg.id || "default"}_v${newCfg.version || 1}`;
            const isDismissed = localStorage.getItem(dismissedKey);
            if (!isDismissed) {
              setPopup(newCfg);
              setIsOpen(true);
            }
          } else {
            setIsOpen(false);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ugcet_results_cache",
          filter: "appl_no=eq.CONFIG:site_popup_modal"
        },
        (payload) => {
          const newCfg = (payload.new as any)?.results_json as SitePopupConfig;
          if (newCfg?.enabled) {
            const dismissedKey = `dismissed_popup_${newCfg.id || "default"}_v${newCfg.version || 1}`;
            const isDismissed = localStorage.getItem(dismissedKey);
            if (!isDismissed) {
              setPopup(newCfg);
              setIsOpen(true);
            }
          } else {
            setIsOpen(false);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isPreview, previewConfig]);

  const handleDismiss = () => {
    if (popup) {
      const dismissedKey = `dismissed_popup_${popup.id || "default"}_v${popup.version || 1}`;
      localStorage.setItem(dismissedKey, "true");
    }
    setIsOpen(false);
  };

  const handleAction = () => {
    if (!popup?.actionUrl) return;

    setActionDone(true);
    setTimeout(() => {
      if (popup.actionUrl?.startsWith("http")) {
        window.open(popup.actionUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(popup.actionUrl!);
      }
      handleDismiss();
    }, 250);
  };

  if (!isOpen || !popup) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-modal-title"
      aria-describedby="site-modal-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <PopupCardContent
        popup={popup}
        onDismiss={handleDismiss}
        onAction={handleAction}
        actionDone={actionDone}
        isPreview={isPreview}
      />
    </div>
  );
}

export function PopupCardContent({
  popup,
  onDismiss,
  onAction,
  actionDone,
  isPreview = false
}: {
  popup: SitePopupConfig | any;
  onDismiss?: () => void;
  onAction?: () => void;
  actionDone?: boolean;
  isPreview?: boolean;
}) {
  const isMaintenance = popup.type === "maintenance";
  const isMaintenanceUpdate = popup.type === "maintenance_announcement";

  // Clean Theme Styles
  const theme = isMaintenance
    ? {
        border: "border-amber-500/30",
        iconBox: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        pillBadge: "bg-amber-500/10 text-amber-500 border-amber-500/20 font-mono",
        pillText: "MAINTENANCE UPDATE",
        btnPrimary: "bg-amber-500 hover:bg-amber-600 text-black font-semibold"
      }
    : isMaintenanceUpdate
    ? {
        border: "border-primary/30",
        iconBox: "bg-primary/10 text-primary border-primary/20",
        pillBadge: "bg-primary/10 text-primary border-primary/20 font-mono",
        pillText: "FEATURE UPDATE",
        btnPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      }
    : {
        border: "border-border",
        iconBox: "bg-muted text-foreground border-border",
        pillBadge: "bg-muted text-foreground border-border font-mono",
        pillText: "ANNOUNCEMENT",
        btnPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
      };

  const getIcon = () => {
    switch (popup.icon) {
      case "wrench":
        return <Wrench className="h-5 w-5" />;
      case "alert-triangle":
        return <AlertTriangle className="h-5 w-5" />;
      case "stethoscope":
        return <Stethoscope className="h-5 w-5" />;
      case "megaphone":
        return <Megaphone className="h-5 w-5" />;
      case "sparkles":
        return <Sparkles className="h-5 w-5" />;
      case "shield":
        return <ShieldAlert className="h-5 w-5" />;
      case "info":
        return <Info className="h-5 w-5" />;
      case "bell":
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  // Structured Text Parser
  const parseMessageStructure = (rawMessage?: string) => {
    if (!rawMessage) return { intro: "", bullets: [] };
    const lines = rawMessage
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length <= 1) {
      const sentences = rawMessage.split(/(?<=\.)\s+/).filter(Boolean);
      if (sentences.length > 2) {
        return {
          intro: sentences[0],
          bullets: sentences.slice(1)
        };
      }
      return { intro: rawMessage, bullets: [] };
    }

    return {
      intro: lines[0],
      bullets: lines.slice(1).map((l) => l.replace(/^[\u2022\-\*]\s*/, ""))
    };
  };

  const { intro, bullets } = parseMessageStructure(popup.message);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border ${theme.border} bg-card p-5 sm:p-6 text-card-foreground z-10 space-y-4 shadow-xl`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between">
        <div className={`px-2.5 py-0.5 rounded border text-[10px] uppercase font-semibold tracking-wider flex items-center gap-1.5 ${theme.pillBadge}`}>
          <Activity className="h-3 w-3" />
          <span>{popup.badgeText || theme.pillText}</span>
        </div>

        {isPreview ? (
          <span className="text-[10px] font-mono text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            ADMIN PREVIEW
          </span>
        ) : (
          popup.dismissible && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {/* Header Area */}
      <div className="flex items-start gap-3 pt-0.5">
        <div className={`p-2.5 rounded-md border shrink-0 ${theme.iconBox}`}>
          {getIcon()}
        </div>
        <div className="space-y-0.5">
          <h2 id="site-modal-title" className="text-lg sm:text-xl font-bold tracking-tight text-foreground leading-snug">
            {popup.title}
          </h2>
          {popup.subtitle && (
            <p className="text-xs text-muted-foreground leading-snug">
              {popup.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Structured Content Area */}
      <div id="site-modal-description" className="space-y-2.5">
        {/* Intro Message */}
        <div className="p-3 rounded-md bg-muted/30 border border-border text-xs text-muted-foreground leading-relaxed">
          {intro}
        </div>

        {/* Structured Highlights / Bullets */}
        {bullets.length > 0 && (
          <div className="space-y-1.5 pt-0.5">
            {bullets.map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-2.5 rounded-md border border-border bg-muted/20 text-xs text-foreground"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 pt-2 border-t border-border/60">
        {popup.dismissible && (
          <Button
            variant="outline"
            onClick={onDismiss}
            className="w-full sm:w-auto h-8 px-4 text-xs font-semibold border-border text-foreground hover:bg-muted"
          >
            {popup.secondaryActionText || "Dismiss"}
          </Button>
        )}

        {popup.actionText && (
          <Button
            onClick={onAction}
            disabled={actionDone}
            className={`w-full sm:w-auto h-8 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs ${theme.btnPrimary}`}
          >
            {actionDone ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Recorded</span>
              </>
            ) : (
              <>
                <span>{popup.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export const PopupContent = PopupCardContent;

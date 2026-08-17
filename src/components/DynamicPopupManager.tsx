import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Activity,
  Flame,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PopupService } from "@/lib/popup-service";
import { SitePopup } from "@/types/popup";

export type SitePopupConfig = SitePopup;

export function DynamicPopupManager({
  isPreview = false,
  previewConfig = null
}: {
  isPreview?: boolean;
  previewConfig?: SitePopup | null;
}) {
  const [activePopup, setActivePopup] = useState<SitePopup | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [actionDone, setActionDone] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const evaluateAndShowPopup = useCallback(async () => {
    if (isPreview && previewConfig) {
      setActivePopup(previewConfig);
      setIsOpen(true);
      return;
    }

    try {
      const activeList = await PopupService.getActivePopups();
      const currentPath = location.pathname;

      // Find the first matching enabled popup for this page
      const match = activeList.find((popup) => {
        if (!popup.enabled) return false;
        
        // Match target route
        const targets = popup.targetPages && popup.targetPages.length > 0 ? popup.targetPages : ["*"];
        const matchesRoute = targets.some((t) => {
          const cleanTarget = t.trim();
          if (cleanTarget === "*" || cleanTarget === "") return true;
          if (cleanTarget.endsWith("*")) return currentPath.startsWith(cleanTarget.replace(/\*$/, ""));
          return cleanTarget === currentPath || `${cleanTarget}/` === currentPath || currentPath === cleanTarget;
        });

        if (!matchesRoute) return false;

        // If forced, show regardless of prior dismissal
        if (popup.isForced) return true;

        // Check if dismissed
        const dismissedKey = `dismissed_popup_${popup.id}_${popup.updatedAt || popup.createdAt || "v1"}`;
        const isDismissed = localStorage.getItem(dismissedKey);
        return !isDismissed;
      });

      if (match) {
        setActivePopup(match);
        setIsOpen(true);
      } else {
        setIsOpen(false);
        setActivePopup(null);
      }
    } catch (e) {
      console.error("Error evaluating site popups:", e);
    }
  }, [isPreview, previewConfig, location.pathname]);

  useEffect(() => {
    evaluateAndShowPopup();

    // Subscribe to admin updates in real-time
    const unsubscribe = PopupService.subscribeToPopups(() => {
      evaluateAndShowPopup();
    });

    return () => {
      unsubscribe();
    };
  }, [evaluateAndShowPopup]);

  const handleDismiss = () => {
    if (activePopup) {
      const dismissedKey = `dismissed_popup_${activePopup.id}_${activePopup.updatedAt || activePopup.createdAt || "v1"}`;
      localStorage.setItem(dismissedKey, "true");
    }
    setIsOpen(false);
  };

  const handleAction = () => {
    if (!activePopup?.actionUrl) return;

    setActionDone(true);
    setTimeout(() => {
      if (activePopup.actionUrl?.startsWith("http")) {
        window.open(activePopup.actionUrl, "_blank", "noopener,noreferrer");
      } else {
        navigate(activePopup.actionUrl!);
      }
      handleDismiss();
    }, 250);
  };

  if (!isOpen || !activePopup) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-modal-title"
      aria-describedby="site-modal-description"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <PopupCardContent
        popup={activePopup}
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
  popup: SitePopup | any;
  onDismiss?: () => void;
  onAction?: () => void;
  actionDone?: boolean;
  isPreview?: boolean;
}) {
  const isMaintenance = popup.type === "maintenance";
  const isFeature = popup.type === "feature_update" || popup.type === "maintenance_announcement";

  // Dynamic Aesthetic Themes
  const theme = isMaintenance
    ? {
        border: "border-amber-500/30",
        glow: "from-amber-500/20 via-orange-500/10 to-transparent",
        iconGradient: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30 shadow-amber-500/10",
        pillBadge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        pillText: "MAINTENANCE NOTICE",
        btnPrimary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold shadow-amber-500/20"
      }
    : isFeature
    ? {
        border: "border-primary/40",
        glow: "from-primary/25 via-indigo-500/15 to-transparent",
        iconGradient: "from-primary/25 to-indigo-600/20 text-primary border-primary/40 shadow-primary/10",
        pillBadge: "bg-primary/15 text-primary border-primary/30",
        pillText: "FEATURE LAUNCH",
        btnPrimary: "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-bold shadow-primary/25"
      }
    : {
        border: "border-emerald-500/30",
        glow: "from-emerald-500/20 via-teal-500/10 to-transparent",
        iconGradient: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10",
        pillBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        pillText: "ANNOUNCEMENT",
        btnPrimary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-emerald-500/20"
      };

  const getIcon = () => {
    switch (popup.icon) {
      case "wrench":
        return <Wrench className="h-6 w-6" />;
      case "alert-triangle":
        return <AlertTriangle className="h-6 w-6" />;
      case "stethoscope":
        return <Stethoscope className="h-6 w-6" />;
      case "megaphone":
        return <Megaphone className="h-6 w-6" />;
      case "sparkles":
        return <Sparkles className="h-6 w-6" />;
      case "shield":
        return <ShieldAlert className="h-6 w-6" />;
      case "flame":
        return <Flame className="h-6 w-6" />;
      case "info":
        return <Info className="h-6 w-6" />;
      case "bell":
      default:
        return <Bell className="h-6 w-6" />;
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
      initial={{ opacity: 0, scale: 0.94, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 15 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border ${theme.border} bg-zinc-950/95 backdrop-blur-2xl p-6 text-zinc-100 z-10 space-y-5 shadow-2xl overflow-hidden`}
    >
      {/* Ambient Top Glow Beam */}
      <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-b ${theme.glow} blur-3xl pointer-events-none rounded-full`} />

      {/* Top Header Tag Bar */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className={`px-3 py-1 rounded-full border text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-sm ${theme.pillBadge}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
          </span>
          <span>{popup.badgeText || theme.pillText}</span>
        </div>

        {isPreview ? (
          <Badge variant="outline" className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 border-amber-500/30 px-2 py-0.5">
            <Sparkles className="h-3 w-3 mr-1" /> ADMIN PREVIEW
          </Badge>
        ) : (
          popup.dismissible && (
            <button
              onClick={onDismiss}
              className="h-7 w-7 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all flex items-center justify-center shrink-0 cursor-pointer"
              aria-label="Close popup"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )
        )}
      </div>

      {/* Main Title & Icon Banner */}
      <div className="relative z-10 flex items-start gap-4">
        <div className={`h-12 w-12 rounded-2xl border shadow-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${theme.iconGradient} ring-2 ring-white/5`}>
          {getIcon()}
        </div>
        <div className="space-y-1">
          <h2 id="site-modal-title" className="text-lg sm:text-xl font-extrabold tracking-tight text-white leading-snug">
            {popup.title}
          </h2>
          {popup.subtitle && (
            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
              {popup.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content Container */}
      <div id="site-modal-description" className="relative z-10 space-y-3">
        {/* Intro Text Box */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
          {intro}
        </div>

        {/* Structured Bullets / Feature Highlights */}
        {bullets.length > 0 && (
          <div className="space-y-2 pt-1">
            {bullets.map((bullet: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl border border-zinc-800/60 bg-zinc-900/30 text-xs text-zinc-200 hover:border-zinc-700/80 transition-colors"
              >
                <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="relative z-10 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-zinc-800/80">
        {popup.dismissible && (
          <Button
            variant="ghost"
            onClick={onDismiss}
            className="w-full sm:w-auto h-9 px-4 text-xs font-semibold text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl cursor-pointer"
          >
            {popup.secondaryActionText || "Dismiss"}
          </Button>
        )}

        {popup.actionText && (
          <Button
            onClick={onAction}
            disabled={actionDone}
            className={`w-full sm:w-auto h-9 px-5 text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 group cursor-pointer ${theme.btnPrimary}`}
          >
            {actionDone ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Navigating...</span>
              </>
            ) : (
              <>
                <span>{popup.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

export const PopupContent = PopupCardContent;

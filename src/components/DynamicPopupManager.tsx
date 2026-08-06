import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Wrench,
  AlertTriangle,
  Stethoscope,
  Megaphone,
  Sparkles,
  ShieldAlert,
  Info,
  X,
  ArrowRight,
  CheckCircle2,
  Activity,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PopupService } from "@/lib/popup-service";
import { SitePopup } from "@/types/popup";
import { useLocation, useNavigate } from "react-router-dom";

export const DynamicPopupManager: React.FC = () => {
  const [activePopups, setActivePopups] = useState<SitePopup[]>([]);
  const [currentPopupIndex, setCurrentPopupIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [actionDone, setActionDone] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const loadPopups = async () => {
    try {
      const popups = await PopupService.getActivePopups();
      const currentPath = location.pathname;

      // Filter popups suitable for current route path & not dismissed by user
      const validForPage = popups.filter((popup) => {
        if (!popup.enabled) return false;

        // Check path match
        const matchesPath =
          !popup.targetPages ||
          popup.targetPages.includes("*") ||
          popup.targetPages.some((p) => p === currentPath || (p !== "/" && currentPath.startsWith(p)));

        if (!matchesPath) return false;

        // Check user dismissal status
        if (!popup.isForced) {
          const isDismissed = localStorage.getItem(`kcetcoded_popup_dismissed_${popup.id}`) === "true";
          if (isDismissed) return false;
        }

        return true;
      });

      setActivePopups(validForPage);
      if (validForPage.length > 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    } catch (e) {
      console.warn("Failed to load active popups:", e);
    }
  };

  useEffect(() => {
    loadPopups();

    // Subscribe to real-time broadcasts when admin toggles or adds popups
    const unsubscribe = PopupService.subscribeToPopups(() => {
      loadPopups();
    });

    return () => unsubscribe();
  }, [location.pathname]);

  // Keyboard accessibility: ESC key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && currentPopup) {
        if (currentPopup.dismissible) {
          handleDismiss();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentPopupIndex, activePopups]);

  const currentPopup = activePopups[currentPopupIndex];

  if (!isOpen || !currentPopup) return null;

  const handleDismiss = () => {
    if (currentPopup) {
      localStorage.setItem(`kcetcoded_popup_dismissed_${currentPopup.id}`, "true");
    }

    if (currentPopupIndex < activePopups.length - 1) {
      setCurrentPopupIndex((prev) => prev + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handleAction = () => {
    if (!currentPopup) return;

    localStorage.setItem(`kcetcoded_popup_dismissed_${currentPopup.id}`, "true");
    setActionDone(true);

    if (currentPopup.actionUrl) {
      if (currentPopup.actionUrl.startsWith("http://") || currentPopup.actionUrl.startsWith("https://")) {
        window.open(currentPopup.actionUrl, "_blank");
      } else {
        navigate(currentPopup.actionUrl);
      }
      setTimeout(() => setIsOpen(false), 500);
    } else {
      toast({
        title: "Preference Saved!",
        description: `Thank you! Your action for "${currentPopup.title}" has been recorded.`
      });
      setTimeout(() => {
        if (currentPopupIndex < activePopups.length - 1) {
          setActionDone(false);
          setCurrentPopupIndex((prev) => prev + 1);
        } else {
          setIsOpen(false);
        }
      }, 1000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && currentPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="site-modal-title"
          aria-describedby="site-modal-description"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => {
              if (currentPopup.dismissible) handleDismiss();
            }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Premium Modal Container */}
          <PopupCardContent
            popup={currentPopup}
            actionDone={actionDone}
            onDismiss={handleDismiss}
            onAction={handleAction}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

// ─── Reusable Render Component for Theme Styling & Structured Text ───
export function PopupCardContent({
  popup,
  actionDone,
  onDismiss,
  onAction,
  isPreview = false
}: {
  popup: SitePopup;
  actionDone?: boolean;
  onDismiss?: () => void;
  onAction?: () => void;
  isPreview?: boolean;
}) {
  const isMaintenance = popup.type === "maintenance";
  const isMaintenanceUpdate = popup.type === "maintenance_announcement";

  // Theme Styles
  const theme = isMaintenance
    ? {
        border: "border-amber-500/40",
        shadow: "shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)]",
        bgGradient: "bg-gradient-to-b from-amber-950/40 via-zinc-950 to-zinc-950",
        iconBox: "bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
        pillBadge: "bg-amber-500/10 text-amber-400 border-amber-500/25",
        pillText: "MAINTENANCE UPDATE",
        subtitleText: "text-amber-300",
        btnPrimary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold shadow-lg shadow-amber-950/50",
        accentCard: "bg-amber-950/20 border-amber-500/20 text-amber-200"
      }
    : isMaintenanceUpdate
    ? {
        border: "border-indigo-500/40",
        shadow: "shadow-[0_0_50px_-12px_rgba(99,102,241,0.3)]",
        bgGradient: "bg-gradient-to-b from-indigo-950/40 via-zinc-950 to-zinc-950",
        iconBox: "bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400",
        pillBadge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25",
        pillText: "FEATURE & MAINTENANCE UPDATE",
        subtitleText: "text-indigo-300",
        btnPrimary: "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-950/50",
        accentCard: "bg-indigo-950/20 border-indigo-500/20 text-indigo-200"
      }
    : {
        border: "border-emerald-500/40",
        shadow: "shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]",
        bgGradient: "bg-gradient-to-b from-emerald-950/40 via-zinc-950 to-zinc-950",
        iconBox: "bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
        pillBadge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
        pillText: "ANNOUNCEMENT",
        subtitleText: "text-emerald-300",
        btnPrimary: "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-bold shadow-lg shadow-emerald-950/50",
        accentCard: "bg-emerald-950/20 border-emerald-500/20 text-emerald-200"
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
      case "info":
        return <Info className="h-6 w-6" />;
      case "bell":
      default:
        return <Bell className="h-6 w-6" />;
    }
  };

  // Structured Text Parser: Break down multi-paragraph or bullet point text cleanly
  const parseMessageStructure = (rawMessage: string) => {
    const lines = rawMessage
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length <= 1) {
      // Split by periods if long single block
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
      bullets: lines.slice(1).map((l) => l.replace(/^[•\-\*]\s*/, ""))
    };
  };

  const { intro, bullets } = parseMessageStructure(popup.message);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 15 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border ${theme.border} ${theme.bgGradient} ${theme.shadow} p-6 sm:p-7 text-zinc-100 z-10 space-y-5 backdrop-blur-xl`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between">
        <div className={`px-3 py-1 rounded-full border text-[10px] uppercase font-extrabold tracking-wider flex items-center gap-1.5 ${theme.pillBadge}`}>
          <Activity className="h-3 w-3 animate-pulse" />
          <span>{popup.badgeText || theme.pillText}</span>
        </div>

        {isPreview ? (
          <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            ADMIN PREVIEW
          </span>
        ) : (
          popup.dismissible && (
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shrink-0"
              aria-label="Close popup"
            >
              <X className="h-4 w-4" />
            </button>
          )
        )}
      </div>

      {/* Header Area */}
      <div className="flex items-start gap-4 pt-1">
        <div className={`p-3 rounded-2xl border shrink-0 shadow-inner ${theme.iconBox}`}>
          {getIcon()}
        </div>
        <div className="space-y-1">
          <h2 id="site-modal-title" className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
            {popup.title}
          </h2>
          {popup.subtitle && (
            <p className={`text-xs font-semibold ${theme.subtitleText} leading-snug`}>
              {popup.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Structured Content Area */}
      <div id="site-modal-description" className="space-y-3">
        {/* Intro Message */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal shadow-sm">
          {intro}
        </div>

        {/* Structured Highlights / Bullets */}
        {bullets.length > 0 && (
          <div className="space-y-2 pt-1">
            {bullets.map((bullet, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 text-xs text-zinc-200 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed font-medium">{bullet}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
        {popup.dismissible && (
          <Button
            variant="outline"
            onClick={onDismiss}
            className="w-full sm:w-auto border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl h-10 px-5 text-xs font-semibold transition-all"
          >
            {popup.secondaryActionText || "Dismiss"}
          </Button>
        )}

        {popup.actionText && (
          <Button
            onClick={onAction}
            disabled={actionDone}
            className={`w-full sm:w-auto rounded-xl h-10 px-5 text-xs flex items-center justify-center gap-2 transition-all ${theme.btnPrimary}`}
          >
            {actionDone ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Recorded</span>
              </>
            ) : (
              <>
                <span>{popup.actionText}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </motion.div>
  );
}

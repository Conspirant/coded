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
  CheckCircle2
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

  const renderIcon = (iconName?: string, type?: string) => {
    switch (iconName || type) {
      case "wrench":
      case "maintenance":
        return <Wrench className="h-6 w-6 text-amber-400" />;
      case "alert-triangle":
      case "maintenance_announcement":
        return <AlertTriangle className="h-6 w-6 text-indigo-400" />;
      case "stethoscope":
        return <Stethoscope className="h-6 w-6 text-emerald-400" />;
      case "megaphone":
        return <Megaphone className="h-6 w-6 text-cyan-400" />;
      case "sparkles":
        return <Sparkles className="h-6 w-6 text-purple-400" />;
      case "shield":
        return <ShieldAlert className="h-6 w-6 text-rose-400" />;
      case "info":
        return <Info className="h-6 w-6 text-blue-400" />;
      case "bell":
      default:
        return <Bell className="h-6 w-6 text-emerald-400" />;
    }
  };

  const isMaintenance = currentPopup.type === "maintenance";
  const isMaintenanceUpdate = currentPopup.type === "maintenance_announcement";

  const cardBorderClass = isMaintenance
    ? "border-amber-500/30"
    : isMaintenanceUpdate
    ? "border-indigo-500/30 font-sans"
    : "border-emerald-500/30";

  const badgeBgClass = isMaintenance
    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
    : isMaintenanceUpdate
    ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

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
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (currentPopup.dismissible) handleDismiss();
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border ${cardBorderClass} bg-zinc-950 p-6 text-zinc-100 shadow-2xl z-10 space-y-4`}
          >
            {/* Header Area */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border shrink-0 ${badgeBgClass}`}>
                  {renderIcon(currentPopup.icon, currentPopup.type)}
                </div>
                <div>
                  <h2 id="site-modal-title" className="text-xl font-bold tracking-tight text-white leading-snug">
                    {currentPopup.title}
                  </h2>
                  {currentPopup.subtitle && (
                    <p className="text-xs text-emerald-400 font-medium mt-0.5">
                      {currentPopup.subtitle}
                    </p>
                  )}
                </div>
              </div>
              {currentPopup.dismissible && (
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors shrink-0"
                  aria-label="Close popup"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Description Body */}
            <div id="site-modal-description" className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <p>{currentPopup.message}</p>

              {currentPopup.badgeText && (
                <div className={`rounded-xl border p-2.5 flex items-center gap-2 ${badgeBgClass}`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <p className="text-xs font-semibold">{currentPopup.badgeText}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-1">
              {currentPopup.dismissible && (
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  className="w-full sm:w-auto border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg h-9 px-4 text-xs font-medium transition-colors"
                >
                  {currentPopup.secondaryActionText || "Dismiss"}
                </Button>
              )}

              {currentPopup.actionText && (
                <Button
                  onClick={handleAction}
                  disabled={actionDone}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg h-9 px-4 text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-950/40"
                >
                  {actionDone ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                      <span>Received</span>
                    </>
                  ) : (
                    <>
                      <Bell className="h-3.5 w-3.5" />
                      <span>{currentPopup.actionText}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-80" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

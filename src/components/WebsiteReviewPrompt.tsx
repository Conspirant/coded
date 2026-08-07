import React, { useState, useEffect } from "react";
import { Star, MessageSquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WebsiteReviewModal } from "@/components/WebsiteReviewModal";

export const WebsiteReviewPrompt: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDismissed = localStorage.getItem("kcetcoded_review_prompt_dismissed") === "true";
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    localStorage.setItem("kcetcoded_review_prompt_dismissed", "true");
  };

  if (!isVisible) {
    return (
      <WebsiteReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onReviewSubmitted={() => setIsVisible(false)}
      />
    );
  }

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40 flex items-center gap-2 group">
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-card/90 hover:bg-card text-foreground border border-violet-500/30 hover:border-violet-500/60 shadow-lg backdrop-blur-md px-3.5 py-2 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <div className="flex items-center text-amber-400">
            <Star className="h-3.5 w-3.5 fill-amber-400" />
          </div>
          <span>Rate KCET Coded</span>
        </button>

        <button
          onClick={handleDismiss}
          className="h-6 w-6 rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
          title="Dismiss prompt"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      <WebsiteReviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onReviewSubmitted={() => setIsVisible(false)}
      />
    </>
  );
};

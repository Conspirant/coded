import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, CheckCircle2, Vote, Sparkles, Loader2, X } from "lucide-react";
import { PollService } from "@/lib/poll-service";
import { Poll } from "@/types/poll";
import { useExamMode } from "@/contexts/ExamModeContext";
import { toast } from "sonner";

export function GlobalPollPopup() {
  const { examMode } = useExamMode();
  const normalizedMode = (examMode?.toLowerCase() || 'kcet') as 'kcet' | 'comedk';
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);

  const loadAndCheckPoll = async (forceOpen = false) => {
    try {
      const active = await PollService.getActivePoll(normalizedMode);
      if (!active) return;

      const userVoted = PollService.getUserVotedOption(active.id);
      const userDismissed = PollService.isPollDismissed(active.id);

      setVotedOptionId(userVoted);
      setPoll(active);

      if (forceOpen) {
        setIsOpen(true);
        return;
      }

      // Allow popup unless explicitly set to 'widget' only
      const canShowPopup = active.displayType === 'popup' || active.displayType === 'both' || !active.displayType;

      if (canShowPopup && !userDismissed && !userVoted) {
        setIsOpen(true);
      }
    } catch (e) {
      console.error("Error loading poll popup:", e);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAndCheckPoll();
    }, 1200);

    const handleCustomTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.poll) {
        setPoll(customEvent.detail.poll);
        const userVoted = PollService.getUserVotedOption(customEvent.detail.poll.id);
        setVotedOptionId(userVoted);
        setIsOpen(true);
      } else {
        loadAndCheckPoll(true);
      }
    };

    window.addEventListener("trigger-poll-popup", handleCustomTrigger);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("trigger-poll-popup", handleCustomTrigger);
    };
  }, [examMode]);

  const handleDismiss = () => {
    if (poll) {
      PollService.dismissPollPopup(poll.id);
    }
    setIsOpen(false);
  };

  const handleVote = async () => {
    if (!poll || !selectedOption) return;
    setIsSubmitting(true);
    try {
      const res = await PollService.castVote(poll.id, selectedOption, normalizedMode);
      if (res.success && res.updatedPoll) {
        setPoll(res.updatedPoll);
        setVotedOptionId(selectedOption);
        toast.success("Vote recorded!", {
          description: "Thank you for sharing your opinion!"
        });
      } else {
        toast.error("Voting error", { description: res.error || "Could not save vote." });
      }
    } catch (err: any) {
      toast.error("Error submitting vote");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!poll || !isOpen) return null;

  const hasVoted = Boolean(votedOptionId);
  const totalVotes = poll.totalVotes || 0;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in-0 duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <div className="w-full max-w-md max-h-[85vh] overflow-y-auto glass-strong border border-primary/30 bg-card/95 p-5 sm:p-6 rounded-lg shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Close X Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

        <div className="pb-2">
          <div className="flex items-center justify-between gap-2 mb-2 pr-6">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Community Quick Poll
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <BarChart3 className="w-3.5 h-3.5 text-primary/70" />
              <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold tracking-tight text-foreground leading-snug">
            {poll.question}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Share your perspective to help shape KCETCoded tools and community direction.
          </p>
        </div>

        <div className="space-y-3 pt-3">
          {hasVoted ? (
            /* Results View */
            <div className="space-y-3">
              {poll.options.map((opt) => {
                const percentage = totalVotes > 0 ? Math.round((opt.voteCount / totalVotes) * 100) : 0;
                const isUserChoice = opt.id === votedOptionId;

                return (
                  <div key={opt.id} className="p-3 rounded-md border border-border bg-background/30 space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground flex items-center gap-1.5 truncate">
                        <span className="truncate">{opt.text}</span>
                        {isUserChoice && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shrink-0">
                            Your vote
                          </Badge>
                        )}
                      </span>
                      <span className="font-bold text-xs text-foreground shrink-0">
                        {percentage}% <span className="text-muted-foreground font-normal">({opt.voteCount})</span>
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 rounded-full ${isUserChoice ? '[&>div]:bg-emerald-500' : '[&>div]:bg-primary/60'}`}
                    />
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground border-t border-border/60">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Vote submitted
                </span>
                <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-7 text-xs">
                  Close Window
                </Button>
              </div>
            </div>
          ) : (
            /* Voting Choices Form */
            <div className="space-y-2">
              {poll.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full text-left p-3 rounded-md border transition-all text-sm font-medium flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/15 text-foreground shadow-sm shadow-primary/10"
                        : "border-border bg-background/40 hover:bg-background/80 hover:border-white/20 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{opt.text}</span>
                    <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                  </button>
                );
              })}

              <div className="flex items-center gap-2 pt-3">
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  className="flex-1 border-border text-xs hover:bg-white/5"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleVote}
                  disabled={!selectedOption || isSubmitting}
                  className="flex-1 font-semibold gap-1.5 text-xs shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Vote className="w-3.5 h-3.5" /> Submit Vote
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


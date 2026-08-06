import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, CheckCircle2, Vote, Sparkles, Loader2 } from "lucide-react";
import { PollService } from "@/lib/poll-service";
import { Poll } from "@/types/poll";
import { useExamMode } from "@/contexts/ExamModeContext";
import { toast } from "sonner";

export function CommunityPollWidget({ className = "" }: { className?: string }) {
  const { examMode } = useExamMode();
  const normalizedMode = (examMode?.toLowerCase() || 'kcet') as 'kcet' | 'comedk';
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votedOptionId, setVotedOptionId] = useState<string | null>(null);

  const fetchActivePoll = async () => {
    setLoading(true);
    try {
      const active = await PollService.getActivePoll(normalizedMode);
      setPoll(active);
      if (active) {
        const userVoted = PollService.getUserVotedOption(active.id);
        setVotedOptionId(userVoted);
      }
    } catch (e) {
      console.error("Failed loading active poll:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePoll();
  }, [examMode]);

  const handleVote = async () => {
    if (!poll || !selectedOption) return;
    setIsSubmitting(true);
    try {
      const res = await PollService.castVote(poll.id, selectedOption, normalizedMode);
      if (res.success && res.updatedPoll) {
        setPoll(res.updatedPoll);
        setVotedOptionId(selectedOption);
        toast.success("Vote recorded!", {
          description: "Thank you for sharing your view with the community."
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

  if (loading) {
    return (
      <Card className={`glass-strong border-white/10 ${className}`}>
        <CardContent className="p-6 flex items-center justify-center text-muted-foreground min-h-[140px]">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Loading community poll...
        </CardContent>
      </Card>
    );
  }

  if (!poll) {
    return null;
  }

  const hasVoted = Boolean(votedOptionId);
  const totalVotes = poll.totalVotes || 0;
  const optionCount = poll.options.length;

  // Determine optimal grid layout based on option length and count
  const useSideBySide = optionCount <= 4 && poll.options.every(o => o.text.length <= 40);

  return (
    <Card className={`glass-strong border-primary/20 bg-card/60 relative overflow-hidden transition-all duration-300 ${className}`}>
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Community Live Poll
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <BarChart3 className="w-3.5 h-3.5 text-primary/70" />
            <span className="font-medium">{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
          </div>
        </div>
        
        <CardTitle className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug">
          {poll.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
        {hasVoted ? (
          /* Results View */
          <div className="space-y-3 mt-1">
            <div className={useSideBySide ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-2.5"}>
              {poll.options.map((opt) => {
                const percentage = totalVotes > 0 ? Math.round((opt.voteCount / totalVotes) * 100) : 0;
                const isUserChoice = opt.id === votedOptionId;

                return (
                  <div key={opt.id} className="p-3 rounded-xl border border-white/10 bg-background/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                      <span className="font-medium text-foreground flex items-center gap-1.5 truncate">
                        <span className="truncate">{opt.text}</span>
                        {isUserChoice && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shrink-0">
                            Your vote
                          </Badge>
                        )}
                      </span>
                      <span className="font-bold text-xs text-foreground/90 shrink-0">
                        {percentage}% <span className="text-muted-foreground font-normal">({opt.voteCount})</span>
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={percentage} 
                        className={`h-2 rounded-full ${isUserChoice ? '[&>div]:bg-emerald-500' : '[&>div]:bg-primary/60'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground border-t border-white/5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> You have voted
              </span>
              <span>Total participation: <strong className="text-foreground">{totalVotes}</strong></span>
            </div>
          </div>
        ) : (
          /* Voting Options Form */
          <div className="space-y-3 mt-1">
            <div className={useSideBySide ? "grid grid-cols-1 sm:grid-cols-2 gap-2.5" : "space-y-2"}>
              {poll.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all text-xs sm:text-sm font-medium flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/15 text-foreground shadow-sm shadow-primary/10"
                        : "border-white/10 bg-background/40 hover:bg-background/80 hover:border-white/20 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="leading-snug">{opt.text}</span>
                    <div className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-1">
              <Button
                onClick={handleVote}
                disabled={!selectedOption || isSubmitting}
                className="w-full sm:w-auto px-6 font-semibold shadow-md gap-2 text-xs sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Vote className="w-4 h-4" /> Submit Vote
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

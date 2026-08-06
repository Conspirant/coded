import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { PollService } from "@/lib/poll-service";
import { Poll } from "@/types/poll";
import { 
  Vote, Plus, Trash2, CheckCircle2, XCircle, BarChart3, 
  Sparkles, Loader2, RefreshCw, Eye, Calendar, Users, Activity, LayoutTemplate, MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AdminPollManager() {
  const { toast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [examMode, setExamMode] = useState<'all' | 'kcet' | 'comedk'>("all");
  const [displayType, setDisplayType] = useState<'widget' | 'popup' | 'both'>("both");
  const [setActiveImmediately, setSetActiveImmediately] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Inspection modal state
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const data = await PollService.getAllPolls();
      setPolls(data);
    } catch (e) {
      toast({ title: "Error", description: "Failed to load polls", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleAddOption = () => {
    if (options.length >= 6) {
      toast({ title: "Limit reached", description: "Maximum 6 options allowed per poll." });
      return;
    }
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast({ title: "Minimum options", description: "A poll must have at least 2 choices." });
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      toast({ title: "Validation error", description: "Poll question cannot be empty.", variant: "destructive" });
      return;
    }

    const validOptions = options.map(o => o.trim()).filter(Boolean);
    if (validOptions.length < 2) {
      toast({ title: "Validation error", description: "Please enter at least 2 valid option texts.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await PollService.createPoll(question, validOptions, examMode, setActiveImmediately, displayType);
      if (created) {
        toast({ title: "Poll Created!", description: `"${question}" is now ${setActiveImmediately ? 'active' : 'saved'}.` });
        setQuestion("");
        setOptions(["", ""]);
        fetchPolls();
      } else {
        toast({ title: "Creation Failed", description: "Could not save poll.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (pollId: string, currentStatus: 'active' | 'closed') => {
    const nextStatus = currentStatus === 'active' ? 'closed' : 'active';
    const success = await PollService.togglePollStatus(pollId, nextStatus);
    if (success) {
      toast({ title: "Status Updated", description: `Poll status changed to ${nextStatus}.` });
      fetchPolls();
    } else {
      toast({ title: "Update Failed", description: "Could not update status.", variant: "destructive" });
    }
  };

  const handleDeletePoll = async (pollId: string) => {
    if (!confirm("Are you sure you want to delete this poll? This action cannot be undone.")) return;
    const success = await PollService.deletePoll(pollId);
    if (success) {
      toast({ title: "Poll Deleted", description: "Poll has been removed permanently." });
      if (selectedPoll?.id === pollId) setSelectedPoll(null);
      fetchPolls();
    } else {
      toast({ title: "Delete Failed", description: "Could not delete poll.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Vote className="w-5 h-5 text-indigo-400" />
            Community Polls Manager
          </h2>
          <p className="text-sm text-muted-foreground">
            Publish interactive polls (Dashboard Widget or One-Time Popup) and monitor live analytics.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchPolls} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Create Poll Card */}
        <Card className="lg:col-span-5 glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Create New Poll
            </CardTitle>
            <CardDescription>Target visitors via inline widgets or a one-time popup</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePoll} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="poll-question">Poll Question</Label>
                <Input
                  id="poll-question"
                  placeholder="e.g. Is it a good idea to introduce logins?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Choices / Options</Label>
                  <span className="text-xs text-muted-foreground">{options.length}/6 options</span>
                </div>
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="bg-background/50"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(idx)}
                        className="text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {options.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOption}
                    className="w-full border-dashed border-white/20 mt-1"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Option
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label>Display Format</Label>
                  <Select value={displayType} onValueChange={(val: any) => setDisplayType(val)}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">Both (Widget & Popup)</SelectItem>
                      <SelectItem value="popup">One-Time Popup Only</SelectItem>
                      <SelectItem value="widget">Dashboard Widget Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Target Exam Scope</Label>
                  <Select value={examMode} onValueChange={(val: any) => setExamMode(val)}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Visitors</SelectItem>
                      <SelectItem value="kcet">KCET Mode Only</SelectItem>
                      <SelectItem value="comedk">COMEDK Mode Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-background/30 mt-2">
                <Label htmlFor="active-switch" className="text-xs cursor-pointer">Activate Immediately</Label>
                <Switch
                  id="active-switch"
                  checked={setActiveImmediately}
                  onCheckedChange={setSetActiveImmediately}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" /> Publish Poll
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Polls & Detailed List */}
        <Card className="lg:col-span-7 glass-strong border-white/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Active & Past Polls ({polls.length})
            </CardTitle>
            <CardDescription>Click inspect to view detailed voter demographics & history</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 flex justify-center items-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading polls...
              </div>
            ) : polls.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No polls created yet. Fill the form to launch your first poll!
              </div>
            ) : (
              <div className="space-y-3">
                {polls.map((p) => {
                  const isActive = p.status === "active";
                  return (
                    <div
                      key={p.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isActive
                          ? "border-emerald-500/30 bg-emerald-950/10"
                          : "border-white/10 bg-background/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className={isActive ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : ""}
                            >
                              {isActive ? "Active" : "Closed"}
                            </Badge>
                            <Badge variant="outline" className="text-xs uppercase">
                              {p.examMode}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
                              Format: {p.displayType || 'both'}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" /> {p.totalVotes} total votes
                            </span>
                          </div>
                          <h4 className="font-semibold text-foreground text-sm pt-1">{p.question}</h4>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 flex-wrap">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              PollService.clearPollDismissal(p.id);
                              window.dispatchEvent(new CustomEvent('trigger-poll-popup', { detail: { poll: p } }));
                            }}
                            className="h-8 px-2 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-1" /> Test Popup
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedPoll(p)}
                            className="h-8 px-2.5 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" /> Inspect Data
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(p.id, p.status)}
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            {isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePoll(p.id)}
                            className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      {/* Options Quick Bar */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/5">
                        {p.options.map((opt) => {
                          const pct = p.totalVotes > 0 ? Math.round((opt.voteCount / p.totalVotes) * 100) : 0;
                          return (
                            <div key={opt.id} className="text-xs space-y-1">
                              <div className="flex justify-between text-muted-foreground">
                                <span className="truncate max-w-[140px]">{opt.text}</span>
                                <span className="font-semibold">{pct}% ({opt.voteCount})</span>
                              </div>
                              <Progress value={pct} className="h-1.5 [&>div]:bg-indigo-500" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Inspection Modal */}
      {selectedPoll && (
        <Dialog open={Boolean(selectedPoll)} onOpenChange={() => setSelectedPoll(null)}>
          <DialogContent className="max-w-2xl glass-strong border-white/10">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <BarChart3 className="w-5 h-5 text-indigo-400" /> Poll Detailed Analytics
              </DialogTitle>
              <DialogDescription>{selectedPoll.question}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Overview Cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-background/50 border border-white/10 text-center">
                  <div className="text-xs text-muted-foreground">Total Votes</div>
                  <div className="text-xl font-extrabold text-indigo-400 mt-1">{selectedPoll.totalVotes}</div>
                </div>
                <div className="p-3 rounded-xl bg-background/50 border border-white/10 text-center">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <Badge variant={selectedPoll.status === 'active' ? 'default' : 'secondary'} className="mt-1">
                    {selectedPoll.status}
                  </Badge>
                </div>
                <div className="p-3 rounded-xl bg-background/50 border border-white/10 text-center">
                  <div className="text-xs text-muted-foreground">Format</div>
                  <div className="text-xs font-semibold uppercase mt-1 text-foreground">{selectedPoll.displayType || 'both'}</div>
                </div>
                <div className="p-3 rounded-xl bg-background/50 border border-white/10 text-center">
                  <div className="text-xs text-muted-foreground">Target Scope</div>
                  <div className="text-xs font-semibold uppercase mt-1 text-foreground">{selectedPoll.examMode}</div>
                </div>
              </div>

              {/* Vote Breakdown per Option */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" /> Complete Vote Breakdown
                </h4>
                <div className="space-y-2">
                  {selectedPoll.options.map((opt) => {
                    const pct = selectedPoll.totalVotes > 0 ? Math.round((opt.voteCount / selectedPoll.totalVotes) * 100) : 0;
                    return (
                      <div key={opt.id} className="p-3 rounded-xl border border-white/10 bg-background/40 space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{opt.text}</span>
                          <span className="font-bold text-emerald-400">{pct}% ({opt.voteCount} votes)</span>
                        </div>
                        <Progress value={pct} className="h-2.5 rounded-full [&>div]:bg-emerald-500" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Vote History Logs */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Recent Vote Log ({selectedPoll.voteHistory?.length || 0})
                </h4>
                {selectedPoll.voteHistory && selectedPoll.voteHistory.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                    {selectedPoll.voteHistory.slice().reverse().map((rec) => {
                      const matchedOpt = selectedPoll.options.find(o => o.id === rec.optionId);
                      return (
                        <div key={rec.id} className="text-xs p-2 rounded-lg bg-background/30 border border-white/5 flex items-center justify-between">
                          <span className="text-foreground font-medium truncate max-w-[200px]">
                            Voted: {matchedOpt?.text || rec.optionId}
                          </span>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {rec.examMode || 'all'}
                            </Badge>
                            <span>{new Date(rec.votedAt).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-4 bg-background/20 rounded-lg">
                    No detailed vote logs recorded yet.
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

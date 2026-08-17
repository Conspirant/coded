import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useExamMode } from "@/contexts/ExamModeContext";
import { isUnlocked } from "@/lib/unlock";
import { useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  Sparkles,
  Crown,
  Bookmark,
  History,
  Target,
  ArrowRight,
  Calculator,
  Compass,
  CheckCircle2,
  Share2,
  Trash2,
  LogIn,
  LogOut,
  Mail,
  ShieldCheck,
  Building,
  BookOpen,
  Award,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export interface StoredUserProfile {
  name?: string;
  rank?: number;
  category?: string;
  preferredStream?: string;
  targetCollege?: string;
  boardMarks?: number;
  comedkRank?: number;
}

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgradeClick?: () => void;
}

const KEA_CATEGORIES = [
  { code: "GM", label: "General Merit (GM)" },
  { code: "1G", label: "Category 1 General (1G)" },
  { code: "1K", label: "Category 1 Kannada (1K)" },
  { code: "1R", label: "Category 1 Rural (1R)" },
  { code: "2AG", label: "2A General (2AG)" },
  { code: "2AK", label: "2A Kannada (2AK)" },
  { code: "2AR", label: "2A Rural (2AR)" },
  { code: "2BG", label: "2B General (2BG)" },
  { code: "2BK", label: "2B Kannada (2BK)" },
  { code: "2BR", label: "2B Rural (2BR)" },
  { code: "3AG", label: "3A General (3AG)" },
  { code: "3AK", label: "3A Kannada (3AK)" },
  { code: "3AR", label: "3A Rural (3AR)" },
  { code: "3BG", label: "3B General (3BG)" },
  { code: "3BK", label: "3B Kannada (3BK)" },
  { code: "3BR", label: "3B Rural (3BR)" },
  { code: "SCG", label: "SC General (SCG)" },
  { code: "SCK", label: "SC Kannada (SCK)" },
  { code: "SCR", label: "SC Rural (SCR)" },
  { code: "STG", label: "ST General (STG)" },
  { code: "STK", label: "ST Kannada (STK)" },
  { code: "STR", label: "ST Rural (STR)" },
];

const ENGINEERING_STREAMS = [
  "Computer Science & Engineering (CSE)",
  "AI & Machine Learning (AI/ML)",
  "Information Science & Engineering (ISE)",
  "Electronics & Communication (ECE)",
  "Data Science / Cyber Security",
  "Electrical & Electronics (EEE)",
  "Mechanical Engineering",
  "Civil Engineering",
  "Biotechnology",
  "Aerospace & Aeronautical",
];

const DREAM_COLLEGES = [
  "RV College of Engineering (RVCE), Bengaluru",
  "BMS College of Engineering (BMSCE), Bengaluru",
  "M.S. Ramaiah Institute of Technology (MSRIT), Bengaluru",
  "PES University (Ring Road / EC Campus), Bengaluru",
  "University Visvesvaraya College of Engg (UVCE), Bengaluru",
  "Dayananda Sagar College of Engineering (DSCE), Bengaluru",
  "Bangalore Institute of Technology (BIT), Bengaluru",
  "BMS Institute of Technology (BMSIT), Bengaluru",
  "Sir M. Visvesvaraya Institute of Technology (SMVIT), Bengaluru",
  "National Institute of Engineering (NIE), Mysuru",
  "SJCE (JSS Science & Tech), Mysuru",
  "Siddaganga Institute of Technology (SIT), Tumakuru",
];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  open,
  onOpenChange,
  onUpgradeClick,
}) => {
  const navigate = useNavigate();
  const { examMode } = useExamMode();
  let authContext: any = null;
  try {
    authContext = useAuth();
  } catch {
    // Graceful fallback if used outside AuthProvider
  }

  const user = authContext?.user || null;
  const authProfile = authContext?.profile || null;
  const signInWithEmail = authContext?.signInWithEmail;
  const signInWithGoogle = authContext?.signInWithGoogle;
  const signOut = authContext?.signOut;
  const updateUserProfile = authContext?.updateUserProfile;

  // Local student profile state
  const [profile, setProfile] = useState<StoredUserProfile>(() => {
    try {
      const saved = localStorage.getItem("kcet_user_profile");
      if (saved) return JSON.parse(saved);
      const savedResults = localStorage.getItem("kcetResults");
      if (savedResults) {
        const parsed = JSON.parse(savedResults);
        const last = parsed[parsed.length - 1];
        if (last && last.rank) {
          return {
            name: "Candidate",
            rank: last.rank,
            category: "GM",
            preferredStream: "Computer Science & Engineering (CSE)",
            boardMarks: last.puc || 90,
          };
        }
      }
    } catch {
      // fallback
    }
    return {
      name: "Candidate",
      rank: 12500,
      category: "GM",
      preferredStream: "Computer Science & Engineering (CSE)",
      targetCollege: "RV College of Engineering (RVCE), Bengaluru",
      boardMarks: 90,
      comedkRank: 8500,
    };
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [emailInput, setEmailInput] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(isUnlocked());

  // Metrics from local storage
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [savedHistory, setSavedHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;
    setUnlocked(isUnlocked());

    // 1. Load profile
    try {
      const saved = localStorage.getItem("kcet_user_profile");
      if (saved) {
        setProfile(JSON.parse(saved));
      } else if (authProfile?.kcet_rank) {
        setProfile((prev) => ({
          ...prev,
          name: authProfile.display_name || prev.name,
          rank: authProfile.kcet_rank || prev.rank,
          category: authProfile.kcet_category || prev.category,
        }));
      }
    } catch {}

    // 2. Load bookmarks count
    try {
      const bmarks = localStorage.getItem("kcet_bookmarks");
      if (bmarks) {
        const parsed = JSON.parse(bmarks);
        setBookmarkCount(Array.isArray(parsed) ? parsed.length : 0);
      } else {
        setBookmarkCount(0);
      }
    } catch {
      setBookmarkCount(0);
    }

    // 3. Load saved prediction history
    try {
      const hist = localStorage.getItem("kcetResults");
      if (hist) {
        const parsed = JSON.parse(hist);
        if (Array.isArray(parsed)) setSavedHistory(parsed);
      }
    } catch {}
  }, [open, authProfile]);

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem("kcet_user_profile", JSON.stringify(profile));
      window.dispatchEvent(new CustomEvent("kcet_user_profile_updated", { detail: profile }));

      if (updateUserProfile && user) {
        await updateUserProfile({
          display_name: profile.name || "Student Aspirant",
          kcet_rank: profile.rank,
          kcet_category: profile.category,
          badge: profile.rank ? `Rank #${profile.rank.toLocaleString()} (${profile.category || "GM"})` : "Verified Student",
        });
      }

      toast.success("Counseling Profile Updated!", {
        description: `Target set to Rank #${profile.rank?.toLocaleString() || "12,500"} (${profile.category || "GM"}).`,
      });
    } catch {
      toast.error("Failed to save profile.");
    }
  };

  const handleRankShortcut = (rankVal: number) => {
    setProfile((prev) => ({ ...prev, rank: rankVal }));
  };

  const handleQuickPredictor = () => {
    onOpenChange(false);
    navigate(`/college-predictor?rank=${profile.rank || 12500}&category=${profile.category || "GM"}`);
  };

  const handleQuickSimulator = () => {
    onOpenChange(false);
    navigate("/mock-simulator");
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!signInWithEmail) {
      toast.info("Auth service is in local guest mode.");
      return;
    }
    setEmailLoading(true);
    const res = await signInWithEmail(emailInput);
    setEmailLoading(false);
    if (res.success) {
      setEmailInput("");
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear saved prediction calculations and local history?")) {
      localStorage.removeItem("kcetResults");
      setSavedHistory([]);
      toast.info("Prediction history cleared.");
    }
  };

  const handleClearBookmarks = () => {
    if (window.confirm("Are you sure you want to clear all bookmarked colleges?")) {
      localStorage.removeItem("kcet_bookmarks");
      setBookmarkCount(0);
      toast.info("Bookmarked colleges cleared.");
    }
  };

  const userInitial = (profile.name || user?.email || "C").charAt(0).toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border/80 text-foreground p-0 shadow-2xl rounded-2xl">
        {/* Top Header Card */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-primary/15 via-background to-secondary/30 border-b border-border/60">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* Avatar Pill */}
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 font-extrabold text-lg text-primary-foreground shadow-md ring-2 ring-primary/30">
                {userInitial}
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background" title="Active">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-foreground">
                    {profile.name || "KCET Aspirant"}
                  </h2>
                  {unlocked ? (
                    <Badge className="bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border-amber-500/30 text-[10px] font-mono px-2 py-0.5 flex items-center gap-1 font-bold">
                      <Crown className="h-3 w-3 fill-amber-400" /> Pro Member
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground">
                      Free Plan
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  <span>{examMode} 2026 Target</span>
                  <span>•</span>
                  <span className="font-mono font-semibold text-primary">
                    #{profile.rank?.toLocaleString() || "12,500"} ({profile.category || "GM"})
                  </span>
                </p>
              </div>
            </div>

            {!unlocked && onUpgradeClick && (
              <Button
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onUpgradeClick();
                }}
                className="shrink-0 h-8 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm flex items-center gap-1.5 rounded-lg"
              >
                <Crown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Unlock Pro</span> (₹119)
              </Button>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-border/40 text-center">
            <div className="p-2 rounded-xl bg-background/50 border border-border/40">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">Target Rank</span>
              <span className="text-sm font-extrabold font-mono text-primary">
                #{profile.rank?.toLocaleString() || "--"}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-background/50 border border-border/40">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">Saved Cutoffs</span>
              <span className="text-sm font-extrabold font-mono text-amber-400">
                {bookmarkCount} Saved
              </span>
            </div>
            <div className="p-2 rounded-xl bg-background/50 border border-border/40">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground block">Board Aggregate</span>
              <span className="text-sm font-extrabold font-mono text-emerald-400">
                {profile.boardMarks ? `${profile.boardMarks}%` : "--"}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-4 sm:p-6 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/60 p-1 rounded-xl">
              <TabsTrigger value="profile" className="text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Academic Profile</span>
              </TabsTrigger>
              <TabsTrigger value="shortlists" className="text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5 text-amber-400" />
                <span>Shortlists ({bookmarkCount})</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs font-semibold rounded-lg flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Quick Hub</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: ACADEMIC PROFILE SETTINGS */}
            <TabsContent value="profile" className="space-y-4 mt-4 focus-visible:outline-none">
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">Candidate Name / Nickname</Label>
                    <Input
                      placeholder="e.g. Rohan Kumar"
                      value={profile.name || ""}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">KEA Reservation Category</Label>
                    <Select
                      value={profile.category || "GM"}
                      onValueChange={(val) => setProfile({ ...profile, category: val })}
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                        {KEA_CATEGORIES.map((cat) => (
                          <SelectItem key={cat.code} value={cat.code} className="text-xs">
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Target KCET Rank Input + Shortcuts */}
                <div className="space-y-2 p-3.5 rounded-xl border border-border/50 bg-secondary/20">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-primary" />
                      KCET Predicted / Target Rank
                    </Label>
                    <span className="text-[11px] text-muted-foreground">Used across predictors & dashboard</span>
                  </div>
                  <Input
                    type="number"
                    min={1}
                    max={350000}
                    placeholder="e.g. 12500"
                    value={profile.rank || ""}
                    onChange={(e) => setProfile({ ...profile, rank: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                    className="h-9 font-mono font-bold text-sm text-foreground bg-background"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-muted-foreground font-semibold">Quick Presets:</span>
                    {[3000, 8000, 15000, 25000, 45000, 80000].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRankShortcut(r)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold transition-colors cursor-pointer ${
                          profile.rank === r
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                        }`}
                      >
                        #{r >= 1000 ? `${r / 1000}k` : r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">12th / PUC PCM Board %</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={100}
                      placeholder="e.g. 92.5"
                      value={profile.boardMarks || ""}
                      onChange={(e) => setProfile({ ...profile, boardMarks: e.target.value ? parseFloat(e.target.value) : undefined })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">COMEDK Rank Target</Label>
                    <Input
                      type="number"
                      min={1}
                      max={100000}
                      placeholder="e.g. 8500"
                      value={profile.comedkRank || ""}
                      onChange={(e) => setProfile({ ...profile, comedkRank: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">Preferred Engineering Branch</Label>
                  <Select
                    value={profile.preferredStream || ENGINEERING_STREAMS[0]}
                    onValueChange={(val) => setProfile({ ...profile, preferredStream: val })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select Preferred Branch" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {ENGINEERING_STREAMS.map((st) => (
                        <SelectItem key={st} value={st} className="text-xs">
                          {st}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">Dream Campus / College Goal</Label>
                  <Select
                    value={profile.targetCollege || DREAM_COLLEGES[0]}
                    onValueChange={(val) => setProfile({ ...profile, targetCollege: val })}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select Target College" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {DREAM_COLLEGES.map((c) => (
                        <SelectItem key={c} value={c} className="text-xs">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <Button
                    type="submit"
                    className="w-full h-9 font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm rounded-lg"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Save & Apply Counseling Profile
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* TAB 2: SAVED SHORTLISTS & BOOKMARKS */}
            <TabsContent value="shortlists" className="space-y-4 mt-4 focus-visible:outline-none">
              {/* Bookmarks Section */}
              <div className="p-4 rounded-xl border border-border/50 bg-secondary/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-amber-400 fill-amber-400/20" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Bookmarked Cutoffs</h4>
                      <p className="text-[11px] text-muted-foreground">
                        {bookmarkCount > 0
                          ? `You have ${bookmarkCount} saved college choices in your personal shortlist.`
                          : "No colleges bookmarked yet. Click the star icon on any cutoff row."}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs font-bold border-amber-500/30 text-amber-400 bg-amber-500/10">
                    {bookmarkCount}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    onClick={handleQuickPredictor}
                    className="flex-1 h-8 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg"
                  >
                    <Compass className="h-3.5 w-3.5 mr-1.5" />
                    View Shortlist in Predictor
                  </Button>
                  {bookmarkCount > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleClearBookmarks}
                      className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 border-border"
                      title="Clear Bookmarks"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Saved Rank Calculations History */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5 text-primary" />
                    Recent Rank Predictions
                  </h4>
                  {savedHistory.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearHistory}
                      className="h-6 text-[10px] text-muted-foreground hover:text-destructive p-0 px-2"
                    >
                      Clear History
                    </Button>
                  )}
                </div>

                {savedHistory.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {savedHistory
                      .slice()
                      .reverse()
                      .slice(0, 4)
                      .map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg border border-border/40 bg-background/50 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-mono font-bold text-foreground">
                              Predicted Rank: ~{item.rank?.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              CET: {item.cet}/180 • Board: {item.puc}% • {item.percentile || ""}
                            </div>
                          </div>
                          <Badge variant="secondary" className="font-mono text-[9px]">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-border/60 text-center text-xs text-muted-foreground">
                    No calculations saved yet. Calculate your rank on the Rank Predictor to save runs here.
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 3: QUICK TOOLS & CLOUD SYNC */}
            <TabsContent value="tools" className="space-y-4 mt-4 focus-visible:outline-none">
              {/* Quick Launch Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleQuickPredictor}
                  className="p-3 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all text-left space-y-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <Compass className="h-4 w-4 text-primary" />
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                    College Predictor
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Match rank #{profile.rank?.toLocaleString() || "12,500"} against cutoffs
                  </p>
                </button>

                <button
                  type="button"
                  onClick={handleQuickSimulator}
                  className="p-3 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all text-left space-y-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <Layers className="h-4 w-4 text-indigo-400" />
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="font-bold text-xs text-foreground group-hover:text-indigo-400 transition-colors">
                    Mock Simulator
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Simulate real KEA Round 1, 2, & Extended allotment
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    navigate("/rank-predictor");
                  }}
                  className="p-3 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all text-left space-y-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <Calculator className="h-4 w-4 text-emerald-400" />
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="font-bold text-xs text-foreground group-hover:text-emerald-400 transition-colors">
                    Rank Predictor
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Marks vs Rank normalization models
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    navigate("/fee-calculator");
                  }}
                  className="p-3 rounded-xl border border-border/50 bg-secondary/30 hover:bg-secondary/60 hover:border-primary/40 transition-all text-left space-y-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <Building className="h-4 w-4 text-cyan-400" />
                    <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="font-bold text-xs text-foreground group-hover:text-cyan-400 transition-colors">
                    Fee Calculator
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    4-year tuition, hostel & scholarship check
                  </p>
                </button>
              </div>

              {/* Community & Cloud Account Sync */}
              <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Community & Cloud Account</h4>
                      <p className="text-[11px] text-muted-foreground">
                        {user ? `Connected as ${user.email}` : "Sign in to post questions on the KCET Forum & backup choices."}
                      </p>
                    </div>
                  </div>
                  {user && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] font-mono">
                      Online
                    </Badge>
                  )}
                </div>

                {user ? (
                  <div className="flex items-center justify-between pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onOpenChange(false);
                        navigate("/forum");
                      }}
                      className="h-8 text-xs font-semibold"
                    >
                      Open Aspirants Forum
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        if (signOut) await signOut();
                      }}
                      className="h-8 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1.5"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSignIn} className="space-y-2 pt-1">
                    <div className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="Enter email to sync or login"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="h-8 text-xs bg-background"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={emailLoading}
                        className="h-8 text-xs font-bold shrink-0 bg-primary text-primary-foreground"
                      >
                        {emailLoading ? "Sending..." : "Send Link"}
                      </Button>
                    </div>
                    {signInWithGoogle && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={signInWithGoogle}
                        className="w-full h-8 text-xs border-border flex items-center justify-center gap-2"
                      >
                        <LogIn className="h-3.5 w-3.5" />
                        Continue with Google
                      </Button>
                    )}
                  </form>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

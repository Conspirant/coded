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
  Trash2,
  LogIn,
  LogOut,
  ShieldCheck,
  Building,
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
  const {
    user,
    profile: authProfile,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    updateUserProfile,
  } = useAuth();

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
    } catch {}
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
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [savedHistory, setSavedHistory] = useState<any[]>([]);

  useEffect(() => {
    setUnlocked(isUnlocked() || Boolean(authProfile?.is_pro));
    const unsub = subscribeToUnlockState((isNowUnlocked) => {
      setUnlocked(isNowUnlocked || Boolean(authProfile?.is_pro));
    });
    return () => unsub();
  }, [open, authProfile]);

  useEffect(() => {
    if (!open) return;
    setUnlocked(isUnlocked() || Boolean(authProfile?.is_pro));

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

      toast.success("Profile Updated", {
        description: `Target set to Rank #${profile.rank?.toLocaleString() || "12,500"} (${profile.category || "GM"}).`,
      });
      onOpenChange(false);
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
    if (window.confirm("Clear saved prediction calculations from local storage?")) {
      localStorage.removeItem("kcetResults");
      setSavedHistory([]);
      toast.info("Prediction history cleared.");
    }
  };

  const handleClearBookmarks = () => {
    if (window.confirm("Clear all bookmarked colleges?")) {
      localStorage.removeItem("kcet_bookmarks");
      setBookmarkCount(0);
      toast.info("Bookmarked colleges cleared.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg z-[100] max-h-[90vh] overflow-y-auto mx-2 bg-card border-border shadow-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-foreground">
              <User className="h-4 w-4 text-primary" />
              Student Profile & Preferences
            </DialogTitle>
            {unlocked ? (
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-mono px-2 py-0.5 font-semibold">
                <Crown className="h-3 w-3 mr-1 fill-amber-400" /> Pro Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] font-mono border-border text-muted-foreground">
                Free Tier
              </Badge>
            )}
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure your target rank, category, and preferences used across all predictor tools.
          </DialogDescription>
        </DialogHeader>

        {/* Profile Summary Card */}
        <div className="p-3 rounded-lg border border-border bg-muted/30 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Target Rank</span>
            <span className="font-mono font-bold text-foreground text-sm">
              #{profile.rank?.toLocaleString() || "--"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Category</span>
            <span className="font-mono font-bold text-foreground text-sm">
              {profile.category || "GM"}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Saved</span>
            <span className="font-mono font-bold text-primary text-sm">
              {bookmarkCount} {bookmarkCount === 1 ? "choice" : "choices"}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted p-0.5 rounded-md">
            <TabsTrigger value="profile" className="text-xs font-medium rounded">
              Academic Targets
            </TabsTrigger>
            <TabsTrigger value="shortlists" className="text-xs font-medium rounded">
              Saved Shortlist
            </TabsTrigger>
            <TabsTrigger value="account" className="text-xs font-medium rounded">
              Account & Sync
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: ACADEMIC PROFILE */}
          <TabsContent value="profile" className="space-y-4 focus-visible:outline-none">
            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">Candidate Name / Tag</Label>
                  <Input
                    placeholder="e.g. Student Candidate"
                    value={profile.name || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="h-8 text-xs bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">KEA Reservation Category</Label>
                  <Select
                    value={profile.category || "GM"}
                    onValueChange={(val) => setProfile({ ...profile, category: val })}
                  >
                    <SelectTrigger className="h-8 text-xs bg-background">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56 z-[200]">
                      {KEA_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.code} value={cat.code} className="text-xs">
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Target Rank Input + Quick Presets */}
              <div className="space-y-2 p-3 rounded-md border border-border bg-muted/40">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-primary" />
                    KCET Target / Estimated Rank
                  </Label>
                  <span className="text-[10px] text-muted-foreground font-mono">1 to 3,50,000</span>
                </div>
                <Input
                  type="number"
                  min={1}
                  max={350000}
                  placeholder="e.g. 12500"
                  value={profile.rank || ""}
                  onChange={(e) => setProfile({ ...profile, rank: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                  className="h-8 font-mono font-semibold text-xs text-foreground bg-background"
                />
                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                  <span className="text-[10px] text-muted-foreground">Presets:</span>
                  {[3000, 8000, 15000, 25000, 45000, 75000].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRankShortcut(r)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                        profile.rank === r
                          ? "bg-primary text-primary-foreground font-bold"
                          : "bg-background border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      #{r >= 1000 ? `${r / 1000}k` : r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">12th / PUC PCM Board %</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    placeholder="e.g. 91.5"
                    value={profile.boardMarks || ""}
                    onChange={(e) => setProfile({ ...profile, boardMarks: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="h-8 text-xs font-mono bg-background"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">COMEDK Target Rank</Label>
                  <Input
                    type="number"
                    min={1}
                    max={100000}
                    placeholder="e.g. 8500"
                    value={profile.comedkRank || ""}
                    onChange={(e) => setProfile({ ...profile, comedkRank: e.target.value ? parseInt(e.target.value, 10) : undefined })}
                    className="h-8 text-xs font-mono bg-background"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">Preferred Engineering Branch</Label>
                <Select
                  value={profile.preferredStream || ENGINEERING_STREAMS[0]}
                  onValueChange={(val) => setProfile({ ...profile, preferredStream: val })}
                >
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue placeholder="Select Preferred Branch" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 z-[200]">
                    {ENGINEERING_STREAMS.map((st) => (
                      <SelectItem key={st} value={st} className="text-xs">
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">Dream College Goal</Label>
                <Select
                  value={profile.targetCollege || DREAM_COLLEGES[0]}
                  onValueChange={(val) => setProfile({ ...profile, targetCollege: val })}
                >
                  <SelectTrigger className="h-8 text-xs bg-background">
                    <SelectValue placeholder="Select Target College" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 z-[200]">
                    {DREAM_COLLEGES.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs">
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-8 font-semibold text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
                >
                  Save Profile Settings
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* TAB 2: SHORTLISTS & SAVED DATA */}
          <TabsContent value="shortlists" className="space-y-3.5 focus-visible:outline-none">
            {/* Bookmarks Section */}
            <div className="p-3 rounded-md border border-border bg-muted/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-primary" />
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Bookmarked Colleges</h4>
                    <p className="text-[11px] text-muted-foreground">
                      {bookmarkCount > 0
                        ? `${bookmarkCount} college choices saved locally.`
                        : "No colleges bookmarked yet."}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs font-bold">
                  {bookmarkCount}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleQuickPredictor}
                  className="flex-1 h-7 text-xs font-medium"
                >
                  View in Predictor
                </Button>
                {bookmarkCount > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearBookmarks}
                    className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Clear Bookmarks"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Saved Rank Calculations History */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-muted-foreground" />
                  Recent Rank Calculations
                </h4>
                {savedHistory.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearHistory}
                    className="h-6 text-[10px] text-muted-foreground hover:text-destructive p-0 px-1.5"
                  >
                    Clear
                  </Button>
                )}
              </div>

              {savedHistory.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                  {savedHistory
                    .slice()
                    .reverse()
                    .slice(0, 4)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded border border-border bg-background flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-mono font-semibold text-foreground">
                            Rank ~{item.rank?.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            CET: {item.cet}/180 • Board: {item.puc}%
                          </div>
                        </div>
                        <Badge variant="secondary" className="font-mono text-[9px]">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="p-4 rounded border border-dashed border-border text-center text-xs text-muted-foreground">
                  No prediction history stored. Run Rank Predictor to save history here.
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 3: ACCOUNT & QUICK ACTIONS */}
          <TabsContent value="account" className="space-y-3 focus-visible:outline-none">
            {/* Quick Tools Navigation */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickPredictor}
                className="p-2.5 rounded-md border border-border bg-muted/30 hover:bg-muted/60 transition-colors text-left space-y-0.5 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary">
                  <span>College Predictor</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Match cutoff ranks
                </p>
              </button>

              <button
                type="button"
                onClick={handleQuickSimulator}
                className="p-2.5 rounded-md border border-border bg-muted/30 hover:bg-muted/60 transition-colors text-left space-y-0.5 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary">
                  <span>Mock Simulator</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Seat allotment practice
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/rank-predictor");
                }}
                className="p-2.5 rounded-md border border-border bg-muted/30 hover:bg-muted/60 transition-colors text-left space-y-0.5 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary">
                  <span>Rank Predictor</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Marks vs rank model
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  navigate("/fee-calculator");
                }}
                className="p-2.5 rounded-md border border-border bg-muted/30 hover:bg-muted/60 transition-colors text-left space-y-0.5 group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-foreground group-hover:text-primary">
                  <span>Fee Calculator</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Tuition & hostel costs
                </p>
              </button>
            </div>

            {/* Cloud Pro & Account Sync */}
            <div className="p-3 rounded-md border border-border bg-muted/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">Cloud Account & Sync</h4>
                    <p className="text-[11px] text-muted-foreground">
                      {user ? `Signed in as ${user.email}` : "Sign in (optional) to use your profile & Pro features across all your devices."}
                    </p>
                  </div>
                </div>
                {user && (
                  <Badge variant="outline" className="text-[9px] font-mono text-emerald-500 border-emerald-500/30">
                    Synced
                  </Badge>
                )}
              </div>

              {unlocked && (
                <div className="p-2 rounded bg-background border border-border text-[11px] space-y-1">
                  <div className="flex items-center justify-between font-medium text-foreground">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Crown className="h-3 w-3 fill-amber-500" />
                      {user ? "Pro Synced to Account" : "Pro Active on this Device"}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {isUnlocked() ? "Unlocked" : ""}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {user
                      ? "Your Pro plan is linked to your Google/Email login. Signing in on any phone, tablet, or PC unlocks Pro automatically."
                      : "Tip: Sign in with Google below to link Pro to your account so you can use it on any device without entering passcodes."}
                  </p>
                </div>
              )}

              {user ? (
                <div className="flex items-center justify-between pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onOpenChange(false);
                      navigate("/forum");
                    }}
                    className="h-7 text-xs font-medium"
                  >
                    Open Forum
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      if (signOut) await signOut();
                    }}
                    className="h-7 text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleEmailSignIn} className="space-y-2 pt-1">
                  <div className="flex gap-1.5">
                    <Input
                      type="email"
                      placeholder="Enter email to sign in"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="h-7 text-xs bg-background"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={emailLoading}
                      className="h-7 text-xs font-semibold shrink-0"
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
                      className="w-full h-7 text-xs flex items-center justify-center gap-1.5"
                    >
                      <LogIn className="h-3 w-3" />
                      Sign in with Google
                    </Button>
                  )}
                </form>
              )}
            </div>

            {/* Pro Upgrade Shortcut */}
            {!unlocked && onUpgradeClick && (
              <div className="p-3 rounded-md border border-border bg-muted/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Crown className="h-3.5 w-3.5 text-amber-500" />
                    Upgrade to Pro Plan
                  </h4>
                  <p className="text-[10px] text-muted-foreground">
                    Get unlimited access to counseling predictors & AI assistant.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onUpgradeClick();
                  }}
                  className="h-7 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  ₹119
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck, Mail, LogIn, Award, Sparkles, LogOut } from "lucide-react";
import { toast } from "sonner";

interface ForumAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  "GM", "1G", "1K", "1R",
  "2AG", "2AK", "2AR",
  "2BG", "2BK", "2BR",
  "3AG", "3AK", "3AR",
  "3BG", "3BK", "3BR",
  "SCG", "STG"
];

export const ForumAuthModal: React.FC<ForumAuthModalProps> = ({ open, onOpenChange }) => {
  const { user, profile, signInWithGoogle, signInWithEmail, signOut, updateUserProfile } = useAuth();

  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Profile Edit State
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [kcetRank, setKcetRank] = useState<string>(profile?.kcet_rank ? String(profile.kcet_rank) : "");
  const [category, setCategory] = useState<string>(profile?.kcet_category || "GM");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoadingEmail(true);
    const res = await signInWithEmail(email);
    setLoadingEmail(false);
    if (res.success) {
      toast.success("Login code / verification email sent to your inbox!");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const rankNum = kcetRank ? parseInt(kcetRank, 10) : undefined;
    const badgeText = rankNum ? `Rank #${rankNum.toLocaleString()} (${category})` : "Verified Student";

    await updateUserProfile({
      display_name: displayName.trim() || "Student Aspirant",
      kcet_rank: rankNum,
      kcet_category: category,
      badge: badgeText,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-slate-950 border border-white/10 text-white backdrop-blur-2xl shadow-2xl rounded-2xl p-6">
        {user ? (
          /* LOGGED IN PROFILE EDIT STATE */
          <div className="space-y-5">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/20 text-primary">
                  <Award className="h-5 w-5" />
                </div>
                Student Account Profile
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Logged in as <span className="text-white font-medium">{user.email}</span>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-300">Display Name / Handle</Label>
                <Input
                  placeholder="e.g. Rohan_KCET"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-300">KCET Rank</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 12450"
                    value={kcetRank}
                    onChange={(e) => setKcetRank(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-300">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </Button>

                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-xs px-5">
                  Save Profile
                </Button>
              </div>
            </form>
          </div>
        ) : (
          /* LOGGED OUT SIGN-IN STATE */
          <div className="space-y-5">
            <DialogHeader className="space-y-2">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <div className="p-2 rounded-xl bg-primary/20 text-primary">
                  <LogIn className="h-5 w-5" />
                </div>
                Sign In to Join Discussion
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                Log in to post questions, answer fellow aspirants, track responses, and attach verified rank badges.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              {/* Google OAuth Button */}
              <Button
                type="button"
                onClick={signInWithGoogle}
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl text-xs py-2.5 flex items-center justify-center gap-2.5 shadow-md"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Sign in with Google
              </Button>

              <div className="flex items-center gap-3 my-3">
                <div className="h-[1px] bg-white/10 flex-1" />
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">OR</span>
                <div className="h-[1px] bg-white/10 flex-1" />
              </div>

              {/* Email Sign-In Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-slate-300">Email Address</Label>
                  <Input
                    type="email"
                    placeholder="student@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 text-xs"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loadingEmail}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs py-2 flex items-center justify-center gap-2 border border-white/10"
                >
                  <Mail className="h-4 w-4 text-indigo-400" />
                  {loadingEmail ? "Sending Verification..." : "Sign in with Email"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

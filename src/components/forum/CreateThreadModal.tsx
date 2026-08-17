import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ForumCategory, createForumPost, ForumPost } from "@/lib/forum-service";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, MessageSquarePlus, Tag, User, Award, LogIn, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface CreateThreadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: (post: ForumPost) => void;
}

const CATEGORIES: ForumCategory[] = [
  "Option Entry",
  "Cutoff Movements",
  "College vs Branch",
  "Campus & Hostels",
  "Document Verification",
  "General Lounge",
];

export const CreateThreadModal: React.FC<CreateThreadModalProps> = ({
  open,
  onOpenChange,
  onPostCreated,
}) => {
  const { user, profile, signInWithGoogle } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ForumCategory>("Option Entry");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRank, setAuthorRank] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync author details when user opens or auth changes
  useEffect(() => {
    if (user) {
      const name = user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   profile?.display_name || 
                   (user.email ? user.email.split("@")[0] : "Student Aspirant");
      setAuthorName(name);

      if (profile?.kcet_rank) {
        setAuthorRank(`Rank #${profile.kcet_rank.toLocaleString()} (${profile.kcet_category || "GM"})`);
      }
    }
  }, [user, profile, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both the discussion title and details.");
      return;
    }

    if (!user) {
      toast.info("Please sign in with Google to post your question!", {
        description: "Signing in ensures your questions are linked to your profile and prevents spam."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const post = await createForumPost({
        title,
        content,
        category,
        tags,
        authorId: user.id,
        authorName: authorName.trim() || user.email?.split("@")[0] || "KCET Aspirant",
        authorEmail: user.email || undefined,
        authorAvatar: user.user_metadata?.avatar_url || profile?.avatar_url,
        authorRank: authorRank.trim() || (profile?.kcet_rank ? `Rank #${profile.kcet_rank} (${profile.kcet_category || "GM"})` : undefined),
        authorBadge: profile?.is_pro ? "Pro Member" : profile?.kcet_rank ? "KCET Aspirant" : "Verified Student",
      });

      toast.success("Question published live! 🎉", {
        description: "Community mentors and aspirants can now view and answer your thread."
      });
      onPostCreated(post);
      onOpenChange(false);

      // Reset form
      setTitle("");
      setContent("");
      setTagsInput("");
    } catch (err) {
      toast.error("Failed to post question. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-slate-950 border border-white/10 text-white backdrop-blur-xl shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <MessageSquarePlus className="h-5 w-5" />
            </div>
            Ask the Community
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm">
            Ask about college options, KCET/COMEDK cutoffs, or document verification. Get answers from seniors and fellow aspirants.
          </DialogDescription>
        </DialogHeader>

        {/* Auth Banner if not signed in */}
        {!user ? (
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/30 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              <span>Sign in Required to Post</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              To keep discussions high quality and verified, please sign in with Google. It takes 1-click and links your questions to your profile.
            </p>
            <Button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-bold text-xs h-9 rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              Sign in with Google to Post
            </Button>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt={authorName}
                  className="w-8 h-8 rounded-full border border-emerald-500/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold font-mono">
                  {authorName[0]?.toUpperCase() || "S"}
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                  <span>{authorName}</span>
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                </div>
                <div className="text-[10px] text-slate-400">
                  {authorRank || user.email}
                </div>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-semibold">
              Verified Candidate
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Category Select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-slate-300">
              Category
            </Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as ForumCategory)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl focus:ring-primary">
                <SelectValue placeholder="Select Category" />
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

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-slate-300">
              Question Title
            </Label>
            <Input
              placeholder="e.g., Should I choose RVCE ECE or BMSCE CSE for AI?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 focus:ring-primary"
              maxLength={150}
              required
            />
          </div>

          {/* Detailed Content */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-slate-300">
              Details & Context
            </Label>
            <Textarea
              placeholder="Provide relevant details like your rank, category (GM, 2AG, 3BG, 1K, etc.), or specific concerns..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 min-h-[110px] focus:ring-primary"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase text-slate-300 flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-primary" />
              Tags (comma separated)
            </Label>
            <Input
              placeholder="e.g., RVCE, BMSCE, Round2, Cutoffs"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500"
            />
          </div>

          {/* Author Badge Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <Label className="text-xs text-slate-400 flex items-center gap-1">
                <User className="h-3 w-3 text-slate-400" />
                Display Name / Handle
              </Label>
              <Input
                placeholder="e.g., Rohan_S"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-slate-400 flex items-center gap-1">
                <Award className="h-3 w-3 text-primary" />
                Your Rank / Category Badge
              </Label>
              <Input
                placeholder="e.g., Rank #12,450 (GM)"
                value={authorRank}
                onChange={(e) => setAuthorRank(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 text-xs"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-slate-300 hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !user}
              className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white shadow-lg shadow-primary/25 font-semibold px-6 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isSubmitting ? "Publishing..." : "Post Question"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

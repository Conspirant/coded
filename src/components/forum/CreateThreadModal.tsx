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
import { Sparkles, MessageSquarePlus, Tag, User, Award } from "lucide-react";
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
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ForumCategory>("Option Entry");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRank, setAuthorRank] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both the discussion title and details.");
      return;
    }

    try {
      setIsSubmitting(true);
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const post = createForumPost({
        title,
        content,
        category,
        tags,
        authorName: authorName.trim() || "KCET Aspirant",
        authorRank: authorRank.trim() || undefined,
      });

      toast.success("Question posted successfully! Community members can now answer.");
      onPostCreated(post);
      onOpenChange(false);

      // Reset form
      setTitle("");
      setContent("");
      setTagsInput("");
      setAuthorName("");
      setAuthorRank("");
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

          {/* Author Details (Optional / Contextual) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <Label className="text-xs text-slate-400 flex items-center gap-1">
                <User className="h-3 w-3 text-slate-400" />
                Your Name / Handle
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
                Your Rank (Optional Badge)
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
              className="border-white/10 text-slate-300 hover:bg-white/5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white shadow-lg shadow-primary/25 font-semibold px-6"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Post Question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

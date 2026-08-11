import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ForumPost,
  ForumReply,
  addReplyToPost,
  toggleUpvotePost,
  toggleUpvoteReply,
  markReplyAsSolution,
} from "@/lib/forum-service";
import {
  ThumbsUp,
  MessageSquare,
  CheckCircle2,
  Share2,
  CornerDownRight,
  Send,
  User,
  Clock,
  Pin,
  Sparkles,
  Award,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface ThreadDetailModalProps {
  post: ForumPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUpdated: () => void;
}

export const ThreadDetailModal: React.FC<ThreadDetailModalProps> = ({
  post,
  open,
  onOpenChange,
  onPostUpdated,
}) => {
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyRank, setReplyRank] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);

  if (!post) return null;

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const handlePostUpvote = () => {
    toggleUpvotePost(post.id);
    onPostUpdated();
  };

  const handleReplyUpvote = (replyId: string) => {
    toggleUpvoteReply(post.id, replyId);
    onPostUpdated();
  };

  const handleMarkSolution = (replyId: string) => {
    markReplyAsSolution(post.id, replyId);
    toast.success("Updated solution status!");
    onPostUpdated();
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    addReplyToPost({
      postId: post.id,
      parentId: replyingToId,
      content: replyText,
      authorName: replyAuthor.trim() || "Anonymous Student",
      authorRank: replyRank.trim() || undefined,
    });

    toast.success("Your response has been added!");
    setReplyText("");
    setReplyingToId(null);
    onPostUpdated();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  // Group top-level replies and sub-replies
  const topLevelReplies = post.replies.filter((r) => !r.parentId);
  const getSubReplies = (parentId: string) =>
    post.replies.filter((r) => r.parentId === parentId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-slate-950 border border-white/10 text-white backdrop-blur-2xl shadow-2xl rounded-2xl max-h-[92vh] overflow-y-auto p-0">
        {/* Main Post Section */}
        <div className="p-6 border-b border-white/10 bg-slate-900/50 space-y-4">
          <DialogHeader className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              {post.pinned && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 flex items-center gap-1">
                  <Pin className="h-3 w-3 fill-amber-300" />
                  Pinned
                </Badge>
              )}
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {post.category}
              </Badge>
              {post.isSolved && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Solved
                </Badge>
              )}
            </div>

            <DialogTitle className="text-xl sm:text-2xl font-bold leading-tight text-white pt-1">
              {post.title}
            </DialogTitle>

            {/* Author Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>{post.authorName}</span>
              </div>
              {post.authorRank && (
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary-foreground border border-primary/20 font-mono text-[11px] font-semibold">
                  {post.authorRank}
                </span>
              )}
              <span className="text-slate-600">•</span>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </DialogHeader>

          {/* Body Content */}
          <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-4 rounded-xl border border-white/5">
            {post.content}
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePostUpvote}
                className={`flex items-center gap-2 rounded-xl text-xs ${
                  post.userVoted
                    ? "bg-primary/20 text-primary border-primary/50"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                <ThumbsUp className={`h-3.5 w-3.5 ${post.userVoted ? "fill-primary" : ""}`} />
                <span className="font-bold font-mono">{post.upvotes}</span>
                <span>Upvote</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </Button>
            </div>

            <div className="flex items-center gap-1 text-slate-400 font-mono">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
              <span>{post.replyCount} Replies</span>
            </div>
          </div>
        </div>

        {/* Replies List */}
        <div className="p-6 space-y-6">
          <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Discussion Responses ({post.replies.length})
          </h4>

          {topLevelReplies.length === 0 ? (
            <div className="text-center py-8 bg-white/[0.01] rounded-2xl border border-dashed border-white/10">
              <p className="text-slate-400 text-sm">No answers yet. Be the first to help out!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topLevelReplies.map((reply) => {
                const subReplies = getSubReplies(reply.id);
                return (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-xl border transition-all ${
                      reply.isSolution
                        ? "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)]"
                        : "bg-slate-900/40 border-white/5"
                    }`}
                  >
                    {/* Reply Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200">{reply.authorName}</span>
                        {reply.authorRank && (
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono text-[10px]">
                            {reply.authorRank}
                          </span>
                        )}
                        {reply.isSolution && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] py-0 px-1.5">
                            <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-400" /> Accepted Answer
                          </Badge>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Reply Body */}
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>

                    {/* Reply Footer Actions */}
                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/5 text-[11px]">
                      <button
                        onClick={() => handleReplyUpvote(reply.id)}
                        className={`flex items-center gap-1 hover:text-primary transition-colors ${
                          reply.userVoted ? "text-primary font-bold" : "text-slate-400"
                        }`}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        <span>{reply.upvotes}</span>
                      </button>

                      <button
                        onClick={() => setReplyingToId(replyingToId === reply.id ? null : reply.id)}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <CornerDownRight className="h-3 w-3" />
                        Reply
                      </button>

                      <button
                        onClick={() => handleMarkSolution(reply.id)}
                        className="text-slate-400 hover:text-emerald-400 ml-auto"
                      >
                        {reply.isSolution ? "Unmark Solution" : "Mark as Solution"}
                      </button>
                    </div>

                    {/* Sub-Replies */}
                    {subReplies.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-white/10 space-y-2">
                        {subReplies.map((sub) => (
                          <div key={sub.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-medium text-slate-300">{sub.authorName}</span>
                              <span className="text-slate-400">
                                {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 mt-1">{sub.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Reply Form */}
          <form onSubmit={handleAddReply} className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-slate-300 uppercase">
                {replyingToId ? "Reply to Comment" : "Post an Answer"}
              </Label>
              {replyingToId && (
                <button
                  type="button"
                  onClick={() => setReplyingToId(null)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Cancel Replying to Specific Comment
                </button>
              )}
            </div>

            <Textarea
              placeholder="Share your experience, cutoff analysis, or advice..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 text-xs min-h-[80px]"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                placeholder="Your Name (e.g. Senior_RVTCE)"
                value={replyAuthor}
                onChange={(e) => setReplyAuthor(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl text-xs placeholder:text-slate-500"
              />
              <Input
                placeholder="Your Rank / Tag (e.g. Senior Mentor)"
                value={replyRank}
                onChange={(e) => setReplyRank(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl text-xs placeholder:text-slate-500"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-xs px-5"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" />
                Submit Answer
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  ForumPost,
  getStoredPosts,
  addReplyToPost,
  toggleUpvotePost,
  toggleUpvoteReply,
  markReplyAsSolution,
  checkIsAdmin,
  togglePinPost,
  deletePost,
  deleteReply,
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
  ArrowLeft,
  ShieldCheck,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const ThreadDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<ForumPost | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyRank, setReplyRank] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const loadPost = () => {
    if (!postId) return;
    const posts = getStoredPosts();
    const found = posts.find((p) => p.id === postId);
    if (found) {
      setPost(found);
    } else {
      setPost(null);
    }
  };

  useEffect(() => {
    loadPost();
    setIsAdmin(checkIsAdmin());
  }, [postId]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white py-20 px-4 flex flex-col items-center justify-center space-y-4">
        <SEO title="Thread Not Found | KCET Coded Forum" description="The requested discussion thread was not found or has been removed." url="https://kcetcoded.dev/forum" />
        <h2 className="text-2xl font-bold">Thread Not Found</h2>
        <p className="text-slate-400 text-sm">The discussion thread you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate("/forum")} className="bg-primary text-white">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Discussion Forum
        </Button>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const handlePostUpvote = () => {
    toggleUpvotePost(post.id);
    loadPost();
  };

  const handleReplyUpvote = (replyId: string) => {
    toggleUpvoteReply(post.id, replyId);
    loadPost();
  };

  const handleMarkSolution = (replyId: string) => {
    if (!isAdmin) {
      toast.error("Only Forum Administrators can mark solutions.");
      return;
    }
    markReplyAsSolution(post.id, replyId);
    toast.success("Updated solution status!");
    loadPost();
  };

  const handleTogglePin = () => {
    if (!isAdmin) return;
    togglePinPost(post.id);
    toast.success(post.pinned ? "Unpinned thread" : "Pinned thread to top!");
    loadPost();
  };

  const handleDeletePost = () => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this discussion thread?")) {
      deletePost(post.id);
      toast.success("Thread deleted.");
      navigate("/forum");
    }
  };

  const handleDeleteReply = (replyId: string) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this reply?")) {
      deleteReply(post.id, replyId);
      toast.success("Reply deleted.");
      loadPost();
    }
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

    toast.success("Your response has been published!");
    setReplyText("");
    setReplyingToId(null);
    loadPost();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Thread URL copied to clipboard!");
  };

  const topLevelReplies = post.replies.filter((r) => !r.parentId);
  const getSubReplies = (parentId: string) =>
    post.replies.filter((r) => r.parentId === parentId);

  return (
    <div className="min-h-screen bg-[#07090e] text-white pb-24">
      <SEO
        title={`${post.title} | KCET & COMEDK Forum`}
        description={post.content.slice(0, 160)}
        url={`https://kcetcoded.dev/forum/${post.id}`}
      />

      {/* Top Header Navigation */}
      <div className="border-b border-white/10 bg-slate-900/40 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/forum"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
            <span>Back to Discussion Forum</span>
          </Link>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 flex items-center gap-1 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Admin Mode
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePin}
                className="text-xs bg-white/5 border-white/10 text-amber-300 hover:bg-white/10"
              >
                <Pin className="h-3.5 w-3.5 mr-1" />
                {post.pinned ? "Unpin" : "Pin Thread"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeletePost}
                className="text-xs"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete Thread
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Thread Main Content Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {post.pinned && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 flex items-center gap-1">
                <Pin className="h-3.5 w-3.5 fill-amber-300" />
                Pinned Thread
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

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          {/* Author Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2 font-medium text-slate-200">
              <User className="h-4 w-4 text-primary" />
              <span>{post.authorName}</span>
            </div>
            {post.authorRank && (
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary-foreground border border-primary/20 font-mono text-xs font-semibold">
                {post.authorRank}
              </span>
            )}
            <span className="text-slate-600">•</span>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
          </div>

          {/* Detailed Question Body */}
          <div className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-wrap bg-white/[0.02] p-5 rounded-xl border border-white/5">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((tag, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Interactive Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePostUpvote}
                className={`flex items-center gap-2 rounded-xl text-xs font-semibold px-4 ${
                  post.userVoted
                    ? "bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
                    : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${post.userVoted ? "fill-primary" : ""}`} />
                <span className="font-bold font-mono">{post.upvotes}</span>
                <span>Upvote</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs"
              >
                <Share2 className="h-4 w-4" />
                Share Thread
              </Button>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-xs">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              <span>{post.replyCount} Replies</span>
            </div>
          </div>
        </div>

        {/* Responses & Answers Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Discussion Responses ({post.replies.length})
            </h3>
          </div>

          {topLevelReplies.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-dashed border-white/10 space-y-2">
              <p className="text-slate-400 text-sm">No answers posted yet. Be the first to share your insights!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topLevelReplies.map((reply) => {
                const subReplies = getSubReplies(reply.id);
                return (
                  <div
                    key={reply.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      reply.isSolution
                        ? "bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)]"
                        : "bg-slate-900/50 border-white/10"
                    }`}
                  >
                    {/* Reply Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{reply.authorName}</span>
                        {reply.authorRank && (
                          <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono text-xs">
                            {reply.authorRank}
                          </span>
                        )}
                        {reply.isSolution && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs py-0.5 px-2">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Accepted Answer
                          </Badge>
                        )}
                      </div>

                      <span className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Reply Body */}
                    <p className="text-sm text-slate-200 mt-3 leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>

                    {/* Reply Footer Actions */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5 text-xs">
                      <button
                        onClick={() => handleReplyUpvote(reply.id)}
                        className={`flex items-center gap-1.5 hover:text-primary transition-colors ${
                          reply.userVoted ? "text-primary font-bold" : "text-slate-400"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{reply.upvotes}</span>
                      </button>

                      <button
                        onClick={() => setReplyingToId(replyingToId === reply.id ? null : reply.id)}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        <CornerDownRight className="h-3.5 w-3.5" />
                        Reply
                      </button>

                      {/* Moderation Controls (ADMIN ONLY) */}
                      {isAdmin && (
                        <div className="ml-auto flex items-center gap-3">
                          <button
                            onClick={() => handleMarkSolution(reply.id)}
                            className="text-amber-400 hover:text-emerald-400 font-medium transition-colors"
                          >
                            {reply.isSolution ? "Unmark Solution" : "Mark as Solution"}
                          </button>
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
                            className="text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Sub-Replies */}
                    {subReplies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-white/10 space-y-3">
                        {subReplies.map((sub) => (
                          <div key={sub.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-200">{sub.authorName}</span>
                              <span className="text-slate-400">
                                {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">{sub.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Answer Form */}
          <form onSubmit={handleAddReply} className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {replyingToId ? "Replying to Comment" : "Post an Answer"}
              </Label>
              {replyingToId && (
                <button
                  type="button"
                  onClick={() => setReplyingToId(null)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Cancel replying to specific comment
                </button>
              )}
            </div>

            <Textarea
              placeholder="Share your experience, cutoff advice, or helpful insights..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 text-sm min-h-[100px] focus:ring-primary"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Your Name (e.g. Senior_RVTCE)"
                value={replyAuthor}
                onChange={(e) => setReplyAuthor(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl text-xs placeholder:text-slate-500"
              />
              <Input
                placeholder="Your Rank / Tag (e.g. Rank #14,200 GM)"
                value={replyRank}
                onChange={(e) => setReplyRank(e.target.value)}
                className="bg-white/5 border-white/10 text-white rounded-xl text-xs placeholder:text-slate-500"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs px-6 py-2 shadow-lg shadow-primary/25"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Answer
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ThreadDetailPage;

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
  syncPostsFromSupabase,
  addReplyToPost,
  toggleUpvotePost,
  toggleUpvoteReply,
  markReplyAsSolution,
  checkIsAdmin,
  togglePinPost,
  deletePost,
  deleteReply,
  subscribeToForumUpdates,
} from "@/lib/forum-service";
import { useAuth } from "@/contexts/AuthContext";
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
  LogIn,
  Sparkles
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const ThreadDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user, profile, signInWithGoogle } = useAuth();

  const [post, setPost] = useState<ForumPost | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [replyRank, setReplyRank] = useState("");
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    syncPostsFromSupabase().then(() => loadPost());
    setIsAdmin(checkIsAdmin());

    // Auto-prefill author details
    if (user) {
      const name = user.user_metadata?.full_name || 
                   user.user_metadata?.name || 
                   profile?.display_name || 
                   (user.email ? user.email.split("@")[0] : "Student Aspirant");
      setReplyAuthor(name);

      if (profile?.kcet_rank) {
        setReplyRank(`Rank #${profile.kcet_rank.toLocaleString('en-IN')} (${profile.kcet_category || "GM"})`);
      }
    }

    // Subscribe to realtime updates
    const unsubscribe = subscribeToForumUpdates(() => {
      loadPost();
    });

    return () => {
      unsubscribe();
    };
  }, [postId, user, profile]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white py-20 px-4 flex flex-col items-center justify-center space-y-4">
        <SEO title="Thread Not Found | KCET Coded Forum" description="The requested discussion thread was not found or has been removed." url="https://kcetcoded.dev/forum" />
        <h2 className="text-2xl font-bold">Thread Not Found</h2>
        <p className="text-slate-400 text-sm">The discussion thread you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate("/forum")} className="bg-primary text-white cursor-pointer">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Discussion Forum
        </Button>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const handlePostUpvote = async () => {
    if (!user) {
      toast.info("Please sign in to upvote questions!", {
        description: "Sign in with Google to support verified topics.",
        action: {
          label: "Sign In",
          onClick: () => signInWithGoogle()
        }
      });
      return;
    }
    await toggleUpvotePost(post.id);
    loadPost();
  };

  const handleReplyUpvote = async (replyId: string) => {
    if (!user) {
      toast.info("Please sign in to upvote answers!", {
        description: "Sign in with Google to support helpful replies.",
        action: {
          label: "Sign In",
          onClick: () => signInWithGoogle()
        }
      });
      return;
    }
    await toggleUpvoteReply(post.id, replyId);
    loadPost();
  };

  const handleMarkSolution = async (replyId: string) => {
    if (!isAdmin) {
      toast.error("Only Forum Administrators can mark solutions.");
      return;
    }
    await markReplyAsSolution(post.id, replyId);
    toast.success("Updated solution status!");
    loadPost();
  };

  const handleTogglePin = async () => {
    if (!isAdmin) return;
    await togglePinPost(post.id);
    toast.success(post.pinned ? "Unpinned thread" : "Pinned thread to top!");
    loadPost();
  };

  const handleDeletePost = async () => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this discussion thread?")) {
      await deletePost(post.id);
      toast.success("Thread deleted.");
      navigate("/forum");
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this reply?")) {
      await deleteReply(post.id, replyId);
      toast.success("Reply deleted.");
      loadPost();
    }
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    if (!user) {
      toast.info("Please sign in with Google to post your answer!", {
        description: "Signing in ensures authentic student answers and keeps the community helpful."
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addReplyToPost({
        postId: post.id,
        parentId: replyingToId,
        content: replyText,
        authorId: user.id,
        authorName: replyAuthor.trim() || user.email?.split("@")[0] || "KCET Aspirant",
        authorEmail: user.email || undefined,
        authorAvatar: user.user_metadata?.avatar_url || profile?.avatar_url,
        authorRank: replyRank.trim() || (profile?.kcet_rank ? `Rank #${profile.kcet_rank} (${profile.kcet_category || "GM"})` : undefined),
        authorBadge: profile?.is_pro ? "Pro Member" : profile?.kcet_rank ? "KCET Aspirant" : "Verified Student",
      });

      toast.success("Your response has been published live! 🎉");
      setReplyText("");
      setReplyingToId(null);
      loadPost();
    } catch (err) {
      toast.error("Failed to publish reply.");
    } finally {
      setIsSubmitting(false);
    }
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
        title={`${post.title} | KCET Forum`}
        description={post.content.slice(0, 160)}
        url={`https://kcetcoded.dev/forum/${post.id}`}
      />

      {/* Top Header Navigation */}
      <div className="border-b border-white/10 bg-slate-900/40 backdrop-blur-md py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/forum"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-primary" />
            <span>Back to Discussion Forum</span>
          </Link>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 flex items-center gap-1 text-xs">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Admin Mode
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTogglePin}
                className="text-xs bg-white/5 border-white/10 text-amber-300 hover:bg-white/10 cursor-pointer"
              >
                <Pin className="h-3.5 w-3.5 mr-1" />
                {post.pinned ? "Unpin" : "Pin Thread"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeletePost}
                className="text-xs cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete Thread
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Thread Main Content Body */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-4 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
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
            <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
              <Clock className="h-3.5 w-3.5" />
              {timeAgo}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            {post.title}
          </h1>

          {/* Author Banner */}
          <div className="flex items-center justify-between pt-2 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {post.authorAvatar ? (
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full border border-indigo-500/40"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold font-mono">
                  {post.authorName[0]?.toUpperCase() || "A"}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{post.authorName}</span>
                  <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-slate-300">
                    {post.authorBadge || "Verified Student"}
                  </Badge>
                </div>
                {post.authorRank && (
                  <div className="text-xs text-indigo-400 font-mono mt-0.5">
                    {post.authorRank}
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-slate-400 hover:text-white text-xs cursor-pointer"
            >
              <Share2 className="h-4 w-4 mr-1.5" />
              Share
            </Button>
          </div>

          {/* Content Body */}
          <div className="text-slate-200 text-base leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer Upvote & Stats */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <Button
              onClick={handlePostUpvote}
              variant="outline"
              size="sm"
              className={`rounded-xl text-xs gap-1.5 cursor-pointer ${
                post.userVoted
                  ? "bg-primary/20 border-primary text-primary font-bold shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]"
                  : "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>Helpful / Upvote ({post.upvotes})</span>
            </Button>

            <span className="text-xs text-slate-400 flex items-center gap-1.5 ml-auto font-mono">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              {post.replyCount} {post.replyCount === 1 ? "Answer" : "Answers"}
            </span>
          </div>
        </div>

        {/* Answers / Discussion Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Answers & Insights ({post.replyCount})
            </h3>
          </div>

          {topLevelReplies.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/30 border border-dashed border-white/10 text-center space-y-2">
              <p className="text-slate-400 text-sm font-medium">
                No answers yet. Be the first senior or aspirant to help out!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {topLevelReplies.map((reply) => {
                const subReplies = getSubReplies(reply.id);
                return (
                  <div
                    key={reply.id}
                    className={`p-6 rounded-2xl border transition-all ${
                      reply.isSolution
                        ? "bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
                        : "bg-slate-900/60 border-white/10"
                    }`}
                  >
                    {/* Reply Author & Badge Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        {reply.authorAvatar ? (
                          <img
                            src={reply.authorAvatar}
                            alt={reply.authorName}
                            className="w-8 h-8 rounded-full border border-indigo-500/30"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center text-xs font-bold font-mono">
                            {reply.authorName[0]?.toUpperCase() || "R"}
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{reply.authorName}</span>
                            <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-slate-400">
                              {reply.authorBadge || "Verified Student"}
                            </Badge>
                          </div>
                          {reply.authorRank && (
                            <div className="text-[11px] text-indigo-400 font-mono">
                              {reply.authorRank}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {reply.isSolution && (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            Verified Solution
                          </Badge>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-3 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </div>

                    {/* Reply Footer Actions */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5 text-xs">
                      <button
                        onClick={() => handleReplyUpvote(reply.id)}
                        className={`flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer ${
                          reply.userVoted ? "text-primary font-bold" : "text-slate-400"
                        }`}
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>{reply.upvotes}</span>
                      </button>

                      <button
                        onClick={() => setReplyingToId(replyingToId === reply.id ? null : reply.id)}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <CornerDownRight className="h-3.5 w-3.5" />
                        Reply
                      </button>

                      {/* Moderation Controls (ADMIN ONLY) */}
                      {isAdmin && (
                        <div className="ml-auto flex items-center gap-3">
                          <button
                            onClick={() => handleMarkSolution(reply.id)}
                            className="text-amber-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer"
                          >
                            {reply.isSolution ? "Unmark Solution" : "Mark as Solution"}
                          </button>
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
                            className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
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

          {/* Add Answer Form / Auth Prompt */}
          {!user ? (
            <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 text-center space-y-3">
              <div className="mx-auto w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Join the Discussion</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Sign in with Google to post your answers, share college insights, and earn candidate badges.
              </p>
              <Button
                type="button"
                onClick={() => signInWithGoogle()}
                className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-bold text-xs h-9 px-6 rounded-xl shadow-md cursor-pointer"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign in with Google to Answer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleAddReply} className="bg-slate-900/60 p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    {replyingToId ? "Replying to Comment" : "Post an Answer"}
                  </Label>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    (Replying as {replyAuthor})
                  </span>
                </div>
                {replyingToId && (
                  <button
                    type="button"
                    onClick={() => setReplyingToId(null)}
                    className="text-xs text-amber-400 hover:underline cursor-pointer"
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
                  placeholder="Your Name (e.g. Senior_RVCE)"
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
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-semibold rounded-xl text-xs px-6 py-2 shadow-lg shadow-primary/25 cursor-pointer"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Publishing..." : "Submit Answer"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadDetailPage;

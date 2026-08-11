import React, { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ForumPost,
  getStoredPosts,
  togglePinPost,
  deletePost,
  markReplyAsSolution,
  createForumPost,
  syncPostsFromSupabase,
} from "@/lib/forum-service";
import {
  MessageSquare,
  Pin,
  CheckCircle2,
  Trash2,
  Search,
  ExternalLink,
  PlusCircle,
  ShieldCheck,
  ThumbsUp,
  RefreshCw,
  Clock,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export const AdminForumControlSection: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  const loadForumData = () => {
    setLoading(true);
    setPosts(getStoredPosts());
    syncPostsFromSupabase().then((remoteData) => {
      setPosts([...remoteData]);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadForumData();
  }, []);

  const handleTogglePin = (postId: string) => {
    togglePinPost(postId);
    toast.success("Thread pin status updated.");
    loadForumData();
  };

  const handleDelete = (postId: string) => {
    if (confirm("Are you sure you want to delete this thread permanently?")) {
      deletePost(postId);
      toast.success("Thread deleted.");
      loadForumData();
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = filterCategory === "all" || p.category === filterCategory;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [posts, filterCategory, search]);

  const stats = useMemo(() => {
    const total = posts.length;
    const pinned = posts.filter((p) => p.pinned).length;
    const solved = posts.filter((p) => p.isSolved).length;
    const totalReplies = posts.reduce((acc, p) => acc + p.replyCount, 0);
    return { total, pinned, solved, totalReplies };
  }, [posts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-indigo-400" />
            Forum Control & Moderation
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage student discussions, pin official notices, resolve answered topics, and delete spam.
          </p>
        </div>

        <Button
          onClick={loadForumData}
          variant="outline"
          size="sm"
          className="border-white/10 text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Discussions
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-slate-900/40 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Total Threads</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/40 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Pin className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">{stats.pinned}</div>
              <div className="text-xs text-muted-foreground">Pinned Notices</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/40 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">{stats.solved}</div>
              <div className="text-xs text-muted-foreground">Solved Topics</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-slate-900/40 backdrop-blur-md">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-foreground">{stats.totalReplies}</div>
              <div className="text-xs text-muted-foreground">Student Answers</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-xl border border-white/10">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search thread title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-xs text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <Link to="/forum" target="_blank">
          <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300">
            Open Live Forum Page <ExternalLink className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Discussions Management Table / List */}
      <Card className="border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>Discussions & Threads ({filteredPosts.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-white/5">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No forum posts match the current search filter.
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {post.pinned && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 text-[10px]">
                        <Pin className="h-2.5 w-2.5 mr-1 fill-amber-300" /> Pinned
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-white/5 text-slate-300 text-[10px]">
                      {post.category}
                    </Badge>
                    {post.isSolved && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                        <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Solved
                      </Badge>
                    )}
                  </div>

                  <h4 className="text-sm font-semibold text-foreground truncate">{post.title}</h4>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 text-slate-300 font-medium">
                      <User className="h-3 w-3 text-indigo-400" /> {post.authorName}
                      {post.authorRank && (
                        <span className="font-mono text-[10px] text-indigo-300">({post.authorRank})</span>
                      )}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3 text-slate-400" /> {post.upvotes}
                    </span>
                    <span>•</span>
                    <span>{post.replyCount} replies</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/forum/${post.id}`} target="_blank">
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-300 hover:text-white">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTogglePin(post.id)}
                    className={`h-8 text-xs border-white/10 ${
                      post.pinned ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "text-slate-300"
                    }`}
                  >
                    <Pin className="h-3.5 w-3.5 mr-1" />
                    {post.pinned ? "Unpin" : "Pin"}
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="h-8 text-xs px-2.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

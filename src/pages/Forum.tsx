import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ForumPost,
  ForumCategory,
  getStoredPosts,
  syncPostsFromSupabase,
  toggleUpvotePost,
} from "@/lib/forum-service";
import { ThreadCard } from "@/components/forum/ThreadCard";
import { CreateThreadModal } from "@/components/forum/CreateThreadModal";
import {
  MessageSquare,
  Search,
  PlusCircle,
  TrendingUp,
  Clock,
  HelpCircle,
  CheckCircle2,
  Users,
  Sparkles,
  Flame,
  Filter,
} from "lucide-react";

type SortOption = "trending" | "latest" | "unanswered" | "solved";

const CATEGORIES: ("All" | ForumCategory)[] = [
  "All",
  "Option Entry",
  "Cutoff Movements",
  "College vs Branch",
  "Campus & Hostels",
  "Document Verification",
  "General Lounge",
];

const Forum: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<"All" | ForumCategory>("All");
  const [sortOption, setSortOption] = useState<SortOption>("trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const refreshPosts = () => {
    setPosts(getStoredPosts());
    syncPostsFromSupabase().then((data) => setPosts([...data]));
  };

  useEffect(() => {
    refreshPosts();
  }, []);

  // Filter & Sort Posts
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesCategory =
          selectedCategory === "All" || post.category === selectedCategory;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.tags.some((t) => t.toLowerCase().includes(q)) ||
          post.authorName.toLowerCase().includes(q);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        if (sortOption === "trending") {
          return b.upvotes * 2 + b.replyCount - (a.upvotes * 2 + a.replyCount);
        }
        if (sortOption === "latest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortOption === "unanswered") {
          return a.replyCount - b.replyCount;
        }
        if (sortOption === "solved") {
          return (b.isSolved ? 1 : 0) - (a.isSolved ? 1 : 0);
        }
        return 0;
      });
  }, [posts, selectedCategory, searchQuery, sortOption]);

  const handleUpvote = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleUpvotePost(postId);
    refreshPosts();
  };

  const handleCardClick = (post: ForumPost) => {
    navigate(`/forum/${post.id}`);
  };

  const handlePostCreated = () => {
    refreshPosts();
  };

  const stats = useMemo(() => {
    const total = posts.length;
    const solved = posts.filter((p) => p.isSolved).length;
    const totalReplies = posts.reduce((acc, p) => acc + p.replyCount, 0);
    return { total, solved, totalReplies };
  }, [posts]);

  return (
    <div className="min-h-screen bg-[#07090e] text-white pb-20">
      <SEO
        title="Student Discussion Forum | KCET & COMEDK Community"
        description="Ask questions about KCET cutoffs, COMEDK option entry, college comparisons, and document verification with peer students and mentors."
        url="https://kcetcoded.dev/forum"
      />

      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-indigo-950/40 via-slate-900/40 to-[#07090e] py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-primary/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-6xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                KCET & COMEDK Peer Community
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                Student Discussion Forum
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
                Get real advice on option entry strategies, cutoff drops across rounds, campus life, and document verification.
              </p>
            </div>

            <Button
              onClick={() => setIsCreateOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] transition-all duration-300"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Ask a Question
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-xl pt-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-white">{stats.total}</div>
                <div className="text-[11px] text-slate-400">Discussions</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-white">{stats.solved}</div>
                <div className="text-[11px] text-slate-400">Solved</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="text-lg font-bold font-mono text-white">{stats.totalReplies}</div>
                <div className="text-[11px] text-slate-400">Answers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]"
                    : "bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/20 hover:bg-slate-900"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search & Sort Header Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search topics, colleges (e.g. RVCE), cutoffs, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white rounded-xl placeholder:text-slate-500 focus:ring-primary text-sm"
            />
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Button
              variant={sortOption === "trending" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortOption("trending")}
              className={`rounded-xl text-xs ${
                sortOption === "trending"
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Flame className="h-3.5 w-3.5 mr-1 text-amber-400" />
              Trending
            </Button>

            <Button
              variant={sortOption === "latest" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortOption("latest")}
              className={`rounded-xl text-xs ${
                sortOption === "latest"
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Clock className="h-3.5 w-3.5 mr-1 text-indigo-400" />
              Latest
            </Button>

            <Button
              variant={sortOption === "unanswered" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortOption("unanswered")}
              className={`rounded-xl text-xs ${
                sortOption === "unanswered"
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <HelpCircle className="h-3.5 w-3.5 mr-1 text-cyan-400" />
              Unanswered
            </Button>

            <Button
              variant={sortOption === "solved" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortOption("solved")}
              className={`rounded-xl text-xs ${
                sortOption === "solved"
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-400" />
              Solved
            </Button>
          </div>
        </div>

        {/* Thread Feed List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/30 rounded-3xl border border-dashed border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-400">
              <Search className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">No discussions found</h3>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                No questions match your current category or search query. Be the first to start the discussion!
              </p>
            </div>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-xs px-5"
            >
              Ask a Question
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <ThreadCard
                key={post.id}
                post={post}
                onUpvote={handleUpvote}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Thread Modal */}
      <CreateThreadModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Forum;

import React from "react";
import { ForumPost } from "@/lib/forum-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, MessageSquare, CheckCircle2, Pin, User, Clock, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ThreadCardProps {
  post: ForumPost;
  onUpvote: (postId: string, e: React.MouseEvent) => void;
  onClick: (post: ForumPost) => void;
}

export const ThreadCard: React.FC<ThreadCardProps> = ({ post, onUpvote, onClick }) => {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  const categoryColors: Record<string, string> = {
    "Option Entry": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    "Cutoff Movements": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "College vs Branch": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Campus & Hostels": "bg-purple-500/10 text-purple-400 border-purple-500/20",
    "Document Verification": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    "General Lounge": "bg-slate-500/10 text-slate-300 border-slate-500/20"
  };

  return (
    <Card
      onClick={() => onClick(post)}
      className="group relative cursor-pointer overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-slate-900/70 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.25)]"
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Header Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {post.pinned && (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 flex items-center gap-1">
                  <Pin className="h-3 w-3 fill-amber-300" />
                  Pinned
                </Badge>
              )}

              <Badge variant="outline" className={categoryColors[post.category] || categoryColors["General Lounge"]}>
                {post.category}
              </Badge>

              {post.isSolved && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Solved
                </Badge>
              )}
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">
              {post.content}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {post.tags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/5"
                  >
                    <Tag className="h-2.5 w-2.5 opacity-60" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Upvote Button Column */}
          <div className="flex flex-col items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => onUpvote(post.id, e)}
              className={`flex flex-col items-center justify-center h-14 w-12 rounded-xl transition-all ${
                post.userVoted
                  ? "bg-primary/20 text-primary border-primary/50 shadow-[0_0_15px_-3px_rgba(99,102,241,0.4)]"
                  : "bg-white/5 text-slate-300 border-white/10 hover:border-primary/40 hover:bg-white/10"
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${post.userVoted ? "fill-primary" : ""}`} />
              <span className="text-xs font-bold font-mono mt-1">{post.upvotes}</span>
            </Button>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <User className="h-3.5 w-3.5 text-primary" />
              <span>{post.authorName}</span>
            </div>

            {post.authorRank && (
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary-foreground border border-primary/20 font-mono text-[11px] font-semibold">
                {post.authorRank}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
              <span className="font-mono">{post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

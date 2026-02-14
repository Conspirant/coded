import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, Reply, MoreVertical, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Comment {
    id: string;
    content: string;
    created_at: string;
    upvotes: number;
    user_id: string;
    parent_id: string | null;
    // Join would bring user profile data, for now assuming basic auth or joined data
    // In a real scenario we'd join with profiles table. 
    // For MVP we'll show a generic user or fetch name if available in session (not ideal for public comments)
    // Let's assume we might get a joined profile_name or similar if we set up the view.
    // We'll stick to a simple UI for now.
}

interface DiscussionBoardProps {
    collegeId: string;
    collegeName: string;
}

export const DiscussionBoard = ({ collegeId, collegeName }: DiscussionBoardProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchComments = async () => {
        try {
            setLoading(true);
            // Determine if table exists first? No, just try to fetch.
            // If table doesn't exist, this will fail. That's expected until user runs SQL.
            const { data, error } = await supabase
                .from('college_comments')
                .select('*')
                .eq('college_id', collegeId)
                .order('created_at', { ascending: false });

            if (error) {
                // Silently fail if table doesn't exist yet, or show friendly "be the first"
                console.warn("Could not fetch comments (table might not exist):", error);
                return;
            }

            if (data) {
                setComments(data as unknown as Comment[]);
            }
        } catch (err) {
            console.error("Error fetching comments:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();

        // Subscribe to realtime changes
        const channel = supabase
            .channel('schema-db-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'college_comments',
                    filter: `college_id=eq.${collegeId}`,
                },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchComments();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [collegeId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setSubmitting(true);

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Authentication Required",
                    description: "Please sign in to post comments.",
                    variant: "destructive",
                });
                return;
            }

            const { error } = await supabase
                .from('college_comments')
                .insert({
                    content: newComment,
                    college_id: collegeId,
                    user_id: user.id,
                    parent_id: replyingTo
                });

            if (error) throw error;

            setNewComment("");
            setReplyingTo(null);
            fetchComments();
            toast({
                title: "Comment Posted",
                description: "Your comment has been added to the discussion.",
            });

        } catch (error) {
            console.error("Error posting comment:", error);
            toast({
                title: "Error",
                description: "Failed to post comment. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpvote = async (commentId: string, currentVotes: number) => {
        // Optimistic update
        setComments(prev => prev.map(c => c.id === commentId ? { ...c, upvotes: (c.upvotes || 0) + 1 } : c));

        const { error } = await supabase
            .from('college_comments')
            .update({ upvotes: (currentVotes || 0) + 1 })
            .eq('id', commentId);

        if (error) {
            // Revert on error
            fetchComments();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Student Discussions
                </h3>
                <span className="text-sm text-muted-foreground">{comments.length} comments</span>
            </div>

            {/* Input Area */}
            <Card>
                <CardContent className="pt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Textarea
                            placeholder={`Ask a question or share your thoughts about ${collegeName}...`}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="resize-none"
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={submitting || !newComment.trim()}>
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                Post Comment
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading discussions...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        <p>No comments yet. Be the first to start the discussion!</p>
                    </div>
                ) : (
                    comments.filter(c => !c.parent_id).map((comment) => (
                        <div key={comment.id} className="space-y-4">
                            {/* Main Comment */}
                            <div className="flex gap-4">
                                <Avatar>
                                    <AvatarFallback>{comment.id.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-sm">Student</span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Report</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <p className="text-sm">{comment.content}</p>
                                    <div className="flex items-center gap-4 pt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-primary gap-1"
                                            onClick={() => handleUpvote(comment.id, comment.upvotes)}
                                        >
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{comment.upvotes || 0}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground hover:text-primary gap-1"
                                            onClick={() => setNewComment(`@Reply `)} // Simplified reply for MVP
                                        >
                                            <Reply className="h-4 w-4" />
                                            Reply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

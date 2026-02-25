import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ThumbsUp, MessageCircle, Calendar, Star, MapPin, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeStyles: Record<string, { badge: string }> = {
  news: { badge: "bg-blue-500/10 text-blue-600" },
  review: { badge: "bg-yellow-500/10 text-yellow-600" },
  event: { badge: "bg-accent/10 text-accent" },
  discussion: { badge: "bg-purple-500/10 text-purple-600" },
};

export default function CommunityPostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");

  const { data: post, isLoading } = useQuery({
    queryKey: ["community-post", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("community_posts").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: authorProfile } = useQuery({
    queryKey: ["profile", post?.user_id],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", post!.user_id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!post,
  });

  const { data: comments = [] } = useQuery({
    queryKey: ["community-comments", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_comments")
        .select("*")
        .eq("post_id", id!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch comment author profiles
  const commentUserIds = [...new Set(comments.map((c: any) => c.user_id))];
  const { data: commentProfiles = [] } = useQuery({
    queryKey: ["comment-profiles", commentUserIds],
    queryFn: async () => {
      if (commentUserIds.length === 0) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, avatar_url")
        .in("user_id", commentUserIds);
      if (error) throw error;
      return data;
    },
    enabled: commentUserIds.length > 0,
  });

  const commentProfileMap = Object.fromEntries(commentProfiles.map((p: any) => [p.user_id, p]));

  // Check if user liked
  const { data: userLiked = false } = useQuery({
    queryKey: ["community-liked", id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("community_likes")
        .select("id")
        .eq("post_id", id!)
        .eq("user_id", user.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!id && !!user,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Login required");
      if (userLiked) {
        await supabase.from("community_likes").delete().eq("post_id", id!).eq("user_id", user.id);
        await supabase.from("community_posts").update({ likes_count: Math.max(0, (post?.likes_count || 1) - 1) }).eq("id", id!);
      } else {
        await supabase.from("community_likes").insert({ post_id: id!, user_id: user.id });
        await supabase.from("community_posts").update({ likes_count: (post?.likes_count || 0) + 1 }).eq("id", id!);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["community-post", id] });
      queryClient.invalidateQueries({ queryKey: ["community-liked", id] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Login required");
      if (!newComment.trim()) return;
      const { error } = await supabase.from("community_comments").insert({
        post_id: id!,
        user_id: user.id,
        content: newComment.trim(),
      });
      if (error) throw error;
      // Update comment count
      await supabase.from("community_posts").update({ comments_count: (post?.comments_count || 0) + 1 }).eq("id", id!);
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["community-comments", id] });
      queryClient.invalidateQueries({ queryKey: ["community-post", id] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="container-festac py-8 max-w-3xl">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-festac py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Post not found</h2>
        <Button asChild><Link to="/community">Back to Community</Link></Button>
      </div>
    );
  }

  const authorName = authorProfile ? `${authorProfile.first_name || ""} ${authorProfile.last_name || ""}`.trim() || "User" : "User";
  const style = typeStyles[post.type] || typeStyles.discussion;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-festac py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {/* Post */}
        <div className="card-festac p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={authorProfile?.avatar_url || ""} />
              <AvatarFallback className="bg-primary/10 text-primary">{authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{authorName}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className={style.badge}>
                  {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                </Badge>
                {post.category && <Badge variant="outline">{post.category}</Badge>}
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">{post.title}</h1>

          {post.type === "review" && post.rating && (
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < post.rating! ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
              ))}
            </div>
          )}

          {post.type === "event" && (
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              {post.event_date && (
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Calendar className="h-4 w-4" />{post.event_date} {post.event_time && `at ${post.event_time}`}
                </span>
              )}
              {post.event_location && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />{post.event_location}
                </span>
              )}
            </div>
          )}

          <p className="text-foreground whitespace-pre-wrap mb-6">{post.content}</p>

          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (!user) { navigate(`/login?redirect=/community/${id}`); return; }
                likeMutation.mutate();
              }}
              className={userLiked ? "text-primary" : "text-muted-foreground"}
            >
              <ThumbsUp className={`h-4 w-4 mr-1 ${userLiked ? "fill-primary" : ""}`} />
              {post.likes_count || 0}
            </Button>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              {comments.length} comments
            </span>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-lg">Comments</h3>

          {user && (
            <div className="card-festac p-4 flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">You</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={() => commentMutation.mutate()}
                  disabled={!newComment.trim() || commentMutation.isPending}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {!user && (
            <p className="text-sm text-muted-foreground">
              <Link to={`/login?redirect=/community/${id}`} className="text-primary underline">Log in</Link> to comment.
            </p>
          )}

          {comments.map((comment: any) => {
            const cp = commentProfileMap[comment.user_id];
            const cName = cp ? `${cp.first_name || ""} ${cp.last_name || ""}`.trim() || "User" : "User";
            return (
              <div key={comment.id} className="card-festac p-4 flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={cp?.avatar_url || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">{cName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-foreground">{cName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            );
          })}

          {comments.length === 0 && (
            <p className="text-sm text-muted-foreground py-4">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}

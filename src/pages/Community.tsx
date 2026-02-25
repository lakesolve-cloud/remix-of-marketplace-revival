import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Calendar, Star, Users, Search, ArrowRight, ThumbsUp, MessageCircle, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

const typeStyles: Record<string, { badge: string; icon: React.ElementType }> = {
  news: { badge: "bg-blue-500/10 text-blue-600", icon: MessageSquare },
  review: { badge: "bg-yellow-500/10 text-yellow-600", icon: Star },
  event: { badge: "bg-accent/10 text-accent", icon: Calendar },
  discussion: { badge: "bg-purple-500/10 text-purple-600", icon: MessageCircle },
};

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["community-posts", searchQuery, activeTab],
    queryFn: async () => {
      let query = supabase
        .from("community_posts")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (activeTab !== "all") {
        query = query.eq("type", activeTab === "reviews" ? "review" : activeTab === "events" ? "event" : activeTab === "discussions" ? "discussion" : activeTab);
      }
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch profiles for post authors
  const userIds = [...new Set(posts.map((p: any) => p.user_id))];
  const { data: profiles = [] } = useQuery({
    queryKey: ["community-profiles", userIds],
    queryFn: async () => {
      if (userIds.length === 0) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, first_name, last_name, avatar_url")
        .in("user_id", userIds);
      if (error) throw error;
      return data;
    },
    enabled: userIds.length > 0,
  });

  const profileMap = Object.fromEntries(profiles.map((p: any) => [p.user_id, p]));

  // Upcoming events
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ["upcoming-events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .eq("type", "event")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b border-border">
        <div className="container-festac py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Festac Community
          </h1>
          <p className="text-muted-foreground">
            Connect with your neighbors, share experiences, and stay updated
          </p>
        </div>
      </div>

      <div className="container-festac py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => navigate("/community/new")}>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              {isLoading && (
                <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
              )}
              {posts.map((post: any) => {
                const style = typeStyles[post.type] || typeStyles.discussion;
                const Icon = style.icon;
                const profile = profileMap[post.user_id];
                const authorName = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User" : "User";

                return (
                  <Link
                    key={post.id}
                    to={`/community/${post.id}`}
                    className="card-festac p-6 block group"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={profile?.avatar_url || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {authorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-medium text-foreground">{authorName}</span>
                          <Badge variant="secondary" className={style.badge}>
                            <Icon className="h-3 w-3 mr-1" />
                            {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                          </Badge>
                          {post.category && <Badge variant="outline">{post.category}</Badge>}
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground line-clamp-2 mb-4">{post.content}</p>

                        {post.type === "review" && post.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < post.rating! ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                            ))}
                          </div>
                        )}

                        {post.type === "event" && post.event_date && (
                          <div className="flex items-center gap-4 mb-3 text-sm">
                            <span className="flex items-center gap-1 text-primary font-medium">
                              <Calendar className="h-4 w-4" />{post.event_date}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />{post.likes_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />{post.comments_count || 0} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              {!isLoading && posts.length === 0 && (
                <div className="text-center py-16">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No posts yet. Start the conversation!</p>
                  <Button onClick={() => navigate("/community/new")}>Create Post</Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-festac p-6">
              <h3 className="font-display font-semibold text-lg mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.length === 0 && <p className="text-sm text-muted-foreground">No upcoming events</p>}
                {upcomingEvents.map((event: any) => (
                  <Link key={event.id} to={`/community/${event.id}`} className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <h4 className="font-medium text-foreground mb-1">{event.title}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {event.event_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />{event.event_date} {event.event_time && `at ${event.event_time}`}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="card-festac p-6">
              <h3 className="font-display font-semibold text-lg mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Be respectful and courteous</li>
                <li>• No spam or self-promotion</li>
                <li>• Keep discussions relevant to Festac</li>
                <li>• Report inappropriate content</li>
                <li>• Verify information before sharing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

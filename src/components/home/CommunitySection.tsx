import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Calendar, Star, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const communityPosts = [
  {
    id: "1",
    type: "news",
    title: "New Road Construction on 2nd Avenue",
    excerpt: "Lagos State Government announces major road improvements...",
    author: "FestacConnect Team",
    avatar: "",
    timeAgo: "3 hours ago",
    comments: 24,
  },
  {
    id: "2",
    type: "review",
    title: "Best Hair Salon in Festac - My Experience",
    excerpt: "I finally found an amazing stylist after trying several places...",
    author: "Ada Okwu",
    avatar: "",
    timeAgo: "1 day ago",
    rating: 5,
    comments: 12,
  },
  {
    id: "3",
    type: "event",
    title: "Festac Town Clean-Up Day",
    excerpt: "Join us this Saturday for our monthly community clean-up initiative...",
    author: "Festac Youth Forum",
    avatar: "",
    date: "Feb 10, 2026",
    attendees: 45,
  },
];

const typeStyles: Record<string, { badge: string; icon: React.ElementType }> = {
  news: { badge: "bg-blue-500/10 text-blue-600", icon: MessageSquare },
  review: { badge: "bg-yellow-500/10 text-yellow-600", icon: Star },
  event: { badge: "bg-accent/10 text-accent", icon: Calendar },
};

export function CommunitySection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container-festac">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-heading mb-2">Community News</h2>
            <p className="text-muted-foreground">
              Stay connected with news, reviews, and events in Festac Town
            </p>
          </div>
          <Link 
            to="/community" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All News
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityPosts.map((post) => {
            const style = typeStyles[post.type];
            const Icon = style.icon;

            return (
              <Link
                key={post.id}
                to={`/community/${post.id}`}
                className="card-festac p-6 group"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className={style.badge}>
                    <Icon className="h-3 w-3 mr-1" />
                    {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.timeAgo}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {post.author.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {post.author}
                    </span>
                  </div>

                  {post.type === "review" && (
                    <div className="flex items-center gap-1">
                      {[...Array(post.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  )}

                  {post.type === "event" && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      {post.attendees}
                    </div>
                  )}

                  {post.type === "news" && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageSquare className="h-3.5 w-3.5" />
                      {post.comments}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

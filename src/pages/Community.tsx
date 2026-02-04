import { Link } from "react-router-dom";
import { useState } from "react";
import { MessageSquare, Calendar, Star, Users, Search, ArrowRight, ThumbsUp, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const communityPosts = [
  {
    id: "1",
    type: "news",
    title: "New Road Construction on 2nd Avenue",
    content: "Lagos State Government announces major road improvements in Festac Town. The project is expected to last 6 months and will include drainage improvements and street lighting.",
    author: "FestacConnect Team",
    avatar: "",
    timeAgo: "3 hours ago",
    likes: 45,
    comments: 24,
    category: "Infrastructure",
  },
  {
    id: "2",
    type: "review",
    title: "Best Hair Salon in Festac - My Experience",
    content: "I finally found an amazing stylist after trying several places. Glamour Beauty Salon on 3rd Avenue has the best service, reasonable prices, and a very professional team.",
    author: "Ada Okwu",
    avatar: "",
    timeAgo: "1 day ago",
    likes: 89,
    comments: 12,
    rating: 5,
    category: "Beauty",
  },
  {
    id: "3",
    type: "event",
    title: "Festac Town Clean-Up Day",
    content: "Join us this Saturday for our monthly community clean-up initiative. We'll be focusing on the market area and surrounding streets. Refreshments will be provided.",
    author: "Festac Youth Forum",
    avatar: "",
    timeAgo: "2 days ago",
    likes: 156,
    comments: 34,
    date: "Feb 10, 2026",
    attendees: 45,
    category: "Community",
  },
  {
    id: "4",
    type: "discussion",
    title: "Power Situation in Festac - Tips to Save on Generator Costs",
    content: "With the current electricity situation, I thought I'd share some tips on how to reduce generator usage and save on fuel costs. Solar panels are becoming more affordable...",
    author: "Emmanuel Okonkwo",
    avatar: "",
    timeAgo: "4 hours ago",
    likes: 234,
    comments: 67,
    category: "Tips",
  },
  {
    id: "5",
    type: "review",
    title: "Warning: Avoid This Car Mechanic",
    content: "Had a terrible experience with a mechanic near the roundabout. Overcharged me and the repair didn't even fix the problem. Be careful and always get multiple quotes.",
    author: "Chidi Nnamdi",
    avatar: "",
    timeAgo: "6 hours ago",
    likes: 178,
    comments: 45,
    rating: 1,
    category: "Automotive",
  },
];

const upcomingEvents = [
  {
    id: "e1",
    title: "Community Town Hall Meeting",
    date: "Feb 15, 2026",
    time: "4:00 PM",
    location: "Festac Town Hall",
    attendees: 120,
  },
  {
    id: "e2",
    title: "Festac Football Tournament",
    date: "Feb 20, 2026",
    time: "9:00 AM",
    location: "Festac Sports Complex",
    attendees: 250,
  },
  {
    id: "e3",
    title: "Business Networking Event",
    date: "Feb 25, 2026",
    time: "6:00 PM",
    location: "Festac Events Center",
    attendees: 85,
  },
];

const typeStyles: Record<string, { badge: string; icon: React.ElementType }> = {
  news: { badge: "bg-blue-500/10 text-blue-600", icon: MessageSquare },
  review: { badge: "bg-yellow-500/10 text-yellow-600", icon: Star },
  event: { badge: "bg-accent/10 text-accent", icon: Calendar },
  discussion: { badge: "bg-purple-500/10 text-purple-600", icon: MessageCircle },
};

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = communityPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search & Actions */}
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
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                New Post
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const style = typeStyles[post.type];
                const Icon = style.icon;

                return (
                  <Link
                    key={post.id}
                    to={`/community/${post.id}`}
                    className="card-festac p-6 block group"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {post.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-medium text-foreground">
                            {post.author}
                          </span>
                          <Badge variant="secondary" className={style.badge}>
                            <Icon className="h-3 w-3 mr-1" />
                            {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
                          </Badge>
                          <Badge variant="outline">{post.category}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {post.timeAgo}
                          </span>
                        </div>

                        <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                          {post.title}
                        </h2>

                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {post.content}
                        </p>

                        {/* Rating for reviews */}
                        {post.type === "review" && post.rating && (
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < post.rating!
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        )}

                        {/* Event date */}
                        {post.type === "event" && post.date && (
                          <div className="flex items-center gap-4 mb-3 text-sm">
                            <span className="flex items-center gap-1 text-primary font-medium">
                              <Calendar className="h-4 w-4" />
                              {post.date}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              {post.attendees} attending
                            </span>
                          </div>
                        )}

                        {/* Engagement */}
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments} comments
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <div className="card-festac p-6">
              <h3 className="font-display font-semibold text-lg mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/community/events/${event.id}`}
                    className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <h4 className="font-medium text-foreground mb-1">
                      {event.title}
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        {event.attendees} attending
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-primary" asChild>
                <Link to="/community/events">
                  View All Events
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Community Guidelines */}
            <div className="card-festac p-6">
              <h3 className="font-display font-semibold text-lg mb-4">
                Community Guidelines
              </h3>
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

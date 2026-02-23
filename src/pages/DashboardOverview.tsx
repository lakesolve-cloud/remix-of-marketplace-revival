import { Link } from "react-router-dom";
import { Eye, Heart, MessageCircle, ArrowUpRight, TrendingUp, Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function DashboardOverview() {
  const { user, profile } = useAuth();

  const { data: listings = [] } = useQuery({
    queryKey: ["my-listings", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("listings").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(5);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: businesses = [] } = useQuery({
    queryKey: ["my-businesses", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("businesses").select("*").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["my-favorites-count", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("favorites").select("id").eq("user_id", user!.id);
      return data || [];
    },
    enabled: !!user,
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["my-notifications-count", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("notifications").select("id").eq("user_id", user!.id).eq("is_read", false);
      return data || [];
    },
    enabled: !!user,
  });

  const totalViews = listings.reduce((sum: number, l: any) => sum + (l.views || 0), 0);
  const activeListings = listings.filter((l: any) => l.status === "active").length;
  const displayName = profile?.first_name || "there";

  const stats = [
    { title: "Total Views", value: totalViews.toLocaleString(), icon: Eye },
    { title: "Active Listings", value: String(activeListings), icon: TrendingUp },
    { title: "Saved Items", value: String(favorites.length), icon: Heart },
    { title: "Unread Messages", value: String(notifications.length), icon: MessageCircle },
  ];

  const statusColors: Record<string, string> = {
    active: "bg-primary/10 text-primary",
    pending: "bg-yellow-500/10 text-yellow-600",
    expired: "bg-red-500/10 text-red-600",
    draft: "bg-muted text-muted-foreground",
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Welcome back, {displayName}!</h1>
          <p className="text-muted-foreground">Here's what's happening with your listings today.</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link to="/dashboard/listings/new"><Plus className="h-4 w-4 mr-2" />New Listing</Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Listings</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard/listings">View all<ArrowUpRight className="h-4 w-4 ml-1" /></Link>
          </Button>
        </CardHeader>
        <CardContent>
          {listings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No listings yet</p>
              <Button asChild><Link to="/dashboard/listings/new">Create your first listing</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              {listings.slice(0, 5).map((listing: any) => (
                <Link key={listing.id} to={`/listing/${listing.id}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <img src={listing.images?.[0] || "/placeholder.svg"} alt={listing.title} className="w-16 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{listing.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{listing.views} views</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className={statusColors[listing.status] || ""}>{listing.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">List Your Business</h3>
            <p className="text-sm text-muted-foreground mb-4">Create a business profile to attract more customers.</p>
            <Button asChild variant="outline" size="sm"><Link to="/dashboard/businesses/new"><Store className="h-4 w-4 mr-2" />Add Business</Link></Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">Boost Your Listings</h3>
            <p className="text-sm text-muted-foreground mb-4">Get more visibility with featured listings. Reach more buyers in Festac.</p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">
              <Link to="/dashboard/listings">View Listings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

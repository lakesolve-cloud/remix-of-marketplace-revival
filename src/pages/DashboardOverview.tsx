import { Link } from "react-router-dom";
import { Eye, Heart, MessageCircle, ArrowUpRight, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Views",
    value: "1,234",
    change: "+12%",
    icon: Eye,
    trend: "up",
  },
  {
    title: "Active Listings",
    value: "8",
    change: "+2",
    icon: TrendingUp,
    trend: "up",
  },
  {
    title: "Saved Items",
    value: "24",
    change: "+5",
    icon: Heart,
    trend: "up",
  },
  {
    title: "Messages",
    value: "12",
    change: "3 new",
    icon: MessageCircle,
    trend: "up",
  },
];

const recentListings = [
  {
    id: "1",
    title: "Modern 3-Bedroom Flat for Rent",
    status: "active",
    views: 234,
    inquiries: 5,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&h=150&fit=crop",
  },
  {
    id: "2",
    title: "iPhone 14 Pro Max - Like New",
    status: "active",
    views: 567,
    inquiries: 12,
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=200&h=150&fit=crop",
  },
  {
    id: "3",
    title: "Toyota Camry 2019",
    status: "pending",
    views: 89,
    inquiries: 3,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&h=150&fit=crop",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  pending: "bg-yellow-500/10 text-yellow-600",
  expired: "bg-red-500/10 text-red-600",
};

export default function DashboardOverview() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            Welcome back, John!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your listings today.
          </p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link to="/dashboard/listings/new">
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-primary">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Listings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Listings</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link to="/dashboard/listings">
              View all
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentListings.map((listing) => (
              <Link
                key={listing.id}
                to={`/dashboard/listings/${listing.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-16 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {listing.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {listing.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {listing.inquiries} inquiries
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className={statusColors[listing.status]}>
                  {listing.status}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">
              Complete Your Profile
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add a profile photo and business information to build trust with buyers.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard/settings">
                Update Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">
              Boost Your Listings
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get more visibility with featured listings. Reach more buyers in Festac.
            </p>
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground" size="sm">
              <Link to="/dashboard/boost">
                Learn More
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

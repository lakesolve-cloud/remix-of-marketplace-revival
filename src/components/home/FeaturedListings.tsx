import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const categoryStyles: Record<string, string> = {
  "real-estate": "bg-primary/10 text-primary",
  "services": "bg-purple-500/10 text-purple-600",
  "products": "bg-blue-500/10 text-blue-600",
  "jobs": "bg-accent/10 text-accent",
  "vehicles": "bg-red-500/10 text-red-600",
};

export function FeaturedListings() {
  const { data: listings = [] } = useQuery({
    queryKey: ["featured-listings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("status", "active")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(6);
      return data || [];
    },
  });

  if (listings.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container-festac">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-heading mb-2">Featured Listings</h2>
            <p className="text-muted-foreground">Discover the best opportunities in Festac Town</p>
          </div>
          <Link to="/marketplace" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            View All Listings<ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing: any) => (
            <Link key={listing.id} to={`/listing/${listing.id}`} className="card-festac group overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={listing.images?.[0] || "/placeholder.svg"} alt={listing.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                {listing.is_featured && <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">Featured</Badge>}
              </div>
              <div className="p-5">
                <Badge variant="secondary" className={categoryStyles[listing.category] || "bg-muted text-muted-foreground"}>{listing.category}</Badge>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2 mt-2 line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{listing.description}</p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  {listing.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location}</span>}
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-display font-bold text-lg text-primary">{listing.price_label || `₦${Number(listing.price).toLocaleString()}`}</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground"><Eye className="h-3.5 w-3.5" />{listing.views} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link to="/marketplace">Browse All Listings<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

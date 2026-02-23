import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function FeaturedBusinesses() {
  const { data: businesses = [] } = useQuery({
    queryKey: ["featured-businesses"],
    queryFn: async () => {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("status", "active")
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(4);
      return data || [];
    },
  });

  if (businesses.length === 0) return null;

  return (
    <section className="py-16 md:py-24">
      <div className="container-festac">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-heading mb-2">Featured Businesses</h2>
            <p className="text-muted-foreground">Discover trusted local businesses in your community</p>
          </div>
          <Link to="/marketplace?type=business" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            View All Businesses<ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {businesses.map((business: any) => (
            <Link key={business.id} to={`/business/${business.id}`} className="card-festac group overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={business.images?.[0] || "/placeholder.svg"} alt={business.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                {business.is_featured && <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">Featured</Badge>}
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">{business.category_name || "Business"}</Badge>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{business.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{business.description}</p>
                {business.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3"><MapPin className="h-3.5 w-3.5" />{business.location}</div>
                )}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{Number(business.rating).toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({business.review_count} reviews)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

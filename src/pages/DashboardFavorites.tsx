import { Link } from "react-router-dom";
import { Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function DashboardFavorites() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["my-favorites", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("favorites")
        .select("*, listing:listings(*), business:businesses(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const removeFavorite = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("favorites").delete().eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-favorites"] });
      toast({ title: "Removed from favorites" });
    },
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Favorites</h1>
        <p className="text-muted-foreground">Your saved listings and businesses</p>
      </div>

      {!isLoading && favorites.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No favorites yet</p>
          <Button asChild><Link to="/marketplace">Browse Marketplace</Link></Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav: any) => {
            const item = fav.listing || fav.business;
            if (!item) return null;
            const isListing = !!fav.listing_id;
            return (
              <div key={fav.id} className="card-festac overflow-hidden">
                <div className="aspect-[4/3] bg-muted">
                  <img src={item.images?.[0] || "/placeholder.svg"} alt={item.title || item.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">{item.title || item.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={isListing ? `/listing/${item.id}` : `/business/${item.id}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />View
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeFavorite.mutate(fav.id)}>
                      <Heart className="h-4 w-4 fill-current text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MoreHorizontal, Edit, Trash2, ExternalLink, Rocket, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function MyBusinesses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ["my-businesses", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("businesses").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("businesses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-businesses"] });
      toast({ title: "Business deleted" });
    },
  });

  const filteredBusinesses = businesses.filter((b: any) => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">My Businesses</h1>
          <p className="text-muted-foreground">Manage your business profiles</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link to="/dashboard/businesses/new"><Plus className="h-4 w-4 mr-2" />Add Business</Link>
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search businesses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 max-w-md" />
      </div>

      {!isLoading && filteredBusinesses.length === 0 ? (
        <div className="text-center py-16">
          <Store className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No businesses yet</p>
          <Button asChild><Link to="/dashboard/businesses/new">Create your first business profile</Link></Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((business: any) => (
            <div key={business.id} className="card-festac overflow-hidden">
              <div className="aspect-[4/3] bg-muted">
                <img src={business.images?.[0] || "/placeholder.svg"} alt={business.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">{business.category_name || "Business"}</Badge>
                  {business.is_featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{business.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{business.description}</p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1"><Link to={`/business/${business.id}`}><ExternalLink className="h-3 w-3 mr-1" />View</Link></Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild><Link to={`/dashboard/businesses/${business.id}/edit`}><Edit className="h-4 w-4 mr-2" />Edit</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link to={`/dashboard/boost/business/${business.id}`}><Rocket className="h-4 w-4 mr-2" />Feature</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteMutation.mutate(business.id)}><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

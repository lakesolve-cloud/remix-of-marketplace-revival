import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Grid3X3, List, MapPin, Clock, Heart, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "products", label: "Products" },
  { value: "services", label: "Services" },
  { value: "real-estate", label: "Real Estate" },
  { value: "vehicles", label: "Vehicles" },
  { value: "jobs", label: "Jobs" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const categoryStyles: Record<string, string> = {
  "real-estate": "bg-primary/10 text-primary",
  "services": "bg-purple-500/10 text-purple-600",
  "products": "bg-blue-500/10 text-blue-600",
  "vehicles": "bg-red-500/10 text-red-600",
  "jobs": "bg-accent/10 text-accent",
};

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 50000000]);

  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "newest";

  const { data: allListings = [], isLoading } = useQuery({
    queryKey: ["all-listings"],
    queryFn: async () => {
      const { data } = await supabase.from("listings").select("*").eq("status", "active").order("is_featured", { ascending: false }).order("created_at", { ascending: false });
      return data || [];
    },
  });

  const filteredListings = useMemo(() => {
    let results = [...allListings];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter((l: any) => l.title.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q) || l.location?.toLowerCase().includes(q));
    }
    if (categoryFilter && categoryFilter !== "all") {
      results = results.filter((l: any) => l.category === categoryFilter);
    }
    results = results.filter((l: any) => Number(l.price) >= priceRange[0] && Number(l.price) <= priceRange[1]);
    switch (sortBy) {
      case "price-low": results.sort((a: any, b: any) => Number(a.price) - Number(b.price)); break;
      case "price-high": results.sort((a: any, b: any) => Number(b.price) - Number(a.price)); break;
      case "popular": results.sort((a: any, b: any) => (b.views || 0) - (a.views || 0)); break;
    }
    return results;
  }, [allListings, searchQuery, categoryFilter, sortBy, priceRange]);

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all") { newParams.set(key, value); } else { newParams.delete(key); }
    setSearchParams(newParams);
  };

  const clearFilters = () => { setSearchParams({}); setPriceRange([0, 50000000]); };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b border-border">
        <div className="container-festac py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Marketplace</h1>
          <p className="text-muted-foreground">Browse {filteredListings.length} listings in Festac Town</p>
        </div>
      </div>

      <div className="container-festac py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search listings..." value={searchQuery} onChange={(e) => updateSearchParams("search", e.target.value)} className="pl-10" />
          </div>
          <Select value={categoryFilter} onValueChange={(v) => updateSearchParams("category", v)}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{categories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => updateSearchParams("sort", v)}>
            <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>{sortOptions.map((opt) => (<SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>))}</SelectContent>
          </Select>
          <Sheet>
            <SheetTrigger asChild><Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filters</Button></SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Filter Listings</SheetTitle></SheetHeader>
              <div className="py-6 space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Price Range</h4>
                  <Slider value={priceRange} onValueChange={setPriceRange} max={50000000} step={100000} className="mb-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₦{priceRange[0].toLocaleString()}</span>
                    <span>₦{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={clearFilters}>Clear All Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex border rounded-lg">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("grid")}><Grid3X3 className="h-4 w-4" /></Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" onClick={() => setViewMode("list")}><List className="h-4 w-4" /></Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>
        ) : filteredListings.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {filteredListings.map((listing: any) => (
              <Link key={listing.id} to={`/listing/${listing.id}`} className={`card-festac group overflow-hidden ${viewMode === "list" ? "flex" : ""}`}>
                <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-[4/3]"}`}>
                  <img src={listing.images?.[0] || "/placeholder.svg"} alt={listing.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  {listing.is_featured && <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">Featured</Badge>}
                </div>
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className={categoryStyles[listing.category] || "bg-muted text-muted-foreground"}>{listing.category}</Badge>
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    {listing.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location}</span>}
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{new Date(listing.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="font-display font-bold text-primary">{listing.price_label || `₦${Number(listing.price).toLocaleString()}`}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="h-3 w-3" />{listing.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No listings found</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}

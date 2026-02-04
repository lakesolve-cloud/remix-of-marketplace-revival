import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  MapPin, 
  Clock, 
  Heart, 
  Eye,
  ChevronDown,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

// Mock listings data
const allListings = [
  {
    id: "1",
    title: "Modern 3-Bedroom Flat for Rent",
    description: "Spacious apartment in 2nd Avenue with modern amenities, 24/7 security, and parking",
    price: 800000,
    priceLabel: "₦800,000/year",
    category: "real-estate",
    subcategory: "apartments",
    location: "2nd Avenue, Festac",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    timeAgo: "2 hours ago",
    views: 234,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Professional Plumbing Services",
    description: "Expert plumber available for all repairs and installations. Quick response time.",
    price: 5000,
    priceLabel: "From ₦5,000",
    category: "services",
    subcategory: "repairs",
    location: "Festac Town",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    timeAgo: "5 hours ago",
    views: 89,
    isFeatured: false,
  },
  {
    id: "3",
    title: "iPhone 14 Pro Max - Like New",
    description: "256GB, Deep Purple, with all accessories and 6 months warranty remaining",
    price: 750000,
    priceLabel: "₦750,000",
    category: "products",
    subcategory: "electronics",
    location: "1st Avenue, Festac",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=400&fit=crop",
    timeAgo: "1 day ago",
    views: 567,
    isFeatured: true,
  },
  {
    id: "4",
    title: "Toyota Camry 2019 - Excellent Condition",
    description: "Low mileage (45,000km), full service history, negotiable price",
    price: 12500000,
    priceLabel: "₦12,500,000",
    category: "vehicles",
    subcategory: "cars",
    location: "Festac Town",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
    timeAgo: "6 hours ago",
    views: 312,
    isFeatured: true,
  },
  {
    id: "5",
    title: "Beauty Salon & Spa Services",
    description: "Full beauty treatments, makeup, hair styling, and spa packages available",
    price: 3000,
    priceLabel: "From ₦3,000",
    category: "services",
    subcategory: "beauty",
    location: "3rd Avenue, Festac",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    timeAgo: "12 hours ago",
    views: 198,
    isFeatured: false,
  },
  {
    id: "6",
    title: "2-Bedroom Bungalow for Sale",
    description: "Well-maintained property with large compound, gated community",
    price: 35000000,
    priceLabel: "₦35,000,000",
    category: "real-estate",
    subcategory: "houses",
    location: "5th Avenue, Festac",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    timeAgo: "2 days ago",
    views: 445,
    isFeatured: true,
  },
  {
    id: "7",
    title: "Samsung 55\" Smart TV",
    description: "Crystal UHD 4K, barely used, with remote and stand",
    price: 280000,
    priceLabel: "₦280,000",
    category: "products",
    subcategory: "electronics",
    location: "1st Avenue, Festac",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=400&fit=crop",
    timeAgo: "4 hours ago",
    views: 123,
    isFeatured: false,
  },
  {
    id: "8",
    title: "Catering Services for Events",
    description: "Professional catering for weddings, parties, and corporate events",
    price: 50000,
    priceLabel: "From ₦50,000",
    category: "services",
    subcategory: "food",
    location: "Festac Town",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=400&fit=crop",
    timeAgo: "1 day ago",
    views: 87,
    isFeatured: false,
  },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "products", label: "Products" },
  { value: "services", label: "Services" },
  { value: "real-estate", label: "Real Estate" },
  { value: "vehicles", label: "Vehicles" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const categoryStyles: Record<string, string> = {
  "real-estate": "bg-primary/10 text-primary",
  "services": "bg-purple-500/10 text-purple-600",
  "products": "bg-blue-500/10 text-blue-600",
  "vehicles": "bg-red-500/10 text-red-600",
};

const categoryLabels: Record<string, string> = {
  "real-estate": "Real Estate",
  "services": "Services",
  "products": "Products",
  "vehicles": "Vehicles",
};

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "newest";

  const filteredListings = useMemo(() => {
    let results = [...allListings];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.location.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (categoryFilter && categoryFilter !== "all") {
      results = results.filter((l) => l.category === categoryFilter);
    }

    // Filter by price
    results = results.filter(
      (l) => l.price >= priceRange[0] && l.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "oldest":
        results.reverse();
        break;
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        results.sort((a, b) => b.views - a.views);
        break;
    }

    return results;
  }, [searchQuery, categoryFilter, sortBy, priceRange]);

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 50000000]);
  };

  const activeFiltersCount = [
    searchQuery,
    categoryFilter !== "all" ? categoryFilter : "",
    priceRange[0] > 0 || priceRange[1] < 50000000 ? "price" : "",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container-festac py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Marketplace
          </h1>
          <p className="text-muted-foreground">
            Browse {filteredListings.length} listings in Festac Town
          </p>
        </div>
      </div>

      <div className="container-festac py-8">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => updateSearchParams("search", e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(value) => updateSearchParams("category", value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={sortBy}
            onValueChange={(value) => updateSearchParams("sort", value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* More Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Listings</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-4">Price Range</h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={50000000}
                    step={100000}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₦{priceRange[0].toLocaleString()}</span>
                    <span>₦{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Featured Only */}
                <div className="flex items-center gap-2">
                  <Checkbox id="featured" />
                  <label htmlFor="featured" className="text-sm">
                    Featured listings only
                  </label>
                </div>

                {/* Clear Filters */}
                <Button variant="outline" className="w-full" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* View Mode */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateSearchParams("search", "")}
                />
              </Badge>
            )}
            {categoryFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {categoryLabels[categoryFilter]}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => updateSearchParams("category", "all")}
                />
              </Badge>
            )}
            <Button variant="link" size="sm" onClick={clearFilters} className="text-muted-foreground">
              Clear all
            </Button>
          </div>
        )}

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredListings.map((listing) => (
              <Link
                key={listing.id}
                to={`/listing/${listing.id}`}
                className={`card-festac group overflow-hidden ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-[4/3]"
                  }`}
                >
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {listing.isFeatured && (
                    <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-4 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="secondary"
                      className={categoryStyles[listing.category]}
                    >
                      {categoryLabels[listing.category]}
                    </Badge>
                  </div>

                  <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {listing.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {listing.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {listing.timeAgo}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="font-display font-bold text-primary">
                      {listing.priceLabel}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      {listing.views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No listings found matching your criteria.</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

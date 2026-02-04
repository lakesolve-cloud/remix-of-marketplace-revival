import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Clock, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock data - will be replaced with real data from backend
const featuredListings = [
  {
    id: "1",
    title: "Modern 3-Bedroom Flat for Rent",
    description: "Spacious apartment in 2nd Avenue with modern amenities",
    price: "₦800,000/year",
    category: "Real Estate",
    location: "2nd Avenue, Festac",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    timeAgo: "2 hours ago",
    views: 234,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Professional Plumbing Services",
    description: "Expert plumber available for all repairs and installations",
    price: "From ₦5,000",
    category: "Services",
    location: "Festac Town",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
    timeAgo: "5 hours ago",
    views: 89,
    isFeatured: false,
  },
  {
    id: "3",
    title: "iPhone 14 Pro Max - Like New",
    description: "256GB, Deep Purple, with all accessories and warranty",
    price: "₦750,000",
    category: "Products",
    location: "1st Avenue, Festac",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=400&fit=crop",
    timeAgo: "1 day ago",
    views: 567,
    isFeatured: true,
  },
  {
    id: "4",
    title: "Restaurant Manager Needed",
    description: "Experienced manager for busy restaurant in Festac",
    price: "₦150,000/month",
    category: "Jobs",
    location: "4th Avenue, Festac",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=600&h=400&fit=crop",
    timeAgo: "3 days ago",
    views: 145,
    isFeatured: false,
  },
  {
    id: "5",
    title: "Toyota Camry 2019 - Excellent Condition",
    description: "Low mileage, full service history, negotiable price",
    price: "₦12,500,000",
    category: "Vehicles",
    location: "Festac Town",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&h=400&fit=crop",
    timeAgo: "6 hours ago",
    views: 312,
    isFeatured: true,
  },
  {
    id: "6",
    title: "Beauty Salon & Spa Services",
    description: "Full beauty treatments, makeup, and spa packages available",
    price: "From ₦3,000",
    category: "Services",
    location: "3rd Avenue, Festac",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    timeAgo: "12 hours ago",
    views: 198,
    isFeatured: false,
  },
];

const categoryStyles: Record<string, string> = {
  "Real Estate": "bg-primary/10 text-primary",
  "Services": "bg-purple-500/10 text-purple-600",
  "Products": "bg-blue-500/10 text-blue-600",
  "Jobs": "bg-accent/10 text-accent",
  "Vehicles": "bg-red-500/10 text-red-600",
};

export function FeaturedListings() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container-festac">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-heading mb-2">Featured Listings</h2>
            <p className="text-muted-foreground">
              Discover the best opportunities in Festac Town
            </p>
          </div>
          <Link 
            to="/marketplace" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All Listings
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="card-festac group overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
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
                  className="absolute top-3 right-3 h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle favorite toggle
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className={categoryStyles[listing.category]}>
                    {listing.category}
                  </Badge>
                </div>

                <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {listing.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {listing.description}
                </p>

                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
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
                  <span className="font-display font-bold text-lg text-primary">
                    {listing.price}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Eye className="h-3.5 w-3.5" />
                    {listing.views} views
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-10">
          <Button asChild variant="outline" size="lg">
            <Link to="/marketplace">
              Browse All Listings
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

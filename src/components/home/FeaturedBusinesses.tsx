import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data - will be replaced with real data from backend
const featuredBusinesses = [
  {
    id: "biz1",
    name: "Mama's Kitchen",
    category: "Restaurant",
    description: "Authentic Nigerian cuisine and catering services",
    location: "2nd Avenue, Festac",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 124,
    isFeatured: true,
  },
  {
    id: "biz2",
    name: "TechHub Repairs",
    category: "Electronics",
    description: "Professional phone, laptop, and gadget repairs",
    location: "1st Avenue, Festac",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 89,
    isFeatured: true,
  },
  {
    id: "biz3",
    name: "Glow Beauty Salon",
    category: "Beauty",
    description: "Hair styling, makeup, and spa treatments",
    location: "3rd Avenue, Festac",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 156,
    isFeatured: true,
  },
  {
    id: "biz4",
    name: "Festac Pharmacy",
    category: "Health",
    description: "Quality medications and health consultations",
    location: "4th Avenue, Festac",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&h=400&fit=crop",
    rating: 4.6,
    reviews: 78,
    isFeatured: true,
  },
];

export function FeaturedBusinesses() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-festac">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-heading mb-2">Featured Businesses</h2>
            <p className="text-muted-foreground">
              Discover trusted local businesses in your community
            </p>
          </div>
          <Link 
            to="/marketplace?type=business" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All Businesses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Business Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBusinesses.map((business) => (
            <Link
              key={business.id}
              to={`/business/${business.id}`}
              className="card-festac group overflow-hidden"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {business.isFeatured && (
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary">
                  {business.category}
                </Badge>

                <h3 className="font-display font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                  {business.name}
                </h3>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {business.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5" />
                  {business.location}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{business.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({business.reviews} reviews)
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

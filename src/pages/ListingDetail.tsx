import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Eye,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  Flag,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

// Mock listing data
const listing = {
  id: "1",
  title: "Modern 3-Bedroom Flat for Rent",
  description: `Beautiful and spacious 3-bedroom apartment available for rent in the heart of Festac Town. 

This property features:
• 3 large bedrooms with built-in wardrobes
• 2 modern bathrooms with hot/cold water
• Spacious living and dining area
• Fully fitted kitchen with cabinets
• Tiled floors throughout
• Pop ceiling with recessed lighting
• 24/7 security with CCTV
• Dedicated parking space
• Steady power supply (prepaid meter)

The apartment is located in a serene environment on 2nd Avenue, close to schools, hospitals, and markets. Suitable for families or working professionals.

Available for immediate occupancy. Rent is ₦800,000 per year (negotiable). 1 year agreement, 1 year security deposit.`,
  price: "₦800,000/year",
  category: "Real Estate",
  subcategory: "Apartments",
  location: "2nd Avenue, Festac Town, Lagos",
  images: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=1200&h=800&fit=crop",
  ],
  timeAgo: "2 hours ago",
  views: 234,
  isFeatured: true,
  seller: {
    id: "seller1",
    name: "Chioma Properties",
    avatar: "",
    isVerified: true,
    rating: 4.8,
    reviews: 45,
    memberSince: "2023",
    responseRate: "95%",
    phone: "+234 801 234 5678",
  },
  specs: [
    { label: "Bedrooms", value: "3" },
    { label: "Bathrooms", value: "2" },
    { label: "Type", value: "Flat" },
    { label: "Condition", value: "Newly Renovated" },
  ],
};

const relatedListings = [
  {
    id: "6",
    title: "2-Bedroom Bungalow for Sale",
    price: "₦35,000,000",
    location: "5th Avenue, Festac",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
  },
  {
    id: "10",
    title: "Self-Contain Apartment",
    price: "₦350,000/year",
    location: "7th Avenue, Festac",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
  },
  {
    id: "11",
    title: "Shop Space for Rent",
    price: "₦500,000/year",
    location: "1st Avenue, Festac",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
  },
];

export default function ListingDetail() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container-festac py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/marketplace" className="text-muted-foreground hover:text-foreground">
              Marketplace
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link
              to="/marketplace?category=real-estate"
              className="text-muted-foreground hover:text-foreground"
            >
              Real Estate
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-festac py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative rounded-xl overflow-hidden bg-muted">
              <div className="aspect-[16/10]">
                <img
                  src={listing.images[currentImage]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Navigation */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={prevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background"
                onClick={nextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>

              {/* Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {listing.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImage
                        ? "bg-primary w-6"
                        : "bg-background/60 hover:bg-background"
                    }`}
                  />
                ))}
              </div>

              {/* Featured Badge */}
              {listing.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  Featured
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Details */}
            <div className="card-festac p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {listing.category}
                </Badge>
                <Badge variant="outline">{listing.subcategory}</Badge>
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                {listing.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {listing.timeAgo}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {listing.views} views
                </span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {listing.specs.map((spec) => (
                  <div key={spec.label} className="bg-muted/50 rounded-lg p-3 text-center">
                    <div className="text-sm text-muted-foreground">{spec.label}</div>
                    <div className="font-semibold text-foreground">{spec.value}</div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <h2 className="font-display font-semibold text-lg mb-4">Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                {listing.description}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Actions */}
            <div className="card-festac p-6 sticky top-24">
              <div className="text-3xl font-display font-bold text-primary mb-6">
                {listing.price}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Seller
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className={isFavorited ? "text-red-500" : ""}
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Listing</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Please describe why you're reporting this listing.
                      </p>
                      <Textarea placeholder="Describe the issue..." />
                      <Button className="w-full">Submit Report</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator className="my-6" />

              {/* Seller Info */}
              <div>
                <h3 className="font-semibold mb-4">Seller Information</h3>
                <Link
                  to={`/seller/${listing.seller.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={listing.seller.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {listing.seller.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{listing.seller.name}</span>
                      {listing.seller.isVerified && (
                        <Shield className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {listing.seller.rating} ({listing.seller.reviews} reviews)
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>

                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="p-2 rounded bg-muted/30 text-center">
                    <div className="text-muted-foreground">Member since</div>
                    <div className="font-medium">{listing.seller.memberSince}</div>
                  </div>
                  <div className="p-2 rounded bg-muted/30 text-center">
                    <div className="text-muted-foreground">Response rate</div>
                    <div className="font-medium">{listing.seller.responseRate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        <div className="mt-12">
          <h2 className="section-heading mb-6">Similar Listings</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedListings.map((item) => (
              <Link key={item.id} to={`/listing/${item.id}`} className="card-festac group overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.location}</p>
                  <p className="font-display font-bold text-primary">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

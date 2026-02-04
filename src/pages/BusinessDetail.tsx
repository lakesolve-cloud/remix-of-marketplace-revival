import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  Heart,
  Share2,
  Phone,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
  Flag,
  Instagram,
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

// Mock business data
const business = {
  id: "biz1",
  name: "Mama's Kitchen",
  description: `Welcome to Mama's Kitchen, your home for authentic Nigerian cuisine in the heart of Festac Town.

We offer:
• Traditional Nigerian dishes (Jollof Rice, Fried Rice, Amala, Eba, Pounded Yam)
• Assorted soups (Egusi, Ogbono, Efo Riro, Pepper Soup)
• Grilled fish and meat
• Small chops and snacks
• Catering services for events

Our restaurant has been serving the Festac community for over 15 years with love and dedication. We use only fresh ingredients and traditional recipes passed down through generations.

Open daily from 8am to 10pm. Delivery available within Festac Town and environs.`,
  category: "Restaurant",
  subcategory: "Nigerian Cuisine",
  location: "23 2nd Avenue, Festac Town, Lagos",
  images: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&h=800&fit=crop",
  ],
  rating: 4.8,
  reviews: 124,
  isFeatured: true,
  owner: {
    id: "owner1",
    name: "Mrs. Adaobi Okonkwo",
    avatar: "",
    isVerified: true,
    memberSince: "2019",
    phone: "+234 803 456 7890",
    whatsapp: "+2348034567890",
    instagram: "mamaskitchen_festac",
  },
  hours: [
    { day: "Monday - Friday", time: "8:00 AM - 10:00 PM" },
    { day: "Saturday", time: "9:00 AM - 11:00 PM" },
    { day: "Sunday", time: "10:00 AM - 9:00 PM" },
  ],
  services: ["Dine-in", "Takeaway", "Delivery", "Catering"],
};

const relatedBusinesses = [
  {
    id: "biz5",
    name: "Festac Grill House",
    category: "Restaurant",
    location: "1st Avenue, Festac",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    rating: 4.5,
  },
  {
    id: "biz6",
    name: "Iya Basira Foods",
    category: "Restaurant",
    location: "4th Avenue, Festac",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
    rating: 4.7,
  },
  {
    id: "biz7",
    name: "ChopLife Kitchen",
    category: "Restaurant",
    location: "5th Avenue, Festac",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop",
    rating: 4.4,
  },
];

export default function BusinessDetail() {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % business.images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + business.images.length) % business.images.length);
  };

  const handleWhatsAppEnquiry = () => {
    const message = encodeURIComponent(`Hello! I found your business "${business.name}" on Festac Amuwo Business Connect. I'd like to make an enquiry.`);
    window.open(`https://wa.me/${business.owner.whatsapp}?text=${message}`, '_blank');
  };

  const handleInstagramVisit = () => {
    window.open(`https://instagram.com/${business.owner.instagram}`, '_blank');
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
            <Link to="/marketplace?type=business" className="text-muted-foreground hover:text-foreground">
              Businesses
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{business.name}</span>
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
                  src={business.images[currentImage]}
                  alt={business.name}
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
                {business.images.map((_, idx) => (
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
              {business.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  Featured Business
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {business.images.map((img, idx) => (
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
                  {business.category}
                </Badge>
                <Badge variant="outline">{business.subcategory}</Badge>
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{business.rating}</span>
                  <span className="text-muted-foreground">({business.reviews} reviews)</span>
                </div>
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                {business.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {business.location}
                </span>
              </div>

              {/* Services */}
              <div className="flex flex-wrap gap-2 mb-6">
                {business.services.map((service) => (
                  <Badge key={service} variant="outline" className="bg-muted/50">
                    {service}
                  </Badge>
                ))}
              </div>

              {/* Business Hours */}
              <div className="bg-muted/50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4" />
                  Business Hours
                </h3>
                <div className="space-y-2">
                  {business.hours.map((item) => (
                    <div key={item.day} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.day}</span>
                      <span className="font-medium">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              <h2 className="font-display font-semibold text-lg mb-4">About</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                {business.description}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Actions */}
            <div className="card-festac p-6 sticky top-24">
              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white" 
                  size="lg"
                  onClick={handleWhatsAppEnquiry}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Enquire on WhatsApp
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Business
                </Button>
                {business.owner.instagram && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={handleInstagramVisit}
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    View on Instagram
                  </Button>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2 mb-6">
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
                      <DialogTitle>Report Business</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Please describe why you're reporting this business.
                      </p>
                      <Textarea placeholder="Describe the issue..." />
                      <Button className="w-full">Submit Report</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator className="my-6" />

              {/* Owner Info */}
              <div>
                <h3 className="font-semibold mb-4">Business Owner</h3>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={business.owner.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {business.owner.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{business.owner.name}</span>
                      {business.owner.isVerified && (
                        <Shield className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Member since {business.owner.memberSince}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Businesses */}
        <div className="mt-12">
          <h2 className="section-heading mb-6">Similar Businesses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedBusinesses.map((item) => (
              <Link key={item.id} to={`/business/${item.id}`} className="card-festac group overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary text-xs">
                    {item.category}
                  </Badge>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.location}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{item.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

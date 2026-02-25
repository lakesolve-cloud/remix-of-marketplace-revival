import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Eye, Heart, Share2, Phone, ChevronLeft, ChevronRight, Shield, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function ListingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const { data: listing, isLoading, error } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("listings").select("*").eq("id", id!).single();
      if (error) throw error;
      // Increment views
      supabase.from("listings").update({ views: (data.views || 0) + 1 }).eq("id", id!).then();
      return data;
    },
    enabled: !!id,
  });

  const { data: sellerProfile } = useQuery({
    queryKey: ["listing-seller", listing?.user_id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", listing!.user_id).single();
      return data;
    },
    enabled: !!listing?.user_id,
  });

  const { data: relatedListings = [] } = useQuery({
    queryKey: ["related-listings", listing?.category],
    queryFn: async () => {
      const { data } = await supabase.from("listings").select("*").eq("category", listing!.category).neq("id", id!).eq("status", "active").limit(3);
      return data || [];
    },
    enabled: !!listing?.category,
  });

  useQuery({
    queryKey: ["listing-fav", id, user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("favorites").select("id").eq("user_id", user!.id).eq("listing_id", id!).maybeSingle();
      setIsFavorited(!!data);
      return data;
    },
    enabled: !!user && !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-festac py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-[16/10] rounded-xl" />
              <div className="space-y-4 p-6">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Listing not found or could not be loaded.</p>
        <Button asChild variant="outline"><Link to="/marketplace">Back to Marketplace</Link></Button>
      </div>
    );
  }

  const images = listing.images?.length ? listing.images : ["/placeholder.svg"];
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleWhatsAppEnquiry = () => {
    const message = encodeURIComponent(`Hello! I'm interested in your listing "${listing.title}" on Festac Connect. Is it still available?`);
    const number = listing.whatsapp?.replace(/[^0-9+]/g, "") || "";
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  };

  const handleFavorite = async () => {
    if (!user) { toast({ title: "Please login to save favorites" }); return; }
    if (isFavorited) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listing.id);
      setIsFavorited(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, listing_id: listing.id });
      setIsFavorited(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b border-border">
        <div className="container-festac py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/marketplace" className="text-muted-foreground hover:text-foreground">Marketplace</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-festac py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-xl overflow-hidden bg-muted">
              <div className="aspect-[16/10]">
                <img src={images[currentImage]} alt={listing.title} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <>
                  <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background" onClick={prevImage}><ChevronLeft className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background" onClick={nextImage}><ChevronRight className="h-5 w-5" /></Button>
                </>
              )}
              {listing.is_featured && <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured</Badge>}
            </div>

            <div className="card-festac p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">{listing.category}</Badge>
                {listing.subcategory && <Badge variant="outline">{listing.subcategory}</Badge>}
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                {listing.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{listing.location}</span>}
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" />Posted {new Date(listing.created_at).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{listing.views} views</span>
              </div>
              <Separator className="my-6" />
              <h2 className="font-display font-semibold text-lg mb-4">Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">{listing.description}</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-festac p-6 sticky top-24">
              <div className="text-3xl font-display font-bold text-primary mb-6">{listing.price_label || `₦${Number(listing.price).toLocaleString()}`}</div>

              <div className="space-y-3 mb-6">
                {listing.whatsapp && (
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" onClick={handleWhatsAppEnquiry}>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Enquire on WhatsApp
                  </Button>
                )}
                {listing.phone && (
                  <Button variant="outline" className="w-full" size="lg" onClick={() => window.open(`tel:${listing.phone}`)}>
                    <Phone className="h-4 w-4 mr-2" />Call Seller
                  </Button>
                )}
                {listing.instagram && (
                  <Button variant="outline" className="w-full" size="lg" onClick={() => window.open(`https://instagram.com/${listing.instagram}`, "_blank")}>
                    <Instagram className="h-4 w-4 mr-2" />View on Instagram
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="icon" className={isFavorited ? "text-red-500" : ""} onClick={handleFavorite}>
                  <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => toast({ title: "Link copied!" }))}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>

              <Separator className="my-6" />

              {sellerProfile && (
                <div>
                  <h3 className="font-semibold mb-4">Seller Information</h3>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={sellerProfile.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">{(sellerProfile.first_name || "U")[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium">{sellerProfile.first_name} {sellerProfile.last_name}</span>
                      <div className="text-sm text-muted-foreground">Member since {new Date(sellerProfile.created_at).getFullYear()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedListings.length > 0 && (
          <div className="mt-12">
            <h2 className="section-heading mb-6">Similar Listings</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedListings.map((item: any) => (
                <Link key={item.id} to={`/listing/${item.id}`} className="card-festac group overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={item.images?.[0] || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.location}</p>
                    <p className="font-display font-bold text-primary">{item.price_label || `₦${Number(item.price).toLocaleString()}`}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

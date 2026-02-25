import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, Star, Heart, Share2, Phone, ChevronLeft, ChevronRight, Shield, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function BusinessDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentImage, setCurrentImage] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const { data: business, isLoading, error } = useQuery({
    queryKey: ["business", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("businesses").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: ownerProfile } = useQuery({
    queryKey: ["business-owner", business?.user_id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", business!.user_id).single();
      return data;
    },
    enabled: !!business?.user_id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["business-reviews", id],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").eq("business_id", id!).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!id,
  });

  const { data: relatedBusinesses = [] } = useQuery({
    queryKey: ["related-businesses", business?.category_name],
    queryFn: async () => {
      const { data } = await supabase.from("businesses").select("*").eq("category_name", business!.category_name!).neq("id", id!).eq("status", "active").limit(3);
      return data || [];
    },
    enabled: !!business?.category_name,
  });

  // Check favorite status
  useQuery({
    queryKey: ["business-fav", id, user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("favorites").select("id").eq("user_id", user!.id).eq("business_id", id!).maybeSingle();
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

  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Business not found or could not be loaded.</p>
        <Button asChild variant="outline"><Link to="/marketplace">Back to Marketplace</Link></Button>
      </div>
    );
  }

  const images = business.images?.length ? business.images : ["/placeholder.svg"];
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  const handleWhatsAppEnquiry = () => {
    const message = encodeURIComponent(`Hello! I found your business "${business.name}" on Festac Connect. I'd like to make an enquiry.`);
    const number = business.whatsapp?.replace(/[^0-9+]/g, "") || "";
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  };

  const hours = (business.hours as any[]) || [];
  const services = business.services || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b border-border">
        <div className="container-festac py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <span className="text-muted-foreground">/</span>
            <Link to="/marketplace" className="text-muted-foreground hover:text-foreground">Businesses</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{business.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-festac py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative rounded-xl overflow-hidden bg-muted">
              <div className="aspect-[16/10]">
                <img src={images[currentImage]} alt={business.name} className="w-full h-full object-cover" />
              </div>
              {images.length > 1 && (
                <>
                  <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80" onClick={prevImage}><ChevronLeft className="h-5 w-5" /></Button>
                  <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80" onClick={nextImage}><ChevronRight className="h-5 w-5" /></Button>
                </>
              )}
              {business.is_featured && <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">Featured Business</Badge>}
            </div>

            <div className="card-festac p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary">{business.category_name}</Badge>
                {business.subcategory && <Badge variant="outline">{business.subcategory}</Badge>}
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{Number(business.rating).toFixed(1)}</span>
                  <span className="text-muted-foreground">({business.review_count} reviews)</span>
                </div>
              </div>

              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">{business.name}</h1>
              {business.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-6"><MapPin className="h-4 w-4" />{business.location}</div>
              )}

              {services.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {services.map((s: string) => <Badge key={s} variant="outline" className="bg-muted/50">{s}</Badge>)}
                </div>
              )}

              {hours.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold flex items-center gap-2 mb-3"><Clock className="h-4 w-4" />Business Hours</h3>
                  <div className="space-y-2">
                    {hours.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.day}</span>
                        <span className="font-medium">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-6" />
              <h2 className="font-display font-semibold text-lg mb-4">About</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">{business.description}</div>

              {reviews.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <h2 className="font-display font-semibold text-lg mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review.id} className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">U</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">User</span>
                          <div className="flex gap-0.5 ml-auto">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card-festac p-6 sticky top-24">
              <div className="space-y-3 mb-6">
                {business.whatsapp && (
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="lg" onClick={handleWhatsAppEnquiry}>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Enquire on WhatsApp
                  </Button>
                )}
                {business.phone && (
                  <Button variant="outline" className="w-full" size="lg" onClick={() => window.open(`tel:${business.phone}`)}><Phone className="h-4 w-4 mr-2" />Call Business</Button>
                )}
                {business.instagram && (
                  <Button variant="outline" className="w-full" size="lg" onClick={() => window.open(`https://instagram.com/${business.instagram}`, "_blank")}><Instagram className="h-4 w-4 mr-2" />View on Instagram</Button>
                )}
              </div>

              <div className="flex gap-2 mb-6">
                <Button variant="outline" size="icon" className={isFavorited ? "text-red-500" : ""} onClick={async () => {
                  if (!user) { toast({ title: "Please login" }); return; }
                  if (isFavorited) {
                    await supabase.from("favorites").delete().eq("user_id", user.id).eq("business_id", business.id);
                    setIsFavorited(false);
                  } else {
                    await supabase.from("favorites").insert({ user_id: user.id, business_id: business.id });
                    setIsFavorited(true);
                  }
                }}>
                  <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="icon" onClick={() => navigator.clipboard.writeText(window.location.href).then(() => toast({ title: "Link copied!" }))}><Share2 className="h-4 w-4" /></Button>
              </div>

              <Separator className="my-6" />
              {ownerProfile && (
                <div>
                  <h3 className="font-semibold mb-4">Business Owner</h3>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={ownerProfile.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">{(ownerProfile.first_name || "U")[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{ownerProfile.first_name} {ownerProfile.last_name}</span>
                        <Shield className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground">Member since {new Date(ownerProfile.created_at).getFullYear()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {relatedBusinesses.length > 0 && (
          <div className="mt-12">
            <h2 className="section-heading mb-6">Similar Businesses</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedBusinesses.map((item: any) => (
                <Link key={item.id} to={`/business/${item.id}`} className="card-festac group overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={item.images?.[0] || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary text-xs">{item.category_name}</Badge>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{item.location}</p>
                    <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span className="font-medium">{Number(item.rating).toFixed(1)}</span></div>
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

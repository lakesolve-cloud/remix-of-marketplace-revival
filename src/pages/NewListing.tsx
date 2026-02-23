import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { value: "products", label: "Products", subcategories: ["Electronics", "Fashion", "Home & Garden", "Sports", "Other"] },
  { value: "services", label: "Services", subcategories: ["Repairs", "Beauty", "Tutoring", "Catering", "Other"] },
  { value: "real-estate", label: "Real Estate", subcategories: ["Apartments", "Houses", "Shops", "Land", "Other"] },
  { value: "vehicles", label: "Vehicles", subcategories: ["Cars", "Motorcycles", "Parts", "Other"] },
  { value: "jobs", label: "Jobs", subcategories: ["Full-time", "Part-time", "Contract", "Freelance"] },
];

export default function NewListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceType, setPriceType] = useState("fixed");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");

  const selectedCategoryData = categories.find((c) => c.value === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    const priceNum = parseFloat(price) || 0;
    const priceLabel = priceType === "per-month" ? `₦${priceNum.toLocaleString()}/month`
      : priceType === "per-year" ? `₦${priceNum.toLocaleString()}/year`
      : priceType === "starting" ? `From ₦${priceNum.toLocaleString()}`
      : `₦${priceNum.toLocaleString()}`;

    const { error } = await supabase.from("listings").insert({
      user_id: user.id,
      title,
      description,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      price: priceNum,
      price_label: priceLabel,
      price_type: priceType,
      location,
      phone,
      whatsapp,
      instagram,
      is_featured: isFeatured,
      status: "active",
    });

    setIsLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Listing published!" });
      if (isFeatured) {
        // Redirect to payment for featured
        navigate("/dashboard/listings");
      } else {
        navigate("/dashboard/listings");
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />Back
        </Button>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Create New Listing</h1>
        <p className="text-muted-foreground">Fill in the details below to post your listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" placeholder="e.g., Modern 3-Bedroom Flat for Rent" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory} disabled={!selectedCategory}>
                  <SelectTrigger><SelectValue placeholder="Select subcategory" /></SelectTrigger>
                  <SelectContent>{selectedCategoryData?.subcategories.map((sub) => (<SelectItem key={sub} value={sub.toLowerCase()}>{sub}</SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" placeholder="Describe your listing in detail..." rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Pricing & Location</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input id="price" type="number" placeholder="e.g., 800000" value={price} onChange={(e) => setPrice(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Price Type</Label>
                <Select value={priceType} onValueChange={setPriceType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="negotiable">Negotiable</SelectItem>
                    <SelectItem value="starting">Starting From</SelectItem>
                    <SelectItem value="per-month">Per Month</SelectItem>
                    <SelectItem value="per-year">Per Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="e.g., 2nd Avenue, Festac Town" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" placeholder="+234 801 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                <Input id="whatsapp" type="tel" placeholder="+234 801 234 5678" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required />
                <p className="text-xs text-muted-foreground">Buyers will contact you via WhatsApp</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle (optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input id="instagram" placeholder="yourbusiness" className="pl-8" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">Feature this listing</h3>
                <p className="text-sm text-muted-foreground">Get more visibility by featuring your listing at the top of search results</p>
              </div>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            {isFeatured && (
              <div className="mt-4 p-3 rounded-lg bg-background/50 flex items-start gap-2">
                <Info className="h-4 w-4 text-accent mt-0.5" />
                <p className="text-sm text-muted-foreground">Featured listings get up to 5x more views. Fee: ₦2,000/week. You can pay after publishing.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1" disabled={isLoading}>
            {isLoading ? "Publishing..." : "Publish Listing"}
          </Button>
        </div>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  { value: "products", label: "Products", subcategories: ["Electronics", "Fashion", "Home & Garden", "Sports", "Other"] },
  { value: "services", label: "Services", subcategories: ["Repairs", "Beauty", "Tutoring", "Catering", "Other"] },
  { value: "real-estate", label: "Real Estate", subcategories: ["Apartments", "Houses", "Shops", "Land", "Other"] },
  { value: "vehicles", label: "Vehicles", subcategories: ["Cars", "Motorcycles", "Parts", "Other"] },
  { value: "jobs", label: "Jobs", subcategories: ["Full-time", "Part-time", "Contract", "Freelance"] },
];

export default function NewListing() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  const selectedCategoryData = categories.find((c) => c.value === selectedCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock submission
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard/listings");
    }, 1500);
  };

  const addImage = () => {
    // Mock adding an image
    const mockImages = [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
    ];
    if (images.length < 5) {
      setImages([...images, mockImages[images.length % 3]]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          Create New Listing
        </h1>
        <p className="text-muted-foreground">
          Fill in the details below to post your listing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Modern 3-Bedroom Flat for Rent"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subcategory *</Label>
                <Select disabled={!selectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategoryData?.subcategories.map((sub) => (
                      <SelectItem key={sub} value={sub.toLowerCase()}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your listing in detail. Include features, condition, and any other relevant information..."
                rows={6}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-0.5 rounded">
                      Cover
                    </span>
                  )}
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={addImage}
                  className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload className="h-6 w-6" />
                  <span className="text-xs">Add Image</span>
                </button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Upload up to 5 images. The first image will be the cover photo.
            </p>
          </CardContent>
        </Card>

        {/* Pricing & Location */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="e.g., 800000"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Price Type</Label>
                <Select defaultValue="fixed">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
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
              <Input
                id="location"
                placeholder="e.g., 2nd Avenue, Festac Town"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 801 234 5678"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="+234 801 234 5678"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Buyers will contact you via WhatsApp for enquiries
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Handle (optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                <Input
                  id="instagram"
                  placeholder="yourbusiness"
                  className="pl-8"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Add your Instagram business page for more visibility
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Featured Listing */}
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">
                  Feature this listing
                </h3>
                <p className="text-sm text-muted-foreground">
                  Get more visibility by featuring your listing at the top of search results
                </p>
              </div>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            {isFeatured && (
              <div className="mt-4 p-3 rounded-lg bg-background/50 flex items-start gap-2">
                <Info className="h-4 w-4 text-accent mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Featured listings get up to 5x more views. Feature fee: ₦2,000/week
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
            disabled={isLoading}
          >
            {isLoading ? "Publishing..." : "Publish Listing"}
          </Button>
          <Button type="button" variant="outline" size="lg">
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}

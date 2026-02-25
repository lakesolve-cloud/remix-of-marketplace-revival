import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function NewBusiness() {
  const navigate = useNavigate();
  const { id } = useParams(); // edit mode if id exists
  const isEditing = !!id;
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [services, setServices] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const { data: categories = [] } = useQuery({
    queryKey: ["business-categories"],
    queryFn: async () => {
      const { data } = await supabase.from("business_categories").select("*").order("name");
      return data || [];
    },
  });

  // Load existing business data when editing
  const { data: existingBusiness } = useQuery({
    queryKey: ["edit-business", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("businesses").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingBusiness) {
      setName(existingBusiness.name);
      setDescription(existingBusiness.description || "");
      setCategoryId(existingBusiness.category_id || "");
      setSubcategory(existingBusiness.subcategory || "");
      setLocation(existingBusiness.location || "");
      setPhone(existingBusiness.phone || "");
      setWhatsapp(existingBusiness.whatsapp || "");
      setInstagram(existingBusiness.instagram || "");
      setServices((existingBusiness.services || []).join(", "));
      setExistingImages(existingBusiness.images || []);
    }
  }, [existingBusiness]);

  const selectedCategory = categories.find((c: any) => c.id === categoryId);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + existingImages.length + files.length > 5) {
      toast({ title: "Maximum 5 images allowed", variant: "destructive" });
      return;
    }
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (businessId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `${user!.id}/businesses/${businessId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("images").upload(path, file, { contentType: file.type });
      if (!error) {
        const { data: urlData } = supabase.storage.from("images").getPublicUrl(path);
        uploadedUrls.push(urlData.publicUrl);
      }
    }
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    try {
      let allImages = [...existingImages];

      if (isEditing) {
        // Upload new images
        if (imageFiles.length > 0) {
          const newUrls = await uploadImages(id!);
          allImages = [...allImages, ...newUrls];
        }

        const { error } = await supabase.from("businesses").update({
          name,
          description,
          category_id: categoryId || null,
          category_name: selectedCategory?.name || "",
          subcategory,
          location,
          phone,
          whatsapp,
          instagram,
          services: services.split(",").map((s) => s.trim()).filter(Boolean),
          images: allImages,
        }).eq("id", id!);

        if (error) throw error;
        toast({ title: "Business updated!" });
      } else {
        // Create business first to get ID
        const { data: newBiz, error } = await supabase.from("businesses").insert({
          user_id: user.id,
          name,
          description,
          category_id: categoryId || null,
          category_name: selectedCategory?.name || "",
          subcategory,
          location,
          phone,
          whatsapp,
          instagram,
          services: services.split(",").map((s) => s.trim()).filter(Boolean),
          status: "active",
        }).select("id").single();

        if (error) throw error;

        // Upload images
        if (imageFiles.length > 0 && newBiz) {
          const urls = await uploadImages(newBiz.id);
          await supabase.from("businesses").update({ images: urls }).eq("id", newBiz.id);
        }

        toast({ title: "Business created!" });
      }

      navigate("/dashboard/businesses");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />Back
        </Button>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          {isEditing ? "Edit Business Profile" : "Create Business Profile"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? "Update your business details" : "Set up your business to attract customers"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input id="name" placeholder="e.g., Mama's Kitchen" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (<SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Input id="subcategory" placeholder="e.g., Nigerian Cuisine" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" placeholder="Describe your business..." rows={6} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Services (comma-separated)</Label>
              <Input id="services" placeholder="e.g., Dine-in, Takeaway, Delivery" value={services} onChange={(e) => setServices(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="e.g., 23 2nd Avenue, Festac Town" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
          </CardContent>
        </Card>

        {/* Image Upload */}
        <Card>
          <CardHeader><CardTitle>Business Images</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingImages.map((url, i) => (
                <div key={`existing-${i}`} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {imageFiles.map((file, i) => (
                <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {existingImages.length + imageFiles.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs">Add Image</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
            <p className="text-xs text-muted-foreground mt-3">Upload up to 5 images. First image will be the cover.</p>
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

        <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Business" : "Create Business")}
        </Button>
      </form>
    </div>
  );
}

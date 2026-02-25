import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Star } from "lucide-react";

const categories = [
  "Infrastructure", "Beauty", "Community", "Tips", "Automotive",
  "Food", "Health", "Education", "Security", "Business", "Other",
];

export default function NewCommunityPost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    type: "discussion",
    category: "",
    event_date: "",
    event_time: "",
    event_location: "",
    rating: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login?redirect=/community/new");
      return;
    }
    if (!form.title || !form.content) {
      toast({ title: "Please fill title and content", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("community_posts").insert({
        title: form.title,
        content: form.content,
        type: form.type,
        category: form.category || null,
        event_date: form.event_date || null,
        event_time: form.event_time || null,
        event_location: form.event_location || null,
        rating: form.type === "review" ? form.rating : null,
        user_id: user.id,
      });
      if (error) throw error;
      toast({ title: "Post created!" });
      navigate("/community");
    } catch (err: any) {
      toast({ title: "Error creating post", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: any) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container-festac py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">New Community Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Post Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Post Type</Label>
                <Select value={form.type} onValueChange={(v) => update("type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discussion">Discussion</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => update("category", v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="What's on your mind?" />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea value={form.content} onChange={(e) => update("content", e.target.value)} placeholder="Share your thoughts..." rows={6} />
              </div>

              {form.type === "review" && (
                <div>
                  <Label>Rating</Label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button type="button" key={s} onClick={() => update("rating", s)}>
                        <Star className={`h-6 w-6 cursor-pointer ${s <= form.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {form.type === "event" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Event Date</Label>
                      <Input type="date" value={form.event_date} onChange={(e) => update("event_date", e.target.value)} />
                    </div>
                    <div>
                      <Label>Event Time</Label>
                      <Input type="time" value={form.event_time} onChange={(e) => update("event_time", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label>Event Location</Label>
                    <Input value={form.event_location} onChange={(e) => update("event_location", e.target.value)} placeholder="e.g. Festac Town Hall" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
            {loading ? "Posting..." : "Publish Post"}
          </Button>
        </form>
      </div>
    </div>
  );
}

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
import { ArrowLeft } from "lucide-react";

export default function PostJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    salary: "",
    description: "",
    requirements: "",
    contact_email: "",
    contact_phone: "",
    contact_whatsapp: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title || !form.company) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("jobs").insert({
        ...form,
        user_id: user.id,
      });
      if (error) throw error;
      toast({ title: "Job posted successfully!" });
      navigate("/jobs");
    } catch (err: any) {
      toast({ title: "Error posting job", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container-festac py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6">Post a Job</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Job Title *</Label>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Restaurant Manager" />
              </div>
              <div>
                <Label>Company / Business Name *</Label>
                <Input value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="e.g. Festac Grill House" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Job Type</Label>
                  <Select value={form.type} onValueChange={(v) => update("type", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Salary / Pay</Label>
                  <Input value={form.salary} onChange={(e) => update("salary", e.target.value)} placeholder="e.g. ₦150,000/month" />
                </div>
              </div>
              <div>
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. 4th Avenue, Festac" />
              </div>
              <div>
                <Label>Job Description</Label>
                <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the role, responsibilities..." rows={5} />
              </div>
              <div>
                <Label>Requirements</Label>
                <Textarea value={form.requirements} onChange={(e) => update("requirements", e.target.value)} placeholder="Qualifications, experience needed..." rows={4} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} placeholder="hiring@company.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Phone</Label>
                  <Input value={form.contact_phone} onChange={(e) => update("contact_phone", e.target.value)} placeholder="080xxxxxxxx" />
                </div>
                <div>
                  <Label>WhatsApp</Label>
                  <Input value={form.contact_whatsapp} onChange={(e) => update("contact_whatsapp", e.target.value)} placeholder="080xxxxxxxx" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
            {loading ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </div>
    </div>
  );
}

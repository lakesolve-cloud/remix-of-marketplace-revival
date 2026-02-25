import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Briefcase, Building, Clock, Mail, Phone, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const typeColors: Record<string, string> = {
  "full-time": "bg-primary/10 text-primary",
  "part-time": "bg-purple-500/10 text-purple-600",
  "contract": "bg-accent/10 text-accent",
  "freelance": "bg-blue-500/10 text-blue-600",
};

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: appCount = 0 } = useQuery({
    queryKey: ["job-app-count", id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("job_applications")
        .select("*", { count: "exact", head: true })
        .eq("job_id", id!);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!id,
  });

  const { data: hasApplied = false } = useQuery({
    queryKey: ["job-applied", id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data, error } = await supabase
        .from("job_applications")
        .select("id")
        .eq("job_id", id!)
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!id && !!user,
  });

  const handleApply = async () => {
    if (!user) {
      navigate(`/login?redirect=/jobs/${id}`);
      return;
    }
    setApplying(true);
    try {
      const { error } = await supabase.from("job_applications").insert({
        job_id: id!,
        user_id: user.id,
        cover_letter: coverLetter || null,
      });
      if (error) throw error;
      toast({ title: "Application submitted!" });
      setDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error applying", description: err.message, variant: "destructive" });
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container-festac py-8 max-w-3xl">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container-festac py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <Button asChild><Link to="/jobs">Back to Jobs</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-festac py-8 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="secondary" className={typeColors[job.type] || ""}>
                    {job.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    <Users className="h-3 w-3 inline mr-1" />
                    {appCount} applicants
                  </span>
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{job.title}</h1>
                <p className="text-lg text-muted-foreground mt-1">{job.company}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {job.location && (
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{job.location}</span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{job.salary}</span>
              )}
            </div>

            {job.description && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
              </div>
            )}

            {job.requirements && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Requirements</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{job.requirements}</p>
              </div>
            )}

            {(job.contact_email || job.contact_phone || job.contact_whatsapp) && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Contact</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {job.contact_email && <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{job.contact_email}</p>}
                  {job.contact_phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{job.contact_phone}</p>}
                  {job.contact_whatsapp && (
                    <a href={`https://wa.me/${job.contact_whatsapp.replace(/\D/g, "")}`} target="_blank" className="flex items-center gap-2 text-primary hover:underline">
                      <Phone className="h-4 w-4" />WhatsApp: {job.contact_whatsapp}
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              {hasApplied ? (
                <Button disabled className="w-full" size="lg">Already Applied</Button>
              ) : user?.id === job.user_id ? (
                <Button disabled variant="outline" className="w-full" size="lg">This is your job posting</Button>
              ) : (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {!user && (
                        <p className="text-sm text-muted-foreground">
                          You need to <Link to={`/login?redirect=/jobs/${id}`} className="text-primary underline">log in</Link> to apply.
                        </p>
                      )}
                      {user && (
                        <>
                          <div>
                            <label className="text-sm font-medium">Cover Letter (optional)</label>
                            <Textarea
                              value={coverLetter}
                              onChange={(e) => setCoverLetter(e.target.value)}
                              placeholder="Tell the employer why you're a great fit..."
                              rows={5}
                            />
                          </div>
                          <Button onClick={handleApply} disabled={applying} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            {applying ? "Submitting..." : "Submit Application"}
                          </Button>
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Clock, Briefcase, Building, Users, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const jobTypes = [
  { value: "all", label: "All Types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const typeColors: Record<string, string> = {
  "full-time": "bg-primary/10 text-primary",
  "part-time": "bg-purple-500/10 text-purple-600",
  "contract": "bg-accent/10 text-accent",
  "freelance": "bg-blue-500/10 text-blue-600",
};

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "all";

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", searchQuery, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Get application counts
  const { data: appCounts = {} } = useQuery({
    queryKey: ["job-app-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("job_id");
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((a: any) => {
        counts[a.job_id] = (counts[a.job_id] || 0) + 1;
      });
      return counts;
    },
  });

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-festac-brown text-primary-foreground">
        <div className="container-festac py-12 md:py-16">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Job Opportunities in <span className="text-accent">Festac</span>
          </h1>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl">
            Find your next career opportunity in Festac Town. Browse local job listings from trusted employers.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs or companies..."
                value={searchQuery}
                onChange={(e) => updateSearchParams("search", e.target.value)}
                className="pl-12 h-12 bg-background text-foreground"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(value) => updateSearchParams("type", value)}
            >
              <SelectTrigger className="w-full sm:w-[160px] h-12 bg-background text-foreground">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="container-festac py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading ? "Loading..." : `Showing ${jobs.length} job${jobs.length !== 1 ? "s" : ""}`}
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link to="/jobs/post">
              <Plus className="mr-2 h-4 w-4" />
              Post a Job
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          {jobs.map((job: any) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="card-festac p-6 block group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="secondary" className={typeColors[job.type] || "bg-muted text-muted-foreground"}>
                      {job.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {job.title}
                  </h2>
                  <p className="text-muted-foreground mb-2">{job.company}</p>
                  {job.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {job.description}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </span>
                    )}
                    {job.salary && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.salary}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {appCounts[job.id] || 0} applicants
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    View Details
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No jobs found. Be the first to post!</p>
            <Button asChild>
              <Link to="/jobs/post">Post a Job</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

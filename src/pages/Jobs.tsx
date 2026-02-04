import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Clock, Briefcase, Building, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const jobs = [
  {
    id: "1",
    title: "Restaurant Manager",
    company: "Festac Grill House",
    location: "4th Avenue, Festac",
    type: "Full-time",
    salary: "₦150,000 - ₦200,000/month",
    description: "Experienced restaurant manager needed to oversee daily operations, staff management, and customer service.",
    timeAgo: "2 days ago",
    applicants: 23,
  },
  {
    id: "2",
    title: "Sales Representative",
    company: "TechMart Electronics",
    location: "1st Avenue, Festac",
    type: "Full-time",
    salary: "₦80,000 + Commission",
    description: "Looking for energetic sales reps to join our team. Experience in electronics sales preferred.",
    timeAgo: "1 day ago",
    applicants: 45,
  },
  {
    id: "3",
    title: "Hair Stylist",
    company: "Glamour Beauty Salon",
    location: "3rd Avenue, Festac",
    type: "Part-time",
    salary: "₦50,000 - ₦100,000/month",
    description: "Skilled hair stylist needed for busy salon. Must be creative and customer-friendly.",
    timeAgo: "3 days ago",
    applicants: 12,
  },
  {
    id: "4",
    title: "Delivery Rider",
    company: "QuickServe Logistics",
    location: "Festac Town",
    type: "Contract",
    salary: "₦2,000 - ₦5,000/day",
    description: "Motorcycle riders needed for delivery services. Must have valid license and own motorcycle.",
    timeAgo: "5 hours ago",
    applicants: 67,
  },
  {
    id: "5",
    title: "Accountant",
    company: "Festac Business Solutions",
    location: "2nd Avenue, Festac",
    type: "Full-time",
    salary: "₦180,000 - ₦250,000/month",
    description: "Qualified accountant needed for growing business. ICAN certification required.",
    timeAgo: "1 week ago",
    applicants: 34,
  },
  {
    id: "6",
    title: "Security Guard",
    company: "SafeHome Security",
    location: "Various Locations",
    type: "Full-time",
    salary: "₦40,000 - ₦60,000/month",
    description: "Security personnel needed for residential and commercial properties in Festac.",
    timeAgo: "4 days ago",
    applicants: 89,
  },
];

const jobTypes = [
  { value: "all", label: "All Types" },
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const typeColors: Record<string, string> = {
  "Full-time": "bg-primary/10 text-primary",
  "Part-time": "bg-purple-500/10 text-purple-600",
  "Contract": "bg-accent/10 text-accent",
  "Freelance": "bg-blue-500/10 text-blue-600",
};

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "all";

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      typeFilter === "all" ||
      job.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
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

          {/* Search */}
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
        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/dashboard/jobs/post">
              Post a Job
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Link
              key={job.id}
              to={`/jobs/${job.id}`}
              className="card-festac p-6 block group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Company Icon */}
                <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building className="h-7 w-7 text-primary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="secondary" className={typeColors[job.type]}>
                      {job.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {job.timeAgo}
                    </span>
                  </div>

                  <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                    {job.title}
                  </h2>
                  <p className="text-muted-foreground mb-2">{job.company}</p>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applicants} applicants
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="flex-shrink-0">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Apply Now
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No jobs found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchParams({});
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

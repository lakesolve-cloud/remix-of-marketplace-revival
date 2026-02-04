import { useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Active Listings", value: "5,000+" },
  { label: "Local Businesses", value: "1,200+" },
  { label: "Community Members", value: "25,000+" },
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-festac-brown">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-festac relative">
        <div className="py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm text-primary-foreground/90 mb-6 animate-fade-in">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Festac Town, Lagos, Nigeria</span>
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
              Connect with Your{" "}
              <span className="text-accent">Festac</span>{" "}
              Community
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Discover local products, services, real estate, and job opportunities. 
              Your trusted marketplace for everything Festac.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex flex-col sm:flex-row gap-3 p-2 bg-background rounded-xl shadow-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search for products, services, or businesses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 border-0 bg-transparent text-base focus-visible:ring-0"
                  />
                </div>
                <Button type="submit" size="lg" className="h-12 px-8 bg-accent hover:bg-accent/90 text-accent-foreground">
                  Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto animate-fade-in" style={{ animationDelay: "0.3s" }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
}

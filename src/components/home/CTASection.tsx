import { Link } from "react-router-dom";
import { ArrowRight, Store, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Store,
    title: "List Your Business",
    description: "Reach thousands of local customers in Festac Town",
  },
  {
    icon: Users,
    title: "Join the Community",
    description: "Connect with neighbors and local business owners",
  },
  {
    icon: Shield,
    title: "Safe & Trusted",
    description: "Verified listings and secure transactions",
  },
];

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-festac">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-festac-brown p-8 md:p-12 lg:p-16">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
                Start Selling in <span className="text-accent">Festac</span> Today
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Join thousands of successful sellers and service providers. 
                Create your free account and start reaching customers in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/faq">
                    Learn How It Works
                  </Link>
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background/10 backdrop-blur-sm"
                >
                  <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-primary-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-primary-foreground/70">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

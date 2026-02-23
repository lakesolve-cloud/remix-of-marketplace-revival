import { Link } from "react-router-dom";
import { MapPin, Store, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: MapPin,
    title: "Reach Local Customers",
    description: "Get discovered by thousands of potential customers in Festac and surrounding areas.",
  },
  {
    icon: Store,
    title: "Your Digital Storefront",
    description: "Create a professional business profile with your products, services, and contact info.",
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp Inquiries",
    description: "Customers can reach you instantly via WhatsApp for quick business transactions.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description: "Join a thriving community of local entrepreneurs and expand your customer base.",
  },
];

const steps = [
  "Create your free account",
  "Set up your business profile",
  "Add your products or services",
  "Start receiving customer inquiries",
];

export default function ListYourBusiness() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="container-festac max-w-3xl mx-auto px-4">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            List Your Business for Free
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join hundreds of Festac businesses already growing their customer base on our platform.
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-base px-8">
            <Link to="/register?redirect=/dashboard/listings/new">Get Started — It's Free</Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-background">
        <div className="container-festac px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              Why List Your Business?
            </h2>
            <p className="text-muted-foreground">Everything you need to succeed locally</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {benefits.map((b) => (
              <div key={b.title} className="text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container-festac px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
              How It Works
            </h2>
            <p className="text-muted-foreground">Get started in minutes</p>
          </div>
          <div className="flex flex-col md:flex-row items-start justify-center gap-8 max-w-3xl mx-auto">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center flex-1 gap-3">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-foreground">{step}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8">
              <Link to="/register?redirect=/dashboard/listings/new">Create Your Free Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-festac text-center px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join the Festac Connect community today and start reaching more customers in your neighborhood.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="px-8">
              <Link to="/register?redirect=/dashboard/listings/new">Get Started Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8">
              <Link to="/marketplace">View Directory First</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

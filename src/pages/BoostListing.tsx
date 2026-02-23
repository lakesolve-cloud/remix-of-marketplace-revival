import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Rocket, Star, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "weekly",
    name: "Weekly Boost",
    price: 2000,
    duration: "1 week",
    features: ["Featured badge on listing", "Top of search results", "5x more visibility"],
    icon: Star,
    popular: false,
  },
  {
    id: "monthly",
    name: "Monthly Boost",
    price: 5000,
    duration: "1 month",
    features: ["Featured badge on listing", "Top of search results", "10x more visibility", "Priority in category pages"],
    icon: Zap,
    popular: true,
  },
  {
    id: "premium",
    name: "Premium Feature",
    price: 10000,
    duration: "3 months",
    features: ["Featured badge on listing", "Top of search results", "20x more visibility", "Homepage showcase", "Priority support"],
    icon: Crown,
    popular: false,
  },
];

export default function BoostListing() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!user || !id) return;
    setIsProcessing(true);

    const plan = plans.find((p) => p.id === selectedPlan)!;
    const durationDays = selectedPlan === "weekly" ? 7 : selectedPlan === "monthly" ? 30 : 90;
    const featuredUntil = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    const reference = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    // Create payment record
    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: user.id,
      listing_id: type === "listing" ? id : null,
      business_id: type === "business" ? id : null,
      payment_type: type === "listing" ? "featured_listing" : "featured_business",
      amount: plan.price,
      status: "completed",
      reference,
    });

    if (paymentError) {
      toast({ title: "Payment error", description: paymentError.message, variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    // Update the listing/business
    if (type === "listing") {
      await supabase.from("listings").update({ is_featured: true, featured_until: featuredUntil, is_boosted: true, boosted_until: featuredUntil }).eq("id", id);
    } else {
      await supabase.from("businesses").update({ is_featured: true, featured_until: featuredUntil }).eq("id", id);
    }

    setIsProcessing(false);
    toast({ title: "Payment successful!", description: `Your ${type} is now featured for ${plan.duration}` });
    navigate(type === "listing" ? "/dashboard/listings" : "/dashboard/businesses");
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />Back
        </Button>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
          <Rocket className="inline h-7 w-7 mr-2 text-accent" />
          Boost Your {type === "listing" ? "Listing" : "Business"}
        </h1>
        <p className="text-muted-foreground">Get more visibility and reach more customers</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all ${selectedPlan === plan.id ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/50"} ${plan.popular ? "relative" : ""}`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">Most Popular</Badge>
            )}
            <CardHeader className="text-center pb-2">
              <plan.icon className={`h-10 w-10 mx-auto mb-2 ${selectedPlan === plan.id ? "text-primary" : "text-muted-foreground"}`} />
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.duration}</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-3xl font-bold text-foreground mb-4">
                ₦{plan.price.toLocaleString()}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-accent flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">
                {plans.find((p) => p.id === selectedPlan)?.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {plans.find((p) => p.id === selectedPlan)?.duration} boost
              </p>
            </div>
            <div className="text-2xl font-bold text-primary">
              ₦{plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}
            </div>
          </div>
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            {isProcessing ? "Processing..." : "Pay & Boost Now"}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3">
            Secure payment. Your {type} will be featured immediately after payment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

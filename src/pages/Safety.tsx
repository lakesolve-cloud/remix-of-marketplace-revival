import StaticPage from "./StaticPage";
import { Shield, AlertTriangle, CheckCircle, Users } from "lucide-react";

const tips = [
  { icon: Users, title: "Meet in Public Places", desc: "Always meet buyers or sellers in well-lit, public locations for transactions." },
  { icon: Shield, title: "Verify Before You Pay", desc: "Inspect items before making payment. Never send money to unknown accounts." },
  { icon: AlertTriangle, title: "Report Suspicious Activity", desc: "If something seems off, report the listing or user to our team immediately." },
  { icon: CheckCircle, title: "Use Verified Contacts", desc: "Prefer businesses and sellers with verified profiles and reviews." },
];

export default function Safety() {
  return (
    <StaticPage title="Safety Tips">
      <p className="text-foreground mb-6">Your safety is our priority. Follow these tips to have safe transactions on FestacConnect.</p>
      <div className="grid gap-4">
        {tips.map((tip) => (
          <div key={tip.title} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <tip.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{tip.title}</h3>
              <p className="text-sm">{tip.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </StaticPage>
  );
}

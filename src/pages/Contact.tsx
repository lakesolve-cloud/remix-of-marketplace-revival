import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "festacconnect.business@gmail.com",
    action: "mailto:festacconnect.business@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 904 862 7112",
    action: "tel:+2349048627112",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with us",
    action: "https://wa.me/2349048627112",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "112 road, F close house 2, Festac Town",
    action: null,
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b border-border">
        <div className="container-festac py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Contact Us
          </h1>
          <p className="text-muted-foreground">
            We'd love to hear from you. Reach out through any of these channels.
          </p>
        </div>
      </div>
      <div className="container-festac py-8 max-w-3xl">
        <div className="grid sm:grid-cols-2 gap-4">
          {contactMethods.map((method) => (
            <Card key={method.label}>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <method.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {method.label}
                  </h3>
                  {method.action ? (
                    <a
                      href={method.action}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {method.value}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

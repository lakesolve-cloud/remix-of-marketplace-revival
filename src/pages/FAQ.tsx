import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I create an account?",
    answer: "Click the 'Create Account' button on the homepage or navigate to the registration page. Fill in your details including name, email, phone number, and password. You'll receive a verification email to confirm your account.",
  },
  {
    question: "Is it free to list my business?",
    answer: "Yes! Creating a basic business listing on FestacConnect is completely free. You can add your business name, description, location, contact details, and images at no cost.",
  },
  {
    question: "How do I post a listing?",
    answer: "After logging in, go to your Dashboard and click 'New Listing'. Fill in the listing details including title, description, category, price, images, and contact information. Your listing will be reviewed and published shortly.",
  },
  {
    question: "How do buyers contact me?",
    answer: "Buyers can reach you through the WhatsApp button, phone call, or Instagram link you provide on your listing or business profile. We recommend adding your WhatsApp number for the fastest response.",
  },
  {
    question: "Can I edit or delete my listing?",
    answer: "Yes. Go to your Dashboard → My Listings. From there you can edit any listing details, update images, or delete listings you no longer need.",
  },
  {
    question: "How do I boost my listing for more visibility?",
    answer: "Featured and boosted listings appear at the top of search results and on the homepage. Visit your Dashboard → My Listings and click 'Boost' on any listing to increase its visibility.",
  },
  {
    question: "What areas does FestacConnect cover?",
    answer: "FestacConnect primarily serves Festac Town, Amuwo-Odofin, Satellite Town, and surrounding areas in Lagos, Nigeria. However, anyone can browse and interact with listings.",
  },
  {
    question: "How do I report a suspicious listing?",
    answer: "If you encounter a suspicious listing or user, please contact us immediately through our Contact page or email hello@festacconnect.com. We take safety very seriously.",
  },
  {
    question: "How do I post a job?",
    answer: "Navigate to the Jobs section and click 'Post a Job'. Fill in the job title, company, description, requirements, salary range, and contact details. Your job posting will be visible to the community.",
  },
  {
    question: "Can I use FestacConnect on my phone?",
    answer: "Yes! FestacConnect is fully responsive and works great on mobile phones, tablets, and desktops. Simply visit our website from any device's browser.",
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b border-border">
        <div className="container-festac py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground">
            Find answers to common questions about FestacConnect
          </p>
        </div>
      </div>
      <div className="container-festac py-8 max-w-3xl">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-medium text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-10 p-6 rounded-xl bg-muted/50 text-center">
          <h3 className="font-display font-semibold text-foreground mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Can't find what you're looking for? We're here to help.
          </p>
          <Button asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

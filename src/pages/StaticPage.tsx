import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StaticPageProps {
  title: string;
  children: React.ReactNode;
}

export default function StaticPage({ title, children }: StaticPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b border-border">
        <div className="container-festac py-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">{title}</h1>
        </div>
      </div>
      <div className="container-festac py-8 max-w-3xl">
        <div className="prose prose-sm max-w-none text-muted-foreground">
          {children}
        </div>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

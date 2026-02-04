import { Link } from "react-router-dom";
import { 
  ShoppingBag, 
  Wrench, 
  Home, 
  Briefcase, 
  Car, 
  Utensils,
  Laptop,
  Heart,
  ArrowRight
} from "lucide-react";

const categories = [
  {
    name: "Products",
    description: "Electronics, Fashion, Home & Garden",
    icon: ShoppingBag,
    href: "/marketplace?category=products",
    color: "bg-blue-500/10 text-blue-600",
    count: "2,500+",
  },
  {
    name: "Services",
    description: "Professionals, Repairs, Beauty",
    icon: Wrench,
    href: "/marketplace?category=services",
    color: "bg-purple-500/10 text-purple-600",
    count: "800+",
  },
  {
    name: "Real Estate",
    description: "Rentals, Sales, Rooms",
    icon: Home,
    href: "/marketplace?category=real-estate",
    color: "bg-primary/10 text-primary",
    count: "450+",
  },
  {
    name: "Jobs",
    description: "Full-time, Part-time, Freelance",
    icon: Briefcase,
    href: "/jobs",
    color: "bg-accent/10 text-accent",
    count: "300+",
  },
  {
    name: "Vehicles",
    description: "Cars, Motorcycles, Parts",
    icon: Car,
    href: "/marketplace?category=vehicles",
    color: "bg-red-500/10 text-red-600",
    count: "180+",
  },
  {
    name: "Food & Dining",
    description: "Restaurants, Catering, Groceries",
    icon: Utensils,
    href: "/marketplace?category=food",
    color: "bg-orange-500/10 text-orange-600",
    count: "220+",
  },
  {
    name: "Electronics",
    description: "Phones, Laptops, Accessories",
    icon: Laptop,
    href: "/marketplace?category=electronics",
    color: "bg-cyan-500/10 text-cyan-600",
    count: "650+",
  },
  {
    name: "Health & Wellness",
    description: "Clinics, Pharmacies, Fitness",
    icon: Heart,
    href: "/marketplace?category=health",
    color: "bg-pink-500/10 text-pink-600",
    count: "140+",
  },
];

export function CategorySection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-festac">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-heading mb-2">Browse Categories</h2>
            <p className="text-muted-foreground">
              Find exactly what you need in Festac Town
            </p>
          </div>
          <Link 
            to="/marketplace" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.href}
              className="card-festac p-6 group"
            >
              <div className={`h-12 w-12 rounded-xl ${category.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <category.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {category.description}
              </p>
              <span className="text-xs font-medium text-primary">
                {category.count} listings
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

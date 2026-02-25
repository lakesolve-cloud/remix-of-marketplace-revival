import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, User, Heart, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import fabcLogo from "@/assets/festac-amuwo-logo.png";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Marketplace", href: "/marketplace" },
  { name: "Services", href: "/marketplace?category=services" },
  { name: "Jobs", href: "/jobs" },
  { name: "Community", href: "/community" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href.split("?")[0]);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-festac">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={fabcLogo} alt="Festac Amuwo Business Connect" className="h-10 w-auto" />
            <span className="hidden font-display text-xl font-bold text-foreground sm:block">
              Festac<span className="text-primary">Amuwo</span>
            </span>
          </Link>

          <nav className="hidden lg:flex lg:gap-1">
            {navigation.map((item) => (
              <Link key={item.name} to={item.href} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive(item.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex md:flex-1 md:max-w-sm md:mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search listings..." className="w-full pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary" onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/marketplace?search=${(e.target as HTMLInputElement).value}`);
              }} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuItem className="font-medium">{profile?.first_name || user.email}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><Link to="/dashboard">Dashboard</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/dashboard/listings">My Listings</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/dashboard/businesses">My Businesses</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/dashboard/favorites">Favorites</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive"><LogOut className="h-4 w-4 mr-2" />Sign Out</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild><Link to="/login">Sign In</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link to="/register">Create Account</Link></DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild className="hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/list-your-business">List Your Business</Link>
            </Button>

            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4 md:hidden animate-slide-down">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search listings..." className="w-full pl-10 bg-muted/50 border-0" autoFocus onKeyDown={(e) => {
                if (e.key === "Enter") { navigate(`/marketplace?search=${(e.target as HTMLInputElement).value}`); setSearchOpen(false); }
              }} />
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-slide-down">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href} onClick={() => setMobileMenuOpen(false)} className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                  {item.name}
                </Link>
              ))}
              <Link to="/list-your-business" onClick={() => setMobileMenuOpen(false)} className="mt-2 px-4 py-3 text-sm font-medium rounded-lg bg-accent text-accent-foreground text-center">
                List Your Business
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

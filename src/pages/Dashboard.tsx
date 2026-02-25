import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ShoppingBag, Heart, Bell, Settings, User, LogOut, Plus, Menu, X, Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import fabcLogo from "@/assets/festac-amuwo-logo.png";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Listings", href: "/dashboard/listings", icon: ShoppingBag },
  { name: "My Businesses", href: "/dashboard/businesses", icon: Store },
  { name: "Favorites", href: "/dashboard/favorites", icon: Heart },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const displayName = profile ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User" : "User";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={fabcLogo} alt="FABC" className="h-8 w-auto" />
            <span className="font-display text-lg font-bold">FestacConnect</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-border transform transition-transform lg:translate-x-0 lg:static ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex flex-col h-full">
            <div className="hidden lg:flex items-center gap-2 px-6 h-16 border-b border-border">
              <Link to="/" className="flex items-center gap-2">
                <img src={fabcLogo} alt="FABC" className="h-9 w-auto" />
                <span className="font-display text-xl font-bold text-foreground">
                  Festac<span className="text-primary">Connect</span>
                </span>
              </Link>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{displayName}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            <div className="px-4 mb-4">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link to="/dashboard/listings/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Listing
                </Link>
              </Button>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(item.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex-1">{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="p-4 border-t border-border">
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-foreground/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

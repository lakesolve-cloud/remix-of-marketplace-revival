import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import ListingDetail from "./pages/ListingDetail";
import BusinessDetail from "./pages/BusinessDetail";
import Jobs from "./pages/Jobs";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardOverview from "./pages/DashboardOverview";
import MyListings from "./pages/MyListings";
import NewListing from "./pages/NewListing";
import ListYourBusiness from "./pages/ListYourBusiness";
import MyBusinesses from "./pages/MyBusinesses";
import NewBusiness from "./pages/NewBusiness";
import BoostListing from "./pages/BoostListing";
import DashboardSettings from "./pages/DashboardSettings";
import DashboardFavorites from "./pages/DashboardFavorites";
import DashboardNotifications from "./pages/DashboardNotifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes with main layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/business/:id" element={<BusinessDetail />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<Jobs />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/:id" element={<Community />} />
              <Route path="/list-your-business" element={<ListYourBusiness />} />
            </Route>

            {/* Auth routes (no layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard routes (protected) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route index element={<DashboardOverview />} />
              <Route path="listings" element={<MyListings />} />
              <Route path="listings/new" element={<NewListing />} />
              <Route path="listings/:id/edit" element={<NewListing />} />
              <Route path="businesses" element={<MyBusinesses />} />
              <Route path="businesses/new" element={<NewBusiness />} />
              <Route path="businesses/:id/edit" element={<NewBusiness />} />
              <Route path="boost/:type/:id" element={<BoostListing />} />
              <Route path="favorites" element={<DashboardFavorites />} />
              <Route path="notifications" element={<DashboardNotifications />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

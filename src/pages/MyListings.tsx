import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const listings = [
  {
    id: "1",
    title: "Modern 3-Bedroom Flat for Rent",
    category: "Real Estate",
    status: "active",
    price: "₦800,000/year",
    views: 234,
    inquiries: 5,
    created: "Feb 1, 2026",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=75&fit=crop",
  },
  {
    id: "2",
    title: "iPhone 14 Pro Max - Like New",
    category: "Products",
    status: "active",
    price: "₦750,000",
    views: 567,
    inquiries: 12,
    created: "Jan 28, 2026",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=100&h=75&fit=crop",
  },
  {
    id: "3",
    title: "Toyota Camry 2019",
    category: "Vehicles",
    status: "pending",
    price: "₦12,500,000",
    views: 89,
    inquiries: 3,
    created: "Jan 25, 2026",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=100&h=75&fit=crop",
  },
  {
    id: "4",
    title: "Professional Plumbing Services",
    category: "Services",
    status: "active",
    price: "From ₦5,000",
    views: 156,
    inquiries: 8,
    created: "Jan 20, 2026",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&h=75&fit=crop",
  },
  {
    id: "5",
    title: "Samsung 55\" Smart TV",
    category: "Products",
    status: "expired",
    price: "₦280,000",
    views: 445,
    inquiries: 15,
    created: "Dec 15, 2025",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=75&fit=crop",
  },
];

const statusColors: Record<string, string> = {
  active: "bg-primary/10 text-primary",
  pending: "bg-yellow-500/10 text-yellow-600",
  expired: "bg-red-500/10 text-red-600",
  draft: "bg-muted text-muted-foreground",
};

export default function MyListings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            My Listings
          </h1>
          <p className="text-muted-foreground">
            Manage and track your marketplace listings
          </p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link to="/dashboard/listings/new">
            <Plus className="h-4 w-4 mr-2" />
            New Listing
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-background rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Listing</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Inquiries</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredListings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-12 h-9 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">
                        {listing.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created {listing.created}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {listing.category}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColors[listing.status]}>
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{listing.price}</TableCell>
                <TableCell className="text-right">{listing.views}</TableCell>
                <TableCell className="text-right">{listing.inquiries}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/listing/${listing.id}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Listing
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/dashboard/listings/${listing.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Stats
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No listings found</p>
            <Button asChild>
              <Link to="/dashboard/listings/new">Create your first listing</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

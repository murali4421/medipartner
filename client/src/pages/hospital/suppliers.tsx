import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import HospitalLayout from "@/components/hospital/layout";
import { Search, Filter, Plus, Eye, Star, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";

export default function HospitalSuppliers() {
  const { hospital } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['/api/suppliers'],
  });

  const filteredSuppliers = suppliers?.filter((supplier: any) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.state.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getSupplierRating = (supplierId: number) => {
    // This would typically come from performance metrics
    return Math.floor(Math.random() * 2) + 4; // 4-5 star rating
  };

  const getDeliveryTime = (supplierId: number) => {
    // This would typically come from historical data
    const times = ["1-2 days", "2-3 days", "3-5 days", "5-7 days"];
    return times[Math.floor(Math.random() * times.length)];
  };

  if (isLoading) {
    return (
      <HospitalLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </HospitalLayout>
    );
  }

  return (
    <HospitalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-secondary">Suppliers</h2>
            <p className="text-gray-600">Manage your supplier relationships and partnerships</p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No suppliers found</p>
            </div>
          ) : (
            filteredSuppliers.map((supplier: any) => {
              const rating = getSupplierRating(supplier.id);
              const deliveryTime = getDeliveryTime(supplier.id);
              
              return (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        <p className="text-sm text-gray-600">License: {supplier.licenseNumber}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating ? 'text-warning fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">({rating}.0)</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{supplier.city}, {supplier.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-sm font-medium text-secondary">Avg. Delivery</p>
                          <p className="text-sm text-gray-600">{deliveryTime}</p>
                        </div>
                        <Badge className={supplier.isActive ? "status-success" : "status-error"}>
                          {supplier.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" className="btn-primary flex-1">
                          Request Quote
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Supplier Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier: any) => {
                  const rating = getSupplierRating(supplier.id);
                  return (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-secondary">{supplier.name}</p>
                          <p className="text-sm text-gray-600">{supplier.licenseNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>{supplier.paymentTerms}</TableCell>
                      <TableCell>{supplier.city}, {supplier.state}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating ? 'text-warning fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">({rating}.0)</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={supplier.isActive ? "status-success" : "status-error"}>
                          {supplier.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="btn-primary">
                            Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HospitalLayout>
  );
}

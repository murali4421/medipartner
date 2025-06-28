import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import SupplierLayout from "@/components/supplier/layout";
import { Search, Filter, Eye, Phone, Mail, MapPin, Building, Star, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function SupplierHospitals() {
  const { supplier } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: hospitals, isLoading } = useQuery({
    queryKey: ['/api/hospitals'],
  });

  const filteredHospitals = hospitals?.filter((hospital: any) =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.state.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getPartnershipStatus = (hospitalId: number) => {
    // This would typically come from order history
    const statuses = ["Active Partner", "New Partner", "Potential Partner"];
    return statuses[hospitalId % 3];
  };

  const getOrderVolume = (hospitalId: number) => {
    // This would typically come from order analytics
    return Math.floor(Math.random() * 50) + 10;
  };

  const getLastOrderDate = (hospitalId: number) => {
    // This would typically come from order history
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  const getHospitalRating = (hospitalId: number) => {
    // This would typically come from business metrics
    return Math.floor(Math.random() * 2) + 4; // 4-5 star rating
  };

  if (isLoading) {
    return (
      <SupplierLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-96 w-full" />
            </CardContent>
          </Card>
        </div>
      </SupplierLayout>
    );
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-secondary">Hospital Partners</h2>
            <p className="text-gray-600">Manage your hospital relationships and business opportunities</p>
          </div>
          <Button className="btn-success">
            <Building className="h-4 w-4 mr-2" />
            Add Hospital
          </Button>
        </div>

        {/* Business Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {hospitals?.filter((h: any) => getPartnershipStatus(h.id) === "Active Partner").length || 0}
                </p>
                <p className="text-sm text-gray-600">Active Partners</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {hospitals?.filter((h: any) => getPartnershipStatus(h.id) === "New Partner").length || 0}
                </p>
                <p className="text-sm text-gray-600">New Partners</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">
                  {hospitals?.filter((h: any) => getPartnershipStatus(h.id) === "Potential Partner").length || 0}
                </p>
                <p className="text-sm text-gray-600">Potential Partners</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {hospitals?.reduce((acc: number, h: any) => acc + getOrderVolume(h.id), 0) || 0}
                </p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search hospitals..."
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

        {/* Hospitals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No hospitals found</p>
            </div>
          ) : (
            filteredHospitals.map((hospital: any) => {
              const partnershipStatus = getPartnershipStatus(hospital.id);
              const orderVolume = getOrderVolume(hospital.id);
              const lastOrderDate = getLastOrderDate(hospital.id);
              const rating = getHospitalRating(hospital.id);
              
              return (
                <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{hospital.name}</CardTitle>
                        <p className="text-sm text-gray-600">License: {hospital.licenseNumber}</p>
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
                        <span>{hospital.city}, {hospital.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{hospital.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{hospital.email}</span>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-secondary">Partnership Status</span>
                          <Badge className={
                            partnershipStatus === "Active Partner" ? "status-success" :
                            partnershipStatus === "New Partner" ? "status-primary" : "status-warning"
                          }>
                            {partnershipStatus}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Total Orders</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium">{orderVolume}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Last Order</span>
                          <span className="text-sm text-gray-600">{lastOrderDate.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" className="btn-success flex-1">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Hospital Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Hospital Business Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Partnership Status</TableHead>
                  <TableHead>Order Volume</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHospitals.map((hospital: any) => {
                  const partnershipStatus = getPartnershipStatus(hospital.id);
                  const orderVolume = getOrderVolume(hospital.id);
                  const lastOrderDate = getLastOrderDate(hospital.id);
                  const rating = getHospitalRating(hospital.id);
                  
                  return (
                    <TableRow key={hospital.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-secondary">{hospital.name}</p>
                          <p className="text-sm text-gray-600">{hospital.licenseNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>{hospital.contactPerson}</TableCell>
                      <TableCell>{hospital.city}, {hospital.state}</TableCell>
                      <TableCell>
                        <Badge className={
                          partnershipStatus === "Active Partner" ? "status-success" :
                          partnershipStatus === "New Partner" ? "status-primary" : "status-warning"
                        }>
                          {partnershipStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="font-medium">{orderVolume} orders</span>
                        </div>
                      </TableCell>
                      <TableCell>{lastOrderDate.toLocaleDateString()}</TableCell>
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
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="btn-success">
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
    </SupplierLayout>
  );
}

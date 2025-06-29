import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Package, Building2, Phone, Mail, MapPin } from "lucide-react";

export default function Suppliers() {
  const { hospital } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all suppliers
  const { data: suppliers = [], isLoading: suppliersLoading } = useQuery<any[]>({
    queryKey: ['/api/suppliers'],
    enabled: !!hospital?.id,
  });

  // Fetch available medicines from all suppliers (stock > 0)
  const { data: availableMedicines = [], isLoading: medicinesLoading } = useQuery<any[]>({
    queryKey: ['/api/suppliers/available-medicines'],
    enabled: !!hospital?.id,
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMedicines = availableMedicines.filter(medicine =>
    medicine.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (suppliersLoading || medicinesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Suppliers</h2>
          <p className="text-gray-600">Manage supplier relationships and view available medicines</p>
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search suppliers or medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="available-medicines" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available-medicines">Available Medicines</TabsTrigger>
          <TabsTrigger value="suppliers">All Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="available-medicines" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Available Medicines (In Stock)</h3>
            <Badge variant="secondary">{filteredMedicines.length} items</Badge>
          </div>

          {filteredMedicines.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Available Medicines</h3>
                <p className="text-gray-600">No medicines are currently available in supplier inventories.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedicines.map((medicine: any) => (
                <Card key={`${medicine.supplierId}-${medicine.medicineId}`} className="card-gradient border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-secondary mb-1">
                          {medicine.medicineName}
                        </CardTitle>
                        <p className="text-sm text-gray-600 font-medium">
                          {medicine.brandName}
                        </p>
                      </div>
                      <Badge 
                        variant={medicine.quantity > 100 ? "default" : medicine.quantity > 20 ? "secondary" : "destructive"}
                        className="ml-2"
                      >
                        {medicine.quantity} units
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Form:</span>
                          <p className="font-medium">{medicine.dosageForm || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Strength:</span>
                          <p className="font-medium">{medicine.strength || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500">Supplier:</span>
                          <span className="font-medium text-sm">{medicine.supplierName}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Price:</span>
                          <span className="font-bold text-primary">₹{medicine.price?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>

                      <Button 
                        size="sm" 
                        className="w-full btn-primary"
                        onClick={() => {
                          // TODO: Add to cart or create order functionality
                        }}
                      >
                        Request Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">All Suppliers</h3>
            <Badge variant="secondary">{filteredSuppliers.length} suppliers</Badge>
          </div>

          {filteredSuppliers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Suppliers Found</h3>
                <p className="text-gray-600">No suppliers match your search criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSuppliers.map((supplier: any) => (
                <Card key={supplier.id} className="card-gradient border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-secondary mb-2">
                          {supplier.name}
                        </CardTitle>
                        <p className="text-gray-600 mb-1">
                          Contact: {supplier.contactPerson}
                        </p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{supplier.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{supplier.email || 'Not provided'}</span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span>{supplier.address || 'Address not provided'}</span>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">License:</span>
                            <p className="font-medium">{supplier.licenseNumber || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">GST:</span>
                            <p className="font-medium">{supplier.gstNumber || 'N/A'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1 btn-primary">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
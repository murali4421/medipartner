import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import SupplierLayout from "@/components/supplier/layout";
import { Search, Filter, Plus, Edit, Package, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function SupplierCatalog() {
  const { supplier } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const { data: inventory, isLoading } = useQuery({
    queryKey: [`/api/supplier/${supplier?.id}/inventory`],
    enabled: !!supplier?.id,
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ medicineId, quantity, price }: { medicineId: number; quantity: number; price: number }) => {
      const response = await apiRequest('PUT', `/api/supplier/${supplier?.id}/inventory/${medicineId}`, {
        quantity,
        price,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/supplier/${supplier?.id}/inventory`] });
      toast({
        title: "Stock Updated",
        description: "Medicine inventory has been updated successfully",
      });
      setEditingItem(null);
      setQuantity("");
      setPrice("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update stock",
        variant: "destructive",
      });
    },
  });

  const filteredInventory = inventory?.filter((item: any) =>
    item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEditStock = (item: any) => {
    setEditingItem(item);
    setQuantity(item.availableStock.toString());
    setPrice(item.unitPrice.toString());
  };

  const handleUpdateStock = () => {
    if (!editingItem || !quantity || !price) return;
    
    updateStockMutation.mutate({
      medicineId: editingItem.medicineId,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { status: "Out of Stock", className: "status-error" };
    } else if (stock < 1000) {
      return { status: "Low Stock", className: "status-warning" };
    } else {
      return { status: "Available", className: "status-success" };
    }
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
            <h2 className="text-2xl font-semibold text-secondary">Medicine Catalog</h2>
            <p className="text-gray-600">Manage your medicine inventory and pricing</p>
          </div>
          <Button className="btn-success">
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
        </div>

        {/* Stock Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {inventory?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Total Medicines</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {inventory?.filter((item: any) => item.availableStock >= 1000).length || 0}
                </p>
                <p className="text-sm text-gray-600">Well Stocked</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">
                  {inventory?.filter((item: any) => item.availableStock > 0 && item.availableStock < 1000).length || 0}
                </p>
                <p className="text-sm text-gray-600">Low Stock</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {inventory?.filter((item: any) => item.availableStock === 0).length || 0}
                </p>
                <p className="text-sm text-gray-600">Out of Stock</p>
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
                  placeholder="Search medicines..."
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

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Medicine Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInventory.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No medicines found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Available Stock</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Min Order Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item: any) => {
                    const stockStatus = getStockStatus(item.availableStock);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-secondary">{item.medicineName}</p>
                            <p className="text-sm text-gray-600">{item.genericName}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${item.availableStock === 0 ? 'text-destructive' : item.availableStock < 1000 ? 'text-warning' : 'text-secondary'}`}>
                              {item.availableStock?.toLocaleString() || 0}
                            </span>
                            {item.availableStock < 1000 && (
                              <AlertTriangle className="h-4 w-4 text-warning" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-success">
                          ${item.unitPrice || '0.00'}
                        </TableCell>
                        <TableCell>{item.minOrderQuantity || 1}</TableCell>
                        <TableCell>
                          <Badge className={stockStatus.className}>
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleEditStock(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Update Stock</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p className="font-medium">{editingItem?.medicineName}</p>
                                    <p className="text-sm text-gray-600">{editingItem?.brand}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="quantity">Available Quantity</Label>
                                    <Input
                                      id="quantity"
                                      type="number"
                                      value={quantity}
                                      onChange={(e) => setQuantity(e.target.value)}
                                      placeholder="Enter quantity"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="price">Unit Price ($)</Label>
                                    <Input
                                      id="price"
                                      type="number"
                                      step="0.01"
                                      value={price}
                                      onChange={(e) => setPrice(e.target.value)}
                                      placeholder="Enter price"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      className="btn-success flex-1"
                                      onClick={handleUpdateStock}
                                      disabled={updateStockMutation.isPending}
                                    >
                                      {updateStockMutation.isPending ? "Updating..." : "Update Stock"}
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setEditingItem(null)}
                                      className="flex-1"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" className="btn-primary">
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  );
}

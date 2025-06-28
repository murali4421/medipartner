import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import HospitalLayout from "@/components/hospital/layout";
import { Search, Filter, Plus, Edit, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function HospitalInventory() {
  const { hospital } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: inventory, isLoading } = useQuery({
    queryKey: [`/api/hospital/${hospital?.id}/inventory`],
    enabled: !!hospital?.id,
  });

  const filteredInventory = inventory?.filter((item: any) =>
    item.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStockStatus = (current: number, reorder: number) => {
    if (current <= reorder) {
      return { status: "Low Stock", className: "status-error" };
    } else if (current <= reorder * 1.5) {
      return { status: "Medium Stock", className: "status-warning" };
    } else {
      return { status: "Good Stock", className: "status-success" };
    }
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
            <h2 className="text-2xl font-semibold text-secondary">Medicine Inventory</h2>
            <p className="text-gray-600">Manage your hospital's medicine stock levels</p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Medicine
          </Button>
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
            <CardTitle>Medicine Stock</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInventory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No medicines found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Reorder Point</TableHead>
                    <TableHead>Max Stock</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item: any) => {
                    const stockStatus = getStockStatus(item.currentStock, item.reorderPoint);
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
                            <span className={`font-medium ${item.currentStock <= item.reorderPoint ? 'text-destructive' : 'text-secondary'}`}>
                              {item.currentStock}
                            </span>
                            {item.currentStock <= item.reorderPoint && (
                              <AlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{item.reorderPoint}</TableCell>
                        <TableCell>{item.maxStock}</TableCell>
                        <TableCell>${item.unitCost || '0.00'}</TableCell>
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
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" className="btn-primary">
                              Reorder
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
    </HospitalLayout>
  );
}

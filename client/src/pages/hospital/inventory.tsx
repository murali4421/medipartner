import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import HospitalLayout from "@/components/hospital/layout";
import { Search, Filter, Plus, Edit, AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

// Validation schema for inventory form
const inventorySchema = z.object({
  medicineId: z.string().min(1, "Medicine selection is required"),
  currentStock: z.number().min(0, "Current stock must be 0 or greater"),
  reorderPoint: z.number().min(1, "Reorder point must be greater than 0"),
  maxStock: z.number().min(1, "Max stock must be greater than 0"),
  unitCost: z.number().min(0, "Unit cost must be 0 or greater"),
  expiryDate: z.string().optional(),
  batchNumber: z.string().min(1, "Batch number is required"),
  supplier: z.string().min(1, "Supplier is required"),
  location: z.string().min(1, "Storage location is required"),
}).refine((data) => data.maxStock > data.reorderPoint, {
  message: "Max stock must be greater than reorder point",
  path: ["maxStock"],
});

type InventoryFormData = z.infer<typeof inventorySchema>;

export default function HospitalInventory() {
  const { hospital } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Fetch inventory data
  const { data: inventory = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/hospital/${hospital?.id}/inventory`],
    enabled: !!hospital?.id,
  });

  // Fetch medicines for dropdown
  const { data: medicines = [] } = useQuery<any[]>({
    queryKey: ['/api/medicines'],
    enabled: !!hospital?.id,
  });

  // Form setup
  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      medicineId: "",
      currentStock: 0,
      reorderPoint: 10,
      maxStock: 100,
      unitCost: 0,
      expiryDate: "",
      batchNumber: "",
      supplier: "",
      location: "",
    },
  });

  // Add inventory mutation
  const addInventoryMutation = useMutation({
    mutationFn: async (data: InventoryFormData) => {
      if (!hospital?.id) {
        throw new Error("Hospital ID is required");
      }
      
      const response = await fetch(`/api/hospital/${hospital.id}/inventory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicineId: data.medicineId,
          currentStock: Number(data.currentStock) || 0,
          reorderPoint: Number(data.reorderPoint) || 10,
          maxStock: Number(data.maxStock) || 100,
          unitCost: Number(data.unitCost) || 0,
          expiryDate: data.expiryDate || null,
          batchNumber: data.batchNumber || "",
          supplier: data.supplier || "",
          location: data.location || "",
        }),
      });
      
      if (!response.ok) {
        let errorMessage = "Failed to add inventory";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use response text
          const errorText = await response.text();
          console.error("Response parsing error:", jsonError);
          console.error("Response text:", errorText);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/hospital/${hospital?.id}/inventory`] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Medicine added to inventory successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add medicine to inventory",
        variant: "destructive",
      });
    },
  });

  // Update inventory mutation
  const updateInventoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InventoryFormData }) => {
      if (!hospital?.id) {
        throw new Error("Hospital ID is required");
      }
      
      const response = await fetch(`/api/hospital/${hospital.id}/inventory/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicineId: data.medicineId,
          currentStock: Number(data.currentStock) || 0,
          reorderPoint: Number(data.reorderPoint) || 10,
          maxStock: Number(data.maxStock) || 100,
          unitCost: Number(data.unitCost) || 0,
          expiryDate: data.expiryDate || null,
          batchNumber: data.batchNumber || "",
          supplier: data.supplier || "",
          location: data.location || "",
        }),
      });
      
      if (!response.ok) {
        let errorMessage = "Failed to update inventory";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If JSON parsing fails, use response text
          const errorText = await response.text();
          console.error("Response parsing error:", jsonError);
          console.error("Response text:", errorText);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/hospital/${hospital?.id}/inventory`] });
      setIsEditDialogOpen(false);
      setEditingItem(null);
      form.reset();
      toast({
        title: "Success",
        description: "Inventory updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update inventory",
        variant: "destructive",
      });
    },
  });

  // Delete inventory mutation
  const deleteInventoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/hospital/${hospital?.id}/inventory/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete inventory");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/hospital/${hospital?.id}/inventory`] });
      toast({
        title: "Success",
        description: "Medicine removed from inventory",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete inventory item",
        variant: "destructive",
      });
    },
  });

  const filteredInventory = inventory.filter((item: any) =>
    item.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.genericName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (current: number, reorder: number) => {
    if (current <= reorder) {
      return { status: "Low Stock", className: "bg-red-100 text-red-800" };
    } else if (current <= reorder * 1.5) {
      return { status: "Medium Stock", className: "bg-yellow-100 text-yellow-800" };
    } else {
      return { status: "Good Stock", className: "bg-green-100 text-green-800" };
    }
  };

  // Handler functions
  const handleAddInventory = (data: InventoryFormData) => {
    addInventoryMutation.mutate(data);
  };

  const handleEditInventory = (data: InventoryFormData) => {
    if (editingItem) {
      updateInventoryMutation.mutate({ id: editingItem.id, data });
    }
  };

  const handleDeleteInventory = (id: number) => {
    if (confirm("Are you sure you want to delete this inventory item?")) {
      deleteInventoryMutation.mutate(id);
    }
  };

  const openEditDialog = (item: any) => {
    setEditingItem(item);
    form.reset({
      medicineId: item.medicineId?.toString() || "",
      currentStock: item.currentStock || 0,
      reorderPoint: item.reorderPoint || 0,
      maxStock: item.maxStock || 0,
      unitCost: item.unitCost || 0,
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : "",
      batchNumber: item.batchNumber || "",
      supplier: item.supplier || "",
      location: item.location || "",
    });
    setIsEditDialogOpen(true);
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
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Medicine to Inventory</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddInventory)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="medicineId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicine *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select medicine" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(medicines || []).map((medicine: any) => (
                                <SelectItem key={medicine.id} value={medicine.id.toString()}>
                                  <div className="flex flex-col py-1">
                                    <div className="font-medium text-sm">
                                      {medicine.name || medicine.medicineName}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      <span className="font-medium">{medicine.brandName || medicine.brand}</span>
                                      {(medicine.dosageForm || medicine.strength) && (
                                        <span> | {medicine.dosageForm} | {medicine.strength}</span>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Stock *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Enter current stock"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reorderPoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reorder Point *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Enter reorder point"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Stock *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Enter max stock"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unitCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Cost ($) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              placeholder="Enter unit cost"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="batchNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batch Number *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter batch number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supplier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supplier *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter supplier name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Location *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Shelf A-1, Room 101" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={addInventoryMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      {addInventoryMutation.isPending ? "Adding..." : "Add Medicine"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Inventory Item</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleEditInventory)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="medicineId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medicine *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select medicine" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(medicines || []).map((medicine: any) => (
                                <SelectItem key={medicine.id} value={medicine.id.toString()}>
                                  <div className="flex flex-col py-1">
                                    <div className="font-medium text-sm">
                                      {medicine.name || medicine.medicineName}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      <span className="font-medium">{medicine.brandName || medicine.brand}</span>
                                      {(medicine.dosageForm || medicine.strength) && (
                                        <span> | {medicine.dosageForm} | {medicine.strength}</span>
                                      )}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Stock *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Enter current stock"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reorderPoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reorder Point *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Enter reorder point"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Stock *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Enter max stock"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="unitCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Cost ($) *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01"
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              placeholder="Enter unit cost"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="batchNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Batch Number *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter batch number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="supplier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supplier *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter supplier name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Location *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., Shelf A-1, Room 101" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditingItem(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={updateInventoryMutation.isPending}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                    >
                      {updateInventoryMutation.isPending ? "Updating..." : "Update Medicine"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openEditDialog(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteInventory(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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

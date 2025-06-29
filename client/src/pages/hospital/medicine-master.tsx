import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import HospitalLayout from "@/components/hospital/layout";

const medicineSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  brandName: z.string().min(1, "Brand name is required"),
  dosageForm: z.string().min(1, "Dosage form is required"),
  strength: z.string().min(1, "Strength is required"),
  composition: z.string().min(1, "Composition is required"),
  route: z.string().min(1, "Route is required"),
  category: z.string().min(1, "Category is required"),
  hsnCode: z.string().optional(),
  gstPercent: z.number().min(0).max(100, "GST percent must be between 0 and 100"),
});

type MedicineFormData = z.infer<typeof medicineSchema>;

const dosageForms = [
  "Tablet", "Capsule", "Syrup", "Injection", "Drops", "Ointment", 
  "Cream", "Gel", "Inhaler", "Patch", "Suppository", "Solution"
];

const routes = [
  "Oral", "Intravenous (IV)", "Intramuscular (IM)", "Subcutaneous (SC)",
  "Topical", "Inhalation", "Rectal", "Vaginal", "Nasal", "Ophthalmic"
];

const categories = [
  "Antibiotic", "Analgesic", "Antipyretic", "Anti-inflammatory", "Antacid",
  "Antihistamine", "Antihypertensive", "Antidiabetic", "Cardiac", "Respiratory",
  "Neurological", "Gastrointestinal", "Dermatological", "Hormonal", "Vitamin/Supplement"
];

export default function MedicineMaster() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const form = useForm<MedicineFormData>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      medicineName: "",
      brandName: "",
      dosageForm: "",
      strength: "",
      composition: "",
      route: "",
      category: "",
      hsnCode: "",
      gstPercent: 0,
    },
  });

  // Fetch medicines
  const { data: medicines = [], isLoading } = useQuery<any[]>({
    queryKey: ['/api/medicines'],
  });

  // Add medicine mutation
  const addMedicineMutation = useMutation({
    mutationFn: async (data: MedicineFormData) => {
      const response = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add medicine');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medicines'] });
      toast({ title: "Success", description: "Medicine added successfully" });
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Update medicine mutation
  const updateMedicineMutation = useMutation({
    mutationFn: async (data: MedicineFormData & { id: number }) => {
      const response = await fetch(`/api/medicines/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update medicine');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medicines'] });
      toast({ title: "Success", description: "Medicine updated successfully" });
      setIsEditDialogOpen(false);
      setEditingMedicine(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Delete medicine mutation
  const deleteMedicineMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/medicines/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete medicine');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/medicines'] });
      toast({ title: "Success", description: "Medicine deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleAddMedicine = (data: MedicineFormData) => {
    addMedicineMutation.mutate(data);
  };

  const handleEditMedicine = (data: MedicineFormData) => {
    if (editingMedicine) {
      updateMedicineMutation.mutate({ ...data, id: editingMedicine.id });
    }
  };

  const openEditDialog = (medicine: any) => {
    setEditingMedicine(medicine);
    form.reset({
      medicineName: medicine.name || medicine.medicineName,
      brandName: medicine.brandName || "",
      dosageForm: medicine.dosageForm || "",
      strength: medicine.strength || "",
      composition: medicine.composition || medicine.genericName || "",
      route: medicine.route || "",
      category: medicine.category || "",
      hsnCode: medicine.hsnCode || "",
      gstPercent: medicine.gstPercent || 0,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteMedicine = (id: number) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      deleteMedicineMutation.mutate(id);
    }
  };

  const filteredMedicines = medicines.filter((medicine: any) =>
    medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medicine.genericName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HospitalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-secondary">Medicine Master</h2>
            <p className="text-gray-600">Manage the master list of medicines</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
              </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddMedicine)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="medicineName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medicine Name (Generic) *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Paracetamol" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Calpol" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dosageForm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage Form *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select dosage form" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dosageForms.map((form) => (
                              <SelectItem key={form} value={form}>
                                {form}
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
                    name="strength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Strength *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 500mg, 100mg/ml" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="composition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Composition *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Active ingredients" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select route" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {routes.map((route) => (
                              <SelectItem key={route} value={route}>
                                {route}
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
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
                    name="hsnCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HSN Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="For GST/billing compliance" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gstPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST Percent *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            placeholder="Tax applicable (%)"
                          />
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
                    disabled={addMedicineMutation.isPending}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    {addMedicineMutation.isPending ? "Adding..." : "Add Medicine"}
                  </Button>
                </div>
              </form>
            </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search medicines by name, brand, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Medicine Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medicine List ({filteredMedicines.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading medicines...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine ID</TableHead>
                    <TableHead>Medicine Name</TableHead>
                    <TableHead>Brand Name</TableHead>
                    <TableHead>Dosage Form</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>GST %</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedicines.map((medicine: any) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-mono">{medicine.id}</TableCell>
                      <TableCell className="font-medium">
                        {medicine.name || medicine.medicineName}
                      </TableCell>
                      <TableCell>{medicine.brandName || medicine.brand || "N/A"}</TableCell>
                      <TableCell>{medicine.dosageForm || "N/A"}</TableCell>
                      <TableCell>{medicine.strength || "N/A"}</TableCell>
                      <TableCell>{medicine.route || "N/A"}</TableCell>
                      <TableCell>{medicine.category || "N/A"}</TableCell>
                      <TableCell>{medicine.gstPercent || 0}%</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openEditDialog(medicine)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteMedicine(medicine.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditMedicine)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="medicineName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name (Generic) *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Paracetamol" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Calpol" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dosageForm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage Form *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dosage form" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dosageForms.map((form) => (
                            <SelectItem key={form} value={form}>
                              {form}
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
                  name="strength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strength *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 500mg, 100mg/ml" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="composition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Composition *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Active ingredients" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select route" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {routes.map((route) => (
                            <SelectItem key={route} value={route}>
                              {route}
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                  name="hsnCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HSN Code</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="For GST/billing compliance" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gstPercent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GST Percent *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="Tax applicable (%)"
                        />
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
                    setEditingMedicine(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateMedicineMutation.isPending}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  {updateMedicineMutation.isPending ? "Updating..." : "Update Medicine"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      </div>
    </HospitalLayout>
  );
}
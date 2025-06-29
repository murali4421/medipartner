import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  FileText, 
  Check, 
  Clock, 
  AlertCircle,
  Plus,
  Eye
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface SettlementFormData {
  supplierId: string;
  purchaseOrderId: string;
  amount: number;
  settlementType: string;
  paymentMethod: string;
  transactionReference: string;
  notes: string;
  dueDate: string;
}

export default function Settlements() {
  const { hospital } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [formData, setFormData] = useState<SettlementFormData>({
    supplierId: "",
    purchaseOrderId: "",
    amount: 0,
    settlementType: "full",
    paymentMethod: "bank_transfer",
    transactionReference: "",
    notes: "",
    dueDate: "",
  });

  // Fetch settlements
  const { data: settlements = [], isLoading: settlementsLoading } = useQuery<any[]>({
    queryKey: [`/api/hospital/${hospital?.id}/settlements`],
    enabled: !!hospital?.id,
  });

  // Fetch pending purchase orders for settlement
  const { data: pendingPurchaseOrders = [] } = useQuery<any[]>({
    queryKey: [`/api/hospital/${hospital?.id}/purchase-orders?status=approved`],
    enabled: !!hospital?.id,
  });

  // Fetch suppliers
  const { data: suppliers = [] } = useQuery<any[]>({
    queryKey: ['/api/suppliers'],
    enabled: !!hospital?.id,
  });

  // Create settlement mutation
  const createSettlementMutation = useMutation({
    mutationFn: async (data: SettlementFormData) => {
      const response = await fetch(`/api/hospital/${hospital?.id}/settlements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          hospitalId: hospital?.id,
          amount: parseFloat(data.amount.toString()),
          supplierId: parseInt(data.supplierId),
          purchaseOrderId: parseInt(data.purchaseOrderId),
          dueDate: new Date(data.dueDate),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create settlement");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/hospital/${hospital?.id}/settlements`] });
      setIsCreateDialogOpen(false);
      setFormData({
        supplierId: "",
        purchaseOrderId: "",
        amount: 0,
        settlementType: "full",
        paymentMethod: "bank_transfer",
        transactionReference: "",
        notes: "",
        dueDate: "",
      });
      toast({
        title: "Success",
        description: "Settlement record created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create settlement",
        variant: "destructive",
      });
    },
  });

  const filteredSettlements = settlements.filter(settlement =>
    settlement.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    settlement.transactionReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    settlement.purchaseOrderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'processing': return 'outline';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  const handleCreateSettlement = () => {
    createSettlementMutation.mutate(formData);
  };

  if (settlementsLoading) {
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
          <h2 className="text-2xl font-semibold text-secondary">Supplier Settlements</h2>
          <p className="text-gray-600">Manage payment settlements with suppliers</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search settlements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                New Settlement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Settlement Record</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier *</Label>
                    <Select value={formData.supplierId} onValueChange={(value) => setFormData({...formData, supplierId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers.map((supplier: any) => (
                          <SelectItem key={supplier.id} value={supplier.id.toString()}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purchaseOrder">Purchase Order *</Label>
                    <Select value={formData.purchaseOrderId} onValueChange={(value) => setFormData({...formData, purchaseOrderId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purchase order" />
                      </SelectTrigger>
                      <SelectContent>
                        {pendingPurchaseOrders.map((po: any) => (
                          <SelectItem key={po.id} value={po.id.toString()}>
                            {po.purchaseOrderNumber} - ₹{po.totalAmount?.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Settlement Amount *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                      placeholder="Enter amount"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="settlementType">Settlement Type *</Label>
                    <Select value={formData.settlementType} onValueChange={(value) => setFormData({...formData, settlementType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Payment</SelectItem>
                        <SelectItem value="partial">Partial Payment</SelectItem>
                        <SelectItem value="advance">Advance Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="online_payment">Online Payment</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionReference">Transaction Reference</Label>
                  <Input
                    id="transactionReference"
                    value={formData.transactionReference}
                    onChange={(e) => setFormData({...formData, transactionReference: e.target.value})}
                    placeholder="Transaction ID, Cheque number, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Additional notes or comments"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateSettlement}
                    className="btn-primary"
                    disabled={createSettlementMutation.isPending}
                  >
                    {createSettlementMutation.isPending ? "Creating..." : "Create Settlement"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Settlement Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-gradient border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Settled</p>
                <p className="text-2xl font-bold text-secondary">
                  ₹{settlements.filter(s => s.status === 'completed').reduce((sum, s) => sum + (s.amount || 0), 0).toFixed(2)}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-secondary">
                  ₹{settlements.filter(s => s.status === 'pending').reduce((sum, s) => sum + (s.amount || 0), 0).toFixed(2)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-secondary">
                  {settlements.filter(s => {
                    const settleDate = new Date(s.createdAt);
                    const currentMonth = new Date().getMonth();
                    return settleDate.getMonth() === currentMonth;
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-secondary">
                  {settlements.filter(s => s.status === 'pending' && new Date(s.dueDate) < new Date()).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settlements List */}
      <Card className="card-gradient border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Settlement Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSettlements.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Settlements Found</h3>
              <p className="text-gray-600">No settlement records match your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSettlements.map((settlement: any) => (
                <div
                  key={settlement.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-secondary">{settlement.supplierName}</h4>
                      <Badge variant={getStatusColor(settlement.status)}>
                        {settlement.status?.charAt(0).toUpperCase() + settlement.status?.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Amount: </span>
                        ₹{settlement.amount?.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">PO: </span>
                        {settlement.purchaseOrderNumber}
                      </div>
                      <div>
                        <span className="font-medium">Method: </span>
                        {settlement.paymentMethod?.replace('_', ' ')}
                      </div>
                      <div>
                        <span className="font-medium">Due: </span>
                        {new Date(settlement.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSettlement(settlement);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Settlement Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Settlement Details</DialogTitle>
          </DialogHeader>
          {selectedSettlement && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Supplier</Label>
                  <p className="font-medium">{selectedSettlement.supplierName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge variant={getStatusColor(selectedSettlement.status)} className="mt-1">
                    {selectedSettlement.status?.charAt(0).toUpperCase() + selectedSettlement.status?.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Amount</Label>
                  <p className="font-medium text-lg">₹{selectedSettlement.amount?.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Settlement Type</Label>
                  <p className="font-medium">{selectedSettlement.settlementType?.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Payment Method</Label>
                  <p className="font-medium">{selectedSettlement.paymentMethod?.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Due Date</Label>
                  <p className="font-medium">{new Date(selectedSettlement.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              {selectedSettlement.transactionReference && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Transaction Reference</Label>
                  <p className="font-medium">{selectedSettlement.transactionReference}</p>
                </div>
              )}
              
              {selectedSettlement.notes && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">Notes</Label>
                  <p className="text-gray-700">{selectedSettlement.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
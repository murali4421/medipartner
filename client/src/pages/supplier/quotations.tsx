import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import SupplierLayout from "@/components/supplier/layout";
import { FileText, Eye, Send, Clock, AlertTriangle, Check, X, Package, Calendar, Building2 } from "lucide-react";
import { useState } from "react";

interface QuotationItem {
  medicineId: number;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function SupplierQuotations() {
  const { supplier } = useAuth();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isQuotationDialogOpen, setIsQuotationDialogOpen] = useState(false);
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [quotationForm, setQuotationForm] = useState({
    deliveryTerms: "",
    paymentTerms: "",
    notes: "",
    validUntil: "",
  });

  // Fetch pending orders from hospitals
  const { data: pendingOrders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: [`/api/supplier/${supplier?.id}/pending-orders`],
    enabled: !!supplier?.id,
  });

  // Fetch submitted quotations
  const { data: submittedQuotations = [], isLoading: quotationsLoading } = useQuery<any[]>({
    queryKey: [`/api/supplier/${supplier?.id}/quotations`],
    enabled: !!supplier?.id,
  });

  // Fetch processed orders (rejected/ignored/quoted)
  const { data: processedOrders = [], isLoading: processedLoading } = useQuery<any[]>({
    queryKey: [`/api/supplier/${supplier?.id}/processed-orders`],
    enabled: !!supplier?.id,
  });

  // Accept order and create quotation
  const acceptOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/supplier/${supplier?.id}/orders/${data.orderId}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: quotationItems,
          deliveryTerms: quotationForm.deliveryTerms,
          paymentTerms: quotationForm.paymentTerms,
          notes: quotationForm.notes,
          validUntil: new Date(quotationForm.validUntil),
        }),
      });
      if (!response.ok) throw new Error("Failed to accept order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/supplier/${supplier?.id}/pending-orders`] });
      queryClient.invalidateQueries({ queryKey: [`/api/supplier/${supplier?.id}/quotations`] });
      toast({
        title: "Order Accepted",
        description: "Quotation has been sent to the hospital",
      });
      setIsQuotationDialogOpen(false);
      setSelectedOrder(null);
      setQuotationItems([]);
      setQuotationForm({
        deliveryTerms: "",
        paymentTerms: "",
        notes: "",
        validUntil: "",
      });
    },
  });

  // Reject order
  const rejectOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await fetch(`/api/supplier/${supplier?.id}/orders/${orderId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to reject order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/supplier/${supplier?.id}/pending-orders`] });
      toast({
        title: "Order Rejected",
        description: "The hospital has been notified",
      });
    },
  });

  // Ignore order
  const ignoreOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await fetch(`/api/supplier/${supplier?.id}/orders/${orderId}/ignore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to ignore order");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/supplier/${supplier?.id}/pending-orders`] });
      toast({
        title: "Order Ignored",
        description: "Order has been marked as ignored",
      });
    },
  });

  const handleAcceptOrder = (order: any) => {
    setSelectedOrder(order);
    // Initialize quotation items from order items
    const items = order.items?.map((item: any) => ({
      medicineId: item.medicineId,
      medicineName: item.medicineName,
      quantity: item.quantity,
      unitPrice: 0,
      totalPrice: 0,
    })) || [];
    setQuotationItems(items);
    setIsQuotationDialogOpen(true);
  };

  const updateQuotationItem = (index: number, field: string, value: any) => {
    const updatedItems = [...quotationItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    
    if (field === 'unitPrice' || field === 'quantity') {
      updatedItems[index].totalPrice = updatedItems[index].unitPrice * updatedItems[index].quantity;
    }
    
    setQuotationItems(updatedItems);
  };

  const handleSubmitQuotation = () => {
    if (!selectedOrder) return;
    
    const totalAmount = quotationItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    acceptOrderMutation.mutate({
      orderId: selectedOrder.id,
      totalAmount,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'standard': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  if (ordersLoading || quotationsLoading) {
    return (
      <SupplierLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </SupplierLayout>
    );
  }

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Quotations</h2>
          <p className="text-gray-600">Manage hospital orders and submit quotations</p>
        </div>

        <Tabs defaultValue="pending-orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending-orders">Pending ({pendingOrders.length})</TabsTrigger>
            <TabsTrigger value="submitted-quotations">Submitted ({submittedQuotations.length})</TabsTrigger>
            <TabsTrigger value="rejected-orders">Rejected ({processedOrders.filter(o => o.status === 'rejected').length})</TabsTrigger>
            <TabsTrigger value="ignored-orders">Ignored ({processedOrders.filter(o => o.status === 'ignored').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending-orders" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Hospital Orders Pending Response</h3>
              <Badge variant="secondary">{pendingOrders.length} orders</Badge>
            </div>

            {pendingOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Orders</h3>
                  <p className="text-gray-600">No hospital orders are currently pending your response.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map((order: any) => (
                  <Card key={order.id} className="card-gradient border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-secondary mb-2">
                            Order #{order.orderNumber}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{order.hospitalName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Required: {new Date(order.requiredDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={getPriorityColor(order.priority)}>
                          {order.priority?.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Medicine Details:</h4>
                          <div className="space-y-2">
                            {order.items?.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="font-medium">{item.medicineName}</span>
                                <span className="text-gray-600">Qty: {item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {order.notes && (
                          <div>
                            <h4 className="font-medium mb-1">Order Notes:</h4>
                            <p className="text-gray-600 text-sm">{order.notes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleAcceptOrder(order)}
                            className="btn-primary flex-1"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Accept & Quote
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => rejectOrderMutation.mutate(order.id)}
                            disabled={rejectOrderMutation.isPending}
                            className="flex-1 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => ignoreOrderMutation.mutate(order.id)}
                            disabled={ignoreOrderMutation.isPending}
                          >
                            Ignore
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="submitted-quotations" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">Submitted Quotations</h3>
              <Badge variant="secondary">{submittedQuotations.length} quotations</Badge>
            </div>

            {submittedQuotations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotations Submitted</h3>
                  <p className="text-gray-600">You haven't submitted any quotations yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {submittedQuotations.map((quotation: any) => (
                  <Card key={quotation.id} className="card-gradient border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-secondary">
                            Quotation #{quotation.quotationNumber}
                          </CardTitle>
                          <p className="text-gray-600">Order #{quotation.orderNumber}</p>
                        </div>
                        <Badge variant={quotation.status === 'accepted' ? 'default' : 'secondary'}>
                          {quotation.status?.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Hospital</span>
                          <p className="font-medium">{quotation.hospitalName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Total Amount</span>
                          <p className="font-medium">₹{parseFloat(quotation.totalAmount || '0').toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Valid Until</span>
                          <p className="font-medium">{new Date(quotation.validUntil).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected-orders" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <X className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-medium">Rejected Orders</h3>
              <Badge variant="destructive">{processedOrders.filter(o => o.status === 'rejected').length} orders</Badge>
            </div>

            {processedOrders.filter(o => o.status === 'rejected').length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Rejected Orders</h3>
                  <p className="text-gray-600">You haven't rejected any orders.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {processedOrders.filter(o => o.status === 'rejected').map((order: any) => (
                  <Card key={order.id} className="border-red-200 bg-red-50">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-red-700">
                            Order #{order.orderNumber}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{order.hospitalName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Required: {new Date(order.requiredDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="destructive">REJECTED</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Medicine Details:</h4>
                          <div className="space-y-2">
                            {order.items?.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                                <span className="font-medium">{item.medicineName}</span>
                                <span className="text-gray-600">Qty: {item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {order.notes && (
                          <div>
                            <h4 className="font-medium mb-1">Order Notes:</h4>
                            <p className="text-gray-600 text-sm">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ignored-orders" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">Ignored Orders</h3>
              <Badge variant="outline" className="border-orange-500 text-orange-700">{processedOrders.filter(o => o.status === 'ignored').length} orders</Badge>
            </div>

            {processedOrders.filter(o => o.status === 'ignored').length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Ignored Orders</h3>
                  <p className="text-gray-600">You haven't ignored any orders.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {processedOrders.filter(o => o.status === 'ignored').map((order: any) => (
                  <Card key={order.id} className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-orange-700">
                            Order #{order.orderNumber}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Building2 className="h-4 w-4" />
                              <span>{order.hospitalName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Required: {new Date(order.requiredDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-orange-500 text-orange-700">IGNORED</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Medicine Details:</h4>
                          <div className="space-y-2">
                            {order.items?.map((item: any, index: number) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                                <span className="font-medium">{item.medicineName}</span>
                                <span className="text-gray-600">Qty: {item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        {order.notes && (
                          <div>
                            <h4 className="font-medium mb-1">Order Notes:</h4>
                            <p className="text-gray-600 text-sm">{order.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quotation Creation Dialog */}
        <Dialog open={isQuotationDialogOpen} onOpenChange={setIsQuotationDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Quotation for Order #{selectedOrder?.orderNumber}</DialogTitle>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">Hospital</span>
                    <p className="font-medium">{selectedOrder.hospitalName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Required Date</span>
                    <p className="font-medium">{new Date(selectedOrder.requiredDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Medicine Pricing</h3>
                  <div className="space-y-3">
                    {quotationItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium">{item.medicineName}</Label>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div>
                          <Label htmlFor={`unitPrice-${index}`}>Unit Price (₹)</Label>
                          <Input
                            id={`unitPrice-${index}`}
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateQuotationItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label>Total Price</Label>
                          <p className="font-medium text-lg">₹{item.totalPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">Grand Total:</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{quotationItems.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                    <Textarea
                      id="deliveryTerms"
                      value={quotationForm.deliveryTerms}
                      onChange={(e) => setQuotationForm({...quotationForm, deliveryTerms: e.target.value})}
                      placeholder="Delivery terms and conditions"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Textarea
                      id="paymentTerms"
                      value={quotationForm.paymentTerms}
                      onChange={(e) => setQuotationForm({...quotationForm, paymentTerms: e.target.value})}
                      placeholder="Payment terms and conditions"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={quotationForm.validUntil}
                      onChange={(e) => setQuotationForm({...quotationForm, validUntil: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={quotationForm.notes}
                      onChange={(e) => setQuotationForm({...quotationForm, notes: e.target.value})}
                      placeholder="Additional notes or comments"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsQuotationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitQuotation}
                    disabled={acceptOrderMutation.isPending || quotationItems.some(item => item.unitPrice <= 0)}
                    className="btn-primary"
                  >
                    {acceptOrderMutation.isPending ? "Submitting..." : "Submit Quotation"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SupplierLayout>
  );
}
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import SupplierLayout from "@/components/supplier/layout";
import { FileText, Eye, Send, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function SupplierQuotations() {
  const { supplier } = useAuth();
  const { toast } = useToast();
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [quotationForm, setQuotationForm] = useState({
    totalAmount: "",
    deliveryTerms: "",
    paymentTerms: "",
    notes: "",
    validUntil: "",
  });

  const { data: quotations, isLoading } = useQuery({
    queryKey: [`/api/supplier/${supplier?.id}/quotations`],
    enabled: !!supplier?.id,
  });

  const submitQuotationMutation = useMutation({
    mutationFn: async (quotationData: any) => {
      const response = await apiRequest('POST', '/api/supplier/quotations', quotationData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/supplier/${supplier?.id}/quotations`] });
      toast({
        title: "Quotation Submitted",
        description: "Your quotation has been sent to the hospital",
      });
      setSelectedQuotation(null);
      setQuotationForm({
        totalAmount: "",
        deliveryTerms: "",
        paymentTerms: "",
        notes: "",
        validUntil: "",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit quotation",
        variant: "destructive",
      });
    },
  });

  const handleSubmitQuotation = () => {
    if (!selectedQuotation || !quotationForm.totalAmount || !quotationForm.validUntil) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    submitQuotationMutation.mutate({
      orderId: selectedQuotation.orderId,
      supplierId: supplier?.id,
      hospitalId: selectedQuotation.hospitalId,
      totalAmount: parseFloat(quotationForm.totalAmount),
      deliveryTerms: quotationForm.deliveryTerms,
      paymentTerms: quotationForm.paymentTerms,
      notes: quotationForm.notes,
      validUntil: new Date(quotationForm.validUntil).toISOString(),
    });
  };

  const handleQuoteClick = (quotation: any) => {
    setSelectedQuotation(quotation);
    setQuotationForm({
      totalAmount: "",
      deliveryTerms: "Standard delivery within 3-5 business days",
      paymentTerms: "30 days net payment terms",
      notes: "",
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
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
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Quotations</h2>
          <p className="text-gray-600">Manage quotation requests from hospitals</p>
        </div>

        {/* Quotation Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {quotations?.filter((q: any) => q.status === 'pending').length || 0}
                </p>
                <p className="text-sm text-gray-600">Pending Requests</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {quotations?.filter((q: any) => q.status === 'submitted').length || 0}
                </p>
                <p className="text-sm text-gray-600">Submitted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {quotations?.filter((q: any) => q.status === 'accepted').length || 0}
                </p>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {quotations?.filter((q: any) => q.status === 'rejected').length || 0}
                </p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Quotation Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Quotation Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {!quotations || quotations.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No quotation requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {quotations.map((request: any) => (
                  <div key={request.id} className="p-4 border rounded-lg hover:shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-secondary">{request.hospitalName}</p>
                        <p className="text-sm text-gray-600">RFQ ID: {request.quotationNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="status-warning">
                          <Clock className="h-3 w-3 mr-1" />
                          Urgent
                        </Badge>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-secondary font-medium">Order #{request.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        Required by: {new Date(request.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            className="btn-primary flex-1"
                            onClick={() => handleQuoteClick(request)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Submit Quote
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Submit Quotation</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-neutral rounded-lg">
                              <h4 className="font-medium text-secondary mb-2">Request Details</h4>
                              <p className="text-sm text-gray-600">Hospital: {selectedQuotation?.hospitalName}</p>
                              <p className="text-sm text-gray-600">Order: {selectedQuotation?.orderNumber}</p>
                              <p className="text-sm text-gray-600">
                                Due Date: {selectedQuotation?.validUntil ? new Date(selectedQuotation.validUntil).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="totalAmount">Total Amount ($) *</Label>
                                <Input
                                  id="totalAmount"
                                  type="number"
                                  step="0.01"
                                  value={quotationForm.totalAmount}
                                  onChange={(e) => setQuotationForm(prev => ({ ...prev, totalAmount: e.target.value }))}
                                  placeholder="Enter total amount"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="validUntil">Valid Until *</Label>
                                <Input
                                  id="validUntil"
                                  type="date"
                                  value={quotationForm.validUntil}
                                  onChange={(e) => setQuotationForm(prev => ({ ...prev, validUntil: e.target.value }))}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="deliveryTerms">Delivery Terms</Label>
                              <Input
                                id="deliveryTerms"
                                value={quotationForm.deliveryTerms}
                                onChange={(e) => setQuotationForm(prev => ({ ...prev, deliveryTerms: e.target.value }))}
                                placeholder="Enter delivery terms"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="paymentTerms">Payment Terms</Label>
                              <Input
                                id="paymentTerms"
                                value={quotationForm.paymentTerms}
                                onChange={(e) => setQuotationForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                                placeholder="Enter payment terms"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="notes">Additional Notes</Label>
                              <Textarea
                                id="notes"
                                value={quotationForm.notes}
                                onChange={(e) => setQuotationForm(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Any additional information or special conditions"
                                rows={3}
                              />
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                className="btn-success flex-1"
                                onClick={handleSubmitQuotation}
                                disabled={submitQuotationMutation.isPending}
                              >
                                {submitQuotationMutation.isPending ? "Submitting..." : "Submit Quotation"}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={() => setSelectedQuotation(null)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  );
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import HospitalLayout from "@/components/hospital/layout";
import { Eye, Check, X, Building2, Calendar, FileText, Package } from "lucide-react";
import { useState } from "react";

export default function HospitalQuotations() {
  const { hospital } = useAuth();
  const { toast } = useToast();
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [isQuotationDetailOpen, setIsQuotationDetailOpen] = useState(false);

  // Fetch quotations for the hospital
  const { data: quotations = [], isLoading } = useQuery<any[]>({
    queryKey: [`/api/hospital/${hospital?.id}/quotations`],
    enabled: !!hospital?.id,
  });

  const acceptQuotationMutation = useMutation({
    mutationFn: async (quotationId: number) => {
      const response = await apiRequest('POST', `/api/hospital/quotations/${quotationId}/accept`, {
        deliveryAddress: hospital?.address,
        expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 1,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/hospital/${hospital?.id}/quotations`] });
      toast({
        title: "Quotation Accepted",
        description: "Purchase order has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to accept quotation",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'secondary';
      case 'accepted':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const pendingQuotations = quotations.filter((q: any) => q.status === 'submitted');
  const acceptedQuotations = quotations.filter((q: any) => q.status === 'accepted');
  const rejectedQuotations = quotations.filter((q: any) => q.status === 'rejected');

  if (isLoading) {
    return (
      <HospitalLayout>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-secondary">Quotations</h2>
            <p className="text-gray-600">Review and manage supplier quotations</p>
          </div>
          <div className="space-y-4">
            <div className="h-[100px] w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-[100px] w-full bg-gray-200 animate-pulse rounded" />
            <div className="h-[100px] w-full bg-gray-200 animate-pulse rounded" />
          </div>
        </div>
      </HospitalLayout>
    );
  }

  return (
    <HospitalLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Quotations</h2>
          <p className="text-gray-600">Review and manage supplier quotations</p>
        </div>

        <Tabs defaultValue="all-quotations" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-quotations">All ({quotations.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingQuotations.length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepted ({acceptedQuotations.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedQuotations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all-quotations" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">All Quotations</h3>
              <Badge variant="secondary">{quotations.length} quotations</Badge>
            </div>

            {quotations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotations</h3>
                  <p className="text-gray-600">You haven't received any quotations yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {quotations.map((quotation: any) => (
                  <Card 
                    key={quotation.id} 
                    className="card-gradient border-0 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => {
                      setSelectedQuotation(quotation);
                      setIsQuotationDetailOpen(true);
                    }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-secondary">
                            Quotation #{quotation.quotationNumber}
                          </CardTitle>
                          <p className="text-gray-600">Order #{quotation.orderNumber}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(quotation.status)}>
                            {quotation.status?.toUpperCase()}
                          </Badge>
                          <Eye className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Supplier</span>
                          <p className="font-medium">{quotation.supplierName}</p>
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
                      {quotation.status === 'submitted' && (
                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              acceptQuotationMutation.mutate(quotation.id);
                            }}
                            disabled={acceptQuotationMutation.isPending}
                            className="btn-primary"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle reject quotation
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-medium">Pending Quotations</h3>
              <Badge variant="secondary">{pendingQuotations.length} quotations</Badge>
            </div>

            {pendingQuotations.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Quotations</h3>
                  <p className="text-gray-600">All quotations have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingQuotations.map((quotation: any) => (
                  <Card 
                    key={quotation.id} 
                    className="border-orange-200 bg-orange-50 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedQuotation(quotation);
                      setIsQuotationDetailOpen(true);
                    }}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-orange-700">
                            Quotation #{quotation.quotationNumber}
                          </CardTitle>
                          <p className="text-gray-600">From {quotation.supplierName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">PENDING REVIEW</Badge>
                          <Eye className="h-4 w-4 text-gray-500" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Total Amount</span>
                          <p className="font-medium text-lg">₹{parseFloat(quotation.totalAmount || '0').toFixed(2)}</p>
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

          <TabsContent value="accepted" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Check className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-medium">Accepted Quotations</h3>
              <Badge variant="default">{acceptedQuotations.length} quotations</Badge>
            </div>

            <div className="space-y-4">
              {acceptedQuotations.map((quotation: any) => (
                <Card 
                  key={quotation.id} 
                  className="border-green-200 bg-green-50 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setSelectedQuotation(quotation);
                    setIsQuotationDetailOpen(true);
                  }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-green-700">
                          Quotation #{quotation.quotationNumber}
                        </CardTitle>
                        <p className="text-gray-600">From {quotation.supplierName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">ACCEPTED</Badge>
                        <Eye className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <X className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-medium">Rejected Quotations</h3>
              <Badge variant="destructive">{rejectedQuotations.length} quotations</Badge>
            </div>

            <div className="space-y-4">
              {rejectedQuotations.map((quotation: any) => (
                <Card 
                  key={quotation.id} 
                  className="border-red-200 bg-red-50 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setSelectedQuotation(quotation);
                    setIsQuotationDetailOpen(true);
                  }}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-red-700">
                          Quotation #{quotation.quotationNumber}
                        </CardTitle>
                        <p className="text-gray-600">From {quotation.supplierName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">REJECTED</Badge>
                        <Eye className="h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quotation Detail Dialog */}
        <Dialog open={isQuotationDetailOpen} onOpenChange={setIsQuotationDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Quotation Details - {selectedQuotation?.quotationNumber}</DialogTitle>
            </DialogHeader>
            
            {selectedQuotation && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <span className="text-sm text-gray-500">Order Number</span>
                    <p className="font-medium">{selectedQuotation.orderNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Supplier</span>
                    <p className="font-medium">{selectedQuotation.supplierName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge variant={getStatusColor(selectedQuotation.status)}>
                      {selectedQuotation.status?.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Valid Until</span>
                    <p className="font-medium">{new Date(selectedQuotation.validUntil).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Medicine Details</h3>
                  <div className="space-y-3">
                    {selectedQuotation.items?.map((item: any, index: number) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 border rounded-lg">
                        <div>
                          <span className="text-sm text-gray-500">Medicine</span>
                          <p className="font-medium">{item.medicineName}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Quantity</span>
                          <p className="font-medium">{item.quantity}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Unit Price</span>
                          <p className="font-medium">₹{parseFloat(item.unitPrice).toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Total Price</span>
                          <p className="font-medium">₹{parseFloat(item.totalPrice).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Delivery Terms</span>
                    <p className="font-medium">{selectedQuotation.deliveryTerms || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Payment Terms</span>
                    <p className="font-medium">{selectedQuotation.paymentTerms || 'Not specified'}</p>
                  </div>
                </div>

                {selectedQuotation.notes && (
                  <div>
                    <span className="text-sm text-gray-500">Notes</span>
                    <p className="font-medium">{selectedQuotation.notes}</p>
                  </div>
                )}

                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Amount</div>
                  <div className="text-2xl font-bold text-primary">
                    ₹{parseFloat(selectedQuotation.totalAmount || '0').toFixed(2)}
                  </div>
                </div>

                {selectedQuotation.status === 'submitted' && (
                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsQuotationDetailOpen(false)}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        acceptQuotationMutation.mutate(selectedQuotation.id);
                        setIsQuotationDetailOpen(false);
                      }}
                      disabled={acceptQuotationMutation.isPending}
                      className="btn-primary"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Accept Quotation
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </HospitalLayout>
  );
}
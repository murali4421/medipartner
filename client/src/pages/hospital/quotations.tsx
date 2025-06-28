import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import HospitalLayout from "@/components/hospital/layout";
import { Plus, Eye, Check, X } from "lucide-react";

export default function HospitalQuotations() {
  const { hospital } = useAuth();
  const { toast } = useToast();

  const { data: quotations, isLoading } = useQuery({
    queryKey: [`/api/hospital/${hospital?.id}/quotations`],
    enabled: !!hospital?.id,
  });

  const acceptQuotationMutation = useMutation({
    mutationFn: async (quotationId: number) => {
      const response = await apiRequest('POST', `/api/hospital/quotations/${quotationId}/accept`, {
        deliveryAddress: hospital?.address,
        expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 1, // This should be the current user ID
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
      case 'pending':
        return 'status-warning';
      case 'submitted':
        return 'status-primary';
      case 'accepted':
        return 'status-success';
      case 'rejected':
        return 'status-error';
      case 'expired':
        return 'bg-gray-500 text-white';
      default:
        return 'status-primary';
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
            <h2 className="text-2xl font-semibold text-secondary">Quotations</h2>
            <p className="text-gray-600">Review and manage supplier quotations</p>
          </div>
          <Button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Request Quotation
          </Button>
        </div>

        {/* Quotation Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {quotations?.filter((q: any) => q.status === 'pending').length || 0}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {quotations?.filter((q: any) => q.status === 'submitted').length || 0}
                </p>
                <p className="text-sm text-gray-600">Received</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {quotations?.filter((q: any) => q.status === 'accepted').length || 0}
                </p>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {quotations?.filter((q: any) => new Date(q.validUntil) < new Date()).length || 0}
                </p>
                <p className="text-sm text-gray-600">Expired</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quotations Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            {!quotations || quotations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No quotations found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.map((quotation: any) => {
                    const isExpired = new Date(quotation.validUntil) < new Date();
                    return (
                      <TableRow key={quotation.id}>
                        <TableCell className="font-medium text-primary">
                          {quotation.quotationNumber}
                        </TableCell>
                        <TableCell>{quotation.supplierName}</TableCell>
                        <TableCell className="font-medium">
                          {quotation.orderNumber}
                        </TableCell>
                        <TableCell className="font-medium text-success">
                          ${quotation.totalAmount?.toLocaleString() || '0.00'}
                        </TableCell>
                        <TableCell>
                          <div className={`${isExpired ? 'text-destructive' : ''}`}>
                            {new Date(quotation.validUntil).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(quotation.status)}>
                            {quotation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {quotation.status === 'submitted' && !isExpired && (
                              <>
                                <Button 
                                  size="sm" 
                                  className="btn-success"
                                  onClick={() => acceptQuotationMutation.mutate(quotation.id)}
                                  disabled={acceptQuotationMutation.isPending}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
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

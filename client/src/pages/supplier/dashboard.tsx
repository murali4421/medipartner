import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import SupplierLayout from "@/components/supplier/layout";
import { 
  DollarSign, 
  ShoppingCart, 
  FileText, 
  Hospital,
  TrendingUp,
  Clock,
  Plus,
  Eye
} from "lucide-react";

export default function SupplierDashboard() {
  const { supplier } = useAuth();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/supplier/${supplier?.id}/dashboard`],
    enabled: !!supplier?.id,
  });

  if (isLoading) {
    return (
      <SupplierLayout>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SupplierLayout>
    );
  }

  const stats = dashboardData?.stats || {};
  const pendingQuotations = dashboardData?.pendingQuotations || [];
  const purchaseOrders = dashboardData?.purchaseOrders || [];
  const inventory = dashboardData?.inventory || [];

  return (
    <SupplierLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold text-secondary mb-2">Supplier Dashboard</h2>
          <p className="text-gray-600">Manage your medicine supply and hospital orders</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-secondary">
                    ${stats.monthlyRevenue?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-success flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    18% from last month
                  </p>
                </div>
                <div className="bg-success/10 p-3 rounded-lg">
                  <DollarSign className="text-success h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-secondary">{stats.activeOrders || 0}</p>
                  <p className="text-sm text-warning flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    5 due today
                  </p>
                </div>
                <div className="bg-warning/10 p-3 rounded-lg">
                  <ShoppingCart className="text-warning h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Quotations</p>
                  <p className="text-2xl font-bold text-secondary">{stats.pendingQuotations || 0}</p>
                  <p className="text-sm text-primary flex items-center">
                    <FileText className="h-4 w-4 mr-1" />
                    Awaiting response
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <FileText className="text-primary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hospital Partners</p>
                  <p className="text-2xl font-bold text-secondary">{stats.hospitalPartners || 0}</p>
                  <p className="text-sm text-success flex items-center">
                    <Hospital className="h-4 w-4 mr-1" />
                    2 new this month
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Hospital className="text-primary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Quotation Requests */}
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className="text-lg font-semibold text-secondary">Quotation Requests</h3>
                <p className="text-sm text-gray-600">RFQs from hospitals requiring response</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingQuotations.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No pending quotation requests</p>
                ) : (
                  pendingQuotations.map((request: any) => (
                    <div key={request.id} className="p-4 border rounded-lg hover:shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-secondary">{request.hospitalName}</p>
                          <p className="text-sm text-gray-600">RFQ ID: {request.quotationNumber}</p>
                        </div>
                        <Badge className="status-warning">Urgent</Badge>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-secondary font-medium">Order #{request.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          Required by: {new Date(request.validUntil).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="btn-primary flex-1">
                          Submit Quote
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Purchase Orders */}
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className="text-lg font-semibold text-secondary">Recent Purchase Orders</h3>
                <p className="text-sm text-gray-600">Orders received from hospitals</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchaseOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No recent purchase orders</p>
                ) : (
                  purchaseOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border-l-4 border-success bg-success/5 rounded-r-lg">
                      <div>
                        <p className="font-medium text-secondary">PO #{order.poNumber}</p>
                        <p className="text-sm text-gray-600">
                          Value: ${order.totalAmount?.toLocaleString() || '0'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Due: {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="status-success block mb-2">{order.status}</Badge>
                        <Button size="sm" className="btn-primary">
                          Schedule Delivery
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medicine Catalog Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-secondary">Medicine Catalog</h3>
                <p className="text-sm text-gray-600">Your available medicine inventory for hospitals</p>
              </div>
              <Button className="btn-success">
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inventory.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No inventory items</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medicine</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.slice(0, 5).map((medicine: any) => (
                    <TableRow key={medicine.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-secondary">{medicine.medicineName}</p>
                          <p className="text-sm text-gray-600">{medicine.genericName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{medicine.brand}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${medicine.availableStock < 1000 ? 'text-warning' : 'text-secondary'}`}>
                          {medicine.availableStock?.toLocaleString() || 0} units
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-success">
                        ${medicine.unitPrice || '0.00'}
                      </TableCell>
                      <TableCell>
                        <Badge className={medicine.isActive ? "status-success" : "status-error"}>
                          {medicine.isActive ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="btn-primary">
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  );
}

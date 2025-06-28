import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import SupplierLayout from "@/components/supplier/layout";
import { Truck, Eye, Package, Check, Clock, AlertCircle } from "lucide-react";

export default function SupplierOrders() {
  const { supplier } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: [`/api/supplier/${supplier?.id}/orders`],
    enabled: !!supplier?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'created':
      case 'new':
        return 'status-primary';
      case 'confirmed':
        return 'status-success';
      case 'in_progress':
      case 'preparing':
        return 'status-warning';
      case 'shipped':
      case 'in_transit':
        return 'bg-blue-500 text-white';
      case 'delivered':
      case 'completed':
        return 'status-success';
      case 'cancelled':
        return 'status-error';
      default:
        return 'status-primary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'created':
      case 'new':
        return <AlertCircle className="h-4 w-4" />;
      case 'confirmed':
        return <Check className="h-4 w-4" />;
      case 'in_progress':
      case 'preparing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
      case 'completed':
        return <Check className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
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
        <div>
          <h2 className="text-2xl font-semibold text-secondary">Purchase Orders</h2>
          <p className="text-gray-600">Manage orders received from hospitals</p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {orders?.filter((o: any) => ['created', 'new'].includes(o.status)).length || 0}
                </p>
                <p className="text-sm text-gray-600">New Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {orders?.filter((o: any) => o.status === 'confirmed').length || 0}
                </p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">
                  {orders?.filter((o: any) => ['in_progress', 'preparing'].includes(o.status)).length || 0}
                </p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {orders?.filter((o: any) => ['shipped', 'in_transit'].includes(o.status)).length || 0}
                </p>
                <p className="text-sm text-gray-600">Shipped</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {orders?.filter((o: any) => ['delivered', 'completed'].includes(o.status)).length || 0}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {!orders || orders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No purchase orders found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Expected Delivery</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-primary">
                        {order.poNumber}
                      </TableCell>
                      <TableCell>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {order.expectedDeliveryDate 
                          ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                          : 'TBD'
                        }
                      </TableCell>
                      <TableCell className="font-medium text-success">
                        ${order.totalAmount?.toLocaleString() || '0.00'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {order.deliveryAddress}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === 'created' && (
                            <Button size="sm" className="btn-success">
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button size="sm" className="btn-primary">
                              <Package className="h-4 w-4 mr-1" />
                              Prepare
                            </Button>
                          )}
                          {order.status === 'in_progress' && (
                            <Button size="sm" className="btn-primary">
                              <Truck className="h-4 w-4 mr-1" />
                              Ship
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Order Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders?.filter((o: any) => 
                  o.expectedDeliveryDate && 
                  new Date(o.expectedDeliveryDate).toDateString() === new Date().toDateString()
                ).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No deliveries scheduled for today</p>
                ) : (
                  orders?.filter((o: any) => 
                    o.expectedDeliveryDate && 
                    new Date(o.expectedDeliveryDate).toDateString() === new Date().toDateString()
                  ).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-secondary">PO #{order.poNumber}</p>
                        <p className="text-sm text-gray-600">
                          Amount: ${order.totalAmount?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Urgent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Urgent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders?.filter((o: any) => 
                  o.expectedDeliveryDate && 
                  new Date(o.expectedDeliveryDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) &&
                  !['delivered', 'completed', 'cancelled'].includes(o.status)
                ).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No urgent orders</p>
                ) : (
                  orders?.filter((o: any) => 
                    o.expectedDeliveryDate && 
                    new Date(o.expectedDeliveryDate) <= new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) &&
                    !['delivered', 'completed', 'cancelled'].includes(o.status)
                  ).map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border-l-4 border-destructive bg-destructive/5 rounded-r-lg">
                      <div>
                        <p className="font-medium text-secondary">PO #{order.poNumber}</p>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="status-error">Urgent</Badge>
                        <Button size="sm" className="btn-primary mt-2">
                          Priority Handle
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SupplierLayout>
  );
}

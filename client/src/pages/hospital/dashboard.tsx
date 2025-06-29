import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import HospitalLayout from "@/components/hospital/layout";
import { 
  Warehouse, 
  ShoppingCart, 
  AlertTriangle, 
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  Plus
} from "lucide-react";

export default function HospitalDashboard() {
  const { hospital } = useAuth();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: [`/api/hospital/${hospital?.id}/dashboard`],
    enabled: !!hospital?.id,
  });

  if (isLoading) {
    return (
      <HospitalLayout>
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
      </HospitalLayout>
    );
  }

  const stats = dashboardData?.stats || {};
  const lowStockItems = dashboardData?.lowStockItems || [];
  const recentOrders = dashboardData?.recentOrders || [];
  const quotations = dashboardData?.quotations || [];

  return (
    <HospitalLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl lg:text-2xl font-semibold text-secondary mb-2">Hospital Dashboard</h2>
          <p className="text-sm lg:text-base text-gray-600">Overview of your medicine supply and ordering system</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-secondary">
                    ${stats.inventoryValue?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-success flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    12% from last month
                  </p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Warehouse className="text-primary h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                  <p className="text-2xl font-bold text-secondary">{stats.pendingOrders || 0}</p>
                  <p className="text-sm text-warning flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    8 urgent
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
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-secondary">{stats.lowStockItems || 0}</p>
                  <p className="text-sm text-destructive flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Requires attention
                  </p>
                </div>
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <AlertTriangle className="text-destructive h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="metric-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Spending</p>
                  <p className="text-2xl font-bold text-secondary">
                    ${stats.monthlySpending?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-success flex items-center">
                    <ArrowDown className="h-4 w-4 mr-1" />
                    5% savings
                  </p>
                </div>
                <div className="bg-success/10 p-3 rounded-lg">
                  <DollarSign className="text-success h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-secondary">Low Stock Alerts</h3>
                  <p className="text-sm text-gray-600">Medicines requiring immediate reorder</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No low stock items</p>
                ) : (
                  lowStockItems.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border-l-4 border-destructive">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center mr-3">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary">{item.medicineName}</p>
                          <p className="text-sm text-gray-600">
                            Current: {item.currentStock} units | Min: {item.reorderPoint}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" className="btn-primary">
                        Auto Reorder
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>
                <h3 className="text-lg font-semibold text-secondary">Recent Orders</h3>
                <p className="text-sm text-gray-600">Latest procurement activities</p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No recent orders</p>
                ) : (
                  recentOrders.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border-l-4 border-success bg-success/5 rounded-r-lg">
                      <div>
                        <p className="font-medium text-secondary">Order #{order.orderNumber}</p>
                        <p className="text-sm text-gray-600">
                          Value: ${order.totalAmount?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <Badge className="status-success">{order.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Quotations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-secondary">Quotation Responses</h3>
                <p className="text-sm text-gray-600">Review and compare supplier quotations</p>
              </div>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Request Quote
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {quotations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No quotations available</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation ID</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotations.map((quote: any) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium text-primary">
                        {quote.quotationNumber}
                      </TableCell>
                      <TableCell>{quote.supplierName}</TableCell>
                      <TableCell className="font-medium text-success">
                        ${quote.totalAmount?.toLocaleString() || '0'}
                      </TableCell>
                      <TableCell>
                        <Badge className="status-warning">{quote.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Compare</Button>
                          <Button size="sm" className="btn-success">Accept</Button>
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
    </HospitalLayout>
  );
}

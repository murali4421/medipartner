import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Bell, 
  BarChart3, 
  Package, 
  FileText, 
  ShoppingCart, 
  Warehouse, 
  TrendingUp, 
  Hospital, 
  Settings,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface SupplierLayoutProps {
  children: ReactNode;
}

export default function SupplierLayout({ children }: SupplierLayoutProps) {
  const { user, supplier, logout } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/supplier/dashboard', icon: BarChart3 },
    { name: 'Medicine Catalog', href: '/supplier/catalog', icon: Package },
    { name: 'Quotations', href: '/supplier/quotations', icon: FileText },
    { name: 'Purchase Orders', href: '/supplier/orders', icon: ShoppingCart },
    { name: 'Deliveries', href: '/supplier/deliveries', icon: Truck },
    { name: 'Inventory', href: '/supplier/inventory', icon: Warehouse },
    { name: 'Reports', href: '/supplier/reports', icon: TrendingUp },
    { name: 'Hospitals', href: '/supplier/hospitals', icon: Hospital },
    { name: 'Settings', href: '/supplier/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-gray-50 to-green-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-green-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 mr-4 shadow-lg">
              <Truck className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Medi Partner</h1>
              <p className="text-sm text-gray-600 font-medium">Supplier Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative hover:bg-green-50 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                5
              </span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-bold">
                  {supplier?.name?.[0]}{supplier?.name?.[1]}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{supplier?.name}</p>
                <p className="text-xs text-green-600 font-medium capitalize">{user?.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} className="hover:bg-red-50 hover:text-red-600 transition-colors">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white/80 backdrop-blur-md shadow-xl border-r border-green-100 min-h-screen">
          <div className="p-6">
            <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <h2 className="text-lg font-bold text-gray-800">{supplier?.name}</h2>
              <p className="text-sm text-green-600 font-medium">{supplier?.city}, {supplier?.state}</p>
            </div>
            <ul className="space-y-3">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <a className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive 
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105" 
                          : "text-gray-700 hover:bg-green-50 hover:text-green-700 hover:translate-x-1"
                      }`}>
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

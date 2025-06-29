import { ReactNode, useState } from "react";
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
  LogOut,
  Menu,
  X,
  PillBottle
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface SupplierLayoutProps {
  children: ReactNode;
}

export default function SupplierLayout({ children }: SupplierLayoutProps) {
  const { user, supplier, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/supplier/dashboard', icon: BarChart3 },
    { name: 'Medicine Catalog', href: '/supplier/catalog', icon: Package },
    { name: 'Medicine Master', href: '/supplier/medicine-master', icon: PillBottle },
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
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-3 hover:bg-green-50"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-2 lg:p-3 mr-2 lg:mr-4 shadow-lg">
              <Truck className="text-white text-lg lg:text-xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Medi Partner</h1>
              <p className="text-xs lg:text-sm text-gray-600 font-medium">Supplier Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-4">
            <Button variant="ghost" size="sm" className="relative hover:bg-green-50 transition-colors">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                5
              </span>
            </Button>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs lg:text-sm font-bold">
                  {supplier?.name?.[0]}{supplier?.name?.[1]}
                </span>
              </div>
              <div className="text-right hidden sm:block">
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

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <nav className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md shadow-xl border-r border-green-100 transition-transform duration-300 ease-in-out lg:transition-none`}>
          <div className="p-4 lg:p-6 pt-20 lg:pt-6">
            <div className="mb-6 lg:mb-8 p-3 lg:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
              <h2 className="text-base lg:text-lg font-bold text-gray-800">{supplier?.name}</h2>
              <p className="text-xs lg:text-sm text-green-600 font-medium">{supplier?.city}, {supplier?.state}</p>
            </div>
            <ul className="space-y-2 lg:space-y-3">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className={`flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive 
                          ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105" 
                          : "text-gray-700 hover:bg-green-50 hover:text-green-700 hover:translate-x-1"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-4 w-4 lg:h-5 lg:w-5" />
                      <span className="text-sm lg:text-base">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 lg:ml-0">
          {children}
        </main>
      </div>
    </div>
  );
}

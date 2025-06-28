import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Hospital, 
  Bell, 
  BarChart3, 
  PillBottle, 
  ShoppingCart, 
  FileText, 
  Truck, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Settings,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "wouter";

interface HospitalLayoutProps {
  children: ReactNode;
}

export default function HospitalLayout({ children }: HospitalLayoutProps) {
  const { user, hospital, logout } = useAuth();
  const [location] = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/hospital/dashboard', icon: BarChart3 },
    { name: 'Inventory', href: '/hospital/inventory', icon: PillBottle },
    { name: 'Orders', href: '/hospital/orders', icon: ShoppingCart },
    { name: 'Quotations', href: '/hospital/quotations', icon: FileText },
    { name: 'Deliveries', href: '/hospital/deliveries', icon: Truck },
    { name: 'Payments', href: '/hospital/payments', icon: CreditCard },
    { name: 'Reports', href: '/hospital/reports', icon: TrendingUp },
    { name: 'Suppliers', href: '/hospital/suppliers', icon: Users },
    { name: 'Settings', href: '/hospital/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-neutral">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center">
            <div className="bg-primary rounded-lg p-2 mr-3">
              <Hospital className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-secondary">Medi Partner</h1>
              <p className="text-sm text-gray-500">Hospital Management System</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-secondary">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-secondary">{hospital?.name}</h2>
              <p className="text-sm text-gray-500">{hospital?.city}, {hospital?.state}</p>
            </div>
            <ul className="space-y-2">
              {navigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <li key={item.name}>
                    <Link href={item.href}>
                      <a className={isActive ? 'sidebar-link-active' : 'sidebar-link'}>
                        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
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

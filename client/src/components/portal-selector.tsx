import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hospital, Truck } from "lucide-react";
import { useLocation } from "wouter";

export default function PortalSelector() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-4">Medi Partner</h1>
          <p className="text-lg text-gray-600">Medicine Supply Chain Management System</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Hospital Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/hospital/login")}>
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Hospital className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-secondary mb-4">Hospital Portal</h2>
              <p className="text-gray-600 mb-6">
                Manage your medicine inventory, place orders, track deliveries, and handle procurement efficiently.
              </p>
              <Button className="btn-primary w-full">
                <Hospital className="w-4 h-4 mr-2" />
                Access Hospital Portal
              </Button>
            </CardContent>
          </Card>

          {/* Supplier Portal */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setLocation("/supplier/login")}>
            <CardContent className="p-8 text-center">
              <div className="bg-success/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-semibold text-secondary mb-4">Supplier Portal</h2>
              <p className="text-gray-600 mb-6">
                Manage your medicine catalog, respond to quotations, fulfill orders, and track your business.
              </p>
              <Button className="btn-success w-full">
                <Truck className="w-4 h-4 mr-2" />
                Access Supplier Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

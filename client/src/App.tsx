import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./hooks/use-auth";
import NotFound from "@/pages/not-found";
import PortalSelector from "@/components/portal-selector";

// Hospital Pages
import HospitalLogin from "@/pages/hospital/login";
import HospitalDashboard from "@/pages/hospital/dashboard";
import HospitalInventory from "@/pages/hospital/inventory";
import HospitalMedicineMaster from "@/pages/hospital/medicine-master";
import HospitalOrders from "@/pages/hospital/orders";
import HospitalQuotations from "@/pages/hospital/quotations";
import HospitalSuppliers from "@/pages/hospital/suppliers";
import HospitalSettlements from "@/pages/hospital/settlements";

// Supplier Pages
import SupplierLogin from "@/pages/supplier/login";
import SupplierDashboard from "@/pages/supplier/dashboard";
import SupplierCatalog from "@/pages/supplier/catalog";
import SupplierMedicineMaster from "@/pages/supplier/medicine-master";
import SupplierQuotations from "@/pages/supplier/quotations";
import SupplierOrders from "@/pages/supplier/orders";
import SupplierHospitals from "@/pages/supplier/hospitals";

function Router() {
  return (
    <Switch>
      {/* Hospital Routes */}
      <Route path="/hospital/login" component={HospitalLogin} />
      <Route path="/hospital/dashboard" component={HospitalDashboard} />
      <Route path="/hospital/inventory" component={HospitalInventory} />
      <Route path="/hospital/medicine-master" component={HospitalMedicineMaster} />
      <Route path="/hospital/orders" component={HospitalOrders} />
      <Route path="/hospital/quotations" component={HospitalQuotations} />
      <Route path="/hospital/suppliers" component={HospitalSuppliers} />
      <Route path="/hospital/settlements" component={HospitalSettlements} />
      
      {/* Supplier Routes */}
      <Route path="/supplier/login" component={SupplierLogin} />
      <Route path="/supplier/dashboard" component={SupplierDashboard} />
      <Route path="/supplier/catalog" component={SupplierCatalog} />
      <Route path="/supplier/medicine-master" component={SupplierMedicineMaster} />
      <Route path="/supplier/quotations" component={SupplierQuotations} />
      <Route path="/supplier/orders" component={SupplierOrders} />
      <Route path="/supplier/hospitals" component={SupplierHospitals} />
      
      {/* Default Route */}
      <Route path="/" component={PortalSelector} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

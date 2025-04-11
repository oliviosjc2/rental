import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard/Dashboard";
import CustomerList from "@/pages/customers/CustomerList";
import CustomerForm from "@/pages/customers/CustomerForm";
import ContactList from "@/pages/contacts/ContactList";
import ContactForm from "@/pages/contacts/ContactForm";
import EquipmentList from "@/pages/equipment/EquipmentList";
import EquipmentForm from "@/pages/equipment/EquipmentForm";
import CategoryList from "@/pages/categories/CategoryList";
import CategoryForm from "@/pages/categories/CategoryForm";
import BrandList from "@/pages/brands/BrandList";
import BrandForm from "@/pages/brands/BrandForm";
import MaintenanceList from "@/pages/maintenance/MaintenanceList";
import MaintenanceForm from "@/pages/maintenance/MaintenanceForm";
import RentalList from "@/pages/rentals/RentalList";
import RentalForm from "@/pages/rentals/RentalForm";
import RentalHistory from "@/pages/rentals/RentalHistory";

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Dashboard */}
        <Route path="/" component={Dashboard} />
        
        {/* Customers */}
        <Route path="/customers" component={CustomerList} />
        <Route path="/customers/new" component={CustomerForm} />
        <Route path="/customers/:id" component={CustomerForm} />
        
        {/* Contacts */}
        <Route path="/contacts" component={ContactList} />
        <Route path="/contacts/new" component={ContactForm} />
        <Route path="/contacts/:id" component={ContactForm} />
        
        {/* Equipment */}
        <Route path="/equipment" component={EquipmentList} />
        <Route path="/equipment/new" component={EquipmentForm} />
        <Route path="/equipment/:id" component={EquipmentForm} />
        
        {/* Categories */}
        <Route path="/categories" component={CategoryList} />
        <Route path="/categories/new" component={CategoryForm} />
        <Route path="/categories/:id" component={CategoryForm} />
        
        {/* Brands */}
        <Route path="/brands" component={BrandList} />
        <Route path="/brands/new" component={BrandForm} />
        <Route path="/brands/:id" component={BrandForm} />
        
        {/* Maintenance */}
        <Route path="/maintenance" component={MaintenanceList} />
        <Route path="/maintenance/new" component={MaintenanceForm} />
        <Route path="/maintenance/:id" component={MaintenanceForm} />
        
        {/* Rentals */}
        <Route path="/rentals" component={RentalList} />
        <Route path="/rentals/new" component={RentalForm} />
        <Route path="/rentals/:id" component={RentalForm} />
        <Route path="/rentals/history" component={RentalHistory} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

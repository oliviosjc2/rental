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
import LandingPage from "@/pages/landing/LandingPage";

function Router() {
  return (
    <Switch>
      {/* Landing page */}
      <Route path="/" component={LandingPage} />
      
      {/* App routes wrapped in Layout */}
      <Route path="/dashboard">
        {() => (
          <Layout>
            <Dashboard />
          </Layout>
        )}
      </Route>
      
      {/* Customers */}
      <Route path="/customers">
        {() => (
          <Layout>
            <CustomerList />
          </Layout>
        )}
      </Route>
      <Route path="/customers/new">
        {() => (
          <Layout>
            <CustomerForm />
          </Layout>
        )}
      </Route>
      <Route path="/customers/:id">
        {(params) => (
          <Layout>
            <CustomerForm />
          </Layout>
        )}
      </Route>
      
      {/* Contacts */}
      <Route path="/contacts">
        {() => (
          <Layout>
            <ContactList />
          </Layout>
        )}
      </Route>
      <Route path="/contacts/new">
        {() => (
          <Layout>
            <ContactForm />
          </Layout>
        )}
      </Route>
      <Route path="/contacts/:id">
        {() => (
          <Layout>
            <ContactForm />
          </Layout>
        )}
      </Route>
      
      {/* Equipment */}
      <Route path="/equipment">
        {() => (
          <Layout>
            <EquipmentList />
          </Layout>
        )}
      </Route>
      <Route path="/equipment/new">
        {() => (
          <Layout>
            <EquipmentForm />
          </Layout>
        )}
      </Route>
      <Route path="/equipment/:id">
        {() => (
          <Layout>
            <EquipmentForm />
          </Layout>
        )}
      </Route>
      
      {/* Categories */}
      <Route path="/categories">
        {() => (
          <Layout>
            <CategoryList />
          </Layout>
        )}
      </Route>
      <Route path="/categories/new">
        {() => (
          <Layout>
            <CategoryForm />
          </Layout>
        )}
      </Route>
      <Route path="/categories/:id">
        {() => (
          <Layout>
            <CategoryForm />
          </Layout>
        )}
      </Route>
      
      {/* Brands */}
      <Route path="/brands">
        {() => (
          <Layout>
            <BrandList />
          </Layout>
        )}
      </Route>
      <Route path="/brands/new">
        {() => (
          <Layout>
            <BrandForm />
          </Layout>
        )}
      </Route>
      <Route path="/brands/:id">
        {() => (
          <Layout>
            <BrandForm />
          </Layout>
        )}
      </Route>
      
      {/* Maintenance */}
      <Route path="/maintenance">
        {() => (
          <Layout>
            <MaintenanceList />
          </Layout>
        )}
      </Route>
      <Route path="/maintenance/new">
        {() => (
          <Layout>
            <MaintenanceForm />
          </Layout>
        )}
      </Route>
      <Route path="/maintenance/:id">
        {() => (
          <Layout>
            <MaintenanceForm />
          </Layout>
        )}
      </Route>
      
      {/* Rentals */}
      <Route path="/rentals">
        {() => (
          <Layout>
            <RentalList />
          </Layout>
        )}
      </Route>
      <Route path="/rentals/new">
        {() => (
          <Layout>
            <RentalForm />
          </Layout>
        )}
      </Route>
      <Route path="/rentals/history">
        {() => (
          <Layout>
            <RentalHistory />
          </Layout>
        )}
      </Route>
      <Route path="/rentals/:id">
        {() => (
          <Layout>
            <RentalForm />
          </Layout>
        )}
      </Route>
      
      {/* Fallback to 404 */}
      <Route>
        {() => (
          <Layout>
            <NotFound />
          </Layout>
        )}
      </Route>
    </Switch>
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

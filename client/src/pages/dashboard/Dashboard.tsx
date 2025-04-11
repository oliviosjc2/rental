import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/StatCard";
import RecentRentals from "@/components/dashboard/RecentRentals";
import MaintenanceAlerts from "@/components/dashboard/MaintenanceAlerts";
import EquipmentAvailability from "@/components/dashboard/EquipmentAvailability";

// Dashboard statistics interface
interface DashboardStats {
  activeRentals: number;
  availableEquipment: number;
  pendingMaintenance: number;
  activeCustomers: number;
}

const Dashboard = () => {
  // Fetch dashboard statistics
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
          <div>
            <Link href="/rentals/new">
              <Button className="inline-flex items-center">
                <i className="ri-add-line mr-2"></i> New Rental
              </Button>
            </Link>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">Overview of your equipment rental business</p>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Active Rentals"
          value={isLoading ? 0 : stats?.activeRentals || 0}
          icon="ri-calendar-check-line"
          iconColor="text-primary"
          iconBgColor="bg-blue-100"
          change={12}
        />
        
        <StatCard
          title="Available Equipment"
          value={isLoading ? 0 : stats?.availableEquipment || 0}
          icon="ri-tools-line"
          iconColor="text-green-700"
          iconBgColor="bg-green-100"
          change={-3}
        />
        
        <StatCard
          title="Pending Maintenance"
          value={isLoading ? 0 : stats?.pendingMaintenance || 0}
          icon="ri-service-line"
          iconColor="text-amber-700"
          iconBgColor="bg-amber-100"
          change={-8}
        />
        
        <StatCard
          title="Active Customers"
          value={isLoading ? 0 : stats?.activeCustomers || 0}
          icon="ri-building-line"
          iconColor="text-purple-700"
          iconBgColor="bg-purple-100"
          change={15}
        />
      </div>
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentRentals />
        </div>
        
        <div className="space-y-6">
          <MaintenanceAlerts />
          <EquipmentAvailability />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

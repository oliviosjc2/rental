import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Maintenance, Equipment } from "@shared/schema";
import { format } from "date-fns";

const MaintenanceAlerts = () => {
  // Fetch pending maintenance
  const { data: maintenanceData, isLoading } = useQuery<Maintenance[]>({
    queryKey: ['/api/maintenance', { pending: true }],
  });
  
  // Fetch equipment for names
  const { data: equipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  // Sort maintenance by scheduled date
  const sortedMaintenance = maintenanceData
    ?.map(maintenance => {
      const equip = equipment?.find(e => e.id === maintenance.equipmentId);
      return {
        ...maintenance,
        equipmentName: equip?.name,
        equipmentCode: equip?.serialNumber ? `${equip.name?.substring(0, 3).toUpperCase() || 'EQP'}-${equip.serialNumber}` : 'Unknown',
      };
    })
    .sort((a, b) => {
      if (!a.scheduledDate) return 1;
      if (!b.scheduledDate) return -1;
      return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
    })
    .slice(0, 3) || [];
  
  // Function to determine status color
  const getStatusColor = (maintenance: Maintenance) => {
    if (!maintenance.scheduledDate) return "bg-neutral-dark";
    
    const today = new Date();
    const scheduled = new Date(maintenance.scheduledDate);
    const daysUntil = Math.floor((scheduled.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return "bg-destructive"; // Overdue
    if (daysUntil <= 3) return "bg-status-error"; // Due soon
    if (daysUntil <= 7) return "bg-status-warning"; // Upcoming
    return "bg-neutral-dark"; // Future
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-neutral-light px-5 py-4">
        <CardTitle className="text-lg font-medium">Maintenance Alerts</CardTitle>
      </CardHeader>
      
      <CardContent className="p-5">
        {isLoading ? (
          <div className="py-3 text-center text-neutral-dark">Loading maintenance alerts...</div>
        ) : sortedMaintenance.length === 0 ? (
          <div className="py-3 text-center text-neutral-dark">No pending maintenance</div>
        ) : (
          <ul className="divide-y divide-neutral-light">
            {sortedMaintenance.map((item) => (
              <li key={item.id} className="py-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor(item)}`}></span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {item.equipmentCode} {item.description}
                    </p>
                    <p className="text-xs text-neutral-dark mt-1">
                      Scheduled: {item.scheduledDate 
                        ? format(new Date(item.scheduledDate), 'MMM dd, yyyy') 
                        : 'Not scheduled'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-neutral-light px-5 py-3">
        <Link href="/maintenance">
          <a className="text-sm text-primary hover:text-primary-dark font-medium flex items-center">
            View maintenance schedule
            <i className="ri-arrow-right-line ml-1"></i>
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MaintenanceAlerts;

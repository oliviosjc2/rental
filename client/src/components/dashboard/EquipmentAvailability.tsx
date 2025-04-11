import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface EquipmentAvailabilityData {
  categoryName: string;
  available: number;
  total: number;
}

const EquipmentAvailability = () => {
  // Fetch equipment availability data
  const { data, isLoading } = useQuery<EquipmentAvailabilityData[]>({
    queryKey: ['/api/dashboard/equipment-availability'],
  });

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-neutral-light px-5 py-4">
        <CardTitle className="text-lg font-medium">Equipment Availability</CardTitle>
      </CardHeader>
      
      <CardContent className="p-5">
        {isLoading ? (
          <div className="py-3 text-center text-neutral-dark">Loading availability data...</div>
        ) : !data || data.length === 0 ? (
          <div className="py-3 text-center text-neutral-dark">No equipment categories found</div>
        ) : (
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium">{item.categoryName}</div>
                  <div className="text-sm text-neutral-dark">{item.available}/{item.total}</div>
                </div>
                <div className="w-full bg-neutral-light rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${item.total > 0 ? (item.available / item.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-neutral-light px-5 py-3">
        <Link href="/equipment">
          <div className="text-sm text-primary hover:text-primary-dark font-medium flex items-center cursor-pointer">
            View all equipment
            <i className="ri-arrow-right-line ml-1"></i>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EquipmentAvailability;

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Rental } from "@shared/schema";
import { format } from "date-fns";

interface EnrichedRental extends Rental {
  customerName?: string;
  equipmentName?: string;
  equipmentCode?: string;
}

const RecentRentals = () => {
  // Fetch active rentals
  const { data: rentals, isLoading } = useQuery<Rental[]>({
    queryKey: ['/api/rentals'],
  });
  
  // Fetch customers for names
  const { data: customers } = useQuery({
    queryKey: ['/api/customers'],
  });
  
  // Fetch equipment for names
  const { data: equipment } = useQuery({
    queryKey: ['/api/equipment'],
  });
  
  // Enrich rental data with customer and equipment names
  const enrichedRentals: EnrichedRental[] = rentals?.map(rental => {
    const customer = customers?.find(c => c.id === rental.customerId);
    const equip = equipment?.find(e => e.id === rental.equipmentId);
    
    return {
      ...rental,
      customerName: customer?.name,
      equipmentName: equip?.name,
      equipmentCode: equip?.serialNumber ? `${equip.model?.substring(0, 3) || 'EQP'}-${equip.serialNumber}` : undefined
    };
  }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()) || [];
  
  // Only show the 5 most recent rentals
  const recentRentals = enrichedRentals.slice(0, 5);
  
  // Function to determine status class
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  const getStatusDisplay = (rental: EnrichedRental) => {
    if (rental.status === 'active') {
      const today = new Date();
      const endDate = new Date(rental.endDate);
      
      // If end date is today
      if (today.toDateString() === endDate.toDateString()) {
        return { text: 'Due Today', classes: 'bg-yellow-100 text-yellow-800' };
      }
      
      // If end date is in the past
      if (today > endDate) {
        return { text: 'Overdue', classes: 'bg-red-100 text-red-800' };
      }
    }
    
    return { 
      text: rental.status === 'active' ? 'Active' : 
            rental.status === 'completed' ? 'Returned' : 
            rental.status, 
      classes: getStatusClasses(rental.status)
    };
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-neutral-light px-5 py-4">
        <CardTitle className="text-lg font-medium">Recent Rentals</CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full divide-y divide-neutral-light">
          <thead>
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Equipment</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Start Date</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">End Date</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-light">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-4 text-center">Loading rentals...</td>
              </tr>
            ) : recentRentals.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-4 text-center">No rentals found</td>
              </tr>
            ) : (
              recentRentals.map((rental) => {
                const status = getStatusDisplay(rental);
                
                return (
                  <tr key={rental.id} className="hover:bg-neutral-lightest">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{rental.customerName || 'Unknown Customer'}</div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{rental.equipmentName || 'Unknown Equipment'}</div>
                      <div className="text-xs text-neutral-dark">{rental.equipmentCode || 'No ID'}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(rental.startDate), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(rental.endDate), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.classes}`}>
                        {status.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <CardFooter className="border-t border-neutral-light px-5 py-3">
        <Link href="/rentals">
          <div className="text-sm text-primary hover:text-primary-dark font-medium flex items-center cursor-pointer">
            View all rentals
            <i className="ri-arrow-right-line ml-1"></i>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentRentals;

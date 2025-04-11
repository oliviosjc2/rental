import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, isWithinInterval } from "date-fns";
import type { Rental, Customer, Equipment } from "@shared/schema";
import { cn } from "@/lib/utils";

const RentalHistory = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  // Fetch completed rentals, customers, and equipment
  const { data: rentals, isLoading } = useQuery<Rental[]>({
    queryKey: ['/api/rentals'],
  });
  
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });
  
  const { data: equipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  // Filter to show only completed rentals
  const completedRentals = rentals?.filter(rental => rental.status === 'completed') || [];
  
  // Further filter rentals based on search query, customer filter, and date range
  const filteredRentals = completedRentals.filter(rental => {
    const customer = customers?.find(c => c.id === rental.customerId);
    const equipmentItem = equipment?.find(e => e.id === rental.equipmentId);
    
    // Search query filter
    const matchesSearch = 
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipmentItem?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipmentItem?.serialNumber?.includes(searchQuery);
    
    // Customer filter
    const matchesCustomer = customerFilter === "all" || 
      rental.customerId.toString() === customerFilter;
    
    // Date filter
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const rentalDate = new Date(rental.returnDate || rental.endDate);
      matchesDateRange = isWithinInterval(rentalDate, {
        start: dateRange.from,
        end: dateRange.to
      });
    }
    
    return matchesSearch && matchesCustomer && matchesDateRange;
  }).sort((a, b) => {
    // Sort by return date, with most recent first
    const aDate = new Date(a.returnDate || a.endDate);
    const bDate = new Date(b.returnDate || b.endDate);
    return bDate.getTime() - aDate.getTime();
  });
  
  // Get customer and equipment names
  const getCustomerName = (customerId: number) => {
    const customer = customers?.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };
  
  const getEquipmentDetails = (equipmentId: number) => {
    const equipmentItem = equipment?.find(e => e.id === equipmentId);
    return {
      name: equipmentItem?.name || 'Unknown Equipment',
      code: equipmentItem?.serialNumber ? 
        `${equipmentItem.model?.substring(0, 3) || 'EQP'}-${equipmentItem.serialNumber}` : 
        'No ID'
    };
  };
  
  // Calculate rental duration and total cost
  const calculateRentalDetails = (rental: Rental) => {
    const startDate = new Date(rental.startDate);
    const endDate = new Date(rental.returnDate || rental.endDate);
    
    // Duration in days (rounded up)
    const durationDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Total cost
    const totalCost = durationDays * (rental.dailyRate || 0);
    
    return {
      duration: durationDays,
      totalCost: totalCost
    };
  };
  
  // Handle rental deletion
  const handleDelete = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/rentals/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/rentals'] });
      toast({
        title: "Rental record deleted",
        description: "The rental record has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the rental record.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Rental History</h2>
          <Link href="/rentals">
            <Button variant="outline">
              <i className="ri-arrow-left-line mr-2"></i> Back to Active Rentals
            </Button>
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">View history of completed equipment rentals</p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="ri-search-line text-neutral-dark"></i>
                </div>
                <Input
                  placeholder="Search rental history..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={customerFilter} onValueChange={setCustomerFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && !dateRange.to && "text-muted-foreground"
                    )}
                  >
                    <i className="ri-calendar-line mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      "Filter by date range"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => setDateRange({ from: undefined, to: undefined })}
                    >
                      Clear Date Filter
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Rental History Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Rental Period</TableHead>
                <TableHead>Return Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading rental history...
                  </TableCell>
                </TableRow>
              ) : filteredRentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No completed rentals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRentals.map((rental) => {
                  const equipmentDetails = getEquipmentDetails(rental.equipmentId);
                  const rentalDetails = calculateRentalDetails(rental);
                  
                  return (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <Link href={`/customers/${rental.customerId}`}>
                          <span className="text-primary hover:underline cursor-pointer">
                            {getCustomerName(rental.customerId)}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Link href={`/equipment/${rental.equipmentId}`}>
                            <span className="text-primary hover:underline cursor-pointer">
                              {equipmentDetails.name}
                            </span>
                          </Link>
                        </div>
                        <div className="text-xs text-neutral-dark">{equipmentDetails.code}</div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(rental.startDate), 'MMM dd, yyyy')} - {format(new Date(rental.endDate), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        {rental.returnDate 
                          ? format(new Date(rental.returnDate), 'MMM dd, yyyy')
                          : 'No return date'
                        }
                      </TableCell>
                      <TableCell>{rentalDetails.duration} days</TableCell>
                      <TableCell>${rentalDetails.totalCost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <i className="ri-more-2-fill"></i>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/rentals/${rental.id}`}>
                              <DropdownMenuItem>
                                <i className="ri-file-list-line mr-2"></i> View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => handleDelete(rental.id)}>
                              <i className="ri-delete-bin-line mr-2"></i> Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
      
      {/* Summary Statistics (if there are any records) */}
      {filteredRentals.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-neutral-dark mb-1">Total Rentals</h3>
              <p className="text-2xl font-semibold">{filteredRentals.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-neutral-dark mb-1">Average Duration</h3>
              <p className="text-2xl font-semibold">
                {Math.round(
                  filteredRentals.reduce((sum, rental) => sum + calculateRentalDetails(rental).duration, 0) / 
                  filteredRentals.length
                )} days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <h3 className="text-sm font-medium text-neutral-dark mb-1">Total Revenue</h3>
              <p className="text-2xl font-semibold">
                ${filteredRentals.reduce((sum, rental) => 
                  sum + calculateRentalDetails(rental).totalCost, 0
                ).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RentalHistory;

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Rental, Customer, Equipment } from "@shared/schema";

const RentalList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [customerFilter, setCustomerFilter] = useState("all");
  
  // Fetch active rentals, customers, and equipment
  const { data: rentals, isLoading } = useQuery<Rental[]>({
    queryKey: ['/api/rentals', { active: true }],
    enabled: statusFilter === "active",
  });
  
  const { data: allRentals, isLoading: isLoadingAll } = useQuery<Rental[]>({
    queryKey: ['/api/rentals'],
    enabled: statusFilter === "all",
  });
  
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });
  
  const { data: equipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  // Determine which rentals to display based on status filter
  const displayRentals = statusFilter === "active" ? rentals : allRentals;
  
  // Filter rentals based on search query and customer filter
  const filteredRentals = displayRentals?.filter(rental => {
    const customer = customers?.find(c => c.id === rental.customerId);
    const equipmentItem = equipment?.find(e => e.id === rental.equipmentId);
    
    const matchesSearch = 
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipmentItem?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipmentItem?.serialNumber?.includes(searchQuery);
    
    const matchesCustomer = customerFilter === "all" || 
      rental.customerId.toString() === customerFilter;
    
    return matchesSearch && matchesCustomer;
  }).sort((a, b) => {
    // Sort by due date (end date), with closest due dates first
    return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
  }) || [];
  
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
  
  // Get status badge and determine if rental is overdue
  const getStatusBadge = (rental: Rental) => {
    const today = new Date();
    const endDate = new Date(rental.endDate);
    
    if (rental.status === 'completed') {
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Returned</Badge>;
    }
    
    // If end date is today
    if (today.toDateString() === endDate.toDateString()) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Due Today</Badge>;
    }
    
    // If end date is in the past
    if (today > endDate) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Overdue</Badge>;
    }
    
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
  };
  
  // Handle rental completion
  const handleCompleteRental = async (id: number) => {
    try {
      await apiRequest('PUT', `/api/rentals/${id}`, {
        status: "completed",
        returnDate: new Date()
      });
      queryClient.invalidateQueries({ queryKey: ['/api/rentals'] });
      toast({
        title: "Rental completed",
        description: "The equipment has been marked as returned.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while completing the rental.",
        variant: "destructive",
      });
    }
  };
  
  // Handle rental deletion
  const handleDelete = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/rentals/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/rentals'] });
      toast({
        title: "Rental deleted",
        description: "The rental has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the rental.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Rentals</h2>
          <Link href="/rentals/new">
            <Button>
              <i className="ri-add-line mr-2"></i> New Rental
            </Button>
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">Manage active equipment rentals</p>
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
                  placeholder="Search rentals..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active Rentals</SelectItem>
                  <SelectItem value="all">All Rentals</SelectItem>
                </SelectContent>
              </Select>
              
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
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Rentals Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isLoadingAll ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading rentals...
                  </TableCell>
                </TableRow>
              ) : filteredRentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No rentals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRentals.map((rental) => {
                  const equipmentDetails = getEquipmentDetails(rental.equipmentId);
                  
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
                      <TableCell>{format(new Date(rental.startDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(rental.endDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>${rental.dailyRate?.toFixed(2) || '0.00'}</TableCell>
                      <TableCell>{getStatusBadge(rental)}</TableCell>
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
                                <i className="ri-edit-line mr-2"></i> Edit
                              </DropdownMenuItem>
                            </Link>
                            {rental.status !== 'completed' && (
                              <DropdownMenuItem onClick={() => handleCompleteRental(rental.id)}>
                                <i className="ri-check-line mr-2"></i> Mark as Returned
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDelete(rental.id)}>
                              <i className="ri-delete-bin-line mr-2"></i> Delete
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
    </div>
  );
};

export default RentalList;

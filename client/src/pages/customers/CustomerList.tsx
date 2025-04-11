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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@shared/schema";

const CustomerList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch customers
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });
  
  // Filter customers based on search query
  const filteredCustomers = customers?.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.includes(searchQuery)
  ) || [];
  
  // Handle customer deletion
  const handleDelete = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/customers/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      toast({
        title: "Customer deleted",
        description: "The customer has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the customer.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Customers</h2>
          <Link href="/customers/new">
            <Button>
              <i className="ri-add-line mr-2"></i> Add Customer
            </Button>
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">Manage your customer companies</p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="ri-search-line text-neutral-dark"></i>
                </div>
                <Input
                  placeholder="Search customers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Customer Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      <Link href={`/customers/${customer.id}`}>
                        <span className="text-primary hover:underline cursor-pointer">
                          {customer.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>{customer.email || 'N/A'}</TableCell>
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {customer.city && customer.state
                        ? `${customer.city}, ${customer.state}`
                        : customer.city || customer.state || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <i className="ri-more-2-fill"></i>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/customers/${customer.id}`}>
                            <DropdownMenuItem>
                              <i className="ri-edit-line mr-2"></i> Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleDelete(customer.id)}>
                            <i className="ri-delete-bin-line mr-2"></i> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default CustomerList;

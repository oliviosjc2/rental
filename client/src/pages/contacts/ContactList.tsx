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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Contact, Customer } from "@shared/schema";

const ContactList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [customerFilter, setCustomerFilter] = useState<string>("all");
  
  // Fetch contacts and customers
  const { data: contacts, isLoading: isLoadingContacts } = useQuery<Contact[]>({
    queryKey: ['/api/contacts'],
  });
  
  const { data: customers } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });
  
  // Filter contacts based on search query and customer filter
  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = 
      `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone?.includes(searchQuery);
    
    const matchesCustomer = customerFilter === "all" || contact.customerId.toString() === customerFilter;
    
    return matchesSearch && matchesCustomer;
  }) || [];
  
  // Get customer name by ID
  const getCustomerName = (customerId: number) => {
    const customer = customers?.find(c => c.id === customerId);
    return customer?.name || 'Unknown Company';
  };
  
  // Handle contact deletion
  const handleDelete = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/contacts/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      toast({
        title: "Contact deleted",
        description: "The contact has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the contact.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Contacts</h2>
          <Link href="/contacts/new">
            <Button>
              <i className="ri-add-line mr-2"></i> Add Contact
            </Button>
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">Manage your customer contacts</p>
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
                  placeholder="Search contacts..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full sm:w-64">
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Companies</SelectItem>
                    {customers?.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Contacts Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingContacts ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading contacts...
                  </TableCell>
                </TableRow>
              ) : filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      <Link href={`/contacts/${contact.id}`}>
                        <span className="text-primary hover:underline cursor-pointer">
                          {contact.firstName} {contact.lastName}
                        </span>
                      </Link>
                      {contact.isPrimary && (
                        <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{getCustomerName(contact.customerId)}</TableCell>
                    <TableCell>{contact.position || 'N/A'}</TableCell>
                    <TableCell>{contact.email || 'N/A'}</TableCell>
                    <TableCell>{contact.phone || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <i className="ri-more-2-fill"></i>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/contacts/${contact.id}`}>
                            <DropdownMenuItem>
                              <i className="ri-edit-line mr-2"></i> Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleDelete(contact.id)}>
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

export default ContactList;

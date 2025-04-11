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
import type { Maintenance, Equipment } from "@shared/schema";

const MaintenanceList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Fetch maintenance records and equipment
  const { data: maintenance, isLoading } = useQuery<Maintenance[]>({
    queryKey: ['/api/maintenance'],
  });
  
  const { data: equipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  // Filter maintenance records based on search query and filters
  const filteredMaintenance = maintenance?.filter(record => {
    const equipmentItem = equipment?.find(e => e.id === record.equipmentId);
    const equipmentName = equipmentItem?.name || '';
    
    const matchesSearch = 
      record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipmentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      record.status.toLowerCase() === statusFilter.toLowerCase();
    
    const matchesType = typeFilter === "all" || 
      record.type.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => {
    // Sort by schedule date, with null dates at the end
    if (!a.scheduledDate) return 1;
    if (!b.scheduledDate) return -1;
    return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime();
  }) || [];
  
  // Get equipment name by ID
  const getEquipmentName = (equipmentId: number) => {
    const equipmentItem = equipment?.find(e => e.id === equipmentId);
    return equipmentItem?.name || 'Unknown Equipment';
  };
  
  // Format date with fallback
  const formatDate = (date: string | null | undefined) => {
    return date ? format(new Date(date), 'MMM dd, yyyy') : 'Not scheduled';
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Scheduled</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Handle maintenance deletion
  const handleDelete = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/maintenance/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/maintenance'] });
      toast({
        title: "Maintenance record deleted",
        description: "The maintenance record has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the maintenance record.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Maintenance Schedule</h2>
          <Link href="/maintenance/new">
            <Button>
              <i className="ri-add-line mr-2"></i> Schedule Maintenance
            </Button>
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">Manage equipment maintenance records</p>
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
                  placeholder="Search maintenance..."
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
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="preventive">Preventive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Maintenance Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading maintenance records...
                  </TableCell>
                </TableRow>
              ) : filteredMaintenance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No maintenance records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMaintenance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <Link href={`/equipment/${record.equipmentId}`}>
                        <span className="text-primary hover:underline cursor-pointer">
                          {getEquipmentName(record.equipmentId)}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/maintenance/${record.id}`}>
                        <span className="text-primary hover:underline cursor-pointer">
                          {record.description}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{formatDate(record.scheduledDate)}</TableCell>
                    <TableCell>{formatDate(record.completedDate)}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <i className="ri-more-2-fill"></i>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/maintenance/${record.id}`}>
                            <DropdownMenuItem>
                              <i className="ri-edit-line mr-2"></i> Edit
                            </DropdownMenuItem>
                          </Link>
                          {record.status !== 'completed' && (
                            <Link href={`/maintenance/${record.id}?complete=true`}>
                              <DropdownMenuItem>
                                <i className="ri-check-line mr-2"></i> Mark as Completed
                              </DropdownMenuItem>
                            </Link>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete(record.id)}>
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

export default MaintenanceList;

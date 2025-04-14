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
import type { Equipment, Category, Brand } from "@shared/schema";

const EquipmentList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [brandFilter, setBrandFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch equipment, categories, and brands
  const { data: equipment, isLoading } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  const { data: brands } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });
  
  // Filter equipment based on search query and filters
  const filteredEquipment = equipment?.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.model?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || 
      (item.categoryId?.toString() === categoryFilter);
    
    const matchesBrand = brandFilter === "all" || 
      (item.brandId?.toString() === brandFilter);
    
    // Equipment model doesn't have status anymore, it has availableUnits
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "available" && (item.availableUnits ?? 0) > 0) ||
      (statusFilter === "unavailable" && (item.availableUnits ?? 0) === 0);
    
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  }) || [];
  
  // Get category and brand names
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories?.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };
  
  const getBrandName = (brandId: number | null) => {
    if (!brandId) return 'No Brand';
    const brand = brands?.find(b => b.id === brandId);
    return brand?.name || 'Unknown Brand';
  };
  
  // Get availability badge based on available units
  const getAvailabilityBadge = (item: Equipment) => {
    const totalUnits = item.totalUnits || 0;
    const availableUnits = item.availableUnits || 0;
    
    if (totalUnits === 0) {
      return <Badge variant="outline">No Units</Badge>;
    } else if (availableUnits === 0) {
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">No Available Units</Badge>;
    } else if (availableUnits < totalUnits) {
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
        {availableUnits}/{totalUnits} Available
      </Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        {availableUnits}/{totalUnits} Available
      </Badge>;
    }
  };
  
  // Handle equipment deletion
  const handleDelete = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/equipment/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      toast({
        title: "Equipment deleted",
        description: "The equipment has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the equipment.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Equipment Inventory</h2>
          <Link href="/equipment/new">
            <Button>
              <i className="ri-add-line mr-2"></i> Add Equipment
            </Button>
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">Manage your equipment inventory</p>
      </div>
      
      {/* Search and Filters */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <i className="ri-search-line text-neutral-dark"></i>
                </div>
                <Input
                  placeholder="Search equipment..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands?.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id.toString()}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Equipment Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Model/Units</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading equipment...
                  </TableCell>
                </TableRow>
              ) : filteredEquipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No equipment found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Link href={`/equipment/${item.id}`}>
                        <span className="text-primary hover:underline cursor-pointer">
                          {item.name}
                        </span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>{item.model || 'N/A'}</div>
                      <div className="text-xs text-neutral-dark">Units: {item.totalUnits || 0}</div>
                    </TableCell>
                    <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                    <TableCell>{getBrandName(item.brandId)}</TableCell>
                    <TableCell>{getAvailabilityBadge(item)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <i className="ri-more-2-fill"></i>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/equipment/${item.id}`}>
                            <DropdownMenuItem>
                              <i className="ri-edit-line mr-2"></i> Edit
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/maintenance/new?equipmentId=${item.id}`}>
                            <DropdownMenuItem>
                              <i className="ri-service-line mr-2"></i> Schedule Maintenance
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem onClick={() => handleDelete(item.id)}>
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

export default EquipmentList;

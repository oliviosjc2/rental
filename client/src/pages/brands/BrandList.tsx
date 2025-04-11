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
import type { Brand, Equipment } from "@shared/schema";

const BrandList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch brands
  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });
  
  // Fetch equipment to count by brand
  const { data: equipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  // Filter brands based on search query
  const filteredBrands = brands?.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Count equipment by brand
  const getEquipmentCount = (brandId: number) => {
    return equipment?.filter(item => item.brandId === brandId).length || 0;
  };
  
  // Handle brand deletion
  const handleDelete = async (id: number) => {
    // Check if brand has equipment
    const count = getEquipmentCount(id);
    if (count > 0) {
      toast({
        title: "Cannot delete brand",
        description: `This brand has ${count} equipment items. Please reassign or delete them first.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      await apiRequest('DELETE', `/api/brands/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      toast({
        title: "Brand deleted",
        description: "The brand has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the brand.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Equipment Brands</h2>
          <Link href="/brands/new">
            <Button>
              <i className="ri-add-line mr-2"></i> Add Brand
            </Button>
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">Manage equipment brands</p>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <i className="ri-search-line text-neutral-dark"></i>
              </div>
              <Input
                placeholder="Search brands..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Brands Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Brand Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Equipment Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading brands...
                  </TableCell>
                </TableRow>
              ) : filteredBrands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No brands found
                  </TableCell>
                </TableRow>
              ) : (
                filteredBrands.map((brand) => {
                  const equipmentCount = getEquipmentCount(brand.id);
                  
                  return (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium">
                        <Link href={`/brands/${brand.id}`}>
                          <span className="text-primary hover:underline cursor-pointer">
                            {brand.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{brand.description || 'No description'}</TableCell>
                      <TableCell>
                        {equipmentCount > 0 ? (
                          <Link href={`/equipment?brandId=${brand.id}`}>
                            <span className="text-primary hover:underline cursor-pointer">
                              {equipmentCount} {equipmentCount === 1 ? 'item' : 'items'}
                            </span>
                          </Link>
                        ) : (
                          '0 items'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <i className="ri-more-2-fill"></i>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/brands/${brand.id}`}>
                              <DropdownMenuItem>
                                <i className="ri-edit-line mr-2"></i> Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => handleDelete(brand.id)}>
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

export default BrandList;

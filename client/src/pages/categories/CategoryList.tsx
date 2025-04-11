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
import type { Category, Equipment } from "@shared/schema";

const CategoryList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch categories
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch equipment to count by category
  const { data: equipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  // Filter categories based on search query
  const filteredCategories = categories?.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  // Count equipment by category
  const getEquipmentCount = (categoryId: number) => {
    return equipment?.filter(item => item.categoryId === categoryId).length || 0;
  };
  
  // Handle category deletion
  const handleDelete = async (id: number) => {
    // Check if category has equipment
    const count = getEquipmentCount(id);
    if (count > 0) {
      toast({
        title: "Cannot delete category",
        description: `This category has ${count} equipment items. Please reassign or delete them first.`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      await apiRequest('DELETE', `/api/categories/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the category.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">Equipment Categories</h2>
          <Link href="/categories/new">
            <Button>
              <i className="ri-add-line mr-2"></i> Add Category
            </Button>
          </Link>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">Manage equipment categories</p>
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
                placeholder="Search categories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Categories Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Equipment Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading categories...
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => {
                  const equipmentCount = getEquipmentCount(category.id);
                  
                  return (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <Link href={`/categories/${category.id}`}>
                          <span className="text-primary hover:underline cursor-pointer">
                            {category.name}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell>{category.description || 'No description'}</TableCell>
                      <TableCell>
                        {equipmentCount > 0 ? (
                          <Link href={`/equipment?categoryId=${category.id}`}>
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
                            <Link href={`/categories/${category.id}`}>
                              <DropdownMenuItem>
                                <i className="ri-edit-line mr-2"></i> Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => handleDelete(category.id)}>
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

export default CategoryList;

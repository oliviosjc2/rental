import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertEquipmentSchema, type Equipment, type Category, type Brand } from "@shared/schema";
import { cn } from "@/lib/utils";

// Extend the equipment schema with validation rules
const formSchema = insertEquipmentSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  model: z.string().optional().or(z.literal("")),
  serialNumber: z.string().optional().or(z.literal("")),
  brandId: z.number().nullable().optional(),
  categoryId: z.number().nullable().optional(),
  purchaseDate: z.date().nullable().optional(),
  purchasePrice: z.coerce.number().nullable().optional(),
  status: z.string(),
  notes: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const EquipmentForm = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  // Fetch equipment data if in edit mode
  const { data: equipment, isLoading: isLoadingEquipment } = useQuery<Equipment>({
    queryKey: [`/api/equipment/${id}`],
    enabled: isEditMode,
  });
  
  // Fetch categories for dropdown
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Fetch brands for dropdown
  const { data: brands, isLoading: isLoadingBrands } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });
  
  // Define form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      model: "",
      serialNumber: "",
      brandId: null,
      categoryId: null,
      purchaseDate: null,
      purchasePrice: null,
      status: "available",
      notes: "",
    },
  });
  
  // Update form when equipment data is loaded
  useEffect(() => {
    if (equipment) {
      form.reset({
        name: equipment.name,
        model: equipment.model || "",
        serialNumber: equipment.serialNumber || "",
        brandId: equipment.brandId || null,
        categoryId: equipment.categoryId || null,
        purchaseDate: equipment.purchaseDate ? new Date(equipment.purchaseDate) : null,
        purchasePrice: equipment.purchasePrice || null,
        status: equipment.status || "available",
        notes: equipment.notes || "",
      });
    }
  }, [equipment, form]);
  
  // Create mutation for creating/updating equipment
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditMode) {
        return apiRequest('PUT', `/api/equipment/${id}`, data);
      } else {
        return apiRequest('POST', '/api/equipment', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: [`/api/equipment/${id}`] });
      }
      toast({
        title: isEditMode ? "Equipment updated" : "Equipment created",
        description: isEditMode
          ? "The equipment has been successfully updated."
          : "The equipment has been successfully created.",
      });
      navigate("/equipment");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = (data: FormValues) => {
    mutation.mutate(data);
  };
  
  // Loading state
  const isLoading = isLoadingEquipment || isLoadingCategories || isLoadingBrands;
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? "Edit Equipment" : "New Equipment"}
          </h2>
          <div>
            <Link href="/equipment">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={mutation.isPending || isLoading}
            >
              {mutation.isPending ? "Saving..." : "Save Equipment"}
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">
          {isEditMode ? "Update equipment information" : "Add new equipment to inventory"}
        </p>
      </div>
      
      {isLoading ? (
        <Card>
          <CardContent className="p-6 text-center">
            Loading...
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Equipment Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Equipment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter equipment name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={(value) => 
                              field.onChange(value ? parseInt(value, 10) : null)
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category.id} value={category.id.toString()}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={(value) => 
                              field.onChange(value ? parseInt(value, 10) : null)
                            }
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select brand" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {brands?.map((brand) => (
                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                  {brand.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl>
                            <Input placeholder="Model number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="serialNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Serial Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Serial number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="rented">Rented</SelectItem>
                            <SelectItem value="maintenance">In Maintenance</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional information about this equipment" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Purchase Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Purchase Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="purchaseDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Purchase Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <i className="ri-calendar-line ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="purchasePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase Price</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <span className="text-neutral-dark">$</span>
                            </div>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="pl-7"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : Number(e.target.value);
                                field.onChange(value);
                              }}
                              value={field.value === null ? "" : field.value}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link href="/equipment">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Equipment"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EquipmentForm;

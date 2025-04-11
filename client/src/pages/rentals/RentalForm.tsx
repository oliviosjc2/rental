import { useEffect, useState } from "react";
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
import { format, addDays } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertRentalSchema, type Rental, type Customer, type Equipment } from "@shared/schema";
import { cn } from "@/lib/utils";

// Extend the rental schema with validation rules
const formSchema = insertRentalSchema.extend({
  customerId: z.number({ required_error: "Please select a customer" }),
  equipmentId: z.number({ required_error: "Please select equipment" }),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
  dailyRate: z.coerce.number().nullable().optional(),
  status: z.string().min(1, { message: "Please select a status" }),
  notes: z.string().optional().or(z.literal("")),
}).refine(data => {
  return data.endDate >= data.startDate;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type FormValues = z.infer<typeof formSchema>;

const RentalForm = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  // State to track available equipment
  const [availableEquipmentIds, setAvailableEquipmentIds] = useState<number[]>([]);
  
  // Fetch rental data if in edit mode
  const { data: rental, isLoading: isLoadingRental } = useQuery<Rental>({
    queryKey: [`/api/rentals/${id}`],
    enabled: isEditMode,
  });
  
  // Fetch customers for dropdown
  const { data: customers, isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });
  
  // Fetch all equipment
  const { data: allEquipment, isLoading: isLoadingEquipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  // Fetch all rentals to check for availability
  const { data: allRentals } = useQuery<Rental[]>({
    queryKey: ['/api/rentals'],
  });
  
  // Define form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: 0,
      equipmentId: 0,
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      dailyRate: null,
      status: "active",
      notes: "",
    },
  });
  
  // Get current form values
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  
  // Update available equipment when dates change
  useEffect(() => {
    if (!allEquipment || !allRentals) return;
    
    // Get currently selected equipment ID (if any)
    const currentEquipmentId = isEditMode ? rental?.equipmentId : undefined;
    
    // Filter equipment that is available for the selected date range
    const availableIds = allEquipment
      .filter(equip => {
        // Equipment must be available unless it's the currently selected equipment
        if (equip.status !== "available" && equip.id !== currentEquipmentId) {
          return false;
        }
        
        // Check if equipment is rented during the selected period
        const conflictingRental = allRentals.find(r => {
          // Skip the current rental when editing
          if (isEditMode && r.id === parseInt(id, 10)) return false;
          
          // Only check active rentals for the same equipment
          if (r.equipmentId !== equip.id || r.status !== "active") return false;
          
          // Check for date overlap
          const rentalStart = new Date(r.startDate);
          const rentalEnd = new Date(r.endDate);
          
          // Overlapping happens when one range doesn't completely precede or follow the other
          return !(
            (endDate < rentalStart) || // Our rental ends before conflicting rental starts
            (startDate > rentalEnd)     // Our rental starts after conflicting rental ends
          );
        });
        
        return !conflictingRental;
      })
      .map(equip => equip.id);
    
    setAvailableEquipmentIds(availableIds);
  }, [allEquipment, allRentals, startDate, endDate, isEditMode, rental, id]);
  
  // Update form when rental data is loaded
  useEffect(() => {
    if (rental) {
      form.reset({
        customerId: rental.customerId,
        equipmentId: rental.equipmentId,
        startDate: new Date(rental.startDate),
        endDate: new Date(rental.endDate),
        dailyRate: rental.dailyRate || null,
        status: rental.status,
        notes: rental.notes || "",
      });
    }
  }, [rental, form]);
  
  // Create mutation for creating/updating rental
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditMode) {
        return apiRequest('PUT', `/api/rentals/${id}`, data);
      } else {
        return apiRequest('POST', '/api/rentals', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/rentals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: [`/api/rentals/${id}`] });
      }
      toast({
        title: isEditMode ? "Rental updated" : "Rental created",
        description: isEditMode
          ? "The rental has been successfully updated."
          : "The rental has been successfully created.",
      });
      navigate("/rentals");
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
  const isLoading = isLoadingRental || isLoadingCustomers || isLoadingEquipment;
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? "Edit Rental" : "New Rental"}
          </h2>
          <div>
            <Link href="/rentals">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={mutation.isPending || isLoading}
            >
              {mutation.isPending ? "Saving..." : "Save Rental"}
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">
          {isEditMode ? "Update rental information" : "Create a new equipment rental"}
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
              {/* Rental Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rental Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer *</FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value, 10))}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers?.map((customer) => (
                              <SelectItem key={customer.id} value={customer.id.toString()}>
                                {customer.name}
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
                    name="equipmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment *</FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value, 10))}
                          disabled={isEditMode} // Can't change equipment for existing rental
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select equipment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {allEquipment?.map((item) => {
                              const isAvailable = availableEquipmentIds.includes(item.id);
                              const isCurrentlySelected = isEditMode && rental?.equipmentId === item.id;
                              // Allow selection of current equipment or available equipment
                              if (isAvailable || isCurrentlySelected) {
                                return (
                                  <SelectItem key={item.id} value={item.id.toString()}>
                                    {item.name} {item.serialNumber ? `(${item.serialNumber})` : ''}
                                  </SelectItem>
                                );
                              }
                              return null;
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dailyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Rate</FormLabel>
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
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
                            placeholder="Additional information about this rental" 
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
              
              {/* Rental Period */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rental Period</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date *</FormLabel>
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
                              selected={field.value}
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
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date *</FormLabel>
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
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < startDate}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Show rental duration and total cost */}
                  {startDate && endDate && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium mb-2">Rental Summary</h3>
                      
                      <div className="flex justify-between text-sm mb-1">
                        <span>Duration:</span>
                        <span className="font-medium">
                          {Math.ceil(
                            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
                          )} days
                        </span>
                      </div>
                      
                      {form.watch('dailyRate') && (
                        <>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Daily Rate:</span>
                            <span className="font-medium">
                              ${form.watch('dailyRate')?.toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex justify-between font-medium pt-2 border-t border-gray-200 mt-2">
                            <span>Estimated Total:</span>
                            <span className="text-primary">
                              ${(
                                (form.watch('dailyRate') || 0) * 
                                Math.ceil(
                                  (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
                                )
                              ).toFixed(2)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link href="/rentals">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Rental"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default RentalForm;

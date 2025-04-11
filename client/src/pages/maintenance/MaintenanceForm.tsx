import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, Link, useSearch } from "wouter";
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
import { insertMaintenanceSchema, type Maintenance, type Equipment } from "@shared/schema";
import { cn } from "@/lib/utils";

// Extend the maintenance schema with validation rules
const formSchema = insertMaintenanceSchema.extend({
  equipmentId: z.number({ required_error: "Please select equipment" }),
  type: z.string().min(1, { message: "Please select a maintenance type" }),
  description: z.string().min(3, { message: "Description is required" }),
  scheduledDate: z.date().nullable().optional(),
  completedDate: z.date().nullable().optional(),
  cost: z.coerce.number().nullable().optional(),
  notes: z.string().optional().or(z.literal("")),
  status: z.string().min(1, { message: "Please select a status" }),
});

type FormValues = z.infer<typeof formSchema>;

const MaintenanceForm = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearch();
  const searchParamsObj = new URLSearchParams(searchParams);
  const queryEquipmentId = searchParamsObj.get('equipmentId');
  const shouldComplete = searchParamsObj.get('complete') === 'true';
  
  const { toast } = useToast();
  const isEditMode = !!id;
  
  // Fetch maintenance data if in edit mode
  const { data: maintenance, isLoading: isLoadingMaintenance } = useQuery<Maintenance>({
    queryKey: [`/api/maintenance/${id}`],
    enabled: isEditMode,
  });
  
  // Fetch equipment for dropdown
  const { data: equipment, isLoading: isLoadingEquipment } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
  });
  
  // Define form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentId: queryEquipmentId ? parseInt(queryEquipmentId, 10) : 0,
      type: "Scheduled",
      description: "",
      scheduledDate: new Date(),
      completedDate: null,
      cost: null,
      notes: "",
      status: "scheduled",
    },
  });
  
  // Update form when maintenance data is loaded
  useEffect(() => {
    if (maintenance) {
      form.reset({
        equipmentId: maintenance.equipmentId,
        type: maintenance.type,
        description: maintenance.description,
        scheduledDate: maintenance.scheduledDate ? new Date(maintenance.scheduledDate) : null,
        completedDate: maintenance.completedDate ? new Date(maintenance.completedDate) : null,
        cost: maintenance.cost || null,
        notes: maintenance.notes || "",
        status: maintenance.status,
      });
      
      // If completing maintenance from URL param, set status and completedDate
      if (shouldComplete && maintenance.status !== 'completed') {
        form.setValue('status', 'completed');
        form.setValue('completedDate', new Date());
      }
    }
  }, [maintenance, form, shouldComplete]);
  
  // Create mutation for creating/updating maintenance
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditMode) {
        return apiRequest('PUT', `/api/maintenance/${id}`, data);
      } else {
        return apiRequest('POST', '/api/maintenance', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/maintenance'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: [`/api/maintenance/${id}`] });
      }
      toast({
        title: isEditMode ? "Maintenance updated" : "Maintenance scheduled",
        description: isEditMode
          ? "The maintenance record has been successfully updated."
          : "The maintenance has been successfully scheduled.",
      });
      navigate("/maintenance");
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
  const isLoading = isLoadingMaintenance || isLoadingEquipment;
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? (shouldComplete ? "Complete Maintenance" : "Edit Maintenance") : "Schedule Maintenance"}
          </h2>
          <div>
            <Link href="/maintenance">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={mutation.isPending || isLoading}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">
          {isEditMode 
            ? (shouldComplete ? "Mark maintenance as completed" : "Update maintenance information") 
            : "Schedule new maintenance for equipment"}
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
              {/* Maintenance Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Maintenance Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="equipmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equipment *</FormLabel>
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value, 10))}
                          disabled={isEditMode} // Can't change equipment for existing maintenance
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select equipment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {equipment?.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name}
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Type *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Emergency">Emergency</SelectItem>
                            <SelectItem value="Preventive">Preventive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of maintenance" {...field} />
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
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
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
                            placeholder="Additional details about the maintenance" 
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
              
              {/* Scheduling and Cost Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Scheduling and Costs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Scheduled Date</FormLabel>
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
                    name="completedDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Completed Date</FormLabel>
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
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Cost</FormLabel>
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
              <Link href="/maintenance">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default MaintenanceForm;

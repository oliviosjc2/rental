import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams, useRoute, Link } from "wouter";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCustomerSchema, type Customer } from "@shared/schema";

// Extend the customer schema with validation rules
const formSchema = insertCustomerSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  postalCode: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const CustomerForm = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  // Fetch customer data if in edit mode
  const { data: customer, isLoading } = useQuery<Customer>({
    queryKey: [`/api/customers/${id}`],
    enabled: isEditMode,
  });
  
  // Define form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      notes: "",
    },
  });
  
  // Update form when customer data is loaded
  useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        postalCode: customer.postalCode || "",
        country: customer.country || "",
        notes: customer.notes || "",
      });
    }
  }, [customer, form]);
  
  // Create mutation for creating/updating customer
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditMode) {
        return apiRequest('PUT', `/api/customers/${id}`, data);
      } else {
        return apiRequest('POST', '/api/customers', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/customers'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: [`/api/customers/${id}`] });
      }
      toast({
        title: isEditMode ? "Customer updated" : "Customer created",
        description: isEditMode
          ? "The customer has been successfully updated."
          : "The customer has been successfully created.",
      });
      navigate("/customers");
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
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? "Edit Customer" : "New Customer"}
          </h2>
          <div>
            <Link href="/customers">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={mutation.isPending || isLoading}
            >
              {mutation.isPending ? "Saving..." : "Save Customer"}
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">
          {isEditMode ? "Update customer information" : "Create a new customer record"}
        </p>
      </div>
      
      {isLoading && isEditMode ? (
        <Card>
          <CardContent className="p-6 text-center">
            Loading customer data...
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="company@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Additional information about this customer" 
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
              
              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Address Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State/Province</FormLabel>
                          <FormControl>
                            <Input placeholder="State" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Link href="/customers">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Customer"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CustomerForm;

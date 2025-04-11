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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertContactSchema, type Contact, type Customer } from "@shared/schema";

// Extend the contact schema with validation rules
const formSchema = insertContactSchema.extend({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  customerId: z.number({ required_error: "Please select a company" }),
  email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  isPrimary: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  // Fetch contact data if in edit mode
  const { data: contact, isLoading: isLoadingContact } = useQuery<Contact>({
    queryKey: [`/api/contacts/${id}`],
    enabled: isEditMode,
  });
  
  // Fetch customers for dropdown
  const { data: customers, isLoading: isLoadingCustomers } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });
  
  // Define form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      customerId: 0,
      email: "",
      phone: "",
      position: "",
      isPrimary: false,
    },
  });
  
  // Update form when contact data is loaded
  useEffect(() => {
    if (contact) {
      form.reset({
        firstName: contact.firstName,
        lastName: contact.lastName,
        customerId: contact.customerId,
        email: contact.email || "",
        phone: contact.phone || "",
        position: contact.position || "",
        isPrimary: contact.isPrimary || false,
      });
    }
  }, [contact, form]);
  
  // Create mutation for creating/updating contact
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditMode) {
        return apiRequest('PUT', `/api/contacts/${id}`, data);
      } else {
        return apiRequest('POST', '/api/contacts', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: [`/api/contacts/${id}`] });
      }
      toast({
        title: isEditMode ? "Contact updated" : "Contact created",
        description: isEditMode
          ? "The contact has been successfully updated."
          : "The contact has been successfully created.",
      });
      navigate("/contacts");
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
  const isLoading = isLoadingContact || isLoadingCustomers;
  
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-800">
            {isEditMode ? "Edit Contact" : "New Contact"}
          </h2>
          <div>
            <Link href="/contacts">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={mutation.isPending || isLoading}
            >
              {mutation.isPending ? "Saving..." : "Save Contact"}
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">
          {isEditMode ? "Update contact information" : "Create a new contact record"}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company *</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a company" />
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Project Manager" {...field} />
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
                          <Input placeholder="email@example.com" type="email" {...field} />
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
                  name="isPrimary"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Primary Contact</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Designate this person as the primary contact for the company
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="mt-6 flex justify-end">
              <Link href="/contacts">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Contact"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ContactForm;

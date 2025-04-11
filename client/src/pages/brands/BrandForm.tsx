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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertBrandSchema, type Brand } from "@shared/schema";

// Extend the brand schema with validation rules
const formSchema = insertBrandSchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const BrandForm = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  // Fetch brand data if in edit mode
  const { data: brand, isLoading } = useQuery<Brand>({
    queryKey: [`/api/brands/${id}`],
    enabled: isEditMode,
  });
  
  // Define form with React Hook Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  
  // Update form when brand data is loaded
  useEffect(() => {
    if (brand) {
      form.reset({
        name: brand.name,
        description: brand.description || "",
      });
    }
  }, [brand, form]);
  
  // Create mutation for creating/updating brand
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditMode) {
        return apiRequest('PUT', `/api/brands/${id}`, data);
      } else {
        return apiRequest('POST', '/api/brands', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: [`/api/brands/${id}`] });
      }
      toast({
        title: isEditMode ? "Brand updated" : "Brand created",
        description: isEditMode
          ? "The brand has been successfully updated."
          : "The brand has been successfully created.",
      });
      navigate("/brands");
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
            {isEditMode ? "Edit Brand" : "New Brand"}
          </h2>
          <div>
            <Link href="/brands">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={mutation.isPending || isLoading}
            >
              {mutation.isPending ? "Saving..." : "Save Brand"}
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">
          {isEditMode ? "Update brand information" : "Create a new equipment brand"}
        </p>
      </div>
      
      {isLoading && isEditMode ? (
        <Card>
          <CardContent className="p-6 text-center">
            Loading brand data...
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Brand Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe this brand" 
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
            
            <div className="mt-6 flex justify-end">
              <Link href="/brands">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Brand"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default BrandForm;

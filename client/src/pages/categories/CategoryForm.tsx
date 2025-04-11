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
import { insertCategorySchema, type Category } from "@shared/schema";

// Extend the category schema with validation rules
const formSchema = insertCategorySchema.extend({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  description: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const CategoryForm = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  // Fetch category data if in edit mode
  const { data: category, isLoading } = useQuery<Category>({
    queryKey: [`/api/categories/${id}`],
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
  
  // Update form when category data is loaded
  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || "",
      });
    }
  }, [category, form]);
  
  // Create mutation for creating/updating category
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (isEditMode) {
        return apiRequest('PUT', `/api/categories/${id}`, data);
      } else {
        return apiRequest('POST', '/api/categories', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: [`/api/categories/${id}`] });
      }
      toast({
        title: isEditMode ? "Category updated" : "Category created",
        description: isEditMode
          ? "The category has been successfully updated."
          : "The category has been successfully created.",
      });
      navigate("/categories");
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
            {isEditMode ? "Edit Category" : "New Category"}
          </h2>
          <div>
            <Link href="/categories">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
            </Link>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={mutation.isPending || isLoading}
            >
              {mutation.isPending ? "Saving..." : "Save Category"}
            </Button>
          </div>
        </div>
        <p className="mt-1 text-sm text-neutral-dark">
          {isEditMode ? "Update category information" : "Create a new equipment category"}
        </p>
      </div>
      
      {isLoading && isEditMode ? (
        <Card>
          <CardContent className="p-6 text-center">
            Loading category data...
          </CardContent>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" {...field} />
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
                          placeholder="Describe this category" 
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
              <Link href="/categories">
                <Button variant="outline" className="mr-2">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save Category"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CategoryForm;

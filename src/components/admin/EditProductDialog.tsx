
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/contexts/ProductContext";
import type { Product } from "@/lib/products";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters."),
  imageUrl: z.string().min(1, "An image is required."),
  category: z.string().min(1, "Please select a category."),
  type: z.enum(['games', 'vouchers']),
  formType: z.enum(['uid', 'ingame', 'voucher']),
  description: z.string().min(1, "Description is required."),
});

type EditProductDialogProps = {
  product: Product;
  children: React.ReactNode;
};

export function EditProductDialog({ product, children }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateProduct, mainCategories } = useProducts();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
      type: product.type,
      formType: product.formType,
      description: product.description.join('\n'),
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: product.name,
        imageUrl: product.imageUrl,
        category: product.category,
        type: product.type,
        formType: product.formType,
        description: product.description.join('\n'),
      });
    }
  }, [open, product, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateProduct(product.slug, {
      ...values,
      description: values.description.split('\n').filter(line => line.trim() !== ''),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Product Name</Label>
                  <FormControl>
                    <Input id="name" placeholder="e.g., Cool Game" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <Label>Image</Label>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mainCategories.map(cat => (
                        <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
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
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       <SelectItem value="games">Game</SelectItem>
                       <SelectItem value="vouchers">Voucher</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="formType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Form Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a form type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                       <SelectItem value="uid">UID Based</SelectItem>
                       <SelectItem value="ingame">In-Game Login</SelectItem>
                       <SelectItem value="voucher">Voucher</SelectItem>
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
                  <Label htmlFor="description">Product Description</Label>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Enter each description line on a new line."
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                   <FormDescription>
                    Each line will be displayed as a separate bullet point.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

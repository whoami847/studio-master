
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
} from "@/components/ui/form";
import { useProducts } from "@/contexts/ProductContext";
import type { MainCategory } from "@/lib/products";
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters."),
  imageUrl: z.string().min(1, "An image is required."),
});

type EditCategoryDialogProps = {
  category: MainCategory;
  children: React.ReactNode;
};

export function EditCategoryDialog({ category, children }: EditCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { updateCategory } = useProducts();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      imageUrl: category.imageUrl,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category.name,
        imageUrl: category.imageUrl,
      });
    }
  }, [open, category, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateCategory(category.slug, values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Category Name</Label>
                  <FormControl>
                    <Input id="name" placeholder="e.g., Vouchers" {...field} />
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

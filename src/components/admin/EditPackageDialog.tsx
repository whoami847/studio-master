
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
import type { ProductOption } from "@/lib/products";

const formSchema = z.object({
  name: z.string().min(1, "Package name is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
});

type EditPackageDialogProps = {
  productSlug: string;
  productPackage: ProductOption;
  children: React.ReactNode;
};

export function EditPackageDialog({ productSlug, productPackage, children }: EditPackageDialogProps) {
  const [open, setOpen] = useState(false);
  const { updatePackage } = useProducts();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: productPackage.name,
      price: productPackage.price,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: productPackage.name,
        price: productPackage.price,
      });
    }
  }, [open, productPackage, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updatePackage(productSlug, productPackage.name, values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Package Name</Label>
                  <FormControl>
                    <Input id="name" placeholder="e.g., 100 Diamonds" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="price">Price (৳)</Label>
                  <FormControl>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 85"
                      {...field}
                      onChange={e => field.onChange(e.target.valueAsNumber)}
                    />
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

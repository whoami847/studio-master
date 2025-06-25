
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
  DialogDescription,
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
import { useGateways, type PaymentGateway } from "@/contexts/GatewayContext";
import { ImageUpload } from "./ImageUpload";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(3, "Gateway name must be at least 3 characters."),
  logoUrl: z.string().min(1, "A logo is required."),
  storeId: z.string().min(1, "Store ID is required."),
  storePassword: z.string().min(1, "Store Password/Secret is required."),
  apiUrl: z.string().url("A valid API URL is required."),
  enabled: z.boolean(),
});

type AddGatewayDialogProps = {
  gateway?: PaymentGateway;
  children: React.ReactNode;
};

export function AddGatewayDialog({ gateway, children }: AddGatewayDialogProps) {
  const [open, setOpen] = useState(false);
  const { addGateway, updateGateway } = useGateways();
  const isEditMode = !!gateway;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      logoUrl: "",
      storeId: "",
      storePassword: "",
      apiUrl: "",
      enabled: true,
    },
  });

  useEffect(() => {
    if (gateway && open) {
      form.reset(gateway);
    } else if (!gateway && open) {
      form.reset({
        name: "",
        logoUrl: "",
        storeId: "",
        storePassword: "",
        apiUrl: "",
        enabled: true,
      });
    }
  }, [gateway, open, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditMode) {
      updateGateway(gateway.id, values);
    } else {
      addGateway(values);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit" : "Add New"} Gateway</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details for this payment gateway." : "Enter details for the new payment gateway."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Gateway Name</Label>
                  <FormControl>
                    <Input placeholder="e.g., SSLCOMMERZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <Label>Logo</Label>
                  <FormControl>
                    <ImageUpload value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storeId"
              render={({ field }) => (
                <FormItem>
                  <Label>Store ID</Label>
                  <FormControl>
                    <Input placeholder="Enter Store ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storePassword"
              render={({ field }) => (
                <FormItem>
                  <Label>Store Password / Secret</Label>
                  <FormControl>
                    <Input placeholder="Enter Store Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiUrl"
              render={({ field }) => (
                <FormItem>
                  <Label>API URL</Label>
                  <FormControl>
                    <Input placeholder="https://sandbox.sslcommerz.com/gwprocess/v4/api.php" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <Label>Enable Gateway</Label>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Gateway</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


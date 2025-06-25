
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
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import type { AllUsersListItem } from "@/contexts/AuthContext";
import { PasswordInput } from "../PasswordInput";

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.").optional().or(z.literal('')),
});

type EditUserCredentialsDialogProps = {
  user: AllUsersListItem;
  children: React.ReactNode;
};

export function EditUserCredentialsDialog({ user, children }: EditUserCredentialsDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email,
      password: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        email: user.email,
        password: "",
      });
    }
  }, [open, user, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // This is where the call to a Cloud Function would go.
    // For now, we'll just show a notification explaining the limitation.
    toast({
      variant: "destructive",
      title: "Feature Not Implemented",
      description: "Changing user credentials requires a secure server-side function (e.g., Firebase Cloud Function) for security reasons.",
      duration: 10000,
    });
    console.log("Attempted to change credentials for", user.email, "with values:", values);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Credentials for {user.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email Address</Label>
                  <FormControl>
                    <Input id="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">New Password</Label>
                  <FormControl>
                    <PasswordInput id="password" placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormDescription>Leave blank to keep the current password.</FormDescription>
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

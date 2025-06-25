
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const { signup, isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/my-account');
      }
    }
  }, [isAuthenticated, loading, router, user]);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      await signup(values.firstName, values.lastName, values.email, values.password);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (loading || isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background px-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Enter your information to create an account</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
               <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="first-name">First name</Label>
                    <FormControl>
                      <Input id="first-name" placeholder="Max" {...field} disabled={isSubmitting}/>
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
                    <Label htmlFor="last-name">Last name</Label>
                    <FormControl>
                      <Input id="last-name" placeholder="Robinson" {...field} disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="email">Email</Label>
                    <FormControl>
                      <Input id="email" type="email" placeholder="m@example.com" {...field} disabled={isSubmitting}/>
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
                    <Label htmlFor="password">Password</Label>
                    <FormControl>
                      <PasswordInput id="password" placeholder="Enter your password" {...field} disabled={isSubmitting}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline hover:text-primary">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}


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
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof formSchema>;

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
        <title>Google</title>
        <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.98-4.66 1.98-3.57 0-6.45-2.9-6.45-6.45s2.88-6.45 6.45-6.45c1.93 0 3.21.79 4.1 1.69l2.6-2.6C16.84 3.73 14.78 3 12.48 3c-5.21 0-9.45 4.24-9.45 9.45s4.24 9.45 9.45 9.45c5.03 0 9.13-3.6 9.13-9.13 0-.6-.05-1.18-.15-1.72z"
            fill="currentColor"
        />
    </svg>
);


export default function LoginPage() {
  const { login, signInWithGoogle, isAuthenticated, loading, user } = useAuth();
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

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
        await signInWithGoogle();
    } catch (error: any) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Google Login Failed",
            description: error.message || "Could not sign in with Google.",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (loading || isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-background px-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
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
            <CardFooter className="flex flex-col items-start gap-4">
                <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Signing In..." : "Sign in"}</Button>
                
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <Button variant="outline" className="w-full" type="button" onClick={handleGoogleLogin} disabled={isSubmitting}>
                  <GoogleIcon />
                  Google
                </Button>
                
                <div className="text-center text-sm w-full">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="underline hover:text-primary">
                    Sign up
                  </Link>
                </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

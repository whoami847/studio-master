
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AccountDetailsPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !user) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
            <Link href="/my-account">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Account
            </Link>
        </Button>
      </div>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            View your personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={user.firstName} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={user.lastName} readOnly />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={user.email} readOnly />
          </div>
          <p className="text-sm text-muted-foreground pt-4">To update your details, please contact support.</p>
        </CardContent>
      </Card>
    </div>
  );
}

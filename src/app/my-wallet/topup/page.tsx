
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useGateways } from "@/contexts/GatewayContext";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  amount: z.coerce
    .number({ required_error: "Please enter an amount." })
    .min(10, "Amount must be at least 10."),
  gateway: z.string({
    required_error: "You need to select a payment method.",
  }),
});

export default function WalletTopupPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { gateways } = useGateways();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const enabledGateways = gateways.filter(g => g.enabled);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '' as any,
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You must be logged in to top up your wallet.",
      });
      router.push('/login');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: values.amount,
          gatewayId: values.gateway,
          userId: user.uid,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.message || 'Failed to initiate payment.');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message,
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Wallet Topup</CardTitle>
          <CardDescription className="text-center">Select an amount and a payment method to add funds to your wallet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount to Topup (৳) *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Enter amount (e.g., 100)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gateway"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="font-semibold">Select Payment Method</FormLabel>
                    {enabledGateways.length > 0 ? (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        {enabledGateways.map((gw) => (
                          <FormItem key={gw.id}>
                            <FormControl>
                              <RadioGroupItem value={gw.id} className="sr-only" />
                            </FormControl>
                            <FormLabel
                              className={`flex items-center gap-4 rounded-lg border-2 p-4 font-normal cursor-pointer transition-colors ${
                                field.value === gw.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-muted bg-popover hover:border-primary/50'
                              }`}
                            >
                              <Image src={gw.logoUrl} alt={gw.name} width={80} height={40} className="object-contain" />
                              <span className="font-semibold flex-1">{gw.name}</span>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">No payment gateways are currently available. Please check back later.</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || enabledGateways.length === 0}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Proceed to Payment'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}



"use client";

import { useState, useEffect, useMemo } from "react";
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
import { useToast } from "@/hooks/use-toast";
import type { AllUsersListItem } from "@/contexts/AuthContext";
import { Textarea } from "../ui/textarea";
import { useWallet } from "@/contexts/WalletContext";

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: "Amount must be greater than zero." }),
  reason: z.string().min(3, "Please provide a reason for this adjustment."),
});

type EditUserBalanceDialogProps = {
  user: AllUsersListItem;
  children: React.ReactNode;
};

export function EditUserBalanceDialog({ user, children }: EditUserBalanceDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { adjustUserBalance, allTransactions } = useWallet();

  const userBalance = useMemo(() => {
    if (!user || !allTransactions) return 0;
    
    return allTransactions
      .filter(t => t.userId === user.id)
      .reduce((acc, curr) => {
        if (curr.type === 'Top-up') {
            return curr.status === 'approved' ? acc + curr.amount : acc;
        }
        if (curr.type === 'Purchase') {
            return acc - curr.amount;
        }
        return acc;
    }, 0);
  }, [user, allTransactions, open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '' as any,
      reason: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        amount: '' as any,
        reason: "",
      });
    }
  }, [open, user, form]);

  const handleAdjustment = async (type: 'add' | 'remove') => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const values = form.getValues();
    const amountToAdjust = type === 'add' ? values.amount : -values.amount;

    try {
      await adjustUserBalance(user.id, user.name, amountToAdjust, values.reason);
      toast({
        title: "Balance Updated",
        description: `Successfully adjusted ${user.name}'s balance by ৳${amountToAdjust.toFixed(2)}.`,
      });
      setOpen(false);
    } catch(error: any) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: error.message || "Could not update user balance.",
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Balance for {user.name}</DialogTitle>
          <DialogDescription>
            Current Balance: <span className="font-bold text-accent">৳{userBalance.toFixed(2)}</span>.
            <br/>
            Enter an amount and choose to add or remove funds.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="amount">Amount (৳)</Label>
                  <FormControl>
                    <Input id="amount" type="number" min="0" placeholder="e.g., 50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="reason">Reason for Adjustment</Label>
                  <FormControl>
                    <Textarea id="reason" placeholder="e.g., Refund for item or Bonus credit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="button" variant="destructive" onClick={() => handleAdjustment('remove')}>Remove Balance</Button>
                <Button type="button" variant="success" onClick={() => handleAdjustment('add')}>Add Balance</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

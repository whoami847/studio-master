
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import { cn } from '@/lib/utils';
import { Badge, badgeVariants } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';

const statusVariantMap: { [key: string]: VariantProps<typeof badgeVariants>['variant'] } = {
  approved: 'success',
  pending: 'secondary',
  rejected: 'destructive',
};

export default function TransactionsPage() {
  const { transactions } = useWallet();
  const hasTransactions = transactions.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Transactions</h1>
      {hasTransactions ? (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 flex items-start sm:items-center gap-4">
                <div className={cn(
                    "p-3 rounded-lg mt-1 sm:mt-0",
                    transaction.type === 'Top-up' ? 'bg-accent/10' : 'bg-destructive/10'
                )}>
                  <ReceiptText className={cn(
                      "h-6 w-6",
                      transaction.type === 'Top-up' ? 'text-accent' : 'text-destructive'
                  )} />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                      <p className="font-semibold text-card-foreground">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date?.seconds ? new Date(transaction.date.seconds * 1000).toLocaleString() : 'Processing...'}
                      </p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <p className={cn(
                          "font-semibold",
                           transaction.type === 'Top-up' && transaction.status !== 'rejected' ? 'text-accent' : 'text-destructive'
                      )}>
                        {transaction.type === 'Top-up' ? '+' : '-'} ৳{transaction.amount.toFixed(2)}
                      </p>
                      {transaction.type === 'Top-up' && transaction.status && (
                          <Badge variant={statusVariantMap[transaction.status] || 'default'} className="mt-1">
                              {transaction.status}
                          </Badge>
                       )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex justify-center mt-10">
          <Card className="w-full max-w-sm">
            <CardContent className="flex flex-col items-center text-center p-10">
              <AlertCircle className="h-12 w-12 text-primary" />
              <h2 className="text-xl font-semibold mt-6">No transactions found.</h2>
              <p className="text-muted-foreground mt-2">Your transaction history will appear here.</p>
              <Button asChild className="mt-6">
                <Link href="/my-wallet/topup">Topup Wallet</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

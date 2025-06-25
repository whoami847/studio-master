
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useWallet } from '@/contexts/WalletContext';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { VariantProps } from 'class-variance-authority';
import type { Transaction } from '@/contexts/WalletContext';

const statusVariantMap: { [key: string]: VariantProps<typeof badgeVariants>['variant'] } = {
  approved: 'success',
  pending: 'secondary',
  rejected: 'destructive',
};

export default function AdminTransactionsPage() {
  const { allTransactions, updateTopupStatus } = useWallet();

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-6">Transaction History</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>A list of all wallet transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.user}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell className={cn(
                        "text-right font-semibold",
                        transaction.type === 'Top-up' && transaction.status !== 'rejected' ? 'text-accent' : 'text-destructive'
                      )}>
                          {transaction.type === 'Top-up' ? '+' : '-'} ৳{transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      {transaction.type === 'Top-up' && transaction.status && (
                        <Badge variant={statusVariantMap[transaction.status] || 'default'}>
                            {transaction.status}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-right">
                        {transaction.date?.seconds ? new Date(transaction.date.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {transaction.type === 'Top-up' && transaction.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="success" onClick={() => updateTopupStatus(transaction.id, 'approved')}>Approve</Button>
                            <Button size="sm" variant="destructive" onClick={() => updateTopupStatus(transaction.id, 'rejected')}>Reject</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

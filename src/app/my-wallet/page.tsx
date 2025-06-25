
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Plus, ListOrdered } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';

export default function MyWalletPage() {
  const { balance } = useWallet();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">My Wallet</h1>
      <div className="space-y-4">
        <Link href="/my-wallet/topup" className="block hover:no-underline">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center">
                    <Plus className="h-6 w-6 mr-4" />
                    <span className="font-semibold text-lg">Wallet topup</span>
                </CardContent>
            </Card>
        </Link>
        <Link href="/my-wallet/transactions" className="block hover:no-underline">
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 flex items-center">
                    <ListOrdered className="h-6 w-6 mr-4" />
                    <span className="font-semibold text-lg">Transactions</span>
                </CardContent>
            </Card>
        </Link>
        <Card>
            <CardContent className="p-6 space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Main Balance</h2>
                    <p className="text-4xl font-bold text-accent mt-2">৳ {balance.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                        This is your current available balance for purchases.
                    </p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

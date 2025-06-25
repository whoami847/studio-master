
"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Package } from 'lucide-react';
import Link from 'next/link';
import { useOrders } from '@/contexts/OrderContext';
import { Badge, badgeVariants } from '@/components/ui/badge';
import type { VariantProps } from 'class-variance-authority';

const statusVariantMap: { [key: string]: VariantProps<typeof badgeVariants>['variant'] } = {
  Completed: 'success',
  Processing: 'secondary',
  Failed: 'destructive',
};


export default function OrderListPage() {
  const { userOrders } = useOrders();
  const hasOrders = userOrders.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 font-headline">Orders</h1>
      {hasOrders ? (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <Card key={order.id} className="bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4 flex items-start sm:items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg mt-1 sm:mt-0">
                  <Package className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-card-foreground">{order.product}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.date?.seconds ? new Date(order.date.seconds * 1000).toLocaleString() : 'Processing...'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="font-semibold text-card-foreground">৳{order.amount.toFixed(2)}</p>
                      <Badge variant={statusVariantMap[order.status] || 'default'}>
                        {order.status}
                      </Badge>
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
              <h2 className="text-xl font-semibold mt-6">No orders have been made yet.</h2>
              <Button asChild className="mt-6">
                <Link href="/">Browse Products</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

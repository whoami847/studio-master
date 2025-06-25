
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { useOrders } from '@/contexts/OrderContext';
import type { VariantProps } from 'class-variance-authority';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const statusVariantMap: { [key: string]: VariantProps<typeof badgeVariants>['variant'] } = {
  Completed: 'success',
  Processing: 'secondary',
  Failed: 'destructive',
};

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useOrders();

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-6">Order History</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>A list of all orders placed by users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Product</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Date</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.user}</TableCell>
                    <TableCell className="hidden md:table-cell">{order.product}</TableCell>
                    <TableCell className="text-right">৳{order.amount.toFixed(2)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-right">
                        {order.date?.seconds ? new Date(order.date.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={statusVariantMap[order.status] || 'default'}>
                        {order.status}
                      </Badge>
                    </TableCell>
                     <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Processing')}>
                            Mark as Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Completed')}>
                            Mark as Completed
                          </DropdownMenuItem>
                           <DropdownMenuItem onClick={() => updateOrderStatus(order.id, 'Failed')} className="text-destructive focus:text-destructive">
                            Mark as Failed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

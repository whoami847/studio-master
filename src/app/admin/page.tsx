
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, ShoppingCart, ListOrdered } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrderContext';
import { useWallet } from '@/contexts/WalletContext';

export default function AdminDashboardPage() {
    const { allUsers } = useAuth();
    const { orders } = useOrders();
    const { allTransactions } = useWallet();

    const totalRevenue = orders.reduce((acc, order) => {
        if (order.status === 'Completed') {
            return acc + order.amount;
        }
        return acc;
    }, 0);

    const stats = [
        { title: "Total Revenue", value: `৳${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, change: "+20.1% from last month" },
        { title: "Total Users", value: allUsers.length.toLocaleString('en-US'), icon: Users, change: "+180.1% from last month" },
        { title: "Total Orders", value: orders.length.toLocaleString('en-US'), icon: ShoppingCart, change: "+19% from last month" },
        { title: "Total Transactions", value: allTransactions.length.toLocaleString('en-US'), icon: ListOrdered, change: "+201 since last hour" },
    ];

    return (
        <>
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-6">Admin Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* Additional dashboard components like charts can be added here */}
        </>
    );
}

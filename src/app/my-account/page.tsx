
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LayoutGrid, ClipboardList, UserCircle, LogOut, Wallet, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useOrders } from '@/contexts/OrderContext';
import { subDays, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type AccountLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
};

function AccountNav({ className }: { className?: string }) {
    const { logout } = useAuth();
    const pathname = usePathname();

    const accountLinks: AccountLink[] = [
        { href: '/my-account', label: 'Dashboard', icon: LayoutGrid },
        { href: '/order-list', label: 'Orders', icon: ClipboardList },
        { href: '/my-account/details', label: 'Account details', icon: UserCircle },
        { href: '#', label: 'Logout', icon: LogOut, onClick: logout },
    ];
    
    return (
        <nav className={cn("flex flex-col gap-2", className)}>
            {accountLinks.map((link) => (
                <Link
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                        if (link.onClick) {
                            e.preventDefault();
                            link.onClick();
                        }
                    }}
                    className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-primary",
                        pathname === link.href && "bg-muted text-primary"
                    )}
                >
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                </Link>
            ))}
        </nav>
    )
}

export default function MyAccountPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const { userOrders } = useOrders();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);
  
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((acc, order) => acc + order.amount, 0);
  
  const weeklySpent = useMemo(() => {
    const oneWeekAgo = subDays(new Date(), 7);
    return userOrders
      .filter(order => {
        if (!order.date?.seconds) return false;
        const orderDate = new Date(order.date.seconds * 1000);
        return orderDate >= oneWeekAgo;
      })
      .reduce((acc, order) => acc + order.amount, 0);
  }, [userOrders]);


  if (loading || !isAuthenticated) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
                <Skeleton className="h-48 w-full" />
                <div className="space-y-6">
                    <Skeleton className="h-8 w-1/3" />
                     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card><CardContent className="p-6"><Skeleton className="h-16 w-full"/></CardContent></Card>
                        <Card><CardContent className="p-6"><Skeleton className="h-16 w-full"/></CardContent></Card>
                        <Card><CardContent className="p-6"><Skeleton className="h-16 w-full"/></CardContent></Card>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
          <AccountNav />
          <main>
              <h1 className="text-3xl font-bold mb-6 font-headline">DASHBOARD</h1>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                  <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">{totalOrders}</div>
                  </CardContent>
                  </Card>
                  <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">৳{totalSpent.toFixed(2)}</div>
                  </CardContent>
                  </Card>
                  <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Spent (Last 7 Days)</CardTitle>
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-2xl font-bold">৳{weeklySpent.toFixed(2)}</div>
                  </CardContent>
                  </Card>
              </div>
          </main>
        </div>
    </div>
  );
}

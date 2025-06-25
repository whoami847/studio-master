
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import { Package, LayoutGrid, LayoutDashboard, Users, ShoppingCart, ListOrdered, Tag, Settings, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

type AdminLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const adminLinks: AdminLink[] = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/transactions', label: 'Transactions', icon: ListOrdered },
    { href: '/admin/categories', label: 'Categories', icon: LayoutGrid },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/packages', label: 'Package Prices', icon: Tag },
    { href: '/admin/gateways', label: 'Gateways', icon: CreditCard },
    { href: '/admin/more-settings', label: 'More Settings', icon: Settings },
];

export default function AdminNav({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <aside className={cn("flex flex-col gap-4", className)}>
            <h2 className="px-3 text-lg font-semibold font-headline tracking-tight">Admin Menu</h2>
            <nav className="flex flex-col gap-1">
                {adminLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
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
        </aside>
    );
}

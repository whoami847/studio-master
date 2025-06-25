"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlayCircle, ListOrdered, Wallet, User, ReceiptText, Settings, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  const userLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/tutorial", label: "Tutorial", icon: PlayCircle },
    { href: "/order-list", label: "Order List", icon: ListOrdered },
    { href: "/my-wallet", label: "My Wallet", icon: Wallet },
    { href: "/my-account", label: "My Account", icon: User },
  ];

  const adminLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/admin/transactions", label: "Transactions", icon: ReceiptText },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admin/more-settings", label: "Settings", icon: Settings },
  ];

  const navLinks = isAdminPage ? adminLinks : userLinks;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t shadow-t-lg z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center text-xs gap-1 transition-colors w-full h-full",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <link.icon className="h-6 w-6" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

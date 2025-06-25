
"use client";

import Link from "next/link";
import { Gamepad2, UserCircle, LogOut } from "lucide-react";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center min-h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors">
            <Gamepad2 className="h-7 w-7 text-primary" />
            <span className="font-headline">BURNERS STORE</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            {isAuthenticated && user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                       <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/my-account">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                     </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

type NotificationBannerProps = {
  text: string;
};

export default function NotificationBanner({ text }: NotificationBannerProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative bg-accent text-accent-foreground">
      <div className="container mx-auto px-4 py-2 text-center text-sm font-medium">
        <p>{text}</p>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-accent/80"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close banner</span>
        </Button>
      </div>
    </div>
  );
}

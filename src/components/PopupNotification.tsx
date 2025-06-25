
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNotification } from "@/contexts/NotificationContext";

const NOTIFICATION_SHOWN_KEY = 'popupNotificationShown';

export default function PopupNotification() {
  const { settings } = useNotification();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasBeenShown = sessionStorage.getItem(NOTIFICATION_SHOWN_KEY);
    if (settings.enabled && !hasBeenShown) {
      setIsOpen(true);
      sessionStorage.setItem(NOTIFICATION_SHOWN_KEY, 'true');
    }
  }, [settings]);

  if (!settings.enabled || !isOpen) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        {settings.imageUrl && (
          <div className="relative aspect-video w-full mb-4 rounded-md overflow-hidden">
            <Image
              src={settings.imageUrl}
              alt={settings.title}
              fill
              className="object-cover"
              data-ai-hint="notification banner"
            />
          </div>
        )}
        <AlertDialogHeader>
          <AlertDialogTitle>{settings.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {settings.message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => setIsOpen(false)}>Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

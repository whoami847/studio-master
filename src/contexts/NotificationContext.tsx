
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

type NotificationSettings = {
  enabled: boolean;
  title: string;
  message: string;
  imageUrl?: string;
};

type NotificationContextType = {
  settings: NotificationSettings;
  updateSettings: (newSettings: NotificationSettings) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper function to convert Data URI to File object
const dataURIToFile = (dataURI: string, filename: string): File => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return new File([blob], filename, { type: mimeString });
};

const uploadImageToHost = async (dataUrl: string): Promise<string> => {
    if (!dataUrl.startsWith('data:image')) {
      return dataUrl;
    }
    try {
      const file = dataURIToFile(dataUrl, 'image-upload.png');
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('https://telegra.ph/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Image upload failed with status: ${response.status}`);
      }
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      if (Array.isArray(result) && result.length > 0 && result[0].src) {
        return `https://telegra.ph${result[0].src}`;
      } else {
        throw new Error('Invalid response from image host');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return "https://placehold.co/400x225.png";
    }
}


export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    title: 'Welcome!',
    message: 'Thanks for visiting our store.',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const settingsDocRef = doc(db, 'settings', 'popupNotification');
    const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as NotificationSettings);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: NotificationSettings) => {
    const settingsDocRef = doc(db, 'settings', 'popupNotification');
    const finalSettings = { ...newSettings };
    
    if (newSettings.imageUrl && newSettings.imageUrl.startsWith('data:image')) {
        finalSettings.imageUrl = await uploadImageToHost(newSettings.imageUrl);
    }

    await setDoc(settingsDocRef, finalSettings, { merge: true });
  };
  
  if (loading) {
    return null;
  }

  return (
    <NotificationContext.Provider value={{ settings, updateSettings }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

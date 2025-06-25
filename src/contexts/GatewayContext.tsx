
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export type PaymentGateway = {
  id: string;
  name: string;
  logoUrl: string;
  storeId: string;
  storePassword: string;
  apiUrl: string;
  enabled: boolean;
};

type NewGatewayPayload = Omit<PaymentGateway, 'id'>;

type GatewayContextType = {
  gateways: PaymentGateway[];
  addGateway: (gateway: NewGatewayPayload) => Promise<void>;
  updateGateway: (id: string, gateway: Partial<NewGatewayPayload>) => Promise<void>;
  deleteGateway: (id: string) => Promise<void>;
  loading: boolean;
};

const GatewayContext = createContext<GatewayContextType | undefined>(undefined);

const uploadImageToHost = async (dataUrl: string): Promise<string> => {
    if (!dataUrl.startsWith('data:image')) {
      return dataUrl;
    }
    try {
      const byteString = atob(dataUrl.split(',')[1]);
      const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const file = new File([blob], "image.png", { type: mimeString });
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://telegra.ph/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Image upload failed with status: ${response.status}`);
      
      const result = await response.json();
      if (result.error) throw new Error(result.error);

      if (Array.isArray(result) && result.length > 0 && result[0].src) {
        return `https://telegra.ph${result[0].src}`;
      } else {
        throw new Error('Invalid response from image host');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return "https://placehold.co/80x40.png";
    }
}

export const GatewayProvider = ({ children }: { children: ReactNode }) => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const gatewaysCollectionRef = collection(db, 'paymentGateways');
    const unsubscribe = onSnapshot(gatewaysCollectionRef, (snapshot) => {
      const gatewaysData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentGateway));
      setGateways(gatewaysData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addGateway = async (gatewayData: NewGatewayPayload) => {
    try {
      const finalData = { ...gatewayData };
      if (gatewayData.logoUrl.startsWith('data:image')) {
        finalData.logoUrl = await uploadImageToHost(gatewayData.logoUrl);
      }
      await addDoc(collection(db, 'paymentGateways'), finalData);
      toast({ title: "Success", description: "Payment gateway added successfully." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const updateGateway = async (id: string, gatewayData: Partial<NewGatewayPayload>) => {
    try {
        const finalData = { ...gatewayData };
        if (gatewayData.logoUrl && gatewayData.logoUrl.startsWith('data:image')) {
            finalData.logoUrl = await uploadImageToHost(gatewayData.logoUrl);
        }
      const gatewayDocRef = doc(db, 'paymentGateways', id);
      await updateDoc(gatewayDocRef, finalData);
      toast({ title: "Success", description: "Payment gateway updated successfully." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const deleteGateway = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this payment gateway?")) {
      try {
        const gatewayDocRef = doc(db, 'paymentGateways', id);
        await deleteDoc(gatewayDocRef);
        toast({ title: "Success", description: "Payment gateway deleted." });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: error.message });
      }
    }
  };

  return (
    <GatewayContext.Provider value={{ gateways, addGateway, updateGateway, deleteGateway, loading }}>
      {!loading ? children : null}
    </GatewayContext.Provider>
  );
};

export const useGateways = () => {
  const context = useContext(GatewayContext);
  if (context === undefined) {
    throw new Error('useGateways must be used within a GatewayProvider');
  }
  return context;
};

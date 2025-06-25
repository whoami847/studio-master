
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

export type Order = {
  id: string;
  user: string;
  userId: string;
  product: string;
  amount: number;
  date: any; 
  status: 'Completed' | 'Processing' | 'Failed';
};

type OrderContextType = {
  orders: Order[];
  userOrders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'userId' | 'user'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
        setUserOrders(orders.filter(order => order.userId === user.uid));
    } else {
        setUserOrders([]);
    }
  }, [user, orders]);


  const addOrder = async (order: Omit<Order, 'id' | 'date' | 'status' | 'userId' | 'user'>) => {
    if (!user) {
        console.error("No user logged in to place an order.");
        return;
    }
    const newOrder = {
      ...order,
      userId: user.uid,
      user: `${user.firstName} ${user.lastName}`,
      date: serverTimestamp(),
      status: 'Processing' as const
    };
    await addDoc(collection(db, "orders"), newOrder);
  };
  
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    const orderDocRef = doc(db, 'orders', orderId);
    const orderToUpdate = orders.find(o => o.id === orderId);

    if (!orderToUpdate) {
      console.error("Order not found!");
      return;
    }

    const previousStatus = orderToUpdate.status;

    // Do nothing if the status is not changing
    if (previousStatus === newStatus) {
      return;
    }

    try {
      // If changing to 'Failed' from a non-failed status, refund the user.
      if (newStatus === 'Failed' && previousStatus !== 'Failed') {
        const refundTransaction = {
          userId: orderToUpdate.userId,
          user: orderToUpdate.user,
          type: 'Top-up' as const,
          amount: orderToUpdate.amount,
          description: `Refund for failed order: ${orderToUpdate.product}`,
          date: serverTimestamp(),
          status: 'approved' as const,
        };
        await addDoc(collection(db, "transactions"), refundTransaction);
      }

      // If changing from 'Failed' back to 'Completed' or 'Processing', re-deduct the money.
      if (previousStatus === 'Failed' && (newStatus === 'Completed' || newStatus === 'Processing')) {
          const purchaseTransaction = {
            userId: orderToUpdate.userId,
            user: orderToUpdate.user,
            type: 'Purchase' as const,
            amount: orderToUpdate.amount,
            description: `Re-processing order: ${orderToUpdate.product}`,
            date: serverTimestamp(),
          };
          await addDoc(collection(db, "transactions"), purchaseTransaction);
      }

      // Finally, update the order status
      await updateDoc(orderDocRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, userOrders, addOrder, updateOrderStatus }}>
      {!loading ? children : null}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

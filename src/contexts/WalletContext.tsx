
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';


export type Transaction = {
  id: string;
  user: string;
  userId: string;
  type: 'Top-up' | 'Purchase';
  description?: string;
  amount: number;
  date: any;
  status?: 'pending' | 'approved' | 'rejected'; // For Top-ups
};

type WalletContextType = {
  balance: number;
  transactions: Transaction[];
  allTransactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'userId' | 'user'>) => Promise<void>;
  updateTopupStatus: (transactionId: string, status: 'approved' | 'rejected') => Promise<void>;
  adjustUserBalance: (userId: string, userName: string, amount: number, reason: string) => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "transactions"), (snapshot) => {
        const transData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)).sort((a, b) => b.date - a.date);
        setAllTransactions(transData);
        setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) {
        const filtered = allTransactions.filter(t => t.userId === user.uid);
        setUserTransactions(filtered);

        const newBalance = filtered.reduce((acc, curr) => {
            // Only 'approved' top-ups add to balance
            if (curr.type === 'Top-up') {
                return curr.status === 'approved' ? acc + curr.amount : acc;
            }
            // Purchases deduct from balance immediately
            if (curr.type === 'Purchase') {
                return acc - curr.amount;
            }
            return acc;
        }, 0);
        setBalance(newBalance);
    } else {
        setUserTransactions([]);
        setBalance(0);
    }
  }, [user, allTransactions]);


  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date' | 'userId' | 'user'>) => {
    if (!user) {
        console.error("No user to add transaction for.");
        return;
    }
    const newTransaction = {
      ...transaction,
      userId: user.uid,
      user: `${user.firstName} ${user.lastName}`,
      date: serverTimestamp(),
      description: transaction.description || `${transaction.type} of ৳${transaction.amount}`,
    };
    await addDoc(collection(db, "transactions"), newTransaction);
  };
  
  const updateTopupStatus = async (transactionId: string, status: 'approved' | 'rejected') => {
      const transactionDocRef = doc(db, 'transactions', transactionId);
      await updateDoc(transactionDocRef, { status });
  };
  
  const adjustUserBalance = async (userId: string, userName: string, amount: number, reason: string) => {
    if (amount === 0) return;

    const transactionType = amount > 0 ? 'Top-up' : 'Purchase';
    
    const newTransaction: Omit<Transaction, 'id' | 'date'> & { date: any } = {
      userId: userId,
      user: userName,
      type: transactionType,
      amount: Math.abs(amount),
      description: `Admin Adjustment: ${reason}`,
      date: serverTimestamp(),
      ...(transactionType === 'Top-up' && { status: 'approved' as const }),
    };
    
    await addDoc(collection(db, "transactions"), newTransaction);
  };


  const contextValue = { 
      balance, 
      transactions: userTransactions, 
      allTransactions, 
      addTransaction,
      updateTopupStatus,
      adjustUserBalance
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {!loading ? children : null}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

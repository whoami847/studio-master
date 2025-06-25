
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export type Tutorial = {
  id: string;
  link: string;
  thumbnail: string;
  createdAt: any;
};

type NewTutorialPayload = {
    link: string;
    thumbnail: string;
};

type TutorialContextType = {
  tutorials: Tutorial[];
  addTutorial: (tutorial: NewTutorialPayload) => Promise<void>;
  updateTutorial: (id: string, tutorial: NewTutorialPayload) => Promise<void>;
  deleteTutorial: (id: string) => Promise<void>;
  loading: boolean;
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export const TutorialProvider = ({ children }: { children: React.ReactNode }) => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tutorials"), (snapshot) => {
      const tutorialsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tutorial));
      setTutorials(tutorialsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTutorial = async (tutorial: NewTutorialPayload) => {
    await addDoc(collection(db, "tutorials"), { ...tutorial, createdAt: serverTimestamp() });
  };

  const updateTutorial = async (id: string, data: NewTutorialPayload) => {
    await updateDoc(doc(db, "tutorials", id), data);
  };
  
  const deleteTutorial = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete this tutorial?`)) {
        await deleteDoc(doc(db, "tutorials", id));
    }
  };
  
  const value = { tutorials, addTutorial, updateTutorial, deleteTutorial, loading };

  return (
    <TutorialContext.Provider value={value}>
      {!loading ? children : null}
    </TutorialContext.Provider>
  );
};

export const useTutorials = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorials must be used within a TutorialProvider');
  }
  return context;
};

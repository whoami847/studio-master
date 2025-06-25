
"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, googleProvider } from '@/lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot, collection, deleteDoc, updateDoc } from 'firebase/firestore';

export type User = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
};

export type AllUsersListItem = {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    joined: string;
    avatar: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  allUsers: AllUsersListItem[];
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
  deleteUser: (email: string) => Promise<void>;
  updateUserRole: (userId: string, newRole: 'admin' | 'user') => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<AllUsersListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocUnsubscribe = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            setUser({ uid: firebaseUser.uid, ...userDoc.data() } as User);
          } else {
            setUser(null);
          }
           setLoading(false);
        });
        return () => userDocUnsubscribe();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    const usersColRef = collection(db, 'users');
    const unsubscribe = onSnapshot(usersColRef, (snapshot) => {
        const usersData = snapshot.docs.map(doc => {
            const data = doc.data();
            const name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
            return {
                id: doc.id,
                name: name,
                email: data.email,
                role: data.role,
                joined: data.createdAt?.toDate().toISOString().split('T')[0] || 'N/A',
                avatar: data.avatar || `https://ui-avatars.com/api/?name=${name.replace(' ','+')}&background=random`,
            };
        });
        setAllUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDocRef = doc(db, "users", userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data().role === 'admin') {
        router.push('/admin');
    } else {
        router.push('/my-account');
    }
  };
  
  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const role = email === 'admin@example.com' ? 'admin' : 'user';
    await setDoc(userDocRef, {
      firstName,
      lastName,
      email,
      role,
      createdAt: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`
    });
    
    if (role === 'admin') {
        router.push('/admin');
    } else {
        router.push('/my-account');
    }
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    let userRole = 'user';
    if (userDoc.exists()) {
        userRole = userDoc.data().role;
    } else {
        const [firstName, ...lastNameParts] = firebaseUser.displayName?.split(' ') || ["", ""];
        const lastName = lastNameParts.join(' ');
        userRole = firebaseUser.email === 'admin@example.com' ? 'admin' : 'user';
        await setDoc(userDocRef, {
            firstName,
            lastName,
            email: firebaseUser.email,
            role: userRole,
            createdAt: new Date(),
            avatar: firebaseUser.photoURL,
        });
    }
    
    if (userRole === 'admin') {
        router.push('/admin');
    } else {
        router.push('/my-account');
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const deleteUser = async (email: string) => {
     if (window.confirm(`Are you sure you want to delete the user ${email}? This action is irreversible.`)) {
      if (user?.email === email) {
        alert("You cannot delete yourself.");
        return;
      }
      // Note: Deleting a user from Firebase Auth requires a server-side environment (Admin SDK).
      // This implementation will only delete the user from Firestore.
      const userToDelete = allUsers.find(u => u.email === email);
      if(userToDelete) {
         // This is a simplified approach. A real app needs a Cloud Function to find user by email and delete them.
         await deleteDoc(doc(db, 'users', userToDelete.id));
         alert("User deleted from database. For full deletion, remove user from Firebase Auth console.");
      }
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    if (user?.uid === userId) {
      alert("You cannot change your own role.");
      return;
    }
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: newRole });
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role.");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, allUsers, login, signup, signInWithGoogle, logout, deleteUser, updateUserRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

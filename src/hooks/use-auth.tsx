"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInAnonymously, signOut, type User as FirebaseUser } from 'firebase/auth';
import type { User, UserType } from '@/lib/types';
import { users } from '@/lib/data';
import { useToast } from './use-toast';

type AuthContextType = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (userType: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // User is signed in with Firebase. Now get our app-specific user profile.
        const userProfile = getUserProfileFromStorage();
        if (userProfile) {
          setCurrentUser(userProfile);
        } else {
          // This case can happen if localStorage is cleared but firebase session persists.
          // We'll log them out of our app state.
          logout();
        }
      } else {
        // User is signed out from Firebase.
        setCurrentUser(null);
        clearUserProfileFromStorage();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getUserProfileFromStorage = (): User | null => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  }

  const saveUserProfileToStorage = (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  const clearUserProfileFromStorage = () => {
     if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }

  const login = async (userType: UserType) => {
    setLoading(true);
    try {
      // Find the mock user profile for the selected role
      const userToLogin = users.find(u => u.user_type === userType);
      if (!userToLogin) {
        throw new Error("Invalid user role selected.");
      }
      
      // Sign in anonymously with Firebase
      await signInAnonymously(auth);

      // Set our application's user state and save to local storage
      setCurrentUser(userToLogin);
      saveUserProfileToStorage(userToLogin);

    } catch (error) {
      console.error("Firebase login error:", error);
      toast({
        variant: 'destructive',
        title: "Login Failed",
        description: "Could not sign in. Please try again."
      })
      setCurrentUser(null);
      clearUserProfileFromStorage();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
       console.error("Firebase signout error:", error);
       toast({
        variant: 'destructive',
        title: "Logout Failed",
        description: "Could not sign out properly. Please try again."
      })
    } finally {
      setCurrentUser(null);
      clearUserProfileFromStorage();
      setLoading(false);
    }
  };

  const value = useMemo(() => ({
    user: currentUser,
    firebaseUser,
    loading,
    login,
    logout,
  }), [currentUser, firebaseUser, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

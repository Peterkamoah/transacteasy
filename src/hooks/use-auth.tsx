"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode, useEffect } from 'react';
import type { User, UserType } from '@/lib/types';
import { users } from '@/lib/data';
import { useToast } from './use-toast';

// NOTE: The original Firebase-related code has been temporarily disabled 
// to allow the application to run without live credentials. It can be
// re-enabled in the future.
// import { auth, isFirebaseConfigured } from '@/lib/firebase';
// import { onAuthStateChanged, signInAnonymously, signOut, type User as FirebaseUser } from 'firebase/auth';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (userType: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // On initial load, check if a user session exists in local storage.
    setLoading(true);
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('currentUser');
    }
    setLoading(false);
  }, []);

  const login = (userType: UserType) => {
    setLoading(true);
    // Find the mock user profile for the selected role
    const userToLogin = users.find(u => u.user_type === userType);
    if (userToLogin) {
      setCurrentUser(userToLogin);
      // Save to local storage to simulate session persistence
      localStorage.setItem('currentUser', JSON.stringify(userToLogin));
    } else {
      toast({
        variant: 'destructive',
        title: "Login Failed",
        description: "Could not find a user for the selected role."
      });
    }
    setLoading(false);
  };

  const logout = () => {
    setLoading(true);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setLoading(false);
  };

  const value = useMemo(() => ({
    user: currentUser,
    loading,
    login,
    logout,
  }), [currentUser, loading]);

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

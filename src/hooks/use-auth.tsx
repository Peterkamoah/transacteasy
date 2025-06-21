"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { User, UserType } from '@/lib/types';
import { users } from '@/lib/data';

type AuthContextType = {
  user: User | null;
  login: (userType: UserType) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });

  const login = (userType: UserType) => {
    const userToLogin = users.find(u => u.user_type === userType);
    if (userToLogin) {
      setCurrentUser(userToLogin);
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(userToLogin));
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  };

  const value = useMemo(() => ({
    user: currentUser,
    login,
    logout,
  }), [currentUser]);

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

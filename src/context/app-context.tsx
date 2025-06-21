"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import type { User, Wallet, Invoice, Transaction, Organization, InvoiceStatus } from '@/lib/types';
import { 
    users as mockUsers, 
    wallets as mockWallets,
    invoices as mockInvoices,
    transactions as mockTransactions,
    organizations as mockOrganizations
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type AppContextType = {
  users: User[];
  wallets: Wallet[];
  invoices: Invoice[];
  transactions: Transaction[];
  organizations: Organization[];
  addUser: (newUser: Omit<User, 'user_id' | 'created_at' | 'updated_at' | 'is_active' | 'kyc_status'>) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: string) => void;
  addOrganization: (newOrg: Omit<Organization, 'organization_id' | 'created_at'>) => void;
  updateOrganization: (updatedOrg: Organization) => void;
  deleteOrganization: (orgId: string) => void;
  addInvoice: (newInvoice: Omit<Invoice, 'invoice_id' | 'created_at' | 'updated_at' | 'supplier_user_id'>, supplierId: string) => void;
  updateInvoiceStatus: (invoiceId: string, status: InvoiceStatus) => void;
  addTransaction: (newTx: Omit<Transaction, 'transaction_id' | 'timestamp'>) => void;
  manageWalletFunds: (userId: string, amount: number, currency: string, action: 'credit' | 'debit') => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [wallets, setWallets] = useState<Wallet[]>(mockWallets);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const { toast } = useToast();

  const addUser = useCallback((newUser: Omit<User, 'user_id' | 'created_at' | 'updated_at' | 'is_active' | 'kyc_status'>) => {
    const user: User = {
      ...newUser,
      user_id: `user${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true,
      kyc_status: 'pending',
    };
    setUsers(prev => [user, ...prev]);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.user_id === updatedUser.user_id ? updatedUser : u));
  }, []);

  const deleteUser = useCallback((userId: string) => {
    setUsers(prev => prev.filter(u => u.user_id !== userId));
  }, []);

  const addOrganization = useCallback((newOrg: Omit<Organization, 'organization_id' | 'created_at'>) => {
     const org: Organization = {
      ...newOrg,
      organization_id: `org${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setOrganizations(prev => [org, ...prev]);
  }, []);

  const updateOrganization = useCallback((updatedOrg: Organization) => {
    setOrganizations(prev => prev.map(o => o.organization_id === updatedOrg.organization_id ? updatedOrg : o));
  }, []);

  const deleteOrganization = useCallback((orgId: string) => {
    setOrganizations(prev => prev.filter(o => o.organization_id !== orgId));
  }, []);

  const addInvoice = useCallback((newInvoiceData: Omit<Invoice, 'invoice_id' | 'created_at' | 'updated_at' | 'supplier_user_id'>, supplierId: string) => {
    const invoice: Invoice = {
      ...newInvoiceData,
      invoice_id: `inv${Date.now()}`,
      supplier_user_id: supplierId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setInvoices(prev => [invoice, ...prev]);
  }, []);

  const updateInvoiceStatus = useCallback((invoiceId: string, status: InvoiceStatus) => {
    setInvoices(prev => prev.map(inv => inv.invoice_id === invoiceId ? { ...inv, status } : inv));
  }, []);

  const addTransaction = useCallback((newTx: Omit<Transaction, 'transaction_id' | 'timestamp'>) => {
    const transaction: Transaction = {
        ...newTx,
        transaction_id: `txn${Date.now()}`,
        timestamp: new Date().toISOString(),
    };
    setTransactions(prev => [transaction, ...prev]);
  }, []);

  const manageWalletFunds = useCallback((userId: string, amount: number, currency: string, action: 'credit' | 'debit') => {
    setWallets(prevWallets => {
      const targetWalletIndex = prevWallets.findIndex(w => w.user_id === userId && w.currency === currency);
      
      if (targetWalletIndex > -1) {
        return prevWallets.map((wallet, index) => {
          if (index === targetWalletIndex) {
            const newBalance = action === 'credit' ? wallet.balance + amount : wallet.balance - amount;
            return { ...wallet, balance: Math.max(0, newBalance) };
          }
          return wallet;
        });
      } else {
         if (action === 'credit') {
            const newWallet: Wallet = {
              wallet_id: `w${Date.now()}`,
              user_id: userId,
              currency: currency,
              balance: amount,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            return [...prevWallets, newWallet];
         }
      }
      return prevWallets;
    });
  }, []);

  const value = useMemo(() => ({
    users,
    wallets,
    invoices,
    transactions,
    organizations,
    receipts: [],
    addUser,
    updateUser,
    deleteUser,
    addOrganization,
    updateOrganization,
    deleteOrganization,
    addInvoice,
    updateInvoiceStatus,
    addTransaction,
    manageWalletFunds,
  }), [
    users, 
    wallets, 
    invoices, 
    transactions, 
    organizations, 
    addUser, 
    updateUser, 
    deleteUser, 
    addOrganization, 
    updateOrganization, 
    deleteOrganization,
    addInvoice,
    updateInvoiceStatus,
    addTransaction,
    manageWalletFunds
]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

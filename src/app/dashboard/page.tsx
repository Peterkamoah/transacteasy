"use client"

import { useMemo } from 'react';
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { DollarSign, Users, FileText, ArrowRightLeft } from "lucide-react";
import { invoices as mockInvoices, users as mockUsers, transactions as mockTransactions } from '@/lib/data';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const totalVolume = mockTransactions
      .filter(tx => tx.status === 'completed' && tx.transaction_type === 'invoice_payment')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const activeUsers = mockUsers.filter(u => u.is_active).length;
    
    const pendingInvoicesCount = mockInvoices.filter(inv => inv.status === 'unpaid').length;
    const pendingInvoicesValue = mockInvoices
        .filter(inv => inv.status === 'unpaid')
        .reduce((sum, inv) => sum + inv.amount_due, 0);

    const userTransactions = mockTransactions.filter(tx => tx.sender_user_id === user?.user_id || tx.receiver_user_id === user?.user_id);
    const userBalance = 75000; // Mock data for now

    return {
      admin: {
        totalVolume,
        activeUsers,
        pendingInvoicesCount,
        transactions24h: mockTransactions.length, // Mock
      },
      user: {
        totalBalance: userBalance,
        pendingInvoicesCount: user?.user_type === 'Importer' 
            ? mockInvoices.filter(inv => inv.importer_user_id === user?.user_id && inv.status === 'unpaid').length
            : mockInvoices.filter(inv => inv.supplier_user_id === user?.user_id && inv.status === 'unpaid').length,
        pendingInvoicesValue: user?.user_type === 'Importer' 
            ? mockInvoices.filter(inv => inv.importer_user_id === user?.user_id && inv.status === 'unpaid').reduce((sum, inv) => sum + inv.amount_due, 0)
            : mockInvoices.filter(inv => inv.supplier_user_id === user?.user_id && inv.status === 'unpaid').reduce((sum, inv) => sum + inv.amount_due, 0),
        recentTransactions: userTransactions.length,
      }
    }
  }, [user]);

  const renderAdminDashboard = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transaction Volume</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.admin.totalVolume.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
          <p className="text-xs text-muted-foreground">+2.5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{stats.admin.activeUsers}</div>
          <p className="text-xs text-muted-foreground">+1 since last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.admin.pendingInvoicesCount}</div>
          <p className="text-xs text-muted-foreground">Across all users</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions (All Time)</CardTitle>
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.admin.transactions24h}</div>
          <p className="text-xs text-muted-foreground">+1 since last hour</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderUserDashboard = () => (
     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance (USD)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.user.totalBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
           <p className="text-xs text-muted-foreground">Across all wallets</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.user.pendingInvoicesCount}</div>
          <p className="text-xs text-muted-foreground">${stats.user.pendingInvoicesValue.toLocaleString('en-US', {minimumFractionDigits: 2})} total due</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.user.recentTransactions}</div>
          <p className="text-xs text-muted-foreground">In the last 7 days</p>
        </CardContent>
      </Card>
       <Card className="bg-primary text-primary-foreground border-primary-foreground/20">
        <CardHeader>
          <CardTitle>Quick Action</CardTitle>
           <CardDescription className="text-primary-foreground/80">
             {user?.user_type === 'Supplier' ? 'Create and send a new invoice.' : 'Pay an outstanding invoice.'}
           </CardDescription>
        </CardHeader>
        <CardContent>
            <Button variant="secondary" className="w-full">
              {user?.user_type === 'Supplier' ? 'Create Invoice' : 'Pay Invoice'}
            </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    if (!user) return <div className="text-center text-muted-foreground">Please sign in to view your dashboard.</div>;

    switch (user.user_type) {
        case "Admin":
            return renderAdminDashboard();
        case "Importer":
        case "Supplier":
            return renderUserDashboard();
        default:
            return null;
    }
  }

  return (
    <div className="flex-1 space-y-4">
      <Header title="Dashboard" />
      <main className="p-4 md:p-6">
        {renderContent()}
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Welcome to TransactEasy!</CardTitle>
                <CardDescription>Your central hub for managing business transactions. Here, you can oversee invoices, track payments, and manage your digital wallets with ease. Use the navigation on the left to get started.</CardDescription>
            </CardHeader>
        </Card>
      </main>
    </div>
  );
}

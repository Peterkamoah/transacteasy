"use client"

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { DollarSign, Users, FileText, ArrowRightLeft, Lightbulb, Link as LinkIcon } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/app-context';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { CreateInvoiceForm } from '@/components/dashboard/invoices/create-invoice-form';
import type { Invoice } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const { users, invoices, transactions, addInvoice } = useAppContext();
  const [isCreateInvoiceOpen, setCreateInvoiceOpen] = useState(false);
  const router = useRouter();

  const stats = useMemo(() => {
    if (!users.length || !invoices.length || !transactions.length) {
        return { admin: {}, user: {} };
    }
      
    const totalVolume = transactions
      .filter(tx => tx.status === 'completed' && tx.transaction_type === 'invoice_payment')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const activeUsers = users.filter(u => u.is_active).length;
    
    const pendingInvoicesCount = invoices.filter(inv => inv.status === 'unpaid').length;

    const userTransactions = transactions.filter(tx => tx.sender_user_id === user?.user_id || tx.receiver_user_id === user?.user_id);
    const userBalance = 75000; // Mock data for now

    const monthlyVolume = transactions.reduce((acc, tx) => {
        const month = new Date(tx.timestamp).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + tx.amount;
        return acc;
    }, {} as {[key: string]: number});

    const chartData = Object.keys(monthlyVolume).map(month => ({
        name: month,
        total: monthlyVolume[month],
    }));

    return {
      admin: {
        totalVolume,
        activeUsers,
        pendingInvoicesCount,
        transactionsCount: transactions.length,
        chartData
      },
      user: {
        totalBalance: userBalance,
        pendingInvoicesCount: user?.user_type === 'Importer' 
            ? invoices.filter(inv => inv.importer_user_id === user?.user_id && inv.status === 'unpaid').length
            : invoices.filter(inv => inv.supplier_user_id === user?.user_id && inv.status === 'unpaid').length,
        pendingInvoicesValue: user?.user_type === 'Importer' 
            ? invoices.filter(inv => inv.importer_user_id === user?.user_id && inv.status === 'unpaid').reduce((sum, inv) => sum + inv.amount_due, 0)
            : invoices.filter(inv => inv.supplier_user_id === user?.user_id && inv.status === 'unpaid').reduce((sum, inv) => sum + inv.amount_due, 0),
        recentTransactions: userTransactions.length,
      }
    }
  }, [user, users, invoices, transactions]);

  const handleCreateInvoice = (newInvoiceData: Omit<Invoice, 'invoice_id' | 'created_at' | 'updated_at' | 'supplier_user_id'>) => {
    if (!user || user.user_type !== 'Supplier') return;
    addInvoice(newInvoiceData, user.user_id);
    setCreateInvoiceOpen(false);
  };
  
  const handleQuickAction = () => {
    if (user?.user_type === 'Supplier') {
      setCreateInvoiceOpen(true);
    }
    if (user?.user_type === 'Importer') {
      router.push('/dashboard/invoices');
    }
  }

  const renderAdminDashboard = () => (
    <>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Transaction Volume</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.admin.totalVolume?.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
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
          <div className="text-2xl font-bold">{stats.admin.transactionsCount}</div>
          <p className="text-xs text-muted-foreground">+1 since last hour</p>
        </CardContent>
      </Card>
    </div>
    <Card className="mt-6">
        <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <CardDescription>A summary of transaction volume over the last few months.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats.admin.chartData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <Tooltip
                        cursor={{fill: 'hsl(var(--muted))'}}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col space-y-1">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      {payload[0].payload.name}
                                    </span>
                                    <span className="font-bold text-muted-foreground">
                                       {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(payload[0].value as number)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                    />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
    </>
  );

  const renderUserDashboard = () => (
     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance (USD)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.user.totalBalance?.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
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
          <p className="text-xs text-muted-foreground">${stats.user.pendingInvoicesValue?.toLocaleString('en-US', {minimumFractionDigits: 2})} total due</p>
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
            <Button variant="secondary" className="w-full" onClick={handleQuickAction}>
              {user?.user_type === 'Supplier' ? 'Create Invoice' : 'Pay Invoice'}
            </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderWelcome = () => (
      <Card className="mb-6 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
          <CardHeader>
              <CardTitle>Welcome back, {user?.business_name}!</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                  Here's your central hub for managing business transactions. Use the navigation on the left to get started.
              </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
              <Button variant="secondary" asChild>
                  <a href="/dashboard/settings"><Lightbulb className="mr-2 h-4 w-4" />Update Profile</a>
              </Button>
               <Button variant="ghost" className="hover:bg-primary-foreground/20 hover:text-primary-foreground" asChild>
                  <a href="#"><LinkIcon className="mr-2 h-4 w-4" />Read Docs</a>
              </Button>
          </CardContent>
      </Card>
  )

  const renderContent = () => {
    if (!user) return <div className="text-center text-muted-foreground">Please sign in to view your dashboard.</div>;

    let dashboardContent;
    switch (user.user_type) {
        case "Admin":
            dashboardContent = renderAdminDashboard();
            break;
        case "Importer":
        case "Supplier":
            dashboardContent = renderUserDashboard();
            break;
        default:
            dashboardContent = null;
    }

    return (
        <>
            {renderWelcome()}
            {dashboardContent}
        </>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-6">
      {renderContent()}
      <Dialog open={isCreateInvoiceOpen} onOpenChange={setCreateInvoiceOpen}>
          <DialogContent>
              <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>Fill in the details to create a new invoice.</DialogDescription>
              </DialogHeader>
              <CreateInvoiceForm onInvoiceCreated={handleCreateInvoice} />
          </DialogContent>
      </Dialog>
    </div>
  );
}

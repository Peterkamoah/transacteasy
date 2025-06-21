"use client";

import { Header } from '@/components/dashboard/header';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, ArrowDown, ArrowUp, PlusCircle } from 'lucide-react';
import { AdminWalletForm } from '@/components/dashboard/wallets/admin-wallet-form';
import type { Wallet } from '@/lib/types';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';
import { getBusinessName } from '@/lib/utils';

export default function WalletsPage() {
  const { user } = useAuth();
  const { wallets, users, manageWalletFunds } = useAppContext();
  const [isManageFundsOpen, setManageFundsOpen] = useState(false);

  const userWallets = user?.user_type === 'Admin' 
    ? wallets
    : wallets.filter(w => w.user_id === user?.user_id);

  const handleFundsManaged = (userId: string, amount: number, currency: string, action: 'credit' | 'debit') => {
    manageWalletFunds(userId, amount, currency, action);
    setManageFundsOpen(false);
  }

  return (
    <div className="flex-1 space-y-4">
      <Header title="Wallets" />
      <main className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Your Digital Wallets</h2>
                <p className="text-muted-foreground">Manage your funds across different currencies.</p>
            </div>
             {user?.user_type === 'Admin' && (
               <Dialog open={isManageFundsOpen} onOpenChange={setManageFundsOpen}>
                <DialogTrigger asChild>
                  <Button>Manage Funds</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Credit/Debit User Wallet</DialogTitle>
                    <DialogDescription>Select a user and amount to modify their balance.</DialogDescription>
                  </DialogHeader>
                  <AdminWalletForm users={users.filter(u => u.user_type !== 'Admin')} onFundsManaged={handleFundsManaged} />
                </DialogContent>
              </Dialog>
            )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userWallets.map((wallet) => (
            <Card key={wallet.wallet_id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{wallet.currency} Wallet</CardTitle>
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-extrabold tracking-tighter">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: wallet.currency }).format(wallet.balance)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {user?.user_type === 'Admin' ? `User: ${getBusinessName(wallet.user_id, users)}` : 'Available Balance'}
                </p>
                <div className="flex mt-4 gap-2">
                    <Button size="sm" variant="outline" disabled>
                        <ArrowDown className="mr-2 h-4 w-4" /> Deposit
                    </Button>
                    <Button size="sm" variant="outline" disabled>
                        <ArrowUp className="mr-2 h-4 w-4" /> Withdraw
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
           <Card className="border-2 border-dashed flex items-center justify-center flex-col min-h-[190px] hover:border-primary hover:text-primary transition-colors cursor-pointer bg-muted/25 hover:bg-muted/50">
              <PlusCircle className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
              <p className="text-sm font-medium mt-2 text-muted-foreground group-hover:text-primary transition-colors">Add New Currency Wallet</p>
          </Card>
        </div>
      </main>
    </div>
  );
}

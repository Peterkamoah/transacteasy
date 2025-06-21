"use client";

import { Header } from '@/components/dashboard/header';
import { useAuth } from '@/hooks/use-auth';
import { wallets as mockWallets } from '@/lib/data';
import type { Wallet } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, ArrowDown, ArrowUp } from 'lucide-react';


const AdminWalletForm = () => {
  const { toast } = useToast();
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      toast({ title: "Success!", description: "Funds operation completed." });
      // Logic for crediting/debiting wallet
    }}>
      <div className="grid gap-4 py-4">
        <p className="text-sm text-muted-foreground">Admin wallet operation form fields (user select, amount, currency, action) would be here.</p>
      </div>
      <DialogFooter>
        <Button type="submit">Execute</Button>
      </DialogFooter>
    </form>
  )
}


export default function WalletsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const userWallets = user?.user_type === 'Admin' 
    ? mockWallets 
    : mockWallets.filter(w => w.user_id === user?.user_id);

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
               <Dialog>
                <DialogTrigger asChild>
                  <Button>Manage Funds</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Credit/Debit User Wallet</DialogTitle>
                    <DialogDescription>Select a user and amount to modify their balance.</DialogDescription>
                  </DialogHeader>
                  <AdminWalletForm />
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
                  {user?.user_type === 'Admin' ? `User ID: ${wallet.user_id}` : 'Available Balance'}
                </p>
                <div className="flex mt-4 gap-2">
                    <Button size="sm" variant="outline">
                        <ArrowDown className="mr-2 h-4 w-4" /> Deposit
                    </Button>
                    <Button size="sm" variant="outline">
                        <ArrowUp className="mr-2 h-4 w-4" /> Withdraw
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
           <Card className="border-dashed flex items-center justify-center flex-col">
              <Button variant="ghost" className="h-20 w-20 rounded-full text-muted-foreground">
                <div className="text-4xl">+</div>
              </Button>
              <p className="text-sm font-medium mt-2">Add New Currency Wallet</p>
          </Card>
        </div>
      </main>
    </div>
  );
}

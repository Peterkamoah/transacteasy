"use client";

import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { transactions as mockTransactions, users as mockUsers } from '@/lib/data';
import { format } from 'date-fns';

export default function TransactionsPage() {
  const { user } = useAuth();
  
  const getBusinessName = (userId: string) => mockUsers.find(u => u.user_id === userId)?.business_name || 'System';

  const userTransactions = mockTransactions.filter(tx => 
    user?.user_type === 'Admin' || 
    tx.sender_user_id === user?.user_id || 
    tx.receiver_user_id === user?.user_id
  );

  const getTxnIconAndPeer = (tx: (typeof mockTransactions)[0]) => {
    const isSender = tx.sender_user_id === user?.user_id;
    if (tx.transaction_type === 'admin_credit') {
      return { Icon: ArrowDownLeft, peer: 'Admin Credit', color: 'text-green-500' };
    }
    if (tx.transaction_type === 'admin_debit') {
      return { Icon: ArrowUpRight, peer: 'Admin Debit', color: 'text-red-500' };
    }
    if (isSender) {
       return { Icon: ArrowUpRight, peer: getBusinessName(tx.receiver_user_id), color: 'text-red-500' };
    }
    return { Icon: ArrowDownLeft, peer: getBusinessName(tx.sender_user_id), color: 'text-green-500' };
  };

  return (
    <div className="flex-1 space-y-4">
      <Header title="Transactions" />
      <main className="p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>A record of all your financial movements.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userTransactions.map((tx) => {
                  const { Icon, peer, color } = getTxnIconAndPeer(tx);
                  return (
                    <TableRow key={tx.transaction_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <Icon className={`h-5 w-5 ${color}`} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{peer}</div>
                        <div className="text-sm text-muted-foreground capitalize">{tx.transaction_type.replace('_', ' ')}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status === 'completed' ? 'secondary' : 'destructive'} className={tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${color}`}>
                        {tx.sender_user_id === user?.user_id ? '-' : '+'} ${tx.amount.toFixed(2)} {tx.currency}
                      </TableCell>
                       <TableCell className="text-right text-sm text-muted-foreground">
                        {format(new Date(tx.timestamp), 'MMM d, yyyy, hh:mm a')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

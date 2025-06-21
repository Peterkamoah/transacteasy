"use client";

import { Header } from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { getBusinessName } from '@/lib/utils';
import { useAppContext } from '@/context/app-context';

export default function TransactionsPage() {
  const { user } = useAuth();
  const { transactions, users } = useAppContext();
  
  const userTransactions = transactions.filter(tx => 
    user?.user_type === 'Admin' || 
    tx.sender_user_id === user?.user_id || 
    tx.receiver_user_id === user?.user_id
  );

  const getTxnIconAndPeer = (tx: Transaction) => {
    const isSender = tx.sender_user_id === user?.user_id;
    if (tx.transaction_type === 'admin_credit') {
      return { Icon: ArrowDownLeft, peer: 'Admin Credit', color: 'text-success' };
    }
    if (tx.transaction_type === 'admin_debit') {
      return { Icon: ArrowUpRight, peer: 'Admin Debit', color: 'text-destructive' };
    }
    if (isSender) {
       return { Icon: ArrowUpRight, peer: getBusinessName(tx.receiver_user_id, users), color: 'text-destructive' };
    }
    return { Icon: ArrowDownLeft, peer: getBusinessName(tx.sender_user_id, users), color: 'text-success' };
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
                        <div className="text-sm text-muted-foreground capitalize">{tx.transaction_type.replace(/_/g, ' ')}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status === 'completed' ? 'success' : 'destructive'}>
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

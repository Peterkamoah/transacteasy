"use client";

import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, CreditCard, Receipt } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { invoices as mockInvoices, users as mockUsers } from '@/lib/data';
import type { Invoice } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const CreateInvoiceForm = () => {
  // In a real app, this would use react-hook-form and zod for validation
  const { toast } = useToast();
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      toast({ title: "Success!", description: "Invoice created and sent." });
      // Here you would call a server action or API to create the invoice
    }}>
      <div className="grid gap-4 py-4">
        {/* Form fields for creating invoice would go here */}
        <p className="text-sm text-muted-foreground">Invoice creation form fields would be here. Submitting will show a success toast.</p>
      </div>
       <DialogFooter>
          <Button type="submit">Create Invoice</Button>
        </DialogFooter>
    </form>
  )
}

export default function InvoicesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  const handlePayInvoice = (invoiceId: string) => {
    // Simulate payment logic
    setInvoices(prev => prev.map(inv => inv.invoice_id === invoiceId ? { ...inv, status: 'paid' } : inv));
    toast({
      title: "Payment Successful",
      description: `Invoice ${invoices.find(i=>i.invoice_id === invoiceId)?.invoice_number} has been paid.`,
    });
  };
  
  const getBusinessName = (userId: string) => mockUsers.find(u => u.user_id === userId)?.business_name || 'Unknown';

  const userInvoices = invoices.filter(inv => 
    user?.user_type === 'Admin' || 
    inv.importer_user_id === user?.user_id || 
    inv.supplier_user_id === user?.user_id
  );

  return (
    <div className="flex-1 space-y-4">
      <Header title="Invoices" />
      <main className="p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Manage your incoming and outgoing invoices.</CardDescription>
            </div>
            {user?.user_type === 'Supplier' && (
               <Dialog>
                <DialogTrigger asChild>
                  <Button className="ml-auto gap-1" size="sm">
                    <PlusCircle className="h-4 w-4" />
                    Create Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>Fill in the details to create a new invoice.</DialogDescription>
                  </DialogHeader>
                  <CreateInvoiceForm />
                </DialogContent>
              </Dialog>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>{user?.user_type === 'Importer' ? 'From' : 'To'}</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userInvoices.map((invoice) => (
                  <TableRow key={invoice.invoice_id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>
                      {user?.user_type === 'Importer' 
                        ? getBusinessName(invoice.supplier_user_id) 
                        : getBusinessName(invoice.importer_user_id)}
                    </TableCell>
                    <TableCell>${invoice.amount_due.toFixed(2)} {invoice.currency}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'paid' ? 'secondary' : 'default'} className={invoice.status === 'unpaid' ? 'bg-amber-500' : invoice.status === 'overdue' ? 'bg-red-500' : 'bg-green-500'}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{format(new Date(invoice.due_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          {user?.user_type === 'Importer' && invoice.status === 'unpaid' && (
                            <DropdownMenuItem onClick={() => handlePayInvoice(invoice.invoice_id)}>
                              <CreditCard className="mr-2 h-4 w-4" /> Pay Invoice
                            </DropdownMenuItem>
                          )}
                          {invoice.status === 'paid' && (
                            <DropdownMenuItem>
                               <Receipt className="mr-2 h-4 w-4" /> View Receipt
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

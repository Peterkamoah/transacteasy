"use client";

import { useState } from 'react';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, CreditCard, Receipt, Eye, QrCode } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import type { Invoice, Receipt as ReceiptType } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { CreateInvoiceForm } from '@/components/dashboard/invoices/create-invoice-form';
import { getBusinessName } from '@/lib/utils';
import { QrCodeDialog } from '@/components/dashboard/invoices/qr-code-dialog';
import { InvoiceDetailsDialog } from '@/components/dashboard/invoices/invoice-details-dialog';
import { InvoiceReceiptDialog } from '@/components/dashboard/invoices/invoice-receipt-dialog';
import { KycStatusBadge } from '@/components/dashboard/kyc-status-badge';
import { useAppContext } from '@/context/app-context';

export default function InvoicesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { invoices, receipts, users, addInvoice, updateInvoiceStatus, addTransaction } = useAppContext();
  
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dialogType, setDialogType] = useState<'details' | 'receipt' | null>(null);

  const handleCreateInvoice = (newInvoiceData: Omit<Invoice, 'invoice_id' | 'created_at' | 'updated_at' | 'supplier_user_id'>) => {
    if (!user || user.user_type !== 'Supplier') return;
    addInvoice(newInvoiceData, user.user_id);
    setCreateOpen(false);
  }

  const handlePayInvoice = (invoiceId: string, invoiceNumber: string, amount: number, currency: string) => {
    updateInvoiceStatus(invoiceId, 'paid');
    
    const paidInvoice = invoices.find(inv => inv.invoice_id === invoiceId);
    if (user && paidInvoice) {
        addTransaction({
            sender_user_id: user.user_id,
            receiver_user_id: paidInvoice.supplier_user_id,
            amount,
            currency,
            transaction_type: 'invoice_payment',
            status: 'completed',
            invoice_id: invoiceId,
        });
    }

    toast({
      variant: "success",
      title: "Payment Successful",
      description: `Invoice ${invoiceNumber} has been paid.`,
    });
  };

  const handleOpenDialog = (invoice: Invoice, type: 'details' | 'receipt') => {
    setSelectedInvoice(invoice);
    setDialogType(type);
  }

  const handleCloseDialog = () => {
    setSelectedInvoice(null);
    setDialogType(null);
  }

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
               <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
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
                  <CreateInvoiceForm onInvoiceCreated={handleCreateInvoice} />
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
                        ? getBusinessName(invoice.supplier_user_id, users) 
                        : getBusinessName(invoice.importer_user_id, users)}
                    </TableCell>
                    <TableCell>${invoice.amount_due.toFixed(2)} {invoice.currency}</TableCell>
                    <TableCell>
                      <KycStatusBadge status={invoice.status as any} />
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
                          <DropdownMenuItem onClick={() => handleOpenDialog(invoice, 'details')}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          {user?.user_type === 'Importer' && invoice.status === 'unpaid' && (
                            <>
                              <DropdownMenuItem onClick={() => handlePayInvoice(invoice.invoice_id, invoice.invoice_number, invoice.amount_due, invoice.currency)}>
                                <CreditCard className="mr-2 h-4 w-4" /> Pay Invoice
                              </DropdownMenuItem>
                               <QrCodeDialog invoice={invoice}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <QrCode className="mr-2 h-4 w-4" /> Pay with QR
                                </DropdownMenuItem>
                              </QrCodeDialog>
                            </>
                          )}
                          {invoice.status === 'paid' && (
                            <DropdownMenuItem onClick={() => handleOpenDialog(invoice, 'receipt')}>
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

        {selectedInvoice && dialogType === 'details' && (
            <InvoiceDetailsDialog 
                isOpen={true} 
                onClose={handleCloseDialog} 
                invoice={selectedInvoice}
                users={users}
            />
        )}
        
        {selectedInvoice && dialogType === 'receipt' && (
            <InvoiceReceiptDialog 
                isOpen={true} 
                onClose={handleCloseDialog} 
                invoice={selectedInvoice}
                users={users}
                receipt={receipts.find(r => r.invoice_id === selectedInvoice.invoice_id)} 
            />
        )}

      </main>
    </div>
  );
}

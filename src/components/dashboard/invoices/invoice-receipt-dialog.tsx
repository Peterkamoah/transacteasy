"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { getBusinessName } from '@/lib/utils';
import type { Invoice, Receipt, User } from '@/lib/types';
import { format } from 'date-fns';
import { CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type InvoiceReceiptDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  receipt?: Receipt;
  users: User[];
}

export function InvoiceReceiptDialog({ isOpen, onClose, invoice, receipt, users }: InvoiceReceiptDialogProps) {
  const { toast } = useToast();

  if (!invoice || !receipt) return (
     <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receipt Not Found</DialogTitle>
            <DialogDescription>
              A receipt could not be found for this invoice.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
  );

  const handleDownload = () => {
    toast({
        title: "Downloading Receipt...",
        description: "Your receipt PDF download will start shortly.",
    });
  }

  const supplierName = getBusinessName(invoice.supplier_user_id, users);
  const importerName = getBusinessName(invoice.importer_user_id, users);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-success" />
            <span>Payment Receipt</span>
          </DialogTitle>
          <DialogDescription>
            Receipt <span className="font-mono">{receipt.receipt_number}</span> for Invoice <span className="font-mono">{invoice.invoice_number}</span>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4 text-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-muted-foreground">Paid by</p>
              <p className="font-semibold">{importerName}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground">Paid to</p>
              <p className="font-semibold">{supplierName}</p>
            </div>
          </div>
          <Separator />
           <div className="grid grid-cols-2 gap-4">
             <div>
                <h4 className="font-semibold text-muted-foreground">Transaction ID</h4>
                <p className="font-mono">{receipt.transaction_id}</p>
            </div>
            <div>
                <h4 className="font-semibold text-muted-foreground">Payment Date</h4>
                <p>{format(new Date(receipt.generation_date), 'MMM d, yyyy, hh:mm a')}</p>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-4 items-center bg-success/10 p-4 rounded-lg border border-success/20">
             <h4 className="font-semibold text-success">Amount Paid</h4>
             <p className="text-2xl font-bold text-right text-success">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount_due)}
             </p>
           </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

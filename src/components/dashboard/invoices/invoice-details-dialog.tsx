"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { getBusinessName } from '@/lib/utils';
import type { Invoice, User } from '@/lib/types';
import { format } from 'date-fns';
import { KycStatusBadge } from '../kyc-status-badge';

type InvoiceDetailsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  users: User[];
}

export function InvoiceDetailsDialog({ isOpen, onClose, invoice, users }: InvoiceDetailsDialogProps) {
  if (!invoice) return null;

  const supplierName = getBusinessName(invoice.supplier_user_id, users);
  const importerName = getBusinessName(invoice.importer_user_id, users);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>
            Invoice <span className="font-mono">{invoice.invoice_number}</span>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-muted-foreground">From</h4>
              <p className="font-medium">{supplierName}</p>
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground">To</h4>
              <p className="font-medium">{importerName}</p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-3 gap-4">
             <div>
                <h4 className="font-semibold text-muted-foreground">Issue Date</h4>
                <p>{format(new Date(invoice.issue_date), 'MMM d, yyyy')}</p>
            </div>
            <div>
                <h4 className="font-semibold text-muted-foreground">Due Date</h4>
                <p>{format(new Date(invoice.due_date), 'MMM d, yyyy')}</p>
            </div>
            <div>
              <h4 className="font-semibold text-muted-foreground">Status</h4>
              <KycStatusBadge status={invoice.status as any} />
            </div>
          </div>
           <Separator />
           <div className="grid grid-cols-2 gap-4 items-center bg-muted/50 p-4 rounded-lg">
             <h4 className="font-semibold">Amount Due</h4>
             <p className="text-2xl font-bold text-right text-primary">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount_due)}
             </p>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

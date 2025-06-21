"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import QRCode from "qrcode.react";
import type { Invoice } from '@/lib/types';

type QrCodeDialogProps = {
  invoice: Invoice;
  children: React.ReactNode;
}

export function QrCodeDialog({ invoice, children }: QrCodeDialogProps) {
  // In a real app, this QR code would contain a signed payload or a URL 
  // to a payment gateway. For this simulation, we'll just encode the invoice details.
  const qrValue = JSON.stringify({
    invoiceId: invoice.invoice_id,
    invoiceNumber: invoice.invoice_number,
    amount: invoice.amount_due,
    currency: invoice.currency,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
           <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/29/Alipay_logo.svg" alt="Alipay" className="h-6" />
            <DialogTitle>Pay with Alipay</DialogTitle>
           </div>
          <DialogDescription>
            Scan the QR code with your Alipay app to pay <strong>${invoice.amount_due.toFixed(2)} {invoice.currency}</strong> for invoice {invoice.invoice_number}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center p-6 bg-white rounded-md mt-4">
           <QRCode value={qrValue} size={256} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { users } from '@/lib/data';
import type { Invoice } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

const formSchema = z.object({
  importer_user_id: z.string({ required_error: "Please select an importer." }),
  invoice_number: z.string().min(1, "Invoice number is required."),
  amount_due: z.coerce.number().positive("Amount must be positive."),
  currency: z.enum(['USD', 'EUR'], { required_error: "Please select a currency." }),
  due_date: z.date({ required_error: "A due date is required." }),
  status: z.literal('unpaid'),
  issue_date: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

const importers = users.filter(u => u.user_type === 'Importer');

type CreateInvoiceFormProps = {
  onInvoiceCreated: (data: FormValues) => void;
}

export const CreateInvoiceForm = ({ onInvoiceCreated }: CreateInvoiceFormProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount_due: 0,
      status: 'unpaid',
      issue_date: new Date().toISOString().split('T')[0], // Today's date
    },
  });

  const onSubmit = (data: FormValues) => {
    onInvoiceCreated(data);
    toast({ 
      variant: "success",
      title: "Success!", 
      description: `Invoice ${data.invoice_number} created and sent.` 
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
          <FormField
            control={form.control}
            name="importer_user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bill To (Importer)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an importer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {importers.map(importer => (
                      <SelectItem key={importer.user_id} value={importer.user_id}>
                        {importer.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl><Input placeholder="e.g. SI-2024-005" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="amount_due"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Due</FormLabel>
                  <FormControl><Input type="number" placeholder="1000.00" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Create Invoice</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

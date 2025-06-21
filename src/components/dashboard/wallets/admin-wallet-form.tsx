
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { User } from '@/lib/types';

const formSchema = z.object({
  user_id: z.string({ required_error: "Please select a user." }).min(1, "Please select a user."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  currency: z.enum(['USD', 'EUR'], { required_error: "Please select a currency." }),
  action: z.enum(['credit', 'debit'], { required_error: "Please select an action." }),
});

type FormValues = z.infer<typeof formSchema>;

type AdminWalletFormProps = {
  users: User[];
  onFundsManaged: (userId: string, amount: number, currency: string, action: 'credit' | 'debit') => void;
}

export const AdminWalletForm = ({ users, onFundsManaged }: AdminWalletFormProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action: 'credit',
      user_id: '',
      amount: 0,
      currency: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    onFundsManaged(data.user_id, data.amount, data.currency, data.action);
    const userName = users.find(u => u.user_id === data.user_id)?.business_name;
    toast({
      variant: "success",
      title: "Success!",
      description: `Successfully ${data.action}ed ${data.amount} ${data.currency} for ${userName}.`
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user to manage funds" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.business_name} ({user.user_type})
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
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1000.00" 
                    {...field} 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
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
                <Select onValueChange={field.onChange} value={field.value}>
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
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Action</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-4"
                  >
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="credit" /></FormControl>
                      <FormLabel className="font-normal">Credit (Add)</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><RadioGroupItem value="debit" /></FormControl>
                      <FormLabel className="font-normal">Debit (Remove)</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Execute Transaction</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

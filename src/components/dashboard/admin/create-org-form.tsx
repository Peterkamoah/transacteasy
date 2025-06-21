"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Organization } from '@/lib/types';

const formSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

type CreateOrgFormProps = {
  onOrgCreated: (data: FormValues) => void;
}

export const CreateOrgForm = ({ onOrgCreated }: CreateOrgFormProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    onOrgCreated(data);
    toast({ 
      variant: "success",
      title: "Success!", 
      description: `Organization "${data.name}" created.` 
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Global Imports Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <Button type="submit">Create Organization</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

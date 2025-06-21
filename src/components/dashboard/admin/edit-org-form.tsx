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
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

type EditOrgFormProps = {
  organization: Organization;
  onOrgUpdated: (data: Organization) => void;
}

export const EditOrgForm = ({ organization, onOrgUpdated }: EditOrgFormProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: organization.name,
    },
  });

  useEffect(() => {
    form.reset({ name: organization.name });
  }, [organization, form]);

  const onSubmit = (data: FormValues) => {
    onOrgUpdated({ ...organization, ...data });
    toast({ 
      variant: "success",
      title: "Success!", 
      description: `Organization "${data.name}" updated.` 
    });
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
          <Button type="submit">Save Changes</Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

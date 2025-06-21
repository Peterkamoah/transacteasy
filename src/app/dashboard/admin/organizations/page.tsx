"use client";

import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2 } from 'lucide-react';
import type { Organization } from '@/lib/types';
import { format } from 'date-fns';
import { CreateOrgForm } from '@/components/dashboard/admin/create-org-form';
import { DeleteOrgDialog } from '@/components/dashboard/admin/delete-org-dialog';
import { EditOrgForm } from '@/components/dashboard/admin/edit-org-form';
import { useState } from 'react';
import { useAppContext } from '@/context/app-context';

export default function OrganizationsPage() {
  const { organizations, addOrganization, updateOrganization, deleteOrganization } = useAppContext();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);

  const handleOrgCreated = (newOrg: Omit<Organization, 'organization_id' | 'created_at'>) => {
    addOrganization(newOrg);
    setCreateOpen(false);
  };
  
  const handleOrgUpdated = (updatedOrg: Organization) => {
    updateOrganization(updatedOrg);
    setEditingOrg(null);
  }

  const handleOrgDeleted = (orgId: string) => {
    deleteOrganization(orgId);
  }

  return (
    <div className="flex-1 space-y-4">
      <Header title="Organizations" />
      <main className="p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Organizations</CardTitle>
              <CardDescription>Manage business organizations on the platform.</CardDescription>
            </div>
             <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="ml-auto gap-1" size="sm">
                  <PlusCircle className="h-4 w-4" />
                  Create Organization
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Organization</DialogTitle>
                </DialogHeader>
                <CreateOrgForm onOrgCreated={handleOrgCreated} />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization Name</TableHead>
                  <TableHead>Organization ID</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizations.map((org) => (
                  <TableRow key={org.organization_id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{org.organization_id}</TableCell>
                    <TableCell>{format(new Date(org.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                       <Dialog open={!!editingOrg && editingOrg.organization_id === org.organization_id} onOpenChange={() => setEditingOrg(null)}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingOrg(org)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DeleteOrgDialog orgId={org.organization_id} orgName={org.name} onOrgDeleted={handleOrgDeleted}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                            </DeleteOrgDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Organization</DialogTitle>
                          </DialogHeader>
                          {editingOrg && <EditOrgForm organization={editingOrg} onOrgUpdated={handleOrgUpdated} />}
                        </DialogContent>
                      </Dialog>
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

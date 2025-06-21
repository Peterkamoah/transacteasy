"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2, Eye } from 'lucide-react';
import type { User } from '@/lib/types';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateUserForm } from '@/components/dashboard/admin/create-user-form';
import { DeleteUserDialog } from '@/components/dashboard/admin/delete-user-dialog';
import { EditUserForm } from '@/components/dashboard/admin/edit-user-form';
import { getInitials } from '@/lib/utils';
import { KycStatusBadge } from '@/components/dashboard/kyc-status-badge';
import { useAppContext } from '@/context/app-context';

export default function UsersPage() {
  const { users, addUser, updateUser, deleteUser } = useAppContext();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const handleUserCreated = (newUser: Omit<User, 'user_id'|'created_at'|'updated_at'|'is_active'|'kyc_status'>) => {
    addUser(newUser);
    setCreateOpen(false);
  }

  const handleUserUpdated = (updatedUser: User) => {
    updateUser(updatedUser);
    setEditingUser(null);
  }

  const handleUserDeleted = (userId: string) => {
    deleteUser(userId);
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage users on the platform.</CardDescription>
          </div>
           <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto gap-1" size="sm">
                <PlusCircle className="h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <CreateUserForm onUserCreated={handleUserCreated} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>KYC Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.user_id}>
                   <TableCell className="hidden sm:table-cell">
                      <Avatar>
                        <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.business_name} />
                        <AvatarFallback>{getInitials(user.business_name)}</AvatarFallback>
                      </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.business_name}</div>
                    <div className="hidden text-sm text-muted-foreground md:block">{user.email}</div>
                  </TableCell>
                  <TableCell>{user.user_type}</TableCell>
                  <TableCell>
                    <KycStatusBadge status={user.kyc_status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                     <Dialog open={!!editingUser && editingUser.user_id === user.user_id} onOpenChange={() => setEditingUser(null)}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DeleteUserDialog userId={user.user_id} userName={user.business_name} onUserDeleted={handleUserDeleted}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DeleteUserDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                       <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        {editingUser && <EditUserForm user={editingUser} onUserUpdated={handleUserUpdated} />}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

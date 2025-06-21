"use client";

import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { users as mockUsers } from '@/lib/data';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CreateUserForm = () => {
  const { toast } = useToast();
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      toast({ title: "Success!", description: "User created." });
    }}>
      <div className="grid gap-4 py-4">
        <p className="text-sm text-muted-foreground">User creation form fields (e.g., name, email, role) would be here.</p>
      </div>
       <DialogFooter>
          <Button type="submit">Create User</Button>
        </DialogFooter>
    </form>
  )
}

export default function UsersPage() {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

  return (
    <div className="flex-1 space-y-4">
      <Header title="Users" />
      <main className="p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Users</CardTitle>
              <CardDescription>Manage users on the platform.</CardDescription>
            </div>
             <Dialog>
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
                <CreateUserForm />
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
                {mockUsers.map((user) => (
                  <TableRow key={user.user_id}>
                     <TableCell className="hidden sm:table-cell">
                        <Avatar>
                          <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.business_name} />
                          <AvatarFallback>{getInitials(user.business_name)}</AvatarFallback>
                        </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.business_name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                    </TableCell>
                    <TableCell>{user.user_type}</TableCell>
                    <TableCell>
                      <Badge variant={user.kyc_status === 'verified' ? 'secondary' : 'destructive'} className={user.kyc_status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {user.kyc_status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(user.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

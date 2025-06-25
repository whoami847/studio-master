
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserCog, UserX, Trash2, KeyRound, Wallet } from 'lucide-react';
import { EditUserCredentialsDialog } from '@/components/admin/EditUserCredentialsDialog';
import { EditUserBalanceDialog } from '@/components/admin/EditUserBalanceDialog';

export default function AdminUsersPage() {
  const { user: currentUser, allUsers, deleteUser, updateUserRole } = useAuth();

  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-6">User Management</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all registered users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden sm:table-cell">Role</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <Avatar className="hidden h-9 w-9 sm:flex">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.joined}</TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          
                           <EditUserBalanceDialog user={user}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Wallet className="mr-2 h-4 w-4" />
                                <span>Adjust Balance</span>
                              </DropdownMenuItem>
                           </EditUserBalanceDialog>

                           {currentUser?.uid !== user.id && (
                             <EditUserCredentialsDialog user={user}>
                               <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <KeyRound className="mr-2 h-4 w-4" />
                                  <span>Change Credentials</span>
                                </DropdownMenuItem>
                             </EditUserCredentialsDialog>
                           )}
                          {currentUser?.uid !== user.id && user.role !== 'admin' && (
                            <DropdownMenuItem onClick={() => updateUserRole(user.id, 'admin')}>
                              <UserCog className="mr-2 h-4 w-4" />
                              <span>Make Admin</span>
                            </DropdownMenuItem>
                          )}
                          {currentUser?.uid !== user.id && user.role === 'admin' && (
                             <DropdownMenuItem onClick={() => updateUserRole(user.id, 'user')}>
                              <UserX className="mr-2 h-4 w-4" />
                              <span>Demote to User</span>
                            </DropdownMenuItem>
                          )}
                          {(currentUser?.uid !== user.id) && <DropdownMenuSeparator />}
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => deleteUser(user.email)}
                            disabled={currentUser?.uid === user.id}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

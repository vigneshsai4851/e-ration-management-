
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AdminSidebar } from '@/components/sidebars/AdminSidebar';
import { useUserStore, useAssignmentStore } from '@/store';
import { formatDate } from '@/lib/utils';
import { Users, User, Store, UserX, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const ViewUsers = () => {
  const { users, updateUser, deleteUser } = useUserStore();
  const { assignments } = useAssignmentStore();
  
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    city: '',
    contactNumber: '',
  });
  
  const shopkeepers = users.filter(user => user.role === 'shopkeeper');
  const customers = users.filter(user => user.role === 'customer');
  
  const handleViewUserDetails = (user: any) => {
    setSelectedUser(user);
    setIsUserDetailsOpen(true);
  };
  
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      city: user.city || '',
      contactNumber: user.contactNumber || '',
    });
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully"
      });
    }
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      updateUser(selectedUser.id, {
        name: editForm.name,
        email: editForm.email,
        city: editForm.city,
        contactNumber: editForm.contactNumber,
      });
      
      toast({
        title: "Success",
        description: "User updated successfully"
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };
  
  // Get assignments for a specific user
  const getUserAssignments = (userId: string) => {
    return assignments.filter(a => a.userId === userId);
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">View Users</h2>
          <p className="text-muted-foreground">
            Manage all users in the system
          </p>
        </div>
        
        <Tabs defaultValue="shopkeepers">
          <TabsList className="mb-4">
            <TabsTrigger value="shopkeepers" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Shopkeepers
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Customers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shopkeepers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">Shopkeepers</CardTitle>
                <Store className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">S.No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Contact Number</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shopkeepers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No shopkeepers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      shopkeepers.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.city || 'N/A'}</TableCell>
                          <TableCell>{user.contactNumber || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewUserDetails(user)}
                              >
                                View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <UserX className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">Customers</CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">S.No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Smart Card</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No customers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      customers.map((user, index) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.smartCardNumber || 'N/A'}</TableCell>
                          <TableCell>{user.city || 'N/A'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewUserDetails(user)}
                              >
                                View
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <UserX className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* User Details Dialog */}
        <Dialog open={isUserDetailsOpen} onOpenChange={setIsUserDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      <Badge variant="outline" className="capitalize">
                        {selectedUser.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">City</p>
                    <p className="text-sm">{selectedUser.city || 'Not specified'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Contact Number</p>
                    <p className="text-sm">{selectedUser.contactNumber || 'Not specified'}</p>
                  </div>
                  
                  {selectedUser.role === 'shopkeeper' && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Aadhar Number</p>
                      <p className="text-sm">{selectedUser.aadharNumber || 'Not specified'}</p>
                    </div>
                  )}
                  
                  {selectedUser.role === 'customer' && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Smart Card Number</p>
                      <p className="text-sm">{selectedUser.smartCardNumber || 'Not specified'}</p>
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Registered On</p>
                    <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-md font-medium">Product History</h4>
                  
                  {getUserAssignments(selectedUser.id).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No product assignments found.</p>
                  ) : (
                    <div className="max-h-[200px] overflow-auto border rounded-md">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getUserAssignments(selectedUser.id).map((assignment) => (
                            <TableRow key={assignment.id}>
                              <TableCell>{assignment.productName}</TableCell>
                              <TableCell>{assignment.quantity}</TableCell>
                              <TableCell>{formatDate(assignment.createdAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Enter name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    placeholder="Enter email"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={editForm.city}
                    onChange={handleEditChange}
                    placeholder="Enter city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={editForm.contactNumber}
                    onChange={handleEditChange}
                    placeholder="Enter contact number"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ViewUsers;

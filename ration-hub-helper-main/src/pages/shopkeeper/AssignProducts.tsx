
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ShopkeeperSidebar } from '@/components/sidebars/ShopkeeperSidebar';
import { useProductStore, useUserStore, useAssignmentStore, useAuthStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { UserCheck, Search } from 'lucide-react';

const AssignProducts = () => {
  const { products } = useProductStore();
  const { users } = useUserStore();
  const { addAssignment } = useAssignmentStore();
  const { currentUser } = useAuthStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  
  // Filter customers based on search query (mobile number)
  const filteredCustomers = users.filter(user => 
    user.role === 'customer' && 
    user.contactNumber?.includes(searchQuery)
  );
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  
  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setIsUserDialogOpen(false);
  };
  
  const handleAssignProduct = (product: any) => {
    setSelectedProduct(product);
    setQuantity('1');
    setIsAssignDialogOpen(true);
  };
  
  const handleAssignSubmit = () => {
    if (!selectedUser || !selectedProduct || !currentUser) return;
    
    try {
      const assignmentData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        userId: selectedUser.id,
        userName: selectedUser.name,
        assignedBy: currentUser.id,
        assignedByName: currentUser.name,
        quantity: parseInt(quantity)
      };
      
      addAssignment(assignmentData);
      
      toast({
        title: "Success",
        description: `Successfully assigned ${quantity} units of ${selectedProduct.name} to ${selectedUser.name}`
      });
      
      setIsAssignDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign product",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout sidebar={<ShopkeeperSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assign Products</h2>
          <p className="text-muted-foreground">
            Assign products to customers in your shop
          </p>
        </div>
        
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Search Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="mobileNumber">Customer Mobile Number</Label>
                <div className="flex space-x-2 mt-1.5">
                  <Input
                    id="mobileNumber"
                    placeholder="Enter mobile number"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <Button onClick={() => setIsUserDialogOpen(true)} disabled={!searchQuery}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
            
            {selectedUser && (
              <div className="p-3 border rounded-md flex justify-between items-center">
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.contactNumber}</p>
                </div>
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">S.No</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>MRP</TableHead>
                  <TableHead>Available Quantity</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No products available.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{formatCurrency(product.mrp)}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          onClick={() => handleAssignProduct(product)}
                          disabled={!selectedUser || product.quantity <= 0}
                        >
                          Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Customer Search Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Customer</DialogTitle>
            </DialogHeader>
            
            {filteredCustomers.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-muted-foreground">No customers found with this mobile number.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-auto">
                {filteredCustomers.map((user) => (
                  <div 
                    key={user.id}
                    className="p-3 border rounded-md flex justify-between items-center cursor-pointer hover:bg-accent"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.contactNumber}</p>
                    </div>
                    <Button size="sm" variant="ghost">Select</Button>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Assign Product Dialog */}
        <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Product</DialogTitle>
            </DialogHeader>
            
            {selectedProduct && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{selectedProduct.name}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Available Quantity</p>
                  <p className="font-medium">{selectedProduct.quantity} units</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignQuantity">Quantity to Assign</Label>
                  <Input
                    id="assignQuantity"
                    type="number"
                    min="1"
                    max={selectedProduct.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleAssignSubmit}
                    disabled={
                      parseInt(quantity) <= 0 || 
                      parseInt(quantity) > selectedProduct.quantity
                    }
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AssignProducts;

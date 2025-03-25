import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AdminSidebar } from '@/components/sidebars/AdminSidebar';
import { useProductStore, useUserStore, useAssignmentStore, useAuthStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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

const AssignProducts = () => {
  const { products } = useProductStore();
  const { users } = useUserStore();
  const { addAssignment } = useAssignmentStore();
  const { currentUser } = useAuthStore();
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState('1');
  
  // Get all shopkeepers
  const shopkeepers = users.filter(user => user.role === 'shopkeeper');
  
  const handleAssignProduct = (product: any) => {
    setSelectedProduct(product);
    setQuantity('1');
    setIsAssignDialogOpen(true);
  };
  
  const handleAssignSubmit = () => {
    if (!selectedUserId || !selectedProduct || !currentUser) return;
    
    try {
      const shopkeeper = users.find(user => user.id === selectedUserId);
      if (!shopkeeper) return;
      
      const assignmentData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        userId: shopkeeper.id,
        userName: shopkeeper.name,
        assignedBy: currentUser.id,
        assignedByName: currentUser.name,
        quantity: parseInt(quantity)
      };
      
      addAssignment(assignmentData);
      
      toast({
        title: "Success",
        description: `Successfully assigned ${quantity} units of ${selectedProduct.name} to ${shopkeeper.name}`
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
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assign Products</h2>
          <p className="text-muted-foreground">
            Assign products to shopkeepers
          </p>
        </div>
        
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Select Shopkeeper</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopkeeper">Shopkeeper</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a shopkeeper" />
                </SelectTrigger>
                <SelectContent>
                  {shopkeepers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No shopkeepers available
                    </SelectItem>
                  ) : (
                    shopkeepers.map((shopkeeper) => (
                      <SelectItem key={shopkeeper.id} value={shopkeeper.id}>
                        {shopkeeper.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
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
                  <TableHead className="w-[80px]">S.No</TableHead>
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
                          disabled={!selectedUserId || product.quantity <= 0}
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

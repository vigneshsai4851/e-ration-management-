
import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CustomerSidebar } from '@/components/sidebars/CustomerSidebar';
import { useProductStore, useAssignmentStore, useAuthStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const BuyProducts = () => {
  const { currentUser } = useAuthStore();
  const { products } = useProductStore();
  const { addAssignment } = useAssignmentStore();

  const handleBuyProduct = (product: any) => {
    if (!currentUser) return;
    
    try {
      // In a real application, we would have a quantity selector
      // For now, just hardcode to buying 1 unit
      const quantity = 1;
      
      addAssignment({
        productId: product.id,
        productName: product.name,
        userId: currentUser.id,
        userName: currentUser.name,
        assignedBy: '2', // Assuming shop user with ID 2
        assignedByName: 'Shop User',
        quantity: quantity
      });
      
      toast({
        title: "Success",
        description: `Successfully purchased ${quantity} ${product.unit} of ${product.name}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to purchase product",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout sidebar={<CustomerSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Buy Products</h2>
          <p className="text-muted-foreground">
            Browse and purchase available ration products
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.length === 0 ? (
            <div className="col-span-3 flex justify-center py-8">
              <p className="text-muted-foreground">No products available at the moment.</p>
            </div>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="hover-lift">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">{formatCurrency(product.mrp)}/{product.unit}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Available</p>
                      <p className="font-medium">{product.quantity} {product.unit}</p>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={() => handleBuyProduct(product)}
                    disabled={product.quantity <= 0}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BuyProducts;

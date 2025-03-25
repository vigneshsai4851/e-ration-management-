
import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CustomerSidebar } from '@/components/sidebars/CustomerSidebar';
import { useAuthStore, useAssignmentStore, useProductStore } from '@/store';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ShoppingBag, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PurchaseHistory = () => {
  const { currentUser } = useAuthStore();
  const { assignments } = useAssignmentStore();
  const { products } = useProductStore();
  
  // Filter assignments for this customer
  const myPurchases = currentUser 
    ? assignments.filter(a => a.userId === currentUser.id)
    : [];
  
  // Sort by date, newest first
  const sortedPurchases = [...myPurchases].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <DashboardLayout sidebar={<CustomerSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Purchase History</h2>
          <p className="text-muted-foreground">
            View your past ration product purchases
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedPurchases.length === 0 ? (
              <div className="text-center py-6">
                <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <h3 className="text-lg font-medium">No purchases yet</h3>
                <p className="text-sm text-muted-foreground">
                  You haven't purchased any products yet
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedPurchases.map((purchase) => {
                  const product = products.find(p => p.id === purchase.productId);
                  const totalPrice = product ? product.mrp * purchase.quantity : 0;
                  
                  return (
                    <div key={purchase.id} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <ShoppingBag className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{purchase.productName}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Purchased from: {purchase.assignedByName}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {formatDate(purchase.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col justify-between md:items-end gap-2">
                        <div className="text-sm text-muted-foreground">Quantity</div>
                        <div className="font-medium">{purchase.quantity} units</div>
                      </div>
                      
                      <div className="flex md:flex-col justify-between md:items-end gap-2">
                        <div className="text-sm text-muted-foreground">Price</div>
                        <div className="font-medium">{formatCurrency(totalPrice)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PurchaseHistory;

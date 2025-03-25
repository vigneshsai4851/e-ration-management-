
import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { CustomerSidebar } from '@/components/sidebars/CustomerSidebar';
import { useAuthStore, useAssignmentStore, useProductStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Receipt, 
  ArrowUpRight,
  CalendarDays,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '@/lib/utils';

const CustomerDashboard = () => {
  const { currentUser } = useAuthStore();
  const { assignments } = useAssignmentStore();
  const { products } = useProductStore();
  
  // Filter assignments for this customer
  const myAssignments = assignments.filter(a => a.userId === currentUser?.id);
  
  // Calculate total purchased quantity and amount
  const totalPurchased = myAssignments.reduce((total, a) => total + a.quantity, 0);
  
  // Get recent purchases (last 3)
  const recentPurchases = [...myAssignments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Calculate total amount spent
  const totalSpent = myAssignments.reduce((total, assignment) => {
    const product = products.find(p => p.id === assignment.productId);
    return total + (product ? product.mrp * assignment.quantity : 0);
  }, 0);

  return (
    <DashboardLayout sidebar={<CustomerSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="md:col-span-2 hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Hello, {currentUser?.name}</CardTitle>
                <CardDescription>
                  Here's a summary of your ration card and purchases
                </CardDescription>
              </div>
              <User className="h-8 w-8 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                <div className="rounded-md p-2 bg-primary/10 flex flex-col">
                  <span className="text-xs text-muted-foreground">Smart Card Number</span>
                  <span className="font-medium">{currentUser?.smartCardNumber || 'N/A'}</span>
                </div>
                <div className="rounded-md p-2 bg-primary/10 flex flex-col">
                  <span className="text-xs text-muted-foreground">Location</span>
                  <span className="font-medium">{currentUser?.city || 'N/A'}</span>
                </div>
                <div className="rounded-md p-2 bg-primary/10 flex flex-col">
                  <span className="text-xs text-muted-foreground">Contact</span>
                  <span className="font-medium">{currentUser?.contactNumber || 'N/A'}</span>
                </div>
                <div className="rounded-md p-2 bg-primary/10 flex flex-col">
                  <span className="text-xs text-muted-foreground">Registered On</span>
                  <span className="font-medium">{formatDate(currentUser?.createdAt || '')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPurchased} items</div>
              <p className="text-xs text-muted-foreground">
                Total products purchased
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
              <p className="text-xs text-muted-foreground">
                Total amount spent
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="hover-lift">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Purchases</CardTitle>
                {recentPurchases.length > 0 && (
                  <Link to="/customer/purchase-history">
                    <Button variant="ghost" size="sm" className="gap-1">
                      View all
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {recentPurchases.length === 0 ? (
                <div className="text-center py-6">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <h3 className="text-lg font-medium">No purchases yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You haven't purchased any products yet
                  </p>
                  <Link to="/customer/buy-products">
                    <Button>Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentPurchases.map((purchase) => {
                    const product = products.find(p => p.id === purchase.productId);
                    const totalPrice = product ? product.mrp * purchase.quantity : 0;
                    
                    return (
                      <div key={purchase.id} className="flex items-center space-x-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {purchase.productName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {purchase.quantity} units × {formatCurrency(product?.mrp || 0)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(totalPrice)}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="mr-1 h-3 w-3" />
                            {formatDate(purchase.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;

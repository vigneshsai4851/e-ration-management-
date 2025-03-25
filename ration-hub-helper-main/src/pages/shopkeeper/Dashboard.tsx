import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ShopkeeperSidebar } from '@/components/sidebars/ShopkeeperSidebar';
import { useProductStore, useAssignmentStore, useAuthStore } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { 
  Package, 
  ShoppingBag, 
  Users,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ShopkeeperDashboard = () => {
  const { currentUser } = useAuthStore();
  const { products } = useProductStore();
  const { assignments } = useAssignmentStore();

  // Filter assignments where this shopkeeper is the assignee
  const myAssignments = assignments.filter(a => a.assignedBy === currentUser?.id);
  
  // Calculate total assigned products
  const totalAssignedQuantity = myAssignments.reduce((total, a) => total + a.quantity, 0);
  
  // Filter unique customers who have received assignments from this shopkeeper
  const uniqueCustomerIds = new Set(myAssignments.map(a => a.userId));
  const totalCustomers = uniqueCustomerIds.size;
  
  // Get recent assignments (last 5)
  const recentAssignments = [...myAssignments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout sidebar={<ShopkeeperSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.name}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Products available
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAssignedQuantity}</div>
              <p className="text-xs text-muted-foreground">
                Products assigned to customers
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Customers served
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1 hover-lift">
            <CardHeader>
              <CardTitle>Recent Customer Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAssignments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                ) : (
                  recentAssignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center space-x-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {assignment.userName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Purchased {assignment.quantity} units of {assignment.productName}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(assignment.createdAt)}
                      </div>
                    </div>
                  ))
                )}
                
                {recentAssignments.length > 0 && (
                  <div className="pt-2">
                    <Link to="/shopkeeper/shop-users">
                      <Button variant="link" className="p-0 h-auto text-sm">
                        View all customer activity
                        <ArrowUpRight className="ml-1 h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 hover-lift">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Link to="/shopkeeper/assigned-products">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    View Assigned Products
                  </Button>
                </Link>
                <Link to="/shopkeeper/assign-products">
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Assign Products to Users
                  </Button>
                </Link>
                <Link to="/shopkeeper/shop-users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    View My Shop Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShopkeeperDashboard;

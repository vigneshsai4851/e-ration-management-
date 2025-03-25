import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ShopkeeperSidebar } from '@/components/sidebars/ShopkeeperSidebar';
import { useAuthStore, useUserStore, useAssignmentStore } from '@/store';
import { formatDate } from '@/lib/utils';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const ShopUsers = () => {
  const { currentUser } = useAuthStore();
  const { users } = useUserStore();
  const { assignments } = useAssignmentStore();
  
  // Get all customers
  const customers = users.filter(user => user.role === 'customer');
  
  // Get assignments made by this shopkeeper
  const shopkeeperAssignments = currentUser 
    ? assignments.filter(a => a.assignedBy === currentUser.id)
    : [];
  
  // Get unique customer IDs who have received assignments from this shopkeeper
  const assignedCustomerIds = new Set(shopkeeperAssignments.map(a => a.userId));
  
  // Filter customers who have received assignments from this shopkeeper
  const shopCustomers = customers.filter(customer => 
    assignedCustomerIds.has(customer.id)
  );

  return (
    <DashboardLayout sidebar={<ShopkeeperSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Shop Users</h2>
          <p className="text-muted-foreground">
            View all customers assigned to your shop
          </p>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">Shop Customers</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">S.No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile Number</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Smart Card</TableHead>
                  <TableHead>Last Purchase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shopCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No customers have made purchases from your shop yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  shopCustomers.map((customer, index) => {
                    // Get the most recent assignment for this customer
                    const customerAssignments = shopkeeperAssignments.filter(
                      a => a.userId === customer.id
                    );
                    const latestAssignment = customerAssignments.length > 0
                      ? customerAssignments.sort(
                          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )[0]
                      : null;
                      
                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.contactNumber || 'N/A'}</TableCell>
                        <TableCell>{customer.city || 'N/A'}</TableCell>
                        <TableCell>{customer.smartCardNumber || 'N/A'}</TableCell>
                        <TableCell>
                          {latestAssignment 
                            ? formatDate(latestAssignment.createdAt)
                            : 'Never'
                          }
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ShopUsers;

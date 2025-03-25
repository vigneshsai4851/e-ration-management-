import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ShopkeeperSidebar } from '@/components/sidebars/ShopkeeperSidebar';
import { useProductStore, useAuthStore, useAssignmentStore } from '@/store';
import { formatCurrency } from '@/lib/utils';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AssignedProducts = () => {
  const { products } = useProductStore();
  const { currentUser } = useAuthStore();
  const { assignments } = useAssignmentStore();
  
  // Get all assignments made by the admin to this shopkeeper
  // In a real app, we would filter by assignedTo (shopkeeper ID)
  // Since we don't have that field, we'll just show all products

  return (
    <DashboardLayout sidebar={<ShopkeeperSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assigned Products</h2>
          <p className="text-muted-foreground">
            View all products assigned to your shop
          </p>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">Product Inventory</CardTitle>
            <Package className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">S.No</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>MRP</TableHead>
                  <TableHead className="text-right">Available Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No products assigned to your shop yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product, index) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{formatCurrency(product.mrp)}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AssignedProducts;

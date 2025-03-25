import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AdminSidebar } from '@/components/sidebars/AdminSidebar';
import { useProductStore, useUserStore, useAssignmentStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { 
  Package, 
  Users, 
  Store, 
  History,
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { users } = useUserStore();
  const { assignments } = useAssignmentStore();
  const [isAddProductOpen, setIsAddProductOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [productForm, setProductForm] = React.useState({
    name: '',
    mrp: '',
    quantity: '',
    unit: 'kg',
  });

  const shopkeepers = users.filter(user => user.role === 'shopkeeper');
  const customers = users.filter(user => user.role === 'customer');

  const openAddProductDialog = () => {
    setSelectedProduct(null);
    setProductForm({
      name: '',
      mrp: '',
      quantity: '',
      unit: 'kg',
    });
    setIsAddProductOpen(true);
  };

  const openEditProductDialog = (product: any) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      mrp: product.mrp.toString(),
      quantity: product.quantity.toString(),
      unit: product.unit || 'kg',
    });
    setIsAddProductOpen(true);
  };

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUnitChange = (value: string) => {
    setProductForm(prev => ({ ...prev, unit: value }));
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: productForm.name,
        mrp: parseFloat(productForm.mrp),
        quantity: parseInt(productForm.quantity),
        unit: productForm.unit,
        image: ''
      };
      
      if (selectedProduct) {
        updateProduct(selectedProduct.id, productData);
        toast({ title: "Success", description: "Product updated successfully" });
      } else {
        addProduct(productData);
        toast({ title: "Success", description: "Product added successfully" });
      }
      
      setIsAddProductOpen(false);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to save product", 
        variant: "destructive" 
      });
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      toast({ title: "Success", description: "Product deleted successfully" });
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your E-Ration management system
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">
                Products in inventory
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Shopkeepers</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{shopkeepers.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered shopkeepers
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignments.length}</div>
              <p className="text-xs text-muted-foreground">
                Product assignments
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Products</h3>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddProductDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={productForm.name}
                      onChange={handleProductFormChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mrp">MRP (₹)</Label>
                      <Input
                        id="mrp"
                        name="mrp"
                        type="number"
                        step="0.01"
                        min="0"
                        value={productForm.mrp}
                        onChange={handleProductFormChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        value={productForm.quantity}
                        onChange={handleProductFormChange}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select 
                      value={productForm.unit} 
                      onValueChange={handleUnitChange}
                    >
                      <SelectTrigger id="unit">
                        <SelectValue placeholder="Select Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilogram (kg)</SelectItem>
                        <SelectItem value="g">Gram (g)</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                        <SelectItem value="ml">Milliliter (ml)</SelectItem>
                        <SelectItem value="packet">Packet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {selectedProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">S.No</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>MRP</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No products available. Add your first product.
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{formatCurrency(product.mrp)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.unit}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditProductDialog(product)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

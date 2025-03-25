import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AdminSidebar } from '@/components/sidebars/AdminSidebar';
import { useUserStore } from '@/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';

const CreateShopUser = () => {
  const { addUser } = useUserStore();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    contactNumber: '',
    aadharNumber: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!formData.name || !formData.email || !formData.password || !formData.aadharNumber) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      // Create new shopkeeper user with password
      const newShopkeeper = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'shopkeeper' as const,
        city: formData.city,
        contactNumber: formData.contactNumber,
        aadharNumber: formData.aadharNumber
      };
      
      console.log('Creating new shopkeeper:', newShopkeeper);
      
      addUser(newShopkeeper);
      
      toast({
        title: "Success",
        description: "Shopkeeper account created successfully"
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        city: '',
        contactNumber: '',
        aadharNumber: ''
      });
    } catch (error) {
      console.error('Error creating shopkeeper:', error);
      toast({
        title: "Error",
        description: "Failed to create shopkeeper account",
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Shop User</h2>
          <p className="text-muted-foreground">
            Add a new shopkeeper to the system
          </p>
        </div>
        
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Shop User Details</CardTitle>
            <CardDescription>
              Enter the details of the new shopkeeper
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name*</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input
                    id="contactNumber"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="aadharNumber">Aadhar Number*</Label>
                <Input
                  id="aadharNumber"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength={12}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Shop User
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateShopUser;

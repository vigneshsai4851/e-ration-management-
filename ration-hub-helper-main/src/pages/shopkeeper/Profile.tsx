
import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { ShopkeeperSidebar } from '@/components/sidebars/ShopkeeperSidebar';
import { useAuthStore } from '@/store';
import { User, CalendarDays, MapPin, Phone, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

const Profile = () => {
  const { currentUser } = useAuthStore();
  
  return (
    <DashboardLayout sidebar={<ShopkeeperSidebar />}>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
          <p className="text-muted-foreground">
            View and manage your shop information
          </p>
        </div>
        
        <Card className="max-w-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentUser?.name}</CardTitle>
                <CardDescription>{currentUser?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CreditCard className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Aadhar Number</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.aadharNumber || 'Not Available'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">City</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.city || 'Not Available'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Contact Number</p>
                  <p className="text-sm text-muted-foreground">
                    {currentUser?.contactNumber || 'Not Available'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <CalendarDays className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Registered On</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(currentUser?.createdAt || '')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;

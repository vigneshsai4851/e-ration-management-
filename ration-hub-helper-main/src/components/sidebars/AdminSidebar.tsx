
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  History, 
  UserPlus, 
  User, 
  LogOut 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin',
    },
    {
      icon: UserPlus,
      label: 'Create Shop User',
      path: '/admin/create-shop-user',
    },
    {
      icon: ShoppingBag,
      label: 'Assign Products',
      path: '/admin/assign-products',
    },
    {
      icon: History,
      label: 'Assign History',
      path: '/admin/assign-history',
    },
    {
      icon: Users,
      label: 'View Users',
      path: '/admin/view-users',
    },
    {
      icon: User,
      label: 'My Profile',
      path: '/admin/profile',
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <div className="flex items-center space-x-2 px-6">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">E-Ration Admin</h1>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                asChild
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <Button 
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="px-6 py-4">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AdminSidebar;

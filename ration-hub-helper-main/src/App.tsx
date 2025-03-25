import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store";

// Auth pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import CreateShopUser from "./pages/admin/CreateShopUser";
import AdminAssignProducts from "./pages/admin/AssignProducts";
import AssignHistory from "./pages/admin/AssignHistory";
import ViewUsers from "./pages/admin/ViewUsers";
import AdminProfile from "./pages/admin/Profile";

// Shopkeeper pages
import ShopkeeperDashboard from "./pages/shopkeeper/Dashboard";
import AssignedProducts from "./pages/shopkeeper/AssignedProducts";
import ShopkeeperAssignProducts from "./pages/shopkeeper/AssignProducts";
import ShopUsers from "./pages/shopkeeper/ShopUsers";
import ShopkeeperProfile from "./pages/shopkeeper/Profile";

// Customer pages
import CustomerDashboard from "./pages/customer/Dashboard";
import BuyProducts from "./pages/customer/BuyProducts";
import PurchaseHistory from "./pages/customer/PurchaseHistory";
import CustomerProfile from "./pages/customer/Profile";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/create-shop-user" 
              element={<ProtectedRoute role="admin"><CreateShopUser /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/assign-products" 
              element={<ProtectedRoute role="admin"><AdminAssignProducts /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/assign-history" 
              element={<ProtectedRoute role="admin"><AssignHistory /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/view-users" 
              element={<ProtectedRoute role="admin"><ViewUsers /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/profile" 
              element={<ProtectedRoute role="admin"><AdminProfile /></ProtectedRoute>} 
            />

            {/* Shopkeeper routes */}
            <Route 
              path="/shopkeeper" 
              element={<ProtectedRoute role="shopkeeper"><ShopkeeperDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/shopkeeper/assigned-products" 
              element={<ProtectedRoute role="shopkeeper"><AssignedProducts /></ProtectedRoute>} 
            />
            <Route 
              path="/shopkeeper/assign-products" 
              element={<ProtectedRoute role="shopkeeper"><ShopkeeperAssignProducts /></ProtectedRoute>} 
            />
            <Route 
              path="/shopkeeper/shop-users" 
              element={<ProtectedRoute role="shopkeeper"><ShopUsers /></ProtectedRoute>} 
            />
            <Route 
              path="/shopkeeper/profile" 
              element={<ProtectedRoute role="shopkeeper"><ShopkeeperProfile /></ProtectedRoute>} 
            />

            {/* Customer routes */}
            <Route 
              path="/customer" 
              element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/customer/buy-products" 
              element={<ProtectedRoute role="customer"><BuyProducts /></ProtectedRoute>} 
            />
            <Route 
              path="/customer/purchase-history" 
              element={<ProtectedRoute role="customer"><PurchaseHistory /></ProtectedRoute>} 
            />
            <Route 
              path="/customer/profile" 
              element={<ProtectedRoute role="customer"><CustomerProfile /></ProtectedRoute>} 
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Create a protected route component to handle authentication and role checking
interface ProtectedRouteProps {
  children: React.ReactNode;
  role: 'admin' | 'shopkeeper' | 'customer';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const { isAuthenticated, currentUser } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (currentUser?.role !== role) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

export default App;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Log the credentials for debugging
      console.log('Attempting login with:', { email, password, role });
      
      const success = await login(email, password, role);
      
      if (success) {
        toast({
          title: 'Login Successful',
          description: `Welcome back! You've been logged in as ${role}.`,
          variant: 'default',
        });
        
        // Redirect based on role
        switch (role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'shopkeeper':
            navigate('/shopkeeper');
            break;
          case 'customer':
            navigate('/customer');
            break;
        }
      } else {
        setError('Invalid email or password. Please try again.');
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Default credentials for demo
  const setDefaultCredentials = (selectedRole: UserRole) => {
    switch (selectedRole) {
      case 'admin':
        setEmail('admin@example.com');
        setPassword('password');
        break;
      case 'shopkeeper':
        setEmail('shop@example.com');
        setPassword('password');
        break;
      case 'customer':
        setEmail('customer@example.com');
        setPassword('password');
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <h2 className="mt-4 text-3xl font-bold">E-Ration System</h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        <Tabs defaultValue="customer" onValueChange={(value) => {
          setRole(value as UserRole);
          setDefaultCredentials(value as UserRole);
        }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="shopkeeper">Shopkeeper</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-destructive/10 text-destructive flex items-center text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 border-t pt-6">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Register here
                </Link>
              </div>
            </CardFooter>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;

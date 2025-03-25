
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Users, Store, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 fixed w-full z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">E-Ration</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm text-gray-700 hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="animate-fade-in space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                  Streamlined E-Ration Management System
                </h1>
                <p className="text-lg text-gray-600">
                  A modern solution for the efficient distribution and management of ration supplies, connecting shopkeepers, users, and administrators.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 mt-10 md:mt-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-lg blur-lg opacity-30"></div>
                <div className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <FeatureCard
                      icon={Users}
                      title="User Management"
                      description="Comprehensive user registration and management system"
                    />
                    <FeatureCard
                      icon={Store}
                      title="Inventory Control"
                      description="Track and manage ration stock with ease"
                    />
                    <FeatureCard
                      icon={ShoppingBag}
                      title="Product Distribution"
                      description="Efficient assignment and distribution of products"
                    />
                    <FeatureCard
                      icon={ShieldCheck}
                      title="Secure System"
                      description="Role-based access control for data security"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our E-Ration Management System streamlines the entire process from administration to distribution
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard
              title="Admin"
              description="Manage products, shopkeepers, and oversee the entire distribution system"
              features={[
                "Product management",
                "Shopkeeper registration",
                "Product assignment",
                "User management",
                "System oversight"
              ]}
              ctaLink="/login?role=admin"
              ctaText="Admin Login"
              className="bg-gradient-to-br from-blue-50 to-indigo-50"
            />
            
            <RoleCard
              title="Shopkeeper"
              description="Receive products from admin and distribute them to registered users"
              features={[
                "View assigned products",
                "Manage shop inventory",
                "Assign products to users",
                "Track user purchases",
                "Report management"
              ]}
              ctaLink="/login?role=shopkeeper"
              ctaText="Shopkeeper Login"
              className="bg-gradient-to-br from-emerald-50 to-teal-50"
            />
            
            <RoleCard
              title="Customer"
              description="Register and purchase assigned ration products from designated shops"
              features={[
                "User registration",
                "View product availability",
                "Purchase products",
                "Track purchase history",
                "Profile management"
              ]}
              ctaLink="/login?role=customer"
              ctaText="Customer Login"
              className="bg-gradient-to-br from-amber-50 to-yellow-50"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">E-Ration</span>
            </div>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} E-Ration Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center text-center p-4 hover-scale transition-all">
      <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

const RoleCard = ({ 
  title, 
  description, 
  features, 
  ctaLink, 
  ctaText,
  className
}: { 
  title: string; 
  description: string; 
  features: string[]; 
  ctaLink: string; 
  ctaText: string;
  className?: string;
}) => {
  return (
    <div className={cn(
      "rounded-xl p-1", 
      className
    )}>
      <div className="h-full bg-white rounded-lg border border-gray-100 shadow-sm p-6 flex flex-col hover-lift transition-all">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <ul className="space-y-2 mb-8 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <ChevronRight className="h-3 w-3 text-green-600" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
        <Link to={ctaLink}>
          <Button variant="outline" className="w-full">
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

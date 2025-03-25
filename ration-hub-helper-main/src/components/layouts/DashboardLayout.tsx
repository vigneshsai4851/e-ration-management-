
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { SidebarProvider } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  sidebar,
  className 
}) => {
  return (
    <SidebarProvider>
      <div className={cn('min-h-screen flex w-full bg-background', className)}>
        {sidebar}
        <main className="flex-1 overflow-y-auto transition-all duration-300 ease-in-out">
          <div className="container py-6 md:py-8 px-4 md:px-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;

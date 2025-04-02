
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen flex w-full overflow-x-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "z-30 fixed top-0 left-0 h-full md:relative",
              isMobile ? "w-[280px]" : "w-[280px]"
            )}
          >
            <Sidebar />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Backdrop for mobile */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 w-full transition-all duration-300 ease-in-out">
        {/* Navbar */}
        <div className="sticky top-0 z-10 bg-background/70 backdrop-blur-md border-b border-border h-16 flex items-center px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="mr-4"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold truncate">Canki Vet Clinic</h1>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
        
        {/* Page content with responsive padding */}
        <main className="p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>
      
      <Toaster />
      <Sonner />
    </div>
  );
};
